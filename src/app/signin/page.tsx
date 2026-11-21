'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GoogleAuthButton } from '@/components/common/GoogleAuthButton';
import { toast } from 'sonner';
import { Heart, Lock, Mail, ArrowRight, Shield } from 'lucide-react';

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
  const { login } = useAuth();

  const [isAdminPortalOpen, setIsAdminPortalOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [isAdminLoading, setIsAdminLoading] = useState(false);

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

  const handleAdminSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEmail || !adminPassword) {
      toast.error('Please enter administrator email and password.');
      return;
    }

    setIsAdminLoading(true);
    try {
      const loggedInUser = await login(adminEmail, adminPassword);
      if (loggedInUser.role !== 'admin') {
        toast.error('Only administrator accounts can use this portal. Please sign in with Google above.');
        setIsAdminLoading(false);
        return;
      }
      toast.success(`Welcome back, ${loggedInUser.name}!`);
      redirectByRole('admin');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Admin login failed.';
      toast.error(msg);
    } finally {
      setIsAdminLoading(false);
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
          Sign In to WedPlan
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Access your wedding services, bookings, and dashboard
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl shadow-rose-500/5 sm:rounded-3xl sm:px-10 border border-rose-100 text-center space-y-6">
          {/* Primary Google Login Section */}
          <div className="space-y-4">
            <div className="p-5 bg-gradient-to-br from-rose-50/80 to-pink-50/40 rounded-2xl border border-rose-100/80 text-left space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-100/70 px-2.5 py-0.5 rounded-full">
                Google Authentication
              </span>
              <p className="text-xs text-gray-600 leading-relaxed">
                WedPlan uses Google Login for instant, secure access. Customers and Vendors can sign in with their Google account in one click.
              </p>
            </div>

            <GoogleAuthButton
              text="signin"
              className="py-3 text-sm shadow-sm hover:shadow-md"
              onSuccess={(user) => redirectByRole(user.role)}
            />
          </div>

          <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
            Don't have an account yet?{' '}
            <Link
              href="/signup"
              className="font-semibold text-rose-600 hover:text-rose-700 transition-colors underline"
            >
              Sign up with Google
            </Link>
          </div>

          {/* Discreet Admin Portal Toggle */}
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => setIsAdminPortalOpen(!isAdminPortalOpen)}
              className="text-[11px] text-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center gap-1 mx-auto cursor-pointer"
            >
              <Shield className="w-3 h-3 text-gray-400" />
              <span>{isAdminPortalOpen ? 'Hide Administrator Login' : 'Administrator Login'}</span>
            </button>

            {isAdminPortalOpen && (
              <form onSubmit={handleAdminSignIn} className="mt-4 pt-4 border-t border-gray-100 text-left space-y-3 animate-in fade-in duration-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                  Admin Credentials Portal
                </span>
                <Input
                  type="email"
                  label="Admin Email"
                  required
                  placeholder="admin@wedplan.com"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  icon={<Mail className="w-3.5 h-3.5" />}
                />
                <Input
                  type="password"
                  label="Admin Password"
                  required
                  placeholder="••••••••"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  icon={<Lock className="w-3.5 h-3.5" />}
                />
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  className="w-full text-xs"
                  isLoading={isAdminLoading}
                >
                  Sign In as Administrator
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
