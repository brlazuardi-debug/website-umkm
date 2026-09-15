import React from 'react';

export const ProductSpec = ({ product }) => {
  return (
    <div className="bg-stone-50 border border-neutral-200 p-6 font-['Inter'] font-normal">
      <h3 className="text-black font-bold text-sm uppercase tracking-wider mb-4">
        SPESIFIKASI PRODUK
      </h3>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 text-xs uppercase">
        <div>
          <dt className="text-stone-500 font-normal">KATEGORI</dt>
          <dd className="font-bold text-black mt-0.5">{product.kategori || 'Apparel'}</dd>
        </div>
        <div>
          <dt className="text-stone-500 font-normal">MATERIAL</dt>
          <dd className="font-bold text-black mt-0.5">Heavyweight Organic Cotton</dd>
        </div>
        <div>
          <dt className="text-stone-500 font-normal">STOK TERSEDIA</dt>
          <dd className="font-bold text-black mt-0.5">{product.stok} Unit</dd>
        </div>
        <div>
          <dt className="text-stone-500 font-normal">ORIGIN</dt>
          <dd className="font-bold text-black mt-0.5">Indonesia (VARCA Atelier)</dd>
        </div>
      </dl>
    </div>
  );
};

export default ProductSpec;
