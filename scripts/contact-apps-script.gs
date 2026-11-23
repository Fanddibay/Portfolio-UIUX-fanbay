/**
 * Portfolio contact form → "Contact Fandi" spreadsheet (sheet only, no email).
 *
 * What it does
 *   doPost  inserts each message as a new row at the TOP of the "Inbox" tab
 *           (newest first), styled, with a Status dropdown and a mailto link.
 *   setup   one-time (re-runnable) formatting: Inbox + "Overview" dashboard.
 *
 * Setup
 *   1. Paste this file into the Apps Script project → Save.
 *   2. Pick `setup` in the toolbar → ▶ Run → approve the permissions.
 *      (Re-run it any time; it never deletes messages.)
 *   3. First deploy: Deploy → New deployment → ⚙ Web app →
 *      Execute as: Me · Who has access: Anyone → Deploy, then put the
 *      /exec URL in CONTACT_ENDPOINT (.env.local + Cloudflare
 *      Pages env vars) and redeploy the site.
 *   4. After later code edits: Deploy → Manage deployments → ✏️ Edit →
 *      Version: "New version" → Deploy (the /exec URL stays the same).
 *   Optional: run `previewRow` to see a styled sample row, then delete it.
 */

const SPREADSHEET_ID = '1Lmwv-RkBtln-L4mm1Yacp_OHXXoliXEKUPeMjublf9Q';
const INBOX = 'Inbox';
const OVERVIEW = 'Overview';
const TIME_ZONE = 'Asia/Jakarta';
const DATE_FMT = 'dd mmm yyyy, HH:mm';
const FONT = 'Inter';

const COLUMNS = [
  { title: 'Received', width: 150 },
  { title: 'Status', width: 108 },
  { title: 'Topic', width: 196 },
  { title: 'Name', width: 170 },
  { title: 'Email', width: 236 },
  { title: 'Message', width: 460 },
  { title: 'Language', width: 92 },
  { title: 'Page', width: 120 },
];

/** Intent keys sent by the form → labels shown in the sheet. */
const TOPICS = {
  hiring: 'Hiring for a role',
  project: 'Freelance project',
  system: 'Design system / UX audit',
  hello: 'Just saying hi',
};
/** Chip labels (EN + ID) that older site builds prefix to the message. */
const LEGACY_LABELS = {
  'hiring for a role': 'hiring',
  'rekrutmen posisi': 'hiring',
  'freelance project': 'project',
  'proyek freelance': 'project',
  'design system / ux audit': 'system',
  'design system / audit ux': 'system',
  'just saying hi': 'hello',
  'sekadar menyapa': 'hello',
};
const STATUSES = ['New', 'Replied', 'Archived'];

/** Portfolio design tokens (DESIGN.md). */
const C = {
  ink: '#09090b',
  muted: '#586779',
  faded: '#a1a1aa',
  line: '#e4e4e7',
  surface: '#f4f4f5',
  zebra: '#fafafa',
  accent: '#2563eb',
  accentTint: '#eff4fe',
};

/* ------------------------------------------------------------------ */
/* Web app                                                              */
/* ------------------------------------------------------------------ */

function doPost(e) {
  const p = (e && e.parameter) || {};
  if (p._gotcha) return text_('ok'); // honeypot: bots fill hidden fields

  const name = clean_(p.name, 120);
  const email = clean_(p.email, 200);
  let message = clean_(p.message, 5000);
  if (!name || !email || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return text_('invalid');
  }

  // Older site builds send the topic as a "[Label]\n" prefix on the message
  // instead of an `intent` field. Read it back so Topic is still filled in.
  let topic = TOPICS[p.intent];
  if (!topic) {
    const m = message.match(/^\[([^\]]+)\]\s*/);
    const key = m && LEGACY_LABELS[m[1].trim().toLowerCase()];
    if (key) {
      topic = TOPICS[key];
      message = message.slice(m[0].length);
    }
  }

  // Flood guard: one message per email address every 30 seconds.
  const cache = CacheService.getScriptCache();
  const key = 'contact:' + email.toLowerCase();
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    if (cache.get(key)) return text_('rate_limited');

    const sheet = inbox_();
    sheet.insertRowBefore(2);
    sheet.getRange(2, 1, 1, COLUMNS.length).setValues([[
      new Date(),
      'New',
      topic || 'Other',
      name,
      email,
      message,
      String(p.locale || '').toUpperCase().slice(0, 5),
      clean_(p.page, 200) || '/',
    ]]);
    // Click the address to reply.
    sheet.getRange(2, 5).setRichTextValue(
      SpreadsheetApp.newRichTextValue().setText(email).setLinkUrl('mailto:' + email).build(),
    );
    styleRow_(sheet, 2);
    applyRules_(sheet);
    cache.put(key, '1', 30);
  } finally {
    lock.releaseLock();
  }
  return text_('ok');
}

/** Health check: open the /exec URL in a browser to confirm it's live. */
function doGet() {
  return text_('Contact endpoint is running.');
}

/* ------------------------------------------------------------------ */
/* One-time setup (safe to re-run; never deletes messages)              */
/* ------------------------------------------------------------------ */

function setup() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  ss.setSpreadsheetTimeZone(TIME_ZONE);
  // Formulas below use comma separators. In an Indonesian (or any
  // semicolon-locale) spreadsheet they fail with #ERROR!, so pin the sheet to
  // English (US) first. The sheet's labels are English anyway.
  ss.setSpreadsheetLocale('en_US');
  SpreadsheetApp.flush();

  let inbox = ss.getSheetByName(INBOX);
  if (!inbox) {
    // Reuse the empty default "Sheet1" instead of leaving it behind.
    const first = ss.getSheets()[0];
    if (first && first.getLastRow() === 0 && first.getName() !== OVERVIEW) {
      inbox = first.setName(INBOX);
    } else {
      inbox = ss.insertSheet(INBOX, 0);
    }
  }
  formatInbox_(inbox);

  const overview = ss.getSheetByName(OVERVIEW) || ss.insertSheet(OVERVIEW);
  buildOverview_(overview);

  ss.setActiveSheet(overview);
  ss.moveActiveSheet(1);
}

/** Inserts a sample row so you can check the styling. Delete it afterwards. */
function previewRow() {
  const sheet = inbox_();
  sheet.insertRowBefore(2);
  sheet.getRange(2, 1, 1, COLUMNS.length).setValues([[
    new Date(), 'New', TOPICS.project, 'Sample Sender', 'sample@example.com',
    'This is a sample row to preview the styling. Delete it when you are done.', 'EN', '/',
  ]]);
  styleRow_(sheet, 2);
  applyRules_(sheet);
}

/* ------------------------------------------------------------------ */
/* Inbox                                                                */
/* ------------------------------------------------------------------ */

function inbox_() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(INBOX);
  if (sheet) return sheet;
  setup();
  return ss.getSheetByName(INBOX);
}

function formatInbox_(sh) {
  const n = COLUMNS.length;
  fit_(sh, Math.max(sh.getMaxRows(), 500), n);
  const max = sh.getMaxRows();

  sh.setHiddenGridlines(true);
  sh.setTabColor(C.accent);
  sh.getRange(1, 1, max, n)
    .setFontFamily(FONT)
    .setFontSize(10)
    .setFontColor(C.ink)
    .setVerticalAlignment('top');

  // Header: dark bar, frozen, with filter buttons for sorting/filtering.
  sh.getRange(1, 1, 1, n)
    .setValues([COLUMNS.map(function (c) { return c.title; })])
    .setBackground(C.ink)
    .setFontColor('#ffffff')
    .setFontWeight('bold')
    .setVerticalAlignment('middle');
  sh.setRowHeight(1, 40);
  sh.setFrozenRows(1);
  COLUMNS.forEach(function (c, i) { sh.setColumnWidth(i + 1, c.width); });

  // Body columns
  sh.getRange(2, 1, max - 1, 1).setNumberFormat(DATE_FMT).setFontColor(C.muted);
  sh.getRange(2, 2, max - 1, 1).setHorizontalAlignment('center');
  sh.getRange(2, 6, max - 1, 1).setWrap(true);
  sh.getRange(2, 7, max - 1, 2).setFontColor(C.muted);
  sh.getRange(2, 7, max - 1, 1).setHorizontalAlignment('center');

  if (!sh.getFilter()) sh.getRange(1, 1, max, n).createFilter();
  applyRules_(sh);
}

/** A freshly inserted row inherits the header style — reset it to body style. */
function styleRow_(sh, r) {
  const n = COLUMNS.length;
  sh.getRange(r, 1, 1, n)
    .setBackground(null)
    .setFontFamily(FONT)
    .setFontSize(10)
    .setFontWeight('normal')
    .setFontColor(C.ink)
    .setVerticalAlignment('top')
    .setHorizontalAlignment('left')
    .setWrap(false);
  sh.getRange(r, 1).setNumberFormat(DATE_FMT).setFontColor(C.muted);
  sh.getRange(r, 2)
    .setHorizontalAlignment('center')
    .setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(STATUSES, true).setAllowInvalid(false).build(),
    );
  sh.getRange(r, 6).setWrap(true);
  sh.getRange(r, 7, 1, 2).setFontColor(C.muted);
  sh.getRange(r, 7).setHorizontalAlignment('center');
  sh.autoResizeRows(r, 1);
}

/**
 * Colour rules, rebuilt after every insert: inserting at row 2 would shift
 * range-based rules down and leave the newest row unstyled otherwise.
 * Per cell the first matching rule wins, so chips come before row-level rules.
 */
function applyRules_(sh) {
  const max = sh.getMaxRows();
  const body = sh.getRange(2, 1, max - 1, COLUMNS.length);
  const status = sh.getRange(2, 2, max - 1, 1);
  const topic = sh.getRange(2, 3, max - 1, 1);
  const rules = [];
  const chip = function (range, value, bg, fg) {
    rules.push(
      SpreadsheetApp.newConditionalFormatRule()
        .whenTextEqualTo(value)
        .setBackground(bg)
        .setFontColor(fg)
        .setBold(true)
        .setRanges([range])
        .build(),
    );
  };

  chip(status, 'New', '#dbeafe', '#1d4ed8');
  chip(status, 'Replied', '#dcfce7', '#15803d');
  chip(status, 'Archived', C.surface, '#71717a');

  chip(topic, TOPICS.hiring, '#ede9fe', '#6d28d9');
  chip(topic, TOPICS.project, '#e0f2fe', '#0369a1');
  chip(topic, TOPICS.system, '#fef3c7', '#b45309');
  chip(topic, TOPICS.hello, C.surface, '#3f3f46');

  // Archived rows fade back; then a soft zebra stripe for scanning.
  rules.push(
    SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=$B2="Archived"')
      .setFontColor(C.faded)
      .setRanges([body])
      .build(),
  );
  rules.push(
    SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=AND($A2<>"",ISEVEN(ROW()))')
      .setBackground(C.zebra)
      .setRanges([body])
      .build(),
  );
  sh.setConditionalFormatRules(rules);
}

/* ------------------------------------------------------------------ */
/* Overview dashboard                                                   */
/* ------------------------------------------------------------------ */

function buildOverview_(sh) {
  sh.clear();
  sh.setConditionalFormatRules([]);
  sh.getRange(1, 1, sh.getMaxRows(), sh.getMaxColumns()).breakApart();
  fit_(sh, 18, 6);

  sh.setHiddenGridlines(true);
  sh.setTabColor(C.ink);
  sh.getRange(1, 1, 18, 6).setFontFamily(FONT).setFontColor(C.ink).setVerticalAlignment('middle');
  sh.setColumnWidth(1, 28);
  sh.setColumnWidths(2, 4, 190);
  sh.setColumnWidth(6, 28);
  sh.setRowHeight(1, 24);

  // Title
  sh.getRange('B2').setValue('Contact inbox').setFontSize(20).setFontWeight('bold');
  sh.setRowHeight(2, 40);
  sh.getRange('B3')
    .setValue('Messages from the contact form on fandibayu.com. This tab updates by itself.')
    .setFontSize(10)
    .setFontColor(C.muted);
  sh.setRowHeight(4, 16);

  // KPI cards. Full-column references (Inbox!A:A) so new rows at the top are
  // always counted; a range like A2:A would shift down on every insert.
  const kpis = [
    ['Total messages', '=MAX(0,COUNTA(Inbox!A:A)-1)'],
    ['New', '=COUNTIF(Inbox!B:B,"New")'],
    ['Last 7 days', '=COUNTIF(Inbox!A:A,">="&(TODAY()-7))'],
    ['Replied', '=COUNTIF(Inbox!B:B,"Replied")'],
  ];
  kpis.forEach(function (k, i) {
    const col = 2 + i;
    sh.getRange(5, col).setValue(k[0].toUpperCase()).setFontSize(8).setFontWeight('bold').setFontColor(C.muted);
    sh.getRange(6, col).setFormula(k[1]).setFontSize(26).setFontWeight('bold').setNumberFormat('0');
    sh.getRange(5, col, 2, 1)
      .setHorizontalAlignment('center')
      .setBackground(C.surface)
      .setBorder(true, true, true, true, false, false, C.line, SpreadsheetApp.BorderStyle.SOLID);
  });
  // "New" is the number that needs action — give it the accent.
  sh.getRange(5, 3, 2, 1).setBackground(C.accentTint);
  sh.getRange(6, 3).setFontColor(C.accent);
  sh.setRowHeight(5, 28);
  sh.setRowHeight(6, 52);
  sh.setRowHeight(7, 20);

  // By topic: label · count · bar
  sh.getRange('B8').setValue('By topic').setFontSize(12).setFontWeight('bold');
  sh.setRowHeight(8, 32);
  Object.keys(TOPICS).forEach(function (key, i) {
    const r = 9 + i;
    sh.getRange(r, 2).setValue(TOPICS[key]).setFontSize(10);
    sh.getRange(r, 3).setFormula('=COUNTIF(Inbox!C:C,B' + r + ')').setFontSize(10).setFontWeight('bold').setHorizontalAlignment('center');
    sh.getRange(r, 4, 1, 2).merge().setFormula(
      '=SPARKLINE(C' + r + ',{"charttype","bar";"max",MAX(1,$B$6);"color1","' + C.accent + '"})',
    );
    sh.setRowHeight(r, 28);
    sh.getRange(r, 2, 1, 4).setBorder(null, null, true, null, false, false, C.line, SpreadsheetApp.BorderStyle.SOLID);
  });
  sh.setRowHeight(13, 20);

  // Latest message
  sh.getRange('B14').setValue('Latest message').setFontSize(12).setFontWeight('bold');
  sh.setRowHeight(14, 32);
  sh.getRange('B15:D15').merge()
    .setFormula('=IF(COUNTA(Inbox!A:A)<2,"No messages yet",INDEX(Inbox!D:D,2)&"  ·  "&INDEX(Inbox!C:C,2))')
    .setFontWeight('bold');
  sh.getRange('E15')
    .setFormula('=IF(COUNTA(Inbox!A:A)<2,"",INDEX(Inbox!A:A,2))')
    .setNumberFormat(DATE_FMT)
    .setFontColor(C.muted)
    .setHorizontalAlignment('right');
  sh.getRange('B16:E16').merge()
    .setFormula('=IF(COUNTA(Inbox!A:A)<2,"",INDEX(Inbox!F:F,2))')
    .setWrap(true)
    .setVerticalAlignment('top')
    .setFontColor(C.muted);
  sh.setRowHeight(15, 28);
  sh.setRowHeight(16, 72);
  sh.getRange('B15:E16').setBackground(C.surface);
}

/* ------------------------------------------------------------------ */
/* Helpers                                                              */
/* ------------------------------------------------------------------ */

/** Grow or trim the grid to exactly `rows` × `cols` (only trims empty space). */
function fit_(sh, rows, cols) {
  const r = sh.getMaxRows();
  const c = sh.getMaxColumns();
  if (r < rows) sh.insertRowsAfter(r, rows - r);
  if (r > rows && sh.getLastRow() <= rows) sh.deleteRows(rows + 1, r - rows);
  if (c < cols) sh.insertColumnsAfter(c, cols - c);
  if (c > cols && sh.getLastColumn() <= cols) sh.deleteColumns(cols + 1, c - cols);
}

/**
 * Trim + cap length, and neutralise spreadsheet formula injection: text that
 * starts with = + - @ would otherwise run as a formula (e.g. =IMPORTXML(...)).
 * A leading apostrophe stores it as plain text and is hidden in the cell.
 */
function clean_(value, max) {
  let s = String(value == null ? '' : value).trim().slice(0, max);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}

function text_(s) {
  return ContentService.createTextOutput(s);
}
