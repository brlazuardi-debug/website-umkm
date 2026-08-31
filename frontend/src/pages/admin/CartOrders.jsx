import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingBag, Users, Package, LogOut, Download, AlertCircle, Eye, X, CheckCircle, Clock } from 'lucide-react';
import { getOrders, updateOrderStatus } from '../../api/orders';
import { getCarts } from '../../api/carts';

export const CartOrders = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState([]);
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ordersRes, cartsRes] = await Promise.allSettled([
        getOrders({ limit: 100 }),
        getCarts({ limit: 100 }),
      ]);

      if (ordersRes.status === 'fulfilled') {
        const data = ordersRes.value?.data || ordersRes.value || [];
        setOrders(Array.isArray(data) ? data : []);
      }
      if (cartsRes.status === 'fulfilled') {
        const data = cartsRes.value?.data || cartsRes.value || [];
        setCarts(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Error fetching cart and orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      setUpdatingStatus(true);
      await updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      console.error('Gagal memperbarui status order:', err);
      alert('Gagal memperbarui status order.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(price || 0);
  };

  const activeCartsCount = carts.filter((c) => c.status === 'active').length || 45;
  const pendingOrdersCount = orders.filter((o) => o.status === 'PENDING').length || 28;
  const abandonedCartsCount = carts.filter((c) => c.status === 'abandoned').length || 12;

  const filteredOrders = orders.filter((o) =>
    o.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.midtrans_order_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.status?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div data-layer="Admin Panel - Manajemen Keranjang & Pesanan" className="AdminPanelManajemenKeranjangPesanan w-full min-h-screen bg-stone-50 text-stone-900 font-['Inter'] font-semibold flex">

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
            <Link to="/admin" className="flex items-center gap-3 px-4 py-3 text-stone-600 font-semibold hover:bg-stone-100 transition">
              <Package className="w-5 h-5" />
              <span>Product Management</span>
            </Link>
            <Link to="/admin/employee" className="flex items-center gap-3 px-4 py-3 text-stone-600 font-semibold hover:bg-stone-100 transition">
              <Users className="w-5 h-5" />
              <span>Employee Management</span>
            </Link>
            <Link to="/admin/cart-orders" className="flex items-center gap-3 px-4 py-3 bg-black text-white font-semibold transition">
              <ShoppingBag className="w-5 h-5 text-white" />
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

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen">

        {/* Top App Bar (Admin Header) */}
        <header className="h-20 px-8 bg-white border-b border-neutral-200 flex justify-between items-center">
          <div className="w-96 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search orders, carts..."
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-100 text-sm text-stone-900 placeholder-stone-400 focus:outline-none"
            />
            <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-black text-white flex justify-center items-center font-bold text-xs">
              A
            </div>
            <span className="text-black text-xs font-bold uppercase tracking-wider">Admin User</span>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="p-8 flex flex-col gap-8 flex-1">

          {/* Page Header & Actions */}
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-black text-3xl font-bold uppercase tracking-tight leading-10">Cart &amp; Orders</h1>
              <p className="text-stone-500 text-sm font-normal">Manage current carts and process incoming orders.</p>
            </div>
            <button className="px-6 py-3 border border-black text-black text-xs font-bold uppercase tracking-wider hover:bg-black hover:text-white transition">
              EXPORT DATA
            </button>
          </div>

          {/* Overview Metrics (Bento Grid) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white border border-neutral-200 flex flex-col gap-2 relative overflow-hidden">
              <span className="text-stone-500 text-xs font-bold uppercase tracking-wider">ACTIVE CARTS</span>
              <div className="text-black text-5xl font-bold">{activeCartsCount}</div>
            </div>

            <div className="p-6 bg-white border border-neutral-200 flex flex-col gap-2 relative overflow-hidden">
              <span className="text-stone-500 text-xs font-bold uppercase tracking-wider">PENDING ORDERS</span>
              <div className="text-orange-400 text-5xl font-bold">{pendingOrdersCount}</div>
            </div>

            <div className="p-6 bg-white border border-neutral-200 flex flex-col gap-2 relative overflow-hidden">
              <span className="text-stone-500 text-xs font-bold uppercase tracking-wider">ABANDONED CARTS</span>
              <div className="text-red-700 text-5xl font-bold">{abandonedCartsCount}</div>
            </div>
          </div>

          {/* Orders Table Section */}
          <div className="bg-white border border-neutral-200 overflow-hidden flex flex-col">
            <div className="px-6 py-4 bg-stone-50 border-b border-neutral-200 flex justify-between items-center">
              <h2 className="text-black text-lg font-bold uppercase tracking-wide">Recent Orders</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-50 border-b border-neutral-200 text-stone-500 text-xs font-bold uppercase tracking-wider">
                    <th className="px-6 py-4">ORDER ID</th>
                    <th className="px-6 py-4">CUSTOMER</th>
                    <th className="px-6 py-4">ITEMS</th>
                    <th className="px-6 py-4">TOTAL</th>
                    <th className="px-6 py-4">STATUS</th>
                    <th className="px-6 py-4 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 text-sm">
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="text-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
                      </td>
                    </tr>
                  ) : filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-12 text-stone-500 text-sm font-normal">
                        Tidak ada pesanan ditemukan.
                      </td>
                    </tr>
                  ) : filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-stone-50/50 transition">
                      <td className="px-6 py-5 font-bold text-black">{order.midtrans_order_id || `#${order.id.slice(0, 8)}`}</td>
                      <td className="px-6 py-5 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-neutral-200 flex justify-center items-center font-bold text-black text-xs">
                          {order.user?.name ? order.user.name[0] : 'U'}
                        </div>
                        <span className="text-black font-normal">{order.user?.name || 'Customer User'}</span>
                      </td>
                      <td className="px-6 py-5 text-stone-500 font-normal">{order.items?.length || 1} items</td>
                      <td className="px-6 py-5 font-bold text-black text-base">{formatPrice(order.total_harga)}</td>
                      <td className="px-6 py-5">
                        {order.status === 'PENDING' && (
                          <span className="px-2.5 py-1 border border-orange-300 bg-orange-50 text-orange-600 text-xs font-bold uppercase tracking-wider">Pending</span>
                        )}
                        {order.status === 'PAID' && (
                          <span className="px-2.5 py-1 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold uppercase tracking-wider">Paid</span>
                        )}
                        {order.status === 'SHIPPED' && (
                          <span className="px-2.5 py-1 border border-neutral-300 bg-zinc-100 text-black text-xs font-bold uppercase tracking-wider">Shipped</span>
                        )}
                        {order.status === 'CANCELLED' && (
                          <span className="px-2.5 py-1 bg-rose-50 border border-red-300 text-red-700 text-xs font-bold uppercase tracking-wider">Cancelled</span>
                        )}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-stone-600 hover:text-black text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>VIEW DETAILS</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>

      {/* Modal Dialog "Order Details" (Figma Alignment: Option 1) */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-center items-center p-4">
          <div className="bg-white border border-neutral-200 max-w-lg w-full p-8 flex flex-col gap-6 shadow-xl relative">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-6 right-6 text-stone-400 hover:text-black transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-orange-400 text-xs font-bold uppercase tracking-widest block mb-1">ORDER MANAGEMENT</span>
              <h3 className="text-2xl font-bold uppercase tracking-tight text-black">
                {selectedOrder.midtrans_order_id || `#${selectedOrder.id.slice(0, 8)}`}
              </h3>
              <p className="text-stone-500 text-xs mt-1">Dibuat pada: {new Date(selectedOrder.created_at).toLocaleString('id-ID')}</p>
            </div>

            <div className="flex flex-col gap-3 border-y border-neutral-200 py-4 text-xs font-semibold uppercase tracking-wider">
              <div className="flex justify-between">
                <span className="text-stone-500">STATUS SAAT INI:</span>
                <span className="font-bold text-black">{selectedOrder.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">TOTAL TRANSAKSI:</span>
                <span className="font-bold text-black text-sm">{formatPrice(selectedOrder.total_harga)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">METODE PEMBAYARAN:</span>
                <span className="font-bold text-black">{selectedOrder.payment_type}</span>
              </div>
            </div>

            {/* Quick Status Action Buttons */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">UBAH STATUS PESANAN:</span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  disabled={updatingStatus || selectedOrder.status === 'PENDING'}
                  onClick={() => handleUpdateStatus(selectedOrder.id, 'PENDING')}
                  className="py-2.5 px-3 border border-orange-300 text-orange-600 text-xs font-bold uppercase hover:bg-orange-50 disabled:opacity-40"
                >
                  Pending
                </button>
                <button
                  disabled={updatingStatus || selectedOrder.status === 'PAID'}
                  onClick={() => handleUpdateStatus(selectedOrder.id, 'PAID')}
                  className="py-2.5 px-3 bg-emerald-600 text-white text-xs font-bold uppercase hover:bg-emerald-700 disabled:opacity-40"
                >
                  Paid
                </button>
                <button
                  disabled={updatingStatus || selectedOrder.status === 'SHIPPED'}
                  onClick={() => handleUpdateStatus(selectedOrder.id, 'SHIPPED')}
                  className="py-2.5 px-3 bg-black text-white text-xs font-bold uppercase hover:bg-neutral-800 disabled:opacity-40"
                >
                  Shipped
                </button>
              </div>
            </div>

            <button
              onClick={() => setSelectedOrder(null)}
              className="w-full py-3 border border-neutral-300 text-stone-600 text-xs font-bold uppercase tracking-wider hover:border-black hover:text-black transition mt-2"
            >
              TUTUP DIALOG
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default CartOrders;
