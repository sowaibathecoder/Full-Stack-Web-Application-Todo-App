'use client';

import { useAuth } from '@/contexts/AuthContext';
import { UserProfileDropdown } from '@/components/UserProfileDropdown';

export const Header = () => {
  const { user } = useAuth();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-indigo-600">Todo App</span>
            </div>
          </div>
          <div className="flex items-center">
            {user && <UserProfileDropdown className="ml-4" />}
          </div>
        </div>
      </div>
    </header>
  );
};