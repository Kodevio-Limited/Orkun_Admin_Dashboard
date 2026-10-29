import { Badge, BadgeVariant } from '@/components/ui';

const statusVariantMap: Record<string, BadgeVariant> = {
  active: 'success',
  completed: 'success',
  pending: 'warning',
  paused: 'warning',
  draft: 'default',
  cancelled: 'danger',
  failed: 'danger',
  inactive: 'default',
  success: 'success',
  error: 'danger',
  warning: 'warning',
  info: 'info',
};

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const variant = statusVariantMap[status.toLowerCase()] || 'default';
  return <Badge variant={variant}>{status}</Badge>;
}
