'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { BetterAuthProvider } from '@/lib/auth';
import { UserProfileDropdown } from '@/components/UserProfileDropdown';
import { AuthProvider } from '@/contexts/AuthContext';

interface RootLayoutProps {
  children: ReactNode;
}

function AuthenticatedLayout({ children }: RootLayoutProps) {
  const { user, loading } = useAuth(); // Changed from isPending to loading
  const router = useRouter();

  useEffect(() => {
    // If user is not logged in and not on auth pages, redirect to login
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Show loading state while checking auth status
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // If user is not logged in, don't render the protected layout
  if (!user) {
    return null; // The redirect happens in the effect
  }

  return (
    <>
      {/* Navigation Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-indigo-600">Todo App</span>
              </div>
            </div>
            <div className="flex items-center">
              <UserProfileDropdown className="ml-4" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white mt-8 border-t">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} Todo App. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}

export const metadata = {
  title: 'Todo App - Manage Your Tasks',
  description: 'A secure, multi-user todo application with advanced features like priorities, tags, due dates, and recurring tasks.',
  keywords: 'todo, tasks, productivity, task management, web application',
  authors: [{ name: 'Todo App Team' }],
  creator: 'Todo App Team',
  publisher: 'Todo App Team',
  formatDetection: 'telephone=no',
  openGraph: {
    title: 'Todo App - Manage Your Tasks',
    description: 'A secure, multi-user todo application with advanced features like priorities, tags, due dates, and recurring tasks.',
    url: 'https://todo-app.example.com',
    siteName: 'Todo App',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Todo App - Manage Your Tasks',
    description: 'A secure, multi-user todo application with advanced features like priorities, tags, due dates, and recurring tasks.',
  },
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <BetterAuthProvider>
          <AuthProvider>
            <div className="min-h-screen flex flex-col">
              <AuthenticatedLayout>{children}</AuthenticatedLayout>
            </div>
          </AuthProvider>
        </BetterAuthProvider>
      </body>
    </html>
  );
}