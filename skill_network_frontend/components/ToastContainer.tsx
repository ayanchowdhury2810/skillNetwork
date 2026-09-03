'use client';
import React from 'react';
import { useToast, Toast } from '../lib/toast-context';

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  const getStyles = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return 'bg-[#10B981] text-white';
      case 'error':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-800 text-white';
    }
  };

  if (!toasts.length) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${getStyles(toast.type)} px-5 py-3 rounded-lg shadow-lg flex items-center justify-between gap-3 min-w-[320px]`}
        >
          <span className="text-sm font-medium">{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="opacity-80 hover:opacity-100 transition-opacity"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
