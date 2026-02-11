import React from 'react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionText?: string;
  onActionClick?: () => void;
  showAction?: boolean;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  onActionClick,
  showAction = false,
  className = ''
}) => {
  return (
    <div className={`text-center py-12 ${className}`}>
      {icon ? (
        <div className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 flex items-center justify-center">
          {icon}
        </div>
      ) : (
        <svg
          className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      )}
      <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">{title}</h3>
      {description && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>}
      {showAction && actionText && onActionClick && (
        <div className="mt-6">
          <button
            type="button"
            onClick={onActionClick}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
          >
            {actionText}
          </button>
        </div>
      )}
    </div>
  );
};