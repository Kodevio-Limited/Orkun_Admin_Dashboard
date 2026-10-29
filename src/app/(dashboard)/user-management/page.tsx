'use client';

import { useState, useRef } from 'react';
import { Button, Input, Select } from '@/components/ui';
import { PageHeader } from '@/components/shared/page-header';
import { DataTable } from '@/components/shared/data-table/data-table';
import { Modal } from '@/components/ui/modal';
import { useUsers } from '@/features/users/hooks';
import { getUsersTableConfig } from '@/features/users/table-config';
import { userService } from '@/features/users/service';
import { User } from '@/features/users/types';
import { Plus, Upload } from 'lucide-react';
import { useToast } from '@/components/ui/toast';

export default function UserManagementPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<User | null>(null);
  const [creating, setCreating] = useState(false);
  const { data, total, loading, refetch } = useUsers({ page, pageSize: 10, search });
  const { addToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: '', email: '', role: '' as string, initialCredit: '', password: '', passport: '',
  });

  const resetForm = () => setForm({ name: '', email: '', role: '', initialCredit: '', password: '', passport: '' });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setForm({ ...form, passport: (ev.target?.result as string) || '' });
    reader.readAsDataURL(file);
  };

  const config = getUsersTableConfig(data, total, page, 10, setPage);

  config.rowActions = (row) => {
    const u = row as unknown as User;
    return [
      { label: 'Delete', onClick: () => setConfirmDelete(u), variant: 'danger' as const },
    ];
  };

  const handleCreate = async () => {
    if (!form.name || !form.email || !form.role || !form.initialCredit) return;
    setCreating(true);
    await userService.create({
      name: form.name,
      email: form.email,
      role: form.role as User['role'],
      status: 'active',
      initialCredit: Number(form.initialCredit) || 0,
      passport: form.passport || '',
      plan: 'Starter',
      imageGenerated: 0,
      lastActive: new Date().toISOString(),
    } as Omit<User, 'id' | 'joinedAt'>);
    setCreating(false);
    setModalOpen(false);
    resetForm();
    addToast('User created successfully', 'success');
    refetch();
  };

  return (
    <div>
      <PageHeader title="User Management" description="Manage users and their roles">
        <Button onClick={() => { resetForm(); setModalOpen(true); }}>
          <Plus size={18} />
          Add New User
        </Button>
      </PageHeader>

      <DataTable
        {...config}
        isLoading={loading}
        toolbar={{
          searchPlaceholder: 'Search users...',
          onSearch: (q) => { setSearch(q); setPage(1); },
        }}
      />

      <Modal open={modalOpen} onClose={() => { setModalOpen(false); resetForm(); }} title="Add New User" size="lg">
        <div className="space-y-4">
          <div
            className="h-36 bg-neutral-100 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-neutral-200 transition-colors relative overflow-hidden"
            onClick={() => fileInputRef.current?.click()}
          >
            {form.passport ? (
              <img src={form.passport} alt="Passport preview" className="w-full h-full object-cover absolute inset-0" />
            ) : (
              <>
                <Upload size={28} className="text-neutral-400 mb-1" />
                <p className="text-xs text-neutral-400">Upload passport photo</p>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input id="um_name" label="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <Input id="um_email" label="Email Address" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select
              id="um_role"
              label="User Role"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              options={[
                { value: 'admin', label: 'Admin' },
                { value: 'manager', label: 'Manager' },
                { value: 'editor', label: 'Editor' },
                { value: 'viewer', label: 'Viewer' },
              ]}
              required
            />
            <Input id="um_credit" label="Initial Credit" type="number" value={form.initialCredit} onChange={(e) => setForm({ ...form, initialCredit: e.target.value })} required />
          </div>
          <Input id="um_password" label="Default Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Auto-generated if left blank" />
          <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
            <Button variant="outline" onClick={() => { setModalOpen(false); resetForm(); }}>Cancel</Button>
            <Button onClick={handleCreate} loading={creating}>Create User</Button>
          </div>
        </div>
      </Modal>

      <Modal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Delete User" size="sm">
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
                  await userService.remove(confirmDelete.id);
                  addToast('User deleted', 'success');
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
