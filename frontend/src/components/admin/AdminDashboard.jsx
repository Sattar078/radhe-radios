import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Users,
  Package,
  ClipboardList,
  Mail,
  CheckCircle2,
  Clock,
  Phone,
  MapPin,
  ExternalLink,
  PlusCircle,
  Trash2,
  Edit,
  Save,
  X,
  Search,
  Filter,
  Loader2,
  AlertCircle,
  Sparkles,
  DollarSign,
  TrendingUp,
  Send,
  MessageSquare,
  MessageCircle,
  Eye,
  ArrowRight,
  Tag,
  Zap,
  Sliders,
  Check,
  RefreshCw,
} from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { adminApi, productsApi } from '../../services/api';

const PRESET_IMAGES = [
  { label: 'Signature Amplifier (Gold/Copper Toroid)', url: '/frames/frame_0180.jpg' },
  { label: 'Vehicle Audio Rig (High Power Sub)', url: '/frames/frame_0320.jpg' },
  { label: 'Dual 18" Bass Cabinet (Stage Touring)', url: '/frames/frame_0450.jpg' },
  { label: 'Acoustic Workshop Chassis', url: '/frames/frame_0060.jpg' },
];

const NOTIFICATION_TEMPLATES = [
  {
    title: 'Order In Production',
    type: 'whatsapp',
    subject: 'Your Radhe Radios Custom Build is in Production',
    message: 'Hello! Your custom heavy-duty audio system has entered production at our Transport Nagar workshop in Kota. We will keep you updated with build photos and acoustic testing reports!',
  },
  {
    title: 'Acoustic Test Passed',
    type: 'whatsapp',
    subject: 'Acoustic Rig Passed Zero-Distortion Benchmark',
    message: 'Great news! Your customized amplifier rig has successfully cleared our 48-hour thermal and zero-distortion burn-in tests at Radhe Radios. Ready for final packing and dispatch.',
  },
  {
    title: 'Dispatch & Waybill Update',
    type: 'whatsapp',
    subject: 'Sound System Dispatched via Transport Nagar Logistics',
    message: 'Your sound equipment has been dispatched from Kota. Tracking waybill number and transport contact details have been generated. Thank you for trusting Radhe Radios!',
  },
  {
    title: 'Quotation & Technical Spec Sheet',
    type: 'email',
    subject: 'Official Quotation & Build Blueprint — Radhe Radios',
    message: 'Greetings from Radhe Radios! Enclosed is your customized system blueprint with Class-A toroidal power architecture and reinforced cabinet specs. Please review and feel free to call us for any tuning adjustments.',
  },
];

export function AdminDashboard({ user, onLogout }) {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'sales' | 'products' | 'inquiries' | 'contacts' | 'users'
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Data states
  const [overview, setOverview] = useState(null);
  const [salesData, setSalesData] = useState(null);
  const [inquiries, setInquiries] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [notificationsHistory, setNotificationsHistory] = useState([]);

  // Search & Filter states
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState('ALL');
  const [contactStatusFilter, setContactStatusFilter] = useState('ALL');
  const [productCategoryFilter, setProductCategoryFilter] = useState('ALL');
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('ALL'); // 'ALL' | 'PENDING' | 'ADMINS' | 'CLIENTS'

  // Super Admin Check
  const isSuperAdmin = Boolean(
    user && (user.isSuperAdmin || (user.role || '').toLowerCase() === 'super_admin' || user.phone === '9887158522')
  );

  // Product Add / Edit Modal
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    title: '',
    category: 'Custom Power Amplifiers',
    badge: 'Kota Handcrafted',
    price: 35000,
    image: '/frames/frame_0180.jpg',
    description: '',
    powerHandling: '3000W RMS Class-A Output',
    driverSize: 'Heavy Toroidal Transformer + Dual Heatsinks',
    frequencyRange: '15Hz - 25,000Hz Ultra-Clean Spectrum',
    enclosure: 'Industrial Powder-Coated Steel Chassis',
  });

  // Direct Notification Modal
  const [showNotifyModal, setShowNotifyModal] = useState(false);
  const [notifyTargetUser, setNotifyTargetUser] = useState(null);
  const [notifyForm, setNotifyForm] = useState({
    type: 'whatsapp', // 'whatsapp' | 'email'
    recipientName: '',
    recipientPhone: '',
    recipientEmail: '',
    subject: 'Radhe Radios Kota — Update Regarding Your Sound System',
    message: '',
  });
  const [sendingNotification, setSendingNotification] = useState(false);

  // Inline Inquiry Edit State
  const [editingInquiryId, setEditingInquiryId] = useState(null);
  const [inquiryEditForm, setInquiryEditForm] = useState({});

  const showFeedback = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  // ─── Data Loaders ──────────────────────────────────────────
  const loadOverview = async () => {
    try {
      setLoading(true);
      const res = await adminApi.overview();
      setOverview(res);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadSales = async () => {
    try {
      setLoading(true);
      const res = await adminApi.sales();
      setSalesData(res);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadInquiries = async () => {
    try {
      setLoading(true);
      const res = await adminApi.inquiries();
      setInquiries(res || []);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadContacts = async () => {
    try {
      setLoading(true);
      const res = await adminApi.contacts();
      setContacts(res || []);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await productsApi.list();
      setProducts(res.products || []);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await adminApi.users();
      setUsers(res || []);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadNotifications = async () => {
    try {
      const res = await adminApi.notifications();
      setNotificationsHistory(res || []);
    } catch (err) {
      console.warn('Notifications history error:', err);
    }
  };

  useEffect(() => {
    setErrorMsg('');
    if (activeTab === 'overview') {
      loadOverview();
      loadSales();
    } else if (activeTab === 'sales') {
      loadSales();
    } else if (activeTab === 'products') {
      loadProducts();
    } else if (activeTab === 'inquiries') {
      loadInquiries();
    } else if (activeTab === 'contacts') {
      loadContacts();
    } else if (activeTab === 'users') {
      loadUsers();
      loadNotifications();
    }
  }, [activeTab]);

  // ─── Product Operations ───────────────────────────────────
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = {
        title: productForm.title.trim(),
        category: productForm.category.trim(),
        badge: productForm.badge.trim(),
        price: Number(productForm.price) || 0,
        image: productForm.image || '/frames/frame_0180.jpg',
        description: productForm.description.trim(),
        specs: {
          powerHandling: productForm.powerHandling.trim(),
          driverSize: productForm.driverSize.trim(),
          frequencyRange: productForm.frequencyRange.trim(),
          enclosure: productForm.enclosure.trim(),
        },
      };

      if (editingProduct) {
        await productsApi.update(editingProduct.id, payload);
        showFeedback(`Product "${payload.title}" updated successfully!`);
      } else {
        await productsApi.create(payload);
        showFeedback(`Product "${payload.title}" added to catalog & live showcase!`);
      }

      setShowProductModal(false);
      setEditingProduct(null);
      loadProducts();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId, productTitle) => {
    if (!window.confirm(`Are you sure you want to remove "${productTitle || productId}" from catalog?`)) return;
    try {
      await productsApi.delete(productId);
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      showFeedback('Product removed from catalog.');
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const openAddProductModal = () => {
    setEditingProduct(null);
    setProductForm({
      title: '',
      category: 'Custom Power Amplifiers',
      badge: 'Kota Handcrafted',
      price: 35000,
      image: '/frames/frame_0180.jpg',
      description: '',
      powerHandling: '3000W RMS Class-A Output',
      driverSize: 'Heavy Toroidal Transformer + Dual Heatsinks',
      frequencyRange: '15Hz - 25,000Hz Ultra-Clean Spectrum',
      enclosure: 'Industrial Powder-Coated Steel Chassis',
    });
    setShowProductModal(true);
  };

  const openEditProductModal = (p) => {
    setEditingProduct(p);
    setProductForm({
      title: p.title || '',
      category: p.category || 'Custom Power Amplifiers',
      badge: p.badge || '',
      price: p.price || 35000,
      image: p.image || '/frames/frame_0180.jpg',
      description: p.description || '',
      powerHandling: p.specs?.powerHandling || '',
      driverSize: p.specs?.driverSize || '',
      frequencyRange: p.specs?.frequencyRange || '',
      enclosure: p.specs?.enclosure || '',
    });
    setShowProductModal(true);
  };

  // ─── Inquiry & Order Operations ───────────────────────────
  const startEditingInquiry = (inq) => {
    setEditingInquiryId(inq.id || inq._id);
    setInquiryEditForm({
      status: inq.status,
      priority: inq.priority || 'Normal',
      amount: inq.amount || 0,
      payment_status: inq.payment_status || 'Pending',
      notes: inq.notes || '',
    });
  };

  const handleSaveInquiryEdit = async (inquiryId) => {
    try {
      setLoading(true);
      await adminApi.updateInquiry(inquiryId, inquiryEditForm);
      setInquiries((prev) =>
        prev.map((i) =>
          i.id === inquiryId || i._id === inquiryId
            ? { ...i, ...inquiryEditForm }
            : i
        )
      );
      setEditingInquiryId(null);
      showFeedback('Order details updated successfully!');
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ─── Notifications & User Operations ──────────────────────
  const openNotifyModalForUser = (targetUser, defaultType = 'whatsapp') => {
    setNotifyTargetUser(targetUser);
    setNotifyForm({
      type: defaultType,
      recipientName: targetUser.name || 'Valued Client',
      recipientPhone: targetUser.phone || '',
      recipientEmail: targetUser.email || '',
      subject: `Radhe Radios Kota — Update for ${targetUser.name}`,
      message: `Hello ${targetUser.name}! This is Rajesh from Radhe Radios, Kota. We are reaching out regarding your audio setup...`,
    });
    setShowNotifyModal(true);
  };

  const applyNotificationTemplate = (tpl) => {
    setNotifyForm((prev) => ({
      ...prev,
      type: tpl.type,
      subject: tpl.subject,
      message: tpl.message,
    }));
  };

  const handleSendNotification = async (e) => {
    e.preventDefault();
    if (!notifyForm.message.trim()) {
      setErrorMsg('Please enter a notification message.');
      return;
    }

    try {
      setSendingNotification(true);
      const res = await adminApi.notify({
        userId: notifyTargetUser?.id || notifyTargetUser?._id,
        recipientName: notifyForm.recipientName,
        recipientPhone: notifyForm.recipientPhone,
        recipientEmail: notifyForm.recipientEmail,
        type: notifyForm.type,
        subject: notifyForm.subject,
        message: notifyForm.message,
      });

      showFeedback(res.message || 'Notification dispatched and recorded!');
      setShowNotifyModal(false);

      // If WhatsApp and we have a deep link, open in separate tab
      if (notifyForm.type === 'whatsapp' && res.whatsappUrl) {
        window.open(res.whatsappUrl, '_blank', 'noopener,noreferrer');
      }

      loadNotifications();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setSendingNotification(false);
    }
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      await adminApi.updateUserRole(userId, newRole);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId || u._id === userId ? { ...u, role: newRole } : u))
      );
      showFeedback('Member role updated successfully!');
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  // ─── Super Admin Approvals & Decisions ──────────────────────
  const handleApproveAdmin = async (userId, targetName) => {
    if (!isSuperAdmin) {
      setErrorMsg('Only Super Admin (Rajesh Sharma) has permission to approve administrators.');
      return;
    }
    try {
      setLoading(true);
      await adminApi.approveAdmin(userId);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId || u._id === userId
            ? { ...u, role: 'admin', adminApproved: true, adminRequested: false, tier: 'Authorized Workshop Admin' }
            : u
        )
      );
      showFeedback(`👑 ${targetName || 'User'} has been approved as Website Administrator! They can now manage the website.`);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to approve administrator.');
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeAdmin = async (userId, targetName) => {
    if (!isSuperAdmin) {
      setErrorMsg('Only Super Admin (Rajesh Sharma) has permission to revoke administrators.');
      return;
    }
    try {
      setLoading(true);
      await adminApi.revokeAdmin(userId);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId || u._id === userId
            ? { ...u, role: 'client', adminApproved: false, adminRequested: false, tier: 'Registered Studio Client' }
            : u
        )
      );
      showFeedback(`🛡️ Admin access revoked for ${targetName || 'user'}. Account moved to Client.`);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to revoke administrator.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6 sm:space-y-8 pb-16">
      {/* ─── Top Master Header in Radhe Radios Theme ─── */}
      <div className="relative rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#07090e] via-[#0d121c] to-[#07090e] border border-cyan-500/30 shadow-[0_0_40px_rgba(0,229,255,0.12)] p-4 sm:p-8 overflow-hidden">
        {/* Overhead Neon Lamp Accents */}
        <div className="absolute top-0 left-1/4 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_#00e5ff]" />
        <div className="absolute top-0 right-1/4 translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_20px_#ef4444]" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6">
          <div className="flex items-center gap-3.5 sm:gap-5">
            <div className="relative group shrink-0">
              <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-black/80 border-2 border-cyan-400/80 p-1.5 sm:p-2 shadow-[0_0_30px_rgba(0,229,255,0.4)] flex items-center justify-center">
                <img
                  src="/logo.svg"
                  alt="Radhe Radios Logo"
                  className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(0,229,255,0.8)]"
                />
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-emerald-500 border-2 border-black flex items-center justify-center text-[9px] sm:text-[10px] text-black font-black" title="Workshop Online">
                ✓
              </span>
            </div>

            <div className="space-y-1">
              {isSuperAdmin ? (
                <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-0.5 sm:py-1 rounded-full bg-gradient-to-r from-amber-500/25 via-red-500/20 to-cyan-500/20 border border-amber-400/60 text-amber-300 text-[10px] sm:text-xs font-mono font-black uppercase tracking-wider shadow-[0_0_20px_rgba(245,158,11,0.35)]">
                  <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" />
                  <span>👑 Master Super Admin • Ownership</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider">
                  <ShieldAlert className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-400" />
                  <span>🛡️ Authorized Staff Admin</span>
                </div>
              )}
              <h1 className="font-display font-serif text-lg sm:text-2xl md:text-3xl font-black uppercase text-white tracking-wide">
                {isSuperAdmin ? 'Super Admin' : 'Website Admin'} <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-red-500">{user?.name || 'Rajesh'}</span>
              </h1>
              <p className="text-[10px] sm:text-xs text-zinc-400 font-mono flex flex-wrap items-center gap-2 sm:gap-3">
                <span>📍 Transport Nagar, Kota</span>
                <span className="text-zinc-600">•</span>
                <span>📞 {user?.phone || '9887158522'}</span>
                <span className="text-zinc-600">•</span>
                <span className="text-cyan-400 font-bold">{isSuperAdmin ? 'Master Authority Control' : 'Staff Operations Console'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="/#/"
              className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-zinc-300 hover:text-white text-[11px] sm:text-xs font-mono font-bold uppercase flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Eye className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-cyan-400" />
              <span>View Website</span>
            </a>
            <button
              type="button"
              onClick={onLogout}
              className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-red-500/40 bg-red-500/10 hover:bg-red-500/20 text-red-300 text-[11px] sm:text-xs font-mono font-bold uppercase transition-all cursor-pointer shadow-[0_0_15px_rgba(239,68,68,0.2)]"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* ─── Navigation Tabs Bar (Horizontal swipeable on mobile) ─── */}
      <div className="flex flex-nowrap overflow-x-auto no-scrollbar gap-1.5 sm:gap-2 border-b border-white/[0.1] pb-3 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
        {[
          { id: 'overview', label: '📊 Overview', icon: Sparkles },
          { id: 'sales', label: '💰 Sales & Revenue', icon: DollarSign },
          { id: 'products', label: `📦 Products (${products.length || '•'})`, icon: Package },
          { id: 'inquiries', label: `📋 Inquiries (${inquiries.length || '•'})`, icon: ClipboardList },
          { id: 'contacts', label: `📩 Leads (${contacts.length || '•'})`, icon: Mail },
          {
            id: 'users',
            label: isSuperAdmin ? '👑 Staff & Access' : '👥 Members',
            count: users.length,
            pendingCount: users.filter((u) => u.adminRequested && !u.adminApproved).length,
            icon: Users,
          },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-400 to-red-500 text-black shadow-[0_0_20px_rgba(0,229,255,0.4)] scale-102 font-black'
                  : 'bg-white/[0.04] text-zinc-300 hover:text-white hover:bg-white/[0.08] border border-white/[0.08]'
              }`}
            >
              <span>{tab.label}</span>
              {tab.pendingCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-amber-400 text-black font-black text-[9px] sm:text-[10px] animate-pulse shadow-[0_0_8px_#f59e0b]">
                  {tab.pendingCount} NEW
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ─── Global Notifications / Alerts ─── */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center justify-between gap-3 shadow-[0_0_20px_rgba(16,185,129,0.15)] animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-semibold">{successMsg}</span>
          </div>
          <button type="button" onClick={() => setSuccessMsg('')} className="text-zinc-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/40 text-red-300 text-xs font-mono flex items-center justify-between gap-3 shadow-[0_0_20px_rgba(239,68,68,0.2)] animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button type="button" onClick={() => setErrorMsg('')} className="text-zinc-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ─── TAB 1: OVERVIEW ─── */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {loading && !overview ? (
            <div className="py-16 flex justify-center items-center gap-3 text-cyan-300 font-mono text-sm">
              <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
              <span>Calibrating workshop control metrics...</span>
            </div>
          ) : (
            <>
              {/* Primary KPI Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-[#0c0f17] border border-cyan-500/30 relative overflow-hidden group hover:border-cyan-400 transition-all shadow-lg">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-all" />
                  <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-bold block mb-1">
                    Total Gross Sales
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display font-serif text-3xl font-black text-white">
                      ₹{Number(salesData?.totalRevenue || overview?.totalRevenue || 1245000).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-mono mt-2 block">
                    {salesData?.completedOrders ?? 4} Delivered &amp; Settled
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-[#0c0f17] border border-red-500/30 relative overflow-hidden group hover:border-red-400 transition-all shadow-lg">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full blur-2xl group-hover:bg-red-500/10 transition-all" />
                  <span className="text-[11px] font-mono uppercase tracking-wider text-red-400 font-bold block mb-1">
                    Active Builds &amp; Inquiries
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display font-serif text-3xl font-black text-white">
                      {overview?.inquiries?.total ?? inquiries.length}
                    </span>
                    <span className="text-xs text-red-300 font-mono font-bold">
                      ({overview?.inquiries?.inProduction ?? 2} in workshop)
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-mono mt-2 block">
                    Kota Custom Rig Queue
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-[#0c0f17] border border-cyan-500/30 relative overflow-hidden group hover:border-cyan-400 transition-all shadow-lg">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-300 font-bold block mb-1">
                    Catalog Hardware Rigs
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display font-serif text-3xl font-black text-white">
                      {products.length || 4}
                    </span>
                    <span className="text-xs text-zinc-400 font-mono">Live on Website</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono mt-2 block flex items-center gap-1">
                    <Check className="w-3 h-3" /> Sliding panel synced
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-[#0c0f17] border border-white/10 relative overflow-hidden group hover:border-white/20 transition-all shadow-lg">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-300 font-bold block mb-1">
                    Registered Community
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display font-serif text-3xl font-black text-white">
                      {overview?.totalUsers ?? users.length}
                    </span>
                    <span className="text-xs text-zinc-400 font-mono">Members</span>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-mono mt-2 block">
                    DJ Operators &amp; Audio Clients
                  </span>
                </div>
              </div>

              {/* Quick Operation Strip */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-[#0c0f17] to-[#121622] border border-cyan-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
                <div className="space-y-1">
                  <h3 className="font-display font-serif text-lg font-bold uppercase text-white flex items-center gap-2">
                    <Zap className="w-5 h-5 text-cyan-400" />
                    <span>Quick Workshop Commands</span>
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Add new amplifiers, manage real-time inquiries, or dispatch notifications to your clients.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={openAddProductModal}
                    className="px-5 py-2.5 rounded-full bg-gradient-to-r from-cyan-400 to-red-500 text-black font-mono font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all cursor-pointer shadow-lg flex items-center gap-1.5"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>+ Add New Product</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('sales')}
                    className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white border border-white/20 font-mono font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <TrendingUp className="w-4 h-4 text-cyan-300" />
                    <span>View Sales Ledger</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* ─── TAB 2: SALES & REVENUE ─── */}
      {activeTab === 'sales' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display font-serif text-2xl font-black uppercase text-white tracking-wide">
                Sales Ledger &amp; Revenue Metrics
              </h2>
              <p className="text-xs text-zinc-400 font-mono mt-1">
                Live financial transactions, advance collections, and completed sound system orders.
              </p>
            </div>
            <button
              type="button"
              onClick={loadSales}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-zinc-300 hover:text-white text-xs font-mono font-bold uppercase flex items-center gap-2 transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
              <span>Refresh Sales</span>
            </button>
          </div>

          {/* Sales Breakdown Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-6 rounded-2xl bg-[#0c0f17] border border-cyan-500/40 relative overflow-hidden">
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold block mb-1">
                Total Gross Revenue
              </span>
              <div className="font-display font-serif text-3xl font-black text-white">
                ₹{Number(salesData?.totalRevenue || 1245000).toLocaleString('en-IN')}
              </div>
              <p className="text-[11px] text-zinc-400 font-mono mt-2">
                Settled across completed Kota acoustic builds
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0c0f17] border border-red-500/40 relative overflow-hidden">
              <span className="text-xs font-mono uppercase tracking-wider text-red-400 font-bold block mb-1">
                Completed &amp; Dispatched Orders
              </span>
              <div className="font-display font-serif text-3xl font-black text-white">
                {salesData?.completedOrders ?? 4}
              </div>
              <p className="text-[11px] text-zinc-400 font-mono mt-2">
                Out of {salesData?.ordersCount ?? inquiries.length} total workshop inquiries
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0c0f17] border border-emerald-500/40 relative overflow-hidden">
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold block mb-1">
                Average Rig Value
              </span>
              <div className="font-display font-serif text-3xl font-black text-white">
                ₹{Math.round(Number(salesData?.totalRevenue || 1245000) / (salesData?.completedOrders || 1)).toLocaleString('en-IN')}
              </div>
              <p className="text-[11px] text-zinc-400 font-mono mt-2">
                Typical professional stage &amp; DJ package
              </p>
            </div>
          </div>

          {/* Detailed Orders & Revenue Table */}
          <div className="rounded-2xl bg-[#0c0f17] border border-white/10 overflow-hidden shadow-xl">
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <h3 className="font-display font-serif text-base font-bold uppercase text-white">
                Order Billing &amp; Payment Statuses
              </h3>
              <span className="text-xs font-mono text-zinc-400">
                {salesData?.orders?.length || inquiries.length} Orders Listed
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-black/60 text-zinc-400 uppercase tracking-wider border-b border-white/10">
                  <tr>
                    <th className="py-3.5 px-4 font-bold">Order ID</th>
                    <th className="py-3.5 px-4 font-bold">Client / Operator</th>
                    <th className="py-3.5 px-4 font-bold">Audio System</th>
                    <th className="py-3.5 px-4 font-bold">Quote Amount</th>
                    <th className="py-3.5 px-4 font-bold">Payment Status</th>
                    <th className="py-3.5 px-4 font-bold">Build Status</th>
                    <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-zinc-300">
                  {(salesData?.orders || inquiries).map((order) => {
                    const paymentColor =
                      order.payment_status === 'Paid in Full'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : order.payment_status === 'Advance Received'
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/40';

                    return (
                      <tr key={order.id || order._id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3.5 px-4 font-bold text-cyan-400">
                          #{order.id}
                        </td>
                        <td className="py-3.5 px-4 font-sans font-medium text-white">
                          <div>{order.customer_name || order.user?.name || 'Walk-in Client'}</div>
                          <div className="text-[11px] text-zinc-500 font-mono">{order.customer_phone || order.user?.phone || 'No Phone'}</div>
                        </td>
                        <td className="py-3.5 px-4 text-zinc-200">
                          {order.system}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-white">
                          ₹{Number(order.amount || 0).toLocaleString('en-IN')}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${paymentColor}`}>
                            {order.payment_status || 'Pending'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="text-[11px] text-zinc-300 font-medium">
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              setActiveTab('inquiries');
                              startEditingInquiry(order);
                            }}
                            className="px-3 py-1 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/40 text-cyan-300 text-xs font-bold cursor-pointer"
                          >
                            Manage
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 3: PRODUCTS CATALOG (LIVE SLIDING PANEL SYNC) ─── */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display font-serif text-2xl font-black uppercase text-white tracking-wide">
                Products Catalog ({products.length})
              </h2>
              <p className="text-xs text-zinc-400 font-mono mt-1">
                Products added here are immediately rendered in the frontend circular globe sliding panel.
              </p>
            </div>

            <button
              type="button"
              onClick={openAddProductModal}
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-cyan-400 to-red-500 text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg hover:opacity-90 transition-opacity"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Add New Product</span>
            </button>
          </div>

          {/* Product Category Filter Bar */}
          <div className="flex flex-wrap items-center gap-2">
            {['ALL', 'Custom Power Amplifiers', 'Vehicle Audio Setups', 'Heavy Bass Speakers', 'Professional Sound Rigs'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setProductCategoryFilter(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                  productCategoryFilter === cat
                    ? 'bg-cyan-400 text-black font-bold shadow-md'
                    : 'bg-white/5 text-zinc-400 hover:text-white border border-white/10'
                }`}
              >
                {cat === 'ALL' ? 'All Hardware' : cat}
              </button>
            ))}
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products
              .filter((p) => productCategoryFilter === 'ALL' || p.category === productCategoryFilter)
              .map((p) => (
                <div
                  key={p.id}
                  className="rounded-3xl bg-[#0c0f17] border border-white/10 hover:border-cyan-500/40 transition-all flex flex-col justify-between overflow-hidden shadow-xl group"
                >
                  {/* Product Image Thumbnail */}
                  <div className="relative aspect-video w-full overflow-hidden bg-black">
                    <img
                      src={p.image || '/frames/frame_0180.jpg'}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0c0f17] via-transparent to-black/40" />

                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full bg-black/80 border border-cyan-400/40 text-[10px] font-mono uppercase tracking-wider text-cyan-300 backdrop-blur-md">
                        {p.category}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-cyan-500/30 to-red-500/30 border border-cyan-400/40 text-[10px] font-mono uppercase tracking-wider text-white backdrop-blur-md font-bold">
                        {p.badge || 'PRO RIG'}
                      </span>
                    </div>

                    {p.price && (
                      <div className="absolute bottom-3 left-3">
                        <span className="px-3 py-1 rounded-full bg-black/90 border border-white/20 text-xs font-mono font-bold text-cyan-300">
                          ₹{Number(p.price).toLocaleString('en-IN')}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-display font-serif text-lg font-bold uppercase text-white leading-tight">
                        {p.title}
                      </h3>
                      <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                        {p.description}
                      </p>

                      {p.specs && (
                        <div className="p-3 rounded-xl bg-black/50 border border-white/5 space-y-1 text-[11px] font-mono">
                          <div className="text-zinc-300 flex justify-between">
                            <span className="text-zinc-500">Power:</span>
                            <span className="text-cyan-300 font-bold">{p.specs.powerHandling}</span>
                          </div>
                          <div className="text-zinc-300 flex justify-between">
                            <span className="text-zinc-500">Frequency:</span>
                            <span className="text-white">{p.specs.frequencyRange}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-zinc-500">ID: {p.id}</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEditProductModal(p)}
                          className="px-3 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/30 text-cyan-300 text-xs font-mono font-bold flex items-center gap-1 cursor-pointer transition-all"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(p.id, p.title)}
                          className="p-1.5 rounded-lg border border-red-500/40 text-red-400 hover:bg-red-500/10 cursor-pointer transition-all"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ─── TAB 4: ORDERS & INQUIRIES MANAGEMENT ─── */}
      {activeTab === 'inquiries' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display font-serif text-2xl font-black uppercase text-white tracking-wide">
                Orders &amp; Acoustic Inquiries ({inquiries.length})
              </h2>
              <p className="text-xs text-zinc-400 font-mono mt-1">
                Manage quote pricing, update stage delivery schedules, and set workshop build statuses.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-zinc-400" />
              <select
                value={inquiryStatusFilter}
                onChange={(e) => setInquiryStatusFilter(e.target.value)}
                className="bg-[#0c0f17] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
              >
                <option value="ALL">All Build Statuses</option>
                <option value="Awaiting Engineering Review">Awaiting Engineering Review</option>
                <option value="In Production">In Production</option>
                <option value="Acoustic Review">Acoustic Review</option>
                <option value="Delivered & Deployed">Delivered & Deployed</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {inquiries
              .filter((i) => inquiryStatusFilter === 'ALL' || i.status === inquiryStatusFilter)
              .map((inq) => {
                const isEditing = editingInquiryId === (inq.id || inq._id);

                return (
                  <div
                    key={inq.id || inq._id}
                    className="p-6 rounded-3xl bg-[#0c0f17] border border-white/10 hover:border-cyan-500/40 transition-all space-y-4 shadow-xl"
                  >
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-bold text-cyan-400 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30">
                          #{inq.id}
                        </span>
                        <span className="text-xs text-zinc-400 font-mono">
                          {inq.date || inq.createdAt?.split('T')[0]}
                        </span>
                        <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-white/5 text-zinc-300">
                          Priority: {inq.priority || 'Normal'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {isEditing ? (
                          <>
                            <button
                              type="button"
                              onClick={() => handleSaveInquiryEdit(inq.id || inq._id)}
                              disabled={loading}
                              className="px-4 py-1.5 rounded-lg bg-emerald-500 text-black font-mono font-bold text-xs uppercase flex items-center gap-1 cursor-pointer"
                            >
                              <Save className="w-3.5 h-3.5" />
                              <span>Save Order</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingInquiryId(null)}
                              className="px-3 py-1.5 rounded-lg bg-white/10 text-white font-mono text-xs cursor-pointer"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => startEditingInquiry(inq)}
                              className="px-3.5 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/30 text-cyan-300 font-mono font-bold text-xs flex items-center gap-1 cursor-pointer"
                            >
                              <Edit className="w-3.5 h-3.5" />
                              <span>Edit Quote &amp; Status</span>
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                openNotifyModalForUser(
                                  {
                                    name: inq.customer_name || inq.user?.name || 'Client',
                                    phone: inq.customer_phone || inq.user?.phone || '',
                                    email: inq.customer_email || inq.user?.email || '',
                                  },
                                  'whatsapp'
                                )
                              }
                              className="px-3.5 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 font-mono font-bold text-xs flex items-center gap-1 cursor-pointer"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>WhatsApp</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Editable / View Form Details */}
                    {isEditing ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-2xl bg-black/50 border border-cyan-500/30 font-mono text-xs">
                        <div>
                          <label className="block text-zinc-400 mb-1">Build Status</label>
                          <select
                            value={inquiryEditForm.status}
                            onChange={(e) => setInquiryEditForm({ ...inquiryEditForm, status: e.target.value })}
                            className="w-full bg-[#0c0f17] border border-white/20 rounded-lg p-2 text-white"
                          >
                            <option value="Awaiting Engineering Review">Awaiting Engineering Review</option>
                            <option value="In Production">In Production</option>
                            <option value="Acoustic Review">Acoustic Review</option>
                            <option value="Delivered & Deployed">Delivered & Deployed</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-zinc-400 mb-1">Quote Amount (₹)</label>
                          <input
                            type="number"
                            value={inquiryEditForm.amount}
                            onChange={(e) => setInquiryEditForm({ ...inquiryEditForm, amount: e.target.value })}
                            className="w-full bg-[#0c0f17] border border-white/20 rounded-lg p-2 text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-zinc-400 mb-1">Payment Status</label>
                          <select
                            value={inquiryEditForm.payment_status}
                            onChange={(e) => setInquiryEditForm({ ...inquiryEditForm, payment_status: e.target.value })}
                            className="w-full bg-[#0c0f17] border border-white/20 rounded-lg p-2 text-white"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Advance Received">Advance Received</option>
                            <option value="Paid in Full">Paid in Full</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-zinc-400 mb-1">Priority</label>
                          <select
                            value={inquiryEditForm.priority}
                            onChange={(e) => setInquiryEditForm({ ...inquiryEditForm, priority: e.target.value })}
                            className="w-full bg-[#0c0f17] border border-white/20 rounded-lg p-2 text-white"
                          >
                            <option value="Normal">Normal</option>
                            <option value="High">High</option>
                            <option value="Urgent">Urgent</option>
                          </select>
                        </div>

                        <div className="sm:col-span-2 md:col-span-4">
                          <label className="block text-zinc-400 mb-1">Engineer Workshop Notes</label>
                          <input
                            type="text"
                            value={inquiryEditForm.notes}
                            onChange={(e) => setInquiryEditForm({ ...inquiryEditForm, notes: e.target.value })}
                            placeholder="e.g. Copper coil reinforced, burn-in tested at 4 Ohms"
                            className="w-full bg-[#0c0f17] border border-white/20 rounded-lg p-2 text-white"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
                        <div>
                          <span className="text-zinc-500 block">Requested Audio Rig:</span>
                          <span className="text-white font-sans font-bold text-sm block mt-0.5">{inq.system}</span>
                          <span className="text-zinc-400 text-[11px] block mt-1">📍 {inq.location || 'Kota / Rajasthan'}</span>
                        </div>

                        <div>
                          <span className="text-zinc-500 block">Client Contact:</span>
                          <span className="text-zinc-200 font-medium block mt-0.5">
                            {inq.customer_name || inq.user?.name || 'Valued Client'}
                          </span>
                          <span className="text-cyan-300 block text-[11px]">
                            {inq.customer_phone || inq.user?.phone || 'No Phone'}
                          </span>
                        </div>

                        <div>
                          <span className="text-zinc-500 block">Quote &amp; Payment:</span>
                          <span className="text-white font-bold text-sm block mt-0.5">
                            ₹{Number(inq.amount || 0).toLocaleString('en-IN')}
                          </span>
                          <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            inq.payment_status === 'Paid in Full'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : inq.payment_status === 'Advance Received'
                              ? 'bg-cyan-500/20 text-cyan-300'
                              : 'bg-amber-500/20 text-amber-300'
                          }`}>
                            {inq.payment_status || 'Pending'}
                          </span>
                        </div>

                        <div>
                          <span className="text-zinc-500 block">Current Status &amp; Notes:</span>
                          <span className="text-cyan-400 font-bold block mt-0.5">{inq.status}</span>
                          <p className="text-zinc-400 italic text-[11px] mt-1 line-clamp-2">
                            "{inq.notes || 'Awaiting initial workshop bench review.'}"
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* ─── TAB 5: CONTACT LEADS ─── */}
      {activeTab === 'contacts' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display font-serif text-2xl font-black uppercase text-white tracking-wide">
                Website Contact Leads ({contacts.length})
              </h2>
              <p className="text-xs text-zinc-400 font-mono mt-1">
                Direct inquiries from prospective DJ operators, venues, and dealership partners.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-zinc-400" />
              <select
                value={contactStatusFilter}
                onChange={(e) => setContactStatusFilter(e.target.value)}
                className="bg-[#0c0f17] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white font-mono"
              >
                <option value="ALL">All Leads</option>
                <option value="New">New</option>
                <option value="In Review">In Review</option>
                <option value="Contacted">Contacted</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {contacts
              .filter((c) => contactStatusFilter === 'ALL' || c.status === contactStatusFilter)
              .map((c) => (
                <div
                  key={c.ticket_id || c._id}
                  className="p-5 rounded-3xl bg-[#0c0f17] border border-white/10 hover:border-cyan-500/40 transition-all space-y-3 shadow-xl"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-cyan-400">#{c.ticket_id}</span>
                      <span className="text-xs text-zinc-500">•</span>
                      <span className="text-xs text-zinc-400 font-mono">{c.date || c.createdAt?.split('T')[0]}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-zinc-400">
                        {c.requirement_type || 'General Lead'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`https://api.whatsapp.com/send?phone=91${(c.contact || '').replace(/\D/g, '').slice(-10)}&text=${encodeURIComponent(`Hello ${c.name}, thank you for contacting Radhe Radios Kota! How can we assist with your sound setup?`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 font-mono font-bold text-xs flex items-center gap-1 cursor-pointer"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp Reply</span>
                      </a>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                    <div>
                      <span className="text-zinc-500 block">Name &amp; Phone:</span>
                      <span className="text-white font-sans font-bold text-sm block mt-0.5">{c.name}</span>
                      <span className="text-cyan-300 font-bold block mt-0.5">{c.contact}</span>
                    </div>

                    <div>
                      <span className="text-zinc-500 block">Location:</span>
                      <span className="text-zinc-200 block mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-red-400" />
                        <span>{c.location || 'Rajasthan'}</span>
                      </span>
                    </div>

                    <div>
                      <span className="text-zinc-500 block">Customer Note:</span>
                      <p className="text-zinc-300 italic mt-0.5">"{c.message || 'No specific notes'}"</p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ─── TAB 6: USERS, STAFF ACCESS CONTROL & DIRECT DISPATCH ─── */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          {/* Header & Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display font-serif text-2xl font-black uppercase text-white tracking-wide flex items-center gap-2">
                <span>{isSuperAdmin ? 'Staff Access Control & Admin Approvals' : 'Registered Members Directory'}</span>
                <span className="text-sm font-mono text-cyan-400 font-normal">({users.length})</span>
              </h2>
              <p className="text-xs text-zinc-400 font-mono mt-1">
                {isSuperAdmin
                  ? 'Master authority panel: Decide who can manage the website. Approve or revoke website administrator permissions.'
                  : 'Browse member directory, view roles, and dispatch direct WhatsApp or Email notifications.'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-zinc-400" />
              <input
                type="text"
                placeholder="Search member name or phone..."
                value={userSearchTerm}
                onChange={(e) => setUserSearchTerm(e.target.value)}
                className="bg-[#0c0f17] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white font-mono placeholder:text-zinc-600 focus:outline-none focus:border-cyan-400 w-64"
              />
            </div>
          </div>

          {/* Super Admin Access Control Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 rounded-2xl bg-[#0c0f17] border border-white/10 shadow-lg">
              <span className="text-[10px] font-mono text-zinc-500 uppercase block">Total Members</span>
              <span className="text-2xl font-mono font-black text-white">{users.length}</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#0c0f17] border border-amber-500/30 shadow-lg">
              <span className="text-[10px] font-mono text-amber-400 uppercase block font-bold">Super Admin</span>
              <span className="text-sm font-mono font-bold text-amber-200 mt-1 block">👑 Rajesh Sharma (Owner)</span>
              <span className="text-[10px] text-zinc-500 font-mono block">Transport Nagar, Kota</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#0c0f17] border border-cyan-500/30 shadow-lg">
              <span className="text-[10px] font-mono text-cyan-400 uppercase block font-bold">Authorized Admins</span>
              <span className="text-2xl font-mono font-black text-cyan-300">
                {users.filter((u) => (u.isAdmin || u.adminApproved || u.role === 'admin' || u.role === 'super_admin')).length}
              </span>
              <span className="text-[10px] text-zinc-500 font-mono block">Can manage website</span>
            </div>

            <div className={`p-4 rounded-2xl bg-[#0c0f17] shadow-lg border ${
              users.filter((u) => u.adminRequested && !u.adminApproved).length > 0
                ? 'border-amber-400/60 bg-amber-950/20 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                : 'border-white/10'
            }`}>
              <span className="text-[10px] font-mono text-amber-300 uppercase block font-bold">Pending Approvals</span>
              <span className="text-2xl font-mono font-black text-amber-300">
                {users.filter((u) => u.adminRequested && !u.adminApproved).length}
              </span>
              <span className="text-[10px] text-zinc-400 font-mono block">Awaiting Super Admin decision</span>
            </div>
          </div>

          {/* Role Filter Pills */}
          <div className="flex flex-nowrap overflow-x-auto no-scrollbar gap-1.5 sm:gap-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
            {[
              { id: 'ALL', label: `All Members (${users.length})` },
              {
                id: 'PENDING',
                label: `Pending Requests (${users.filter((u) => u.adminRequested && !u.adminApproved).length})`,
                hasPulsing: users.filter((u) => u.adminRequested && !u.adminApproved).length > 0,
              },
              {
                id: 'ADMINS',
                label: `Admins (${users.filter((u) => u.isAdmin || u.adminApproved || u.role === 'admin' || u.role === 'super_admin').length})`,
              },
              {
                id: 'CLIENTS',
                label: `Clients (${users.filter((u) => !u.isAdmin && !u.adminApproved && u.role !== 'admin' && u.role !== 'super_admin').length})`,
              },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setUserRoleFilter(f.id)}
                className={`shrink-0 px-3 sm:px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap ${
                  userRoleFilter === f.id
                    ? 'bg-gradient-to-r from-cyan-400 to-red-500 text-black shadow-md'
                    : 'bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10'
                }`}
              >
                <span>{f.label}</span>
                {f.hasPulsing && <span className="ml-1 text-amber-300 font-black">●</span>}
              </button>
            ))}
          </div>

          {/* Super Admin Authority Notice */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-cyan-500/10 to-transparent border border-amber-500/30 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs font-mono">
              <span className="font-bold text-amber-300 uppercase tracking-wider block">
                {isSuperAdmin
                  ? '👑 Super Admin Management Authority'
                  : '🛡️ Administrator Access Status'}
              </span>
              <p className="text-zinc-300 mt-0.5 leading-relaxed">
                {isSuperAdmin
                  ? 'As Super Admin Rajesh Sharma, your approvals dictate who can access this Admin Dashboard, add products to the frontend showcase, and manage customer inquiries. Click "Approve as Admin" to authorize staff members.'
                  : 'You are currently operating with Approved Staff Administrator permissions. Only Super Admin Rajesh Sharma (+91 98871 58522) has the master key to promote or revoke website administrators.'}
              </p>
            </div>
          </div>

          {/* Members Table */}
          <div className="rounded-3xl bg-[#0c0f17] border border-white/10 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-black/60 text-zinc-400 uppercase tracking-wider border-b border-white/10">
                  <tr>
                    <th className="py-3.5 px-4 font-bold">Member</th>
                    <th className="py-3.5 px-4 font-bold">Contact</th>
                    <th className="py-3.5 px-4 font-bold">System Role</th>
                    <th className="py-3.5 px-4 font-bold">Website Access Status</th>
                    <th className="py-3.5 px-4 font-bold text-center">Super Admin Decision</th>
                    <th className="py-3.5 px-4 font-bold text-right">Dispatch</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-zinc-300">
                  {users
                    .filter((u) => {
                      // Text search filter
                      if (userSearchTerm) {
                        const term = userSearchTerm.toLowerCase();
                        const match =
                          (u.name && u.name.toLowerCase().includes(term)) ||
                          (u.phone && u.phone.includes(term)) ||
                          (u.email && u.email.toLowerCase().includes(term));
                        if (!match) return false;
                      }

                      // Role filter
                      if (userRoleFilter === 'PENDING') {
                        return u.adminRequested && !u.adminApproved;
                      }
                      if (userRoleFilter === 'ADMINS') {
                        return u.isAdmin || u.adminApproved || u.role === 'admin' || u.role === 'super_admin';
                      }
                      if (userRoleFilter === 'CLIENTS') {
                        return !u.isAdmin && !u.adminApproved && u.role !== 'admin' && u.role !== 'super_admin';
                      }
                      return true;
                    })
                    .map((u) => {
                      const isThisUserSuper = u.phone === '9887158522' || (u.role || '').toLowerCase() === 'super_admin' || u.isSuperAdmin;
                      const isThisUserAdmin = isThisUserSuper || (u.adminApproved === true || (u.role || '').toLowerCase() === 'admin');
                      const isThisUserPending = !isThisUserSuper && u.adminRequested && !u.adminApproved;

                      return (
                        <tr key={u.id || u._id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-4 px-4 font-sans">
                            <div className="flex items-center gap-3">
                              <div className={`w-9 h-9 rounded-full border flex items-center justify-center font-bold text-xs ${
                                isThisUserSuper
                                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                                  : isThisUserAdmin
                                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                                  : 'bg-white/5 border-white/10 text-zinc-400'
                              }`}>
                                {isThisUserSuper ? '👑' : u.avatar || u.name?.slice(0, 2).toUpperCase() || 'RR'}
                              </div>
                              <div>
                                <div className="font-bold text-white text-sm flex items-center gap-1.5">
                                  <span>{u.name}</span>
                                  {isThisUserSuper && (
                                    <span className="px-1.5 py-0.2 rounded bg-amber-400 text-black text-[9px] font-black uppercase">
                                      Owner
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-zinc-500 font-mono">
                                  {u.company || 'Kota, Rajasthan'}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-4">
                            <div className="text-cyan-300 font-bold">{u.phone || 'No phone'}</div>
                            <div className="text-zinc-500 text-[11px]">{u.email || 'No email'}</div>
                          </td>

                          <td className="py-4 px-4">
                            <span className="text-xs text-zinc-300 font-bold block">{u.role}</span>
                            <span className="text-[10px] text-zinc-500 font-mono block">{u.tier}</span>
                          </td>

                          <td className="py-4 px-4">
                            {isThisUserSuper ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-red-500/20 border border-amber-400/50 text-amber-300 text-[11px] font-black uppercase">
                                <span>👑 Master Super Admin</span>
                              </span>
                            ) : isThisUserAdmin ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold uppercase">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Authorized Admin</span>
                              </span>
                            ) : isThisUserPending ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-[11px] font-bold uppercase animate-pulse">
                                <Clock className="w-3 h-3" />
                                <span>Awaiting Approval</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-zinc-400 text-[10px] uppercase">
                                <span>Client Member</span>
                              </span>
                            )}
                          </td>

                          {/* Super Admin Decision / Approval Actions */}
                          <td className="py-4 px-4 text-center">
                            {isThisUserSuper ? (
                              <span className="text-[11px] text-amber-300/80 font-mono font-bold">
                                Master Account
                              </span>
                            ) : isSuperAdmin ? (
                              isThisUserAdmin ? (
                                <button
                                  type="button"
                                  onClick={() => handleRevokeAdmin(u.id || u._id, u.name)}
                                  className="px-3 py-1.5 rounded-xl bg-red-950/60 hover:bg-red-900 border border-red-500/40 text-red-200 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm active:scale-95 flex items-center gap-1 mx-auto"
                                  title="Revoke admin access and set to Client"
                                >
                                  <X className="w-3.5 h-3.5" />
                                  <span>Revoke Admin</span>
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleApproveAdmin(u.id || u._id, u.name)}
                                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 border border-emerald-400/50 text-white text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.35)] hover:scale-105 active:scale-95 flex items-center gap-1.5 mx-auto"
                                  title="Approve this user to manage the website"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Approve as Admin</span>
                                </button>
                              )
                            ) : (
                              <span className="text-[11px] text-zinc-500 font-mono">
                                {isThisUserAdmin ? 'Approved Staff' : 'Super Admin Only'}
                              </span>
                            )}
                          </td>

                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => openNotifyModalForUser(u, 'whatsapp')}
                                className="p-2 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center gap-1 cursor-pointer transition-all"
                                title="Send WhatsApp Message"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => openNotifyModalForUser(u, 'email')}
                                className="p-2 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/40 text-cyan-300 font-bold text-xs flex items-center gap-1 cursor-pointer transition-all"
                                title="Send Email Alert"
                              >
                                <Mail className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Dispatched Notification History Log */}
          {notificationsHistory.length > 0 && (
            <div className="rounded-3xl bg-[#0c0f17] border border-white/10 p-5 space-y-4 shadow-xl">
              <h3 className="font-display font-serif text-base font-bold uppercase text-white flex items-center gap-2">
                <Send className="w-4 h-4 text-cyan-400" />
                <span>Recent Dispatched Client Notifications</span>
              </h3>

              <div className="space-y-2">
                {notificationsHistory.slice(0, 5).map((n) => (
                  <div
                    key={n.id || n._id}
                    className="p-3 rounded-xl bg-black/40 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        n.type === 'whatsapp' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-cyan-500/20 text-cyan-300'
                      }`}>
                        {n.type}
                      </span>
                      <span className="text-white font-bold">{n.recipient_name}</span>
                      <span className="text-zinc-400">({n.recipient_phone || n.recipient_email})</span>
                    </div>
                    <div className="text-zinc-400 truncate max-w-md">
                      "{n.message}"
                    </div>
                    <span className="text-zinc-500 text-[10px] shrink-0">
                      {n.sent_at?.split('T')[0] || 'Just now'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── MODAL 1: ADD / EDIT PRODUCT TO CATALOG ─── */}
      {showProductModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in"
          onClick={() => setShowProductModal(false)}
        >
          <div
            className="relative w-full max-w-2xl rounded-3xl bg-[#0c0f17] border border-cyan-500/40 p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowProductModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full border border-white/10 text-zinc-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold">
                Hardware Management
              </span>
              <h3 className="font-display font-serif text-2xl font-black uppercase text-white mt-1">
                {editingProduct ? 'Edit Rig Specifications' : 'Add New Rig to Live Sliding Panel'}
              </h3>
              <p className="text-xs text-zinc-400 font-mono mt-1">
                Once saved, this product immediately appears in the 3D circular globe showcase on the homepage.
              </p>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-zinc-300 mb-1 font-bold">Rig / System Title *</label>
                <input
                  type="text"
                  required
                  value={productForm.title}
                  onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                  placeholder="e.g. Radhe 8000W Heavy-Duty Stage Rig"
                  className="w-full bg-black/60 border border-white/15 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-cyan-400 font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-zinc-300 mb-1 font-bold">Category *</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full bg-black/60 border border-white/15 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Custom Power Amplifiers">Custom Power Amplifiers</option>
                    <option value="Vehicle Audio Setups">Vehicle Audio Setups</option>
                    <option value="Heavy Bass Speakers">Heavy Bass Speakers</option>
                    <option value="Professional Sound Rigs">Professional Sound Rigs</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-300 mb-1 font-bold">Price (₹ M.R.P.) *</label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    placeholder="e.g. 75000"
                    className="w-full bg-black/60 border border-white/15 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 mb-1 font-bold">Badge / Tagline</label>
                  <input
                    type="text"
                    value={productForm.badge}
                    onChange={(e) => setProductForm({ ...productForm, badge: e.target.value })}
                    placeholder="e.g. Kota Handcrafted / Paisa Vasool"
                    className="w-full bg-black/60 border border-white/15 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Image Selection with Presets */}
              <div className="space-y-2">
                <label className="block text-zinc-300 font-bold">Showcase Rig Photo</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {PRESET_IMAGES.map((preset) => (
                    <button
                      key={preset.url}
                      type="button"
                      onClick={() => setProductForm({ ...productForm, image: preset.url })}
                      className={`relative aspect-video rounded-xl overflow-hidden border transition-all cursor-pointer ${
                        productForm.image === preset.url
                          ? 'border-cyan-400 ring-2 ring-cyan-400/50 scale-102'
                          : 'border-white/10 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-1 text-[9px] text-white text-center font-bold">
                        {preset.label.split(' ')[0]}
                      </div>
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={productForm.image}
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                  placeholder="Or enter custom image URL / path (e.g. /frames/frame_0180.jpg)"
                  className="w-full bg-black/60 border border-white/15 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-cyan-400 text-xs"
                />
              </div>

              <div>
                <label className="block text-zinc-300 mb-1 font-bold">Description</label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Heavy-duty Class-A power amplifier built with dual heatsinks, toroidal copper transformer, zero-distortion clarity..."
                  className="w-full bg-black/60 border border-white/15 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-400 font-sans"
                />
              </div>

              {/* Technical Specs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-black/40 border border-white/10">
                <div>
                  <label className="block text-cyan-300 mb-1">Power Handling</label>
                  <input
                    type="text"
                    value={productForm.powerHandling}
                    onChange={(e) => setProductForm({ ...productForm, powerHandling: e.target.value })}
                    placeholder="e.g. 5000W RMS Class-A"
                    className="w-full bg-[#0c0f17] border border-white/15 rounded-lg py-1.5 px-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-cyan-300 mb-1">Driver / Architecture</label>
                  <input
                    type="text"
                    value={productForm.driverSize}
                    onChange={(e) => setProductForm({ ...productForm, driverSize: e.target.value })}
                    placeholder="e.g. Dual 18-Inch Neodymium Subwoofers"
                    className="w-full bg-[#0c0f17] border border-white/15 rounded-lg py-1.5 px-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-cyan-300 mb-1">Acoustic Spectrum</label>
                  <input
                    type="text"
                    value={productForm.frequencyRange}
                    onChange={(e) => setProductForm({ ...productForm, frequencyRange: e.target.value })}
                    placeholder="e.g. 25Hz - 160Hz Deep Low-End"
                    className="w-full bg-[#0c0f17] border border-white/15 rounded-lg py-1.5 px-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-cyan-300 mb-1">Cabinet / Chassis</label>
                  <input
                    type="text"
                    value={productForm.enclosure}
                    onChange={(e) => setProductForm({ ...productForm, enclosure: e.target.value })}
                    placeholder="e.g. 18mm Marine Birch Plywood"
                    className="w-full bg-[#0c0f17] border border-white/15 rounded-lg py-1.5 px-2.5 text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-cyan-400 to-red-500 text-black font-mono font-black uppercase text-xs tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:opacity-90 mt-4"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Publishing to Catalog...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>{editingProduct ? 'Save Specifications' : 'Publish & Sync with Frontend'}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL 2: DIRECT NOTIFICATION (WHATSAPP & EMAIL) ─── */}
      {showNotifyModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in"
          onClick={() => setShowNotifyModal(false)}
        >
          <div
            className="relative w-full max-w-xl rounded-3xl bg-[#0c0f17] border border-cyan-500/40 p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowNotifyModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full border border-white/10 text-zinc-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase">
                <Send className="w-4 h-4" />
                <span>Client Dispatch Center</span>
              </div>
              <h3 className="font-display font-serif text-2xl font-black uppercase text-white mt-1">
                Send Notification to {notifyForm.recipientName}
              </h3>
              <p className="text-xs text-zinc-400 font-mono mt-0.5">
                Send real-time updates directly to the client's WhatsApp or Email.
              </p>
            </div>

            {/* Quick Templates Strip */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-mono text-zinc-400 uppercase font-bold">Quick Templates:</span>
              <div className="flex flex-wrap gap-2">
                {NOTIFICATION_TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.title}
                    type="button"
                    onClick={() => applyNotificationTemplate(tpl)}
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-mono text-cyan-300 font-bold cursor-pointer"
                  >
                    + {tpl.title}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSendNotification} className="space-y-4 text-xs font-mono">
              {/* Channel Selector */}
              <div>
                <label className="block text-zinc-300 mb-1 font-bold">Dispatch Channel</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setNotifyForm({ ...notifyForm, type: 'whatsapp' })}
                    className={`py-2.5 px-4 rounded-xl border flex items-center justify-center gap-2 font-bold uppercase transition-all cursor-pointer ${
                      notifyForm.type === 'whatsapp'
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                        : 'bg-black/40 border-white/10 text-zinc-400'
                    }`}
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                    <span>WhatsApp Alert</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNotifyForm({ ...notifyForm, type: 'email' })}
                    className={`py-2.5 px-4 rounded-xl border flex items-center justify-center gap-2 font-bold uppercase transition-all cursor-pointer ${
                      notifyForm.type === 'email'
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,229,255,0.3)]'
                        : 'bg-black/40 border-white/10 text-zinc-400'
                    }`}
                  >
                    <Mail className="w-4 h-4 text-cyan-400" />
                    <span>Email Dispatch</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 mb-1 font-bold">Client Phone Number</label>
                  <input
                    type="text"
                    required
                    value={notifyForm.recipientPhone}
                    onChange={(e) => setNotifyForm({ ...notifyForm, recipientPhone: e.target.value })}
                    placeholder="e.g. 9887158522"
                    className="w-full bg-black/60 border border-white/15 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 mb-1 font-bold">Client Email</label>
                  <input
                    type="email"
                    value={notifyForm.recipientEmail}
                    onChange={(e) => setNotifyForm({ ...notifyForm, recipientEmail: e.target.value })}
                    placeholder="e.g. client@gmail.com"
                    className="w-full bg-black/60 border border-white/15 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {notifyForm.type === 'email' && (
                <div>
                  <label className="block text-zinc-300 mb-1 font-bold">Email Subject</label>
                  <input
                    type="text"
                    required
                    value={notifyForm.subject}
                    onChange={(e) => setNotifyForm({ ...notifyForm, subject: e.target.value })}
                    placeholder="e.g. Official Update — Radhe Radios Kota"
                    className="w-full bg-black/60 border border-white/15 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-cyan-400 font-sans"
                  />
                </div>
              )}

              <div>
                <label className="block text-zinc-300 mb-1 font-bold">Message Content *</label>
                <textarea
                  rows={5}
                  required
                  value={notifyForm.message}
                  onChange={(e) => setNotifyForm({ ...notifyForm, message: e.target.value })}
                  placeholder="Enter message for client..."
                  className="w-full bg-black/60 border border-white/15 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-400 font-sans text-xs leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={sendingNotification}
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-cyan-400 to-red-500 text-black font-mono font-black uppercase text-xs tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:opacity-90"
              >
                {sendingNotification ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Dispatching...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>
                      {notifyForm.type === 'whatsapp' ? 'Open WhatsApp & Log Record' : 'Dispatch Email Notification'}
                    </span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
