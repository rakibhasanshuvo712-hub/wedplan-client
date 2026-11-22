'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Heart,
  Home,
  Search,
  Sparkles,
  ArrowRight,
  Compass,
  MapPin,
  CalendarHeart,
  Camera,
  Utensils,
  Flower2,
  Shirt,
} from 'lucide-react';

export default function NotFound() {
  const quickCategories = [
    { name: 'Venues', icon: MapPin, href: '/services?category=Wedding%20Venues', iconClass: 'text-rose-500' },
    { name: 'Photography', icon: Camera, href: '/services?category=Photography%20%26%20Videography', iconClass: 'text-fuchsia-500' },
    { name: 'Catering', icon: Utensils, href: '/services?category=Catering%20%26%20Bar%20Services', iconClass: 'text-amber-500' },
    { name: 'Floristry', icon: Flower2, href: '/services?category=Floral%20%26%20Decor', iconClass: 'text-emerald-500' },
    { name: 'Bridal Wear', icon: Shirt, href: '/services?category=Bridal%20Wear%20%26%20Attire', iconClass: 'text-violet-500' },
  ];

  return (
    <div className="relative overflow-hidden min-h-[85vh] flex items-center justify-center px-4 py-16 sm:py-24 bg-gradient-to-br from-rose-50 via-fuchsia-50/70 to-amber-50/60">
      {/* Decorative wedding-glow orbs */}
      <div className="aurora-orb absolute -top-24 -left-24 w-96 h-96 bg-rose-300/45" aria-hidden="true" />
      <div className="aurora-orb aurora-orb--slow absolute top-1/4 -right-28 w-96 h-96 bg-violet-300/35" aria-hidden="true" />
      <div className="aurora-orb absolute -bottom-28 left-1/3 w-80 h-80 bg-amber-300/45" aria-hidden="true" />

      <div className="relative z-10 max-w-2xl w-full text-center space-y-8">
        {/* Colorful 404 illustration */}
        <div className="relative flex flex-col items-center">
          <span
            className="text-gradient-aurora shimmer-text text-7xl sm:text-8xl font-serif font-extrabold leading-none tracking-tight drop-shadow-lg drop-shadow-rose-500/20 select-none"
            aria-hidden="true"
          >
            404
          </span>
          <div className="-mt-3 relative inline-flex items-center justify-center">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-tr from-rose-500/25 via-fuchsia-400/25 to-amber-300/40 backdrop-blur-md flex items-center justify-center shadow-xl shadow-fuchsia-500/15 border border-white/80 ring-2 ring-rose-100/60 rotate-3 transition-transform hover:rotate-0 duration-300">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-rose-600 via-fuchsia-500 to-amber-400 flex items-center justify-center text-white shadow-lg shadow-rose-500/30 -rotate-3 hover:rotate-0 transition-transform">
                <CalendarHeart className="w-10 h-10 sm:w-12 sm:h-12" />
              </div>
            </div>
            <div className="absolute -top-2 -right-2 bg-white rounded-full p-2 shadow-md shadow-amber-500/20 border border-amber-100">
              <Sparkles className="w-5 h-5 text-amber-500 fill-amber-300 animate-pulse" />
            </div>
            <div className="absolute -bottom-2 -left-3 bg-white rounded-full p-2 shadow-md shadow-rose-500/20 border border-rose-100">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-400" />
            </div>
          </div>
        </div>

        {/* 404 Large Title & Description */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-rose-100 via-fuchsia-100 to-amber-100 text-fuchsia-800 text-xs font-bold uppercase tracking-wider border border-white/80 shadow-sm shadow-fuchsia-500/10">
            <Heart className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
            Error 404 • Lost in Celebration
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-gradient-rose tracking-tight leading-tight">
            This Page Wandered Off Before the Vows
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-lg mx-auto leading-relaxed">
            The wedding service, page, or destination you are searching for might have been moved, renamed, or is still getting ready behind the scenes.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link href="/" className="w-full sm:w-auto">
            <Button variant="primary" size="lg" className="w-full sm:w-auto shadow-lg shadow-rose-600/25 hover:shadow-xl hover:shadow-fuchsia-500/25">
              <Home className="w-4 h-4 mr-2" />
              Return to Homepage
            </Button>
          </Link>
          <Link href="/services" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full sm:w-auto border-fuchsia-200 text-fuchsia-700 hover:bg-fuchsia-50 hover:shadow-md hover:shadow-fuchsia-500/10">
              <Compass className="w-4 h-4 mr-2 text-fuchsia-600" />
              Explore All Services
            </Button>
          </Link>
        </div>

        {/* Quick Categories Navigation */}
        <div className="pt-8 border-t border-rose-200/70">
          <p className="text-xs font-semibold uppercase tracking-wider text-fuchsia-700 mb-4">
            Popular Wedding Categories
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {quickCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.name}
                  href={cat.href}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-white/85 hover:bg-gradient-to-r hover:from-rose-50 hover:to-fuchsia-50 text-slate-700 hover:text-fuchsia-700 border border-rose-100 hover:border-fuchsia-200 shadow-sm hover:shadow-md hover:shadow-fuchsia-500/10 transition-all hover:scale-105"
                >
                  <Icon className={`w-3.5 h-3.5 ${cat.iconClass}`} />
                  {cat.name}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Footer Support Note */}
        <p className="text-[11px] text-slate-500 pt-4">
          Need help with your wedding planning or vendor bookings? Reach our concierge at{' '}
          <a href="mailto:support@wedplan.com" className="text-fuchsia-600 underline font-medium hover:text-rose-600 transition-colors">
            support@wedplan.com
          </a>
        </p>
      </div>
    </div>
  );
}
