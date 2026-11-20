'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Heart,
  Menu,
  X,
  User as UserIcon,
  LayoutDashboard,
  Settings,
  LogOut,
  Sparkles,
  ChevronDown,
} from 'lucide-react';

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();

  const getDashboardLink = () => {
    if (!user) return '/dashboard';
    switch (user.role) {
      case 'admin':
        return '/dashboard/admin';
      case 'vendor':
        return '/dashboard/vendor';
      case 'customer':
      default:
        return '/dashboard/customer';
    }
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Browse Services', href: '/services' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-rose-100/60 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-rose-500/20 group-hover:scale-105 transition-transform">
              <Heart className="w-5 h-5 fill-white" />
            </div>
            <div>
              <span className="text-2xl font-serif font-bold bg-gradient-to-r from-rose-700 via-rose-600 to-pink-600 bg-clip-text text-transparent">
                WedPlan
              </span>
              <span className="hidden sm:inline-block ml-1 text-[10px] uppercase tracking-widest text-rose-400 font-semibold">
                Weddings
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-rose-600 bg-rose-50/80 font-semibold'
                      : 'text-gray-600 hover:text-rose-600 hover:bg-rose-50/50'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action / Auth Area */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  onBlur={() => setTimeout(() => setDropdownOpen(false), 200)}
                  className="flex items-center gap-2.5 p-1.5 pl-2.5 pr-3 rounded-full border border-rose-200/80 bg-rose-50/40 hover:bg-rose-50 text-gray-800 transition-all cursor-pointer"
                >
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover border border-rose-200"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center font-semibold text-xs shadow-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="text-left hidden lg:block">
                    <p className="text-xs font-semibold text-gray-900 leading-tight flex items-center gap-1">
                      {user.name}
                      {user.subscriptionPlan === 'premium' && (
                        <Sparkles className="w-3 h-3 text-amber-500 fill-amber-400" />
                      )}
                    </p>
                    <p className="text-[10px] text-rose-600 capitalize font-medium">
                      {user.role}
                    </p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400 ml-0.5" />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-rose-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2.5 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      <div className="mt-1.5 flex items-center gap-1.5">
                        <span className="inline-block px-2 py-0.5 text-[10px] font-semibold rounded-full bg-rose-100 text-rose-800 uppercase tracking-wider">
                          {user.role}
                        </span>
                        {user.role === 'vendor' && (
                          <span
                            className={`inline-block px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                              user.subscriptionPlan === 'premium'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {user.subscriptionPlan === 'premium' ? '★ Premium' : 'Free Tier'}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="py-1">
                      <Link
                        href={getDashboardLink()}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-rose-500" />
                        Dashboard
                      </Link>
                      <Link
                        href="/dashboard/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                      >
                        <Settings className="w-4 h-4 text-rose-500" />
                        Profile Settings
                      </Link>
                      {user.role === 'customer' && (
                        <Link
                          href="/dashboard/profile?becomeVendor=true"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-rose-700 hover:bg-rose-50 font-medium transition-colors"
                        >
                          <Sparkles className="w-4 h-4 text-amber-500" />
                          Become a Vendor
                        </Link>
                      )}
                    </div>

                    <div className="pt-1 border-t border-gray-100">
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer text-left"
                      >
                        <LogOut className="w-4 h-4 text-red-500" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/signup?role=vendor"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors shadow-2xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                  Become a Vendor
                </Link>
                <Link href="/signin">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button variant="primary" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-gray-700 hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-rose-100 bg-white px-4 pt-2 pb-6 space-y-3">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-xl text-base font-medium text-gray-700 hover:bg-rose-50 hover:text-rose-600"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="pt-3 border-t border-gray-100">
            {isAuthenticated && user ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-3 py-2 bg-rose-50/50 rounded-xl">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold">
                      {user.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{user.name}</p>
                    <p className="text-xs text-rose-600 capitalize font-medium">{user.role}</p>
                  </div>
                </div>

                <Link
                  href={getDashboardLink()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-rose-50 rounded-xl"
                >
                  <LayoutDashboard className="w-4 h-4 text-rose-500" />
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-rose-50 rounded-xl"
                >
                  <Settings className="w-4 h-4 text-rose-500" />
                  Profile Settings
                </Link>
                {user.role === 'customer' && (
                  <Link
                    href="/dashboard/profile?becomeVendor=true"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 text-sm font-semibold text-rose-700 bg-rose-50 rounded-xl"
                  >
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    Become a Vendor
                  </Link>
                )}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-1">
                <Link
                  href="/signup?role=vendor"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 px-4 rounded-xl text-center text-sm font-semibold text-rose-700 bg-rose-50 border border-rose-200 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-rose-500" />
                  Become a Vendor
                </Link>
                <Link href="/signin" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" className="w-full">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
