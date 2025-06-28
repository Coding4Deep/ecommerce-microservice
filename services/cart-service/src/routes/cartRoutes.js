const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  getCart,
  addItem,
  updateItemQuantity,
  removeItem,
  clearCart
} = require('../controllers/cartController');

// All cart routes require authentication
router.use(authenticateToken);

// GET /api/cart - Get user's cart
router.get('/', getCart);

// POST /api/cart/items - Add item to cart
router.post('/items', addItem);

// PUT /api/cart/items/:productId - Update item quantity
router.put('/items/:productId', updateItemQuantity);

// DELETE /api/cart/items/:productId - Remove item from cart
router.delete('/items/:productId', removeItem);

// DELETE /api/cart - Clear entire cart
router.delete('/', clearCart);

module.exports = router;
