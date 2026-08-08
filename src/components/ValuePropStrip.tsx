import React from 'react';
import { Mail, BarChart3, ArrowRight } from 'lucide-react';

interface ValuePropStripProps {
  onOpenSubscribe: () => void;
  onOpenTerminalTease?: () => void;
}

export const ValuePropStrip: React.FC<ValuePropStripProps> = ({
  onOpenSubscribe,
  onOpenTerminalTease,
}) => {
  return (
    <div className="w-full bg-[#F0F4FA] border-b border-[#E3E8F1] py-2.5 px-4 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 text-[#14181F]">
        {/* Pitch 1: Newsletter */}
        <div className="flex items-center gap-2 text-[#14181F] font-medium">
          <span className="inline-flex items-center justify-center p-1 bg-[#1E5EFF]/10 text-[#1E5EFF] rounded shrink-0">
            <Mail className="w-3.5 h-3.5" />
          </span>
          <span>
            Get daily frontier & financial markets intelligence delivered to your inbox.{' '}
            <button
              onClick={onOpenSubscribe}
              className="text-[#1E5EFF] font-semibold hover:underline cursor-pointer inline-flex items-center gap-1"
            >
              Sign up for our newsletter
            </button>
          </span>
        </div>

        {/* Pitch 2: Dashboard/Terminal Soft Tease */}
        <div className="flex items-center gap-2 text-[#5A6478] font-medium border-t sm:border-t-0 border-[#E3E8F1] pt-1.5 sm:pt-0">
          <span className="inline-flex items-center justify-center p-1 bg-[#00D1B2]/10 text-[#00D1B2] rounded shrink-0">
            <BarChart3 className="w-3.5 h-3.5" />
          </span>
          <span>
            Looking for real-time order flow & terminal data?{' '}
            <button
              onClick={onOpenTerminalTease}
              className="text-[#14181F] font-semibold hover:text-[#1E5EFF] cursor-pointer inline-flex items-center gap-0.5 group"
            >
              Get the full picture
              <ArrowRight className="w-3.5 h-3.5 text-[#1E5EFF] group-hover:translate-x-0.5 transition-transform" />
            </button>
          </span>
        </div>
      </div>
    </div>
  );
};
