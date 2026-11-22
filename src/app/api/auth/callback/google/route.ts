import { NextRequest, NextResponse } from 'next/server';
import {
  GOOGLE_OAUTH,
  assertGoogleConfig,
  getBackendApiUrl,
  getRedirectUri,
  safeInternalPath,
  signInWithError,
} from '@/lib/google-oauth';

interface GoogleTokenResponse {
  access_token?: string;
  id_token?: string;
  error?: string;
  error_description?: string;
}

interface GoogleTokenInfo {
  sub?: string;
  email?: string;
  email_verified?: string | boolean;
  aud?: string;
  iss?: string;
  exp?: string;
}

interface BackendAuthResponse {
  token?: string;
  user?: { role?: string };
  error?: string;
}

interface StoredOAuthState {
  state?: string;
  role?: string;
  from?: string;
}

/**
 * Step 2: Google redirects here with a one-time code. The code is exchanged for
 * tokens using the client SECRET on the server, the ID token is verified, and
 * the WedPlan backend issues the application session.
 */
export async function GET(request: NextRequest) {
  // The user cancelled or Google rejected the request.
  if (request.nextUrl.searchParams.get('error')) {
    return NextResponse.redirect(
      signInWithError(request, 'Google sign-in was cancelled or denied.'),
      302
    );
  }

  const code = request.nextUrl.searchParams.get('code');
  const state = request.nextUrl.searchParams.get('state');
  const stateCookie = request.cookies.get(GOOGLE_OAUTH.stateCookie)?.value;

  let saved: StoredOAuthState = {};
  if (stateCookie) {
    try {
      saved = JSON.parse(stateCookie) as StoredOAuthState;
    } catch {
      saved = {};
    }
  }

  if (!code || !state || !saved.state || state !== saved.state) {
    return NextResponse.redirect(
      signInWithError(request, 'Your Google sign-in session expired. Please try again.'),
      302
    );
  }

  try {
    assertGoogleConfig();

    // Exchange the authorization code. The client secret never leaves the server.
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_OAUTH.clientId,
        client_secret: GOOGLE_OAUTH.clientSecret,
        redirect_uri: getRedirectUri(request),
        grant_type: 'authorization_code',
      }),
      cache: 'no-store',
    });
    const tokens = (await tokenResponse.json().catch(() => null)) as GoogleTokenResponse | null;

    if (!tokenResponse.ok || !tokens?.access_token || !tokens.id_token) {
      console.error('Google token exchange failed:', tokens?.error || tokenResponse.status);
      return NextResponse.redirect(
        signInWithError(request, 'Google could not complete the sign-in. Please try again.'),
        302
      );
    }

    // Verify the ID token was issued for THIS OAuth client and is still valid.
    const infoResponse = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(tokens.id_token)}`,
      { cache: 'no-store' }
    );
    const info = (await infoResponse.json().catch(() => null)) as GoogleTokenInfo | null;
    const emailVerified = info?.email_verified === true || info?.email_verified === 'true';
    const issuerOk =
      info?.iss === 'https://accounts.google.com' || info?.iss === 'accounts.google.com';
    const notExpired = !info?.exp || Number(info.exp) > Math.floor(Date.now() / 1000);

    if (
      !infoResponse.ok ||
      !info?.sub ||
      !info?.email ||
      !emailVerified ||
      !issuerOk ||
      !notExpired ||
      info.aud !== GOOGLE_OAUTH.clientId
    ) {
      console.error('Google ID token verification failed for audience:', info?.aud);
      return NextResponse.redirect(
        signInWithError(request, 'Your Google identity could not be verified. Please try again.'),
        302
      );
    }

    // The backend verifies the access token with Google and creates the session.
    const authResponse = await fetch(`${getBackendApiUrl()}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        accessToken: tokens.access_token,
        role: saved.role === 'vendor' ? 'vendor' : 'customer',
      }),
      cache: 'no-store',
    });
    const authData = (await authResponse.json().catch(() => null)) as BackendAuthResponse | null;

    if (!authResponse.ok || !authData?.token) {
      console.error('Backend Google authentication failed:', authData?.error || authResponse.status);
      return NextResponse.redirect(
        signInWithError(
          request,
          authData?.error || 'We could not create your session. Please try again.'
        ),
        302
      );
    }

    const role =
      authData.user?.role === 'vendor'
        ? 'vendor'
        : authData.user?.role === 'admin'
          ? 'admin'
          : 'customer';
    const from = safeInternalPath(saved.from, `/dashboard/${role}`);

    // Hand the JWT to a tiny client page that copies it into localStorage,
    // then performs a full navigation so AuthProvider picks it up.
    const response = NextResponse.redirect(
      new URL(GOOGLE_OAUTH.completePath, request.nextUrl.origin).toString(),
      302
    );
    const secure = process.env.NODE_ENV === 'production';
    const cookieBase = {
      httpOnly: false,
      secure,
      sameSite: 'lax' as const,
      path: '/',
      maxAge: 60,
    };

    response.cookies.set({ ...cookieBase, name: GOOGLE_OAUTH.tokenCookie, value: authData.token });
    response.cookies.set({ ...cookieBase, name: GOOGLE_OAUTH.roleCookie, value: role });
    response.cookies.set({ ...cookieBase, name: GOOGLE_OAUTH.fromCookie, value: from });
    response.cookies.delete(GOOGLE_OAUTH.stateCookie);
    return response;
  } catch (error) {
    console.error('Google OAuth callback error:', error);
    return NextResponse.redirect(
      signInWithError(request, 'An unexpected error occurred during Google sign-in.'),
      302
    );
  }
}
