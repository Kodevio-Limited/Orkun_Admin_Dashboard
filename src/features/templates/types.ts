export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  background: string;
  theme: string;
  backgroundType: string;
  aiPrompt: string;
  maintainFaceIdentity: boolean;
  keepOriginalGender: boolean;
  keepOriginalAge: boolean;
  enhanceLighting: boolean;
  highQualityRendering: boolean;
  allowBackgroundBlur: boolean;
  promptWeight: number;
  negativePrompt: string;
  seed: number | null;
  status: 'active' | 'inactive' | 'draft';
  createdAt: string;
  updatedAt: string;
}
