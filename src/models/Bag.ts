import mongoose, { Document, Schema } from 'mongoose';

export interface IBag extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

const bagSchema = new Schema<IBag>(
  {
    name: {
      type: String,
      required: [true, 'Bag name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      enum: {
        values: ['handbag', 'backpack', 'crossbody', 'tote', 'clutch', 'messenger', 'duffel', 'laptop'],
        message: '{VALUE} is not a valid category',
      },
    },
    image: {
      type: String,
      required: [true, 'Image URL is required'],
      trim: true,
    },
    stock: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for search and filtering
bagSchema.index({ name: 'text', description: 'text' });
bagSchema.index({ category: 1 });
bagSchema.index({ price: 1 });

export const Bag = mongoose.model<IBag>('Bag', bagSchema);
