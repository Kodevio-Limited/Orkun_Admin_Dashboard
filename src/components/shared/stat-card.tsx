import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardTitle } from '@/components/ui';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  change?: number;
  changeLabel?: string;
  className?: string;
}

export function StatCard({ title, value, icon, change, changeLabel, className }: StatCardProps) {
  const isPositive = change && change > 0;

  return (
    <Card className={cn('p-5', className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-neutral-500 mb-1">{title}</p>
          <p className="text-2xl font-semibold text-neutral-800">{value}</p>
          {change !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              {isPositive ? (
                <TrendingUp size={16} className="text-success-500" />
              ) : (
                <TrendingDown size={16} className="text-danger-500" />
              )}
              <span className={cn(
                'text-sm font-medium',
                isPositive ? 'text-success-600' : 'text-danger-600'
              )}>
                {Math.abs(change)}%
              </span>
              {changeLabel && (
                <span className="text-xs text-neutral-400">{changeLabel}</span>
              )}
            </div>
          )}
        </div>
        {icon && (
          <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center text-primary-500">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
