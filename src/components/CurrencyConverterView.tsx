import React, { useState } from 'react';
import { ArrowLeftRight, DollarSign, Info, Globe, ShieldCheck, RefreshCw } from 'lucide-react';

export const CurrencyConverterView: React.FC = () => {
  const [amount, setAmount] = useState<number>(5000);
  const [baseCurrency, setBaseCurrency] = useState<string>('USD');
  const [targetCurrency, setTargetCurrency] = useState<string>('NGN');

  const exchangeRates: Record<string, number> = {
    'USD-NGN': 1524.5,
    'EUR-NGN': 1658.2,
    'GBP-NGN': 1980.4,
    'CAD-NGN': 1112.8,
    'ZAR-NGN': 83.9,
    'KES-NGN': 11.8,
    'JPY-NGN': 10.2,
    'USD-EUR': 0.919,
    'USD-GBP': 0.77,
    'USD-CAD': 1.37,
    'USD-ZAR': 18.15,
    'USD-KES': 129.2,
    'USD-JPY': 149.8,
  };

  const getRate = (from: string, to: string): number => {
    if (from === to) return 1.0;
    const direct = `${from}-${to}`;
    if (exchangeRates[direct]) return exchangeRates[direct];
    const reverse = `${to}-${from}`;
    if (exchangeRates[reverse]) return 1 / exchangeRates[reverse];

    // Cross calculation through USD
    const fromToUSD = exchangeRates[`USD-${from}`] ? 1 / exchangeRates[`USD-${from}`] : (exchangeRates[`${from}-USD`] || 1);
    const usdToTarget = exchangeRates[`USD-${to}`] || (exchangeRates[`${to}-USD`] ? 1 / exchangeRates[`${to}-USD`] : 1);
    return fromToUSD * usdToTarget;
  };

  const rate = getRate(baseCurrency, targetCurrency);
  const result = (amount * rate).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-[#E3E8F1] pb-6">
        <div className="flex items-center gap-2 text-[#1E5EFF] font-mono text-xs font-bold uppercase tracking-wider mb-1">
          <ArrowLeftRight className="w-4 h-4" />
          <span>Research Tools • Foreign Exchange Desk</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-serif text-[#14181F]">
          Institutional Currency Converter
        </h1>
        <p className="text-sm text-[#5A6478] mt-1 max-w-2xl">
          Convert cross-rates between African currencies (NGN, ZAR, KES) and major international pairs (USD, EUR, GBP, JPY) using real-time interbank spot rates.
        </p>

        <div className="mt-4 bg-[#1E5EFF]/5 border border-[#1E5EFF]/20 rounded-lg p-3 text-xs text-[#14181F] flex items-center gap-2">
          <Info className="w-4 h-4 text-[#1E5EFF] shrink-0" />
          <span>
            Dashed underline indicators (<span className="border-b border-dashed border-[#14181F] font-mono px-1 font-bold">1,524.50</span>) denote benchmark spot rates subject to central bank settlement windows.
          </span>
        </div>
      </div>

      {/* Main Converter Card */}
      <div className="bg-[#0A0F1A] text-white rounded-2xl p-6 sm:p-8 shadow-2xl border border-white/10 space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2 font-serif font-bold text-lg">
            <Globe className="w-5 h-5 text-[#22C55E]" />
            <span>Spot Rate Calculation Matrix</span>
          </div>
          <span className="text-xs font-mono text-slate-400">Source: NAFEM / CBN / Interbank</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Amount Input */}
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-2">Transaction Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full bg-[#141A29] border border-white/10 rounded-xl px-4 py-3 text-lg font-mono font-bold text-white focus:outline-none focus:border-[#1E5EFF]"
            />
          </div>

          {/* From Currency */}
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-2">Source Currency</label>
            <select
              value={baseCurrency}
              onChange={(e) => setBaseCurrency(e.target.value)}
              className="w-full bg-[#141A29] border border-white/10 rounded-xl px-4 py-3 text-sm font-mono font-bold text-white focus:outline-none focus:border-[#1E5EFF]"
            >
              <option value="USD">USD - United States Dollar</option>
              <option value="NGN">NGN - Nigerian Naira</option>
              <option value="EUR">EUR - Euro Zone</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="ZAR">ZAR - South African Rand</option>
              <option value="KES">KES - Kenyan Shilling</option>
              <option value="CAD">CAD - Canadian Dollar</option>
              <option value="JPY">JPY - Japanese Yen</option>
            </select>
          </div>

          {/* To Currency */}
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-2">Target Currency</label>
            <select
              value={targetCurrency}
              onChange={(e) => setTargetCurrency(e.target.value)}
              className="w-full bg-[#141A29] border border-white/10 rounded-xl px-4 py-3 text-sm font-mono font-bold text-white focus:outline-none focus:border-[#1E5EFF]"
            >
              <option value="NGN">NGN - Nigerian Naira</option>
              <option value="USD">USD - United States Dollar</option>
              <option value="EUR">EUR - Euro Zone</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="ZAR">ZAR - South African Rand</option>
              <option value="KES">KES - Kenyan Shilling</option>
              <option value="CAD">CAD - Canadian Dollar</option>
              <option value="JPY">JPY - Japanese Yen</option>
            </select>
          </div>
        </div>

        {/* Result Output Display */}
        <div className="bg-[#141A29] p-6 rounded-xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs text-slate-400 font-mono">Spot Rate Indicator</div>
            <div className="text-sm font-mono text-slate-200 mt-0.5">
              1 {baseCurrency} ={' '}
              <span className="border-b border-dashed border-white font-bold text-white">
                {rate.toFixed(4)}
              </span>{' '}
              {targetCurrency}
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs text-slate-400 font-mono">Calculated Output Amount</div>
            <div className="text-3xl font-mono font-bold text-[#00D1B2] mt-0.5">
              <span className="border-b border-dashed border-[#00D1B2]">{result}</span>{' '}
              <span className="text-lg">{targetCurrency}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cross-Rates Table */}
      <div className="bg-white border border-[#E3E8F1] rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 bg-[#FAFBFC] border-b border-[#E3E8F1] flex items-center justify-between">
          <h3 className="font-serif font-bold text-base text-[#14181F]">
            Major FX Pair Cross-Matrix
          </h3>
          <span className="text-xs text-[#5A6478] font-mono">Live Interbank Feeds</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#14181F]">
            <thead className="bg-[#FAFBFC] text-[#5A6478] font-mono uppercase text-[10px] border-b border-[#E3E8F1]">
              <tr>
                <th className="px-4 py-3">Currency Pair</th>
                <th className="px-4 py-3">Spot Rate</th>
                <th className="px-4 py-3">Bid / Ask</th>
                <th className="px-4 py-3">Day Range</th>
                <th className="px-4 py-3 text-right">Settlement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3E8F1]">
              {[
                { pair: 'USD / NGN', rate: '1,524.50', bidAsk: '1,523.00 / 1,526.00', range: '1,518.00 - 1,532.00' },
                { pair: 'EUR / NGN', rate: '1,658.20', bidAsk: '1,656.50 / 1,660.00', range: '1,650.00 - 1,668.00' },
                { pair: 'GBP / NGN', rate: '1,980.40', bidAsk: '1,978.00 / 1,983.00', range: '1,970.00 - 1,992.00' },
                { pair: 'USD / ZAR', rate: '18.1500', bidAsk: '18.1420 / 18.1580', range: '18.0500 - 18.3200' },
                { pair: 'USD / KES', rate: '129.2000', bidAsk: '129.1000 / 129.3000', range: '128.8000 - 130.1000' },
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-[#FAFBFC] transition-colors">
                  <td className="px-4 py-3.5 font-bold">{row.pair}</td>
                  <td className="px-4 py-3.5">
                    <span className="border-b border-dashed border-[#14181F] font-mono font-bold">
                      {row.rate}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 font-mono text-[#5A6478]">{row.bidAsk}</td>
                  <td className="px-4 py-3.5 font-mono text-[#5A6478]">
                    <span className="border-b border-dashed border-slate-300">{row.range}</span>
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono text-[10px] text-[#00C48C] font-bold">
                    T+1 SETTLEMENT
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
