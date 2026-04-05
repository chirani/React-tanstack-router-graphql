import React from 'react';
import useToastStore, { type ToastType } from '../zustand/toast';

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  const typeStyles: Record<ToastType, string> = {
    success: 'bg-green-500 border-green-600',
    error: 'bg-red-500 border-red-600',
    info: 'bg-blue-500 border-blue-600',
  };

  return (
    <div className="fixed top-10 right-10 z-510 flex flex-col gap-3 w-full max-w-xs">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          onClick={() => removeToast(toast.id)}
          className={`cursor-pointer p-4 rounded-lg shadow-lg text-white border-l-4 transition-all animate-in fade-in slide-in-from-right-5 ${typeStyles[toast.type]}`}
        >
          <div className="flex justify-between items-center">
            <span className="font-medium">{toast.message}</span>
            <button
              className="ml-4 text-white/70 hover:text-white"
              aria-label="Close"
            >
              &times;
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
