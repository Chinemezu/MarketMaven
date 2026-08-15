import React, { useState, useEffect, useMemo } from 'react';
import { StockData } from '../types';
import { apiClient, PriceApiItem } from '../services/apiClient';
import { TemplateCPage } from './TemplateCPage';
import { LineChart, TrendingUp, Calendar, Layers, Eye, ShieldAlert, AlertCircle } from 'lucide-react';

interface AdvancedChartsViewProps {
  initialStock?: StockData;
}

interface IssuerOption {
  id: number;
  ticker: string;
  name: string;
  exchange: string;
  sector: string | null;
}

// Below this many real trading days, a "52W Range" or 20-period SMA claim
// would be more fiction than fact — real ingestion has only been running
// a short while, so most issuers currently have well under this. Shown
// honestly as "insufficient history" rather than computed against
// whatever few points exist and presented as if it meant something.
const MIN_SESSIONS_FOR_RANGE = 10;
const MIN_SESSIONS_FOR_SMA = 20;
const TRADING_DAYS_PER_YEAR = 252;

const TIMEFRAME_DAYS: Record<string, number | null> = {
  '1D': 1, '1W': 7, '1M': 30, '3M': 90, '1Y': 365, 'ALL': null,
};

function computeSMA(closes: number[], period: number): (number | null)[] {
  return closes.map((_, i) => {
    if (i < period - 1) return null;
    const window = closes.slice(i - period + 1, i + 1);
    return window.reduce((sum, v) => sum + v, 0) / window.length;
  });
}

export const AdvancedChartsView: React.FC<AdvancedChartsViewProps> = ({ initialStock }) => {
  const [issuers, setIssuers] = useState<IssuerOption[]>([]);
  const [issuersLoading, setIssuersLoading] = useState(true);
  const [selectedIssuerId, setSelectedIssuerId] = useState<number | null>(null);
  const [prices, setPrices] = useState<PriceApiItem[]>([]);
  const [pricesLoading, setPricesLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'chart' | 'financials'>('chart');
  const [timeframe, setTimeframe] = useState<keyof typeof TIMEFRAME_DAYS>('ALL');
  const [showSMA, setShowSMA] = useState<boolean>(true);
  const [showVolume, setShowVolume] = useState<boolean>(true);

  useEffect(() => {
    apiClient.market.issuers()
      .then((data) => {
        const sorted = [...data].sort((a, b) => a.ticker.localeCompare(b.ticker));
        setIssuers(sorted);
        const preselect = initialStock
          ? sorted.find((i) => i.ticker.toUpperCase() === initialStock.symbol.toUpperCase())
          : undefined;
        setSelectedIssuerId((preselect ?? sorted[0])?.id ?? null);
      })
      .catch((err) => console.warn('Failed to load issuers:', err))
      .finally(() => setIssuersLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedIssuerId === null) return;
    setPricesLoading(true);
    apiClient.market.issuerPrices(String(selectedIssuerId))
      .then((data) => setPrices(data))
      .catch((err) => {
        console.warn('Failed to load price history:', err);
        setPrices([]);
      })
      .finally(() => setPricesLoading(false));
  }, [selectedIssuerId]);

  const selectedIssuer = issuers.find((i) => i.id === selectedIssuerId);

  const filteredPrices = useMemo(() => {
    const days = TIMEFRAME_DAYS[timeframe];
    if (days === null || prices.length === 0) return prices;
    const cutoff = new Date(prices[prices.length - 1].trade_date);
    cutoff.setDate(cutoff.getDate() - days);
    return prices.filter((p) => new Date(p.trade_date) >= cutoff);
  }, [prices, timeframe]);

  const closes = filteredPrices.map((p) => p.close);
  const latest = filteredPrices[filteredPrices.length - 1];
  const previous = filteredPrices[filteredPrices.length - 2];
  const changeAmount = latest && previous ? latest.close - previous.close : null;

  const hasEnoughForRange = filteredPrices.length >= MIN_SESSIONS_FOR_RANGE;
  const rangeLow = hasEnoughForRange ? Math.min(...filteredPrices.map((p) => p.low ?? p.close)) : null;
  const rangeHigh = hasEnoughForRange ? Math.max(...filteredPrices.map((p) => p.high ?? p.close)) : null;
  const isFullYearRange = filteredPrices.length >= TRADING_DAYS_PER_YEAR;

  const hasEnoughForSMA = closes.length >= MIN_SESSIONS_FOR_SMA;
  const smaValues = hasEnoughForSMA ? computeSMA(closes, MIN_SESSIONS_FOR_SMA) : [];

  const minPrice = closes.length ? Math.min(...closes) * 0.98 : 0;
  const maxPrice = closes.length ? Math.max(...closes) * 1.02 : 1;
  const currency = latest?.currency === 'USD' ? '$' : latest?.currency === 'NGN' ? '₦' : '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="border-b border-[#E3E8F1] pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#22C55E] font-mono text-xs font-bold uppercase tracking-wider mb-1">
            <LineChart className="w-4 h-4" />
            <span>Research & Technical Terminal</span>
          </div>
          <h1 className="text-3xl font-bold font-serif text-[#14181F]">
            Advanced Market Charts
          </h1>
        </div>

        {/* Real Issuer Selector */}
        <div className="w-full sm:w-72">
          <label className="block text-[11px] font-mono text-[#5A6478] mb-1">Select Security / Ticker</label>
          <select
            value={selectedIssuerId ?? ''}
            onChange={(e) => setSelectedIssuerId(Number(e.target.value))}
            disabled={issuersLoading || issuers.length === 0}
            className="w-full bg-white border border-[#E3E8F1] rounded-lg px-3.5 py-2 text-xs font-mono font-bold text-[#14181F] focus:outline-none focus:border-[#22C55E] shadow-xs disabled:opacity-50"
          >
            {issuers.map((issuer) => (
              <option key={issuer.id} value={issuer.id}>
                {issuer.ticker} ({issuer.name}) - {issuer.exchange}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="flex border-b border-[#E3E8F1] space-x-6 text-xs font-bold font-mono uppercase">
        <button
          onClick={() => setActiveTab('chart')}
          className={`pb-3 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'chart'
              ? 'border-[#22C55E] text-[#22C55E]'
              : 'border-transparent text-[#5A6478] hover:text-[#14181F]'
          }`}
        >
          Interactive Technical Chart
        </button>

        <button
          onClick={() => setActiveTab('financials')}
          className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'financials'
              ? 'border-[#22C55E] text-[#22C55E]'
              : 'border-transparent text-[#5A6478] hover:text-[#14181F]'
          }`}
        >
          <span>Financial Statements</span>
          <span className="bg-[#22C55E]/10 text-[#22C55E] text-[9px] px-1.5 py-0.5 rounded font-mono">
            COMING SOON
          </span>
        </button>
      </div>

      {/* Tab Content 1: Interactive Chart */}
      {activeTab === 'chart' ? (
        issuersLoading ? (
          <div className="h-72 flex items-center justify-center text-[#5A6478] text-sm">Loading securities...</div>
        ) : !selectedIssuer ? (
          <div className="bg-white border border-[#E3E8F1] rounded-xl p-12 text-center text-[#5A6478]">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            No tracked securities yet.
          </div>
        ) : (
        <div className="space-y-6">
          {/* Security Price Summary Header Bar */}
          <div className="bg-[#0A0F1A] text-white p-6 rounded-2xl shadow-xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold font-mono">{selectedIssuer.ticker}</span>
                <span className="bg-white/10 text-white px-2.5 py-0.5 rounded text-xs font-mono">
                  {selectedIssuer.exchange}{selectedIssuer.sector ? ` • ${selectedIssuer.sector}` : ''}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-serif mt-1">{selectedIssuer.name}</p>
            </div>

            {pricesLoading ? (
              <div className="text-xs text-slate-400 font-mono">Loading price history...</div>
            ) : !latest ? (
              <div className="text-xs text-amber-400 font-mono flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" /> No price history yet for this security
              </div>
            ) : (
              <div className="flex items-center gap-8 font-mono">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">Last Traded ({latest.trade_date})</span>
                  <span className="text-2xl font-bold text-white">
                    {currency}{latest.close.toFixed(2)}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">Day Change</span>
                  {latest.change_pct !== null ? (
                    <span className={`text-base font-bold ${latest.change_pct >= 0 ? 'text-[#00C48C]' : 'text-[#FF4D4F]'}`}>
                      {changeAmount !== null && `${changeAmount >= 0 ? '+' : ''}${changeAmount.toFixed(2)} `}
                      ({latest.change_pct >= 0 ? '+' : ''}{latest.change_pct.toFixed(2)}%)
                    </span>
                  ) : (
                    <span className="text-xs text-slate-500 border-b border-dashed border-slate-500">— insufficient history</span>
                  )}
                </div>

                <div className="hidden lg:block">
                  <span className="text-[10px] text-slate-400 uppercase block">
                    {isFullYearRange ? '52W Range' : `Range (${filteredPrices.length} sessions)`}
                  </span>
                  {hasEnoughForRange && rangeLow !== null && rangeHigh !== null ? (
                    <span className="text-xs text-slate-200">
                      {rangeLow.toFixed(2)} - {rangeHigh.toFixed(2)}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-500 border-b border-dashed border-slate-500">— insufficient history</span>
                  )}
                </div>
              </div>
            )}
          </div>

          {latest && (
          <>
          {/* Interactive Chart Canvas */}
          <div className="bg-[#0A0F1A] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4">
            {/* Chart Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              {/* Timeframe Buttons */}
              <div className="flex bg-[#141A29] p-1 rounded-lg border border-white/5 text-xs font-mono">
                {(Object.keys(TIMEFRAME_DAYS) as (keyof typeof TIMEFRAME_DAYS)[]).map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                      timeframe === tf ? 'bg-[#22C55E] text-white font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>

              {/* Indicator Toggles */}
              <div className="flex items-center gap-3 text-xs font-mono text-slate-300">
                {hasEnoughForSMA ? (
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showSMA}
                      onChange={(e) => setShowSMA(e.target.checked)}
                      className="accent-[#22C55E] rounded"
                    />
                    <span>SMA ({MIN_SESSIONS_FOR_SMA})</span>
                  </label>
                ) : (
                  <span className="text-slate-600 italic">SMA needs {MIN_SESSIONS_FOR_SMA}+ sessions of history</span>
                )}

                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showVolume}
                    onChange={(e) => setShowVolume(e.target.checked)}
                    className="accent-[#00D1B2] rounded"
                  />
                  <span>Volume Bars</span>
                </label>
              </div>
            </div>

            {/* Chart Plot Area */}
            <div className="h-72 w-full relative pt-4 pb-2 flex flex-col justify-between">
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10">
                <div className="border-b border-white w-full" />
                <div className="border-b border-white w-full" />
                <div className="border-b border-white w-full" />
                <div className="border-b border-white w-full" />
              </div>

              <div className="w-full h-48 relative z-10">
                {closes.length < 2 ? (
                  <div className="h-full flex items-center justify-center text-slate-500 text-xs font-mono">
                    Not enough sessions to plot a trend line yet
                  </div>
                ) : (
                <svg className="w-full h-full overflow-visible" viewBox="0 0 500 150" preserveAspectRatio="none">
                  {showSMA && hasEnoughForSMA && (
                    <path
                      d={smaValues
                        .map((v, i) => (v === null ? null : { x: (i / (closes.length - 1)) * 500, y: 150 - ((v - minPrice) / (maxPrice - minPrice)) * 120 }))
                        .filter((p): p is { x: number; y: number } => p !== null)
                        .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`)
                        .join(' ')}
                      fill="none"
                      stroke="#00D1B2"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                    />
                  )}

                  <path
                    d={`M 0,${150 - ((closes[0] - minPrice) / (maxPrice - minPrice)) * 120} ${closes
                      .map((p, i) => {
                        const x = (i / (closes.length - 1)) * 500;
                        const y = 150 - ((p - minPrice) / (maxPrice - minPrice)) * 120;
                        return `L ${x},${y}`;
                      })
                      .join(' ')}`}
                    fill="none"
                    stroke={(latest.change_pct ?? 0) >= 0 ? '#00C48C' : '#FF4D4F'}
                    strokeWidth="2.5"
                  />
                </svg>
                )}
              </div>

              {showVolume && (
                <div className="h-16 w-full flex items-end justify-between gap-2 pt-2 border-t border-white/10">
                  {filteredPrices.map((p, i) => {
                    const maxVolume = Math.max(...filteredPrices.map((r) => r.volume ?? 0), 1);
                    const heightPct = ((p.volume ?? 0) / maxVolume) * 100;
                    return (
                      <div
                        key={i}
                        className="flex-1 bg-[#22C55E]/40 hover:bg-[#22C55E] rounded-t transition-all"
                        style={{ height: `${Math.max(heightPct, 2)}%` }}
                        title={`${p.trade_date}: ${(p.volume ?? 0).toLocaleString()}`}
                      />
                    );
                  })}
                </div>
              )}
            </div>

            <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between border-t border-white/10 pt-3">
              <span>Timeframe: {timeframe} · {filteredPrices.length} real session{filteredPrices.length === 1 ? '' : 's'}</span>
              <span>Primary Exchange: {selectedIssuer.exchange}</span>
            </div>
          </div>

          {/* Daily OHLC Table */}
          <div className="bg-white border border-[#E3E8F1] rounded-xl p-5 shadow-xs">
            <h3 className="font-serif font-bold text-base text-[#14181F] mb-3">
              Daily Price Action (OHLC History)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#14181F]">
                <thead className="bg-[#FAFBFC] text-[#5A6478] font-mono uppercase text-[10px] border-b border-[#E3E8F1]">
                  <tr>
                    <th className="px-4 py-2">Session</th>
                    <th className="px-4 py-2">Open</th>
                    <th className="px-4 py-2">High</th>
                    <th className="px-4 py-2">Low</th>
                    <th className="px-4 py-2">Close</th>
                    <th className="px-4 py-2 text-right">Volume</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E3E8F1] font-mono">
                  {[...filteredPrices].reverse().map((row) => (
                    <tr key={row.trade_date} className="hover:bg-[#FAFBFC]">
                      <td className="px-4 py-2.5 font-bold">{row.trade_date}</td>
                      <td className="px-4 py-2.5">{row.open !== null ? row.open.toFixed(2) : '—'}</td>
                      <td className="px-4 py-2.5 text-[#00C48C] font-semibold">{row.high !== null ? row.high.toFixed(2) : '—'}</td>
                      <td className="px-4 py-2.5 text-[#FF4D4F]">{row.low !== null ? row.low.toFixed(2) : '—'}</td>
                      <td className="px-4 py-2.5 font-bold">{row.close.toFixed(2)}</td>
                      <td className="px-4 py-2.5 text-right text-[#5A6478]">
                        {row.volume !== null ? row.volume.toLocaleString() : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          </>
          )}
        </div>
        )
      ) : (
        /* Tab Content 2: Financial Statements (Template C) — left as coming-soon
           per spec; no financial-statement data source exists yet. Don't
           block the working chart above behind this. */
        <TemplateCPage
          title={`${selectedIssuer?.ticker ?? 'Security'} Financial Statements Breakdown`}
          description="Detailed balance sheet, income statement, and cash flow accounting statements are currently undergoing regulatory XBRL data integration."
        />
      )}
    </div>
  );
};
