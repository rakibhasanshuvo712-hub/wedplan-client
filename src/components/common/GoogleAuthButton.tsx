'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { UserRole, User } from '@/types';
import { toast } from 'sonner';

interface GoogleAuthButtonProps {
  role?: UserRole;
  text?: 'signin' | 'signup';
  onSuccess?: (user: User) => void;
  className?: string;
  disabled?: boolean;
}

const DEFAULT_GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
  '521916340203-6eaman0rp3k0o68tbj8dmvk1qbr9eohu.apps.googleusercontent.com';

export function GoogleAuthButton({
  role = 'customer',
  text = 'signin',
  onSuccess,
  className = '',
  disabled = false,
}: GoogleAuthButtonProps) {
  const { googleLogin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const loadGoogleScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') return resolve();
      if (window.google?.accounts?.oauth2) return resolve();

      const existingScript = document.getElementById('google-gsi-client');
      if (existingScript) {
        existingScript.addEventListener('load', () => resolve());
        existingScript.addEventListener('error', () =>
          reject(new Error('Failed to load Google SDK'))
        );
        return;
      }

      const script = document.createElement('script');
      script.id = 'google-gsi-client';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Google Identity Services SDK'));
      document.head.appendChild(script);
    });
  };

  const handleGoogleClick = async () => {
    if (disabled || isLoading) return;
    setIsLoading(true);

    try {
      await loadGoogleScript();

      if (!window.google?.accounts?.oauth2) {
        throw new Error('Google Identity Services is not available in your browser.');
      }

      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: DEFAULT_GOOGLE_CLIENT_ID,
        scope: 'email profile openid',
        callback: async (tokenResponse) => {
          if (tokenResponse.error) {
            setIsLoading(false);
            console.error('Google OAuth token error:', tokenResponse);
            toast.error(
              tokenResponse.error_description ||
                `Google sign-in was cancelled or encountered an error (${tokenResponse.error}).`
            );
            return;
          }

          try {
            // Fetch user profile from standard Google userinfo endpoint
            const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: {
                Authorization: `Bearer ${tokenResponse.access_token}`,
              },
            });

            if (!res.ok) {
              throw new Error('Failed to retrieve user profile from Google.');
            }

            const profile = await res.json();

            const loggedInUser = await googleLogin({
              email: profile.email,
              name: profile.name || profile.given_name || 'Google User',
              image: profile.picture || '',
              role: role,
              googleId: profile.sub,
            });

            toast.success(`Welcome, ${loggedInUser.name}!`);
            if (onSuccess) {
              onSuccess(loggedInUser);
            }
          } catch (err: unknown) {
            console.error('Google user processing error:', err);
            const message = err instanceof Error ? err.message : 'Google authentication failed.';
            toast.error(message);
          } finally {
            setIsLoading(false);
          }
        },
        error_callback: (err) => {
          setIsLoading(false);
          console.warn('Google OAuth dialog error:', err);
          toast.error('Google sign-in popup closed or blocked.');
        },
      });

      tokenClient.requestAccessToken({ prompt: 'select_account' });
    } catch (err: unknown) {
      setIsLoading(false);
      console.error('Failed to trigger Google login:', err);
      const message =
        err instanceof Error
          ? err.message
          : 'Google Sign-In failed to initialize. Please check your network connection.';
      toast.error(message);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleClick}
      disabled={disabled || isLoading}
      className={`w-full flex items-center justify-center gap-2.5 px-4 py-2.5 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors shadow-xs cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
    >
      {isLoading ? (
        <div className="w-4 h-4 border-2 border-rose-200 border-t-rose-600 rounded-full animate-spin" />
      ) : (
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
          <path
            fill="#EA4335"
            d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
          />
          <path
            fill="#4285F4"
            d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
          />
          <path
            fill="#FBBC05"
            d="M5.6 14.8c-.3-.8-.4-1.8-.4-2.8 0-1 .1-2 .4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z"
          />
          <path
            fill="#34A853"
            d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.4C3.7 20.4 7.5 23 12 23z"
          />
        </svg>
      )}
      <span>
        {isLoading
          ? 'Connecting to Google...'
          : text === 'signup'
          ? 'Sign up with Google'
          : 'Continue with Google'}
      </span>
    </button>
  );
}
