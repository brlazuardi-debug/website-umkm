import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import { useBrand } from '../../context/BrandContext';

export const LoginPage = () => {
  const { brand } = useBrand();

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-6 py-12 bg-stone-50 font-['Inter']">
      <div className="w-full max-w-md flex flex-col items-center">
        <div className="text-center mb-8">
          <span className="text-orange-400 text-xs font-bold uppercase tracking-widest block mb-1">AUTHENTICATION</span>
          <h1 className="text-3xl font-bold uppercase tracking-tight text-black">{brand.name}</h1>
          <p className="text-stone-500 text-xs uppercase tracking-wider font-semibold mt-1">Masuk untuk melanjutkan pengalaman belanja.</p>
        </div>
        <div className="w-full bg-white border border-neutral-200 p-2 shadow-xs">
          <SignIn
            routing="path"
            path="/login"
            signUpUrl="/register"
            fallbackRedirectUrl="/"
            appearance={{
              variables: { colorPrimary: '#000000', colorText: '#000000', borderRadius: '0px' },
              elements: { card: 'shadow-none border-none' }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
