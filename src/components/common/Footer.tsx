'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-300 pt-16 pb-8 border-t border-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-gray-800">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-pink-500 flex items-center justify-center text-white shadow-md">
                <Heart className="w-5 h-5 fill-white" />
              </div>
              <span className="text-2xl font-serif font-bold text-white tracking-tight">
                WedPlan
              </span>
            </Link>
            <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
              The premier all-in-one wedding planning platform connecting couples with trusted venues, photographers, florists, and catering artisans across the nation.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="w-9 h-9 rounded-full bg-gray-900 hover:bg-rose-600 hover:text-white flex items-center justify-center text-gray-400 transition-colors cursor-pointer text-xs font-bold">
                IG
              </span>
              <span className="w-9 h-9 rounded-full bg-gray-900 hover:bg-rose-600 hover:text-white flex items-center justify-center text-gray-400 transition-colors cursor-pointer text-xs font-bold">
                FB
              </span>
              <span className="w-9 h-9 rounded-full bg-gray-900 hover:bg-rose-600 hover:text-white flex items-center justify-center text-gray-400 transition-colors cursor-pointer text-xs font-bold">
                PIN
              </span>
              <span className="w-9 h-9 rounded-full bg-gray-900 hover:bg-rose-600 hover:text-white flex items-center justify-center text-gray-400 transition-colors cursor-pointer text-xs font-bold">
                X
              </span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <Link href="/services" className="hover:text-rose-400 transition-colors">
                  All Wedding Services
                </Link>
              </li>
              <li>
                <Link href="/services?category=Wedding+Venues" className="hover:text-rose-400 transition-colors">
                  Wedding Venues
                </Link>
              </li>
              <li>
                <Link href="/services?category=Photography+%26+Videography" className="hover:text-rose-400 transition-colors">
                  Photography & Video
                </Link>
              </li>
              <li>
                <Link href="/services?category=Decoration+%26+Florist" className="hover:text-rose-400 transition-colors">
                  Florists & Decor
                </Link>
              </li>
              <li>
                <Link href="/services?category=Catering+Services" className="hover:text-rose-400 transition-colors">
                  Catering & Cakes
                </Link>
              </li>
            </ul>
          </div>

          {/* Vendors & Partners */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Vendors
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <Link href="/signup?role=vendor" className="hover:text-rose-400 transition-colors">
                  Join as a Vendor
                </Link>
              </li>
              <li>
                <Link href="/signin" className="hover:text-rose-400 transition-colors">
                  Vendor Sign In
                </Link>
              </li>
              <li>
                <Link href="/dashboard/vendor/subscription" className="hover:text-rose-400 transition-colors">
                  Pricing & Plans
                </Link>
              </li>
              <li>
                <Link href="/signin" className="hover:text-rose-400 transition-colors">
                  Vendor Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Contact
            </h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>777 Romance Avenue, Suite 400, Los Angeles, CA</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-rose-500 shrink-0" />
                <span>+1 (800) 555-WEDP</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-rose-500 shrink-0" />
                <span>support@wedplan.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© 2026 WedPlan Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-gray-300">
              Privacy Policy
            </Link>
            <Link href="/" className="hover:text-gray-300">
              Terms of Service
            </Link>
            <Link href="/" className="hover:text-gray-300">
              Security
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
