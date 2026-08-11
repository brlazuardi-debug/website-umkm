import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProductById, createProduct, updateProduct } from '../../api/products';
import { ArrowLeft, Save, Sparkles, Image } from 'lucide-react';

export const ProductFormPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  // Form states
  const [nama, setNama] = useState<string>('');
  const [deskripsi, setDeskripsi] = useState<string>('');
  const [harga, setHarga] = useState<number>(0);
  const [stok, setStok] = useState<number>(0);
  const [gambarUrl, setGambarUrl] = useState<string>('');
  const [isActive, setIsActive] = useState<boolean>(true);

  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
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
        is_active: isActive
      };

      if (isEditMode && id) {
        await updateProduct(id, payload);
      } else {
        await createProduct(payload);
      }

      alert(isEditMode ? 'Produk berhasil diperbarui!' : 'Produk baru berhasil ditambahkan!');
      navigate('/admin');
    } catch (err) {
      console.error('Error submitting product form:', err);
      setError('Gagal menyimpan data produk. Periksa kembali inputan Anda.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-950"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link
        to="/admin"
        className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-900 text-sm font-semibold transition"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Kembali ke Dashboard Admin</span>
      </Link>

      <div className="flex items-center gap-2">
        <Sparkles className="h-6 w-6 text-amber-800" />
        <h1 className="text-3xl font-bold font-serif text-stone-900">
          {isEditMode ? 'Edit Produk Brand' : 'Tambah Produk Baru'}
        </h1>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-800 rounded-xl border border-red-100 text-sm font-semibold">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
        {/* Nama Produk */}
        <div className="space-y-1.5">
          <label htmlFor="nama" className="text-xs font-bold uppercase tracking-wider text-stone-500 block">Nama Produk</label>
          <input
            id="nama"
            type="text"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            placeholder="Contoh: Kain Batik Tulis Cirebon"
            className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-800"
            required
          />
        </div>

        {/* Deskripsi */}
        <div className="space-y-1.5">
          <label htmlFor="deskripsi" className="text-xs font-bold uppercase tracking-wider text-stone-500 block">Deskripsi & Cerita Produk</label>
          <textarea
            id="deskripsi"
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
            placeholder="Tulis spesifikasi lengkap dan cerita pembuatan produk lokal..."
            rows={5}
            className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-800"
          />
        </div>

        {/* Harga & Stok Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="harga" className="text-xs font-bold uppercase tracking-wider text-stone-500 block">Harga (IDR)</label>
            <input
              id="harga"
              type="number"
              value={harga || ''}
              onChange={(e) => setHarga(Math.max(0, parseInt(e.target.value) || 0))}
              placeholder="0"
              className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-800"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="stok" className="text-xs font-bold uppercase tracking-wider text-stone-500 block">Stok Tersedia</label>
            <input
              id="stok"
              type="number"
              value={stok || ''}
              onChange={(e) => setStok(Math.max(0, parseInt(e.target.value) || 0))}
              placeholder="0"
              className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-800"
              required
            />
          </div>
        </div>

        {/* Gambar URL */}
        <div className="space-y-1.5">
          <label htmlFor="gambar" className="text-xs font-bold uppercase tracking-wider text-stone-500 block">URL Gambar Produk</label>
          <div className="flex gap-2">
            <div className="relative flex-grow">
              <input
                id="gambar"
                type="url"
                value={gambarUrl}
                onChange={(e) => setGambarUrl(e.target.value)}
                placeholder="https://example.com/gambar-produk.jpg"
                className="w-full pl-10 pr-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-800"
              />
              <Image className="absolute left-3.5 top-3.5 h-4 w-4 text-stone-400" />
            </div>
          </div>
          <p className="text-[10px] text-stone-400 italic">
            *Owner memasukkan alamat URL gambar produk (menggunakan Unsplash / Cloud storage).
          </p>
        </div>

        {/* Status Aktif Switch */}
        <div className="flex items-center justify-between p-4 bg-stone-50 rounded-2xl border border-stone-200">
          <div>
            <span className="text-sm font-bold text-stone-900 block">Status Aktif Produk</span>
            <span className="text-xs text-stone-500">Tampilkan produk ini di etalase katalog publik</span>
          </div>
          <button
            type="button"
            onClick={() => setIsActive(!isActive)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              isActive ? 'bg-amber-900' : 'bg-stone-300'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                isActive ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Action Button */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full inline-flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-800 text-white font-bold py-3.5 px-4 rounded-xl transition duration-200 shadow-md disabled:bg-stone-200 disabled:text-stone-400"
        >
          <Save className="h-4 w-4" />
          <span>{submitting ? 'Menyimpan...' : 'Simpan Informasi Produk'}</span>
        </button>
      </form>
    </div>
  );
};
export default ProductFormPage;
