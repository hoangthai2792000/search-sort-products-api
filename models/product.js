const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'product name must be provided'],
  },
  price: {
    type: Number,
    required: [true, 'product price must be provided'],
  },
  brand: {
    type: String,
    enum: {
      values: ['Apple', 'Samsung', 'Xiaomi', 'Oppo'],
      message: `{VALUE} is not supported`,
    },
  },
  featured: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  createAt: {
    type: Date,
    default: Date.now(),
  },
})

module.exports = mongoose.model('Product', productSchema)
