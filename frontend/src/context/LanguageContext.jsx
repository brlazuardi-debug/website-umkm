import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  id: {
    nav: {
      home: 'Beranda',
      catalog: 'Katalog',
      about: 'Tentang',
      login: 'MASUK',
      profile: 'Profil',
      adminPanel: 'Panel Admin',
      demoAdmin: 'Demo Admin',
      adminOn: 'Admin (On)',
    },
    hero: {
      headline: 'ELEVATE YOUR\nEVERYDAY',
      subheadline: 'Koleksi busana luxury minimalist esensial yang dirancang secara presisi dengan kualitas tekstil terbaik dan estetika tak lekang oleh waktu.',
      shopNow: 'BELANJA SEKARANG',
      curatedDrop: 'KURASI EKSKLUSIF',
      newArrivals: 'KOLEKSI TERBARU',
      viewAll: 'LIHAT SEMUA KATALOG',
      featured: 'IKONIK VARCA',
    },
    philosophy: {
      tag: 'OUR PHILOSOPHY',
      title: 'MINIMALIST LUXURY TAILORED FOR LONGEVITY',
      story: 'VARCA adalah label fashion luxury minimalist yang mengutamakan siluet arsitektural, material premium, dan pengerjaan tangan teliti. Setiap karya dirancang melampaui tren musiman untuk membangun fondasi lemari pakaian yang elegan, berkarakter, dan abadi.',
      exploreCollection: 'JELAJAHI KOLEKSI LENGKAP',
    },
    catalog: {
      badge: 'KOLEKSI VARCA',
      title: 'KATALOG PRODUK',
      subtitle: 'Temukan koleksi busana tailored, sepatu kulit, jam tangan, dan aksesori mewah untuk gaya hidup modern Anda.',
      category: 'KATEGORI',
      sort: 'URUTKAN',
      size: 'UKURAN',
      sortRecommended: 'Rekomendasi',
      sortLowest: 'Harga: Rendah ke Tinggi',
      sortHighest: 'Harga: Tinggi ke Rendah',
      lowStock: 'LOW STOCK',
      noProducts: 'Tidak ada produk dalam kategori ini.',
      viewAllBtn: 'Lihat Semua Produk',
    },
    detail: {
      limitedRun: 'LIMITED RUN — STOK:',
      color: 'WARNA',
      size: 'UKURAN',
      sizeGuide: 'Panduan Ukuran',
      buyNow: 'BELI SEKARANG (INSTANT CHECKOUT)',
      outOfStock: 'STOK HABIS',
      shippingReturns: 'PENGIRIMAN & PENGEMBALIAN BEBAS BIAYA',
      shippingDesc: 'Pengiriman complimentary ke seluruh Indonesia untuk pesanan di atas Rp 1.000.000. Garansi penukaran ukuran 7 hari kerja.',
      careMaintenance: 'PERAWATAN & PEMELIHARAAN',
      careDesc: 'Dry clean atau cuci manual dengan air dingin dan deterjen sutra/katun halus. Setrika dengan uap suhu sedang.',
      completeTheLook: 'LENGKAPI TAMPILAN ANDA (COMPLETE THE LOOK)',
    },
    checkout: {
      badge: 'TRANSACTION CHECKOUT',
      title: 'CHECKOUT PESANAN',
      backToCatalog: 'KEMBALI KE KATALOG',
      customerInfo: '1. Informasi Pelanggan',
      email: 'Alamat Email',
      shippingAddress: '2. Alamat Pengiriman',
      firstName: 'Nama Depan',
      lastName: 'Nama Belakang',
      address: 'Alamat Lengkap',
      apartment: 'Apartemen / Suite (Opsional)',
      city: 'Kota / Wilayah',
      postalCode: 'Kode Pos',
      paymentMethod: '3. Metode Pembayaran',
      qris: 'QRIS (Verifikasi Otomatis)',
      bankTransfer: 'Transfer Bank / Virtual Account',
      orderSummary: 'RINGKASAN PESANAN',
      subtotal: 'SUBTOTAL',
      shipping: 'PENGIRIMAN',
      shippingFree: 'GRATIS (COMPLIMENTARY)',
      method: 'METODE BAYAR',
      total: 'TOTAL PEMBAYARAN',
      payNow: 'BAYAR SEKARANG',
      processing: 'MEMPROSES TRANSAKSI...',
      secureCheckout: '256-Bit Encrypted Secure Checkout',
    },
    footer: {
      tagline: 'Elevate your everyday with premium minimalist essentials.',
      collections: 'KOLEKSI',
      customerCare: 'LAYANAN PELANGGAN',
      location: 'LOKASI ATELIER',
      operational: 'Operasional: Senin - Sabtu (09:00 - 20:00 WIB)',
      rights: 'VARCA BRAND. HAK CIPTA DILINDUNGI.',
    }
  },
  en: {
    nav: {
      home: 'Home',
      catalog: 'Catalog',
      about: 'About',
      login: 'SIGN IN',
      profile: 'Profile',
      adminPanel: 'Admin Panel',
      demoAdmin: 'Admin Demo',
      adminOn: 'Admin (On)',
    },
    hero: {
      headline: 'ELEVATE YOUR\nEVERYDAY',
      subheadline: 'A curated wardrobe of architectural silhouettes, uncompromising textiles, and timeless monochromatic elegance tailored for the modern individual.',
      shopNow: 'SHOP NOW',
      curatedDrop: 'CURATED DROP',
      newArrivals: 'NEW ARRIVALS',
      viewAll: 'VIEW ALL CATALOG',
      featured: 'VARCA ICONIC',
    },
    philosophy: {
      tag: 'OUR PHILOSOPHY',
      title: 'MINIMALIST LUXURY TAILORED FOR LONGEVITY',
      story: 'VARCA is a luxury minimalist atelier dedicated to elevated essentials. Built on the philosophy of architectural silhouette, world-class textiles, and meticulous artisan craftsmanship, each garment transcends seasons to create an intentional, timeless wardrobe.',
      exploreCollection: 'EXPLORE FULL COLLECTION',
    },
    catalog: {
      badge: 'VARCA COLLECTION',
      title: 'PRODUCT CATALOG',
      subtitle: 'Discover our curated selection of tailored suits, calfskin footwear, chronographs, and wardrobe staples.',
      category: 'CATEGORY',
      sort: 'SORT BY',
      size: 'SIZE',
      sortRecommended: 'Recommended',
      sortLowest: 'Price: Low to High',
      sortHighest: 'Price: High to Low',
      lowStock: 'LOW STOCK',
      noProducts: 'No products available in this category.',
      viewAllBtn: 'View All Products',
    },
    detail: {
      limitedRun: 'LIMITED RUN — STOCK:',
      color: 'COLOR',
      size: 'SIZE',
      sizeGuide: 'Size Guide',
      buyNow: 'BUY NOW (INSTANT CHECKOUT)',
      outOfStock: 'OUT OF STOCK',
      shippingReturns: 'SHIPPING & COMPLIMENTARY RETURNS',
      shippingDesc: 'Complimentary shipping across Indonesia on orders over Rp 1,000,000. 7-day complimentary return and size exchange policy.',
      careMaintenance: 'CARE & MAINTENANCE',
      careDesc: 'Professional dry clean or hand wash cold with gentle detergent. Steam iron on medium setting to preserve natural fiber tension.',
      completeTheLook: 'COMPLETE THE LOOK',
    },
    checkout: {
      badge: 'TRANSACTION CHECKOUT',
      title: 'ORDER CHECKOUT',
      backToCatalog: 'BACK TO CATALOG',
      customerInfo: '1. Customer Information',
      email: 'Email Address',
      shippingAddress: '2. Shipping Address',
      firstName: 'First Name',
      lastName: 'Last Name',
      address: 'Street Address',
      apartment: 'Apartment / Suite (Optional)',
      city: 'City / Region',
      postalCode: 'Postal Code',
      paymentMethod: '3. Payment Method',
      qris: 'QRIS (Instant Verification)',
      bankTransfer: 'Bank Transfer / Virtual Account',
      orderSummary: 'ORDER SUMMARY',
      subtotal: 'SUBTOTAL',
      shipping: 'SHIPPING',
      shippingFree: 'FREE (COMPLIMENTARY)',
      method: 'PAYMENT METHOD',
      total: 'TOTAL AMOUNT',
      payNow: 'PAY NOW',
      processing: 'PROCESSING TRANSACTION...',
      secureCheckout: '256-Bit Encrypted Secure Checkout',
    },
    footer: {
      tagline: 'Elevate your everyday with premium minimalist essentials.',
      collections: 'COLLECTIONS',
      customerCare: 'CUSTOMER CARE',
      location: 'ATELIER LOCATION',
      operational: 'Operational: Monday - Saturday (09:00 - 20:00 WIB)',
      rights: 'VARCA BRAND. ALL RIGHTS RESERVED.',
    }
  }
};

const LanguageContext = createContext({
  language: 'id',
  setLanguage: () => {},
  t: translations.id,
});

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('varca_lang') || 'id';
  });

  const setLanguage = (lang) => {
    setLanguageState(lang);
    localStorage.setItem('varca_lang', lang);
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = translations[language] || translations.id;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

export default LanguageContext;
