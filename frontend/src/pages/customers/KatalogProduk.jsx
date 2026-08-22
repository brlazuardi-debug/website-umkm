import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getProducts } from '../../api/products';
import { ChevronDown } from 'lucide-react';

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
        setProducts(data);
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
    }).format(price);
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
    if (target === 'tops') return cat === 'baju' || cat === 'tops' || cat === 'shirts';
    if (target === 'bottoms') return cat === 'celana' || cat === 'bottoms';
    if (target === 'outerwear') return cat === 'jaket' || cat === 'outerwear';
    if (target === 'accessories') return cat === 'aksesoris' || cat === 'accessories';
    return cat === target;
  });

  const categories = ['ALL', 'TOPS', 'BOTTOMS', 'OUTERWEAR', 'ACCESSORIES'];
  const sizes = ['S', 'M', 'L', 'XL'];

  return (
    <div data-layer="Katalog Produk" className="KatalogProduk w-full min-h-screen relative bg-stone-50 text-stone-900 font-semibold">
      <div data-layer="Main Content Canvas" className="MainContentCanvas w-full max-w-[1280px] mx-auto px-6 sm:px-8 py-12 flex flex-col justify-start items-center gap-10 sm:gap-12">

        {/* Page Header */}
        <div data-layer="Page Header" className="PageHeader w-full max-w-[672px] pb-6 sm:pb-12 flex flex-col justify-start items-center gap-3.5 text-center">
          <div data-layer="Heading 1" className="Heading1 self-stretch flex flex-col justify-start items-center">
            <h1 data-layer="Text" className="Text text-black text-4xl sm:text-5xl font-bold leading-tight">Catalog</h1>
          </div>
          <div data-layer="Container" className="Container self-stretch flex flex-col justify-start items-center">
            <p data-layer="Text" className="Text text-stone-500 text-base sm:text-lg font-normal leading-relaxed">
              Discover our curated collection of high-end essentials, designed for the modern individual.
            </p>
          </div>
        </div>

        {/* Filter & Sort Bar */}
        <div data-layer="Filter & Sort Bar" className="FilterSortBar w-full border-b border-neutral-200 pb-8 flex flex-col gap-6">
          <div className="flex flex-wrap justify-between items-center gap-4">

            {/* Category Buttons */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <span className="text-stone-500 text-xs font-semibold uppercase tracking-wide">CATEGORY:</span>
              {categories.map((cat) => {
                const isActive = (cat === 'ALL' && activeCategory === 'ALL') || activeCategory.toUpperCase() === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={`px-4 py-2 text-xs font-semibold uppercase tracking-wide rounded-sm transition ${
                      isActive
                        ? 'bg-black text-white'
                        : 'border border-stone-300 text-stone-500 hover:border-black hover:text-black'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Price Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-stone-500 text-xs font-semibold uppercase tracking-wide">URUTKAN HARGA:</span>
              <div className="relative inline-block">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-stone-300 rounded-full px-4 py-2 pr-8 text-sm font-normal text-black cursor-pointer focus:outline-none focus:border-black"
                >
                  <option value="rekomendasi">Rekomendasi</option>
                  <option value="termurah">Harga: Rendah ke Tinggi</option>
                  <option value="termahal">Harga: Tinggi ke Rendah</option>
                </select>
                <ChevronDown className="w-4 h-4 text-stone-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

          </div>

          {/* Size Filter */}
          <div className="flex items-center gap-4 pt-2">
            <span className="text-stone-500 text-xs font-semibold uppercase tracking-wide">UKURAN:</span>
            <div className="flex items-center gap-2.5">
              {sizes.map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(selectedSize === sz ? '' : sz)}
                  className={`w-10 h-8 flex justify-center items-center rounded-sm border text-xs font-semibold uppercase tracking-wide transition ${
                    selectedSize === sz
                      ? 'bg-black text-white border-black'
                      : 'border-stone-300 text-stone-500 hover:border-black hover:text-black'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-900"></div>
          </div>
        ) : (
          <div data-layer="Product Grid" className="ProductGrid w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12 pb-12">
            {filteredProducts.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                data-layer="Article - Product Item"
                className="ArticleProductItem group flex flex-col justify-start items-start"
              >
                <div data-layer="Margin" className="Margin w-full pb-4 flex flex-col justify-start items-start">
                  <div data-layer="Background" className="Background w-full h-80 sm:h-96 relative bg-white flex flex-col justify-center items-start overflow-hidden border border-stone-100">
                    <img
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      src={product.gambar_url || "https://placehold.co/280x373"}
                      alt={product.nama}
                    />
                    {product.stok <= 3 && (
                      <div className="absolute top-4 left-4 bg-zinc-600 px-2 py-1 text-white text-[10px] font-semibold uppercase tracking-wide">
                        LOW STOCK
                      </div>
                    )}
                  </div>
                </div>
                <div data-layer="Container" className="Container w-full flex flex-col justify-end items-center text-center gap-1">
                  <h3 data-layer="Text" className="Text text-black text-lg sm:text-xl font-medium uppercase tracking-wide leading-7 line-clamp-1 group-hover:text-orange-500 transition">
                    {product.nama}
                  </h3>
                  <div data-layer="Text" className="Text text-orange-400 text-base sm:text-lg font-medium leading-5">
                    {formatPrice(product.harga)}
                  </div>
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
