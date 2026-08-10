import React, { useState, useEffect } from 'react';
import { ReportItem } from '../types';
import { apiClient } from '../services/apiClient';
import { FileText, Clock, User, ArrowRight, ShieldCheck, Filter } from 'lucide-react';

interface ReportsListViewProps {
  onSelectReport: (slug: string) => void;
  initialVertical?: string;
}

export const ReportsListView: React.FC<ReportsListViewProps> = ({
  onSelectReport,
  initialVertical = 'All',
}) => {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeVertical, setActiveVertical] = useState<string>(initialVertical);

  const verticals = ['All', 'Macroeconomics', 'Markets', 'Tech & Innovation', 'Currencies', 'Banking'];

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    apiClient.reports.get({ vertical: activeVertical === 'All' ? undefined : activeVertical })
      .then((data) => {
        if (isMounted) setReports(data);
      })
      .catch((err) => {
        console.warn('Failed to load reports:', err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [activeVertical]);

  return (
    <div className="min-h-screen bg-[#FAFBFC] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Banner Header */}
        <div className="bg-[#0A0F1A] text-white rounded-2xl p-8 sm:p-12 mb-10 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#22C55E]/15 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="max-w-2xl relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#22C55E] text-white text-xs font-bold rounded-full uppercase tracking-wider mb-4">
              <FileText className="w-3.5 h-3.5" /> First-Party Intelligence
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white mb-4 leading-tight">
              MarketMaven Featured Reports
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              In-depth empirical research, sovereign liquidity assessments, and sector deep-dives authored by MarketMaven’s financial desk analysts.
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          <span className="text-xs font-bold text-[#5A6478] uppercase mr-2 flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5" /> Vertical:
          </span>
          {verticals.map((v) => (
            <button
              key={v}
              onClick={() => setActiveVertical(v)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeVertical === v
                  ? 'bg-[#22C55E] text-white shadow-xs'
                  : 'bg-white border border-[#E3E8F1] text-[#5A6478] hover:border-[#22C55E] hover:text-[#14181F]'
              }`}
            >
              {v}
            </button>
          ))}
        </div>

        {/* Grid List of Reports */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white border border-[#E3E8F1] rounded-2xl p-6 animate-pulse space-y-4">
                <div className="aspect-[16/10] bg-slate-200 rounded-xl"></div>
                <div className="h-5 bg-slate-200 rounded w-1/3"></div>
                <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                <div className="h-4 bg-slate-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : reports.length === 0 ? (
          <div className="bg-white border border-[#E3E8F1] rounded-2xl p-12 text-center text-[#5A6478]">
            No reports found for the selected vertical.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reports.map((report) => (
              <article
                key={report.id}
                onClick={() => onSelectReport(report.slug)}
                className="bg-white border border-[#E3E8F1] hover:border-[#22C55E] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-[16/10] overflow-hidden bg-slate-100 relative">
                    <img
                      src={report.cover_image_url || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=1200'}
                      alt={report.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-1 bg-[#22C55E] text-white text-[10px] font-bold uppercase rounded-full shadow">
                      {report.vertical}
                    </span>
                  </div>

                  <div className="p-6">
                    <h3 className="font-serif text-xl font-bold text-[#14181F] group-hover:text-[#22C55E] transition-colors leading-snug mb-3">
                      {report.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#5A6478] line-clamp-3 leading-relaxed mb-4">
                      {report.summary}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-3 border-t border-[#E3E8F1] flex items-center justify-between text-xs text-[#5A6478]">
                  <span className="font-semibold text-[#14181F] flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#22C55E]" />
                    {report.author_name}
                  </span>
                  <span className="flex items-center gap-1 text-[#22C55E] font-semibold group-hover:translate-x-1 transition-transform">
                    Read Report <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
