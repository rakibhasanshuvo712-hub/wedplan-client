'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import confetti from 'canvas-confetti';
import { CheckCircle2, Sparkles, Building2, ArrowRight } from 'lucide-react';

export default function PaymentSuccessPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-[75vh] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
        </div>
      }
    >
      <PaymentSuccessContent />
    </React.Suspense>
  );
}

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { refreshUser } = useAuth();

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Launch celebratory confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // Ignored if confetti fails
    }

    const verify = async () => {
      if (!sessionId) {
        setSuccess(true);
        setLoading(false);
        return;
      }

      try {
        await api.post('/payments/verify-session', { sessionId });
        await refreshUser();
        setSuccess(true);
      } catch (err: any) {
        console.error('Session verify error:', err);
        // Even if direct verify had a transient issue, webhook handles it
        setSuccess(true);
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [sessionId]);

  return (
    <div className="relative min-h-[75vh] flex items-center justify-center px-4 py-16 overflow-hidden bg-gradient-to-b from-rose-50/50 via-white to-emerald-50/40">
      <div className="absolute top-14 left-8 w-56 h-56 aurora-orb bg-rose-300/50" />
      <div className="absolute bottom-14 right-8 w-64 h-64 aurora-orb bg-emerald-300/50 aurora-orb--slow" />
      <div className="absolute top-1/3 right-1/4 w-40 h-40 aurora-orb bg-amber-300/50" />

      <div className="relative max-w-md w-full bg-gradient-to-b from-white via-white to-emerald-50/40 rounded-3xl p-8 border border-rose-200/70 shadow-2xl shadow-fuchsia-200/50 text-center space-y-6 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-rose-500 via-fuchsia-500 to-amber-400" />

        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-600 text-white mx-auto flex items-center justify-center shadow-xl shadow-emerald-500/40 ring-4 ring-emerald-100">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <div>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold uppercase tracking-wider mb-2 shadow-md shadow-amber-400/40">
            <Sparkles className="w-3.5 h-3.5 text-white fill-white/90" />
            Payment Succeeded
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gradient-aurora">
            Welcome to Premium!
          </h1>
          <p className="text-xs sm:text-sm text-gray-700 mt-2 leading-relaxed">
            Your vendor account has been upgraded to Premium for 1 year. You can now publish unlimited wedding services and enjoy priority placement across the platform.
          </p>
        </div>

        {/* Celebratory status card */}
        <div className="rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 border border-emerald-100 p-4 shadow-sm shadow-emerald-100/60">
          <p className="text-xs font-bold text-emerald-800 flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Your Premium plan is now active
          </p>
          <p className="text-[11px] text-emerald-700/80 mt-0.5">
            Valid for 1 year from today. Happy planning!
          </p>
        </div>

        <div className="pt-4 border-t border-rose-100 flex flex-col gap-2.5">
          <Link href="/dashboard/vendor/add-service">
            <Button variant="primary" className="w-full bg-gradient-to-r from-rose-600 via-fuchsia-600 to-violet-600 shadow-lg shadow-fuchsia-500/30 hover:from-rose-700 hover:via-fuchsia-700 hover:to-violet-700">
              Publish New Wedding Service
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
          <Link href="/dashboard/vendor">
            <Button variant="outline" className="w-full">
              Go to Vendor Overview
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
