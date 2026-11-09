import React from 'react';
import { CinematicScrollSequence } from '../components/animation/CinematicScrollSequence';
import { SoundSystemsSection } from '../components/home/SoundSystemsSection';
import { ProductShowcaseSection } from '../components/home/ProductShowcaseSection';
import { CraftProcessSection } from '../components/home/CraftProcessSection';
import { DealershipDeskSection } from '../components/home/DealershipDeskSection';
import { VerifiedReviewsSection } from '../components/ui/VerifiedReviewsSection';
import { SocialCommunitySection } from '../components/home/SocialCommunitySection';

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

      {/* ── 5. OFFICIAL SOCIAL MEDIA & COMMUNITY (INSTA, YOUTUBE, FB, MAPS) ─ */}
      <SocialCommunitySection />

      {/* ── 6. VERIFIED CUSTOMER & DJ REVIEWS ──────────────────────────────── */}
      <VerifiedReviewsSection />

      {/* ── 7. PAN-INDIA DEALERSHIP DESK & DIRECT CONSULTATION ────────────── */}
      <DealershipDeskSection />
    </div>
  );
}
