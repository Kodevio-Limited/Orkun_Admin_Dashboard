'use client';

import { useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { navItems } from './nav-config';

export function Topbar() {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const current = navItems.find(
    (item) => pathname === item.href || pathname.startsWith(item.href + '/')
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/${current?.href.split('/')[1] || ''}?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className="h-[75px] bg-white border-b border-neutral-200 flex items-center justify-between px-6 sticky top-0 z-30">
      <div>
        <h1 className="text-xl font-semibold text-neutral-800">
          {current?.label || 'Dashboard'}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="w-64 h-10 pl-10 pr-4 rounded-lg border border-neutral-200 text-sm bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
          />
        </form>

<div className="flex items-center gap-2 pl-4 border-l border-neutral-200">
          <div className="w-8 h-8 rounded-full bg-[#FD6900] flex items-center justify-center text-white text-xs font-medium">
            A
          </div>
          <ChevronDown size={16} className="text-neutral-400" />
        </div>
      </div>
    </header>
  );
}
