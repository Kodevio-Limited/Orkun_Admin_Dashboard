'use client';

import { PageHeader } from '@/components/shared/page-header';
import { Card, CardHeader, CardTitle } from '@/components/ui';
import { StatCard } from '@/components/shared/stat-card';
import { useCreditTransactions } from '@/features/pricing/hooks';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui';
import { CreditCard, TrendingUp } from 'lucide-react';

export default function CreditsPage() {
  const { data: transactions, loading } = useCreditTransactions();

  const totalCredits = transactions
    .filter((t) => t.type === 'purchase' || t.type === 'bonus')
    .reduce((sum, t) => sum + t.credits, 0);
  const usedCredits = transactions
    .filter((t) => t.type === 'usage')
    .reduce((sum, t) => sum + Math.abs(t.credits), 0);

  return (
    <div>
      <PageHeader title="Credit Transactions" description="Track credit purchases and usage" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard title="Total Purchased" value={totalCredits.toLocaleString()} icon={<CreditCard size={20} />} />
        <StatCard title="Credits Used" value={usedCredits.toLocaleString()} icon={<TrendingUp size={20} />} />
        <StatCard title="Current Balance" value={(totalCredits - usedCredits).toLocaleString()} icon={<CreditCard size={20} />} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        {loading ? (
          <div className="p-8 text-center text-neutral-400">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">User</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Credits</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Balance</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Description</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t.id} className="border-b border-neutral-100">
                    <td className="px-4 py-3 text-sm text-neutral-700">{formatDate(t.createdAt)}</td>
                    <td className="px-4 py-3 text-sm text-neutral-700">{t.userName}</td>
                    <td className="px-4 py-3"><Badge variant={t.type === 'usage' ? 'warning' : 'success'}>{t.type}</Badge></td>
                    <td className={`px-4 py-3 text-sm font-medium ${t.credits > 0 ? 'text-success-600' : 'text-danger-600'}`}>
                      {t.credits > 0 ? '+' : ''}{t.credits}
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-700">{t.balance.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-neutral-500">{t.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
