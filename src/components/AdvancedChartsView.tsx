import React, { useState } from 'react';
import { MOCK_STOCKS } from '../data/mockStocks';
import { StockData } from '../types';
import { TemplateCPage } from './TemplateCPage';
import { LineChart, BarChart2, TrendingUp, Calendar, Layers, Eye, ShieldAlert } from 'lucide-react';

interface AdvancedChartsViewProps {
  initialStock?: StockData;
}

export const AdvancedChartsView: React.FC<AdvancedChartsViewProps> = ({ initialStock }) => {
  const [selectedStock, setSelectedStock] = useState<StockData>(initialStock || MOCK_STOCKS[0]);
  const [activeTab, setActiveTab] = useState<'chart' | 'financials'>('chart');
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '3M' | '1Y' | 'ALL'>('1M');
  const [showSMA, setShowSMA] = useState<boolean>(true);
  const [showVolume, setShowVolume] = useState<boolean>(true);

  // Sparkline data mapping for chart simulation
  const chartPoints = selectedStock.sparkline;
  const minPrice = Math.min(...chartPoints) * 0.98;
  const maxPrice = Math.max(...chartPoints) * 1.02;

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

        {/* Stock Selector Dropdown */}
        <div className="w-full sm:w-72">
          <label className="block text-[11px] font-mono text-[#5A6478] mb-1">Select Security / Ticker</label>
          <select
            value={selectedStock.symbol}
            onChange={(e) => {
              const found = MOCK_STOCKS.find((s) => s.symbol === e.target.value);
              if (found) setSelectedStock(found);
            }}
            className="w-full bg-white border border-[#E3E8F1] rounded-lg px-3.5 py-2 text-xs font-mono font-bold text-[#14181F] focus:outline-none focus:border-[#22C55E] shadow-xs"
          >
            {MOCK_STOCKS.map((stock) => (
              <option key={stock.symbol} value={stock.symbol}>
                {stock.symbol} ({stock.name}) - {stock.exchange}
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
        <div className="space-y-6">
          {/* Security Price Summary Header Bar */}
          <div className="bg-[#0A0F1A] text-white p-6 rounded-2xl shadow-xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold font-mono">{selectedStock.symbol}</span>
                <span className="bg-white/10 text-white px-2.5 py-0.5 rounded text-xs font-mono">
                  {selectedStock.exchange} • {selectedStock.sector}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-serif mt-1">{selectedStock.name}</p>
            </div>

            <div className="flex items-center gap-8 font-mono">
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">Last Traded</span>
                <span className="text-2xl font-bold text-white">
                  {selectedStock.exchange === 'NGX' ? '₦' : '$'}
                  {selectedStock.price.toFixed(2)}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase block">Day Change</span>
                <span
                  className={`text-base font-bold ${
                    selectedStock.change >= 0 ? 'text-[#00C48C]' : 'text-[#FF4D4F]'
                  }`}
                >
                  {selectedStock.change >= 0 ? '+' : ''}
                  {selectedStock.change.toFixed(2)} ({selectedStock.changePercent.toFixed(2)}%)
                </span>
              </div>

              <div className="hidden lg:block">
                <span className="text-[10px] text-slate-400 uppercase block">52W Range</span>
                <span className="text-xs text-slate-200">
                  {selectedStock.low52} - {selectedStock.high52}
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Chart Canvas Simulation */}
          <div className="bg-[#0A0F1A] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4">
            {/* Chart Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              {/* Timeframe Buttons */}
              <div className="flex bg-[#141A29] p-1 rounded-lg border border-white/5 text-xs font-mono">
                {(['1D', '1W', '1M', '3M', '1Y', 'ALL'] as const).map((tf) => (
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
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showSMA}
                    onChange={(e) => setShowSMA(e.target.checked)}
                    className="accent-[#22C55E] rounded"
                  />
                  <span>SMA (20/50)</span>
                </label>

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

            {/* Simulated Chart Plot Area */}
            <div className="h-72 w-full relative pt-4 pb-2 flex flex-col justify-between">
              {/* Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10">
                <div className="border-b border-white w-full" />
                <div className="border-b border-white w-full" />
                <div className="border-b border-white w-full" />
                <div className="border-b border-white w-full" />
              </div>

              {/* SVG Sparkline & Indicator Curves */}
              <div className="w-full h-48 relative z-10">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 500 150" preserveAspectRatio="none">
                  {/* SMA 20 Curve */}
                  {showSMA && (
                    <path
                      d="M 0,100 Q 125,85 250,70 T 500,50"
                      fill="none"
                      stroke="#00D1B2"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                    />
                  )}

                  {/* Main Stock Price Trend Curve */}
                  <path
                    d={`M 0,${150 - ((chartPoints[0] - minPrice) / (maxPrice - minPrice)) * 120} ${chartPoints
                      .map((p, i) => {
                        const x = (i / (chartPoints.length - 1)) * 500;
                        const y = 150 - ((p - minPrice) / (maxPrice - minPrice)) * 120;
                        return `L ${x},${y}`;
                      })
                      .join(' ')}`}
                    fill="none"
                    stroke={selectedStock.change >= 0 ? '#00C48C' : '#FF4D4F'}
                    strokeWidth="2.5"
                  />
                </svg>
              </div>

              {/* Volume Bars */}
              {showVolume && (
                <div className="h-16 w-full flex items-end justify-between gap-2 pt-2 border-t border-white/10">
                  {chartPoints.map((p, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-[#22C55E]/40 hover:bg-[#22C55E] rounded-t transition-all"
                      style={{ height: `${20 + (i % 3) * 20}%` }}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between border-t border-white/10 pt-3">
              <span>Timeframe: {timeframe} Historical Plot</span>
              <span>Primary Exchange: {selectedStock.exchange}</span>
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
                  {selectedStock.ohlc.map((row, idx) => (
                    <tr key={idx} className="hover:bg-[#FAFBFC]">
                      <td className="px-4 py-2.5 font-bold">{row.date}</td>
                      <td className="px-4 py-2.5">{row.open.toFixed(2)}</td>
                      <td className="px-4 py-2.5 text-[#00C48C] font-semibold">{row.high.toFixed(2)}</td>
                      <td className="px-4 py-2.5 text-[#FF4D4F]">{row.low.toFixed(2)}</td>
                      <td className="px-4 py-2.5 font-bold">{row.close.toFixed(2)}</td>
                      <td className="px-4 py-2.5 text-right text-[#5A6478]">
                        {row.volume.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Tab Content 2: Financial Statements (Template C) */
        <TemplateCPage
          title={`${selectedStock.symbol} Financial Statements Breakdown`}
          description="Detailed balance sheet, income statement, and cash flow accounting statements are currently undergoing regulatory XBRL data integration."
        />
      )}
    </div>
  );
};
