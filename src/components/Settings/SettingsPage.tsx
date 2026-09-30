import React, { useState } from 'react';
import { 
  Smartphone, 
  CheckCircle2, 
  RefreshCw, 
  Copy, 
  Check, 
  QrCode, 
  Send, 
  Save, 
  MessageSquare, 
  Building2, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  ExternalLink,
  Plus,
  CheckCheck,
  Eye,
  EyeOff,
  UserCheck,
  Download,
  AlertTriangle
} from 'lucide-react';
import { BusinessSettings, WhatsAppClientMessage, Product } from '../../types';
import { AppUser, generateSimulatedWhatsAppInquiry } from '../../services/authService';

interface SettingsPageProps {
  settings: BusinessSettings;
  incomingMessages: WhatsAppClientMessage[];
  products: Product[];
  currentUser: AppUser;
  onSaveSettings: (newSettings: BusinessSettings) => void;
  onUpdateMessages: (messages: WhatsAppClientMessage[]) => void;
  onOpenWhatsAppCaptureWithMessage?: (msg: WhatsAppClientMessage) => void;
  onShowToast: (msg: string) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  settings,
  incomingMessages,
  products,
  currentUser,
  onSaveSettings,
  onUpdateMessages,
  onOpenWhatsAppCaptureWithMessage,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'whatsapp' | 'mpesa' | 'messages' | 'account'>('whatsapp');
  
  // Local form state
  const [formData, setFormData] = useState<BusinessSettings>({ ...settings });
  const [showKeys, setShowKeys] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isPairingModalOpen, setIsPairingModalOpen] = useState(false);
  const [pairingStep, setPairingStep] = useState<'qr' | 'code' | 'success'>('qr');
  const [isFetchingMessages, setIsFetchingMessages] = useState(false);
  
  // STK Push test bench
  const [testPhone, setTestPhone] = useState(settings.whatsappNumber || '+254 722 000 000');
  const [testAmount, setTestAmount] = useState('150');
  const [stkTestStatus, setStkTestStatus] = useState<'idle' | 'sending' | 'prompted' | 'success'>('idle');
  const [generatedRef, setGeneratedRef] = useState('');

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onSaveSettings(formData);
    onShowToast('Settings and Gateway credentials saved successfully!');
  };

  const handleCopyWebhook = () => {
    navigator.clipboard.writeText(formData.whatsappWebhookUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    onShowToast('Webhook URL copied to clipboard');
  };

  const handleFetchMessages = () => {
    setIsFetchingMessages(true);
    setTimeout(() => {
      // Simulate fetching 1 or 2 new incoming inquiries to the connected WhatsApp number
      const newInquiry = generateSimulatedWhatsAppInquiry(formData.whatsappNumber, products);
      const updated = [newInquiry, ...incomingMessages];
      onUpdateMessages(updated);
      setIsFetchingMessages(false);
      onShowToast(`Synced line ${formData.whatsappNumber}: 1 new message fetched!`);
    }, 1200);
  };

  const handleSimulateInboundCustomer = () => {
    const newMsg = generateSimulatedWhatsAppInquiry(formData.whatsappNumber, products);
    onUpdateMessages([newMsg, ...incomingMessages]);
    onShowToast(`New incoming client message received on ${formData.whatsappNumber}!`);
  };

  const handleRunStkTest = () => {
    setStkTestStatus('sending');
    setTimeout(() => {
      setStkTestStatus('prompted');
      setTimeout(() => {
        const ref = 'DAR' + Math.floor(100 + Math.random() * 900) + 'X' + Math.floor(10 + Math.random() * 90);
        setGeneratedRef(ref);
        setStkTestStatus('success');
        onShowToast(`M-PESA STK Push verified! Receipt: ${ref}`);
      }, 2500);
    }, 1200);
  };

  const handleExportData = () => {
    const rawData = localStorage.getItem(`hg_data_${currentUser.email.toLowerCase()}`);
    if (!rawData) return;
    const blob = new Blob([rawData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `highland_gardens_backup_${currentUser.email.split('@')[0]}_${new Date().toISOString().substring(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Data backup downloaded successfully');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl p-5 sm:p-7 bg-gradient-to-r from-[#006D77] via-[#005B63] to-[#004D54] text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-stone-100 text-xs font-semibold mb-2 backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#D4A373]" />
              <span>Omnichannel Gateway Configuration</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
              Settings & Integrations
            </h1>
            <p className="text-xs sm:text-sm text-stone-200 mt-1 max-w-2xl leading-relaxed">
              Connect your WhatsApp Business telephone number and Safaricom Daraja M-PESA Till/Paybill.
              Messages received on your connected line automatically populate the intake queue.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleFetchMessages}
              disabled={isFetchingMessages}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-xs transition border border-white/20 disabled:opacity-60"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isFetchingMessages ? 'animate-spin' : ''}`} />
              <span>{isFetchingMessages ? 'Syncing...' : 'Fetch Client Messages'}</span>
            </button>
            <button
              onClick={() => handleSave()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#D4A373] hover:bg-[#c39262] text-stone-950 text-xs font-bold shadow-md transition"
            >
              <Save className="w-4 h-4" />
              <span>Save Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-1.5 sm:gap-2 border-b border-stone-200/90 pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('whatsapp')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition whitespace-nowrap ${
            activeTab === 'whatsapp'
              ? 'bg-[#006D77] text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <div className="w-4 h-4 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0">
            <MessageSquare className="w-2.5 h-2.5 fill-current" />
          </div>
          <span>WhatsApp Business</span>
          <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-white/20 text-white">
            {formData.whatsappStatus}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('mpesa')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition whitespace-nowrap ${
            activeTab === 'mpesa'
              ? 'bg-[#006D77] text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <div className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 font-bold text-[9px]">
            M
          </div>
          <span>M-PESA Daraja</span>
          <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
            {formData.mpesaType}: {formData.mpesaNumber}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('messages')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition whitespace-nowrap ${
            activeTab === 'messages'
              ? 'bg-[#006D77] text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <Smartphone className="w-4 h-4 text-stone-500" />
          <span>Inbound Messages</span>
          <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-stone-200 text-stone-700">
            {incomingMessages.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('account')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition whitespace-nowrap ${
            activeTab === 'account'
              ? 'bg-[#006D77] text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <UserCheck className="w-4 h-4 text-stone-500" />
          <span>User Isolation & Storage</span>
        </button>
      </div>

      {/* Tab 1: WhatsApp Business Gateway */}
      {activeTab === 'whatsapp' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200/90 shadow-2xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#25D366]/15 text-[#128C7E] flex items-center justify-center shrink-0">
                      <MessageSquare className="w-6 h-6 fill-current" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-stone-900">
                        WhatsApp Line Connection
                      </h2>
                      <p className="text-xs text-stone-500">
                        Incoming orders and customer inquiries sent to this number are fetched for auto-parsing
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      {formData.whatsappStatus}
                    </span>
                    <button
                      onClick={() => setIsPairingModalOpen(true)}
                      className="px-3 py-1.5 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-semibold transition flex items-center gap-1.5"
                    >
                      <QrCode className="w-3.5 h-3.5 text-stone-500" />
                      <span>Pair Device / QR</span>
                    </button>
                  </div>
                </div>

                {/* Form Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-stone-700">
                      Connected WhatsApp Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.whatsappNumber}
                      onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                      placeholder="+254 7XX XXX XXX"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#006D77]/20 focus:border-[#006D77] text-xs font-medium"
                    />
                    <p className="text-[11px] text-stone-400">
                      Format: +254 7XX XXX XXX. This phone number receives customer inquiries.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-stone-700">
                      WhatsApp Business Display Name
                    </label>
                    <input
                      type="text"
                      value={formData.whatsappBusinessName}
                      onChange={(e) => setFormData({ ...formData, whatsappBusinessName: e.target.value })}
                      placeholder="e.g. Highland Gardens Orders Desk"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#006D77]/20 focus:border-[#006D77] text-xs font-medium"
                    />
                    <p className="text-[11px] text-stone-400">
                      Visible to customers when automated order confirmations are sent.
                    </p>
                  </div>

                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="block text-xs font-bold text-stone-700">
                      Inbound Webhook Endpoint URL
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        readOnly
                        value={formData.whatsappWebhookUrl}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 text-stone-600 font-mono text-xs select-all"
                      />
                      <button
                        type="button"
                        onClick={handleCopyWebhook}
                        className="px-3 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-semibold flex items-center gap-1.5 shrink-0"
                      >
                        {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-stone-500" />}
                        <span>{isCopied ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <p className="text-[11px] text-stone-400">
                      Configure this endpoint in your Meta Business Suite or WhatsApp Cloud API webhook console.
                    </p>
                  </div>
                </div>

                {/* Automated Auto-Reply Config */}
                <div className="pt-4 border-t border-stone-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-stone-800">
                        Automated Order Confirmation & Bot Greeting
                      </h3>
                      <p className="text-[11px] text-stone-500">
                        Dispatches an automated receipt and M-PESA payment prompt instructions once order is captured.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.whatsappAutoReply}
                        onChange={(e) => setFormData({ ...formData, whatsappAutoReply: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-stone-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#006D77]"></div>
                    </label>
                  </div>

                  {formData.whatsappAutoReply && (
                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-bold text-stone-600">
                        Reply Template:
                      </label>
                      <textarea
                        rows={3}
                        value={formData.whatsappAutoReplyTemplate}
                        onChange={(e) => setFormData({ ...formData, whatsappAutoReplyTemplate: e.target.value })}
                        className="w-full p-3 rounded-xl border border-stone-300 text-xs text-stone-800 focus:ring-2 focus:ring-[#006D77]/20 focus:border-[#006D77]"
                      />
                      <div className="flex flex-wrap gap-1.5 text-[10px] text-stone-500">
                        <span className="font-semibold">Variables:</span>
                        <code className="px-1 py-0.5 rounded bg-stone-100 text-stone-700">{'{customer_name}'}</code>
                        <code className="px-1 py-0.5 rounded bg-stone-100 text-stone-700">{'{amount}'}</code>
                        <code className="px-1 py-0.5 rounded bg-stone-100 text-stone-700">{'{business_name}'}</code>
                      </div>
                    </div>
                  )}
                </div>
              </div>
          </div>

          {/* Right Column: Live Inbound Simulation & Fetch preview */}
          <div className="space-y-6">
            <div className="bg-[#FAF3F0] rounded-2xl p-5 border border-[#E5D3CD] space-y-4">
                <div className="flex items-center gap-2 text-stone-800">
                  <Sparkles className="w-4 h-4 text-[#D4A373]" />
                  <h3 className="font-bold text-xs uppercase tracking-wider text-[#006D77]">
                    Client Fetch Sync Test
                  </h3>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Test fetching client messages arriving at <strong>{formData.whatsappNumber || 'your connected number'}</strong>.
                </p>

                <div className="space-y-2.5">
                  <button
                    type="button"
                    onClick={handleSimulateInboundCustomer}
                    className="w-full py-2.5 px-3 rounded-xl bg-white border border-[#E5D3CD] hover:border-[#006D77] text-stone-800 text-xs font-semibold shadow-2xs transition flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
                    <span>Send Inbound Test Chat</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleFetchMessages}
                    disabled={isFetchingMessages}
                    className="w-full py-2.5 px-3 rounded-xl bg-[#006D77] hover:bg-[#005B63] text-white text-xs font-bold shadow-md transition flex items-center justify-center gap-2"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isFetchingMessages ? 'animate-spin' : ''}`} />
                    <span>{isFetchingMessages ? 'Polling WhatsApp API...' : 'Fetch Messages from Line'}</span>
                  </button>
                </div>

                <div className="p-3 bg-white/80 rounded-xl border border-stone-200/80 text-[11px] space-y-1.5">
                  <div className="text-stone-500 font-medium">Active Line Target:</div>
                  <div className="font-mono font-bold text-stone-800">{formData.whatsappNumber}</div>
                  <div className="text-stone-500 flex items-center gap-1">
                    <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{incomingMessages.length} client messages in buffer</span>
                  </div>
                </div>
              </div>

            {/* Simulated Chat Bubble Preview */}
            <div className="bg-[#EFEAE2] rounded-2xl p-4 border border-stone-300 font-sans space-y-2">
              <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                Live WhatsApp Chat Preview
              </div>
              <div className="bg-white rounded-lg p-3 text-xs shadow-xs space-y-1">
                <div className="font-bold text-[#128C7E] text-[11px]">{formData.whatsappBusinessName}</div>
                <p className="text-stone-800 leading-snug">
                  {formData.whatsappAutoReplyTemplate
                    .replace('{customer_name}', 'Wanjiku')
                    .replace('{amount}', '2,550')
                    .replace('{business_name}', formData.whatsappBusinessName)}
                </p>
                <div className="text-[9px] text-right text-stone-400">10:15 AM ✓✓</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: M-PESA Daraja C2B Gateway */}
      {activeTab === 'mpesa' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200/90 shadow-2xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 font-bold text-lg border border-emerald-200">
                      M
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-stone-900">
                        Safaricom Daraja M-PESA Integration
                      </h2>
                      <p className="text-xs text-stone-500">
                        Enable STK Push payment prompts sent straight to customer handsets upon order creation
                      </p>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 self-start sm:self-auto">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Daraja 2.0 Live
                  </span>
                </div>

                {/* Credentials Form */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-stone-700">
                      Business Account Type
                    </label>
                    <select
                      value={formData.mpesaType}
                      onChange={(e) => setFormData({ ...formData, mpesaType: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#006D77]/20 focus:border-[#006D77] text-xs font-medium bg-white"
                    >
                      <option value="Till Number">Buy Goods (Till Number)</option>
                      <option value="Paybill">Paybill Account</option>
                      <option value="Phone Number">Business Agent Phone Number</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-stone-700">
                      {formData.mpesaType} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.mpesaNumber}
                      onChange={(e) => setFormData({ ...formData, mpesaNumber: e.target.value })}
                      placeholder="e.g. 849201"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#006D77]/20 focus:border-[#006D77] text-xs font-bold tracking-wider"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="block text-xs font-bold text-stone-700">
                      Registered Business Name (Prompt Brand Name) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.mpesaBusinessName}
                      onChange={(e) => setFormData({ ...formData, mpesaBusinessName: e.target.value })}
                      placeholder="e.g. Highland Gardens Ltd"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#006D77]/20 focus:border-[#006D77] text-xs font-medium"
                    />
                    <p className="text-[11px] text-stone-400">
                      This exact name appears on the customer's USSD SIM pop-up: "Do you want to pay KSh X to [Brand]?"
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-stone-700 flex items-center justify-between">
                      <span>Daraja Passkey</span>
                      <button
                        type="button"
                        onClick={() => setShowKeys(!showKeys)}
                        className="text-stone-400 hover:text-stone-700 text-[10px] flex items-center gap-1 font-normal"
                      >
                        {showKeys ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        <span>{showKeys ? 'Hide' : 'Show'}</span>
                      </button>
                    </label>
                    <input
                      type={showKeys ? 'text' : 'password'}
                      value={formData.mpesaPasskey || ''}
                      onChange={(e) => setFormData({ ...formData, mpesaPasskey: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 font-mono text-xs"
                      placeholder="Daraja Passkey"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-stone-700">
                      Consumer Key / Secret
                    </label>
                    <input
                      type={showKeys ? 'text' : 'password'}
                      value={formData.mpesaConsumerKey || ''}
                      onChange={(e) => setFormData({ ...formData, mpesaConsumerKey: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 font-mono text-xs"
                      placeholder="Consumer Secret"
                    />
                  </div>
                </div>

                {/* STK Push Feature Toggle */}
                <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-stone-800">
                      Automated Daraja STK Push Prompts
                    </h3>
                    <p className="text-[11px] text-stone-500">
                      Automatically trigger an M-PESA SIM push when WhatsApp intake confirms an order.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.mpesaStkEnabled}
                      onChange={(e) => setFormData({ ...formData, mpesaStkEnabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-stone-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#006D77]"></div>
                  </label>
                </div>
              </div>
          </div>

          {/* Right Column: Live STK Push Test Bench */}
          <div className="space-y-6">
            <div className="bg-[#FAF3F0] rounded-2xl p-5 border border-[#E5D3CD] space-y-4">
              <div className="flex items-center gap-2 text-stone-800">
                <Sparkles className="w-4 h-4 text-[#D4A373]" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-[#006D77]">
                  STK Push Simulator Test Bench
                </h3>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Send a real-time test STK prompt to test the handshake with your configured Till/Paybill.
              </p>

              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                    Customer Test Phone:
                  </label>
                  <input
                    type="text"
                    value={testPhone}
                    onChange={(e) => setTestPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#E5D3CD] text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                    Amount (KSh):
                  </label>
                  <input
                    type="number"
                    value={testAmount}
                    onChange={(e) => setTestAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#E5D3CD] text-xs font-bold"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleRunStkTest}
                  disabled={stkTestStatus === 'sending' || stkTestStatus === 'prompted'}
                  className="w-full py-2.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md transition flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>
                    {stkTestStatus === 'sending'
                      ? 'Contacting Safaricom...'
                      : stkTestStatus === 'prompted'
                      ? 'Waiting for PIN on phone...'
                      : 'Send Test STK Push'}
                  </span>
                </button>
              </div>

              {/* Handset Simulation Result */}
              {stkTestStatus === 'prompted' && (
                <div className="p-3 bg-stone-900 text-white rounded-xl text-xs space-y-1 animate-pulse">
                  <div className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                    <Smartphone className="w-3 h-3" /> USSD PIN Prompt on Handset:
                  </div>
                  <p className="font-mono text-[11px]">
                    "Do you want to pay KSh {testAmount} to {formData.mpesaBusinessName} (Account {formData.mpesaNumber})? Enter M-PESA PIN:"
                  </p>
                </div>
              )}

              {stkTestStatus === 'success' && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Payment Received via Daraja!</span>
                  </div>
                  <div className="text-[11px]">
                    Transaction Ref: <strong className="font-mono">{generatedRef}</strong>
                  </div>
                  <div className="text-[10px] text-emerald-700">
                    Reconciled to {formData.mpesaBusinessName} Till {formData.mpesaNumber}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Inbound Messages Inbox */}
      {activeTab === 'messages' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-stone-900">
                Fetched WhatsApp Customer Messages ({incomingMessages.length})
              </h2>
              <p className="text-xs text-stone-500">
                Real-time messages sent to your connected WhatsApp line: <strong className="text-stone-800">{formData.whatsappNumber}</strong>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleSimulateInboundCustomer}
                className="px-3 py-1.5 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-semibold transition flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5 text-stone-500" />
                <span>Simulate Inbound Inquiry</span>
              </button>
              <button
                onClick={handleFetchMessages}
                disabled={isFetchingMessages}
                className="px-3.5 py-1.5 rounded-xl bg-[#006D77] hover:bg-[#005B63] text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5 disabled:opacity-60"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isFetchingMessages ? 'animate-spin' : ''}`} />
                <span>{isFetchingMessages ? 'Fetching...' : 'Fetch Latest Messages'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {incomingMessages.map((msg) => (
              <div key={msg.id} className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-2xs hover:shadow-xs transition space-y-3 flex flex-col justify-between h-full">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#25D366]/20 text-[#128C7E] flex items-center justify-center font-bold text-xs">
                        {msg.sender[0]}
                      </div>
                      <div>
                        <div className="font-bold text-xs text-stone-900">{msg.sender}</div>
                        <div className="text-[11px] text-stone-500">{msg.phone}</div>
                      </div>
                    </div>
                    <span className="text-[10px] text-stone-400 font-medium">{msg.time}</span>
                  </div>

                  <div className="p-3 bg-[#FAF3F0] rounded-xl text-xs text-stone-800 border border-[#E5D3CD]/60 italic">
                    "{msg.text}"
                  </div>

                  {msg.detectedAddress && (
                    <div className="text-[11px] text-stone-600 flex items-center gap-1.5">
                      <span className="font-semibold text-stone-500">Delivery:</span>
                      <span>{msg.detectedAddress}</span>
                    </div>
                  )}

                  {msg.detectedItems && msg.detectedItems.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {msg.detectedItems.map((it, idx) => {
                        const prod = products.find(p => p.id === it.productId);
                        return (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-full text-[10px] bg-teal-50 text-teal-800 border border-teal-200 font-semibold"
                          >
                            {it.quantity}x {prod?.name || 'Item'}
                          </span>
                        );
                      })}
                      {msg.estimatedTotal && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#D4A373]/20 text-stone-900 font-bold ml-auto">
                          Est: KSh {msg.estimatedTotal.toLocaleString()}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-stone-400">
                    Recipient: <strong className="text-stone-600 font-mono">{msg.recipientNumber}</strong>
                  </span>

                  {onOpenWhatsAppCaptureWithMessage && (
                    <button
                      onClick={() => onOpenWhatsAppCaptureWithMessage(msg)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#006D77] hover:bg-[#005B63] text-white text-xs font-bold transition shadow-2xs"
                    >
                      <span>Convert to Order</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: User Account & Workspace Isolation */}
      {activeTab === 'account' && (
        <div className="max-w-3xl space-y-6">
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200/90 shadow-2xs space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-stone-100">
              <div 
                className="w-12 h-12 rounded-2xl text-white flex items-center justify-center font-bold text-lg shadow-sm"
                style={{ backgroundColor: currentUser.avatarColor || '#006D77' }}
              >
                {currentUser.avatarInitials}
              </div>
              <div>
                <h2 className="text-base font-bold text-stone-900">{currentUser.name}</h2>
                <p className="text-xs text-stone-500">{currentUser.email} • {currentUser.role}</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-xs text-emerald-950">Multi-User Account Isolation Active</div>
                  <p className="text-[11px] text-emerald-800 mt-0.5">
                    Your database records, custom WhatsApp number, M-PESA Till, product stock, and orders are
                    partitioned under key <code className="font-mono bg-white/70 px-1 py-0.5 rounded">hg_data_{currentUser.email.toLowerCase()}</code>.
                    Other registered users access their own independent workspaces.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <div className="text-[10px] text-stone-400 font-bold uppercase">Account Role</div>
                  <div className="text-xs font-semibold text-stone-800">{currentUser.role}</div>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <div className="text-[10px] text-stone-400 font-bold uppercase">Member Since</div>
                  <div className="text-xs font-semibold text-stone-800">{currentUser.createdAt}</div>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={handleExportData}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition flex items-center gap-2"
                >
                  <Download className="w-4 h-4 text-stone-600" />
                  <span>Export JSON Workspace Backup</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QR Code / Pairing Modal Simulation */}
      {isPairingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#25D366]/20 text-[#128C7E] flex items-center justify-center mx-auto">
              <QrCode className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-bold text-base text-stone-900">
                Pair WhatsApp Business
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Scan with WhatsApp on your phone or enter the 8-digit pairing code.
              </p>
            </div>

            {/* Mock QR graphic */}
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 inline-block mx-auto">
              <div className="w-44 h-44 bg-white border-2 border-stone-900 p-2 flex flex-col justify-between items-center relative">
                <div className="w-full flex justify-between">
                  <div className="w-8 h-8 bg-stone-900" />
                  <div className="w-8 h-8 bg-stone-900" />
                </div>
                <div className="text-center font-mono text-[10px] text-stone-600 font-bold">
                  LINE: {formData.whatsappNumber}
                </div>
                <div className="w-full flex justify-between">
                  <div className="w-8 h-8 bg-stone-900" />
                  <div className="w-6 h-6 bg-[#25D366] rounded-full flex items-center justify-center text-white text-[8px] font-bold">
                    WA
                  </div>
                </div>
              </div>
              <div className="font-mono text-xs font-bold text-stone-800 mt-2">
                Pairing Code: <span className="text-[#006D77]">HG72-K991</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setFormData({ ...formData, whatsappStatus: 'Connected' });
                  setIsPairingModalOpen(false);
                  onShowToast('WhatsApp Line paired successfully!');
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#006D77] hover:bg-[#005B63] text-white text-xs font-bold shadow-md transition"
              >
                Confirm Paired
              </button>
              <button
                type="button"
                onClick={() => setIsPairingModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
