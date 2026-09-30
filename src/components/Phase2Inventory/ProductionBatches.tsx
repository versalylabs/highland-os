import React, { useState } from 'react';
import { 
  Boxes, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Search, 
  Sparkles, 
  ShieldCheck, 
  User, 
  Tag,
  ArrowRight,
  X,
  Edit3,
  Trash2,
  Save
} from 'lucide-react';
import { ProductionBatch, Product, RawMaterial } from '../../types';

interface ProductionBatchesProps {
  batches: ProductionBatch[];
  products: Product[];
  rawMaterials: RawMaterial[];
  onCreateBatch: (batch: Partial<ProductionBatch>) => void;
  onUpdateBatch?: (batch: ProductionBatch) => void;
  onDeleteBatch?: (batchId: string) => void;
  onUpdateBatchStatus?: (batchId: string, status: ProductionBatch['status']) => void;
}

export const ProductionBatches: React.FC<ProductionBatchesProps> = ({
  batches,
  products,
  rawMaterials,
  onCreateBatch,
  onUpdateBatch,
  onDeleteBatch,
  onUpdateBatchStatus,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState<ProductionBatch | null>(null);
  const [batchToDelete, setBatchToDelete] = useState<ProductionBatch | null>(null);

  // Form state
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [quantityPlanned, setQuantityPlanned] = useState(250);
  const [quantityActual, setQuantityActual] = useState(250);
  const [operatorName, setOperatorName] = useState('Samuel Kariuki');
  const [notes, setNotes] = useState('');
  const [batchStatus, setBatchStatus] = useState<ProductionBatch['status']>('In Progress');

  const filteredBatches = batches.filter(b => {
    const matchesSearch = b.batchNumber.toLowerCase().includes(search.toLowerCase()) ||
                          b.productName.toLowerCase().includes(search.toLowerCase()) ||
                          b.operatorName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenAdd = () => {
    setEditingBatch(null);
    setSelectedProductId(products[0]?.id || '');
    setQuantityPlanned(250);
    setQuantityActual(250);
    setOperatorName('Samuel Kariuki');
    setNotes('Standard batch production run per Highland Gardens GMP procedure.');
    setBatchStatus('In Progress');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (batch: ProductionBatch) => {
    setEditingBatch(batch);
    setSelectedProductId(batch.productId);
    setQuantityPlanned(batch.quantityPlanned);
    setQuantityActual(batch.quantityActual);
    setOperatorName(batch.operatorName);
    setNotes(batch.notes || '');
    setBatchStatus(batch.status);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const prod = products.find(p => p.id === selectedProductId);
    if (!prod) return;

    if (editingBatch) {
      if (onUpdateBatch) {
        onUpdateBatch({
          ...editingBatch,
          productId: prod.id,
          productName: prod.name,
          quantityPlanned: Number(quantityPlanned),
          quantityActual: Number(quantityActual),
          unit: prod.unit,
          operatorName,
          status: batchStatus,
          notes,
        });
      }
    } else {
      const newBatchNumber = `HG-2026-${prod.name.includes('Hibiscus') ? 'HB' : prod.name.includes('Honey') ? 'HN' : 'PR'}${Math.floor(10 + Math.random() * 90)}`;
      const today = new Date().toISOString().split('T')[0];
      const expiryDate = new Date(Date.now() + 540 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      onCreateBatch({
        batchNumber: newBatchNumber,
        productId: prod.id,
        productName: prod.name,
        quantityPlanned: Number(quantityPlanned),
        quantityActual: Number(quantityPlanned),
        unit: prod.unit,
        startDate: today,
        bestBeforeDate: expiryDate,
        status: batchStatus,
        operatorName,
        rawMaterialsUsed: [
          { materialId: rawMaterials[0]?.id || 'raw-1', materialName: rawMaterials[0]?.name || 'Botanical Herb', quantityUsed: Math.round(Number(quantityPlanned) * 0.1), unit: 'kg' },
          { materialId: rawMaterials[3]?.id || 'raw-4', materialName: rawMaterials[3]?.name || 'Packaging Units', quantityUsed: Number(quantityPlanned), unit: 'units' },
        ],
        notes: notes || 'Standard batch production run per Highland Gardens GMP procedure.',
      });
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (onDeleteBatch) onDeleteBatch(id);
    setBatchToDelete(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/80 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-serif font-bold text-[#006D77] flex items-center gap-2">
              <Boxes className="w-5 h-5 text-[#D4A373]" />
              Production Batches & Traceability
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Unique batch lot numbers, planned vs actual yields, best-before dates, and automated raw material consumption
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs px-3 py-1.5 rounded-full bg-[#006D77]/10 text-[#006D77] font-medium font-mono">
              {batches.length} Batches Logged
            </span>
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2 rounded-xl bg-[#006D77] hover:bg-[#004D54] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Launch Batch</span>
            </button>
          </div>
        </div>

        {/* Filter controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search batches by batch #, product, or lead operator..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#006D77]/20"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {['All', 'In Progress', 'Quality Review', 'Approved', 'Scheduled', 'Rejected'].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`text-xs px-3 py-2 rounded-xl whitespace-nowrap font-medium transition-all ${
                  statusFilter === st
                    ? 'bg-[#006D77] text-white shadow-xs font-bold'
                    : 'bg-stone-100 hover:bg-stone-200/80 text-stone-600'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Batch Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredBatches.map(batch => {
          const isApproved = batch.status === 'Approved';
          const isReview = batch.status === 'Quality Review';

          return (
            <div key={batch.id} className="bg-white rounded-2xl border border-stone-200/90 shadow-xs p-5 hover:border-[#006D77]/40 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-[#006D77]">
                        {batch.batchNumber}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isApproved 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : isReview 
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {batch.status}
                      </span>
                    </div>
                    <h3 className="font-serif font-bold text-stone-900 text-base mt-1">
                      {batch.productName}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(batch)}
                      className="p-1 rounded-lg text-stone-400 hover:text-[#006D77] hover:bg-stone-100 transition"
                      title="Edit Batch"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setBatchToDelete(batch)}
                      className="p-1 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition"
                      title="Delete Batch"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Batch metrics grid */}
                <div className="grid grid-cols-2 gap-2 my-3 text-xs bg-stone-50 p-3 rounded-xl border border-stone-100">
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase font-semibold block">Yield Output</span>
                    <span className="font-mono font-bold text-stone-800 text-sm">
                      {batch.quantityActual} / {batch.quantityPlanned} {batch.unit}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase font-semibold block">Lead Operator</span>
                    <span className="font-medium text-stone-800">{batch.operatorName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase font-semibold block">Start Date</span>
                    <span className="font-mono text-stone-600">{batch.startDate}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase font-semibold block">Best Before</span>
                    <span className="font-mono font-semibold text-emerald-800">{batch.bestBeforeDate}</span>
                  </div>
                </div>

                {batch.notes && (
                  <p className="text-xs text-stone-500 italic mt-2">
                    "{batch.notes}"
                  </p>
                )}
              </div>

              {/* Status Update Quick Buttons */}
              {onUpdateBatchStatus && (
                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-[11px] text-stone-400">Change Status:</span>
                  <div className="flex gap-1.5 flex-wrap">
                    {batch.status !== 'Approved' && (
                      <button
                        onClick={() => onUpdateBatchStatus(batch.id, 'Approved')}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-medium flex items-center gap-1 transition-colors shadow-2xs"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        Release Stock
                      </button>
                    )}
                    {batch.status === 'In Progress' && (
                      <button
                        onClick={() => onUpdateBatchStatus(batch.id, 'Quality Review')}
                        className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-medium transition-colors shadow-2xs"
                      >
                        Send to QC Review
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Create / Edit Batch Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-8">
            <div className="bg-[#006D77] text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-lg">
                  {editingBatch ? `Edit Batch ${editingBatch.batchNumber}` : 'Schedule New Production Batch'}
                </h3>
                <p className="text-xs text-stone-200">BOM raw material deduction and trace tracking</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase mb-1">
                  Product to Produce <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#006D77]"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.unit}) — Current Stock: {p.currentStock}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase mb-1">
                    Planned Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={quantityPlanned}
                    onChange={(e) => setQuantityPlanned(Number(e.target.value))}
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase mb-1">
                    Actual Quantity Yield
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={quantityActual}
                    onChange={(e) => setQuantityActual(Number(e.target.value))}
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase mb-1">
                    Lead Operator
                  </label>
                  <input
                    type="text"
                    value={operatorName}
                    onChange={(e) => setOperatorName(e.target.value)}
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase mb-1">
                    Batch Status
                  </label>
                  <select
                    value={batchStatus}
                    onChange={(e) => setBatchStatus(e.target.value as any)}
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-xl bg-white"
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Quality Review">Quality Review</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase mb-1">
                  Production Notes & Instructions
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Extra fine milling requested for tea bags; double visual seal check."
                  className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
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
                  <span>{editingBatch ? 'Save Batch Changes' : 'Launch Batch'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Batch Confirmation Dialog */}
      {batchToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-stone-200 text-center space-y-3">
            <div className="w-11 h-11 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-stone-900 text-base">Delete Batch?</h3>
            <p className="text-xs text-stone-500">
              Are you sure you want to delete batch <strong>{batchToDelete.batchNumber}</strong> ({batchToDelete.productName})?
            </p>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setBatchToDelete(null)}
                className="flex-1 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(batchToDelete.id)}
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
