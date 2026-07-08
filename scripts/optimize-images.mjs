/**
 * One-shot image optimizer: converts the heavy PNG/JPEG assets in /public to
 * WebP (85% quality, effort 6) and reports the savings. Run with:
 *
 *   node scripts/optimize-images.mjs
 *
 * WebP keeps alpha (profile.png stays transparent) and typically cuts UI
 * screenshots by 70–90% with no visible loss. Originals are DELETED after a
 * successful conversion — they remain recoverable from git history.
 * Brand SVGs are untouched.
 */
import { readdir, stat, unlink } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = new URL('..', import.meta.url).pathname;
const TARGET_DIRS = ['public', 'public/projects'];
const CONVERT = /\.(png|jpe?g)$/i;

let before = 0;
let after = 0;

for (const dir of TARGET_DIRS) {
  const abs = path.join(ROOT, dir);
  for (const file of await readdir(abs)) {
    if (!CONVERT.test(file)) continue;
    const src = path.join(abs, file);
    const out = src.replace(CONVERT, '.webp');

    const inSize = (await stat(src)).size;
    await sharp(src).webp({ quality: 85, effort: 6 }).toFile(out);
    const outSize = (await stat(out)).size;

    before += inSize;
    after += outSize;
    await unlink(src);

    const pct = (100 - (outSize / inSize) * 100).toFixed(0);
    console.log(
      `${dir}/${file} → ${path.basename(out)}  ` +
        `${(inSize / 1024).toFixed(0)}K → ${(outSize / 1024).toFixed(0)}K  (-${pct}%)`,
    );
  }
}

console.log(
  `\nTOTAL: ${(before / 1024 / 1024).toFixed(1)}MB → ${(after / 1024 / 1024).toFixed(1)}MB`,
);
