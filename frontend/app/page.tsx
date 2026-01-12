import { useState, useEffect } from 'react';
import { TaskList } from '@/components/TaskList';
import { EmptyState } from '@/components/EmptyState';

export const metadata = {
  title: 'Dashboard - Todo App',
  description: 'View and manage your tasks in your Todo App dashboard.',
};

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [hasTasks, setHasTasks] = useState(false);

  useEffect(() => {
    // Simulate loading time for initial data fetch
    const timer = setTimeout(() => {
      setLoading(false);
      // In a real app, this would be determined by the actual task data
      // For now, we'll assume there might be tasks after loading
      setHasTasks(false); // Assuming initially no tasks for empty state demo
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
        <p className="mt-2 text-gray-600">Manage your tasks efficiently</p>
      </div>

      <TaskList />
    </div>
  );
}
