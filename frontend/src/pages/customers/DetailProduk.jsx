import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { getProductById } from '../../api/products';
import { ProductSpec } from '../../components/products/ProductSpec';
import { ShoppingBag, ArrowLeft, Package } from 'lucide-react';

export const DetailProduk = () => {
  const { id } = useParams();
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getProductById(id);
        setProduct(data);
      } catch (err) {
        console.error('Gagal memuat detail produk:', err);
        setError('Produk tidak ditemukan.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleBuyNow = () => {
    if (!isSignedIn) {
      navigate('/login');
      return;
    }
    navigate('/checkout', { state: { product } });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-950"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-20">
        <p className="text-stone-500 mb-4">{error || 'Produk tidak tersedia.'}</p>
        <Link to="/products" className="text-amber-900 font-semibold hover:text-amber-700">
          Kembali ke Katalog
        </Link>
      </div>
    );
  }

  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(product.harga);

  return (
    <div className="space-y-8">
      <Link
        to="/products"
        className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-900 text-sm font-semibold transition"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Kembali ke Katalog</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Image */}
        <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100 border border-stone-200">
          <img
            src={product.gambar_url || 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=600'}
            alt={product.nama}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <span className="text-xs text-amber-800 font-semibold tracking-wider uppercase mb-2">Brand Lokal</span>
          <h1 className="font-serif font-bold text-3xl text-stone-900 mb-3">{product.nama}</h1>
          <p className="text-2xl font-bold text-amber-950 mb-4">{formattedPrice}</p>
          <p className="text-stone-600 leading-relaxed mb-6">
            {product.deskripsi || 'Tidak ada deskripsi produk.'}
          </p>

          <div className="flex items-center gap-2 text-sm text-stone-500 mb-6">
            <Package className="h-4 w-4" />
            <span>Stok tersedia: {product.stok}</span>
          </div>

          <button
            onClick={handleBuyNow}
            disabled={product.stok <= 0}
            className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition duration-200 ${
              product.stok > 0
                ? 'bg-amber-900 hover:bg-amber-800 text-white shadow-sm'
                : 'bg-stone-200 text-stone-400 cursor-not-allowed'
            }`}
          >
            <ShoppingBag className="h-4 w-4" />
            <span>{product.stok > 0 ? 'Beli Instan' : 'Habis'}</span>
          </button>

          <div className="mt-8">
            <ProductSpec />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailProduk;
