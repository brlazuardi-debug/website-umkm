import React, { useEffect, useState } from 'react';
import { getMyProfile, updateMyProfile } from '../../api/users';
import { Save } from 'lucide-react';

export const ProfilePage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  // AUTH-3: muat profil user login dari GET /users/me
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const profile = await getMyProfile();
        setName(profile.name || '');
        setEmail(profile.email || '');
      } catch (err) {
        console.error('Gagal memuat profil:', err);
        setError('Gagal memuat profil. Coba lagi nanti.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // AUTH-4: simpan perubahan nama via PATCH /users/me
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      setMessage(null);
      await updateMyProfile({ name });
      setMessage('Profil berhasil diperbarui.');
    } catch (err) {
      console.error('Gagal menyimpan profil:', err);
      setError('Gagal menyimpan profil. Coba lagi.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-950"></div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="font-serif text-3xl font-bold text-stone-900 mb-2">Profil Saya</h1>
      <p className="text-stone-500 text-sm mb-6">Perbarui informasi akun Anda.</p>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 space-y-5"
      >
        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-xl border border-red-100 text-sm">
            {error}
          </div>
        )}
        {message && (
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 text-sm">
            {message}
          </div>
        )}

        <div>
          <label htmlFor="nama" className="block text-sm font-semibold text-stone-700 mb-1.5">
            Nama Lengkap
          </label>
          <input
            id="nama"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Nama Anda"
            className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-800/30 focus:border-amber-800 transition"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-stone-700 mb-1.5">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            disabled
            className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-400 text-sm cursor-not-allowed"
          />
          <p className="text-xs text-stone-400 mt-1">Email dikelola melalui akun login Anda.</p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full inline-flex items-center justify-center gap-2 bg-amber-900 hover:bg-amber-800 disabled:bg-stone-300 text-white font-semibold text-sm py-3 rounded-xl transition duration-200 shadow-sm"
        >
          <Save className="h-4 w-4" />
          <span>{saving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;
