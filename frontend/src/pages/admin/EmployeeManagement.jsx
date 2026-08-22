import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Mail, Phone, Package, Users, ShoppingBag, LogOut, Settings } from 'lucide-react';

export const EmployeeManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const employees = [
    { name: 'Renaldi Zaki', initial: 'R', role: 'ADMIN', status: 'ACTIVE', email: 'Renaldi@1.com', phone: '+1 (555) 019-2834', active: true },
    { name: 'Bagus Lazuardi', initial: 'B', role: 'WAREHOUSE', status: 'ACTIVE', email: 'Bagus@2.com', phone: '+1 (555) 019-2835', active: true },
    { name: 'Fadli Suta', initial: 'F', role: 'CUSTOMER SERVICE', status: 'ACTIVE', email: 'Fadli@3.com', phone: '+1 (555) 019-2836', active: true },
    { name: 'Virmanza', initial: 'V', role: 'STORE MANAGER', status: 'ACTIVE', email: 'Virman@4.com', phone: '+1 (555) 019-2837', active: true },
    { name: 'Dummy 1', initial: 'D', role: 'WAREHOUSE', status: 'INACTIVE', email: 'Dummy@1.com', phone: '+1 (555) 019-2838', active: false },
  ];

  return (
    <div data-layer="Admin Panel - Manajemen Karyawan" className="AdminPanelManajemenKaryawan w-full min-h-screen bg-stone-50 text-stone-900 font-semibold flex">

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
            <Link to="/admin/employee" className="flex items-center gap-3 px-4 py-3 bg-zinc-900 text-white font-semibold rounded-lg transition">
              <Users className="w-5 h-5 text-white" />
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

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen">

        {/* Admin Top Bar */}
        <header className="h-20 px-8 bg-white border-b border-neutral-200 flex justify-between items-center shadow-xs">
          <div className="w-96 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search employees..."
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

        {/* Content Canvas */}
        <div className="p-8 flex flex-col gap-12 flex-1">

          {/* Page Header & Actions */}
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-black text-4xl sm:text-5xl font-bold leading-tight">Team Directory</h1>
              <p className="text-stone-500 text-lg font-normal mt-2">Manage roles, permissions, and personnel across your organization.</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="px-6 py-3.5 border border-black text-black text-xs font-semibold uppercase tracking-wider hover:bg-stone-100 transition">
                MANAGE PERMISSIONS
              </button>
              <button className="px-6 py-3 bg-black text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 hover:bg-neutral-800 transition">
                <Plus className="w-3.5 h-3.5" />
                <span>NEW EMPLOYEE</span>
              </button>
            </div>
          </div>

          {/* Employee Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {employees.map((emp, index) => (
              <div
                key={index}
                className={`p-6 bg-white border border-neutral-200 rounded-lg relative flex flex-col justify-between gap-6 ${!emp.active ? 'opacity-75' : ''}`}
              >
                <div className="w-full h-1 bg-neutral-200 absolute top-0 left-0"></div>

                <div className="flex justify-between items-start pt-2">
                  <div className="w-16 h-16 rounded-full bg-neutral-200 flex justify-center items-center text-black text-4xl font-normal">
                    {emp.initial}
                  </div>
                  <div className="px-2 py-1 border border-neutral-200 rounded-sm flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${emp.active ? 'bg-orange-400' : 'bg-stone-500'}`}></span>
                    <span className={`text-xs font-semibold uppercase ${emp.active ? 'text-black' : 'text-stone-500'}`}>
                      {emp.status}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <h3 className={`text-2xl font-medium ${emp.active ? 'text-black' : 'text-stone-500'}`}>
                    {emp.name}
                  </h3>
                  <span className={`text-xs font-semibold uppercase tracking-wider ${emp.role === 'ADMIN' ? 'text-orange-400' : 'text-stone-500'}`}>
                    {emp.role}
                  </span>
                </div>

                <div className="pt-4 border-t border-neutral-200 flex flex-col gap-3 text-stone-500 text-sm">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-stone-500" />
                    <span>{emp.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-stone-500" />
                    <span>{emp.phone}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </main>

    </div>
  );
};

export default EmployeeManagement;
