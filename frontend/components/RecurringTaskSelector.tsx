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
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700"
        />
        <label htmlFor="isRecurring" className="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Recurring Task
        </label>
      </div>

      {isRecurring && (
        <div className="ml-6">
          <label htmlFor="recurrenceRule" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Recurrence Rule
          </label>
          <select
            id="recurrenceRule"
            value={recurrenceRule || ''}
            onChange={(e) => onRuleChange(e.target.value)}
            disabled={disabled}
            className="w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="" className="dark:bg-gray-700 dark:text-white">Select rule...</option>
            <option value="daily" className="dark:bg-gray-700 dark:text-white">Daily</option>
            <option value="weekly" className="dark:bg-gray-700 dark:text-white">Weekly</option>
            <option value="monthly" className="dark:bg-gray-700 dark:text-white">Monthly</option>
          </select>
        </div>
      )}
    </div>
  );
};