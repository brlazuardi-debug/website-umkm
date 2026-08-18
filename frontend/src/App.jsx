import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ClerkProvider, useAuth } from '@clerk/clerk-react';
import { BrandProvider } from './context/BrandContext';
import { setAuthTokenInterceptor } from './api/client';
import Layout from './components/Layout';

// Halaman-halaman
import LandingPage from './pages/customers/LandingPage';
import KatalogProduk from './pages/customers/KatalogProduk';
import DetailProduk from './pages/customers/DetailProduk';
import CheckoutPage from './pages/customers/CheckoutPage';
import OrderStatusPage from './pages/customers/OrderStatusPage';
import LoginPage from './pages/customers/LoginPage';
import RegisterPage from './pages/customers/RegisterPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProductFormPage from './pages/admin/ProductFormPage';

// Route Guards
import { ProtectedRoute, AdminRoute } from './components/common/ProtectedRoute';

// Clerk publishable key harus diset via VITE_CLERK_PUBLISHABLE_KEY di .env.
// Tanpa key, auth tidak akan berfungsi — lebih baik gagal terang daripada pakai key palsu.
const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!CLERK_PUBLISHABLE_KEY) {
  console.error(
    '[Clerk] VITE_CLERK_PUBLISHABLE_KEY tidak ditemukan. ' +
    'Salin .env.example ke .env dan isi key dari dashboard Clerk sebelum menjalankan app.'
  );
}

// Sub-komponen khusus untuk menginisialisasi interceptor token Clerk dinamis
const ApiInterceptorInitializer = () => {
  const { getToken, isSignedIn } = useAuth();

  useEffect(() => {
    if (isSignedIn) {
      setAuthTokenInterceptor(getToken);
    }
  }, [isSignedIn, getToken]);

  return null;
};

// Sub-komponen yang membungkus routing di dalam Clerk Context agar navigate bekerja
const AppRoutes = () => {
  return (
    <Layout>
      <ApiInterceptorInitializer />
      <Routes>
        {/* Rute Publik */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/products" element={<KatalogProduk />} />
        <Route path="/products/:id" element={<DetailProduk />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Rute Terproteksi Pembeli */}
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order-status/:id"
          element={
            <ProtectedRoute>
              <OrderStatusPage />
            </ProtectedRoute>
          }
        />

        {/* Rute Terproteksi Owner/Admin */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/product/new"
          element={
            <AdminRoute>
              <ProductFormPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/product/:id/edit"
          element={
            <AdminRoute>
              <ProductFormPage />
            </AdminRoute>
          }
        />

        {/* Fallback ke Landing Page */}
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </Layout>
  );
};

export function App() {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <BrandProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </BrandProvider>
    </ClerkProvider>
  );
}

export default App;
