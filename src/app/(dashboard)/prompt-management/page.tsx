'use client';

import { useState } from 'react';
import { Button, Input, Select } from '@/components/ui';
import { PageHeader } from '@/components/shared/page-header';
import { DataTable } from '@/components/shared/data-table/data-table';
import { Modal } from '@/components/ui/modal';
import { usePrompts } from '@/features/prompts/hooks';
import { promptService } from '@/features/prompts/service';
import { getPromptsTableConfig } from '@/features/prompts/table-config';
import { Prompt, PROMPT_CATEGORIES } from '@/features/prompts/types';
import { Plus } from 'lucide-react';
import { useToast } from '@/components/ui/toast';

const defaultPrompt: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'> = {
  title: '', description: '', content: '', negativePrompt: '', variables: '', category: PROMPT_CATEGORIES[0], status: 'draft',
};

export default function PromptManagementPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const { data, total, loading, refetch } = usePrompts({ page, pageSize: 10, search, category: categoryFilter });
  const { addToast } = useToast();

  const [createOpen, setCreateOpen] = useState(false);
  const [editPrompt, setEditPrompt] = useState<Prompt | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Prompt | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(defaultPrompt);
  const [editForm, setEditForm] = useState<Prompt | null>(null);

  const config = getPromptsTableConfig(data, total, page, 10, setPage);

  config.rowActions = (row) => {
    const p = row as unknown as Prompt;
    return [
      { label: 'Edit', onClick: () => { setEditPrompt(p); setEditForm({ ...p }); } },
      { label: 'Duplicate', onClick: async () => { await promptService.duplicate(p.id); addToast('Prompt duplicated', 'success'); refetch(); } },
      { label: p.status === 'active' ? 'Disable' : 'Enable', onClick: async () => {
        await promptService.update(p.id, { status: p.status === 'active' ? 'inactive' : 'active' });
        addToast(`Prompt ${p.status === 'active' ? 'disabled' : 'enabled'}`, 'success');
        refetch();
      }},
      { label: 'Delete', onClick: () => setConfirmDelete(p), variant: 'danger' as const },
    ];
  };

  const handleCreate = async () => {
    if (!form.title) return;
    setSaving(true);
    await promptService.create({ ...form });
    setSaving(false);
    setCreateOpen(false);
    setForm(defaultPrompt);
    addToast('Prompt created successfully', 'success');
    refetch();
  };

  const handleEdit = async () => {
    if (!editForm || !editForm.title) return;
    setSaving(true);
    await promptService.update(editForm.id, editForm);
    setSaving(false);
    setEditPrompt(null);
    setEditForm(null);
    addToast('Prompt updated successfully', 'success');
    refetch();
  };

  return (
    <div>
      <PageHeader title="Prompt Management" description="Manage AI prompts for image generation">
        <Button onClick={() => { setForm(defaultPrompt); setCreateOpen(true); }}>
          <Plus size={18} /> Create Prompt
        </Button>
      </PageHeader>

      <DataTable
        {...config}
        isLoading={loading}
        toolbar={{
          searchPlaceholder: 'Search prompts...',
          onSearch: (q) => { setSearch(q); setPage(1); },
          filters: (
            <select
              value={categoryFilter}
              onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
              className="h-10 px-3 rounded-lg border border-neutral-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            >
              <option value="">All Categories</option>
              {PROMPT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          ),
        }}
      />

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create Prompt" size="xl">
        <div className="space-y-5">
          <Input id="p_title" label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Brief description of this prompt" className="w-full h-16 px-3 py-2 rounded-lg border border-neutral-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select id="p_cat" label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} options={PROMPT_CATEGORIES.map((c) => ({ value: c, label: c }))} />
            <Select id="p_status" label="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Prompt['status'] })} options={[{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }, { value: 'draft', label: 'Draft' }]} />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Prompt Content</label>
            <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Enter the prompt content..." className="w-full h-40 px-3 py-2 rounded-lg border border-neutral-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none font-mono leading-relaxed" />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Negative Prompt</label>
            <textarea value={form.negativePrompt} onChange={(e) => setForm({ ...form, negativePrompt: e.target.value })} placeholder="Enter negative prompt..." className="w-full h-20 px-3 py-2 rounded-lg border border-neutral-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none" />
          </div>
          <Input id="p_vars" label="Variables (comma-separated)" value={form.variables} onChange={(e) => setForm({ ...form, variables: e.target.value })} placeholder="e.g. lighting_style, background_color" />
          <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button variant="outline" onClick={() => setForm(defaultPrompt)}>Reset</Button>
            <Button onClick={handleCreate} loading={saving}>Create Prompt</Button>
          </div>
        </div>
      </Modal>

      <Modal open={!!editPrompt} onClose={() => { setEditPrompt(null); setEditForm(null); }} title="Edit Prompt" size="xl">
        {editForm && (
          <div className="space-y-5">
            <Input id="pe_title" label="Title" value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} required />
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Description</label>
              <textarea value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} className="w-full h-16 px-3 py-2 rounded-lg border border-neutral-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Select id="pe_cat" label="Category" value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })} options={PROMPT_CATEGORIES.map((c) => ({ value: c, label: c }))} />
              <Select id="pe_status" label="Status" value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value as Prompt['status'] })} options={[{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }, { value: 'draft', label: 'Draft' }]} />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Prompt Content</label>
              <textarea value={editForm.content} onChange={(e) => setEditForm({ ...editForm, content: e.target.value })} className="w-full h-40 px-3 py-2 rounded-lg border border-neutral-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none font-mono leading-relaxed" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Negative Prompt</label>
              <textarea value={editForm.negativePrompt} onChange={(e) => setEditForm({ ...editForm, negativePrompt: e.target.value })} className="w-full h-20 px-3 py-2 rounded-lg border border-neutral-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none" />
            </div>
            <Input id="pe_vars" label="Variables (comma-separated)" value={editForm.variables} onChange={(e) => setEditForm({ ...editForm, variables: e.target.value })} />
            <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
              <Button variant="outline" onClick={() => { setEditPrompt(null); setEditForm(null); }}>Cancel</Button>
              <Button variant="outline" onClick={() => { if (editForm) setEditForm({ ...editForm, content: '', negativePrompt: '' }); }}>Reset</Button>
              <Button onClick={handleEdit} loading={saving}>Save Changes</Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Delete Prompt" size="sm">
        <div className="space-y-4">
          <p className="text-sm text-neutral-600">Are you sure you want to delete <strong>{confirmDelete?.title}</strong>?</p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setConfirmDelete(null)}>Cancel</Button>
            <Button variant="danger" onClick={async () => {
              if (confirmDelete) { await promptService.remove(confirmDelete.id); addToast('Prompt deleted', 'success'); setConfirmDelete(null); refetch(); }
            }}>Delete</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
