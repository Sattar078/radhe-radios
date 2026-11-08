import express from 'express';
import mongoose from 'mongoose';
import { requireAuth } from '../middleware/auth.js';
import Inquiry from '../models/Inquiry.js';

const router = express.Router();

router.use(requireAuth);

// ─────────────────────────────────────────
// GET /api/inquiries  — get current user's inquiries
// ─────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const inquiries = await Inquiry.find({ user_id: req.user.id }).sort({ createdAt: -1 });
    return res.json(inquiries.map((inq) => inq.toSafeObject()));
  } catch (err) {
    console.error('Get inquiries error:', err);
    return res.status(500).json({ error: 'Failed to fetch inquiries.' });
  }
});

// ─────────────────────────────────────────
// POST /api/inquiries  — create new inquiry
// ─────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const { system, location, notes } = req.body;

    if (!system) {
      return res.status(400).json({ error: 'Please specify which sound system you are interested in.' });
    }

    const id = `INQ-${Math.floor(1000 + Math.random() * 9000)}`;
    const priority = req.user?.role?.toLowerCase().includes('dealer') ? 'High (Dealer)' : 'Standard';

    const newInquiry = await Inquiry.create({
      id,
      user_id: req.user.id,
      system: system.trim(),
      location: (location || req.user.location || '').trim(),
      notes: (notes || '').trim(),
      priority,
      est_delivery: 'फैक्ट्री से 24 घंटे में संपर्क',
    });

    return res.status(201).json(newInquiry.toSafeObject());
  } catch (err) {
    console.error('Create inquiry error:', err);
    return res.status(500).json({ error: 'Failed to create inquiry.' });
  }
});

// ─────────────────────────────────────────
// PUT /api/inquiries/:id  — User can EDIT and UPDATE their inquiry
// ─────────────────────────────────────────
router.put('/:id', async (req, res) => {
  try {
    const { system, location, notes } = req.body;

    const condition = mongoose.Types.ObjectId.isValid(req.params.id)
      ? { $or: [{ id: req.params.id }, { _id: req.params.id }], user_id: req.user.id }
      : { id: req.params.id, user_id: req.user.id };

    const inquiry = await Inquiry.findOne(condition);

    if (!inquiry) {
      return res.status(404).json({ error: 'Inquiry not found or you do not have permission to edit it.' });
    }

    if (system) inquiry.system = system.trim();
    if (location !== undefined) inquiry.location = location.trim();
    if (notes !== undefined) inquiry.notes = notes.trim();

    await inquiry.save();
    return res.json(inquiry.toSafeObject());
  } catch (err) {
    console.error('Update inquiry error:', err);
    return res.status(500).json({ error: 'Failed to update inquiry.' });
  }
});

// ─────────────────────────────────────────
// DELETE /api/inquiries/:id  — User can cancel/delete their inquiry
// ─────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    const condition = mongoose.Types.ObjectId.isValid(req.params.id)
      ? { $or: [{ id: req.params.id }, { _id: req.params.id }], user_id: req.user.id }
      : { id: req.params.id, user_id: req.user.id };

    const inquiry = await Inquiry.findOneAndDelete(condition);

    if (!inquiry) {
      return res.status(404).json({ error: 'Inquiry not found or cannot be deleted.' });
    }

    return res.json({ success: true, message: 'Inquiry cancelled successfully.' });
  } catch (err) {
    console.error('Delete inquiry error:', err);
    return res.status(500).json({ error: 'Failed to delete inquiry.' });
  }
});

export default router;
