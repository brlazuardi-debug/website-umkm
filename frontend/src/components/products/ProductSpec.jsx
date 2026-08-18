import React from 'react';

const SpecItem = ({ label, value }) => (
  <div className="flex justify-between py-2 border-b border-stone-200 text-sm">
    <span className="text-stone-500 font-medium">{label}</span>
    <span className="text-stone-900 font-semibold text-right">{value}</span>
  </div>
);

export const ProductSpec = () => {
  return (
    <div className="bg-amber-50/50 rounded-xl p-6 border border-amber-100">
      <h3 className="font-serif font-bold text-amber-950 text-lg mb-4">
        Informasi Nilai Produk Lokal
      </h3>
      <div className="space-y-1">
        <SpecItem label="Asal Daerah" value="Cirebon, Jawa Barat" />
        <SpecItem label="Metode Produksi" value="100% Buatan Tangan (Handmade)" />
        <SpecItem label="Bahan Utama" value="Kapas Alami & Pewarna Alami" />
        <SpecItem label="Dampak Sosial" value="Membantu Komunitas Pengrajin Lokal" />
        <SpecItem label="Perawatan" value="Cuci lembut dengan tangan (Hindari detergen keras)" />
      </div>
      <div className="mt-4 p-3 bg-white rounded-lg border border-amber-100 text-xs text-amber-900 leading-relaxed italic">
        *Setiap helai kain dikerjakan secara manual oleh seniman kami. Variasi motif dan warna membuktikan keaslian proses canting tangan tradisional.
      </div>
    </div>
  );
};

export default ProductSpec;
