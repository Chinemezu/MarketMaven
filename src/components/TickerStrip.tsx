import React from 'react';
import { TickerItem } from '../types';
import { INITIAL_TICKER_ITEMS } from '../data/mockTicker';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface TickerStripProps {
  items?: TickerItem[];
  onItemClick?: (item: TickerItem) => void;
}

export const TickerStrip: React.FC<TickerStripProps> = ({
  items = INITIAL_TICKER_ITEMS,
  onItemClick,
}) => {
  // Duplicate array to ensure smooth continuous marquee loop
  const duplicatedItems = [...items, ...items];

  return (
    <div className="w-full bg-[#070A12] border-b border-[#1A2030] text-xs text-slate-300 overflow-hidden py-1.5 select-none relative z-20">
      <div className="animate-ticker">
        {duplicatedItems.map((item, idx) => (
          <div
            key={`${item.id}-${idx}`}
            onClick={() => onItemClick && onItemClick(item)}
            className="flex items-center gap-2 px-4 border-r border-[#1E2638] shrink-0 cursor-pointer hover:bg-[#121828] transition-colors py-0.5"
          >
            {/* Colored status dot */}
            <span
              className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                item.isPositive ? 'bg-[#00C48C]' : 'bg-[#FF4D4F]'
              }`}
            />

            {/* Symbol name */}
            <span className="font-semibold text-white tracking-wider text-[11px] uppercase">
              {item.symbol}
            </span>

            {/* Price with thin dashed underline on the specific number */}
            <span className="font-num text-slate-200 border-b border-dashed border-slate-500/80 pb-[1px] tracking-tight">
              {item.price}
            </span>

            {/* Change percentage with icon */}
            <span
              className={`font-num flex items-center gap-0.5 font-medium border-b border-dashed ${
                item.isPositive
                  ? 'text-[#00C48C] border-[#00C48C]/60'
                  : 'text-[#FF4D4F] border-[#FF4D4F]/60'
              } pb-[1px]`}
            >
              {item.isPositive ? (
                <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
              ) : (
                <ArrowDownRight className="w-3 h-3 stroke-[2.5]" />
              )}
              {item.changePercent}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
