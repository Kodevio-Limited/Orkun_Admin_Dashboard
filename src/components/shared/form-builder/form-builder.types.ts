import { ReactNode } from 'react';
import { ZodType } from 'zod';

export type FieldType = 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'date' | 'checkbox';

export interface FieldOption {
  value: string;
  label: string;
}

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  options?: FieldOption[];
  validation?: ZodType;
  colSpan?: 'full' | 'half';
}

export interface FormBuilderConfig {
  fields: FieldConfig[];
  onSubmit: (data: Record<string, unknown>) => void;
  submitLabel?: string;
  loading?: boolean;
}
