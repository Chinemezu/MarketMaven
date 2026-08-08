import React, { useState } from 'react';
import { Mail, Clock, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { submitNewsletterSignup } from '../services/api';

interface TemplateCPageProps {
  title: string;
  description?: string;
  categoryName?: string;
}

export const TemplateCPage: React.FC<TemplateCPageProps> = ({
  title,
  description,
  categoryName,
}) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAlertSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) return;

    setLoading(true);
    try {
      await submitNewsletterSignup(email.trim());
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center space-y-8">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1E5EFF]/10 border border-[#1E5EFF]/30 text-[#1E5EFF] text-xs font-mono font-bold uppercase tracking-widest rounded-full">
        <Sparkles className="w-3.5 h-3.5" />
        <span>MarketMaven Wire Expansion • Coming Soon</span>
      </div>

      {/* Main Headline & Subtitle */}
      <div className="space-y-4 max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-5xl font-bold font-serif text-[#14181F] leading-tight">
          {title}
        </h1>
        <p className="text-base text-[#5A6478] leading-relaxed">
          {description ||
            `Institutional coverage and data pipelines for ${title} are currently in active deployment for our next wire release.`}
        </p>
      </div>

      {/* Feature Preview List */}
      <div className="bg-white border border-[#E3E8F1] rounded-2xl p-6 sm:p-8 max-w-xl mx-auto shadow-xs text-left space-y-4">
        <h3 className="text-xs font-mono font-bold text-[#1E5EFF] uppercase tracking-wider">
          Planned Intelligence Module Features
        </h3>

        <div className="space-y-3 text-xs text-[#14181F]">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-[#00C48C] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Real-time Data Feeds & Order Books:</span> Direct exchange integration for sub-second quote updates.
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-[#00C48C] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Institutional Analytical Reports:</span> Weekly vertical dispatches authored by sector economists.
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-[#00C48C] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Custom Alert Triggers:</span> Instant email notifications on volume spikes or major regulatory shifts.
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Alert Capture */}
      <div className="bg-[#0A0F1A] text-white rounded-2xl p-8 max-w-xl mx-auto shadow-xl border border-white/10 space-y-4 text-center">
        <div className="w-10 h-10 bg-[#22C55E]/20 border border-[#22C55E] text-[#22C55E] rounded-full flex items-center justify-center mx-auto">
          <Mail className="w-5 h-5" />
        </div>

        <div className="space-y-1">
          <h3 className="text-lg font-bold font-serif">Get Notified at Launch</h3>
          <p className="text-xs text-slate-400">
            Be the first to access {title} when this section goes live on the wire.
          </p>
        </div>

        {submitted ? (
          <div className="p-4 bg-[#00D1B2]/10 border border-[#00D1B2]/30 text-[#00D1B2] text-xs font-semibold rounded-lg">
            ✓ You're on the priority notification list! We'll alert you the moment this section launches.
          </div>
        ) : (
          <form onSubmit={handleAlertSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input
              type="email"
              required
              placeholder="subscriber@marketmaven.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-[#141A29] border border-white/10 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#1E5EFF]"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-[#1E5EFF] hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Notify Me'}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
