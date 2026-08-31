import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProductById, createProduct, updateProduct } from '../../api/products';
import { ArrowLeft, Save, Sparkles, Image, Package, Users, ShoppingBag, LogOut } from 'lucide-react';

export const ProductFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [nama, setNama] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [harga, setHarga] = useState(0);
  const [stok, setStok] = useState(0);
  const [gambarUrl, setGambarUrl] = useState('');
  const [isActive, setIsActive] = useState(true);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    const loadProductData = async () => {
      try {
        setLoading(true);
        const data = await getProductById(id);
        setNama(data.nama);
        setDeskripsi(data.deskripsi || '');
        setHarga(data.harga);
        setStok(data.stok);
        setGambarUrl(data.gambar_url || '');
        setIsActive(data.is_active);
      } catch (err) {
        console.error('Error loading product data for edit:', err);
        setError('Gagal memuat data produk.');
      } finally {
        setLoading(false);
      }
    };
    loadProductData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nama.trim()) {
      setError('Nama produk wajib diisi.');
      return;
    }
    if (harga <= 0) {
      setError('Harga produk harus lebih besar dari 0.');
      return;
    }
    if (stok < 0) {
      setError('Stok produk tidak boleh negatif.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const payload = {
        nama,
        deskripsi: deskripsi.trim() || null,
        harga,
        stok,
        gambar_url: gambarUrl.trim() || null,
        is_active: isActive,
      };

      if (isEditMode && id) {
        await updateProduct(id, payload);
      } else {
        await createProduct(payload);
      }

      navigate('/admin');
    } catch (err) {
      console.error('Error submitting product form:', err);
      setError('Gagal menyimpan data produk. Periksa kembali inputan Anda.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div data-layer="Admin Panel - Product Form" className="AdminPanelProductForm w-full min-h-screen bg-stone-50 text-stone-900 font-['Inter'] font-semibold flex">

      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-neutral-200 min-h-screen flex flex-col justify-between p-6 shrink-0">
        <div className="flex flex-col gap-8">
          <div className="text-black text-2xl font-bold uppercase tracking-tight">
            VARCA BRAND
          </div>

          <nav className="flex flex-col gap-2">
            <span className="text-stone-400 text-xs font-bold uppercase tracking-wider px-4 py-2">
              WORKSPACE
            </span>
            <Link to="/admin" className="flex items-center gap-3 px-4 py-3 bg-black text-white font-semibold transition">
              <Package className="w-5 h-5 text-white" />
              <span>Product Management</span>
            </Link>
            <Link to="/admin/employee" className="flex items-center gap-3 px-4 py-3 text-stone-600 font-semibold hover:bg-stone-100 transition">
              <Users className="w-5 h-5" />
              <span>Employee Management</span>
            </Link>
            <Link to="/admin/cart-orders" className="flex items-center gap-3 px-4 py-3 text-stone-600 font-semibold hover:bg-stone-100 transition">
              <ShoppingBag className="w-5 h-5" />
              <span>Cart &amp; Orders</span>
            </Link>
          </nav>
        </div>

        <div className="pt-4 border-t border-neutral-200">
          <Link to="/" className="flex items-center gap-3 px-4 py-3 text-stone-500 font-semibold hover:text-black transition">
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen">
        <div className="p-8 sm:p-12 max-w-3xl flex flex-col gap-8">
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 text-stone-500 hover:text-black text-xs font-bold uppercase tracking-wider transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Kembali ke Product Management</span>
          </Link>

          <div>
            <span className="text-orange-400 text-xs font-bold uppercase tracking-widest block mb-1">INVENTORY CATALOG</span>
            <h1 className="text-3xl font-bold uppercase tracking-tight text-black">
              {isEditMode ? 'EDIT PRODUK VARCA' : 'TAMBAH PRODUK BARU'}
            </h1>
            <p className="text-stone-500 text-sm font-normal mt-1">Lengkapi informasi spesifikasi dan etalase produk.</p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-700 border border-red-200 text-xs font-bold uppercase tracking-wider">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white border border-neutral-200 p-8 flex flex-col gap-6 shadow-xs">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="nama" className="text-xs font-bold uppercase tracking-wider text-stone-600">
                Nama Produk
              </label>
              <input
                id="nama"
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Contoh: The Essential Overshirt"
                className="w-full py-2.5 px-3 bg-zinc-50 border border-neutral-300 text-sm text-black focus:outline-none focus:border-black"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="deskripsi" className="text-xs font-bold uppercase tracking-wider text-stone-600">
                Deskripsi &amp; Spesifikasi
              </label>
              <textarea
                id="deskripsi"
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                placeholder="Spesifikasi bahan, jahitan, dan keunggulan potongan produk..."
                rows={4}
                className="w-full py-2.5 px-3 bg-zinc-50 border border-neutral-300 text-sm text-black focus:outline-none focus:border-black"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="harga" className="text-xs font-bold uppercase tracking-wider text-stone-600">
                  Harga (IDR)
                </label>
                <input
                  id="harga"
                  type="number"
                  value={harga || ''}
                  onChange={(e) => setHarga(Math.max(0, parseInt(e.target.value) || 0))}
                  placeholder="499000"
                  className="w-full py-2.5 px-3 bg-zinc-50 border border-neutral-300 text-sm text-black focus:outline-none focus:border-black"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="stok" className="text-xs font-bold uppercase tracking-wider text-stone-600">
                  Stok Inventaris
                </label>
                <input
                  id="stok"
                  type="number"
                  value={stok || ''}
                  onChange={(e) => setStok(Math.max(0, parseInt(e.target.value) || 0))}
                  placeholder="20"
                  className="w-full py-2.5 px-3 bg-zinc-50 border border-neutral-300 text-sm text-black focus:outline-none focus:border-black"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="gambar" className="text-xs font-bold uppercase tracking-wider text-stone-600">
                URL Gambar Produk
              </label>
              <input
                id="gambar"
                type="url"
                value={gambarUrl}
                onChange={(e) => setGambarUrl(e.target.value)}
                placeholder="https://images.unsplash.com/photo-1591047139829-d91aecb6caea"
                className="w-full py-2.5 px-3 bg-zinc-50 border border-neutral-300 text-sm text-black focus:outline-none focus:border-black"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-zinc-50 border border-neutral-200">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-black block">Status Publikasi</span>
                <span className="text-[11px] text-stone-500 font-normal">Tampilkan produk ini di etalase katalog publik</span>
              </div>
              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={`w-12 h-6 flex items-center p-1 transition ${isActive ? 'bg-black justify-end' : 'bg-stone-300 justify-start'}`}
              >
                <div className="w-4 h-4 bg-white" />
              </button>
            </div>

            <div className="flex gap-4 pt-2">
              <Link
                to="/admin"
                className="flex-1 py-3.5 border border-neutral-300 text-stone-600 text-xs font-bold uppercase tracking-wider text-center hover:border-black hover:text-black transition"
              >
                BATAL
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-3.5 bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{submitting ? 'MENYIMPAN...' : 'SIMPAN PRODUK'}</span>
              </button>
            </div>
          </form>
        </div>
      </main>

    </div>
  );
};

export default ProductFormPage;
