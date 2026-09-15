// Definisi tipe data (di-convert dari TypeScript ke JavaScript murni).
// Dibungkus JSDoc agar tetap terbaca seperti "tipe" saat development.

/**
 * @typedef {Object} UserResponse
 * @property {string} id
 * @property {string} clerk_id
 * @property {string} email
 * @property {string} name
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} ProdukResponse
 * @property {string} id
 * @property {string} nama
 * @property {string|null} deskripsi
 * @property {number} harga
 * @property {number} stok
 * @property {string|null} gambar_url
 * @property {boolean} is_active
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} TransaksiResponse
 * @property {string} id
 * @property {string} user_id
 * @property {number} total_harga
 * @property {'PENDING'|'PAID'|'EXPIRED'|'FAILED'} status
 * @property {string} payment_type
 * @property {string|null} midtrans_order_id
 * @property {string|null} qr_url
 * @property {string} created_at
 * @property {string} updated_at
 */

export const TRANSACTION_STATUS = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  EXPIRED: 'EXPIRED',
  FAILED: 'FAILED',
};
