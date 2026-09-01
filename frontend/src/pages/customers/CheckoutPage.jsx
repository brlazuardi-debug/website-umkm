import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { useLanguage } from '../../context/LanguageContext';
import { createTransaction } from '../../api/transactions';
import { ArrowLeft, CreditCard, QrCode, Lock, CheckCircle } from 'lucide-react';

export const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
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
    if (e && e.preventDefault) e.preventDefault();
    if (!product) return;

    if (!email.trim() || !firstName.trim() || !lastName.trim() || !address.trim() || !city.trim() || !postalCode.trim()) {
      alert('Mohon lengkapi seluruh informasi kontak dan alamat pengiriman.');
      return;
    }

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
    <div data-layer="Checkout" className="Checkout w-full min-h-screen relative bg-stone-50 text-stone-900 font-['Inter'] font-normal">

      {/* Header - TopNavBar Transactional Intent */}
      <div className="w-full bg-white border-b border-neutral-200 py-4 px-6 sm:px-8 shadow-xs">
        <div className="max-w-[1280px] mx-auto flex justify-between items-center">
          <Link to="/products" className="flex items-center gap-2 text-stone-600 hover:text-black transition text-xs font-bold uppercase tracking-wider">
            <ArrowLeft className="w-4 h-4 text-black" />
            <span>{t.checkout.backToCatalog}</span>
          </Link>
          <div className="text-black text-2xl font-bold uppercase tracking-tight">
            VARCA BRAND
          </div>
          <div className="w-24"></div>
        </div>
      </div>

      <div className="w-full max-w-[1280px] mx-auto px-6 sm:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Left Column: 3 Form Sections (Customer Info, Shipping Address, Payment Method) */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            <div>
              <span className="text-amber-600 text-xs font-bold uppercase tracking-widest block mb-1">{t.checkout.badge}</span>
              <h1 className="text-3xl font-bold uppercase tracking-tight text-black">{t.checkout.title}</h1>
            </div>

            <form onSubmit={handlePayNow} className="flex flex-col gap-8">

              {/* 1. Customer Information */}
              <div className="flex flex-col gap-4 bg-white p-6 border border-neutral-200 shadow-xs">
                <div className="pb-3 border-b border-neutral-200 text-black text-base font-bold uppercase tracking-wide flex items-center justify-between">
                  <span>{t.checkout.customerInfo}</span>
                  <CheckCircle className="w-4 h-4 text-amber-600" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-stone-500 text-xs font-bold uppercase tracking-wide">{t.checkout.email}</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className="w-full py-2.5 px-3 bg-stone-50 border border-neutral-300 text-sm font-normal focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              {/* 2. Shipping Address */}
              <div className="flex flex-col gap-4 bg-white p-6 border border-neutral-200 shadow-xs">
                <div className="pb-3 border-b border-neutral-200 text-black text-base font-bold uppercase tracking-wide flex items-center justify-between">
                  <span>{t.checkout.shippingAddress}</span>
                  <CheckCircle className="w-4 h-4 text-amber-600" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-stone-500 text-xs font-bold uppercase tracking-wide">{t.checkout.firstName}</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      placeholder="Alexander"
                      className="w-full py-2.5 px-3 bg-stone-50 border border-neutral-300 text-sm font-normal focus:outline-none focus:border-black"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-stone-500 text-xs font-bold uppercase tracking-wide">{t.checkout.lastName}</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      placeholder="Wright"
                      className="w-full py-2.5 px-3 bg-stone-50 border border-neutral-300 text-sm font-normal focus:outline-none focus:border-black"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-stone-500 text-xs font-bold uppercase tracking-wide">{t.checkout.address}</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    placeholder="SCBD District 8, Senopati"
                    className="w-full py-2.5 px-3 bg-stone-50 border border-neutral-300 text-sm font-normal focus:outline-none focus:border-black"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-stone-500 text-xs font-bold uppercase tracking-wide">{t.checkout.apartment}</label>
                  <input
                    type="text"
                    value={apartment}
                    onChange={(e) => setApartment(e.target.value)}
                    placeholder="Tower Infinity, Suite 18A"
                    className="w-full py-2.5 px-3 bg-stone-50 border border-neutral-300 text-sm font-normal focus:outline-none focus:border-black"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-stone-500 text-xs font-bold uppercase tracking-wide">{t.checkout.city}</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                      placeholder="Jakarta Selatan"
                      className="w-full py-2.5 px-3 bg-stone-50 border border-neutral-300 text-sm font-normal focus:outline-none focus:border-black"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-stone-500 text-xs font-bold uppercase tracking-wide">{t.checkout.postalCode}</label>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      required
                      placeholder="12190"
                      className="w-full py-2.5 px-3 bg-stone-50 border border-neutral-300 text-sm font-normal focus:outline-none focus:border-black"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Payment Method */}
              <div className="flex flex-col gap-4 bg-white p-6 border border-neutral-200 shadow-xs">
                <div className="pb-3 border-b border-neutral-200 text-black text-base font-bold uppercase tracking-wide">
                  {t.checkout.paymentMethod}
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('QRIS')}
                    className={`px-6 py-3.5 border flex items-center gap-2.5 text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                      paymentMethod === 'QRIS'
                        ? 'bg-black text-white border-black font-bold scale-[1.02] shadow-xs'
                        : 'bg-white text-stone-500 border-neutral-300 font-normal hover:border-black hover:text-black hover:font-bold'
                    }`}
                  >
                    <QrCode className="w-4 h-4" />
                    <span>{t.checkout.qris}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Bank')}
                    className={`px-6 py-3.5 border flex items-center gap-2.5 text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                      paymentMethod === 'Bank'
                        ? 'bg-black text-white border-black font-bold scale-[1.02] shadow-xs'
                        : 'bg-white text-stone-500 border-neutral-300 font-normal hover:border-black hover:text-black hover:font-bold'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>{t.checkout.bankTransfer}</span>
                  </button>
                </div>
              </div>

            </form>
          </div>

          {/* 4. Right Column: Order Summary (5 cols) */}
          <div className="lg:col-span-5 p-8 bg-white border border-neutral-200 flex flex-col gap-6 h-fit shadow-xs">
            <div className="pb-4 border-b border-neutral-200 text-black text-lg font-bold uppercase tracking-tight">
              {t.checkout.orderSummary}
            </div>

            {/* Items List */}
            <div className="flex flex-col gap-4">
              {product ? (
                <div className="flex items-center gap-4">
                  <div className="w-20 h-24 bg-stone-100 border border-neutral-200 overflow-hidden shrink-0">
                    <img
                      src={product.gambar_url || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800'}
                      alt={product.nama}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <span className="text-[10px] text-amber-600 font-bold uppercase tracking-widest">{product.kategori || 'TOP'}</span>
                    <div className="text-black text-sm font-bold uppercase line-clamp-1">{product.nama}</div>
                    <div className="text-stone-500 text-xs font-normal">Qty: 1 Unit</div>
                    <div className="text-black text-sm font-bold mt-1">{formatPrice(product.harga)}</div>
                  </div>
                </div>
              ) : (
                <div className="text-stone-500 text-sm font-normal py-4">Belum ada item dipilih untuk checkout.</div>
              )}
            </div>

            {/* Totals */}
            <div className="pt-4 border-t border-neutral-200 flex flex-col gap-2.5 text-xs uppercase">
              <div className="flex justify-between items-center text-stone-500">
                <span className="font-normal">{t.checkout.subtotal}</span>
                <span className="font-bold text-black">{product ? formatPrice(product.harga) : 'Rp 0'}</span>
              </div>
              <div className="flex justify-between items-center text-stone-500">
                <span className="font-normal">{t.checkout.shipping}</span>
                <span className="font-bold text-emerald-700">{t.checkout.shippingFree}</span>
              </div>
              <div className="flex justify-between items-center text-stone-500">
                <span className="font-normal">{t.checkout.method}</span>
                <span className="font-bold text-black">{paymentMethod}</span>
              </div>
              <div className="pt-3 border-t border-neutral-200 flex justify-between items-center text-black text-base font-bold">
                <span>{t.checkout.total}</span>
                <span className="text-lg">{product ? formatPrice(product.harga) : 'Rp 0'}</span>
              </div>
            </div>

            {/* Payment Action */}
            <div className="flex flex-col gap-3 pt-2">
              <button
                type="button"
                onClick={handlePayNow}
                disabled={submitting || !product}
                className="w-full py-4 bg-black text-white text-xs font-bold uppercase tracking-widest text-center hover:bg-neutral-800 transition disabled:opacity-50 cursor-pointer shadow-md"
              >
                {submitting ? t.checkout.processing : t.checkout.payNow}
              </button>
              <div className="flex justify-center items-center gap-2 text-stone-400 text-[10px] font-bold uppercase tracking-wider">
                <Lock className="w-3.5 h-3.5" />
                <span>{t.checkout.secureCheckout}</span>
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
};

export default CheckoutPage;
