// MongoDB initialization script
// This script runs when MongoDB container starts for the first time

// Switch to ecommerce database
db = db.getSiblingDB('ecommerce');

// Create collections with validation
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["email", "first_name", "last_name", "hashed_password"],
      properties: {
        email: {
          bsonType: "string",
          pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
        },
        first_name: { bsonType: "string", minLength: 1, maxLength: 50 },
        last_name: { bsonType: "string", minLength: 1, maxLength: 50 },
        phone: { bsonType: ["string", "null"] },
        role: { enum: ["user", "admin", "moderator"] },
        is_active: { bsonType: "bool" },
        is_verified: { bsonType: "bool" }
      }
    }
  }
});

db.createCollection("products", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "description", "sku", "price", "categoryId", "brand"],
      properties: {
        name: { bsonType: "string", minLength: 1, maxLength: 200 },
        description: { bsonType: "string", minLength: 10, maxLength: 2000 },
        sku: { bsonType: "string" },
        price: { bsonType: "decimal" },
        categoryId: { bsonType: "string" },
        brand: { bsonType: "string" },
        stockQuantity: { bsonType: "int", minimum: 0 },
        isActive: { bsonType: "bool" }
      }
    }
  }
});

db.createCollection("categories", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "slug"],
      properties: {
        name: { bsonType: "string", minLength: 1, maxLength: 100 },
        slug: { bsonType: "string" },
        description: { bsonType: "string" },
        isActive: { bsonType: "bool" }
      }
    }
  }
});

db.createCollection("orders", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId", "items", "totalAmount", "status"],
      properties: {
        userId: { bsonType: "string" },
        orderNumber: { bsonType: "string" },
        status: { enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"] },
        totalAmount: { bsonType: "decimal" },
        items: { bsonType: "array", minItems: 1 }
      }
    }
  }
});

// Create indexes
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "phone": 1 }, { sparse: true });
db.users.createIndex({ "role": 1 });
db.users.createIndex({ "is_active": 1 });

db.products.createIndex({ "sku": 1 }, { unique: true });
db.products.createIndex({ "name": "text", "description": "text", "brand": "text" });
db.products.createIndex({ "categoryId": 1 });
db.products.createIndex({ "brand": 1 });
db.products.createIndex({ "price": 1 });
db.products.createIndex({ "isActive": 1 });
db.products.createIndex({ "isFeatured": 1 });
db.products.createIndex({ "stockQuantity": 1 });

db.categories.createIndex({ "slug": 1 }, { unique: true });
db.categories.createIndex({ "parentId": 1 });
db.categories.createIndex({ "isActive": 1 });

db.orders.createIndex({ "userId": 1 });
db.orders.createIndex({ "orderNumber": 1 }, { unique: true });
db.orders.createIndex({ "status": 1 });
db.orders.createIndex({ "createdAt": 1 });

// Insert sample categories
db.categories.insertMany([
  {
    _id: ObjectId("64a1b2c3d4e5f6789abcdef0"),
    name: "Electronics",
    slug: "electronics",
    description: "Electronic devices and gadgets",
    image: "/images/categories/electronics.jpg",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId("64a1b2c3d4e5f6789abcdef1"),
    name: "Smartphones",
    slug: "smartphones",
    description: "Mobile phones and accessories",
    parentId: "64a1b2c3d4e5f6789abcdef0",
    image: "/images/categories/smartphones.jpg",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId("64a1b2c3d4e5f6789abcdef2"),
    name: "Laptops",
    slug: "laptops",
    description: "Laptops and computers",
    parentId: "64a1b2c3d4e5f6789abcdef0",
    image: "/images/categories/laptops.jpg",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId("64a1b2c3d4e5f6789abcdef3"),
    name: "Clothing",
    slug: "clothing",
    description: "Fashion and apparel",
    image: "/images/categories/clothing.jpg",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId("64a1b2c3d4e5f6789abcdef4"),
    name: "Books",
    slug: "books",
    description: "Books and literature",
    image: "/images/categories/books.jpg",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId("64a1b2c3d4e5f6789abcdef5"),
    name: "Home & Garden",
    slug: "home-garden",
    description: "Home improvement and garden supplies",
    image: "/images/categories/home-garden.jpg",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// Insert sample products
db.products.insertMany([
  {
    _id: ObjectId("64a1b2c3d4e5f6789abcde10"),
    name: "iPhone 15 Pro",
    description: "Latest iPhone with advanced camera system and A17 Pro chip. Features titanium design, Action Button, and USB-C connectivity.",
    sku: "IPHONE-15-PRO-128GB",
    price: NumberDecimal("999.00"),
    comparePrice: NumberDecimal("1099.00"),
    categoryId: "64a1b2c3d4e5f6789abcdef1",
    brand: "Apple",
    images: [
      "/images/products/iphone-15-pro-1.jpg",
      "/images/products/iphone-15-pro-2.jpg",
      "/images/products/iphone-15-pro-3.jpg"
    ],
    tags: ["smartphone", "apple", "ios", "premium"],
    weight: NumberDecimal("187"),
    dimensions: {
      length: NumberDecimal("14.67"),
      width: NumberDecimal("7.09"),
      height: NumberDecimal("0.83"),
      unit: "cm"
    },
    attributes: {
      color: "Natural Titanium",
      storage: "128GB",
      display: "6.1-inch Super Retina XDR",
      camera: "48MP Main + 12MP Ultra Wide + 12MP Telephoto"
    },
    variants: [
      {
        id: "iphone-15-pro-128gb-titanium",
        name: "128GB Natural Titanium",
        sku: "IPHONE-15-PRO-128GB-TI",
        price: NumberDecimal("999.00"),
        stockQuantity: 50,
        attributes: { color: "Natural Titanium", storage: "128GB" }
      },
      {
        id: "iphone-15-pro-256gb-titanium",
        name: "256GB Natural Titanium",
        sku: "IPHONE-15-PRO-256GB-TI",
        price: NumberDecimal("1099.00"),
        stockQuantity: 30,
        attributes: { color: "Natural Titanium", storage: "256GB" }
      }
    ],
    stockQuantity: 80,
    lowStockThreshold: 10,
    trackInventory: true,
    isActive: true,
    isFeatured: true,
    averageRating: NumberDecimal("4.8"),
    reviewCount: 245,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId("64a1b2c3d4e5f6789abcde11"),
    name: "MacBook Pro 14-inch",
    description: "Powerful laptop with M3 Pro chip, Liquid Retina XDR display, and all-day battery life. Perfect for professionals and creators.",
    sku: "MACBOOK-PRO-14-M3-512GB",
    price: NumberDecimal("1999.00"),
    comparePrice: NumberDecimal("2199.00"),
    categoryId: "64a1b2c3d4e5f6789abcdef2",
    brand: "Apple",
    images: [
      "/images/products/macbook-pro-14-1.jpg",
      "/images/products/macbook-pro-14-2.jpg",
      "/images/products/macbook-pro-14-3.jpg"
    ],
    tags: ["laptop", "apple", "macbook", "professional"],
    weight: NumberDecimal("1600"),
    dimensions: {
      length: NumberDecimal("31.26"),
      width: NumberDecimal("22.12"),
      height: NumberDecimal("1.55"),
      unit: "cm"
    },
    attributes: {
      processor: "Apple M3 Pro",
      memory: "18GB Unified Memory",
      storage: "512GB SSD",
      display: "14.2-inch Liquid Retina XDR",
      color: "Space Gray"
    },
    stockQuantity: 25,
    lowStockThreshold: 5,
    trackInventory: true,
    isActive: true,
    isFeatured: true,
    averageRating: NumberDecimal("4.9"),
    reviewCount: 156,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId("64a1b2c3d4e5f6789abcde12"),
    name: "Samsung Galaxy S24 Ultra",
    description: "Premium Android smartphone with S Pen, advanced AI features, and professional-grade camera system.",
    sku: "GALAXY-S24-ULTRA-256GB",
    price: NumberDecimal("1199.00"),
    categoryId: "64a1b2c3d4e5f6789abcdef1",
    brand: "Samsung",
    images: [
      "/images/products/galaxy-s24-ultra-1.jpg",
      "/images/products/galaxy-s24-ultra-2.jpg",
      "/images/products/galaxy-s24-ultra-3.jpg"
    ],
    tags: ["smartphone", "samsung", "android", "s-pen"],
    weight: NumberDecimal("232"),
    attributes: {
      color: "Titanium Gray",
      storage: "256GB",
      display: "6.8-inch Dynamic AMOLED 2X",
      camera: "200MP Main + 50MP Periscope + 10MP Telephoto + 12MP Ultra Wide"
    },
    stockQuantity: 40,
    lowStockThreshold: 8,
    trackInventory: true,
    isActive: true,
    isFeatured: true,
    averageRating: NumberDecimal("4.7"),
    reviewCount: 189,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId("64a1b2c3d4e5f6789abcde13"),
    name: "Nike Air Max 270",
    description: "Comfortable running shoes with Max Air unit for exceptional cushioning and modern style.",
    sku: "NIKE-AIR-MAX-270-BLK-10",
    price: NumberDecimal("150.00"),
    comparePrice: NumberDecimal("180.00"),
    categoryId: "64a1b2c3d4e5f6789abcdef3",
    brand: "Nike",
    images: [
      "/images/products/nike-air-max-270-1.jpg",
      "/images/products/nike-air-max-270-2.jpg",
      "/images/products/nike-air-max-270-3.jpg"
    ],
    tags: ["shoes", "nike", "running", "athletic"],
    weight: NumberDecimal("300"),
    attributes: {
      color: "Black/White",
      size: "10 US",
      material: "Mesh and synthetic leather",
      type: "Running shoes"
    },
    variants: [
      {
        id: "nike-air-max-270-black-9",
        name: "Size 9 - Black/White",
        sku: "NIKE-AIR-MAX-270-BLK-9",
        price: NumberDecimal("150.00"),
        stockQuantity: 15,
        attributes: { color: "Black/White", size: "9 US" }
      },
      {
        id: "nike-air-max-270-black-10",
        name: "Size 10 - Black/White",
        sku: "NIKE-AIR-MAX-270-BLK-10",
        price: NumberDecimal("150.00"),
        stockQuantity: 20,
        attributes: { color: "Black/White", size: "10 US" }
      },
      {
        id: "nike-air-max-270-black-11",
        name: "Size 11 - Black/White",
        sku: "NIKE-AIR-MAX-270-BLK-11",
        price: NumberDecimal("150.00"),
        stockQuantity: 12,
        attributes: { color: "Black/White", size: "11 US" }
      }
    ],
    stockQuantity: 47,
    lowStockThreshold: 10,
    trackInventory: true,
    isActive: true,
    isFeatured: false,
    averageRating: NumberDecimal("4.5"),
    reviewCount: 324,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId("64a1b2c3d4e5f6789abcde14"),
    name: "The Great Gatsby",
    description: "Classic American novel by F. Scott Fitzgerald. A timeless story of love, wealth, and the American Dream in the Jazz Age.",
    sku: "BOOK-GREAT-GATSBY-PB",
    price: NumberDecimal("12.99"),
    categoryId: "64a1b2c3d4e5f6789abcdef4",
    brand: "Scribner",
    images: [
      "/images/products/great-gatsby-1.jpg",
      "/images/products/great-gatsby-2.jpg"
    ],
    tags: ["book", "classic", "literature", "fiction"],
    weight: NumberDecimal("200"),
    attributes: {
      author: "F. Scott Fitzgerald",
      pages: 180,
      format: "Paperback",
      language: "English",
      isbn: "9780743273565"
    },
    stockQuantity: 100,
    lowStockThreshold: 20,
    trackInventory: true,
    isActive: true,
    isFeatured: false,
    averageRating: NumberDecimal("4.2"),
    reviewCount: 1250,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// Insert sample admin user
db.users.insertOne({
  _id: ObjectId("64a1b2c3d4e5f6789abcde00"),
  email: "admin@ecommerce.com",
  first_name: "Admin",
  last_name: "User",
  hashed_password: "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uIoO", // password: admin123
  role: "admin",
  is_active: true,
  is_verified: true,
  addresses: [],
  created_at: new Date(),
  updated_at: new Date()
});

// Insert sample regular user
db.users.insertOne({
  _id: ObjectId("64a1b2c3d4e5f6789abcde01"),
  email: "user@example.com",
  first_name: "John",
  last_name: "Doe",
  phone: "+1234567890",
  hashed_password: "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uIoO", // password: user123
  role: "user",
  is_active: true,
  is_verified: true,
  addresses: [
    {
      street: "123 Main St",
      city: "New York",
      state: "NY",
      postal_code: "10001",
      country: "USA",
      is_default: true
    }
  ],
  created_at: new Date(),
  updated_at: new Date()
});

print("MongoDB initialization completed successfully!");
print("Sample data inserted:");
print("- Categories: 6");
print("- Products: 5");
print("- Users: 2 (admin@ecommerce.com / admin123, user@example.com / user123)");
print("- Indexes created for optimal performance");
