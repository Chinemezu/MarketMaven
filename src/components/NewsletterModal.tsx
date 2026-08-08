import React, { useState } from 'react';
import { submitNewsletterSignup } from '../services/api';
import { X, Mail, CheckCircle2, AlertCircle, ArrowRight, Shield } from 'lucide-react';

interface NewsletterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewsletterModal: React.FC<NewsletterModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [statusState, setStatusState] = useState<'idle' | 'submitting' | 'subscribed' | 'already_subscribed' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatusState('error');
      setStatusMessage('Please enter a valid email address.');
      return;
    }

    setStatusState('submitting');
    try {
      const res = await submitNewsletterSignup(email);
      if (res.status === 'already_subscribed') {
        setStatusState('already_subscribed');
        setStatusMessage("You're already on the list");
      } else {
        setStatusState('subscribed');
        setStatusMessage(res.message || 'Thank you for subscribing to MarketMaven Daily!');
      }
    } catch (err) {
      setStatusState('error');
      setStatusMessage('Subscription failed. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className="bg-[#0A0F1A] text-white rounded-2xl max-w-md w-full shadow-2xl border border-[#1A2234] p-6 sm:p-8 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-[#151D2F]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-[#22C55E] text-xs font-bold uppercase tracking-wider mb-2">
          <Mail className="w-4 h-4" /> MarketMaven Daily
        </div>

        <h3 className="font-serif text-2xl font-bold text-white mb-2">
          Subscribe to Editorial Briefs
        </h3>

        <p className="text-xs text-slate-300 leading-relaxed mb-6">
          Receive daily market intelligence, frontier debt commentary, and FX liquidity tracking direct to your inbox before European markets open.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[11px] font-medium text-slate-300 block mb-1">
              Work / Professional Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              required
              className="w-full px-4 py-3 bg-[#151D2F] border border-[#2A3752] text-white placeholder-slate-400 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E5EFF]"
            />
          </div>

          <button
            type="submit"
            disabled={statusState === 'submitting'}
            className="w-full py-3 bg-[#1E5EFF] hover:bg-blue-600 text-white font-bold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            {statusState === 'submitting' ? (
              'Subscribing...'
            ) : (
              <>
                <span>Get Free Briefings</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
            <Shield className="w-3.5 h-3.5 text-[#00C48C]" /> Zero spam. Unsubscribe anytime in 1-click.
          </div>
        </form>

        {statusState === 'already_subscribed' && (
          <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>You're already on the list</span>
          </div>
        )}

        {statusState === 'subscribed' && (
          <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-200 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {statusState === 'error' && (
          <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
};
