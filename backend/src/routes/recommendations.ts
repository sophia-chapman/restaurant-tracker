import express from 'express';
import { Recommendation } from '../models/Recommendation';

const router = express.Router();

// Search recommendations
router.get('/search', async (req, res) => {
  try {
    const { name, location, cuisineType, recommendedBy } = req.query;
    const query: any = {};

    if (name) query.name = { $regex: name, $options: 'i' };
    if (location) query.location = { $regex: location, $options: 'i' };
    if (cuisineType) query.cuisineType = { $regex: cuisineType, $options: 'i' };
    if (recommendedBy) query.recommendedBy = { $regex: recommendedBy, $options: 'i' };

    const recommendations = await Recommendation.find(query);
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ message: 'Error searching recommendations' });
  }
});

// Get all recommendations
router.get('/', async (req, res) => {
  try {
    const recommendations = await Recommendation.find();
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recommendations' });
  }
});

// Get a single recommendation
router.get('/:id', async (req, res) => {
  try {
    const recommendation = await Recommendation.findById(req.params.id);
    if (!recommendation) {
      res.status(404).json({ error: 'Recommendation not found' });
      return;
    }
    res.json(recommendation);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recommendation' });
  }
});

// Add a new recommendation
router.post('/', async (req, res) => {
  try {
    const recommendation = new Recommendation(req.body);
    const savedRecommendation = await recommendation.save();
    res.status(201).json(savedRecommendation);
  } catch (error) {
    res.status(400).json({ message: 'Error creating recommendation' });
  }
});

// Update a recommendation
router.put('/:id', async (req, res) => {
  try {
    const recommendation = await Recommendation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!recommendation) {
      return res.status(404).json({ message: 'Recommendation not found' });
    }
    res.json(recommendation);
  } catch (error) {
    res.status(400).json({ message: 'Error updating recommendation' });
  }
});

// Delete a recommendation
router.delete('/:id', async (req, res) => {
  try {
    const recommendation = await Recommendation.findByIdAndDelete(req.params.id);
    if (!recommendation) {
      return res.status(404).json({ message: 'Recommendation not found' });
    }
    res.json({ message: 'Recommendation deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting recommendation' });
  }
});

export default router; 