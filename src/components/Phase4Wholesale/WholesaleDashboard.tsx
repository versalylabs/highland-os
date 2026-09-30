import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  FileText, 
  Truck, 
  Users, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  MapPin, 
  Phone, 
  Send,
  Plus,
  ArrowUpRight,
  Edit3,
  Trash2,
  X
} from 'lucide-react';
import { RetailerAccount, WholesaleInvoice, Product } from '../../types';

interface WholesaleDashboardProps {
  retailers: RetailerAccount[];
  invoices: WholesaleInvoice[];
  products: Product[];
  onAddRetailer?: (retailer: RetailerAccount) => void;
  onUpdateRetailer?: (retailer: RetailerAccount) => void;
  onDeleteRetailer?: (retailerId: string) => void;
  onCreateInvoice?: (invoice: WholesaleInvoice) => void;
  onUpdateInvoice?: (invoice: WholesaleInvoice) => void;
  onDeleteInvoice?: (invoiceId: string) => void;
  onRecordPayment?: (invoiceId: string, amount: number) => void;
}

export const WholesaleDashboard: React.FC<WholesaleDashboardProps> = ({
  retailers,
  invoices,
  products,
  onAddRetailer,
  onUpdateRetailer,
  onDeleteRetailer,
  onCreateInvoice,
  onUpdateInvoice,
  onDeleteInvoice,
  onRecordPayment,
}) => {
  const [activeTab, setActiveTab] = useState<'retailers' | 'invoices' | 'pricelists'>('retailers');
  const [search, setSearch] = useState('');
  const [selectedRetailer, setSelectedRetailer] = useState<RetailerAccount | null>(retailers[0] || null);

  // Modals state
  const [retailerModal, setRetailerModal] = useState<{ isOpen: boolean; mode: 'add' | 'edit'; data: Partial<RetailerAccount> }>({ isOpen: false, mode: 'add', data: {} });
  const [invoiceModal, setInvoiceModal] = useState<{ isOpen: boolean; mode: 'add' | 'edit'; data: Partial<WholesaleInvoice> }>({ isOpen: false, mode: 'add', data: {} });
  const [paymentModal, setPaymentModal] = useState<{ isOpen: boolean; invoiceId: string; maxAmount: number; amount: string }>({ isOpen: false, invoiceId: '', maxAmount: 0, amount: '' });
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; type: 'retailer' | 'invoice'; id: string; title: string }>({ isOpen: false, type: 'retailer', id: '', title: '' });

  // Financial calculations
  const totalReceivables = invoices.reduce((acc, inv) => acc + inv.balance, 0);
  const totalB2BInvoiced = invoices.reduce((acc, inv) => acc + inv.totalAmount, 0);
  const overdueInvoices = invoices.filter(inv => inv.status === 'Overdue');

  const filteredRetailers = retailers.filter(r => 
    r.businessName.toLowerCase().includes(search.toLowerCase()) ||
    r.contactPerson.toLowerCase().includes(search.toLowerCase()) ||
    r.deliveryRoute.toLowerCase().includes(search.toLowerCase())
  );

  const handleSaveRetailer = () => {
    const d = retailerModal.data;
    if (!d.businessName || !d.contactPerson) return;
    
    const retailer: RetailerAccount = {
      id: d.id || `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      businessName: d.businessName,
      contactPerson: d.contactPerson,
      phone: d.phone || '',
      email: d.email || '',
      tier: d.tier as any || 'Tier 2 Independent Supermarket',
      branchesCount: Number(d.branchesCount) || 1,
      creditTerms: d.creditTerms as any || 'Net 14',
      creditLimit: Number(d.creditLimit) || 0,
      currentBalance: Number(d.currentBalance) || 0,
      assignedRep: d.assignedRep || '',
      deliveryRoute: d.deliveryRoute || ''
    };

    if (retailerModal.mode === 'add') {
      onAddRetailer?.(retailer);
    } else {
      onUpdateRetailer?.(retailer);
    }
    setRetailerModal({ isOpen: false, mode: 'add', data: {} });
  };

  const handleSaveInvoice = () => {
    const d = invoiceModal.data;
    if (!d.invoiceNumber || !d.retailerId) return;

    const retailer = retailers.find(r => r.id === d.retailerId);
    if (!retailer) return;

    const total = Number(d.totalAmount) || 0;
    const paid = Number(d.paidAmount) || 0;

    const invoice: WholesaleInvoice = {
      id: d.id || `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      invoiceNumber: d.invoiceNumber,
      retailerId: retailer.id,
      retailerName: retailer.businessName,
      issueDate: d.issueDate || new Date().toISOString().split('T')[0],
      dueDate: d.dueDate || new Date().toISOString().split('T')[0],
      totalAmount: total,
      paidAmount: paid,
      balance: total - paid,
      status: d.status as any || 'Draft',
      itemsCount: Number(d.itemsCount) || 0,
    };

    if (invoiceModal.mode === 'add') {
      onCreateInvoice?.(invoice);
    } else {
      onUpdateInvoice?.(invoice);
    }
    setInvoiceModal({ isOpen: false, mode: 'add', data: {} });
  };

  const confirmDelete = () => {
    if (deleteConfirm.type === 'retailer') {
      onDeleteRetailer?.(deleteConfirm.id);
      if (selectedRetailer?.id === deleteConfirm.id) setSelectedRetailer(null);
    } else {
      onDeleteInvoice?.(deleteConfirm.id);
    }
    setDeleteConfirm({ isOpen: false, type: 'retailer', id: '', title: '' });
  };

  const handleSavePayment = () => {
    const amt = Number(paymentModal.amount);
    if (amt > 0) {
      onRecordPayment?.(paymentModal.invoiceId, amt);
    }
    setPaymentModal({ isOpen: false, invoiceId: '', maxAmount: 0, amount: '' });
  };

  return (
    <div className="space-y-6">
      {/* Strategic Pitch Banner (Phase 4) */}
      <div className="bg-[#FFFDF9] border border-[#F3E1DD] rounded-2xl p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#006D77]/10 text-[#006D77] text-xs font-semibold mb-2">
              <Building2 className="w-3.5 h-3.5 text-[#D4A373]" />
              Wholesale & Distribution Engine
            </div>
            <h2 className="text-xl md:text-2xl font-serif font-bold text-stone-900 mb-1.5">
              “Evolving from selling to consumers into managing a distribution business.”
            </h2>
            <p className="text-stone-600 text-xs md:text-sm leading-relaxed">
              Equip your sales team to manage retail supermarket chains (Chandarana, Naivas, Healthy U) with tiered wholesale price lists, credit limits, delivery van routes, and aging receivables tracking.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-right">
              <span className="text-[10px] text-stone-400 uppercase font-bold block">Outstanding B2B Credit</span>
              <span className="text-lg font-serif font-bold text-[#006D77]">
                KSh {totalReceivables.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs">
          <span className="text-xs text-stone-500 font-medium block">Active Retail Accounts</span>
          <p className="text-2xl font-serif font-bold text-stone-900 mt-1">
            27 Stores
          </p>
          <span className="text-[11px] text-stone-500 mt-1 block">
            Across 4 key supermarket accounts
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs">
          <span className="text-xs text-stone-500 font-medium block">B2B Volume Invoiced</span>
          <p className="text-2xl font-serif font-bold text-[#006D77] mt-1">
            KSh {totalB2BInvoiced.toLocaleString()}
          </p>
          <span className="text-[11px] text-stone-500 mt-1 block">
            Net 14 & Net 30 terms
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs">
          <span className="text-xs text-stone-500 font-medium block">Outstanding Balance</span>
          <p className="text-2xl font-serif font-bold text-amber-700 mt-1">
            KSh {totalReceivables.toLocaleString()}
          </p>
          <span className="text-[11px] text-amber-600 font-medium mt-1 block">
            {overdueInvoices.length} overdue invoice
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs">
          <span className="text-xs text-stone-500 font-medium block">Distribution Fleet</span>
          <p className="text-2xl font-serif font-bold text-stone-900 mt-1">
            3 Van Routes
          </p>
          <span className="text-[11px] text-emerald-700 font-medium mt-1 block">
            Westlands, Karen & Central
          </span>
        </div>
      </div>

      {/* Main Section */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
        {/* Tab Navigation */}
        <div className="border-b border-stone-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('retailers')}
              className={`text-xs px-4 py-2 rounded-xl font-medium flex items-center gap-1.5 transition-all ${
                activeTab === 'retailers'
                  ? 'bg-[#006D77] text-white shadow-xs'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
              }`}
            >
              <Building2 className="w-4 h-4" />
              Retail Accounts & Chains ({retailers.length})
            </button>
            <button
              onClick={() => setActiveTab('invoices')}
              className={`text-xs px-4 py-2 rounded-xl font-medium flex items-center gap-1.5 transition-all ${
                activeTab === 'invoices'
                  ? 'bg-[#006D77] text-white shadow-xs'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
              }`}
            >
              <FileText className="w-4 h-4" />
              Wholesale Invoices ({invoices.length})
            </button>
            <button
              onClick={() => setActiveTab('pricelists')}
              className={`text-xs px-4 py-2 rounded-xl font-medium flex items-center gap-1.5 transition-all ${
                activeTab === 'pricelists'
                  ? 'bg-[#006D77] text-white shadow-xs'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              Wholesale Tiered Price List
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="text-xs pl-8 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#006D77]"
              />
            </div>
            {activeTab === 'retailers' && (
              <button 
                onClick={() => setRetailerModal({ isOpen: true, mode: 'add', data: {} })}
                className="flex items-center gap-1 bg-[#006D77] hover:bg-[#004D54] text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Retailer
              </button>
            )}
            {activeTab === 'invoices' && (
              <button 
                onClick={() => setInvoiceModal({ isOpen: true, mode: 'add', data: {} })}
                className="flex items-center gap-1 bg-[#006D77] hover:bg-[#004D54] text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Invoice
              </button>
            )}
          </div>
        </div>

        {/* Tab 1: Retail Accounts & Credit Limits */}
        {activeTab === 'retailers' && (
          <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-3">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">
                Retail Accounts
              </span>
              {filteredRetailers.map(ret => {
                const isSelected = selectedRetailer?.id === ret.id;
                return (
                  <div
                    key={ret.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isSelected
                        ? 'border-[#006D77] bg-white ring-2 ring-[#006D77]/10 shadow-xs'
                        : 'border-stone-200/80 bg-white hover:bg-stone-50 cursor-pointer'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1" onClick={() => setSelectedRetailer(ret)}>
                      <h4 className="font-serif font-bold text-stone-900 text-sm flex-1">
                        {ret.businessName}
                      </h4>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#006D77]/10 text-[#006D77] font-semibold">
                        {ret.branchesCount} Branches
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-xs text-stone-500" onClick={() => setSelectedRetailer(ret)}>
                        Buyer: {ret.contactPerson}
                      </p>
                      <div className="flex gap-1">
                        <button 
                          onClick={(e) => { e.stopPropagation(); setRetailerModal({ isOpen: true, mode: 'edit', data: ret }); }}
                          className="p-1 hover:bg-stone-200 rounded text-stone-500"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setDeleteConfirm({ isOpen: true, type: 'retailer', id: ret.id, title: ret.businessName }); }}
                          className="p-1 hover:bg-rose-100 rounded text-rose-500"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs pt-2 border-t border-stone-100" onClick={() => setSelectedRetailer(ret)}>
                      <span className="text-stone-400">Terms: {ret.creditTerms}</span>
                      <span className={`font-mono font-bold ${ret.currentBalance > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
                        Bal: KSh {ret.currentBalance.toLocaleString()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Retailer Detail Inspector */}
            <div className="lg:col-span-2 bg-white border border-[#F3E1DD] rounded-2xl p-5 shadow-xs">
                {selectedRetailer ? (
                  <div className="space-y-5">
                    <div className="border-b border-[#F3E1DD] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                          {selectedRetailer.tier}
                        </span>
                        <h3 className="font-serif font-bold text-2xl text-stone-900 mt-0.5">
                          {selectedRetailer.businessName}
                        </h3>
                        <p className="text-xs text-stone-600 mt-1 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#D4A373]" />
                          Delivery Territory: <span className="font-medium text-stone-800">{selectedRetailer.deliveryRoute}</span>
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-stone-400 block">Assigned Rep</span>
                        <span className="text-sm font-semibold text-[#006D77]">
                          {selectedRetailer.assignedRep}
                        </span>
                      </div>
                    </div>

                    {/* Credit Terms & Balance Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl border border-stone-200 text-center">
                      <div>
                        <span className="text-[10px] text-stone-400 uppercase font-semibold block">Credit Limit</span>
                        <span className="font-mono font-bold text-stone-900 text-sm">
                          KSh {selectedRetailer.creditLimit.toLocaleString()}
                        </span>
                      </div>
                      <div className="border-y sm:border-y-0 sm:border-x border-stone-200 py-2 sm:py-0">
                        <span className="text-[10px] text-stone-400 uppercase font-semibold block">Current Balance</span>
                        <span className="font-mono font-bold text-amber-700 text-sm">
                          KSh {selectedRetailer.currentBalance.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-400 uppercase font-semibold block">Payment Terms</span>
                        <span className="font-serif font-bold text-[#006D77] text-sm">
                          {selectedRetailer.creditTerms}
                        </span>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-xs space-y-2">
                      <span className="font-semibold text-stone-800 block">Procurement & Order Communication</span>
                      <div className="flex flex-wrap gap-4 text-stone-600">
                        <span className="flex items-center gap-1.5 font-mono">
                          <Phone className="w-3.5 h-3.5 text-stone-400" />
                          {selectedRetailer.phone}
                        </span>
                        <span className="flex items-center gap-1.5 font-mono">
                          <FileText className="w-3.5 h-3.5 text-stone-400" />
                          {selectedRetailer.email}
                        </span>
                      </div>
                    </div>

                    {/* Recent Invoices for this retailer */}
                    <div>
                      <h4 className="text-xs font-semibold text-stone-800 uppercase tracking-wider mb-2">
                        Invoices for {selectedRetailer.businessName}
                      </h4>
                      <div className="space-y-2">
                        {invoices.filter(i => i.retailerId === selectedRetailer.id).map(inv => (
                          <div key={inv.id} className="p-3 rounded-xl border border-stone-200 flex items-center justify-between text-xs">
                            <div>
                              <span className="font-mono font-bold text-[#006D77]">{inv.invoiceNumber}</span>
                              <span className="text-stone-400 text-[11px] ml-2">Due {inv.dueDate}</span>
                            </div>
                            <div className="text-right">
                              <span className="font-mono font-bold text-stone-900 block">KSh {inv.totalAmount.toLocaleString()}</span>
                              <span className="text-[10px] text-amber-700 font-semibold">Bal: KSh {inv.balance.toLocaleString()} ({inv.status})</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-stone-400">Select a retailer on the left</p>
                )}
              </div>
          </div>
        )}

        {/* Tab 2: Wholesale Invoices Table */}
        {activeTab === 'invoices' && (
          <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-500 font-semibold border-b border-stone-200 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Invoice #</th>
                    <th className="py-3 px-4">Retailer</th>
                    <th className="py-3 px-4">Issue Date</th>
                    <th className="py-3 px-4">Due Date</th>
                    <th className="py-3 px-4 text-right">Total Amount</th>
                    <th className="py-3 px-4 text-right">Balance Due</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {invoices.map(inv => {
                    const isOverdue = inv.status === 'Overdue';
                    return (
                      <tr key={inv.id} className="hover:bg-stone-50/70 transition-colors group">
                        <td className="py-3 px-4 font-mono font-bold text-[#006D77]">
                          {inv.invoiceNumber}
                        </td>
                        <td className="py-3 px-4 font-semibold text-stone-900">
                          {inv.retailerName}
                        </td>
                        <td className="py-3 px-4 text-stone-500 font-mono text-[11px]">{inv.issueDate}</td>
                        <td className="py-3 px-4 font-mono text-[11px] text-stone-600">{inv.dueDate}</td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-stone-900">
                          KSh {inv.totalAmount.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-amber-700">
                          KSh {inv.balance.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            isOverdue 
                              ? 'bg-rose-100 text-rose-800 border border-rose-200 animate-pulse'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {inv.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setPaymentModal({ isOpen: true, invoiceId: inv.id, maxAmount: inv.balance, amount: '' })}
                            className="text-[11px] px-2 py-1 rounded bg-[#006D77] text-white hover:bg-[#004D54] font-medium"
                            title="Record Payment"
                            disabled={inv.balance <= 0}
                          >
                            Pay
                          </button>
                          <button
                            onClick={() => setInvoiceModal({ isOpen: true, mode: 'edit', data: inv })}
                            className="p-1 hover:bg-stone-200 rounded text-stone-600"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm({ isOpen: true, type: 'invoice', id: inv.id, title: inv.invoiceNumber })}
                            className="p-1 hover:bg-rose-100 rounded text-rose-500"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Wholesale Tiered Pricing */}
        {activeTab === 'pricelists' && (
          <div className="p-6">
            <div className="mb-4">
              <h3 className="font-serif font-bold text-stone-900 text-base">
                Highland Gardens Official Wholesale Price Matrix
              </h3>
              <p className="text-xs text-stone-500">
                Tiered discounts based on minimum order quantities (MOQ) and retail chain partnerships
              </p>
            </div>

            <div className="overflow-x-auto border border-stone-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-500 text-[10px] uppercase border-b border-stone-200">
                  <tr>
                    <th className="py-3 px-4">Product Name & Unit</th>
                    <th className="py-3 px-4 text-right">Recommended Retail (RRP)</th>
                    <th className="py-3 px-4 text-right">Tier 1 Supermarket (Net 30)</th>
                    <th className="py-3 px-4 text-right">Specialty / Cafe (Net 14)</th>
                    <th className="py-3 px-4 text-right">Distributor Bulk (Cash/MOQ 100)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {products.map(prod => (
                    <tr key={prod.id} className="hover:bg-stone-50/50">
                      <td className="py-3 px-4">
                        <span className="font-semibold text-stone-900 block">{prod.name}</span>
                        <span className="text-[11px] text-stone-400 font-mono">{prod.sku} • {prod.unit}</span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-stone-700">
                        KSh {prod.retailPrice.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-[#006D77]">
                        KSh {prod.wholesalePrice.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-stone-800">
                        KSh {Math.round(prod.wholesalePrice * 1.05).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700">
                        KSh {Math.round(prod.wholesalePrice * 0.92).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Retailer Modal */}
      {retailerModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-2xl border border-stone-200 shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50 shrink-0">
              <h3 className="font-serif font-bold text-lg text-stone-900">
                {retailerModal.mode === 'add' ? 'Add Retail Account' : 'Edit Retail Account'}
              </h3>
              <button onClick={() => setRetailerModal({ isOpen: false, mode: 'add', data: {} })} className="p-2 hover:bg-stone-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-stone-500" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Business Name</label>
                  <input
                    type="text"
                    value={retailerModal.data.businessName || ''}
                    onChange={e => setRetailerModal(prev => ({ ...prev, data: { ...prev.data, businessName: e.target.value } }))}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-[#006D77]/20 focus:border-[#006D77]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Contact Person</label>
                  <input
                    type="text"
                    value={retailerModal.data.contactPerson || ''}
                    onChange={e => setRetailerModal(prev => ({ ...prev, data: { ...prev.data, contactPerson: e.target.value } }))}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-[#006D77]/20 focus:border-[#006D77]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={retailerModal.data.phone || ''}
                    onChange={e => setRetailerModal(prev => ({ ...prev, data: { ...prev.data, phone: e.target.value } }))}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-[#006D77]/20 focus:border-[#006D77]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={retailerModal.data.email || ''}
                    onChange={e => setRetailerModal(prev => ({ ...prev, data: { ...prev.data, email: e.target.value } }))}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-[#006D77]/20 focus:border-[#006D77]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Tier</label>
                  <select
                    value={retailerModal.data.tier || 'Tier 2 Independent Supermarket'}
                    onChange={e => setRetailerModal(prev => ({ ...prev, data: { ...prev.data, tier: e.target.value as any } }))}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-[#006D77]/20 focus:border-[#006D77]"
                  >
                    <option value="Tier 1 Key Account">Tier 1 Key Account</option>
                    <option value="Tier 2 Independent Supermarket">Tier 2 Independent Supermarket</option>
                    <option value="Health Store / Specialty">Health Store / Specialty</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Branches Count</label>
                  <input
                    type="number"
                    value={retailerModal.data.branchesCount || ''}
                    onChange={e => setRetailerModal(prev => ({ ...prev, data: { ...prev.data, branchesCount: Number(e.target.value) } }))}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-[#006D77]/20 focus:border-[#006D77]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Credit Terms</label>
                  <select
                    value={retailerModal.data.creditTerms || 'Net 14'}
                    onChange={e => setRetailerModal(prev => ({ ...prev, data: { ...prev.data, creditTerms: e.target.value as any } }))}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-[#006D77]/20 focus:border-[#006D77]"
                  >
                    <option value="Cash on Delivery">Cash on Delivery</option>
                    <option value="Net 14">Net 14</option>
                    <option value="Net 30">Net 30</option>
                    <option value="Net 60">Net 60</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Credit Limit</label>
                  <input
                    type="number"
                    value={retailerModal.data.creditLimit || ''}
                    onChange={e => setRetailerModal(prev => ({ ...prev, data: { ...prev.data, creditLimit: Number(e.target.value) } }))}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-[#006D77]/20 focus:border-[#006D77]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Current Balance</label>
                  <input
                    type="number"
                    value={retailerModal.data.currentBalance || ''}
                    onChange={e => setRetailerModal(prev => ({ ...prev, data: { ...prev.data, currentBalance: Number(e.target.value) } }))}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-[#006D77]/20 focus:border-[#006D77]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Assigned Rep</label>
                  <input
                    type="text"
                    value={retailerModal.data.assignedRep || ''}
                    onChange={e => setRetailerModal(prev => ({ ...prev, data: { ...prev.data, assignedRep: e.target.value } }))}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-[#006D77]/20 focus:border-[#006D77]"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Delivery Route</label>
                  <input
                    type="text"
                    value={retailerModal.data.deliveryRoute || ''}
                    onChange={e => setRetailerModal(prev => ({ ...prev, data: { ...prev.data, deliveryRoute: e.target.value } }))}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-[#006D77]/20 focus:border-[#006D77]"
                  />
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-stone-200 bg-stone-50 flex justify-end gap-3 shrink-0">
              <button onClick={() => setRetailerModal({ isOpen: false, mode: 'add', data: {} })} className="px-4 py-2 text-stone-600 hover:text-stone-900 text-xs font-medium">
                Cancel
              </button>
              <button onClick={handleSaveRetailer} className="px-4 py-2 bg-[#006D77] hover:bg-[#004D54] text-white rounded-xl text-xs font-medium transition-colors">
                Save Retailer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {invoiceModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-lg border border-stone-200 shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50 shrink-0">
              <h3 className="font-serif font-bold text-lg text-stone-900">
                {invoiceModal.mode === 'add' ? 'Create Invoice' : 'Edit Invoice'}
              </h3>
              <button onClick={() => setInvoiceModal({ isOpen: false, mode: 'add', data: {} })} className="p-2 hover:bg-stone-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-stone-500" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Invoice Number</label>
                <input
                  type="text"
                  value={invoiceModal.data.invoiceNumber || ''}
                  onChange={e => setInvoiceModal(prev => ({ ...prev, data: { ...prev.data, invoiceNumber: e.target.value } }))}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-[#006D77]/20 focus:border-[#006D77]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Retailer</label>
                <select
                  value={invoiceModal.data.retailerId || ''}
                  onChange={e => setInvoiceModal(prev => ({ ...prev, data: { ...prev.data, retailerId: e.target.value } }))}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-[#006D77]/20 focus:border-[#006D77]"
                >
                  <option value="">Select Retailer</option>
                  {retailers.map(r => (
                    <option key={r.id} value={r.id}>{r.businessName}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Issue Date</label>
                  <input
                    type="date"
                    value={invoiceModal.data.issueDate || ''}
                    onChange={e => setInvoiceModal(prev => ({ ...prev, data: { ...prev.data, issueDate: e.target.value } }))}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-[#006D77]/20 focus:border-[#006D77]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={invoiceModal.data.dueDate || ''}
                    onChange={e => setInvoiceModal(prev => ({ ...prev, data: { ...prev.data, dueDate: e.target.value } }))}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-[#006D77]/20 focus:border-[#006D77]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Total Amount</label>
                  <input
                    type="number"
                    value={invoiceModal.data.totalAmount || ''}
                    onChange={e => setInvoiceModal(prev => ({ ...prev, data: { ...prev.data, totalAmount: Number(e.target.value) } }))}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-[#006D77]/20 focus:border-[#006D77]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Paid Amount</label>
                  <input
                    type="number"
                    value={invoiceModal.data.paidAmount || ''}
                    onChange={e => setInvoiceModal(prev => ({ ...prev, data: { ...prev.data, paidAmount: Number(e.target.value) } }))}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-[#006D77]/20 focus:border-[#006D77]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Status</label>
                  <select
                    value={invoiceModal.data.status || 'Draft'}
                    onChange={e => setInvoiceModal(prev => ({ ...prev, data: { ...prev.data, status: e.target.value as any } }))}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-[#006D77]/20 focus:border-[#006D77]"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Sent">Sent</option>
                    <option value="Partially Paid">Partially Paid</option>
                    <option value="Paid">Paid</option>
                    <option value="Overdue">Overdue</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Items Count</label>
                  <input
                    type="number"
                    value={invoiceModal.data.itemsCount || ''}
                    onChange={e => setInvoiceModal(prev => ({ ...prev, data: { ...prev.data, itemsCount: Number(e.target.value) } }))}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-[#006D77]/20 focus:border-[#006D77]"
                  />
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-stone-200 bg-stone-50 flex justify-end gap-3 shrink-0">
              <button onClick={() => setInvoiceModal({ isOpen: false, mode: 'add', data: {} })} className="px-4 py-2 text-stone-600 hover:text-stone-900 text-xs font-medium">
                Cancel
              </button>
              <button onClick={handleSaveInvoice} className="px-4 py-2 bg-[#006D77] hover:bg-[#004D54] text-white rounded-xl text-xs font-medium transition-colors">
                Save Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      {paymentModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-sm border border-stone-200 shadow-xl overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50 shrink-0">
              <h3 className="font-serif font-bold text-lg text-stone-900">
                Record Payment
              </h3>
              <button onClick={() => setPaymentModal({ isOpen: false, invoiceId: '', maxAmount: 0, amount: '' })} className="p-2 hover:bg-stone-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-stone-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Amount to Pay</label>
                <input
                  type="number"
                  value={paymentModal.amount}
                  onChange={e => setPaymentModal(prev => ({ ...prev, amount: e.target.value }))}
                  placeholder={`Max: ${paymentModal.maxAmount}`}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-[#006D77]/20 focus:border-[#006D77]"
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-stone-200 bg-stone-50 flex justify-end gap-3 shrink-0">
              <button onClick={() => setPaymentModal({ isOpen: false, invoiceId: '', maxAmount: 0, amount: '' })} className="px-4 py-2 text-stone-600 hover:text-stone-900 text-xs font-medium">
                Cancel
              </button>
              <button onClick={handleSavePayment} className="px-4 py-2 bg-[#006D77] hover:bg-[#004D54] text-white rounded-xl text-xs font-medium transition-colors">
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-md border border-stone-200 shadow-xl overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-stone-200 flex items-center gap-3 bg-rose-50/50 shrink-0">
              <div className="p-2 bg-rose-100 text-rose-600 rounded-full">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-stone-900">
                Confirm Deletion
              </h3>
            </div>
            <div className="p-6">
              <p className="text-sm text-stone-600">
                Are you sure you want to delete <strong>{deleteConfirm.title}</strong>? This action cannot be undone.
              </p>
            </div>
            <div className="px-6 py-4 border-t border-stone-200 bg-stone-50 flex justify-end gap-3 shrink-0">
              <button onClick={() => setDeleteConfirm({ isOpen: false, type: 'retailer', id: '', title: '' })} className="px-4 py-2 text-stone-600 hover:text-stone-900 text-xs font-medium">
                Cancel
              </button>
              <button onClick={confirmDelete} className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-medium transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
