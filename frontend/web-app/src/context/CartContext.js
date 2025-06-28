import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

  // Get auth token for API requests
  const getAuthToken = () => {
    return localStorage.getItem('ecommerce-token');
  };

  // Get auth headers
  const getAuthHeaders = () => {
    const token = getAuthToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  };

  // Load cart from API when user logs in
  useEffect(() => {
    if (user) {
      loadCartFromAPI();
    } else {
      // User logged out, clear cart
      setCart([]);
    }
  }, [user]);

  // Load cart from API
  const loadCartFromAPI = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/cart`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data.cart) {
          setCart(data.data.cart.items || []);
        }
      } else if (response.status === 401) {
        // Token expired, user needs to login again
        console.log('Cart: Authentication required');
        setCart([]);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      // Fallback to empty cart on error
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  // Add item to cart
  const addToCart = async (product, quantity = 1) => {
    if (!user) {
      alert('Please login to add items to cart');
      return false;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/cart/items`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: quantity,
          image: product.image || '',
          category: product.category || ''
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data.cart) {
          setCart(data.data.cart.items || []);
          return true;
        }
      } else if (response.status === 401) {
        alert('Please login to add items to cart');
        return false;
      } else {
        const errorData = await response.json();
        console.error('Add to cart error:', errorData);
        alert('Failed to add item to cart');
        return false;
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      alert('Failed to add item to cart');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId) => {
    if (!user) return false;

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/cart/items/${productId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data.cart) {
          setCart(data.data.cart.items || []);
          return true;
        }
      }
    } catch (error) {
      console.error('Remove from cart error:', error);
      alert('Failed to remove item from cart');
    } finally {
      setLoading(false);
    }
    return false;
  };

  // Update item quantity
  const updateQuantity = async (productId, quantity) => {
    if (!user) return false;

    if (quantity <= 0) {
      return await removeFromCart(productId);
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/cart/items/${productId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ quantity })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data.cart) {
          setCart(data.data.cart.items || []);
          return true;
        }
      }
    } catch (error) {
      console.error('Update quantity error:', error);
      alert('Failed to update item quantity');
    } finally {
      setLoading(false);
    }
    return false;
  };

  // Clear entire cart
  const clearCart = async () => {
    if (!user) return false;

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/cart`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setCart([]);
          return true;
        }
      }
    } catch (error) {
      console.error('Clear cart error:', error);
      alert('Failed to clear cart');
    } finally {
      setLoading(false);
    }
    return false;
  };

  // Get total items count
  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  // Get total price
  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Get item quantity
  const getItemQuantity = (productId) => {
    const item = cart.find(item => item.productId === productId);
    return item ? item.quantity : 0;
  };

  const value = {
    cart,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    getItemQuantity,
    refreshCart: loadCartFromAPI
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}
