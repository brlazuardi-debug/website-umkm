import React, { useEffect, useState, useCallback } from 'react';
import { getProducts } from '../../api/products';
import { ProductCard } from '../../components/products/ProductCard';

export const KatalogProduk = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProducts(100, 0);
      setProducts(data);
    } catch (err) {
      console.error('Gagal memuat katalog:', err);
      setError('Gagal memuat katalog produk. Coba lagi nanti.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">Katalog Produk</h1>
        <p className="text-stone-500 mt-2">
          Jelajahi seluruh karya tangan dari pengrajin UMKM lokal kami.
        </p>
      </div>

      {error ? (
        <div className="p-4 bg-red-50 text-red-800 rounded-xl border border-red-100 max-w-md mx-auto text-center">
          {error}
        </div>
      ) : loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-950"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 text-stone-500">
          Belum ada produk tersedia saat ini.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default KatalogProduk;
