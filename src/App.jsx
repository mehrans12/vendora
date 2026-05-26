import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import { Toast } from './components/common/Toast';
import { useAuth } from './hooks/useAuth';
import { PageLoader } from './components/common/Loader';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ProductBrowse from './pages/buyer/ProductBrowse';
import ProductDetails from './pages/buyer/ProductDetails';
import Cart from './pages/buyer/Cart';
import Checkout from './pages/buyer/Checkout';
import BuyerDashboard from './pages/buyer/BuyerDashboard';
import SellerDashboard from './pages/seller/SellerDashboard';
import ProductsList from './pages/seller/ProductsList';
import ProductForm from './pages/seller/ProductForm';
import OrdersPage from './pages/seller/OrdersPage';
import SellerProfile from './pages/seller/SellerProfile';
import AdminDashboard from './pages/admin/AdminDashboard';

// ─── Protected Route ────────────────────────────────────────────────────────
const ProtectedRoute = ({ children, requireRole }) => {
  const { user, loading } = useAuth();

  if (loading) return <PageLoader />;

  if (!user) {
    return <Navigate to="/login" state={{ from: window.location.pathname }} replace />;
  }

  if (requireRole && user.role !== requireRole) {
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    return <Navigate to={user.role === 'seller' ? '/seller/dashboard' : '/'} replace />;
  }

  return children;
};

// ─── App Router ─────────────────────────────────────────────────────────────
function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/products" element={<ProductBrowse />} />
        <Route path="/products/:id" element={<ProductDetails />} />

        {/* Buyer Routes */}
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={
          <ProtectedRoute requireRole="buyer"><Checkout /></ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute requireRole="buyer"><BuyerDashboard /></ProtectedRoute>
        } />

        {/* Seller Routes */}
        <Route path="/seller/dashboard" element={
          <ProtectedRoute requireRole="seller"><SellerDashboard /></ProtectedRoute>
        } />
        <Route path="/seller/products" element={
          <ProtectedRoute requireRole="seller"><ProductsList /></ProtectedRoute>
        } />
        <Route path="/seller/products/new" element={
          <ProtectedRoute requireRole="seller"><ProductForm /></ProtectedRoute>
        } />
        <Route path="/seller/products/:id/edit" element={
          <ProtectedRoute requireRole="seller"><ProductForm /></ProtectedRoute>
        } />
        <Route path="/seller/orders" element={
          <ProtectedRoute requireRole="seller"><OrdersPage /></ProtectedRoute>
        } />
        <Route path="/seller/profile" element={
          <ProtectedRoute requireRole="seller"><SellerProfile /></ProtectedRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute requireRole="admin"><AdminDashboard /></ProtectedRoute>
        } />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Global Toast */}
      <Toast />
    </BrowserRouter>
  );
}

// ─── Root App ───────────────────────────────────────────────────────────────
export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <AppRouter />
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
