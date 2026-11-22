'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  User,
  Mail,
  Building2,
  Image as ImageIcon,
  Save,
  Phone,
  MapPin,
  FileText,
  Lock,
} from 'lucide-react';

export default function ProfileSettingsPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-[300px] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
        </div>
      }
    >
      <ProfileSettingsContent />
    </React.Suspense>
  );
}

function ProfileSettingsContent() {
  const { user, updateUserProfile, refreshUser } = useAuth();

  // Profile Form state
  const [name, setName] = useState(user?.name || '');
  const [image, setImage] = useState(user?.image || '');
  const [businessName, setBusinessName] = useState(user?.businessName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [isSaving, setIsSaving] = useState(false);

  // Decorative shared accent for editable inputs
  const inputClass = 'border-red-200 hover:border-red-300 focus:border-red-500 focus:ring-red-500/20';

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setImage(user.image || '');
      setBusinessName(user.businessName || '');
      setPhone(user.phone || '');
      setAddress(user.address || '');
      setBio(user.bio || '');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Name cannot be empty.');
      return;
    }

    setIsSaving(true);
    try {
      await updateUserProfile({
        name: name.trim(),
        image: image.trim(),
        businessName: user?.role === 'vendor' ? businessName.trim() : undefined,
        phone: phone.trim(),
        address: address.trim(),
        bio: bio.trim(),
      });
      await refreshUser();
      toast.success('Profile details updated successfully!');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update profile.';
      toast.error(msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      {/* Colourful page banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-500 via-red-600 to-violet-600 p-6 sm:p-8 shadow-xl shadow-red-500/25">
        <div className="absolute -top-12 -right-10 w-44 h-44 aurora-orb bg-amber-300/60" />
        <div className="absolute -bottom-16 -left-10 w-52 h-52 aurora-orb bg-red-300/60 aurora-orb--slow" />
        <div className="relative">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 border border-white/30 text-white/90 text-[10px] font-bold uppercase tracking-[0.18em] mb-3">
            <FileText className="w-3 h-3" />
            Your Account
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white drop-shadow-sm">
            Account Profile Settings
          </h1>
          <p className="text-xs sm:text-sm text-red-50/90 mt-1">
            Manage your personal information and contact details. Account roles are permanent.
          </p>
        </div>
      </div>

      {/* Main Profile Settings Form */}
      <div className="relative overflow-hidden bg-gradient-to-b from-red-50/50 via-white to-white rounded-3xl p-6 sm:p-8 border border-red-200/70 shadow-xl shadow-red-200/40 space-y-6">
        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-red-500 via-red-500 to-amber-400" />

        {/* Vibrant info callout */}
        <div className="flex items-start gap-3 rounded-2xl bg-gradient-to-r from-red-50 via-red-50 to-red-50 border border-red-100/80 p-3.5 shadow-sm shadow-red-100/50">
          <div className="shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-red-500 via-red-600 to-violet-600 text-white flex items-center justify-center shadow-md shadow-red-400/30">
            <Lock className="w-4 h-4" />
          </div>
          <p className="text-[11px] leading-relaxed text-red-950/80">
            Your account role and registered email are locked. The details below are safe to update at any time.
          </p>
        </div>

        {/* Avatar Preview */}
        <div className="flex items-center gap-4 pb-6 border-b border-red-100">
          <div className="p-0.5 rounded-full bg-gradient-to-tr from-red-500 via-red-500 to-amber-400 shadow-lg shadow-red-300/40 shrink-0">
            {image ? (
              <img
                src={image}
                alt=""
                className="w-16 h-16 rounded-full object-cover border-2 border-white"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 via-red-600 to-violet-600 text-white flex items-center justify-center font-bold text-xl border-2 border-white">
                {name ? name.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-base text-gray-900">{name || 'Your Name'}</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-red-500 to-red-500 text-white shadow-sm shadow-red-400/30">
                {user?.role}
              </span>
              {user?.role === 'vendor' && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-sm shadow-amber-400/30">
                  {user.subscriptionPlan === 'premium' ? '★ Premium Plan' : 'Free Tier'}
                </span>
              )}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name *"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              icon={<User className="w-4 h-4" />}
              className={inputClass}
            />

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Registered Email (Locked)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-red-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full pl-10 px-4 py-2.5 text-sm bg-gradient-to-r from-red-50/70 to-amber-50/40 border border-red-100 rounded-xl text-red-900/70 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center gap-1">
                <Lock className="w-3 h-3 text-red-400" /> Account Role (Locked)
              </label>
              <input
                type="text"
                disabled
                value={user?.role ? `${user.role.charAt(0).toUpperCase() + user.role.slice(1)} (Assigned at registration)` : ''}
                className="w-full px-4 py-2.5 text-sm bg-gradient-to-r from-red-50/70 to-red-50/40 border border-red-100 rounded-xl text-red-900/70 capitalize cursor-not-allowed"
              />
            </div>

            <Input
              label="Profile Image URL"
              placeholder="https://images.unsplash.com/photo-..."
              value={image}
              onChange={(e) => setImage(e.target.value)}
              icon={<ImageIcon className="w-4 h-4" />}
              className={inputClass}
            />
          </div>

          {user?.role === 'vendor' && (
            <div className="space-y-4 pt-2 border-t border-red-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gradient-rose">
                Vendor Studio Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Business / Studio Name"
                  placeholder="e.g. Elegance Bridal Co."
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  icon={<Building2 className="w-4 h-4" />}
                  className={inputClass}
                />
                <Input
                  label="Business Contact Phone"
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  icon={<Phone className="w-4 h-4" />}
                  className={inputClass}
                />
              </div>
            </div>
          )}

          {user?.role !== 'vendor' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Phone Number"
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                icon={<Phone className="w-4 h-4" />}
                className={inputClass}
              />
              <Input
                label="City / Location"
                placeholder="e.g. New York, NY"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                icon={<MapPin className="w-4 h-4" />}
                className={inputClass}
              />
            </div>
          )}

          {user?.role === 'vendor' && (
            <Input
              label="Location / Service City"
              placeholder="e.g. New York, NY"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              icon={<MapPin className="w-4 h-4" />}
              className={inputClass}
            />
          )}

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              About / Bio
            </label>
            <div className="relative">
              <textarea
                rows={3}
                placeholder="Share a brief introduction..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-4 py-2.5 text-sm bg-white border border-red-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
              />
            </div>
          </div>

          <div className="pt-5 border-t border-red-100 flex justify-end rounded-b-3xl bg-gradient-to-r from-red-50/0 via-red-50/50 to-red-50/0 -mx-6 sm:-mx-8 px-6 sm:px-8 -mb-6 sm:-mb-8 pb-6 sm:pb-8">
            <Button
              type="submit"
              variant="primary"
              isLoading={isSaving}
              className="px-8 bg-gradient-to-r from-red-600 via-red-600 to-violet-600 shadow-lg shadow-red-500/30 hover:from-red-700 hover:via-red-700 hover:to-violet-700"
            >
              <Save className="w-4 h-4 mr-1.5" />
              Save Profile Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
