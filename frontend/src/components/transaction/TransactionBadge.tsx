import React from 'react';

interface TransactionBadgeProps {
  status: 'PENDING' | 'PAID' | 'EXPIRED' | 'FAILED';
}

export const TransactionBadge: React.FC<TransactionBadgeProps> = ({ status }) => {
  const styles: Record<string, string> = {
    PENDING: 'bg-amber-100 text-amber-800 border-amber-200',
    PAID: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    EXPIRED: 'bg-stone-100 text-stone-600 border-stone-200',
    FAILED: 'bg-red-100 text-red-800 border-red-250',
  };

  const labels: Record<string, string> = {
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
