import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  Phone, 
  Mail, 
  MapPin, 
  Star, 
  Package, 
  CheckCircle2,
  Clock,
  Plus,
  Edit3,
  Trash2,
  X,
  Save
} from 'lucide-react';
import { Supplier, RawMaterial } from '../../types';

interface SuppliersListProps {
  suppliers: Supplier[];
  rawMaterials: RawMaterial[];
  onAddSupplier?: (supplier: Supplier) => void;
  onUpdateSupplier?: (supplier: Supplier) => void;
  onDeleteSupplier?: (supplierId: string) => void;
}

export const SuppliersList: React.FC<SuppliersListProps> = ({
  suppliers,
  rawMaterials,
  onAddSupplier,
  onUpdateSupplier,
  onDeleteSupplier,
}) => {
  const [search, setSearch] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Supplier>>({
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    location: '',
    itemsSupplied: [],
    reliabilityRating: 5,
  });
  const [itemsSuppliedInput, setItemsSuppliedInput] = useState('');

  const filteredSuppliers = suppliers.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.location.toLowerCase().includes(search.toLowerCase()) ||
    s.itemsSupplied.some(item => item.toLowerCase().includes(search.toLowerCase()))
  );

  const handleOpenAdd = () => {
    setEditingSupplier(null);
    setFormData({
      name: '',
      contactPerson: '',
      phone: '+254 7',
      email: '',
      location: 'Limuru, Kiambu County',
      reliabilityRating: 5,
    });
    setItemsSuppliedInput('Organic Dried Herbs, Botanicals');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (sup: Supplier) => {
    setEditingSupplier(sup);
    setFormData({ ...sup });
    setItemsSuppliedInput(sup.itemsSupplied.join(', '));
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) return;

    const items = itemsSuppliedInput
      .split(',')
      .map(i => i.trim())
      .filter(Boolean);

    if (editingSupplier) {
      const updated: Supplier = {
        ...editingSupplier,
        name: formData.name.trim(),
        contactPerson: formData.contactPerson?.trim() || editingSupplier.contactPerson,
        phone: formData.phone?.trim() || editingSupplier.phone,
        email: formData.email?.trim() || editingSupplier.email,
        location: formData.location?.trim() || editingSupplier.location,
        reliabilityRating: Number(formData.reliabilityRating) || 5,
        itemsSupplied: items.length > 0 ? items : editingSupplier.itemsSupplied,
      };
      if (onUpdateSupplier) onUpdateSupplier(updated);
    } else {
      const newSup: Supplier = {
        id: `sup-${Date.now()}`,
        name: formData.name.trim(),
        contactPerson: formData.contactPerson?.trim() || 'Cooperative Lead',
        phone: formData.phone?.trim() || '+254 700 000 000',
        email: formData.email?.trim() || 'info@supplier.co.ke',
        location: formData.location?.trim() || 'Kenya',
        reliabilityRating: Number(formData.reliabilityRating) || 5,
        itemsSupplied: items.length > 0 ? items : ['Botanicals'],
      };
      if (onAddSupplier) onAddSupplier(newSup);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (onDeleteSupplier) onDeleteSupplier(id);
    setSupplierToDelete(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-serif font-bold text-[#006D77] flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#D4A373]" />
              Supplier Master Records & Sourcing
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Verified Kenyan smallholder cooperatives, glass packaging manufacturers, and organic botanical partners
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs px-3 py-1.5 rounded-full bg-[#006D77]/10 text-[#006D77] font-medium font-mono">
              {suppliers.length} Key Partners
            </span>
            <button
              onClick={handleOpenAdd}
              className="px-3.5 py-2 rounded-xl bg-[#006D77] hover:bg-[#005B63] text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Supplier</span>
            </button>
          </div>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search suppliers by name, region, or supplied ingredient..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#006D77]/20"
          />
        </div>
      </div>

      {/* Supplier Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredSuppliers.map(supplier => {
          const supplierMaterials = rawMaterials.filter(rm => rm.supplierId === supplier.id);

          return (
            <div key={supplier.id} className="bg-white rounded-2xl border border-stone-200/90 shadow-xs p-5 hover:border-[#006D77]/40 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h3 className="font-serif font-bold text-stone-900 text-base">
                      {supplier.name}
                    </h3>
                    <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-[#D4A373]" />
                      {supplier.location}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg text-xs font-bold text-amber-800">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                      <span>{supplier.reliabilityRating}</span>
                    </div>

                    <button
                      onClick={() => handleOpenEdit(supplier)}
                      className="p-1 rounded-lg text-stone-400 hover:text-[#006D77] hover:bg-stone-100 transition"
                      title="Edit Supplier"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setSupplierToDelete(supplier)}
                      className="p-1 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition"
                      title="Delete Supplier"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 my-3 text-xs bg-stone-50 p-3 rounded-xl border border-stone-100">
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase font-semibold block">Contact Person</span>
                    <span className="font-medium text-stone-800">{supplier.contactPerson}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase font-semibold block">Phone</span>
                    <a href={`tel:${supplier.phone}`} className="font-mono text-[#006D77] hover:underline">
                      {supplier.phone}
                    </a>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[10px] text-stone-400 uppercase font-semibold block">Email</span>
                    <a href={`mailto:${supplier.email}`} className="text-stone-700 hover:underline">
                      {supplier.email}
                    </a>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] text-stone-400 uppercase font-semibold block">Supplied Inputs & Materials</span>
                  <div className="flex flex-wrap gap-1.5">
                    {supplier.itemsSupplied.map((item, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] px-2.5 py-0.5 rounded-md bg-[#006D77]/5 text-[#006D77] font-medium border border-[#006D77]/10"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {supplierMaterials.length > 0 && (
                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                  <span>Linked Inventory Lines:</span>
                  <span className="font-mono font-semibold text-stone-800">
                    {supplierMaterials.length} materials currently active
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add / Edit Supplier Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-[#006D77]/10 text-[#006D77] flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-stone-900">
                    {editingSupplier ? 'Edit Supplier' : 'Add Sourcing Partner'}
                  </h3>
                  <p className="text-xs text-stone-500">
                    Cooperative grower or packaging supplier
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
                <label className="font-semibold text-stone-700">Company / Cooperative Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Limuru Organic Tea Cooperative"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Contact Person</label>
                  <input
                    type="text"
                    value={formData.contactPerson || ''}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    placeholder="e.g. Francis Kariuki"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Phone</label>
                  <input
                    type="text"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+254 7XX XXX XXX"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Email Address</label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="supply@farm.co.ke"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Location / Region</label>
                  <input
                    type="text"
                    value={formData.location || ''}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Limuru, Kiambu"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Reliability Rating (1 to 5 Stars)</label>
                <select
                  value={formData.reliabilityRating || 5}
                  onChange={(e) => setFormData({ ...formData, reliabilityRating: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                >
                  <option value={5}>5 Stars - Premium Verified</option>
                  <option value={4}>4 Stars - Consistent Quality</option>
                  <option value={3}>3 Stars - Standard</option>
                  <option value={2}>2 Stars - Occasional Delays</option>
                  <option value={1}>1 Star - Under Review</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Supplied Items (comma separated)</label>
                <input
                  type="text"
                  value={itemsSuppliedInput}
                  onChange={(e) => setItemsSuppliedInput(e.target.value)}
                  placeholder="e.g. Hibiscus Calyces, Green Tea Leaves, Glass Jars"
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
                  <span>{editingSupplier ? 'Save Changes' : 'Create Supplier'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {supplierToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-stone-200 text-center space-y-3">
            <div className="w-11 h-11 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-stone-900 text-base">Delete Supplier?</h3>
            <p className="text-xs text-stone-500">
              Are you sure you want to remove <strong>{supplierToDelete.name}</strong> from your suppliers directory?
            </p>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSupplierToDelete(null)}
                className="flex-1 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(supplierToDelete.id)}
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
