'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sparkles, Calendar, ArrowRight, ShieldCheck, Star } from 'lucide-react';

export function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-rose-50/70 via-white to-slate-50/30 pt-16 pb-24 lg:pt-24 lg:pb-32">
      {/* Decorative floral/bokeh blurred circles */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-rose-200/40 via-pink-100/30 to-amber-100/30 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline & CTA */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="lg:col-span-7 text-center lg:text-left space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-100/80 text-rose-800 text-xs font-semibold tracking-wide border border-rose-200/60 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-rose-600" />
              <span>The Nation's Most Trusted Wedding Marketplace</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-gray-950 leading-[1.15] tracking-tight">
              Plan Your Dream Wedding with{' '}
              <span className="bg-gradient-to-r from-rose-700 via-rose-600 to-pink-600 bg-clip-text text-transparent">
                Confidence & Joy
              </span>
            </h1>

            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Discover top-rated venues, award-winning photographers, bespoke florists, and Michelin-tier caterers. Compare prices, check real-time availability, and request bookings seamlessly.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
              <Link href="/services">
                <Button size="lg" variant="primary" className="shadow-lg shadow-rose-500/25 px-8">
                  Explore Wedding Services
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>

            {/* Trust points */}
            <div className="pt-6 border-t border-rose-100/80 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 text-left">
              <div>
                <p className="text-2xl font-bold font-serif text-gray-900">500+</p>
                <p className="text-xs text-gray-500 font-medium">Verified Vendors</p>
              </div>
              <div>
                <p className="text-2xl font-bold font-serif text-gray-900">12,000+</p>
                <p className="text-xs text-gray-500 font-medium">Weddings Planned</p>
              </div>
              <div>
                <p className="text-2xl font-bold font-serif text-gray-900 flex items-center">
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
              {/* Main Image Frame */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/5]">
                <img
                  src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80"
                  alt="Bride and Groom Outdoor Sunset Wedding"
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="px-2.5 py-1 rounded-full bg-rose-600/90 text-[11px] font-semibold uppercase tracking-wider backdrop-blur-xs">
                    Featured Destination
                  </span>
                  <h3 className="text-xl font-serif font-bold mt-2">
                    Rosewood Seaside Pavilion
                  </h3>
                  <p className="text-xs text-rose-100 flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3.5 h-3.5" /> Bookings open for 2026 / 2027
                  </p>
                </div>
              </div>

              {/* Floating Verified Badge */}
              <div className="absolute -top-4 -left-4 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-xl border border-rose-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">100% Verified</p>
                  <p className="text-[10px] text-gray-500">Inspected Wedding Vendors</p>
                </div>
              </div>

              {/* Floating Review Card */}
              <div className="absolute -bottom-6 -right-4 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-xl border border-rose-100 flex items-center gap-3 max-w-[220px]">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80"
                  alt="Happy Couple"
                  className="w-10 h-10 rounded-full object-cover border border-rose-200 shrink-0"
                />
                <div className="text-left">
                  <div className="flex text-amber-400 text-xs">★★★★★</div>
                  <p className="text-[11px] text-gray-700 font-medium leading-tight mt-0.5">
                    "WedPlan found our florist & venue in 2 days!"
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
