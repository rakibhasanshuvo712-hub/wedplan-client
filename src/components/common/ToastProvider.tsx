'use client';

import React from 'react';
import { Toaster as SonnerToaster } from 'sonner';

export function ToastProvider() {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        className: 'rounded-xl shadow-lg border text-sm',
      }}
      richColors
    />
  );
}
