import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, ChevronRight } from 'lucide-react';
import { useBrand } from '../../context/BrandContext';
import { useLanguage } from '../../context/LanguageContext';
import { getProducts } from '../../api/products';
import heroBgImg from '../../assets/hero-bg.jpg';

export const LandingPage = () => {
  const { brand } = useBrand();
  const { t } = useLanguage();
  const [products, setProducts] = React.useState([]);

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts(100, 0);
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Gagal memuat produk:', err);
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

  const tops = products.filter((p) => p.kategori?.toLowerCase() === 'tops');
  const defaultHero = heroBgImg;

  return (
    <div data-layer="Landing Page" className="LandingPage w-full min-h-screen relative bg-stone-50 text-stone-900 font-['Inter'] font-normal">
      <div data-layer="Main" className="Main w-full flex flex-col justify-start items-center gap-16 sm:gap-24 pb-20">

        {/* Hero Section */}
        <section data-layer="Hero Section" className="HeroSection w-full min-h-[560px] sm:min-h-[760px] relative bg-zinc-950 flex justify-center items-center overflow-hidden">
          <div data-layer="Container" className="Container absolute inset-0 flex flex-col justify-center items-start">
            <div
              className="w-full h-full opacity-90 bg-cover bg-center bg-no-repeat transition duration-700 hover:scale-105"
              style={{
                backgroundImage: `url(${brand.hero_image || defaultHero})`,
                imageRendering: '-webkit-optimize-contrast',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-black/20" />
          </div>

          <div className="w-full max-w-[1280px] px-6 sm:px-8 py-16 sm:py-24 relative z-10 flex flex-col justify-start items-start">
            <div className="w-full max-w-[672px] p-6 sm:p-10 bg-black/65 border border-neutral-700/80 backdrop-blur-md text-white rounded-xs shadow-2xl">
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold uppercase leading-tight sm:leading-[76px] mb-4 sm:mb-6 tracking-tight whitespace-pre-line">
                {t.hero.headline}
              </h1>
              <p className="text-stone-300 text-base sm:text-lg font-normal leading-relaxed mb-6 sm:mb-8">
                {t.hero.subheadline}
              </p>
              <Link
                to="/products"
                className="px-8 sm:px-10 py-4 bg-white text-black font-bold text-xs uppercase tracking-wider inline-flex items-center gap-3 hover:bg-amber-400 hover:text-black transition cursor-pointer shadow-lg hover:scale-105"
              >
                <span>{t.hero.shopNow}</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </Link>
            </div>
          </div>
        </section>

        {/* Section - New Arrivals Bento Grid */}
        <section data-layer="Section - Featured Collections Grid" className="w-full max-w-[1280px] px-6 sm:px-8 flex flex-col gap-8 sm:gap-12">
          <div className="w-full flex justify-between items-end">
            <div>
              <span className="text-amber-600 text-xs uppercase tracking-widest font-bold block mb-1">
                {t.hero.curatedDrop}
              </span>
              <h2 className="text-black text-2xl sm:text-4xl font-bold uppercase tracking-tight">
                {t.hero.newArrivals}
              </h2>
            </div>
            <Link to="/products" className="flex items-center gap-1.5 text-black hover:text-amber-700 text-xs font-bold uppercase tracking-wider transition">
              <span>{t.hero.viewAll}</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Big Feature Item (Italian Tailored Blazer / Iconic) */}
            <div className="lg:col-span-2 relative bg-stone-100 flex flex-col justify-start items-start overflow-hidden group min-h-[380px] sm:min-h-[540px] border border-neutral-200">
              <img
                className="w-full h-full object-cover absolute inset-0 transition-transform duration-700 group-hover:scale-105"
                src={products[0]?.gambar_url || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800'}
                alt={products[0]?.nama || 'Featured Item'}
              />
              <div className="w-full p-6 sm:p-8 absolute bottom-0 left-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex justify-between items-end">
                <div className="flex flex-col gap-1 text-white">
                  <span className="text-amber-400 text-xs uppercase tracking-wider font-bold">
                    {t.hero.featured}
                  </span>
                  <h3 className="text-xl sm:text-3xl font-bold leading-tight uppercase">
                    {products[0]?.nama || 'Italian Tailored Black Blazer'}
                  </h3>
                  <div className="text-stone-200 text-base sm:text-xl font-bold">
                    {formatPrice(products[0]?.harga || 1450000)}
                  </div>
                </div>
                <Link
                  to={products[0] ? `/products/${products[0].id}` : '/products'}
                  className="p-3.5 bg-white rounded-full flex justify-center items-center hover:bg-amber-400 transition cursor-pointer shadow-md"
                  title="Lihat Detail Produk"
                >
                  <ShoppingBag className="w-5 h-5 text-black" />
                </Link>
              </div>
            </div>

            {/* Vertical Stack: Dress Shirt & Handcrafted Loafers */}
            <div className="flex flex-col gap-6 sm:gap-8">
              <div className="relative bg-stone-100 flex flex-col overflow-hidden group h-64 sm:h-[254px] border border-neutral-200">
                <img
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src={products[1]?.gambar_url || 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800'}
                  alt={products[1]?.nama || 'Item 2'}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-5 text-white">
                  <span className="text-amber-400 text-[10px] uppercase tracking-wider font-bold">TOPS</span>
                  <h4 className="font-bold text-lg line-clamp-1 uppercase">{products[1]?.nama || 'Architectural Poplin Dress Shirt'}</h4>
                  <p className="text-stone-300 text-sm font-normal">{formatPrice(products[1]?.harga || 520000)}</p>
                </div>
              </div>

              <div className="relative bg-stone-100 flex flex-col overflow-hidden group h-64 sm:h-[254px] border border-neutral-200">
                <img
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src={products[4]?.gambar_url || 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800'}
                  alt={products[4]?.nama || 'Item 3'}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-5 text-white">
                  <span className="text-amber-400 text-[10px] uppercase tracking-wider font-bold">BOTTOMS &amp; SHOES</span>
                  <h4 className="font-bold text-lg line-clamp-1 uppercase">{products[4]?.nama || 'Handcrafted Leather Loafers'}</h4>
                  <p className="text-stone-300 text-sm font-normal">{formatPrice(products[4]?.harga || 1250000)}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section - Catalog Preview Categories */}
        <section className="w-full max-w-[1280px] px-6 sm:px-8 flex flex-col gap-16">
          {/* Tops Category Preview */}
          <div className="flex flex-col gap-8">
            <div className="pb-4 border-b border-neutral-200 flex justify-between items-center">
              <div>
                <span className="text-amber-600 text-xs uppercase tracking-widest font-bold">WARDROBE ESSENTIALS</span>
                <h2 className="text-black text-2xl sm:text-3xl font-bold uppercase tracking-tight">TOPS &amp; SUITS</h2>
              </div>
              <Link to="/products?category=tops" className="text-xs font-bold uppercase tracking-wider text-stone-600 hover:text-black transition">
                EXPLORE TOPS →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {(tops.length > 0 ? tops : products).slice(0, 4).map((p) => (
                <Link key={p.id} to={`/products/${p.id}`} className="group flex flex-col">
                  <div className="aspect-[3/4] bg-stone-100 overflow-hidden border border-neutral-200 mb-3 relative">
                    <img
                      src={p.gambar_url}
                      alt={p.nama}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {p.stok <= 3 && (
                      <span className="absolute top-3 left-3 bg-black text-white text-[10px] uppercase tracking-wider px-2 py-0.5 font-bold">
                        LOW STOCK
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-black uppercase tracking-wide group-hover:text-amber-700 transition line-clamp-1">{p.nama}</h3>
                  <p className="text-sm text-stone-600 font-normal">{formatPrice(p.harga)}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Section: OUR PHILOSOPHY (Black Noir Background + Gold Accent + Regular Caption) */}
          <div
            id="about"
            className="relative bg-black text-white rounded-xs border border-neutral-800 overflow-hidden shadow-2xl p-8 sm:p-16 my-6"
          >
            {/* Background Noir Photography Overlay */}
            <div
              className="absolute inset-0 opacity-25 bg-cover bg-center grayscale contrast-150 pointer-events-none"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1600')`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/60 pointer-events-none" />

            <div className="relative z-10 max-w-3xl flex flex-col gap-6">
              <div className="flex items-center gap-2">
                <span className="w-3 h-0.5 bg-amber-400"></span>
                <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">
                  {t.philosophy.tag}
                </span>
              </div>

              <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold uppercase tracking-tight text-white leading-tight">
                {t.philosophy.title}
              </h2>

              {/* Caption in Inter Regular (font-normal) */}
              <p className="text-stone-300 text-sm sm:text-base md:text-lg font-normal leading-relaxed">
                {t.philosophy.story}
              </p>

              {/* 3 Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-neutral-800">
                <div>
                  <h4 className="text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
                    1. ARCHITECTURAL TAILORING
                  </h4>
                  <p className="text-stone-400 text-xs font-normal leading-relaxed">
                    Potongan presisi berkarakter kuat tanpa menghilangkan kenyamanan gerak.
                  </p>
                </div>
                <div>
                  <h4 className="text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
                    2. UNCOMPROMISING FIBERS
                  </h4>
                  <p className="text-stone-400 text-xs font-normal leading-relaxed">
                    Hanya menggunakan wol Italia, katun poplin Mesir, dan kulit calfskin premium.
                  </p>
                </div>
                <div>
                  <h4 className="text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
                    3. TIMELESS LONGEVITY
                  </h4>
                  <p className="text-stone-400 text-xs font-normal leading-relaxed">
                    Dirancang tahan lama melampaui tren musiman dengan produksi terbatas.
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  to="/products"
                  className="px-8 py-4 bg-amber-400 text-black text-xs font-bold uppercase tracking-wider hover:bg-white transition inline-block cursor-pointer shadow-md"
                >
                  {t.philosophy.exploreCollection}
                </Link>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default LandingPage;
