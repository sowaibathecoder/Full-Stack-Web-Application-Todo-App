import { TaskRead } from '@/types/tasks';

interface PrioritySelectorProps {
  priority: string | null;
  onChange?: (priority: string) => void;
  disabled?: boolean;
}

export const PrioritySelector = ({ priority, onChange, disabled = false }: PrioritySelectorProps) => {
  const getPriorityColor = (priorityLevel: string | null) => {
    switch (priorityLevel) {
      case 'high':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border-red-300 dark:border-red-700';
      case 'medium':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 border-yellow-300 dark:border-yellow-700';
      case 'low':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border-green-300 dark:border-green-700';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600';
    }
  };

  const handleSelect = (newPriority: string) => {
    if (onChange && !disabled) {
      onChange(newPriority);
    }
  };

  return (
    <div className="flex space-x-2">
      {['high', 'medium', 'low'].map((level) => (
        <button
          key={level}
          type="button"
          onClick={() => handleSelect(level)}
          disabled={disabled}
          className={`px-3 py-1 text-sm font-medium rounded-full border ${
            priority === level
              ? `${getPriorityColor(level)} ring-2 ring-offset-2 ring-indigo-500 dark:ring-offset-gray-800`
              : `${getPriorityColor(null)} hover:${getPriorityColor(level)} dark:bg-opacity-20`
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          {level.charAt(0).toUpperCase() + level.slice(1)}
        </button>
      ))}
    </div>
  );
};