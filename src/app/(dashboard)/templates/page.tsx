'use client';

import { useState, useRef, useEffect } from 'react';
import { Button, Input, Select, Badge, Checkbox } from '@/components/ui';
import { PageHeader } from '@/components/shared/page-header';
import { DataTable } from '@/components/shared/data-table/data-table';
import { Modal } from '@/components/ui/modal';
import { useTemplates } from '@/features/templates/hooks';
import { templateService } from '@/features/templates/service';
import { getTemplatesTableConfig } from '@/features/templates/table-config';
import { Template } from '@/features/templates/types';
import { promptService } from '@/features/prompts/service';
import { Prompt } from '@/features/prompts/types';
import { Plus, Upload, Copy } from 'lucide-react';
import { useToast } from '@/components/ui/toast';

const categories = ['Portrait', 'Event', 'Holiday', 'Seasonal'];
const themes = ['Birthday', 'Christmas', 'Halloween', 'Summer', 'Winter', 'School', 'Graduation', 'Family', 'Newborn'];
const bgTypes = ['Indoor', 'Outdoor', 'Studio', 'Nature', 'Beach', 'Bedroom', 'Living Room', 'Classroom', 'Garden'];

const defaultTemplate: Omit<Template, 'id' | 'createdAt' | 'updatedAt'> = {
  name: '', description: '', category: '', background: '', theme: '', backgroundType: '', aiPrompt: '',
  maintainFaceIdentity: true, keepOriginalGender: true, keepOriginalAge: false, enhanceLighting: true,
  highQualityRendering: true, allowBackgroundBlur: true, promptWeight: 1.0, negativePrompt: '', seed: null,
  status: 'draft',
};

export default function TemplatesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data, total, loading, refetch } = useTemplates({ page, pageSize: 10, search });
  const { addToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [editTemplate, setEditTemplate] = useState<Template | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Template | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(defaultTemplate);
  const [editForm, setEditForm] = useState<Template | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [availablePrompts, setAvailablePrompts] = useState<Prompt[]>([]);
  const [promptSource, setPromptSource] = useState<'existing' | 'custom'>('custom');
  const [editPromptSource, setEditPromptSource] = useState<'existing' | 'custom'>('custom');
  const [selectedPromptId, setSelectedPromptId] = useState('');
  const [editSelectedPromptId, setEditSelectedPromptId] = useState('');

  useEffect(() => {
    promptService.list({ page: 1, pageSize: 100 }).then((res) => setAvailablePrompts(res.data));
  }, []);

  const config = getTemplatesTableConfig(data, total, page, 10, setPage);

  config.rowActions = (row) => {
    const t = row as unknown as Template;
    return [
      { label: 'Edit', onClick: () => { setEditTemplate(t); setEditForm({ ...t }); setEditPromptSource('custom'); setEditSelectedPromptId(''); } },
      { label: 'Duplicate', onClick: async () => { await templateService.duplicate(t.id); addToast('Template duplicated', 'success'); refetch(); } },
      { label: t.status === 'active' ? 'Disable' : 'Enable', onClick: async () => {
        await templateService.update(t.id, { status: t.status === 'active' ? 'inactive' : 'active' });
        addToast(`Template ${t.status === 'active' ? 'disabled' : 'enabled'}`, 'success');
        refetch();
      }},
      { label: 'Delete', onClick: () => setConfirmDelete(t), variant: 'danger' as const },
    ];
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const url = ev.target?.result as string;
      if (isEdit && editForm) setEditForm({ ...editForm, background: url });
      else setForm({ ...form, background: url });
    };
    reader.readAsDataURL(file);
  };

  const handleCreate = async () => {
    if (!form.name) return;
    setSaving(true);
    await templateService.create({ ...form, seed: form.seed ?? null });
    setSaving(false);
    setCreateOpen(false);
    setForm(defaultTemplate);
    addToast('Template created successfully', 'success');
    refetch();
  };

  const handleEdit = async () => {
    if (!editForm || !editForm.name) return;
    setSaving(true);
    await templateService.update(editForm.id, editForm);
    setSaving(false);
    setEditTemplate(null);
    setEditForm(null);
    addToast('Template updated successfully', 'success');
    refetch();
  };

  return (
    <div>
      <PageHeader title="Templates" description="Manage AI image generator templates">
        <Button onClick={() => { setForm(defaultTemplate); setPromptSource('custom'); setSelectedPromptId(''); setCreateOpen(true); }}>
          <Plus size={18} /> Add Template
        </Button>
      </PageHeader>

      <DataTable
        {...config}
        isLoading={loading}
        toolbar={{
          searchPlaceholder: 'Search templates...',
          onSearch: (q) => { setSearch(q); setPage(1); },
        }}
      />

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create Template" size="xl">
        <div className="space-y-5 max-h-[70vh] overflow-y-auto pr-1">
          <p className="text-sm font-semibold text-neutral-700">Basic Information</p>
          <div
            className="h-36 bg-neutral-100 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-neutral-200 transition-colors relative overflow-hidden"
            onClick={() => fileInputRef.current?.click()}
          >
            {form.background ? (
              <img src={form.background} alt="Preview" className="w-full h-full object-cover absolute inset-0" />
            ) : (
              <><Upload size={28} className="text-neutral-400 mb-1" /><p className="text-xs text-neutral-400">Upload background (PNG, JPG, WEBP)</p></>
            )}
            <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(e) => handleFileSelect(e)} />
          </div>
          <Input id="t_name" label="Template Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Enter template description" className="w-full h-20 px-3 py-2 rounded-lg border border-neutral-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select id="t_cat" label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} options={categories.map((c) => ({ value: c, label: c }))} placeholder="Select category" />
            <Select id="t_theme" label="Theme" value={form.theme} onChange={(e) => setForm({ ...form, theme: e.target.value })} options={themes.map((t) => ({ value: t, label: t }))} placeholder="Select theme" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select id="t_bgtype" label="Background Type" value={form.backgroundType} onChange={(e) => setForm({ ...form, backgroundType: e.target.value })} options={bgTypes.map((b) => ({ value: b, label: b }))} placeholder="Select background type" />
            <Select id="t_status" label="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Template['status'] })} options={[{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }, { value: 'draft', label: 'Draft' }]} />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">AI Prompt</label>
            <div className="flex gap-4 mb-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="promptSource" checked={promptSource === 'existing'} onChange={() => setPromptSource('existing')} className="accent-primary-500" />
                <span className="text-sm text-neutral-600">Use existing prompt</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="promptSource" checked={promptSource === 'custom'} onChange={() => setPromptSource('custom')} className="accent-primary-500" />
                <span className="text-sm text-neutral-600">Custom prompt</span>
              </label>
            </div>
            {promptSource === 'existing' ? (
              <Select
                id="t_existing_prompt"
                value={selectedPromptId}
                onChange={(e) => {
                  const id = e.target.value;
                  setSelectedPromptId(id);
                  const prompt = availablePrompts.find((p) => p.id === id);
                  if (prompt) setForm({ ...form, aiPrompt: prompt.content });
                }}
                options={[
                  { value: '', label: 'Select a prompt...' },
                  ...availablePrompts.map((p) => ({ value: p.id, label: p.title })),
                ]}
              />
            ) : (
              <textarea value={form.aiPrompt} onChange={(e) => setForm({ ...form, aiPrompt: e.target.value })} placeholder="Enter the AI prompt for this template..." className="w-full h-28 px-3 py-2 rounded-lg border border-neutral-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none font-mono" />
            )}
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setShowAdvanced(!showAdvanced)} className="text-sm font-medium text-primary-500 hover:text-primary-600">
              {showAdvanced ? 'Hide' : 'Show'} Advanced Options
            </button>
          </div>
          {showAdvanced && (
            <div className="space-y-4 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center gap-2 cursor-pointer"><Checkbox checked={form.maintainFaceIdentity} onChange={() => setForm({ ...form, maintainFaceIdentity: !form.maintainFaceIdentity })} /><span className="text-sm text-neutral-600">Maintain Face Identity</span></label>
                <label className="flex items-center gap-2 cursor-pointer"><Checkbox checked={form.keepOriginalGender} onChange={() => setForm({ ...form, keepOriginalGender: !form.keepOriginalGender })} /><span className="text-sm text-neutral-600">Keep Original Gender</span></label>
                <label className="flex items-center gap-2 cursor-pointer"><Checkbox checked={form.keepOriginalAge} onChange={() => setForm({ ...form, keepOriginalAge: !form.keepOriginalAge })} /><span className="text-sm text-neutral-600">Keep Original Age</span></label>
                <label className="flex items-center gap-2 cursor-pointer"><Checkbox checked={form.enhanceLighting} onChange={() => setForm({ ...form, enhanceLighting: !form.enhanceLighting })} /><span className="text-sm text-neutral-600">Enhance Lighting</span></label>
                <label className="flex items-center gap-2 cursor-pointer"><Checkbox checked={form.highQualityRendering} onChange={() => setForm({ ...form, highQualityRendering: !form.highQualityRendering })} /><span className="text-sm text-neutral-600">High Quality Rendering</span></label>
                <label className="flex items-center gap-2 cursor-pointer"><Checkbox checked={form.allowBackgroundBlur} onChange={() => setForm({ ...form, allowBackgroundBlur: !form.allowBackgroundBlur })} /><span className="text-sm text-neutral-600">Allow Background Blur</span></label>
              </div>
              <Input id="t_pw" label="Prompt Weight" type="number" step="0.1" value={String(form.promptWeight)} onChange={(e) => setForm({ ...form, promptWeight: Number(e.target.value) })} />
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Negative Prompt</label>
                <textarea value={form.negativePrompt} onChange={(e) => setForm({ ...form, negativePrompt: e.target.value })} placeholder="Enter negative prompt..." className="w-full h-20 px-3 py-2 rounded-lg border border-neutral-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none" />
              </div>
              <Input id="t_seed" label="Seed (optional)" type="number" value={form.seed !== null ? String(form.seed) : ''} onChange={(e) => setForm({ ...form, seed: e.target.value ? Number(e.target.value) : null })} />
            </div>
          )}
          <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} loading={saving}>Create Template</Button>
          </div>
        </div>
      </Modal>

      <Modal open={!!editTemplate} onClose={() => { setEditTemplate(null); setEditForm(null); }} title="Edit Template" size="xl">
        {editForm && (
          <div className="space-y-5 max-h-[70vh] overflow-y-auto pr-1">
            <p className="text-sm font-semibold text-neutral-700">Basic Information</p>
            <div
              className="h-36 bg-neutral-100 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-neutral-200 transition-colors relative overflow-hidden"
              onClick={() => editFileInputRef.current?.click()}
            >
              {editForm.background ? (
                <img src={editForm.background} alt="Preview" className="w-full h-full object-cover absolute inset-0" />
              ) : (
                <><Upload size={28} className="text-neutral-400 mb-1" /><p className="text-xs text-neutral-400">Upload background (PNG, JPG, WEBP)</p></>
              )}
              <input ref={editFileInputRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(e) => handleFileSelect(e, true)} />
            </div>
            <Input id="te_name" label="Template Name" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} required />
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Description</label>
              <textarea value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} className="w-full h-20 px-3 py-2 rounded-lg border border-neutral-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Select id="te_cat" label="Category" value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })} options={categories.map((c) => ({ value: c, label: c }))} />
              <Select id="te_theme" label="Theme" value={editForm.theme} onChange={(e) => setEditForm({ ...editForm, theme: e.target.value })} options={themes.map((t) => ({ value: t, label: t }))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Select id="te_bgtype" label="Background Type" value={editForm.backgroundType} onChange={(e) => setEditForm({ ...editForm, backgroundType: e.target.value })} options={bgTypes.map((b) => ({ value: b, label: b }))} />
              <Select id="te_status" label="Status" value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value as Template['status'] })} options={[{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }, { value: 'draft', label: 'Draft' }]} />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">AI Prompt</label>
              <div className="flex gap-4 mb-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="editPromptSource" checked={editPromptSource === 'existing'} onChange={() => setEditPromptSource('existing')} className="accent-primary-500" />
                  <span className="text-sm text-neutral-600">Use existing prompt</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="editPromptSource" checked={editPromptSource === 'custom'} onChange={() => setEditPromptSource('custom')} className="accent-primary-500" />
                  <span className="text-sm text-neutral-600">Custom prompt</span>
                </label>
              </div>
              {editPromptSource === 'existing' ? (
                <Select
                  id="te_existing_prompt"
                  value={editSelectedPromptId}
                  onChange={(e) => {
                    const id = e.target.value;
                    setEditSelectedPromptId(id);
                    const prompt = availablePrompts.find((p) => p.id === id);
                    if (prompt) setEditForm({ ...editForm, aiPrompt: prompt.content });
                  }}
                  options={[
                    { value: '', label: 'Select a prompt...' },
                    ...availablePrompts.map((p) => ({ value: p.id, label: p.title })),
                  ]}
                />
              ) : (
                <textarea value={editForm.aiPrompt} onChange={(e) => setEditForm({ ...editForm, aiPrompt: e.target.value })} className="w-full h-28 px-3 py-2 rounded-lg border border-neutral-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none font-mono" />
              )}
            </div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setShowAdvanced(!showAdvanced)} className="text-sm font-medium text-primary-500 hover:text-primary-600">
                {showAdvanced ? 'Hide' : 'Show'} Advanced Options
              </button>
            </div>
            {showAdvanced && (
              <div className="space-y-4 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center gap-2 cursor-pointer"><Checkbox checked={editForm.maintainFaceIdentity} onChange={() => setEditForm({ ...editForm, maintainFaceIdentity: !editForm.maintainFaceIdentity })} /><span className="text-sm text-neutral-600">Maintain Face Identity</span></label>
                  <label className="flex items-center gap-2 cursor-pointer"><Checkbox checked={editForm.keepOriginalGender} onChange={() => setEditForm({ ...editForm, keepOriginalGender: !editForm.keepOriginalGender })} /><span className="text-sm text-neutral-600">Keep Original Gender</span></label>
                  <label className="flex items-center gap-2 cursor-pointer"><Checkbox checked={editForm.keepOriginalAge} onChange={() => setEditForm({ ...editForm, keepOriginalAge: !editForm.keepOriginalAge })} /><span className="text-sm text-neutral-600">Keep Original Age</span></label>
                  <label className="flex items-center gap-2 cursor-pointer"><Checkbox checked={editForm.enhanceLighting} onChange={() => setEditForm({ ...editForm, enhanceLighting: !editForm.enhanceLighting })} /><span className="text-sm text-neutral-600">Enhance Lighting</span></label>
                  <label className="flex items-center gap-2 cursor-pointer"><Checkbox checked={editForm.highQualityRendering} onChange={() => setEditForm({ ...editForm, highQualityRendering: !editForm.highQualityRendering })} /><span className="text-sm text-neutral-600">High Quality Rendering</span></label>
                  <label className="flex items-center gap-2 cursor-pointer"><Checkbox checked={editForm.allowBackgroundBlur} onChange={() => setEditForm({ ...editForm, allowBackgroundBlur: !editForm.allowBackgroundBlur })} /><span className="text-sm text-neutral-600">Allow Background Blur</span></label>
                </div>
                <Input id="te_pw" label="Prompt Weight" type="number" step="0.1" value={String(editForm.promptWeight)} onChange={(e) => setEditForm({ ...editForm, promptWeight: Number(e.target.value) })} />
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Negative Prompt</label>
                  <textarea value={editForm.negativePrompt} onChange={(e) => setEditForm({ ...editForm, negativePrompt: e.target.value })} className="w-full h-20 px-3 py-2 rounded-lg border border-neutral-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none" />
                </div>
                <Input id="te_seed" label="Seed (optional)" type="number" value={editForm.seed !== null ? String(editForm.seed) : ''} onChange={(e) => setEditForm({ ...editForm, seed: e.target.value ? Number(e.target.value) : null })} />
              </div>
            )}
            <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
              <Button variant="outline" onClick={() => { setEditTemplate(null); setEditForm(null); }}>Cancel</Button>
              <Button variant="outline" onClick={async () => { if (editForm) { await templateService.duplicate(editForm.id); addToast('Template duplicated', 'success'); refetch(); } }}><Copy size={16} /> Duplicate</Button>
              <Button onClick={handleEdit} loading={saving}>Save Changes</Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Delete Template" size="sm">
        <div className="space-y-4">
          <p className="text-sm text-neutral-600">Are you sure you want to delete <strong>{confirmDelete?.name}</strong>?</p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setConfirmDelete(null)}>Cancel</Button>
            <Button variant="danger" onClick={async () => {
              if (confirmDelete) { await templateService.remove(confirmDelete.id); addToast('Template deleted', 'success'); setConfirmDelete(null); refetch(); }
            }}>Delete</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
