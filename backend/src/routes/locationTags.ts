import express, { Request, Response } from 'express';
import { LocationTag } from '../models/LocationTag';

const router = express.Router();

interface TagRequest {
  tags: string[];
}

// Get all tags
router.get('/', async (_req: Request, res: Response) => {
  try {
    const tags = await LocationTag.find()
      .sort({ usageCount: -1 })
      .lean(); // Use lean() for better performance when we don't need Mongoose documents
    res.json(tags);
  } catch (error) {
    console.error('Error fetching tags:', error);
    res.status(500).json({ message: 'Error fetching tags', error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Add new tags
router.post('/', async (req: Request<{}, any, TagRequest>, res: Response) => {
  try {
    const { tags } = req.body;
    
    // Input validation
    if (!tags || !Array.isArray(tags)) {
      return res.status(400).json({ message: 'Tags must be an array' });
    }

    if (tags.some(tag => typeof tag !== 'string' || !tag.trim())) {
      return res.status(400).json({ message: 'All tags must be non-empty strings' });
    }

    // Normalize tags (trim whitespace and convert to lowercase)
    const normalizedTags = tags.map(tag => tag.trim().toLowerCase());

    // Use bulkWrite for better performance
    const operations = normalizedTags.map(tagName => ({
      updateOne: {
        filter: { name: tagName },
        update: { $inc: { usageCount: 1 } },
        upsert: true
      }
    }));

    await LocationTag.bulkWrite(operations);
    
    // Fetch the updated tags
    const results = await LocationTag.find({ name: { $in: normalizedTags } }).lean();
    res.json(results);
  } catch (error) {
    console.error('Error adding tags:', error);
    res.status(500).json({ message: 'Error adding tags', error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

export default router; 