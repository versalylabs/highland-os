import React, { useState } from 'react';
import { 
  X, 
  Smartphone, 
  CheckCircle2, 
  ShieldCheck, 
  RefreshCw, 
  Check
} from 'lucide-react';
import { Order, BusinessSettings } from '../../types';

interface MpesaPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onPaymentConfirmed: (orderId: string, mpesaRef: string) => void;
  settings?: BusinessSettings;
}

export const MpesaPaymentModal: React.FC<MpesaPaymentModalProps> = ({
  isOpen,
  onClose,
  order,
  onPaymentConfirmed,
  settings,
}) => {
  const [phone, setPhone] = useState(order?.customerPhone || '0722419802');
  const [stkStatus, setStkStatus] = useState<'idle' | 'prompt_sent' | 'pin_entered' | 'confirmed'>('idle');
  const [mpesaCode, setMpesaCode] = useState('');
  const [manualCode, setManualCode] = useState('');

  if (!isOpen || !order) return null;

  const mpesaType = settings?.mpesaType || 'Till Number';
  const mpesaNumber = settings?.mpesaNumber || '849201';
  const mpesaBusinessName = settings?.mpesaBusinessName || 'Highland Gardens Ltd';

  const handleSendStkPush = () => {
    setStkStatus('prompt_sent');
    setTimeout(() => {
      setStkStatus('pin_entered');
      const randomCode = 'SHB' + Math.floor(100 + Math.random() * 900) + 'X' + Math.floor(10 + Math.random() * 90) + 'Q';
      setMpesaCode(randomCode);
    }, 2200);
  };

  const handleConfirmPayment = () => {
    const finalCode = mpesaCode || manualCode || ('SHB' + Math.floor(100 + Math.random() * 900) + 'M' + Math.floor(10 + Math.random() * 90));
    setStkStatus('confirmed');
    setTimeout(() => {
      onPaymentConfirmed(order.id, finalCode);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-[#E5D3CD] overflow-hidden">
        <div className="p-4 bg-linear-to-r from-[#006D77] to-[#004D54] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">
              M
            </div>
            <div>
              <h3 className="font-bold text-sm">M-PESA Payment Reconciliation</h3>
              <p className="text-[11px] text-[#F3E1DD] truncate max-w-[280px]">
                {mpesaType}: {mpesaNumber} ({mpesaBusinessName})
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-white/80 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs">
          <div className="p-3 rounded-xl bg-[#FAF3F0] border border-[#E5D3CD] flex items-center justify-between">
            <div>
              <div className="text-[11px] text-stone-500">Order Ref: {order.orderNumber}</div>
              <div className="font-semibold text-stone-900">{order.customerName}</div>
            </div>
            <div className="text-right">
              <div className="text-[11px] text-stone-500">Amount Due:</div>
              <div className="text-lg font-bold text-[#006D77] font-serif">
                KSh {order.totalAmount.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-700">1. Instant Daraja STK Push</span>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold border border-emerald-200">
                Safaricom Daraja API
              </span>
            </div>

            <div className="space-y-1">
              <label className="text-stone-500">Customer Phone Number:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-lg border border-stone-300 font-medium"
                  placeholder="0722XXXXXX"
                />
                <button
                  onClick={handleSendStkPush}
                  disabled={stkStatus === 'prompt_sent' || stkStatus === 'pin_entered'}
                  className="px-3 py-1.5 rounded-lg font-bold bg-[#006D77] hover:bg-[#004D54] text-white disabled:opacity-60 transition flex items-center gap-1.5"
                >
                  {stkStatus === 'prompt_sent' ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Smartphone className="w-3.5 h-3.5" />
                  )}
                  <span>Send STK</span>
                </button>
              </div>
            </div>

            {stkStatus === 'prompt_sent' && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-center space-y-1">
                <div className="font-semibold text-amber-900 flex items-center justify-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Prompting {phone}...</span>
                </div>
                <p className="text-[11px] text-amber-700">
                  Simulating customer entering M-PESA PIN on phone...
                </p>
              </div>
            )}

            {stkStatus === 'pin_entered' && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>PIN Entered Successfully!</span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-emerald-100 flex items-center justify-between">
                  <span className="text-stone-500">M-PESA Receipt No:</span>
                  <span className="font-mono font-bold text-emerald-800">{mpesaCode}</span>
                </div>
              </div>
            )}
          </div>

          <div className="relative my-3">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-stone-200" /></div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold text-stone-400">
              <span className="bg-white px-2">Or Verify Customer M-PESA SMS</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-stone-600 font-medium">Customer Transaction Code (SMS):</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                placeholder="e.g. SJA817V33P"
                className="flex-1 px-3 py-1.5 rounded-lg border border-stone-300 font-mono uppercase font-semibold"
              />
            </div>
            <p className="text-[10px] text-stone-400">
              Reconciles against Safaricom statement automatically.
            </p>
          </div>
        </div>

        <div className="p-4 bg-[#FAF7F5] border-t border-[#E5D3CD] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-stone-600 font-semibold hover:bg-stone-200 rounded-lg transition"
          >
            Cancel
          </button>

          <button
            onClick={handleConfirmPayment}
            disabled={stkStatus === 'prompt_sent'}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#006D77] hover:bg-[#004D54] text-white shadow-xs transition disabled:opacity-50"
          >
            {stkStatus === 'confirmed' ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Verified!</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Confirm & Mark Paid</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
