import React, { useState } from 'react';
import { Article, User } from '../types';
import { Bookmark, Clock, Eye, Newspaper, ArrowUpRight, Check } from 'lucide-react';

interface TemplateAPageProps {
  title: string;
  subtitle?: string;
  articles: Article[];
  currentUser: User | null;
  savedArticleIds: string[];
  onToggleSaveArticle: (articleId: string) => void;
  onArticleClick: (article: Article) => void;
  onOpenAuthPrompt: () => void;
}

export const TemplateAPage: React.FC<TemplateAPageProps> = ({
  title,
  subtitle,
  articles,
  currentUser,
  savedArticleIds,
  onToggleSaveArticle,
  onArticleClick,
  onOpenAuthPrompt,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.source.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Category Header */}
      <div className="border-b border-[#E3E8F1] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="text-[#22C55E] font-mono text-xs font-bold uppercase tracking-widest mb-1 flex items-center gap-2">
            <Newspaper className="w-4 h-4" />
            <span>Market Intelligence Category</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif text-[#14181F]">{title}</h1>
          <p className="text-sm text-[#5A6478] mt-1 max-w-2xl">
            {subtitle || `Live intelligence, market dispatches, and curated analysis for ${title}.`}
          </p>
        </div>

        {/* Filter Input */}
        <div className="w-full md:w-72">
          <input
            type="text"
            placeholder="Filter section stories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-[#E3E8F1] rounded-lg px-3.5 py-2 text-xs text-[#14181F] placeholder-slate-400 focus:outline-none focus:border-[#22C55E] shadow-xs"
          />
        </div>
      </div>

      {/* Article Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-[#E3E8F1] rounded-xl p-12 text-center my-8">
          <Newspaper className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#14181F]">No articles matching "{searchTerm}"</h3>
          <p className="text-xs text-[#5A6478] mt-1">Try resetting your search query to view all dispatches in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((article) => {
            const isSaved = savedArticleIds.includes(article.id);

            return (
              <article
                key={article.id}
                className="bg-white border border-[#E3E8F1] rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200 flex flex-col group relative"
              >
                {/* Article Image Container */}
                <div className="relative h-48 overflow-hidden cursor-pointer" onClick={() => onArticleClick(article)}>
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                  
                  {/* Category Tag */}
                  <div className="absolute top-3 left-3 bg-[#0A0F1A]/80 backdrop-blur-xs text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
                    {article.category}
                  </div>

                  {/* Bookmark Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!currentUser) {
                        onOpenAuthPrompt();
                      } else {
                        onToggleSaveArticle(article.id);
                      }
                    }}
                    className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-xs transition-all cursor-pointer ${
                      isSaved
                        ? 'bg-[#22C55E] text-white shadow-md'
                        : 'bg-black/40 hover:bg-black/70 text-white'
                    }`}
                    title={isSaved ? 'Remove from saved' : 'Save article'}
                  >
                    {isSaved ? <Check className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                  </button>

                  <div className="absolute bottom-3 left-3 right-3 text-white text-[11px] font-mono flex items-center justify-between">
                    <span className="font-semibold text-slate-200">{article.source}</span>
                    <span>{article.relativeTime}</span>
                  </div>
                </div>

                {/* Article Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3
                      onClick={() => onArticleClick(article)}
                      className="font-serif font-bold text-lg text-[#14181F] group-hover:text-[#22C55E] leading-snug cursor-pointer transition-colors line-clamp-2"
                    >
                      {article.title}
                    </h3>
                    <p className="text-xs text-[#5A6478] mt-2 line-clamp-3 leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>

                  {/* Card Footer */}
                  <div className="pt-3 border-t border-[#E3E8F1] flex items-center justify-between text-[11px] text-[#5A6478]">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{article.readTime}</span>
                    </div>

                    <button
                      onClick={() => onArticleClick(article)}
                      className="font-bold text-[#22C55E] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Read Story</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
