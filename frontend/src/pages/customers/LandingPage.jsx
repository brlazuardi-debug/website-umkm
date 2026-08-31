import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { ArrowRight, ShoppingBag, ChevronRight } from 'lucide-react';
import { useBrand } from '../../context/BrandContext';
import { getProducts } from '../../api/products';

export const LandingPage = () => {
  const { brand } = useBrand();
  const [products, setProducts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
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

  const tops = products.filter((p) => p.kategori?.toLowerCase() === 'baju' || p.kategori?.toLowerCase() === 'tops' || !p.kategori);
  const bottoms = products.filter((p) => p.kategori?.toLowerCase() === 'celana' || p.kategori?.toLowerCase() === 'bottoms');
  const outerwear = products.filter((p) => p.kategori?.toLowerCase() === 'jaket' || p.kategori?.toLowerCase() === 'outerwear');

  const defaultHero = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600';
  const defaultTop1 = 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800';
  const defaultTop2 = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800';
  const defaultBottom = 'https://images.unsplash.com/photo-1542272604-780c96856553?q=80&w=800';
  const defaultOuter = 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=800';

  return (
    <div data-layer="Landing Page" className="LandingPage w-full min-h-screen relative bg-stone-50 text-stone-900 font-['Inter'] font-semibold">
      <div data-layer="Main" className="Main w-full flex flex-col justify-start items-center gap-16 sm:gap-24 pb-20">

        {/* Hero Section */}
        <section data-layer="Hero Section" className="HeroSection w-full min-h-[560px] sm:min-h-[760px] relative bg-zinc-900 flex justify-center items-center overflow-hidden">
          <div data-layer="Container" className="Container absolute inset-0 flex flex-col justify-center items-start">
            <div
              className="w-full h-full opacity-80 bg-cover bg-center bg-no-repeat grayscale contrast-125 transition duration-700 hover:scale-105"
              style={{ backgroundImage: `url(${brand.hero_image || defaultHero})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          </div>

          <div className="w-full max-w-[1280px] px-6 sm:px-8 py-16 sm:py-24 relative z-10 flex flex-col justify-start items-start">
            <div className="w-full max-w-[672px] p-6 sm:p-10 bg-black/60 border border-neutral-700 backdrop-blur-md text-white rounded-xs">
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold uppercase leading-tight sm:leading-[76px] mb-4 sm:mb-6 tracking-tight">
                ELEVATE YOUR<br />EVERYDAY
              </h1>
              <p className="text-stone-300 text-base sm:text-lg font-normal leading-relaxed mb-6 sm:mb-8">
                {brand.slogan || 'Premium essentials meticulously crafted for the modern individual. Uncompromising quality meets timeless minimalist design.'}
              </p>
              <Link
                to="/products"
                className="px-8 sm:px-10 py-4 bg-white text-black font-semibold text-xs uppercase tracking-wider inline-flex items-center gap-3 hover:bg-orange-400 hover:text-black transition"
              >
                <span>BELANJA SEKARANG</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </Link>
            </div>
          </div>
        </section>

        {/* Section - New Arrivals Bento Grid */}
        <section data-layer="Section - Featured Collections Grid" className="w-full max-w-[1280px] px-6 sm:px-8 flex flex-col gap-8 sm:gap-12">
          <div className="w-full flex justify-between items-end">
            <div>
              <span className="text-orange-400 text-xs uppercase tracking-widest font-bold block mb-1">CURATED DROP</span>
              <h2 className="text-black text-2xl sm:text-4xl font-bold uppercase tracking-tight">
                NEW ARRIVALS
              </h2>
            </div>
            <Link to="/products" className="flex items-center gap-1.5 text-black hover:text-orange-500 text-xs font-semibold uppercase tracking-wider transition">
              <span>VIEW ALL CATALOG</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Big Feature Item */}
            <div className="lg:col-span-2 relative bg-zinc-100 flex flex-col justify-start items-start overflow-hidden group min-h-[380px] sm:min-h-[540px] border border-neutral-200">
              <img
                className="w-full h-full object-cover absolute inset-0 transition-transform duration-700 group-hover:scale-105 grayscale contrast-115"
                src={products[0]?.gambar_url || defaultTop1}
                alt={products[0]?.nama || 'Featured Item'}
              />
              <div className="w-full p-6 sm:p-8 absolute bottom-0 left-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex justify-between items-end">
                <div className="flex flex-col gap-1 text-white">
                  <span className="text-orange-400 text-xs uppercase tracking-wider font-semibold">VARCA ICONIC</span>
                  <h3 className="text-xl sm:text-3xl font-bold leading-tight">
                    {products[0]?.nama || 'The Essential Overshirt'}
                  </h3>
                  <div className="text-stone-200 text-base sm:text-xl font-medium">
                    {formatPrice(products[0]?.harga || 499000)}
                  </div>
                </div>
                <Link
                  to={products[0] ? `/products/${products[0].id}` : '/products'}
                  className="p-3.5 bg-white rounded-full flex justify-center items-center hover:bg-orange-400 transition"
                  title="Lihat Detail Produk"
                >
                  <ShoppingBag className="w-5 h-5 text-black" />
                </Link>
              </div>
            </div>

            {/* Vertical Stack */}
            <div className="flex flex-col gap-6 sm:gap-8">
              <div className="relative bg-zinc-100 flex flex-col overflow-hidden group h-64 sm:h-[254px] border border-neutral-200">
                <img
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 grayscale contrast-115"
                  src={products[1]?.gambar_url || defaultTop2}
                  alt={products[1]?.nama || 'Item 2'}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-5 text-white">
                  <span className="text-orange-400 text-[10px] uppercase tracking-wider font-semibold">TOPS</span>
                  <h4 className="font-semibold text-lg line-clamp-1">{products[1]?.nama || 'Heavyweight Oversized Tee'}</h4>
                  <p className="text-stone-300 text-sm font-medium">{formatPrice(products[1]?.harga || 289000)}</p>
                </div>
              </div>

              <div className="relative bg-zinc-100 flex flex-col overflow-hidden group h-64 sm:h-[254px] border border-neutral-200">
                <img
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 grayscale contrast-115"
                  src={products[2]?.gambar_url || defaultBottom}
                  alt={products[2]?.nama || 'Item 3'}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-5 text-white">
                  <span className="text-orange-400 text-[10px] uppercase tracking-wider font-semibold">BOTTOMS</span>
                  <h4 className="font-semibold text-lg line-clamp-1">{products[2]?.nama || 'Tailored Pleated Trousers'}</h4>
                  <p className="text-stone-300 text-sm font-medium">{formatPrice(products[2]?.harga || 580000)}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section - Catalog Preview Categories */}
        <section className="w-full max-w-[1280px] px-6 sm:px-8 flex flex-col gap-16">
          {/* Tops Category */}
          <div className="flex flex-col gap-8">
            <div className="pb-4 border-b border-neutral-200 flex justify-between items-center">
              <div>
                <span className="text-orange-400 text-xs uppercase tracking-widest font-bold">WARDROBE ESSENTIALS</span>
                <h2 className="text-black text-2xl sm:text-3xl font-bold uppercase tracking-tight">TOPS &amp; SHIRTS</h2>
              </div>
              <Link to="/products?category=tops" className="text-xs font-semibold uppercase tracking-wider text-stone-600 hover:text-black transition">
                EXPLORE TOPS →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {(tops.length > 0 ? tops : products).slice(0, 4).map((p) => (
                <Link key={p.id} to={`/products/${p.id}`} className="group flex flex-col">
                  <div className="aspect-[3/4] bg-zinc-100 overflow-hidden border border-neutral-200 mb-3 relative">
                    <img
                      src={p.gambar_url || defaultTop1}
                      alt={p.nama}
                      className="w-full h-full object-cover grayscale contrast-115 transition-transform duration-500 group-hover:scale-105"
                    />
                    {p.stok <= 3 && (
                      <span className="absolute top-3 left-3 bg-black text-white text-[10px] uppercase tracking-wider px-2 py-0.5 font-bold">
                        LOW STOCK
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-semibold text-black uppercase tracking-wide group-hover:text-orange-500 transition line-clamp-1">{p.nama}</h3>
                  <p className="text-sm text-stone-600 font-medium">{formatPrice(p.harga)}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Philosophy Banner */}
          <div className="p-8 sm:p-12 bg-zinc-900 text-white rounded-xs border border-neutral-800 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="max-w-xl">
              <span className="text-orange-400 text-xs font-bold uppercase tracking-widest block mb-2">BRAND MANIFESTO</span>
              <h3 className="text-2xl sm:text-4xl font-bold uppercase tracking-tight mb-4">MINIMALIST LUXURY TAILORED FOR LONGEVITY</h3>
              <p className="text-stone-400 text-sm sm:text-base font-normal leading-relaxed">
                {brand.story}
              </p>
            </div>
            <Link
              to="/products"
              className="px-8 py-4 bg-white text-black text-xs font-semibold uppercase tracking-wider hover:bg-orange-400 transition shrink-0"
            >
              EXPLORE FULL COLLECTION
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
};

export default LandingPage;
