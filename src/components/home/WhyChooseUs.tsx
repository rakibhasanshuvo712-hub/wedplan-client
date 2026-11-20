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
  },
  {
    icon: CalendarRange,
    title: 'Double-Booking Protection',
    description:
      'Our intelligent scheduling engine locks reserved dates instantly, guaranteeing your vendor is 100% committed to you.',
  },
  {
    icon: CreditCard,
    title: 'Transparent Pricing & Quotes',
    description:
      'No surprise platform fees or hidden upcharges. Compare clear service packages and book directly with vendors.',
  },
  {
    icon: Sparkles,
    title: 'Premium Quality Standards',
    description:
      'Top-tier vendors can achieve Premium verified status with verified reviews, insured contracts, and premium badges.',
  },
  {
    icon: HeartHandshake,
    title: 'Direct Vendor Collaboration',
    description:
      'Communicate special requests, event themes, and guest counts directly with the professionals who make it happen.',
  },
  {
    icon: Headphones,
    title: 'Dedicated Support',
    description:
      'Our wedding support team is on standby 7 days a week to assist couples and vendors with any questions or modifications.',
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200/50">
            The WedPlan Advantage
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-950 mt-3">
            Why Choose WedPlan?
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            Crafting your wedding day should be a joyful adventure, not a logistical headache.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
                className="p-8 rounded-2xl bg-gradient-to-b from-rose-50/30 to-white border border-rose-100/70 hover:border-rose-300 transition-all shadow-xs hover:shadow-lg"
              >
                <div className="w-12 h-12 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-md shadow-rose-600/20 mb-5">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-serif font-bold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
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
