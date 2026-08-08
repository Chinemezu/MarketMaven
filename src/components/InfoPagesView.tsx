import React, { useState } from 'react';
import { PageTemplateType } from '../types';
import { 
  ShieldAlert, 
  FileText, 
  Lock, 
  Cookie, 
  Info, 
  Mail, 
  CheckCircle2, 
  Send, 
  HelpCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface InfoPagesViewProps {
  page: 'about' | 'terms' | 'privacy' | 'disclaimer' | 'cookies' | 'contact';
  onNavigate: (template: PageTemplateType, label: string) => void;
}

export const InfoPagesView: React.FC<InfoPagesViewProps> = ({ page, onNavigate }) => {
  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactType, setContactType] = useState('general');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
  };

  return (
    <div className="bg-[#0A0F1A] text-slate-100 min-h-[calc(100vh-200px)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Navigation Tab Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-10 pb-6 border-b border-white/10 text-xs font-medium">
          <button
            onClick={() => onNavigate('about', 'About MarketMaven')}
            className={`px-3.5 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              page === 'about'
                ? 'bg-[#22C55E] text-white font-bold'
                : 'bg-[#14181F] text-slate-300 hover:text-white hover:bg-[#1A2234]'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            About Us
          </button>

          <button
            onClick={() => onNavigate('disclaimer', 'Disclaimer')}
            className={`px-3.5 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              page === 'disclaimer'
                ? 'bg-[#22C55E] text-white font-bold'
                : 'bg-[#14181F] text-slate-300 hover:text-white hover:bg-[#1A2234]'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            Disclaimer
          </button>

          <button
            onClick={() => onNavigate('terms', 'Terms of Service')}
            className={`px-3.5 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              page === 'terms'
                ? 'bg-[#22C55E] text-white font-bold'
                : 'bg-[#14181F] text-slate-300 hover:text-white hover:bg-[#1A2234]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Terms of Service
          </button>

          <button
            onClick={() => onNavigate('privacy', 'Privacy Policy')}
            className={`px-3.5 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              page === 'privacy'
                ? 'bg-[#22C55E] text-white font-bold'
                : 'bg-[#14181F] text-slate-300 hover:text-white hover:bg-[#1A2234]'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            Privacy Policy
          </button>

          <button
            onClick={() => onNavigate('cookies', 'Cookies & Local Storage')}
            className={`px-3.5 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              page === 'cookies'
                ? 'bg-[#22C55E] text-white font-bold'
                : 'bg-[#14181F] text-slate-300 hover:text-white hover:bg-[#1A2234]'
            }`}
          >
            <Cookie className="w-3.5 h-3.5" />
            Cookies & Local Storage
          </button>

          <button
            onClick={() => onNavigate('contact', 'Contact Us')}
            className={`px-3.5 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              page === 'contact'
                ? 'bg-[#22C55E] text-white font-bold'
                : 'bg-[#14181F] text-slate-300 hover:text-white hover:bg-[#1A2234]'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            Contact
          </button>
        </div>

        {/* 1. ABOUT MARKETMAVEN */}
        {page === 'about' && (
          <div className="space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] text-xs font-semibold mb-4">
                <Info className="w-3.5 h-3.5" /> Platform Intelligence
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
                About MarketMaven
              </h1>
              <p className="text-lg text-slate-300 leading-relaxed font-light">
                MarketMaven is a financial intelligence platform covering Nigerian and global capital markets. We bring together market data, aggregated news, and original analysis in one place — built for investors who want the full picture, not just headlines from one market at a time.
              </p>
            </div>

            <div className="bg-[#14181F] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
              <h2 className="text-xl font-bold text-white border-b border-white/10 pb-3">
                What We Do
              </h2>
              <ul className="space-y-4 text-sm text-slate-300">
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#22C55E] mt-2 shrink-0" />
                  <div>
                    <strong className="text-white block font-semibold mb-0.5">Dual-Market Coverage</strong>
                    Track Nigerian (NGX) and global (US and beyond) equities side by side with live indices and macroeconomic indicators.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#22C55E] mt-2 shrink-0" />
                  <div>
                    <strong className="text-white block font-semibold mb-0.5">Aggregated News Intelligence</strong>
                    Aggregate financial news from trusted sources across markets, currencies, and sectors into structured vertical channels.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#22C55E] mt-2 shrink-0" />
                  <div>
                    <strong className="text-white block font-semibold mb-0.5">Institutional Special Reports</strong>
                    Publish original reports and deep-dive analysis under Featured Reports, written by market analysts and economists.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#22C55E] mt-2 shrink-0" />
                  <div>
                    <strong className="text-white block font-semibold mb-0.5">Interactive Research Tools</strong>
                    Provide research tools — stock screeners, technical charting workbenches, FX spot converters, and reference material for investors at every level.
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-[#151D2F] border-l-4 border-[#22C55E] p-5 rounded-r-xl text-sm text-slate-300 leading-relaxed">
              <p className="font-medium text-white mb-1">Non-Broker Status Notice</p>
              MarketMaven is an information platform, not a broker or investment adviser. Nothing here is investment advice — see our <button onClick={() => onNavigate('disclaimer', 'Disclaimer')} className="text-[#22C55E] underline font-semibold hover:text-emerald-400 cursor-pointer">Disclaimer</button> for full details.
            </div>

            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
              <p>Questions or feedback: <a href="mailto:contact@marketmaven.com" className="text-[#22C55E] hover:underline font-mono">contact@marketmaven.com</a></p>
              <button 
                onClick={() => onNavigate('contact', 'Contact Us')}
                className="px-4 py-2 bg-[#22C55E] text-white font-bold rounded-lg hover:bg-emerald-600 transition-colors cursor-pointer"
              >
                Get in Touch
              </button>
            </div>
          </div>
        )}

        {/* 2. DISCLAIMER */}
        {page === 'disclaimer' && (
          <div className="space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-4">
                <ShieldAlert className="w-3.5 h-3.5" /> Legal Disclaimer Notice
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2">
                Disclaimer
              </h1>
              <p className="text-xs text-amber-300 font-mono">
                DRAFT — for review before publishing, written as a starting point, not by a lawyer.
              </p>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              This page exists because the "not investment advice" point is important enough to deserve its own page, not just a paragraph buried in the Terms of Service.
            </p>

            <div className="space-y-6">
              <div className="bg-[#14181F] border border-white/10 rounded-xl p-6 space-y-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  Not a Broker or Investment Adviser
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>MarketMaven is not a broker-dealer, investment adviser, or exchange.</strong> We don't execute trades, hold funds or securities, or provide personalized investment recommendations.
                </p>
              </div>

              <div className="bg-[#14181F] border border-white/10 rounded-xl p-6 space-y-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  Informational & Educational Use Only
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>Everything on this platform</strong> — market data, charts, benchmarking comparisons, aggregated news, and Featured Reports — is provided for informational and educational purposes only. None of it should be treated as a recommendation to buy, sell, or hold any security, currency, or asset. Past performance shown in any chart or comparison is not indicative of future results.
                </p>
              </div>

              <div className="bg-[#14181F] border border-white/10 rounded-xl p-6 space-y-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  Market Data Accuracy & Third-Party Feeds
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>Market data may be delayed, incomplete, or contain errors.</strong> We source from third parties (NGX, SEC Nigeria, SEC EDGAR, and other providers) and don't guarantee accuracy or timeliness. Where a value in the interface is marked as placeholder or illustrative, it is explicitly not live data.
                </p>
              </div>

              <div className="bg-[#14181F] border border-white/10 rounded-xl p-6 space-y-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  Aggregated News Attribution
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>Aggregated news is not written or endorsed by MarketMaven.</strong> Each item is credited to its original source; views expressed belong to the original publisher.
                </p>
              </div>

              <div className="bg-[#14181F] border border-white/10 rounded-xl p-6 space-y-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  Featured Reports & Author Opinions
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>Featured Reports reflect the views of their author at the time of publication</strong>, not a house position of MarketMaven, and are not updated retroactively as market conditions change unless explicitly noted.
                </p>
              </div>

              <div className="bg-[#22C55E]/10 border border-[#22C55E]/30 rounded-xl p-6 text-xs text-emerald-200 leading-relaxed">
                <strong>Professional Advisory Requirement:</strong> Before making any investment decision, consult a licensed financial adviser who can account for your individual circumstances — something no article, chart, or platform can do for you.
              </div>
            </div>
          </div>
        )}

        {/* 3. TERMS OF SERVICE */}
        {page === 'terms' && (
          <div className="space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-4">
                <FileText className="w-3.5 h-3.5" /> Platform Terms
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2">
                Terms of Service
              </h1>
              <p className="text-xs text-slate-400 font-mono">Draft for Review — MarketMaven Analytics</p>
            </div>

            <div className="prose prose-invert max-w-none text-xs text-slate-300 space-y-6 leading-relaxed">
              <section className="bg-[#14181F] border border-white/10 p-6 rounded-xl space-y-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">1. Acceptance of Terms</h3>
                <p>
                  By accessing or using the MarketMaven website, applications, or research services (collectively, the "Platform"), you agree to be bound by these Terms of Service. If you do not agree to these terms, you must discontinue access to the Platform immediately.
                </p>
              </section>

              <section className="bg-[#14181F] border border-white/10 p-6 rounded-xl space-y-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">2. Intellectual Property Rights</h3>
                <p>
                  All content, branding, original reports, logos, UI designs, code, and databases published on MarketMaven are the property of MarketMaven Analytics Inc. or its content licensing partners. You may not reproduce, distribute, or modify any material without explicit prior written authorization.
                </p>
              </section>

              <section className="bg-[#14181F] border border-white/10 p-6 rounded-xl space-y-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">3. Account & Security</h3>
                <p>
                  Users who register an account are responsible for maintaining the confidentiality of their credentials. You agree to notify MarketMaven immediately of any unauthorized account access.
                </p>
              </section>

              <section className="bg-[#14181F] border border-white/10 p-6 rounded-xl space-y-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">4. Limitation of Liability</h3>
                <p>
                  MarketMaven shall not be liable for any financial losses, trading damages, or indirect consequences arising from the use or inability to use market information provided on this platform.
                </p>
              </section>
            </div>
          </div>
        )}

        {/* 4. PRIVACY POLICY */}
        {page === 'privacy' && (
          <div className="space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-4">
                <Lock className="w-3.5 h-3.5" /> Privacy & Data Protection
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2">
                Privacy Policy
              </h1>
              <p className="text-xs text-slate-400 font-mono">Draft for Review — MarketMaven Privacy Commitment</p>
            </div>

            <div className="prose prose-invert max-w-none text-xs text-slate-300 space-y-6 leading-relaxed">
              <section className="bg-[#14181F] border border-white/10 p-6 rounded-xl space-y-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Information We Collect</h3>
                <p>
                  We collect information you explicitly provide when registering (such as email address and name), saving stock watchlists, or subscribing to our morning wire briefings.
                </p>
              </section>

              <section className="bg-[#14181F] border border-white/10 p-6 rounded-xl space-y-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">How We Use Your Data</h3>
                <p>
                  Your information is used solely to deliver account features (synced watchlists, bookmarked reports, and requested email briefings). We do not sell or trade personal user data to third-party brokers or ad networks.
                </p>
              </section>

              <section className="bg-[#14181F] border border-white/10 p-6 rounded-xl space-y-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Data Security</h3>
                <p>
                  We utilize industry-standard cryptographic storage and JWT session management to protect user account data across web client sessions.
                </p>
              </section>
            </div>
          </div>
        )}

        {/* 5. COOKIES & LOCAL STORAGE */}
        {page === 'cookies' && (
          <div className="space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-semibold mb-4">
                <Cookie className="w-3.5 h-3.5" /> Browser Storage Transparency
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2">
                Cookies & Local Storage
              </h1>
              <p className="text-xs text-purple-300 font-mono">
                DRAFT — for review before publishing.
              </p>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              This is a short, honest account of what we actually store in your browser — not a boilerplate cookie-consent template listing categories we don't use.
            </p>

            <div className="space-y-6">
              <div className="bg-[#14181F] border border-white/10 rounded-xl p-6 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                  What We Store
                </h3>
                <ul className="space-y-3 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] mt-1.5 shrink-0" />
                    <div>
                      <strong className="text-white">Authentication token (`localStorage`)</strong> — if you're logged in, a session token is stored in your browser's local storage so you don't have to log in on every visit. This is not a tracking cookie; it identifies your session, not your browsing activity elsewhere.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] mt-1.5 shrink-0" />
                    <div>
                      <strong className="text-white">Theme preference</strong> (dark/light mode), if you've set one.
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-[#14181F] border border-white/10 rounded-xl p-6 space-y-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-400" />
                  What We Don't Currently Use
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Third-party advertising cookies, cross-site tracking pixels, or analytics cookies that build a profile of you across other sites. <em>(If analytics gets added later — even privacy-respecting analytics — this page needs updating before that ships, not after.)</em>
                </p>
              </div>

              <div className="bg-[#14181F] border border-white/10 rounded-xl p-6 space-y-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Cookie className="w-4 h-4 text-amber-400" />
                  Clearing Your Data
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Clearing your browser's local storage will log you out and reset your theme preference. No account data is lost — everything tied to your account (watchlist, saved articles) lives on our server, not in your browser.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 6. CONTACT */}
        {page === 'contact' && (
          <div className="space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] text-xs font-semibold mb-4">
                <Mail className="w-3.5 h-3.5" /> Connect With Us
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2">
                Contact
              </h1>
              <p className="text-sm text-slate-300">
                We're a small, focused team right now — expect a real response, just not necessarily an instant one.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Direct Info */}
              <div className="space-y-4">
                <div className="bg-[#14181F] border border-white/10 p-5 rounded-xl space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">General Inquiries</span>
                  <a href="mailto:contact@marketmaven.com" className="text-sm text-[#22C55E] font-mono hover:underline font-semibold">
                    contact@marketmaven.com
                  </a>
                </div>

                <div className="bg-[#14181F] border border-white/10 p-5 rounded-xl space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Market Data Accuracy</span>
                  <a href="mailto:data@marketmaven.com" className="text-sm text-[#22C55E] font-mono hover:underline font-semibold">
                    data@marketmaven.com
                  </a>
                </div>

                <div className="bg-[#151D2F] border border-white/10 p-5 rounded-xl text-xs text-slate-400 leading-relaxed">
                  <p className="font-semibold text-slate-300 mb-1">Office Location</p>
                  MarketMaven Analytics Inc.<br />
                  Capital Markets & Editorial Hub<br />
                  Victoria Island, Lagos & Global Remote
                </div>
              </div>

              {/* Interactive Form */}
              <div className="lg:col-span-2 bg-[#14181F] border border-white/10 rounded-2xl p-6 sm:p-8">
                {contactSubmitted ? (
                  <div className="py-12 text-center space-y-3">
                    <CheckCircle2 className="w-12 h-12 text-[#22C55E] mx-auto animate-bounce" />
                    <h3 className="text-xl font-bold text-white">Message Sent</h3>
                    <p className="text-xs text-slate-300 max-w-sm mx-auto">
                      Thank you for reaching out. A team member will review your note and respond to <span className="text-[#22C55E] font-mono">{contactEmail}</span> shortly.
                    </p>
                    <button
                      onClick={() => {
                        setContactSubmitted(false);
                        setContactMessage('');
                      }}
                      className="mt-4 px-4 py-2 bg-[#1A2234] text-xs text-slate-300 hover:text-white rounded-lg cursor-pointer"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <h3 className="text-base font-bold text-white mb-2">Send us a message</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-slate-400 font-semibold mb-1">Your Name</label>
                        <input
                          type="text"
                          required
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder="Jane Doe"
                          className="w-full px-3 py-2 bg-[#151D2F] border border-[#263148] text-white text-xs rounded-lg focus:outline-none focus:ring-1 focus:ring-[#22C55E]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-slate-400 font-semibold mb-1">Your Email</label>
                        <input
                          type="email"
                          required
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          placeholder="jane@example.com"
                          className="w-full px-3 py-2 bg-[#151D2F] border border-[#263148] text-white text-xs rounded-lg focus:outline-none focus:ring-1 focus:ring-[#22C55E]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-slate-400 font-semibold mb-1">Inquiry Type</label>
                      <select
                        value={contactType}
                        onChange={(e) => setContactType(e.target.value)}
                        className="w-full px-3 py-2 bg-[#151D2F] border border-[#263148] text-white text-xs rounded-lg focus:outline-none focus:ring-1 focus:ring-[#22C55E]"
                      >
                        <option value="general">General Inquiry / Feedback</option>
                        <option value="data">Report Market Data Issue</option>
                        <option value="press">Press & Editorial</option>
                        <option value="research">Research Report Collaboration</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs text-slate-400 font-semibold mb-1">Message</label>
                      <textarea
                        required
                        rows={4}
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        placeholder="How can we help you?"
                        className="w-full px-3 py-2 bg-[#151D2F] border border-[#263148] text-white text-xs rounded-lg focus:outline-none focus:ring-1 focus:ring-[#22C55E]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full sm:w-auto px-6 py-2.5 bg-[#22C55E] hover:bg-emerald-600 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Send Message
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
