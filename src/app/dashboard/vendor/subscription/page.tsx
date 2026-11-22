'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { RoleGuard } from '@/components/common/RoleGuard';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Sparkles, Check, ShieldCheck, Zap, ArrowRight } from 'lucide-react';

export default function VendorSubscriptionPage() {
  const { user } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const isPremium = user?.subscriptionPlan === 'premium';

  const handleUpgrade = async () => {
    setIsRedirecting(true);
    try {
      const res = await api.post('/payments/create-checkout-session');
      const checkoutUrl = res?.url || res?.data?.url;
      if (checkoutUrl) {
        toast.success('Redirecting to Stripe Checkout...');
        window.location.href = checkoutUrl;
      } else {
        toast.error(res?.error || res?.message || 'Failed to initiate checkout session.');
        setIsRedirecting(false);
      }
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message || 'Payment initiation failed.';
      toast.error(msg);
      setIsRedirecting(false);
    }
  };

  return (
    <RoleGuard allowedRoles={['vendor']}>
      <div className="relative max-w-4xl mx-auto space-y-8">
        <div className="aurora-orb absolute -top-24 -left-24 w-72 h-72 bg-amber-300/25" />
        <div className="aurora-orb aurora-orb--slow absolute -top-16 -right-24 w-72 h-72 bg-red-300/25" />
        <div className="relative text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-red-700 bg-gradient-to-r from-red-100 via-red-100 to-violet-100 px-3 py-1 rounded-full border border-red-200/70 shadow-sm shadow-red-500/10">
            Vendor Growth Plans
          </span>
          <h1 className="text-3xl font-serif font-bold text-gradient-rose mt-3">
            Choose Your WedPlan Plan
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-2">
            Unlock unlimited wedding service listings, priority placement in search, and verified vendor badge.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Free Tier */}
          <div className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 rounded-3xl p-8 border border-amber-200/80 shadow-lg shadow-amber-500/10 flex flex-col justify-between">
            <div className="aurora-orb absolute -top-16 -left-16 w-56 h-56 bg-amber-300/25" />
            <div className="aurora-orb aurora-orb--slow absolute -bottom-20 -right-16 w-48 h-48 bg-orange-300/20" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1 rounded-full shadow-md shadow-amber-500/25">
                  Free Starter
                </span>
                {!isPremium && (
                  <span className="text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 px-2.5 py-0.5 rounded-full border border-emerald-300/70 shadow-sm shadow-emerald-500/25">
                    Current Plan
                  </span>
                )}
              </div>

              <div className="mb-6">
                <span className="text-4xl font-serif font-bold text-gradient-gold">$0</span>
                <span className="text-xs text-amber-800/80 ml-1">/ month</span>
              </div>

              <ul className="space-y-3.5 text-xs text-amber-900/80">
                <li className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-amber-500/30">
                    <Check className="w-3 h-3" />
                  </span>
                  <span>Maximum <strong>3 Active Services</strong></span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-amber-500/30">
                    <Check className="w-3 h-3" />
                  </span>
                  <span>Standard Vendor Dashboard</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-amber-500/30">
                    <Check className="w-3 h-3" />
                  </span>
                  <span>Customer Booking Request Management</span>
                </li>
                <li className="flex items-center gap-2.5 text-amber-700/60">
                  <span className="w-5 h-5 rounded-full bg-amber-200/70 text-amber-700/70 flex items-center justify-center shrink-0 text-center">—</span>
                  <span>No Verified Premium Badge</span>
                </li>
                <li className="flex items-center gap-2.5 text-amber-700/60">
                  <span className="w-5 h-5 rounded-full bg-amber-200/70 text-amber-700/70 flex items-center justify-center shrink-0 text-center">—</span>
                  <span>Standard Directory Ranking</span>
                </li>
              </ul>
            </div>

            <div className="relative z-10 mt-8 pt-6 border-t border-amber-200/70">
              <Button variant="outline" className="w-full" disabled={!isPremium}>
                {!isPremium ? 'Active Plan' : 'Free Tier'}
              </Button>
            </div>
          </div>

          {/* Premium Tier */}
          <div className="relative bg-gradient-to-br from-violet-950 via-red-950 to-red-950 text-white rounded-3xl p-8 shadow-2xl shadow-red-500/20 border-2 border-red-500/50 flex flex-col justify-between overflow-hidden">
            <div className="aurora-orb absolute -top-16 -right-16 w-56 h-56 bg-red-500/25" />
            <div className="aurora-orb aurora-orb--slow absolute -bottom-20 -left-12 w-56 h-56 bg-violet-500/25" />
            <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-400 to-amber-500 text-amber-950 text-[10px] font-extrabold uppercase px-4 py-1 rounded-bl-xl shadow-md z-20">
              Most Popular
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-violet-600 to-red-600 px-3 py-1 rounded-full border border-red-400/50 shadow-md shadow-red-500/25">
                  Premium Vendor
                </span>
                {isPremium && (
                  <span className="text-xs font-bold text-amber-950 bg-gradient-to-r from-amber-300 to-amber-400 px-2.5 py-0.5 rounded-full border border-amber-200/70 shadow-sm">
                    Active Subscription
                  </span>
                )}
              </div>

              <div className="mb-6">
                <span className="text-4xl font-serif font-bold bg-gradient-to-r from-amber-200 via-white to-red-200 bg-clip-text text-transparent drop-shadow-sm">$49</span>
                <span className="text-xs text-red-200 ml-1">/ year (one-time test checkout)</span>
              </div>

              <ul className="space-y-3.5 text-xs text-red-100/90">
                <li className="flex items-center gap-2.5 font-semibold text-white">
                  <span className="w-5 h-5 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-amber-500/30">
                    <Sparkles className="w-3 h-3" />
                  </span>
                  <span><strong>Unlimited Active Wedding Services</strong></span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-gradient-to-br from-red-500 to-red-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-red-500/30">
                    <Check className="w-3 h-3" />
                  </span>
                  <span>Gold <strong>Verified Premium Badge</strong></span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-gradient-to-br from-violet-500 to-red-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-violet-500/30">
                    <Check className="w-3 h-3" />
                  </span>
                  <span>Priority Placement on Homepage & Browse Directory</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-gradient-to-br from-sky-500 to-violet-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-sky-500/30">
                    <Check className="w-3 h-3" />
                  </span>
                  <span>Advanced Analytics & Booking Inquiries</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-emerald-500/30">
                    <Check className="w-3 h-3" />
                  </span>
                  <span>Verified Stripe Checkout & Webhook Security</span>
                </li>
              </ul>
            </div>

            <div className="relative z-10 mt-8 pt-6 border-t border-red-500/30">
              {isPremium ? (
                <div className="p-3 bg-gradient-to-r from-amber-400/15 via-red-400/15 to-red-400/15 border border-amber-300/30 rounded-xl text-center text-xs font-semibold text-amber-200 flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" /> You are an active Premium Vendor!
                </div>
              ) : (
                <Button
                  onClick={handleUpgrade}
                  isLoading={isRedirecting}
                  className="w-full bg-gradient-to-r from-red-600 via-red-600 to-amber-500 hover:from-red-700 hover:to-amber-600 text-white font-bold py-3 text-sm shadow-xl shadow-red-600/30 cursor-pointer"
                >
                  <Zap className="w-4 h-4 mr-1.5" />
                  Upgrade to Premium via Stripe
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
