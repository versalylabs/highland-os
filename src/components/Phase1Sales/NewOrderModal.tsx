import React, { useState } from 'react';
import { 
  X, 
  ShoppingCart, 
  Plus, 
  Trash2, 
  User, 
  Phone, 
  MapPin
} from 'lucide-react';
import { Product, Order, OrderChannel, PaymentStatus } from '../../types';

interface NewOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onOrderCreated: (order: Order) => void;
}

export const NewOrderModal: React.FC<NewOrderModalProps> = ({
  isOpen,
  onClose,
  products,
  onOrderCreated,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [channel, setChannel] = useState<OrderChannel>('Website');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('Paid via M-PESA');
  const [mpesaRef, setMpesaRef] = useState('');
  const [notes, setNotes] = useState('');
  const [deliveryPerson, setDeliveryPerson] = useState('Juma (Rider 1)');
  const [items, setItems] = useState<{ productId: string; quantity: number }[]>([
    { productId: products[0]?.id || 'prod-1', quantity: 2 },
  ]);

  if (!isOpen) return null;

  const handleAddItem = () => {
    if (products.length > 0) {
      setItems([...items, { productId: products[0].id, quantity: 1 }]);
    }
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleUpdateItem = (index: number, productId: string, quantity: number) => {
    const updated = [...items];
    updated[index] = { productId, quantity: Math.max(1, quantity) };
    setItems(updated);
  };

  const orderItems = items.map((item) => {
    const prod = products.find((p) => p.id === item.productId);
    const unitPrice = channel === 'Wholesale / Retailer' 
      ? (prod?.wholesalePrice || 350) 
      : (prod?.retailPrice || 500);
    return {
      productId: item.productId,
      productName: prod?.name || 'Selected Product',
      quantity: item.quantity,
      unitPrice,
      subtotal: unitPrice * item.quantity,
    };
  });

  const totalAmount = orderItems.reduce((acc, curr) => acc + curr.subtotal, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || orderItems.length === 0) return;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `HG-ORD-${Math.floor(2000 + Math.random() * 8000)}`,
      customerId: `cust-${Date.now()}`,
      customerName,
      customerPhone: customerPhone || '+254 7XX XXX XXX',
      customerAddress: customerAddress || 'Nairobi Metro',
      channel,
      items: orderItems,
      totalAmount,
      status: paymentStatus === 'Pending' ? 'Pending Payment' : 'Confirmed',
      paymentStatus,
      mpesaRef: mpesaRef || (paymentStatus === 'Paid via M-PESA' ? `SHB${Math.floor(100 + Math.random() * 900)}X99Q` : undefined),
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      notes,
      deliveryPerson,
    };

    onOrderCreated(newOrder);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#E5D3CD]">
        <div className="p-4 bg-[#006D77] text-white flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-[#F3E1DD]" />
            <h3 className="font-bold text-base">Create Highland Gardens Order</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 text-white/80 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-stone-600 font-semibold flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-stone-400" /> Customer / Business Name *
              </label>
              <input
                required
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Wangari Maathai"
                className="w-full px-3 py-2 rounded-lg border border-stone-300 font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-stone-600 font-semibold flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-stone-400" /> Phone (M-PESA)
              </label>
              <input
                type="text"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="+254 7XX XXX XXX"
                className="w-full px-3 py-2 rounded-lg border border-stone-300 font-medium"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="text-stone-600 font-semibold flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-stone-400" /> Delivery Address / Location
              </label>
              <input
                type="text"
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                placeholder="e.g. Apt 3, Roselyn Heights, Redhill Rd, Gigiri"
                className="w-full px-3 py-2 rounded-lg border border-stone-300 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-[#FAF3F0] rounded-xl border border-[#E5D3CD]">
            <div className="space-y-1">
              <label className="text-stone-600 font-semibold">Sales Channel:</label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value as OrderChannel)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-stone-300 font-medium"
              >
                <option value="Website">Website Store</option>
                <option value="WhatsApp">WhatsApp Chat</option>
                <option value="Direct Call">Direct Call / Walk-In</option>
                <option value="Wholesale / Retailer">Wholesale / Retailer</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-stone-600 font-semibold">Payment Status:</label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-stone-300 font-medium"
              >
                <option value="Paid via M-PESA">Paid via M-PESA</option>
                <option value="Pending">Pending Payment</option>
                <option value="Paid via Cash">Cash on Delivery</option>
                <option value="Invoiced Net-30">Invoiced Net-30</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-stone-600 font-semibold">Delivery Assignee:</label>
              <select
                value={deliveryPerson}
                onChange={(e) => setDeliveryPerson(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-stone-300 font-medium"
              >
                <option value="Juma (Rider 1)">Juma (Rider 1 - Motorbike)</option>
                <option value="Mutua (Van 2)">Mutua (Van 2 - Westlands/Karen)</option>
                <option value="Pickup at Facility">Direct Customer Pickup</option>
                <option value="Fargo Courier">Fargo Courier (Upcountry)</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-700">Order Items:</span>
              <button
                type="button"
                onClick={handleAddItem}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#006D77] hover:underline"
              >
                <Plus className="w-3.5 h-3.5" /> Add Product
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {items.map((item, idx) => {
                const prod = products.find((p) => p.id === item.productId);
                const price = channel === 'Wholesale / Retailer' ? prod?.wholesalePrice : prod?.retailPrice;
                return (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-2 p-2.5 rounded-xl bg-stone-50 border border-stone-200">
                    <select
                      value={item.productId}
                      onChange={(e) => handleUpdateItem(idx, e.target.value, item.quantity)}
                      className="w-full sm:flex-1 px-2.5 py-1.5 rounded-lg bg-white border border-stone-300 font-medium text-xs"
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.unit}) — KSh {(channel === 'Wholesale / Retailer' ? p.wholesalePrice : p.retailPrice).toLocaleString()}
                        </option>
                      ))}
                    </select>

                    <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-stone-400 sm:hidden">Qty:</span>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleUpdateItem(idx, item.productId, parseInt(e.target.value) || 1)}
                          className="w-16 px-2 py-1.5 rounded-lg bg-white border border-stone-300 text-center font-bold text-xs"
                        />
                      </div>

                      <div className="w-24 text-right font-bold text-stone-800 text-xs">
                        KSh {((price || 0) * item.quantity).toLocaleString()}
                      </div>

                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          className="p-1 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-3 rounded-xl bg-stone-100 flex items-center justify-between text-sm">
              <span className="font-semibold text-stone-600">Total Order Amount:</span>
              <span className="text-base font-bold text-[#006D77] font-serif">
                KSh {totalAmount.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-stone-600 font-semibold">Special Delivery Notes:</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Call customer before arrival at gate."
              className="w-full px-3 py-1.5 rounded-lg border border-stone-300 font-medium"
            />
          </div>

          <div className="pt-3 border-t border-[#E5D3CD] flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-stone-600 font-semibold hover:bg-stone-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl font-bold bg-[#006D77] hover:bg-[#004D54] text-white shadow-xs"
            >
              Create Order & Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
