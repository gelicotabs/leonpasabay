import mongoose, { Schema, model } from 'mongoose';

// Define the subschemas for specifications and images
const specificationSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  { _id: false }
);

const imageSchema = new Schema(
  {
    public_id: { type: String, required: true },
    url: { type: String, required: true },
  },
  { _id: false }
);

// Unified Product Schema
const productSchema = new Schema(
  {
    // Optional field to track who created the product if needed.
    user: { type: Schema.Types.ObjectId, ref: 'User' },

    // Seller is required.
    seller: { type: Schema.Types.ObjectId, required: true, ref: 'User' },

    // Category reference (adjust ref string if your collection name differs)
    category: { type: Schema.Types.ObjectId, required: true, ref: 'Category' },

    // Basic product info
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },

    // Additional fields from the second schema
    size: { type: String, enum: ['SMALL', 'MEDIUM', 'LARGE'] },
    barcode: { type: String },

    // Pricing, stock, and discount information
    price: { type: Number, required: true },
    discountPrice: { type: Number, required: true },
    stock: { type: Number, required: true },
    warranty: { type: Number, default: 1 },

    // Arrays for product highlights and specifications
    highlights: { type: [String], required: true },
    specifications: { type: [specificationSchema], required: true },

    // Images using the defined imageSchema
    images: { type: [imageSchema], required: true },

    // Brand as a reference (change to an embedded document if desired)
    brand: { type: Schema.Types.ObjectId, required: true, ref: 'Brand' },

    // Review fields
    ratings: { type: Number, default: 0 },
    numOfReviews: { type: Number, default: 0 },
    reviews: [
      {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        name: { type: String, required: true },
        rating: { type: Number, required: true },
        comment: { type: String, required: true },
      },
    ],
  },
  { timestamps: true } // This will automatically add createdAt and updatedAt fields
);

// Export the model
export default model('Product', productSchema);
