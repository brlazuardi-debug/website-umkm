import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { createTransaction } from '../../api/transactions';
import { ShieldCheck, ArrowLeft, CreditCard, QrCode, Lock } from 'lucide-react';

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
    }).format(price);
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
    <div data-layer="Checkout" className="Checkout w-full min-h-screen relative bg-stone-50 text-stone-900 font-semibold">

      {/* Header - TopNavBar Transactional Intent */}
      <div className="w-full bg-stone-50 border-b border-neutral-200 py-4 px-6 sm:px-8 shadow-xs">
        <div className="max-w-[1280px] mx-auto flex justify-between items-center">
          <Link to="/products" className="flex items-center gap-2 text-stone-700 hover:text-black transition">
            <ArrowLeft className="w-4 h-4 text-black" />
            <span className="text-base font-normal">Back to Cart</span>
          </Link>
          <div className="text-black text-2xl font-bold uppercase tracking-tight">
            VARCA BRAND
          </div>
          <div className="w-24"></div> {/* spacer for centering */}
        </div>
      </div>

      <div data-layer="Main" className="Main w-full max-w-[1280px] mx-auto px-6 sm:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Left Column: Form (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            <h1 className="text-zinc-900 text-3xl font-semibold leading-10">Checkout</h1>

            <form onSubmit={handlePayNow} className="flex flex-col gap-8">

              {/* Customer Information */}
              <div className="flex flex-col gap-6">
                <div className="pb-4 border-b border-neutral-200 text-zinc-900 text-2xl font-medium">
                  Customer Information
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-stone-500 text-xs font-semibold uppercase tracking-wide">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className="w-full py-2.5 bg-transparent border-b border-stone-500 text-base font-normal focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              {/* Shipping Address */}
              <div className="flex flex-col gap-6 pt-4">
                <div className="pb-4 border-b border-neutral-200 text-zinc-900 text-2xl font-medium">
                  Shipping Address
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-1">
                    <label className="text-stone-500 text-xs font-semibold uppercase tracking-wide">First Name</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      placeholder="John"
                      className="w-full py-2.5 bg-transparent border-b border-stone-500 text-base font-normal focus:outline-none focus:border-black"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-stone-500 text-xs font-semibold uppercase tracking-wide">Last Name</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      placeholder="Doe"
                      className="w-full py-2.5 bg-transparent border-b border-stone-500 text-base font-normal focus:outline-none focus:border-black"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-stone-500 text-xs font-semibold uppercase tracking-wide">Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    placeholder="Jl. Utama No. 123"
                    className="w-full py-2.5 bg-transparent border-b border-stone-500 text-base font-normal focus:outline-none focus:border-black"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-stone-500 text-xs font-semibold uppercase tracking-wide">Apartment, suite, etc. (optional)</label>
                  <input
                    type="text"
                    value={apartment}
                    onChange={(e) => setApartment(e.target.value)}
                    placeholder="Apt 4B"
                    className="w-full py-2.5 bg-transparent border-b border-stone-500 text-base font-normal focus:outline-none focus:border-black"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-1">
                    <label className="text-stone-500 text-xs font-semibold uppercase tracking-wide">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                      placeholder="Jakarta"
                      className="w-full py-2.5 bg-transparent border-b border-stone-500 text-base font-normal focus:outline-none focus:border-black"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-stone-500 text-xs font-semibold uppercase tracking-wide">Postal Code</label>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      required
                      placeholder="12345"
                      className="w-full py-2.5 bg-transparent border-b border-stone-500 text-base font-normal focus:outline-none focus:border-black"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="flex flex-col gap-6 pt-4">
                <div className="text-zinc-900 text-2xl font-medium">Payment Method</div>
                <div className="flex flex-wrap gap-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('QRIS')}
                    className={`px-6 py-3 rounded-sm border flex items-center gap-2 font-normal transition ${
                      paymentMethod === 'QRIS'
                        ? 'bg-black text-white border-black'
                        : 'bg-stone-50 text-zinc-900 border-zinc-400'
                    }`}
                  >
                    <QrCode className="w-5 h-5" />
                    <span>QRIS</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Bank')}
                    className={`px-6 py-3 rounded-sm border flex items-center gap-2 font-normal transition ${
                      paymentMethod === 'Bank'
                        ? 'bg-black text-white border-black'
                        : 'bg-stone-50 text-neutral-400 border-zinc-400'
                    }`}
                  >
                    <CreditCard className="w-5 h-5" />
                    <span>Bank Lainnya</span>
                  </button>
                </div>
              </div>

            </form>
          </div>

          {/* Right Column: Order Summary (5 cols) */}
          <div className="lg:col-span-5 p-8 bg-white rounded-lg shadow-sm border border-neutral-100 flex flex-col gap-8 h-fit">
            <div className="pb-4 border-b border-neutral-200 text-zinc-900 text-2xl font-medium">
              Order Summary
            </div>

            {/* Items List */}
            <div className="flex flex-col gap-6">
              {product ? (
                <div className="flex items-center gap-4">
                  <div className="w-20 h-24 bg-zinc-300 rounded-sm overflow-hidden shrink-0">
                    <img src={product.gambar_url || 'https://placehold.co/80x374'} alt={product.nama} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="text-black text-base font-semibold">{product.nama}</div>
                    <div className="text-stone-500 text-xs font-semibold">Qty: 1</div>
                  </div>
                  <div className="text-black text-xl font-medium">{formatPrice(product.harga)}</div>
                </div>
              ) : (
                <div className="text-stone-500 text-sm">Tidak ada produk dipilih.</div>
              )}
            </div>

            {/* Totals */}
            <div className="pt-6 border-t border-neutral-200 flex flex-col gap-3">
              <div className="flex justify-between items-center text-stone-500 text-base">
                <span>Subtotal</span>
                <span>{product ? formatPrice(product.harga) : 'Rp 0'}</span>
              </div>
              <div className="flex justify-between items-center text-stone-500 text-base">
                <span>Payment Method</span>
                <span>{paymentMethod}</span>
              </div>
              <div className="pt-4 border-t border-neutral-200 flex justify-between items-center text-black text-2xl font-medium">
                <span>Total</span>
                <span>{product ? formatPrice(product.harga) : 'Rp 0'}</span>
              </div>
            </div>

            {/* Payment Action */}
            <div className="flex flex-col gap-4">
              <button
                type="button"
                onClick={handlePayNow}
                disabled={submitting || !product}
                className="w-full px-6 py-4 bg-black text-white text-xs font-semibold uppercase tracking-wide text-center hover:bg-neutral-800 transition disabled:opacity-50"
              >
                {submitting ? 'MEMPROSES...' : 'BAYAR SEKARANG'}
              </button>
              <div className="flex justify-center items-center gap-2 text-stone-500 text-xs font-semibold">
                <Lock className="w-3.5 h-3.5" />
                <span>Secure encrypted checkout</span>
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
};

export default CheckoutPage;
