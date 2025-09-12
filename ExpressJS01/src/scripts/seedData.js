// seed.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from '../models/category.js';
import Product from '../models/product.js';
import { Client } from '@elastic/elasticsearch';

dotenv.config({ path: '../.env' });

// --- Elasticsearch client ---
const esClient = new Client({
  node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
});

// --- Sample data ---
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
  {
    name: 'Asus ROG Zephyrus G14',
    slug: 'asus-rog-zephyrus-g14',
    price: 39000000,
    thumbnail: 'https://via.placeholder.com/300x200?text=ROG+Zephyrus+G14',
    description: 'Laptop gaming ROG Zephyrus G14 với RTX 4070',
    discount: 10,
    stock: 10,
    views: 1750,
  },
  {
    name: 'Lenovo ThinkPad X1 Carbon',
    slug: 'lenovo-thinkpad-x1-carbon',
    price: 32000000,
    thumbnail: 'https://via.placeholder.com/300x200?text=ThinkPad+X1+Carbon',
    description: 'Laptop doanh nhân ThinkPad X1 Carbon bền bỉ',
    discount: 5,
    stock: 14,
    views: 600,
  },
  {
    name: 'Canon EOS R6 Mark II',
    slug: 'canon-eos-r6-mark-ii',
    price: 52000000,
    thumbnail: 'https://via.placeholder.com/300x200?text=Canon+EOS+R6+II',
    description: 'Máy ảnh full-frame Canon EOS R6 Mark II',
    discount: 0,
    stock: 8,
    views: 900,
  },
  {
    name: 'Sony A7 IV',
    slug: 'sony-a7-iv',
    price: 48000000,
    thumbnail: 'https://via.placeholder.com/300x200?text=Sony+A7+IV',
    description: 'Máy ảnh mirrorless Sony A7 IV đa năng',
    discount: 12,
    stock: 6,
    views: 1150,
  },
  {
    name: 'Nintendo Switch OLED',
    slug: 'nintendo-switch-oled',
    price: 9500000,
    thumbnail: 'https://via.placeholder.com/300x200?text=Switch+OLED',
    description: 'Máy chơi game Nintendo Switch OLED',
    discount: 5,
    stock: 60,
    views: 2500,
  },
  {
    name: 'PlayStation 5',
    slug: 'playstation-5',
    price: 16000000,
    thumbnail: 'https://via.placeholder.com/300x200?text=PlayStation+5',
    description: 'Máy chơi game Sony PlayStation 5',
    discount: 0,
    stock: 35,
    views: 3100,
  },
  {
    name: 'Xbox Series X',
    slug: 'xbox-series-x',
    price: 15000000,
    thumbnail: 'https://via.placeholder.com/300x200?text=Xbox+Series+X',
    description: 'Máy chơi game Xbox Series X mạnh mẽ',
    discount: 10,
    stock: 28,
    views: 2000,
  },
  {
    name: 'LG OLED C3 55 inch',
    slug: 'lg-oled-c3-55',
    price: 32000000,
    thumbnail: 'https://via.placeholder.com/300x200?text=LG+OLED+C3',
    description: 'TV LG OLED C3 55 inch 4K',
    discount: 15,
    stock: 12,
    views: 1450,
  },
  {
    name: 'Samsung Neo QLED 65 inch',
    slug: 'samsung-neo-qled-65',
    price: 37000000,
    thumbnail: 'https://via.placeholder.com/300x200?text=Samsung+Neo+QLED+65',
    description: 'TV Samsung Neo QLED 65 inch 8K',
    discount: 8,
    stock: 9,
    views: 1300,
  },
  {
    name: 'Bose SoundLink Revolve+',
    slug: 'bose-soundlink-revolve-plus',
    price: 7000000,
    thumbnail: 'https://via.placeholder.com/300x200?text=Bose+Revolve+Plus',
    description: 'Loa di động Bose SoundLink Revolve+ 360 độ',
    discount: 10,
    stock: 40,
    views: 2200,
  },
  {
    name: 'JBL Charge 5',
    slug: 'jbl-charge-5',
    price: 4500000,
    thumbnail: 'https://via.placeholder.com/300x200?text=JBL+Charge+5',
    description: 'Loa Bluetooth JBL Charge 5 chống nước',
    discount: 15,
    stock: 70,
    views: 1800,
  },
  {
    name: 'GoPro Hero 12 Black',
    slug: 'gopro-hero-12-black',
    price: 12000000,
    thumbnail: 'https://via.placeholder.com/300x200?text=GoPro+Hero+12',
    description: 'Camera hành trình GoPro Hero 12 Black',
    discount: 10,
    stock: 25,
    views: 1400,
  },
  {
    name: 'DJI Mini 4 Pro',
    slug: 'dji-mini-4-pro',
    price: 22000000,
    thumbnail: 'https://via.placeholder.com/300x200?text=DJI+Mini+4+Pro',
    description: 'Flycam DJI Mini 4 Pro nhỏ gọn',
    discount: 5,
    stock: 15,
    views: 950,
  },
  {
    name: 'Kindle Paperwhite 11th Gen',
    slug: 'kindle-paperwhite-11',
    price: 3500000,
    thumbnail: 'https://via.placeholder.com/300x200?text=Kindle+Paperwhite',
    description: 'Máy đọc sách Kindle Paperwhite thế hệ 11',
    discount: 0,
    stock: 80,
    views: 1250,
  },
];


// --- Seed function ---
const seedData = async () => {
  try {
    // 1. Kết nối MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/fullstack02'
    );
    console.log('✅ Connected to MongoDB');

    // 2. Xóa dữ liệu cũ Mongo
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('🗑 Cleared existing Mongo data');

    // 3. Tạo categories
    const createdCategories = await Category.insertMany(categories);
    console.log(`📂 Created categories: ${createdCategories.length}`);

    // 4. Tạo products với categoryId
    const productsWithCategories = products.map((product, index) => {
      const categoryIndex = index % createdCategories.length;
      return {
        ...product,
        categoryId: createdCategories[categoryIndex]._id,
      };
    });

    const createdProducts = await Product.insertMany(productsWithCategories);
    console.log(`📦 Created products: ${createdProducts.length}`);

    // 5. Kiểm tra và tạo index Elasticsearch nếu chưa có
    const indexExists = await esClient.indices.exists({ index: 'products' });
    if (!indexExists) {
      await esClient.indices.create({
        index: 'products',
        body: {
          mappings: {
            properties: {
              name: { type: 'text' },
              slug: { type: 'keyword' },
              description: { type: 'text' },
              price: { type: 'float' },
              discount: { type: 'integer' },
              stock: { type: 'integer' },
              views: { type: 'integer' },
              thumbnail: { type: 'keyword' },
              categoryId: { type: 'keyword' },
            },
          },
        },
      });
      console.log('🗂 Elasticsearch index "products" created');
    } else {
      console.log('🗂 Elasticsearch index "products" already exists');
    }

    // 6. Index products sang Elasticsearch
    for (const product of createdProducts) {
      await esClient.index({
        index: 'products',
        id: product._id.toString(),
        body: {
          name: product.name,
          slug: product.slug,
          price: product.price,
          description: product.description,
          thumbnail: product.thumbnail,
          discount: product.discount,
          stock: product.stock,
          views: product.views,
          categoryId: product.categoryId.toString(),
        },
      });
    }
    console.log('✅ Indexed products into Elasticsearch');
  } catch (err) {
    console.error('❌ Error seeding data:', err);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

// --- Run seed ---
seedData();
