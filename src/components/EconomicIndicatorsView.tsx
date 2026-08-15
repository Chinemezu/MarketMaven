import React, { useState, useEffect } from 'react';
import { EconomicIndicator } from '../types';
import { apiClient } from '../services/apiClient';
import { BarChart3, AlertCircle, Flag } from 'lucide-react';

// Below this many real observations, a trend line would be more noise
// than signal — shown as "insufficient history" instead. Same convention
// as Advanced Charts' range/SMA gating.
const MIN_OBSERVATIONS_FOR_TREND = 4;

function Sparkline({ values, positive }: { values: number[]; positive: boolean }) {
  if (values.length < 2) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const points = values
    .map((v, i) => `${(i / (values.length - 1)) * 100},${20 - ((v - min) / range) * 18}`)
    .join(' ');
  return (
    <svg viewBox="0 0 100 20" className="w-full h-8" preserveAspectRatio="none">
      <polyline
        points={points}
        fill="none"
        stroke={positive ? '#00C48C' : '#FF4D4F'}
        strokeWidth="1.5"
      />
    </svg>
  );
}

export const EconomicIndicatorsView: React.FC = () => {
  const [indicators, setIndicators] = useState<EconomicIndicator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    apiClient.economicIndicators.get({ limit: 100 })
      .then((data) => { if (isMounted) setIndicators(data); })
      .catch((err) => console.warn('Failed to load economic indicators:', err))
      .finally(() => { if (isMounted) setLoading(false); });
    return () => { isMounted = false; };
  }, []);

  // Backend already orders newest-first per series (see GET
  // /economic-indicators) — group preserving that order, then reverse
  // each series' own array for a chronological (oldest→newest) sparkline.
  const bySeries = new Map<string, EconomicIndicator[]>();
  for (const ind of indicators) {
    const list = bySeries.get(ind.series_code) ?? [];
    list.push(ind);
    bySeries.set(ind.series_code, list);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="border-b border-[#E3E8F1] pb-6">
        <div className="flex items-center gap-2 text-[#22C55E] font-mono text-xs font-bold uppercase tracking-wider mb-1">
          <BarChart3 className="w-4 h-4" />
          <span>Macroeconomic Data Desk</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-serif text-[#14181F]">Economic Indicators</h1>
        <p className="text-sm text-[#5A6478] mt-1 max-w-2xl">
          Real data sourced from FRED (Federal Reserve Economic Data), the St. Louis Fed's public API.
        </p>

        {/* US-only banner -- explicit, not left to be inferred */}
        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900 flex items-start gap-2">
          <Flag className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>
            <strong>US indicators only.</strong> FRED has no Nigerian-economy equivalent, and no other source is
            wired up for one yet — this section does not (and should not be read to) cover NGX/Nigerian macro data.
          </span>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="bg-white border border-[#E3E8F1] rounded-xl p-6 animate-pulse space-y-3">
              <div className="h-4 bg-slate-200 rounded w-1/2" />
              <div className="h-8 bg-slate-200 rounded w-1/3" />
              <div className="h-8 bg-slate-200 rounded w-full" />
            </div>
          ))}
        </div>
      ) : bySeries.size === 0 ? (
        <div className="bg-white border border-[#E3E8F1] rounded-xl p-12 text-center text-[#5A6478]">
          <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
          <h3 className="text-base font-bold text-[#14181F]">No indicator data yet</h3>
          <p className="text-xs mt-1">The FRED puller runs weekly — check back soon, or trigger it manually if you're an admin.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from(bySeries.entries()).map(([code, series]) => {
            const latest = series[0]; // newest-first from the API
            const chronological = [...series].reverse();
            const hasEnoughForTrend = series.length >= MIN_OBSERVATIONS_FOR_TREND;
            const previous = series[1];
            const isPositive = previous ? latest.value >= previous.value : true;

            return (
              <div key={code} className="bg-white border border-[#E3E8F1] rounded-xl p-6 shadow-xs space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-[#5A6478] uppercase tracking-wider">{code}</span>
                    <h3 className="font-serif font-bold text-base text-[#14181F] leading-snug">{latest.name}</h3>
                  </div>
                  <span className="text-[10px] font-mono bg-[#FAFBFC] border border-[#E3E8F1] text-[#5A6478] px-2 py-0.5 rounded shrink-0">
                    {latest.country}
                  </span>
                </div>

                <div className="flex items-end justify-between gap-4">
                  <div>
                    <span className="text-2xl font-bold font-mono text-[#14181F]">
                      {latest.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </span>
                    <span className="text-sm text-[#5A6478] ml-1">{latest.unit}</span>
                    <p className="text-[10px] text-[#5A6478] font-mono mt-0.5">as of {latest.date}</p>
                  </div>

                  <div className="w-28">
                    {hasEnoughForTrend ? (
                      <Sparkline values={chronological.map((s) => s.value)} positive={isPositive} />
                    ) : (
                      <span className="text-[10px] text-slate-400 italic border-b border-dashed border-slate-300 pb-0.5">
                        — insufficient history
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
