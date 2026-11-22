'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';

export default function PaymentCancelPage() {
  return (
    <div className="relative min-h-[75vh] flex items-center justify-center px-4 py-16 overflow-hidden bg-gradient-to-b from-amber-50/50 via-white to-violet-50/40">
      <div className="absolute top-14 left-10 w-52 h-52 aurora-orb bg-amber-200/60" />
      <div className="absolute bottom-14 right-10 w-56 h-56 aurora-orb bg-violet-200/60 aurora-orb--slow" />

      <div className="relative max-w-md w-full bg-gradient-to-b from-white via-white to-amber-50/40 rounded-3xl p-8 border border-amber-200/70 shadow-xl shadow-amber-200/40 text-center space-y-6 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-amber-400 via-orange-400 to-red-400" />

        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white mx-auto flex items-center justify-center shadow-lg shadow-amber-400/40 ring-4 ring-amber-100">
          <AlertCircle className="w-10 h-10" />
        </div>

        <div>
          <h1 className="text-2xl font-serif font-bold text-gradient-gold">
            Checkout Cancelled
          </h1>
          <p className="text-xs sm:text-sm text-gray-700 mt-2 leading-relaxed">
            No charges were incurred. If you changed your mind or wish to try another payment method, you can upgrade to Premium at any time.
          </p>
        </div>

        {/* Gentle reassurance status card */}
        <div className="rounded-2xl bg-gradient-to-r from-amber-50 via-orange-50 to-red-50 border border-amber-100 p-4 shadow-sm shadow-amber-100/60">
          <p className="text-xs font-bold text-amber-900 flex items-center justify-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            No payment was processed
          </p>
          <p className="text-[11px] text-amber-800/80 mt-0.5">
            Your account is unchanged. You can retry whenever you&apos;re ready.
          </p>
        </div>

        <div className="pt-4 border-t border-amber-100 flex flex-col gap-2.5">
          <Link href="/dashboard/vendor/subscription">
            <Button variant="primary" className="w-full bg-gradient-to-r from-amber-500 to-orange-500 shadow-lg shadow-amber-500/30 hover:from-amber-600 hover:to-orange-600">
              <RefreshCw className="w-4 h-4 mr-1.5" />
              Try Upgrading Again
            </Button>
          </Link>
          <Link href="/dashboard/vendor">
            <Button variant="outline" className="w-full">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Return to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
