import React, { useState, useEffect } from 'react';
import { Article, EditorsPickItem } from '../types';
import { apiClient } from '../services/apiClient';
import { openEditorsPickItem } from '../services/editorsPicks';
import { Sparkles, ArrowUpRight, ShieldCheck, Clock } from 'lucide-react';

// Same underlying data as Editor's Picks (GET /editors-picks) -- this is
// deliberately NOT a new endpoint. Sits as its own additional homepage
// section (a large, single-item hero treatment for the #1 pick) alongside
// Editor's Picks, which keeps showing its own full list including that
// same top item -- confirmed as the intended layout rather than Spotlight
// replacing the top Editor's Picks slot.
interface SpotlightPickSectionProps {
  onArticleClick: (article: Article) => void;
  onReportClick: (slug: string) => void;
}

export const SpotlightPickSection: React.FC<SpotlightPickSectionProps> = ({
  onArticleClick,
  onReportClick,
}) => {
  const [pick, setPick] = useState<EditorsPickItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    apiClient.editorsPicks.get(1)
      .then((data) => { if (isMounted) setPick(data[0] ?? null); })
      .catch((err) => console.warn('Failed to load spotlight pick:', err))
      .finally(() => { if (isMounted) setLoading(false); });
    return () => { isMounted = false; };
  }, []);

  if (loading) {
    return (
      <section className="py-8 bg-white border-b border-[#E3E8F1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-64 bg-slate-100 rounded-2xl animate-pulse" />
        </div>
      </section>
    );
  }

  if (!pick) return null; // no featured content curated yet -- nothing honest to spotlight

  return (
    <section className="py-8 bg-white border-b border-[#E3E8F1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-[#22C55E]" />
          <span className="text-[#22C55E] font-mono text-xs font-bold uppercase tracking-widest">Spotlight</span>
        </div>

        <div
          onClick={() => openEditorsPickItem(pick, onArticleClick, onReportClick)}
          className="relative bg-[#0A0F1A] rounded-2xl overflow-hidden shadow-xl border border-white/10 cursor-pointer group min-h-[280px] flex items-end"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
          <div className="relative z-10 p-8 sm:p-10 max-w-3xl">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#22C55E] text-white text-[10px] font-bold uppercase tracking-wider rounded-full mb-4">
              {pick.content_type === 'report' ? 'MarketMaven Report' : 'Top Story'}
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white leading-tight mb-3 group-hover:text-[#22C55E] transition-colors">
              {pick.title}
            </h2>
            {pick.summary && (
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed line-clamp-2 mb-4">
                {pick.summary}
              </p>
            )}
            <div className="flex items-center gap-4 text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1.5 text-white font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-[#22C55E]" />
                {pick.source_or_author}
              </span>
              {pick.published_date && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(pick.published_date).toLocaleDateString()}
                </span>
              )}
              <span className="ml-auto inline-flex items-center gap-1 text-[#22C55E] font-semibold group-hover:translate-x-1 transition-transform">
                Read <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
