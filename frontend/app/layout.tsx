import { ReactNode } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
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
    <html lang="en" className="light" suppressHydrationWarning>
      <body className="bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
        <ThemeProvider>
          <AuthProvider>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
};