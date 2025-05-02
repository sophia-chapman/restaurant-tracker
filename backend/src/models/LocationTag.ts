import mongoose from 'mongoose';

const locationTagSchema = new mongoose.Schema({
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

export const LocationTag = mongoose.model('LocationTag', locationTagSchema); 