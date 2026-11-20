'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { User, Mail, Building2, Image as ImageIcon, Save, ShieldCheck } from 'lucide-react';

export default function ProfileSettingsPage() {
  const { user, updateUserProfile, refreshUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [image, setImage] = useState(user?.image || '');
  const [businessName, setBusinessName] = useState(user?.businessName || '');
  const [isSaving, setIsSaving] = useState(false);

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
      });
      await refreshUser();
      toast.success('Profile details updated successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-950">
          Account Profile Settings
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Update your public profile, contact information, and business identity.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-xs space-y-6">
        {/* Avatar Preview */}
        <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
          {image ? (
            <img
              src={image}
              alt=""
              className="w-16 h-16 rounded-full object-cover border-2 border-rose-200"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-xl shadow-sm">
              {name ? name.charAt(0).toUpperCase() : 'U'}
            </div>
          )}
          <div>
            <h3 className="font-semibold text-base text-gray-900">{name || 'Your Name'}</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-rose-100 text-rose-800">
                {user?.role}
              </span>
              {user?.role === 'vendor' && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                  {user.subscriptionPlan === 'premium' ? '★ Premium Plan' : 'Free Tier'}
                </span>
              )}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name *"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            icon={<User className="w-4 h-4" />}
          />

          {user?.role === 'vendor' && (
            <Input
              label="Business / Studio Name"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              icon={<Building2 className="w-4 h-4" />}
            />
          )}

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
            <p className="text-[10px] text-gray-400 mt-1">
              Email addresses are verified credentials and cannot be modified.
            </p>
          </div>

          <Input
            label="Profile Image URL"
            placeholder="https://i.ibb.co/... or https://images.unsplash.com/..."
            value={image}
            onChange={(e) => setImage(e.target.value)}
            icon={<ImageIcon className="w-4 h-4" />}
          />

          <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-[11px] text-gray-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Changes sync immediately
            </span>
            <Button type="submit" variant="primary" isLoading={isSaving}>
              <Save className="w-4 h-4 mr-1.5" />
              Save Profile Details
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
