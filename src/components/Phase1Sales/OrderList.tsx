import React, { useState } from 'react';
import { 
  Search, 
  MessageSquare, 
  Globe, 
  PhoneCall, 
  Building2, 
  CheckCircle2, 
  Truck, 
  Smartphone,
  Eye,
  Plus,
  Trash2,
  Edit3,
  X
} from 'lucide-react';
import { Order, OrderStatus, OrderChannel, PaymentStatus } from '../../types';

interface OrderListProps {
  orders: Order[];
  onStatusChange: (orderId: string, newStatus: OrderStatus) => void;
  onOpenMpesaModal: (order: Order) => void;
  onViewOrderDetails: (order: Order) => void;
  onOpenNewOrder?: () => void;
  onDeleteOrder?: (orderId: string) => void;
  onUpdateOrder?: (order: Order) => void;
}

const EditOrderModal: React.FC<{ order: Order; onClose: () => void; onSave: (order: Order) => void; }> = ({ order, onClose, onSave }) => {
  const [formData, setFormData] = useState<Order>(order);

  const handleChange = (field: keyof Order, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-xl border border-stone-200 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-stone-100">
          <div>
            <h2 className="text-xl font-serif font-bold text-[#006D77]">Edit Order</h2>
            <p className="text-xs text-stone-500 mt-1">Update details for order {order.orderNumber}</p>
          </div>
          <button onClick={onClose} className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 overflow-y-auto">
          <form id="edit-order-form" onSubmit={handleSubmit} className="space-y-5">
            {/* Customer Details */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">Customer Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-700">Customer Name</label>
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) => handleChange('customerName', e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-[#006D77]/20 focus:border-[#006D77] outline-hidden transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-700">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={formData.customerPhone}
                    onChange={(e) => handleChange('customerPhone', e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-[#006D77]/20 focus:border-[#006D77] outline-hidden transition-all"
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-stone-700">Delivery Address</label>
                  <textarea
                    required
                    rows={2}
                    value={formData.customerAddress}
                    onChange={(e) => handleChange('customerAddress', e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-[#006D77]/20 focus:border-[#006D77] outline-hidden transition-all resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Order Status */}
            <div className="space-y-4 pt-4 border-t border-stone-100">
              <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">Order Status</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-700">Channel</label>
                  <select
                    value={formData.channel}
                    onChange={(e) => handleChange('channel', e.target.value as OrderChannel)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-[#006D77]/20 focus:border-[#006D77] outline-hidden transition-all"
                  >
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Website">Website</option>
                    <option value="Wholesale / Retailer">Wholesale / Retailer</option>
                    <option value="Direct Call">Direct Call</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-700">Fulfillment Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleChange('status', e.target.value as OrderStatus)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-[#006D77]/20 focus:border-[#006D77] outline-hidden transition-all"
                  >
                    <option value="Pending Payment">Pending Payment</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="In Production">In Production</option>
                    <option value="Dispatched">Dispatched</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-700">Payment Status</label>
                  <select
                    value={formData.paymentStatus}
                    onChange={(e) => handleChange('paymentStatus', e.target.value as PaymentStatus)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-[#006D77]/20 focus:border-[#006D77] outline-hidden transition-all"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid via M-PESA">Paid via M-PESA</option>
                    <option value="Paid via Cash">Paid via Cash</option>
                    <option value="Invoiced Net-30">Invoiced Net-30</option>
                    <option value="Overdue">Overdue</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-700">M-PESA Reference</label>
                  <input
                    type="text"
                    value={formData.mpesaRef || ''}
                    onChange={(e) => handleChange('mpesaRef', e.target.value)}
                    placeholder="e.g. QKZ8X9Y7W"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-[#006D77]/20 focus:border-[#006D77] outline-hidden transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Details */}
            <div className="space-y-4 pt-4 border-t border-stone-100">
              <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">Delivery Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-700">Delivery Date</label>
                  <input
                    type="date"
                    value={formData.deliveryDate || ''}
                    onChange={(e) => handleChange('deliveryDate', e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-[#006D77]/20 focus:border-[#006D77] outline-hidden transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-700">Delivery Person</label>
                  <input
                    type="text"
                    value={formData.deliveryPerson || ''}
                    onChange={(e) => handleChange('deliveryPerson', e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-[#006D77]/20 focus:border-[#006D77] outline-hidden transition-all"
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-stone-700">Notes / Special Instructions</label>
                  <textarea
                    rows={2}
                    value={formData.notes || ''}
                    onChange={(e) => handleChange('notes', e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-[#006D77]/20 focus:border-[#006D77] outline-hidden transition-all resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Read-only Items List */}
            <div className="space-y-4 pt-4 border-t border-stone-100">
              <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">Order Items (Read-only)</h3>
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-4">
                <div className="space-y-2">
                  {formData.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs">
                      <div className="font-medium text-stone-800">{item.quantity}× {item.productName}</div>
                      <div className="text-stone-600">KSh {item.subtotal.toLocaleString()}</div>
                    </div>
                  ))}
                  <div className="pt-2 mt-2 border-t border-stone-200 flex justify-between items-center text-sm font-bold text-stone-900">
                    <div>Total</div>
                    <div>KSh {formData.totalAmount.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="p-5 sm:p-6 border-t border-stone-100 bg-stone-50/50 rounded-b-3xl flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-white border border-stone-200 text-stone-700 text-xs font-bold hover:bg-stone-50 transition-colors shadow-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="edit-order-form"
            className="px-5 py-2.5 rounded-xl bg-[#006D77] text-white text-xs font-bold hover:bg-[#004D54] transition-colors shadow-sm"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export const OrderList: React.FC<OrderListProps> = ({
  orders,
  onStatusChange,
  onOpenMpesaModal,
  onViewOrderDetails,
  onOpenNewOrder,
  onDeleteOrder,
  onUpdateOrder,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChannel, setSelectedChannel] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerPhone.includes(searchTerm) ||
      (order.mpesaRef && order.mpesaRef.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesChannel = selectedChannel === 'ALL' || order.channel === selectedChannel;
    const matchesStatus = selectedStatus === 'ALL' || order.status === selectedStatus;

    return matchesSearch && matchesChannel && matchesStatus;
  });

  const getChannelBadge = (channel: OrderChannel) => {
    switch (channel) {
      case 'WhatsApp':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#25D366]/15 text-[#128C7E] border border-[#25D366]/30">
            <MessageSquare className="w-3 h-3" /> WhatsApp
          </span>
        );
      case 'Website':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800 border border-sky-200">
            <Globe className="w-3 h-3" /> Web Store
          </span>
        );
      case 'Wholesale / Retailer':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FAF3F0] text-[#006D77] border border-[#D4A373]/30">
            <Building2 className="w-3 h-3" /> Wholesale
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-700">
            <PhoneCall className="w-3 h-3" /> Direct
          </span>
        );
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'In Production':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Dispatched':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Pending Payment':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Cancelled':
        return 'bg-stone-100 text-stone-500 border-stone-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E5D3CD] shadow-sm overflow-hidden space-y-4">
        <div className="p-4 sm:p-5 border-b border-[#E5D3CD] flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-[#FAF7F5]">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by order #, customer, phone or M-PESA ref..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-[#E5D3CD] text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-[#006D77]/20"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <select
              value={selectedChannel}
              onChange={(e) => setSelectedChannel(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white border border-[#E5D3CD] font-medium text-stone-700 focus:outline-hidden"
            >
              <option value="ALL">All Channels</option>
              <option value="WhatsApp">WhatsApp</option>
              <option value="Website">Website</option>
              <option value="Wholesale / Retailer">Wholesale</option>
              <option value="Direct Call">Direct</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white border border-[#E5D3CD] font-medium text-stone-700 focus:outline-hidden"
            >
              <option value="ALL">All Statuses</option>
              <option value="Pending Payment">Pending Payment</option>
              <option value="Confirmed">Confirmed</option>
              <option value="In Production">In Production</option>
              <option value="Dispatched">Dispatched</option>
              <option value="Delivered">Delivered</option>
            </select>

            {onOpenNewOrder && (
              <button
                onClick={onOpenNewOrder}
                className="px-3.5 py-2 rounded-xl bg-[#006D77] hover:bg-[#005B63] text-white font-bold transition flex items-center gap-1.5 shadow-2xs shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Order</span>
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF3F0] text-stone-600 font-bold uppercase tracking-wider text-[11px] border-b border-[#E5D3CD]">
              <tr>
                <th className="py-3 px-4">Order ID & Date</th>
                <th className="py-3 px-4">Customer & Channel</th>
                <th className="py-3 px-4">Items Summary</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">M-PESA / Payment</th>
                <th className="py-3 px-4">Fulfillment Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5D3CD]">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-stone-500">
                    No orders match the current filter.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#FAF3F0]/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#006D77]">{order.orderNumber}</div>
                      <div className="text-[10px] text-stone-400 mt-0.5">{order.createdAt}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-stone-900">{order.customerName}</div>
                      <div className="text-[11px] text-stone-500">{order.customerPhone}</div>
                      <div className="mt-1">{getChannelBadge(order.channel)}</div>
                    </td>

                    <td className="py-3 px-4 max-w-xs">
                      <div className="text-stone-800 line-clamp-1">
                        {order.items.map((it) => `${it.quantity}× ${it.productName}`).join(', ')}
                      </div>
                      <div className="text-[10px] text-stone-400 mt-0.5">
                        {order.items.reduce((s, i) => s + i.quantity, 0)} total units
                      </div>
                    </td>

                    <td className="py-3 px-4 font-bold text-stone-900 font-serif text-sm">
                      KSh {order.totalAmount.toLocaleString()}
                    </td>

                    <td className="py-3 px-4">
                      {order.paymentStatus === 'Paid via M-PESA' ? (
                        <div>
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            M-PESA Paid
                          </span>
                          {order.mpesaRef && (
                            <div className="font-mono text-[10px] text-stone-500 mt-0.5">
                              Ref: {order.mpesaRef}
                            </div>
                          )}
                        </div>
                      ) : order.paymentStatus === 'Pending' ? (
                        <button
                          onClick={() => onOpenMpesaModal(order)}
                          className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 px-2 py-1 rounded border border-rose-200 transition"
                        >
                          <Smartphone className="w-3 h-3" />
                          <span>Prompt M-PESA</span>
                        </button>
                      ) : (
                        <span className="text-[10px] font-medium text-stone-600 bg-stone-100 px-2 py-0.5 rounded">
                          {order.paymentStatus}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <select
                        value={order.status}
                        onChange={(e) => onStatusChange(order.id, e.target.value as OrderStatus)}
                        className={`text-[11px] font-bold px-2 py-1 rounded-lg border focus:outline-hidden ${getStatusBadge(
                          order.status
                        )}`}
                      >
                        <option value="Pending Payment">Pending Payment</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="In Production">In Production</option>
                        <option value="Dispatched">Dispatched</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                      {order.deliveryPerson && (
                        <div className="text-[10px] text-stone-500 mt-0.5 flex items-center gap-1">
                          <Truck className="w-2.5 h-2.5 text-stone-400" />
                          <span>{order.deliveryPerson}</span>
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onViewOrderDetails(order)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-[#006D77] hover:bg-[#FAF3F0] rounded-lg transition"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Details</span>
                        </button>
                        {onUpdateOrder && (
                          <button
                            onClick={() => setEditingOrder(order)}
                            className="p-1 text-stone-400 hover:text-[#006D77] hover:bg-[#FAF3F0] rounded-lg transition"
                            title="Edit Order"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {onDeleteOrder && (
                          <button
                            onClick={() => setOrderToDelete(order)}
                            className="p-1 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="Delete Order"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Edit Order Modal */}
        {editingOrder && (
          <EditOrderModal
            order={editingOrder}
            onClose={() => setEditingOrder(null)}
            onSave={(updatedOrder) => {
              onUpdateOrder?.(updatedOrder);
              setEditingOrder(null);
            }}
          />
        )}

        {/* Delete Order Confirmation Dialog */}
        {orderToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-stone-200 text-center space-y-3">
              <div className="w-11 h-11 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-stone-900 text-base">Delete Order?</h3>
              <p className="text-xs text-stone-500">
                Are you sure you want to delete order <strong>{orderToDelete.orderNumber}</strong> ({orderToDelete.customerName})? This action cannot be undone.
              </p>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setOrderToDelete(null)}
                  className="flex-1 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (onDeleteOrder) onDeleteOrder(orderToDelete.id);
                    setOrderToDelete(null);
                  }}
                  className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
  );
};
