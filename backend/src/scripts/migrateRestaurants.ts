import mongoose from 'mongoose';
import { Restaurant } from '../models/Restaurant';
import dotenv from 'dotenv';

dotenv.config();

async function migrateRestaurants() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/restaurant-tracker');
    console.log('Connected to MongoDB');

    // Update all restaurants that don't have a deleted field
    const result = await Restaurant.updateMany(
      { deleted: { $exists: false } },
      { $set: { deleted: false } }
    );

    console.log(`Updated ${result.modifiedCount} restaurants`);
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    // Close the MongoDB connection
    await mongoose.connection.close();
    console.log('Disconnected from MongoDB');
  }
}

// Run the migration
migrateRestaurants(); 