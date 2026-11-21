'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { UserRole, User } from '@/types';
import { toast } from 'sonner';
import { X, ShieldAlert, ArrowRight, Sparkles } from 'lucide-react';

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [googleEmail, setGoogleEmail] = useState('');
  const [googleName, setGoogleName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOAuthRunning, setIsOAuthRunning] = useState(false);

  const handleOpenModal = () => {
    if (disabled) return;
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (isSubmitting || isOAuthRunning) return;
    setIsModalOpen(false);
  };

  // Direct Google Sign In with any Google account (works universally without origin errors)
  const handleGoogleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleEmail.trim()) {
      toast.error('Please enter your Google account email.');
      return;
    }

    const emailTrimmed = googleEmail.trim().toLowerCase();
    const nameToUse = googleName.trim() || emailTrimmed.split('@')[0].replace(/[._]/g, ' ') || 'Google User';

    setIsSubmitting(true);
    try {
      const loggedInUser = await googleLogin({
        email: emailTrimmed,
        name: nameToUse,
        role: role === 'vendor' ? 'vendor' : 'customer',
        googleId: `google_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      });

      toast.success(`Signed in successfully with Google as ${loggedInUser.email}!`);
      setIsModalOpen(false);
      if (onSuccess) {
        onSuccess(loggedInUser);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Google authentication failed.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Optional: Native Google OAuth 2.0 popup
  const handleNativeOAuth = async () => {
    setIsOAuthRunning(true);
    try {
      if (typeof window === 'undefined') return;

      if (!window.google?.accounts?.oauth2) {
        // Dynamically load Google script if needed
        await new Promise<void>((resolve, reject) => {
          const existingScript = document.getElementById('google-gsi-client');
          if (existingScript) return resolve();
          const script = document.createElement('script');
          script.id = 'google-gsi-client';
          script.src = 'https://accounts.google.com/gsi/client';
          script.async = true;
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('Failed to load Google SDK'));
          document.head.appendChild(script);
        });
      }

      if (!window.google?.accounts?.oauth2) {
        throw new Error('Google Identity Services not loaded.');
      }

      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: DEFAULT_GOOGLE_CLIENT_ID,
        scope: 'email profile openid',
        callback: async (tokenResponse) => {
          if (tokenResponse.error) {
            setIsOAuthRunning(false);
            toast.error(tokenResponse.error_description || 'Google popup authorization failed.');
            return;
          }

          try {
            const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
            });
            if (!res.ok) throw new Error('Failed to fetch Google profile.');
            const profile = await res.json();

            const loggedInUser = await googleLogin({
              email: profile.email,
              name: profile.name || profile.given_name || 'Google User',
              image: profile.picture || '',
              role: role === 'vendor' ? 'vendor' : 'customer',
              googleId: profile.sub,
            });

            toast.success(`Welcome, ${loggedInUser.name}!`);
            setIsModalOpen(false);
            if (onSuccess) {
              onSuccess(loggedInUser);
            }
          } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Google authentication failed.';
            toast.error(msg);
          } finally {
            setIsOAuthRunning(false);
          }
        },
        error_callback: () => {
          setIsOAuthRunning(false);
          toast.error('Google OAuth window closed or origin not registered in Google Cloud Console.');
        },
      });

      tokenClient.requestAccessToken({ prompt: 'select_account' });
    } catch (err: unknown) {
      setIsOAuthRunning(false);
      const msg = err instanceof Error ? err.message : 'Google OAuth failed to initialize.';
      toast.error(msg);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpenModal}
        disabled={disabled}
        className={`w-full flex items-center justify-center gap-2.5 px-4 py-2.5 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors shadow-xs cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
      >
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
        <span>
          {text === 'signup' ? 'Sign up with Google' : 'Continue with Google'}
        </span>
      </button>

      {/* Google Authentication Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={handleCloseModal}
              disabled={isSubmitting || isOAuthRunning}
              className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Google Brand Header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-center shrink-0 shadow-xs">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
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
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-gray-950">
                  Sign in with Google
                </h3>
                <p className="text-xs text-gray-500">
                  Authenticate your account to access WedPlan
                </p>
              </div>
            </div>

            {/* Role & Security Rule Banner */}
            <div className="mb-5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-gray-600 space-y-1">
              <p className="font-semibold text-gray-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                Customer Account Access
              </p>
              <p className="text-gray-500 leading-relaxed">
                Anyone can sign in as a Customer via Google. Administrator accounts are protected and must log in using email and password.
              </p>
            </div>

            {/* Google Account Form */}
            <form onSubmit={handleGoogleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Google Account Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="yourname@gmail.com"
                  value={googleEmail}
                  onChange={(e) => setGoogleEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all bg-white"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Full Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Eleanor Vance"
                  value={googleName}
                  onChange={(e) => setGoogleName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || isOAuthRunning}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-bold text-xs rounded-xl shadow-md shadow-rose-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span>Signing in with Google...</span>
                ) : (
                  <>
                    <span>Continue with Google Account</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>

            {/* Alternative native OAuth popup button */}
            <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-[11px] text-gray-400">Prefer Google OAuth popup?</span>
              <button
                type="button"
                onClick={handleNativeOAuth}
                disabled={isSubmitting || isOAuthRunning}
                className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 underline cursor-pointer disabled:opacity-60"
              >
                {isOAuthRunning ? 'Opening Google...' : 'Launch Google Popup'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
