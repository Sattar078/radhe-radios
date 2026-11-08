import React, { useState, useEffect } from 'react';
import { Reveal } from '../ui/Reveal';
import { STUDIO_CONFIG, SOCIAL_LINKS } from '../../data/studioData';
import { MapPin, Phone, Mail, Send, CheckCircle2, Truck, ExternalLink, ShieldCheck, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Link } from '../../router';
import { contactApi } from '../../services/api';

export function DealershipDeskSection() {
  const { user, isAuthenticated, addInquiry } = useAuth();
  const { t, isHindi } = useLanguage();

  const [formState, setFormState] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    cityState: user?.location || '',
    requirement: '18" Dual Bass System',
    message: '',
  });

  useEffect(() => {
    if (user) {
      setFormState((prev) => ({
        ...prev,
        name: prev.name || user.name,
        phone: prev.phone || user.phone,
        cityState: prev.cityState || user.location,
      }));
    }
  }, [user]);

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [ticketId, setTicketId] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formState.name || !formState.phone) return;
    setSubmitting(true);

    try {
      const res = await contactApi.send({
        name: formState.name,
        contact: formState.phone,
        requirement_type: formState.requirement,
        location: formState.cityState,
        message: formState.message,
        source: 'dealership_desk',
      });

      setTicketId(res.ticket_id || '');
      setSubmitted(true);

      if (isAuthenticated && addInquiry) {
        addInquiry({
          system: formState.requirement,
          location: formState.cityState,
          notes: formState.message,
        });
      }
    } catch (err) {
      console.error('Dealership inquiry error:', err);
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="dealership"
      className="relative w-full py-12 px-3 sm:py-28 sm:px-10 bg-[#000000] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mb-8 sm:mb-16 space-y-3 sm:space-y-4">
          <Reveal type="heading">
            <h2 className="font-display text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white leading-tight">
              Connect With Our <span className="text-sonic-gradient">Factory Desk</span>
            </h2>
          </Reveal>

          <Reveal type="paragraph">
            <p className="text-xs sm:text-base text-zinc-300 leading-relaxed font-normal">
              {t.dealership.description}
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10">
          {/* Studio Contact Information & Social Channels */}
          <div className="lg:col-span-5 space-y-4 sm:space-y-6">
            <Reveal type="card" staggerIndex={0} className="p-4 sm:p-8 rounded-2xl sm:rounded-3xl bg-[#0c0c0e] border border-white/10 space-y-4 sm:space-y-6 backdrop-blur-2xl">
              <h3 className="font-display text-xl font-bold uppercase text-white">
                Radhe Radios Kota Workshop
              </h3>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex items-start gap-3 text-white/90">
                  <MapPin className="w-5 h-5 text-white shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white block">
                      Factory Workshop Address:
                    </span>
                    <span className="text-zinc-400">{STUDIO_CONFIG.location}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-white/90">
                  <Phone className="w-5 h-5 text-white shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white block">
                      Direct Helpline Numbers:
                    </span>
                    <div className="flex flex-col gap-1 mt-1 text-zinc-300 font-mono">
                      <a href={`tel:${STUDIO_CONFIG.phone.replace(/\s/g, '')}`} className="hover:text-white transition-colors">
                        {STUDIO_CONFIG.phone} (Workshop)
                      </a>
                      <a href={`tel:${STUDIO_CONFIG.phoneSecondary.replace(/\s/g, '')}`} className="hover:text-white transition-colors">
                        {STUDIO_CONFIG.phoneSecondary} (Helpline)
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-white/90">
                  <Truck className="w-5 h-5 text-white shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white block">
                      Dispatch & Delivery Reach:
                    </span>
                    <span className="text-zinc-400">{STUDIO_CONFIG.reach}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-white/90">
                  <Mail className="w-5 h-5 text-white shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white block">
                      Official Email Desk:
                    </span>
                    <span className="text-zinc-400">{STUDIO_CONFIG.email}</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 space-y-3">
                <span className="font-mono text-xs uppercase tracking-wider text-zinc-400 block font-semibold">
                  Live Testing & Audio Demos
                </span>
                <div className="flex flex-col gap-2">
                  {SOCIAL_LINKS.map((link) => (
                    <a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-white/25 transition-all text-xs font-mono text-zinc-300 group"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{link.name}</span>
                        <span className="text-zinc-400">({link.handle})</span>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-white group-hover:translate-x-0.5 transition-transform" />
                    </a>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          {/* Interactive Form with Monochrome Styling */}
          <div className="lg:col-span-7">
            <Reveal type="card" staggerIndex={1} className="p-4 sm:p-10 rounded-2xl sm:rounded-3xl bg-[#0c0c0e] border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.9)] backdrop-blur-2xl">
              {isAuthenticated && user && (
                <div className="mb-6 p-3.5 rounded-2xl bg-white/5 border border-white/15 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-white" />
                    <span className="text-xs font-mono text-white">
                      Logged in: <strong className="text-white">{user.name}</strong> ({user.role})
                    </span>
                  </div>
                  <Link to="/portal" className="text-[10px] font-mono text-zinc-300 hover:text-white uppercase">
                    Portal →
                  </Link>
                </div>
              )}

              {submitted ? (
                <div className="py-12 flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full border border-white/30 bg-white/10 flex items-center justify-center text-white">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-display text-2xl font-bold uppercase text-white">
                    Inquiry Received
                  </h3>
                  <p className="text-sm text-zinc-300 max-w-sm">
                    {t.dealership.form.successMsg}
                  </p>
                  {isAuthenticated && (
                    <p className="text-xs font-mono text-zinc-300">
                      • Saved to your portal history.
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setFormState({
                        name: '',
                        phone: '',
                        cityState: '',
                        requirement: '18" Dual Bass System',
                        message: '',
                      });
                    }}
                    className="px-6 py-2.5 rounded-full border border-white/20 hover:border-white text-xs font-mono uppercase text-white transition-colors cursor-pointer"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-1">
                    <h3 className="font-display text-xl font-bold uppercase text-white">
                      {t.dealership.form.title}
                    </h3>
                    <p className="text-xs text-zinc-400 font-normal">
                      Fill in your details for factory wholesale quotes and delivery estimates.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="inquiry-name" className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                        {t.dealership.form.nameLabel} *
                      </label>
                      <input
                        id="inquiry-name"
                        name="name"
                        type="text"
                        required
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        placeholder={t.dealership.form.namePlaceholder}
                        className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-white transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="inquiry-phone" className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                        {t.dealership.form.phoneLabel} *
                      </label>
                      <input
                        id="inquiry-phone"
                        name="phone"
                        type="tel"
                        required
                        value={formState.phone}
                        onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                        placeholder={t.dealership.form.phonePlaceholder}
                        className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-white transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="inquiry-city" className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                        {t.dealership.form.cityLabel} *
                      </label>
                      <input
                        id="inquiry-city"
                        name="city"
                        type="text"
                        required
                        value={formState.cityState}
                        onChange={(e) => setFormState({ ...formState, cityState: e.target.value })}
                        placeholder={t.dealership.form.cityPlaceholder}
                        className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-white transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="inquiry-requirement" className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                        {t.dealership.form.requirementLabel}
                      </label>
                      <select
                        id="inquiry-requirement"
                        name="requirement"
                        aria-label="Sound system requirement"
                        value={formState.requirement}
                        onChange={(e) => setFormState({ ...formState, requirement: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[#0c0c0e] border border-white/10 text-sm text-white focus:outline-none focus:border-white transition-colors"
                      >
                        <option value="Dual 18-Inch Subwoofers">18" Dual Bass System</option>
                        <option value="Dual 15-Inch DJ Tops">15" Dual Tops</option>
                        <option value="Full Concert DJ Rig">Full Concert Rig (4-Bass & 4-Top Setup)</option>
                        <option value="Tower Speakers for Home">Tower Speakers & Home Audio</option>
                        <option value="Custom Dealership Inquiry">Direct Dealership Application</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="inquiry-message" className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                      {t.dealership.form.messageLabel}
                    </label>
                    <textarea
                      id="inquiry-message"
                      name="message"
                      rows={3}
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      placeholder={t.dealership.form.messagePlaceholder}
                      className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-white transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 rounded-full bg-white hover:bg-zinc-200 text-black font-mono font-black text-xs uppercase tracking-wider transition-all hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-md"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-black" />
                        <span>Connecting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-black" />
                        <span>{t.dealership.form.submitBtn}</span>
                      </>
                    )}
                  </button>

                  <div className="pt-2 text-center text-xs text-zinc-400 font-sans">
                    <span>{t.dealership.form.guarantee}</span>
                  </div>
                </form>
              )}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
