import { useState } from 'react';
import { TaskRead } from '@/types/tasks';
import { taskApi } from '@/lib/api';
import { TaskCompletionConfirmation } from './TaskCompletionConfirmation';
import { sanitizeHTML } from '@/utils/sanitize';
import { memo } from 'react';

interface TaskItemProps {
  task: TaskRead;
  onToggle: (updatedTask: TaskRead) => void;
  onEdit: () => void;
  onDelete: (taskId: number) => void;
}

const TaskItemComponent = ({ task, onToggle, onEdit, onDelete }: TaskItemProps) => {
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';

    try {
      // Parse the date string and check if it's valid
      const date = new Date(dateString);

      // Check if the date is valid
      if (isNaN(date.getTime())) {
        console.warn('Invalid date received:', dateString);
        return 'Invalid Date';
      }

      const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
      return date.toLocaleDateString(undefined, options);
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  const getPriorityColor = (priority: string | undefined) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200';
      case 'medium':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200';
      case 'low':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
    }
  };

  const isOverdue = task.due_date && (() => {
    try {
      const dueDate = new Date(task.due_date);
      const currentDate = new Date();

      // Check if dates are valid
      if (isNaN(dueDate.getTime()) || isNaN(currentDate.getTime())) {
        return false;
      }

      return dueDate < currentDate && !task.completed;
    } catch (error) {
      console.error('Error checking if task is overdue:', error);
      return false;
    }
  })();

  const handleToggleClick = () => {
    setShowCompletionModal(true);
  };

  const handleToggleConfirm = async (taskId: number) => {
    try {
      const updatedTask = await taskApi.toggleTaskCompletion(taskId);
      onToggle(updatedTask);
    } catch (error) {
      console.error('Error toggling task completion:', error);
      // Error is handled by parent component through onToggle
    } finally {
      // Always close the modal regardless of success or failure
      setShowCompletionModal(false);
    }
  };

  const handleToggleCancel = () => {
    setShowCompletionModal(false);
  };

  return (
    <li className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow ${isOverdue && !task.completed ? 'border-l-4 border-red-500' : ''}`}>
      <div className="flex items-start">
        <div className="flex items-start h-5">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={handleToggleClick}
            className="focus:ring-indigo-500 dark:focus:ring-indigo-400 h-5 w-5 text-indigo-600 dark:text-indigo-400 border-gray-400 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
          />
        </div>
        <div className="ml-3 flex-1">
          <div className="flex items-center justify-between">
            <p className={`text-sm font-medium ${task.completed ? 'text-gray-500 dark:text-gray-400 line-through' : 'text-gray-900 dark:text-gray-100'}`}>
              {sanitizeHTML(task.title)}
            </p>
            <div className="flex space-x-2">
              <button
                onClick={onEdit}
                className="text-gray-400 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-200"
                aria-label="Edit task"
              >
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className="text-gray-400 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400"
                aria-label="Delete task"
              >
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>

          {task.description && (
            <p className={`mt-1 text-sm ${task.completed ? 'text-gray-400 dark:text-gray-500' : 'text-gray-600 dark:text-gray-300'}`}>
              {sanitizeHTML(task.description)}
            </p>
          )}

          <div className="mt-2 flex flex-wrap gap-2">
            {task.priority && (
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)} dark:bg-opacity-20`}>
                {task.priority}
              </span>
            )}

            {task.tags && task.tags.map((tag, index) => (
              <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200">
                {tag}
              </span>
            ))}

            {task.due_date && (
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                isOverdue ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200' : 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200'
              }`}>
                Due: {formatDate(task.due_date)}
              </span>
            )}
          </div>
        </div>
      </div>

      {task.created_at && (
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Created: {formatDate(task.created_at)}
        </div>
      )}

      {showCompletionModal && (
        <TaskCompletionConfirmation
          isOpen={showCompletionModal}
          onClose={handleToggleCancel}
          onConfirm={handleToggleConfirm}
          taskId={task.id}
          taskTitle={task.title}
          isCompleting={!task.completed}
        />
      )}
    </li>
  );
};

export const TaskItem = memo(TaskItemComponent);