import React, { useState, useEffect } from 'react';
import { Article } from '../types';
import { Search, X, Clock, ShieldCheck } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  articles: Article[];
  onSelectArticle: (article: Article) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  articles,
  onSelectArticle,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredArticles = articles.filter((a) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      a.title.toLowerCase().includes(q) ||
      a.excerpt.toLowerCase().includes(q) ||
      a.source.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q) ||
      a.keywords.some((k) => k.toLowerCase().includes(q))
    );
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-start justify-center pt-16 px-4 pb-10 overflow-y-auto">
      <div
        className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-[#E3E8F1] overflow-hidden text-[#14181F]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Bar Header */}
        <div className="p-4 border-b border-[#E3E8F1] flex items-center gap-3 bg-[#FAFBFC]">
          <Search className="w-5 h-5 text-[#22C55E] shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search news, markets, central banks, keywords..."
            autoFocus
            className="flex-1 text-base bg-transparent border-none focus:outline-none placeholder-slate-400 font-medium text-[#14181F]"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-semibold text-[#5A6478] hover:text-[#14181F] bg-slate-200/60 rounded-lg"
          >
            ESC
          </button>
        </div>

        {/* Results */}
        <div className="p-4 max-h-[60vh] overflow-y-auto divide-y divide-[#E3E8F1]">
          {filteredArticles.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm">
              No matching articles found for "{query}". Try searching for <span className="font-semibold text-[#22C55E]">Naira</span>, <span className="font-semibold text-[#22C55E]">Fed</span>, <span className="font-semibold text-[#22C55E]">Inflation</span>, or <span className="font-semibold text-[#22C55E]">Fintech</span>.
            </div>
          ) : (
            filteredArticles.map((art) => (
              <div
                key={art.id}
                onClick={() => {
                  onSelectArticle(art);
                  onClose();
                }}
                className="py-3.5 hover:bg-[#FAFBFC] px-2 rounded-lg transition-colors cursor-pointer group flex items-start gap-4"
              >
                <div className="w-16 h-16 shrink-0 rounded bg-slate-100 overflow-hidden">
                  <img src={art.imageUrl} alt={art.title} className="w-full h-full object-cover" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold text-[#22C55E] uppercase tracking-wider">
                      {art.category}
                    </span>
                    <span className="font-num text-[11px] text-[#5A6478] ml-auto">
                      {art.relativeTime}
                    </span>
                  </div>

                  <h4 className="font-serif text-sm font-bold text-[#14181F] group-hover:text-[#22C55E] transition-colors leading-snug line-clamp-2 mb-1">
                    {art.title}
                  </h4>

                  <div className="text-[11px] text-[#5A6478] flex items-center gap-2">
                    <span>By {art.source}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
