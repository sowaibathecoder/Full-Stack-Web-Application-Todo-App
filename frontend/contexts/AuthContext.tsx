'use client';

import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { auth } from '@/lib/auth';

interface AuthContextType {
  user: any;
  loading: boolean;
  signIn: {
    email: (credentials: { email: string; password: string; redirectTo?: string }) => Promise<{ error?: { message: string } }>;
  };
  signUp: {
    email: (userData: { email: string; password: string; name: string; redirectTo?: string }) => Promise<{ error?: { message: string } }>;
  };
  signOut: any;
  getSession: any;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        setLoading(true);
        const sessionData = await auth.getSession();
        // Properly access the user from the session data
        setUser(sessionData?.data?.user || null);
      } catch (error) {
        console.error('Error fetching session:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();

    // Set up interval to periodically check session validity (every 5 minutes)
    const interval = setInterval(async () => {
      try {
        const sessionData = await auth.getSession();
        const currentUser = sessionData?.data?.user || null;

        // Update user state if it has changed
        if ((currentUser && !user) || (!currentUser && user) ||
            (currentUser?.id !== user?.id)) {
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Error checking session in interval:', error);
        // If session check fails, clear user state
        setUser(null);
      }
    }, 5 * 60 * 1000); // 5 minutes

    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, []);

  const signIn = auth.signIn;
  const signUp = auth.signUp;
  const signOut = async () => {
    try {
      await auth.signOut();
      setUser(null);
      // Clear any stored redirect URLs
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('redirectAfterLogin');
      }
    } catch (error) {
      console.error('Error during sign out:', error);
      // Still clear user state even if sign out fails
      setUser(null);
      sessionStorage.removeItem('redirectAfterLogin');
    }
  };

  const getSession = auth.getSession;

  // Function to manually refresh the session
  const refreshSession = async () => {
    try {
      setLoading(true);
      const sessionData = await auth.getSession();
      setUser(sessionData?.data?.user || null);
    } catch (error) {
      console.error('Error refreshing session:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    getSession,
    refreshSession
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};