import express from 'express';
import { analyzeWebsite } from '../services/analyzerService.js';

const router = express.Router();

// POST /api/analyze
router.post('/analyze', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Validate URL
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`);
    } catch (e) {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    const fullUrl = url.startsWith('http') ? url : `https://${url}`;
    console.log(`Analyzing: ${fullUrl}`);

    const analysis = await analyzeWebsite(fullUrl);

    res.json({
      success: true,
      analysis,
      message: 'Analysis complete'
    });
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
