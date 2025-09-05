import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    price: { type: Number, required: true, min: 0 },
    thumbnail: { type: String },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'category', index: true },
  },
  { timestamps: true }
);

const Product = mongoose.model('product', productSchema);
export default Product;


