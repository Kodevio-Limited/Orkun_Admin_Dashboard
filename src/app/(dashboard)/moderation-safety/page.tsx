'use client';

import { useState } from 'react';
import { Button, Input, Select } from '@/components/ui';
import { PageHeader } from '@/components/shared/page-header';
import { DataTable } from '@/components/shared/data-table/data-table';
import { Modal } from '@/components/ui/modal';
import { StatCard } from '@/components/shared/stat-card';
import { useModeration, useModerationStats } from '@/features/moderation/hooks';
import { moderationService } from '@/features/moderation/service';
import { getModerationTableConfig } from '@/features/moderation/table-config';
import { ScanResult } from '@/features/moderation/types';
import { ShieldCheck, ImageIcon, CheckCircle, XCircle, AlertTriangle, Clock, Settings } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/components/ui/toast';

export default function ModerationSafetyPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const { data, total, loading, refetch } = useModeration({ page, pageSize: 10, search, status: statusFilter });
  const { stats } = useModerationStats();
  const { addToast } = useToast();

  const [detailModal, setDetailModal] = useState<ScanResult | null>(null);
  const [notes, setNotes] = useState('');

  const config = getModerationTableConfig(data, total, page, 10, setPage);

  config.rowActions = (row) => {
    const r = row as unknown as ScanResult;
    return [
      { label: 'View', onClick: () => { setDetailModal(r); setNotes(r.moderatorNotes); } },
      { label: 'Approve', onClick: async () => { await moderationService.update(r.id, { status: 'approved', reason: '' }); addToast('Image approved', 'success'); refetch(); } },
      { label: 'Reject', onClick: async () => { await moderationService.update(r.id, { status: 'rejected', reason: 'Rejected by moderator' }); addToast('Image rejected', 'success'); refetch(); } },
      { label: 'Flag', onClick: async () => { await moderationService.update(r.id, { status: 'flagged', reason: 'Flagged by moderator' }); addToast('Image flagged', 'success'); refetch(); } },
      { label: 'Delete', onClick: async () => { await moderationService.remove(r.id); addToast('Image removed', 'success'); refetch(); }, variant: 'danger' as const },
    ];
  };

  const handleStatusAction = async (id: string, status: ScanResult['status'], reason?: string) => {
    await moderationService.update(id, { status, reason: reason || '' });
    addToast(`Image ${status}`, 'success');
    setDetailModal(null);
    refetch();
  };

  return (
    <div>
      <PageHeader title="Moderation & Safety" description="Manage image scanning and AI safety">
        <Link href="/moderation-safety/settings">
          <Button variant="outline"><Settings size={18} /> Safety Settings</Button>
        </Link>
      </PageHeader>

      <div className="grid grid-cols-5 gap-4 mb-6">
        <StatCard title="Scanned Today" value={stats.scannedToday} icon={<ShieldCheck size={20} />} />
        <StatCard title="Approved" value={stats.approved} icon={<CheckCircle size={20} className="text-success-500" />} className="!border-success-200" />
        <StatCard title="Rejected" value={stats.rejected} icon={<XCircle size={20} className="text-danger-500" />} className="!border-danger-200" />
        <StatCard title="Flagged" value={stats.flagged} icon={<AlertTriangle size={20} className="text-warning-500" />} className="!border-warning-200" />
        <StatCard title="Pending Review" value={stats.pending} icon={<Clock size={20} className="text-info-500" />} className="!border-info-200" />
      </div>

      <DataTable
        {...config}
        isLoading={loading}
        toolbar={{
          searchPlaceholder: 'Search by user or scan result...',
          onSearch: (q) => { setSearch(q); setPage(1); },
          filters: (
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="h-10 px-3 rounded-lg border border-neutral-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            >
              <option value="">All Status</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="flagged">Flagged</option>
              <option value="pending">Pending</option>
              <option value="scanning">Scanning</option>
            </select>
          ),
        }}
      />

      <Modal open={!!detailModal} onClose={() => setDetailModal(null)} title="Image Detail" size="lg">
        {detailModal && (
          <div className="space-y-5">
            <div className="flex gap-6">
              <div className="w-48 h-48 bg-neutral-100 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                {detailModal.thumbnail ? (
                  <img src={detailModal.thumbnail} alt="" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon size={48} className="text-neutral-300" />
                )}
              </div>
              <div className="flex-1 space-y-3">
                <div><p className="text-xs text-neutral-400">Uploaded by</p><p className="text-sm font-medium text-neutral-800">{detailModal.userName}</p></div>
                <div><p className="text-xs text-neutral-400">Upload Time</p><p className="text-sm text-neutral-700">{detailModal.uploadTime}</p></div>
                <div><p className="text-xs text-neutral-400">Scan Result</p><p className="text-sm font-medium">{detailModal.scanResult}</p></div>
                <div><p className="text-xs text-neutral-400">Confidence</p><p className="text-sm font-medium text-neutral-700">{(detailModal.confidence * 100).toFixed(0)}%</p></div>
                <div><p className="text-xs text-neutral-400">Status</p><p className="text-sm font-medium">{detailModal.status}</p></div>
                {detailModal.reason && (
                  <div><p className="text-xs text-neutral-400">Reason</p><p className="text-sm text-danger-600">{detailModal.reason}</p></div>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Moderator Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add moderator notes..."
                className="w-full h-20 px-3 py-2 rounded-lg border border-neutral-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none"
              />
            </div>
            <div className="flex justify-between pt-4 border-t border-neutral-200">
              <Button variant="outline" onClick={() => setDetailModal(null)}>Close</Button>
              <div className="flex gap-2">
                <Button variant="outline" className="text-success-600 border-success-200 hover:bg-success-50" onClick={() => handleStatusAction(detailModal.id, 'approved')}>Approve</Button>
                <Button variant="outline" className="text-danger-600 border-danger-200 hover:bg-danger-50" onClick={() => handleStatusAction(detailModal.id, 'rejected', notes || 'Rejected by moderator')}>Reject</Button>
                <Button variant="outline" className="text-warning-600 border-warning-200 hover:bg-warning-50" onClick={() => handleStatusAction(detailModal.id, 'flagged', notes || 'Flagged by moderator')}>Flag</Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
