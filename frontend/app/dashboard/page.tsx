'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { TaskList } from '@/components/TaskList';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // If user is not authenticated and auth loading is complete, redirect to login
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [authLoading, user, router]);

  // Show loading state while checking auth
  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  // If user is not authenticated after loading, show redirecting message
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center">
        <p className="text-lg text-gray-600 dark:text-gray-300">Redirecting to login...</p>
      </div>
    );
  }

  // User is authenticated, show the dashboard
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">My Tasks</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Manage your tasks efficiently</p>
      </div>

      <TaskList />
    </div>
  );
}
