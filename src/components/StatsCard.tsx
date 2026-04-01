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
  const iconColor = accentColor === 'bg-primary' ? 'text-primary' : accentColor === 'bg-tertiary' ? 'text-tertiary' : accentColor === 'bg-secondary' ? 'text-secondary' : 'text-success';
  const iconBg = accentColor === 'bg-primary' ? 'bg-primary/8' : accentColor === 'bg-tertiary' ? 'bg-tertiary/8' : accentColor === 'bg-secondary' ? 'bg-secondary/8' : 'bg-success/8';

  return (
    <div className="group relative bg-surface-container-lowest rounded-2xl border border-outline/8 shadow-sm hover:shadow-md transition-all duration-300">
      {/* Subtle left accent bar */}
      <div className={`absolute left-0 top-3 bottom-3 w-[3px] rounded-full ${accentColor} opacity-60 group-hover:opacity-100 transition-opacity`} />

      <div className="p-4 sm:p-5 pl-5 sm:pl-6 flex flex-col gap-2.5">
        {/* Header row */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant/70 leading-none">
            {title}
          </span>
          <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg ${iconBg} flex items-center justify-center`}>
            <Icon className={`w-4 h-4 ${iconColor}`} />
          </div>
        </div>

        {/* Value */}
        <div className="flex items-baseline gap-2">
          <span className="text-xl sm:text-2xl font-bold tracking-tight text-on-surface font-headline leading-none">
            {value}
          </span>
        </div>

        {/* Change indicator */}
        {(change || trend) && (
          <div className="flex items-center gap-1.5">
            {trend && (
              <span className={`flex items-center justify-center w-5 h-5 rounded-full ${trend === 'up' ? 'bg-success/10' : 'bg-error/10'}`}>
                {trend === 'up' ? <TrendingUp className={`w-3 h-3 ${trendColor}`} /> : <TrendingDown className={`w-3 h-3 ${trendColor}`} />}
              </span>
            )}
            {change && (
              <p className={`text-[11px] font-medium ${trendColor || 'text-on-surface-variant/60'}`}>
                {change}
              </p>
            )}
          </div>
        )}

        {/* Progress bar */}
        {progress !== undefined && (
          <div className="mt-0.5">
            <div className="w-full h-1.5 bg-outline/8 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out progress-gradient"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
