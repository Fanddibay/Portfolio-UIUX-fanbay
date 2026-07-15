/**
 * Generates the social/OG card and app icons from brand tokens (DESIGN.md):
 *   public/og.png        1200×630 — link previews (WhatsApp, LinkedIn, X)
 *   public/icon-192.png  PWA icon
 *   public/icon-512.png  PWA icon
 *   src/app/favicon.ico  browser tab icon (PNG-in-ICO, 48px)
 *
 * Run: node scripts/generate-brand-assets.mjs
 */
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = new URL('..', import.meta.url).pathname;
const FG = '#FAFAFA';
const BG = '#09090B';
const ACCENT = '#2563EB';
const MUTED = '#71717A';

const og = `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="${BG}"/>
  <rect x="80" y="96" width="56" height="8" fill="${ACCENT}"/>
  <text x="80" y="180" font-family="Helvetica, Arial, sans-serif" font-size="30" letter-spacing="6" fill="${MUTED}">UI/UX DESIGNER &amp; ENGINEER</text>
  <text x="74" y="330" font-family="Helvetica, Arial, sans-serif" font-weight="bold" font-size="130" fill="${FG}">FANDI BAYU<tspan fill="${ACCENT}">.</tspan></text>
  <text x="80" y="420" font-family="Helvetica, Arial, sans-serif" font-size="34" fill="${MUTED}">SaaS dashboards · web apps · design systems —</text>
  <text x="80" y="470" font-family="Helvetica, Arial, sans-serif" font-size="34" fill="${MUTED}">designed in Figma, shipped in production code.</text>
  <text x="80" y="556" font-family="Helvetica, Arial, sans-serif" font-weight="bold" font-size="30" fill="${ACCENT}">fandibayu.com</text>
</svg>`;

const icon = (size) => `
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" rx="${size * 0.22}" fill="${BG}"/>
  <text x="${size * 0.3}" y="${size * 0.72}" font-family="Helvetica, Arial, sans-serif" font-weight="bold" font-size="${size * 0.58}" fill="${FG}">F</text>
  <circle cx="${size * 0.72}" cy="${size * 0.66}" r="${size * 0.07}" fill="${ACCENT}"/>
</svg>`;

await sharp(Buffer.from(og)).png().toFile(path.join(ROOT, 'public/og.png'));
for (const size of [192, 512]) {
  await sharp(Buffer.from(icon(size))).png().toFile(path.join(ROOT, `public/icon-${size}.png`));
}

// favicon.ico — a single 48px PNG wrapped in an ICO container (valid + tiny).
const png48 = await sharp(Buffer.from(icon(48))).png().toBuffer();
const header = Buffer.alloc(6 + 16);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(1, 4); // count
header.writeUInt8(48, 6); // width
header.writeUInt8(48, 7); // height
header.writeUInt8(0, 8); // palette
header.writeUInt8(0, 9); // reserved
header.writeUInt16LE(1, 10); // planes
header.writeUInt16LE(32, 12); // bpp
header.writeUInt32LE(png48.length, 14); // size
header.writeUInt32LE(22, 18); // offset
await writeFile(path.join(ROOT, 'src/app/favicon.ico'), Buffer.concat([header, png48]));

console.log('generated: public/og.png, public/icon-192.png, public/icon-512.png, src/app/favicon.ico');
