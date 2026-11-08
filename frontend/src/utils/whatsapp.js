import React from 'react';

/**
 * WhatsApp Order & Inquiry Utilities for Radhe Radios Workshop
 * Phone: +91 98871 58522
 * Workshop: Transport Nagar, Kota, Rajasthan
 */

export const WORKSHOP_WHATSAPP_NUMBER = '919887158522';
export const WORKSHOP_WHATSAPP_DISPLAY = '+91 98871 58522';
export const WORKSHOP_LOCATION = 'Transport Nagar, Kota, Rajasthan';

/**
 * Universally recognized official WhatsApp SVG Icon (Pure JS without JSX)
 */
export function WhatsAppIcon({ className = 'w-4 h-4' }) {
  return React.createElement(
    'svg',
    { className, viewBox: '0 0 24 24', fill: 'currentColor' },
    React.createElement('path', {
      d: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.457h.004c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z',
    })
  );
}

/**
 * Builds a pre-filled WhatsApp deep link URL for a specific product order.
 * Works seamlessly on mobile WhatsApp, desktop WhatsApp app, and web.whatsapp.com.
 *
 * @param {Object} product
 * @returns {string} WhatsApp direct URL
 */
export function getWhatsAppOrderUrl(product) {
  const phone = WORKSHOP_WHATSAPP_NUMBER;

  if (!product) {
    const genericMsg = [
      '🔊 *GENERAL SOUND RIG INQUIRY — RADHE RADIOS*',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      'Hello Rajesh bhai, I would like to inquire about sound systems, heavy bass speaker rigs, and custom amplifiers from Radhe Radios Kota.',
      'Please share available factory models, pricing, and dispatch schedule.',
    ].join('\n');
    return `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(genericMsg)}`;
  }

  const title = product.title || product.name || 'Pro Sound Rig';
  const category = product.category || 'Sound System';
  const price = product.price
    ? `₹${Number(product.price).toLocaleString('en-IN')}`
    : 'Workshop Direct Quote';
  const power = product.specs?.powerHandling || (product.watts ? `${product.watts}W Peak` : 'High Power Handling');
  const driver = product.specs?.driverSize || 'High-Excursion Pro Transducer';
  const freq = product.specs?.frequencyRange || '28Hz - 160Hz';
  const enclosure = product.specs?.enclosure || 'Reinforced Birch Plywood Cabinet';
  const badge = product.badge || 'Official Workshop Build';

  const lines = [
    '🔊 *NEW RIG ORDER INQUIRY — RADHE RADIOS KOTA*',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    `📦 *System:* ${title}`,
    `🏷️ *Category:* ${category}`,
    `💰 *Workshop Price:* ${price}`,
    `⚡ *Power Spec:* ${power}`,
    `🎛️ *Acoustic Driver:* ${driver}`,
    `📻 *Frequency Range:* ${freq}`,
    `🪵 *Enclosure:* ${enclosure}`,
    `⭐ *Edition / Badge:* ${badge}`,
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    'Hello Rajesh bhai, I want to order this sound system from Radhe Radios Kota. Please confirm factory availability, dispatch schedule to my location, and booking advance details.',
  ];

  return `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(lines.join('\n'))}`;
}

