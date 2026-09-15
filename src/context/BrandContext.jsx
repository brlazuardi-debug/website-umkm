import React, { createContext, useContext, useState } from 'react';
import heroBgImg from '../assets/hero-bg.jpg';

const defaultBrand = {
  name: 'VARCA BRAND',
  slogan: 'Elevate your everyday with premium minimalist essentials.',
  story: 'VARCA BRAND is a luxury minimalist fashion label dedicated to elevated everyday essentials. Founded on the principles of architectural silhouette, uncompromising fabric quality, and mindful craftsmanship, every piece is designed to transcend seasons and form the foundation of a modern, intentional wardrobe.',
  philosophies: [
    { title: 'Elevated Minimalism', description: 'Architectural cuts, refined monochromatic palettes, and meticulous attention to detail.' },
    { title: 'Uncompromising Quality', description: 'Heavyweight organic cottons, Italian wool blends, and durable luxury hardware.' },
    { title: 'Mindful Craftsmanship', description: 'Ethically crafted in limited runs to ensure exclusivity and reduce fashion waste.' },
  ],
  address: 'SCBD District 8, Senopati, South Jakarta 12190',
  phone: '+62 21-5098-7654',
  email: 'concierge@varca.id',
  instagram: '@varca.official',
  website: 'varca.id',
  hero_image: heroBgImg,
  logoUrl: null,
};

const BrandContext = createContext(undefined);

export const BrandProvider = ({ children }) => {
  const [brand] = useState(defaultBrand);
  // Toggle demo auth untuk presentasi & bypass Clerk jika key belum di-binding ke production domain
  const [isAdminDemo, setAdminDemo] = useState(() => {
    return localStorage.getItem('varca_admin_demo') === 'true';
  });
  const [isCustomerDemo, setCustomerDemo] = useState(() => {
    return localStorage.getItem('varca_customer_demo') === 'true';
  });

  const toggleAdminDemo = (val) => {
    setAdminDemo(val);
    localStorage.setItem('varca_admin_demo', val ? 'true' : 'false');
  };

  const toggleCustomerDemo = (val) => {
    setCustomerDemo(val);
    localStorage.setItem('varca_customer_demo', val ? 'true' : 'false');
  };

  return (
    <BrandContext.Provider value={{
      brand,
      isAdminDemo,
      setAdminDemo: toggleAdminDemo,
      isCustomerDemo,
      setCustomerDemo: toggleCustomerDemo,
    }}>
      {children}
    </BrandContext.Provider>
  );
};

export const useBrand = () => {
  const context = useContext(BrandContext);
  if (!context) {
    throw new Error('useBrand harus digunakan di dalam BrandProvider');
  }
  return context;
};

export default BrandContext;
