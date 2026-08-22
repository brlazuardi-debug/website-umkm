import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './common/Header';
import Footer from './common/Footer';

// Navigasi SPA menghilangkan scroll otomatis browser ke #hash —
// komponen ini mengembalikan perilaku tersebut saat pindah halaman.
const ScrollToHash = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const el = document.getElementById(hash.slice(1));
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }, [hash]);

  return null;
};

export const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-stone-50">
      <ScrollToHash />
      <Header />
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
