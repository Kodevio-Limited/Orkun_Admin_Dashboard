'use client';

import { DollarSign, TrendingUp, Users, MousePointerClick } from 'lucide-react';
import { StatCard } from '@/components/shared/stat-card';
import { Card, CardHeader, CardTitle, Badge } from '@/components/ui';
import { useUsers } from '@/features/users/hooks';
import { getInitials, formatDate } from '@/lib/utils';

const stats = [
  { title: 'Total Revenue', value: '$124,500', icon: <DollarSign size={20} />, change: 12.5, changeLabel: 'vs last month' },
  { title: 'Active Campaigns', value: '24', icon: <TrendingUp size={20} />, change: 8.2, changeLabel: 'vs last month' },
  { title: 'Total Users', value: '1,482', icon: <Users size={20} />, change: 3.1, changeLabel: 'vs last month' },
  { title: 'Conversion Rate', value: '3.24%', icon: <MousePointerClick size={20} />, change: -0.8, changeLabel: 'vs last month' },
];

const chartData = [
  { month: 'Jan', revenue: 18500, users: 5.2 },
  { month: 'Feb', revenue: 22300, users: 8.7 },
  { month: 'Mar', revenue: 19800, users: 3.1 },
  { month: 'Apr', revenue: 25800, users: 12.4 },
  { month: 'May', revenue: 31200, users: 15.8 },
  { month: 'Jun', revenue: 28900, users: 9.5 },
  { month: 'Jul', revenue: 34600, users: 18.2 },
  { month: 'Aug', revenue: 32100, users: 11.3 },
  { month: 'Sep', revenue: 36800, users: 14.7 },
  { month: 'Oct', revenue: 35400, users: 10.1 },
  { month: 'Nov', revenue: 41200, users: 22.6 },
  { month: 'Dec', revenue: 38900, users: 19.4 },
];

const maxRevenue = Math.max(...chartData.map((d) => d.revenue));

const statusVariant: Record<string, 'success' | 'danger' | 'warning'> = {
  active: 'success',
  deleted: 'danger',
  deactivated: 'warning',
};

export default function DashboardPage() {
  const { data: users } = useUsers({ page: 1, pageSize: 5 });

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <StatCard key={s.title} {...s} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <div className="h-64 px-4 pb-4 flex items-end gap-1.5">
            {chartData.map((d) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                <span className="text-[10px] text-neutral-400 font-medium">
                  ${(d.revenue / 1000).toFixed(0)}k
                </span>
                <div
                  className="w-full bg-[#FD6900] rounded-t-sm transition-all duration-500 hover:opacity-80"
                  style={{ height: `${(d.revenue / maxRevenue) * 100}%`, minHeight: '4px' }}
                />
                <span className="text-[10px] text-neutral-500">{d.month}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
          </CardHeader>
          <div className="h-64 px-4 pb-4">
            <div className="flex items-end gap-1.5 h-full">
              {chartData.map((d) => (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-1 justify-end">
                  <span className="text-[10px] text-neutral-400 font-medium">
                    {d.users > 0 ? '+' : ''}{d.users}%
                  </span>
                  <div
                    className="w-full bg-success-500 rounded-t-sm transition-all duration-500 hover:opacity-80"
                    style={{ height: `${(d.users / Math.max(...chartData.map((x) => x.users))) * 100}%`, minHeight: '4px' }}
                  />
                  <span className="text-[10px] text-neutral-500">{d.month}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Users</CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">User</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Plan</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Images Generated</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Last Active</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Joined</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-neutral-100">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#FD6900] flex items-center justify-center text-white text-xs font-medium">
                        {getInitials(user.name)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-neutral-800">{user.name}</p>
                        <p className="text-xs text-neutral-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-700">{user.plan}</td>
                  <td className="px-4 py-3 text-sm text-neutral-700">{user.imageGenerated.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-neutral-500">{formatDate(user.lastActive)}</td>
                  <td className="px-4 py-3 text-sm text-neutral-500">{formatDate(user.joinedAt)}</td>
                  <td className="px-4 py-3">
                    <Badge variant={statusVariant[user.status]}>{user.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
