import React, { useState, useEffect } from 'react';
import { Article, User } from '../types';
import { 
  ArrowLeft, 
  Clock, 
  ShieldCheck, 
  Share2, 
  Bookmark, 
  Check, 
  Tag, 
  TrendingUp, 
  ExternalLink,
  ChevronRight,
  BookOpen
} from 'lucide-react';

interface ArticleDetailViewProps {
  article: Article;
  currentUser?: User | null;
  savedArticleIds?: string[];
  allArticles?: Article[];
  onBack: () => void;
  onSelectArticle: (article: Article) => void;
  onSelectTag?: (tag: string) => void;
  onToggleSaveArticle?: (articleId: string) => void;
  onOpenAuthPrompt?: () => void;
}

export const ArticleDetailView: React.FC<ArticleDetailViewProps> = ({
  article,
  currentUser,
  savedArticleIds = [],
  allArticles = [],
  onBack,
  onSelectArticle,
  onSelectTag,
  onToggleSaveArticle,
  onOpenAuthPrompt,
}) => {
  const [copied, setCopied] = useState(false);

  // Scroll to top when opening an article
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [article.id]);

  const isSaved = savedArticleIds.includes(article.id);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleBookmarkClick = () => {
    if (!currentUser) {
      if (onOpenAuthPrompt) onOpenAuthPrompt();
    } else if (onToggleSaveArticle) {
      onToggleSaveArticle(article.id);
    }
  };

  // Filter related articles from same category or general feed excluding current
  const relatedArticles = allArticles
    .filter((a) => a.id !== article.id)
    .slice(0, 3);

  return (
    <div className="bg-[#FAFBFC] min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8 text-[#14181F]">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Top Navigation Bar & Breadcrumb */}
        <div className="flex items-center justify-between border-b border-[#E3E8F1] pb-4">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#5A6478] hover:text-[#22C55E] transition-colors group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Market News</span>
          </button>

          <div className="flex items-center gap-2 text-xs text-[#5A6478]">
            <span className="font-mono uppercase">{article.category}</span>
            <span>/</span>
            <span className="truncate max-w-[150px] sm:max-w-[250px] font-medium text-[#14181F]">
              {article.title}
            </span>
          </div>
        </div>

        {/* Article Header Header Section */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 bg-[#22C55E]/10 text-[#22C55E] text-xs font-bold rounded uppercase tracking-wider">
              {article.category}
            </span>
            {article.premium && (
              <span className="px-2.5 py-0.5 bg-[#00D1B2]/10 text-[#00D1B2] text-[11px] font-bold rounded uppercase">
                PREMIUM ANALYSIS
              </span>
            )}
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#14181F] leading-tight tracking-tight">
            {article.title}
          </h1>

          {/* Meta & Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-y border-[#E3E8F1] text-xs text-[#5A6478]">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-bold text-[#14181F] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#22C55E]" />
                {article.source}
              </span>
              <span>•</span>
              <span className="font-num flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {article.relativeTime}
              </span>
              <span>•</span>
              <span className="font-mono">{article.readTime}</span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleBookmarkClick}
                className={`px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer ${
                  isSaved
                    ? 'bg-[#22C55E] text-white border-[#22C55E]'
                    : 'text-[#5A6478] hover:text-[#14181F] hover:bg-white border-[#E3E8F1] bg-[#FAFBFC]'
                }`}
                title={isSaved ? 'Remove from saved' : 'Save article'}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{isSaved ? 'Saved' : 'Save Story'}</span>
              </button>

              <button
                onClick={handleShare}
                className="px-3 py-1.5 text-[#5A6478] hover:text-[#14181F] bg-white hover:bg-slate-50 rounded-lg border border-[#E3E8F1] transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer"
                title="Share article link"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600 font-semibold">Link Copied</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="aspect-[16/9] overflow-hidden rounded-2xl bg-slate-200 border border-[#E3E8F1] shadow-sm relative">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Excerpt Lead */}
        <div className="bg-white border-l-4 border-[#22C55E] border-y border-r border-[#E3E8F1] p-5 sm:p-6 rounded-r-xl shadow-xs">
          <p className="text-lg sm:text-xl font-medium text-[#14181F] leading-relaxed italic">
            "{article.excerpt}"
          </p>
        </div>

        {/* Full Article Content — real aggregated articles only carry a
            summary (mirrored into `content`), not a full body, so this
            skips repeating it and leads with the external link instead.
            Mock/fallback data still has a genuinely distinct `content`. */}
        <div className="bg-white rounded-2xl p-6 sm:p-10 border border-[#E3E8F1] shadow-xs space-y-6">
          {article.content && article.content !== article.excerpt && (
            <div className="prose prose-slate max-w-none text-base sm:text-lg leading-relaxed text-[#14181F] space-y-6 font-normal">
              {article.content.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className="text-[#14181F] leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          )}

          {article.url && (
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-[#5A6478] hover:text-[#14181F] transition-colors"
            >
              Source: {article.source}
              <ExternalLink className="w-3 h-3" />
            </a>
          )}

          {/* Keywords / Tags */}
          {article.keywords && article.keywords.length > 0 && (
            <div className="pt-8 border-t border-[#E3E8F1]">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-4 h-4 text-[#22C55E]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#5A6478]">
                  Topics & Tags
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {article.keywords.map((kw) => (
                  <button
                    key={kw}
                    onClick={() => {
                      if (onSelectTag) onSelectTag(kw);
                      onBack();
                    }}
                    className="text-xs font-medium text-[#22C55E] bg-[#22C55E]/10 border border-[#22C55E]/20 hover:bg-[#22C55E] hover:text-white px-3 py-1.5 rounded-full transition-colors cursor-pointer"
                  >
                    #{kw}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Related Stories */}
        {relatedArticles.length > 0 && (
          <div className="pt-8 border-t border-[#E3E8F1] space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-2xl font-bold text-[#14181F] flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#22C55E]" />
                More Top Stories
              </h3>
              <button
                onClick={onBack}
                className="text-xs font-bold text-[#22C55E] hover:underline flex items-center gap-1 cursor-pointer"
              >
                View All Wire Stories <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => onSelectArticle(rel)}
                  className="bg-white rounded-xl border border-[#E3E8F1] overflow-hidden hover:border-[#22C55E] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                      <img
                        src={rel.imageUrl}
                        alt={rel.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4 space-y-2">
                      <span className="text-[10px] font-bold text-[#22C55E] uppercase font-mono">
                        {rel.category}
                      </span>
                      <h4 className="font-serif text-sm font-bold text-[#14181F] group-hover:text-[#22C55E] transition-colors line-clamp-2">
                        {rel.title}
                      </h4>
                      <p className="text-xs text-[#5A6478] line-clamp-2">
                        {rel.excerpt}
                      </p>
                    </div>
                  </div>
                  <div className="p-4 pt-0 text-[11px] text-[#5A6478] flex items-center justify-between border-t border-[#F0F4F8] mt-2">
                    <span className="font-semibold">{rel.source}</span>
                    <span className="font-num">{rel.relativeTime}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
