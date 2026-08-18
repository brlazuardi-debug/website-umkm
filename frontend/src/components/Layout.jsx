import React from 'react';
import Header from './common/Header';
import Footer from './common/Footer';

export const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-stone-50">
      <Header />
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
