const mongoose = require('mongoose');

const stockReservationSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  orderId: { type: String, required: true },
  quantity: { type: Number, required: true },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('StockReservation', stockReservationSchema);
