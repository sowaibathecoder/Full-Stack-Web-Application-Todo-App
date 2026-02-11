'use client';

import { useAuth } from '@/contexts/AuthContext';
import { UserProfileDropdown } from '@/components/UserProfileDropdown';
import { ThemeToggle } from '@/components/ThemeToggle';

export const Header = () => {
  const { user } = useAuth();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm dark:shadow-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <img src="/th-logo.svg" alt="Logo" className="h-8 w-auto mr-2" />
              <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">TaskHub</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {user && <UserProfileDropdown className="ml-4" />}
          </div>
        </div>
      </div>
    </header>
  );
};