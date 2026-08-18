import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../../api/products';
import { ProductCard } from '../../components/products/ProductCard';
import { useBrand } from '../../context/BrandContext';
import { Leaf, HeartHandshake, Award, ArrowRight } from 'lucide-react';

export const LandingPage = () => {
  const { brand } = useBrand();
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await getProducts(4, 0);
        setFeatured(data);
      } catch (err) {
        console.error('Gagal memuat produk unggulan:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-amber-900 via-amber-800 to-stone-800 text-white px-8 py-20 sm:px-16 sm:py-28">
        <div className="max-w-2xl">
          <span className="inline-block px-3 py-1 rounded-full bg-white/15 text-xs font-semibold tracking-widest uppercase mb-5">
            {brand.name}
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold leading-tight mb-6">
            {brand.slogan}
          </h1>
          <p className="text-amber-100/90 text-lg leading-relaxed mb-8 max-w-xl">
            {brand.story}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-white text-amber-900 font-semibold px-6 py-3 rounded-xl hover:bg-amber-50 transition"
            >
              Lihat Katalog <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#tentang-kami"
              className="inline-flex items-center gap-2 border border-white/30 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/10 transition"
            >
              Tentang Kami
            </a>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="katalog" className="scroll-mt-24">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-serif text-3xl font-bold text-stone-900">Produk Unggulan</h2>
            <p className="text-stone-500 mt-1">Karya tangan terbaik dari pengrajin lokal kami.</p>
          </div>
          <Link to="/products" className="hidden sm:inline-flex items-center gap-1 text-amber-900 font-semibold hover:text-amber-700 transition">
            Lihat Semua <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-950"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Philosophies / About */}
      <section id="tentang-kami" className="scroll-mt-24 bg-stone-100 rounded-3xl p-8 sm:p-12">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="font-serif text-3xl font-bold text-stone-900">Filosofi Kami</h2>
          <p className="text-stone-500 mt-2">
            Tiga pilar yang mendasari setiap produk yang kami hasilkan.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-stone-200 text-center">
            <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-amber-100 text-amber-900 mb-4">
              <Leaf className="h-6 w-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-stone-900 mb-2">{brand.philosophies[0].title}</h3>
            <p className="text-stone-500 text-sm">{brand.philosophies[0].description}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-stone-200 text-center">
            <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-amber-100 text-amber-900 mb-4">
              <Award className="h-6 w-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-stone-900 mb-2">{brand.philosophies[1].title}</h3>
            <p className="text-stone-500 text-sm">{brand.philosophies[1].description}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-stone-200 text-center">
            <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-amber-100 text-amber-900 mb-4">
              <HeartHandshake className="h-6 w-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-stone-900 mb-2">{brand.philosophies[2].title}</h3>
            <p className="text-stone-500 text-sm">{brand.philosophies[2].description}</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-10">
        <h2 className="font-serif text-2xl font-bold text-stone-900 mb-3">
          Dukung pengrajin lokal, dapatkan karya berkualitas.
        </h2>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-amber-900 text-white font-semibold px-6 py-3 rounded-xl hover:bg-amber-800 transition"
        >
          Mulai Belanja <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
};

export default LandingPage;
