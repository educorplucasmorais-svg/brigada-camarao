import { TrendingUp, TrendingDown } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: string;
  borderColor?: string;
  accentColor?: string;
  trend?: 'up' | 'down';
  progress?: number;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  change,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  borderColor: _borderColor = 'border-primary',
  accentColor = 'bg-primary',
  trend,
  progress,
}: StatsCardProps) {
  const trendColor = trend === 'up' ? 'text-success' : trend === 'down' ? 'text-error' : '';

  return (
    <div className="stat-card card-shine card-hover bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden">
      {/* Gradient accent strip */}
      <div className={`h-1 w-full ${accentColor}`} />

      <div className="p-4 sm:p-6 lg:p-7 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black uppercase tracking-widest text-on-surface-variant leading-tight">
            {title}
          </span>
          <div className={`w-10 h-10 rounded-xl ${accentColor} bg-opacity-10 flex items-center justify-center`}>
            <Icon className={`w-5 h-5 ${accentColor === 'bg-primary' ? 'text-primary' : accentColor === 'bg-tertiary' ? 'text-tertiary' : accentColor === 'bg-secondary' ? 'text-secondary' : 'text-success'}`} />
          </div>
        </div>

        <div className="animate-count">
          <div className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter text-on-surface font-headline">
            {value}
          </div>
        </div>

        {(change || trend) && (
          <div className="flex items-center gap-2">
            {trend && (
              <span className={`flex items-center gap-0.5 ${trendColor}`}>
                {trend === 'up' ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              </span>
            )}
            {change && (
              <p className={`text-xs font-semibold ${trendColor || 'text-on-surface-variant'}`}>
                {change}
              </p>
            )}
          </div>
        )}

        {progress !== undefined && (
          <div className="mt-1">
            <div className="w-full h-2 sm:h-1.5 bg-surface-container-high rounded-full overflow-hidden">
              <div
                className="h-full rounded-full progress-bar-fill progress-gradient"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
