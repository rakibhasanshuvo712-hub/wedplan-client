'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

function readCookie(name: string): string | null {
  const prefix = `${name}=`;
  const parts = document.cookie ? document.cookie.split('; ') : [];
  for (const part of parts) {
    if (part.startsWith(prefix)) return decodeURIComponent(part.slice(prefix.length));
  }
  return null;
}

/**
 * Final hop of the server-side Google OAuth flow. The callback route handler
 * stores the JWT in short-lived cookies (a route handler cannot write
 * localStorage); this page copies it into the session storage used by the rest
 * of the app and then navigates normally so AuthProvider re-initialises.
 */
export default function GoogleCompletePage() {
  const [message, setMessage] = useState('Signing you in with Google…');

  useEffect(() => {
    const token = readCookie('wedplan_token');
    const role = readCookie('wedplan_role') || 'customer';
    const from = readCookie('wedplan_oauth_from') || `/dashboard/${role}`;
    const user = readCookie('wedplan_oauth_user');

    if (!token) {
      setMessage('We could not complete your Google sign-in. Taking you back to sign in…');
      const timer = window.setTimeout(() => {
        window.location.replace('/signin?google_error=Google%20session%20expired.%20Please%20try%20again.');
      }, 1200);
      return () => window.clearTimeout(timer);
    }

    localStorage.setItem('wedplan_token', token);
    // Store the fresh user returned by the backend so a stale customer record
    // from an earlier session can never survive a vendor sign-in.
    if (user) localStorage.setItem('wedplan_user', user);

    // Match the persistent cookies written by AuthContext.saveAuthSession().
    document.cookie = `wedplan_token=${token}; path=/; max-age=604800; SameSite=Lax`;
    document.cookie = `wedplan_role=${role}; path=/; max-age=604800; SameSite=Lax`;
    document.cookie = 'wedplan_oauth_from=; path=/; max-age=0';
    document.cookie = 'wedplan_oauth_user=; path=/; max-age=0';

    const target = from.startsWith('/') && !from.startsWith('//') ? from : `/dashboard/${role}`;
    window.location.replace(target);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-red-50 via-rose-50/60 to-red-100/50">
      <Loader2 className="w-8 h-8 animate-spin text-red-500" />
      <p className="text-sm text-gray-600">{message}</p>
    </div>
  );
}
