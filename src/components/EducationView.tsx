import React from 'react';
import { EDUCATION_GUIDES } from '../data/educationData';
import { BookOpen, Clock, CheckCircle2, HelpCircle, ArrowRight, Award, Bookmark } from 'lucide-react';

interface EducationViewProps {
  guideId: string;
  onSelectGuide: (guideId: string) => void;
}

export const EducationView: React.FC<EducationViewProps> = ({ guideId, onSelectGuide }) => {
  const guide = EDUCATION_GUIDES[guideId] || EDUCATION_GUIDES['beginners-guide'];

  const allGuideKeys = Object.keys(EDUCATION_GUIDES);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Category Header */}
      <div className="border-b border-[#E3E8F1] pb-6">
        <div className="flex items-center gap-2 text-[#1E5EFF] font-mono text-xs font-bold uppercase tracking-wider mb-1">
          <BookOpen className="w-4 h-4" />
          <span>MarketMaven Academy • {guide.category}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-serif text-[#14181F]">{guide.title}</h1>
        <div className="flex items-center gap-4 text-xs text-[#5A6478] mt-2">
          <span className="flex items-center gap-1 font-mono">
            <Clock className="w-3.5 h-3.5" />
            {guide.readTime}
          </span>
          <span>•</span>
          <span className="text-[#00D1B2] font-semibold">Verified Educational Content</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation: All Education Guides */}
        <div className="space-y-4">
          <div className="bg-[#0A0F1A] text-white p-5 rounded-xl border border-white/10 space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase text-[#22C55E] tracking-wider border-b border-white/10 pb-2">
              Education Curriculum
            </h3>
            <div className="space-y-1">
              {allGuideKeys.map((key) => {
                const item = EDUCATION_GUIDES[key];
                const isActive = key === guide.id;

                return (
                  <button
                    key={key}
                    onClick={() => onSelectGuide(key)}
                    className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#1E5EFF] text-white font-bold'
                        : 'text-slate-300 hover:text-white hover:bg-[#141A29]'
                    }`}
                  >
                    <div className="line-clamp-1">{item.title}</div>
                    <div className="text-[10px] text-slate-400 font-normal mt-0.5">{item.readTime}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-[#1E5EFF]/5 border border-[#1E5EFF]/20 rounded-xl p-4 text-xs space-y-2">
            <div className="font-bold text-[#14181F] flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#1E5EFF]" />
              <span>Free Financial Literacy</span>
            </div>
            <p className="text-[#5A6478]">
              All MarketMaven education modules are freely accessible to equip investors with institutional concepts.
            </p>
          </div>
        </div>

        {/* Main Guide Content */}
        <div className="lg:col-span-3 space-y-8">
          {/* Summary Box */}
          <div className="bg-white border-l-4 border-l-[#1E5EFF] border-y border-r border-[#E3E8F1] rounded-r-xl p-6 shadow-xs">
            <h3 className="text-xs font-mono font-bold text-[#1E5EFF] uppercase tracking-wider mb-2">
              Executive Overview
            </h3>
            <p className="text-sm font-serif text-[#14181F] leading-relaxed italic">{guide.summary}</p>
          </div>

          {/* Guide Sections */}
          <div className="space-y-8">
            {guide.sections.map((section, idx) => (
              <div key={idx} className="bg-white border border-[#E3E8F1] rounded-xl p-6 sm:p-8 space-y-4 shadow-xs">
                <h2 className="text-xl font-bold font-serif text-[#14181F] border-b border-[#E3E8F1] pb-3">
                  {section.title}
                </h2>

                <div className="text-sm text-[#14181F] leading-relaxed whitespace-pre-line space-y-2">
                  {section.content}
                </div>

                {section.keyTakeaway && (
                  <div className="mt-4 bg-[#00D1B2]/10 border border-[#00D1B2]/30 rounded-lg p-4 text-xs text-[#008A75] flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#00D1B2] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-[#14181F] block mb-0.5">Key Takeaway</span>
                      <span>{section.keyTakeaway}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Key Terms Glossary */}
          {guide.keyTerms && guide.keyTerms.length > 0 && (
            <div className="bg-[#0A0F1A] text-white rounded-xl p-6 sm:p-8 border border-white/10 space-y-4 shadow-xl">
              <h3 className="text-lg font-serif font-bold flex items-center gap-2 border-b border-white/10 pb-3">
                <HelpCircle className="w-5 h-5 text-[#22C55E]" />
                <span>Key Terminology & Definitions</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {guide.keyTerms.map((item, idx) => (
                  <div key={idx} className="bg-[#141A29] p-4 rounded-lg border border-white/5 space-y-1">
                    <span className="text-xs font-mono font-bold text-[#22C55E] block">{item.term}</span>
                    <p className="text-xs text-slate-300 leading-relaxed">{item.definition}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
