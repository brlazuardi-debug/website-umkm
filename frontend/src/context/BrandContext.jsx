import React, { createContext, useContext, useState } from 'react';

const defaultBrand = {
  name: 'Sanggar Nusantara',
  slogan: 'Melestarikan Warisan Budaya Lewat Karya Tangan Terbaik',
  story: 'Didirikan pada tahun 2018 di Cirebon, Sanggar Nusantara berawal dari komunitas kecil pengrajin lokal yang berkomitmen mempertahankan metode tradisional pembuatan batik tulis dan anyaman rotan. Setiap produk kami mengandung sejarah panjang, ketekunan, dan cinta terhadap tanah air. Dengan mendukung kami, Anda ikut melestarikan mata pencaharian puluhan pengrajin lokal dan menjaga tradisi nusantara tetap hidup.',
  philosophies: [
    { title: '100% Karya Lokal', description: 'Semua bahan baku bersumber dari alam Indonesia dan dikerjakan langsung oleh pengrajin daerah.' },
    { title: 'Kualitas Premium', description: 'Setiap goresan canting dan anyaman rotan melewati proses kontrol kualitas yang ketat.' },
    { title: 'Dampak Sosial', description: 'Setiap hasil penjualan didedikasikan untuk peningkatan kesejahteraan komunitas pengrajin kami.' },
  ],
  address: 'Jl. Melati No. 45, Kesambi, Kota Cirebon, Jawa Barat 45134',
  phone: '+62 812-3456-7890',
  email: 'kontak@sanggarnantara.id',
  instagram: '@sanggar.nusantara',
  website: 'sanggarnusantara.id',
  logoUrl: null,
};

const BrandContext = createContext(undefined);

export const BrandProvider = ({ children }) => {
  const [brand] = useState(defaultBrand);
  // Toggle demo admin untuk frontend-only dev / bypass Clerk role metadata
  const [isAdminDemo, setAdminDemo] = useState(false);

  return (
    <BrandContext.Provider value={{ brand, isAdminDemo, setAdminDemo }}>
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
