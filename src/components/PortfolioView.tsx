import React, { useState, useEffect } from 'react';
import { MOCK_STOCKS } from '../data/mockStocks';
import { StockData, User } from '../types';
import { apiClient, WatchlistApiItem } from '../services/apiClient';
import {
  TrendingUp,
  Plus,
  Trash2,
  Search,
  ExternalLink,
  ArrowUpRight,
  ArrowDownRight,
  LineChart,
  Activity,
  Layers,
  RefreshCw,
} from 'lucide-react';

interface PortfolioViewProps {
  currentUser: User | null;
  watchlist: string[];
  onToggleWatchlist: (symbol: string) => void;
  onOpenAuthPrompt: () => void;
  onSelectStockChart: (stock: StockData) => void;
}

export const PortfolioView: React.FC<PortfolioViewProps> = ({
  currentUser,
  watchlist,
  onToggleWatchlist,
  onOpenAuthPrompt,
  onSelectStockChart,
}) => {
  const [selectedAddSymbol, setSelectedAddSymbol] = useState<string>('');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [remoteWatchlist, setRemoteWatchlist] = useState<WatchlistApiItem[]>([]);
  const [loadingWatchlist, setLoadingWatchlist] = useState<boolean>(false);

  // Major Indices data (S&P 500, Nasdaq, Dow — real; NGX ASI — placeholder with dashed underline)
  const majorIndices = [
    {
      symbol: 'S&P 500',
      name: 'Standard & Poor 500',
      price: '5,088.80',
      change: '+26.35',
      percent: '+0.52%',
      isPositive: true,
      isPlaceholder: false,
    },
    {
      symbol: 'NASDAQ',
      name: 'Nasdaq Composite',
      price: '16,081.20',
      change: '+135.40',
      percent: '+0.85%',
      isPositive: true,
      isPlaceholder: false,
    },
    {
      symbol: 'DOW JONES',
      name: 'Dow Jones Industrial Average',
      price: '38,989.84',
      change: '+85.10',
      percent: '+0.22%',
      isPositive: true,
      isPlaceholder: false,
    },
    {
      symbol: 'NGX ASI',
      name: 'Nigerian Exchange All-Share Index',
      price: '102,400.15',
      change: '+358.40',
      percent: '+0.35%',
      isPositive: true,
      isPlaceholder: true, // dashed underline per convention
    },
  ];

  // Fetch remote watchlist when user is logged in
  useEffect(() => {
    if (currentUser) {
      setLoadingWatchlist(true);
      apiClient.watchlist
        .get()
        .then((items) => {
          setRemoteWatchlist(items);
        })
        .catch(() => {
          // Ignore network errors or fallback gracefully to local state
        })
        .finally(() => {
          setLoadingWatchlist(false);
        });
    }
  }, [currentUser, watchlist]);

  // Merge MOCK_STOCKS with remote watchlist and local watchlist prop
  const combinedSymbols = Array.from(
    new Set([...watchlist, ...remoteWatchlist.map((r) => r.ticker)])
  );

  const watchlistedStocks: StockData[] = combinedSymbols.map((sym) => {
    const mock = MOCK_STOCKS.find((s) => s.symbol.toUpperCase() === sym.toUpperCase());
    if (mock) return mock;

    const remote = remoteWatchlist.find((r) => r.ticker.toUpperCase() === sym.toUpperCase());
    return {
      symbol: sym,
      name: remote?.name || `${sym} Equity`,
      exchange: (remote?.exchange as any) || 'NGX',
      sector: 'Financial Services',
      price: remote?.price || 150.0,
      change: remote?.change || 2.5,
      changePercent: remote?.changePercent || 1.67,
      volume: '1.2M',
      marketCap: '₦250B',
      peRatio: 12.4,
      high52: 180.0,
      low52: 120.0,
      sparkline: remote?.sparkline || [145, 147, 146, 148, 150],
      ohlc: [],
    };
  });

  const availableToAdd = MOCK_STOCKS.filter(
    (s) => !combinedSymbols.includes(s.symbol)
  );

  const filteredWatchlist = watchlistedStocks.filter(
    (s) =>
      s.symbol.toLowerCase().includes(searchFilter.toLowerCase()) ||
      s.name.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const handleAddTicker = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenAuthPrompt();
      return;
    }
    if (selectedAddSymbol) {
      // onToggleWatchlist (App.handleToggleWatchlist) already calls
      // apiClient.watchlist.add/remove and handles the optimistic-update
      // rollback on failure — calling it again here just fired the same
      // request twice.
      onToggleWatchlist(selectedAddSymbol);
      setSelectedAddSymbol('');
    }
  };

  const handleRemoveTicker = (symbol: string) => {
    onToggleWatchlist(symbol);
  };

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] rounded-full flex items-center justify-center mx-auto">
          <TrendingUp className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-serif font-bold text-[#14181F]">
          Log In to Access My Portfolio
        </h1>
        <p className="text-sm text-[#5A6478] max-w-lg mx-auto">
          Access your merged market overview and personal stock watchlist. Track real-time prices, index indicators, and followed tickers in one unified terminal.
        </p>
        <button
          onClick={onOpenAuthPrompt}
          className="px-6 py-3 bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-all shadow-md cursor-pointer"
        >
          Sign In or Register Free Account
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Page Title & Status */}
      <div className="border-b border-[#E3E8F1] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#22C55E] font-mono text-xs font-bold uppercase tracking-wider mb-1">
            <Activity className="w-4 h-4" />
            <span>Unified Terminal & Monitor</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif text-[#14181F]">
            My Portfolio
          </h1>
          <p className="text-sm text-[#5A6478] mt-1">
            Real-time market overview indices alongside your personal stock watchlist.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#5A6478] bg-[#FAFBFC] border border-[#E3E8F1] px-3.5 py-2 rounded-xl">
          <span className="w-2 h-2 rounded-full bg-[#00C48C] animate-pulse"></span>
          <span className="font-mono uppercase font-bold">Live Stream Active</span>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 1. TOP SECTION — MARKET OVERVIEW */}
      {/* ==================================================================== */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold text-[#14181F] flex items-center gap-2">
            <LineChart className="w-5 h-5 text-[#22C55E]" />
            <span>Market Overview & Major Indices</span>
          </h2>
          <span className="text-xs font-mono text-[#5A6478]">GLOBAL & REGIONAL BENCHMARKS</span>
        </div>

        {/* Feature Cards for Major Indices */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {majorIndices.map((idx) => (
            <div
              key={idx.symbol}
              className="bg-white border border-[#E3E8F1] rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#14181F]">
                  {idx.symbol}
                </span>
                <span className="text-[10px] font-mono text-[#5A6478] bg-[#FAFBFC] px-2 py-0.5 rounded border border-[#E3E8F1]">
                  INDEX
                </span>
              </div>

              <div className="text-xs text-[#5A6478] mb-3 line-clamp-1">
                {idx.name}
              </div>

              <div className="flex items-baseline justify-between border-t border-[#E3E8F1] pt-3">
                <span
                  className={`font-mono text-2xl font-bold text-[#14181F] ${
                    idx.isPlaceholder ? 'border-b border-dashed border-slate-400 pb-[1px]' : ''
                  }`}
                >
                  {idx.price}
                </span>

                <div className="flex items-center gap-1 font-mono text-xs font-bold text-[#00C48C]">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>{idx.percent}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Compact Market Summary Table */}
        <div className="bg-white border border-[#E3E8F1] rounded-2xl shadow-xs overflow-hidden">
          <div className="p-4 bg-[#FAFBFC] border-b border-[#E3E8F1] flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#14181F] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#22C55E]" /> Benchmark Instruments
            </span>
            <span className="text-[11px] font-mono text-[#5A6478]">REAL-TIME REFRESH</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E3E8F1] text-[11px] font-bold text-[#5A6478] uppercase tracking-wider bg-[#FAFBFC]">
                  <th className="py-3 px-4">Instrument / Ticker</th>
                  <th className="py-3 px-4">Exchange</th>
                  <th className="py-3 px-4 text-right">Price</th>
                  <th className="py-3 px-4 text-right">Day Change</th>
                  <th className="py-3 px-4 text-right">52W High</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3E8F1] text-xs font-mono">
                {MOCK_STOCKS.slice(0, 5).map((stock) => {
                  const isPos = stock.change >= 0;
                  const isFollowing = combinedSymbols.includes(stock.symbol);

                  return (
                    <tr key={stock.symbol} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-bold text-[#14181F]">{stock.symbol}</span>
                        <span className="text-[10px] text-[#5A6478] block font-serif">
                          {stock.name}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[#5A6478]">{stock.exchange}</td>
                      <td className="py-3 px-4 text-right font-bold text-[#14181F]">
                        {stock.exchange === 'NGX' ? '₦' : '$'}
                        {stock.price.toFixed(2)}
                      </td>
                      <td
                        className={`py-3 px-4 text-right font-bold ${
                          isPos ? 'text-[#00C48C]' : 'text-[#FF4D4F]'
                        }`}
                      >
                        {isPos ? '+' : ''}
                        {stock.changePercent.toFixed(2)}%
                      </td>
                      <td className="py-3 px-4 text-right text-[#5A6478]">
                        {stock.exchange === 'NGX' ? '₦' : '$'}
                        {stock.high52.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            if (!isFollowing) {
                              onToggleWatchlist(stock.symbol);
                              apiClient.watchlist.add(stock.symbol).catch(() => {});
                            }
                          }}
                          className={`px-2.5 py-1 rounded text-[11px] font-sans font-semibold transition-all cursor-pointer ${
                            isFollowing
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-[#22C55E] text-white hover:bg-[#16A34A]'
                          }`}
                        >
                          {isFollowing ? '✓ Following' : '+ Follow'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 2. BOTTOM SECTION — WATCHLIST */}
      {/* ==================================================================== */}
      <section className="space-y-6 pt-4 border-t border-[#E3E8F1]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#14181F] flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#22C55E]" />
              <span>My Watchlist</span>
            </h2>
            <p className="text-xs text-[#5A6478]">
              Your followed stocks and equities with live quotes and sparklines.
            </p>
          </div>

          {/* Add Ticker Menu Form */}
          <form onSubmit={handleAddTicker} className="flex items-center gap-2">
            <select
              value={selectedAddSymbol}
              onChange={(e) => setSelectedAddSymbol(e.target.value)}
              className="bg-white border border-[#E3E8F1] rounded-xl px-3.5 py-2 text-xs font-mono text-[#14181F] focus:outline-none focus:border-[#22C55E] shadow-xs"
            >
              <option value="">+ Add ticker to watchlist...</option>
              {availableToAdd.map((s) => (
                <option key={s.symbol} value={s.symbol}>
                  {s.symbol} — {s.name} ({s.exchange})
                </option>
              ))}
            </select>
            <button
              type="submit"
              disabled={!selectedAddSymbol}
              className="px-4 py-2 bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </form>
        </div>

        {/* Watchlist Filter Bar */}
        {watchlistedStocks.length > 0 && (
          <div className="w-full max-w-sm">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search followed tickers..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full bg-white border border-[#E3E8F1] rounded-xl pl-9 pr-3.5 py-2 text-xs text-[#14181F] focus:outline-none focus:border-[#22C55E]"
              />
            </div>
          </div>
        )}

        {/* Watchlist Cards Grid */}
        {loadingWatchlist && filteredWatchlist.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#5A6478] animate-pulse">
            Loading watchlist quotes from server...
          </div>
        ) : filteredWatchlist.length === 0 ? (
          <div className="bg-white border border-[#E3E8F1] rounded-2xl p-12 text-center space-y-4 shadow-xs">
            <TrendingUp className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold font-serif text-[#14181F]">
              {watchlistedStocks.length === 0
                ? 'Your Watchlist is Empty'
                : 'No matching tickers found'}
            </h3>
            <p className="text-xs text-[#5A6478] max-w-md mx-auto">
              Use the "+ Add ticker to watchlist" dropdown above to start tracking equities across NGX, NYSE, and NASDAQ.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWatchlist.map((stock) => {
              const isPositive = stock.change >= 0;

              return (
                <div
                  key={stock.symbol}
                  className="bg-white border border-[#E3E8F1] rounded-2xl p-6 shadow-xs hover:shadow-md transition-all space-y-4 relative group flex flex-col justify-between"
                >
                  <div>
                    {/* Card Top Row */}
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xl text-[#14181F]">
                            {stock.symbol}
                          </span>
                          <span className="bg-[#FAFBFC] border border-[#E3E8F1] px-2 py-0.5 rounded text-[10px] font-mono text-[#5A6478]">
                            {stock.exchange}
                          </span>
                        </div>
                        <div className="text-xs text-[#5A6478] font-serif line-clamp-1 mt-0.5">
                          {stock.name}
                        </div>
                      </div>

                      <button
                        onClick={() => handleRemoveTicker(stock.symbol)}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Remove from watchlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Price & Day Change */}
                    <div className="flex items-baseline justify-between border-t border-[#E3E8F1] pt-3">
                      <div>
                        <span className="text-[10px] font-mono text-[#5A6478] block uppercase">
                          Last Price
                        </span>
                        <span className="text-2xl font-mono font-bold text-[#14181F]">
                          {stock.exchange === 'NGX' ? '₦' : '$'}
                          {stock.price.toFixed(2)}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] font-mono text-[#5A6478] block uppercase">
                          Day Change
                        </span>
                        <span
                          className={`text-sm font-mono font-bold ${
                            isPositive ? 'text-[#00C48C]' : 'text-[#FF4D4F]'
                          }`}
                        >
                          {isPositive ? '+' : ''}
                          {stock.change.toFixed(2)} ({isPositive ? '+' : ''}
                          {stock.changePercent.toFixed(2)}%)
                        </span>
                      </div>
                    </div>

                    {/* Sparkline */}
                    <div className="h-12 w-full pt-2">
                      <svg
                        className="w-full h-full overflow-visible"
                        viewBox="0 0 100 30"
                        preserveAspectRatio="none"
                      >
                        <path
                          d={`M 0,${
                            30 -
                            ((stock.sparkline[0] - Math.min(...stock.sparkline)) /
                              (Math.max(...stock.sparkline) - Math.min(...stock.sparkline) || 1)) *
                              25
                          } ${stock.sparkline
                            .map((p, idx) => {
                              const x = (idx / (stock.sparkline.length - 1)) * 100;
                              const min = Math.min(...stock.sparkline);
                              const max = Math.max(...stock.sparkline);
                              const y = 30 - ((p - min) / (max - min || 1)) * 25;
                              return `L ${x},${y}`;
                            })
                            .join(' ')}`}
                          fill="none"
                          stroke={isPositive ? '#00C48C' : '#FF4D4F'}
                          strokeWidth="2"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Card Footer Action */}
                  <div className="border-t border-[#E3E8F1] pt-3 flex items-center justify-between text-xs">
                    <span className="text-[#5A6478] font-mono text-[10px]">
                      Sector: {stock.sector}
                    </span>
                    <button
                      onClick={() => onSelectStockChart(stock)}
                      className="font-bold text-[#22C55E] hover:underline flex items-center gap-1 cursor-pointer text-xs"
                    >
                      <span>Interactive Chart</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

    </div>
  );
};
