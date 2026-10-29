import {
  LayoutDashboard,
  Megaphone,
  CreditCard,
  Users,
  ArrowLeftRight,
  ScrollText,
  Settings,
  LayoutTemplate,
  FileText,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
}

export const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Ad Campaigns', href: '/ad-campaigns', icon: Megaphone },
  { label: 'Pricing & Credits', href: '/pricing-credits', icon: CreditCard },
  { label: 'Transactions', href: '/transactions', icon: ArrowLeftRight },
  { label: 'User Management', href: '/user-management', icon: Users },
  { label: 'System Logs', href: '/system-logs', icon: ScrollText },
  { label: 'Templates', href: '/templates', icon: LayoutTemplate },
  { label: 'Prompt Management', href: '/prompt-management', icon: FileText },
  { label: 'Moderation & Safety', href: '/moderation-safety', icon: ShieldCheck },
  { label: 'Settings', href: '/settings', icon: Settings },
];
