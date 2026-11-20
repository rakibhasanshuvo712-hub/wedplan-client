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
    { name: 'Venues', icon: MapPin, href: '/services?category=Wedding%20Venues' },
    { name: 'Photography', icon: Camera, href: '/services?category=Photography%20%26%20Videography' },
    { name: 'Catering', icon: Utensils, href: '/services?category=Catering%20%26%20Bar%20Services' },
    { name: 'Floristry', icon: Flower2, href: '/services?category=Floral%20%26%20Decor' },
    { name: 'Bridal Wear', icon: Shirt, href: '/services?category=Bridal%20Wear%20%26%20Attire' },
  ];

  return (
    <div className="min-h-[85vh] bg-gradient-to-b from-rose-50/50 via-white to-pink-50/30 flex items-center justify-center px-4 py-16 sm:py-24">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Animated Badge & Icon */}
        <div className="relative inline-flex items-center justify-center">
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-tr from-rose-500/20 via-pink-400/20 to-amber-300/30 backdrop-blur-md flex items-center justify-center shadow-xl shadow-rose-500/10 border border-rose-200/60 rotate-3 transition-transform hover:rotate-0 duration-300">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-rose-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-rose-500/30 -rotate-3 hover:rotate-0 transition-transform">
              <CalendarHeart className="w-10 h-10 sm:w-12 sm:h-12" />
            </div>
          </div>
          <div className="absolute -top-2 -right-2 bg-white rounded-full p-2 shadow-md border border-rose-100">
            <Sparkles className="w-5 h-5 text-amber-500 fill-amber-300 animate-pulse" />
          </div>
        </div>

        {/* 404 Large Title & Description */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-100/80 text-rose-800 text-xs font-bold uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
            Error 404 • Lost in Celebration
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-gray-950 tracking-tight leading-tight">
            This Page Wandered Off Before the Vows
          </h1>
          <p className="text-sm sm:text-base text-gray-600 max-w-lg mx-auto leading-relaxed">
            The wedding service, page, or destination you are searching for might have been moved, renamed, or is still getting ready behind the scenes.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link href="/" className="w-full sm:w-auto">
            <Button variant="primary" size="lg" className="w-full sm:w-auto shadow-lg shadow-rose-600/20">
              <Home className="w-4 h-4 mr-2" />
              Return to Homepage
            </Button>
          </Link>
          <Link href="/services" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              <Compass className="w-4 h-4 mr-2 text-rose-600" />
              Explore All Services
            </Button>
          </Link>
        </div>

        {/* Quick Categories Navigation */}
        <div className="pt-8 border-t border-rose-100">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">
            Popular Wedding Categories
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {quickCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.name}
                  href={cat.href}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-white hover:bg-rose-50 text-gray-700 hover:text-rose-700 border border-rose-100 hover:border-rose-200 shadow-2xs transition-all hover:scale-105"
                >
                  <Icon className="w-3.5 h-3.5 text-rose-500" />
                  {cat.name}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Footer Support Note */}
        <p className="text-[11px] text-gray-400 pt-4">
          Need help with your wedding planning or vendor bookings? Reach our concierge at{' '}
          <a href="mailto:support@wedplan.com" className="text-rose-600 underline font-medium">
            support@wedplan.com
          </a>
        </p>
      </div>
    </div>
  );
}
