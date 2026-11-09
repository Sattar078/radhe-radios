import React, { useState, useEffect } from 'react';
import { STUDIO_CONFIG, SOCIAL_LINKS } from '../data/studioData';
import { RevealOnScroll } from '../components/animation/RevealOnScroll';
import { GlassCard } from '../components/ui/GlassCard';
import { Mail, MapPin, Send, CheckCircle2, Radio, ShieldCheck, Phone, Loader2, AlertCircle, Navigation } from 'lucide-react';
import { InstagramIcon, FacebookIcon, YoutubeIcon, GoogleMapsIcon, WhatsAppIcon } from '../components/ui/SocialIcons';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Link } from '../router';
import { contactApi } from '../services/api';

export function ContactPage() {
  const { user, isAuthenticated, addInquiry } = useAuth();
  const { t, isHindi } = useLanguage();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    emailOrPhone: user?.phone || user?.email || '',
    requirementType: '18" Dual Bass System',
    location: user?.location || '',
    message: '',
  });

  // Keep synced if user logs in
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || user.name,
        emailOrPhone: prev.emailOrPhone || user.phone || user.email,
        location: prev.location || user.location,
      }));
    }
  }, [user]);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [serverError, setServerError] = useState('');

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Please provide your full name';
    if (!formData.emailOrPhone.trim()) {
      errs.emailOrPhone = 'Please provide your phone number or email';
    }
    if (!formData.location.trim()) {
      errs.location = 'Please state your city / town';
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    const errs = validate();
    setErrors(errs);

    if (Object.keys(errs).length === 0) {
      setIsSubmitting(true);
      try {
        const res = await contactApi.send({
          name: formData.name,
          contact: formData.emailOrPhone,
          requirement_type: formData.requirementType,
          location: formData.location,
          message: formData.message,
          source: 'contact_page',
        });

        setTicketId(res.ticket_id || '');
        setIsSubmitted(true);

        if (isAuthenticated && addInquiry) {
          addInquiry({
            system: formData.requirementType,
            location: formData.location,
            notes: formData.message,
          });
        }
      } catch (err) {
        setServerError(err.message || 'Failed to submit inquiry. Please call our workshop directly.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleReset = () => {
    setFormData({
      name: user?.name || '',
      emailOrPhone: user?.phone || user?.email || '',
      requirementType: '18" Dual Bass System',
      location: user?.location || '',
      message: '',
    });
    setIsSubmitted(false);
    setTicketId('');
    setServerError('');
    setErrors({});
  };

  return (
    <div className="w-full py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Col: Contact Info & Heritage Coordinates */}
          <div className="lg:col-span-5 flex flex-col">
            <RevealOnScroll>
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-[#F5F5F5] leading-[1.02] mb-6">
                {isHindi ? (
                  <>CONNECT DIRECTLY WITH <br /><span className="text-zinc-400">RADHE RADIOS KOTA</span></>
                ) : (
                  <>CONNECT WITH <br /><span className="text-gold-gradient">RADHE RADIOS</span></>
                )}
              </h1>
              <p className="text-sm sm:text-base text-zinc-300 leading-relaxed mb-10 font-normal">
                {isHindi
                  ? 'Whether you need custom Class-A vehicle power amplifiers or complete pro audio systems — our Kota workshop desk is at your service.'
                  : 'Whether you want a custom-built heavy-duty power amplifier for your vehicle or need high-performance professional audio solutions, our Kota desk is ready to assist.'}
              </p>

              {/* Trust Metrics Bar */}
              <div className="grid grid-cols-2 gap-2 mb-6">
                <div className="p-3 rounded-xl bg-white/[0.03] border border-cyan-400/30">
                  <span className="block text-xl font-black text-cyan-300 font-display">
                    {STUDIO_CONFIG.productSales || '10L+'}
                  </span>
                  <span className="text-[10px] font-mono uppercase text-zinc-300 font-bold tracking-wider">
                    Products Sold
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.03] border border-red-500/30">
                  <span className="block text-xl font-black text-red-400 font-display">
                    {STUDIO_CONFIG.totalDealers || '200+'}
                  </span>
                  <span className="text-[10px] font-mono uppercase text-zinc-300 font-bold tracking-wider">
                    Total Dealers
                  </span>
                </div>
              </div>

              {/* Official GSTIN Badge */}
              <div className="mb-6 p-3.5 rounded-2xl bg-cyan-950/20 border border-cyan-400/40 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div>
                    <span className="text-[10px] font-mono text-zinc-400 uppercase block font-semibold">Government Registered Business</span>
                    <span className="text-xs font-mono font-bold text-white tracking-wider">GSTIN: {STUDIO_CONFIG.gstin}</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                  ✓ Verified
                </span>
              </div>

              <div className="flex flex-col gap-5 pt-4 border-t border-white/[0.08]">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-[#00e5ff] bg-white/[0.02]">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-zinc-400 block font-semibold">
                      Helpline & WhatsApp
                    </span>
                    <div className="flex flex-wrap gap-x-3 text-sm font-semibold text-[#F5F5F5] font-mono">
                      <a href={`tel:${STUDIO_CONFIG.phones?.[0]?.number || STUDIO_CONFIG.phone || '+919887158522'}`} className="hover:text-[#00e5ff] transition-colors">
                        {STUDIO_CONFIG.phones?.[0]?.label || STUDIO_CONFIG.phone || '+91 98871 58522'}
                      </a>
                      <span className="text-zinc-600">•</span>
                      <a href={`tel:${STUDIO_CONFIG.phones?.[1]?.number || STUDIO_CONFIG.phoneSecondary || '+919509040057'}`} className="hover:text-[#00e5ff] transition-colors">
                        {STUDIO_CONFIG.phones?.[1]?.label || STUDIO_CONFIG.phoneSecondary || '+91 95090 40057'}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Shop Location & Google Maps */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-emerald-400 bg-white/[0.02] shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] font-mono uppercase text-zinc-400 block font-semibold">
                      Workshop & Headquarters
                    </span>
                    <span className="text-sm font-semibold text-[#F5F5F5] block mb-2">
                      {STUDIO_CONFIG.location}
                    </span>
                    <a
                      href={STUDIO_CONFIG.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono hover:bg-emerald-500/20 transition-all"
                    >
                      <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Open in Google Maps ↗</span>
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-[#00e5ff] bg-white/[0.02]">
                    <Radio className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-zinc-400 block font-semibold">
                      Distribution & Delivery Reach
                    </span>
                    <span className="text-sm font-semibold text-[#F5F5F5]">
                      {STUDIO_CONFIG.reach}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-[#00e5ff] bg-white/[0.02]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-zinc-400 block font-semibold">
                      Official Email Desk
                    </span>
                    <span className="text-sm font-semibold text-[#F5F5F5]">
                      {STUDIO_CONFIG.email}
                    </span>
                  </div>
                </div>
              </div>

              {/* Verified Social Channels & Handles */}
              <div className="pt-8 mt-8 border-t border-white/[0.08]">
                <span className="text-xs font-mono uppercase tracking-widest text-[#00e5ff] block mb-3 font-semibold">
                  Official Social Handles & Channels
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {SOCIAL_LINKS.map((s) => {
                    let IconComponent = Radio;
                    let iconColor = 'text-cyan-400';
                    let hoverBorder = 'hover:border-cyan-400/50';

                    if (s.type === 'instagram') {
                      IconComponent = InstagramIcon;
                      iconColor = 'text-pink-400';
                      hoverBorder = 'hover:border-pink-500/50';
                    } else if (s.type === 'facebook') {
                      IconComponent = FacebookIcon;
                      iconColor = 'text-blue-400';
                      hoverBorder = 'hover:border-blue-500/50';
                    } else if (s.type === 'youtube') {
                      IconComponent = YoutubeIcon;
                      iconColor = 'text-red-500';
                      hoverBorder = 'hover:border-red-500/50';
                    } else if (s.type === 'maps') {
                      IconComponent = GoogleMapsIcon;
                      iconColor = 'text-emerald-400';
                      hoverBorder = 'hover:border-emerald-500/50';
                    } else if (s.type === 'whatsapp') {
                      IconComponent = WhatsAppIcon;
                      iconColor = 'text-green-400';
                      hoverBorder = 'hover:border-green-500/50';
                    }

                    return (
                      <a
                        key={s.name}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`p-3 rounded-xl bg-white/[0.02] border border-white/[0.08] ${hoverBorder} flex items-center justify-between group transition-all text-xs font-mono text-zinc-300 hover:text-white`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <IconComponent className={`w-4 h-4 shrink-0 ${iconColor} group-hover:scale-110 transition-transform`} />
                          <div className="truncate">
                            <span className="font-bold text-white block truncate">{s.name}</span>
                            <span className="text-zinc-400 text-[10px] block truncate">{s.handle}</span>
                          </div>
                        </div>
                        <span className="text-zinc-500 group-hover:text-cyan-300 transition-colors ml-1">↗</span>
                      </a>
                    );
                  })}
                </div>
              </div>
            </RevealOnScroll>
          </div>

          {/* Right Col: Inquiry & Dealership Form */}
          <div className="lg:col-span-7">
            <RevealOnScroll delay={150}>
              <GlassCard className="p-8 sm:p-10 border-[#00e5ff]/30" elevated goldBorder>
                {/* Authenticated User Badge */}
                {isAuthenticated && user && (
                  <div className="mb-6 p-3.5 rounded-2xl bg-[#00e5ff]/10 border border-[#00e5ff]/30 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-[#00e5ff]" />
                      <span className="text-xs font-mono text-[#F5F5F5]">
                        'Logged in as' <strong className="text-[#00e5ff]">{user.name}</strong> ({user.role})
                      </span>
                    </div>
                    <Link to="/portal" className="text-[10px] font-mono text-[#00e5ff] hover:underline uppercase">
                      'My Portal →'
                    </Link>
                  </div>
                )}

                {isSubmitted ? (
                  <div className="py-12 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full border border-[#00e5ff]/50 bg-[#00e5ff]/10 flex items-center justify-center text-[#00e5ff] mb-6 shadow-[0_0_30px_rgba(0,229,255,0.25)]">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="font-display text-2xl font-bold uppercase text-[#F5F5F5] mb-2">
                      'Inquiry Dispatched'
                    </h3>
                    {ticketId && (
                      <span className="inline-block px-3 py-1 rounded-full bg-[#00e5ff]/15 border border-[#00e5ff]/30 text-[#00e5ff] text-xs font-mono font-bold uppercase mb-4">
                        Ticket Ref: #{ticketId}
                      </span>
                    )}
                    <p className="text-sm text-zinc-300 max-w-sm mb-6 leading-relaxed font-normal">
                      {t.dealership.form.successMsg}
                    </p>
                    {isAuthenticated && (
                      <p className="text-xs font-mono text-[#00e5ff] mb-6">
                        '• Saved to your portal history.'
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={handleReset}
                      className="px-6 py-2.5 rounded-full border border-white/20 text-xs font-mono uppercase tracking-wider text-white hover:border-[#00e5ff] transition-colors cursor-pointer"
                    >
                      'Send Another Inquiry'
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="space-y-6">
                    <div>
                      <h2 className="font-display text-2xl font-bold uppercase text-[#F5F5F5] mb-1">
                        {t.dealership.form.title}
                      </h2>
                      <p className="text-xs font-mono text-[#00e5ff] uppercase font-semibold">
                        'Direct connection to Radhe Radios Kota HQ'
                      </p>
                    </div>

                    {/* Name */}
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2 font-semibold">
                        {t.dealership.form.nameLabel} *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder={t.dealership.form.namePlaceholder}
                        className={`w-full px-4 py-3 rounded-xl bg-white/[0.03] border text-sm text-[#F5F5F5] placeholder:text-white/25 focus:outline-none focus:border-[#00e5ff] transition-colors ${
                          errors.name ? 'border-red-500/80' : 'border-white/10'
                        }`}
                      />
                      {errors.name && <p className="text-xs text-red-400 mt-1 font-mono">{errors.name}</p>}
                    </div>

                    {/* Phone or Email */}
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2 font-semibold">
                        {t.dealership.form.phoneLabel} *
                      </label>
                      <input
                        type="text"
                        value={formData.emailOrPhone}
                        onChange={(e) => setFormData({ ...formData, emailOrPhone: e.target.value })}
                        placeholder={t.dealership.form.phonePlaceholder}
                        className={`w-full px-4 py-3 rounded-xl bg-white/[0.03] border text-sm text-[#F5F5F5] placeholder:text-white/25 focus:outline-none focus:border-[#00e5ff] transition-colors ${
                          errors.emailOrPhone ? 'border-red-500/80' : 'border-white/10'
                        }`}
                      />
                      {errors.emailOrPhone && (
                        <p className="text-xs text-red-400 mt-1 font-mono">{errors.emailOrPhone}</p>
                      )}
                    </div>

                    {/* Hardware Selection & Location */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2 font-semibold">
                          {t.dealership.form.requirementLabel}
                        </label>
                        <select
                          value={formData.requirementType}
                          onChange={(e) => setFormData({ ...formData, requirementType: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-[#080808] border border-white/10 text-sm text-[#F5F5F5] focus:outline-none focus:border-[#00e5ff] transition-colors"
                        >
                          <option value="Dual 18-Inch Subwoofers">18" Dual Bass System</option>
                          <option value="Dual 15-Inch DJ Tops">15" Dual Tops</option>
                          <option value="Full Concert DJ Rig">Full Concert Rig (4-Bass & 4-Top)</option>
                          <option value="Tower Speakers for Home">Tower Speakers & Home Audio</option>
                          <option value="Dealership Consultation">Direct Dealership Application</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2 font-semibold">
                          {t.dealership.form.cityLabel} *
                        </label>
                        <input
                          type="text"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          placeholder={t.dealership.form.cityPlaceholder}
                          className={`w-full px-4 py-3 rounded-xl bg-white/[0.03] border text-sm text-[#F5F5F5] placeholder:text-white/25 focus:outline-none focus:border-[#00e5ff] transition-colors ${
                            errors.location ? 'border-red-500/80' : 'border-white/10'
                          }`}
                        />
                        {errors.location && (
                          <p className="text-xs text-red-400 mt-1 font-mono">{errors.location}</p>
                        )}
                      </div>
                    </div>

                    {/* Requirements Message */}
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2 font-semibold">
                        {t.dealership.form.messageLabel}
                      </label>
                      <textarea
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder={t.dealership.form.messagePlaceholder}
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-[#F5F5F5] placeholder:text-white/25 focus:outline-none focus:border-[#00e5ff] transition-colors"
                      />
                    </div>

                    {serverError && (
                      <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-mono flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{serverError}</span>
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 rounded-full bg-[#00e5ff] hover:bg-[#38bdf8] text-[#080808] font-mono font-bold text-xs uppercase tracking-wider transition-all hover:scale-[1.01] shadow-[0_0_20px_rgba(0,229,255,0.3)] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Dispatching Inquiry...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>{t.dealership.form.submitBtn}</span>
                        </>
                      )}
                    </button>

                    <div className="text-center text-xs text-zinc-400 font-sans">
                      {t.dealership.form.guarantee}
                    </div>
                  </form>
                )}
              </GlassCard>
            </RevealOnScroll>
          </div>
        </div>
      </div>
    </div>
  );
}
