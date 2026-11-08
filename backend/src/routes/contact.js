import express from 'express';
import ContactMessage from '../models/ContactMessage.js';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'radhe_studio_secret_change_in_prod';

// Helper to extract user if logged in, but don't block if guest
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
// POST /api/contact — Submit contact inquiry (Public or Authenticated)
// ─────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const { name, contact, requirement_type, location, message, source = 'contact_page' } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Please provide your full name.' });
    }
    if (!contact || !contact.trim()) {
      return res.status(400).json({ error: 'Please provide your phone number or email.' });
    }

    const user = await optionalAuth(req);
    const ticketId = `RR-${Date.now().toString().slice(-6)}`;

    const newMsg = await ContactMessage.create({
      ticket_id: ticketId,
      name: name.trim(),
      contact: contact.trim(),
      requirement_type: (requirement_type || 'General Sound Rig Inquiry').trim(),
      location: (location || 'Rajasthan').trim(),
      message: (message || '').trim(),
      source,
      user_id: user ? user._id : null,
      status: 'New',
    });

    return res.status(201).json({
      success: true,
      message: 'Your inquiry has been received. Radhe Radios Kota workshop will contact you within 24 hours.',
      ticket_id: ticketId,
      inquiry: newMsg.toSafeObject(),
    });
  } catch (err) {
    console.error('Contact submit error:', err);
    return res.status(500).json({ error: 'Failed to submit inquiry. Please call our workshop directly.' });
  }
});

// ─────────────────────────────────────────
// GET /api/contact/my — Get my submitted messages (if authenticated)
// ─────────────────────────────────────────
router.get('/my', async (req, res) => {
  try {
    const user = await optionalAuth(req);
    if (!user) {
      return res.status(401).json({ error: 'Please sign in to view your messages.' });
    }

    const messages = await ContactMessage.find({ user_id: user._id }).sort({ createdAt: -1 });
    return res.json(messages.map((m) => m.toSafeObject()));
  } catch (err) {
    console.error('Fetch my contact messages error:', err);
    return res.status(500).json({ error: 'Failed to fetch messages.' });
  }
});

export default router;

