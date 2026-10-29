'use client';

import { useState, useEffect } from 'react';
import { Button, Input } from '@/components/ui';
import { PageHeader } from '@/components/shared/page-header';
import { useSafetySettings } from '@/features/moderation/hooks';
import { moderationService } from '@/features/moderation/service';
import { SafetySettings } from '@/features/moderation/types';
import { useToast } from '@/components/ui/toast';

export default function SafetySettingsPage() {
  const { settings, loading, setSettings } = useSafetySettings();
  const { addToast } = useToast();
  const [saving, setSaving] = useState(false);
  const [local, setLocal] = useState<SafetySettings | null>(null);

  useEffect(() => {
    if (settings) setLocal({ ...settings });
  }, [settings]);

  const handleSave = async () => {
    if (!local) return;
    setSaving(true);
    await moderationService.saveSettings(local);
    setSaving(false);
    setSettings(local);
    addToast('Safety settings saved successfully', 'success');
  };

  if (loading || !local) {
    return <div className="text-center py-12 text-neutral-400">Loading settings...</div>;
  }

  return (
    <div>
      <PageHeader title="Safety Settings" description="Configure AI scanning and moderation settings">
        <Button onClick={handleSave} loading={saving}>Save Settings</Button>
      </PageHeader>

      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <div className="space-y-6">
          <div>
            <p className="text-sm font-semibold text-neutral-700 mb-3">Scanning Features</p>
            <div className="grid grid-cols-2 gap-3">
              {([
                { key: 'enableAiScanning', label: 'Enable AI Scanning' },
                { key: 'enableFaceDetection', label: 'Enable Face Detection' },
                { key: 'enableNsfwDetection', label: 'Enable NSFW Detection' },
                { key: 'enableDuplicateDetection', label: 'Enable Duplicate Detection' },
                { key: 'enableWatermarkDetection', label: 'Enable Watermark Detection' },
                { key: 'enableIdentityMatching', label: 'Enable Identity Matching' },
              ] as const).map(({ key, label }) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={local[key as keyof SafetySettings] as boolean}
                    onChange={() => setLocal({ ...local, [key]: !local[key as keyof SafetySettings] })}
                    className="rounded border-neutral-300 text-primary-500 focus:ring-primary-500/20"
                  />
                  <span className="text-sm text-neutral-600">{label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="border-t border-neutral-200 pt-6">
            <p className="text-sm font-semibold text-neutral-700 mb-3">Threshold & Automation</p>
            <div className="space-y-4 max-w-sm">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Minimum Confidence ({Math.round(local.minimumConfidence * 100)}%)</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={Math.round(local.minimumConfidence * 100)}
                  onChange={(e) => setLocal({ ...local, minimumConfidence: Number(e.target.value) / 100 })}
                  className="w-full accent-primary-500"
                />
                <div className="flex justify-between text-xs text-neutral-400 mt-1">
                  <span>0%</span><span>50%</span><span>100%</span>
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={local.autoReject}
                  onChange={() => setLocal({ ...local, autoReject: !local.autoReject })}
                  className="rounded border-neutral-300 text-primary-500 focus:ring-primary-500/20"
                />
                <span className="text-sm text-neutral-600">Auto Reject</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={local.manualReview}
                  onChange={() => setLocal({ ...local, manualReview: !local.manualReview })}
                  className="rounded border-neutral-300 text-primary-500 focus:ring-primary-500/20"
                />
                <span className="text-sm text-neutral-600">Manual Review</span>
              </label>
            </div>
          </div>

          <div className="border-t border-neutral-200 pt-6">
            <p className="text-sm font-semibold text-neutral-700 mb-3">Upload Restrictions</p>
            <div className="grid grid-cols-2 gap-4 max-w-md">
              <Input id="ss_size" label="Max Upload Size (MB)" type="number" value={String(local.maxUploadSize)} onChange={(e) => setLocal({ ...local, maxUploadSize: Number(e.target.value) })} />
              <Input id="ss_types" label="Allowed Image Types" value={local.allowedImageTypes} onChange={(e) => setLocal({ ...local, allowedImageTypes: e.target.value })} placeholder="png, jpg, webp" />
            </div>
          </div>

          <div className="border-t border-neutral-200 pt-6">
            <p className="text-sm font-semibold text-neutral-700 mb-3">Content Filtering</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Blocked Words</label>
                <textarea value={local.blockedWords} onChange={(e) => setLocal({ ...local, blockedWords: e.target.value })} className="w-full h-20 px-3 py-2 rounded-lg border border-neutral-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Blocked Prompt List</label>
                <textarea value={local.blockedPromptList} onChange={(e) => setLocal({ ...local, blockedPromptList: e.target.value })} className="w-full h-20 px-3 py-2 rounded-lg border border-neutral-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Negative Prompt Settings</label>
                <textarea value={local.negativePromptSettings} onChange={(e) => setLocal({ ...local, negativePromptSettings: e.target.value })} className="w-full h-20 px-3 py-2 rounded-lg border border-neutral-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
