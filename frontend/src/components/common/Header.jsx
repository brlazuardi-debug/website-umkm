import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, UserButton } from '@clerk/clerk-react';
import { useBrand } from '../../context/BrandContext';
import { ShieldCheck, LogIn, UserRound } from 'lucide-react';

export const Header = () => {
  const { brand, isAdminDemo, setAdminDemo } = useBrand();
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Brand Name */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold tracking-tight text-amber-900 font-serif">
              {brand.name}
            </span>
          </Link>

          {/* Navigasi Utama */}
          <nav className="hidden md:flex space-x-8 text-sm font-medium text-stone-600">
            <Link to="/" className="hover:text-amber-700 transition">Beranda</Link>
            <Link to="/products" className="hover:text-amber-700 transition">Katalog Produk</Link>
            <Link to="/#tentang-kami" className="hover:text-amber-700 transition">Tentang Kami</Link>
          </nav>

          {/* User & Auth Buttons */}
          <div className="flex items-center space-x-4">
            {/* Quick Demo Toggle Admin — hanya untuk development/mockup review.
                Tidak ditampilkan di production karena bukan otorisasi sungguhan. */}
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
                className={`p-2 rounded-full transition flex items-center gap-1 text-xs border ${
                  isAdminDemo
                    ? 'bg-red-50 text-red-700 border-red-200 font-bold'
                    : 'bg-stone-50 text-stone-600 border-stone-200'
                }`}
              >
                <ShieldCheck className="h-4 w-4" />
                <span className="hidden sm:inline">{isAdminDemo ? 'Admin (On)' : 'Demo Admin'}</span>
              </button>
            )}

            {isSignedIn ? (
              <div className="flex items-center space-x-3">
                <Link
                  to="/profile"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-amber-900 hover:text-amber-700 transition"
                >
                  <UserRound className="h-4 w-4" />
                  <span>Profil</span>
                </Link>
                {isAdminDemo && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-1 text-xs font-semibold bg-amber-900 text-white px-3 py-1.5 rounded hover:bg-amber-800 transition"
                  >
                    Panel Admin
                  </Link>
                )}
                <UserButton afterSignOutUrl="/" />
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-1 text-sm font-semibold text-amber-900 hover:text-amber-700 transition"
              >
                <LogIn className="h-4 w-4" />
                <span>Masuk</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
