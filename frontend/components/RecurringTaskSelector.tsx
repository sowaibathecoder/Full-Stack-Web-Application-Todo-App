import { TaskRead } from '@/types/tasks';

interface RecurringTaskSelectorProps {
  isRecurring: boolean;
  recurrenceRule: string | null;
  onToggle: (enabled: boolean) => void;
  onRuleChange: (rule: string) => void;
  disabled?: boolean;
}

export const RecurringTaskSelector = ({
  isRecurring,
  recurrenceRule,
  onToggle,
  onRuleChange,
  disabled = false
}: RecurringTaskSelectorProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center">
        <input
          type="checkbox"
          id="isRecurring"
          checked={isRecurring}
          onChange={(e) => onToggle(e.target.checked)}
          disabled={disabled}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label htmlFor="isRecurring" className="ml-2 block text-sm font-medium text-gray-700">
          Recurring Task
        </label>
      </div>

      {isRecurring && (
        <div className="ml-6">
          <label htmlFor="recurrenceRule" className="block text-sm font-medium text-gray-700 mb-1">
            Recurrence Rule
          </label>
          <select
            id="recurrenceRule"
            value={recurrenceRule || ''}
            onChange={(e) => onRuleChange(e.target.value)}
            disabled={disabled}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Select rule...</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      )}
    </div>
  );
};