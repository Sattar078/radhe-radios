import React from 'react';
import { CinematicScrollSequence } from '../components/animation/CinematicScrollSequence';
import { SoundSystemsSection } from '../components/home/SoundSystemsSection';
import { ProductShowcaseSection } from '../components/home/ProductShowcaseSection';
import { CraftProcessSection } from '../components/home/CraftProcessSection';
import { DealershipDeskSection } from '../components/home/DealershipDeskSection';
import { VerifiedReviewsSection } from '../components/ui/VerifiedReviewsSection';

export function HomePage() {
  return (
    <div className="w-full bg-[#080808]">
      {/* ── 1. CINEMATIC SCROLL SEQUENCE WITH INTEGRATED SCROLLYTELLING THEORY ─ */}
      <CinematicScrollSequence />

      {/* ── 2. CORE SOUND SYSTEMS & AMPLIFIERS ─────────────────────────────── */}
      <SoundSystemsSection />

      {/* ── 3. SIGNATURE RIGS & SPECIFICATIONS ─────────────────────────────── */}
      <ProductShowcaseSection />

      {/* ── 4. ACOUSTIC ENGINEERING WORKFLOW PROTOCOL ─────────────────────── */}
      <CraftProcessSection />

      {/* ── 5. VERIFIED CUSTOMER & DJ REVIEWS ──────────────────────────────── */}
      <VerifiedReviewsSection />

      {/* ── 6. PAN-INDIA DEALERSHIP DESK & DIRECT CONSULTATION ────────────── */}
      <DealershipDeskSection />
    </div>
  );
}
