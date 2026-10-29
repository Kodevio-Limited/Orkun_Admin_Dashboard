'use client';

import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

type ToastVariant = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface ToastContextType {
  addToast: (message: string, variant?: ToastVariant) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

const icons: Record<ToastVariant, React.ReactNode> = {
  success: <CheckCircle size={18} className="text-success-500" />,
  error: <AlertCircle size={18} className="text-danger-500" />,
  info: <Info size={18} className="text-primary-500" />,
  warning: <AlertTriangle size={18} className="text-warning-500" />,
};

const bgColors: Record<ToastVariant, string> = {
  success: 'border-l-success-500',
  error: 'border-l-danger-500',
  info: 'border-l-primary-500',
  warning: 'border-l-warning-500',
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, variant: ToastVariant = 'info') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, variant }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={cn(
        'flex items-center gap-3 min-w-[320px] px-4 py-3 bg-white rounded-lg shadow-lg border border-neutral-200 border-l-4 animate-slide-up',
        bgColors[toast.variant]
      )}
    >
      {icons[toast.variant]}
      <p className="text-sm text-neutral-700 flex-1">{toast.message}</p>
      <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600">
        <X size={16} />
      </button>
    </div>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
