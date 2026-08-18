import React from 'react';
import { SignUp } from '@clerk/clerk-react';
import { useBrand } from '../../context/BrandContext';

export const RegisterPage = () => {
  const { brand } = useBrand();

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-bold text-amber-900">{brand.name}</h1>
          <p className="text-stone-500 mt-2">Daftar dan dukung pengrajin UMKM lokal.</p>
        </div>
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-2">
          <SignUp
            routing="path"
            path="/register"
            signInUrl="/login"
            fallbackRedirectUrl="/"
            appearance={{ variables: { colorPrimary: '#78350f' } }}
          />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
