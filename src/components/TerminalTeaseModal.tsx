import React from 'react';
import { X, BarChart3, LineChart, Activity, Cpu, ArrowRight } from 'lucide-react';

interface TerminalTeaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TerminalTeaseModal: React.FC<TerminalTeaseModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className="bg-[#070A12] text-white rounded-2xl max-w-xl w-full shadow-2xl border border-[#1A2234] p-6 sm:p-8 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-[#151D2F]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1E5EFF]/20 border border-[#1E5EFF]/40 text-[#00D1B2] text-xs font-bold rounded-full uppercase tracking-wider mb-3">
          <BarChart3 className="w-3.5 h-3.5" /> MarketMaven Terminal Platform
        </div>

        <h3 className="font-serif text-2xl font-bold text-white mb-2">
          Institutional Analytics & Flow Engine
        </h3>

        <p className="text-xs text-slate-300 leading-relaxed mb-6">
          Beyond our editorial news coverage lies MarketMaven’s full quantitative suite — providing institutional traders and fund managers with streaming level-2 order flow, sovereign yield curves, and NAFEM FX market depth.
        </p>

        {/* Feature Grid Preview */}
        <div className="grid grid-cols-2 gap-3 mb-6 text-xs">
          <div className="p-3 bg-[#111726] border border-[#1F293D] rounded-lg space-y-1">
            <div className="flex items-center gap-2 font-bold text-[#1E5EFF]">
              <Activity className="w-4 h-4" /> Real-Time Order Flow
            </div>
            <p className="text-slate-400 text-[11px]">
              Tick-level order matching telemetry across African & EM exchanges.
            </p>
          </div>

          <div className="p-3 bg-[#111726] border border-[#1F293D] rounded-lg space-y-1">
            <div className="flex items-center gap-2 font-bold text-[#00C48C]">
              <LineChart className="w-4 h-4" /> Yield Curve Analytics
            </div>
            <p className="text-slate-400 text-[11px]">
              Interactive sovereign debt matrix & real-yield spread comparison.
            </p>
          </div>

          <div className="p-3 bg-[#111726] border border-[#1F293D] rounded-lg space-y-1">
            <div className="flex items-center gap-2 font-bold text-[#00D1B2]">
              <Cpu className="w-4 h-4" /> Central Bank Tracker
            </div>
            <p className="text-slate-400 text-[11px]">
              NLP policy hawkishness scores & reserve injection alerts.
            </p>
          </div>

          <div className="p-3 bg-[#111726] border border-[#1F293D] rounded-lg space-y-1">
            <div className="flex items-center gap-2 font-bold text-amber-400">
              <BarChart3 className="w-4 h-4" /> FX Liquidity Depth
            </div>
            <p className="text-slate-400 text-[11px]">
              Sub-second interbank quotes & parallel window liquidity indicators.
            </p>
          </div>
        </div>

        <div className="p-4 bg-[#151D2F] border border-[#263148] rounded-xl flex items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-white block">
              MarketMaven Analytics Dashboard
            </span>
            <span className="text-[11px] text-slate-400">
              Request access to institutional terminal trial
            </span>
          </div>

          <button
            onClick={() => {
              alert('MarketMaven Terminal demo request received! An account executive will contact your firm.');
              onClose();
            }}
            className="px-4 py-2 bg-[#1E5EFF] hover:bg-blue-600 text-white font-bold text-xs rounded-lg transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <span>Request Access</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
