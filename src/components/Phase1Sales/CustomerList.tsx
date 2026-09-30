import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Phone, 
  MapPin, 
  ShoppingBag, 
  MessageSquare, 
  Building2, 
  User, 
  Plus, 
  Edit3, 
  Trash2, 
  X, 
  Save, 
  Calendar,
  DollarSign
} from 'lucide-react';
import { Customer, Order } from '../../types';

interface CustomerListProps {
  customers: Customer[];
  orders: Order[];
  onSelectCustomer?: (customer: Customer) => void;
  onOpenWhatsApp?: (phone: string, name: string) => void;
  onAddCustomer?: (customer: Customer) => void;
  onUpdateCustomer?: (customer: Customer) => void;
  onDeleteCustomer?: (customerId: string) => void;
}

export const CustomerList: React.FC<CustomerListProps> = ({
  customers,
  orders,
  onOpenWhatsApp,
  onAddCustomer,
  onUpdateCustomer,
  onDeleteCustomer,
}) => {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [activeCustomerDetails, setActiveCustomerDetails] = useState<Customer | null>(null);

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Customer>>({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: 'Nairobi',
    type: 'Individual',
    notes: '',
  });

  const customerTypes = ['All', 'Individual', 'Retailer', 'Cafe/Hospitality', 'Distributor'];

  const filteredCustomers = customers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
                          c.phone.includes(search) ||
                          c.address.toLowerCase().includes(search.toLowerCase()) ||
                          c.city.toLowerCase().includes(search.toLowerCase());
    const matchesType = selectedType === 'All' || c.type === selectedType;
    return matchesSearch && matchesType;
  });

  const getCustomerOrders = (customerId: string) => {
    return orders.filter(o => o.customerId === customerId);
  };

  const handleOpenAdd = () => {
    setEditingCustomer(null);
    setFormData({
      name: '',
      phone: '+254 7',
      email: '',
      address: '',
      city: 'Nairobi',
      type: 'Individual',
      notes: 'New client inquiry',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: Customer, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingCustomer(c);
    setFormData({ ...c });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) return;

    if (editingCustomer) {
      const updated: Customer = {
        ...editingCustomer,
        name: formData.name.trim(),
        phone: formData.phone?.trim() || editingCustomer.phone,
        email: formData.email?.trim() || undefined,
        address: formData.address?.trim() || editingCustomer.address,
        city: formData.city?.trim() || 'Nairobi',
        type: (formData.type as Customer['type']) || 'Individual',
        notes: formData.notes?.trim() || undefined,
      };
      if (onUpdateCustomer) onUpdateCustomer(updated);
      if (activeCustomerDetails?.id === updated.id) {
        setActiveCustomerDetails(updated);
      }
    } else {
      const newCust: Customer = {
        id: `cust-${Date.now()}`,
        name: formData.name.trim(),
        phone: formData.phone?.trim() || '+254 700 000 000',
        email: formData.email?.trim() || undefined,
        address: formData.address?.trim() || 'Nairobi, Kenya',
        city: formData.city?.trim() || 'Nairobi',
        type: (formData.type as Customer['type']) || 'Individual',
        totalOrders: 0,
        totalSpent: 0,
        lastOrderDate: new Date().toISOString().substring(0, 10),
        notes: formData.notes?.trim() || 'Direct client profile',
      };
      if (onAddCustomer) onAddCustomer(newCust);
      setActiveCustomerDetails(newCust);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (onDeleteCustomer) onDeleteCustomer(id);
    if (activeCustomerDetails?.id === id) {
      setActiveCustomerDetails(null);
    }
    setCustomerToDelete(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/80 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-serif font-bold text-[#006D77] flex items-center gap-2">
              <Users className="w-5 h-5 text-[#D4A373]" />
              Customer Master Directory
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Consolidated profiles across WhatsApp chats, website checkouts, and phone orders
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs px-3 py-1.5 rounded-full bg-[#006D77]/10 text-[#006D77] font-medium font-mono">
              {customers.length} Registered Accounts
            </span>
            <span className="text-xs px-3 py-1.5 rounded-full bg-[#F3E1DD] text-[#83382B] font-medium">
              KSh {customers.reduce((acc, c) => acc + c.totalSpent, 0).toLocaleString()} Total LTV
            </span>
            <button
              onClick={handleOpenAdd}
              className="px-3.5 py-2 rounded-xl bg-[#006D77] hover:bg-[#005B63] text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Customer</span>
            </button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by customer name, phone number, estate, or city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#006D77]/20 focus:border-[#006D77]"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {customerTypes.map(type => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`text-xs px-3 py-2 rounded-xl whitespace-nowrap font-medium transition-all ${
                  selectedType === type
                    ? 'bg-[#006D77] text-white shadow-xs font-bold'
                    : 'bg-stone-100 hover:bg-stone-200/80 text-stone-600'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Layout: List & Drawer Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Cards Column */}
        <div className="lg:col-span-2 space-y-3">
          {filteredCustomers.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-stone-300">
              <Users className="w-10 h-10 text-stone-300 mx-auto mb-3" />
              <p className="text-sm font-medium text-stone-600">No customers match your search criteria</p>
              <p className="text-xs text-stone-400 mt-1">Try clearing filters or adding new incoming orders</p>
            </div>
          ) : (
            filteredCustomers.map(customer => {
              const custOrders = getCustomerOrders(customer.id);
              const isSelected = activeCustomerDetails?.id === customer.id;

              return (
                <div
                  key={customer.id}
                  onClick={() => setActiveCustomerDetails(customer)}
                  className={`bg-white rounded-2xl p-4 border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#006D77] ring-2 ring-[#006D77]/10 shadow-sm'
                      : 'border-stone-200/80 hover:border-stone-300 shadow-xs'
                  }`}
                >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                        customer.type === 'Retailer'
                          ? 'bg-[#006D77]/10 text-[#006D77]'
                          : customer.type === 'Cafe/Hospitality'
                          ? 'bg-[#D4A373]/20 text-[#B58455]'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}>
                        {customer.type === 'Retailer' ? <Building2 className="w-5 h-5" /> : customer.name.charAt(0)}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-serif font-bold text-stone-900 text-base">
                            {customer.name}
                          </h3>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                            customer.type === 'Retailer'
                              ? 'bg-[#006D77]/10 text-[#006D77]'
                              : customer.type === 'Cafe/Hospitality'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-stone-100 text-stone-600'
                          }`}>
                            {customer.type}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-stone-500">
                          <span className="flex items-center gap-1 font-mono text-stone-700">
                            <Phone className="w-3 h-3 text-stone-400" />
                            {customer.phone}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-stone-400" />
                            {customer.address} ({customer.city})
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-stone-100">
                      <div className="text-right">
                        <span className="text-[11px] text-stone-400 block">Total Spend</span>
                        <span className="font-serif font-bold text-[#006D77] text-sm">
                          KSh {customer.totalSpent.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 mt-1.5">
                        <button
                          onClick={(e) => handleOpenEdit(customer, e)}
                          className="p-1 rounded-lg text-stone-400 hover:text-[#006D77] hover:bg-stone-100 transition"
                          title="Edit Customer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setCustomerToDelete(customer);
                          }}
                          className="p-1 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition"
                          title="Delete Customer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Customer Details Drawer / Sidebar */}
        <div className="lg:col-span-1">
          {activeCustomerDetails ? (
            <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm p-5 space-y-5 sticky top-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#D4A373] tracking-wider block">
                      Account Profile
                    </span>
                    <h3 className="font-serif font-bold text-stone-900 text-lg">
                      {activeCustomerDetails.name}
                    </h3>
                    <p className="text-xs text-stone-500 font-mono mt-0.5">
                      {activeCustomerDetails.phone}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(activeCustomerDetails)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-[#006D77] hover:bg-stone-100"
                      title="Edit Customer"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setCustomerToDelete(activeCustomerDetails)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50"
                      title="Delete Customer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-2 bg-[#FAF3F0] rounded-xl p-3 text-center border border-[#E5D3CD]">
                  <div>
                    <span className="text-[10px] text-stone-500 block uppercase font-medium">Orders Count</span>
                    <span className="font-serif font-bold text-stone-900 text-base">
                      {activeCustomerDetails.totalOrders}
                    </span>
                  </div>
                  <div className="border-l border-[#E5D3CD]">
                    <span className="text-[10px] text-stone-500 block uppercase font-medium">Lifetime Value</span>
                    <span className="font-serif font-bold text-[#006D77] text-base">
                      KSh {activeCustomerDetails.totalSpent.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Contact & Location Info */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2 text-stone-600">
                    <MapPin className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                    <span>{activeCustomerDetails.address}, {activeCustomerDetails.city}</span>
                  </div>
                  {activeCustomerDetails.notes && (
                    <div className="p-3 bg-stone-50 rounded-xl text-stone-600 text-xs italic border border-stone-100">
                      "{activeCustomerDetails.notes}"
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="pt-2 border-t border-stone-100 space-y-2">
                  <button
                    onClick={() => onOpenWhatsApp && onOpenWhatsApp(activeCustomerDetails.phone, activeCustomerDetails.name)}
                    className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Open WhatsApp Chat</span>
                  </button>
                </div>
              </div>
          ) : (
            <div className="bg-white rounded-2xl border border-dashed border-stone-300 p-8 text-center text-stone-400 text-xs">
              <User className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <span>Select a customer to view their profile, orders, and WhatsApp details</span>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Customer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-[#006D77]/10 text-[#006D77] flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-stone-900">
                    {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
                  </h3>
                  <p className="text-xs text-stone-500">
                    Customer master record and WhatsApp link
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Full Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Wanjiku Mwangi"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Phone (M-PESA / WhatsApp) <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+254 7XX XXX XXX"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 font-mono font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Customer Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                  >
                    <option value="Individual">Individual</option>
                    <option value="Retailer">Retailer</option>
                    <option value="Cafe/Hospitality">Cafe/Hospitality</option>
                    <option value="Distributor">Distributor</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Delivery Address / Estate</label>
                  <input
                    type="text"
                    value={formData.address || ''}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="e.g. Lavender Court, Lavington"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">City / Town</label>
                  <input
                    type="text"
                    value={formData.city || ''}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Nairobi"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Customer Notes</label>
                <textarea
                  rows={2}
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Preferences, frequent orders, delivery instructions..."
                  className="w-full px-3 py-2 rounded-xl border border-stone-300"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#006D77] hover:bg-[#004D54] text-white text-xs font-bold shadow-md flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{editingCustomer ? 'Save Customer' : 'Create Customer'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Customer Confirmation Dialog */}
      {customerToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-stone-200 text-center space-y-3">
            <div className="w-11 h-11 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-stone-900 text-base">Delete Customer?</h3>
            <p className="text-xs text-stone-500">
              Are you sure you want to remove <strong>{customerToDelete.name}</strong> from your customer master directory?
            </p>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCustomerToDelete(null)}
                className="flex-1 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(customerToDelete.id)}
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
