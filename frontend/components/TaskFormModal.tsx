import { useState, useEffect } from 'react';
import { TaskCreate, TaskUpdate, TaskRead } from '@/types/tasks';
import { taskApi } from '@/lib/api';
import { PrioritySelector } from './PrioritySelector';
import { TagInput } from './TagInput';
import { sanitizeTitle, sanitizeDescription, sanitizeTags, isValidDate } from '@/utils/sanitize';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: TaskRead | null;
  onSave: (task: TaskRead) => void;
}

export const TaskFormModal = ({ isOpen, onClose, task, onSave }: TaskFormModalProps) => {
  const isEditing = !!task;
  const [formData, setFormData] = useState<TaskCreate | TaskUpdate>({
    title: task?.title || '',
    description: task?.description || '',
    priority: task?.priority || '',
    tags: task?.tags || [],
    due_date: task?.due_date || '',
    is_recurring: task?.is_recurring || false,
    recurrence_rule: task?.recurrence_rule || ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: task?.title || '',
        description: task?.description || '',
        priority: task?.priority || '',
        tags: task?.tags || [],
        due_date: task?.due_date || '',
        is_recurring: task?.is_recurring || false,
        recurrence_rule: task?.recurrence_rule || ''
      });
      setErrors({});
    }
  }, [isOpen, task]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: target.checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handlePriorityChange = (priority: string) => {
    setFormData(prev => ({
      ...prev,
      priority
    }));
  };

  const handleAddTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: [...(prev.tags || []), tag]
    }));
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Comprehensive validation
    const newErrors: Record<string, string> = {};

    // Title validation
    if (!formData.title?.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 200) {
      newErrors.title = 'Title must be 200 characters or less';
    }

    // Description validation
    if (formData.description && formData.description.length > 1000) {
      newErrors.description = 'Description must be 1000 characters or less';
    }

    // Validate date if provided
    if (formData.due_date && !isValidDate(formData.due_date)) {
      newErrors.due_date = 'Invalid date format';
    }

    // Validate recurrence rule if task is recurring
    if (formData.is_recurring && !formData.recurrence_rule) {
      newErrors.recurrence_rule = 'Recurrence rule is required for recurring tasks';
    }

    // Validate recurrence rule format
    if (formData.recurrence_rule && !['daily', 'weekly', 'monthly'].includes(formData.recurrence_rule)) {
      newErrors.recurrence_rule = 'Invalid recurrence rule';
    }

    // Validate priority
    if (formData.priority && !['low', 'medium', 'high'].includes(formData.priority)) {
      newErrors.priority = 'Priority must be low, medium, or high';
    }

    // Validate tags
    if (formData.tags && formData.tags.length > 10) {
      newErrors.tags = 'Maximum 10 tags allowed';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      // Sanitize input data before sending to API
      const sanitizedData = {
        ...formData,
        title: sanitizeTitle(formData.title as string),
        description: sanitizeDescription(formData.description || ''),
        tags: sanitizeTags(formData.tags || []),
        due_date: formData.due_date || undefined
      };

      let savedTask: TaskRead;

      if (isEditing && task) {
        // Update existing task
        savedTask = await taskApi.updateTask(task.id, sanitizedData as TaskUpdate);
      } else {
        // Create new task - exclude user_id as it will be set by the backend from JWT
        const { user_id, ...createData } = sanitizedData as any;
        savedTask = await taskApi.createTask(createData as TaskCreate);
      }

      onSave(savedTask);
      onClose(); // Close the modal after successful save
    } catch (error) {
      console.error('Error saving task:', error);
      setErrors({ submit: 'Failed to save task. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div
            className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"
            onClick={onClose}
          ></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
                    {isEditing ? 'Edit Task' : 'Create Task'}
                  </h3>
                  <div className="mt-4 space-y-4">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Title *
                      </label>
                      <input
                        type="text"
                        name="title"
                        id="title"
                        value={formData.title}
                        onChange={handleChange}
                        className={`mt-1 block w-full border ${errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                        required
                      />
                      {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                    </div>

                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Description
                      </label>
                      <textarea
                        name="description"
                        id="description"
                        rows={3}
                        value={formData.description}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      ></textarea>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Priority
                        </label>
                        <div className="mt-1">
                          <PrioritySelector
                            priority={formData.priority || null}
                            onChange={handlePriorityChange}
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="due_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Due Date
                        </label>
                        <input
                          type="datetime-local"
                          name="due_date"
                          id="due_date"
                          value={formData.due_date}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Tags
                      </label>
                      <div className="mt-1">
                        <TagInput
                          tags={formData.tags || []}
                          onAddTag={handleAddTag}
                          onRemoveTag={handleRemoveTag}
                        />
                      </div>
                    </div>

                    <div className="flex items-center">
                      <input
                        id="is_recurring"
                        name="is_recurring"
                        type="checkbox"
                        checked={formData.is_recurring}
                        onChange={handleChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700"
                      />
                      <label htmlFor="is_recurring" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                        Recurring Task
                      </label>
                    </div>

                    {formData.is_recurring && (
                      <div>
                        <label htmlFor="recurrence_rule" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Recurrence Rule
                        </label>
                        <select
                          name="recurrence_rule"
                          id="recurrence_rule"
                          value={formData.recurrence_rule}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="" className="dark:bg-gray-700 dark:text-white">Select rule</option>
                          <option value="daily" className="dark:bg-gray-700 dark:text-white">Daily</option>
                          <option value="weekly" className="dark:bg-gray-700 dark:text-white">Weekly</option>
                          <option value="monthly" className="dark:bg-gray-700 dark:text-white">Monthly</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {errors.submit && (
              <div className="bg-red-50 dark:bg-red-900/30 px-4 py-3 text-center">
                <p className="text-sm text-red-700 dark:text-red-300">{errors.submit}</p>
              </div>
            )}
            <div className="bg-gray-50 dark:bg-gray-700/50 px-4 py-3 sm:px-6 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 mt-2 sm:mt-0"
              >
                {loading ? 'Saving...' : (isEditing ? 'Update Task' : 'Create Task')}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 sm:mt-0 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};