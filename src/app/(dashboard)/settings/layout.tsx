'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const settingsNav = [
  { label: 'General', href: '/settings' },
  { label: 'Password', href: '/settings/password' },
  { label: 'Privacy Policy', href: '/settings/privacy-policy' },
  { label: 'Terms & Conditions', href: '/settings/terms-conditions' },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-800 mb-6">Settings</h1>

      <div className="bg-white rounded-xl border border-neutral-200">
        <div className="flex border-b border-neutral-200">
          {settingsNav.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'px-6 py-3 text-sm font-medium border-b-2 transition-colors',
                  isActive
                    ? 'border-primary-500 text-primary-500'
                    : 'border-transparent text-neutral-500 hover:text-neutral-700'
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
