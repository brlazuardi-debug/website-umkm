import React, { useState, useEffect } from 'react';
import { QrCode, CreditCard, AlertCircle, RefreshCw } from 'lucide-react';

export const QRISPayment = ({
  qrUrl,
  totalHarga,
  orderId,
  onRefresh,
  isLoading,
}) => {
  const [timeLeft, setTimeLeft] = useState(300); // 5 menit (300 detik) countdown

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(totalHarga);

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden max-w-md w-full mx-auto">
      {/* Header Harga */}
      <div className="bg-amber-900 text-white p-6 text-center">
        <span className="text-xs uppercase tracking-wider text-amber-200 font-semibold block mb-1">
          Total Pembayaran
        </span>
        <h2 className="text-3xl font-bold font-serif">{formattedPrice}</h2>
        <p className="text-xs text-amber-100/80 mt-2">Order ID: {orderId}</p>
      </div>

      <div className="p-6 flex flex-col items-center">
        {/* Timer Expiry */}
        {timeLeft > 0 ? (
          <div className="flex items-center gap-2 mb-4 bg-amber-50 text-amber-950 px-4 py-1.5 rounded-full border border-amber-200 text-sm font-semibold">
            <span className="w-2 h-2 rounded-full bg-amber-600 animate-ping"></span>
            <span>Selesaikan pembayaran dalam {formatTime(timeLeft)}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 mb-4 bg-red-50 text-red-700 px-4 py-1.5 rounded-full border border-red-200 text-sm font-semibold">
            <AlertCircle className="h-4 w-4" />
            <span>Waktu pembayaran habis (QR Kedaluwarsa)</span>
          </div>
        )}

        {/* QR Code Container */}
        <div className="relative border-4 border-stone-100 rounded-xl p-3 bg-white shadow-inner mb-4">
          {timeLeft > 0 ? (
            <img
              src={qrUrl}
              alt="QRIS Duitku Code"
              className="w-64 h-64 object-contain"
            />
          ) : (
            <div className="w-64 h-64 flex flex-col items-center justify-center bg-stone-50 border border-stone-200 rounded-lg">
              <QrCode className="h-12 w-12 text-stone-300 mb-2" />
              <span className="text-xs text-stone-400 font-medium px-4 text-center">
                Mohon lakukan checkout ulang untuk men-generate QRIS baru.
              </span>
            </div>
          )}
        </div>

        {/* Metode Pembayaran Logo Banner */}
        <div className="flex items-center gap-2 text-xs text-stone-400 mb-6 bg-stone-50 px-4 py-2 rounded-lg border border-stone-100">
          <CreditCard className="h-4 w-4 text-stone-500" />
          <span>Mendukung semua e-wallet: GoPay, OVO, ShopeePay, DANA, LinkAja</span>
        </div>

        {/* Polling / Manual Refresh Action */}
        <button
          onClick={onRefresh}
          disabled={isLoading || timeLeft <= 0}
          className="w-full flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-sm py-3 px-4 rounded-xl transition duration-200 shadow-sm disabled:bg-stone-100 disabled:text-stone-400 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? 'Memeriksa status...' : 'Cek Status Pembayaran'}</span>
        </button>

        <p className="text-xs text-stone-400 text-center mt-3 leading-relaxed">
          *Pembayaran Anda diverifikasi secara otomatis dalam beberapa detik. Klik tombol di atas jika status tidak berubah.
        </p>
      </div>
    </div>
  );
};

export default QRISPayment;
