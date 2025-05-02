import express from 'express';
import { Restaurant } from '../models/Restaurant';
import { LocationTag } from '../models/LocationTag';

const router = express.Router();

// Search restaurants
router.get('/search', async (req, res) => {
  try {
    const { name, location, cuisineType, rating } = req.query;
    const query: any = {};

    if (name) query.name = { $regex: name, $options: 'i' };
    if (location) query.location = { $regex: location, $options: 'i' };
    if (cuisineType) query.cuisineType = { $regex: cuisineType, $options: 'i' };
    if (rating) query.rating = rating;

    const restaurants = await Restaurant.find(query);
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: 'Error searching restaurants' });
  }
});

// Get all restaurants
router.get('/', async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching restaurants' });
  }
});

// Get a single restaurant
router.get('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      res.status(404).json({ error: 'Restaurant not found' });
      return;
    }
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching restaurant' });
  }
});

// Add a new restaurant
router.post('/', async (req, res) => {
  try {
    const restaurant = new Restaurant(req.body);
    const savedRestaurant = await restaurant.save();
    res.status(201).json(savedRestaurant);
  } catch (error) {
    res.status(400).json({ message: 'Error creating restaurant' });
  }
});

// Update a restaurant
router.put('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.json(restaurant);
  } catch (error) {
    res.status(400).json({ message: 'Error updating restaurant' });
  }
});

// Delete a restaurant
router.delete('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.json({ message: 'Restaurant deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting restaurant' });
  }
});

export default router; 