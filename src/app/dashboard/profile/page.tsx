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
          <div className="w-8 h-8 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin"></div>
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
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-950">
          Account Profile Settings
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Manage your personal information and contact details. Account roles are permanent.
        </p>
      </div>

      {/* Main Profile Settings Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-xs space-y-6">
        {/* Avatar Preview */}
        <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
          {image ? (
            <img
              src={image}
              alt=""
              className="w-16 h-16 rounded-full object-cover border-2 border-rose-200 shadow-sm"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-xl shadow-sm">
              {name ? name.charAt(0).toUpperCase() : 'U'}
            </div>
          )}
          <div>
            <h3 className="font-semibold text-base text-gray-900">{name || 'Your Name'}</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-800">
                {user?.role}
              </span>
              {user?.role === 'vendor' && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
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
            />

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Registered Email (Locked)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full pl-10 px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center gap-1">
                <Lock className="w-3 h-3 text-gray-400" /> Account Role (Locked)
              </label>
              <input
                type="text"
                disabled
                value={user?.role ? `${user.role.charAt(0).toUpperCase() + user.role.slice(1)} (Assigned at registration)` : ''}
                className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-500 capitalize cursor-not-allowed"
              />
            </div>

            <Input
              label="Profile Image URL"
              placeholder="https://images.unsplash.com/photo-..."
              value={image}
              onChange={(e) => setImage(e.target.value)}
              icon={<ImageIcon className="w-4 h-4" />}
            />
          </div>

          {user?.role === 'vendor' && (
            <div className="space-y-4 pt-2 border-t border-gray-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-900">
                Vendor Studio Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Business / Studio Name"
                  placeholder="e.g. Elegance Bridal Co."
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  icon={<Building2 className="w-4 h-4" />}
                />
                <Input
                  label="Business Contact Phone"
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  icon={<Phone className="w-4 h-4" />}
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
              />
              <Input
                label="City / Location"
                placeholder="e.g. New York, NY"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                icon={<MapPin className="w-4 h-4" />}
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
                className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <Button
              type="submit"
              variant="primary"
              isLoading={isSaving}
              className="px-6 shadow-md shadow-rose-500/10"
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
