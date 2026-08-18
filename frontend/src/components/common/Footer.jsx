import React from 'react';
import { useBrand } from '../../context/BrandContext';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';

export const Footer = () => {
  const { brand } = useBrand();

  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-stone-800">

          {/* Brand Info & Story Summary */}
          <div>
            <h3 className="text-white font-serif text-lg font-bold mb-4">{brand.name}</h3>
            <p className="text-sm text-stone-400 leading-relaxed">
              {brand.slogan}
            </p>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-white font-serif text-lg font-bold mb-4">Hubungi Kami</h3>
            <ul className="space-y-3 text-sm text-stone-400">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <span>{brand.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-amber-500 shrink-0" />
                <span>{brand.phone}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-amber-500 shrink-0" />
                <span>{brand.email}</span>
              </li>
            </ul>
          </div>

          {/* Media Social & Operational */}
          <div>
            <h3 className="text-white font-serif text-lg font-bold mb-4">Media Sosial</h3>
            <div className="flex flex-col space-y-3 text-sm text-stone-400">
              <a
                href={`https://instagram.com/${brand.instagram.replace('@', '')}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 hover:text-amber-500 transition"
              >
                <svg
                  className="h-4 w-4 text-amber-500 fill-none stroke-current"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
                <span>{brand.instagram}</span>
              </a>
              <a href="#" className="flex items-center gap-2 hover:text-amber-500 transition">
                <Globe className="h-4 w-4 text-amber-500" />
                <span>{brand.website}</span>
              </a>
            </div>
            <p className="text-xs text-stone-500 mt-6">
              Jam Operasional: Senin - Sabtu (09.00 - 17.00 WIB)
            </p>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="flex justify-between items-center pt-8 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} {brand.name}. Hak Cipta Dilindungi.</p>
          <p>Ditenagai oleh React & Clerk</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
