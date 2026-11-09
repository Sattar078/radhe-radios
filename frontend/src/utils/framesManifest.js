import manifest from './framesManifest.json';

export const FRAMES_MANIFEST = manifest;
export const TOTAL_FRAMES = manifest.totalFrames; // 1000
export const FRAME_WIDTH = manifest.width; // 1280
export const FRAME_HEIGHT = manifest.height; // 720
export const FRAME_ASPECT_RATIO = manifest.aspectRatio; // 16/9
export const FRAME_URLS = manifest.frames;

/**
 * Returns the exact frame URL for a 1-based index.
 * @param {number} index - 1 to 1000
 * @returns {string}
 */
export function getFrameUrlByIndex(index) {
  const clamped = Math.max(1, Math.min(TOTAL_FRAMES, Math.round(index)));
  return FRAME_URLS[clamped - 1];
}

/**
 * Clamps a given index between 1 and TOTAL_FRAMES.
 * @param {number} index
 * @returns {number}
 */
export function clampFrameIndex(index) {
  return Math.max(1, Math.min(TOTAL_FRAMES, Math.round(index)));
}
