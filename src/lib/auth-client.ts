'use client';

import { createAuthClient } from 'better-auth/react';

const baseURL =
  process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
  (process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/?$/, '')
    : 'https://wedplan-backend-inky.vercel.app');

export const authClient = createAuthClient({
  baseURL,
});

export const { signIn, signUp, useSession, signOut } = authClient;
