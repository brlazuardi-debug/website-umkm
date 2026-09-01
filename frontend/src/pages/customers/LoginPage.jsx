import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SignIn } from '@clerk/clerk-react';
import { useBrand } from '../../context/BrandContext';
import { ShieldCheck, ArrowRight, UserCheck } from 'lucide-react';

export const LoginPage = () => {
  const { brand, setAdminDemo } = useBrand();
  const navigate = useNavigate();

  const handleAdminQuickLogin = () => {
    setAdminDemo(true);
    navigate('/admin');
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-6 py-12 bg-stone-50 font-['Inter'] font-normal">
      <div className="w-full max-w-md flex flex-col items-center gap-6">
        <div className="text-center">
          <span className="text-amber-600 text-xs font-bold uppercase tracking-widest block mb-1">AUTHENTICATION</span>
          <h1 className="text-3xl font-bold uppercase tracking-tight text-black">{brand.name}</h1>
          <p className="text-stone-500 text-xs uppercase tracking-wider font-normal mt-1">Masuk untuk melanjutkan pengalaman belanja &amp; administrasi.</p>
        </div>

        {/* Dedicated Admin Quick Login Card (Akses Khusus Admin) */}
        <div className="w-full bg-zinc-900 text-white p-5 border border-neutral-800 rounded-xs shadow-md">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">AKUN KHUSUS ADMIN / OWNER</span>
            </div>
            <span className="text-[10px] bg-amber-400/20 text-amber-300 font-bold px-2 py-0.5 uppercase tracking-wider">
              1-Click Demo
            </span>
          </div>
          <p className="text-xs text-stone-300 font-normal leading-relaxed mb-4">
            Gunakan akses instan ini untuk presentasi client &amp; review langsung seluruh fitur manajemen produk, pesanan, dan tim.
          </p>
          <button
            onClick={handleAdminQuickLogin}
            className="w-full py-3 bg-white text-black hover:bg-amber-400 hover:text-black font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <UserCheck className="w-4 h-4" />
            <span>MASUK SEBAGAI ADMIN / OWNER</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
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
