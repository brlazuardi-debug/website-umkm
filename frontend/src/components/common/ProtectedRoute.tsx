import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { useBrand } from '../../context/BrandContext';

interface RouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<RouteProps> = ({ children }) => {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-950"></div>
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export const AdminRoute: React.FC<RouteProps> = ({ children }) => {
  const { isSignedIn, isLoaded } = useAuth();
  const { isAdminDemo } = useBrand();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-950"></div>
      </div>
    );
  }

  // Bypass demo admin hanya untuk development/mockup. Di production, akses admin
  // wajib melalui role asli (Clerk JWT metadata) yang diverifikasi di backend.
  if (import.meta.env.DEV && isAdminDemo) {
    return <>{children}</>;
  }

  // Jika tidak menggunakan demo, periksa apakah signed-in
  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  // Catatan: Jika backend menggunakan role-based JWT, rule aslinya akan memeriksa role Clerk metadata.
  // Untuk MVP, bypass demo atau signed-in user diasumsikan lulus di tahap frontend.
  return <>{children}</>;
};
export default ProtectedRoute;
