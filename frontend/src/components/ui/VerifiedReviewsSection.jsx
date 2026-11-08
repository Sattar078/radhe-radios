import React, { useState, useEffect } from 'react';
import { Star, ShieldCheck, CheckCircle2, MessageSquarePlus, Sparkles, Loader2, X } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { reviewsApi } from '../../services/api';

export function VerifiedReviewsSection() {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const { isHindi } = useLanguage();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formError, setFormError] = useState('');

  // Form states
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [bassPower, setBassPower] = useState(5);
  const [clarity, setClarity] = useState(5);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await reviewsApi.list();
      setReviews(res.reviews || []);
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!title.trim() || !comment.trim()) {
      setFormError('Please provide a title and your feedback.');
      return;
    }

    setSubmitting(true);
    try {
      await reviewsApi.create({
        title,
        comment,
        rating,
        bass_power: bassPower,
        clarity,
      });

      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setShowReviewModal(false);
        setTitle('');
        setComment('');
        fetchReviews();
      }, 1500);
    } catch (err) {
      setFormError(err.message || 'Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="w-full py-10 sm:py-20 bg-[#000000] border-t border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 md:px-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-8 sm:mb-12">
          <div className="space-y-2 sm:space-y-3">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-white/5 border border-white/20 text-white text-[10px] sm:text-xs font-mono uppercase">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
              <span>VERIFIED DJ OPERATOR REVIEWS</span>
            </div>
            <h2 className="font-display text-2xl sm:text-4xl md:text-5xl font-black uppercase text-white">
              CUSTOMER VOICES • <span className="text-sonic-gradient">PAISA VASOOL</span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 max-w-xl font-normal">
              Real, verified feedback from sound engineers, DJ operators, and event clients across India.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              if (!isAuthenticated) {
                openAuthModal('login');
              } else {
                setShowReviewModal(true);
              }
            }}
            className="self-start md:self-auto px-4 py-2 sm:px-6 sm:py-3 rounded-full bg-white text-black font-extrabold text-[11px] sm:text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-all hover:bg-zinc-200 active:scale-95 cursor-pointer shadow-md"
          >
            <MessageSquarePlus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black" />
            <span>Share Your Review</span>
          </button>
        </div>

        {/* Reviews Cards */}
        {loading ? (
          <div className="py-16 flex items-center justify-center gap-2 text-zinc-400 text-xs font-mono">
            <Loader2 className="w-5 h-5 animate-spin text-white" />
            <span>Loading verified reviews...</span>
          </div>
        ) : reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((rev) => (
              <GlassCard
                key={rev._id || rev.title}
                className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl flex flex-col justify-between border-white/10 hover:border-white/30 transition-all backdrop-blur-xl bg-[#0c0c0e]"
              >
                <div>
                  {/* Stars & Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1 text-cyan-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < (rev.rating || 5) ? 'fill-cyan-400 text-cyan-400 drop-shadow-[0_0_6px_rgba(0,229,255,0.7)]' : 'text-zinc-600'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-cyan-300 bg-cyan-950/40 px-2.5 py-0.5 rounded-full border border-cyan-400/30">
                      <ShieldCheck className="w-3 h-3 text-cyan-400" />
                      <span>Verified Client</span>
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-white mb-2 leading-snug">{rev.title}</h3>
                  <p className="text-xs text-zinc-300 leading-relaxed font-normal mb-6">"{rev.comment}"</p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white block">{rev.author_name}</span>
                    <span className="text-[11px] text-zinc-400 block">{rev.author_role}</span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400">{rev.location}</span>
                </div>
              </GlassCard>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-zinc-500 text-xs">
            No reviews yet. Be the first to share your experience!
          </div>
        )}

        {/* Modal for adding review */}
        {showReviewModal && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in"
            onClick={() => setShowReviewModal(false)}
          >
            <div
              className="relative w-full max-w-lg rounded-3xl bg-[#0c0c0e] border border-white/15 p-6 sm:p-8 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setShowReviewModal(false)}
                className="absolute top-5 right-5 p-2 rounded-full border border-white/10 text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-2 text-white text-xs font-mono font-bold">
                <Sparkles className="w-4 h-4 text-white" />
                <span>Write a Review</span>
              </div>
              <h3 className="font-display text-xl font-bold uppercase text-white mb-4">
                Share Your Experience
              </h3>

              {formError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs mb-4">
                  {formError}
                </div>
              )}

              {submitSuccess ? (
                <div className="p-6 text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-white mx-auto" />
                  <h4 className="font-bold text-white text-base">
                    Thank you! Your review has been published.
                  </h4>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Rating Selector */}
                  <div>
                    <label className="block text-xs text-zinc-400 font-bold mb-1.5">
                      Overall Rating
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setRating(num)}
                          className="p-1 cursor-pointer"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              num <= rating ? 'fill-cyan-400 text-cyan-400 drop-shadow-[0_0_8px_rgba(0,229,255,0.8)]' : 'text-zinc-600'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-xs text-white font-mono ml-2 font-bold">{rating} / 5</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-zinc-400 font-bold mb-1">
                      Review Headline *
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Unbelievable Bass Throw & PAISA VASOOL Quality"
                      className="w-full bg-black/60 border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-zinc-400 font-bold mb-1">
                      Detailed Experience & Sound Performance *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Describe sound clarity, amplifier thermal efficiency, bass output, etc..."
                      className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-white"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 rounded-full bg-white hover:bg-zinc-200 text-black font-bold text-xs uppercase font-mono tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-md"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-black" />
                        <span>Publishing...</span>
                      </>
                    ) : (
                      <span>Publish Review</span>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

