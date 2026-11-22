/**
 * Renders the résumé PDFs served by the site from their HTML sources:
 *
 *   assets/resume/resume-en.html  ->  public/resume-en.pdf
 *   assets/resume/resume-id.html  ->  public/resume-id.pdf
 *
 * Run with:  npm run resume
 *
 * Uses headless Google Chrome (page size and margins come from @page in
 * resume.css). Set CHROME_PATH to point at another Chromium build.
 * Edit the HTML, not the PDF: the PDFs are build output.
 */
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const CHROME =
  process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

if (!existsSync(CHROME)) {
  console.error(`Chrome not found at "${CHROME}". Set CHROME_PATH and retry.`);
  process.exit(1);
}

for (const lang of ['en', 'id']) {
  const src = path.resolve(`assets/resume/resume-${lang}.html`);
  const out = path.resolve(`public/resume-${lang}.pdf`);
  execFileSync(
    CHROME,
    [
      '--headless=new',
      '--disable-gpu',
      '--no-pdf-header-footer',
      '--virtual-time-budget=5000', // let the web fonts load before printing
      `--print-to-pdf=${out}`,
      pathToFileURL(src).href,
    ],
    // Chrome logs harmless GPU noise on stderr; a failed print still throws.
    { stdio: 'ignore' },
  );
  console.log(`✓ ${path.relative(process.cwd(), out)}`);
}
