import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    price: { type: Number, required: true, min: 0 },
    thumbnail: { type: String },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'category', index: true },
    discount: { type: Number, default: 0, min: 0, max: 100 }, // Phần trăm giảm giá
    views: { type: Number, default: 0, min: 0 }, // Lượt xem
    description: { type: String }, // Mô tả sản phẩm
    stock: { type: Number, default: 0, min: 0 }, // Số lượng tồn kho
  },
  { timestamps: true }
);

const Product = mongoose.model('product', productSchema);
export default Product;


