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
    bar: 'from-blue-500 via-cyan-400 to-teal-400',
    iconBg: 'from-blue-500 to-cyan-600',
    numberText: 'text-gradient-aurora',
    tint: 'from-blue-50/70 via-white to-cyan-50/50',
  },
  {
    number: '02',
    icon: CalendarCheck,
    title: 'Request Booking',
    description:
      'Select your wedding date, submit event details, and send a booking request. Our anti-double-booking system locks your date.',
    bar: 'from-red-500 via-red-500 to-red-500',
    iconBg: 'from-red-500 to-red-600',
    numberText: 'text-gradient-rose',
    tint: 'from-red-50/70 via-white to-red-50/50',
  },
  {
    number: '03',
    icon: GlassWater,
    title: 'Celebrate Your Day',
    description:
      'Collaborate directly with your vendor, finalize details, and enjoy an unforgettable wedding day with zero stress.',
    bar: 'from-amber-500 via-orange-400 to-yellow-400',
    iconBg: 'from-amber-500 to-orange-600',
    numberText: 'text-gradient-gold',
    tint: 'from-amber-50/70 via-white to-yellow-50/50',
  },
];

export function HowItWorks() {
  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-b from-red-50/40 via-white to-amber-50/40">
      <div className="aurora-orb absolute -left-40 top-1/3 w-80 h-80 bg-violet-200/40" />
      <div className="aurora-orb aurora-orb--slow absolute -right-40 top-0 w-80 h-80 bg-emerald-200/35" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block text-xs font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-violet-600 via-red-500 to-red-500 px-4 py-1.5 rounded-full shadow-md shadow-violet-500/20">
            Simple 3-Step Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-950 mt-4">
            How WedPlan <span className="text-gradient-rose">Works</span>
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
                className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${step.tint} p-8 border border-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
              >
                <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${step.bar}`} />
                <div className="flex items-center justify-between mb-6 pt-2">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.iconBg} text-white flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-transform`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <span className={`text-4xl font-serif font-bold ${step.numberText}`}>
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
            <Button size="lg" variant="primary" className="px-8 shadow-lg shadow-red-500/25">
              Start Planning Now
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
