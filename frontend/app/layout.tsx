import { ReactNode } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import './globals.css';

interface RootLayoutProps {
  children: ReactNode;
}

// Server component metadata export
export const metadata = {
  title: 'Todo App - Manage Your Tasks',
  description: 'A secure, multi-user todo application with advanced features like priorities, tags, due dates, and recurring tasks.',
  keywords: 'todo, tasks, productivity, task management, web application',
  authors: [{ name: 'Todo App Team' }],
  creator: 'Todo App Team',
  publisher: 'Todo App Team',
  formatDetection: {
    telephone: false,
  },
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
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}

const Footer = () => {
  return (
    <footer className="bg-white mt-8 border-t">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <p className="text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Todo App. All rights reserved.
        </p>
      </div>
    </footer>
  );
};