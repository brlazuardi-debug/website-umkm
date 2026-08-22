import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, deleteProduct } from '../../api/products';
import { Search, Plus, Edit3, Trash2, Package, Users, ShoppingBag, LogOut, Download } from 'lucide-react';

export const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchAllProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts(100, 0, true);
      setProducts(data);
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
    if (!window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) return;
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error('Gagal menghapus produk:', err);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.nama?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.kategori?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div data-layer="Admin Panel - Manajemen Produk" className="AdminPanelManajemenProduk w-full min-h-screen bg-stone-50 text-stone-900 font-semibold flex">

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
            <Link to="/admin" className="flex items-center gap-3 px-4 py-3 bg-zinc-900 text-white font-semibold rounded-lg transition">
              <Package className="w-5 h-5 text-white" />
              <span>Product Management</span>
            </Link>
            <Link to="/admin/employee" className="flex items-center gap-3 px-4 py-3 text-zinc-400 font-semibold hover:bg-stone-100 rounded-lg transition">
              <Users className="w-5 h-5" />
              <span>Employee Management</span>
            </Link>
            <Link to="/admin/cart-orders" className="flex items-center gap-3 px-4 py-3 text-zinc-400 font-semibold hover:bg-stone-100 rounded-lg transition">
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
              placeholder="Search products, SKUs, or orders..."
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

        {/* Content Area */}
        <div className="p-8 flex flex-col gap-12 flex-1">

          {/* Page Header & Actions */}
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-black text-4xl sm:text-5xl font-bold leading-tight">Product Management</h1>
              <p className="text-stone-500 text-lg font-normal mt-2">Overview and control of your inventory.</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="px-6 py-3 border border-black text-black text-xs font-semibold uppercase tracking-wider flex items-center gap-2 hover:bg-stone-100 transition">
                <Download className="w-3.5 h-3.5" />
                <span>EXPORT REPORT</span>
              </button>
              <Link to="/admin/product/new" className="px-6 py-3 bg-black text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 hover:bg-neutral-800 transition">
                <Plus className="w-3.5 h-3.5" />
                <span>NEW PRODUCT</span>
              </Link>
            </div>
          </div>

          {/* Overview Metrics (Bento Grid) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 bg-white rounded-lg border border-neutral-200 shadow-xs flex flex-col justify-between gap-4">
              <div className="flex justify-between items-center text-stone-500 text-xs font-semibold uppercase tracking-wider">
                <span>TOTAL PRODUCTS</span>
                <div className="p-2 bg-stone-50 rounded-full"><Package className="w-5 h-5 text-black" /></div>
              </div>
              <div className="text-black text-5xl font-bold">{products.length}</div>
            </div>

            <div className="p-6 bg-white rounded-lg border border-neutral-200 shadow-xs flex flex-col justify-between gap-4">
              <div className="flex justify-between items-center text-stone-500 text-xs font-semibold uppercase tracking-wider">
                <span>LOW STOCK</span>
                <div className="p-2 bg-stone-50 rounded-full"><Package className="w-5 h-5 text-orange-400" /></div>
              </div>
              <div className="text-black text-5xl font-bold">{products.filter((p) => p.stok <= 5).length}</div>
            </div>

            <div className="p-6 bg-white rounded-lg border border-neutral-200 shadow-xs flex flex-col justify-between gap-4">
              <div className="flex justify-between items-center text-stone-500 text-xs font-semibold uppercase tracking-wider">
                <span>PENDING POS</span>
                <div className="p-2 bg-stone-50 rounded-full"><Package className="w-5 h-5 text-black" /></div>
              </div>
              <div className="text-black text-5xl font-bold">18</div>
            </div>

            <div className="p-6 bg-white rounded-lg border border-neutral-200 shadow-xs flex flex-col justify-between gap-4">
              <div className="flex justify-between items-center text-stone-500 text-xs font-semibold uppercase tracking-wider">
                <span>RETURNS/EXCHANGE</span>
                <div className="p-2 bg-stone-50 rounded-full"><Package className="w-5 h-5 text-red-700" /></div>
              </div>
              <div className="text-black text-5xl font-bold">7</div>
            </div>
          </div>

          {/* Product Table */}
          <div className="bg-white rounded-lg border border-neutral-200 shadow-xs flex flex-col overflow-hidden">
            <div className="px-6 py-5 bg-white border-b border-neutral-200 flex justify-between items-center">
              <h2 className="text-black text-2xl font-medium">Products List</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-50 border-b border-neutral-200 text-stone-500 text-xs font-semibold uppercase tracking-wider">
                    <th className="pl-6 pr-4 py-4">PRODUCT</th>
                    <th className="p-4">SKU</th>
                    <th className="p-4">STATUS</th>
                    <th className="p-4 text-right">STOCK</th>
                    <th className="pl-4 pr-6 py-4 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 text-sm">
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="text-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
                      </td>
                    </tr>
                  ) : filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-stone-50/50 transition">
                      <td className="pl-6 pr-4 py-4 flex items-center gap-4">
                        <div className="w-16 h-20 bg-zinc-100 rounded-xs overflow-hidden shrink-0">
                          <img src={p.gambar_url || 'https://placehold.co/64x80'} alt={p.nama} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="text-black font-semibold text-base">{p.nama}</div>
                          <div className="text-stone-500 text-xs font-semibold">{p.kategori || 'General'}</div>
                        </div>
                      </td>
                      <td className="p-4 text-stone-500 font-normal">SKU-{p.id}</td>
                      <td className="p-4">
                        {p.stok <= 3 ? (
                          <span className="px-2.5 py-1 bg-stone-50 rounded-full border border-orange-400 text-orange-400 text-xs font-semibold inline-flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                            Low Stock
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 bg-stone-50 rounded-full border border-neutral-200 text-black text-xs font-semibold inline-flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-black"></span>
                            Published
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right font-medium text-black text-xl">{p.stok}</td>
                      <td className="pl-4 pr-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Link to={`/admin/product/${p.id}/edit`} className="px-3 py-1.5 border border-neutral-200 text-stone-500 hover:text-black text-xs font-semibold flex items-center gap-1">
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </Link>
                          <button onClick={() => handleDelete(p.id)} className="px-3 py-1.5 border border-rose-200 text-red-700 hover:bg-red-50 text-xs font-semibold flex items-center gap-1">
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="p-4 bg-white border-t border-neutral-200 flex justify-between items-center text-xs font-semibold text-stone-500">
              <div>Showing 1 to {filteredProducts.length} entries</div>
            </div>
          </div>

        </div>
      </main>

    </div>
  );
};

export default ProductManagement;
