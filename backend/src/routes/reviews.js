import express from 'express';
import Review from '../models/Review.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// ─────────────────────────────────────────
// GET /api/reviews — List reviews (optional filter ?productId=)
// ─────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const { productId } = req.query;
    const filter = {};
    if (productId) filter.product_id = productId;

    const reviews = await Review.find(filter).sort({ createdAt: -1 });
    const count = reviews.length;
    const avgRating = count > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / count).toFixed(1) : '5.0';

    return res.json({
      reviews: reviews.map((r) => r.toSafeObject()),
      total: count,
      averageRating: parseFloat(avgRating),
    });
  } catch (err) {
    console.error('Fetch reviews error:', err);
    return res.status(500).json({ error: 'Failed to fetch reviews.' });
  }
});

// ─────────────────────────────────────────
// POST /api/reviews — Post new verified review (auth required)
// ─────────────────────────────────────────
router.post('/', requireAuth, async (req, res) => {
  try {
    const { title, comment, rating = 5, bass_power = 5, clarity = 5, product_id = null } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Please enter a review headline.' });
    }
    if (!comment || !comment.trim()) {
      return res.status(400).json({ error: 'Please share your experience with the sound system.' });
    }

    const review = await Review.create({
      author_name: req.user.name,
      author_role: req.user.role || 'DJ Sound Operator',
      location: req.user.location || 'Rajasthan',
      rating: Math.min(5, Math.max(1, Number(rating))),
      title: title.trim(),
      comment: comment.trim(),
      bass_power: Math.min(5, Math.max(1, Number(bass_power))),
      clarity: Math.min(5, Math.max(1, Number(clarity))),
      product_id,
      user_id: req.user.id,
      is_verified: true,
    });

    return res.status(201).json(review.toSafeObject());
  } catch (err) {
    console.error('Create review error:', err);
    return res.status(500).json({ error: 'Failed to submit review.' });
  }
});

export default router;

