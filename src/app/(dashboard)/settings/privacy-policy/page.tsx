'use client';

import { useState } from 'react';
import { Button } from '@/components/ui';
import { useToast } from '@/components/ui/toast';

export default function PrivacyPolicyPage() {
  const { addToast } = useToast();
  const [content, setContent] = useState(
    'We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.\n\nWe collect personal data that you provide to us directly, such as your name, email address, and usage data when you interact with our platform. We use this data to provide and improve our services, communicate with you, and ensure security compliance.\n\nYou have the right to access, update, and delete your personal data at any time.'
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-neutral-800 mb-4">Privacy Policy</h2>
        <textarea
          className="w-full h-64 px-4 py-3 rounded-lg border border-neutral-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-y"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      <div className="pt-4 border-t border-neutral-200">
        <Button onClick={() => addToast('Privacy policy updated successfully', 'success')}>Save Changes</Button>
      </div>
    </div>
  );
}
