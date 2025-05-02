import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: [String],
    required: true,
  },
  vibeTags: {
    type: [String],
    required: true,
    default: [],
  },
  cuisineType: {
    type: String,
    required: true,
  },
  rating: {
    type: String,
    enum: ['good', 'okay', 'bad'],
    required: true,
  },
  order: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
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
}, {
  timestamps: true,
});

export const Restaurant = mongoose.model('Restaurant', restaurantSchema); 