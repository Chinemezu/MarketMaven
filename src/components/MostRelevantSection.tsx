import React from 'react';
import { Article } from '../types';
import { TrendingUp, Clock } from 'lucide-react';

interface MostRelevantSectionProps {
  articles: Article[];
  onArticleClick: (article: Article) => void;
}

export const MostRelevantSection: React.FC<MostRelevantSectionProps> = ({
  articles,
  onArticleClick,
}) => {
  if (articles.length === 0) return null;

  const leadCard = articles[0];
  const gridCards = articles.slice(1, 5);

  return (
    <section className="py-10 bg-white border-b border-[#E3E8F1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="flex items-center justify-between border-b-2 border-[#22C55E] pb-3 mb-8">
          <div className="flex items-center gap-2.5">
            <TrendingUp className="w-5 h-5 text-[#22C55E]" />
            <h2 className="font-serif text-2xl font-bold text-[#14181F]">
              Most Relevant Markets Coverage
            </h2>
          </div>
          <span className="text-xs font-num font-semibold text-[#5A6478] bg-[#FAFBFC] px-3 py-1 rounded border border-[#E3E8F1]">
            Algorithmic Relevance Rank
          </span>
        </div>

        {/* Layout: 1 Large Feature Card + 2x2 Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Large Feature Card (5 cols) */}
          {leadCard && (
            <div
              onClick={() => onArticleClick(leadCard)}
              className="lg:col-span-5 bg-[#FAFBFC] border border-[#E3E8F1] rounded-xl overflow-hidden p-5 flex flex-col justify-between group cursor-pointer hover:border-[#22C55E] transition-all shadow-sm"
            >
              <div>
                <div className="aspect-[16/10] overflow-hidden rounded-lg mb-4 bg-slate-100">
                  <img
                    src={leadCard.imageUrl}
                    alt={leadCard.title}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                  />
                </div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-[#22C55E] uppercase tracking-wider">
                    {leadCard.category}
                  </span>
                  <span className="font-num text-[#5A6478] flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {leadCard.relativeTime}
                  </span>
                </div>
                <h3 className="font-serif text-xl font-bold text-[#14181F] group-hover:text-[#22C55E] transition-colors leading-snug mb-3">
                  {leadCard.title}
                </h3>
                <p className="text-xs text-[#5A6478] leading-relaxed line-clamp-3 mb-4">
                  {leadCard.excerpt}
                </p>
              </div>

              <div className="pt-3 border-t border-[#E3E8F1] flex items-center justify-between text-xs text-[#5A6478]">
                <span className="font-semibold text-[#14181F]">By {leadCard.source}</span>
                <span className="font-num bg-[#22C55E]/10 text-[#22C55E] px-2 py-0.5 rounded font-semibold text-[11px]">
                  Score: {leadCard.relevanceScore}
                </span>
              </div>
            </div>
          )}

          {/* Right 2x2 Grid (7 cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {gridCards.map((card) => (
              <div
                key={card.id}
                onClick={() => onArticleClick(card)}
                className="bg-white border border-[#E3E8F1] rounded-xl p-4 flex flex-col justify-between group cursor-pointer hover:border-[#22C55E] transition-all shadow-sm"
              >
                <div>
                  <div className="aspect-[16/9] overflow-hidden rounded mb-3 bg-slate-100">
                    <img
                      src={card.imageUrl}
                      alt={card.title}
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] mb-1.5">
                    <span className="font-bold text-[#22C55E] uppercase tracking-wider">
                      {card.category}
                    </span>
                    <span className="font-num text-[#5A6478]">{card.relativeTime}</span>
                  </div>
                  <h4 className="font-serif text-base font-bold text-[#14181F] group-hover:text-[#22C55E] transition-colors leading-snug line-clamp-2 mb-2">
                    {card.title}
                  </h4>
                </div>

                <div className="pt-2 border-t border-[#E3E8F1] flex items-center justify-between text-xs text-[#5A6478]">
                  <span>By {card.source}</span>
                  <span className="font-num text-[11px] font-medium text-[#5A6478]">
                    {card.readTime}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};
