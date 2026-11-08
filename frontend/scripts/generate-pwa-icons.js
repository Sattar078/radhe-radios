import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.resolve(__dirname, '../public');
const iconsDir = path.join(publicDir, 'icons');
const svgPath = path.join(publicDir, 'logo.svg');

if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

async function generateIcons() {
  console.log('Generating PWA icons from logo.svg...');
  const svgBuffer = fs.readFileSync(svgPath);

  // Standard icons with transparent/obsidian padding
  const sizes = [
    { name: 'icon-192.png', size: 192, pad: 16 },
    { name: 'icon-512.png', size: 512, pad: 32 },
    { name: 'apple-touch-icon.png', size: 180, pad: 16 },
    { name: 'favicon-32x32.png', size: 32, pad: 2 },
    { name: 'favicon-16x16.png', size: 16, pad: 1 }
  ];

  for (const { name, size, pad } of sizes) {
    const innerSize = size - pad * 2;
    const innerBuffer = await sharp(svgBuffer)
      .resize(innerSize, innerSize, { fit: 'contain' })
      .toBuffer();

    await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: { r: 4, g: 6, b: 10, alpha: 1 } // Obsidian acoustic #04060a
      }
    })
      .composite([{ input: innerBuffer, gravity: 'center' }])
      .png()
      .toFile(path.join(iconsDir, name));

    console.log(`✓ Generated ${name} (${size}x${size})`);
  }

  // Maskable icons (extra safe padding for circle/squircle masks)
  const maskableSizes = [
    { name: 'icon-192-maskable.png', size: 192, pad: 36 },
    { name: 'icon-512-maskable.png', size: 512, pad: 80 }
  ];

  for (const { name, size, pad } of maskableSizes) {
    const innerSize = size - pad * 2;
    const innerBuffer = await sharp(svgBuffer)
      .resize(innerSize, innerSize, { fit: 'contain' })
      .toBuffer();

    await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: { r: 4, g: 6, b: 10, alpha: 1 }
      }
    })
      .composite([{ input: innerBuffer, gravity: 'center' }])
      .png()
      .toFile(path.join(iconsDir, name));

    console.log(`✓ Generated ${name} (${size}x${size} maskable)`);
  }

  console.log('✅ All PWA icons generated successfully.');
}

generateIcons().catch((err) => {
  console.error('Error generating icons:', err);
  process.exit(1);
});

