import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { getProductById, getProducts } from '../../api/products';
import { ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';

export const DetailProduk = () => {
  const { id } = useParams();
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState('Charcoal');
  const [selectedSize, setSelectedSize] = useState('M');
  const [openShipping, setOpenShipping] = useState(true);
  const [openCare, setOpenCare] = useState(false);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const data = await getProductById(id);
        setProduct(data);
        const allProducts = await getProducts(4, 0);
        setRecommendations(allProducts.filter((p) => p.id !== id).slice(0, 3));
      } catch (err) {
        console.error('Gagal memuat detail produk:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
  }, [id]);

  const handleBuyNow = () => {
    if (!isSignedIn) {
      navigate('/login');
      return;
    }
    navigate('/checkout', { state: { product } });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(price || 0);
  };

  const defaultDetailImg1 = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600';
  const defaultDetailImg2 = 'https://images.unsplash.com/photo-1542272604-780c96856553?q=80&w=600';

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32 bg-stone-50 min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-32 bg-stone-50 min-h-screen flex flex-col items-center gap-4">
        <h2 className="text-2xl font-bold uppercase">Produk tidak ditemukan</h2>
        <Link to="/products" className="text-xs font-bold uppercase tracking-wider text-black underline">
          Kembali ke Katalog
        </Link>
      </div>
    );
  }

  return (
    <div data-layer="Detail Produk" className="DetailProduk w-full min-h-screen relative bg-stone-50 text-stone-900 font-['Inter'] font-semibold">
      <div className="w-full max-w-[1280px] mx-auto px-6 sm:px-8 py-8 flex flex-col gap-10">

        {/* Nav - Breadcrumb */}
        <div className="w-full flex items-center text-xs font-semibold uppercase tracking-wider gap-2 text-stone-500">
          <Link to="/" className="hover:text-black">HOME</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-black">{product.kategori?.toUpperCase() || 'CATALOG'}</Link>
          <span>/</span>
          <span className="text-black font-bold">{product.nama}</span>
        </div>

        {/* Product Grid (Gallery + Details) */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-14">

          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="w-full bg-zinc-100 overflow-hidden aspect-[4/3] sm:aspect-[16/11] border border-neutral-200">
              <img
                src={product.gambar_url || defaultDetailImg1}
                alt={product.nama}
                className="w-full h-full object-cover grayscale contrast-115"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-100 overflow-hidden aspect-[3/4] border border-neutral-200">
                <img
                  src={defaultDetailImg1}
                  alt={`${product.nama} Detail 1`}
                  className="w-full h-full object-cover grayscale contrast-115"
                />
              </div>
              <div className="bg-zinc-100 overflow-hidden aspect-[3/4] border border-neutral-200">
                <img
                  src={defaultDetailImg2}
                  alt={`${product.nama} Detail 2`}
                  className="w-full h-full object-cover grayscale contrast-115"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Product Details */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="pb-6 border-b border-neutral-200 flex flex-col gap-3">
              {product.stok <= 5 && (
                <span className="inline-block px-2.5 py-1 bg-black text-white text-[10px] font-bold uppercase tracking-wider self-start">
                  LIMITED RUN — STOK: {product.stok}
                </span>
              )}
              <h1 className="text-black text-3xl sm:text-4xl font-bold uppercase leading-tight tracking-tight">
                {product.nama}
              </h1>
              <div className="text-stone-900 text-2xl font-bold">
                {formatPrice(product.harga)}
              </div>
            </div>

            {/* Description */}
            <div className="pb-6 border-b border-neutral-200 flex flex-col gap-4 text-stone-700 text-sm font-normal leading-relaxed">
              <p>
                {product.deskripsi || 'A masterclass in elevated minimalism. Tailored from premium heavyweight textiles designed to offer architectural structure without stiffness.'}
              </p>
              <ul className="flex flex-col gap-2 text-stone-500 text-xs font-semibold uppercase tracking-wider">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-black rounded-full" />
                  Heavyweight Organic Textile
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-black rounded-full" />
                  Hand-finished Minimalist Construction
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-black rounded-full" />
                  Tailored Relaxed Fit
                </li>
              </ul>
            </div>

            {/* Color Selection */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                COLOR: <span className="text-black">{selectedColor}</span>
              </span>
              <div className="flex items-center gap-3">
                {[
                  { name: 'Charcoal', bg: 'bg-zinc-800' },
                  { name: 'Off-White', bg: 'bg-stone-200' },
                  { name: 'Olive', bg: 'bg-stone-600' }
                ].map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    className={`w-7 h-7 rounded-full ${c.bg} border-2 transition ${
                      selectedColor === c.name ? 'border-black ring-2 ring-black/20' : 'border-transparent'
                    }`}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider">
                <span className="text-stone-500">SIZE: <span className="text-black">{selectedSize}</span></span>
                <button className="text-stone-400 hover:text-black transition">Size Guide</button>
              </div>
              <div className="grid grid-cols-4 gap-2.5">
                {['S', 'M', 'L', 'XL'].map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`py-3 text-xs font-bold uppercase tracking-wider border transition ${
                      selectedSize === sz
                        ? 'bg-black text-white border-black'
                        : 'bg-white border-neutral-300 text-stone-700 hover:border-black'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handleBuyNow}
              disabled={product.stok <= 0}
              className="w-full py-4 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition disabled:opacity-50 mt-2"
            >
              {product.stok > 0 ? 'BELI SEKARANG (INSTANT CHECKOUT)' : 'STOK HABIS'}
            </button>

            {/* Accordions */}
            <div className="border-t border-neutral-200 pt-4 flex flex-col divide-y divide-neutral-200 text-xs uppercase font-bold tracking-wider">
              {/* Shipping & Returns */}
              <div className="py-3">
                <button
                  onClick={() => setOpenShipping(!openShipping)}
                  className="w-full flex justify-between items-center py-2 text-left text-black"
                >
                  <span>SHIPPING &amp; COMPLIMENTARY RETURNS</span>
                  {openShipping ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openShipping && (
                  <div className="pt-2 text-stone-600 font-normal normal-case leading-relaxed text-xs">
                    Pengiriman gratis ke seluruh Indonesia untuk pesanan di atas Rp 1.000.000. Pengembalian 7 hari tanpa biaya tambahan.
                  </div>
                )}
              </div>

              {/* Care Instructions */}
              <div className="py-3">
                <button
                  onClick={() => setOpenCare(!openCare)}
                  className="w-full flex justify-between items-center py-2 text-left text-black"
                >
                  <span>CARE &amp; MAINTENANCE</span>
                  {openCare ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openCare && (
                  <div className="pt-2 text-stone-600 font-normal normal-case leading-relaxed text-xs">
                    Dry clean only atau cuci tangan dengan deterjen lembut air dingin. Hindari pengering putar untuk menjaga kerapian serat kain.
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Complete The Look Recommendations */}
        {recommendations.length > 0 && (
          <div className="pt-16 border-t border-neutral-200 flex flex-col gap-8">
            <h2 className="text-black text-xl sm:text-2xl font-bold uppercase tracking-tight">
              COMPLETE THE LOOK
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {recommendations.map((rec) => (
                <Link key={rec.id} to={`/products/${rec.id}`} className="group flex flex-col">
                  <div className="aspect-[3/4] bg-zinc-100 overflow-hidden border border-neutral-200 mb-3">
                    <img
                      src={rec.gambar_url || defaultDetailImg1}
                      alt={rec.nama}
                      className="w-full h-full object-cover grayscale contrast-115 transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="text-sm font-semibold text-black uppercase tracking-wide group-hover:text-orange-500 transition line-clamp-1">{rec.nama}</h3>
                  <p className="text-sm text-stone-600 font-medium">{formatPrice(rec.harga)}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default DetailProduk;
