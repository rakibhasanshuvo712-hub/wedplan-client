import type { NextRequest } from 'next/server';

/**
 * Server-only Google OAuth configuration.
 *
 * These variables deliberately do NOT use the NEXT_PUBLIC_ prefix: the client
 * secret must never be bundled into browser JavaScript. Only the Next.js route
 * handlers under /auth/google import this module.
 */
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

export const GOOGLE_OAUTH = {
  clientId: CLIENT_ID || '',
  clientSecret: CLIENT_SECRET || '',
  stateCookie: 'wedplan_oauth_state',
  tokenCookie: 'wedplan_token',
  roleCookie: 'wedplan_role',
  fromCookie: 'wedplan_oauth_from',
  callbackPath: '/api/auth/callback/google',
  completePath: '/auth/google/complete',
  signInPath: '/signin',
} as const;

export function assertGoogleConfig(): void {
  if (!GOOGLE_OAUTH.clientId || !GOOGLE_OAUTH.clientSecret) {
    throw new Error(
      'Google OAuth is not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET on the server.'
    );
  }
}

/** The redirect URI must match one registered for this client in Google Cloud Console. */
export function getRedirectUri(request: NextRequest): string {
  const configured = process.env.GOOGLE_REDIRECT_URI;
  if (configured && configured.trim()) return configured.trim();
  return new URL(GOOGLE_OAUTH.callbackPath, request.nextUrl.origin).toString();
}

/** Absolute backend URL for server-side fetches (relative /api is browser-only). */
export function getBackendApiUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  const isProduction = process.env.NODE_ENV === 'production' || !!process.env.VERCEL;
  const productionUrl = 'https://wedplan-backend-inky.vercel.app/api';

  if (isProduction && (!envUrl || envUrl.includes('localhost'))) return productionUrl;
  if (envUrl && /^https?:\/\//i.test(envUrl)) return envUrl.replace(/\/$/, '');
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}/api`;
  return 'http://localhost:5000/api';
}

/** Only allow same-site internal paths to be used as a post-login destination. */
export function safeInternalPath(value: string | null | undefined, fallback: string): string {
  if (
    !value ||
    !value.startsWith('/') ||
    value.startsWith('//') ||
    value.includes('\\') ||
    /[\r\n]/.test(value)
  ) {
    return fallback;
  }
  return value;
}

export function signInWithError(request: NextRequest, message: string): URL {
  const url = new URL(GOOGLE_OAUTH.signInPath, request.nextUrl.origin);
  url.searchParams.set('google_error', message);
  return url;
}
