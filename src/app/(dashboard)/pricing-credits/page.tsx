'use client';

import { useState } from 'react';
import { Card, Button, Badge } from '@/components/ui';
import { PageHeader } from '@/components/shared/page-header';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui';
import { usePricingPlans } from '@/features/pricing/hooks';
import { pricingService } from '@/features/pricing/service';
import { PricingPlan } from '@/features/pricing/types';
import { Check, Plus, X, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/components/ui/toast';

export default function PricingCreditsPage() {
  const { data: plans, loading, refetch } = usePricingPlans();
  const { addToast } = useToast();
  const [editingPlan, setEditingPlan] = useState<PricingPlan | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [newPlan, setNewPlan] = useState<Omit<PricingPlan, 'id'>>({
    name: '', price: 0, credits: 0, features: [], popular: false,
  });
  const [editFeatureInput, setEditFeatureInput] = useState('');
  const [createFeatureInput, setCreateFeatureInput] = useState('');

  const handleSaveEdit = async () => {
    if (!editingPlan) return;
    await pricingService.updatePlan(editingPlan.id, editingPlan);
    addToast('Plan updated successfully', 'success');
    setEditingPlan(null);
    refetch();
  };

  const handleCreate = async () => {
    if (!newPlan.name) return;
    await pricingService.createPlan({ ...newPlan });
    addToast('Plan created successfully', 'success');
    setCreateOpen(false);
    setNewPlan({ name: '', price: 0, credits: 0, features: [], popular: false });
    refetch();
  };

  const addEditFeature = () => {
    if (!editingPlan || !editFeatureInput.trim()) return;
    setEditingPlan({ ...editingPlan, features: [...editingPlan.features, editFeatureInput.trim()] });
    setEditFeatureInput('');
  };

  const removeEditFeature = (idx: number) => {
    if (!editingPlan) return;
    setEditingPlan({ ...editingPlan, features: editingPlan.features.filter((_, i) => i !== idx) });
  };

  const addCreateFeature = () => {
    if (!createFeatureInput.trim()) return;
    setNewPlan({ ...newPlan, features: [...newPlan.features, createFeatureInput.trim()] });
    setCreateFeatureInput('');
  };

  const removeCreateFeature = (idx: number) => {
    setNewPlan({ ...newPlan, features: newPlan.features.filter((_, i) => i !== idx) });
  };

  return (
    <div>
      <PageHeader title="Pricing & Credits" description="Manage pricing plans and credit transactions">
        <div className="flex gap-3">
          <Link href="/pricing-credits/credits">
            <Button variant="outline">View Credits</Button>
          </Link>
          <Button onClick={() => setCreateOpen(true)}><Plus size={18} /> New Plan</Button>
        </div>
      </PageHeader>

      {loading ? (
        <div className="text-center py-12 text-neutral-400">Loading plans...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card key={plan.id} className={`p-6 ${plan.popular ? 'ring-2 ring-[#FD6900] relative' : ''}`}>
              {plan.popular && (
                <Badge variant="info" className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                  Most Popular
                </Badge>
              )}
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-neutral-800 mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-3xl font-bold text-neutral-800">${plan.price}</span>
                </div>
                <p className="text-sm text-neutral-500 mt-1">{plan.credits.toLocaleString()} credits</p>
              </div>
              <ul className="space-y-2 mb-6 max-h-44 overflow-y-auto">
                {plan.features.map((feat, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-neutral-600">
                    <Check size={16} className="text-success-500 shrink-0" />
                    {feat}
                  </li>
                ))}
              </ul>
              <div className="flex justify-center">
                <Button variant="outline" onClick={() => setEditingPlan({ ...plan })}>
                  Edit
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={!!editingPlan} onClose={() => setEditingPlan(null)} title="Edit Pricing Plan" size="md">
        {editingPlan && (
          <div className="space-y-4">
            <Input id="ep_name" label="Plan Name" value={editingPlan.name} onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })} />
            <div className="grid grid-cols-2 gap-4">
              <Input id="ep_price" label="Price ($)" type="number" value={String(editingPlan.price)} onChange={(e) => setEditingPlan({ ...editingPlan, price: Number(e.target.value) })} />
              <Input id="ep_credits" label="Credits" type="number" value={String(editingPlan.credits)} onChange={(e) => setEditingPlan({ ...editingPlan, credits: Number(e.target.value) })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Features</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={editFeatureInput}
                  onChange={(e) => setEditFeatureInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addEditFeature())}
                  placeholder="Add a feature..."
                  className="flex-1 h-9 px-3 rounded-lg border border-neutral-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                />
                <button
                  onClick={addEditFeature}
                  className="h-9 px-3 rounded-lg bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {editingPlan.features.map((feat, i) => (
                  <div key={i} className="flex items-center justify-between px-3 py-2 rounded-lg bg-neutral-50 text-sm text-neutral-700">
                    <span>{feat}</span>
                    <button onClick={() => removeEditFeature(i)} className="text-neutral-400 hover:text-danger-500 transition-colors">
                      <X size={14} />
                    </button>
                  </div>
                ))}
                {editingPlan.features.length === 0 && (
                  <p className="text-xs text-neutral-400 italic">No features added yet</p>
                )}
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={editingPlan.popular}
                onChange={() => setEditingPlan({ ...editingPlan, popular: !editingPlan.popular })}
                className="rounded border-neutral-300 text-primary-500 focus:ring-primary-500/20"
              />
              <span className="text-sm text-neutral-600">Mark as Popular</span>
            </label>
            <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
              <Button variant="outline" onClick={() => setEditingPlan(null)}>Cancel</Button>
              <Button onClick={handleSaveEdit}>Save Changes</Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create New Plan" size="md">
        <div className="space-y-4">
          <Input id="np_name" label="Plan Name" value={newPlan.name} onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <Input id="np_price" label="Price ($)" type="number" value={String(newPlan.price)} onChange={(e) => setNewPlan({ ...newPlan, price: Number(e.target.value) })} />
            <Input id="np_credits" label="Credits" type="number" value={String(newPlan.credits)} onChange={(e) => setNewPlan({ ...newPlan, credits: Number(e.target.value) })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Features</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={createFeatureInput}
                onChange={(e) => setCreateFeatureInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCreateFeature())}
                placeholder="Add a feature..."
                className="flex-1 h-9 px-3 rounded-lg border border-neutral-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              />
              <button
                onClick={addCreateFeature}
                className="h-9 px-3 rounded-lg bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 transition-colors"
              >
                Add
              </button>
            </div>
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {newPlan.features.map((feat, i) => (
                <div key={i} className="flex items-center justify-between px-3 py-2 rounded-lg bg-neutral-50 text-sm text-neutral-700">
                  <span>{feat}</span>
                  <button onClick={() => removeCreateFeature(i)} className="text-neutral-400 hover:text-danger-500 transition-colors">
                    <X size={14} />
                  </button>
                </div>
              ))}
              {newPlan.features.length === 0 && (
                <p className="text-xs text-neutral-400 italic">No features added yet</p>
              )}
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={newPlan.popular}
              onChange={() => setNewPlan({ ...newPlan, popular: !newPlan.popular })}
              className="rounded border-neutral-300 text-primary-500 focus:ring-primary-500/20"
            />
            <span className="text-sm text-neutral-600">Mark as Popular</span>
          </label>
          <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate}>Create Plan</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
