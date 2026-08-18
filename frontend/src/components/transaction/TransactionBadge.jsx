import React from 'react';

export const TransactionBadge = ({ status }) => {
  const styles = {
    PENDING: 'bg-amber-100 text-amber-800 border-amber-200',
    PAID: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    EXPIRED: 'bg-stone-100 text-stone-600 border-stone-200',
    FAILED: 'bg-red-100 text-red-800 border-red-200', // diperbaiki: border-red-250 tidak ada di Tailwind v4
  };

  const labels = {
    PENDING: 'Menunggu Pembayaran',
    PAID: 'Pembayaran Berhasil',
    EXPIRED: 'Kedaluwarsa',
    FAILED: 'Gagal',
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${styles[status]}`}>
      {labels[status]}
    </span>
  );
};

export default TransactionBadge;
