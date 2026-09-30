import React, { useState } from 'react';
import { 
  ShieldCheck, 
  FileCheck2, 
  AlertTriangle, 
  Clock, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Search, 
  Plus, 
  Award,
  Calendar,
  AlertCircle,
  HelpCircle,
  Edit3,
  Trash2,
  X
} from 'lucide-react';
import { QualityCheck, ComplianceDoc, CustomerComplaint } from '../../types';

interface QualityDashboardProps {
  qualityChecks: QualityCheck[];
  complianceDocs: ComplianceDoc[];
  complaints: CustomerComplaint[];
  onAddQualityCheck?: (check: QualityCheck) => void;
  onUpdateQualityCheck?: (check: QualityCheck) => void;
  onDeleteQualityCheck?: (checkId: string) => void;
  onAddComplianceDoc?: (doc: ComplianceDoc) => void;
  onUpdateComplianceDoc?: (doc: ComplianceDoc) => void;
  onDeleteComplianceDoc?: (docId: string) => void;
  onAddComplaint?: (complaint: CustomerComplaint) => void;
  onUpdateComplaint?: (complaint: CustomerComplaint) => void;
  onDeleteComplaint?: (complaintId: string) => void;
}

export const QualityDashboard: React.FC<QualityDashboardProps> = ({
  qualityChecks,
  complianceDocs,
  complaints,
  onAddQualityCheck,
  onUpdateQualityCheck,
  onDeleteQualityCheck,
  onAddComplianceDoc,
  onUpdateComplianceDoc,
  onDeleteComplianceDoc,
  onAddComplaint,
  onUpdateComplaint,
  onDeleteComplaint
}) => {
  const [activeTab, setActiveTab] = useState<'batch-checks' | 'compliance-docs' | 'complaints-capa'>('batch-checks');
  const [selectedCheck, setSelectedCheck] = useState<QualityCheck | null>(qualityChecks[0] || null);

  // Modal State
  const [modalType, setModalType] = useState<'qualityCheck' | 'complianceDoc' | 'complaint' | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  
  // Delete Confirm State
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'qualityCheck' | 'complianceDoc' | 'complaint'; id: string } | null>(null);

  // Form States
  const [qualityCheckForm, setQualityCheckForm] = useState<Partial<QualityCheck>>({ tests: [] });
  const [complianceDocForm, setComplianceDocForm] = useState<Partial<ComplianceDoc>>({});
  const [complaintForm, setComplaintForm] = useState<Partial<CustomerComplaint>>({});

  const passedChecks = qualityChecks.filter(q => q.overallStatus === 'Passed').length;
  const expiringDocs = complianceDocs.filter(d => d.status === 'Expiring Soon');
  const openComplaints = complaints.filter(c => c.status !== 'Closed');

  // --- Handlers ---
  const handleOpenModal = (type: 'qualityCheck' | 'complianceDoc' | 'complaint', mode: 'create' | 'edit', data?: any) => {
    setModalType(type);
    setModalMode(mode);
    if (type === 'qualityCheck') {
      setQualityCheckForm(data || { 
        tests: [], date: new Date().toISOString().split('T')[0], overallStatus: 'Passed', checkedBy: '' 
      });
    } else if (type === 'complianceDoc') {
      setComplianceDocForm(data || { 
        issueDate: new Date().toISOString().split('T')[0], expiryDate: new Date().toISOString().split('T')[0], status: 'Valid', category: 'KEBS Operational' 
      });
    } else if (type === 'complaint') {
      setComplaintForm(data || { 
        date: new Date().toISOString().split('T')[0], severity: 'Low', status: 'Investigating' 
      });
    }
  };

  const handleCloseModal = () => {
    setModalType(null);
  };

  const handleSave = () => {
    if (modalType === 'qualityCheck') {
      const payload = {
        ...qualityCheckForm,
        id: qualityCheckForm.id || `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      } as QualityCheck;
      modalMode === 'create' ? onAddQualityCheck?.(payload) : onUpdateQualityCheck?.(payload);
    } else if (modalType === 'complianceDoc') {
      const payload = {
        ...complianceDocForm,
        id: complianceDocForm.id || `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      } as ComplianceDoc;
      modalMode === 'create' ? onAddComplianceDoc?.(payload) : onUpdateComplianceDoc?.(payload);
    } else if (modalType === 'complaint') {
      const payload = {
        ...complaintForm,
        id: complaintForm.id || `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      } as CustomerComplaint;
      modalMode === 'create' ? onAddComplaint?.(payload) : onUpdateComplaint?.(payload);
    }
    handleCloseModal();
  };

  const handleDelete = () => {
    if (!deleteConfirm) return;
    if (deleteConfirm.type === 'qualityCheck') onDeleteQualityCheck?.(deleteConfirm.id);
    if (deleteConfirm.type === 'complianceDoc') onDeleteComplianceDoc?.(deleteConfirm.id);
    if (deleteConfirm.type === 'complaint') onDeleteComplaint?.(deleteConfirm.id);
    setDeleteConfirm(null);
  };

  return (
    <div className="space-y-6">
      {/* Strategic Pitch Banner (Phase 3 Positioning) */}
      <div className="bg-[#006D77] rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4A373]/30 text-[#FFFDF9] text-xs font-semibold mb-2 backdrop-blur-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4A373]" />
              Quality Control & Compliance Architecture
            </div>
            <h2 className="text-xl md:text-2xl font-serif font-bold text-white mb-1.5">
              “Organizing production and quality records so audit proof never gets lost.”
            </h2>
            <p className="text-stone-200 text-xs md:text-sm leading-relaxed">
              Maintains standardized operational, hygiene, and batch release logs that support Highland Gardens’ internal quality control and third-party audit readiness (KEBS, County Public Health, supermarket vendor inspections).
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-xl border border-white/15 text-xs shrink-0 max-w-xs">
            <div className="flex items-center gap-1.5 font-semibold text-[#D4A373] mb-1">
              <HelpCircle className="w-4 h-4" />
              Strategic Positioning Note
            </div>
            <p className="text-[11px] text-stone-200 leading-snug">
              Rather than promising automatic regulatory certification, this module organizes operational proof to substantiate compliance.
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs">
          <span className="text-xs text-stone-500 font-medium block">Batch Releases Logged</span>
          <p className="text-2xl font-serif font-bold text-stone-900 mt-1">
            {qualityChecks.length} Batches
          </p>
          <span className="text-[11px] text-emerald-700 font-medium mt-1 block">
            {passedChecks} release certificates
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs">
          <span className="text-xs text-stone-500 font-medium block">Compliance Repository</span>
          <p className="text-2xl font-serif font-bold text-[#006D77] mt-1">
            {complianceDocs.length} Permits
          </p>
          <span className="text-[11px] text-stone-500 mt-1 block">
            KEBS & Public Health
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs">
          <span className="text-xs text-stone-500 font-medium block">Expiry Reminders</span>
          <p className="text-2xl font-serif font-bold text-amber-700 mt-1">
            {expiringDocs.length} Alert
          </p>
          <span className="text-[11px] text-amber-600 font-medium mt-1 block">
            Pest control audit renewal
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs">
          <span className="text-xs text-stone-500 font-medium block">CAPA & Complaints</span>
          <p className="text-2xl font-serif font-bold text-stone-900 mt-1">
            {openComplaints.length} Under Review
          </p>
          <span className="text-[11px] text-stone-500 mt-1 block">
            Linked to batch traceability
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="border-b border-stone-200 p-4 flex items-center justify-between overflow-x-auto">
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('batch-checks')}
              className={`text-xs px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-all ${
                activeTab === 'batch-checks'
                  ? 'bg-[#006D77] text-white shadow-xs'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              Batch Quality Checks ({qualityChecks.length})
            </button>
            <button
              onClick={() => setActiveTab('compliance-docs')}
              className={`text-xs px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-all ${
                activeTab === 'compliance-docs'
                  ? 'bg-[#006D77] text-white shadow-xs'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
              }`}
            >
              <FileText className="w-4 h-4" />
              Permits & Certificate Vault ({complianceDocs.length})
            </button>
            <button
              onClick={() => setActiveTab('complaints-capa')}
              className={`text-xs px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-all ${
                activeTab === 'complaints-capa'
                  ? 'bg-[#006D77] text-white shadow-xs'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              Complaints & Corrective Action (CAPA) ({complaints.length})
            </button>
          </div>
          <div className="pl-4 shrink-0">
            {activeTab === 'batch-checks' && (
              <button onClick={() => handleOpenModal('qualityCheck', 'create')} className="flex items-center gap-1.5 bg-[#006D77] hover:bg-[#004D54] text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors">
                <Plus className="w-4 h-4" /> Add Check
              </button>
            )}
            {activeTab === 'compliance-docs' && (
              <button onClick={() => handleOpenModal('complianceDoc', 'create')} className="flex items-center gap-1.5 bg-[#006D77] hover:bg-[#004D54] text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors">
                <Plus className="w-4 h-4" /> Add Document
              </button>
            )}
            {activeTab === 'complaints-capa' && (
              <button onClick={() => handleOpenModal('complaint', 'create')} className="flex items-center gap-1.5 bg-[#006D77] hover:bg-[#004D54] text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors">
                <Plus className="w-4 h-4" /> Add Complaint
              </button>
            )}
          </div>
        </div>

        {/* Tab 1: Batch Quality Release Checks */}
        {activeTab === 'batch-checks' && (
          <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* List of checked batches */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">
                Logged Batch Tests
              </span>
              {qualityChecks.map(qc => {
                const isSelected = selectedCheck?.id === qc.id;
                return (
                  <div
                    key={qc.id}
                    className={`p-3.5 rounded-xl border transition-all relative group ${
                      isSelected
                        ? 'border-[#006D77] bg-white ring-2 ring-[#006D77]/10 shadow-xs'
                        : 'border-stone-200/80 bg-stone-50/50 hover:bg-white cursor-pointer'
                    }`}
                  >
                    <div onClick={() => setSelectedCheck(qc)}>
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-mono font-bold text-xs text-[#006D77]">
                          {qc.batchNumber}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                          {qc.overallStatus}
                        </span>
                      </div>
                      <h4 className="font-serif font-bold text-stone-900 text-sm">{qc.productName}</h4>
                      <p className="text-[11px] text-stone-500 mt-1">
                        Tested {qc.date} by {qc.checkedBy}
                      </p>
                    </div>
                    
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity bg-white/80 p-1 rounded-lg backdrop-blur-sm shadow-xs border border-stone-200">
                      <button onClick={(e) => { e.stopPropagation(); handleOpenModal('qualityCheck', 'edit', qc); }} className="p-1 text-stone-500 hover:text-[#006D77] hover:bg-stone-100 rounded-md transition-colors" title="Edit">
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); setDeleteConfirm({ type: 'qualityCheck', id: qc.id }); }} className="p-1 text-stone-500 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors" title="Delete">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Test Details Inspector */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-[#F3E1DD] rounded-2xl p-5 shadow-xs">
              {selectedCheck ? (
                <div className="space-y-5">
                  <div className="border-b border-[#F3E1DD] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-stone-400">
                        Certificate of Analysis (COA) / Batch Release
                      </span>
                      <h3 className="font-serif font-bold text-xl text-stone-900 mt-0.5">
                        {selectedCheck.productName}
                      </h3>
                      <p className="font-mono text-xs text-[#006D77]">
                        Batch Lot: {selectedCheck.batchNumber} • Inspector: {selectedCheck.checkedBy}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs px-3 py-1 rounded-full font-bold border ${selectedCheck.overallStatus === 'Passed' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : selectedCheck.overallStatus === 'Failed' ? 'bg-rose-100 text-rose-800 border-rose-300' : 'bg-amber-100 text-amber-800 border-amber-300'}`}>
                        {selectedCheck.overallStatus.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Standard reference banner */}
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs">
                    <span className="font-semibold text-stone-700 block">Applicable Standard Reference:</span>
                    <span className="font-mono text-stone-600 text-[11px]">{selectedCheck.kebsStandardRef}</span>
                  </div>

                  {/* Test Results Table */}
                  <div>
                    <h4 className="text-xs font-semibold text-stone-800 uppercase tracking-wider mb-2">
                      Laboratory & Sensory Parameter Verification
                    </h4>
                    <div className="overflow-x-auto border border-stone-200 rounded-xl bg-white">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-stone-50 text-stone-500 text-[10px] uppercase border-b border-stone-200">
                          <tr>
                            <th className="py-2.5 px-3">Quality Test</th>
                            <th className="py-2.5 px-3">Target Specification</th>
                            <th className="py-2.5 px-3">Actual Result</th>
                            <th className="py-2.5 px-3 text-center">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                          {selectedCheck.tests.map((t, idx) => (
                            <tr key={idx} className="hover:bg-stone-50/50">
                              <td className="py-2.5 px-3 font-medium text-stone-900">{t.testName}</td>
                              <td className="py-2.5 px-3 text-stone-500 font-mono text-[11px]">{t.targetSpec}</td>
                              <td className="py-2.5 px-3 text-stone-800 font-mono font-bold text-[11px]">{t.result}</td>
                              <td className="py-2.5 px-3 text-center">
                                {t.pass ? (
                                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                    Pass
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-[10px] text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded-full">
                                    <XCircle className="w-3 h-3 text-rose-600" />
                                    Fail
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {selectedCheck.notes && (
                    <div className="text-xs text-stone-600 bg-white p-3 rounded-xl border border-stone-200">
                      <span className="font-semibold block text-stone-800 mb-0.5">QA Release Endorsement:</span>
                      "{selectedCheck.notes}"
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xs text-stone-400">Select a batch test on the left</p>
              )}
            </div>
            </div>
          </div>
        )}

        {/* Tab 2: Compliance Documents Vault */}
        {activeTab === 'compliance-docs' && (
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {complianceDocs.map(doc => {
                const isExpiring = doc.status === 'Expiring Soon';

                return (
                  <div key={doc.id} className="bg-white group p-4 rounded-2xl border border-stone-200/90 shadow-xs hover:border-[#006D77]/50 transition-all flex flex-col justify-between relative">
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity bg-white/80 p-1 rounded-lg backdrop-blur-sm shadow-xs border border-stone-200 z-10">
                      <button onClick={() => handleOpenModal('complianceDoc', 'edit', doc)} className="p-1 text-stone-500 hover:text-[#006D77] hover:bg-stone-100 rounded-md transition-colors" title="Edit">
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setDeleteConfirm({ type: 'complianceDoc', id: doc.id })} className="p-1 text-stone-500 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors" title="Delete">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2 pr-16">
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#006D77]/10 text-[#006D77] font-semibold">
                          {doc.category}
                        </span>
                        <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold border ${
                          isExpiring
                            ? 'bg-amber-100 text-amber-900 border-amber-300 animate-pulse'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}>
                          {doc.status}
                        </span>
                      </div>

                      <h4 className="font-serif font-bold text-stone-900 text-base mb-1">
                        {doc.title}
                      </h4>
                      <p className="text-xs font-mono text-stone-500 mb-3">
                        Ref: {doc.referenceNumber}
                      </p>

                      <div className="grid grid-cols-2 gap-2 text-xs bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                        <div>
                          <span className="text-[10px] text-stone-400 uppercase font-semibold block">Issued</span>
                          <span className="font-mono text-stone-700">{doc.issueDate}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-stone-400 uppercase font-semibold block">Valid Until</span>
                          <span className={`font-mono font-bold ${isExpiring ? 'text-amber-700' : 'text-stone-800'}`}>
                            {doc.expiryDate}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                      <span className="text-stone-400">Archived digital copy verified</span>
                      <button className="text-xs text-[#006D77] hover:underline font-semibold flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5" />
                        View Certificate Record
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Customer Complaints & CAPA */}
        {activeTab === 'complaints-capa' && (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-stone-500">
                Track issues from wholesale or direct buyers with closed-loop corrective actions (CAPA)
              </span>
            </div>

            <div className="space-y-4">
              {complaints.map(complaint => (
                <div key={complaint.id} className="bg-white group p-4 rounded-2xl border border-stone-200/90 shadow-xs space-y-3 relative">
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity bg-white/80 p-1 rounded-lg backdrop-blur-sm shadow-xs border border-stone-200 z-10">
                    <button onClick={() => handleOpenModal('complaint', 'edit', complaint)} className="p-1 text-stone-500 hover:text-[#006D77] hover:bg-stone-100 rounded-md transition-colors" title="Edit">
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => setDeleteConfirm({ type: 'complaint', id: complaint.id })} className="p-1 text-stone-500 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors" title="Delete">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-2 pr-16">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-stone-900">{complaint.customerName}</span>
                      {complaint.batchNumber && (
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-stone-100 text-stone-700">
                          Batch: {complaint.batchNumber}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${complaint.severity === 'High' ? 'bg-rose-50 text-rose-800 border-rose-200' : complaint.severity === 'Medium' ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-stone-50 text-stone-800 border-stone-200'}`}>
                        Severity: {complaint.severity}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${complaint.status === 'Closed' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-blue-50 text-blue-800 border-blue-200'}`}>
                        {complaint.status}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-stone-400 block mb-0.5">Issue Reported</span>
                    <p className="text-xs text-stone-800 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                      "{complaint.issueDescription}"
                    </p>
                  </div>

                  {complaint.correctiveAction && (
                    <div className="p-3 rounded-xl bg-[#FFFDF9] border border-[#F3E1DD] text-xs">
                      <span className="font-semibold text-[#006D77] block mb-0.5">
                        CAPA (Corrective and Preventive Action) Implemented:
                      </span>
                      <p className="text-stone-700 leading-relaxed">
                        {complaint.correctiveAction}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MODALS */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto overflow-x-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-stone-100 sticky top-0 bg-white z-10 rounded-t-3xl">
              <h3 className="font-serif font-bold text-lg text-stone-900">
                {modalMode === 'create' ? 'Add' : 'Edit'} {modalType === 'qualityCheck' ? 'Quality Check' : modalType === 'complianceDoc' ? 'Compliance Document' : 'Complaint'}
              </h3>
              <button onClick={handleCloseModal} className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4 flex-1">
              {modalType === 'qualityCheck' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="col-span-1">
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Batch Number</label>
                    <input type="text" className="w-full bg-stone-50 border border-stone-200 rounded-xl text-xs px-3 py-2 focus:ring-2 focus:ring-[#006D77]/20 focus:border-[#006D77] transition-all" value={qualityCheckForm.batchNumber || ''} onChange={e => setQualityCheckForm({ ...qualityCheckForm, batchNumber: e.target.value })} placeholder="e.g. HG-2026-B01" />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Product Name</label>
                    <input type="text" className="w-full bg-stone-50 border border-stone-200 rounded-xl text-xs px-3 py-2 focus:ring-2 focus:ring-[#006D77]/20 focus:border-[#006D77] transition-all" value={qualityCheckForm.productName || ''} onChange={e => setQualityCheckForm({ ...qualityCheckForm, productName: e.target.value })} placeholder="e.g. Classic English Breakfast" />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Checked By</label>
                    <input type="text" className="w-full bg-stone-50 border border-stone-200 rounded-xl text-xs px-3 py-2 focus:ring-2 focus:ring-[#006D77]/20 focus:border-[#006D77] transition-all" value={qualityCheckForm.checkedBy || ''} onChange={e => setQualityCheckForm({ ...qualityCheckForm, checkedBy: e.target.value })} placeholder="Inspector Name" />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Date</label>
                    <input type="date" className="w-full bg-stone-50 border border-stone-200 rounded-xl text-xs px-3 py-2 focus:ring-2 focus:ring-[#006D77]/20 focus:border-[#006D77] transition-all" value={qualityCheckForm.date || ''} onChange={e => setQualityCheckForm({ ...qualityCheckForm, date: e.target.value })} />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-xs font-semibold text-stone-700 mb-1">KEBS Standard Ref</label>
                    <input type="text" className="w-full bg-stone-50 border border-stone-200 rounded-xl text-xs px-3 py-2 focus:ring-2 focus:ring-[#006D77]/20 focus:border-[#006D77] transition-all" value={qualityCheckForm.kebsStandardRef || ''} onChange={e => setQualityCheckForm({ ...qualityCheckForm, kebsStandardRef: e.target.value })} placeholder="e.g. KS 65:2017" />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Overall Status</label>
                    <select className="w-full bg-stone-50 border border-stone-200 rounded-xl text-xs px-3 py-2 focus:ring-2 focus:ring-[#006D77]/20 focus:border-[#006D77] transition-all" value={qualityCheckForm.overallStatus || 'Passed'} onChange={e => setQualityCheckForm({ ...qualityCheckForm, overallStatus: e.target.value as any })}>
                      <option value="Passed">Passed</option>
                      <option value="Conditional Pass">Conditional Pass</option>
                      <option value="Failed">Failed</option>
                    </select>
                  </div>
                  
                  {/* Tests Array Editor */}
                  <div className="col-span-1 sm:col-span-2 border border-stone-200 rounded-xl p-3 bg-stone-50/50">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-semibold text-stone-700">Test Parameters</label>
                      <button type="button" onClick={() => setQualityCheckForm(prev => ({ ...prev, tests: [...(prev.tests || []), { testName: '', targetSpec: '', result: '', pass: true }] }))} className="text-[10px] bg-white border border-stone-200 px-2 py-1 rounded-lg font-medium hover:bg-stone-50 flex items-center gap-1">
                        <Plus className="w-3 h-3" /> Add Test
                      </button>
                    </div>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {qualityCheckForm.tests?.map((t, idx) => (
                        <div key={idx} className="flex flex-wrap sm:flex-nowrap gap-2 bg-white p-2 rounded-lg border border-stone-200 items-center">
                          <input type="text" placeholder="Test Name" className="flex-1 min-w-[120px] bg-stone-50 border border-stone-200 rounded-md text-[11px] px-2 py-1" value={t.testName} onChange={e => { const newTests = [...(qualityCheckForm.tests || [])]; newTests[idx].testName = e.target.value; setQualityCheckForm({ ...qualityCheckForm, tests: newTests }); }} />
                          <input type="text" placeholder="Target Spec" className="flex-1 min-w-[100px] bg-stone-50 border border-stone-200 rounded-md text-[11px] px-2 py-1" value={t.targetSpec} onChange={e => { const newTests = [...(qualityCheckForm.tests || [])]; newTests[idx].targetSpec = e.target.value; setQualityCheckForm({ ...qualityCheckForm, tests: newTests }); }} />
                          <input type="text" placeholder="Result" className="flex-1 min-w-[80px] bg-stone-50 border border-stone-200 rounded-md text-[11px] px-2 py-1" value={t.result} onChange={e => { const newTests = [...(qualityCheckForm.tests || [])]; newTests[idx].result = e.target.value; setQualityCheckForm({ ...qualityCheckForm, tests: newTests }); }} />
                          <label className="flex items-center gap-1 text-[10px] font-medium shrink-0">
                            <input type="checkbox" checked={t.pass} onChange={e => { const newTests = [...(qualityCheckForm.tests || [])]; newTests[idx].pass = e.target.checked; setQualityCheckForm({ ...qualityCheckForm, tests: newTests }); }} />
                            Pass
                          </label>
                          <button type="button" onClick={() => { const newTests = [...(qualityCheckForm.tests || [])]; newTests.splice(idx, 1); setQualityCheckForm({ ...qualityCheckForm, tests: newTests }); }} className="text-rose-500 hover:bg-rose-50 p-1 rounded">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                      {(!qualityCheckForm.tests || qualityCheckForm.tests.length === 0) && (
                        <div className="text-center text-[10px] text-stone-400 py-2">No tests added yet.</div>
                      )}
                    </div>
                  </div>

                  <div className="col-span-1 sm:col-span-2">
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Notes</label>
                    <textarea className="w-full bg-stone-50 border border-stone-200 rounded-xl text-xs px-3 py-2 focus:ring-2 focus:ring-[#006D77]/20 focus:border-[#006D77] transition-all resize-none" rows={3} value={qualityCheckForm.notes || ''} onChange={e => setQualityCheckForm({ ...qualityCheckForm, notes: e.target.value })}></textarea>
                  </div>
                </div>
              )}

              {modalType === 'complianceDoc' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="col-span-1 sm:col-span-2">
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Document Title</label>
                    <input type="text" className="w-full bg-stone-50 border border-stone-200 rounded-xl text-xs px-3 py-2 focus:ring-2 focus:ring-[#006D77]/20 focus:border-[#006D77] transition-all" value={complianceDocForm.title || ''} onChange={e => setComplianceDocForm({ ...complianceDocForm, title: e.target.value })} placeholder="e.g. KEBS Standardization Mark" />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Category</label>
                    <select className="w-full bg-stone-50 border border-stone-200 rounded-xl text-xs px-3 py-2 focus:ring-2 focus:ring-[#006D77]/20 focus:border-[#006D77] transition-all" value={complianceDocForm.category || 'KEBS Operational'} onChange={e => setComplianceDocForm({ ...complianceDocForm, category: e.target.value as any })}>
                      <option value="KEBS Operational">KEBS Operational</option>
                      <option value="Hygiene & HACCP">Hygiene & HACCP</option>
                      <option value="Supplier COA">Supplier COA</option>
                      <option value="Food Handler Certificate">Food Handler Certificate</option>
                    </select>
                  </div>
                  <div className="col-span-1">
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Reference Number</label>
                    <input type="text" className="w-full bg-stone-50 border border-stone-200 rounded-xl text-xs px-3 py-2 focus:ring-2 focus:ring-[#006D77]/20 focus:border-[#006D77] transition-all" value={complianceDocForm.referenceNumber || ''} onChange={e => setComplianceDocForm({ ...complianceDocForm, referenceNumber: e.target.value })} placeholder="e.g. SM/001/2026" />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Issue Date</label>
                    <input type="date" className="w-full bg-stone-50 border border-stone-200 rounded-xl text-xs px-3 py-2 focus:ring-2 focus:ring-[#006D77]/20 focus:border-[#006D77] transition-all" value={complianceDocForm.issueDate || ''} onChange={e => setComplianceDocForm({ ...complianceDocForm, issueDate: e.target.value })} />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Expiry Date</label>
                    <input type="date" className="w-full bg-stone-50 border border-stone-200 rounded-xl text-xs px-3 py-2 focus:ring-2 focus:ring-[#006D77]/20 focus:border-[#006D77] transition-all" value={complianceDocForm.expiryDate || ''} onChange={e => setComplianceDocForm({ ...complianceDocForm, expiryDate: e.target.value })} />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Status</label>
                    <select className="w-full bg-stone-50 border border-stone-200 rounded-xl text-xs px-3 py-2 focus:ring-2 focus:ring-[#006D77]/20 focus:border-[#006D77] transition-all" value={complianceDocForm.status || 'Valid'} onChange={e => setComplianceDocForm({ ...complianceDocForm, status: e.target.value as any })}>
                      <option value="Valid">Valid</option>
                      <option value="Expiring Soon">Expiring Soon</option>
                      <option value="Expired">Expired</option>
                    </select>
                  </div>
                </div>
              )}

              {modalType === 'complaint' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="col-span-1">
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Date Reported</label>
                    <input type="date" className="w-full bg-stone-50 border border-stone-200 rounded-xl text-xs px-3 py-2 focus:ring-2 focus:ring-[#006D77]/20 focus:border-[#006D77] transition-all" value={complaintForm.date || ''} onChange={e => setComplaintForm({ ...complaintForm, date: e.target.value })} />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Customer Name</label>
                    <input type="text" className="w-full bg-stone-50 border border-stone-200 rounded-xl text-xs px-3 py-2 focus:ring-2 focus:ring-[#006D77]/20 focus:border-[#006D77] transition-all" value={complaintForm.customerName || ''} onChange={e => setComplaintForm({ ...complaintForm, customerName: e.target.value })} placeholder="e.g. Zucchini Greengrocers" />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Batch Number (Optional)</label>
                    <input type="text" className="w-full bg-stone-50 border border-stone-200 rounded-xl text-xs px-3 py-2 focus:ring-2 focus:ring-[#006D77]/20 focus:border-[#006D77] transition-all" value={complaintForm.batchNumber || ''} onChange={e => setComplaintForm({ ...complaintForm, batchNumber: e.target.value })} placeholder="e.g. HG-2026-B01" />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Severity</label>
                    <select className="w-full bg-stone-50 border border-stone-200 rounded-xl text-xs px-3 py-2 focus:ring-2 focus:ring-[#006D77]/20 focus:border-[#006D77] transition-all" value={complaintForm.severity || 'Low'} onChange={e => setComplaintForm({ ...complaintForm, severity: e.target.value as any })}>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                  <div className="col-span-1 sm:col-span-2">
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Issue Description</label>
                    <textarea className="w-full bg-stone-50 border border-stone-200 rounded-xl text-xs px-3 py-2 focus:ring-2 focus:ring-[#006D77]/20 focus:border-[#006D77] transition-all resize-none" rows={2} value={complaintForm.issueDescription || ''} onChange={e => setComplaintForm({ ...complaintForm, issueDescription: e.target.value })} placeholder="Describe the issue..."></textarea>
                  </div>
                  <div className="col-span-1">
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Status</label>
                    <select className="w-full bg-stone-50 border border-stone-200 rounded-xl text-xs px-3 py-2 focus:ring-2 focus:ring-[#006D77]/20 focus:border-[#006D77] transition-all" value={complaintForm.status || 'Investigating'} onChange={e => setComplaintForm({ ...complaintForm, status: e.target.value as any })}>
                      <option value="Investigating">Investigating</option>
                      <option value="CAPA Implemented">CAPA Implemented</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                  <div className="col-span-1 sm:col-span-2">
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Corrective Action (CAPA)</label>
                    <textarea className="w-full bg-stone-50 border border-stone-200 rounded-xl text-xs px-3 py-2 focus:ring-2 focus:ring-[#006D77]/20 focus:border-[#006D77] transition-all resize-none" rows={3} value={complaintForm.correctiveAction || ''} onChange={e => setComplaintForm({ ...complaintForm, correctiveAction: e.target.value })} placeholder="Describe actions taken to resolve and prevent..."></textarea>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-stone-100 flex justify-end gap-2 bg-stone-50/50 rounded-b-3xl">
              <button onClick={handleCloseModal} className="px-4 py-2 text-xs font-semibold text-stone-600 bg-white border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors">
                Cancel
              </button>
              <button onClick={handleSave} className="px-4 py-2 text-xs font-semibold text-white bg-[#006D77] rounded-xl hover:bg-[#004D54] transition-colors shadow-xs">
                {modalMode === 'create' ? 'Add Record' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xl w-full max-w-sm p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-rose-600" />
            </div>
            <h3 className="font-serif font-bold text-lg text-stone-900 mb-2">Delete Record?</h3>
            <p className="text-xs text-stone-500 mb-6">
              This action cannot be undone. Are you sure you want to remove this record from the system?
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 px-4 py-2.5 text-xs font-semibold text-stone-600 bg-stone-100 rounded-xl hover:bg-stone-200 transition-colors">
                Cancel
              </button>
              <button onClick={handleDelete} className="flex-1 px-4 py-2.5 text-xs font-semibold text-white bg-rose-600 rounded-xl hover:bg-rose-700 transition-colors shadow-xs">
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
