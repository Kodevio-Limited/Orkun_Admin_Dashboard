'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input, Select, Button, Checkbox } from '@/components/ui';
import { FieldConfig, FormBuilderConfig } from './form-builder.types';

function buildSchema(fields: FieldConfig[]) {
  const shape: Record<string, z.ZodTypeAny> = {};
  fields.forEach((f) => {
    let s: z.ZodTypeAny = z.string();
    if (f.type === 'number') s = z.coerce.number();
    if (f.type === 'email') s = z.string().email();
    if (f.type === 'checkbox') s = z.boolean().optional();
    if (f.required) {
      if (f.type === 'number') s = (s as z.ZodNumber).min(0, 'Required');
      else s = (s as z.ZodString).min(1, 'Required');
    }
    if (f.validation) s = f.validation;
    shape[f.name] = f.required ? s : s.optional();
  });
  return z.object(shape);
}

export function FormBuilder({ fields, onSubmit, submitLabel = 'Submit', loading }: FormBuilderConfig) {
  const schema = buildSchema(fields);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit((data) => onSubmit(data as Record<string, unknown>))}>
      <div className="grid grid-cols-2 gap-4">
        {fields.map((field) => {
          const error = errors[field.name]?.message as string | undefined;
          const className = field.colSpan === 'full' ? 'col-span-2' : 'col-span-1';

          if (field.type === 'checkbox') {
            return (
              <div key={field.name} className={className}>
                <Checkbox
                  id={field.name}
                  label={field.label}
                  {...register(field.name)}
                />
              </div>
            );
          }

          if (field.type === 'select') {
            return (
              <div key={field.name} className={className}>
                <Select
                  id={field.name}
                  label={field.label}
                  options={field.options || []}
                  placeholder={field.placeholder}
                  error={error}
                  {...register(field.name)}
                />
              </div>
            );
          }

          if (field.type === 'textarea') {
            return (
              <div key={field.name} className={className}>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                  {field.label}
                  {field.required && <span className="text-danger-500 ml-1">*</span>}
                </label>
                <textarea
                  id={field.name}
                  placeholder={field.placeholder}
                  className="w-full h-24 px-3 py-2 rounded-lg border border-neutral-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none"
                  {...register(field.name)}
                />
                {error && <p className="mt-1 text-xs text-danger-500">{error}</p>}
              </div>
            );
          }

          return (
            <div key={field.name} className={className}>
              <Input
                id={field.name}
                label={field.label}
                type={field.type}
                placeholder={field.placeholder}
                error={error}
                required={field.required}
                {...register(field.name)}
              />
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <Button type="submit" loading={loading}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
