import React, { useEffect, useState } from 'react';

interface NotificationToastProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
  onClose?: () => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  type,
  message,
  duration = 5000, // 5 seconds default
  onClose
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setVisible(false);
    if (onClose) {
      onClose();
    }
  };

  if (!visible) return null;

  const typeStyles = {
    success: 'bg-green-50 dark:bg-green-900/30 border-green-500 dark:border-green-700 text-green-700 dark:text-green-300',
    error: 'bg-red-50 dark:bg-red-900/30 border-red-500 dark:border-red-700 text-red-700 dark:text-red-300',
    warning: 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-500 dark:border-yellow-700 text-yellow-700 dark:text-yellow-300',
    info: 'bg-blue-50 dark:bg-blue-900/30 border-blue-500 dark:border-blue-700 text-blue-700 dark:text-blue-300',
  };

  const typeIcons = {
    success: (
      <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
    error: (
      <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    ),
    warning: (
      <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM10 11a1 1 0 110-2 1 1 0 010 2zm-1 4a1 1 0 012 0v1a1 1 0 11-2 0v-1z" clipRule="evenodd" />
      </svg>
    ),
    info: (
      <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
    ),
  };

  return (
    <div className={`fixed top-4 right-4 max-w-md w-full rounded-md border p-4 shadow-lg z-50 ${typeStyles[type]}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          {typeIcons[type]}
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              onClick={handleClose}
              type="button"
              className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                type === 'success'
                  ? 'bg-green-50 dark:bg-green-800/50 text-green-500 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-700/50 focus:ring-green-600 dark:focus:ring-green-500 focus:ring-offset-green-50 dark:focus:ring-offset-gray-800'
                  : type === 'error'
                    ? 'bg-red-50 dark:bg-red-800/50 text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-700/50 focus:ring-red-600 dark:focus:ring-red-500 focus:ring-offset-red-50 dark:focus:ring-offset-gray-800'
                    : type === 'warning'
                      ? 'bg-yellow-50 dark:bg-yellow-800/50 text-yellow-500 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-700/50 focus:ring-yellow-600 dark:focus:ring-yellow-500 focus:ring-offset-yellow-50 dark:focus:ring-offset-gray-800'
                      : 'bg-blue-50 dark:bg-blue-800/50 text-blue-500 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-700/50 focus:ring-blue-600 dark:focus:ring-blue-500 focus:ring-offset-blue-50 dark:focus:ring-offset-gray-800'
              }`}
            >
              <span className="sr-only">Close</span>
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};