import React from 'react';
import { Article, User } from '../types';
import { X, Clock, ShieldCheck, Share2, Bookmark, Check, ExternalLink } from 'lucide-react';

interface ArticleModalProps {
  article: Article | null;
  currentUser?: User | null;
  savedArticleIds?: string[];
  onClose: () => void;
  onSelectTag?: (tag: string) => void;
  onToggleSaveArticle?: (articleId: string) => void;
  onOpenAuthPrompt?: () => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({
  article,
  currentUser,
  savedArticleIds = [],
  onClose,
  onSelectTag,
  onToggleSaveArticle,
  onOpenAuthPrompt,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!article) return null;

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

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn">
      <div
        className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#E3E8F1] relative text-[#14181F] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Modal Bar */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-[#E3E8F1] flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-[#22C55E]/10 text-[#22C55E] text-xs font-bold rounded uppercase tracking-wider">
              {article.category}
            </span>
            {article.premium && (
              <span className="px-2 py-0.5 bg-[#00D1B2]/10 text-[#00D1B2] text-[10px] font-bold rounded uppercase">
                PREMIUM
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleBookmarkClick}
              className={`p-2 rounded-lg border transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer ${
                isSaved
                  ? 'bg-[#22C55E] text-white border-[#22C55E]'
                  : 'text-[#5A6478] hover:text-[#14181F] hover:bg-[#FAFBFC] border-[#E3E8F1]'
              }`}
              title={isSaved ? 'Remove from saved articles' : 'Save article'}
            >
              <Bookmark className="w-4 h-4" />
              <span>{isSaved ? 'Saved' : 'Save Story'}</span>
            </button>

            <button
              onClick={handleShare}
              className="p-2 text-[#5A6478] hover:text-[#14181F] hover:bg-[#FAFBFC] rounded-lg border border-[#E3E8F1] transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer"
              title="Share article link"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-600 font-semibold">Link Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-2 text-[#5A6478] hover:text-[#14181F] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>


        {/* Article Body Content */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Title */}
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#14181F] leading-snug">
            {article.title}
          </h1>

          {/* Meta Bar */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-[#5A6478] pb-4 border-b border-[#E3E8F1]">
            <span className="font-semibold text-[#14181F] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#22C55E]" />
              By {article.source}
            </span>
            <span>•</span>
            <span className="font-num flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {article.relativeTime}
            </span>
            <span>•</span>
            <span>{article.readTime}</span>
          </div>

          {/* Featured Image */}
          <div className="aspect-[16/9] overflow-hidden rounded-xl bg-slate-100">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Excerpt Lead */}
          <p className="text-base sm:text-lg font-medium text-[#14181F] leading-relaxed italic border-l-4 border-[#22C55E] pl-4">
            {article.excerpt}
          </p>

          {/* Body Text */}
          <div className="prose prose-slate max-w-none text-sm sm:text-base leading-relaxed text-[#14181F] space-y-4">
            {article.content.split('\n\n').map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>

          {/* Keywords */}
          {article.keywords && article.keywords.length > 0 && (
            <div className="pt-6 border-t border-[#E3E8F1]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#5A6478] block mb-2">
                Matched Keywords
              </span>
              <div className="flex flex-wrap gap-2">
                {article.keywords.map((kw) => (
                  <button
                    key={kw}
                    onClick={() => {
                      if (onSelectTag) onSelectTag(kw);
                      onClose();
                    }}
                    className="text-xs font-medium text-[#22C55E] bg-[#22C55E]/10 border border-[#22C55E]/20 hover:bg-[#22C55E] hover:text-white px-3 py-1 rounded-full transition-colors cursor-pointer"
                  >
                    #{kw}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
