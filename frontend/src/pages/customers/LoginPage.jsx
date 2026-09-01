import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SignIn } from '@clerk/clerk-react';
import { useBrand } from '../../context/BrandContext';
import { ShieldCheck, ArrowRight, UserCheck, ShoppingBag } from 'lucide-react';

export const LoginPage = () => {
  const { brand, setAdminDemo, setCustomerDemo } = useBrand();
  const navigate = useNavigate();

  const handleAdminQuickLogin = () => {
    setAdminDemo(true);
    navigate('/admin');
  };

  const handleCustomerQuickLogin = () => {
    setCustomerDemo(true);
    navigate('/products');
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-6 py-12 bg-stone-50 font-['Inter'] font-normal">
      <div className="w-full max-w-md flex flex-col items-center gap-6">
        <div className="text-center">
          <span className="text-amber-600 text-xs font-bold uppercase tracking-widest block mb-1">AUTHENTICATION</span>
          <h1 className="text-3xl font-bold uppercase tracking-tight text-black">{brand.name}</h1>
          <p className="text-stone-500 text-xs uppercase tracking-wider font-normal mt-1">Masuk untuk melanjutkan pengalaman belanja &amp; administrasi.</p>
        </div>

        {/* Dedicated Admin & Customer Quick Login Card */}
        <div className="w-full bg-zinc-900 text-white p-5 border border-neutral-800 rounded-xs shadow-md flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">AKSES INSTAN (DEMO / PRESENTASI)</span>
            </div>
            <span className="text-[10px] bg-amber-400/20 text-amber-300 font-bold px-2 py-0.5 uppercase tracking-wider">
              1-Click
            </span>
          </div>
          <p className="text-xs text-stone-300 font-normal leading-relaxed">
            Gunakan akses instan di bawah ini untuk presentasi client tanpa perlu verifikasi email/SMS eksternal.
          </p>

          <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
            <button
              onClick={handleAdminQuickLogin}
              className="flex-1 py-3 bg-white text-black hover:bg-amber-400 hover:text-black font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>LOGIN ADMIN</span>
              <ArrowRight className="w-3 h-3" />
            </button>
            <button
              onClick={handleCustomerQuickLogin}
              className="flex-1 py-3 bg-neutral-800 text-white hover:bg-white hover:text-black border border-neutral-700 font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>LOGIN CUSTOMER</span>
            </button>
          </div>
        </div>

        {/* Clerk Auth Component */}
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
