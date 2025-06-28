const Cart = require('../models/Cart');
const Joi = require('joi');

// Validation schemas
const addItemSchema = Joi.object({
  productId: Joi.string().required(),
  name: Joi.string().required(),
  price: Joi.number().min(0).required(),
  quantity: Joi.number().min(1).default(1),
  image: Joi.string().allow('').default(''),
  category: Joi.string().allow('').default('')
});

const updateQuantitySchema = Joi.object({
  quantity: Joi.number().min(0).required()
});

// Get user's cart
const getCart = async (req, res) => {
  try {
    const userId = req.user.sub; // JWT subject contains user ID
    
    let cart = await Cart.findOne({ userId });
    
    if (!cart) {
      // Create empty cart if doesn't exist
      cart = new Cart({ userId, items: [] });
      await cart.save();
    }
    
    res.json({
      success: true,
      data: {
        cart: {
          id: cart._id,
          userId: cart.userId,
          items: cart.items,
          totalItems: cart.totalItems,
          totalPrice: cart.totalPrice,
          updatedAt: cart.updatedAt
        }
      }
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve cart'
    });
  }
};

// Add item to cart
const addItem = async (req, res) => {
  try {
    const { error, value } = addItemSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        details: error.details[0].message
      });
    }

    const userId = req.user.sub;
    const { productId, name, price, quantity, image, category } = value;

    let cart = await Cart.findOne({ userId });
    
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(item => item.productId === productId);
    
    if (existingItemIndex > -1) {
      // Update quantity of existing item
      cart.items[existingItemIndex].quantity += quantity;
      cart.items[existingItemIndex].addedAt = new Date();
    } else {
      // Add new item to cart
      cart.items.push({
        productId,
        name,
        price,
        quantity,
        image,
        category
      });
    }

    await cart.save();

    res.json({
      success: true,
      message: 'Item added to cart successfully',
      data: {
        cart: {
          id: cart._id,
          userId: cart.userId,
          items: cart.items,
          totalItems: cart.totalItems,
          totalPrice: cart.totalPrice,
          updatedAt: cart.updatedAt
        }
      }
    });
  } catch (error) {
    console.error('Add item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add item to cart'
    });
  }
};

// Update item quantity
const updateItemQuantity = async (req, res) => {
  try {
    const { error, value } = updateQuantitySchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        details: error.details[0].message
      });
    }

    const userId = req.user.sub;
    const productId = req.params.productId;
    const { quantity } = value;

    const cart = await Cart.findOne({ userId });
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    if (quantity === 0) {
      // Remove item if quantity is 0
      cart.items = cart.items.filter(item => item.productId !== productId);
    } else {
      // Update quantity
      const itemIndex = cart.items.findIndex(item => item.productId === productId);
      if (itemIndex === -1) {
        return res.status(404).json({
          success: false,
          message: 'Item not found in cart'
        });
      }
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();

    res.json({
      success: true,
      message: 'Cart updated successfully',
      data: {
        cart: {
          id: cart._id,
          userId: cart.userId,
          items: cart.items,
          totalItems: cart.totalItems,
          totalPrice: cart.totalPrice,
          updatedAt: cart.updatedAt
        }
      }
    });
  } catch (error) {
    console.error('Update quantity error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update cart'
    });
  }
};

// Remove item from cart
const removeItem = async (req, res) => {
  try {
    const userId = req.user.sub;
    const productId = req.params.productId;

    const cart = await Cart.findOne({ userId });
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    cart.items = cart.items.filter(item => item.productId !== productId);
    await cart.save();

    res.json({
      success: true,
      message: 'Item removed from cart successfully',
      data: {
        cart: {
          id: cart._id,
          userId: cart.userId,
          items: cart.items,
          totalItems: cart.totalItems,
          totalPrice: cart.totalPrice,
          updatedAt: cart.updatedAt
        }
      }
    });
  } catch (error) {
    console.error('Remove item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove item from cart'
    });
  }
};

// Clear entire cart
const clearCart = async (req, res) => {
  try {
    const userId = req.user.sub;

    const cart = await Cart.findOne({ userId });
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    cart.items = [];
    await cart.save();

    res.json({
      success: true,
      message: 'Cart cleared successfully',
      data: {
        cart: {
          id: cart._id,
          userId: cart.userId,
          items: cart.items,
          totalItems: cart.totalItems,
          totalPrice: cart.totalPrice,
          updatedAt: cart.updatedAt
        }
      }
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear cart'
    });
  }
};

module.exports = {
  getCart,
  addItem,
  updateItemQuantity,
  removeItem,
  clearCart
};
