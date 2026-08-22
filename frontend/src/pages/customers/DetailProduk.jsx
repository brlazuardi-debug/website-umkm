import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { getProductById, getProducts } from '../../api/products';
import { ChevronDown, ChevronUp } from 'lucide-react';

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
        const allProducts = await getProducts(3, 0);
        setRecommendations(allProducts.filter((p) => p.id !== Number(id)).slice(0, 3));
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
    }).format(price);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20 bg-stone-50 min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-900"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20 bg-stone-50 min-h-screen">
        <h2 className="text-2xl font-bold mb-4">Produk tidak ditemukan</h2>
        <Link to="/products" className="text-orange-500 underline">Kembali ke Katalog</Link>
      </div>
    );
  }

  return (
    <div data-layer="Detail Produk" className="DetailProduk w-full min-h-screen relative bg-stone-50 text-stone-900 font-semibold">
      <div data-layer="Main Content" className="MainContent w-full max-w-[1280px] mx-auto px-6 sm:px-8 py-8 flex flex-col justify-start items-start gap-8">

        {/* Nav - Breadcrumb */}
        <div data-layer="Nav - Breadcrumb" className="NavBreadcrumb w-full flex items-center text-xs font-semibold uppercase tracking-wide gap-2 text-stone-500">
          <Link to="/" className="hover:text-black">HOME</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-black">{product.kategori || 'CATALOG'}</Link>
          <span>/</span>
          <span className="text-black font-bold">{product.nama}</span>
        </div>

        {/* Product Grid (Gallery + Details) */}
        <div data-layer="Product Grid" className="ProductGrid w-full grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Left Column: Image Gallery */}
          <div data-layer="Image Gallery" className="lg:col-span-7 flex flex-col gap-4">
            <div className="w-full bg-neutral-200 overflow-hidden aspect-[4/3] sm:aspect-[16/10]">
              <img
                src={product.gambar_url || 'https://placehold.co/669x374'}
                alt={product.nama}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-neutral-200 overflow-hidden aspect-[3/4]">
                <img
                  src={product.gambar_url || 'https://placehold.co/327x436'}
                  alt={`${product.nama} detail 1`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="bg-neutral-200 overflow-hidden aspect-[3/4]">
                <img
                  src={product.gambar_url || 'https://placehold.co/325x435'}
                  alt={`${product.nama} detail 2`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Product Details */}
          <div data-layer="Product Details" className="lg:col-span-5 flex flex-col justify-start items-start gap-6">
            <div className="w-full pb-6 border-b border-neutral-200 flex flex-col gap-3.5">
              {product.stok <= 5 && (
                <div className="inline-block px-3 py-1 border border-neutral-500 text-zinc-900 text-xs font-semibold uppercase tracking-wider self-start">
                  LIMITED STOCK
                </div>
              )}
              <h1 className="text-black text-3xl sm:text-5xl font-bold uppercase leading-tight">
                {product.nama}
              </h1>
              <div className="text-orange-400 text-xl font-medium leading-5">
                {formatPrice(product.harga)}
              </div>
            </div>

            {/* Description */}
            <div className="w-full pb-6 border-b border-neutral-200 flex flex-col gap-4">
              <p className="text-stone-700 text-base sm:text-lg font-normal leading-7">
                {product.deskripsi || 'A masterclass in elevated minimalism. Tailored from premium materials designed to offer structure without stiffness.'}
              </p>
              <ul className="flex flex-col gap-2 text-stone-500 text-sm">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-stone-500 rounded-full inline-block"></span>
                  Italian Wool Blend (80% Wool, 20% Cashmere)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-stone-500 rounded-full inline-block"></span>
                  Fully Lined Interior
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-stone-500 rounded-full inline-block"></span>
                  Hand-finished details
                </li>
              </ul>
            </div>

            {/* Color Selection */}
            <div className="w-full flex flex-col gap-3">
              <div className="text-xs font-semibold uppercase tracking-wide">
                COLOR: <span className="text-stone-500 font-normal">{selectedColor}</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedColor('Charcoal')}
                  className={`w-10 h-10 rounded-full bg-zinc-800 border-2 ${selectedColor === 'Charcoal' ? 'border-black ring-2 ring-white' : 'border-transparent'}`}
                />
                <button
                  onClick={() => setSelectedColor('Black')}
                  className={`w-10 h-10 rounded-full bg-neutral-900 border-2 ${selectedColor === 'Black' ? 'border-black ring-2 ring-white' : 'border-transparent'}`}
                />
              </div>
            </div>

            {/* Size Selection */}
            <div className="w-full flex flex-col gap-3">
              <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wide">
                <span>SIZE</span>
                <button className="text-stone-500 underline font-semibold">Size Guide</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {['S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`px-6 py-3 border text-base transition ${
                      selectedSize === sz
                        ? 'bg-black text-white border-black font-medium'
                        : 'border-neutral-500 text-zinc-900 hover:border-black'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="w-full pt-4 flex flex-col gap-4">
              <button
                onClick={handleBuyNow}
                className="w-full py-5 bg-black text-white text-lg font-normal uppercase leading-7 text-center hover:bg-neutral-800 transition"
              >
                ADD TO CART
              </button>
              <button
                onClick={handleBuyNow}
                className="w-full py-4 border border-black text-black text-lg font-normal uppercase leading-7 text-center hover:bg-black hover:text-white transition"
              >
                BUY NOW
              </button>
            </div>

            {/* Accordions */}
            <div className="w-full pt-6 border-t border-neutral-200 flex flex-col divide-y divide-neutral-200">
              <div className="py-4">
                <button
                  onClick={() => setOpenShipping(!openShipping)}
                  className="w-full flex justify-between items-center text-black text-xl font-medium"
                >
                  <span>Shipping &amp; Returns</span>
                  {openShipping ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
                {openShipping && (
                  <p className="pt-4 text-stone-700 text-sm leading-6">
                    Complimentary standard shipping on all orders. Returns accepted within 14 days of delivery. Items must be in original condition with tags attached.
                  </p>
                )}
              </div>
              <div className="py-4">
                <button
                  onClick={() => setOpenCare(!openCare)}
                  className="w-full flex justify-between items-center text-black text-xl font-medium"
                >
                  <span>Product Care</span>
                  {openCare ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
                {openCare && (
                  <p className="pt-4 text-stone-700 text-sm leading-6">
                    Dry clean only. Do not tumble dry. Cool iron if needed. Store in a garment bag in a cool, dry place.
                  </p>
                )}
              </div>
            </div>

          </div>

        </div>

        {/* Section - Complete the Look */}
        <div data-layer="Section - Complete the Look" className="w-full py-16 bg-zinc-100 mt-12 flex flex-col gap-12 px-6 sm:px-8">
          <h2 className="text-center text-black text-2xl sm:text-3xl font-semibold uppercase">
            COMPLETE THE LOOK
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {recommendations.map((rec) => (
              <Link key={rec.id} to={`/products/${rec.id}`} className="flex flex-col gap-3 group">
                <div className="w-full h-96 bg-neutral-200 overflow-hidden">
                  <img
                    src={rec.gambar_url || 'https://placehold.co/386x512'}
                    alt={rec.nama}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="text-center">
                  <div className="text-black text-lg font-normal line-clamp-1">{rec.nama}</div>
                  <div className="text-stone-500 text-base font-normal">{formatPrice(rec.harga)}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default DetailProduk;
