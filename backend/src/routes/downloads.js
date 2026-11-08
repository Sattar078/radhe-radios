import express from 'express';
import DownloadItem from '../models/DownloadItem.js';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'radhe_studio_secret_change_in_prod';

async function optionalAuth(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  try {
    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, JWT_SECRET);
    return await User.findById(payload.id);
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────
// GET /api/downloads — List available blueprints & technical docs
// ─────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const user = await optionalAuth(req);
    const downloads = await DownloadItem.find({}).sort({ createdAt: 1 });

    const processed = downloads.map((d) => {
      const obj = d.toSafeObject();
      obj.isLocked = obj.tier_required !== 'public' && !user;
      return obj;
    });

    return res.json({ downloads: processed, total: downloads.length });
  } catch (err) {
    console.error('Fetch downloads error:', err);
    return res.status(500).json({ error: 'Failed to retrieve blueprints list.' });
  }
});

// ─────────────────────────────────────────
// POST /api/downloads/:id/track — Increment count & generate download link
// ─────────────────────────────────────────
router.post('/:id/track', async (req, res) => {
  try {
    const item = await DownloadItem.findOne({ id: req.params.id });
    if (!item) {
      return res.status(404).json({ error: 'Document not found.' });
    }

    const user = await optionalAuth(req);
    if (item.tier_required !== 'public' && !user) {
      return res.status(401).json({ error: 'Please sign in to unlock this blueprint / technical schematic.' });
    }

    item.download_count += 1;
    await item.save();

    return res.json({
      success: true,
      message: 'Download initiated.',
      title: item.title,
      download_count: item.download_count,
    });
  } catch (err) {
    console.error('Track download error:', err);
    return res.status(500).json({ error: 'Could not record download.' });
  }
});

export default router;

