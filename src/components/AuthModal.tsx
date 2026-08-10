import React, { useState } from 'react';
import { X, Mail, Lock, User as UserIcon, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { User } from '../types';
import { apiClient } from '../services/apiClient';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
  initialMode?: 'login' | 'signup';
  promptMessage?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'login',
  promptMessage,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await apiClient.auth.login({ email, password });
        onSuccess(res.user);
        onClose();
      } else {
        const res = await apiClient.auth.register({ email, password, name });
        onSuccess(res.user);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#0A0F1A] border border-white/10 text-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="p-6 border-b border-white/10 bg-linear-to-b from-white/5 to-transparent">
          <div className="flex items-center gap-2 text-[#22C55E] text-xs font-mono font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>MarketMaven Intelligence Membership</span>
          </div>
          <h2 className="text-2xl font-bold font-serif">
            {mode === 'login' ? 'Welcome Back' : 'Create Your Account'}
          </h2>
          {promptMessage ? (
            <p className="mt-2 text-xs text-[#00D1B2] bg-[#00D1B2]/10 border border-[#00D1B2]/30 px-3 py-2 rounded-md">
              {promptMessage}
            </p>
          ) : (
            <p className="mt-1 text-xs text-slate-400">
              Access your saved articles, personalized ticker watchlists, and research tools.
            </p>
          )}

          {/* Mode Switcher Tabs */}
          <div className="flex bg-[#141A29] p-1 rounded-lg mt-4 border border-white/5">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError(null);
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                mode === 'login' ? 'bg-[#22C55E] text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setError(null);
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                mode === 'signup' ? 'bg-[#22C55E] text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-md">
              {error}
            </div>
          )}

          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="Alexander Hamilton"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#141A29] border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#22C55E]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="email"
                required
                placeholder="analyst@marketmaven.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#141A29] border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#22C55E]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#141A29] border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#22C55E]"
              />
            </div>
            <p className="text-[10px] text-slate-500 mt-1">Minimum 6 characters</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-[#22C55E] hover:bg-[#16A34A] font-semibold text-sm rounded-lg text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
          >
            {loading ? (
              <span>Processing...</span>
            ) : (
              <>
                <span>{mode === 'login' ? 'Log In to Account' : 'Complete Registration'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="pt-2 text-center text-xs text-slate-400">
            {mode === 'login' ? (
              <p>
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="text-[#22C55E] hover:underline font-semibold"
                >
                  Sign up free
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-[#22C55E] hover:underline font-semibold"
                >
                  Log in
                </button>
              </p>
            )}
          </div>
        </form>

        {/* Benefits Footer */}
        <div className="px-6 py-4 bg-[#070A12] border-t border-white/5 text-[11px] text-slate-400 flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-[#00C48C]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Free Watchlists</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#00C48C]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Saved Reading Lists</span>
          </div>
        </div>
      </div>
    </div>
  );
};
