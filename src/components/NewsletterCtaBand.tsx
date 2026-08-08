import React, { useState } from 'react';
import { submitNewsletterSignup } from '../services/api';
import { Mail, CheckCircle2, AlertCircle, ArrowRight, Shield } from 'lucide-react';

export const NewsletterCtaBand: React.FC = () => {
  const [email, setEmail] = useState('');
  const [statusState, setStatusState] = useState<'idle' | 'submitting' | 'subscribed' | 'already_subscribed' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

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
      setStatusMessage('Failed to subscribe. Please try again.');
    }
  };

  return (
    <section className="py-16 bg-[#0A0F1A] text-white relative overflow-hidden border-t border-b border-[#1A2234]">
      {/* Background radial ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[37.5rem] h-[18.75rem] max-w-full bg-[#22C55E]/15 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#22C55E]/20 border border-[#22C55E]/40 text-[#4ADE80] text-xs font-semibold rounded-full uppercase tracking-wider mb-4">
          <Mail className="w-3.5 h-3.5" /> MarketMaven Editorial Intelligence
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
          Stay Ahead of Emerging Markets & Global Finance
        </h2>

        <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto mb-8 leading-relaxed">
          Join 85,000+ portfolio managers, central bank watchers, and financial analysts receiving our curated morning brief and breaking liquidity alerts.
        </p>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your corporate or professional email"
              required
              className="flex-1 px-4 py-3 bg-[#151D2F] border border-[#2A3752] text-white placeholder-slate-400 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22C55E]"
            />
            <button
              type="submit"
              disabled={statusState === 'submitting'}
              className="px-6 py-3 bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md shrink-0"
            >
              {statusState === 'submitting' ? (
                'Subscribing...'
              ) : (
                <>
                  <span>Get Free Access</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          <div className="flex items-center justify-center gap-4 text-xs text-slate-400 pt-1">
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-[#00C48C]" /> No spam, unsubscribe anytime
            </span>
            <span>•</span>
            <span>Delivered 6:00 AM UTC</span>
          </div>
        </form>

        {/* Message Banner */}
        {statusState === 'already_subscribed' && (
          <div className="mt-4 max-w-md mx-auto p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-200 text-xs flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            <span>You're already on the list</span>
          </div>
        )}

        {statusState === 'subscribed' && (
          <div className="mt-4 max-w-md mx-auto p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-200 text-xs flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{statusMessage}</span>
          </div>
        )}

        {statusState === 'error' && (
          <div className="mt-4 max-w-md mx-auto p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-200 text-xs flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400" />
            <span>{statusMessage}</span>
          </div>
        )}
      </div>
    </section>
  );
};
