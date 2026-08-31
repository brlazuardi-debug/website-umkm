import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getProducts } from '../../api/products';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';

export const KatalogProduk = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'ALL';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [sortBy, setSortBy] = useState('rekomendasi');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts(100, 0);
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Gagal memuat produk:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(price || 0);
  };

  const handleCategoryChange = (cat) => {
    if (cat === 'ALL') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat.toLowerCase());
    }
    setSearchParams(searchParams);
  };

  const filteredProducts = products.filter((p) => {
    if (activeCategory === 'ALL') return true;
    const cat = p.kategori?.toLowerCase() || '';
    const target = activeCategory.toLowerCase();
    if (target === 'tops') return cat === 'baju' || cat === 'tops' || cat === 'shirts' || !cat;
    if (target === 'bottoms') return cat === 'celana' || cat === 'bottoms';
    if (target === 'outerwear') return cat === 'jaket' || cat === 'outerwear';
    if (target === 'accessories') return cat === 'aksesoris' || cat === 'accessories';
    return cat === target;
  }).sort((a, b) => {
    if (sortBy === 'termurah') return a.harga - b.harga;
    if (sortBy === 'termahal') return b.harga - a.harga;
    return 0;
  });

  const categories = ['ALL', 'TOPS', 'BOTTOMS', 'OUTERWEAR', 'ACCESSORIES'];
  const sizes = ['S', 'M', 'L', 'XL'];

  return (
    <div data-layer="Katalog Produk" className="KatalogProduk w-full min-h-screen relative bg-stone-50 text-stone-900 font-['Inter'] font-semibold">
      <div className="w-full max-w-[1280px] mx-auto px-6 sm:px-8 py-12 flex flex-col gap-10">

        {/* Page Header */}
        <div className="w-full max-w-[720px] mx-auto text-center flex flex-col gap-3">
          <span className="text-orange-400 text-xs font-bold uppercase tracking-widest">VARCA COLLECTION</span>
          <h1 className="text-black text-4xl sm:text-5xl font-bold uppercase tracking-tight">
            CATALOG
          </h1>
          <p className="text-stone-600 text-sm sm:text-base font-normal leading-relaxed">
            Discover our curated collection of architectural essentials, crafted for seamless modern living.
          </p>
        </div>

        {/* Filter & Sort Bar */}
        <div className="w-full border-b border-neutral-200 pb-6 flex flex-col gap-6">
          <div className="flex flex-wrap justify-between items-center gap-4">

            {/* Category Buttons */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="text-stone-500 text-xs font-bold uppercase tracking-wider mr-1">CATEGORY:</span>
              {categories.map((cat) => {
                const isActive = (cat === 'ALL' && activeCategory === 'ALL') || activeCategory.toUpperCase() === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition ${
                      isActive
                        ? 'bg-black text-white'
                        : 'border border-neutral-300 text-stone-600 hover:border-black hover:text-black bg-white'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Price Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-stone-500 text-xs font-bold uppercase tracking-wider">URUTKAN:</span>
              <div className="relative inline-block">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-neutral-300 px-4 py-2 pr-8 text-xs font-semibold uppercase tracking-wider text-black cursor-pointer focus:outline-none focus:border-black"
                >
                  <option value="rekomendasi">Rekomendasi</option>
                  <option value="termurah">Harga: Rendah ke Tinggi</option>
                  <option value="termahal">Harga: Tinggi ke Rendah</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-stone-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

          </div>

          {/* Size Filter */}
          <div className="flex items-center gap-3 pt-2">
            <span className="text-stone-500 text-xs font-bold uppercase tracking-wider mr-1">UKURAN:</span>
            <div className="flex items-center gap-2">
              {sizes.map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(selectedSize === sz ? '' : sz)}
                  className={`w-9 h-8 flex justify-center items-center border text-xs font-bold uppercase transition ${
                    selectedSize === sz
                      ? 'bg-black text-white border-black'
                      : 'bg-white border-neutral-300 text-stone-600 hover:border-black hover:text-black'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Grid / Shimmer Skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="flex flex-col gap-3 animate-pulse">
                <div className="aspect-[3/4] bg-neutral-200" />
                <div className="h-4 bg-neutral-200 w-3/4" />
                <div className="h-4 bg-neutral-200 w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-24 flex flex-col items-center gap-3">
            <p className="text-stone-500 text-base font-normal">Tidak ada produk dalam kategori ini.</p>
            <button
              onClick={() => handleCategoryChange('ALL')}
              className="px-6 py-2.5 bg-black text-white text-xs uppercase font-bold tracking-wider hover:bg-neutral-800"
            >
              Lihat Semua Produk
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12 pb-16">
            {filteredProducts.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="group flex flex-col"
              >
                <div className="aspect-[3/4] bg-zinc-100 overflow-hidden border border-neutral-200 mb-3 relative">
                  <img
                    className="w-full h-full object-cover grayscale contrast-115 transition-transform duration-500 group-hover:scale-105"
                    src={product.gambar_url || "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800"}
                    alt={product.nama}
                  />
                  {product.stok <= 3 && (
                    <span className="absolute top-3 left-3 bg-black text-white text-[10px] uppercase tracking-wider px-2 py-0.5 font-bold">
                      LOW STOCK
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-sm font-semibold text-black uppercase tracking-wide group-hover:text-orange-500 transition line-clamp-1">
                    {product.nama}
                  </h3>
                  <p className="text-sm text-stone-600 font-medium">
                    {formatPrice(product.harga)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default KatalogProduk;
