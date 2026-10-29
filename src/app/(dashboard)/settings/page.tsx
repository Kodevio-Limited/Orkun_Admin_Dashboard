'use client';

import { Button, Input, Select } from '@/components/ui';
import { useToast } from '@/components/ui/toast';

export default function GeneralSettingsPage() {
  const { addToast } = useToast();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-neutral-800 mb-4">General Settings</h2>
        <div className="space-y-4">
          <Input id="appName" label="Application Name" defaultValue="Admin Dashboard" />
          <Input id="appUrl" label="Application URL" defaultValue="https://dashboard.example.com" />
          <Input id="supportEmail" label="Support Email" defaultValue="support@example.com" />
          <Select
            id="language"
            label="Default Language"
            options={[
              { value: 'en', label: 'English' },
              { value: 'es', label: 'Spanish' },
              { value: 'fr', label: 'French' },
            ]}
            defaultValue="en"
          />
        </div>
      </div>
      <div className="pt-4 border-t border-neutral-200">
        <Button onClick={() => addToast('Settings saved successfully', 'success')}>Save Changes</Button>
      </div>
    </div>
  );
}
