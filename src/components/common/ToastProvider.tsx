'use client';

import React from 'react';
import { Toaster as SonnerToaster } from 'sonner';

export function ToastProvider() {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        className:
          'rounded-2xl shadow-xl shadow-rose-500/10 border border-rose-200/70 bg-gradient-to-r from-white to-rose-50/70 text-sm backdrop-blur-md',
      }}
      richColors
    />
  );
}
