'use client';

import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { auth } from '@/lib/auth';

interface AuthContextType {
  user: any;
  loading: boolean;
  signIn: any;
  signUp: any;
  signOut: any;
  getSession: any;
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
  }, []);

  const signIn = auth.signIn;
  const signUp = auth.signUp;
  const signOut = async () => {
    await auth.signOut();
    setUser(null);
  };

  const getSession = auth.getSession;

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    getSession
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};