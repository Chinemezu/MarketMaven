import React from 'react';
import { Article } from '../types';
import { Clock, Tag } from 'lucide-react';

interface SpotlightSectionProps {
  mainStory?: Article;
  subStories: Article[];
  onArticleClick: (article: Article) => void;
}

export const SpotlightSection: React.FC<SpotlightSectionProps> = ({
  mainStory,
  subStories,
  onArticleClick,
}) => {
  if (!mainStory) return null;

  return (
    <section className="py-10 bg-[#FAFBFC] border-b border-[#E3E8F1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between border-b-2 border-[#1E5EFF] pb-3 mb-8">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 bg-[#1E5EFF] rounded-sm"></span>
            <h2 className="font-serif text-2xl font-bold text-[#14181F]">
              Market Spotlight & Deep Dives
            </h2>
          </div>
          <span className="text-xs font-semibold text-[#5A6478] tracking-wider uppercase">
            Curated Analysis
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-8">
          {/* Main Large Spotlight Card (7 cols) */}
          <div
            onClick={() => onArticleClick(mainStory)}
            className="lg:col-span-7 bg-white rounded-xl border border-[#E3E8F1] overflow-hidden p-6 shadow-sm hover:shadow-md transition-shadow group cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="aspect-[16/9] overflow-hidden rounded-lg mb-5 bg-slate-100">
                <img
                  src={mainStory.imageUrl}
                  alt={mainStory.title}
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                />
              </div>

              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-2.5 py-1 bg-[#1E5EFF]/10 text-[#1E5EFF] text-xs font-bold rounded uppercase tracking-wider">
                  {mainStory.category}
                </span>
                <span className="font-num text-xs text-[#5A6478] flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {mainStory.relativeTime}
                </span>
              </div>

              <h3 className="font-serif text-2xl font-bold text-[#14181F] group-hover:text-[#1E5EFF] transition-colors leading-snug mb-3">
                {mainStory.title}
              </h3>

              <p className="text-sm text-[#5A6478] leading-relaxed line-clamp-3 mb-4">
                {mainStory.excerpt}
              </p>

              {/* Keyword Pills */}
              {mainStory.keywords && mainStory.keywords.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {mainStory.keywords.map((kw) => (
                    <span
                      key={kw}
                      className="inline-flex items-center gap-1 text-[11px] text-[#5A6478] bg-[#F0F4FA] px-2 py-0.5 rounded"
                    >
                      <Tag className="w-3 h-3 text-[#1E5EFF]" />
                      #{kw}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-[#E3E8F1] flex items-center justify-between text-xs text-[#5A6478]">
              <span className="font-semibold text-[#14181F]">By {mainStory.source}</span>
              <span>{mainStory.readTime}</span>
            </div>
          </div>

          {/* Side Stack / Related Row (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4 justify-between">
            {subStories.slice(0, 3).map((story) => (
              <div
                key={story.id}
                onClick={() => onArticleClick(story)}
                className="bg-white rounded-lg border border-[#E3E8F1] p-4 flex gap-4 hover:border-[#1E5EFF] transition-all group cursor-pointer shadow-sm"
              >
                <div className="w-28 sm:w-32 h-24 shrink-0 rounded overflow-hidden bg-slate-100">
                  <img
                    src={story.imageUrl}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform"
                  />
                </div>
                <div className="flex flex-col justify-between flex-1">
                  <div>
                    <span className="text-[10px] font-bold text-[#1E5EFF] uppercase tracking-wider block mb-1">
                      {story.category}
                    </span>
                    <h4 className="font-serif text-sm font-bold text-[#14181F] group-hover:text-[#1E5EFF] transition-colors leading-tight line-clamp-2 mb-1">
                      {story.title}
                    </h4>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#5A6478]">
                    <span>By {story.source}</span>
                    <span className="font-num">{story.relativeTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
