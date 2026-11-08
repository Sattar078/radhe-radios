import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'radhe_studio_secret_change_in_prod';

/**
 * Verifies JWT from Authorization: Bearer <token> header.
 * Attaches req.user (safe user object) on success.
 */
export async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required. Please sign in.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(payload.id);
    if (!user) {
      return res.status(401).json({ error: 'User not found. Please sign in again.' });
    }
    req.user = user.toSafeObject();
    req.userDoc = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Session expired. Please sign in again.' });
  }
}

/**
 * Verifies that the authenticated user has an Admin role (Super Admin or Approved Admin).
 * Must be preceded by requireAuth.
 */
export function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required.' });
  }

  const role = (req.user.role || '').toLowerCase();
  const isSuper = req.user.isSuperAdmin || role === 'super_admin' || role === 'super admin' || role === 'workshop owner' || req.user.phone === '9887158522';
  const isApprovedAdmin = role === 'admin' && req.user.adminApproved !== false;

  if (!isSuper && !isApprovedAdmin) {
    return res.status(403).json({
      error: 'Access denied. You do not have approved administrator privileges to manage the website.',
    });
  }
  next();
}

/**
 * Verifies that the authenticated user is the SUPER ADMIN (Rajesh Sharma).
 * Required for promoting/approving other users as Admins.
 * Must be preceded by requireAuth.
 */
export function requireSuperAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required.' });
  }

  const role = (req.user.role || '').toLowerCase();
  const isSuper = req.user.isSuperAdmin || role === 'super_admin' || role === 'super admin' || role === 'workshop owner' || req.user.phone === '9887158522';

  if (!isSuper) {
    return res.status(403).json({
      error: 'Access denied. Only Super Administrator has authority to grant or revoke website admin access.',
    });
  }
  next();
}

/**
 * Generate a signed JWT for a user
 */
export function generateToken(userId) {
  return jwt.sign({ id: userId.toString() }, JWT_SECRET, { expiresIn: '7d' });
}
