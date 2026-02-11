'use client';

export const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t dark:border-gray-700">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
          © {new Date().getFullYear()} TaskHub. All rights reserved.
        </p>
      </div>
    </footer>
  );
};