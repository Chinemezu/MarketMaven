import React, { useState } from 'react';
import { MOCK_STOCKS } from '../data/mockStocks';
import { StockData, User } from '../types';
import { Filter, Search, ArrowUpDown, Bookmark, Check, Plus, ExternalLink, SlidersHorizontal } from 'lucide-react';

interface ScreenerViewProps {
  currentUser: User | null;
  watchlist: string[];
  onToggleWatchlist: (symbol: string) => void;
  onOpenAuthPrompt: () => void;
  onSelectStockChart: (stock: StockData) => void;
}

export const ScreenerView: React.FC<ScreenerViewProps> = ({
  currentUser,
  watchlist,
  onToggleWatchlist,
  onOpenAuthPrompt,
  onSelectStockChart,
}) => {
  const [selectedExchange, setSelectedExchange] = useState<string>('ALL');
  const [selectedSector, setSelectedSector] = useState<string>('ALL');
  const [priceMax, setPriceMax] = useState<number>(5000);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortField, setSortField] = useState<keyof StockData>('changePercent');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  // Filter logic
  const filteredStocks = MOCK_STOCKS.filter((stock) => {
    if (selectedExchange !== 'ALL' && stock.exchange !== selectedExchange) return false;
    if (selectedSector !== 'ALL' && stock.sector !== selectedSector) return false;
    if (stock.price > priceMax) return false;
    if (
      searchQuery &&
      !stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !stock.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  // Sort logic
  const sortedStocks = [...filteredStocks].sort((a, b) => {
    const valA = a[sortField];
    const valB = b[sortField];
    if (typeof valA === 'number' && typeof valB === 'number') {
      return sortAsc ? valA - valB : valB - valA;
    }
    return 0;
  });

  const handleSort = (field: keyof StockData) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* View Header */}
      <div className="border-b border-[#E3E8F1] pb-6">
        <div className="flex items-center gap-2 text-[#22C55E] font-mono text-xs font-bold uppercase tracking-wider mb-1">
          <SlidersHorizontal className="w-4 h-4" />
          <span>Research & Analytics Tools</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-serif text-[#14181F]">
          Equity & Issuer Screener
        </h1>
        <p className="text-sm text-[#5A6478] mt-1 max-w-2xl">
          Filter equities across the Nigerian Exchange (NGX), NASDAQ, and global exchanges by sector, price threshold, and market cap.
        </p>
      </div>

      {/* Filter Control Panel */}
      <div className="bg-white border border-[#E3E8F1] rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#E3E8F1] pb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#14181F]">
            <Filter className="w-4 h-4 text-[#22C55E]" />
            <span>Active Screener Parameters</span>
          </div>
          <span className="text-xs text-[#5A6478] font-mono">
            Showing {sortedStocks.length} of {MOCK_STOCKS.length} Tracked Issuers
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search Query */}
          <div>
            <label className="block text-xs font-mono text-[#5A6478] mb-1">Ticker / Company</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search symbol (e.g. DANGCEM)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#FAFBFC] border border-[#E3E8F1] rounded-lg pl-9 pr-3 py-2 text-xs text-[#14181F] focus:outline-none focus:border-[#22C55E]"
              />
            </div>
          </div>

          {/* Exchange Filter */}
          <div>
            <label className="block text-xs font-mono text-[#5A6478] mb-1">Exchange</label>
            <select
              value={selectedExchange}
              onChange={(e) => setSelectedExchange(e.target.value)}
              className="w-full bg-[#FAFBFC] border border-[#E3E8F1] rounded-lg px-3 py-2 text-xs text-[#14181F] focus:outline-none focus:border-[#22C55E]"
            >
              <option value="ALL">All Exchanges (NGX, NASDAQ)</option>
              <option value="NGX">NGX - Nigerian Exchange</option>
              <option value="NASDAQ">NASDAQ - US Tech</option>
            </select>
          </div>

          {/* Sector Filter */}
          <div>
            <label className="block text-xs font-mono text-[#5A6478] mb-1">Sector</label>
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="w-full bg-[#FAFBFC] border border-[#E3E8F1] rounded-lg px-3 py-2 text-xs text-[#14181F] focus:outline-none focus:border-[#22C55E]"
            >
              <option value="ALL">All Sectors</option>
              <option value="Industrial">Industrial & Cement</option>
              <option value="Financial Services">Financial Services & Banking</option>
              <option value="Energy">Energy & Oil</option>
              <option value="Technology">Technology & AI</option>
              <option value="Telecom">Telecom & Communications</option>
              <option value="Consumer">Consumer Discretionary</option>
            </select>
          </div>

          {/* Max Price Slider */}
          <div>
            <label className="block text-xs font-mono text-[#5A6478] mb-1">
              Max Unit Price: <span className="font-bold text-[#14181F]">{priceMax}</span>
            </label>
            <input
              type="range"
              min="10"
              max="5000"
              step="50"
              value={priceMax}
              onChange={(e) => setPriceMax(Number(e.target.value))}
              className="w-full h-2 bg-[#E3E8F1] rounded-lg appearance-none cursor-pointer accent-[#22C55E] mt-2"
            />
          </div>
        </div>
      </div>

      {/* Screener Data Table */}
      <div className="bg-white border border-[#E3E8F1] rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#14181F]">
            <thead className="bg-[#FAFBFC] text-[#5A6478] font-mono uppercase text-[10px] border-b border-[#E3E8F1]">
              <tr>
                <th className="px-4 py-3 cursor-pointer hover:text-[#22C55E]" onClick={() => handleSort('symbol')}>
                  <div className="flex items-center gap-1">
                    <span>Symbol / Name</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-4 py-3">Exchange</th>
                <th className="px-4 py-3">Sector</th>
                <th className="px-4 py-3 cursor-pointer hover:text-[#22C55E]" onClick={() => handleSort('price')}>
                  <div className="flex items-center gap-1">
                    <span>Price</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-4 py-3 cursor-pointer hover:text-[#22C55E]" onClick={() => handleSort('changePercent')}>
                  <div className="flex items-center gap-1">
                    <span>Day Change</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-4 py-3">Market Cap</th>
                <th className="px-4 py-3">P/E Ratio</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3E8F1]">
              {sortedStocks.map((stock) => {
                const isWatchlisted = watchlist.includes(stock.symbol);
                const isPositive = stock.change >= 0;

                return (
                  <tr key={stock.symbol} className="hover:bg-[#FAFBFC] transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-[#14181F] flex items-center gap-2">
                        <span>{stock.symbol}</span>
                        <button
                          onClick={() => onSelectStockChart(stock)}
                          className="text-[#22C55E] hover:underline text-[10px] flex items-center gap-0.5 cursor-pointer font-normal"
                        >
                          <span>Chart</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </button>
                      </div>
                      <div className="text-[11px] text-[#5A6478] font-serif">{stock.name}</div>
                    </td>

                    <td className="px-4 py-3.5 font-mono">
                      <span className="bg-[#FAFBFC] border border-[#E3E8F1] px-2 py-0.5 rounded font-bold text-[10px]">
                        {stock.exchange}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-[#5A6478]">{stock.sector}</td>

                    <td className="px-4 py-3.5 font-mono font-bold">
                      {stock.exchange === 'NGX' ? '₦' : '$'}
                      {stock.price.toFixed(2)}
                    </td>

                    <td className={`px-4 py-3.5 font-mono font-bold ${isPositive ? 'text-[#00C48C]' : 'text-[#FF4D4F]'}`}>
                      {isPositive ? '+' : ''}
                      {stock.change.toFixed(2)} ({isPositive ? '+' : ''}
                      {stock.changePercent.toFixed(2)}%)
                    </td>

                    <td className="px-4 py-3.5 font-mono text-[#5A6478]">{stock.marketCap}</td>
                    <td className="px-4 py-3.5 font-mono text-[#5A6478]">{stock.peRatio}x</td>

                    <td className="px-4 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          if (!currentUser) {
                            onOpenAuthPrompt();
                          } else {
                            onToggleWatchlist(stock.symbol);
                          }
                        }}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-md transition-colors cursor-pointer ${
                          isWatchlisted
                            ? 'bg-[#00C48C]/10 border border-[#00C48C]/30 text-[#00C48C]'
                            : 'bg-[#22C55E] text-white hover:bg-[#16A34A]'
                        }`}
                      >
                        {isWatchlisted ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>Watchlisted</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3 h-3" />
                            <span>Add Watchlist</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
