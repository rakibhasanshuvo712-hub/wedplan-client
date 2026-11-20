'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Heart, Lock, Mail, User, Building2, ArrowRight, Check } from 'lucide-react';

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
  const { register, googleLogin } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(initialRole === 'vendor' ? 'vendor' : 'customer');
  const [businessName, setBusinessName] = useState('');
  const [image, setImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Password rules validation
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
        image: image || undefined,
        businessName: role === 'vendor' ? (businessName || name) : undefined,
      });

      toast.success(`Welcome to WedPlan, ${newUser.name}!`);

      if (newUser.role === 'vendor') {
        router.push('/dashboard/vendor');
      } else {
        router.push('/dashboard/customer');
      }
    } catch (err: any) {
      toast.error(err.message || 'Registration failed.');
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
          Join thousands of couples & vendors on the nation's premier wedding platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl shadow-rose-500/5 sm:rounded-3xl sm:px-10 border border-rose-100">
          {/* Role Selection Toggle */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2 text-center">
              I want to register as a:
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

          <form onSubmit={handleSignUp} className="space-y-4">
            <Input
              label="Full Name *"
              required
              placeholder="e.g. Eleanor Vance"
              value={name}
              onChange={(e) => setName(e.target.value)}
              icon={<User className="w-4 h-4" />}
            />

            {role === 'vendor' && (
              <Input
                label="Business / Studio Name *"
                required
                placeholder="e.g. Royal Blooms Floral Design"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                icon={<Building2 className="w-4 h-4" />}
              />
            )}

            <Input
              type="email"
              label="Email Address *"
              required
              placeholder="you@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-4 h-4" />}
            />

            <div>
              <Input
                type="password"
                label="Password *"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock className="w-4 h-4" />}
              />
              {/* Password Rules Checklist */}
              <div className="mt-2 text-[11px] space-y-1 text-gray-500 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                <div className={`flex items-center gap-1.5 ${hasMinLen ? 'text-emerald-600 font-semibold' : ''}`}>
                  <Check className={`w-3 h-3 ${hasMinLen ? 'text-emerald-600' : 'text-gray-300'}`} />
                  <span>At least 6 characters</span>
                </div>
                <div className={`flex items-center gap-1.5 ${hasUpper ? 'text-emerald-600 font-semibold' : ''}`}>
                  <Check className={`w-3 h-3 ${hasUpper ? 'text-emerald-600' : 'text-gray-300'}`} />
                  <span>At least one uppercase letter (A-Z)</span>
                </div>
                <div className={`flex items-center gap-1.5 ${hasLower ? 'text-emerald-600 font-semibold' : ''}`}>
                  <Check className={`w-3 h-3 ${hasLower ? 'text-emerald-600' : 'text-gray-300'}`} />
                  <span>At least one lowercase letter (a-z)</span>
                </div>
              </div>
            </div>

            <Input
              label="Profile Image URL (Optional)"
              placeholder="https://example.com/avatar.jpg"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-2"
              isLoading={isLoading}
            >
              Complete Registration
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-gray-500">
            Already have an account?{' '}
            <Link
              href="/signin"
              className="font-semibold text-rose-600 hover:text-rose-700 transition-colors underline"
            >
              Sign in here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
