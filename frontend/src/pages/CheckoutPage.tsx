import React, { useState } from 'react';
import { useLocation, Navigate, useNavigate, Link } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { createTransaction } from '../api/transactions';
import type { ProdukResponse } from '../types';
import { ArrowLeft, ShoppingBag, ShieldAlert, CreditCard } from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Mengambil data produk dari state router
  const state = location.state as { product?: ProdukResponse } | null;
  const product = state?.product;

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-950"></div>
      </div>
    );
  }

  // Jika tidak ada data produk di state (akses langsung /checkout), arahkan ke beranda
  if (!product) {
    return <Navigate to="/" replace />;
  }

  const handleProcessCheckout = async () => {
    try {
      setLoading(true);
      setError(null);

      // Panggil backend API untuk membuat transaksi pembayaran QRIS Duitku
      const response = await createTransaction({
        total_harga: product.harga,
        payment_type: 'qris',
      });

      // Redirect ke halaman Order Status untuk menampilkan QRIS & Polling
      navigate(`/order-status/${response.id}`, {
        state: { transaction: response }
      });
    } catch (err) {
      console.error('Error creating transaction:', err);
      setError('Gagal memproses pembuatan transaksi. Silakan coba kembali.');
    } finally {
      setLoading(false);
    }
  };

  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(product.harga);

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Back to product detail */}
      <Link
        to={`/products/${product.id}`}
        className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-900 text-sm font-semibold transition"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Kembali ke Detail Produk</span>
      </Link>

      <h1 className="text-3xl font-bold font-serif text-stone-900">Konfirmasi Pemesanan</h1>

      {error && (
        <div className="p-4 bg-red-50 text-red-800 rounded-xl border border-red-200 flex items-start gap-3">
          <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm">
        {/* Detail Pembeli */}
        <div className="space-y-3 pb-6 border-b border-stone-200">
          <h3 className="text-sm font-bold uppercase tracking-wider text-stone-400">Data Pembeli</h3>
          <div className="text-sm space-y-1">
            <p className="text-stone-900 font-semibold">{user?.fullName || 'Pengguna UMKM'}</p>
            <p className="text-stone-500">{user?.primaryEmailAddress?.emailAddress}</p>
          </div>
        </div>

        {/* Ringkasan Item */}
        <div className="space-y-4 pb-6 border-b border-stone-200">
          <h3 className="text-sm font-bold uppercase tracking-wider text-stone-400">Ringkasan Pesanan</h3>
          <div className="flex gap-4 items-start">
            <div className="h-16 w-16 rounded-lg overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
              <img
                src={product.gambar_url || 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=300'}
                alt={product.nama}
                className="w-full h-full object-cover object-center"
              />
            </div>
            <div className="flex-grow">
              <h4 className="font-serif font-bold text-stone-900 text-sm sm:text-base line-clamp-1">{product.nama}</h4>
              <p className="text-xs text-stone-400 mt-0.5">Jumlah: 1 Unit</p>
            </div>
            <span className="text-sm sm:text-base font-bold text-amber-950 shrink-0">{formattedPrice}</span>
          </div>
        </div>

        {/* Detail Pembayaran */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-stone-400">Metode Pembayaran</h3>
          <div className="flex items-center gap-3 p-4 rounded-xl border border-amber-200 bg-amber-50/30 text-amber-950">
            <CreditCard className="h-5 w-5 text-amber-800" />
            <div>
              <span className="font-bold text-sm block">QRIS Otomatis (Duitku)</span>
              <span className="text-xs text-stone-500">Mendukung GoPay, OVO, ShopeePay, Dana, & LinkAja</span>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleProcessCheckout}
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 bg-amber-900 hover:bg-amber-800 text-white font-bold text-base py-4 rounded-xl transition duration-200 shadow-md disabled:bg-stone-100 disabled:text-stone-400 disabled:cursor-not-allowed"
        >
          <ShoppingBag className="h-5 w-5" />
          <span>{loading ? 'Sedang Memproses...' : 'Buat Pembayaran QRIS'}</span>
        </button>
      </div>
    </div>
  );
};
export default CheckoutPage;
