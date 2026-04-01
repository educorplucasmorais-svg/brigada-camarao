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
  const trendColor = trend === 'up' ? 'text-success' : trend === 'down' ? 'text-error' : '';
  const trendIcon = trend === 'up' ? 'trending_up' : trend === 'down' ? 'trending_down' : '';

  const chartData = sparkData?.map((v, i) => ({ i, v }));

  return (
    <div className="relative bg-surface-container-lowest p-6 sm:p-8 flex flex-col gap-4 border-l-4 border-primary-container shadow-sm hover:shadow-md transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1.5 min-w-0">
          <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
            {title}
          </span>
          <span className="text-4xl sm:text-5xl font-black tracking-tighter text-on-surface leading-none mt-1">
            {value}
          </span>
          {(change || trend) && (
            <div className="flex items-center gap-1.5 mt-2">
              {trendIcon && (
                <span className={`material-symbols-outlined text-base ${trendColor}`}>{trendIcon}</span>
              )}
              {change && (
                <p className={`text-xs font-bold ${trendColor || 'text-on-surface-variant'}`}>
                  {change}
                </p>
              )}
            </div>
          )}
        </div>

        {chartData && chartData.length > 0 && (
          <div className="w-24 h-12 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <Line
                  type="monotone"
                  dataKey="v"
                  stroke="#2e7d32"
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
