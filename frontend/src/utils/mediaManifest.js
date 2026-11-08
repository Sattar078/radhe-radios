/**
 * Central Media & Asset Manifest for Radhe Radios Kota
 * Declares verified paths, dimensions, frame rates, and sequence conventions.
 */

export const MEDIA_MANIFEST = {
  // Master 4K Video Asset
  video: {
    src: '/radheradios.mp4',
    poster: '/hero-poster.jpg',
    width: 3840,
    height: 2160,
    aspectRatio: '16/9',
    frameRate: 30,
    durationSeconds: 27.8,
    totalVideoFrames: 834,
  },

  // Web-Optimized Sequential Canvas Frames
  frames: {
    directory: '/frames',
    prefix: 'frame_',
    extension: '.jpg',
    digits: 4,
    count: 775,
    width: 1280,
    height: 720,
    aspectRatio: 16 / 9,
    format: 'jpeg',
    totalSizeMB: 32.54,
  },

  // Brand Graphic Vectors & Posters
  brand: {
    favicon: '/favicon.svg',
    poster: '/hero-poster.jpg',
  },

  // Curated Keyframe Stills for Editorial Showcases
  keyframes: {
    heroFallback: '/hero-poster.jpg',
    acousticEngineering: '/frames/frame_0300.jpg',
    dualCabinetRig: '/frames/frame_0180.jpg',
    towerSpeakers: '/frames/frame_0320.jpg',
    stageRig: '/frames/frame_0450.jpg',
    homeAudio: '/frames/frame_0580.jpg',
  },

  // 4-Phase Cinematic Narrative Milestones (mapped across 775 frames)
  phases: [
    {
      id: 'phase-1',
      range: [0.0, 0.25],
      frameStart: 1,
      frameEnd: 194,
      tag: 'PHASE 01 — ILLUMINATION',
      title: 'Sculpting Shadow & Acoustic Form',
      description:
        'Atmospheric lighting reveals the refined micro-texture, wooden cabinet joins, and heavy-duty speaker architecture engineered in Bundi, Rajasthan.',
    },
    {
      id: 'phase-2',
      range: [0.25, 0.50],
      frameStart: 195,
      frameEnd: 388,
      tag: 'PHASE 02 — KINETIC PRECISION',
      title: 'Driver Geometry & Internal Airflow',
      description:
        'Continuous focal sweep across high-output subwoofers, compression horns, and tuned port resonance calibrated for clean, distortion-free output.',
    },
    {
      id: 'phase-3',
      range: [0.50, 0.75],
      frameStart: 389,
      frameEnd: 582,
      tag: 'PHASE 03 — ANAMORPHIC DEPTH',
      title: 'Concert-Grade Power Handling',
      description:
        'Optics reflecting the true frequency response and durability of our touring DJ sound systems and high-fidelity residential setups.',
    },
    {
      id: 'phase-4',
      range: [0.75, 1.0],
      frameStart: 583,
      frameEnd: 775,
      tag: 'PHASE 04 — MASTER FINISH',
      title: 'Uncompromising 1989 Standard',
      description:
        'Every sound system is backed by 35+ years of acoustic integrity, rigorous stress tests, and nationwide dealership distribution.',
    },
  ],
};

/**
 * Returns the exact public URL for a given frame index (1 to 775).
 * @param {number} index 
 * @returns {string} e.g. "/frames/frame_0042.jpg"
 */
export function getFrameUrl(index) {
  const clamped = Math.max(1, Math.min(MEDIA_MANIFEST.frames.count, Math.round(index)));
  const padded = String(clamped).padStart(MEDIA_MANIFEST.frames.digits, '0');
  return `${MEDIA_MANIFEST.frames.directory}/${MEDIA_MANIFEST.frames.prefix}${padded}${MEDIA_MANIFEST.frames.extension}`;
}
