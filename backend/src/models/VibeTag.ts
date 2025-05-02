import mongoose from 'mongoose';

const vibeTagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  usageCount: {
    type: Number,
    default: 1,
  },
}, {
  timestamps: true,
});

export const VibeTag = mongoose.model('VibeTag', vibeTagSchema); 