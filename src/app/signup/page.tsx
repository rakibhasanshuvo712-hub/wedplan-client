'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GoogleAuthButton } from '@/components/common/GoogleAuthButton';
import { toast } from 'sonner';
import { Heart, Lock, Mail, User, Building2, ArrowRight, Sparkles } from 'lucide-react';

export default function SignUpPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin"></div>
        </div>
      }
    >
      <SignUpContent />
    </React.Suspense>
  );
}

function SignUpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = (searchParams.get('role') as UserRole) || 'customer';
  const { register } = useAuth();

  const [role, setRole] = useState<UserRole>(initialRole === 'vendor' ? 'vendor' : 'customer');
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam === 'vendor') {
      setRole('vendor');
    } else if (roleParam === 'customer') {
      setRole('customer');
    }
  }, [searchParams]);

  const hasMinLen = password.length >= 6;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.error('Please fill in all required fields.');
      return;
    }

    if (!hasMinLen || !hasUpper || !hasLower) {
      toast.error('Password must be at least 6 characters with uppercase and lowercase letters.');
      return;
    }

    setIsLoading(true);
    try {
      const newUser = await register({
        name,
        email,
        password,
        role,
        businessName: role === 'vendor' ? (businessName || name) : undefined,
      });

      toast.success(`Welcome to WedPlan, ${newUser.name}!`);
      if (newUser.role === 'vendor') {
        router.push('/dashboard/vendor');
      } else {
        router.push('/dashboard/customer');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed.';
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
          Create Your WedPlan Account
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Join couples & vendors on the nation's premier wedding platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl shadow-rose-500/5 sm:rounded-3xl sm:px-10 border border-rose-100 space-y-6">
          {/* Role Selection Toggle */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2 text-center">
              Register as:
            </label>
            <div className="grid grid-cols-2 gap-3 p-1.5 bg-rose-50/60 rounded-2xl border border-rose-100">
              <button
                type="button"
                onClick={() => setRole('customer')}
                className={`py-2.5 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  role === 'customer'
                    ? 'bg-white text-rose-600 shadow-sm border border-rose-200'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <User className="w-3.5 h-3.5" /> Couple / Customer
              </button>
              <button
                type="button"
                onClick={() => setRole('vendor')}
                className={`py-2.5 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  role === 'vendor'
                    ? 'bg-white text-rose-600 shadow-sm border border-rose-200'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" /> Wedding Vendor
              </button>
            </div>
          </div>

          {role === 'vendor' && (
            <div className="p-3.5 bg-amber-50/90 rounded-2xl border border-amber-200/90 text-amber-900 text-xs animate-in fade-in duration-200">
              <div className="font-semibold flex items-center gap-1.5 text-amber-900 mb-1">
                <Sparkles className="w-4 h-4 text-amber-600 fill-amber-300" />
                Wedding Vendor Registration
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                Publish up to 3 services free, manage bookings, and upgrade to Premium anytime via Stripe!
              </p>
            </div>
          )}

          {/* Primary Google Sign Up */}
          <div className="space-y-3">
            <GoogleAuthButton
              role={role}
              text="signup"
              className="py-3 text-sm shadow-sm hover:shadow-md"
              onSuccess={(user) => {
                if (user.role === 'vendor') {
                  router.push('/dashboard/vendor');
                } else {
                  router.push('/dashboard/customer');
                }
              }}
            />
            <p className="text-[11px] text-gray-400 text-center">
              Instant registration powered by Google & Better Auth
            </p>
          </div>

          <div className="text-center text-xs text-gray-500 pt-2 border-t border-gray-100">
            Already have an account?{' '}
            <Link
              href="/signin"
              className="font-semibold text-rose-600 hover:text-rose-700 transition-colors underline"
            >
              Sign in with Google
            </Link>
          </div>

          {/* Optional manual registration toggle */}
          <div className="text-center pt-1">
            <button
              type="button"
              onClick={() => setShowEmailForm(!showEmailForm)}
              className="text-[11px] text-gray-400 hover:text-gray-600 underline cursor-pointer"
            >
              {showEmailForm ? 'Hide manual email form' : 'Register with email address instead'}
            </button>

            {showEmailForm && (
              <form onSubmit={handleSignUp} className="mt-4 pt-4 border-t border-gray-100 text-left space-y-3 animate-in fade-in duration-200">
                <Input
                  label="Full Name *"
                  required
                  placeholder="Eleanor Vance"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Input
                  type="email"
                  label="Email Address *"
                  required
                  placeholder="you@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  icon={<Mail className="w-4 h-4" />}
                />
                <Input
                  type="password"
                  label="Password *"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon={<Lock className="w-4 h-4" />}
                />
                {role === 'vendor' && (
                  <Input
                    label="Business / Studio Name"
                    placeholder="Grand Elegance Studios"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                  />
                )}
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full text-xs"
                  isLoading={isLoading}
                >
                  Create Account
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
