/**
 * Generates the social/OG card and app icons from the logo source art in
 * assets/brand/logo/ (outlined SVGs, so the result never depends on fonts):
 *   public/og.png             1200×630 link previews (WhatsApp, LinkedIn, X)
 *   public/icon-192.png       PWA icon
 *   public/icon-512.png       PWA icon
 *   src/app/icon.svg          crisp vector tab icon (modern browsers)
 *   src/app/apple-icon.png    180px iOS home-screen icon (full bleed, iOS rounds it)
 *   src/app/favicon.ico       fallback tab icon (PNG-in-ICO, 48px)
 *
 * Run: node scripts/generate-brand-assets.mjs
 */
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = new URL('..', import.meta.url).pathname;
const LOGO = path.join(ROOT, 'assets/brand/logo');
const BG = '#09090B';
const ACCENT = '#3B82F6'; // dark-mode --accent: text/strokes on near-black
const MUTED = '#A1A1AA'; // dark-mode --muted-foreground

const mark = await readFile(path.join(LOGO, 'fandibayu-mark.svg'), 'utf8');
const wordmark = await readFile(path.join(LOGO, 'fandibayu-wordmark-dark.svg'), 'utf8');

/** Nest a standalone logo SVG inside another SVG at a given box (keeps its viewBox). */
const place = (svg, { x, y, width, height }) =>
  svg
    .replace(/<\?xml[^>]*>\s*/, '')
    .replace(/<title>.*?<\/title>\s*/, '')
    .replace('<svg ', `<svg x="${x}" y="${y}" width="${width}" height="${height}" `);

const [, , vbW, vbH] = wordmark.match(/viewBox="([^"]+)"/)[1].split(' ').map(Number);
const WM_H = 150;

const og = `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="${BG}"/>
  <rect x="80" y="96" width="56" height="8" fill="${ACCENT}"/>
  <text x="80" y="176" font-family="Helvetica, Arial, sans-serif" font-size="28" letter-spacing="6" fill="${MUTED}">UI/UX DESIGNER &amp; ENGINEER</text>
  ${place(wordmark, { x: 80, y: 216, width: (WM_H * vbW) / vbH, height: WM_H })}
  <text x="80" y="446" font-family="Helvetica, Arial, sans-serif" font-size="34" fill="${MUTED}">SaaS dashboards, web apps and design systems,</text>
  <text x="80" y="494" font-family="Helvetica, Arial, sans-serif" font-size="34" fill="${MUTED}">designed in Figma and shipped in production code.</text>
  <text x="80" y="560" font-family="Helvetica, Arial, sans-serif" font-weight="bold" font-size="28" fill="${ACCENT}">fandibayu.com</text>
</svg>`;

const icon = (size, { bleed = false } = {}) => {
  const art = bleed ? mark.replace(/(<rect width="512" height="512") rx="[^"]+"/, '$1') : mark;
  return `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">${place(art, { x: 0, y: 0, width: size, height: size })}</svg>`;
};

await sharp(Buffer.from(og)).png().toFile(path.join(ROOT, 'public/og.png'));
for (const size of [192, 512]) {
  await sharp(Buffer.from(icon(size))).png().toFile(path.join(ROOT, `public/icon-${size}.png`));
}
await sharp(Buffer.from(icon(180, { bleed: true }))).png().toFile(path.join(ROOT, 'src/app/apple-icon.png'));
await writeFile(path.join(ROOT, 'src/app/icon.svg'), mark);

// favicon.ico: a single 48px PNG wrapped in an ICO container (valid + tiny).
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

console.log(
  'generated: public/og.png, public/icon-192.png, public/icon-512.png, src/app/icon.svg, src/app/apple-icon.png, src/app/favicon.ico',
);
