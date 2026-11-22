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
import { Heart, Lock, Mail, User, Building2, ArrowRight, Sparkles, Check } from 'lucide-react';

export default function SignUpPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
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
  const googleError = searchParams.get('google_error');
  const { register } = useAuth();

  React.useEffect(() => {
    if (googleError) toast.error(googleError);
  }, [googleError]);

  const [role, setRole] = useState<UserRole>(initialRole === 'vendor' ? 'vendor' : 'customer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam === 'vendor') setRole('vendor');
    else if (roleParam === 'customer') setRole('customer');
  }, [searchParams]);

  const hasMinLen = password.length >= 6;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password) {
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
        name: name.trim(),
        email: email.trim(),
        password,
        role,
        businessName: role === 'vendor' ? businessName.trim() || name.trim() : undefined,
      });

      toast.success(`Welcome to WedPlan, ${newUser.name}!`);
      router.push(newUser.role === 'vendor' ? '/dashboard/vendor' : '/dashboard/customer');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gradient-to-br from-red-50 via-red-50/60 to-orange-50/70">
      {/* Decorative wedding-glow orbs */}
      <div className="aurora-orb absolute -top-28 -right-24 w-96 h-96 bg-red-300/45" aria-hidden="true" />
      <div className="aurora-orb aurora-orb--slow absolute top-1/3 -left-32 w-[420px] h-[420px] bg-violet-300/35" aria-hidden="true" />
      <div className="aurora-orb absolute -bottom-28 right-1/4 w-80 h-80 bg-amber-300/45" aria-hidden="true" />

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-4 rounded-full bg-white/70 border border-amber-200/70 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-700 shadow-sm shadow-amber-500/10 backdrop-blur-md">
          <Sparkles className="w-3 h-3 text-red-500 fill-red-300" /> Let&apos;s Plan Together
        </div>
        <Link href="/" className="inline-flex items-center gap-2 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 via-red-500 to-red-500 flex items-center justify-center text-white shadow-lg shadow-red-500/30 ring-4 ring-white/60 group-hover:scale-105 transition-transform">
            <Heart className="w-6 h-6 fill-white" />
          </div>
        </Link>
        <h2 className="mt-4 text-3xl font-serif font-bold text-gradient-aurora shimmer-text">
          Create Your WedPlan Account
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Join couples &amp; vendors on the nation&apos;s premier wedding platform
        </p>
      </div>

      <div className="relative z-10 mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="glass-card relative py-8 px-6 shadow-2xl shadow-red-500/10 sm:rounded-3xl sm:px-10 border border-white/80 ring-1 ring-red-100/70 space-y-6">
          <div className="absolute inset-x-8 top-0 h-1 rounded-full bg-gradient-to-r from-red-500 via-red-500 to-amber-400" aria-hidden="true" />
          {/* Role selection */}
          <div>
            <label className="block text-xs font-bold text-red-700 uppercase tracking-[0.18em] mb-2 text-center">
              Register as
            </label>
            <div className="grid grid-cols-2 gap-3 p-1.5 bg-gradient-to-r from-red-50/90 via-red-50/70 to-amber-50/90 rounded-2xl border border-white/80 shadow-inner shadow-red-500/5">
              <button
                type="button"
                onClick={() => setRole('customer')}
                className={`py-2.5 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  role === 'customer'
                    ? 'bg-gradient-to-r from-red-600 via-red-500 to-red-500 text-white shadow-md shadow-red-500/30 border border-transparent ring-2 ring-white/70'
                    : 'text-red-500 hover:text-red-700 hover:bg-white/70'
                }`}
              >
                <User className="w-3.5 h-3.5" /> Couple / Customer
              </button>
              <button
                type="button"
                onClick={() => setRole('vendor')}
                className={`py-2.5 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  role === 'vendor'
                    ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-md shadow-amber-500/30 border border-transparent ring-2 ring-white/70'
                    : 'text-amber-600 hover:text-amber-800 hover:bg-white/70'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" /> Wedding Vendor
              </button>
            </div>
          </div>

          {role === 'vendor' && (
            <div className="p-3.5 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 rounded-2xl border border-amber-200/80 text-amber-900 text-xs shadow-sm shadow-amber-500/10">
              <div className="font-semibold flex items-center gap-1.5 mb-1">
                <Sparkles className="w-4 h-4 text-amber-600 fill-amber-300" />
                Wedding Vendor Registration
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                Publish up to 3 services free, manage bookings, and upgrade to Premium anytime via
                Stripe.
              </p>
            </div>
          )}

          {/* Email + password registration */}
          <form onSubmit={handleSignUp} className="space-y-4">
            <Input
              label="Full Name *"
              required
              autoComplete="name"
              placeholder="Eleanor Vance"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="hover:border-red-300 focus:border-red-500 focus:ring-red-400/30"
            />
            <Input
              type="email"
              label="Email Address *"
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
              label="Password *"
              required
              autoComplete="new-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="w-4 h-4 text-red-500" />}
              className="hover:border-red-300 focus:border-red-500 focus:ring-red-400/30"
            />

            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px]">
              {[
                { ok: hasMinLen, label: '6+ characters' },
                { ok: hasUpper, label: 'One uppercase letter' },
                { ok: hasLower, label: 'One lowercase letter' },
              ].map((rule) => (
                <span
                  key={rule.label}
                  className={`flex items-center gap-1 rounded-full px-2 py-0.5 font-medium ${rule.ok ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-50 text-slate-400'}`}
                >
                  <Check className="w-3 h-3" /> {rule.label}
                </span>
              ))}
            </div>

            {role === 'vendor' && (
              <Input
                label="Business / Studio Name"
                placeholder="Grand Elegance Studios"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="hover:border-amber-300 focus:border-amber-500 focus:ring-amber-400/30"
              />
            )}

            <Button type="submit" variant="primary" className="w-full shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/25" isLoading={isLoading}>
              Create Account
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-red-100" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-red-400 font-medium">or register with Google</span>
            </div>
          </div>

          <GoogleAuthButton role={role} text="signup" className="py-3 shadow-sm hover:shadow-md hover:shadow-red-500/10" />

          <div className="text-xs text-slate-500 pt-3 border-t border-red-100 text-center">
            Already have an account?{' '}
            <Link
              href="/signin"
              className="font-semibold text-red-600 hover:text-red-600 transition-colors underline decoration-red-300 underline-offset-2"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
