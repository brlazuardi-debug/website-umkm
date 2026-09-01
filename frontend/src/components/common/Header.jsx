import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth, UserButton } from '@clerk/clerk-react';
import { useBrand } from '../../context/BrandContext';
import { useLanguage } from '../../context/LanguageContext';
import { ShieldCheck, LogIn, UserRound } from 'lucide-react';

export const Header = () => {
  const { isAdminDemo, setAdminDemo, isCustomerDemo, setCustomerDemo } = useBrand();
  const { language, setLanguage, t } = useLanguage();
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const pathname = location.pathname;
  const hash = location.hash;

  const isHomeActive = pathname === '/' && !hash;
  const isCatalogActive = pathname.startsWith('/products');
  const isAboutActive = hash === '#about' || (pathname === '/' && hash === '#about');
  const isProfileActive = pathname === '/profile';

  const navItems = [
    { label: t.nav.home, to: '/', active: isHomeActive },
    { label: t.nav.catalog, to: '/products', active: isCatalogActive },
    { label: t.nav.about, to: '/#about', active: isAboutActive },
  ];

  return (
    <header className="sticky top-0 z-50 bg-stone-50/90 backdrop-blur-md border-b border-neutral-200 font-['Inter']">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo & Brand Name */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-black text-2xl font-bold uppercase tracking-tight transition-transform duration-300 group-hover:scale-[1.02]">
              VARCA BRAND
            </span>
          </Link>

          {/* Navigation with Animated Active/Inactive Font Weight & Indicator */}
          <nav className="hidden md:flex items-center gap-10 text-xs uppercase tracking-wider">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className={`relative py-1.5 transition-all duration-300 ease-out ${
                  item.active
                    ? 'font-bold text-black scale-105'
                    : 'font-normal text-stone-500 hover:text-black hover:font-bold'
                }`}
              >
                <span>{item.label}</span>
                {item.active && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-black rounded-full transition-all duration-300 animate-in fade-in" />
                )}
              </Link>
            ))}
          </nav>

          {/* Actions & Language Switcher & Auth */}
          <div className="flex items-center gap-4">
            {/* Language Switcher (ID | EN) */}
            <div className="flex items-center bg-white border border-neutral-200 p-0.5 rounded-xs text-[11px] font-bold uppercase">
              <button
                onClick={() => setLanguage('id')}
                className={`px-2 py-1 transition-all duration-200 cursor-pointer ${
                  language === 'id'
                    ? 'bg-black text-white'
                    : 'text-stone-400 hover:text-black font-normal'
                }`}
                title="Bahasa Indonesia"
              >
                ID
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 transition-all duration-200 cursor-pointer ${
                  language === 'en'
                    ? 'bg-black text-white'
                    : 'text-stone-400 hover:text-black font-normal'
                }`}
                title="English"
              >
                EN
              </button>
            </div>

            {/* Admin Demo Button (Bekerja di Dev & Production) */}
            <button
              onClick={() => {
                const next = !isAdminDemo;
                setAdminDemo(next);
                if (next) {
                  navigate('/admin');
                } else {
                  navigate('/');
                }
              }}
              title="Toggle Role Admin / Mode Presentasi"
              className={`px-3 py-1.5 rounded text-xs tracking-wide uppercase transition-all duration-200 border cursor-pointer ${
                isAdminDemo
                  ? 'bg-rose-50 text-red-700 border-rose-200 font-bold shadow-xs'
                  : 'bg-white text-stone-600 border-neutral-200 font-normal hover:border-black hover:text-black'
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5 inline mr-1" />
              <span>{isAdminDemo ? t.nav.adminOn : t.nav.demoAdmin}</span>
            </button>

            {isSignedIn || isCustomerDemo ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/profile"
                  className={`inline-flex items-center gap-1.5 text-xs uppercase tracking-wide transition-all duration-300 ${
                    isProfileActive
                      ? 'font-bold text-black'
                      : 'font-normal text-stone-600 hover:text-black'
                  }`}
                >
                  <UserRound className="h-4 w-4" />
                  <span>{t.nav.profile}</span>
                </Link>
                {isAdminDemo && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider bg-black text-white px-4 py-2 hover:bg-neutral-800 transition-all duration-200 shadow-xs"
                  >
                    {t.nav.adminPanel}
                  </Link>
                )}
                {isSignedIn ? (
                  <UserButton afterSignOutUrl="/" />
                ) : (
                  <button
                    onClick={() => setCustomerDemo(false)}
                    className="text-[11px] font-bold text-stone-500 hover:text-black uppercase cursor-pointer"
                    title="Keluar dari sesi demo"
                  >
                    KELUAR
                  </button>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-5 py-2.5 bg-black text-white hover:bg-neutral-800 hover:scale-[1.02] transition-all duration-200 shadow-xs"
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>{t.nav.login}</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
