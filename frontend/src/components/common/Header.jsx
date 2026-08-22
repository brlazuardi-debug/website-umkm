import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, UserButton } from '@clerk/clerk-react';
import { useBrand } from '../../context/BrandContext';
import { ShieldCheck, LogIn, UserRound, ShoppingBag, Search } from 'lucide-react';

export const Header = () => {
  const { brand, isAdminDemo, setAdminDemo } = useBrand();
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-stone-50/90 backdrop-blur-md border-b border-neutral-200 font-['Inter']">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo & Brand Name */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-black text-2xl font-bold uppercase tracking-tight">
              VARCA BRAND
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-stone-700">
            <Link to="/" className="hover:text-black transition">Beranda</Link>
            <Link to="/products" className="hover:text-black transition">Katalog Produk</Link>
            <Link to="/products?category=baju" className="hover:text-black transition">Tops</Link>
            <Link to="/products?category=celana" className="hover:text-black transition">Bottoms</Link>
          </nav>

          {/* Actions & Auth */}
          <div className="flex items-center gap-4">
            {import.meta.env.DEV && (
              <button
                onClick={() => {
                  setAdminDemo(!isAdminDemo);
                  if (!isAdminDemo) {
                    navigate('/admin');
                  } else {
                    navigate('/');
                  }
                }}
                title="Toggle Role Admin (Developer Demo)"
                className={`px-3 py-1.5 rounded text-xs font-semibold tracking-wide uppercase transition border ${
                  isAdminDemo
                    ? 'bg-rose-50 text-red-700 border-rose-200 font-bold'
                    : 'bg-white text-stone-600 border-neutral-200'
                }`}
              >
                <ShieldCheck className="h-3.5 w-3.5 inline mr-1" />
                <span>{isAdminDemo ? 'Admin (On)' : 'Demo Admin'}</span>
              </button>
            )}

            {isSignedIn ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/profile"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-black hover:opacity-75 transition"
                >
                  <UserRound className="h-4 w-4" />
                  <span>Profil</span>
                </Link>
                {isAdminDemo && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider bg-black text-white px-4 py-2 hover:bg-neutral-800 transition"
                  >
                    Panel Admin
                  </Link>
                )}
                <UserButton afterSignOutUrl="/" />
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider px-5 py-2.5 bg-black text-white hover:bg-neutral-800 transition"
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>MASUK</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
