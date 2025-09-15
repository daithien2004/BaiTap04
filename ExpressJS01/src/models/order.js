import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
      index: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'product',
          required: true,
        },
        qty: { type: Number, default: 1, min: 1 },
        price: { type: Number, required: true },
      },
    ],
    status: { type: String, default: 'created' },
  },
  { timestamps: true }
);

const Order = mongoose.model('order', orderSchema);
export default Order;
