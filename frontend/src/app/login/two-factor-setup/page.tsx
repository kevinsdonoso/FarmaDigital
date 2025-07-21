'use client';

import { Suspense } from 'react';
import TwoFactorSetupContent from './TwoFactorSetupContent';

// Loading simple
function TwoFactorSetupLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg border border-gray-200 p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Preparando configuración 2FA...</p>
        </div>
      </div>
    </div>
  );
}

// Página principal 
export default function TwoFactorSetupPage() {
  return (
    <Suspense fallback={<TwoFactorSetupLoading />}>
      <TwoFactorSetupContent />
    </Suspense>
  );
}