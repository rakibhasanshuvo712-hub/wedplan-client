'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
  ShieldCheck,
  Phone,
  MapPin,
  FileText,
  Sparkles,
  ArrowRight,
  CheckCircle2,
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
  const { user, updateUserProfile, becomeVendor, refreshUser } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Profile Form state
  const [name, setName] = useState(user?.name || '');
  const [image, setImage] = useState(user?.image || '');
  const [businessName, setBusinessName] = useState(user?.businessName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [isSaving, setIsSaving] = useState(false);

  // Vendor upgrade card state
  const [showUpgradeForm, setShowUpgradeForm] = useState(
    searchParams.get('becomeVendor') === 'true'
  );
  const [newVendorBusiness, setNewVendorBusiness] = useState('');
  const [newVendorPhone, setNewVendorPhone] = useState('');
  const [newVendorAddress, setNewVendorAddress] = useState('');
  const [newVendorBio, setNewVendorBio] = useState('');
  const [isUpgrading, setIsUpgrading] = useState(false);

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
    } catch (err: any) {
      toast.error(err.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleBecomeVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVendorBusiness.trim()) {
      toast.error('Please enter your business or studio name.');
      return;
    }

    setIsUpgrading(true);
    try {
      await becomeVendor({
        businessName: newVendorBusiness.trim(),
        phone: newVendorPhone.trim(),
        address: newVendorAddress.trim(),
        bio: newVendorBio.trim(),
      });
      toast.success('Congratulations! Your account is now a registered Wedding Vendor.');
      router.push('/dashboard/vendor');
    } catch (err: any) {
      toast.error(err.message || 'Failed to upgrade to vendor account.');
    } finally {
      setIsUpgrading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-950">
          Account Profile Settings
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Manage your personal information, public business identity, and contact details.
        </p>
      </div>

      {/* Become a Vendor Promotion Card for Customers */}
      {user?.role === 'customer' && (
        <div className="bg-gradient-to-br from-amber-500/10 via-rose-50 to-pink-500/10 border-2 border-amber-300/80 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-400" />
                Become a Wedding Vendor
              </div>
              <h2 className="text-xl font-serif font-bold text-gray-900">
                Are you a Wedding Vendor or Service Provider?
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-xl">
                Upgrade your account for free to publish services, receive inquiries directly from couples, manage booking requests, and get promoted on WedPlan.
              </p>
            </div>
            {!showUpgradeForm && (
              <Button
                type="button"
                variant="primary"
                className="shrink-0 bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-700 hover:to-rose-700 text-white shadow-md shadow-rose-500/20"
                onClick={() => setShowUpgradeForm(true)}
              >
                Become a Vendor
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            )}
          </div>

          {/* Upgrading Form */}
          {showUpgradeForm && (
            <form onSubmit={handleBecomeVendor} className="mt-6 pt-6 border-t border-amber-200/80 space-y-4 animate-in fade-in duration-200">
              <h3 className="text-sm font-semibold text-gray-900">
                Vendor Studio Registration
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Business / Studio Name *"
                  required
                  placeholder="e.g. Whispering Pines Estate"
                  value={newVendorBusiness}
                  onChange={(e) => setNewVendorBusiness(e.target.value)}
                  icon={<Building2 className="w-4 h-4" />}
                />
                <Input
                  label="Business Phone Number"
                  placeholder="e.g. +1 (555) 234-5678"
                  value={newVendorPhone}
                  onChange={(e) => setNewVendorPhone(e.target.value)}
                  icon={<Phone className="w-4 h-4" />}
                />
              </div>

              <Input
                label="Location / Service City"
                placeholder="e.g. Beverly Hills, CA"
                value={newVendorAddress}
                onChange={(e) => setNewVendorAddress(e.target.value)}
                icon={<MapPin className="w-4 h-4" />}
              />

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  About Your Wedding Studio / Bio
                </label>
                <textarea
                  rows={3}
                  value={newVendorBio}
                  onChange={(e) => setNewVendorBio(e.target.value)}
                  placeholder="Tell couples what makes your wedding service exceptional..."
                  className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isUpgrading}
                  className="bg-gradient-to-r from-amber-600 to-rose-600 text-white"
                >
                  <CheckCircle2 className="w-4 h-4 mr-1.5" />
                  Activate Vendor Account
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowUpgradeForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </div>
      )}

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
                  label="Contact Phone"
                  placeholder="e.g. +1 (555) 019-2831"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  icon={<Phone className="w-4 h-4" />}
                />
              </div>

              <Input
                label="Studio Address / Operating Area"
                placeholder="e.g. 100 Ocean Blvd, Santa Monica, CA"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                icon={<MapPin className="w-4 h-4" />}
              />

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Vendor Studio Bio
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Provide an overview of your studio expertise, experience, and wedding accolades..."
                  className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>
          )}

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
