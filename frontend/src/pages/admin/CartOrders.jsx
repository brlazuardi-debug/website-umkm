import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingBag, Users, Package, LogOut, Download, AlertCircle } from 'lucide-react';

export const CartOrders = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const orders = [
    { id: '#ORD-0091', customer: 'Elena R.', initial: 'E', items: 3, total: 1250000, status: 'Pending' },
    { id: '#ORD-0090', customer: 'Marcus D.', initial: 'M', items: 1, total: 450000, status: 'Paid' },
    { id: '#ORD-0089', customer: 'Sarah J.', initial: 'S', items: 5, total: 3100000, status: 'Shipped' },
    { id: '#CART-012', customer: 'Unknown (Guest)', initial: 'U', items: 2, total: 850000, status: 'Abandoned' },
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div data-layer="Admin Panel - Manajemen Keranjang & Pesanan" className="AdminPanelManajemenKeranjangPesanan w-full min-h-screen bg-stone-50 text-stone-900 font-semibold flex">

      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-neutral-200 min-h-screen flex flex-col justify-between p-6 shrink-0">
        <div className="flex flex-col gap-8">
          <div className="text-black text-2xl font-bold uppercase tracking-tight">
            VARCA BRAND
          </div>

          <nav className="flex flex-col gap-2">
            <span className="text-stone-500 text-xs font-semibold uppercase tracking-wider px-4 py-2">
              WORKSPACE
            </span>
            <Link to="/admin" className="flex items-center gap-3 px-4 py-3 text-zinc-400 font-semibold hover:bg-stone-100 rounded-lg transition">
              <Package className="w-5 h-5" />
              <span>Product Management</span>
            </Link>
            <Link to="/admin/employee" className="flex items-center gap-3 px-4 py-3 text-zinc-400 font-semibold hover:bg-stone-100 rounded-lg transition">
              <Users className="w-5 h-5" />
              <span>Employee Management</span>
            </Link>
            <Link to="/admin/cart-orders" className="flex items-center gap-3 px-4 py-3 bg-zinc-900 text-white font-semibold rounded-lg transition">
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
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-100 rounded-full text-sm text-stone-900 placeholder-gray-500 focus:outline-none"
            />
            <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-zinc-100 border border-neutral-200 flex justify-center items-center font-normal text-black">
              A
            </div>
            <span className="text-black text-xs font-semibold tracking-wide">Admin User</span>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="p-8 flex flex-col gap-8 flex-1">

          {/* Page Header & Actions */}
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-black text-3xl font-semibold leading-10">Cart &amp; Orders</h1>
              <p className="text-stone-500 text-base font-normal">Manage current carts and process pending orders.</p>
            </div>
            <button className="px-6 py-3 border border-black text-black text-xs font-semibold uppercase tracking-wide hover:bg-black hover:text-white transition">
              EXPORT DATA
            </button>
          </div>

          {/* Overview Metrics (Bento Grid) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-xl border border-neutral-200 flex flex-col gap-2 relative overflow-hidden">
              <span className="text-stone-500 text-base font-normal uppercase">ACTIVE CARTS</span>
              <div className="text-black text-5xl font-bold">45</div>
            </div>

            <div className="p-6 bg-white rounded-xl border border-neutral-200 flex flex-col gap-2 relative overflow-hidden">
              <span className="text-stone-500 text-base font-normal uppercase">PENDING ORDERS</span>
              <div className="text-orange-400 text-5xl font-bold">28</div>
            </div>

            <div className="p-6 bg-white rounded-xl border border-neutral-200 flex flex-col gap-2 relative overflow-hidden">
              <span className="text-stone-500 text-base font-normal uppercase">ABANDONED CARTS</span>
              <div className="text-red-700 text-5xl font-bold">12</div>
            </div>
          </div>

          {/* Orders Table Section */}
          <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden flex flex-col">
            <div className="px-6 py-4 bg-stone-50 border-b border-neutral-200 flex justify-between items-center">
              <h2 className="text-black text-2xl font-medium">Recent Orders</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-50 border-b border-neutral-200 text-stone-500 text-xs font-semibold uppercase tracking-wide">
                    <th className="px-6 py-4">ORDER ID</th>
                    <th className="px-6 py-4">CUSTOMER</th>
                    <th className="px-6 py-4">ITEMS</th>
                    <th className="px-6 py-4">TOTAL</th>
                    <th className="px-6 py-4">STATUS</th>
                    <th className="px-6 py-4 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 text-sm">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-stone-50/50 transition">
                      <td className="px-6 py-5 font-semibold text-black">{order.id}</td>
                      <td className="px-6 py-5 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-neutral-200 border border-neutral-200 flex justify-center items-center font-normal text-black">
                          {order.initial}
                        </div>
                        <span className="text-zinc-900 font-normal">{order.customer}</span>
                      </td>
                      <td className="px-6 py-5 text-stone-500">{order.items} items</td>
                      <td className="px-6 py-5 font-medium text-black text-xl">{formatPrice(order.total)}</td>
                      <td className="px-6 py-5">
                        {order.status === 'Pending' && (
                          <span className="px-2 py-1 rounded-sm border border-neutral-500 text-orange-400 text-xs font-semibold">Pending</span>
                        )}
                        {order.status === 'Paid' && (
                          <span className="px-2 py-1 rounded-sm bg-zinc-100 border border-neutral-500 text-black text-xs font-semibold">Paid</span>
                        )}
                        {order.status === 'Shipped' && (
                          <span className="px-2 py-1 rounded-sm border border-neutral-200 text-stone-500 text-xs font-semibold">Shipped</span>
                        )}
                        {order.status === 'Abandoned' && (
                          <span className="px-2 py-1 rounded-sm bg-rose-50 border border-red-700 text-red-700 text-xs font-semibold">Abandoned</span>
                        )}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button className="text-stone-500 hover:text-black text-xs font-semibold uppercase tracking-wide">
                          VIEW DETAILS
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

    </div>
  );
};

export default CartOrders;
