import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import restaurantRoutes from './routes/restaurants';
import locationTagsRouter from './routes/locationTags';
import vibeTagsRouter from './routes/vibeTags';
import recommendationsRouter from './routes/recommendations';
import { Restaurant } from './models/Restaurant';
import { Recommendation } from './models/Recommendation';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Get CORS origins from environment variables
const CORS_ORIGINS = process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : ['http://localhost:8081'];

// CORS configuration
app.use(cors({
  origin: CORS_ORIGINS,
  credentials: true
}));

// Middleware
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined in environment variables');
}

mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 5000,
  retryWrites: true,
  w: 'majority'
})
.then(() => {
  console.log('Connected to MongoDB successfully');
  
  // Drop existing text indexes
  return Restaurant.collection.dropIndexes();
})
.then(() => {
  console.log('Dropped existing indexes');
  
  // Create new compound text index
  return Restaurant.collection.createIndex(
    { name: 'text', location: 'text', vibeTags: 'text', cuisineType: 'text' },
    { weights: { name: 3, location: 2, vibeTags: 2, cuisineType: 1 } }
  );
})
.then(() => {
  console.log('Text index created successfully');
  
  // Routes
  app.use('/api/restaurants', restaurantRoutes);
  app.use('/api/location-tags', locationTagsRouter);
  app.use('/api/vibe-tags', vibeTagsRouter);
  app.use('/api/recommendations', recommendationsRouter);
  
  // Start server
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
  });
})
.catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
}); 