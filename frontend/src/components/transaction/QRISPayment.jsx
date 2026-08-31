import React from 'react';
import { QrCode, CheckCircle2, Copy } from 'lucide-react';

export const QRISPayment = ({ qrUrl, totalHarga, orderId }) => {
  const [copied, setCopied] = React.useState(false);

  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(totalHarga || 0);

  const copyOrderId = () => {
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border border-neutral-200 shadow-xs max-w-sm mx-auto overflow-hidden font-['Inter'] font-semibold">
      {/* Header */}
      <div className="bg-black text-white p-6 text-center">
        <span className="text-[10px] uppercase tracking-widest text-orange-400 font-bold block mb-1">
          PEMBAYARAN QRIS
        </span>
        <h3 className="text-2xl font-bold">{formattedPrice}</h3>
        <p className="text-[11px] text-stone-400 mt-2 uppercase tracking-wider">Order ID: {orderId}</p>
      </div>

      {/* QR Display */}
      <div className="p-6 flex flex-col items-center">
        <div className="flex items-center gap-2 mb-4 bg-orange-50 text-orange-600 px-4 py-1 border border-orange-200 text-xs font-bold uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping"></span>
          <span>Menunggu Pembayaran</span>
        </div>

        <div className="border border-neutral-300 p-3 bg-white mb-4">
          <img
            src={qrUrl}
            alt="QR Code QRIS"
            className="w-52 h-52 object-contain"
          />
        </div>

        <p className="text-xs text-stone-500 text-center mb-6 font-normal">
          Buka aplikasi e-wallet (GoPay, OVO, Dana) atau Mobile Banking, lalu scan QR Code di atas.
        </p>

        {/* Copy Order ID Button */}
        <button
          onClick={copyOrderId}
          className="inline-flex items-center gap-1.5 text-xs text-stone-600 hover:text-black font-bold uppercase tracking-wider transition"
        >
          {copied ? (
            <>
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              <span>Tersalin ke Clipboard</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Salin Order ID</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default QRISPayment;
