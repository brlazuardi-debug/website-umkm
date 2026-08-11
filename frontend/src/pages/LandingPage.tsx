import React, { useState, useEffect } from 'react';
import { useBrand } from '../context/BrandContext';
import { getProducts } from '../api/products';
import type { ProdukResponse } from '../types';
import ProductCard from '../components/products/ProductCard';
import { Sparkles, ArrowRight, CheckCircle, Package } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { brand } = useBrand();
  const [products, setProducts] = useState<ProdukResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination states
  const [limit] = useState<number>(6);
  const [offset, setOffset] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts(limit, offset);
        if (data.length < limit) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }

        if (offset === 0) {
          setProducts(data);
        } else {
          setProducts((prev) => [...prev, ...data]);
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Gagal memuat katalog produk. Silakan coba beberapa saat lagi.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [offset, limit]);

  return (
    <div className="space-y-16">
      {/* 1. Hero Section (Brand Profile) */}
      <section className="relative rounded-3xl overflow-hidden bg-stone-900 text-white min-h-[500px] flex items-center p-8 sm:p-12 lg:p-16">
        <div className="absolute inset-0 z-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-900/80 to-transparent z-10"></div>

        <div className="relative z-20 max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="h-3 w-3" />
            <span>Karya Autentik Nusantara</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif leading-tight">
            {brand.name}
          </h1>
          <p className="text-lg text-stone-300 font-medium font-serif leading-relaxed">
            {brand.slogan}
          </p>
          <div className="pt-4 flex flex-wrap gap-4">
            <a
              href="#katalog"
              className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition duration-200"
            >
              <span>Jelajahi Katalog</span>
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#tentang-kami"
              className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-xl border border-white/20 transition duration-200"
            >
              Cerita Kami
            </a>
          </div>
        </div>
      </section>

      {/* 2. Filosofi Brand Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {brand.philosophies.map((phil, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm hover:border-amber-200 transition duration-300">
            <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center mb-4 border border-amber-100">
              <CheckCircle className="h-5 w-5 text-amber-800" />
            </div>
            <h3 className="font-serif font-bold text-stone-900 text-lg mb-2">{phil.title}</h3>
            <p className="text-stone-500 text-sm leading-relaxed">{phil.description}</p>
          </div>
        ))}
      </section>

      {/* 3. Katalog Produk Section */}
      <section id="katalog" className="space-y-8 scroll-mt-20">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs uppercase tracking-wider text-amber-800 font-bold">Pilihan Terbaik</span>
          <h2 className="text-3xl font-bold font-serif text-stone-900">Produk Unggulan Kami</h2>
          <p className="text-stone-500 text-sm">
            Semua produk merupakan hasil kerajinan tangan eksklusif yang diproduksi secara terbatas oleh seniman lokal.
          </p>
        </div>

        {error ? (
          <div className="text-center p-8 bg-red-50 text-red-800 rounded-xl border border-red-100 max-w-md mx-auto">
            <p className="font-semibold">{error}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {loading && (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-950"></div>
              </div>
            )}

            {!loading && hasMore && (
              <div className="flex justify-center pt-4">
                <button
                  onClick={() => setOffset((prev) => prev + limit)}
                  className="inline-flex items-center gap-2 bg-stone-950 hover:bg-stone-800 text-white font-semibold text-sm px-6 py-3 rounded-xl transition duration-200"
                >
                  Muat Lebih Banyak
                </button>
              </div>
            )}

            {!loading && products.length === 0 && (
              <div className="text-center py-12 bg-white rounded-2xl border border-stone-200">
                <Package className="h-12 w-12 text-stone-300 mx-auto mb-2" />
                <p className="text-stone-500 text-sm">Belum ada produk aktif yang tersedia.</p>
              </div>
            )}
          </>
        )}
      </section>

      {/* 4. Tentang Kami (Story Section) */}
      <section id="tentang-kami" className="bg-amber-50/35 rounded-3xl p-8 sm:p-12 border border-amber-100/50 scroll-mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs uppercase tracking-wider text-amber-800 font-bold block">Cerita Brand</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-stone-900">
              Di Balik Keindahan Produk Lokal Sanggar Nusantara
            </h2>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              {brand.story}
            </p>
          </div>
          <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-md bg-stone-100 border border-stone-200">
            <img
              src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800&auto=format&fit=crop"
              alt="Pengrajin Sanggar Nusantara"
              className="w-full h-full object-cover object-center"
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </div>
  );
};
export default LandingPage;
