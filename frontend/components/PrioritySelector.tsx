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
        return 'bg-red-100 text-red-800 border-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
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
              ? `${getPriorityColor(level)} ring-2 ring-offset-2 ring-indigo-500`
              : `${getPriorityColor(null)} hover:${getPriorityColor(level)}`
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          {level.charAt(0).toUpperCase() + level.slice(1)}
        </button>
      ))}
    </div>
  );
};