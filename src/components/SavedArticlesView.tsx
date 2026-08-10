import React from 'react';
import { Article, User } from '../types';
import { Bookmark, Clock, Newspaper, Trash2, ArrowUpRight, CheckCircle2 } from 'lucide-react';

interface SavedArticlesViewProps {
  currentUser: User | null;
  savedArticleIds: string[];
  articles: Article[];
  onToggleSaveArticle: (articleId: string) => void;
  onArticleClick: (article: Article) => void;
  onOpenAuthPrompt: () => void;
}

export const SavedArticlesView: React.FC<SavedArticlesViewProps> = ({
  currentUser,
  savedArticleIds,
  articles,
  onToggleSaveArticle,
  onArticleClick,
  onOpenAuthPrompt,
}) => {
  const savedArticles = articles.filter((a) => savedArticleIds.includes(a.id));

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] rounded-full flex items-center justify-center mx-auto">
          <Bookmark className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-serif font-bold text-[#14181F]">
          Sign In to Access Your Saved Articles
        </h1>
        <p className="text-sm text-[#5A6478] max-w-lg mx-auto">
          Bookmark stories, analysis pieces, and market dispatches across all categories for offline or later reading.
        </p>
        <button
          onClick={onOpenAuthPrompt}
          className="px-6 py-3 bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-all shadow-md cursor-pointer"
        >
          Sign In or Create Account
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Category Header */}
      <div className="border-b border-[#E3E8F1] pb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-[#22C55E] font-mono text-xs font-bold uppercase tracking-wider mb-1">
            <Bookmark className="w-4 h-4" />
            <span>Personal Reading List</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif text-[#14181F]">
            Saved Articles ({savedArticles.length})
          </h1>
          <p className="text-sm text-[#5A6478] mt-1">
            Your saved intelligence dispatches and financial analysis pieces.
          </p>
        </div>
      </div>

      {/* Articles Grid */}
      {savedArticles.length === 0 ? (
        <div className="bg-white border border-[#E3E8F1] rounded-2xl p-12 text-center space-y-4">
          <Newspaper className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold font-serif text-[#14181F]">No Saved Articles Yet</h3>
          <p className="text-xs text-[#5A6478] max-w-md mx-auto">
            Click the bookmark icon on any article card across MarketMaven to save it to your personal reading list.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedArticles.map((article) => (
            <article
              key={article.id}
              className="bg-white border border-[#E3E8F1] rounded-xl overflow-hidden hover:shadow-lg transition-all flex flex-col group relative"
            >
              {/* Article Image Container */}
              <div className="relative h-48 overflow-hidden cursor-pointer" onClick={() => onArticleClick(article)}>
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

                <div className="absolute top-3 left-3 bg-[#0A0F1A]/80 backdrop-blur-xs text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
                  {article.category}
                </div>

                {/* Remove Bookmark Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleSaveArticle(article.id);
                  }}
                  className="absolute top-3 right-3 p-2 bg-red-600 hover:bg-red-700 text-white rounded-full backdrop-blur-xs transition-all cursor-pointer shadow-md"
                  title="Remove from saved"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                <div className="absolute bottom-3 left-3 right-3 text-white text-[11px] font-mono flex items-center justify-between">
                  <span className="font-semibold text-slate-200">{article.source}</span>
                  <span>{article.relativeTime}</span>
                </div>
              </div>

              {/* Body */}
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
          ))}
        </div>
      )}
    </div>
  );
};
