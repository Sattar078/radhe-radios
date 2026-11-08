import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Inquiry from '../models/Inquiry.js';
import { generateToken, requireAuth } from '../middleware/auth.js';

const router = express.Router();

// ─────────────────────────────────────────
// POST /api/auth/register
// ─────────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { name, phone, password, role = 'DJ Operator', location = 'Rajasthan', company = '' } = req.body;

    if (!name || !phone || !password) {
      return res.status(400).json({ error: 'Name, phone, and password are required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    // Normalize phone
    const normalizedPhone = phone.trim().replace(/\s+/g, '');

    // Check duplicate
    const existing = await User.findOne({
      $or: [{ phone: normalizedPhone }, { email: `${normalizedPhone.replace(/\D/g, '')}@radhestudio.com` }],
    });
    if (existing) {
      return res.status(409).json({ error: 'An account with this phone number already exists.' });
    }

    const password_hash = await bcrypt.hash(password, 12);
    const initials =
      name
        .trim()
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase() || 'RS';
    const isSuperAdminPhone = normalizedPhone === '9887158522';
    const isRequestingAdmin = role.toLowerCase().includes('admin');

    const finalRole = isSuperAdminPhone
      ? 'super_admin'
      : isRequestingAdmin
      ? 'admin'
      : role;

    const adminApproved = isSuperAdminPhone;
    const adminRequested = !isSuperAdminPhone && isRequestingAdmin;

    const tier = isSuperAdminPhone
      ? 'Workshop Master & Super Administrator'
      : isRequestingAdmin
      ? 'Pending Staff Admin Approval'
      : role.toLowerCase().includes('dealer')
      ? 'Authorized Tier-1 Partner'
      : 'Registered Studio Client';

    const email = `${normalizedPhone.replace(/\D/g, '')}@radhestudio.com`;

    const newUser = await User.create({
      name: name.trim(),
      phone: normalizedPhone,
      email,
      password_hash,
      role: finalRole,
      adminApproved,
      adminRequested,
      company: company.trim(),
      location: location.trim(),
      tier,
      avatar: initials,
    });

    const token = generateToken(newUser._id);
    return res.status(201).json({ token, user: newUser.toSafeObject() });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Server error. Please try again.' });
  }
});

// ─────────────────────────────────────────
// POST /api/auth/login
// ─────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ error: 'Phone/email and password are required.' });
    }

    const trimmed = identifier.trim();
    const normalizedPhone = trimmed.replace(/\s+/g, '');

    const user = await User.findOne({
      $or: [
        { phone: trimmed },
        { phone: normalizedPhone },
        { email: trimmed.toLowerCase() },
      ],
    });

    if (!user) {
      return res.status(401).json({ error: 'No account found with this phone/email. Please register first.' });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'Incorrect password. Please try again.' });
    }

    const token = generateToken(user._id);
    const inquiries = await Inquiry.find({ user_id: user._id }).sort({ createdAt: -1 });
    const userObj = user.toSafeObject();
    userObj.inquiries = inquiries.map((inq) => inq.toSafeObject());
    return res.json({ token, user: userObj });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Server error. Please try again.' });
  }
});

// ─────────────────────────────────────────
// GET /api/auth/me  (protected)
// ─────────────────────────────────────────
router.get('/me', requireAuth, async (req, res) => {
  try {
    const inquiries = await Inquiry.find({ user_id: req.user.id }).sort({ createdAt: -1 });
    const formattedInquiries = inquiries.map((inq) => inq.toSafeObject());
    return res.json({ ...req.user, inquiries: formattedInquiries });
  } catch (err) {
    console.error('Auth /me error:', err);
    return res.status(500).json({ error: 'Failed to fetch user details.' });
  }
});

export default router;
