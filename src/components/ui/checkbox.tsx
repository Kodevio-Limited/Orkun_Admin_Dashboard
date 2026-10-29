'use client';

import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, ...props }, ref) => (
    <label htmlFor={id} className="flex items-center gap-2 cursor-pointer">
      <input
        ref={ref}
        type="checkbox"
        id={id}
        className={cn(
          'w-4 h-4 rounded border-neutral-300 text-primary-500',
          'focus:ring-2 focus:ring-primary-500/20 focus:ring-offset-0',
          className
        )}
        {...props}
      />
      {label && <span className="text-sm text-neutral-700">{label}</span>}
    </label>
  )
);
Checkbox.displayName = 'Checkbox';

export { Checkbox };
