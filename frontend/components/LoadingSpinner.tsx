import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  label = 'Loading...'
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  const borderSize = {
    sm: 'border-2',
    md: 'border-4',
    lg: 'border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className={`${sizeClasses[size]} ${borderSize[size]} border-t-transparent border-current rounded-full animate-spin`}
        role="status"
        aria-label="Loading"
      >
        <span className="sr-only">{label}</span>
      </div>
      {label && (
        <span className="mt-2 text-sm text-gray-600 dark:text-gray-400">{label}</span>
      )}
    </div>
  );
};