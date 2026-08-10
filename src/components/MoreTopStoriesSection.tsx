import React from 'react';
import { Article } from '../types';
import { Layers, Clock } from 'lucide-react';

interface MoreTopStoriesSectionProps {
  articles: Article[];
  onArticleClick: (article: Article) => void;
}

export const MoreTopStoriesSection: React.FC<MoreTopStoriesSectionProps> = ({
  articles,
  onArticleClick,
}) => {
  if (articles.length === 0) return null;

  return (
    <section className="py-12 bg-white border-b border-[#E3E8F1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between border-b-2 border-[#22C55E] pb-3 mb-8">
          <div className="flex items-center gap-2.5">
            <Layers className="w-5 h-5 text-[#22C55E]" />
            <h2 className="font-serif text-2xl font-bold text-[#14181F]">
              More Top Stories & Analysis
            </h2>
          </div>
          <span className="text-xs font-medium text-[#5A6478]">Broad Market Spectrum</span>
        </div>

        {/* 4-Column Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {articles.map((story) => (
            <article
              key={story.id}
              onClick={() => onArticleClick(story)}
              className="bg-[#FAFBFC] border border-[#E3E8F1] rounded-xl overflow-hidden p-4 flex flex-col justify-between group cursor-pointer hover:border-[#22C55E] transition-all shadow-sm"
            >
              <div>
                <div className="aspect-[16/10] overflow-hidden rounded-lg mb-3 bg-slate-100">
                  <img
                    src={story.imageUrl}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] mb-2">
                  <span className="font-bold text-[#22C55E] uppercase tracking-wider">
                    {story.category}
                  </span>
                  <span className="font-num text-[#5A6478] flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {story.relativeTime}
                  </span>
                </div>

                <h3 className="font-serif text-base font-bold text-[#14181F] group-hover:text-[#22C55E] transition-colors leading-snug line-clamp-2 mb-2">
                  {story.title}
                </h3>

                <p className="text-xs text-[#5A6478] leading-relaxed line-clamp-2 mb-3">
                  {story.excerpt}
                </p>

                {/* Keywords */}
                {story.keywords && story.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {story.keywords.slice(0, 2).map((kw) => (
                      <span
                        key={kw}
                        className="text-[10px] text-[#5A6478] bg-white border border-[#E3E8F1] px-1.5 py-0.5 rounded"
                      >
                        #{kw}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-2.5 border-t border-[#E3E8F1] flex items-center justify-between text-[11px] text-[#5A6478]">
                <span className="font-semibold text-[#14181F]">By {story.source}</span>
                <span className="font-num">{story.readTime}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
