import mongoose from 'mongoose';

const recommendationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: [String],
    required: false,
  },
  cuisineType: {
    type: String,
    required: false,
  },
  recommendedBy: {
    type: String,
    required: false,
  },
  notes: {
    type: String,
    required: false,
  },
}, {
  timestamps: true,
});

export const Recommendation = mongoose.model('Recommendation', recommendationSchema); 