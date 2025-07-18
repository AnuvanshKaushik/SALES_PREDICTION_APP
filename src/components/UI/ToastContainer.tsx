import React from 'react';
import { X, CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

const iconMap = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const colorMap = {
  success: 'border-green-500 bg-green-50 dark:bg-green-900/20',
  error: 'border-red-500 bg-red-50 dark:bg-red-900/20',
  warning: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20',
  info: 'border-blue-500 bg-blue-50 dark:bg-blue-900/20',
};

const iconColorMap = {
  success: 'text-green-600 dark:text-green-400',
  error: 'text-red-600 dark:text-red-400',
  warning: 'text-yellow-600 dark:text-yellow-400',
  info: 'text-blue-600 dark:text-blue-400',
};

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm">
      {toasts.map((toast) => {
        const IconComponent = iconMap[toast.type];
        
        return (
          <div
            key={toast.id}
            className={`flex items-start gap-3 rounded-lg border-l-4 p-4 shadow-lg transition-all duration-300 ${colorMap[toast.type]}`}
          >
            <IconComponent className={`h-5 w-5 mt-0.5 ${iconColorMap[toast.type]}`} />
            <div className="flex-1">
              <div className="font-semibold text-gray-900 dark:text-white">{toast.title}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">{toast.message}</div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};