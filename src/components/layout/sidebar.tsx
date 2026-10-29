'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { navItems } from './nav-config';
import Image from 'next/image';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks';

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-[255px] bg-[#FD6900]/[0.08] flex flex-col z-40">
      <div className="px-6 pt-6 pb-4">
        <Link href="/dashboard">
          <Image src="/logo.svg" alt="Logo" width={100} height={79} className="rounded-lg" />
        </Link>
      </div>

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 h-12 px-4 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-[#FD6900] text-white'
                  : 'text-neutral-600 hover:bg-white/60'
              )}
            >
              <Icon size={20} />
              <span>{item.label}</span>
              {item.badge && (
                <span className="ml-auto bg-danger-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-[#FD6900]/20">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full h-12 px-4 rounded-lg text-sm font-medium text-neutral-600 hover:bg-white/60 transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
