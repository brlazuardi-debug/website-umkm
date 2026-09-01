import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { useBrand } from '../../context/BrandContext';

export const ProtectedRoute = ({ children }) => {
  const { isSignedIn, isLoaded } = useAuth();
  const { isCustomerDemo, isAdminDemo } = useBrand();

  // Jika user mengaktifkan demo customer atau admin, izinkan akses langsung tanpa blokir
  if (isCustomerDemo || isAdminDemo) {
    return <>{children}</>;
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export const AdminRoute = ({ children }) => {
  const { isSignedIn, isLoaded } = useAuth();
  const { isAdminDemo } = useBrand();

  // Akses admin aktif jika Admin Demo diaktifkan (bekerja di Dev & Production)
  if (isAdminDemo) {
    return <>{children}</>;
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  // Jika tidak menggunakan demo, periksa apakah signed-in
  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
