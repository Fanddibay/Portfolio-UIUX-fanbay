/**
 * Guard against the Cloudflare Pages hard limit: no deployed asset may
 * exceed 25 MiB. Run after `next-on-pages` so a bad build fails locally
 * and in CI instead of at the Cloudflare upload step.
 */
import { readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const OUTPUT_DIR = '.vercel/output/static';
const LIMIT_BYTES = 25 * 1024 * 1024; // 25 MiB

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

let files;
try {
  files = walk(OUTPUT_DIR);
} catch {
  console.error(`✘ ${OUTPUT_DIR} not found — run \`npm run pages:build\` first.`);
  process.exit(1);
}

const oversized = files
  .map((path) => ({ path, size: statSync(path).size }))
  .filter((f) => f.size > LIMIT_BYTES);

if (oversized.length > 0) {
  console.error('✘ Files exceed the Cloudflare Pages 25 MiB asset limit:');
  for (const f of oversized) {
    console.error(`  ${relative('.', f.path)} — ${(f.size / 1024 / 1024).toFixed(1)} MiB`);
  }
  process.exit(1);
}

const totalMiB = files.reduce((sum, p) => sum + statSync(p).size, 0) / 1024 / 1024;
console.log(`✔ ${files.length} assets, ${totalMiB.toFixed(1)} MiB total — all under 25 MiB.`);
