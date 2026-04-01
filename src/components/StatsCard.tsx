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
  const trendColor = trend === 'up' ? '#2e7d32' : trend === 'down' ? '#ba1a1a' : '#6b7280';
  const trendText = trend === 'up' ? 'text-[#2e7d32]' : trend === 'down' ? 'text-[#ba1a1a]' : 'text-[#6b7280]';
  const trendIcon = trend === 'up' ? 'trending_up' : trend === 'down' ? 'trending_down' : '';

  const chartData = sparkData?.map((v, i) => ({ i, v }));

  return (
    <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-1 min-w-0 flex-1">
          <span className="text-[10px] font-black uppercase tracking-[0.15em] text-[#6b7280]">
            {title}
          </span>
          <span className="text-3xl font-black tracking-tight text-[#111827] leading-none mt-0.5">
            {value}
          </span>
          {(change || trend) && (
            <div className={`flex items-center gap-1 mt-1 ${trendText}`}>
              {trendIcon && (
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>{trendIcon}</span>
              )}
              {change && (
                <p className="text-[11px] font-bold">{change}</p>
              )}
            </div>
          )}
        </div>

        {chartData && chartData.length > 0 && (
          <div className="w-20 h-10 shrink-0 mt-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <Line
                  type="monotone"
                  dataKey="v"
                  stroke={trendColor}
                  strokeWidth={1.8}
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
