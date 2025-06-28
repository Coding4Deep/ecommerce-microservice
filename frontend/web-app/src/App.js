import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import './components.css';

// Import components
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';

// Import all page components
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import Services from './pages/Services';
import NotFound from './pages/NotFound';

// Admin Pages
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminProducts from './pages/AdminProducts';
import AdminProtectedRoute from './components/AdminProtectedRoute';

// Context for global state
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <Router>
            <div className="App">
              <Routes>
                {/* Admin Routes */}
                <Route path="/admin/login" element={
                  <Layout className="auth">
                    <AdminLogin />
                  </Layout>
                } />
                <Route path="/admin" element={
                  <AdminProtectedRoute>
                    <Layout className="admin">
                      <AdminDashboard />
                    </Layout>
                  </AdminProtectedRoute>
                } />
                <Route path="/admin/dashboard" element={
                  <AdminProtectedRoute>
                    <Layout className="admin">
                      <AdminDashboard />
                    </Layout>
                  </AdminProtectedRoute>
                } />
                <Route path="/admin/users" element={
                  <AdminProtectedRoute>
                    <Layout className="admin">
                      <AdminUsers />
                    </Layout>
                  </AdminProtectedRoute>
                } />
                <Route path="/admin/products" element={
                  <AdminProtectedRoute>
                    <Layout className="admin">
                      <AdminProducts />
                    </Layout>
                  </AdminProtectedRoute>
                } />
                
                {/* Regular Routes */}
                <Route path="/" element={
                  <Layout>
                    <Home />
                  </Layout>
                } />
                <Route path="/products" element={
                  <Layout>
                    <Products />
                  </Layout>
                } />
                <Route path="/products/:id" element={
                  <Layout>
                    <ProductDetail />
                  </Layout>
                } />
                <Route path="/cart" element={
                  <Layout>
                    <Cart />
                  </Layout>
                } />
                <Route path="/orders" element={
                  <Layout>
                    <Orders />
                  </Layout>
                } />
                <Route path="/profile" element={
                  <Layout>
                    <Profile />
                  </Layout>
                } />
                <Route path="/services" element={
                  <Layout>
                    <Services />
                  </Layout>
                } />
                <Route path="/login" element={
                  <Layout className="auth">
                    <Login />
                  </Layout>
                } />
                <Route path="/register" element={
                  <Layout className="auth">
                    <Register />
                  </Layout>
                } />
                <Route path="*" element={
                  <Layout>
                    <NotFound />
                  </Layout>
                } />
              </Routes>
            </div>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
