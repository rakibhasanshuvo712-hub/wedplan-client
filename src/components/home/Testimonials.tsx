'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const reviews = [
  {
    name: 'Emily & David Richardson',
    role: 'Married in Napa Valley, CA',
    rating: 5,
    text: 'Finding our wedding venue and photographer on WedPlan was the easiest part of our entire wedding. We locked our date and the vendor response came in within 3 hours!',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  },
  {
    name: 'Jessica & Marcus Taylor',
    role: 'Married in Malibu, CA',
    rating: 5,
    text: 'The transparent pricing is a game-changer. We knew exactly what our catering and florist packages included before requesting the booking. 10/10 platform.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  },
  {
    name: 'Elena Vance (Royal Blooms Floral)',
    role: 'Verified Premium Vendor',
    rating: 5,
    text: 'As a floral design studio, upgrading to Premium on WedPlan boosted our bookings by 300%. The booking request management keeps our team organized without date clashes.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
  },
];

export function Testimonials() {
  return (
    <section className="py-24 bg-white border-t border-rose-100/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200/50">
            Real Stories, Real Celebrations
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-950 mt-3">
            Loved by Couples & Vendors
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            Read how couples and wedding professionals create unforgettable memories through WedPlan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev, idx) => (
            <motion.div
              key={rev.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.08 }}
              className="p-8 rounded-3xl bg-slate-50/70 border border-rose-100/70 hover:border-rose-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-1 text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-8 h-8 text-rose-200" />
                </div>
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed italic">
                  "{rev.text}"
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-gray-200/60 flex items-center gap-3">
                <img
                  src={rev.image}
                  alt={rev.name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-rose-200"
                />
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 leading-tight">
                    {rev.name}
                  </h4>
                  <p className="text-xs text-rose-600 mt-0.5">{rev.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
