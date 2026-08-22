import React, { useEffect, useState, useCallback } from 'react';
import { getProducts } from '../../api/products';
import { ProductCard } from '../../components/products/ProductCard';
import { Loader2 } from 'lucide-react';

// KTLG-3: pagination via ?limit&offset — tombol "Muat Lebih" meminta halaman berikut.
const PAGE_SIZE = 6;

export const KatalogProduk = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(false);

  const fetchProducts = useCallback(async (offset = 0) => {
    const isFirstPage = offset === 0;
    try {
      if (isFirstPage) setLoading(true); else setLoadingMore(true);
      setError(null);
      const data = await getProducts(PAGE_SIZE, offset);
      // Halaman pertama mengganti list; halaman berikutnya menambah di belakang.
      setProducts((prev) => (isFirstPage ? data : [...prev, ...data]));
      setHasMore(data.length === PAGE_SIZE);
    } catch (err) {
      console.error('Gagal memuat katalog:', err);
      setError('Gagal memuat katalog produk. Coba lagi nanti.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(0);
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

      {/* Load More */}
      {hasMore && !loading && (
        <div className="text-center">
          <button
            onClick={() => fetchProducts(products.length)}
            disabled={loadingMore}
            className="inline-flex items-center gap-2 border border-amber-900 text-amber-900 hover:bg-amber-900 hover:text-white font-semibold text-sm px-6 py-3 rounded-xl transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            <Loader2 className={`h-4 w-4 ${loadingMore ? 'animate-spin' : 'hidden'}`} />
            <span>{loadingMore ? 'Memuat...' : 'Muat Lebih Banyak'}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default KatalogProduk;
