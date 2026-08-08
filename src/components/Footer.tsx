import React, { useState } from 'react';
import { Logo } from './Logo';
import { TopSource } from '../types';
import { submitNewsletterSignup } from '../services/api';
import { ArrowRight, CheckCircle2, AlertCircle, ShieldAlert } from 'lucide-react';

interface FooterProps {
  topSources: TopSource[];
  onSelectCategory: (category: string) => void;
  onSourceSelect?: (sourceName: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  topSources,
  onSelectCategory,
  onSourceSelect,
}) => {
  const [email, setEmail] = useState('');
  const [statusState, setStatusState] = useState<'idle' | 'submitting' | 'subscribed' | 'already_subscribed' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const handleFooterSubmit = async (e: React.FormEvent) => {
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
        setStatusMessage(res.message || 'Subscribed successfully!');
      }
    } catch (err) {
      setStatusState('error');
      setStatusMessage('Error subscribing.');
    }
  };

  return (
    <footer className="bg-[#0A0F1A] text-slate-300 pt-14 pb-8 border-t border-[#1A2234]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#1A2234]">
          
          {/* Col 1: Brand & Bio (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <Logo size="lg" lightText={true} />
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              MarketMaven is a global financial markets and emerging economies news publication. We curate high-relevance insights, sovereign liquidity data, and central bank coverage across Africa, Asia, and frontier capital markets.
            </p>

            {/* Newsletter 3rd instance in footer */}
            <div className="pt-2">
              <span className="text-xs font-semibold text-white block mb-2">
                Subscribe to MarketMaven Morning Wire
              </span>
              <form onSubmit={handleFooterSubmit} className="flex gap-2 max-w-sm">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="flex-1 px-3 py-2 bg-[#151D2F] border border-[#263148] text-white text-xs rounded-lg focus:outline-none focus:ring-1 focus:ring-[#22C55E]"
                />
                <button
                  type="submit"
                  disabled={statusState === 'submitting'}
                  className="px-3.5 py-2 bg-[#22C55E] hover:bg-[#16A34A] text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer shrink-0"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {statusState === 'already_subscribed' && (
                <div className="mt-2 text-[11px] text-amber-300 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> You're already on the list
                </div>
              )}
              {statusState === 'subscribed' && (
                <div className="mt-2 text-[11px] text-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {statusMessage}
                </div>
              )}
            </div>
          </div>

          {/* Col 2: Coverage Sections */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Coverage
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onSelectCategory('All')} className="hover:text-white transition-colors">
                  Home & Wire
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('Emerging Markets')} className="hover:text-white transition-colors">
                  Emerging Markets
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('Markets')} className="hover:text-white transition-colors">
                  Global Capital Markets
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('FX & Currencies')} className="hover:text-white transition-colors">
                  FX & Central Banks
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('Macroeconomics')} className="hover:text-white transition-colors">
                  Macroeconomics
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('Tech & Innovation')} className="hover:text-white transition-colors">
                  Fintech & Digital Rails
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Top Sources */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Top Sources
            </h4>
            <ul className="space-y-2 text-xs">
              {topSources.slice(0, 6).map((src) => (
                <li key={src.id}>
                  <button
                    onClick={() => onSourceSelect && onSourceSelect(src.name)}
                    className="hover:text-white transition-colors flex items-center justify-between w-full text-left"
                  >
                    <span>{src.name}</span>
                    <span className="text-[10px] text-slate-500 font-num">{src.articleCount}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Legal & Disclaimer */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Platform & Legal
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#about" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors">About MarketMaven</a></li>
              <li><a href="#editorial" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors">Editorial Guidelines</a></li>
              <li><a href="#privacy" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#terms" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#rss" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors">RSS Wire Feeds</a></li>
            </ul>
          </div>

        </div>

        {/* Disclaimer & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p className="flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5 shrink-0 text-slate-400" />
            Financial Market Disclaimer: MarketMaven news content is provided for informational and editorial purposes only and does not constitute investment advice.
          </p>
          <p className="font-num shrink-0">
            © {new Date().getFullYear()} MarketMaven Analytics Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
