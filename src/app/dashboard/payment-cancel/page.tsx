'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';

export default function PaymentCancelPage() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-rose-100 shadow-xl text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 mx-auto flex items-center justify-center">
          <AlertCircle className="w-10 h-10" />
        </div>

        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-950">
            Checkout Cancelled
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
            No charges were incurred. If you changed your mind or wish to try another payment method, you can upgrade to Premium at any time.
          </p>
        </div>

        <div className="pt-4 border-t border-gray-100 flex flex-col gap-2.5">
          <Link href="/dashboard/vendor/subscription">
            <Button variant="primary" className="w-full">
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
