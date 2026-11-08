import React, { useState, useEffect } from 'react';
import { Reveal } from '../components/ui/Reveal';
import { GlassCard } from '../components/ui/GlassCard';
import {
  ArrowUpRight,
  X,
  Download,
  ShieldCheck,
  Check,
  Search,
  Loader2,
  AlertCircle,
  PhoneCall,
  Zap,
  Volume2,
  Radio,
  SlidersHorizontal,
  Truck,
  Award,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Link, useRouter } from '../router';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useProducts } from '../hooks/useProducts';
import { downloadsApi } from '../services/api';
import {
  getWhatsAppOrderUrl,
  WhatsAppIcon,
  WORKSHOP_WHATSAPP_DISPLAY,
} from '../utils/whatsapp.js';

export function ProductsPage() {
  const { queryParams } = useRouter();
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const { t, isHindi } = useLanguage();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const {
    products,
    categories,
    loading,
    error,
    search,
    category,
    setSearch,
    setCategory,
  } = useProducts();

  // Open product from URL param (e.g. /store?product=product-1)
  useEffect(() => {
    const productId = queryParams.get('product');
    if (productId && products.length > 0) {
      const found = products.find((p) => p.id === productId);
      if (found) setSelectedProduct(found);
    }
  }, [queryParams, products]);

  const handleDownloadSpec = async () => {
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }
    setDownloadSuccess(true);
    try {
      await downloadsApi.track(selectedProduct?.id || 'dl-schematics');
    } catch (e) {
      console.warn('Track spec download:', e.message);
    }
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="w-full pt-20 sm:pt-28 md:pt-36 pb-12 sm:pb-24">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-10">

        {/* ── STORE HERO HEADER ── */}
        <div className="max-w-4xl mb-8 sm:mb-12 space-y-3 sm:space-y-4">
          <Reveal type="heading">
            <div className="inline-flex items-center gap-2 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-cyan-950/60 border border-cyan-400/40 text-cyan-200 text-[10px] sm:text-[11px] font-mono uppercase tracking-widest mb-2 backdrop-blur-md shadow-[0_0_15px_rgba(0,229,255,0.25)]">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#00e5ff]" />
              <span className="truncate">Radhe Radios Official Store • Transport Nagar, Kota</span>
            </div>
            <h1 className="font-display text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-[#F5F5F5] leading-tight sm:leading-[1.02]">
              {isHindi ? (
                <>HIGH-PERFORMANCE <br /><span className="text-zinc-400">AMPLIFIERS & SOUND SYSTEMS</span></>
              ) : (
                <>FACTORY-DIRECT <br /><span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-red-500 bg-clip-text text-transparent">SOUND RIGS &amp; SYSTEMS</span></>
              )}
            </h1>
          </Reveal>
          <Reveal type="paragraph">
            <p className="text-xs sm:text-sm md:text-base text-zinc-300 leading-relaxed font-normal max-w-3xl">
              {isHindi
                ? 'Kota, Rajasthan me handcrafted premium Class-A power circuits aur heavy bass speaker rigs. Direct WhatsApp ordering aur all-India dispatch.'
                : 'Explore our complete catalog of workshop-built amplifiers, competition subwoofers, line arrays, and DJ sound rigs. Order directly on WhatsApp with instant dispatch confirmation from Rajesh Bhai in Kota, Rajasthan.'}
            </p>
          </Reveal>
        </div>

        {/* ── WORKSHOP GUARANTEE & TRUST PILLARS ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-8 sm:mb-12">
          <div className="p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md flex items-center gap-2.5 sm:gap-3">
            <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center shrink-0 text-cyan-400">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <p className="text-[11px] sm:text-xs font-bold text-white uppercase tracking-wider leading-tight">Direct Rate</p>
              <p className="text-[9px] sm:text-[11px] text-zinc-400 leading-tight">Zero dealer margin</p>
            </div>
          </div>

          <div className="p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md flex items-center gap-2.5 sm:gap-3">
            <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center shrink-0 text-emerald-400">
              <WhatsAppIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <p className="text-[11px] sm:text-xs font-bold text-white uppercase tracking-wider leading-tight">WhatsApp Order</p>
              <p className="text-[9px] sm:text-[11px] text-zinc-400 leading-tight">Direct confirmation</p>
            </div>
          </div>

          <div className="p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md flex items-center gap-2.5 sm:gap-3">
            <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center shrink-0 text-cyan-400">
              <Truck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <p className="text-[11px] sm:text-xs font-bold text-white uppercase tracking-wider leading-tight">All-India Freight</p>
              <p className="text-[9px] sm:text-[11px] text-zinc-400 leading-tight">Door / depot logistics</p>
            </div>
          </div>

          <div className="p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md flex items-center gap-2.5 sm:gap-3">
            <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-red-500/15 border border-red-400/30 flex items-center justify-center shrink-0 text-red-400">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <p className="text-[11px] sm:text-xs font-bold text-white uppercase tracking-wider leading-tight">1-Year Warranty</p>
              <p className="text-[9px] sm:text-[11px] text-zinc-400 leading-tight">Kota workshop circuit</p>
            </div>
          </div>
        </div>

        {/* ── SEARCH & CATEGORY BAR ── */}
        <div className="space-y-4 sm:space-y-6 mb-8 sm:mb-12">
          {/* Search Box */}
          <div className="relative max-w-xl">
            <Search className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by model, watts, driver size..."
              className="w-full bg-white/[0.04] border border-white/[0.12] rounded-xl sm:rounded-2xl py-2.5 sm:py-3.5 pl-9 sm:pl-11 pr-8 sm:pr-10 text-xs sm:text-sm text-[#F5F5F5] placeholder-zinc-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                aria-label="Clear search"
                className="absolute right-3.5 sm:right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            )}
          </div>

          {/* Category Filter Pills (Horizontal swipe on phone, wrapped on desktop) */}
          <div className="flex flex-nowrap overflow-x-auto no-scrollbar gap-2 pb-1.5 -mx-3.5 px-3.5 sm:mx-0 sm:px-0 sm:flex-wrap">
            {categories.map((cat) => {
              const isSelected = (cat === 'All Audio Systems' && !category) || category === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat === 'All Audio Systems' ? '' : cat)}
                  className={`shrink-0 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full text-[11px] sm:text-xs font-mono tracking-wider uppercase transition-all cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? 'bg-gradient-to-r from-cyan-400 to-sky-500 text-black font-extrabold shadow-[0_0_20px_rgba(0,229,255,0.4)] scale-102 sm:scale-105'
                      : 'bg-white/[0.04] text-zinc-300 hover:text-white hover:bg-white/[0.08] border border-white/[0.08]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-24 gap-3 text-cyan-400">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="text-sm font-mono tracking-wide">Connecting to Kota workshop inventory...</span>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm mb-8">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Search result count */}
        {!loading && search && (
          <p className="text-xs text-zinc-400 mb-6 font-mono">
            Showing {products.length} {products.length === 1 ? 'system' : 'systems'} matching{' '}
            <span className="text-cyan-400 font-bold">"{search}"</span>
          </p>
        )}

        {/* ── PRODUCT CARDS GRID ── */}
        {!loading && !error && (
          <>
            {products.length === 0 ? (
              <div className="py-24 text-center rounded-3xl bg-white/[0.02] border border-white/[0.06] p-8 max-w-xl mx-auto space-y-4">
                <Volume2 className="w-12 h-12 text-zinc-600 mx-auto" />
                <h3 className="font-display text-xl uppercase font-bold text-white">No Matching Systems Found</h3>
                <p className="text-sm text-zinc-400">
                  Try searching with different keywords like "amplifier", "18 inch", "line array", or reset your filters.
                </p>
                <button
                  type="button"
                  onClick={() => { setSearch(''); setCategory(''); }}
                  className="px-6 py-2.5 rounded-full bg-cyan-400 text-black text-xs font-mono font-bold uppercase tracking-wider hover:bg-cyan-300"
                >
                  View All Products
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-20">
                {products.map((product) => {
                  const whatsAppOrderUrl = getWhatsAppOrderUrl(product);
                  const formattedPrice = product.price
                    ? `₹${Number(product.price).toLocaleString('en-IN')}`
                    : 'Contact for Quote';

                  return (
                    <GlassCard
                      key={product.id}
                      className="overflow-hidden group border-white/[0.1] hover:border-cyan-400/50 transition-all duration-300 flex flex-col justify-between"
                      goldBorder
                    >
                      {/* Visual Header */}
                      <div className="relative aspect-[16/10] overflow-hidden bg-[#0c0c0e]">
                        <img
                          src={product.image || '/frames/frame_0180.jpg'}
                          alt={product.title}
                          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 brightness-95 group-hover:brightness-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#080808]/95 via-transparent to-black/20" />

                        {/* Category Tag */}
                        <div className="absolute top-3.5 left-3.5">
                          <span className="text-[10px] font-mono tracking-wider uppercase bg-[#080808]/90 backdrop-blur-md px-3 py-1 rounded-full border border-cyan-400/30 text-cyan-200 font-bold">
                            {product.category}
                          </span>
                        </div>

                        {/* Badge / Rig Spec */}
                        <div className="absolute top-3.5 right-3.5 text-xs font-mono bg-gradient-to-r from-cyan-950/90 to-red-950/90 backdrop-blur-md px-3 py-1 rounded-full border border-cyan-400/40 text-white font-bold shadow-sm">
                          {product.badge || 'Workshop Build'}
                        </div>

                        {/* Price Callout Banner on Image bottom */}
                        <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between">
                          <div className="bg-black/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-cyan-400/30">
                            <span className="text-[9px] font-mono uppercase text-zinc-400 block leading-tight">Workshop Price</span>
                            <span className="text-base font-mono font-black text-cyan-300 leading-none">
                              {formattedPrice}
                            </span>
                          </div>

                          <div className="bg-emerald-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-emerald-500/40 text-[10px] font-mono font-bold text-emerald-300 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span>In Stock</span>
                          </div>
                        </div>
                      </div>

                      {/* Content Body */}
                      <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <h2
                            onClick={() => setSelectedProduct(product)}
                            className="font-display text-lg sm:text-xl font-bold uppercase text-[#F5F5F5] group-hover:text-cyan-300 transition-colors mb-2 cursor-pointer line-clamp-1"
                          >
                            {product.title}
                          </h2>

                          <p className="text-[11px] sm:text-xs text-zinc-300 leading-relaxed mb-3 sm:mb-4 font-normal line-clamp-2">
                            {product.description}
                          </p>

                          {/* Quick Specs Grid */}
                          {product.specs && (
                            <div className="grid grid-cols-2 gap-1.5 sm:gap-2 p-2.5 sm:p-3 rounded-xl bg-black/50 border border-white/[0.08] text-[11px] sm:text-xs font-mono mb-3 sm:mb-4">
                              <div>
                                <span className="text-zinc-500 block text-[8px] sm:text-[9px] uppercase">Power Handling</span>
                                <span className="text-cyan-300 font-bold truncate block">{product.specs.powerHandling}</span>
                              </div>
                              <div>
                                <span className="text-zinc-500 block text-[8px] sm:text-[9px] uppercase">Driver Size</span>
                                <span className="text-white truncate block">{product.specs.driverSize}</span>
                              </div>
                              <div>
                                <span className="text-zinc-500 block text-[8px] sm:text-[9px] uppercase">Frequency</span>
                                <span className="text-zinc-300 truncate block">{product.specs.frequencyRange}</span>
                              </div>
                              <div>
                                <span className="text-zinc-500 block text-[8px] sm:text-[9px] uppercase">Cabinet Enclosure</span>
                                <span className="text-zinc-300 truncate block">{product.specs.enclosure}</span>
                              </div>
                            </div>
                          )}

                          {/* Tags */}
                          {product.tags && product.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-3 sm:mb-5">
                              {product.tags.slice(0, 4).map((tg, tIdx) => (
                                <span key={tIdx} className="text-[9px] sm:text-[10px] font-mono text-zinc-400 bg-white/[0.03] px-2 py-0.5 rounded border border-white/[0.06]">
                                  #{tg}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Dual Action Buttons */}
                        <div className="pt-2.5 sm:pt-3 border-t border-white/[0.08] flex items-center gap-2">
                          {/* 1. ORDER ON WHATSAPP BUTTON */}
                          <a
                            href={whatsAppOrderUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-2 sm:py-2.5 px-2.5 sm:px-3.5 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-mono text-[11px] sm:text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 sm:gap-2 shadow-[0_0_15px_rgba(16,185,129,0.35)] transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                          >
                            <WhatsAppIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                            <span className="truncate">Order on WhatsApp</span>
                          </a>

                          {/* 2. SPECS & DETAILS BUTTON */}
                          <button
                            type="button"
                            onClick={() => setSelectedProduct(product)}
                            className="px-2.5 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 hover:border-cyan-400/40 text-cyan-200 font-mono text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
                            title="View full technical specs"
                          >
                            <span>Specs</span>
                            <ArrowUpRight className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
                          </button>
                        </div>
                      </div>
                    </GlassCard>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ── TECHNICAL PRODUCT DETAIL MODAL ── */}
        {selectedProduct && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200"
            onClick={() => setSelectedProduct(null)}
          >
            <div
              className="relative w-full max-w-2xl rounded-2xl sm:rounded-3xl bg-[#0B0D13] border border-cyan-400/40 p-4 sm:p-8 shadow-[0_0_60px_rgba(0,229,255,0.25)] max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                aria-label="Close product details"
                className="absolute top-3.5 right-3.5 sm:top-5 sm:right-5 p-1.5 sm:p-2 rounded-full border border-white/15 hover:border-cyan-400 text-zinc-300 hover:text-white transition-colors cursor-pointer bg-white/5"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Category & Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-0.5 sm:py-1 rounded-full bg-cyan-950/70 border border-cyan-400/40 text-cyan-300 text-[9px] sm:text-[10px] font-mono uppercase tracking-widest mb-2.5 sm:mb-3">
                <span>{selectedProduct.category}</span>
                <span>•</span>
                <span>{selectedProduct.badge || 'Official Rig'}</span>
              </div>

              {/* Title & Price Header */}
              <div className="mb-3.5 sm:mb-4">
                <h2 className="font-display text-lg sm:text-3xl font-black uppercase text-[#F5F5F5] leading-tight mb-1.5 sm:mb-2">
                  {selectedProduct.title}
                </h2>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 font-mono">
                  <span className="text-lg sm:text-2xl font-black text-cyan-300">
                    {selectedProduct.price
                      ? `₹${Number(selectedProduct.price).toLocaleString('en-IN')}`
                      : 'Direct Quote'}
                  </span>
                  <span className="text-[10px] sm:text-xs text-zinc-400 uppercase tracking-wider">Workshop Factory Price</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/30 text-emerald-300 text-[9px] sm:text-[10px] uppercase font-bold">
                    Ready to Dispatch
                  </span>
                </div>
              </div>

              {/* Product Visual */}
              <div className="relative aspect-[16/9] rounded-xl sm:rounded-2xl overflow-hidden mb-4 sm:mb-6 border border-white/10 bg-[#0c0c0e]">
                <img
                  src={selectedProduct.image || '/frames/frame_0180.jpg'}
                  alt={selectedProduct.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-4 sm:mb-6 font-normal">
                {selectedProduct.description}
              </p>

              {/* Complete Specifications Grid */}
              {selectedProduct.specs && (
                <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl sm:rounded-2xl p-3.5 sm:p-5 mb-4 sm:mb-6 space-y-2 sm:space-y-3 font-mono text-[11px] sm:text-xs">
                  <p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-cyan-400 font-bold mb-1">
                    Acoustic & Circuit Specifications
                  </p>
                  {Object.entries({
                    'Power Handling': selectedProduct.specs.powerHandling,
                    'Transducer / Driver': selectedProduct.specs.driverSize,
                    'Frequency Range': selectedProduct.specs.frequencyRange,
                    'Cabinet Enclosure': selectedProduct.specs.enclosure,
                    'Nominal Impedance': selectedProduct.specs.impedance || '8 Ohms / 4 Ohms selectable',
                    'Acoustic Sensitivity': selectedProduct.specs.sensitivity || '102 dB SPL @ 1W/1m',
                    'Manufacturing Origin': 'Transport Nagar Workshop, Kota, Rajasthan',
                  }).map(([label, value]) => (
                    <div key={label} className="flex justify-between border-b border-white/[0.06] pb-1.5 sm:pb-2 last:border-0 last:pb-0">
                      <span className="text-zinc-500 uppercase">{label}</span>
                      <span className="text-cyan-200 font-bold text-right max-w-[60%]">{value}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Blueprint / Spec Sheet Download Access */}
              <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/[0.08] mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-cyan-400" />
                    <span>Engineering Schematics & Frequency Graph</span>
                  </span>
                  <p className="text-[10px] sm:text-[11px] text-zinc-400">
                    {isAuthenticated
                      ? `Access unlocked for ${user.name}`
                      : 'Sign into client portal to download engineering schematics'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleDownloadSpec}
                  className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider bg-cyan-400/20 hover:bg-cyan-400/30 border border-cyan-400/40 text-cyan-200 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  {downloadSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Downloaded</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      <span>{isAuthenticated ? 'Get Blueprint' : 'Unlock Blueprint'}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Primary Call to Action: WhatsApp Order Button & Direct Call */}
              <div className="space-y-2.5 sm:space-y-3 pt-3 border-t border-white/10">
                <a
                  href={getWhatsAppOrderUrl(selectedProduct)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 sm:py-3.5 px-4 sm:px-6 rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-mono font-extrabold text-xs sm:text-sm uppercase tracking-wider text-center flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                >
                  <WhatsAppIcon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                  <span>Order on WhatsApp ({WORKSHOP_WHATSAPP_DISPLAY})</span>
                </a>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3 text-xs font-mono text-zinc-400">
                  <a
                    href="tel:+919887158522"
                    className="flex items-center gap-1.5 text-cyan-300 hover:text-white transition-colors"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Direct Call: +91 98871 58522</span>
                  </a>
                  <span className="text-[10px] sm:text-[11px] text-zinc-500">
                    Pan-India Road &amp; Village Delivery Available
                  </span>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
