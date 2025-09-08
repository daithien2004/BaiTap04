import mongoose from 'mongoose';
import Category from '../models/category.js';
import Product from '../models/product.js';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const categories = [
  { name: 'Điện thoại', slug: 'dien-thoai', description: 'Điện thoại di động' },
  { name: 'Laptop', slug: 'laptop', description: 'Máy tính xách tay' },
  { name: 'Phụ kiện', slug: 'phu-kien', description: 'Phụ kiện điện tử' },
  { name: 'Đồng hồ', slug: 'dong-ho', description: 'Đồng hồ thông minh' },
];

const products = [
  {
    name: 'iPhone 15 Pro Max',
    slug: 'iphone-15-pro-max',
    price: 35000000,
    thumbnail: 'https://via.placeholder.com/300x200?text=iPhone+15+Pro+Max',
    description: 'iPhone 15 Pro Max với chip A17 Pro mạnh mẽ',
    discount: 10,
    stock: 50,
    views: 1250,
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    slug: 'samsung-galaxy-s24-ultra',
    price: 32000000,
    thumbnail: 'https://via.placeholder.com/300x200?text=Galaxy+S24+Ultra',
    description: 'Samsung Galaxy S24 Ultra với camera 200MP',
    discount: 15,
    stock: 30,
    views: 980,
  },
  {
    name: 'MacBook Pro M3',
    slug: 'macbook-pro-m3',
    price: 45000000,
    thumbnail: 'https://via.placeholder.com/300x200?text=MacBook+Pro+M3',
    description: 'MacBook Pro với chip M3 mạnh mẽ',
    discount: 5,
    stock: 20,
    views: 2100,
  },
  {
    name: 'Dell XPS 13',
    slug: 'dell-xps-13',
    price: 28000000,
    thumbnail: 'https://via.placeholder.com/300x200?text=Dell+XPS+13',
    description: 'Dell XPS 13 với thiết kế cao cấp',
    discount: 0,
    stock: 15,
    views: 750,
  },
  {
    name: 'AirPods Pro 2',
    slug: 'airpods-pro-2',
    price: 6500000,
    thumbnail: 'https://via.placeholder.com/300x200?text=AirPods+Pro+2',
    description: 'AirPods Pro 2 với chống ồn chủ động',
    discount: 20,
    stock: 100,
    views: 3200,
  },
  {
    name: 'Sony WH-1000XM5',
    slug: 'sony-wh-1000xm5',
    price: 8500000,
    thumbnail: 'https://via.placeholder.com/300x200?text=Sony+WH-1000XM5',
    description: 'Tai nghe Sony WH-1000XM5 chống ồn tốt nhất',
    discount: 12,
    stock: 25,
    views: 1800,
  },
  {
    name: 'Apple Watch Series 9',
    slug: 'apple-watch-series-9',
    price: 12000000,
    thumbnail: 'https://via.placeholder.com/300x200?text=Apple+Watch+Series+9',
    description: 'Apple Watch Series 9 với nhiều tính năng mới',
    discount: 8,
    stock: 40,
    views: 1500,
  },
  {
    name: 'Samsung Galaxy Watch 6',
    slug: 'samsung-galaxy-watch-6',
    price: 9500000,
    thumbnail: 'https://via.placeholder.com/300x200?text=Galaxy+Watch+6',
    description: 'Samsung Galaxy Watch 6 với thiết kế đẹp',
    discount: 0,
    stock: 35,
    views: 650,
  },
  {
    name: 'iPad Pro M2',
    slug: 'ipad-pro-m2',
    price: 25000000,
    thumbnail: 'https://via.placeholder.com/300x200?text=iPad+Pro+M2',
    description: 'iPad Pro với chip M2 mạnh mẽ',
    discount: 7,
    stock: 18,
    views: 1100,
  },
  {
    name: 'Surface Pro 9',
    slug: 'surface-pro-9',
    price: 22000000,
    thumbnail: 'https://via.placeholder.com/300x200?text=Surface+Pro+9',
    description: 'Microsoft Surface Pro 9 2-in-1',
    discount: 0,
    stock: 12,
    views: 420,
  },
];

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fullstack02');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared existing data');

    // Create categories
    const createdCategories = await Category.insertMany(categories);
    console.log('Created categories:', createdCategories.length);

    // Create products with category references
    const productsWithCategories = products.map((product, index) => {
      const categoryIndex = index % createdCategories.length;
      return {
        ...product,
        categoryId: createdCategories[categoryIndex]._id,
      };
    });

    const createdProducts = await Product.insertMany(productsWithCategories);
    console.log('Created products:', createdProducts.length);

    console.log('✅ Seed data completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

seedData();
