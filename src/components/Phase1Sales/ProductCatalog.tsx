import React, { useState } from 'react';
import { 
  Package, 
  Search, 
  AlertTriangle, 
  Plus, 
  Check, 
  Tag, 
  Edit3, 
  Trash2, 
  X, 
  Save, 
  Sparkles,
  DollarSign
} from 'lucide-react';
import { Product } from '../../types';

interface ProductCatalogProps {
  products: Product[];
  onAddProduct?: (product: Product) => void;
  onUpdateProduct?: (product: Product) => void;
  onDeleteProduct?: (productId: string) => void;
  onQuickOrder?: (product: Product) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onQuickOrder,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [stockFilter, setStockFilter] = useState<'All' | 'LowStock' | 'Healthy'>('All');

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    category: 'Herbal Tea',
    sku: '',
    retailPrice: 500,
    wholesalePrice: 400,
    costPrice: 200,
    unit: '100g pouch',
    currentStock: 50,
    minStockLevel: 25,
    description: '',
    tags: ['Fresh Batch'],
  });
  const [tagsInput, setTagsInput] = useState('Fresh Batch, Botanical');

  const categories = ['All', 'Herbal Tea', 'Gourmet Preserves', 'Raw Honey', 'Botanical Infusion'];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.sku.toLowerCase().includes(search.toLowerCase()) ||
                          p.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const isLow = p.currentStock <= p.minStockLevel;
    const matchesStock = stockFilter === 'All' || (stockFilter === 'LowStock' ? isLow : !isLow);
    return matchesSearch && matchesCategory && matchesStock;
  });

  const handleOpenAdd = () => {
    setEditingProduct(null);
    const skuCode = `HG-${Math.floor(100 + Math.random() * 900)}`;
    setFormData({
      name: '',
      category: 'Herbal Tea',
      sku: skuCode,
      retailPrice: 500,
      wholesalePrice: 400,
      costPrice: 220,
      unit: '100g pouch',
      currentStock: 60,
      minStockLevel: 20,
      description: 'Handcrafted artisan botanical product sourced from Kenyan high-altitude growers.',
      tags: ['New Release', 'Highland Origin'],
    });
    setTagsInput('New Release, Highland Origin');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setFormData({ ...p });
    setTagsInput(p.tags.join(', '));
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) return;

    const parsedTags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    if (editingProduct) {
      const updated: Product = {
        ...editingProduct,
        ...formData,
        name: formData.name.trim(),
        sku: formData.sku?.trim() || editingProduct.sku,
        retailPrice: Number(formData.retailPrice) || 0,
        wholesalePrice: Number(formData.wholesalePrice) || 0,
        costPrice: Number(formData.costPrice) || 0,
        currentStock: Number(formData.currentStock) || 0,
        minStockLevel: Number(formData.minStockLevel) || 0,
        unit: formData.unit || 'units',
        category: (formData.category as Product['category']) || 'Herbal Tea',
        description: formData.description || '',
        tags: parsedTags.length > 0 ? parsedTags : ['Botanical'],
      };
      if (onUpdateProduct) onUpdateProduct(updated);
    } else {
      const newProduct: Product = {
        id: `prod-${Date.now()}`,
        name: formData.name.trim(),
        category: (formData.category as Product['category']) || 'Herbal Tea',
        sku: formData.sku?.trim() || `HG-${Math.floor(100 + Math.random() * 900)}`,
        retailPrice: Number(formData.retailPrice) || 0,
        wholesalePrice: Number(formData.wholesalePrice) || 0,
        costPrice: Number(formData.costPrice) || 0,
        unit: formData.unit || 'units',
        currentStock: Number(formData.currentStock) || 0,
        minStockLevel: Number(formData.minStockLevel) || 0,
        description: formData.description || 'Premium botanical production item.',
        tags: parsedTags.length > 0 ? parsedTags : ['New Release'],
      };
      if (onAddProduct) onAddProduct(newProduct);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (onDeleteProduct) {
      onDeleteProduct(id);
    }
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/80 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-serif font-bold text-[#006D77] flex items-center gap-2">
              <Package className="w-5 h-5 text-[#D4A373]" />
              Product Catalogue & Inventory Pricing
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Manage finished products, adjust pricing, monitor unit margins, and restock levels
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs px-3 py-1.5 rounded-full bg-[#006D77]/10 text-[#006D77] font-medium font-mono">
              {products.length} Products Active
            </span>
            <span className="text-xs px-3 py-1.5 rounded-full bg-amber-50 text-amber-800 font-medium border border-amber-200/60">
              {products.filter(p => p.currentStock <= p.minStockLevel).length} Low Stock Alerts
            </span>
            <button
              onClick={handleOpenAdd}
              className="px-3.5 py-2 rounded-xl bg-[#006D77] hover:bg-[#005B63] text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by product name, SKU, or tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#006D77]/20 focus:border-[#006D77]"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-3 py-2 rounded-xl whitespace-nowrap font-medium transition-all ${
                  selectedCategory === cat 
                    ? 'bg-[#006D77] text-white shadow-xs' 
                    : 'bg-stone-100 hover:bg-stone-200/80 text-stone-600'
                }`}
              >
                {cat}
              </button>
            ))}
            <button
              onClick={() => setStockFilter(prev => prev === 'LowStock' ? 'All' : 'LowStock')}
              className={`text-xs px-3 py-2 rounded-xl whitespace-nowrap font-medium flex items-center gap-1.5 border transition-all ${
                stockFilter === 'LowStock'
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              Low Stock Only
            </button>
          </div>
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProducts.map(product => {
          const isLowStock = product.currentStock <= product.minStockLevel;
          const grossMargin = product.retailPrice > 0 
            ? Math.round(((product.retailPrice - product.costPrice) / product.retailPrice) * 100) 
            : 0;

          return (
            <div 
              key={product.id}
              className="bg-white rounded-2xl border border-stone-200/90 hover:border-[#006D77]/40 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between h-full"
            >
              <div className="p-5">
                {/* Top Badge Row & Action Icons */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-stone-100 text-stone-600 font-medium">
                    {product.sku}
                  </span>
                  
                  <div className="flex items-center gap-1.5">
                    {isLowStock ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 font-semibold border border-amber-300/80 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-amber-600" />
                        Low ({product.currentStock})
                      </span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-medium border border-emerald-200 flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-600" />
                        In Stock ({product.currentStock})
                      </span>
                    )}

                    <button
                      onClick={() => handleOpenEdit(product)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-[#006D77] hover:bg-stone-100 transition"
                      title="Edit Product"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(product.id)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition"
                      title="Delete Product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Name & Unit */}
                <h3 className="font-serif font-bold text-stone-900 text-base mb-1 leading-snug">
                  {product.name}
                </h3>
                <p className="text-xs text-stone-500 font-medium mb-2.5">
                  Unit: {product.unit} • Category: {product.category}
                </p>
                <p className="text-xs text-stone-600 leading-relaxed mb-3.5 line-clamp-2">
                  {product.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-3.5">
                  {product.tags.map(tag => (
                    <span 
                      key={tag} 
                      className={`text-[10px] px-2 py-0.5 rounded-md font-medium ${
                        tag === 'Best Seller'
                          ? 'bg-[#D4A373]/20 text-[#B58455] font-semibold'
                          : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Stock Progress Bar */}
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-100 mb-3.5">
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="text-stone-500 font-medium">Finished Stock</span>
                    <span className={`font-mono font-bold ${isLowStock ? 'text-amber-700' : 'text-stone-800'}`}>
                      {product.currentStock} units
                    </span>
                  </div>
                  <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        isLowStock ? 'bg-amber-500' : 'bg-[#006D77]'
                      }`}
                      style={{ 
                        width: `${Math.min(100, Math.max(8, (product.currentStock / (product.minStockLevel * 2.5 || 50)) * 100))}%` 
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                    <span>Min alert: {product.minStockLevel}</span>
                    <span>Safety target: {product.minStockLevel * 2}</span>
                  </div>
                </div>

                {/* Pricing Table */}
                <div className="grid grid-cols-3 gap-2 bg-[#FFFDF9] border border-[#F3E1DD] rounded-xl p-3 text-center">
                  <div>
                    <span className="block text-[10px] text-stone-400 uppercase font-medium">Retail</span>
                    <span className="font-serif font-bold text-stone-900 text-sm">
                      KSh {product.retailPrice.toLocaleString()}
                    </span>
                  </div>
                  <div className="border-x border-stone-200/60">
                    <span className="block text-[10px] text-stone-400 uppercase font-medium">Wholesale</span>
                    <span className="font-serif font-bold text-[#006D77] text-sm">
                      KSh {product.wholesalePrice.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-stone-400 uppercase font-medium">Margin</span>
                    <span className="font-mono font-bold text-emerald-700 text-sm">
                      {grossMargin}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="px-5 py-3.5 bg-stone-50/80 border-t border-stone-100 flex items-center justify-between">
                <span className="text-[11px] text-stone-500 font-mono">
                  Unit Cost: KSh {product.costPrice}
                </span>
                {onQuickOrder && (
                  <button
                    onClick={() => onQuickOrder(product)}
                    className="text-xs px-3 py-1.5 rounded-lg bg-[#006D77] text-white hover:bg-[#004D54] font-medium flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    New Order
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-[#006D77]/10 text-[#006D77] flex items-center justify-center">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-stone-900">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </h3>
                  <p className="text-xs text-stone-500">
                    {editingProduct ? `Update ${editingProduct.sku}` : 'Add a new finished SKU to catalogue'}
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
                <label className="font-semibold text-stone-700">Product Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Pure Chamomile Calming Infusion"
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
                    <option value="Herbal Tea">Herbal Tea</option>
                    <option value="Gourmet Preserves">Gourmet Preserves</option>
                    <option value="Raw Honey">Raw Honey</option>
                    <option value="Botanical Infusion">Botanical Infusion</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">SKU Code</label>
                  <input
                    type="text"
                    value={formData.sku || ''}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="e.g. HG-TEA-09"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Retail Price (KSh)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.retailPrice || 0}
                    onChange={(e) => setFormData({ ...formData, retailPrice: Number(e.target.value) })}
                    className="w-full px-2.5 py-2 rounded-xl border border-stone-300 font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Wholesale (KSh)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.wholesalePrice || 0}
                    onChange={(e) => setFormData({ ...formData, wholesalePrice: Number(e.target.value) })}
                    className="w-full px-2.5 py-2 rounded-xl border border-stone-300 font-bold text-[#006D77]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Cost Price (KSh)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.costPrice || 0}
                    onChange={(e) => setFormData({ ...formData, costPrice: Number(e.target.value) })}
                    className="w-full px-2.5 py-2 rounded-xl border border-stone-300 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Packaging Unit</label>
                  <input
                    type="text"
                    value={formData.unit || ''}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    placeholder="e.g. 100g pouch, 350g jar"
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
                  <label className="font-semibold text-stone-700">Min Alert Level</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.minStockLevel || 0}
                    onChange={(e) => setFormData({ ...formData, minStockLevel: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Description</label>
                <textarea
                  rows={2}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Aromatic tasting notes, botanical ingredients..."
                  className="w-full px-3 py-2 rounded-xl border border-stone-300"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="e.g. Best Seller, Organic, Mount Kenya"
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
                  <span>{editingProduct ? 'Save Changes' : 'Create Product'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-stone-200 text-center space-y-3">
            <div className="w-11 h-11 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-stone-900 text-base">Delete Product?</h3>
            <p className="text-xs text-stone-500">
              Are you sure you want to delete this product? This SKU will be permanently removed from catalogue and pricing lists.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
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
