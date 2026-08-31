import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { createTransaction } from '../../api/transactions';
import { ArrowLeft, CreditCard, QrCode, Lock } from 'lucide-react';

export const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const product = location.state?.product || null;

  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('QRIS');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setEmail(user.primaryEmailAddress?.emailAddress || '');
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
    }
  }, [user]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(price || 0);
  };

  const handlePayNow = async (e) => {
    e.preventDefault();
    if (!product) return;
    try {
      setSubmitting(true);
      const tx = await createTransaction({
        total_harga: product.harga,
        payment_type: paymentMethod.toLowerCase(),
      });
      navigate(`/order-status/${tx.id || 1}`);
    } catch (err) {
      console.error('Gagal membuat transaksi:', err);
      alert('Gagal memproses pembayaran. Coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div data-layer="Checkout" className="Checkout w-full min-h-screen relative bg-stone-50 text-stone-900 font-['Inter'] font-semibold">

      {/* Header - TopNavBar Transactional Intent */}
      <div className="w-full bg-white border-b border-neutral-200 py-4 px-6 sm:px-8 shadow-xs">
        <div className="max-w-[1280px] mx-auto flex justify-between items-center">
          <Link to="/products" className="flex items-center gap-2 text-stone-600 hover:text-black transition text-xs font-bold uppercase tracking-wider">
            <ArrowLeft className="w-4 h-4 text-black" />
            <span>KEMBALI KE KATALOG</span>
          </Link>
          <div className="text-black text-2xl font-bold uppercase tracking-tight">
            VARCA BRAND
          </div>
          <div className="w-24"></div>
        </div>
      </div>

      <div className="w-full max-w-[1280px] mx-auto px-6 sm:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Left Column: Form (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            <div>
              <span className="text-orange-400 text-xs font-bold uppercase tracking-widest block mb-1">TRANSACTION CHECKOUT</span>
              <h1 className="text-3xl font-bold uppercase tracking-tight text-black">CHECKOUT PESANAN</h1>
            </div>

            <form onSubmit={handlePayNow} className="flex flex-col gap-8">

              {/* Customer Information */}
              <div className="flex flex-col gap-4">
                <div className="pb-3 border-b border-neutral-200 text-black text-lg font-bold uppercase tracking-wide">
                  1. Informasi Kontak
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-stone-500 text-xs font-bold uppercase tracking-wide">Alamat Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className="w-full py-2.5 bg-transparent border-b border-neutral-400 text-sm font-medium focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              {/* Shipping Address */}
              <div className="flex flex-col gap-4 pt-2">
                <div className="pb-3 border-b border-neutral-200 text-black text-lg font-bold uppercase tracking-wide">
                  2. Alamat Pengiriman
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-1">
                    <label className="text-stone-500 text-xs font-bold uppercase tracking-wide">Nama Depan</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      placeholder="Elena"
                      className="w-full py-2.5 bg-transparent border-b border-neutral-400 text-sm font-medium focus:outline-none focus:border-black"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-stone-500 text-xs font-bold uppercase tracking-wide">Nama Belakang</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      placeholder="Rostova"
                      className="w-full py-2.5 bg-transparent border-b border-neutral-400 text-sm font-medium focus:outline-none focus:border-black"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-stone-500 text-xs font-bold uppercase tracking-wide">Alamat Lengkap</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    placeholder="Jl. Senopati No. 88, Kebayoran Baru"
                    className="w-full py-2.5 bg-transparent border-b border-neutral-400 text-sm font-medium focus:outline-none focus:border-black"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-stone-500 text-xs font-bold uppercase tracking-wide">Apartemen / Suite (Opsional)</label>
                  <input
                    type="text"
                    value={apartment}
                    onChange={(e) => setApartment(e.target.value)}
                    placeholder="Tower B, Lt. 12"
                    className="w-full py-2.5 bg-transparent border-b border-neutral-400 text-sm font-medium focus:outline-none focus:border-black"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-1">
                    <label className="text-stone-500 text-xs font-bold uppercase tracking-wide">Kota / Wilayah</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                      placeholder="Jakarta Selatan"
                      className="w-full py-2.5 bg-transparent border-b border-neutral-400 text-sm font-medium focus:outline-none focus:border-black"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-stone-500 text-xs font-bold uppercase tracking-wide">Kode Pos</label>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      required
                      placeholder="12190"
                      className="w-full py-2.5 bg-transparent border-b border-neutral-400 text-sm font-medium focus:outline-none focus:border-black"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="flex flex-col gap-4 pt-2">
                <div className="pb-3 border-b border-neutral-200 text-black text-lg font-bold uppercase tracking-wide">
                  3. Metode Pembayaran
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('QRIS')}
                    className={`px-6 py-3 border flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider transition ${
                      paymentMethod === 'QRIS'
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-stone-700 border-neutral-300 hover:border-black'
                    }`}
                  >
                    <QrCode className="w-4 h-4" />
                    <span>QRIS (Instant Verification)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Bank')}
                    className={`px-6 py-3 border flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider transition ${
                      paymentMethod === 'Bank'
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-stone-700 border-neutral-300 hover:border-black'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Transfer Bank / VA</span>
                  </button>
                </div>
              </div>

            </form>
          </div>

          {/* Right Column: Order Summary (5 cols) */}
          <div className="lg:col-span-5 p-8 bg-white border border-neutral-200 flex flex-col gap-6 h-fit shadow-xs">
            <div className="pb-4 border-b border-neutral-200 text-black text-lg font-bold uppercase tracking-tight">
              RINGKASAN PESANAN
            </div>

            {/* Items List */}
            <div className="flex flex-col gap-4">
              {product ? (
                <div className="flex items-center gap-4">
                  <div className="w-20 h-24 bg-zinc-100 border border-neutral-200 overflow-hidden shrink-0">
                    <img
                      src={product.gambar_url || 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800'}
                      alt={product.nama}
                      className="w-full h-full object-cover grayscale contrast-115"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="text-black text-sm font-bold uppercase line-clamp-1">{product.nama}</div>
                    <div className="text-stone-500 text-xs font-medium">Qty: 1 Unit</div>
                    <div className="text-black text-sm font-bold mt-1">{formatPrice(product.harga)}</div>
                  </div>
                </div>
              ) : (
                <div className="text-stone-500 text-sm font-normal py-4">Belum ada item dipilih untuk checkout.</div>
              )}
            </div>

            {/* Totals */}
            <div className="pt-4 border-t border-neutral-200 flex flex-col gap-2.5 text-xs uppercase font-semibold">
              <div className="flex justify-between items-center text-stone-500">
                <span>SUBTOTAL</span>
                <span className="font-bold text-black">{product ? formatPrice(product.harga) : 'Rp 0'}</span>
              </div>
              <div className="flex justify-between items-center text-stone-500">
                <span>PENGIRIMAN</span>
                <span className="font-bold text-emerald-700">GRATIS (COMPLIMENTARY)</span>
              </div>
              <div className="flex justify-between items-center text-stone-500">
                <span>METODE BAYAR</span>
                <span className="font-bold text-black">{paymentMethod}</span>
              </div>
              <div className="pt-3 border-t border-neutral-200 flex justify-between items-center text-black text-base font-bold">
                <span>TOTAL</span>
                <span className="text-lg">{product ? formatPrice(product.harga) : 'Rp 0'}</span>
              </div>
            </div>

            {/* Payment Action */}
            <div className="flex flex-col gap-3 pt-2">
              <button
                type="button"
                onClick={handlePayNow}
                disabled={submitting || !product}
                className="w-full py-4 bg-black text-white text-xs font-bold uppercase tracking-widest text-center hover:bg-neutral-800 transition disabled:opacity-50"
              >
                {submitting ? 'MEMPROSES TRANSAKSI...' : 'BAYAR SEKARANG'}
              </button>
              <div className="flex justify-center items-center gap-2 text-stone-400 text-[10px] font-bold uppercase tracking-wider">
                <Lock className="w-3.5 h-3.5" />
                <span>256-Bit Encrypted Secure Checkout</span>
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
};

export default CheckoutPage;
