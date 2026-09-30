import React from 'react';
import { 
  TrendingUp, 
  ShoppingCart, 
  Smartphone, 
  Truck, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  MessageSquare, 
  Plus, 
  Layers, 
  ArrowUpRight,
  ShieldCheck,
  Package
} from 'lucide-react';
import { Order, Product, Customer } from '../../types';

interface SalesDashboardProps {
  orders: Order[];
  products: Product[];
  customers: Customer[];
  onOpenWhatsAppModal: () => void;
  onOpenNewOrderModal: () => void;
  onNavigateToTab: (tab: string) => void;
  onSelectOrder: (order: Order) => void;
}

export const SalesDashboard: React.FC<SalesDashboardProps> = ({
  orders,
  products,
  customers,
  onOpenWhatsAppModal,
  onOpenNewOrderModal,
  onNavigateToTab,
  onSelectOrder,
}) => {
  // Calculations
  const totalRevenue = orders.reduce((acc, o) => acc + o.totalAmount, 0);
  const paidOrders = orders.filter(o => o.paymentStatus.includes('Paid'));
  const paidRevenue = paidOrders.reduce((acc, o) => acc + o.totalAmount, 0);
  const pendingOrders = orders.filter(o => o.paymentStatus === 'Pending');
  const activeDeliveries = orders.filter(o => o.status === 'Dispatched' || o.status === 'In Production');
  const mpesaReconciliationRate = orders.length > 0 ? Math.round((paidOrders.length / orders.length) * 100) : 0;

  // Channel breakdown
  const channelCounts = {
    WhatsApp: orders.filter(o => o.channel === 'WhatsApp').length,
    Website: orders.filter(o => o.channel === 'Website').length,
    Direct: orders.filter(o => o.channel === 'Direct Call').length,
    Wholesale: orders.filter(o => o.channel === 'Wholesale / Retailer').length,
  };

  return (
    <div className="space-y-6">
      {/* Strategic Pitch Banner (Phase 1 value proposition) */}
      <div className="bg-gradient-to-r from-[#006D77] to-[#004D54] rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/5 rounded-full pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4A373]/30 text-[#FFFDF9] text-xs font-semibold mb-2 backdrop-blur-xs">
              <span className="w-2 h-2 rounded-full bg-[#D4A373] animate-pulse" />
              Sales & Customer Operations Engine
            </div>
            <h2 className="text-xl md:text-2xl font-serif font-bold text-white mb-1.5">
              “Putting customers, orders and payments into one clear system.”
            </h2>
            <p className="text-stone-200 text-xs md:text-sm leading-relaxed">
              Replacing lost WhatsApp order notes, scattered M-PESA SMS receipts, and manual Excel tracking with real-time order intake and automated Daraja STK reconciliation.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap gap-2.5 shrink-0">
            <button
              onClick={onOpenWhatsAppModal}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-xs flex items-center gap-2 shadow-sm transition-transform active:scale-95"
            >
              <MessageSquare className="w-4 h-4" />
              WhatsApp Capture
            </button>
            <button
              onClick={onOpenNewOrderModal}
              className="px-4 py-2.5 rounded-xl bg-[#D4A373] hover:bg-[#B58455] text-stone-900 font-medium text-xs flex items-center gap-2 shadow-sm transition-transform active:scale-95"
            >
              <Plus className="w-4 h-4" />
              New Order Intake
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-medium">Orders Intake</span>
            <div className="w-8 h-8 rounded-lg bg-[#006D77]/10 flex items-center justify-center text-[#006D77]">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-serif font-bold text-stone-900">
            {orders.length}
          </p>
          <div className="flex items-center gap-1.5 mt-1 text-[11px] text-emerald-700">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Active queue today</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-medium">Total Sales Volume</span>
            <div className="w-8 h-8 rounded-lg bg-[#D4A373]/20 flex items-center justify-center text-[#B58455]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-serif font-bold text-[#006D77]">
            KSh {totalRevenue.toLocaleString()}
          </p>
          <div className="flex items-center gap-1 mt-1 text-[11px] text-stone-500">
            <span>KSh {paidRevenue.toLocaleString()} cleared</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-medium">M-PESA Cleared</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Smartphone className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-serif font-bold text-stone-900">
            {mpesaReconciliationRate}%
          </p>
          <div className="flex items-center gap-1.5 mt-1 text-[11px] text-amber-700">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{pendingOrders.length} awaiting payment</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-medium">Active Deliveries</span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-serif font-bold text-stone-900">
            {activeDeliveries.length}
          </p>
          <div className="flex items-center gap-1 mt-1 text-[11px] text-stone-500">
            <span>En route or packing</span>
          </div>
        </div>
      </div>

      {/* Two Column Grid: Order Channels & Fast Order Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Intake Channels & Low Stock Alerts */}
        <div className="space-y-6">
          {/* Order Intake Channels */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs">
            <h3 className="font-serif font-bold text-stone-900 text-sm mb-3 flex items-center justify-between">
              <span>Orders by Intake Channel</span>
              <span className="text-xs text-stone-400 font-sans font-normal">{orders.length} total</span>
            </h3>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-stone-700 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                    WhatsApp Messages
                  </span>
                  <span className="font-mono font-bold text-stone-900">{channelCounts.WhatsApp} orders</span>
                </div>
                <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full rounded-full" 
                    style={{ width: `${(channelCounts.WhatsApp / Math.max(1, orders.length)) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-stone-700 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#006D77]" />
                    Direct Phone / Walk-in
                  </span>
                  <span className="font-mono font-bold text-stone-900">{channelCounts.Direct} orders</span>
                </div>
                <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#006D77] h-full rounded-full" 
                    style={{ width: `${(channelCounts.Direct / Math.max(1, orders.length)) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-stone-700 flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-sky-600" />
                    Website Direct Orders
                  </span>
                  <span className="font-mono font-bold text-stone-900">{channelCounts.Website} orders</span>
                </div>
                <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-sky-500 h-full rounded-full" 
                    style={{ width: `${(channelCounts.Website / Math.max(1, orders.length)) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-stone-700 flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5 text-[#D4A373]" />
                    Retail & Wholesale
                  </span>
                  <span className="font-mono font-bold text-stone-900">{channelCounts.Wholesale} orders</span>
                </div>
                <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#D4A373] h-full rounded-full" 
                    style={{ width: `${(channelCounts.Wholesale / Math.max(1, orders.length)) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-stone-100 bg-[#FFFDF9] -mx-5 -mb-5 p-4 rounded-b-2xl">
              <p className="text-[11px] text-stone-500 leading-snug">
                <span className="font-semibold text-[#006D77]">Kenya Market Insight:</span> Over 60% of Highland Gardens individual buyers order through WhatsApp conversational sales with M-PESA Buy Goods till checkout.
              </p>
            </div>
          </div>

          {/* Quick Low Stock Watch */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-serif font-bold text-stone-900 text-sm flex items-center gap-1.5">
                <Package className="w-4 h-4 text-amber-600" />
                Finished Goods Stock Watch
              </h3>
              <button 
                onClick={() => onNavigateToTab('catalog')}
                className="text-xs text-[#006D77] hover:underline font-medium"
              >
                View Catalog
              </button>
            </div>

            <div className="space-y-2.5">
              {products.slice(0, 3).map(prod => (
                <div key={prod.id} className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 text-xs">
                  <div>
                    <span className="font-medium text-stone-800 block">{prod.name}</span>
                    <span className="text-[11px] text-stone-500">{prod.unit}</span>
                  </div>
                  <div className="text-right">
                    <span className={`font-mono font-bold ${
                      prod.currentStock <= prod.minStockLevel ? 'text-amber-700' : 'text-stone-800'
                    }`}>
                      {prod.currentStock} units
                    </span>
                    <span className="block text-[10px] text-stone-400">min {prod.minStockLevel}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live Order Stream */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-serif font-bold text-stone-900 text-base">
                  Live Orders & Fulfillment Stream
                </h3>
                <p className="text-xs text-stone-500">
                  Click any order to inspect invoice, update delivery status, or reconcile M-PESA
                </p>
              </div>
              <button
                onClick={() => onNavigateToTab('orders')}
                className="text-xs px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium flex items-center gap-1 transition-colors"
              >
                View Full Queue ({orders.length})
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {orders.slice(0, 5).map(order => {
                const isPaid = order.paymentStatus.includes('Paid');

                return (
                  <div
                    key={order.id}
                    onClick={() => onSelectOrder(order)}
                    className="p-3.5 rounded-xl border border-stone-200/80 hover:border-[#006D77] hover:shadow-xs transition-all cursor-pointer bg-stone-50/50 hover:bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        order.channel === 'WhatsApp'
                          ? 'bg-emerald-100 text-emerald-700'
                          : order.channel === 'Website'
                          ? 'bg-sky-100 text-sky-700'
                          : 'bg-[#006D77]/10 text-[#006D77]'
                      }`}>
                        {order.channel === 'WhatsApp' ? <MessageSquare className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-[#006D77]">
                            {order.orderNumber}
                          </span>
                          <span className="font-medium text-stone-800 text-xs">
                            {order.customerName}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-500 mt-0.5 line-clamp-1">
                          {order.items.map(i => `${i.quantity}x ${i.productName}`).join(', ')}
                        </p>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-stone-100 shrink-0">
                      <span className="font-serif font-bold text-stone-900 text-sm">
                        KSh {order.totalAmount.toLocaleString()}
                      </span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          isPaid ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}>
                          {order.paymentStatus}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-200/70 text-stone-700 font-medium">
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#006D77]" />
              Automated M-PESA Safaricom STK integration active
            </span>
            <span className="text-[11px] font-mono text-stone-400">
              Highland Gardens ERP v1.0
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
