import express from 'express';
import mongoose from 'mongoose';
import { requireAuth, requireAdmin, requireSuperAdmin } from '../middleware/auth.js';
import Inquiry from '../models/Inquiry.js';
import ContactMessage from '../models/ContactMessage.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import DownloadItem from '../models/DownloadItem.js';
import Notification from '../models/Notification.js';

const router = express.Router();

// Enforce authentication & admin privileges on all admin endpoints
router.use(requireAuth, requireAdmin);

// ─────────────────────────────────────────
// GET /api/admin/overview — Dashboard metrics
// ─────────────────────────────────────────
router.get('/overview', async (req, res) => {
  try {
    const [
      totalUsers,
      allInquiries,
      allContacts,
      totalProducts,
      downloads,
    ] = await Promise.all([
      User.countDocuments(),
      Inquiry.find({}, 'status amount payment_status').lean(),
      ContactMessage.find({}, 'status').lean(),
      Product.countDocuments(),
      DownloadItem.find({}, 'download_count').lean(),
    ]);

    const inquiriesByStatus = {
      pending: allInquiries.filter((i) => i.status.includes('Review') || i.status === 'Pending').length,
      inProduction: allInquiries.filter((i) => i.status === 'In Production' || i.status === 'In Fabrication').length,
      completed: allInquiries.filter((i) => i.status.includes('Delivered') || i.status === 'Completed' || i.status === 'Ready for Dispatch').length,
      total: allInquiries.length,
    };

    const contactsByStatus = {
      new: allContacts.filter((c) => c.status === 'New').length,
      inReview: allContacts.filter((c) => c.status === 'In Review').length,
      contacted: allContacts.filter((c) => c.status === 'Contacted').length,
      resolved: allContacts.filter((c) => c.status === 'Resolved').length,
      total: allContacts.length,
    };

    const totalDownloads = downloads.reduce((acc, d) => acc + (d.download_count || 0), 0);

    // Calculate total gross revenue
    const totalSalesRevenue = allInquiries.reduce((sum, item) => sum + (Number(item.amount) || 45000), 0);
    const paidRevenue = allInquiries
      .filter((i) => i.payment_status === 'Paid in Full' || i.payment_status === 'Advance Received')
      .reduce((sum, item) => sum + (Number(item.amount) || 45000), 0);

    return res.json({
      totalUsers,
      totalProducts,
      totalDownloads,
      inquiries: inquiriesByStatus,
      contacts: contactsByStatus,
      sales: {
        totalGross: totalSalesRevenue,
        paidRevenue,
        ordersCount: allInquiries.length,
        averageOrderValue: allInquiries.length ? Math.round(totalSalesRevenue / allInquiries.length) : 0,
      },
    });
  } catch (err) {
    console.error('Admin overview error:', err);
    return res.status(500).json({ error: 'Failed to retrieve admin overview.' });
  }
});

// ─────────────────────────────────────────
// GET /api/admin/sales — Sales & Revenue Details
// ─────────────────────────────────────────
router.get('/sales', async (req, res) => {
  try {
    const inquiries = await Inquiry.find({})
      .populate('user_id', 'name phone email role company location')
      .sort({ createdAt: -1 });

    const totalRevenue = inquiries.reduce((sum, inq) => sum + (Number(inq.amount) || 45000), 0);
    const completedOrders = inquiries.filter((i) => i.status.includes('Delivered') || i.status === 'Completed').length;
    const activeBuilds = inquiries.filter((i) => i.status === 'In Production' || i.status === 'In Fabrication').length;

    // Monthly aggregation
    const monthlySales = {};
    inquiries.forEach((inq) => {
      const month = inq.createdAt ? inq.createdAt.toISOString().slice(0, 7) : '2026-11';
      monthlySales[month] = (monthlySales[month] || 0) + (Number(inq.amount) || 45000);
    });

    const formattedInquiries = inquiries.map((inq) => {
      const obj = inq.toSafeObject();
      obj.user = inq.user_id ? inq.user_id : null;
      return obj;
    });

    return res.json({
      totalRevenue,
      completedOrders,
      activeBuilds,
      ordersCount: inquiries.length,
      monthlySales,
      orders: formattedInquiries,
    });
  } catch (err) {
    console.error('Admin sales fetch error:', err);
    return res.status(500).json({ error: 'Failed to retrieve sales data.' });
  }
});

// ─────────────────────────────────────────
// GET /api/admin/inquiries — All customer inquiries
// ─────────────────────────────────────────
router.get('/inquiries', async (req, res) => {
  try {
    const inquiries = await Inquiry.find({})
      .populate('user_id', 'name phone email role company location')
      .sort({ createdAt: -1 });

    const formatted = inquiries.map((inq) => {
      const obj = inq.toSafeObject();
      obj.user = inq.user_id ? inq.user_id : null;
      return obj;
    });

    return res.json(formatted);
  } catch (err) {
    console.error('Admin fetch inquiries error:', err);
    return res.status(500).json({ error: 'Failed to fetch inquiries.' });
  }
});

// ─────────────────────────────────────────
// PUT /api/admin/inquiries/:id — Update status/priority/delivery/amount
// ─────────────────────────────────────────
router.put('/inquiries/:id', async (req, res) => {
  try {
    const { status, priority, est_delivery, notes, amount, payment_status } = req.body;

    const condition = mongoose.Types.ObjectId.isValid(req.params.id)
      ? { $or: [{ id: req.params.id }, { _id: req.params.id }] }
      : { id: req.params.id };

    const inquiry = await Inquiry.findOne(condition);

    if (!inquiry) {
      return res.status(404).json({ error: 'Inquiry not found.' });
    }

    if (status) inquiry.status = status;
    if (priority) inquiry.priority = priority;
    if (est_delivery) inquiry.est_delivery = est_delivery;
    if (notes !== undefined) inquiry.notes = notes;
    if (amount !== undefined) inquiry.amount = Number(amount);
    if (payment_status) inquiry.payment_status = payment_status;

    await inquiry.save();
    return res.json(inquiry.toSafeObject());
  } catch (err) {
    console.error('Admin update inquiry error:', err);
    return res.status(500).json({ error: 'Failed to update inquiry.' });
  }
});

// ─────────────────────────────────────────
// GET /api/admin/contacts — All contact & dealership messages
// ─────────────────────────────────────────
router.get('/contacts', async (req, res) => {
  try {
    const contacts = await ContactMessage.find({})
      .populate('user_id', 'name phone email role')
      .sort({ createdAt: -1 });

    return res.json(contacts.map((c) => c.toSafeObject()));
  } catch (err) {
    console.error('Admin fetch contacts error:', err);
    return res.status(500).json({ error: 'Failed to fetch contact leads.' });
  }
});

// ─────────────────────────────────────────
// PUT /api/admin/contacts/:id — Update contact lead status
// ─────────────────────────────────────────
router.put('/contacts/:id', async (req, res) => {
  try {
    const { status } = req.body;

    const condition = mongoose.Types.ObjectId.isValid(req.params.id)
      ? { $or: [{ ticket_id: req.params.id }, { _id: req.params.id }] }
      : { ticket_id: req.params.id };

    const contact = await ContactMessage.findOne(condition);

    if (!contact) {
      return res.status(404).json({ error: 'Contact lead not found.' });
    }

    if (status) contact.status = status;
    await contact.save();

    return res.json(contact.toSafeObject());
  } catch (err) {
    console.error('Admin update contact error:', err);
    return res.status(500).json({ error: 'Failed to update contact status.' });
  }
});

// ─────────────────────────────────────────
// GET /api/admin/users — List registered members
// ─────────────────────────────────────────
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    return res.json(users.map((u) => u.toSafeObject()));
  } catch (err) {
    console.error('Admin fetch users error:', err);
    return res.status(500).json({ error: 'Failed to fetch users.' });
  }
});

// ─────────────────────────────────────────
// POST /api/admin/users/:id/approve-admin — (Super Admin Only) Approve staff as Admin
// ─────────────────────────────────────────
router.post('/users/:id/approve-admin', requireSuperAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (user.role === 'super_admin' || user.phone === '9887158522') {
      return res.status(400).json({ error: 'User is already Super Admin.' });
    }

    user.role = 'admin';
    user.adminApproved = true;
    user.adminRequested = false;
    user.tier = 'Authorized Workshop Admin';
    await user.save();

    // Create system notification for the approved user
    try {
      await Notification.create({
        user_id: user._id,
        type: 'in-app',
        title: '👑 Admin Privileges Approved',
        message: 'Super Admin Rajesh Bhai has approved your Admin access. You now have full authority to manage website products, inquiries, and customer notifications.',
        status: 'Sent',
      });
    } catch (notifErr) {
      console.warn('Could not create admin approval notification:', notifErr.message);
    }

    return res.json({
      message: `${user.name} has been approved as Website Administrator.`,
      user: user.toSafeObject(),
    });
  } catch (err) {
    console.error('Approve admin error:', err);
    return res.status(500).json({ error: 'Failed to approve admin.' });
  }
});

// ─────────────────────────────────────────
// POST /api/admin/users/:id/revoke-admin — (Super Admin Only) Revoke admin access
// ─────────────────────────────────────────
router.post('/users/:id/revoke-admin', requireSuperAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (user.role === 'super_admin' || user.phone === '9887158522') {
      return res.status(400).json({ error: 'Cannot revoke Super Admin access.' });
    }

    user.role = 'client';
    user.adminApproved = false;
    user.adminRequested = false;
    user.tier = 'Registered Studio Client';
    await user.save();

    return res.json({
      message: `Admin privileges for ${user.name} have been revoked.`,
      user: user.toSafeObject(),
    });
  } catch (err) {
    console.error('Revoke admin error:', err);
    return res.status(500).json({ error: 'Failed to revoke admin.' });
  }
});

// ─────────────────────────────────────────
// PUT /api/admin/users/:id/role — (Super Admin Only) Change a user's role
// ─────────────────────────────────────────
router.put('/users/:id/role', requireSuperAdmin, async (req, res) => {
  try {
    const { role } = req.body;
    if (!role) {
      return res.status(400).json({ error: 'Role is required.' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (user.phone === '9887158522' && role !== 'super_admin') {
      return res.status(400).json({ error: 'Master account must remain Super Admin.' });
    }

    user.role = role;
    if (role.toLowerCase() === 'admin') {
      user.adminApproved = true;
      user.adminRequested = false;
      user.tier = 'Authorized Workshop Admin';
    } else if (role.toLowerCase() === 'super_admin') {
      user.adminApproved = true;
      user.adminRequested = false;
      user.tier = 'Workshop Master & Super Administrator';
    } else {
      user.adminApproved = false;
      user.adminRequested = false;
    }

    await user.save();

    return res.json(user.toSafeObject());
  } catch (err) {
    console.error('Admin change role error:', err);
    return res.status(500).json({ error: 'Failed to change role.' });
  }
});

// ─────────────────────────────────────────
// POST /api/admin/notify — Send WhatsApp / Email Notification
// ─────────────────────────────────────────
router.post('/notify', async (req, res) => {
  try {
    const { userId, recipientName, recipientPhone, recipientEmail, type = 'whatsapp', subject, message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Notification message cannot be empty.' });
    }

    let phone = (recipientPhone || '').trim().replace(/\D/g, '');
    if (phone && phone.length === 10) {
      phone = '91' + phone;
    }

    const notification = await Notification.create({
      user_id: mongoose.Types.ObjectId.isValid(userId) ? userId : null,
      recipient_name: recipientName || '',
      recipient_phone: recipientPhone || '',
      recipient_email: recipientEmail || '',
      type,
      subject: subject || 'Radhe Radios Kota — Official Notification',
      message: message.trim(),
      status: 'dispatched',
      sent_by: req.user?.name || 'Rajesh Workshop Admin',
    });

    // Generate direct WhatsApp link
    const whatsappUrl = phone
      ? `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message.trim())}`
      : null;

    return res.status(201).json({
      success: true,
      message: `${type.toUpperCase()} notification logged and dispatched successfully.`,
      notification: notification.toSafeObject(),
      whatsappUrl,
    });
  } catch (err) {
    console.error('Admin notify error:', err);
    return res.status(500).json({ error: 'Failed to dispatch notification: ' + err.message });
  }
});

// ─────────────────────────────────────────
// GET /api/admin/notifications — Fetch Recent Notifications
// ─────────────────────────────────────────
router.get('/notifications', async (req, res) => {
  try {
    const history = await Notification.find({}).sort({ createdAt: -1 }).limit(50);
    return res.json(history.map((n) => n.toSafeObject()));
  } catch (err) {
    console.error('Admin notifications fetch error:', err);
    return res.status(500).json({ error: 'Failed to fetch notifications.' });
  }
});

export default router;
