import React, { useState, useEffect } from 'react';
import { Article, TopSource, EditorsPickItem } from '../types';
import { apiClient } from '../services/apiClient';
import { submitNewsletterSignup } from '../services/api';
import { CheckCircle2, AlertCircle, Mail, ArrowRight, ShieldCheck, Sparkles, FileText } from 'lucide-react';

interface EditorsPicksSectionProps {
  initialPicks?: EditorsPickItem[];
  mostRelevantRanking: Article[];
  topSources: TopSource[];
  onArticleClick: (article: Article) => void;
  onReportClick: (slug: string) => void;
  onSourceSelect?: (sourceName: string) => void;
}

export const EditorsPicksSection: React.FC<EditorsPicksSectionProps> = ({
  initialPicks,
  mostRelevantRanking,
  topSources,
  onArticleClick,
  onReportClick,
  onSourceSelect,
}) => {
  const [picks, setPicks] = useState<EditorsPickItem[]>(initialPicks || []);
  const [loading, setLoading] = useState<boolean>(!initialPicks || initialPicks.length === 0);
  const [email, setEmail] = useState('');
  const [statusState, setStatusState] = useState<'idle' | 'submitting' | 'subscribed' | 'already_subscribed' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    let isMounted = true;
    apiClient.editorsPicks.get(6)
      .then((data) => {
        if (isMounted && data && data.length > 0) {
          setPicks(data);
        }
      })
      .catch((err) => {
        console.warn('Failed fetching /editors-picks from API, using fallback:', err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
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
        setStatusMessage(res.message || 'Thank you for subscribing!');
      }
    } catch (err) {
      setStatusState('error');
      setStatusMessage('Failed to subscribe. Please try again.');
    }
  };

  const handleItemClick = (item: EditorsPickItem) => {
    if (item.content_type === 'report') {
      onReportClick(item.url_or_slug);
    } else {
      // Find matching insight in mostRelevant or build synthetic Article
      const synthArticle: Article = {
        id: item.id,
        title: item.title,
        excerpt: item.summary,
        content: item.summary + '\n\nFull analysis available on primary source network.',
        category: (item.vertical as any) || 'Markets',
        keywords: [item.vertical, 'MarketMaven'],
        source: item.source_or_author,
        publishedAt: item.published_date,
        relativeTime: 'Recent',
        readTime: item.readTime || '4 min read',
        imageUrl: item.imageUrl || item.cover_image_url || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=1200',
        featured: true,
        relevanceScore: 95,
      };
      onArticleClick(synthArticle);
    }
  };

  return (
    <section className="py-12 bg-[#FAFBFC] border-b border-[#E3E8F1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* MAIN COLUMN: Editor's Picks & Featured Reports Stacked List (8 cols) */}
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between border-b-2 border-[#22C55E] pb-3 mb-8">
              <div className="flex items-center gap-3">
                <h2 className="font-serif text-2xl font-bold text-[#14181F]">
                  Editor's Picks & Featured Reports
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#22C55E]/10 text-[#22C55E] text-xs font-semibold rounded-full">
                  <Sparkles className="w-3 h-3" /> Curated Mix
                </span>
              </div>
              <span className="text-xs font-medium text-[#5A6478]">In-Depth Inquiries</span>
            </div>

            {loading ? (
              <div className="space-y-6">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="bg-white border border-[#E3E8F1] rounded-xl p-6 animate-pulse flex flex-col sm:flex-row gap-6">
                    <div className="sm:w-2/5 aspect-[16/10] bg-slate-200 rounded-lg"></div>
                    <div className="sm:w-3/5 space-y-3">
                      <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                      <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                      <div className="h-4 bg-slate-200 rounded w-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {picks.map((item) => {
                  const isReport = item.content_type === 'report';
                  const imgUrl = item.cover_image_url || item.imageUrl || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=1200';

                  return (
                    <article
                      key={`${item.content_type}-${item.id}`}
                      onClick={() => handleItemClick(item)}
                      className={`bg-white border ${
                        isReport ? 'border-emerald-200 bg-gradient-to-r from-emerald-50/20 to-white' : 'border-[#E3E8F1]'
                      } rounded-xl p-5 sm:p-6 shadow-sm hover:border-[#22C55E] transition-all group cursor-pointer flex flex-col sm:flex-row gap-6`}
                    >
                      <div className="sm:w-2/5 shrink-0 aspect-[16/10] overflow-hidden rounded-lg bg-slate-100 relative">
                        <img
                          src={imgUrl}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                        />
                        {isReport && (
                          <span className="absolute top-2.5 left-2.5 px-2 py-1 bg-[#22C55E] text-white text-[10px] font-bold rounded shadow flex items-center gap-1 uppercase tracking-wider">
                            <FileText className="w-3 h-3" /> Report
                          </span>
                        )}
                      </div>

                      <div className="sm:w-3/5 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2.5 flex-wrap">
                            <span className="px-2 py-0.5 bg-[#22C55E]/10 text-[#22C55E] text-[11px] font-bold rounded uppercase tracking-wider">
                              {item.vertical}
                            </span>

                            {/* Distinct MarketMaven Original tag for report items */}
                            {isReport && (
                              <span className="px-2 py-0.5 bg-indigo-600 text-white text-[10px] font-extrabold rounded uppercase tracking-wider flex items-center gap-1 shadow-xs">
                                MarketMaven Original
                              </span>
                            )}

                            <span className="font-num text-xs text-[#5A6478] ml-auto">
                              {new Date(item.published_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                          </div>

                          <h3 className="font-serif text-xl font-bold text-[#14181F] group-hover:text-[#22C55E] transition-colors leading-snug mb-2.5">
                            {item.title}
                          </h3>

                          <p className="text-xs sm:text-sm text-[#5A6478] line-clamp-2 leading-relaxed mb-4">
                            {item.summary}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-[#E3E8F1] flex items-center justify-between text-xs text-[#5A6478]">
                          <span className="font-semibold text-[#14181F] flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-[#22C55E]" />
                            {isReport ? (
                              <span>
                                By <strong className="text-[#14181F]">{item.source_or_author}</strong> · MarketMaven
                              </span>
                            ) : (
                              <span>By {item.source_or_author}</span>
                            )}
                          </span>
                          <span className="font-num text-[#5A6478]">{item.readTime || '5 min read'}</span>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>

          {/* SIDEBAR: Most Relevant Ranking + Top Sources + Newsletter + Socials (4 cols) */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* 1. Most Relevant Numbered Ranking */}
            <div className="bg-white border border-[#E3E8F1] rounded-xl p-5 shadow-sm">
              <div className="pb-3 mb-4 border-b border-[#E3E8F1] flex items-center justify-between">
                <h3 className="font-serif text-lg font-bold text-[#14181F]">
                  Most Relevant
                </h3>
                <span className="text-[10px] font-num text-[#5A6478] uppercase">TOP 5 RANKED</span>
              </div>

              <div className="divide-y divide-[#E3E8F1]">
                {mostRelevantRanking.slice(0, 5).map((item, index) => (
                  <div
                    key={item.id}
                    onClick={() => onArticleClick(item)}
                    className="py-3 first:pt-0 last:pb-0 flex items-start gap-3 group cursor-pointer"
                  >
                    <span className="font-num text-lg font-bold text-[#22C55E] w-6 shrink-0 pt-0.5">
                      0{index + 1}
                    </span>
                    <div className="flex-1">
                      <h4 className="font-serif text-xs font-bold text-[#14181F] group-hover:text-[#22C55E] transition-colors leading-snug line-clamp-2 mb-1">
                        {item.title}
                      </h4>
                      <div className="flex items-center justify-between text-[10px] text-[#5A6478]">
                        <span>By {item.source}</span>
                        <span className="font-num">{item.relativeTime}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Top Sources */}
            <div className="bg-white border border-[#E3E8F1] rounded-xl p-5 shadow-sm">
              <div className="pb-3 mb-4 border-b border-[#E3E8F1] flex items-center justify-between">
                <h3 className="font-serif text-lg font-bold text-[#14181F]">
                  Top Sources
                </h3>
                <span className="text-[10px] font-num text-[#5A6478]">REAL-TIME VOLUME</span>
              </div>

              <div className="space-y-3">
                {topSources.map((source) => (
                  <div
                    key={source.id}
                    onClick={() => onSourceSelect && onSourceSelect(source.name)}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-transparent hover:border-[#E3E8F1] hover:bg-[#FAFBFC] transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full ${source.avatarBg || 'bg-emerald-600'} text-white font-bold text-xs flex items-center justify-center shrink-0`}>
                        {source.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#14181F] group-hover:text-[#22C55E]">
                          {source.name}
                        </div>
                        <div className="text-[10px] text-[#5A6478]">
                          {source.category}
                        </div>
                      </div>
                    </div>

                    <span className="font-num text-xs font-semibold bg-[#FAFBFC] text-[#22C55E] border border-[#E3E8F1] px-2.5 py-1 rounded-full">
                      {source.articleCount} articles
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Sidebar Newsletter Box */}
            <div className="bg-[#0A0F1A] text-white rounded-xl p-6 shadow-sm relative overflow-hidden">
              <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-[#22C55E]/20 rounded-full blur-xl pointer-events-none"></div>

              <div className="flex items-center gap-2 text-[#4ADE80] text-xs font-bold uppercase tracking-wider mb-2">
                <Mail className="w-4 h-4" /> MarketMaven Daily
              </div>

              <h3 className="font-serif text-xl font-bold text-white mb-2">
                Frontier Market Briefs
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Get morning market intelligence, FX liquidity alerts, and central bank commentary directly in your inbox.
              </p>

              <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your institutional email"
                  required
                  className="w-full px-3.5 py-2.5 bg-[#151D2F] border border-[#263148] text-white placeholder-slate-400 text-xs rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22C55E]"
                />

                <button
                  type="submit"
                  disabled={statusState === 'submitting'}
                  className="w-full py-2.5 bg-[#22C55E] hover:bg-[#16A34A] text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  {statusState === 'submitting' ? (
                    'Subscribing...'
                  ) : (
                    <>
                      <span>Subscribe Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>

              {statusState === 'already_subscribed' && (
                <div className="mt-3 p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>You're already on the list</span>
                </div>
              )}

              {statusState === 'subscribed' && (
                <div className="mt-3 p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-200 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{statusMessage}</span>
                </div>
              )}

              {statusState === 'error' && (
                <div className="mt-3 p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{statusMessage}</span>
                </div>
              )}
            </div>

            {/* 4. Social Follow Links */}
            <div className="bg-white border border-[#E3E8F1] rounded-xl p-5 shadow-sm">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#14181F] mb-3">
                Follow MarketMaven
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 border border-[#E3E8F1] rounded-lg hover:border-[#1E5EFF] hover:text-[#1E5EFF] transition-colors flex items-center gap-2 text-[#5A6478] font-medium"
                >
                  <span className="font-bold">𝕏</span> Twitter / X
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 border border-[#E3E8F1] rounded-lg hover:border-[#1E5EFF] hover:text-[#1E5EFF] transition-colors flex items-center gap-2 text-[#5A6478] font-medium"
                >
                  <span className="font-bold">in</span> LinkedIn
                </a>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
