import React, { useState } from 'react';
import { 
  Boxes, 
  Search, 
  AlertTriangle, 
  Plus, 
  ArrowRight, 
  Layers, 
  RefreshCw, 
  TrendingDown, 
  Package, 
  Clock,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Edit3,
  Trash2,
  X,
  Save
} from 'lucide-react';
import { RawMaterial, Product } from '../../types';

interface InventoryOverviewProps {
  rawMaterials: RawMaterial[];
  products: Product[];
  onAddStock?: (id: string, amount: number) => void;
  onNavigateToBatches: () => void;
  onAddRawMaterial?: (material: RawMaterial) => void;
  onUpdateRawMaterial?: (material: RawMaterial) => void;
  onDeleteRawMaterial?: (materialId: string) => void;
}

export const InventoryOverview: React.FC<InventoryOverviewProps> = ({
  rawMaterials,
  products,
  onAddStock,
  onNavigateToBatches,
  onAddRawMaterial,
  onUpdateRawMaterial,
  onDeleteRawMaterial,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'ingredients' | 'packaging' | 'finished'>('all');
  const [search, setSearch] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<RawMaterial | null>(null);
  const [materialToDelete, setMaterialToDelete] = useState<RawMaterial | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<RawMaterial>>({
    name: '',
    category: 'Ingredient',
    sku: '',
    unit: 'kg',
    currentStock: 100,
    minThreshold: 30,
    unitCost: 450,
    supplierName: 'Limuru Smallholder Organic Cooperative',
  });

  // Filters
  const filteredRaw = rawMaterials.filter(rm => {
    const matchesSearch = rm.name.toLowerCase().includes(search.toLowerCase()) || rm.sku.toLowerCase().includes(search.toLowerCase());
    if (activeTab === 'ingredients') return matchesSearch && rm.category === 'Ingredient';
    if (activeTab === 'packaging') return matchesSearch && (rm.category === 'Packaging' || rm.category === 'Label');
    if (activeTab === 'finished') return false;
    return matchesSearch;
  });

  const lowStockRaw = rawMaterials.filter(rm => rm.currentStock <= rm.minThreshold);
  const lowStockProducts = products.filter(p => p.currentStock <= p.minStockLevel);

  const handleOpenAdd = () => {
    setEditingMaterial(null);
    setFormData({
      name: '',
      category: 'Ingredient',
      sku: `RAW-${Math.floor(100 + Math.random() * 900)}`,
      unit: 'kg',
      currentStock: 120,
      minThreshold: 40,
      unitCost: 500,
      supplierName: 'Kericho Botanical Growers',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (rm: RawMaterial) => {
    setEditingMaterial(rm);
    setFormData({ ...rm });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) return;

    if (editingMaterial) {
      const updated: RawMaterial = {
        ...editingMaterial,
        name: formData.name.trim(),
        category: (formData.category as RawMaterial['category']) || 'Ingredient',
        sku: formData.sku?.trim() || editingMaterial.sku,
        unit: formData.unit || editingMaterial.unit,
        currentStock: Number(formData.currentStock) || 0,
        minThreshold: Number(formData.minThreshold) || 0,
        unitCost: Number(formData.unitCost) || 0,
        supplierName: formData.supplierName || editingMaterial.supplierName,
      };
      if (onUpdateRawMaterial) onUpdateRawMaterial(updated);
    } else {
      const newMat: RawMaterial = {
        id: `raw-${Date.now()}`,
        name: formData.name.trim(),
        category: (formData.category as RawMaterial['category']) || 'Ingredient',
        sku: formData.sku?.trim() || `RAW-${Math.floor(100 + Math.random() * 900)}`,
        unit: formData.unit || 'kg',
        currentStock: Number(formData.currentStock) || 0,
        minThreshold: Number(formData.minThreshold) || 0,
        unitCost: Number(formData.unitCost) || 0,
        supplierId: `sup-${Date.now()}`,
        supplierName: formData.supplierName || 'Verified Cooperative',
        lastRestocked: new Date().toISOString().substring(0, 10),
      };
      if (onAddRawMaterial) onAddRawMaterial(newMat);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (onDeleteRawMaterial) onDeleteRawMaterial(id);
    setMaterialToDelete(null);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-[#FFFDF9] border border-[#F3E1DD] rounded-2xl p-5 sm:p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#006D77]/10 text-[#006D77] text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#D4A373]" />
              Production & Inventory Management
            </div>
            <h2 className="text-xl md:text-2xl font-serif font-bold text-stone-900 mb-1.5">
              “Always know what you have, what you're producing, and what needs replenishing.”
            </h2>
            <p className="text-stone-600 text-xs md:text-sm leading-relaxed">
              Track raw herbs, honey drums, glass jars, and heat-seal pouches. When batches run, raw inputs are deducted and finished stock is credited automatically.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onNavigateToBatches}
              className="px-4 py-2.5 rounded-xl bg-[#006D77] hover:bg-[#004D54] text-white font-medium text-xs flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <span>Production Batches</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs">
          <span className="text-xs text-stone-500 font-medium block">Raw Ingredients</span>
          <p className="text-2xl font-serif font-bold text-stone-900 mt-1">
            {rawMaterials.filter(r => r.category === 'Ingredient').length} Lines
          </p>
          <span className="text-[11px] text-stone-500 mt-1 block">Organic herbs & honey</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs">
          <span className="text-xs text-stone-500 font-medium block">Packaging Materials</span>
          <p className="text-2xl font-serif font-bold text-stone-900 mt-1">
            {rawMaterials.filter(r => r.category === 'Packaging').length} Lines
          </p>
          <span className="text-[11px] text-stone-500 mt-1 block">Jars, pouches, shrink bands</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs">
          <span className="text-xs text-stone-500 font-medium block">Finished SKUs Stocked</span>
          <p className="text-2xl font-serif font-bold text-[#006D77] mt-1">
            {products.reduce((acc, p) => acc + p.currentStock, 0)} Units
          </p>
          <span className="text-[11px] text-stone-500 mt-1 block">Ready for dispatch</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs">
          <span className="text-xs text-stone-500 font-medium block">Low Stock Alerts</span>
          <p className="text-2xl font-serif font-bold text-amber-700 mt-1">
            {lowStockRaw.length + lowStockProducts.length} Items
          </p>
          <span className="text-[11px] text-amber-600 font-medium mt-1 block">Action required</span>
        </div>
      </div>

      {/* Main Stock Table Card */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
        {/* Table Filter Tabs */}
        <div className="p-4 border-b border-stone-200 bg-stone-50/70 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all ${
                activeTab === 'all'
                  ? 'bg-[#006D77] text-white shadow-xs font-semibold'
                  : 'bg-white text-stone-600 hover:bg-stone-200/70 border border-stone-200/60'
              }`}
            >
              All Raw Materials ({rawMaterials.length})
            </button>
            <button
              onClick={() => setActiveTab('ingredients')}
              className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all ${
                activeTab === 'ingredients'
                  ? 'bg-[#006D77] text-white shadow-xs font-semibold'
                  : 'bg-white text-stone-600 hover:bg-stone-200/70 border border-stone-200/60'
              }`}
            >
              Botanicals & Ingredients
            </button>
            <button
              onClick={() => setActiveTab('packaging')}
              className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all ${
                activeTab === 'packaging'
                  ? 'bg-[#006D77] text-white shadow-xs font-semibold'
                  : 'bg-white text-stone-600 hover:bg-stone-200/70 border border-stone-200/60'
              }`}
            >
              Packaging & Labels
            </button>
            <button
              onClick={() => setActiveTab('finished')}
              className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all ${
                activeTab === 'finished'
                  ? 'bg-[#006D77] text-white shadow-xs font-semibold'
                  : 'bg-white text-stone-600 hover:bg-stone-200/70 border border-stone-200/60'
              }`}
            >
              Finished Products ({products.length})
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-60">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter stock..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-stone-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#006D77]/20"
              />
            </div>

            {activeTab !== 'finished' && (
              <button
                onClick={handleOpenAdd}
                className="px-3 py-1.5 rounded-xl bg-[#006D77] hover:bg-[#005B63] text-white text-xs font-bold shadow-2xs transition flex items-center gap-1 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Material</span>
              </button>
            )}
          </div>
        </div>

        {activeTab === 'finished' ? (
          /* Finished Products view */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-500 font-semibold border-b border-stone-200 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">SKU / Product</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-right">Current Stock</th>
                  <th className="py-3 px-4 text-right">Min Threshold</th>
                  <th className="py-3 px-4 text-right">Wholesale KSh</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {products.map(prod => {
                  const isLow = prod.currentStock <= prod.minStockLevel;
                  return (
                    <tr key={prod.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-mono text-[10px] text-stone-400 block">{prod.sku}</span>
                        <span className="font-semibold text-stone-900">{prod.name}</span>
                        <span className="text-[11px] text-stone-500 block">Unit: {prod.unit}</span>
                      </td>
                      <td className="py-3 px-4 text-stone-600">{prod.category}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-stone-900 text-sm">
                        {prod.currentStock}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-stone-500">
                        {prod.minStockLevel}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-semibold text-[#006D77]">
                        KSh {prod.wholesalePrice.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {isLow ? (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold">
                            Low Stock
                          </span>
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium">
                            Healthy
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* Raw Materials & Packaging view */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-500 font-semibold border-b border-stone-200 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">SKU / Item Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Supplier</th>
                  <th className="py-3 px-4 text-right">Current Stock</th>
                  <th className="py-3 px-4 text-right">Reorder Point</th>
                  <th className="py-3 px-4 text-right">Unit Cost (KSh)</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredRaw.map(rm => {
                  const isLow = rm.currentStock <= rm.minThreshold;
                  return (
                    <tr key={rm.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-mono text-[10px] text-stone-400 block">{rm.sku}</span>
                        <span className="font-semibold text-stone-900">{rm.name}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-[10px] px-2 py-0.5 rounded-md font-medium ${
                          rm.category === 'Ingredient' ? 'bg-[#006D77]/10 text-[#006D77]' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {rm.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-stone-600">
                        {rm.supplierName}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-stone-900 text-sm">
                        {rm.currentStock} {rm.unit}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-stone-500">
                        {rm.minThreshold} {rm.unit}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-stone-700">
                        KSh {rm.unitCost}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {isLow ? (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold inline-flex items-center justify-center gap-1">
                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                            Low Stock
                          </span>
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium">
                            Adequate
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEdit(rm)}
                            className="p-1 rounded-lg text-stone-400 hover:text-[#006D77] hover:bg-stone-100 transition"
                            title="Edit Material"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setMaterialToDelete(rm)}
                            className="p-1 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition"
                            title="Delete Material"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Material Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-[#006D77]/10 text-[#006D77] flex items-center justify-center">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-stone-900">
                    {editingMaterial ? 'Edit Material' : 'Add Raw Material'}
                  </h3>
                  <p className="text-xs text-stone-500">
                    Inventory tracking and BOM input
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
                <label className="font-semibold text-stone-700">Material Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Dried Hibiscus Calyces (Grade A)"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                  >
                    <option value="Ingredient">Ingredient</option>
                    <option value="Packaging">Packaging</option>
                    <option value="Label">Label</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">SKU Code</label>
                  <input
                    type="text"
                    value={formData.sku || ''}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="e.g. RAW-HIB-01"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Unit</label>
                  <input
                    type="text"
                    value={formData.unit || ''}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    placeholder="kg, units, rolls"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Current Stock</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.currentStock || 0}
                    onChange={(e) => setFormData({ ...formData, currentStock: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Reorder Alert</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.minThreshold || 0}
                    onChange={(e) => setFormData({ ...formData, minThreshold: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Unit Cost (KSh)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.unitCost || 0}
                    onChange={(e) => setFormData({ ...formData, unitCost: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 font-bold text-[#006D77]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Supplier Name</label>
                  <input
                    type="text"
                    value={formData.supplierName || ''}
                    onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })}
                    placeholder="e.g. Limuru Cooperative"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300"
                  />
                </div>
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
                  <span>{editingMaterial ? 'Save Changes' : 'Create Material'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {materialToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-stone-200 text-center space-y-3">
            <div className="w-11 h-11 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-stone-900 text-base">Delete Material?</h3>
            <p className="text-xs text-stone-500">
              Are you sure you want to delete <strong>{materialToDelete.name}</strong> ({materialToDelete.sku})?
            </p>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setMaterialToDelete(null)}
                className="flex-1 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(materialToDelete.id)}
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
