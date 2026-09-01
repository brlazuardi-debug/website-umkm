import React, { useEffect, useState } from 'react';
import { getMyProfile, updateMyProfile } from '../../api/users';
import { Save } from 'lucide-react';

export const ProfilePage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('STAFF');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const profile = await getMyProfile();
        setName(profile.name || '');
        setEmail(profile.email || '');
        setRole(profile.role || 'STAFF');
      } catch (err) {
        console.error('Gagal memuat profil:', err);
        setError('Gagal memuat profil akun.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      setMessage(null);
      await updateMyProfile({ name });
      setMessage('Profil Anda berhasil diperbarui.');
    } catch (err) {
      console.error('Gagal menyimpan profil:', err);
      setError('Gagal menyimpan perubahan profil.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32 bg-stone-50 min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-['Inter'] font-normal py-12 px-6">
      <div className="max-w-xl mx-auto flex flex-col gap-8">
        <div>
          <span className="text-amber-600 text-xs font-bold uppercase tracking-widest block mb-1">ACCOUNT SETTINGS</span>
          <h1 className="text-3xl font-bold uppercase tracking-tight text-black">
            PROFIL PENGGUNA
          </h1>
          <p className="text-stone-500 text-sm font-normal mt-1">
            Kelola informasi data akun dan kredensial akses Anda.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-neutral-200 p-8 flex flex-col gap-6 shadow-xs"
        >
          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-xs font-bold uppercase tracking-wider border border-red-200">
              {error}
            </div>
          )}
          {message && (
            <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider border border-emerald-200">
              {message}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label htmlFor="nama" className="text-xs font-bold uppercase tracking-wider text-stone-600">
              Nama Lengkap
            </label>
            <input
              id="nama"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Nama Lengkap"
              className="w-full py-2.5 px-3 bg-zinc-50 border border-neutral-300 text-sm text-black focus:outline-none focus:border-black"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-stone-600">
              Email Terdaftar
            </label>
            <input
              id="email"
              type="email"
              value={email}
              disabled
              className="w-full py-2.5 px-3 bg-neutral-100 border border-neutral-300 text-stone-500 text-sm cursor-not-allowed"
            />
            <p className="text-[10px] text-stone-400 font-normal">Sinkronisasi langsung melalui autentikasi Clerk.</p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-600">
              Hak Akses / Role
            </label>
            <div className="flex items-center gap-2 py-2">
              <span className="px-3 py-1 bg-black text-white text-xs font-bold uppercase tracking-wider">
                {role}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3.5 bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-widest transition flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'MENYIMPAN...' : 'SIMPAN PERUBAHAN'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
