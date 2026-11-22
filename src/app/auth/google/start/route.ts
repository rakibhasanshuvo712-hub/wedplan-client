import { NextRequest, NextResponse } from 'next/server';
import {
  GOOGLE_OAUTH,
  assertGoogleConfig,
  getRedirectUri,
  safeInternalPath,
  signInWithError,
} from '@/lib/google-oauth';

interface StoredOAuthState {
  state: string;
  role: string;
  from: string;
  issuedAt: number;
}

/** Step 1: send the browser to Google's consent screen with a CSRF state value. */
export async function GET(request: NextRequest) {
  try {
    assertGoogleConfig();
  } catch {
    return NextResponse.redirect(
      signInWithError(request, 'Google sign-in is not configured on the server.'),
      302
    );
  }

  const role = request.nextUrl.searchParams.get('role') === 'vendor' ? 'vendor' : 'customer';
  const from = safeInternalPath(request.nextUrl.searchParams.get('from'), '');
  const state = crypto.randomUUID();

  const authorizationUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authorizationUrl.searchParams.set('client_id', GOOGLE_OAUTH.clientId);
  authorizationUrl.searchParams.set('redirect_uri', getRedirectUri(request));
  authorizationUrl.searchParams.set('response_type', 'code');
  authorizationUrl.searchParams.set('scope', 'openid email profile');
  authorizationUrl.searchParams.set('state', state);
  authorizationUrl.searchParams.set('prompt', 'select_account');
  authorizationUrl.searchParams.set('access_type', 'online');
  authorizationUrl.searchParams.set('include_granted_scopes', 'true');

  const storedState: StoredOAuthState = {
    state,
    role,
    from,
    issuedAt: Date.now(),
  };

  const response = NextResponse.redirect(authorizationUrl.toString(), 302);
  response.cookies.set({
    name: GOOGLE_OAUTH.stateCookie,
    value: JSON.stringify(storedState),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 10,
  });
  return response;
}
