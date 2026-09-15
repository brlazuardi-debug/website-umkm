import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './common/Header';
import Footer from './common/Footer';

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
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) {
    return (
      <div className="min-h-screen bg-stone-50 text-stone-900 font-['Inter']">
        <ScrollToHash />
        {children}
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-stone-50 text-stone-900 font-['Inter']">
      <ScrollToHash />
      <Header />
      <main className="grow w-full">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
