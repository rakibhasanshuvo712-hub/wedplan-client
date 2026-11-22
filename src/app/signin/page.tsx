'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GoogleAuthButton } from '@/components/common/GoogleAuthButton';
import { toast } from 'sonner';
import { Heart, Lock, Mail, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export default function SignInPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
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
  const googleError = searchParams.get('google_error');
  const { login } = useAuth();

  React.useEffect(() => {
    if (googleError) toast.error(googleError);
  }, [googleError]);

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

    if (!email.trim() || !password) {
      toast.error('Please enter both your email address and password.');
      return;
    }

    setIsLoading(true);
    try {
      const user = await login(email.trim(), password);
      toast.success(`Welcome back, ${user.name}!`);
      redirectByRole(user.role);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Sign in failed. Please try again.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gradient-to-br from-red-50 via-red-50/60 to-amber-50/70">
      {/* Decorative wedding-glow orbs */}
      <div className="aurora-orb absolute -top-28 -left-28 w-96 h-96 bg-red-300/45" aria-hidden="true" />
      <div className="aurora-orb aurora-orb--slow absolute top-24 -right-32 w-[420px] h-[420px] bg-violet-300/35" aria-hidden="true" />
      <div className="aurora-orb absolute -bottom-28 left-1/4 w-80 h-80 bg-amber-300/40" aria-hidden="true" />

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-4 rounded-full bg-white/70 border border-red-200/70 text-[10px] font-bold uppercase tracking-[0.2em] text-red-700 shadow-sm shadow-red-500/10 backdrop-blur-md">
          <Sparkles className="w-3 h-3 text-amber-500 fill-amber-300" /> Welcome Back
        </div>
        <Link href="/" className="inline-flex items-center gap-2 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 via-red-500 to-red-500 flex items-center justify-center text-white shadow-lg shadow-red-500/30 ring-4 ring-white/60 group-hover:scale-105 transition-transform">
            <Heart className="w-6 h-6 fill-white" />
          </div>
        </Link>
        <h2 className="mt-4 text-3xl font-serif font-bold text-gradient-rose">Sign In to WedPlan</h2>
        <p className="mt-1 text-sm text-slate-600">
          Access your wedding services, bookings, and dashboard
        </p>
      </div>

      <div className="relative z-10 mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="glass-card relative py-8 px-6 shadow-2xl shadow-red-500/10 sm:rounded-3xl sm:px-10 border border-white/80 ring-1 ring-red-100/70 space-y-6">
          <div className="absolute inset-x-8 top-0 h-1 rounded-full bg-gradient-to-r from-red-500 via-red-500 to-amber-400" aria-hidden="true" />
          <GoogleAuthButton text="signin" className="py-3 shadow-sm hover:shadow-md hover:shadow-red-500/10" />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-red-100" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-red-400 font-medium">or sign in with email</span>
            </div>
          </div>

          <form onSubmit={handleSignIn} className="space-y-4">
            <Input
              type="email"
              label="Email Address"
              required
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-4 h-4 text-red-500" />}
              className="hover:border-red-300 focus:border-red-500 focus:ring-red-400/30"
            />
            <Input
              type="password"
              label="Password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="w-4 h-4 text-red-500" />}
              className="hover:border-red-300 focus:border-red-500 focus:ring-red-400/30"
            />
            <Button
              type="submit"
              variant="primary"
              className="w-full shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/25"
              isLoading={isLoading}
            >
              Sign In
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </form>

          <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-gradient-to-r from-red-50 via-red-50 to-amber-50 border border-red-100 shadow-sm shadow-red-500/5">
            <ShieldCheck className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Administrators sign in here with their platform email and password. Customer and
              vendor accounts can also continue with Google.
            </p>
          </div>

          <div className="text-xs text-slate-500 pt-3 border-t border-red-100 text-center">
            Don&apos;t have an account yet?{' '}
            <Link
              href="/signup"
              className="font-semibold text-red-600 hover:text-red-600 transition-colors underline decoration-red-300 underline-offset-2"
            >
              Create one here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
