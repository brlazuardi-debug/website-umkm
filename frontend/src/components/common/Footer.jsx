import React from 'react';
import { useBrand } from '../../context/BrandContext';

export const Footer = () => {
  const { brand } = useBrand();

  return (
    <footer className="bg-black text-white font-['Inter'] border-t border-neutral-800 pt-16 pb-12">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12 border-b border-neutral-800">

          {/* Brand Info */}
          <div className="flex flex-col gap-4">
            <h3 className="text-2xl font-bold uppercase tracking-tight text-white">
              VARCA BRAND
            </h3>
            <p className="text-sm font-normal text-stone-400 leading-relaxed">
              {brand.slogan || 'Elevate your everyday with premium minimalist essentials.'}
            </p>
          </div>

          {/* Catalog Links */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-orange-400">
              COLLECTIONS
            </h4>
            <ul className="flex flex-col gap-2.5 text-sm font-semibold text-stone-300">
              <li><a href="/products?category=baju" className="hover:text-white transition">Tops</a></li>
              <li><a href="/products?category=celana" className="hover:text-white transition">Bottoms</a></li>
              <li><a href="/products?category=jaket" className="hover:text-white transition">Outerwear</a></li>
              <li><a href="/products" className="hover:text-white transition">All Products</a></li>
            </ul>
          </div>

          {/* Customer Support */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-orange-400">
              CUSTOMER CARE
            </h4>
            <ul className="flex flex-col gap-2.5 text-sm font-semibold text-stone-300">
              <li><span className="text-stone-400 font-normal">Operational: Mon - Sat</span></li>
              <li><span className="text-stone-400 font-normal">{brand.email}</span></li>
              <li><span className="text-stone-400 font-normal">{brand.phone}</span></li>
            </ul>
          </div>

          {/* Address */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-orange-400">
              LOCATION
            </h4>
            <p className="text-sm font-normal text-stone-400 leading-relaxed">
              {brand.address}
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center pt-8 gap-4 text-xs font-semibold text-stone-500 uppercase tracking-wider">
          <p>© {new Date().getFullYear()} VARCA BRAND. ALL RIGHTS RESERVED.</p>
          <p>MINIMALIST LUXURY UMKM</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
