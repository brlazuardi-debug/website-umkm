import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../../api/products';
import { useBrand } from '../../context/BrandContext';
import { ArrowRight, ShoppingBag, ChevronRight } from 'lucide-react';

export const LandingPage = () => {
  const { brand } = useBrand();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
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

  const tops = products.filter((p) => p.kategori?.toLowerCase() === 'baju' || p.kategori?.toLowerCase() === 'tops');
  const bottoms = products.filter((p) => p.kategori?.toLowerCase() === 'celana' || p.kategori?.toLowerCase() === 'bottoms');
  const outerwear = products.filter((p) => p.kategori?.toLowerCase() === 'jaket' || p.kategori?.toLowerCase() === 'outerwear');

  return (
    <div data-layer="Landing Page" className="LandingPage w-full min-h-screen relative bg-stone-50 text-stone-900 font-semibold">
      <div data-layer="Main" className="Main w-full flex flex-col justify-start items-center gap-20 sm:gap-28 pb-20">

        {/* Hero Section */}
        <div data-layer="Hero Section" className="HeroSection w-full min-h-[600px] sm:min-h-[819px] py-16 sm:py-24 relative bg-zinc-100 flex justify-center items-center overflow-hidden">
          <div data-layer="Container" className="Container absolute inset-0 flex flex-col justify-center items-start">
            <div
              data-layer="Premium fashion photography background for LUXE UMKM"
              className="PremiumFashionPhotographyBackgroundForLuxeUmkm w-full h-full opacity-90 bg-cover bg-center bg-no-repeat grayscale contrast-125"
              style={{ backgroundImage: `url(${brand.hero_image || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1280'})` }}
            />
            <div data-layer="Gradient" className="Gradient absolute inset-0 bg-gradient-to-r from-stone-50/90 via-stone-50/40 to-transparent" />
          </div>

          <div data-layer="Container" className="Container w-full max-w-[1280px] px-6 sm:px-8 pt-20 sm:pt-32 pb-16 relative z-10 flex flex-col justify-start items-start">
            <div data-layer="Overlay+Border+OverlayBlur" className="OverlayBorderOverlayblur w-full max-w-[672px] p-6 sm:p-8 bg-stone-50/80 border border-neutral-200 backdrop-blur-[6px]">
              <h1 data-layer="ELEVATE YOUR EVERYDAY" className="ElevateYourEveryday text-black text-3xl sm:text-5xl md:text-6xl font-bold uppercase leading-tight sm:leading-[80px] mb-4 sm:mb-6">
                ELEVATE YOUR<br />EVERYDAY
              </h1>
              <p data-layer="Text" className="Text text-stone-700 text-base sm:text-lg font-normal leading-relaxed mb-6 sm:mb-8">
                Premium essentials meticulously crafted for the modern individual. Uncompromising quality meets timeless minimalist design.
              </p>
              <Link
                to="/products"
                data-layer="Link"
                className="Link px-6 sm:px-10 py-4 sm:py-5 bg-black border border-black inline-flex justify-center items-center gap-3 hover:bg-neutral-800 transition"
              >
                <span data-layer="Text" className="Text text-center text-white text-xs font-semibold uppercase leading-3 tracking-wider">
                  BELANJA SEKARANG
                </span>
                <ArrowRight className="w-4 h-4 text-orange-400" />
              </Link>
            </div>
          </div>
        </div>

        {/* Section - Featured Collections Grid */}
        <div data-layer="Section - Featured Collections Grid" className="SectionFeaturedCollectionsGrid w-full max-w-[1280px] px-6 sm:px-8 flex flex-col justify-start items-start gap-8 sm:gap-12">
          <div data-layer="Container" className="Container w-full flex justify-between items-end">
            <div data-layer="Heading 2" className="Heading2 flex flex-col justify-start items-start">
              <h2 data-layer="Text" className="Text text-black text-2xl sm:text-3xl font-semibold uppercase leading-10">
                NEW ARRIVALS
              </h2>
            </div>
            <Link to="/products" data-layer="Link" className="Link flex justify-start items-center gap-2 text-black hover:text-orange-500 transition">
              <span data-layer="Text" className="Text text-xs font-semibold uppercase leading-3 tracking-wide">
                VIEW ALL CATALOG
              </span>
              <ChevronRight className="w-4 h-4 text-black" />
            </Link>
          </div>

          <div data-layer="Bento-style Asymmetric Grid" className="BentoStyleAsymmetricGrid w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div data-layer="Large Feature Item" className="LargeFeatureItem lg:col-span-2 relative bg-zinc-100 flex flex-col justify-start items-start overflow-hidden group min-h-[400px] sm:min-h-[600px]">
              <img
                data-layer="Featured Product 1"
                className="FeaturedProduct1 w-full h-full object-cover absolute inset-0 transition-transform duration-500 group-hover:scale-105 grayscale contrast-125"
                src={products[0]?.gambar_url || "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800"}
                alt="Featured Product"
              />
              <div data-layer="Background" className="Background w-full p-6 sm:p-8 absolute bottom-0 left-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex justify-between items-end">
                <div data-layer="Container" className="Container flex flex-col justify-start items-start gap-1 text-white">
                  <h3 data-layer="Heading 3" className="Text text-xl sm:text-2xl font-medium leading-8">
                    {products[0]?.nama || "The Essential Overshirt"}
                  </h3>
                  <div data-layer="Text" className="Text text-orange-400 text-lg sm:text-xl font-medium leading-5">
                    {products[0] ? formatPrice(products[0].harga) : "Rp 499.000"}
                  </div>
                </div>
                {products[0] && (
                  <Link to={`/products/${products[0].id}`} data-layer="Button" className="Button p-3 bg-stone-50 rounded-full flex justify-center items-center hover:bg-orange-400 hover:text-white transition">
                    <ShoppingBag className="w-5 h-5 text-black" />
                  </Link>
                )}
              </div>
            </div>

            <div data-layer="Vertical Stack" className="VerticalStack flex flex-col gap-8">
              <div data-layer="Top Small Item" className="TopSmallItem relative bg-zinc-100 flex flex-col justify-start items-start overflow-hidden group h-64 sm:h-72">
                <img
                  data-layer="Featured Product 2"
                  className="FeaturedProduct2 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 grayscale contrast-125"
                  src={products[1]?.gambar_url || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=400"}
                  alt="Featured Product 2"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition flex items-end p-4">
                  <span className="text-white font-medium text-lg">{products[1]?.nama}</span>
                </div>
              </div>

              <div data-layer="Bottom Small Item" className="BottomSmallItem relative bg-zinc-100 flex flex-col justify-start items-start overflow-hidden group h-64 sm:h-72">
                <img
                  data-layer="Featured Product 3"
                  className="FeaturedProduct3 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 grayscale contrast-125"
                  src={products[2]?.gambar_url || "https://images.unsplash.com/photo-1542272604-780c96856553?q=80&w=400"}
                  alt="Featured Product 3"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition flex items-end p-4">
                  <span className="text-white font-medium text-lg">{products[2]?.nama}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full Product Catalog Sections */}
        <div data-layer="Full Product Catalog Sections" className="FullProductCatalogSections w-full max-w-[1280px] px-6 sm:px-8 flex flex-col justify-start items-start gap-16 sm:gap-20">

          {/* Category: Tops / Baju */}
          <div data-layer="Category: Baju" className="CategoryBaju w-full flex flex-col justify-start items-start gap-8 sm:gap-10">
            <div data-layer="HorizontalBorder" className="Horizontalborder w-full pb-4 border-b border-neutral-200 flex justify-between items-center">
              <h2 data-layer="TOPS" className="Tops text-black text-2xl sm:text-3xl font-semibold uppercase leading-10">
                TOPS
              </h2>
              <Link to="/products?category=baju" data-layer="Link" className="ViewAll text-stone-500 hover:text-black text-xs font-semibold uppercase tracking-wider">
                VIEW ALL
              </Link>
            </div>
            <div data-layer="Container" className="Container w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {(tops.length > 0 ? tops.slice(0, 4) : products.slice(0, 4)).map((item) => (
                <div key={item.id} data-layer="Product Item" className="ProductItem flex flex-col justify-start items-start group">
                  <div data-layer="Margin" className="Margin w-full pb-4 flex flex-col justify-start items-start">
                    <div data-layer="Background" className="Background w-full h-80 sm:h-96 relative bg-zinc-100 flex flex-col justify-center items-start overflow-hidden">
                      <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src={item.gambar_url || 'https://placehold.co/286x381'} alt={item.nama} />
                      <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black/60 to-transparent">
                        <Link to={`/products/${item.id}`} className="w-full px-6 py-3 bg-black text-white text-xs font-semibold uppercase tracking-wider text-center block hover:bg-neutral-800 transition">
                          ADD TO CART
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div data-layer="Container" className="Container w-full flex flex-col justify-start items-start">
                    <h3 className="text-black text-base font-semibold leading-6 line-clamp-1">{item.nama}</h3>
                    <div className="text-orange-400 text-sm font-medium leading-5">{formatPrice(item.harga)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Category: Bottoms / Celana */}
          <div data-layer="Category: Celana" className="CategoryCelana w-full flex flex-col justify-start items-start gap-8 sm:gap-10">
            <div data-layer="HorizontalBorder" className="Horizontalborder w-full pb-4 border-b border-neutral-200 flex justify-between items-center">
              <h2 data-layer="BOTTOMS" className="Bottoms text-black text-2xl sm:text-3xl font-semibold uppercase leading-10">
                BOTTOMS
              </h2>
              <Link to="/products?category=celana" data-layer="Link" className="ViewAll text-stone-500 hover:text-black text-xs font-semibold uppercase tracking-wider">
                VIEW ALL
              </Link>
            </div>
            <div data-layer="Container" className="Container w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {(bottoms.length > 0 ? bottoms.slice(0, 4) : products.slice(0, 4)).map((item) => (
                <div key={item.id} data-layer="Product Item" className="ProductItem flex flex-col justify-start items-start group">
                  <div data-layer="Margin" className="Margin w-full pb-4 flex flex-col justify-start items-start">
                    <div data-layer="Background" className="Background w-full h-80 sm:h-96 relative bg-zinc-100 flex flex-col justify-center items-start overflow-hidden">
                      <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src={item.gambar_url || 'https://placehold.co/286x381'} alt={item.nama} />
                      <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black/60 to-transparent">
                        <Link to={`/products/${item.id}`} className="w-full px-6 py-3 bg-black text-white text-xs font-semibold uppercase tracking-wider text-center block hover:bg-neutral-800 transition">
                          ADD TO CART
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div data-layer="Container" className="Container w-full flex flex-col justify-start items-start">
                    <h3 className="text-black text-base font-semibold leading-6 line-clamp-1">{item.nama}</h3>
                    <div className="text-orange-400 text-sm font-medium leading-5">{formatPrice(item.harga)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Category: Outerwear / Jaket */}
          <div data-layer="Category: Jaket" className="CategoryJaket w-full flex flex-col justify-start items-start gap-8 sm:gap-10">
            <div data-layer="HorizontalBorder" className="Horizontalborder w-full pb-4 border-b border-neutral-200 flex justify-between items-center">
              <h2 data-layer="OUTERWEAR" className="Outerwear text-black text-2xl sm:text-3xl font-semibold uppercase leading-10">
                OUTERWEAR
              </h2>
              <Link to="/products?category=jaket" data-layer="Link" className="ViewAll text-stone-500 hover:text-black text-xs font-semibold uppercase tracking-wider">
                VIEW ALL
              </Link>
            </div>
            <div data-layer="Container" className="Container w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {(outerwear.length > 0 ? outerwear.slice(0, 4) : products.slice(0, 4)).map((item) => (
                <div key={item.id} data-layer="Product Item" className="ProductItem flex flex-col justify-start items-start group">
                  <div data-layer="Margin" className="Margin w-full pb-4 flex flex-col justify-start items-start">
                    <div data-layer="Background" className="Background w-full h-80 sm:h-96 relative bg-zinc-100 flex flex-col justify-center items-start overflow-hidden">
                      <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src={item.gambar_url || 'https://placehold.co/286x381'} alt={item.nama} />
                      <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black/60 to-transparent">
                        <Link to={`/products/${item.id}`} className="w-full px-6 py-3 bg-black text-white text-xs font-semibold uppercase tracking-wider text-center block hover:bg-neutral-800 transition">
                          ADD TO CART
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div data-layer="Container" className="Container w-full flex flex-col justify-start items-start">
                    <h3 className="text-black text-base font-semibold leading-6 line-clamp-1">{item.nama}</h3>
                    <div className="text-orange-400 text-sm font-medium leading-5">{formatPrice(item.harga)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Section - Brand Story / Statement */}
        <div data-layer="Section - Brand Story / Statement" className="SectionBrandStoryStatement w-full py-24 sm:py-36 bg-black text-white flex flex-col justify-start items-center">
          <div data-layer="Container" className="Container w-full max-w-[1280px] px-6 sm:px-8 flex flex-col lg:flex-row justify-center items-center gap-12 lg:gap-16">
            <div data-layer="Container" className="Container flex-1 w-full max-w-md h-80 sm:h-96 relative flex justify-center items-center">
              <div data-layer="Background" className="Background w-72 sm:w-96 h-72 sm:h-96 bg-zinc-900 overflow-hidden relative">
                <img
                  data-layer="Brand Story Craftsmanship"
                  className="BrandStoryCraftsmanship w-full h-full object-cover opacity-80 grayscale contrast-125"
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=600"
                  alt="Brand Story Craftsmanship"
                />
              </div>
            </div>

            <div data-layer="Container" className="Container flex-1 flex flex-col justify-center items-start">
              <div data-layer="Margin" className="Margin pb-4 sm:pb-6">
                <span data-layer="OUR PHILOSOPHY" className="OurPhilosophy text-orange-400 text-xs font-semibold uppercase tracking-wider">
                  OUR PHILOSOPHY
                </span>
              </div>
              <h2 data-layer="Heading 2" className="Text text-white text-3xl sm:text-5xl font-bold uppercase leading-tight mb-6">
                LESS BUT BETTER.
              </h2>
              <div data-layer="Margin" className="Margin max-w-[512px] pb-8 sm:pb-10">
                <p data-layer="We believe..." className="text-white/80 text-base sm:text-lg font-light leading-relaxed">
                  We believe in the power of restraint. VARCA BRAND is built on the foundation that true luxury lies in exceptional materials, uncompromising craftsmanship, and timeless silhouettes. We strip away the unnecessary, leaving only what matters.
                </p>
              </div>
              <div data-layer="Link:align-flex-start" className="LinkAlignFlexStart">
                <a href="#tentang-kami" data-layer="Link" className="Link pb-1 border-b border-orange-400 text-orange-400 text-xs font-semibold uppercase tracking-wider hover:text-orange-300 hover:border-orange-300 transition">
                  DISCOVER OUR STORY
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LandingPage;
