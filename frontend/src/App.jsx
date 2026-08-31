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
import ProfilePage from './pages/customers/ProfilePage';

// Admin Pages (Figma design structure)
import ProductManagement from './pages/admin/ProductManagement';
import CartOrders from './pages/admin/CartOrders';
import EmployeeManagement from './pages/admin/EmployeeManagement';

// Route Guards
import { ProtectedRoute, AdminRoute } from './components/common/ProtectedRoute';

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!CLERK_PUBLISHABLE_KEY) {
  console.error(
    '[Clerk] VITE_CLERK_PUBLISHABLE_KEY tidak ditemukan. ' +
    'Salin .env.example ke .env dan isi key dari dashboard Clerk sebelum menjalankan app.'
  );
}

const ApiInterceptorInitializer = () => {
  const { getToken, isSignedIn } = useAuth();

  useEffect(() => {
    if (isSignedIn) {
      setAuthTokenInterceptor(getToken);
    }
  }, [isSignedIn, getToken]);

  return null;
};

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
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Rute Terproteksi Owner/Admin */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <ProductManagement />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/cart-orders"
          element={
            <AdminRoute>
              <CartOrders />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/employee"
          element={
            <AdminRoute>
              <EmployeeManagement />
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