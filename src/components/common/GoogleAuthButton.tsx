'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { UserRole } from '@/types';

interface GoogleAuthButtonProps {
  role?: UserRole;
  text?: 'signin' | 'signup';
  className?: string;
  disabled?: boolean;
}

/**
 * Starts the server-side OAuth code flow. The Google Client ID and secret are
 * never read here — they stay in server-only environment variables used by the
 * /auth/google/start and /api/auth/callback/google route handlers.
 */
export function GoogleAuthButton({
  role = 'customer',
  text = 'signin',
  className = '',
  disabled = false,
}: GoogleAuthButtonProps) {
  const searchParams = useSearchParams();
  const from = searchParams.get('from');
  const targetRole: UserRole = role === 'vendor' ? 'vendor' : 'customer';

  const href =
    `/auth/google/start?role=${encodeURIComponent(targetRole)}` +
    (from ? `&from=${encodeURIComponent(from)}` : '');

  return (
    <a
      href={href}
      aria-disabled={disabled}
      className={`w-full flex items-center justify-center gap-2.5 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors shadow-xs cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed aria-disabled:opacity-60 aria-disabled:pointer-events-none ${className}`}
    >
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z" />
        <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
        <path fill="#FBBC05" d="M5.6 14.8c-.3-.8-.4-1.8-.4-2.8 0-1 .1-2 .4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z" />
        <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.4C3.7 20.4 7.5 23 12 23z" />
      </svg>
      <span>{text === 'signup' ? 'Sign up with Google' : 'Continue with Google'}</span>
    </a>
  );
}
