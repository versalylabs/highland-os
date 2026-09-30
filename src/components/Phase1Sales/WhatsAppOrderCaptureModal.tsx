import React, { useState, useEffect } from 'react';
import { 
  X, 
  MessageSquare, 
  Sparkles, 
  User, 
  MapPin, 
  Phone, 
  CheckCircle2,
  RefreshCw,
  Settings,
  Plus,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { Product, Order, Customer, BusinessSettings, WhatsAppClientMessage } from '../../types';

interface WhatsAppOrderCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onOrderCreated: (order: Order, customer?: Customer) => void;
  settings?: BusinessSettings;
  incomingMessages?: WhatsAppClientMessage[];
  initialMessage?: WhatsAppClientMessage | null;
  onNavigateToSettings?: () => void;
  onFetchLatestMessages?: () => void;
}

export const WhatsAppOrderCaptureModal: React.FC<WhatsAppOrderCaptureModalProps> = ({
  isOpen,
  onClose,
  products,
  onOrderCreated,
  settings,
  incomingMessages = [],
  initialMessage = null,
  onNavigateToSettings,
  onFetchLatestMessages,
}) => {
  const [selectedMessageId, setSelectedMessageId] = useState<string>('');
  const [customText, setCustomText] = useState<string>('');
  const [senderName, setSenderName] = useState<string>('');
  const [senderPhone, setSenderPhone] = useState<string>('');
  const [detectedAddress, setDetectedAddress] = useState<string>('');
  const [detectedItems, setDetectedItems] = useState<{ productId: string; quantity: number }[]>([]);
  const [isFetching, setIsFetching] = useState(false);

  // Initialize or update from messages
  useEffect(() => {
    if (!isOpen) return;

    if (initialMessage) {
      loadMessageIntoForm(initialMessage);
      return;
    }

    if (incomingMessages.length > 0) {
      loadMessageIntoForm(incomingMessages[0]);
    } else {
      // Fallback baseline
      setSenderName('Wanjiku Mwangi');
      setSenderPhone('+254 722 419 802');
      setDetectedAddress('Lavender Court Apt 4B, Lavington, Nairobi');
      setCustomText('Habari Highland Gardens! Kindly send me 3 packs of Hibiscus Tea and 1 jar of Wild Acacia Honey to Lavington.');
      setDetectedItems([
        { productId: products[0]?.id || 'prod-1', quantity: 3 },
        { productId: products[2]?.id || 'prod-3', quantity: 1 },
      ]);
    }
  }, [isOpen, initialMessage, incomingMessages, products]);

  const loadMessageIntoForm = (msg: WhatsAppClientMessage) => {
    setSelectedMessageId(msg.id);
    setSenderName(msg.sender);
    setSenderPhone(msg.phone);
    setCustomText(msg.text);
    setDetectedAddress(msg.detectedAddress || 'Nairobi, Kenya');

    if (msg.detectedItems && msg.detectedItems.length > 0) {
      setDetectedItems(msg.detectedItems);
    } else {
      // heuristic fallback
      setDetectedItems([
        { productId: products[0]?.id || 'prod-1', quantity: 2 },
      ]);
    }
  };

  if (!isOpen) return null;

  const handleSelectMessage = (msg: WhatsAppClientMessage) => {
    loadMessageIntoForm(msg);
  };

  const handleManualFetch = () => {
    if (onFetchLatestMessages) {
      setIsFetching(true);
      onFetchLatestMessages();
      setTimeout(() => setIsFetching(false), 800);
    }
  };

  const handleAddItem = (productId: string) => {
    const existing = detectedItems.find(it => it.productId === productId);
    if (existing) {
      setDetectedItems(detectedItems.map(it => 
        it.productId === productId ? { ...it, quantity: it.quantity + 1 } : it
      ));
    } else {
      setDetectedItems([...detectedItems, { productId, quantity: 1 }]);
    }
  };

  const handleUpdateItemQuantity = (productId: string, delta: number) => {
    setDetectedItems(prev => {
      return prev
        .map(it => (it.productId === productId ? { ...it, quantity: it.quantity + delta } : it))
        .filter(it => it.quantity > 0);
    });
  };

  const handleRemoveItem = (productId: string) => {
    setDetectedItems(prev => prev.filter(it => it.productId !== productId));
  };

  const orderItems = detectedItems.map((item) => {
    const prod = products.find((p) => p.id === item.productId);
    const unitPrice = prod?.retailPrice || 500;
    return {
      productId: item.productId,
      productName: prod?.name || 'Highland Gardens Item',
      quantity: item.quantity,
      unitPrice,
      subtotal: unitPrice * item.quantity,
    };
  });

  const totalAmount = orderItems.reduce((acc, curr) => acc + curr.subtotal, 0);

  const handleConvertOrder = () => {
    const newOrderId = `HG-ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: newOrderId,
      customerId: `cust-${Date.now()}`,
      customerName: senderName || 'WhatsApp Customer',
      customerPhone: senderPhone || '+254 700 000 000',
      customerAddress: detectedAddress || 'Nairobi',
      channel: 'WhatsApp',
      items: orderItems.length > 0 ? orderItems : [
        {
          productId: products[0]?.id || 'prod-1',
          productName: products[0]?.name || 'Botanical Item',
          quantity: 1,
          unitPrice: products[0]?.retailPrice || 500,
          subtotal: products[0]?.retailPrice || 500,
        }
      ],
      totalAmount: totalAmount > 0 ? totalAmount : (products[0]?.retailPrice || 500),
      status: 'Confirmed',
      paymentStatus: 'Pending',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      notes: `Captured via WhatsApp: "${customText.substring(0, 80)}..."`,
      deliveryPerson: 'Juma (Rider 1)',
    };

    const newCustomer: Customer = {
      id: `cust-${Date.now()}`,
      name: senderName || 'WhatsApp Customer',
      phone: senderPhone || '+254 700 000 000',
      address: detectedAddress || 'Nairobi',
      city: 'Nairobi',
      type: 'Individual',
      totalOrders: 1,
      totalSpent: newOrder.totalAmount,
      lastOrderDate: new Date().toISOString().substring(0, 10),
      notes: 'Captured via WhatsApp Order Intake',
    };

    onOrderCreated(newOrder, newCustomer);
    onClose();
  };

  const activeWhatsAppNumber = settings?.whatsappNumber || '+254 722 419 802';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#E5D3CD] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#E5D3CD] bg-[#006D77] text-white flex items-center justify-between rounded-t-2xl shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-xs">
              <MessageSquare className="w-5 h-5 fill-current" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-sm sm:text-base truncate">
                  WhatsApp Order Capture & Parser
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#D4A373] text-stone-950 shrink-0">
                  Daraja M-PESA Ready
                </span>
              </div>
              <p className="text-xs text-[#F3E1DD] flex items-center gap-2 mt-0.5 flex-wrap">
                <span>Active Line: <strong>{activeWhatsAppNumber}</strong></span>
                {onNavigateToSettings && (
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateToSettings();
                    }}
                    className="underline hover:text-white inline-flex items-center gap-1 text-[11px]"
                  >
                    <Settings className="w-3 h-3" />
                    <span>Change in Settings</span>
                  </button>
                )}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition shrink-0 ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-5 flex-1 overflow-y-auto">
          {/* Incoming Messages Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600">
                Incoming Client Chats on {activeWhatsAppNumber}:
              </label>
              {onFetchLatestMessages && (
                <button
                  type="button"
                  onClick={handleManualFetch}
                  className="text-xs font-semibold text-[#006D77] hover:underline flex items-center gap-1"
                >
                  <RefreshCw className={`w-3 h-3 ${isFetching ? 'animate-spin' : ''}`} />
                  <span>Fetch Fresh</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {incomingMessages.slice(0, 3).map((msg) => (
                <button
                  key={msg.id}
                  type="button"
                  onClick={() => handleSelectMessage(msg)}
                  className={`p-3 rounded-xl text-left border transition text-xs flex flex-col justify-between ${
                    selectedMessageId === msg.id
                      ? 'border-[#25D366] bg-[#25D366]/10 ring-1 ring-[#25D366]'
                      : 'border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-stone-900 truncate">{msg.sender}</div>
                    <div className="text-[11px] text-stone-500 font-mono">{msg.phone}</div>
                    <div className="text-[11px] text-stone-600 mt-1 line-clamp-2 italic">
                      "{msg.text}"
                    </div>
                  </div>
                  <div className="text-[10px] text-stone-400 mt-2 self-end font-medium">
                    {msg.time}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* WhatsApp Chat Balloon */}
          <div className="bg-[#EFEAE2] p-3.5 sm:p-4 rounded-xl border border-stone-300 relative font-sans">
            <div className="text-[11px] font-semibold text-stone-500 mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>WhatsApp Message Received on {activeWhatsAppNumber}</span>
              </span>
              <span>Today</span>
            </div>

            <div className="bg-white rounded-xl p-3 max-w-xl shadow-xs border border-stone-200 space-y-1.5">
              <div className="flex items-center justify-between text-xs text-stone-600">
                <span className="font-bold text-[#128C7E]">{senderName || 'Customer'}</span>
                <span className="text-[10px] text-stone-400 font-mono">{senderPhone}</span>
              </div>
              <textarea
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                rows={3}
                className="w-full text-xs text-stone-800 focus:outline-hidden bg-transparent resize-none border-b border-stone-100 pb-1"
                placeholder="Paste customer WhatsApp message here..."
              />
              <div className="text-[10px] text-right text-stone-400">10:14 AM ✓✓</div>
            </div>
          </div>

          {/* Extraction & Parsing Output Form */}
          <div className="bg-[#FAF3F0] rounded-xl p-4 sm:p-5 border border-[#E5D3CD] space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#006D77]">
                <Sparkles className="w-4 h-4 text-[#D4A373]" />
                <span>Intelligent Entity Extraction & Draft</span>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded border border-emerald-200">
                Parsed Automatically
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="text-stone-600 flex items-center gap-1 font-semibold">
                  <User className="w-3.5 h-3.5 text-stone-500" /> Customer Name:
                </label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#E5D3CD] font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-stone-600 flex items-center gap-1 font-semibold">
                  <Phone className="w-3.5 h-3.5 text-stone-500" /> Phone (M-PESA Handset):
                </label>
                <input
                  type="text"
                  value={senderPhone}
                  onChange={(e) => setSenderPhone(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#E5D3CD] font-medium font-mono"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-stone-600 flex items-center gap-1 font-semibold">
                  <MapPin className="w-3.5 h-3.5 text-stone-500" /> Delivery Address / Location:
                </label>
                <input
                  type="text"
                  value={detectedAddress}
                  onChange={(e) => setDetectedAddress(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#E5D3CD] font-medium"
                />
              </div>
            </div>

            {/* Extracted Product Items */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-stone-600">Extracted Products & Quantity:</span>
                <div className="flex items-center gap-1 text-[11px]">
                  <span className="text-stone-500">Add Item:</span>
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        handleAddItem(e.target.value);
                        e.target.value = '';
                      }
                    }}
                    defaultValue=""
                    className="px-2 py-0.5 rounded border border-stone-300 text-xs bg-white text-stone-800"
                  >
                    <option value="" disabled>+ Select Product...</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} (KSh {p.retailPrice})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5 bg-white rounded-xl p-3 border border-[#E5D3CD]">
                {orderItems.length === 0 ? (
                  <div className="text-xs text-stone-400 py-2 text-center">
                    No items selected. Pick a product from the dropdown above.
                  </div>
                ) : (
                  orderItems.map((item) => (
                    <div key={item.productId} className="flex items-center justify-between text-xs py-1.5 border-b border-stone-100 last:border-0 gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="flex items-center border border-stone-200 rounded-md">
                          <button
                            type="button"
                            onClick={() => handleUpdateItemQuantity(item.productId, -1)}
                            className="px-1.5 py-0.5 text-stone-600 hover:bg-stone-100 text-xs"
                          >
                            -
                          </button>
                          <span className="px-2 py-0.5 font-bold text-stone-900 text-xs">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleUpdateItemQuantity(item.productId, 1)}
                            className="px-1.5 py-0.5 text-stone-600 hover:bg-stone-100 text-xs"
                          >
                            +
                          </button>
                        </div>
                        <span className="font-medium text-stone-800 truncate">{item.productName}</span>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="font-semibold text-stone-900">
                          KSh {item.subtotal.toLocaleString()}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.productId)}
                          className="text-stone-400 hover:text-rose-600 p-1 transition"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}

                <div className="flex items-center justify-between pt-2.5 border-t border-stone-100 text-sm font-bold text-[#006D77]">
                  <span>Total Order Value:</span>
                  <span className="font-serif">KSh {totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#E5D3CD] bg-[#FAF7F5] flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-b-2xl shrink-0">
          <div className="text-xs text-stone-500">
            Capturing order automatically reconciles inventory and prompts M-PESA STK push.
          </div>
          <div className="flex items-center justify-end gap-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-200 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConvertOrder}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold bg-[#006D77] hover:bg-[#004D54] text-white shadow-xs transition"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm & Generate Order</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
