import express from 'express';
import Review from '../models/Review.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

let reviewsCache = null;
let reviewsCacheTime = 0;
const REVIEWS_CACHE_TTL = 30000; // 30s

// ─────────────────────────────────────────
// GET /api/reviews — List reviews (optional filter ?productId=)
// ─────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const { productId } = req.query;
    const now = Date.now();
    if (!productId && reviewsCache && now - reviewsCacheTime < REVIEWS_CACHE_TTL) {
      res.setHeader('X-Cache', 'HIT');
      res.setHeader('Cache-Control', 'public, max-age=30, stale-while-revalidate=120');
      return res.json(reviewsCache);
    }

    const filter = {};
    if (productId) filter.product_id = productId;

    const reviews = await Review.find(filter).sort({ createdAt: -1 }).lean();
    const count = reviews.length;
    const avgRating = count > 0 ? (reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / count).toFixed(1) : '5.0';

    const result = {
      reviews: reviews.map((r) => {
        r.id = r._id ? r._id.toString() : r.id;
        r.date = r.createdAt ? new Date(r.createdAt).toISOString().split('T')[0] : '';
        delete r.__v;
        return r;
      }),
      total: count,
      averageRating: parseFloat(avgRating),
    };

    if (!productId) {
      reviewsCache = result;
      reviewsCacheTime = now;
      res.setHeader('X-Cache', 'MISS');
      res.setHeader('Cache-Control', 'public, max-age=30, stale-while-revalidate=120');
    }

    return res.json(result);
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

    reviewsCache = null;
    return res.status(201).json(review.toSafeObject());
  } catch (err) {
    console.error('Create review error:', err);
    return res.status(500).json({ error: 'Failed to submit review.' });
  }
});

export default router;

