import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { STUDIO_CONFIG } from '../data/studioData';
import { GlassCard } from '../components/ui/GlassCard';
import { useRouter } from '../router';
import { downloadsApi } from '../services/api';
import { AdminDashboard } from '../components/admin/AdminDashboard';
import {
  ShieldCheck,
  Download,
  Clock,
  PhoneCall,
  MapPin,
  CheckCircle2,
  Building,
  User,
  LogOut,
  PlusCircle,
  Sparkles,
  Phone,
  MessageCircle,
  Check,
  Loader2,
  Edit,
  Trash2,
  X,
  Save,
  ShieldAlert,
} from 'lucide-react';

export function PortalPage() {
  const {
    user,
    isAuthenticated,
    isAdmin,
    logout,
    openAuthModal,
    quickDemoLogin,
    updateProfile,
    addInquiry,
    updateInquiry,
    deleteInquiry,
  } = useAuth();
  const { navigate, queryParams } = useRouter();

  const initialTab = queryParams.get('tab') || 'overview';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [downloadingId, setDownloadingId] = useState(null);
  const [downloadSuccess, setDownloadSuccess] = useState(null);
  const [downloadsList, setDownloadsList] = useState([]);
  const [loadingDownloads, setLoadingDownloads] = useState(false);

  useEffect(() => {
    if (activeTab === 'downloads') {
      setLoadingDownloads(true);
      downloadsApi
        .list()
        .then((res) => setDownloadsList(res.downloads || []))
        .catch((err) => console.error('Failed to load downloads:', err))
        .finally(() => setLoadingDownloads(false));
    }
  }, [activeTab]);

  // New quote form state
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [quoteSystem, setQuoteSystem] = useState('18" Dual Bass System');
  const [quoteLocation, setQuoteLocation] = useState(user?.location || 'Rajasthan');
  const [quoteNotes, setQuoteNotes] = useState('');
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);
  const [quoteSubmitting, setQuoteSubmitting] = useState(false);

  // Profile edit state
  const [editName, setEditName] = useState(user?.name || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const [editLocation, setEditLocation] = useState(user?.location || '');
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);

  // Inquiry edit state (User edit & update feature)
  const [editingInquiry, setEditingInquiry] = useState(null);
  const [editInqSystem, setEditInqSystem] = useState('');
  const [editInqLocation, setEditInqLocation] = useState('');
  const [editInqNotes, setEditInqNotes] = useState('');
  const [editInqSaving, setEditInqSaving] = useState(false);
  const [inquiryUpdatedMsg, setInquiryUpdatedMsg] = useState('');

  const openEditInquiry = (inq) => {
    setEditingInquiry(inq);
    setEditInqSystem(inq.system || '');
    setEditInqLocation(inq.location || user?.location || '');
    setEditInqNotes(inq.notes || '');
  };

  const handleUpdateInquirySubmit = async (e) => {
    e.preventDefault();
    if (!editingInquiry) return;
    setEditInqSaving(true);
    try {
      await updateInquiry(editingInquiry.id, {
        system: editInqSystem,
        location: editInqLocation,
        notes: editInqNotes,
      });
      setInquiryUpdatedMsg('Your inquiry has been successfully updated!');
      setTimeout(() => setInquiryUpdatedMsg(''), 3000);
      setEditingInquiry(null);
    } catch (err) {
      console.error('Update inquiry error:', err);
    } finally {
      setEditInqSaving(false);
    }
  };

  const handleDeleteInquiry = async (inquiryId) => {
    if (!window.confirm('Are you sure you want to cancel this inquiry?')) return;
    try {
      await deleteInquiry(inquiryId);
      setInquiryUpdatedMsg('Inquiry has been cancelled.');
      setTimeout(() => setInquiryUpdatedMsg(''), 3000);
    } catch (err) {
      console.error('Delete inquiry error:', err);
    }
  };

  const handleDownload = async (doc) => {
    setDownloadingId(doc.id);
    setDownloadSuccess(null);
    try {
      await downloadsApi.track(doc.id);
      setDownloadSuccess(doc.id);
      setTimeout(() => setDownloadSuccess(null), 3500);
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setDownloadingId(null);
    }
  };

  const handleCreateInquiry = async (e) => {
    e.preventDefault();
    if (!quoteSystem) return;

    setQuoteSubmitting(true);
    try {
      await addInquiry({
        system: quoteSystem,
        location: quoteLocation,
        notes: quoteNotes,
      });
      setQuoteSubmitted(true);
      setTimeout(() => {
        setQuoteSubmitted(false);
        setShowQuoteForm(false);
        setQuoteNotes('');
      }, 1500);
    } catch (err) {
      console.error('Inquiry error:', err.message);
    } finally {
      setQuoteSubmitting(false);
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    try {
      await updateProfile({
        name: editName,
        phone: editPhone,
        location: editLocation,
      });
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2000);
    } catch (err) {
      console.error('Profile save error:', err.message);
    } finally {
      setProfileSaving(false);
    }
  };

  // If NOT authenticated, show simple guest view with 1-click access
  if (!isAuthenticated || !user) {
    return (
      <div className="w-full py-20 px-6 md:px-10 text-center">
        <div className="max-w-xl mx-auto space-y-6">
          <div className="w-16 h-16 rounded-full border border-[#00e5ff]/40 bg-[#00e5ff]/10 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(0,229,255,0.2)]">
            <ShieldCheck className="w-8 h-8 text-[#00e5ff]" />
          </div>

          <h1 className="font-display text-3xl sm:text-4xl font-black uppercase text-[#F5F5F5]">
            CLIENT PORTAL <span className="text-zinc-400">SIGN IN</span>
          </h1>

          <p className="text-sm text-[#A1A1AA] leading-relaxed">
            Log in with 1-click test profile to view custom orders, builds, and factory rates:
          </p>

          <div className="p-6 rounded-3xl bg-[#0E1118] border border-[#00e5ff]/30 text-left space-y-4 shadow-xl">
            <span className="text-xs font-bold text-[#00e5ff] block">
              ⚡ 1-Click Fast Access (No Password Needed)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => quickDemoLogin('dealer')}
                className="py-3 px-3 rounded-xl bg-[#00e5ff] hover:bg-[#38bdf8] text-[#080808] font-bold text-xs uppercase transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>DJ Operator</span>
              </button>
              <button
                type="button"
                onClick={() => quickDemoLogin('client')}
                className="py-3 px-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-[#F5F5F5] font-bold text-xs uppercase transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
              >
                <User className="w-4 h-4 text-[#00e5ff]" />
                <span>Client Account</span>
              </button>
              <button
                type="button"
                onClick={() => quickDemoLogin('admin')}
                className="py-3 px-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 font-bold text-xs uppercase transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
              >
                <ShieldAlert className="w-4 h-4 text-red-400" />
                <span>Workshop Admin</span>
              </button>
            </div>
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => openAuthModal('login')}
                className="text-xs text-[#00e5ff] hover:underline font-bold"
              >
                or enter phone number &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── ROLE-BASED ACCESS CONTROL: ADMIN VIEW ──
  // Only users who are confirmed Super Admin or Approved Admin can manage the website
  if (isAdmin) {
    return (
      <div className="w-full py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10">
          <AdminDashboard
            user={user}
            onLogout={() => {
              logout();
              navigate('/');
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10">
        {/* Pending Admin Approval Notice */}
        {user.adminRequested && !user.adminApproved && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-200 text-xs sm:text-sm font-mono flex items-center gap-3 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
            <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <span className="font-bold uppercase tracking-wider block text-amber-300">
                Staff Admin Request Pending Super Admin Approval
              </span>
              <span className="text-zinc-300 text-xs">
                Your request to manage the website has been submitted. Super Admin Rajesh Bhai must approve your account from his dashboard before website management controls unlock.
              </span>
            </div>
          </div>
        )}

        {/* User Hero Banner */}
        <div className="relative rounded-3xl bg-gradient-to-r from-[#0E1118] via-[#141620] to-[#0E1118] border border-[#00e5ff]/30 p-6 sm:p-8 mb-8 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/[0.05] border-2 border-white/20 flex items-center justify-center shrink-0 shadow-[0_0_25px_rgba(255,255,255,0.2)] p-2">
                {user.avatar ? (
                  <span className="font-display font-black text-2xl sm:text-3xl text-white">
                    {user.avatar}
                  </span>
                ) : (
                  <img
                    src="/radhe radios logo.svg"
                    alt="Radhe Radios Logo"
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
              <div className="space-y-1">
                <span className="px-3 py-0.5 rounded-full bg-[#00e5ff]/20 border border-[#00e5ff]/50 text-[#00e5ff] text-xs font-bold uppercase">
                  {user.role}
                </span>
                <h1 className="font-display text-2xl sm:text-3xl font-black uppercase text-[#F5F5F5]">
                  Welcome, {user.name}
                </h1>
                <p className="text-xs sm:text-sm text-[#A1A1AA] flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#00e5ff]" />
                  <span>{user.location}</span>
                  <span>&bull;</span>
                  <Phone className="w-3.5 h-3.5 text-[#00e5ff]" />
                  <span>{user.phone}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={`tel:${STUDIO_CONFIG.phone}`}
                className="px-4 py-2.5 rounded-xl bg-[#00e5ff] text-[#080808] font-bold text-xs flex items-center gap-1.5 shadow-md"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call Factory Desk</span>
              </a>
              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="px-4 py-2.5 rounded-xl border border-white/10 hover:border-red-500/50 hover:bg-red-500/10 text-white/70 hover:text-red-300 text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-white/[0.08] pb-4">
          {[
            { id: 'overview', label: '⚡ Overview', icon: Sparkles },
            { id: 'inquiries', label: `📋 My Inquiries & Orders (${user.inquiries?.length || 0})`, icon: Clock },
            { id: 'downloads', label: `📥 Schematics & Blueprints (${user.downloads?.length || 0})`, icon: Download },
            { id: 'profile', label: '👤 Profile & Contact', icon: User },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-[#00e5ff] text-[#080808] shadow-md'
                    : 'bg-white/[0.03] text-[#A1A1AA] hover:text-[#F5F5F5] border border-white/[0.08]'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-[#0E1118] border border-white/[0.08]">
                <span className="text-xs text-[#00e5ff] font-bold block mb-1">
                  Account Status
                </span>
                <span className="font-display text-lg font-bold text-white">Verified Partner</span>
                <span className="text-xs text-emerald-400 block mt-2 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 100% Original Guarantee
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-[#0E1118] border border-white/[0.08]">
                <span className="text-xs text-[#00e5ff] font-bold block mb-1">
                  Workshop Helpline
                </span>
                <span className="font-display text-lg font-bold text-[#00e5ff]">{STUDIO_CONFIG.phone}</span>
                <span className="text-xs text-white/50 block mt-2">
                  Open 9:00 AM to 8:30 PM
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-[#0E1118] border border-white/[0.08]">
                <span className="text-xs text-[#00e5ff] font-bold block mb-1">
                  Workshop Headquarters
                </span>
                <span className="font-display text-base font-bold text-white">Transport Nagar, Kota, Rajasthan</span>
                <span className="text-xs text-white/50 block mt-2">
                  All-India Insured Transport Logistics
                </span>
              </div>
            </div>

            {/* Quick Action Hotline Box */}
            <GlassCard elevated goldBorder className="p-6 sm:p-8 border-[#00e5ff]/30">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-white">Direct WhatsApp & Phone Consultation</span>
                  <h2 className="font-display text-xl sm:text-2xl font-black uppercase text-[#F5F5F5]">
                    Need custom amplifier specifications or vehicle audio consultation?
                  </h2>
                  <p className="text-xs sm:text-sm text-[#A1A1AA] max-w-xl">
                    Call or message our workshop engineers anytime for circuit schematics, custom wattage advice, and dispatch schedules.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <a
                    href={`tel:${STUDIO_CONFIG.phone}`}
                    className="px-5 py-3 rounded-full bg-[#00e5ff] text-[#080808] font-bold text-xs flex items-center gap-2 shadow-md hover:scale-105 transition-all"
                  >
                    <Phone className="w-4 h-4 fill-[#080808]" />
                    <span>Call Desk</span>
                  </a>
                  <a
                    href={`https://wa.me/${STUDIO_CONFIG.whatsapp.replace('+', '')}?text=${encodeURIComponent(
                      'Hello Radhe Radios Kota! I would like to inquire about amplifier specifications and pricing.'
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-3 rounded-full bg-[#25D366] text-white font-bold text-xs flex items-center gap-2 shadow-md hover:scale-105 transition-all"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>WhatsApp Us</span>
                  </a>
                </div>
              </div>
            </GlassCard>
          </div>
        )}

        {/* TAB 2: INQUIRIES & ORDERS */}
        {activeTab === 'inquiries' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-bold uppercase text-[#F5F5F5]">
                  My Custom Orders & Inquiries
                </h2>
                <p className="text-xs text-[#A1A1AA]">
                  Track status of your custom amplifier builds and acoustic speaker rigs.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowQuoteForm(!showQuoteForm)}
                className="px-4 py-2.5 rounded-full bg-[#00e5ff] text-[#080808] font-bold text-xs uppercase flex items-center gap-1.5 shadow-md"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{showQuoteForm ? 'Close Form' : 'Request Custom Build'}</span>
              </button>
            </div>

            {/* Quick Quote Form */}
            {showQuoteForm && (
              <GlassCard elevated goldBorder className="p-6 border-[#00e5ff]/40 animate-in fade-in">
                <h3 className="font-bold text-base text-[#F5F5F5] mb-4">
                  Request Custom Build Quotation
                </h3>
                {quoteSubmitted ? (
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>Inquiry sent! Our Kota workshop will contact you shortly.</span>
                  </div>
                ) : (
                  <form onSubmit={handleCreateInquiry} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-[#A1A1AA] font-bold mb-1">
                          Select System / Configuration:
                        </label>
                        <select
                          value={quoteSystem}
                          onChange={(e) => setQuoteSystem(e.target.value)}
                          className="w-full bg-[#080808] border border-white/10 rounded-xl py-2.5 px-3 text-xs text-[#F5F5F5] focus:outline-none focus:border-[#00e5ff]"
                        >
                          <option value='18" Dual Bass System'>18" Dual Bass System</option>
                          <option value='15" Dual Tops'>15" Dual Tops</option>
                          <option value='Full Concert DJ Rig'>Full Concert DJ Rig (4-Bass & 4-Top)</option>
                          <option value='Tower Speakers & Home Audio'>Tower Speakers & Home Audio</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs text-[#A1A1AA] font-bold mb-1">
                          Your City / Location
                        </label>
                        <input
                          type="text"
                          value={quoteLocation}
                          onChange={(e) => setQuoteLocation(e.target.value)}
                          placeholder="e.g. Kota, Jaipur, Indore"
                          className="w-full bg-[#080808]/80 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-[#F5F5F5] focus:outline-none focus:border-[#00e5ff]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-[#A1A1AA] font-bold mb-1">
                        Vehicle Model or Specific Audio Requirements
                      </label>
                      <textarea
                        rows={2}
                        value={quoteNotes}
                        onChange={(e) => setQuoteNotes(e.target.value)}
                        placeholder="e.g. I need custom amplifiers for my pickup truck, what wattage is recommended?"
                        className="w-full bg-[#080808]/80 border border-white/10 rounded-xl p-3 text-xs text-[#F5F5F5] focus:outline-none focus:border-[#00e5ff]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={quoteSubmitting}
                      className="py-2.5 px-6 rounded-full bg-[#00e5ff] text-[#080808] font-bold text-xs uppercase hover:bg-[#38bdf8] transition-all flex items-center gap-2 disabled:opacity-60"
                    >
                      {quoteSubmitting ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /><span>Connecting...</span></> : 'Submit Inquiry'}
                    </button>
                  </form>
                )}
              </GlassCard>
            )}

            {inquiryUpdatedMsg && (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>{inquiryUpdatedMsg}</span>
              </div>
            )}

            {/* List */}
            <div className="space-y-3">
              {user.inquiries && user.inquiries.length > 0 ? (
                user.inquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className="p-5 rounded-2xl bg-[#0E1118] border border-white/[0.08] hover:border-[#00e5ff]/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#00e5ff]">{inq.id}</span>
                        <span className="text-xs text-white/40">&bull;</span>
                        <span className="text-xs text-white/50">{inq.date || inq.createdAt?.split('T')[0]}</span>
                      </div>
                      <h3 className="font-bold text-base text-[#F5F5F5]">{inq.system}</h3>
                      <p className="text-xs text-[#A1A1AA]">
                        Location: {inq.location || user.location}
                      </p>
                      {inq.notes && (
                        <p className="text-xs text-zinc-400 italic">"{inq.notes}"</p>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-[#00e5ff]/20 text-[#00e5ff] border border-[#00e5ff]/40">
                        {inq.status}
                      </span>
                      <button
                        type="button"
                        onClick={() => openEditInquiry(inq)}
                        className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-mono text-[#00e5ff] flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Edit className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteInquiry(inq.id)}
                        className="p-1 rounded-lg border border-red-500/25 hover:bg-red-500/10 text-red-400 cursor-pointer transition-colors"
                        title="Cancel inquiry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center rounded-2xl bg-[#0E1118] border border-white/[0.06] text-[#A1A1AA] text-xs">
                  No inquiries yet. Click "Request Custom Build" to start consultation!
                </div>
              )}
            </div>

            {/* Modal for User to Edit & Update Inquiry */}
            {editingInquiry && (
              <div
                role="dialog"
                aria-modal="true"
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in"
                onClick={() => setEditingInquiry(null)}
              >
                <div
                  className="relative w-full max-w-lg rounded-3xl bg-[#0E1118] border border-[#00e5ff]/40 p-6 sm:p-8 shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => setEditingInquiry(null)}
                    className="absolute top-5 right-5 p-2 rounded-full border border-white/10 text-zinc-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <h3 className="font-display text-xl font-bold uppercase text-white mb-1">
                    Update Inquiry Details
                  </h3>
                  <span className="text-xs font-mono text-[#00e5ff] block mb-4">
                    Ref ID: #{editingInquiry.id}
                  </span>

                  <form onSubmit={handleUpdateInquirySubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-zinc-300 mb-1">
                        Audio Requirement / System
                      </label>
                      <input
                        type="text"
                        required
                        value={editInqSystem}
                        onChange={(e) => setEditInqSystem(e.target.value)}
                        placeholder="e.g. 18 inch Dual Bass System"
                        className="w-full bg-[#080808] border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-[#00e5ff]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-300 mb-1">
                        Location / Town / City
                      </label>
                      <input
                        type="text"
                        value={editInqLocation}
                        onChange={(e) => setEditInqLocation(e.target.value)}
                        placeholder="e.g. Kota / Bundi / Jaipur"
                        className="w-full bg-[#080808] border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-[#00e5ff]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-300 mb-1">
                        Detailed Notes / Amplifier Specs
                      </label>
                      <textarea
                        rows={3}
                        value={editInqNotes}
                        onChange={(e) => setEditInqNotes(e.target.value)}
                        placeholder="Mention preferred wattage, vehicle model or delivery details..."
                        className="w-full bg-[#080808] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#00e5ff]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={editInqSaving}
                      className="w-full py-3 rounded-full bg-[#00e5ff] hover:bg-[#38bdf8] text-[#080808] font-bold text-xs uppercase transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
                    >
                      {editInqSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Updating...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Save Changes</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: DOWNLOADS */}
        {activeTab === 'downloads' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-2xl font-bold uppercase text-[#F5F5F5]">
                Schematics, Catalogs & Blueprints
              </h2>
              <p className="text-xs text-[#A1A1AA]">
                Download latest 2026 amplifier circuit schematics, blueprints, and equipment specs.
              </p>
            </div>

            {loadingDownloads ? (
              <div className="py-12 flex items-center justify-center gap-2 text-zinc-400 text-xs">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Loading blueprints & schematics...</span>
              </div>
            ) : downloadsList.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {downloadsList.map((doc) => {
                  const isDownloading = downloadingId === doc.id;
                  const isSuccess = downloadSuccess === doc.id;
                  return (
                    <div
                      key={doc.id}
                      className="p-6 rounded-2xl bg-[#0E1118] border border-white/[0.08] hover:border-[#00e5ff]/40 transition-all flex flex-col justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="px-2.5 py-0.5 rounded bg-[#00e5ff]/15 border border-[#00e5ff]/30 text-[10px] font-bold text-[#00e5ff]">
                            {doc.format}
                          </span>
                          <span className="text-xs text-white/40">{doc.size}</span>
                        </div>
                        <h3 className="font-bold text-base text-[#F5F5F5]">{doc.title}</h3>
                        {doc.title_hindi && (
                          <p className="text-xs text-zinc-400 mt-1">{doc.title_hindi}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                          <span>Category: {doc.category}</span>
                          <span>{doc.download_count || 0} downloads</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDownload(doc)}
                          disabled={isDownloading}
                          className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold uppercase transition-all flex items-center justify-center gap-2 cursor-pointer ${
                            isSuccess
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'bg-[#00e5ff] hover:bg-[#38bdf8] text-[#080808] shadow-md'
                          }`}
                        >
                          {isDownloading ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Downloading...</span>
                            </>
                          ) : isSuccess ? (
                            <>
                              <Check className="w-4 h-4" />
                              <span>Download complete</span>
                            </>
                          ) : (
                            <>
                              <Download className="w-4 h-4" />
                              <span>Download Blueprint</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center rounded-2xl bg-[#0E1118] border border-white/[0.06] text-[#A1A1AA] text-xs">
                Technical schematics will be uploaded shortly.
              </div>
            )}
          </div>
        )}

        {/* TAB 4: PROFILE */}
        {activeTab === 'profile' && (
          <div className="max-w-xl space-y-6">
            <div>
              <h2 className="font-display text-2xl font-bold uppercase text-[#F5F5F5]">
                My Profile & Workshop Details
              </h2>
              <p className="text-xs text-[#A1A1AA]">
                Keep your address and verified phone number updated for safe freight dispatch.
              </p>
            </div>

            <GlassCard elevated goldBorder className="p-6 border-[#00e5ff]/30">
              {profileSaved && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Profile updated successfully!</span>
                </div>
              )}

              <form onSubmit={handleProfileSave} className="space-y-4">
                <div>
                  <label className="block text-xs text-[#A1A1AA] font-bold mb-1">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-[#080808]/80 border border-white/10 rounded-xl py-2.5 px-3 text-sm text-[#F5F5F5] focus:outline-none focus:border-[#00e5ff]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#A1A1AA] font-bold mb-1">
                    Mobile Phone Number
                  </label>
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full bg-[#080808]/80 border border-white/10 rounded-xl py-2.5 px-3 text-sm text-[#F5F5F5] focus:outline-none focus:border-[#00e5ff]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#A1A1AA] font-bold mb-1">
                    City / Town / State
                  </label>
                  <input
                    type="text"
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    className="w-full bg-[#080808]/80 border border-white/10 rounded-xl py-2.5 px-3 text-sm text-[#F5F5F5] focus:outline-none focus:border-[#00e5ff]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={profileSaving}
                  className="py-3 px-8 rounded-full bg-[#00e5ff] hover:bg-[#38bdf8] text-[#080808] font-bold text-xs uppercase transition-all shadow-md hover:scale-105 flex items-center gap-2 disabled:opacity-60"
                >
                  {profileSaving ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /><span>Saving...</span></> : 'Save Changes'}
                </button>
              </form>
            </GlassCard>
          </div>
        )}
      </div>
    </div>
  );
}
