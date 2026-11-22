'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sparkles, Calendar, ArrowRight, ShieldCheck, Star, Heart } from 'lucide-react';

export function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-red-50 via-red-50/60 to-amber-50/50 pt-16 pb-24 lg:pt-24 lg:pb-32">
      {/* Ambient multicolour bokeh */}
      <div className="aurora-orb absolute -top-24 left-1/4 w-[520px] h-[520px] bg-red-300/45" />
      <div className="aurora-orb aurora-orb--slow absolute top-10 right-0 w-[460px] h-[460px] bg-violet-300/40" />
      <div className="aurora-orb absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-200/55" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(255,255,255,0.55)_100%)] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline & CTA */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="lg:col-span-7 text-center lg:text-left space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-red-600 to-red-500 text-white text-xs font-semibold tracking-wide shadow-lg shadow-red-500/25">
              <Sparkles className="w-3.5 h-3.5" />
              <span>The Nation&apos;s Most Trusted Wedding Marketplace</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-gray-950 leading-[1.15] tracking-tight">
              Plan Your Dream Wedding with{' '}
              <span className="text-gradient-aurora shimmer-text">
                Confidence &amp; Joy
              </span>
            </h1>

            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Discover top-rated venues, award-winning photographers, bespoke florists, and Michelin-tier caterers. Compare prices, check real-time availability, and request bookings seamlessly.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
              <Link href="/services">
                <Button size="lg" variant="primary" className="shadow-lg shadow-red-500/25 px-8">
                  Explore Wedding Services
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
              <Link href="/signup?role=vendor">
                <Button
                  size="lg"
                  variant="outline"
                  className="px-7 border-amber-300 bg-white/70 text-amber-800 hover:bg-amber-50 hover:border-amber-400 shadow-sm backdrop-blur-sm"
                >
                  <Heart className="w-4 h-4 mr-1.5 text-red-500 fill-red-400" />
                  Join as a Vendor
                </Button>
              </Link>
            </div>

            {/* Trust points */}
            <div className="pt-6 border-t border-red-200/70 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 text-left">
              <div>
                <p className="text-2xl font-bold font-serif bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
                  500+
                </p>
                <p className="text-xs text-gray-500 font-medium">Verified Vendors</p>
              </div>
              <div>
                <p className="text-2xl font-bold font-serif bg-gradient-to-r from-violet-600 to-indigo-500 bg-clip-text text-transparent">
                  12,000+
                </p>
                <p className="text-xs text-gray-500 font-medium">Weddings Planned</p>
              </div>
              <div>
                <p className="text-2xl font-bold font-serif flex items-center bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
                  4.9 <Star className="w-4 h-4 fill-amber-400 text-amber-400 ml-1 inline" />
                </p>
                <p className="text-xs text-gray-500 font-medium">Couple Reviews</p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Visual Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Image Frame with rainbow border */}
              <div className="relative rounded-[1.9rem] overflow-hidden bg-gradient-to-br from-red-400 via-red-400 to-amber-400 p-1 shadow-2xl shadow-red-500/25">
                <div className="relative rounded-3xl overflow-hidden aspect-[4/5]">
                  <img
                    src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80"
                    alt="Bride and Groom Outdoor Sunset Wedding"
                    className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-red-950/75 via-red-900/10 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-red-500 to-red-500 text-[11px] font-semibold uppercase tracking-wider shadow-md">
                      Featured Destination
                    </span>
                    <h3 className="text-xl font-serif font-bold mt-2 drop-shadow">
                      Rosewood Seaside Pavilion
                    </h3>
                    <p className="text-xs text-red-100 flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3.5 h-3.5" /> Bookings open for 2026 / 2027
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating Verified Badge */}
              <div className="glass-card absolute -top-4 -left-4 rounded-2xl p-3.5 shadow-xl border border-emerald-200/70 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/25">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">100% Verified</p>
                  <p className="text-[10px] text-gray-500">Inspected Wedding Vendors</p>
                </div>
              </div>

              {/* Floating Review Card */}
              <div className="glass-card absolute -bottom-6 -right-4 rounded-2xl p-3.5 shadow-xl border border-violet-200/70 flex items-center gap-3 max-w-[220px]">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80"
                  alt="Happy Couple"
                  className="w-10 h-10 rounded-full object-cover border-2 border-red-300 shrink-0"
                />
                <div className="text-left">
                  <div className="flex text-amber-400 text-xs">★★★★★</div>
                  <p className="text-[11px] text-gray-700 font-medium leading-tight mt-0.5">
                    &quot;WedPlan found our florist &amp; venue in 2 days!&quot;
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
