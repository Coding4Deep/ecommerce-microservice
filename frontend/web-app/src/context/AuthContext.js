import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// API Base URL - using the API Gateway
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Clean up old cart data when user logs in
  const cleanupOldCartData = (currentUserId) => {
    // Remove guest cart data (since user is now logged in)
    localStorage.removeItem('ecommerce-cart-guest');
    localStorage.removeItem('ecommerce-cart'); // Legacy key
    
    // Get all localStorage keys and remove OTHER users' cart data (not current user's)
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('ecommerce-cart-') && key !== `ecommerce-cart-${currentUserId}`) {
        console.log(`Cleaning up old cart data: ${key}`);
        localStorage.removeItem(key);
      }
    });
  };

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('ecommerce-user');
    const savedToken = localStorage.getItem('ecommerce-token');
    
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.access_token) {
        const userData = {
          id: data.user.id,
          email: data.user.email,
          firstName: data.user.first_name,
          lastName: data.user.last_name,
          role: data.user.role,
          phone: data.user.phone,
          isActive: data.user.is_active,
          isVerified: data.user.is_verified
        };
        
        setUser(userData);
        localStorage.setItem('ecommerce-user', JSON.stringify(userData));
        localStorage.setItem('ecommerce-token', data.access_token);
        localStorage.setItem('ecommerce-refresh-token', data.refresh_token);
        
        // Clean up any old cart data from other users or guest sessions
        cleanupOldCartData(userData.id);
        
        return { success: true };
      } else {
        return { success: false, error: data.detail || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const register = async (userData) => {
    console.log('Starting registration process...', { email: userData.email });
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userData.email,
          password: userData.password,
          confirm_password: userData.confirmPassword,
          first_name: userData.firstName,
          last_name: userData.lastName,
          phone: userData.phone || null
        }),
      });

      const data = await response.json();
      console.log('Registration response:', { status: response.status, data });

      if (response.ok && data.id) {
        console.log('Registration successful!');
        return { 
          success: true, 
          message: 'Account created successfully! Please log in with your credentials.',
          redirectToLogin: true 
        };
      } else {
        console.log('Registration failed:', data);
        
        // Handle different error formats
        let errorMessage = 'Registration failed';
        
        if (data.detail) {
          if (typeof data.detail === 'string') {
            // Simple string error (like "Email already registered")
            errorMessage = data.detail;
          } else if (Array.isArray(data.detail)) {
            // Validation errors array
            const errors = data.detail.map(err => err.msg).join(', ');
            errorMessage = `Validation errors: ${errors}`;
          }
        } else if (data.message) {
          errorMessage = data.message;
        }
        
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.error('Registration network error:', error);
      return { success: false, error: 'Network error. Please check your connection and try again.' };
    }
  };

  const adminLogin = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.access_token && data.user.role === 'admin') {
        const userData = {
          id: data.user.id,
          email: data.user.email,
          firstName: data.user.first_name,
          lastName: data.user.last_name,
          role: data.user.role,
          phone: data.user.phone,
          isActive: data.user.is_active,
          isVerified: data.user.is_verified
        };
        
        setUser(userData);
        localStorage.setItem('ecommerce-user', JSON.stringify(userData));
        localStorage.setItem('ecommerce-token', data.access_token);
        localStorage.setItem('ecommerce-refresh-token', data.refresh_token);
        
        return { success: true };
      } else if (response.ok && data.user.role !== 'admin') {
        return { success: false, error: 'Access denied. Admin privileges required.' };
      } else {
        return { success: false, error: data.detail || 'Login failed' };
      }
    } catch (error) {
      console.error('Admin login error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const adminRegister = async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userData.email,
          password: userData.password,
          confirm_password: userData.confirmPassword,
          first_name: userData.firstName,
          last_name: userData.lastName,
          phone: userData.phone || null
        }),
      });

      const data = await response.json();

      if (response.ok && data.id) {
        // Note: In a real app, you'd need a separate admin registration endpoint
        // For now, we'll register as regular user and manually set role to admin
        const newUser = {
          id: data.id,
          email: data.email,
          firstName: data.first_name,
          lastName: data.last_name,
          role: 'admin', // This should be handled by backend
          phone: data.phone,
          isActive: data.is_active,
          isVerified: data.is_verified
        };
        
        setUser(newUser);
        localStorage.setItem('ecommerce-user', JSON.stringify(newUser));
        
        return { success: true };
      } else {
        return { success: false, error: data.detail || 'Registration failed' };
      }
    } catch (error) {
      console.error('Admin registration error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const logout = () => {
    // Clear user state
    setUser(null);
    
    // Clear authentication-related localStorage data
    localStorage.removeItem('ecommerce-user');
    localStorage.removeItem('ecommerce-token');
    localStorage.removeItem('ecommerce-refresh-token');
    
    // DON'T clear user-specific cart data - it should persist!
    // Only clear guest cart data
    localStorage.removeItem('ecommerce-cart-guest');
    localStorage.removeItem('ecommerce-cart'); // Legacy cart key
    
    console.log('User logged out, cart data preserved');
  };

  const updateProfile = async (userData) => {
    try {
      const token = localStorage.getItem('ecommerce-token');
      
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          first_name: userData.firstName,
          last_name: userData.lastName,
          phone: userData.phone
        }),
      });

      if (response.ok) {
        const updatedUser = { ...user, ...userData };
        setUser(updatedUser);
        localStorage.setItem('ecommerce-user', JSON.stringify(updatedUser));
        return { success: true };
      } else {
        const data = await response.json();
        return { success: false, error: data.detail || 'Update failed' };
      }
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const value = {
    user,
    loading,
    login,
    adminLogin,
    adminRegister,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
