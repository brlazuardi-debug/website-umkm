import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Mail, Phone, Package, Users, ShoppingBag, LogOut, X, Shield } from 'lucide-react';
import { getEmployees, createEmployee, updateEmployeeStatus, deleteEmployee } from '../../api/employees';

export const EmployeeManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State (Figma Alignment: Option 1)
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('STAFF');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await getEmployees({ limit: 100 });
      const data = res.data || res || [];
      setEmployees(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching employees:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleCreateEmployee = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null);
      const newEmp = await createEmployee({
        name,
        email,
        phone: phone.trim() || null,
        role,
        is_active: true,
        status: 'ACTIVE',
      });
      setEmployees((prev) => [newEmp, ...prev]);
      setShowModal(false);
      setName('');
      setEmail('');
      setPhone('');
      setRole('STAFF');
    } catch (err) {
      console.error('Error creating employee:', err);
      setError(err.response?.data?.detail || 'Gagal menambahkan karyawan.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredEmployees = employees.filter((emp) =>
    emp.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.role?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const roleList = ['OWNER', 'ADMIN', 'STORE MANAGER', 'WAREHOUSE', 'CUSTOMER SERVICE', 'CASHIER', 'STAFF'];

  return (
    <div data-layer="Admin Panel - Manajemen Karyawan" className="AdminPanelManajemenKaryawan w-full min-h-screen bg-stone-50 text-stone-900 font-['Inter'] font-semibold flex">

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
            <Link to="/admin/employee" className="flex items-center gap-3 px-4 py-3 bg-black text-white font-semibold transition">
              <Users className="w-5 h-5 text-white" />
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

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen">

        {/* Top App Bar */}
        <header className="h-20 px-8 bg-white border-b border-neutral-200 flex justify-between items-center shadow-xs">
          <div className="w-96 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search employees..."
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

        {/* Content Canvas */}
        <div className="p-8 flex flex-col gap-10 flex-1">

          {/* Page Header & Actions */}
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-black text-3xl sm:text-4xl font-bold uppercase tracking-tight leading-tight">Team Directory</h1>
              <p className="text-stone-500 text-sm font-normal mt-1">Manage roles, permissions, and personnel across your organization.</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowModal(true)}
                className="px-6 py-3 bg-black text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-neutral-800 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>NEW EMPLOYEE</span>
              </button>
            </div>
          </div>

          {/* Employee Grid */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            </div>
          ) : filteredEmployees.length === 0 ? (
            <div className="text-center py-20 bg-white border border-neutral-200">
              <p className="text-stone-500 text-sm font-normal">Tidak ada anggota tim yang sesuai dengan pencarian.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEmployees.map((emp) => (
                <div
                  key={emp.id}
                  className={`p-6 bg-white border border-neutral-200 relative flex flex-col justify-between gap-6 ${!emp.is_active ? 'opacity-70' : ''}`}
                >
                  <div className="w-full h-1 bg-black absolute top-0 left-0" />

                  <div className="flex justify-between items-start pt-2">
                    <div className="w-14 h-14 bg-zinc-100 border border-neutral-200 flex justify-center items-center text-black text-2xl font-bold">
                      {emp.name ? emp.name[0] : 'E'}
                    </div>
                    <div className="px-2.5 py-1 border border-neutral-200 flex items-center gap-1.5 bg-stone-50">
                      <span className={`w-2 h-2 rounded-full ${emp.is_active ? 'bg-orange-400' : 'bg-stone-400'}`} />
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${emp.is_active ? 'text-black' : 'text-stone-500'}`}>
                        {emp.status || (emp.is_active ? 'ACTIVE' : 'INACTIVE')}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <h3 className={`text-xl font-bold uppercase tracking-wide ${emp.is_active ? 'text-black' : 'text-stone-500'}`}>
                      {emp.name}
                    </h3>
                    <span className={`text-xs font-bold uppercase tracking-wider ${emp.role === 'ADMIN' || emp.role === 'OWNER' ? 'text-orange-400' : 'text-stone-500'}`}>
                      {emp.role}
                    </span>
                  </div>

                  <div className="pt-4 border-t border-neutral-200 flex flex-col gap-2.5 text-stone-600 text-xs font-medium">
                    <div className="flex items-center gap-2.5">
                      <Mail className="w-4 h-4 text-stone-400" />
                      <span className="truncate">{emp.email}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Phone className="w-4 h-4 text-stone-400" />
                      <span>{emp.phone || '+62 812-0000-0000'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </main>

      {/* Modal Dialog "New Employee" (Figma Alignment: Option 1) */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-center items-center p-4">
          <div className="bg-white border border-neutral-200 max-w-lg w-full p-8 flex flex-col gap-6 shadow-xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 text-stone-400 hover:text-black transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-orange-400 text-xs font-bold uppercase tracking-widest block mb-1">TEAM ACCESS</span>
              <h3 className="text-2xl font-bold uppercase tracking-tight text-black">
                TAMBAH KARYAWAN BARU
              </h3>
              <p className="text-stone-500 text-xs mt-1">Daftarkan personel baru ke dalam direktori organisasi VARCA.</p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-700 text-xs font-bold uppercase tracking-wider border border-red-200">
                {error}
              </div>
            )}

            <form onSubmit={handleCreateEmployee} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-600">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Marcus Vance"
                  className="py-2.5 px-3 bg-zinc-50 border border-neutral-300 text-sm text-black focus:outline-none focus:border-black"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-600">Alamat Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="marcus@varca.id"
                  className="py-2.5 px-3 bg-zinc-50 border border-neutral-300 text-sm text-black focus:outline-none focus:border-black"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-600">Nomor Telepon</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+62 812-3456-7890"
                  className="py-2.5 px-3 bg-zinc-50 border border-neutral-300 text-sm text-black focus:outline-none focus:border-black"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-600">Role &amp; Hak Akses</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="py-2.5 px-3 bg-white border border-neutral-300 text-sm text-black focus:outline-none focus:border-black font-semibold uppercase"
                >
                  {roleList.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 border border-neutral-300 text-stone-600 text-xs font-bold uppercase tracking-wider hover:border-black hover:text-black transition"
                >
                  BATAL
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3 bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider transition disabled:opacity-50"
                >
                  {submitting ? 'MENYIMPAN...' : 'TAMBAH KARYAWAN'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default EmployeeManagement;
