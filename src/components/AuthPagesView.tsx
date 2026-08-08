import React, { useState, useEffect } from 'react';
import { apiClient } from '../services/apiClient';
import { User } from '../types';
import { Mail, Lock, User as UserIcon, ArrowRight, ShieldCheck, CheckCircle2, KeyRound, AlertCircle, ArrowLeft } from 'lucide-react';

interface AuthPagesViewProps {
  mode: 'login' | 'register' | 'forgot-password' | 'reset-password';
  onNavigate: (path: string, mode: 'login' | 'register' | 'forgot-password' | 'reset-password') => void;
  onAuthSuccess: (user: User) => void;
  promptMessage?: string;
}

export const AuthPagesView: React.FC<AuthPagesViewProps> = ({
  mode,
  onNavigate,
  onAuthSuccess,
  promptMessage,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Extract token from URL query string on reset-password page load
  useEffect(() => {
    if (mode === 'reset-password') {
      const urlParams = new URLSearchParams(window.location.search);
      const tokenFromUrl = urlParams.get('token') || 'demo_reset_token_123';
      setResetToken(tokenFromUrl);
    }
    setError(null);
    setSuccessMessage(null);
  }, [mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await apiClient.auth.login({ email, password });
        onAuthSuccess(res.user);
      } else if (mode === 'register') {
        const res = await apiClient.auth.register({ email, password, name });
        onAuthSuccess(res.user);
      } else if (mode === 'forgot-password') {
        const res = await apiClient.auth.forgotPassword(email);
        setSuccessMessage(res.message);
      } else if (mode === 'reset-password') {
        const res = await apiClient.auth.resetPassword(resetToken, newPassword);
        setSuccessMessage(res.message);
        setTimeout(() => {
          onNavigate('/login', 'login');
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#FAFBFC]">
      <div className="w-full max-w-md bg-[#0A0F1A] border border-[#1A2234] rounded-2xl shadow-2xl overflow-hidden text-white">
        {/* Top Accent Band */}
        <div className="bg-linear-to-r from-[#22C55E] via-[#4ADE80] to-[#22C55E] h-1.5 w-full" />

        <div className="p-8 space-y-6">
          {/* Header Branding */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 text-[#22C55E] font-mono text-xs font-bold uppercase tracking-wider bg-[#22C55E]/10 border border-[#22C55E]/20 px-3 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>MarketMaven Identity</span>
            </div>

            <h1 className="text-3xl font-serif font-bold tracking-tight text-white">
              {mode === 'login' && 'Sign In to MarketMaven'}
              {mode === 'register' && 'Create Your Account'}
              {mode === 'forgot-password' && 'Reset Your Password'}
              {mode === 'reset-password' && 'Set New Password'}
            </h1>

            {promptMessage ? (
              <p className="text-xs text-[#00D1B2] bg-[#00D1B2]/10 border border-[#00D1B2]/30 px-3 py-2 rounded-lg mt-2">
                {promptMessage}
              </p>
            ) : (
              <p className="text-xs text-slate-400">
                {mode === 'login' && 'Enter your credentials to access saved dispatches & portfolio watchlists.'}
                {mode === 'register' && 'Join MarketMaven to personalize your financial intelligence wire.'}
                {mode === 'forgot-password' && 'Enter your email to receive password reset instructions.'}
                {mode === 'reset-password' && 'Enter your new password below.'}
              </p>
            )}
          </div>

          {/* Mode Switcher Buttons */}
          {(mode === 'login' || mode === 'register') && (
            <div className="flex bg-[#141A29] p-1 rounded-xl border border-white/5">
              <button
                type="button"
                onClick={() => onNavigate('/login', 'login')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  mode === 'login' ? 'bg-[#1E5EFF] text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => onNavigate('/register', 'register')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  mode === 'register' ? 'bg-[#1E5EFF] text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Register
              </button>
            </div>
          )}

          {/* Inline Error Display */}
          {error && (
            <div className="p-3.5 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="font-medium">{error}</div>
            </div>
          )}

          {/* Inline Success Display */}
          {successMessage && (
            <div className="p-3.5 bg-[#00C48C]/10 border border-[#00C48C]/30 text-[#00C48C] text-xs rounded-xl flex items-start gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-[#00C48C] shrink-0 mt-0.5" />
              <div className="font-medium">{successMessage}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="Alexander Hamilton"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#141A29] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#1E5EFF] transition-colors"
                  />
                </div>
              </div>
            )}

            {(mode === 'login' || mode === 'register' || mode === 'forgot-password') && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                  <input
                    type="email"
                    required
                    placeholder="analyst@marketmaven.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#141A29] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#1E5EFF] transition-colors"
                  />
                </div>
              </div>
            )}

            {(mode === 'login' || mode === 'register') && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-300">Password</label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => onNavigate('/forgot-password', 'forgot-password')}
                      className="text-[11px] text-[#1E5EFF] hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#141A29] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#1E5EFF] transition-colors"
                  />
                </div>
                {mode === 'register' && <p className="text-[10px] text-slate-500 mt-1">Minimum 6 characters</p>}
              </div>
            )}

            {mode === 'reset-password' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Reset Token</label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={resetToken}
                      onChange={(e) => setResetToken(e.target.value)}
                      className="w-full bg-[#141A29] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:border-[#1E5EFF]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">New Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-[#141A29] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#1E5EFF]"
                    />
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#1E5EFF] hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-4"
            >
              {loading ? (
                <span>Communicating with MarketMaven Wire...</span>
              ) : (
                <>
                  <span>
                    {mode === 'login' && 'Log In to Account'}
                    {mode === 'register' && 'Complete Registration'}
                    {mode === 'forgot-password' && 'Send Reset Link'}
                    {mode === 'reset-password' && 'Reset Password Now'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Back Links */}
          <div className="pt-2 text-center text-xs text-slate-400 border-t border-white/10 flex items-center justify-center gap-4">
            {mode === 'forgot-password' || mode === 'reset-password' ? (
              <button
                type="button"
                onClick={() => onNavigate('/login', 'login')}
                className="flex items-center gap-1 text-[#1E5EFF] hover:underline font-semibold cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Log In</span>
              </button>
            ) : mode === 'login' ? (
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => onNavigate('/register', 'register')}
                  className="text-[#1E5EFF] hover:underline font-bold cursor-pointer"
                >
                  Create free account
                </button>
              </p>
            ) : (
              <p>
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => onNavigate('/login', 'login')}
                  className="text-[#1E5EFF] hover:underline font-bold cursor-pointer"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Benefits Footer */}
        <div className="px-8 py-4 bg-[#070A12] border-t border-white/5 text-[11px] text-slate-400 flex items-center justify-around">
          <div className="flex items-center gap-1.5 text-[#00C48C]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Personalized Watchlist</span>
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
