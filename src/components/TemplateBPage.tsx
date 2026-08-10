import React, { useState } from 'react';
import { DollarSign, ArrowLeftRight, TrendingUp, AlertCircle, Info, RefreshCw } from 'lucide-react';

interface TemplateBPageProps {
  title: string;
  subtitle?: string;
  type?: 'currencies' | 'rates';
}

export const TemplateBPage: React.FC<TemplateBPageProps> = ({ title, subtitle, type = 'currencies' }) => {
  const [fromAmount, setFromAmount] = useState<number>(1000);
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('NGN');

  // Rates with dashed underline indicators
  const rates: Record<string, number> = {
    'USD-NGN': 1524.5,
    'EUR-NGN': 1658.2,
    'GBP-NGN': 1980.4,
    'USD-EUR': 0.919,
    'USD-GBP': 0.77,
    'EUR-USD': 1.088,
    'GBP-USD': 1.298,
    'USD-ZAR': 18.15,
    'USD-KES': 129.2,
  };

  const getRate = (from: string, to: string): number => {
    if (from === to) return 1.0;
    const key = `${from}-${to}`;
    if (rates[key]) return rates[key];
    const reverseKey = `${to}-${from}`;
    if (rates[reverseKey]) return 1 / rates[reverseKey];
    return 1.0;
  };

  const currentRate = getRate(fromCurrency, toCurrency);
  const convertedAmount = (fromAmount * currentRate).toFixed(2);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Category Header */}
      <div className="border-b border-[#E3E8F1] pb-6">
        <div className="flex items-center gap-2 text-[#22C55E] font-mono text-xs font-bold uppercase tracking-wider mb-1">
          <DollarSign className="w-4 h-4" />
          <span>Market Data & FX Rate Desk</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-serif text-[#14181F]">{title}</h1>
        <p className="text-sm text-[#5A6478] mt-1 max-w-2xl">
          {subtitle || `Sovereign rates, central bank benchmarks, and cross-currency exchange rate monitors.`}
        </p>

        {/* Convention Banner */}
        <div className="mt-4 bg-[#22C55E]/5 border border-[#22C55E]/20 rounded-lg p-3 text-xs text-[#14181F] flex items-center gap-2">
          <Info className="w-4 h-4 text-[#22C55E] shrink-0" />
          <span>
            Note: Figures underlined with a <span className="border-b border-dashed border-[#14181F] font-mono px-1 font-bold">dashed style</span> represent estimated market benchmark values subject to final settlement confirmation.
          </span>
        </div>
      </div>

      {/* Interactive Quick Converter */}
      <div className="bg-[#0A0F1A] text-white rounded-xl p-6 shadow-xl border border-white/10 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h2 className="text-base font-bold font-serif flex items-center gap-2">
            <ArrowLeftRight className="w-4 h-4 text-[#22C55E]" />
            <span>Market Benchmark Exchange Rate Calculator</span>
          </h2>
          <span className="text-[11px] font-mono text-slate-400">NAFEM & Interbank Spot Feed</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">Amount</label>
            <input
              type="number"
              value={fromAmount}
              onChange={(e) => setFromAmount(Number(e.target.value))}
              className="w-full bg-[#141A29] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-[#22C55E]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">From Currency</label>
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="w-full bg-[#141A29] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-[#22C55E]"
            >
              <option value="USD">USD - US Dollar</option>
              <option value="NGN">NGN - Nigerian Naira</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="ZAR">ZAR - South African Rand</option>
              <option value="KES">KES - Kenyan Shilling</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">To Currency</label>
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="w-full bg-[#141A29] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-[#22C55E]"
            >
              <option value="NGN">NGN - Nigerian Naira</option>
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="ZAR">ZAR - South African Rand</option>
              <option value="KES">KES - Kenyan Shilling</option>
            </select>
          </div>
        </div>

        {/* Calculation Result */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between bg-[#141A29] p-4 rounded-lg border border-white/5">
          <div className="text-xs text-slate-400">
            Estimated Spot Rate: 1 {fromCurrency} ={' '}
            <span className="border-b border-dashed border-white font-mono font-bold text-white">
              {currentRate.toFixed(4)}
            </span>{' '}
            {toCurrency}
          </div>
          <div className="text-right mt-2 sm:mt-0">
            <span className="text-xs text-slate-400 block">Converted Output</span>
            <span className="text-2xl font-mono font-bold text-[#00D1B2]">
              <span className="border-b border-dashed border-[#00D1B2]">{convertedAmount}</span> {toCurrency}
            </span>
          </div>
        </div>
      </div>

      {/* Main Rates & Benchmarks Data Table */}
      <div className="bg-white border border-[#E3E8F1] rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 bg-[#FAFBFC] border-b border-[#E3E8F1] flex items-center justify-between">
          <h3 className="font-bold font-serif text-base text-[#14181F]">
            {type === 'rates' ? 'Sovereign Debt & Central Bank Benchmarks' : 'Foreign Exchange Spot & Forward Rates'}
          </h3>
          <span className="text-xs text-[#5A6478] font-mono">Updated 15m ago</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#14181F]">
            <thead className="bg-[#FAFBFC] text-[#5A6478] font-mono uppercase text-[10px] border-b border-[#E3E8F1]">
              <tr>
                <th className="px-4 py-3">Market / Asset Pair</th>
                <th className="px-4 py-3">Benchmark Rate</th>
                <th className="px-4 py-3">Day Change</th>
                <th className="px-4 py-3">1-Year Range</th>
                <th className="px-4 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3E8F1]">
              {[
                { pair: 'USD/NGN (NAFEM)', rate: '1,524.50', change: '-2.30 (-0.15%)', range: '1,200.00 - 1,680.00', pos: false },
                { pair: 'EUR/NGN', rate: '1,658.20', change: '+5.10 (+0.31%)', range: '1,310.00 - 1,790.00', pos: true },
                { pair: 'GBP/NGN', rate: '1,980.40', change: '+8.40 (+0.43%)', range: '1,540.00 - 2,100.00', pos: true },
                { pair: 'EUR/USD', rate: '1.0872', change: '+0.0005 (+0.05%)', range: '1.0450 - 1.1200', pos: true },
                { pair: 'GBP/USD', rate: '1.2980', change: '+0.0021 (+0.16%)', range: '1.2300 - 1.3400', pos: true },
                { pair: 'USD/ZAR', rate: '18.1500', change: '-0.0600 (-0.31%)', range: '17.2000 - 19.8000', pos: false },
                { pair: 'USD/KES', rate: '129.2000', change: '+0.1000 (+0.08%)', range: '125.0000 - 160.0000', pos: true },
                { pair: 'CBN Monetary Policy Rate (MPR)', rate: '26.75%', change: '+50 bps', range: '18.75% - 26.75%', pos: true },
                { pair: 'Nigeria 10Y Sovereign Bond Yield', rate: '19.42%', change: '-12 bps', range: '14.20% - 20.80%', pos: false },
                { pair: 'U.S. 10Y Treasury Note Yield', rate: '4.22%', change: '+3 bps', range: '3.80% - 5.00%', pos: true },
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-[#FAFBFC] transition-colors">
                  <td className="px-4 py-3.5 font-bold">{row.pair}</td>
                  <td className="px-4 py-3.5">
                    {/* Dashed underline per prompt convention */}
                    <span className="border-b border-dashed border-[#14181F] font-mono font-bold">
                      {row.rate}
                    </span>
                  </td>
                  <td className={`px-4 py-3.5 font-mono font-semibold ${row.pos ? 'text-[#00C48C]' : 'text-[#FF4D4F]'}`}>
                    {row.change}
                  </td>
                  <td className="px-4 py-3.5 font-mono text-[#5A6478]">
                    <span className="border-b border-dashed border-slate-300">{row.range}</span>
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono text-[10px]">
                    <span className="bg-[#00D1B2]/10 text-[#00D1B2] border border-[#00D1B2]/30 px-2 py-0.5 rounded font-bold">
                      VERIFIED
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
