'use client';

import { useState, useEffect } from 'react';
import { TaskRead } from '@/types/tasks';
import { taskApi } from '@/lib/api';
import { TaskItem } from './TaskItem';
import { TaskFormModal } from './TaskFormModal';
import { DeleteConfirmation } from './DeleteConfirmation';
import { FilterBar } from './FilterBar';
import { NotificationToast } from './NotificationToast';

export const TaskList = () => {
  const [tasks, setTasks] = useState<TaskRead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskRead | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingTask, setDeletingTask] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Task counters
  const [totalTasks, setTotalTasks] = useState(0);
  const [pendingTasks, setPendingTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);

  // Filter states
  const [filters, setFilters] = useState({
    status: 'all',
    priority: '',
    tag: '',
    search: '',
    due_before: '',
    due_after: '',
    sort: 'created_at',
    order: 'desc'
  });

  // Calculate task counts
  const calculateTaskCounts = (tasksArray: TaskRead[]) => {
    const total = tasksArray.length;
    const completed = tasksArray.filter(task => task.completed).length;
    const pending = total - completed;
    
    setTotalTasks(total);
    setCompletedTasks(completed);
    setPendingTasks(pending);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Update counts when tasks change
  useEffect(() => {
    calculateTaskCounts(tasks);
  }, [tasks]);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000); // Auto-hide after 5 seconds
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await taskApi.getTasks(filters);
      setTasks(data);
    } catch (err) {
      setError('Failed to load tasks');
      showNotification('error', 'Failed to load tasks');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (newFilters: {
    status: string;
    priority: string;
    tag: string;
    search: string;
    due_before: string;
    due_after: string;
    sort: string;
    order: string;
  }) => {
    setFilters(newFilters);
    // Fetch tasks with new filters
    fetchTasksWithFilters(newFilters);
  };

  const fetchTasksWithFilters = async (filterParams: {
    status: string;
    priority: string;
    tag: string;
    search: string;
    due_before: string;
    due_after: string;
    sort: string;
    order: string;
  }) => {
    try {
      setLoading(true);
      const data = await taskApi.getTasks(filterParams);
      setTasks(data);
    } catch (err) {
      setError('Failed to load tasks');
      showNotification('error', 'Failed to load tasks');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskCreated = (newTask: TaskRead) => {
    setTasks(prevTasks => [newTask, ...prevTasks]);
    setShowModal(false);
    showNotification('success', 'Task created successfully');
  };

  const handleTaskUpdated = (updatedTask: TaskRead) => {
    setTasks(prevTasks => {
      // Create a new array to force re-render
      const newTasks = [...prevTasks];
      const taskIndex = newTasks.findIndex(task => task.id === updatedTask.id);
      
      if (taskIndex !== -1) {
        newTasks[taskIndex] = { ...updatedTask }; // Create new object to ensure change detection
      }
      
      return newTasks;
    });
    setEditingTask(null);
    setShowModal(false);
    showNotification('success', 'Task updated successfully');
  };

  const handleTaskDeleted = (taskId: number) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    setTaskToDelete(null);
    setShowDeleteModal(false);
    showNotification('success', 'Task deleted successfully');
  };

  const handleTaskToggled = (updatedTask: TaskRead) => {
    setTasks(prevTasks => {
      // Create a new array to force re-render
      const newTasks = [...prevTasks];
      const taskIndex = newTasks.findIndex(t => t.id === updatedTask.id);
      
      if (taskIndex !== -1) {
        newTasks[taskIndex] = { ...updatedTask }; // Create new object to ensure change detection
      }
      
      return newTasks;
    });
    showNotification('success', updatedTask.completed ? 'Task marked as completed' : 'Task marked as pending');
  };

  const handleEditClick = (task: TaskRead) => {
    setEditingTask(task);
    setShowModal(true);
  };

  const handleDeleteClick = (taskId: number) => {
    setTaskToDelete(taskId);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async (taskId: number) => {
    try {
      setDeletingTask(true);
      await taskApi.deleteTask(taskId);
      setTasks(tasks.filter(task => task.id !== taskId));
      setTaskToDelete(null);
      setShowDeleteModal(false);
      showNotification('success', 'Task deleted successfully');
    } catch (err) {
      setError('Failed to delete task');
      showNotification('error', 'Failed to delete task');
      console.error('Error deleting task:', err);
    } finally {
      setDeletingTask(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {/* Loading skeleton for the "Add Task" button and filters */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full sm:w-32 animate-pulse"></div>
        </div>

        {/* Loading skeleton for filters */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6 animate-pulse">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
            <div className="space-y-2 sm:col-span-2 lg:col-span-1">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
            <div className="space-y-2 sm:col-span-2 lg:col-span-1">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
          <div className="mt-4 flex flex-col sm:flex-row sm:space-x-3 space-y-2 sm:space-y-0">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full sm:w-32"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full sm:w-32"></div>
          </div>
        </div>

        {/* Loading skeleton for tasks */}
        {[...Array(5)].map((_, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow animate-pulse">
            <div className="flex items-center">
              <div className="flex items-center h-5">
                <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="ml-3 flex-1">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full max-w-md mb-2"></div>
                <div className="flex flex-wrap gap-2 mt-2">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-16"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20"></div>
                </div>
              </div>
              <div className="ml-4 flex space-x-2">
                <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-700 p-4 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400 dark:text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Task Counters Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 border border-blue-100 dark:border-blue-800/50">
          <div className="text-sm text-blue-800 dark:text-blue-200 font-medium">Total Tasks</div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-300 mt-1">{totalTasks}</div>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/30 rounded-lg p-4 border border-yellow-100 dark:border-yellow-800/50">
          <div className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">Pending Tasks</div>
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-300 mt-1">{pendingTasks}</div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-4 border border-green-100 dark:border-green-800/50">
          <div className="text-sm text-green-800 dark:text-green-200 font-medium">Completed Tasks</div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-300 mt-1">{completedTasks}</div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Tasks</h2>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full sm:w-auto"
        >
          Add Task
        </button>
      </div>

      {/* Filter Bar */}
      <FilterBar initialFilters={filters} onFiltersChange={handleFiltersChange} />

      {tasks.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No tasks</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating a new task.</p>
          <div className="mt-6">
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 w-full sm:w-auto"
            >
              Add Task
            </button>
          </div>
        </div>
      ) : (
        <ul className="space-y-3">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={handleTaskToggled}
              onEdit={() => handleEditClick(task)}
              onDelete={handleDeleteClick}
            />
          ))}
        </ul>
      )}

      {showModal && (
        <TaskFormModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setEditingTask(null);
          }}
          task={editingTask}
          onSave={editingTask ? handleTaskUpdated : handleTaskCreated}
        />
      )}

      {showDeleteModal && taskToDelete && (
        <DeleteConfirmation
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setTaskToDelete(null);
          }}
          onConfirm={handleDeleteConfirm}
          taskId={taskToDelete}
          loading={deletingTask}
        />
      )}

      {notification && (
        <NotificationToast
          type={notification.type}
          message={notification.message}
          duration={5000}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
};