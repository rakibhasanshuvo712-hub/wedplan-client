'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { UserRole, User } from '@/types';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface GoogleAuthButtonProps {
  role?: UserRole;
  text?: 'signin' | 'signup';
  onSuccess?: (user: User) => void;
  className?: string;
  disabled?: boolean;
}

interface GoogleTokenResponse {
  access_token?: string;
  error?: string;
  error_description?: string;
}

// Public OAuth client ID. Google Identity Services works with a Client ID alone;
// the access token is verified by the backend against Google's userinfo endpoint.
const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
  '521916340203-6eaman0rp3k0o68tbj8dmvk1qbr9eohu.apps.googleusercontent.com';

const GIS_SCRIPT_ID = 'google-gsi-client';

function loadGoogleIdentityServices(): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Google sign-in is only available in the browser.'));
  }

  if (window.google?.accounts?.oauth2) {
    return Promise.resolve();
  }

  return new Promise<void>((resolve, reject) => {
    const markLoaded = () => {
      if (script) script.dataset.loaded = 'true';
      if (window.google?.accounts?.oauth2) resolve();
      else reject(new Error('Google Identity Services could not be initialised.'));
    };

    const script =
      (document.getElementById(GIS_SCRIPT_ID) as HTMLScriptElement | null) ||
      document.createElement('script');

    if (!script.parentNode) {
      script.id = GIS_SCRIPT_ID;
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = markLoaded;
      script.onerror = () => reject(new Error('Failed to load Google Identity Services.'));
      document.head.appendChild(script);
      return;
    }

    if (script.dataset.loaded === 'true') {
      markLoaded();
      return;
    }

    script.addEventListener('load', markLoaded, { once: true });
    script.addEventListener(
      'error',
      () => reject(new Error('Failed to load Google Identity Services.')),
      { once: true }
    );
  });
}

export function GoogleAuthButton({
  role = 'customer',
  text = 'signin',
  onSuccess,
  className = '',
  disabled = false,
}: GoogleAuthButtonProps) {
  const { googleLogin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    if (disabled || isLoading) return;
    setIsLoading(true);

    try {
      await loadGoogleIdentityServices();

      const targetRole: UserRole = role === 'vendor' ? 'vendor' : 'customer';

      const tokenResponse = await new Promise<GoogleTokenResponse>((resolve, reject) => {
        try {
          const tokenClient = window.google!.accounts.oauth2.initTokenClient({
            client_id: GOOGLE_CLIENT_ID,
            scope: 'openid email profile',
            callback: (response: GoogleTokenResponse) => {
              if (response.error || !response.access_token) {
                reject(
                  new Error(response.error_description || 'Google sign-in was cancelled.')
                );
                return;
              }
              resolve(response);
            },
            error_callback: () => reject(new Error('Google sign-in was cancelled or blocked.')),
          });

          tokenClient.requestAccessToken({ prompt: 'select_account' });
        } catch (error) {
          reject(error);
        }
      });

      const user = await googleLogin({
        accessToken: tokenResponse.access_token,
        role: targetRole,
      });

      toast.success(`Signed in successfully as ${user.name}. Welcome to WedPlan!`);
      onSuccess?.(user);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Google sign-in failed.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleSignIn}
      disabled={disabled || isLoading}
      className={`w-full flex items-center justify-center gap-2.5 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors shadow-xs cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
      ) : (
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
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
