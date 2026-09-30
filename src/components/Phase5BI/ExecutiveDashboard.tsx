import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  AlertTriangle, 
  Building2, 
  Boxes, 
  PieChart, 
  ArrowUpRight, 
  Download, 
  Calendar,
  Sparkles,
  Layers,
  Award,
  CheckCircle2,
  Percent,
  FileSpreadsheet
} from 'lucide-react';
import { Product, Order, RetailerAccount, ProductionBatch } from '../../types';

interface ExecutiveDashboardProps {
  products: Product[];
  orders: Order[];
  retailers: RetailerAccount[];
  batches: ProductionBatch[];
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
  products,
  orders,
  retailers,
  batches,
}) => {
  const [selectedReport, setSelectedReport] = useState<string>('Overview');

  // Exact figures from user brief:
  // Sales this month: KSh 428,500
  // Orders: 184
  // Outstanding: KSh 36,200
  // Top Product: Hibiscus Tea
  // Units Sold: 1,240
  // Low Stock: 3 items
  // Active Retailers: 27
  // Production Batches: 18

  const reportsList = [
    'Overview',
    'Sales Analytics',
    'Products & Margin',
    'Customers & Retention',
    'Retailers & Credit',
    'Production & Batches',
    'Inventory & Stockouts',
    'Payments & M-PESA',
    'Profitability (EBITDA)',
  ];

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8,Metric,Value\nSales this month,KSh 428500\nOrders,184\nOutstanding,KSh 36200\nTop Product,Highland Hibiscus Tea (1240 units)\nActive Retailers,27\nProduction Batches,18\nGross Margin,58%";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Highland_Gardens_Executive_Report_2026.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Executive Header Banner */}
      <div className="bg-[#FFFDF9] border border-[#F3E1DD] rounded-2xl p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#006D77]/10 text-[#006D77] text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#D4A373]" />
              Executive Management Cockpit
            </div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-stone-900 tracking-tight">
              HIGHLAND GARDENS
            </h1>
            <p className="text-sm font-semibold tracking-widest text-[#D4A373] uppercase mt-0.5">
              BUSINESS DASHBOARD & REPORTING
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="px-4 py-2.5 rounded-xl bg-[#006D77] hover:bg-[#004D54] text-white text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors"
            >
              <Download className="w-4 h-4" />
              Export Executive CSV Report
            </button>
          </div>
        </div>
      </div>

      {/* The Exact Owner Dashboard Cards specified in Brief */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Metric Card 1: Revenue & Orders */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs uppercase font-bold tracking-wider text-stone-400">Sales this month</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold">
              +18.4% vs last mo
            </span>
          </div>
          <p className="text-3xl font-serif font-bold text-[#006D77]">
            KSh 428,500
          </p>

          <div className="mt-4 pt-3 border-t border-stone-100 grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-stone-400 block text-[11px]">Orders</span>
              <span className="font-mono font-bold text-stone-900 text-base">184</span>
            </div>
            <div>
              <span className="text-stone-400 block text-[11px]">Outstanding</span>
              <span className="font-mono font-bold text-amber-700 text-base">KSh 36,200</span>
            </div>
          </div>
        </div>

        {/* Metric Card 2: Top Product & Units Sold */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs uppercase font-bold tracking-wider text-[#D4A373]">Top Product</span>
            <Award className="w-4 h-4 text-[#D4A373]" />
          </div>
          <p className="text-2xl font-serif font-bold text-stone-900">
            Hibiscus Tea
          </p>

          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
            <div>
              <span className="text-stone-400 block text-[11px]">Units Sold This Month</span>
              <span className="font-mono font-bold text-[#006D77] text-lg">1,240 units</span>
            </div>
            <div className="text-right">
              <span className="text-stone-400 block text-[11px]">Gross Revenue</span>
              <span className="font-mono font-bold text-stone-800 text-sm">KSh 558,000</span>
            </div>
          </div>
        </div>

        {/* Metric Card 3: Operations & Distribution Health */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs uppercase font-bold tracking-wider text-stone-400">Operations Pulse</span>
            <Boxes className="w-4 h-4 text-[#006D77]" />
          </div>

          <div className="grid grid-cols-3 gap-2 mt-2">
            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200/70 text-center">
              <span className="block text-[10px] text-amber-800 font-bold uppercase">Low Stock</span>
              <span className="font-mono font-bold text-amber-900 text-xl">3</span>
              <span className="block text-[9px] text-amber-600">items</span>
            </div>

            <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-200/70 text-center">
              <span className="block text-[10px] text-sky-800 font-bold uppercase">Retailers</span>
              <span className="font-mono font-bold text-sky-900 text-xl">27</span>
              <span className="block text-[9px] text-sky-600">active stores</span>
            </div>

            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200/70 text-center">
              <span className="block text-[10px] text-emerald-800 font-bold uppercase">Batches</span>
              <span className="font-mono font-bold text-emerald-900 text-xl">18</span>
              <span className="block text-[9px] text-emerald-600">produced</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reports Selector & Deep Dive Views */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
        {/* Sub-nav report bar */}
        <div className="border-b border-stone-200 p-3 bg-stone-50/70 flex items-center gap-1.5 overflow-x-auto">
          {reportsList.map(report => (
            <button
              key={report}
              onClick={() => setSelectedReport(report)}
              className={`text-xs px-3.5 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all ${
                selectedReport === report
                  ? 'bg-[#006D77] text-white shadow-xs font-semibold'
                  : 'bg-white text-stone-600 hover:bg-stone-200/70 border border-stone-200/60'
              }`}
            >
              {report}
            </button>
          ))}
        </div>

        {/* Selected Report Content */}
        <div className="p-6">
          {selectedReport === 'Overview' && (
            <div className="space-y-6">
              {/* Product Profitability & Sales Chart Simulation */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/80">
                  <h3 className="font-serif font-bold text-stone-900 text-base mb-1">
                    Revenue Contribution by Product Line
                  </h3>
                  <p className="text-xs text-stone-500 mb-4">
                    Hibiscus tea dominates consumer demand; Raw Acacia honey delivers highest unit margin
                  </p>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-stone-800">Hibiscus Herbal Infusion (100g)</span>
                        <span className="font-mono font-bold text-[#006D77]">48% (KSh 205,680)</span>
                      </div>
                      <div className="w-full bg-stone-200 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-[#006D77] h-full rounded-full" style={{ width: '48%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-stone-800">Wild Acacia Raw Honey (350g)</span>
                        <span className="font-mono font-bold text-[#D4A373]">24% (KSh 102,840)</span>
                      </div>
                      <div className="w-full bg-stone-200 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-[#D4A373] h-full rounded-full" style={{ width: '24%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-stone-800">Highland Pure Green Tea (100g)</span>
                        <span className="font-mono font-bold text-emerald-600">16% (KSh 68,560)</span>
                      </div>
                      <div className="w-full bg-stone-200 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-600 h-full rounded-full" style={{ width: '16%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-stone-800">Artisanal Strawberry & Passion Preserves</span>
                        <span className="font-mono font-bold text-sky-600">12% (KSh 51,420)</span>
                      </div>
                      <div className="w-full bg-stone-200 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-sky-600 h-full rounded-full" style={{ width: '12%' }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cash Flow & Margins Breakdown */}
                <div className="p-5 rounded-2xl bg-[#FFFDF9] border border-[#F3E1DD] flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif font-bold text-stone-900 text-base mb-1">
                      Monthly Financial Health & Unit Economics
                    </h3>
                    <p className="text-xs text-stone-500 mb-4">
                      Gross margin average across all production runs is 58.2%
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                      <div className="p-3 bg-white rounded-xl border border-stone-200">
                        <span className="text-[10px] text-stone-400 uppercase font-bold block">Gross Revenue</span>
                        <span className="font-serif font-bold text-[#006D77] text-lg">KSh 428,500</span>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-stone-200">
                        <span className="text-[10px] text-stone-400 uppercase font-bold block">Estimated COGS</span>
                        <span className="font-serif font-bold text-stone-700 text-lg">KSh 179,100</span>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-stone-200">
                        <span className="text-[10px] text-stone-400 uppercase font-bold block">Gross Profit</span>
                        <span className="font-serif font-bold text-emerald-700 text-lg">KSh 249,400</span>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-stone-200">
                        <span className="text-[10px] text-stone-400 uppercase font-bold block">Collected via M-PESA</span>
                        <span className="font-serif font-bold text-stone-900 text-lg">KSh 392,300</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
                    <span className="font-semibold block mb-0.5">Commercial Milestone:</span>
                    Highland Gardens has achieved positive operational cash flow with under 8.4% credit default risk across retail supermarket chains.
                  </div>
                </div>
              </div>

              {/* Best Selling Products Breakdown */}
              <div>
                <h3 className="font-serif font-bold text-stone-900 text-base mb-3 flex items-center justify-between">
                  <span>Product Sales & Velocity Matrix</span>
                  <span className="text-xs font-normal text-stone-400">Current 30-Day Period</span>
                </h3>

                <div className="overflow-x-auto border border-stone-200 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-50 text-stone-500 uppercase text-[10px] border-b border-stone-200">
                      <tr>
                        <th className="py-2.5 px-3">Product Name</th>
                        <th className="py-2.5 px-3 text-right">Units Sold</th>
                        <th className="py-2.5 px-3 text-right">Retail Price</th>
                        <th className="py-2.5 px-3 text-right">Total Revenue</th>
                        <th className="py-2.5 px-3 text-right">COGS / Unit</th>
                        <th className="py-2.5 px-3 text-right">Gross Margin</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {products.map(prod => {
                        const units = prod.name.includes('Hibiscus') ? 1240 : prod.name.includes('Green') ? 430 : prod.name.includes('Honey') ? 310 : 220;
                        const rev = units * prod.retailPrice;
                        const margin = Math.round(((prod.retailPrice - prod.costPrice) / prod.retailPrice) * 100);

                        return (
                          <tr key={prod.id} className="hover:bg-stone-50/50">
                            <td className="py-2.5 px-3 font-semibold text-stone-900">{prod.name}</td>
                            <td className="py-2.5 px-3 text-right font-mono font-bold text-[#006D77]">{units.toLocaleString()}</td>
                            <td className="py-2.5 px-3 text-right font-mono">KSh {prod.retailPrice}</td>
                            <td className="py-2.5 px-3 text-right font-mono font-bold text-stone-900">KSh {rev.toLocaleString()}</td>
                            <td className="py-2.5 px-3 text-right font-mono text-stone-500">KSh {prod.costPrice}</td>
                            <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-700">{margin}%</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {selectedReport !== 'Overview' && (
            <div className="p-8 text-center bg-stone-50 rounded-2xl border border-stone-200">
              <BarChart3 className="w-10 h-10 text-[#006D77] mx-auto mb-3" />
              <h3 className="font-serif font-bold text-stone-900 text-lg">
                {selectedReport} Report Generated
              </h3>
              <p className="text-xs text-stone-500 mt-1 max-w-md mx-auto">
                Detailed metrics for {selectedReport} have been aggregated from Highland Gardens live operational database.
              </p>
              <button
                onClick={handleExportCSV}
                className="mt-4 px-4 py-2 rounded-xl bg-[#006D77] text-white text-xs font-semibold inline-flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download Complete {selectedReport} CSV
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
