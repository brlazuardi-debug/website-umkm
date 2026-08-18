import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { ShoppingBag } from 'lucide-react';

export const ProductCard = ({ product }) => {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  const handleBuyNow = (e) => {
    e.preventDefault();
    if (!isSignedIn) {
      navigate('/login');
    } else {
      // Alihkan ke checkout langsung dengan state data produk (single-item purchase flow)
      navigate('/checkout', { state: { product } });
    }
  };

  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(product.harga);

  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-sm border border-stone-200 hover:shadow-md transition duration-300 flex flex-col h-full">
      {/* Product Image */}
      <Link to={`/products/${product.id}`} className="relative block aspect-[4/3] overflow-hidden bg-stone-100">
        <img
          src={product.gambar_url || 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=300'}
          alt={product.nama}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-500"
          loading="lazy"
        />
        {product.stok <= 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white text-sm font-semibold tracking-wider uppercase px-3 py-1 bg-red-600 rounded">
              Habis
            </span>
          </div>
        )}
      </Link>

      {/* Product Info */}
      <div className="p-5 flex-grow flex flex-col">
        <span className="text-xs text-amber-800 font-semibold tracking-wider uppercase mb-1">Brand Lokal</span>
        <h3 className="text-stone-900 font-serif font-bold text-lg mb-2 line-clamp-1 hover:text-amber-800 transition">
          <Link to={`/products/${product.id}`}>{product.nama}</Link>
        </h3>
        <p className="text-stone-500 text-sm mb-4 line-clamp-2 flex-grow">
          {product.deskripsi || 'Tidak ada deskripsi produk.'}
        </p>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-stone-100">
          <div>
            <span className="block text-xs text-stone-400">Harga</span>
            <span className="text-lg font-bold text-amber-950">{formattedPrice}</span>
          </div>
          <span className="text-xs text-stone-500 bg-stone-100 px-2 py-1 rounded">
            Stok: {product.stok}
          </span>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleBuyNow}
          disabled={product.stok <= 0}
          className={`mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition duration-200 ${
            product.stok > 0
              ? 'bg-amber-900 hover:bg-amber-800 text-white shadow-sm'
              : 'bg-stone-200 text-stone-400 cursor-not-allowed'
          }`}
        >
          <ShoppingBag className="h-4 w-4" />
          <span>Beli Instan</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
