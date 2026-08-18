import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createTransaction, getTransactionById } from '../../api/transactions';
import { QRISPayment } from '../../components/transaction/QRISPayment';
import { TransactionBadge } from '../../components/transaction/TransactionBadge';

export const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product || null;

  const [transaction, setTransaction] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [polling, setPolling] = useState(false);

  // Buat transaksi sekali saat masuk ke halaman checkout (single-item flow MVP).
  useEffect(() => {
    if (!product) {
      navigate('/products', { replace: true });
      return;
    }
    const createTx = async () => {
      try {
        setSubmitting(true);
        setError(null);
        const tx = await createTransaction({
          total_harga: product.harga,
          payment_type: 'qris',
        });
        setTransaction(tx);
      } catch (err) {
        console.error('Gagal membuat transaksi:', err);
        setError('Gagal memulai pembayaran. Silakan coba lagi.');
      } finally {
        setSubmitting(false);
      }
    };
    createTx();
  }, [product, navigate]);

  const refreshStatus = async () => {
    if (!transaction) return;
    try {
      setPolling(true);
      const updated = await getTransactionById(transaction.id);
      setTransaction(updated);
      if (updated.status === 'PAID') {
        // Tunggu sebentar lalu arahkan ke halaman status order.
        setTimeout(() => navigate(`/order-status/${updated.id}`), 800);
      }
    } catch (err) {
      console.error('Gagal mengecek status:', err);
    } finally {
      setPolling(false);
    }
  };

  if (!product) return null;

  if (submitting) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-950"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-700 mb-4">{error}</p>
        <button
          onClick={() => navigate('/products')}
          className="text-amber-900 font-semibold hover:text-amber-700"
        >
          Kembali ke Katalog
        </button>
      </div>
    );
  }

  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(product.harga);

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <h1 className="font-serif text-3xl font-bold text-stone-900">Checkout</h1>

      {/* Order Summary */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
        <h2 className="font-serif font-bold text-lg text-stone-900 mb-4">Ringkasan Pesanan</h2>
        <div className="flex items-center gap-4">
          <div className="h-20 w-20 rounded-lg overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
            <img
              src={product.gambar_url || 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=300'}
              alt={product.nama}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-grow">
            <h3 className="font-serif font-bold text-stone-900">{product.nama}</h3>
            <p className="text-stone-500 text-sm">Qty: 1</p>
          </div>
          <div className="text-right">
            <span className="block text-xs text-stone-400">Total</span>
            <span className="text-lg font-bold text-amber-950">{formattedPrice}</span>
          </div>
        </div>
      </div>

      {/* Payment */}
      <div className="space-y-4">
        <h2 className="font-serif font-bold text-lg text-stone-900">Pembayaran QRIS</h2>
        {transaction?.status === 'PAID' ? (
          <div className="bg-white rounded-2xl border border-emerald-200 shadow-sm p-8 text-center">
            <p className="text-emerald-700 font-semibold mb-2">Pembayaran Berhasil!</p>
            <p className="text-stone-500 text-sm mb-4">Mengalihkan ke status pesanan...</p>
            <TransactionBadge status={transaction.status} />
          </div>
        ) : transaction ? (
          <QRISPayment
            qrUrl={transaction.qr_url}
            totalHarga={transaction.total_harga}
            orderId={transaction.midtrans_order_id}
            onRefresh={refreshStatus}
            isLoading={polling}
          />
        ) : null}
      </div>
    </div>
  );
};

export default CheckoutPage;
