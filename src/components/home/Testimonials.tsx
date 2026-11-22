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
    card: 'from-rose-50/90 via-pink-50/50 to-white',
    bar: 'from-rose-500 via-pink-500 to-fuchsia-500',
    quote: 'text-rose-200',
    ring: 'from-rose-400 to-pink-500',
    roleText: 'text-rose-600',
  },
  {
    name: 'Jessica & Marcus Taylor',
    role: 'Married in Malibu, CA',
    rating: 5,
    text: 'The transparent pricing is a game-changer. We knew exactly what our catering and florist packages included before requesting the booking. 10/10 platform.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    card: 'from-sky-50/90 via-blue-50/50 to-white',
    bar: 'from-sky-500 via-blue-500 to-indigo-500',
    quote: 'text-sky-200',
    ring: 'from-sky-400 to-indigo-500',
    roleText: 'text-blue-600',
  },
  {
    name: 'Elena Vance (Royal Blooms Floral)',
    role: 'Verified Premium Vendor',
    rating: 5,
    text: 'As a floral design studio, upgrading to Premium on WedPlan boosted our bookings by 300%. The booking request management keeps our team organized without date clashes.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    card: 'from-amber-50/90 via-yellow-50/50 to-white',
    bar: 'from-amber-500 via-orange-500 to-red-400',
    quote: 'text-amber-200',
    ring: 'from-amber-400 to-orange-500',
    roleText: 'text-amber-700',
  },
];

export function Testimonials() {
  return (
    <section className="relative py-24 overflow-hidden border-t border-rose-100/60 bg-gradient-to-b from-white via-fuchsia-50/25 to-rose-50/30">
      <div className="aurora-orb absolute left-1/3 bottom-0 w-80 h-80 bg-amber-200/35" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block text-xs font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-amber-500 via-rose-500 to-fuchsia-500 px-4 py-1.5 rounded-full shadow-md shadow-amber-500/20">
            Real Stories, Real Celebrations
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-950 mt-4">
            Loved by <span className="text-gradient-rose">Couples</span> &amp; Vendors
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
              className={`group relative overflow-hidden p-8 rounded-3xl bg-gradient-to-br ${rev.card} border border-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between`}
            >
              <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${rev.bar}`} />
              <div>
                <div className="flex items-center justify-between mb-4 pt-2">
                  <div className="flex gap-1 text-amber-400 drop-shadow-sm">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <Quote className={`w-10 h-10 ${rev.quote} group-hover:scale-110 transition-transform`} />
                </div>
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed italic">
                  &quot;{rev.text}&quot;
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-white/80 flex items-center gap-3">
                <div className={`w-11 h-11 rounded-full p-0.5 bg-gradient-to-br ${rev.ring} shrink-0`}>
                  <img
                    src={rev.image}
                    alt={rev.name}
                    className="w-full h-full rounded-full object-cover border-2 border-white"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 leading-tight">
                    {rev.name}
                  </h4>
                  <p className={`text-xs mt-0.5 font-semibold ${rev.roleText}`}>{rev.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
