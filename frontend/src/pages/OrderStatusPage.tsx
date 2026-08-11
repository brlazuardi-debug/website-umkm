import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { getTransactionById } from '../api/transactions';
import type { TransaksiResponse } from '../types';
import QRISPayment from '../components/transaction/QRISPayment';
import TransactionBadge from '../components/transaction/TransactionBadge';
import { ArrowRight, CheckCircle2, XCircle, Clock, ShoppingBag } from 'lucide-react';

export const OrderStatusPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [transaction, setTransaction] = useState<TransaksiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load awal transaksi
  useEffect(() => {
    if (!id) return;

    // Jika data transaksi dikirim via router state, gunakan terlebih dahulu untuk instan rendering
    const routerState = location.state as { transaction?: TransaksiResponse } | null;
    if (routerState?.transaction) {
      setTransaction(routerState.transaction);
      setLoading(false);
    } else {
      const fetchTransaction = async () => {
        try {
          setLoading(true);
          const data = await getTransactionById(id);
          setTransaction(data);
        } catch (err) {
          console.error('Error fetching transaction:', err);
          setError('Gagal memuat status transaksi.');
        } finally {
          setLoading(false);
        }
      };
      fetchTransaction();
    }
  }, [id, location.state]);

  // Polling Efek: Jalankan polling status setiap 4 detik jika status PENDING
  useEffect(() => {
    if (!id || !transaction || transaction.status !== 'PENDING') return;

    const interval = setInterval(async () => {
      try {
        const updatedTx = await getTransactionById(id);
        if (updatedTx.status !== 'PENDING') {
          setTransaction(updatedTx);
          clearInterval(interval); // Hentikan polling jika status berubah
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [id, transaction]);

  const handleManualCheckStatus = async () => {
    if (!id) return;
    try {
      setRefreshing(true);
      const data = await getTransactionById(id);
      setTransaction(data);
    } catch (err) {
      console.error('Error checking status manually:', err);
    } finally {
      setRefreshing(false);
    }
  };

  const formattedPrice = transaction
    ? new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0
      }).format(transaction.total_harga)
    : '';

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-950"></div>
      </div>
    );
  }

  if (error || !transaction) {
    return (
      <div className="max-w-md mx-auto text-center py-12 space-y-4">
        <XCircle className="h-12 w-12 text-red-600 mx-auto" />
        <h2 className="text-xl font-bold font-serif text-stone-900">Transaksi Tidak Ditemukan</h2>
        <p className="text-stone-500 text-sm">{error || 'ID Transaksi tidak valid.'}</p>
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-amber-900">
          <span>Kembali ke Beranda</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  // Render Berdasarkan Status Transaksi
  return (
    <div className="max-w-md mx-auto space-y-8">
      {transaction.status === 'PENDING' && (
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold font-serif text-stone-900">Selesaikan Pembayaran</h1>
            <p className="text-stone-500 text-sm">Pindai kode QRIS di bawah menggunakan aplikasi e-wallet Anda.</p>
          </div>
          {transaction.qr_url && (
            <QRISPayment
              qrUrl={transaction.qr_url}
              totalHarga={transaction.total_harga}
              orderId={transaction.midtrans_order_id || transaction.id}
              onRefresh={handleManualCheckStatus}
              isLoading={refreshing}
            />
          )}
        </div>
      )}

      {transaction.status === 'PAID' && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-8 text-center space-y-6">
          <div className="h-16 w-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mx-auto">
            <CheckCircle2 className="h-10 w-10" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold font-serif text-stone-900">Pembayaran Berhasil!</h1>
            <p className="text-stone-500 text-sm">Terima kasih telah membeli produk lokal kami. Pembayaran Anda telah terkonfirmasi.</p>
          </div>

          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 text-left space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-stone-500">Status Pembayaran</span>
              <TransactionBadge status={transaction.status} />
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Nominal Transaksi</span>
              <span className="font-bold text-amber-950">{formattedPrice}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Order ID</span>
              <span className="font-mono text-xs font-semibold text-stone-700">{transaction.midtrans_order_id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Tanggal Transaksi</span>
              <span className="text-stone-700">{new Date(transaction.created_at).toLocaleString('id-ID')}</span>
            </div>
          </div>

          <Link
            to="/"
            className="w-full inline-flex items-center justify-center gap-2 bg-amber-900 hover:bg-amber-800 text-white font-bold text-sm py-3.5 px-4 rounded-xl transition duration-200 shadow-sm"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Belanja Kembali</span>
          </Link>
        </div>
      )}

      {(transaction.status === 'EXPIRED' || transaction.status === 'FAILED') && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-8 text-center space-y-6">
          <div className="h-16 w-16 bg-red-50 rounded-full flex items-center justify-center text-red-600 mx-auto">
            {transaction.status === 'EXPIRED' ? <Clock className="h-10 w-10 text-red-600" /> : <XCircle className="h-10 w-10" />}
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold font-serif text-stone-900">
              {transaction.status === 'EXPIRED' ? 'Pembayaran Kedaluwarsa' : 'Pembayaran Gagal'}
            </h1>
            <p className="text-stone-500 text-sm">
              {transaction.status === 'EXPIRED'
                ? 'Batas waktu pembayaran telah habis. Silakan buat transaksi pemesanan baru.'
                : 'Transaksi gagal diproses oleh sistem pembayaran.'}
            </p>
          </div>

          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 text-left space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-stone-500">Status Transaksi</span>
              <TransactionBadge status={transaction.status} />
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Nominal Transaksi</span>
              <span className="font-bold text-stone-800">{formattedPrice}</span>
            </div>
          </div>

          <Link
            to="/"
            className="w-full inline-flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm py-3.5 px-4 rounded-xl transition duration-200 shadow-sm"
          >
            <span>Kembali ke Katalog Utama</span>
          </Link>
        </div>
      )}
    </div>
  );
};
export default OrderStatusPage;
