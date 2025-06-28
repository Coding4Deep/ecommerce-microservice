const { MongoClient } = require('mongodb');

const sampleProducts = [
  // Electronics
  {
    name: "MacBook Pro 16-inch",
    description: "Apple MacBook Pro with M2 Pro chip, 16GB RAM, 512GB SSD. Perfect for professional work and creative tasks.",
    price: 2499.99,
    categoryId: "Electronics",
    brand: "Apple",
    sku: "MBP-16-M2-512",
    stockQuantity: 15,
    tags: ["laptop", "apple", "macbook", "professional"],
    isActive: true,
    isFeatured: true,
    rating: 4.8,
    reviewCount: 245,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500"
  },
  {
    name: "Dell XPS 13",
    description: "Ultra-thin laptop with Intel Core i7, 16GB RAM, 1TB SSD. Compact design with stunning display.",
    price: 1299.99,
    categoryId: "Electronics",
    brand: "Dell",
    sku: "XPS-13-I7-1TB",
    stockQuantity: 22,
    tags: ["laptop", "dell", "ultrabook", "portable"],
    isActive: true,
    isFeatured: true,
    rating: 4.6,
    reviewCount: 189,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500"
  },
  {
    name: "iPhone 15 Pro",
    description: "Latest iPhone with A17 Pro chip, 128GB storage, Pro camera system with 3x optical zoom.",
    price: 999.99,
    categoryId: "Electronics",
    brand: "Apple",
    sku: "IP15-PRO-128",
    stockQuantity: 45,
    tags: ["smartphone", "apple", "iphone", "mobile"],
    isActive: true,
    isFeatured: true,
    rating: 4.9,
    reviewCount: 567,
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500"
  },
  {
    name: "Samsung Galaxy S24 Ultra",
    description: "Premium Android smartphone with S Pen, 256GB storage, 200MP camera, and 5000mAh battery.",
    price: 1199.99,
    categoryId: "Electronics",
    brand: "Samsung",
    sku: "SGS24-ULTRA-256",
    stockQuantity: 38,
    tags: ["smartphone", "samsung", "galaxy", "android"],
    isActive: true,
    isFeatured: true,
    rating: 4.7,
    reviewCount: 423,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500"
  },
  {
    name: "Sony WH-1000XM5 Headphones",
    description: "Industry-leading noise canceling wireless headphones with 30-hour battery life.",
    price: 399.99,
    categoryId: "Electronics",
    brand: "Sony",
    sku: "WH1000XM5-BLK",
    stockQuantity: 67,
    tags: ["headphones", "sony", "wireless", "noise-canceling"],
    isActive: true,
    isFeatured: false,
    rating: 4.8,
    reviewCount: 892,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"
  },
  {
    name: "iPad Air 5th Gen",
    description: "10.9-inch iPad Air with M1 chip, 64GB storage, perfect for creativity and productivity.",
    price: 599.99,
    categoryId: "Electronics",
    brand: "Apple",
    sku: "IPAD-AIR5-64",
    stockQuantity: 29,
    tags: ["tablet", "apple", "ipad", "creative"],
    isActive: true,
    isFeatured: false,
    rating: 4.7,
    reviewCount: 334,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500"
  },
  {
    name: "Nintendo Switch OLED",
    description: "Gaming console with vibrant 7-inch OLED screen, enhanced audio, and 64GB internal storage.",
    price: 349.99,
    categoryId: "Electronics",
    brand: "Nintendo",
    sku: "NSW-OLED-WHT",
    stockQuantity: 41,
    tags: ["gaming", "nintendo", "console", "portable"],
    isActive: true,
    isFeatured: true,
    rating: 4.6,
    reviewCount: 756,
    image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500"
  },
  {
    name: "LG 27-inch 4K Monitor",
    description: "27-inch UltraFine 4K display with USB-C connectivity, perfect for Mac and PC users.",
    price: 699.99,
    categoryId: "Electronics",
    brand: "LG",
    sku: "LG-27UK850-W",
    stockQuantity: 18,
    tags: ["monitor", "4k", "display", "usb-c"],
    isActive: true,
    isFeatured: false,
    rating: 4.5,
    reviewCount: 267,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500"
  },

  // Clothing
  {
    name: "Levi's 501 Original Jeans",
    description: "Classic straight-leg jeans in medium wash. Timeless style that never goes out of fashion.",
    price: 89.99,
    categoryId: "Clothing",
    brand: "Levi's",
    sku: "LEVI-501-MW-32",
    stockQuantity: 156,
    tags: ["jeans", "denim", "classic", "casual"],
    isActive: true,
    isFeatured: false,
    rating: 4.4,
    reviewCount: 1234,
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500"
  },
  {
    name: "Nike Air Force 1 Sneakers",
    description: "Iconic basketball shoes with classic white leather upper and Air-Sole unit for comfort.",
    price: 110.99,
    categoryId: "Clothing",
    brand: "Nike",
    sku: "AF1-WHT-10",
    stockQuantity: 89,
    tags: ["sneakers", "nike", "basketball", "white"],
    isActive: true,
    isFeatured: true,
    rating: 4.7,
    reviewCount: 2156,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500"
  },
  {
    name: "Adidas Ultraboost 22",
    description: "Premium running shoes with Boost midsole technology for energy return and comfort.",
    price: 189.99,
    categoryId: "Clothing",
    brand: "Adidas",
    sku: "UB22-BLK-9",
    stockQuantity: 73,
    tags: ["running", "adidas", "boost", "athletic"],
    isActive: true,
    isFeatured: true,
    rating: 4.6,
    reviewCount: 987,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500"
  },
  {
    name: "Champion Reverse Weave Hoodie",
    description: "Classic pullover hoodie in heavyweight fleece with iconic Champion logo.",
    price: 65.99,
    categoryId: "Clothing",
    brand: "Champion",
    sku: "CHAMP-RW-GRY-L",
    stockQuantity: 124,
    tags: ["hoodie", "champion", "casual", "streetwear"],
    isActive: true,
    isFeatured: false,
    rating: 4.3,
    reviewCount: 456,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500"
  },
  {
    name: "Ralph Lauren Polo Shirt",
    description: "Classic fit polo shirt in 100% cotton with signature embroidered pony logo.",
    price: 89.99,
    categoryId: "Clothing",
    brand: "Ralph Lauren",
    sku: "RL-POLO-NVY-M",
    stockQuantity: 98,
    tags: ["polo", "ralph lauren", "classic", "cotton"],
    isActive: true,
    isFeatured: false,
    rating: 4.5,
    reviewCount: 678,
    image: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=500"
  },

  // Books
  {
    name: "The Psychology of Programming",
    description: "Essential reading for software developers. Explores the human factors in software development.",
    price: 34.99,
    categoryId: "Books",
    brand: "Tech Books",
    sku: "PSYC-PROG-2024",
    stockQuantity: 87,
    tags: ["programming", "psychology", "software", "development"],
    isActive: true,
    isFeatured: true,
    rating: 4.8,
    reviewCount: 234,
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500"
  },
  {
    name: "Clean Code: A Handbook",
    description: "A handbook of agile software craftsmanship by Robert C. Martin. Essential for every programmer.",
    price: 42.99,
    categoryId: "Books",
    brand: "Tech Books",
    sku: "CLEAN-CODE-HC",
    stockQuantity: 156,
    tags: ["programming", "clean code", "software", "craftsmanship"],
    isActive: true,
    isFeatured: true,
    rating: 4.9,
    reviewCount: 1567,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500"
  },
  {
    name: "JavaScript: The Good Parts",
    description: "Douglas Crockford's guide to the beautiful, elegant, lightweight parts of JavaScript.",
    price: 29.99,
    categoryId: "Books",
    brand: "Tech Books",
    sku: "JS-GOOD-PARTS",
    stockQuantity: 203,
    tags: ["javascript", "programming", "web development"],
    isActive: true,
    isFeatured: false,
    rating: 4.6,
    reviewCount: 892,
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500"
  },
  {
    name: "Design Patterns: Elements",
    description: "Gang of Four's classic book on design patterns in object-oriented programming.",
    price: 54.99,
    categoryId: "Books",
    brand: "Tech Books",
    sku: "DESIGN-PATTERNS",
    stockQuantity: 67,
    tags: ["design patterns", "oop", "software architecture"],
    isActive: true,
    isFeatured: false,
    rating: 4.7,
    reviewCount: 445,
    image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500"
  },

  // Home & Garden
  {
    name: "Dyson V15 Detect Vacuum",
    description: "Cordless vacuum with laser dust detection and powerful suction for deep cleaning.",
    price: 749.99,
    categoryId: "Home & Garden",
    brand: "Dyson",
    sku: "DYS-V15-DETECT",
    stockQuantity: 34,
    tags: ["vacuum", "cordless", "cleaning", "dyson"],
    isActive: true,
    isFeatured: true,
    rating: 4.8,
    reviewCount: 567,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500"
  },
  {
    name: "Instant Pot Duo 7-in-1",
    description: "Multi-use pressure cooker that replaces 7 kitchen appliances. 6-quart capacity.",
    price: 99.99,
    categoryId: "Home & Garden",
    brand: "Instant Pot",
    sku: "IP-DUO-6QT",
    stockQuantity: 78,
    tags: ["pressure cooker", "kitchen", "appliance", "cooking"],
    isActive: true,
    isFeatured: true,
    rating: 4.7,
    reviewCount: 3456,
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500"
  },
  {
    name: "KitchenAid Stand Mixer",
    description: "5-quart tilt-head stand mixer with 10 speeds and multiple attachments included.",
    price: 379.99,
    categoryId: "Home & Garden",
    brand: "KitchenAid",
    sku: "KA-MIXER-5QT-RED",
    stockQuantity: 23,
    tags: ["mixer", "baking", "kitchen", "kitchenaid"],
    isActive: true,
    isFeatured: false,
    rating: 4.9,
    reviewCount: 1234,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500"
  },
  {
    name: "Philips Hue Smart Bulbs",
    description: "4-pack of color-changing smart LED bulbs compatible with Alexa and Google Assistant.",
    price: 199.99,
    categoryId: "Home & Garden",
    brand: "Philips",
    sku: "HUE-COLOR-4PK",
    stockQuantity: 145,
    tags: ["smart home", "led", "lighting", "philips"],
    isActive: true,
    isFeatured: false,
    rating: 4.6,
    reviewCount: 789,
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=500"
  },
  {
    name: "Weber Genesis II Gas Grill",
    description: "3-burner gas grill with porcelain-enameled cast iron grates and built-in thermometer.",
    price: 899.99,
    categoryId: "Home & Garden",
    brand: "Weber",
    sku: "WEB-GEN2-3B",
    stockQuantity: 12,
    tags: ["grill", "bbq", "outdoor", "weber"],
    isActive: true,
    isFeatured: true,
    rating: 4.8,
    reviewCount: 345,
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=500"
  },

  // Sports
  {
    name: "Peloton Bike+",
    description: "Indoor exercise bike with 22-inch rotating HD touchscreen and access to live classes.",
    price: 2495.99,
    categoryId: "Sports",
    brand: "Peloton",
    sku: "PELO-BIKE-PLUS",
    stockQuantity: 8,
    tags: ["exercise bike", "fitness", "peloton", "cardio"],
    isActive: true,
    isFeatured: true,
    rating: 4.7,
    reviewCount: 1567,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500"
  },
  {
    name: "NordicTrack Treadmill",
    description: "Commercial-grade treadmill with 22-inch touchscreen and iFit membership included.",
    price: 1999.99,
    categoryId: "Sports",
    brand: "NordicTrack",
    sku: "NT-TREAD-2024",
    stockQuantity: 15,
    tags: ["treadmill", "running", "fitness", "cardio"],
    isActive: true,
    isFeatured: true,
    rating: 4.5,
    reviewCount: 678,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500"
  },
  {
    name: "Bowflex SelectTech Dumbbells",
    description: "Adjustable dumbbells that replace 15 sets of weights. Space-saving home gym solution.",
    price: 549.99,
    categoryId: "Sports",
    brand: "Bowflex",
    sku: "BF-SELECT-552",
    stockQuantity: 34,
    tags: ["dumbbells", "weights", "strength", "home gym"],
    isActive: true,
    isFeatured: false,
    rating: 4.6,
    reviewCount: 892,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500"
  },
  {
    name: "Yeti Rambler Tumbler",
    description: "30oz stainless steel tumbler with MagSlider lid. Keeps drinks cold for 24+ hours.",
    price: 39.99,
    categoryId: "Sports",
    brand: "Yeti",
    sku: "YETI-RAMB-30OZ",
    stockQuantity: 267,
    tags: ["tumbler", "insulated", "yeti", "drinkware"],
    isActive: true,
    isFeatured: false,
    rating: 4.8,
    reviewCount: 1456,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500"
  },
  {
    name: "Wilson Tennis Racket Pro",
    description: "Professional tennis racket with 100 sq in head size, perfect for intermediate to advanced players.",
    price: 189.99,
    categoryId: "Sports",
    brand: "Wilson",
    sku: "WIL-TENNIS-PRO",
    stockQuantity: 45,
    tags: ["tennis", "racket", "wilson", "sports"],
    isActive: true,
    isFeatured: false,
    rating: 4.4,
    reviewCount: 234,
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500"
  },

  // Additional Electronics
  {
    name: "AirPods Pro 2nd Gen",
    description: "Active noise cancellation wireless earbuds with spatial audio and MagSafe charging case.",
    price: 249.99,
    categoryId: "Electronics",
    brand: "Apple",
    sku: "APP-2GEN-WHT",
    stockQuantity: 156,
    tags: ["earbuds", "apple", "wireless", "noise-canceling"],
    isActive: true,
    isFeatured: true,
    rating: 4.8,
    reviewCount: 2345,
    image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=500"
  },
  {
    name: "Samsung 55-inch QLED TV",
    description: "4K QLED Smart TV with Quantum HDR and built-in streaming apps.",
    price: 1299.99,
    categoryId: "Electronics",
    brand: "Samsung",
    sku: "SAM-QLED-55",
    stockQuantity: 23,
    tags: ["tv", "4k", "qled", "smart tv"],
    isActive: true,
    isFeatured: true,
    rating: 4.7,
    reviewCount: 567,
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500"
  },
  {
    name: "Canon EOS R5 Camera",
    description: "Full-frame mirrorless camera with 45MP sensor and 8K video recording capability.",
    price: 3899.99,
    categoryId: "Electronics",
    brand: "Canon",
    sku: "CAN-R5-BODY",
    stockQuantity: 7,
    tags: ["camera", "mirrorless", "photography", "professional"],
    isActive: true,
    isFeatured: true,
    rating: 4.9,
    reviewCount: 123,
    image: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=500"
  },
  {
    name: "Mechanical Gaming Keyboard",
    description: "RGB backlit mechanical keyboard with Cherry MX switches, perfect for gaming and typing.",
    price: 159.99,
    categoryId: "Electronics",
    brand: "Corsair",
    sku: "CORS-K95-RGB",
    stockQuantity: 89,
    tags: ["keyboard", "mechanical", "gaming", "rgb"],
    isActive: true,
    isFeatured: false,
    rating: 4.6,
    reviewCount: 456,
    image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500"
  },
  {
    name: "Wireless Gaming Mouse",
    description: "High-precision wireless gaming mouse with 25,600 DPI sensor and 70-hour battery life.",
    price: 99.99,
    categoryId: "Electronics",
    brand: "Logitech",
    sku: "LOG-G502-WIRE",
    stockQuantity: 134,
    tags: ["mouse", "gaming", "wireless", "precision"],
    isActive: true,
    isFeatured: false,
    rating: 4.7,
    reviewCount: 789,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500"
  }
];

async function createSampleProducts() {
  const client = new MongoClient('mongodb://admin:password123@localhost:27017/?authSource=admin');
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('ecommerce');
    const collection = db.collection('products');
    
    // Clear existing products
    await collection.deleteMany({});
    console.log('Cleared existing products');
    
    // Add timestamps and created by info
    const productsWithTimestamps = sampleProducts.map(product => ({
      ...product,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'system',
      soldCount: Math.floor(Math.random() * 100),
      isFeatured: product.isFeatured || false,
      rating: product.rating || 4.0 + Math.random(),
      reviewCount: product.reviewCount || Math.floor(Math.random() * 500)
    }));
    
    // Insert sample products
    const result = await collection.insertMany(productsWithTimestamps);
    console.log(`Inserted ${result.insertedCount} sample products`);
    
    // Create indexes for better performance
    await collection.createIndex({ name: 'text', description: 'text' });
    await collection.createIndex({ categoryId: 1 });
    await collection.createIndex({ brand: 1 });
    await collection.createIndex({ isActive: 1 });
    await collection.createIndex({ isFeatured: 1 });
    
    console.log('Created search indexes');
    
  } catch (error) {
    console.error('Error creating sample products:', error);
  } finally {
    await client.close();
  }
}

createSampleProducts();
