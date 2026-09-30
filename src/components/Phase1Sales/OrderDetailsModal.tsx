import React, { useState, useEffect } from 'react';
import { 
  X, 
  Printer, 
  Truck, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  Smartphone, 
  Package, 
  Clock, 
  Calendar,
  User,
  ShieldCheck,
  Edit3,
  Trash2,
  Save,
  RotateCcw
} from 'lucide-react';
import { Order, OrderStatus, PaymentStatus } from '../../types';

interface OrderDetailsModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (orderId: string, newStatus: OrderStatus) => void;
  onTriggerMpesa: (order: Order) => void;
  onUpdateOrder?: (updatedOrder: Order) => void;
  onDeleteOrder?: (orderId: string) => void;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  order,
  isOpen,
  onClose,
  onUpdateStatus,
  onTriggerMpesa,
  onUpdateOrder,
  onDeleteOrder,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  // Edit form state
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [deliveryPerson, setDeliveryPerson] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('Pending');
  const [totalAmount, setTotalAmount] = useState<number>(0);

  useEffect(() => {
    if (order) {
      setCustomerName(order.customerName);
      setCustomerPhone(order.customerPhone);
      setCustomerAddress(order.customerAddress);
      setDeliveryPerson(order.deliveryPerson || '');
      setDeliveryDate(order.deliveryDate || '');
      setNotes(order.notes || '');
      setPaymentStatus(order.paymentStatus);
      setTotalAmount(order.totalAmount);
      setIsEditing(false);
      setIsDeleteConfirmOpen(false);
    }
  }, [order]);

  if (!isOpen || !order) return null;

  const statuses: OrderStatus[] = [
    'Pending Payment',
    'Confirmed',
    'In Production',
    'Dispatched',
    'Delivered',
    'Cancelled'
  ];

  const paymentStatuses: PaymentStatus[] = [
    'Pending',
    'Paid via M-PESA',
    'Paid via Cash',
    'Invoiced Net-30',
    'Overdue'
  ];

  const isPaid = order.paymentStatus.includes('Paid');

  const handlePrint = () => {
    window.print();
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onUpdateOrder) return;

    const updated: Order = {
      ...order,
      customerName: customerName.trim() || order.customerName,
      customerPhone: customerPhone.trim() || order.customerPhone,
      customerAddress: customerAddress.trim() || order.customerAddress,
      deliveryPerson: deliveryPerson.trim() || undefined,
      deliveryDate: deliveryDate.trim() || undefined,
      notes: notes.trim() || undefined,
      paymentStatus,
      totalAmount: Number(totalAmount) || order.totalAmount,
    };

    onUpdateOrder(updated);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (onDeleteOrder) {
      onDeleteOrder(order.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-[#006D77] text-white p-5 sm:p-6 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#D4A373]">
                Order Details
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-white/20 text-white font-mono">
                {order.channel}
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                order.paymentStatus.includes('Paid') ? 'bg-emerald-500 text-white' : 'bg-amber-400 text-stone-950'
              }`}>
                {order.paymentStatus}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-white flex items-center gap-3">
              {order.orderNumber}
            </h2>
            <p className="text-xs text-stone-200 mt-1">
              Placed on {order.createdAt}
            </p>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Edit Order"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(false)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Cancel Edit"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => setIsDeleteConfirmOpen(true)}
              className="p-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/40 text-rose-200 hover:text-white transition-colors"
              title="Delete Order"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Print Order / Delivery Note"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-5 max-h-[72vh] overflow-y-auto">
          {/* Status Progression Selector */}
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/80">
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
              Update Fulfillment Status
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
              {statuses.map(st => (
                <button
                  key={st}
                  onClick={() => onUpdateStatus(order.id, st)}
                  className={`text-[11px] py-1.5 px-2 rounded-lg font-medium transition-all text-center ${
                    order.status === st
                      ? 'bg-[#006D77] text-white shadow-xs font-bold'
                      : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200/60'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Edit Form or View Cards */}
          {isEditing ? (
            <form onSubmit={handleSaveEdit} className="bg-[#FFFDF9] border border-[#F3E1DD] rounded-2xl p-4 sm:p-5 space-y-4 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#F3E1DD]">
                <span className="font-bold text-sm text-[#006D77] flex items-center gap-1.5">
                  <Edit3 className="w-4 h-4 text-[#D4A373]" />
                  <span>Edit Order Information</span>
                </span>
                <span className="text-[11px] text-stone-500">Modify details below</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Customer Name</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 font-medium"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Customer Phone</label>
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 font-mono font-medium"
                    required
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="font-semibold text-stone-700">Delivery Address</label>
                  <input
                    type="text"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 font-medium"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Delivery Rider / Courier</label>
                  <input
                    type="text"
                    value={deliveryPerson}
                    onChange={(e) => setDeliveryPerson(e.target.value)}
                    placeholder="e.g. Juma (Rider 1)"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Delivery Schedule</label>
                  <input
                    type="text"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    placeholder="e.g. 2026-09-30 3:00 PM"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Payment Status</label>
                  <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 font-medium"
                  >
                    {paymentStatuses.map(ps => (
                      <option key={ps} value={ps}>{ps}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Total Order Amount (KSh)</label>
                  <input
                    type="number"
                    min="0"
                    value={totalAmount}
                    onChange={(e) => setTotalAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 font-bold text-stone-900"
                    required
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="font-semibold text-stone-700">Order Notes</label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Special packaging or dispatch instructions..."
                    className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#F3E1DD]">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#006D77] hover:bg-[#004D54] text-white text-xs font-bold shadow-md flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Order Updates</span>
                </button>
              </div>
            </form>
          ) : (
            /* Read-only details cards */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#F3E1DD]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-bold text-[#006D77] tracking-wider block">
                    Customer Information
                  </span>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-[11px] text-[#006D77] hover:underline flex items-center gap-1 font-semibold"
                  >
                    <Edit3 className="w-3 h-3" /> Edit
                  </button>
                </div>
                <p className="font-serif font-bold text-stone-900 text-base flex items-center gap-1.5">
                  <User className="w-4 h-4 text-[#D4A373]" />
                  {order.customerName}
                </p>
                <p className="text-xs text-stone-600 font-mono mt-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-stone-400" />
                  {order.customerPhone}
                </p>
                <p className="text-xs text-stone-600 mt-2 flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                  <span>{order.customerAddress}</span>
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <span className="text-[10px] uppercase font-bold text-stone-500 tracking-wider block mb-2">
                  Delivery & Assignment
                </span>
                <p className="text-xs text-stone-700 flex items-center gap-1.5 mb-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#006D77]" />
                  <span className="font-semibold">Rider:</span> {order.deliveryPerson || 'Unassigned (Dispatch Pending)'}
                </p>
                <p className="text-xs text-stone-700 flex items-center gap-1.5 mb-1.5">
                  <Clock className="w-3.5 h-3.5 text-stone-400" />
                  <span className="font-semibold">Schedule:</span> {order.deliveryDate || 'Standard delivery'}
                </p>
                {order.notes && (
                  <div className="mt-2 pt-2 border-t border-stone-200 text-[11px] text-stone-600 italic">
                    "{order.notes}"
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Items Table */}
          <div className="border border-stone-200 rounded-2xl overflow-hidden">
            <div className="bg-stone-50 px-4 py-2.5 border-b border-stone-200 flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
                Order Items ({order.items.length})
              </span>
              <span className="text-xs text-stone-500 font-mono">
                Currency: Kenya Shillings (KSh)
              </span>
            </div>

            <div className="divide-y divide-stone-100">
              {order.items.map((item, idx) => (
                <div key={idx} className="p-3.5 flex items-center justify-between text-xs hover:bg-stone-50/50">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-md bg-[#006D77]/10 text-[#006D77] flex items-center justify-center font-mono font-bold text-xs">
                      {item.quantity}x
                    </span>
                    <div>
                      <p className="font-medium text-stone-900">{item.productName}</p>
                      <p className="text-[11px] text-stone-400">Unit: KSh {item.unitPrice.toLocaleString()}</p>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-stone-900 text-sm">
                    KSh {item.subtotal.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Total Footer */}
            <div className="bg-[#FFFDF9] p-4 border-t border-stone-200 flex items-center justify-between">
              <div>
                <span className="text-xs text-stone-500 block">Total Amount Due</span>
                <span className="text-[11px] text-emerald-700 font-medium">Includes all production & packing</span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-serif font-bold text-[#006D77]">
                  KSh {order.totalAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* M-PESA Status & STK Action */}
          <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-emerald-950 text-sm">
                    M-PESA Status: {order.paymentStatus}
                  </h4>
                  {isPaid && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 font-bold">
                      VERIFIED
                    </span>
                  )}
                </div>
                {order.mpesaRef ? (
                  <p className="text-xs text-emerald-800 font-mono mt-0.5">
                    Confirmation Code: <span className="font-bold underline">{order.mpesaRef}</span>
                  </p>
                ) : (
                  <p className="text-xs text-stone-600 mt-0.5">
                    No M-PESA receipt reference attached yet.
                  </p>
                )}
              </div>
            </div>

            {!isPaid && (
              <button
                onClick={() => onTriggerMpesa(order)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-all whitespace-nowrap"
              >
                <Smartphone className="w-4 h-4" />
                Trigger STK Push / Reconcile
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-between items-center">
          <button
            onClick={() => setIsDeleteConfirmOpen(true)}
            className="text-xs text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-rose-50 transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Order</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-medium text-xs transition-colors"
          >
            Close
          </button>
        </div>

        {/* Delete Confirmation Sub-Dialog */}
        {isDeleteConfirmOpen && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-stone-200 text-center space-y-3">
              <div className="w-11 h-11 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-stone-900 text-base">Delete Order {order.orderNumber}?</h3>
              <p className="text-xs text-stone-500">
                Are you sure you want to delete this order? All items, customer association, and payment status records will be removed.
              </p>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDeleteConfirmOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
