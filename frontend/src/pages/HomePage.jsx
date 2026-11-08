import React, { useState } from 'react';
import { CinematicScrollSequence } from '../components/animation/CinematicScrollSequence';
import { SoundSystemsSection } from '../components/home/SoundSystemsSection';
import { ProductShowcaseSection } from '../components/home/ProductShowcaseSection';
import { CraftProcessSection } from '../components/home/CraftProcessSection';
import { DealershipDeskSection } from '../components/home/DealershipDeskSection';
import { VerifiedReviewsSection } from '../components/ui/VerifiedReviewsSection';
import { WelcomeOnboardingModal } from '../components/onboarding/WelcomeOnboardingModal';
import { useDeviceMode } from '../hooks/useDeviceMode';

export function HomePage() {
  const { isMobile } = useDeviceMode();
  
  // On mobile preview / mobile app: open onboarding first like an app.
  // On PC: never show onboarding modal, show landing page directly!
  const [mobileOnboardingClosed, setMobileOnboardingClosed] = useState(() => {
    try {
      return sessionStorage.getItem('radhe_mobile_onboarding_seen') === 'true';
    } catch {
      return false;
    }
  });

  const shouldShowOnboarding = isMobile && !mobileOnboardingClosed;

  return (
    <div className="w-full bg-[#080808]">
      {/* ── 0. MOBILE APP ONBOARDING (OPENS LIKE AN APP ON MOBILE PREVIEW) ── */}
      {shouldShowOnboarding && (
        <WelcomeOnboardingModal
          isOpen={shouldShowOnboarding}
          onClose={() => setMobileOnboardingClosed(true)}
        />
      )}

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
