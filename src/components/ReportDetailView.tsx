import React, { useState, useEffect } from 'react';
import { ReportItem } from '../types';
import { apiClient } from '../services/apiClient';
import { ArrowLeft, Clock, Calendar, User, FileText, Share2, Sparkles, AlertCircle } from 'lucide-react';

interface ReportDetailViewProps {
  slug: string;
  onBack: () => void;
}

export const ReportDetailView: React.FC<ReportDetailViewProps> = ({ slug, onBack }) => {
  const [report, setReport] = useState<ReportItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    apiClient.reports.getBySlug(slug)
      .then((data) => {
        if (isMounted) setReport(data);
      })
      .catch((err) => {
        if (isMounted) setError(err.message || 'Failed loading report detail');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[600px] bg-[#FAFBFC] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
          <div className="h-6 bg-slate-200 rounded w-28"></div>
          <div className="h-10 bg-slate-200 rounded w-3/4"></div>
          <div className="h-64 bg-slate-200 rounded-xl"></div>
          <div className="space-y-3 pt-4">
            <div className="h-4 bg-slate-200 rounded w-full"></div>
            <div className="h-4 bg-slate-200 rounded w-5/6"></div>
            <div className="h-4 bg-slate-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-[500px] bg-[#FAFBFC] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto bg-white border border-[#E3E8F1] rounded-2xl p-8 text-center shadow-sm">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="font-serif text-2xl font-bold text-[#14181F] mb-2">Report Unavailable</h2>
          <p className="text-sm text-[#5A6478] mb-6">
            {error || 'The requested MarketMaven report could not be found or is currently restricted.'}
          </p>
          <button
            onClick={onBack}
            className="px-5 py-2.5 bg-[#1E5EFF] text-white text-xs font-semibold rounded-lg hover:bg-blue-600 transition-colors inline-flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  // Parse markdown body simply into sections for clean editorial rendering
  const renderFormattedBody = (bodyText: string) => {
    const lines = bodyText.split('\n');
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) return <div key={idx} className="h-4" />;

      if (trimmed.startsWith('# ')) {
        return (
          <h1 key={idx} className="font-serif text-2xl sm:text-3xl font-bold text-[#14181F] mt-8 mb-4 border-b border-[#E3E8F1] pb-2">
            {trimmed.replace('# ', '')}
          </h1>
        );
      }

      if (trimmed.startsWith('## ')) {
        return (
          <h2 key={idx} className="font-serif text-xl sm:text-2xl font-bold text-[#14181F] mt-6 mb-3">
            {trimmed.replace('## ', '')}
          </h2>
        );
      }

      if (trimmed.startsWith('### ')) {
        return (
          <h3 key={idx} className="font-serif text-lg font-bold text-[#14181F] mt-5 mb-2">
            {trimmed.replace('### ', '')}
          </h3>
        );
      }

      if (trimmed.startsWith('> ')) {
        return (
          <blockquote key={idx} className="my-6 p-4 border-l-4 border-[#1E5EFF] bg-blue-50/40 italic text-[#14181F] rounded-r-lg font-serif">
            {trimmed.replace('> ', '')}
          </blockquote>
        );
      }

      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        return (
          <li key={idx} className="ml-6 list-disc text-[#14181F] text-base leading-relaxed mb-2">
            {trimmed.replace(/^[-*]\s+/, '')}
          </li>
        );
      }

      if (/^\d+\.\s+/.test(trimmed)) {
        return (
          <li key={idx} className="ml-6 list-decimal text-[#14181F] text-base leading-relaxed mb-2">
            {trimmed.replace(/^\d+\.\s+/, '')}
          </li>
        );
      }

      return (
        <p key={idx} className="text-[#14181F] text-base sm:text-lg leading-relaxed mb-4">
          {trimmed}
        </p>
      );
    });
  };

  return (
    <article className="min-h-screen bg-[#FAFBFC] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Back navigation */}
        <button
          onClick={onBack}
          className="mb-8 px-4 py-2 bg-white border border-[#E3E8F1] hover:border-[#1E5EFF] text-[#5A6478] hover:text-[#1E5EFF] text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-2 cursor-pointer shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* Report Header Card */}
        <div className="bg-white border border-[#E3E8F1] rounded-2xl p-6 sm:p-10 shadow-sm mb-8">
          
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="px-3 py-1 bg-[#1E5EFF] text-white text-xs font-bold rounded-full uppercase tracking-wider">
              {report.vertical}
            </span>
            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> MarketMaven Original Report
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#14181F] leading-tight mb-6">
            {report.title}
          </h1>

          <p className="text-base sm:text-lg text-[#5A6478] leading-relaxed mb-8 font-sans border-l-2 border-[#1E5EFF] pl-4 italic">
            {report.summary}
          </p>

          <div className="pt-6 border-t border-[#E3E8F1] flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm text-[#5A6478]">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 font-semibold text-[#14181F]">
                <User className="w-4 h-4 text-[#1E5EFF]" />
                {report.author_name}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#5A6478]" />
                {new Date(report.published_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
              {report.readTime && (
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#5A6478]" />
                  {report.readTime}
                </span>
              )}
            </div>

            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: report.title, url: window.location.href }).catch(() => {});
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Report URL copied to clipboard');
                }
              }}
              className="px-3 py-1.5 bg-[#FAFBFC] border border-[#E3E8F1] hover:border-[#1E5EFF] rounded-lg text-xs font-medium text-[#14181F] flex items-center gap-1.5 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-[#1E5EFF]" /> Share Report
            </button>
          </div>
        </div>

        {/* Cover Image */}
        {report.cover_image_url && (
          <div className="w-full aspect-[21/9] sm:aspect-[2/1] rounded-2xl overflow-hidden mb-10 shadow-sm border border-[#E3E8F1]">
            <img
              src={report.cover_image_url}
              alt={report.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Report Content Body */}
        <div className="bg-white border border-[#E3E8F1] rounded-2xl p-6 sm:p-12 shadow-sm font-sans text-slate-800">
          <div className="prose prose-slate max-w-none">
            {renderFormattedBody(report.body)}
          </div>
        </div>

      </div>
    </article>
  );
};
