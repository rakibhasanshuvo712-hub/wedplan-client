'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { User, UserRole } from '@/types';
import { api, ApiError } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (payload: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    image?: string;
    businessName?: string;
  }) => Promise<User>;
  googleLogin: (payload: {
    role: UserRole;
    accessToken?: string;
    idToken?: string;
    email?: string;
    name?: string;
    image?: string;
    googleId?: string;
  }) => Promise<User>;
  logout: () => void;
  updateUserProfile: (data: Partial<User>) => Promise<User>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('wedplan_token');
    localStorage.removeItem('wedplan_user');
    document.cookie = 'wedplan_token=; path=/; max-age=0';
    document.cookie = 'wedplan_role=; path=/; max-age=0';
    router.push('/signin');
  }, [router]);

  const saveAuthSession = (authToken: string, authUser: User) => {
    setToken(authToken);
    setUser(authUser);
    localStorage.setItem('wedplan_token', authToken);
    localStorage.setItem('wedplan_user', JSON.stringify(authUser));
    // Also set document cookie for middleware or SSR checking
    document.cookie = `wedplan_token=${authToken}; path=/; max-age=604800; SameSite=Lax`;
    document.cookie = `wedplan_role=${authUser.role}; path=/; max-age=604800; SameSite=Lax`;
  };

  // Load user from storage and verify with backend
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem('wedplan_token');
        const storedUser = localStorage.getItem('wedplan_user');

        if (!storedToken) {
          setIsLoading(false);
          return;
        }

        setToken(storedToken);

        // Preload stored user immediately to prevent flash of unauthenticated state on page reload
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch {
            // Ignore parse error
          }
        }

        const res = await api.get('/auth/me');
        if (res?.data?.user) {
          setUser(res.data.user);
          localStorage.setItem('wedplan_user', JSON.stringify(res.data.user));
        } else {
          logout();
        }
      } catch (err: unknown) {
        console.error('Session verification error:', err);
        const isAuthError =
          (err as { statusCode?: number })?.statusCode === 401 ||
          (err as { response?: { status?: number } })?.response?.status === 401;

        if (isAuthError) {
          logout();
        }
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [logout]);

  const login = async (email: string, password: string): Promise<User> => {
    const res = await api.post('/auth/login', { email, password });
    const { token: receivedToken, user: receivedUser } = res.data;
    saveAuthSession(receivedToken, receivedUser);
    return receivedUser;
  };

  const register = async (payload: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    image?: string;
    businessName?: string;
  }): Promise<User> => {
    const res = await api.post('/auth/register', payload);
    const { token: receivedToken, user: receivedUser } = res.data;
    saveAuthSession(receivedToken, receivedUser);
    return receivedUser;
  };

  const googleLogin = async (payload: {
    role: UserRole;
    accessToken?: string;
    idToken?: string;
    email?: string;
    name?: string;
    image?: string;
    googleId?: string;
  }): Promise<User> => {
    const res = await api.post('/auth/google', payload);
    const { token: receivedToken, user: receivedUser } = res.data;
    saveAuthSession(receivedToken, receivedUser);
    return receivedUser;
  };

  const updateUserProfile = async (data: Partial<User>): Promise<User> => {
    const res = await api.put('/auth/profile', data);
    const updatedUser = res.data.user;
    setUser(updatedUser);
    localStorage.setItem('wedplan_user', JSON.stringify(updatedUser));
    return updatedUser;
  };

  const refreshUser = async () => {
    try {
      const res = await api.get('/auth/me');
      if (res?.data?.user) {
        setUser(res.data.user);
        localStorage.setItem('wedplan_user', JSON.stringify(res.data.user));
      }
    } catch (e) {
      console.error('Failed to refresh user:', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user && !user.isBlocked,
        login,
        register,
        googleLogin,
        logout,
        updateUserProfile,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
