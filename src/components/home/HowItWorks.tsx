'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Search, CalendarCheck, GlassWater, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const steps = [
  {
    number: '01',
    icon: Search,
    title: 'Discover & Compare',
    description:
      'Search wedding venues, photographers, florists, and caterers by category, city, budget, and real portfolio photos.',
  },
  {
    number: '02',
    icon: CalendarCheck,
    title: 'Request Booking',
    description:
      'Select your wedding date, submit event details, and send a booking request. Our anti-double-booking system locks your date.',
  },
  {
    number: '03',
    icon: GlassWater,
    title: 'Celebrate Your Day',
    description:
      'Collaborate directly with your vendor, finalize details, and enjoy an unforgettable wedding day with zero stress.',
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 bg-gradient-to-b from-white via-rose-50/20 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200/50">
            Simple 3-Step Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-950 mt-3">
            How WedPlan Works
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            From initial inspiration to your final toast, we make every milestone effortless.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="relative bg-white rounded-3xl p-8 border border-rose-100/80 shadow-xs hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200/60 shadow-xs">
                    <Icon className="w-7 h-7" />
                  </div>
                  <span className="text-4xl font-serif font-bold text-rose-100">
                    {step.number}
                  </span>
                </div>

                <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-14 text-center">
          <Link href="/services">
            <Button size="lg" variant="primary" className="px-8 shadow-md">
              Start Planning Now
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
