# Cart Service

Manages shopping cart functionality with MongoDB storage.

## Features
- Add/remove items from cart
- Update item quantities
- Cart persistence with MongoDB
- User-specific cart management
- Cart total calculations

## Endpoints
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item
- `DELETE /api/cart/remove` - Remove item
- `POST /api/cart/clear` - Clear cart
- `GET /health` - Health check

## Environment Variables
```env
PORT=8003
MONGODB_URI=mongodb://localhost:27017/cart
JWT_SECRET=your-secret
```

## Development
```bash
npm install
npm run dev
```

## Testing
```bash
npm test
```
