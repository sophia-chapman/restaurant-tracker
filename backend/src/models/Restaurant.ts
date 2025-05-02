import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: [String],
    required: false,
  },
  vibeTags: {
    type: [String],
    required: false,
    default: [],
  },
  cuisineType: {
    type: String,
    required: false,
  },
  rating: {
    type: String,
    enum: ['good', 'okay', 'bad'],
    required: true,
  },
  order: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  visitedDate: {
    type: Date,
    required: true,
  },
  favorite: {
    type: Boolean,
    required: true,
    default: false,
  },
  deleted: {
    type: Boolean,
    required: true,
    default: false,
  },
}, {
  timestamps: true,
});

export const Restaurant = mongoose.model('Restaurant', restaurantSchema); 