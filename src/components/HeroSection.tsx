import React from 'react';
import { Article } from '../types';
import { Clock, ShieldCheck, Zap } from 'lucide-react';

interface HeroSectionProps {
  leadStory?: Article;
  recentHeadlines: Article[];
  featuredSecondary: Article[];
  onArticleClick: (article: Article) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  leadStory,
  recentHeadlines,
  featuredSecondary,
  onArticleClick,
}) => {
  return (
    <section className="py-8 border-b border-[#E3E8F1] bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 3-Column Hero Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Lead Featured Story (6 cols) */}
          <div className="lg:col-span-6 flex flex-col group cursor-pointer" onClick={() => leadStory && onArticleClick(leadStory)}>
            {leadStory ? (
              <>
                <div className="relative overflow-hidden rounded-lg mb-4 bg-slate-100 aspect-[16/9] shadow-sm">
                  <img
                    src={leadStory.imageUrl}
                    alt={leadStory.title}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    {leadStory.isBreaking && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#FF4D4F] text-white text-xs font-bold rounded uppercase tracking-wider animate-pulse shadow-sm">
                        <Zap className="w-3 h-3 fill-current" /> Breaking
                      </span>
                    )}
                    <span className="px-2.5 py-1 bg-[#0A0F1A]/85 backdrop-blur-sm text-white text-xs font-semibold rounded uppercase tracking-wider">
                      {leadStory.category}
                    </span>
                    {leadStory.premium && (
                      <span className="px-2 py-1 bg-[#00D1B2] text-slate-950 text-[10px] font-bold rounded uppercase tracking-wider">
                        Premium
                      </span>
                    )}
                  </div>
                </div>

                {/* Keywords Tag Pills */}
                {leadStory.keywords && leadStory.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {leadStory.keywords.map((kw) => (
                      <span
                        key={kw}
                        className="text-[11px] font-medium text-[#5A6478] bg-[#FAFBFC] border border-[#E3E8F1] px-2 py-0.5 rounded"
                      >
                        #{kw}
                      </span>
                    ))}
                  </div>
                )}

                {/* Headline in Source Serif 4 */}
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#14181F] leading-tight group-hover:text-[#1E5EFF] transition-colors mb-3">
                  {leadStory.title}
                </h1>

                {/* Excerpt */}
                <p className="text-sm text-[#5A6478] line-clamp-3 mb-4 leading-relaxed">
                  {leadStory.excerpt}
                </p>

                {/* Meta Byline and Timestamp */}
                <div className="flex items-center gap-3 text-xs text-[#5A6478] mt-auto pt-2 border-t border-[#E3E8F1]">
                  <span className="font-semibold text-[#14181F] flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#1E5EFF]" />
                    By {leadStory.source}
                  </span>
                  <span>•</span>
                  <span className="font-num flex items-center gap-1 text-[#5A6478]">
                    <Clock className="w-3 h-3" />
                    {leadStory.relativeTime}
                  </span>
                  <span>•</span>
                  <span>{leadStory.readTime}</span>
                </div>
              </>
            ) : (
              <div className="p-8 text-center bg-slate-50 rounded-lg">Loading lead story...</div>
            )}
          </div>

          {/* MIDDLE COLUMN: Dense Recent Headlines List (3 cols) */}
          <div className="lg:col-span-3 border-t lg:border-t-0 lg:border-l lg:border-r border-[#E3E8F1] lg:px-6 pt-6 lg:pt-0">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E3E8F1]">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#1E5EFF] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#1E5EFF]"></span>
                Recent Wire Updates
              </h2>
              <span className="text-[11px] font-num text-[#5A6478]">LIVE FEED</span>
            </div>

            <div className="divide-y divide-[#E3E8F1] space-y-3">
              {recentHeadlines.map((story) => (
                <div
                  key={story.id}
                  onClick={() => onArticleClick(story)}
                  className="pt-3 first:pt-0 group cursor-pointer"
                >
                  <div className="flex items-center justify-between text-[11px] text-[#5A6478] mb-1">
                    <span className="font-semibold text-[#1E5EFF] uppercase tracking-wider">
                      {story.category}
                    </span>
                    <span className="font-num text-[11px] text-[#5A6478]">
                      {story.relativeTime}
                    </span>
                  </div>
                  <h3 className="font-serif text-sm font-semibold text-[#14181F] group-hover:text-[#1E5EFF] transition-colors leading-snug line-clamp-2 mb-1.5">
                    {story.title}
                  </h3>
                  <p className="text-[11px] text-[#5A6478] font-medium">
                    By {story.source}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: Featured Secondary Items (3 cols) */}
          <div className="lg:col-span-3 pt-6 lg:pt-0 space-y-6">
            <div className="pb-2 border-b border-[#E3E8F1]">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#14181F]">
                Spotlight Features
              </h2>
            </div>

            {featuredSecondary.map((story) => (
              <div
                key={story.id}
                onClick={() => onArticleClick(story)}
                className="group cursor-pointer border-b border-[#E3E8F1] pb-5 last:border-b-0 last:pb-0"
              >
                <div className="aspect-[16/10] overflow-hidden rounded mb-3 bg-slate-100">
                  <img
                    src={story.imageUrl}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                  />
                </div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-bold text-[#1E5EFF] uppercase tracking-wider">
                    {story.category}
                  </span>
                  {story.premium && (
                    <span className="text-[9px] font-bold bg-teal-100 text-teal-800 px-1.5 py-0.2 rounded">
                      PRO
                    </span>
                  )}
                </div>
                <h3 className="font-serif text-base font-bold text-[#14181F] group-hover:text-[#1E5EFF] transition-colors leading-snug line-clamp-2 mb-2">
                  {story.title}
                </h3>
                <div className="flex items-center justify-between text-[11px] text-[#5A6478]">
                  <span>By {story.source}</span>
                  <span className="font-num">{story.relativeTime}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};
