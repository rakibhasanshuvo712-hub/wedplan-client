'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { RoleGuard } from '@/components/common/RoleGuard';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Sparkles, ImagePlus, ArrowLeft, AlertCircle, CheckCircle2, Lock } from 'lucide-react';
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

  // Active services check for free plan limits
  const [activeServicesCount, setActiveServicesCount] = useState<number | null>(null);
  const [isCheckingLimits, setIsCheckingLimits] = useState(true);

  const isPremium = user?.subscriptionPlan === 'premium';

  useEffect(() => {
    const fetchServicesCount = async () => {
      try {
        const res = await api.get('/services/vendor/my-services');
        const list = res?.services || res?.data || [];
        const active = list.filter((s: { isActive?: boolean; status?: string }) => s.isActive !== false && s.status !== 'rejected');
        setActiveServicesCount(active.length);
      } catch (err) {
        console.error('Failed to check services count:', err);
      } finally {
        setIsCheckingLimits(false);
      }
    };

    fetchServicesCount();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isPremium && activeServicesCount !== null && activeServicesCount >= 3) {
      toast.error('Free plan limit reached (maximum 3 active services). Please upgrade to Premium.', {
        action: {
          label: 'Upgrade to Premium',
          onClick: () => router.push('/dashboard/vendor/subscription'),
        },
      });
      router.push('/dashboard/vendor/subscription');
      return;
    }

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
    } catch (err: unknown) {
      const errorData = (err as { data?: { upgradeRequired?: boolean; requiresUpgrade?: boolean }; statusCode?: number; message?: string });
      const isLimit =
        errorData?.data?.upgradeRequired ||
        errorData?.data?.requiresUpgrade ||
        errorData?.statusCode === 403 ||
        errorData?.message?.toLowerCase().includes('limit');

      if (isLimit) {
        toast.error('Free plan limit reached (maximum 3 active services). Please upgrade to Premium.', {
          action: {
            label: 'Upgrade to Premium',
            onClick: () => router.push('/dashboard/vendor/subscription'),
          },
        });
      } else {
        toast.error(errorData?.message || 'Failed to create service.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLimitReached = !isPremium && activeServicesCount !== null && activeServicesCount >= 3;

  return (
    <RoleGuard allowedRoles={['vendor']}>
      <div className="relative max-w-3xl mx-auto space-y-6">
        <div className="aurora-orb absolute -top-24 -left-28 w-72 h-72 bg-amber-300/25" />
        <div className="aurora-orb aurora-orb--slow absolute top-1/3 -right-28 w-72 h-72 bg-red-300/25" />
        <div>
          <Link
            href="/dashboard/vendor/services"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Services
          </Link>
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-red-700 bg-gradient-to-r from-red-100 to-red-100 border border-red-200/70 px-3 py-1 rounded-full shadow-sm shadow-red-500/10 mb-3">
            <Sparkles className="w-3 h-3 fill-red-400" /> New Listing
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gradient-rose">
            Publish a Wedding Service
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Fill out your service specifications, pricing, and showcase photos. New listings are reviewed by admin.
          </p>
        </div>

        {/* Loading state for limits */}
        {isCheckingLimits ? (
          <Skeleton className="h-16 w-full rounded-2xl ring-1 ring-amber-100/80" />
        ) : isLimitReached ? (
          /* Hard Lock Card When 3/3 Limit Reached */
          <div className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 rounded-3xl p-8 border-2 border-amber-300/80 shadow-xl shadow-amber-500/15 text-center space-y-6 animate-in fade-in duration-200">
            <div className="aurora-orb absolute -top-16 -left-16 w-56 h-56 bg-amber-300/30" />
            <div className="aurora-orb aurora-orb--slow absolute -bottom-20 -right-16 w-56 h-56 bg-red-300/25" />
            <div className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-red-500 text-white mx-auto flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Lock className="w-8 h-8" />
            </div>

            <div className="relative z-10 space-y-2">
              <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-amber-500/25">
                Free Plan Limit Reached (3 of 3 Active Services)
              </span>
              <h2 className="text-2xl font-serif font-bold text-gradient-gold pt-1">
                Upgrade to Publish Unlimited Wedding Services
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
                You have reached the maximum allowed <strong>3 active wedding services</strong> on the Free Starter plan. To publish additional services, unlock verified vendor badges, and get top placement, upgrade your account to Premium.
              </p>
            </div>

            <div className="relative z-10 p-4 bg-gradient-to-br from-white/90 to-amber-50/90 rounded-2xl border border-amber-200/80 max-w-md mx-auto text-left text-xs text-amber-900 space-y-2 shadow-sm shadow-amber-500/10">
              <p className="font-bold flex items-center gap-1.5 text-gradient-gold">
                <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
                WedPlan Premium Vendor ($49 / year):
              </p>
              <ul className="space-y-1.5 text-amber-800 text-[11px] pl-5 list-disc">
                <li>Publish unlimited wedding services & packages</li>
                <li>Priority ranking in category and location searches</li>
                <li>Verified Gold Vendor Badge on service details</li>
                <li>Direct customer inquiry routing</li>
              </ul>
            </div>

            <div className="relative z-10 pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/dashboard/vendor/subscription" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-700 hover:to-red-700 text-white font-bold shadow-md shadow-red-500/20 px-8 py-3 cursor-pointer">
                  <Sparkles className="w-4 h-4 mr-2 fill-current" />
                  Upgrade to Premium ($49/yr)
                </Button>
              </Link>
              <Link href="/dashboard/vendor/services" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto">
                  Manage Existing Services
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          /* Active Limits Notice */
          !isPremium && (
            <div className="p-4 bg-gradient-to-r from-amber-50 via-orange-50 to-red-50 rounded-2xl border border-amber-200/80 text-xs text-amber-900 flex items-start gap-3 shadow-sm shadow-amber-500/10">
              <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-red-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-amber-500/25">
                <AlertCircle className="w-4 h-4" />
              </span>
              <div>
                <p className="font-bold">
                  Free Starter Plan:{' '}
                  {activeServicesCount !== null ? `${activeServicesCount} of 3 active services used` : 'Maximum 3 active services'}
                </p>
                <p className="text-amber-700 mt-0.5">
                  Free vendors may publish up to 3 active services. Need to publish unlimited packages?{' '}
                  <Link href="/dashboard/vendor/subscription" className="font-semibold underline text-amber-900 hover:text-amber-950">
                    Upgrade to Premium for $49/yr
                  </Link>
                  .
                </p>
              </div>
            </div>
          )
        )}

        {/* Form only shown if limit is not reached */}
        {!isLimitReached && !isCheckingLimits && (
          <form onSubmit={handleSubmit} className="relative overflow-hidden bg-gradient-to-br from-white via-red-50/30 to-violet-50/30 rounded-3xl p-6 sm:p-8 border border-red-200/70 shadow-lg shadow-red-500/10 space-y-5">
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
                  className="w-full px-4 py-2.5 text-sm bg-white border border-red-200/80 hover:border-red-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 font-medium"
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
                className="w-full px-4 py-2.5 text-sm bg-white border border-red-200/80 hover:border-red-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
              />
            </div>

            <div className="space-y-3 pt-2 border-t border-red-200/70">
              <h4 className="text-xs font-bold text-gradient-rose uppercase tracking-wider flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-gradient-to-br from-red-500 to-red-600 text-white flex items-center justify-center shadow-sm shadow-red-500/25">
                  <ImagePlus className="w-3.5 h-3.5" />
                </span> Service Images (ImgBB / Web URL)
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
                  className="w-full px-4 py-2 text-xs bg-white border border-red-200/80 hover:border-red-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 font-mono"
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-red-200/70">
              <Link href="/dashboard/vendor/services">
                <Button type="button" variant="outline" className="border-red-200 text-red-700 hover:bg-red-50 font-semibold">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" variant="primary" className="bg-gradient-to-r from-red-600 via-red-600 to-red-600 hover:from-red-700 hover:via-red-700 hover:to-red-700 text-white font-bold shadow-lg shadow-red-500/25" isLoading={isSubmitting}>
                Submit for Approval
              </Button>
            </div>
          </form>
        )}
      </div>
    </RoleGuard>
  );
}
