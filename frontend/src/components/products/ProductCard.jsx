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
      navigate('/checkout', { state: { product } });
    }
  };

  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(product.harga || 0);

  return (
    <div className="group bg-white border border-neutral-200 transition duration-300 flex flex-col h-full font-['Inter'] font-semibold">
      {/* Product Image */}
      <Link to={`/products/${product.id}`} className="relative block aspect-[3/4] overflow-hidden bg-zinc-100">
        <img
          src={product.gambar_url || 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800'}
          alt={product.nama}
          className="w-full h-full object-cover grayscale contrast-115 group-hover:scale-105 transition duration-500"
          loading="lazy"
        />
        {product.stok <= 3 && (
          <span className="absolute top-3 left-3 bg-black text-white text-[10px] uppercase font-bold tracking-wider px-2 py-0.5">
            LOW STOCK
          </span>
        )}
      </Link>

      {/* Product Info */}
      <div className="p-4 flex-grow flex flex-col justify-between gap-3">
        <div>
          <span className="text-[10px] text-orange-400 font-bold tracking-widest uppercase mb-1 block">
            {product.kategori || 'ESSENTIALS'}
          </span>
          <h3 className="text-black font-semibold text-sm uppercase tracking-wide line-clamp-1 group-hover:text-orange-500 transition">
            <Link to={`/products/${product.id}`}>{product.nama}</Link>
          </h3>
          <p className="text-stone-500 text-xs font-normal mt-1 line-clamp-2">
            {product.deskripsi || 'Elevated luxury essential.'}
          </p>
        </div>

        <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
          <span className="text-sm font-bold text-black">{formattedPrice}</span>
          <button
            onClick={handleBuyNow}
            disabled={product.stok <= 0}
            className="p-2 bg-black text-white hover:bg-neutral-800 transition disabled:opacity-50"
            title="Beli Instan"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
