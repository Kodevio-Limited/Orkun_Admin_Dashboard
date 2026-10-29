'use client';

import { useState } from 'react';
import { Button } from '@/components/ui';
import { useToast } from '@/components/ui/toast';

export default function TermsConditionsPage() {
  const { addToast } = useToast();
  const [content, setContent] = useState(
    'Please read these Terms & Conditions carefully before using our platform. By accessing or using our service, you agree to be bound by these terms.\n\n1. Acceptance of Terms - By accessing our platform, you agree to these terms.\n2. User Responsibilities - You are responsible for maintaining the confidentiality of your account.\n3. Service Usage - You agree to use the service in compliance with all applicable laws.\n4. Payment Terms - All payments are due according to the selected plan\'s billing cycle.\n5. Limitation of Liability - We shall not be liable for any indirect damages arising from service use.\n6. Termination - We reserve the right to terminate accounts that violate these terms.'
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-neutral-800 mb-4">Terms & Conditions</h2>
        <textarea
          className="w-full h-64 px-4 py-3 rounded-lg border border-neutral-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-y"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      <div className="pt-4 border-t border-neutral-200">
        <Button onClick={() => addToast('Terms & conditions updated successfully', 'success')}>Save Changes</Button>
      </div>
    </div>
  );
}
