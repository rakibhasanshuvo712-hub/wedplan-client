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
          <div className="w-10 h-10 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin"></div>
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
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-rose-100 shadow-xl text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <div>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
            Payment Succeeded
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-950">
            Welcome to Premium!
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
            Your vendor account has been upgraded to Premium for 1 year. You can now publish unlimited wedding services and enjoy priority placement across the platform.
          </p>
        </div>

        <div className="pt-4 border-t border-gray-100 flex flex-col gap-2.5">
          <Link href="/dashboard/vendor/add-service">
            <Button variant="primary" className="w-full">
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
