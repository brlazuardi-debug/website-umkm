import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getProducts, deleteProduct } from '../../api/products';
import { Search, Plus, Edit3, Trash2, Package, Users, ShoppingBag, LogOut, Download } from 'lucide-react';

export const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const fetchAllProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts(100, 0, true);
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching admin products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus produk ini secara permanen?')) return;
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error('Gagal menghapus produk:', err);
      alert('Gagal menghapus produk.');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(price || 0);
  };

  const filteredProducts = products.filter((p) =>
    p.nama?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.kategori?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div data-layer="Admin Panel - Manajemen Produk" className="AdminPanelManajemenProduk w-full min-h-screen bg-stone-50 text-stone-900 font-['Inter'] font-semibold flex">

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

      {/* Main Canvas Area */}
      <main className="flex-1 flex flex-col min-h-screen">

        {/* Top App Bar */}
        <header className="h-20 px-8 bg-white border-b border-neutral-200 flex justify-between items-center shadow-xs">
          <div className="w-96 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, SKUs, or category..."
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

        {/* Content Area */}
        <div className="p-8 flex flex-col gap-10 flex-1">

          {/* Page Header & Actions */}
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-black text-3xl sm:text-4xl font-bold uppercase tracking-tight leading-tight">Product Management</h1>
              <p className="text-stone-500 text-sm font-normal mt-1">Overview and control of your active inventory catalog.</p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/admin/product/new"
                className="px-6 py-3 bg-black text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-neutral-800 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>NEW PRODUCT</span>
              </Link>
            </div>
          </div>

          {/* Overview Metrics (Bento Grid) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 bg-white border border-neutral-200 flex flex-col justify-between gap-4">
              <div className="flex justify-between items-center text-stone-500 text-xs font-bold uppercase tracking-wider">
                <span>TOTAL PRODUCTS</span>
                <Package className="w-4 h-4 text-black" />
              </div>
              <div className="text-black text-4xl font-bold">{products.length}</div>
            </div>

            <div className="p-6 bg-white border border-neutral-200 flex flex-col justify-between gap-4">
              <div className="flex justify-between items-center text-stone-500 text-xs font-bold uppercase tracking-wider">
                <span>LOW STOCK</span>
                <Package className="w-4 h-4 text-orange-400" />
              </div>
              <div className="text-black text-4xl font-bold">{products.filter((p) => p.stok <= 5).length}</div>
            </div>

            <div className="p-6 bg-white border border-neutral-200 flex flex-col justify-between gap-4">
              <div className="flex justify-between items-center text-stone-500 text-xs font-bold uppercase tracking-wider">
                <span>PENDING POS</span>
                <Package className="w-4 h-4 text-black" />
              </div>
              <div className="text-black text-4xl font-bold">18</div>
            </div>

            <div className="p-6 bg-white border border-neutral-200 flex flex-col justify-between gap-4">
              <div className="flex justify-between items-center text-stone-500 text-xs font-bold uppercase tracking-wider">
                <span>RETURNS/EXCHANGE</span>
                <Package className="w-4 h-4 text-red-700" />
              </div>
              <div className="text-black text-4xl font-bold">7</div>
            </div>
          </div>

          {/* Product Table */}
          <div className="bg-white border border-neutral-200 flex flex-col overflow-hidden">
            <div className="px-6 py-4 bg-stone-50 border-b border-neutral-200 flex justify-between items-center">
              <h2 className="text-black text-lg font-bold uppercase tracking-wide">Products List</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-50 border-b border-neutral-200 text-stone-500 text-xs font-bold uppercase tracking-wider">
                    <th className="pl-6 pr-4 py-4">PRODUCT</th>
                    <th className="p-4">SKU</th>
                    <th className="p-4">STATUS</th>
                    <th className="p-4 text-right">PRICE</th>
                    <th className="p-4 text-right">STOCK</th>
                    <th className="pl-4 pr-6 py-4 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 text-sm">
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="text-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
                      </td>
                    </tr>
                  ) : filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-12 text-stone-500 text-sm font-normal">
                        Belum ada data produk terdaftar.
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-stone-50/50 transition">
                        <td className="pl-6 pr-4 py-4 flex items-center gap-4">
                          <div className="w-14 h-16 bg-zinc-100 overflow-hidden shrink-0 border border-neutral-200">
                            <img
                              src={p.gambar_url || 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800'}
                              alt={p.nama}
                              className="w-full h-full object-cover grayscale contrast-115"
                            />
                          </div>
                          <div>
                            <div className="text-black font-bold uppercase text-sm">{p.nama}</div>
                            <div className="text-stone-500 text-xs uppercase">{p.kategori || 'Apparel'}</div>
                          </div>
                        </td>
                        <td className="p-4 text-stone-500 font-mono text-xs">SKU-{p.id.slice(0, 6)}</td>
                        <td className="p-4">
                          {p.stok <= 3 ? (
                            <span className="px-2.5 py-1 bg-orange-50 border border-orange-300 text-orange-600 text-xs font-bold uppercase tracking-wider">
                              Low Stock
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 bg-zinc-100 border border-neutral-300 text-black text-xs font-bold uppercase tracking-wider">
                              Published
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-right font-bold text-black text-sm">{formatPrice(p.harga)}</td>
                        <td className="p-4 text-right font-bold text-black text-sm">{p.stok}</td>
                        <td className="pl-4 pr-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Link
                              to={`/admin/product/${p.id}/edit`}
                              className="px-3 py-1.5 border border-neutral-300 text-stone-600 hover:text-black hover:border-black text-xs font-bold uppercase flex items-center gap-1 transition"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </Link>
                            <button
                              onClick={() => handleDelete(p.id)}
                              className="px-3 py-1.5 border border-rose-200 text-red-700 hover:bg-red-50 text-xs font-bold uppercase flex items-center gap-1 transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>

    </div>
  );
};

export default ProductManagement;
