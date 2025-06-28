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
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
        console.log('User restored from localStorage:', userData.email);
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('ecommerce-user');
        localStorage.removeItem('ecommerce-token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      console.log('Attempting login for:', email);
      
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('Login response:', data);

      if (response.ok && data.access_token) {
        const userData = {
          id: data.user.id,
          email: data.user.email,
          firstName: data.user.first_name,
          lastName: data.user.last_name,
          role: data.user.role,
          phone: data.user.phone,
          isActive: data.user.is_active,
          isVerified: data.user.is_verified,
          fullName: `${data.user.first_name} ${data.user.last_name}`
        };
        
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('ecommerce-user', JSON.stringify(userData));
        localStorage.setItem('ecommerce-token', data.access_token);
        localStorage.setItem('ecommerce-refresh-token', data.refresh_token);
        
        // Clean up any old cart data from other users or guest sessions
        cleanupOldCartData(userData.id);
        
        console.log('Login successful for:', userData.email);
        return { success: true, user: userData };
      } else {
        console.error('Login failed:', data);
        return { success: false, error: data.detail || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const register = async (userData) => {
    try {
      console.log('Attempting registration for:', userData.email);
      
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      console.log('Registration response:', data);

      if (response.ok && data.id) {
        console.log('Registration successful for:', data.email);
        return { success: true, user: data };
      } else {
        console.error('Registration failed:', data);
        return { success: false, error: data.detail || 'Registration failed' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const logout = () => {
    console.log('Logging out user:', user?.email);
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('ecommerce-user');
    localStorage.removeItem('ecommerce-token');
    localStorage.removeItem('ecommerce-refresh-token');
    
    // Clean up user-specific cart data
    if (user?.id) {
      localStorage.removeItem(`ecommerce-cart-${user.id}`);
    }
  };

  const updateUser = (updatedUserData) => {
    const newUserData = { ...user, ...updatedUserData };
    setUser(newUserData);
    localStorage.setItem('ecommerce-user', JSON.stringify(newUserData));
  };

  const getAuthToken = () => {
    return localStorage.getItem('ecommerce-token');
  };

  const isTokenValid = () => {
    const token = getAuthToken();
    if (!token) return false;
    
    try {
      // Basic token validation (you might want to add JWT decode and expiry check)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateUser,
    getAuthToken,
    isTokenValid
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
