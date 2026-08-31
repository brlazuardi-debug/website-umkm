import React from 'react';

export const TransactionBadge = ({ status }) => {
  const badgeStyles = {
    PENDING: 'bg-orange-50 text-orange-500 border-orange-200',
    PAID: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    SHIPPED: 'bg-blue-50 text-blue-800 border-blue-200',
    EXPIRED: 'bg-stone-100 text-stone-600 border-stone-300',
    FAILED: 'bg-red-50 text-red-800 border-red-200',
  };

  const statusLabels = {
    PENDING: 'Menunggu Pembayaran',
    PAID: 'Lunas / Berhasil',
    SHIPPED: 'Dikirim',
    EXPIRED: 'Kedaluwarsa',
    FAILED: 'Gagal',
  };

  const style = badgeStyles[status] || 'bg-stone-100 text-stone-600 border-stone-300';
  const label = statusLabels[status] || status;

  return (
    <span className={`inline-flex items-center px-3 py-1 text-[10px] font-bold uppercase tracking-wider border ${style}`}>
      {label}
    </span>
  );
};

export default TransactionBadge;
