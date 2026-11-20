'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { RoleGuard } from '@/components/common/RoleGuard';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { PlusCircle, Sparkles, ImagePlus, ArrowLeft, AlertCircle } from 'lucide-react';
import Link from 'next/link';

const CATEGORIES = [
  'Wedding Venues',
  'Photography & Videography',
  'Decoration & Florist',
  'Catering Services',
  'Makeup & Styling',
  'Wedding Fashion',
];

export default function AddServicePage() {
  const router = useRouter();
  const { user } = useAuth();

  const [serviceName, setServiceName] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [additionalImages, setAdditionalImages] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!serviceName || !category || !description || !price || !location) {
      toast.error('Please fill in all required fields.');
      return;
    }

    const images: string[] = [];
    if (imageUrl.trim()) images.push(imageUrl.trim());
    if (additionalImages.trim()) {
      const extra = additionalImages
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);
      images.push(...extra);
    }

    if (images.length === 0) {
      // Default high quality wedding fallback image if none provided
      images.push(
        'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80'
      );
    }

    setIsSubmitting(true);
    try {
      const res = await api.post('/services', {
        serviceName,
        category,
        description,
        price: Number(price),
        location,
        images,
      });

      toast.success(res.message || 'Service submitted successfully for admin review!');
      router.push('/dashboard/vendor/services');
    } catch (err: any) {
      if (err.data?.requiresUpgrade) {
        toast.error(err.message, {
          action: {
            label: 'Upgrade to Premium',
            onClick: () => router.push('/dashboard/vendor/subscription'),
          },
        });
      } else {
        toast.error(err.message || 'Failed to create service.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFree = user?.subscriptionPlan !== 'premium';

  return (
    <RoleGuard allowedRoles={['vendor']}>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <Link
            href="/dashboard/vendor/services"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-rose-600 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Services
          </Link>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-950">
            Publish a Wedding Service
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Fill out your service specifications, pricing, and showcase photos. New listings are reviewed by admin.
          </p>
        </div>

        {isFree && (
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Free Plan Notice</p>
              <p className="text-amber-700 mt-0.5">
                Free vendors may publish up to 3 active services. Need to publish unlimited packages?{' '}
                <Link href="/dashboard/vendor/subscription" className="font-semibold underline">
                  Upgrade to Premium for $49/yr
                </Link>
                .
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-xs space-y-5">
          <Input
            label="Service Title / Package Name *"
            required
            placeholder="e.g. Luxury Vineyard Reception & Ballroom"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-gray-700">
                Service Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-medium"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <Input
              type="number"
              min="0"
              step="1"
              label="Starting Price (USD) *"
              required
              placeholder="e.g. 2500"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <Input
            label="City, State / Region *"
            required
            placeholder="e.g. Santa Barbara, CA"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-700">
              Service Description & Inclusions *
            </label>
            <textarea
              rows={4}
              required
              placeholder="Detail what is included in this wedding package: hours of coverage, equipment, guest limits, setup & breakdown..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
            />
          </div>

          <div className="space-y-3 pt-2 border-t border-gray-100">
            <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
              <ImagePlus className="w-4 h-4 text-rose-500" /> Service Images (ImgBB / Web URL)
            </h4>

            <Input
              label="Primary Cover Image URL *"
              placeholder="https://i.ibb.co/... or https://images.unsplash.com/..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-gray-700">
                Additional Gallery Image URLs (One URL per line)
              </label>
              <textarea
                rows={2}
                placeholder="https://i.ibb.co/photo2.jpg&#10;https://i.ibb.co/photo3.jpg"
                value={additionalImages}
                onChange={(e) => setAdditionalImages(e.target.value)}
                className="w-full px-4 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 font-mono"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
            <Link href="/dashboard/vendor/services">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              Submit for Approval
            </Button>
          </div>
        </form>
      </div>
    </RoleGuard>
  );
}
