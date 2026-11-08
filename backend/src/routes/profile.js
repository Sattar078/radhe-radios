import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

router.use(requireAuth);

// ─────────────────────────────────────────
// PUT /api/profile  — update profile
// ─────────────────────────────────────────
router.put('/', async (req, res) => {
  try {
    const { name, phone, location, company } = req.body;
    const updateData = {};

    if (name) updateData.name = name.trim();
    if (phone) updateData.phone = phone.trim().replace(/\s+/g, '');
    if (location !== undefined) updateData.location = location.trim();
    if (company !== undefined) updateData.company = company.trim();

    const updated = await User.findByIdAndUpdate(req.user.id, updateData, { new: true });
    if (!updated) {
      return res.status(404).json({ error: 'User not found.' });
    }

    return res.json(updated.toSafeObject());
  } catch (err) {
    console.error('Profile update error:', err);
    return res.status(500).json({ error: 'Failed to update profile.' });
  }
});

export default router;
