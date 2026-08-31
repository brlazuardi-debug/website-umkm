import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTransactionById } from '../../api/transactions';
import { CheckCircle2, Clock, XCircle, ArrowLeft, ShieldCheck } from 'lucide-react';

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
    intervalId = setInterval(poll, 3000);
    return () => clearInterval(intervalId);
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32 bg-stone-50 min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  if (error || !transaction) {
    return (
      <div className="text-center py-32 bg-stone-50 min-h-screen flex flex-col items-center gap-4">
        <p className="text-stone-600 text-sm font-semibold">{error || 'Pesanan tidak tersedia.'}</p>
        <Link to="/products" className="text-xs font-bold uppercase tracking-wider text-black underline">
          Kembali ke Katalog
        </Link>
      </div>
    );
  }

  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(transaction.total_harga || 0);

  const statusMeta = {
    PENDING: { icon: Clock, color: 'text-orange-400', bg: 'bg-orange-50', text: 'Menunggu konfirmasi pembayaran Anda.' },
    PAID: { icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', text: 'Pembayaran berhasil diverifikasi. Pesanan sedang diproses.' },
    SHIPPED: { icon: ShieldCheck, color: 'text-blue-600', bg: 'bg-blue-50', text: 'Pesanan telah dikirim ke kurir logistik.' },
    EXPIRED: { icon: XCircle, color: 'text-stone-500', bg: 'bg-stone-100', text: 'Waktu pembayaran telah kedaluwarsa.' },
    FAILED: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', text: 'Pembayaran gagal. Silakan coba lagi.' },
  };

  const meta = statusMeta[transaction.status] || statusMeta.PENDING;
  const StatusIcon = meta.icon;

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-['Inter'] font-semibold py-12 px-6">
      <div className="max-w-xl mx-auto flex flex-col gap-6">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-stone-500 hover:text-black text-xs font-semibold uppercase tracking-wider transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Katalog</span>
        </Link>

        <div className="bg-white border border-neutral-200 p-8 sm:p-10 flex flex-col items-center text-center shadow-xs">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${meta.bg} ${meta.color}`}>
            <StatusIcon className="h-8 w-8" />
          </div>

          <span className="text-orange-400 text-xs font-bold uppercase tracking-widest block mb-1">TRANSACTION CONFIRMATION</span>
          <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-black mb-3">
            STATUS PESANAN
          </h1>

          <div className="inline-block px-3 py-1 bg-black text-white text-xs font-bold uppercase tracking-wider mb-4">
            {transaction.status}
          </div>

          <p className="text-stone-600 text-sm font-normal max-w-sm mb-8">
            {meta.text}
          </p>

          {transaction.status === 'PENDING' && transaction.qr_url && (
            <div className="mb-8 p-4 bg-zinc-50 border border-neutral-200 flex flex-col items-center gap-3">
              <img src={transaction.qr_url} alt="QRIS Code" className="w-56 h-56 object-contain" />
              <span className="text-[10px] uppercase font-bold text-stone-500 tracking-wider">Scan via BCA / GoPay / OVO / Dana</span>
            </div>
          )}

          <div className="w-full pt-6 border-t border-neutral-200 flex flex-col gap-3 text-left text-xs font-semibold uppercase tracking-wider">
            <div className="flex justify-between">
              <span className="text-stone-500">ORDER ID:</span>
              <span className="font-bold text-black">{transaction.midtrans_order_id || transaction.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">TOTAL PEMBAYARAN:</span>
              <span className="font-bold text-black text-sm">{formattedPrice}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">METODE:</span>
              <span className="font-bold text-black">{transaction.payment_type || 'QRIS'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderStatusPage;
