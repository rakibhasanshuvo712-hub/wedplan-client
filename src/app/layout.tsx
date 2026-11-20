import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/components/common/ToastProvider';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'WedPlan — Wedding Planning Platform & Vendor Marketplace',
  description:
    'Discover premier wedding venues, photographers, florists, and catering artisans. Request bookings and manage your dream wedding with ease.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50/50 text-gray-900 selection:bg-rose-500 selection:text-white">
        <AuthProvider>
          <ToastProvider />
          <Suspense fallback={<div className="h-16 sm:h-20 bg-white border-b border-rose-100" />}>
            <Navbar />
          </Suspense>
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
