import { TrendingUp, TrendingDown } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  change?: string;
  borderColor?: string;
  accentColor?: string;
  trend?: 'up' | 'down';
  progress?: number;
  sparkData?: number[];
}

export function StatsCard({
  title,
  value,
  change,
  trend,
  sparkData,
}: StatsCardProps) {
  const trendColor = trend === 'up' ? 'text-[#16a34a]' : trend === 'down' ? 'text-error' : '';

  const chartData = sparkData?.map((v, i) => ({ i, v }));

  return (
    <div className="group relative bg-white rounded-xl border border-[#e5e5e5] shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      {/* Left red accent */}
      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#ba100a]" />

      <div className="p-4 sm:p-5 pl-5 sm:pl-6 flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1.5 min-w-0">
          {/* Title */}
          <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-[#6b7280] leading-none">
            {title}
          </span>

          {/* Value */}
          <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#1a1a1a] font-headline leading-none mt-1">
            {value}
          </span>

          {/* Change indicator */}
          {(change || trend) && (
            <div className="flex items-center gap-1.5 mt-1">
              {trend && (
                trend === 'up'
                  ? <TrendingUp className={`w-3.5 h-3.5 ${trendColor}`} />
                  : <TrendingDown className={`w-3.5 h-3.5 ${trendColor}`} />
              )}
              {change && (
                <p className={`text-[11px] font-medium ${trendColor || 'text-[#6b7280]'}`}>
                  {change}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Sparkline */}
        {chartData && chartData.length > 0 && (
          <div className="w-20 h-10 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <Line
                  type="monotone"
                  dataKey="v"
                  stroke="#16a34a"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
