import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTransactionById } from '../../api/transactions';
import { TransactionBadge } from '../../components/transaction/TransactionBadge';
import { CheckCircle2, Clock, XCircle, ArrowLeft } from 'lucide-react';

export const OrderStatusPage = () => {
  const { id } = useParams();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let intervalId;
    const poll = async () => {
      try {
        const tx = await getTransactionById(id);
        setTransaction(tx);
        if (tx.status !== 'PENDING') {
          clearInterval(intervalId);
        }
      } catch (err) {
        console.error('Gagal memuat status pesanan:', err);
        setError('Pesanan tidak ditemukan.');
        clearInterval(intervalId);
      } finally {
        setLoading(false);
      }
    };

    poll();
    // Poll status otomatis setiap 3 detik sampai status berubah dari PENDING.
    intervalId = setInterval(poll, 3000);
    return () => clearInterval(intervalId);
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-950"></div>
      </div>
    );
  }

  if (error || !transaction) {
    return (
      <div className="text-center py-20">
        <p className="text-stone-500 mb-4">{error || 'Pesanan tidak tersedia.'}</p>
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
  }).format(transaction.total_harga);

  const statusMeta = {
    PENDING: { icon: Clock, color: 'text-amber-600', text: 'Menunggu pembayaran Anda.' },
    PAID: { icon: CheckCircle2, color: 'text-emerald-600', text: 'Pembayaran berhasil diverifikasi.' },
    EXPIRED: { icon: XCircle, color: 'text-stone-500', text: 'Waktu pembayaran telah kedaluwarsa.' },
    FAILED: { icon: XCircle, color: 'text-red-600', text: 'Pembayaran gagal. Silakan coba lagi.' },
  };

  const meta = statusMeta[transaction.status] || statusMeta.PENDING;
  const StatusIcon = meta.icon;

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <Link
        to="/products"
        className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-900 text-sm font-semibold transition"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Kembali ke Katalog</span>
      </Link>

      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-8 text-center">
        <div className={`mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-stone-50 mb-4 ${meta.color}`}>
          <StatusIcon className="h-8 w-8" />
        </div>
        <h1 className="font-serif text-2xl font-bold text-stone-900 mb-2">Status Pesanan</h1>
        <TransactionBadge status={transaction.status} />
        <p className="text-stone-500 mt-4">{meta.text}</p>

        <div className="mt-6 pt-6 border-t border-stone-100 text-left space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-stone-500">Order ID</span>
            <span className="font-medium text-stone-900">{transaction.midtrans_order_id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-500">Total</span>
            <span className="font-bold text-amber-950">{formattedPrice}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-500">Metode</span>
            <span className="font-medium text-stone-900 uppercase">{transaction.payment_type}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderStatusPage;
