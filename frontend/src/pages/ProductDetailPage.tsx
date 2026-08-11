import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { getProductById } from '../api/products';
import type { ProdukResponse } from '../types';
import ProductSpec from '../components/products/ProductSpec';
import { ArrowLeft, ShoppingBag, AlertTriangle, ShieldCheck } from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProdukResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProductById(id);
        setProduct(data);
        setError(null);
      } catch (err) {
        console.error('Error loading product detail:', err);
        setError('Produk tidak ditemukan atau gagal memuat detail produk.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleBuyNow = () => {
    if (!product) return;
    if (!isSignedIn) {
      navigate('/login');
    } else {
      // Mengalihkan ke halaman checkout dengan membawa data produk terpilih
      navigate('/checkout', { state: { product } });
    }
  };

  const formattedPrice = product
    ? new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0
      }).format(product.harga)
    : '';

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-950"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-md mx-auto text-center py-12 space-y-4">
        <div className="h-12 w-12 rounded-full bg-red-50 flex items-center justify-center mx-auto text-red-600">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-bold font-serif text-stone-900">Gagal Memuat Produk</h2>
        <p className="text-stone-500 text-sm">{error || 'Produk tidak valid.'}</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-amber-900 hover:text-amber-800"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-900 text-sm font-semibold transition"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Kembali ke Katalog</span>
      </Link>

      {/* Main Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm">
        {/* Left Column - Product Image */}
        <div className="lg:col-span-6 aspect-[4/3] rounded-2xl overflow-hidden bg-stone-200 border border-stone-200">
          <img
            src={product.gambar_url || 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=300'}
            alt={product.nama}
            className="w-full h-full object-cover object-center"
            loading="eager"
          />
        </div>

        {/* Right Column - Info & Actions */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-amber-800 font-bold uppercase tracking-wider bg-amber-50 px-2.5 py-1 rounded-md border border-amber-100">
                100% Produk Lokal
              </span>
              <span className="text-sm text-stone-500 font-medium">
                Stok: <span className="font-semibold text-stone-900">{product.stok}</span>
              </span>
            </div>

            <h1 className="text-3xl font-bold font-serif text-stone-900 leading-tight">
              {product.nama}
            </h1>

            <div className="text-2xl font-bold text-amber-950">
              {formattedPrice}
            </div>

            <div className="border-t border-b border-stone-100 py-4 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">Deskripsi Produk</h3>
              <p className="text-stone-600 text-sm leading-relaxed whitespace-pre-line">
                {product.deskripsi || 'Tidak ada deskripsi produk.'}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Guarantee Section */}
            <div className="flex items-start gap-3 bg-stone-50 p-4 rounded-xl border border-stone-200 text-xs text-stone-500 leading-relaxed">
              <ShieldCheck className="h-5 w-5 text-amber-800 shrink-0" />
              <div>
                <span className="font-bold text-stone-800 block mb-0.5">Garansi Keaslian Handcrafted</span>
                Produk ini dibuat manual oleh pengrajin lokal binaan Sanggar Nusantara. Pengerjaan manual menjamin keaslian tekstur dan seni produk.
              </div>
            </div>

            {/* Buy CTA */}
            <button
              onClick={handleBuyNow}
              disabled={product.stok <= 0}
              className={`w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-base transition duration-200 shadow-sm ${
                product.stok > 0
                  ? 'bg-amber-900 hover:bg-amber-800 text-white'
                  : 'bg-stone-200 text-stone-400 cursor-not-allowed'
              }`}
            >
              <ShoppingBag className="h-5 w-5" />
              <span>Beli Sekarang (Instan QRIS)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Specification & Value Section */}
      <div className="max-w-2xl">
        <ProductSpec />
      </div>
    </div>
  );
};
export default ProductDetailPage;
