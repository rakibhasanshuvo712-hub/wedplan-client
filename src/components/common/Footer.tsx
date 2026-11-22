'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Mail, Phone, MapPin } from 'lucide-react';

const socials = [
  { label: 'IG', className: 'bg-gradient-to-br from-red-500 via-red-500 to-red-500' },
  { label: 'FB', className: 'bg-gradient-to-br from-blue-600 to-blue-500' },
  { label: 'PIN', className: 'bg-gradient-to-br from-red-600 to-red-500' },
  { label: 'X', className: 'bg-gradient-to-br from-slate-700 to-red-600' },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-red-950 via-slate-950 to-violet-950 text-gray-300 pt-16 pb-8 border-t border-red-900/50">
      {/* Ambient glow */}
      <div className="absolute -top-40 left-1/4 w-[520px] h-[320px] rounded-full bg-red-600/20 blur-[90px] pointer-events-none" />
      <div className="absolute -bottom-40 right-0 w-[420px] h-[300px] rounded-full bg-violet-600/20 blur-[90px] pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-red-500 via-red-500 to-amber-400" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-500 via-red-500 to-amber-400 flex items-center justify-center text-white shadow-lg shadow-red-500/30 group-hover:scale-105 transition-transform">
                <Heart className="w-5 h-5 fill-white" />
              </div>
              <span className="text-2xl font-serif font-bold text-white tracking-tight">
                Wed<span className="text-gradient-rose">Plan</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
              The premier all-in-one wedding planning platform connecting couples with trusted venues, photographers, florists, and catering artisans across the nation.
            </p>
            <div className="flex items-center gap-3 pt-2">
              {socials.map((social) => (
                <span
                  key={social.label}
                  className={`w-9 h-9 rounded-full ${social.className} flex items-center justify-center text-white text-xs font-bold shadow-md hover:scale-110 hover:-translate-y-0.5 transition-transform cursor-pointer`}
                >
                  {social.label}
                </span>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-1.5 h-4 rounded-full bg-gradient-to-b from-red-400 to-red-500" />
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <Link href="/services" className="hover:text-red-300 transition-colors">
                  All Wedding Services
                </Link>
              </li>
              <li>
                <Link href="/services?category=Wedding+Venues" className="hover:text-red-300 transition-colors">
                  Wedding Venues
                </Link>
              </li>
              <li>
                <Link href="/services?category=Photography+%26+Videography" className="hover:text-red-300 transition-colors">
                  Photography &amp; Video
                </Link>
              </li>
              <li>
                <Link href="/services?category=Decoration+%26+Florist" className="hover:text-red-300 transition-colors">
                  Florists &amp; Decor
                </Link>
              </li>
              <li>
                <Link href="/services?category=Catering+Services" className="hover:text-red-300 transition-colors">
                  Catering &amp; Cakes
                </Link>
              </li>
            </ul>
          </div>

          {/* Vendors & Partners */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-1.5 h-4 rounded-full bg-gradient-to-b from-amber-400 to-orange-500" />
              Vendors
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <Link href="/signup?role=vendor" className="hover:text-amber-300 transition-colors">
                  Join as a Vendor
                </Link>
              </li>
              <li>
                <Link href="/signin" className="hover:text-amber-300 transition-colors">
                  Vendor Sign In
                </Link>
              </li>
              <li>
                <Link href="/dashboard/vendor/subscription" className="hover:text-amber-300 transition-colors">
                  Pricing &amp; Plans
                </Link>
              </li>
              <li>
                <Link href="/signin" className="hover:text-amber-300 transition-colors">
                  Vendor Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-1.5 h-4 rounded-full bg-gradient-to-b from-violet-400 to-red-500" />
              Contact
            </h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>777 Romance Avenue, Suite 400, Los Angeles, CA</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-red-400 shrink-0" />
                <span>+1 (800) 555-WEDP</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>support@wedplan.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© 2026 WedPlan Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-red-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/" className="hover:text-red-300 transition-colors">
              Terms of Service
            </Link>
            <Link href="/" className="hover:text-red-300 transition-colors">
              Security
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
