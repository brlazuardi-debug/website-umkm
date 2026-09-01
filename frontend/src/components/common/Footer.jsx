import React from 'react';
import { useBrand } from '../../context/BrandContext';
import { useLanguage } from '../../context/LanguageContext';

export const Footer = () => {
  const { brand } = useBrand();
  const { t } = useLanguage();

  return (
    <footer className="bg-black text-white font-['Inter'] font-normal border-t border-neutral-800 pt-16 pb-12">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12 border-b border-neutral-800">

          {/* Brand Info */}
          <div className="flex flex-col gap-4">
            <h3 className="text-2xl font-bold uppercase tracking-tight text-white">
              VARCA BRAND
            </h3>
            <p className="text-sm font-normal text-stone-400 leading-relaxed">
              {brand.slogan || t.footer.tagline}
            </p>
          </div>

          {/* Catalog Links */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              {t.footer.collections}
            </h4>
            <ul className="flex flex-col gap-2.5 text-sm font-bold text-stone-300">
              <li><a href="/products?category=tops" className="hover:text-white transition">Tops &amp; Suits</a></li>
              <li><a href="/products?category=bottoms" className="hover:text-white transition">Bottoms &amp; Shoes</a></li>
              <li><a href="/products?category=outerwear" className="hover:text-white transition">Outerwear</a></li>
              <li><a href="/products?category=accessories" className="hover:text-white transition">Accessories</a></li>
            </ul>
          </div>

          {/* Customer Support */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              {t.footer.customerCare}
            </h4>
            <ul className="flex flex-col gap-2.5 text-sm font-normal text-stone-300">
              <li><span className="text-stone-400 font-normal">{t.footer.operational}</span></li>
              <li><span className="text-stone-400 font-normal">{brand.email}</span></li>
              <li><span className="text-stone-400 font-normal">{brand.phone}</span></li>
            </ul>
          </div>

          {/* Address */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              {t.footer.location}
            </h4>
            <p className="text-sm font-normal text-stone-400 leading-relaxed">
              {brand.address}
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center pt-8 gap-4 text-xs font-bold text-stone-500 uppercase tracking-wider">
          <p>© {new Date().getFullYear()} {t.footer.rights}</p>
          <p>MINIMALIST LUXURY UMKM</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
