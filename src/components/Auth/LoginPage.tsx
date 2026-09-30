import React, { useState } from 'react';
import { 
  Leaf, 
  Lock, 
  Mail, 
  User, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Sparkles, 
  AlertCircle,
  KeyRound,
  Building2
} from 'lucide-react';
import { 
  authenticateUser, 
  registerNewUser, 
  MASTER_CREDENTIALS, 
  AppUser 
} from '../../services/authService';

interface LoginPageProps {
  onLoginSuccess: (user: AppUser) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('Production & Sales Supervisor');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFillDemo = () => {
    setIsRegisterMode(false);
    setEmail(MASTER_CREDENTIALS.email);
    setPassword(MASTER_CREDENTIALS.password);
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Please provide both email and password.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      if (isRegisterMode) {
        if (!fullName.trim()) {
          setError('Please provide your full name.');
          setIsLoading(false);
          return;
        }
        if (password.length < 6) {
          setError('Password should be at least 6 characters.');
          setIsLoading(false);
          return;
        }

        const res = registerNewUser(fullName, email, password, role);
        setIsLoading(false);
        if (res.success && res.user) {
          onLoginSuccess(res.user);
        } else {
          setError(res.error || 'Failed to create account.');
        }
      } else {
        const res = authenticateUser(email, password);
        setIsLoading(false);
        if (res.success && res.user) {
          onLoginSuccess(res.user);
        } else {
          setError(res.error || 'Invalid credentials.');
        }
      }
    }, 400);
  };

  return (
    <div className="min-h-screen w-full bg-[#FAF3F0] flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 font-sans selection:bg-[#006D77] selection:text-white relative overflow-hidden">
      {/* Decorative Brand Background Blobs */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#006D77]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-[#D4A373]/20 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#006D77] text-white shadow-lg ring-4 ring-[#D4A373]/30 mb-3">
            <Leaf className="w-7 h-7 text-[#F3E1DD]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#006D77] tracking-tight">
            Highland Gardens
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 font-medium mt-1">
            Food Production & Commerce Operating System
          </p>
        </div>

        {/* Master Account Quick Access Callout */}
        <div className="mb-5 bg-gradient-to-r from-[#006D77]/10 via-[#D4A373]/20 to-[#006D77]/10 border border-[#D4A373]/40 rounded-2xl p-3.5 shadow-2xs backdrop-blur-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-start gap-2">
              <KeyRound className="w-4 h-4 text-[#006D77] shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] font-bold text-stone-900 block leading-tight">
                  Highland Gardens Master Account
                </span>
                <span className="text-[10px] text-stone-600 block mt-0.5 font-mono">
                  {MASTER_CREDENTIALS.email}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleFillDemo}
              className="text-xs px-3 py-1.5 rounded-xl bg-[#006D77] hover:bg-[#004D54] text-white font-semibold transition-all shadow-xs self-start sm:self-auto shrink-0 flex items-center gap-1 active:scale-95"
            >
              <Sparkles className="w-3 h-3 text-[#D4A373]" />
              <span>Fill Credentials</span>
            </button>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xl p-6 sm:p-8 backdrop-blur-md">
          {/* Tab Selector: Sign In vs Register */}
          <div className="flex rounded-xl bg-stone-100 p-1 mb-6 border border-stone-200/60">
            <button
              type="button"
              onClick={() => {
                setIsRegisterMode(false);
                setError(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                !isRegisterMode
                  ? 'bg-white text-[#006D77] shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsRegisterMode(true);
                setError(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                isRegisterMode
                  ? 'bg-white text-[#006D77] shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              Register New User
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2 text-xs text-rose-800">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegisterMode && (
              <>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="e.g. Jane Wangari"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#006D77]/20 focus:border-[#006D77] transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                    Organizational Role
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="e.g. Operations Manager, QA Lead"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#006D77]/20 focus:border-[#006D77] transition-all"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#006D77]/20 focus:border-[#006D77] transition-all font-mono"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600">
                  Password
                </label>
                {!isRegisterMode && (
                  <span className="text-[11px] text-stone-400">
                    Master key: <span className="font-mono text-stone-600">labversaly-16</span>
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#006D77]/20 focus:border-[#006D77] transition-all font-mono"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-[#006D77] hover:bg-[#004D54] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.99] mt-2 cursor-pointer"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isRegisterMode ? 'Create Isolated Workspace' : 'Sign In to Workspace'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Privacy & Multi-User Isolation Guarantee */}
          <div className="mt-6 pt-4 border-t border-stone-100 flex items-start gap-2 text-[11px] text-stone-500 leading-relaxed">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong className="text-stone-700">Account Isolation Guarantee:</strong> Different users operate on their own scoped database. Orders, inventory movements, and financial records never conflict.
            </span>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[11px] text-stone-400 mt-6">
          Highland Gardens Ltd • Nairobi, Kenya • Enterprise Operations
        </p>
      </div>
    </div>
  );
};
