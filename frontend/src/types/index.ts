export interface UserResponse {
  id: string;
  clerk_id: string;
  email: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface UserUpdate {
  name: string | null;
}

export interface ProdukResponse {
  id: string;
  nama: string;
  deskripsi: string | null;
  harga: number;
  stok: number;
  gambar_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProdukCreate {
  nama: string;
  deskripsi: string | null;
  harga: number;
  stok: number;
  gambar_url: string | null;
  is_active: boolean;
}

export interface ProdukUpdate {
  nama: string | null;
  deskripsi: string | null;
  harga: number | null;
  stok: number | null;
  gambar_url: string | null;
  is_active: boolean | null;
}

export interface TransaksiCreate {
  total_harga: number;
  payment_type: string; // default "qris"
}

export interface TransaksiResponse {
  id: string;
  user_id: string;
  total_harga: number;
  status: 'PENDING' | 'PAID' | 'EXPIRED' | 'FAILED';
  payment_type: string;
  midtrans_order_id: string | null;
  qr_url: string | null;
  created_at: string;
  updated_at: string;
}
