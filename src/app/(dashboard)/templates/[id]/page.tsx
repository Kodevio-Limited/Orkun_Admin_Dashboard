'use client';

import { useState, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button, Input, Select, Checkbox } from '@/components/ui';
import { PageHeader } from '@/components/shared/page-header';
import { useTemplate } from '@/features/templates/hooks';
import { templateService } from '@/features/templates/service';
import { Template } from '@/features/templates/types';
import { promptService } from '@/features/prompts/service';
import { Prompt } from '@/features/prompts/types';
import { Upload, Copy, ArrowLeft } from 'lucide-react';
import { useToast } from '@/components/ui/toast';

const categories = ['Portrait', 'Event', 'Holiday', 'Seasonal'];
const themes = ['Birthday', 'Christmas', 'Halloween', 'Summer', 'Winter', 'School', 'Graduation', 'Family', 'Newborn'];
const bgTypes = ['Indoor', 'Outdoor', 'Studio', 'Nature', 'Beach', 'Bedroom', 'Living Room', 'Classroom', 'Garden'];

export default function TemplateDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: template, loading, error } = useTemplate(id);
  const { addToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [availablePrompts, setAvailablePrompts] = useState<Prompt[]>([]);
  const [promptSource, setPromptSource] = useState<'existing' | 'custom'>('custom');
  const [selectedPromptId, setSelectedPromptId] = useState('');

  useEffect(() => {
    promptService.list({ page: 1, pageSize: 100 }).then((res) => setAvailablePrompts(res.data));
  }, []);

  if (loading) return <div className="text-center py-12 text-neutral-400">Loading template...</div>;
  if (error || !template) return <div className="text-center py-12 text-danger-500">{error || 'Template not found'}</div>;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { template.background = (ev.target?.result as string) || ''; };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    await templateService.update(id, template);
    setSaving(false);
    addToast('Template updated successfully', 'success');
  };

  return (
    <div>
      <PageHeader title={template.name} description="Edit template details">
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => router.push('/templates')}><ArrowLeft size={18} /> Back</Button>
          <Button variant="outline" onClick={async () => { await templateService.duplicate(id); addToast('Template duplicated', 'success'); }}><Copy size={16} /> Duplicate</Button>
          <Button onClick={handleSave} loading={saving}>Save Changes</Button>
        </div>
      </PageHeader>

      <div className="bg-white rounded-xl border border-neutral-200 p-6 max-w-3xl">
        <div className="space-y-5">
          <p className="text-sm font-semibold text-neutral-700">Basic Information</p>
          <div
            className="h-36 bg-neutral-100 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-neutral-200 transition-colors relative overflow-hidden"
            onClick={() => fileInputRef.current?.click()}
          >
            {template.background ? (
              <img src={template.background} alt="Preview" className="w-full h-full object-cover absolute inset-0" />
            ) : (
              <><Upload size={28} className="text-neutral-400 mb-1" /><p className="text-xs text-neutral-400">Upload background (PNG, JPG, WEBP)</p></>
            )}
            <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handleFileSelect} />
          </div>
          <Input id="td_name" label="Template Name" value={template.name} onChange={(e) => { template.name = e.target.value; }} required />
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Description</label>
            <textarea value={template.description} onChange={(e) => { template.description = e.target.value; }} className="w-full h-20 px-3 py-2 rounded-lg border border-neutral-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select id="td_cat" label="Category" value={template.category} onChange={(e) => { template.category = e.target.value; }} options={categories.map((c) => ({ value: c, label: c }))} />
            <Select id="td_theme" label="Theme" value={template.theme} onChange={(e) => { template.theme = e.target.value; }} options={themes.map((t) => ({ value: t, label: t }))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select id="td_bgtype" label="Background Type" value={template.backgroundType} onChange={(e) => { template.backgroundType = e.target.value; }} options={bgTypes.map((b) => ({ value: b, label: b }))} />
            <Select id="td_status" label="Status" value={template.status} onChange={(e) => { template.status = e.target.value as Template['status']; }} options={[{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }, { value: 'draft', label: 'Draft' }]} />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">AI Prompt</label>
            <div className="flex gap-4 mb-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="detailPromptSource" checked={promptSource === 'existing'} onChange={() => setPromptSource('existing')} className="accent-primary-500" />
                <span className="text-sm text-neutral-600">Use existing prompt</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="detailPromptSource" checked={promptSource === 'custom'} onChange={() => setPromptSource('custom')} className="accent-primary-500" />
                <span className="text-sm text-neutral-600">Custom prompt</span>
              </label>
            </div>
            {promptSource === 'existing' ? (
              <Select
                id="td_existing_prompt"
                value={selectedPromptId}
                onChange={(e) => {
                  const id = e.target.value;
                  setSelectedPromptId(id);
                  const prompt = availablePrompts.find((p) => p.id === id);
                  if (prompt) template.aiPrompt = prompt.content;
                }}
                options={[
                  { value: '', label: 'Select a prompt...' },
                  ...availablePrompts.map((p) => ({ value: p.id, label: p.title })),
                ]}
              />
            ) : (
              <textarea value={template.aiPrompt} onChange={(e) => { template.aiPrompt = e.target.value; }} className="w-full h-28 px-3 py-2 rounded-lg border border-neutral-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none font-mono" />
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
                <label className="flex items-center gap-2 cursor-pointer"><Checkbox checked={template.maintainFaceIdentity} onChange={() => { template.maintainFaceIdentity = !template.maintainFaceIdentity; }} /><span className="text-sm text-neutral-600">Maintain Face Identity</span></label>
                <label className="flex items-center gap-2 cursor-pointer"><Checkbox checked={template.keepOriginalGender} onChange={() => { template.keepOriginalGender = !template.keepOriginalGender; }} /><span className="text-sm text-neutral-600">Keep Original Gender</span></label>
                <label className="flex items-center gap-2 cursor-pointer"><Checkbox checked={template.keepOriginalAge} onChange={() => { template.keepOriginalAge = !template.keepOriginalAge; }} /><span className="text-sm text-neutral-600">Keep Original Age</span></label>
                <label className="flex items-center gap-2 cursor-pointer"><Checkbox checked={template.enhanceLighting} onChange={() => { template.enhanceLighting = !template.enhanceLighting; }} /><span className="text-sm text-neutral-600">Enhance Lighting</span></label>
                <label className="flex items-center gap-2 cursor-pointer"><Checkbox checked={template.highQualityRendering} onChange={() => { template.highQualityRendering = !template.highQualityRendering; }} /><span className="text-sm text-neutral-600">High Quality Rendering</span></label>
                <label className="flex items-center gap-2 cursor-pointer"><Checkbox checked={template.allowBackgroundBlur} onChange={() => { template.allowBackgroundBlur = !template.allowBackgroundBlur; }} /><span className="text-sm text-neutral-600">Allow Background Blur</span></label>
              </div>
              <Input id="td_pw" label="Prompt Weight" type="number" step="0.1" value={String(template.promptWeight)} onChange={(e) => { template.promptWeight = Number(e.target.value); }} />
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Negative Prompt</label>
                <textarea value={template.negativePrompt} onChange={(e) => { template.negativePrompt = e.target.value; }} className="w-full h-20 px-3 py-2 rounded-lg border border-neutral-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none" />
              </div>
              <Input id="td_seed" label="Seed (optional)" type="number" value={template.seed !== null ? String(template.seed) : ''} onChange={(e) => { template.seed = e.target.value ? Number(e.target.value) : null; }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
