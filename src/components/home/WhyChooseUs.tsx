'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, CalendarRange, CreditCard, Sparkles, HeartHandshake, Headphones } from 'lucide-react';

const reasons = [
  {
    icon: ShieldCheck,
    title: 'Strict Vendor Verification',
    description:
      'Every wedding vendor is verified for licensing, business history, and portfolio authenticity before listing.',
    iconBg: 'from-emerald-500 to-teal-600',
    cardBg: 'from-emerald-50/80 to-white',
    glow: 'bg-emerald-300/40',
    number: 'text-emerald-100',
  },
  {
    icon: CalendarRange,
    title: 'Double-Booking Protection',
    description:
      'Our intelligent scheduling engine locks reserved dates instantly, guaranteeing your vendor is 100% committed to you.',
    iconBg: 'from-blue-500 to-indigo-600',
    cardBg: 'from-blue-50/80 to-white',
    glow: 'bg-blue-300/40',
    number: 'text-blue-100',
  },
  {
    icon: CreditCard,
    title: 'Transparent Pricing & Quotes',
    description:
      'No surprise platform fees or hidden upcharges. Compare clear service packages and book directly with vendors.',
    iconBg: 'from-amber-500 to-orange-600',
    cardBg: 'from-amber-50/80 to-white',
    glow: 'bg-amber-300/40',
    number: 'text-amber-100',
  },
  {
    icon: Sparkles,
    title: 'Premium Quality Standards',
    description:
      'Top-tier vendors can achieve Premium verified status with verified reviews, insured contracts, and premium badges.',
    iconBg: 'from-red-500 to-purple-600',
    cardBg: 'from-red-50/80 to-white',
    glow: 'bg-red-300/40',
    number: 'text-red-100',
  },
  {
    icon: HeartHandshake,
    title: 'Direct Vendor Collaboration',
    description:
      'Communicate special requests, event themes, and guest counts directly with the professionals who make it happen.',
    iconBg: 'from-red-500 to-red-600',
    cardBg: 'from-red-50/80 to-white',
    glow: 'bg-red-300/40',
    number: 'text-red-100',
  },
  {
    icon: Headphones,
    title: 'Dedicated Support',
    description:
      'Our wedding support team is on standby 7 days a week to assist couples and vendors with any questions or modifications.',
    iconBg: 'from-cyan-500 to-sky-600',
    cardBg: 'from-cyan-50/80 to-white',
    glow: 'bg-cyan-300/40',
    number: 'text-cyan-100',
  },
];

export function WhyChooseUs() {
  return (
    <section className="relative py-24 overflow-hidden bg-white">
      <div className="aurora-orb absolute top-1/4 -left-48 w-96 h-96 bg-red-200/35" />
      <div className="aurora-orb aurora-orb--slow absolute bottom-0 -right-40 w-96 h-96 bg-violet-200/35" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block text-xs font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 px-4 py-1.5 rounded-full shadow-md shadow-emerald-500/20">
            The WedPlan Advantage
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-950 mt-4">
            Why Choose <span className="text-gradient-rose">WedPlan?</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            Crafting your wedding day should be a joyful adventure, not a logistical headache.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {reasons.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
                className={`group relative overflow-hidden p-8 rounded-3xl bg-gradient-to-br ${item.cardBg} border border-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
              >
                <div className={`absolute -top-10 -right-6 w-24 h-24 rounded-full blur-2xl ${item.glow} opacity-70 group-hover:opacity-100 transition-opacity`} />
                <span className={`absolute top-2 right-5 text-6xl font-serif font-bold ${item.number} select-none`}>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className={`relative w-12 h-12 rounded-2xl bg-gradient-to-br ${item.iconBg} text-white flex items-center justify-center shadow-lg mb-5 group-hover:scale-110 group-hover:-rotate-6 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="relative text-lg font-serif font-bold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="relative text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
