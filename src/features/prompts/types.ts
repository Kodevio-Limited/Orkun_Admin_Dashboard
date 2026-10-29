export interface Prompt {
  id: string;
  title: string;
  description: string;
  content: string;
  negativePrompt: string;
  variables: string;
  category: string;
  status: 'active' | 'inactive' | 'draft';
  createdAt: string;
  updatedAt: string;
}

export const PROMPT_CATEGORIES: string[] = [
  'General Prompt', 'Background Prompt', 'Theme Prompt', 'Monthly Prompt',
  'Holiday Prompt', 'Birthday Prompt', 'System Prompt', 'Safety Prompt', 'Negative Prompt',
];
