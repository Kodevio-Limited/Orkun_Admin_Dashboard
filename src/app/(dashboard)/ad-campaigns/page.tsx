'use client';

import { useState, useRef } from 'react';
import { Button, Badge, Card, Modal, Input, Select } from '@/components/ui';
import { PageHeader } from '@/components/shared/page-header';
import { StatusBadge } from '@/components/shared/status-badge';
import { useCampaigns } from '@/features/campaigns/hooks';
import { campaignService } from '@/features/campaigns/service';
import { Campaign } from '@/features/campaigns/types';
import { Plus, ImageIcon, Trash2, Edit3, Upload } from 'lucide-react';
import { useToast } from '@/components/ui/toast';
import { formatDate } from '@/lib/utils';

const typeLabels: Record<string, string> = {
  display: 'Display',
  video: 'Video',
  social: 'Social',
  search: 'Search',
};

const defaultCampaign: Omit<Campaign, 'id' | 'createdAt'> = {
  name: '', description: '', image: '', type: 'display', status: 'draft',
  budget: 0, spent: 0, impressions: 0, clicks: 0, conversions: 0,
  startDate: '', endDate: '',
};

export default function AdCampaignsPage() {
  const [search, setSearch] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [editCampaign, setEditCampaign] = useState<Campaign | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Campaign | null>(null);
  const [saving, setSaving] = useState(false);
  const { data, loading, refetch } = useCampaigns({ page: 1, pageSize: 50, search });
  const { addToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState(defaultCampaign);
  const [editForm, setEditForm] = useState<Campaign | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const url = ev.target?.result as string;
      if (isEdit && editForm) {
        setEditForm({ ...editForm, image: url });
      } else {
        setForm({ ...form, image: url });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCreate = async () => {
    if (!form.name || !form.description) return;
    setSaving(true);
    await campaignService.create({
      ...form,
      budget: Number(form.budget),
      spent: 0, impressions: 0, clicks: 0, conversions: 0,
    });
    setSaving(false);
    setCreateOpen(false);
    setForm(defaultCampaign);
    addToast('Campaign created successfully', 'success');
    refetch();
  };

  const handleEdit = async () => {
    if (!editForm || !editForm.name || !editForm.description) return;
    setSaving(true);
    await campaignService.update(editForm.id, editForm);
    setSaving(false);
    setEditCampaign(null);
    setEditForm(null);
    addToast('Campaign updated successfully', 'success');
    refetch();
  };

  return (
    <div>
      <PageHeader title="Ad Campaigns" description="Manage your advertising campaigns">
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search campaigns..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 px-4 rounded-lg border border-neutral-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 w-64"
          />
          <Button onClick={() => { setForm(defaultCampaign); setCreateOpen(true); }}>
            <Plus size={18} />
            New Campaign
          </Button>
        </div>
      </PageHeader>

      {loading ? (
        <div className="text-center py-12 text-neutral-400">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {data.map((campaign) => (
            <Card key={campaign.id} className="p-0 overflow-hidden">
              <div className="h-40 bg-neutral-100 flex items-center justify-center relative overflow-hidden">
                {campaign.image ? (
                  <img src={campaign.image} alt="" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon size={40} className="text-neutral-300" />
                )}
                <div className="absolute top-3 right-3">
                  <StatusBadge status={campaign.status} />
                </div>
                <div className="absolute top-3 left-3">
                  <Badge variant="default">{typeLabels[campaign.type]}</Badge>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-neutral-800 truncate">{campaign.name}</h3>
                    <p className="text-xs text-neutral-400 mt-0.5">Created {formatDate(campaign.createdAt)}</p>
                  </div>
                  <div className="flex gap-1 shrink-0 ml-2">
                    <button
                      onClick={() => { setEditCampaign(campaign); setEditForm({ ...campaign }); }}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-primary-500 hover:bg-neutral-100 transition-colors"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={() => setConfirmDelete(campaign)}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-danger-500 hover:bg-neutral-100 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-neutral-500 line-clamp-2">{campaign.description}</p>
              </div>
            </Card>
          ))}
          {data.length === 0 && (
            <div className="col-span-full text-center py-12 text-neutral-400">No campaigns found</div>
          )}
        </div>
      )}

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="New Campaign" size="md">
        <div className="space-y-4">
          <div
            className="h-32 bg-neutral-100 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-neutral-200 transition-colors relative overflow-hidden"
            onClick={() => fileInputRef.current?.click()}
          >
            {form.image ? (
              <img src={form.image} alt="Preview" className="w-full h-full object-cover absolute inset-0" />
            ) : (
              <>
                <Upload size={24} className="text-neutral-400 mb-1" />
                <p className="text-xs text-neutral-400">Click to upload campaign image</p>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileSelect(e)}
            />
          </div>
          <Input id="c_name" label="Campaign Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Description <span className="text-danger-500">*</span></label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Enter campaign description"
              className="w-full h-20 px-3 py-2 rounded-lg border border-neutral-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select
              id="c_type"
              label="Campaign Type"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as Campaign['type'] })}
              options={[
                { value: 'display', label: 'Display' },
                { value: 'video', label: 'Video' },
                { value: 'social', label: 'Social' },
                { value: 'search', label: 'Search' },
              ]}
            />
            <Select
              id="c_status"
              label="Status"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as Campaign['status'] })}
              options={[
                { value: 'active', label: 'Active' },
                { value: 'paused', label: 'Paused' },
                { value: 'draft', label: 'Draft' },
              ]}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input id="c_budget" label="Budget ($)" type="number" value={String(form.budget)} onChange={(e) => setForm({ ...form, budget: Number(e.target.value) })} />
            <div className="grid grid-cols-2 gap-4">
              <Input id="c_start" label="Start Date" type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
              <Input id="c_end" label="End Date" type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} loading={saving}>Create Campaign</Button>
          </div>
        </div>
      </Modal>

      <Modal open={!!editCampaign} onClose={() => { setEditCampaign(null); setEditForm(null); }} title="Edit Campaign" size="md">
        {editForm && (
          <div className="space-y-4">
            <div
              className="h-32 bg-neutral-100 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-neutral-200 transition-colors relative overflow-hidden"
              onClick={() => editFileInputRef.current?.click()}
            >
              {editForm.image ? (
                <img src={editForm.image} alt="Preview" className="w-full h-full object-cover absolute inset-0" />
              ) : (
                <>
                  <Upload size={24} className="text-neutral-400 mb-1" />
                  <p className="text-xs text-neutral-400">Click to upload campaign image</p>
                </>
              )}
              <input
                ref={editFileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileSelect(e, true)}
              />
            </div>
            <Input id="ce_name" label="Campaign Name" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} required />
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Description <span className="text-danger-500">*</span></label>
              <textarea
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                placeholder="Enter campaign description"
                className="w-full h-20 px-3 py-2 rounded-lg border border-neutral-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Select
                id="ce_type"
                label="Campaign Type"
                value={editForm.type}
                onChange={(e) => setEditForm({ ...editForm, type: e.target.value as Campaign['type'] })}
                options={[
                  { value: 'display', label: 'Display' },
                  { value: 'video', label: 'Video' },
                  { value: 'social', label: 'Social' },
                  { value: 'search', label: 'Search' },
                ]}
              />
              <Select
                id="ce_status"
                label="Status"
                value={editForm.status}
                onChange={(e) => setEditForm({ ...editForm, status: e.target.value as Campaign['status'] })}
                options={[
                  { value: 'active', label: 'Active' },
                  { value: 'paused', label: 'Paused' },
                  { value: 'draft', label: 'Draft' },
                ]}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input id="ce_budget" label="Budget ($)" type="number" value={String(editForm.budget)} onChange={(e) => setEditForm({ ...editForm, budget: Number(e.target.value) })} />
              <div className="grid grid-cols-2 gap-4">
                <Input id="ce_start" label="Start Date" type="date" value={editForm.startDate} onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })} />
                <Input id="ce_end" label="End Date" type="date" value={editForm.endDate} onChange={(e) => setEditForm({ ...editForm, endDate: e.target.value })} />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
              <Button variant="outline" onClick={() => { setEditCampaign(null); setEditForm(null); }}>Cancel</Button>
              <Button onClick={handleEdit} loading={saving}>Save Changes</Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Delete Campaign" size="sm">
        <div className="space-y-4">
          <p className="text-sm text-neutral-600">
            Are you sure you want to delete <strong>{confirmDelete?.name}</strong>?
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setConfirmDelete(null)}>Cancel</Button>
            <Button
              variant="danger"
              onClick={async () => {
                if (confirmDelete) {
                  await campaignService.remove(confirmDelete.id);
                  addToast('Campaign deleted', 'success');
                  setConfirmDelete(null);
                  refetch();
                }
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
