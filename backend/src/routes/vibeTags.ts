import express from 'express';
import { VibeTag } from '../models/VibeTag';

const router = express.Router();

// Get all tags
router.get('/', async (req, res) => {
  try {
    const tags = await VibeTag.find().sort({ usageCount: -1 });
    res.json(tags);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tags', error });
  }
});

// Add new tags
router.post('/', async (req, res) => {
  try {
    const { tags } = req.body;
    if (!Array.isArray(tags)) {
      return res.status(400).json({ message: 'Tags must be an array' });
    }

    const results = await Promise.all(
      tags.map(async (tagName) => {
        const tag = await VibeTag.findOne({ name: tagName });
        if (tag) {
          tag.usageCount += 1;
          await tag.save();
          return tag;
        } else {
          return await VibeTag.create({ name: tagName });
        }
      })
    );

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Error adding tags', error });
  }
});

export default router; 