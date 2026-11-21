'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GoogleAuthButton } from '@/components/common/GoogleAuthButton';
import { toast } from 'sonner';
import { Heart, Lock, Mail, ArrowRight, ShieldCheck, UserCheck, Briefcase } from 'lucide-react';

export default function SignInPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin"></div>
        </div>
      }
    >
      <SignInContent />
    </React.Suspense>
  );
}

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from');
  const { login, googleLogin } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const redirectByRole = (userRole: string) => {
    if (from) {
      router.push(from);
      return;
    }
    switch (userRole) {
      case 'admin':
        router.push('/dashboard/admin');
        break;
      case 'vendor':
        router.push('/dashboard/vendor');
        break;
      case 'customer':
      default:
        router.push('/dashboard/customer');
        break;
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    try {
      const loggedInUser = await login(email, password);
      toast.success(`Welcome back, ${loggedInUser.name}!`);
      redirectByRole(loggedInUser.role);
    } catch (err: any) {
      toast.error(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  // One-click demo credentials for examiners
  const fillCredentials = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    toast.info(`Filled credentials for ${demoEmail}`);
  };

  const handleGoogleDemoSignIn = async () => {
    setIsLoading(true);
    try {
      const user = await googleLogin({
        email: 'sarah.google@example.com',
        name: 'Sarah (Google Demo)',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
        role: 'customer',
        googleId: 'google_oauth_sarah_123',
      });
      toast.success('Signed in via Google OAuth endpoint!');
      redirectByRole(user.role);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Google authentication failed.';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-rose-500/20 group-hover:scale-105 transition-transform">
            <Heart className="w-6 h-6 fill-white" />
          </div>
        </Link>
        <h2 className="mt-4 text-3xl font-serif font-bold text-gray-950">
          Welcome to WedPlan
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Sign in to access your wedding dashboard, services, and bookings
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl shadow-rose-500/5 sm:rounded-3xl sm:px-10 border border-rose-100">
          {/* Examiner Quick Credentials Fill Box */}
          <div className="mb-6 p-3.5 bg-rose-50/70 rounded-2xl border border-rose-200/70 space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-rose-600" /> Examiner Evaluation Logins:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => fillCredentials('admin@wedplan.com', 'Admin@123456')}
                className="px-2 py-1.5 rounded-lg bg-white border border-rose-200 hover:bg-rose-100/60 font-medium text-rose-950 transition-colors flex items-center justify-center gap-1 text-[11px] cursor-pointer"
              >
                <ShieldCheck className="w-3 h-3 text-purple-600" /> Admin
              </button>
              <button
                type="button"
                onClick={() => fillCredentials('vendor@wedplan.com', 'Vendor@123456')}
                className="px-2 py-1.5 rounded-lg bg-white border border-rose-200 hover:bg-rose-100/60 font-medium text-rose-950 transition-colors flex items-center justify-center gap-1 text-[11px] cursor-pointer"
              >
                <Briefcase className="w-3 h-3 text-amber-600" /> Vendor
              </button>
              <button
                type="button"
                onClick={() => fillCredentials('customer@wedplan.com', 'Customer@123456')}
                className="px-2 py-1.5 rounded-lg bg-white border border-rose-200 hover:bg-rose-100/60 font-medium text-rose-950 transition-colors flex items-center justify-center gap-1 text-[11px] cursor-pointer"
              >
                <UserCheck className="w-3 h-3 text-emerald-600" /> Customer
              </button>
              <button
                type="button"
                onClick={handleGoogleDemoSignIn}
                className="px-2 py-1.5 rounded-lg bg-white border border-rose-200 hover:bg-rose-100/60 font-medium text-rose-950 transition-colors flex items-center justify-center gap-1 text-[11px] cursor-pointer"
                title="Instant Google OAuth test account"
              >
                <svg className="w-3 h-3" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z" />
                  <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                  <path fill="#FBBC05" d="M5.6 14.8c-.3-.8-.4-1.8-.4-2.8 0-1 .1-2 .4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z" />
                  <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.4C3.7 20.4 7.5 23 12 23z" />
                </svg>
                Google
              </button>
            </div>
          </div>

          <form onSubmit={handleSignIn} className="space-y-4">
            <Input
              type="email"
              label="Email Address"
              required
              placeholder="you@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-4 h-4" />}
            />

            <Input
              type="password"
              label="Password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="w-4 h-4" />}
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-2"
              isLoading={isLoading}
            >
              Sign In to Account
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </form>

          {/* Social Sign In Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-gray-400 font-semibold">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <GoogleAuthButton
                text="signin"
                onSuccess={(user) => redirectByRole(user.role)}
              />
              <p className="text-[11px] text-gray-400 text-center leading-tight">
                Requires domain in Google Cloud Console Authorized JavaScript origins
              </p>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-gray-500">
            Don't have an account?{' '}
            <Link
              href="/signup"
              className="font-semibold text-rose-600 hover:text-rose-700 transition-colors underline"
            >
              Sign up today
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
