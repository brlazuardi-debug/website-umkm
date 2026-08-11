import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, deleteProduct } from '../../api/products';
import type { ProdukResponse } from '../../types';
import { Plus, Edit3, Trash2, Check, X, Eye, Package } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [products, setProducts] = useState<ProdukResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllProducts = async () => {
    try {
      setLoading(true);
      // Di admin, kita load limit 100 untuk ringkasan katalog penuh
      const data = await getProducts(100, 0);
      setProducts(data);
    } catch (err) {
      console.error('Error fetching admin products:', err);
      setError('Gagal memuat katalog produk admin.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus produk ini secara permanen dari katalog?')) {
      return;
    }
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      alert('Produk berhasil dihapus.');
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Gagal menghapus produk. Coba lagi.');
    }
  };

  const formatPrice = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(num);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-serif text-stone-900">Panel Manajemen Owner</h1>
          <p className="text-stone-500 text-sm">Kelola informasi produk, stok, dan etalase toko UMKM Anda.</p>
        </div>
        <Link
          to="/admin/product/new"
          className="inline-flex items-center gap-2 bg-amber-900 hover:bg-amber-800 text-white font-bold text-sm px-4 py-2.5 rounded-xl shadow-sm transition"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Produk Baru</span>
        </Link>
      </div>

      {error ? (
        <div className="p-4 bg-red-50 text-red-800 rounded-xl border border-red-100 max-w-md">
          {error}
        </div>
      ) : loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-950"></div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-stone-400 uppercase text-[10px] font-bold tracking-wider">
                  <th className="py-4 px-6">Produk</th>
                  <th className="py-4 px-6 text-right">Harga</th>
                  <th className="py-4 px-6 text-center">Stok</th>
                  <th className="py-4 px-6 text-center">Status Aktif</th>
                  <th className="py-4 px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 text-sm">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-stone-50/50 transition">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-lg overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                          <img
                            src={product.gambar_url || 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=300'}
                            alt={product.nama}
                            className="w-full h-full object-cover object-center"
                          />
                        </div>
                        <div>
                          <h4 className="font-serif font-bold text-stone-900 line-clamp-1">{product.nama}</h4>
                          <p className="text-stone-400 text-xs line-clamp-1">{product.deskripsi || '-'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right font-bold text-stone-900">
                      {formatPrice(product.harga)}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`inline-flex items-center gap-1 font-semibold ${product.stok <= 3 ? 'text-red-600' : 'text-stone-700'}`}>
                        <Package className="h-3.5 w-3.5" />
                        <span>{product.stok}</span>
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      {product.is_active ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full text-xs font-semibold border border-emerald-100">
                          <Check className="h-3 w-3" />
                          <span>Aktif</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-stone-500 bg-stone-100 px-2.5 py-1 rounded-full text-xs font-semibold border border-stone-200">
                          <X className="h-3 w-3" />
                          <span>Non-aktif</span>
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/products/${product.id}`}
                          title="Lihat Detail Produk"
                          className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          to={`/admin/product/${product.id}/edit`}
                          title="Edit Produk"
                          className="p-2 text-amber-900 hover:text-amber-800 hover:bg-amber-50 rounded-lg transition"
                        >
                          <Edit3 className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          title="Hapus Produk"
                          className="p-2 text-red-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {products.length === 0 && (
            <div className="text-center py-12 text-stone-500">
              <Package className="h-12 w-12 text-stone-300 mx-auto mb-2" />
              <p>Belum ada produk terdaftar. Klik "Tambah Produk Baru" untuk memulai.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default AdminDashboard;
