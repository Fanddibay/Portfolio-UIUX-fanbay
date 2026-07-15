/**
 * Portfolio contact form — Google Apps Script backend.
 * Canonical copy of the script deployed in Fandi's Google account
 * (spreadsheet "Email Feedback Fandi"). Paste into Extensions → Apps Script.
 *
 * IMPORTANT after every code edit:
 *   Deploy → Manage deployments → ✏️ Edit → Version: "New version" → Deploy.
 *   The /exec URL stays the same, but without a new version the old code
 *   keeps running.
 *
 * One-time: select `formatSheet` in the editor toolbar and press ▶ Run to
 * apply the styling (header, banding, widths). doPost keeps rows styled
 * automatically afterwards.
 */

const SPREADSHEET_ID = '1NFBVjbp8Am1EaWqz8CfwmNrXQqyA24upJ_mxBG-UmYY';
const NOTIFY_EMAIL = 'fandi.bayu110@gmail.com';
const SHEET_NAME = 'Messages';

const HEADER = ['Timestamp', 'Name', 'Email', 'Message'];
// Portfolio design tokens (DESIGN.md): foreground dark + accent blue.
const COLOR_HEADER_BG = '#18181b';
const COLOR_HEADER_TEXT = '#ffffff';
const COLOR_ACCENT = '#2563eb';
const COLOR_BAND = '#eff4fe'; // very light accent tint for alternating rows

function doPost(e) {
  try {
    const p = e.parameter || {};
    if (p._gotcha) return ContentService.createTextOutput('ok'); // honeypot

    const name = String(p.name || '').slice(0, 200);
    const email = String(p.email || '').slice(0, 200);
    const message = String(p.message || '').slice(0, 5000);

    const sheet = getSheet_();
    sheet.appendRow([new Date(), name, email, message]);
    styleLastRow_(sheet);

    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      replyTo: email,
      subject: 'Portfolio — pesan baru dari ' + name,
      body: 'Name: ' + name + '\nEmail: ' + email + '\n\n' + message,
      htmlBody:
        '<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;' +
        'border:1px solid #e4e4e7;border-radius:12px;overflow:hidden">' +
        '<div style="background:' + COLOR_HEADER_BG + ';color:#fff;padding:16px 20px;' +
        'font-size:15px;font-weight:bold">Pesan baru dari portfolio ✉️</div>' +
        '<div style="padding:20px;color:#18181b;font-size:14px;line-height:1.6">' +
        '<p style="margin:0 0 4px"><b>Nama:</b> ' + escapeHtml_(name) + '</p>' +
        '<p style="margin:0 0 12px"><b>Email:</b> <a href="mailto:' + escapeHtml_(email) + '" ' +
        'style="color:' + COLOR_ACCENT + '">' + escapeHtml_(email) + '</a></p>' +
        '<div style="border-left:3px solid ' + COLOR_ACCENT + ';background:#f4f4f5;' +
        'padding:12px 16px;border-radius:0 8px 8px 0;white-space:pre-wrap">' +
        escapeHtml_(message) + '</div>' +
        '<p style="margin:16px 0 0;color:#64748b;font-size:12px">Balas email ini untuk ' +
        'membalas langsung ke pengirim.</p>' +
        '</div></div>',
    });

    return ContentService.createTextOutput('ok');
  } catch (err) {
    return ContentService.createTextOutput('error: ' + err);
  }
}

/** Open the target sheet by ID — never depends on which file the script is bound to. */
function getSheet_() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME, 0);
    sheet.appendRow(HEADER);
    formatSheet();
  }
  return sheet;
}

/** One-time (or re-runnable) styling pass. Safe to run repeatedly. */
function formatSheet() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME, 0);
  }
  if (sheet.getLastRow() === 0) sheet.appendRow(HEADER);

  sheet.setTabColor(COLOR_ACCENT);

  // Header row — dark, bold, tall, frozen
  sheet
    .getRange(1, 1, 1, HEADER.length)
    .setValues([HEADER])
    .setBackground(COLOR_HEADER_BG)
    .setFontColor(COLOR_HEADER_TEXT)
    .setFontWeight('bold')
    .setFontSize(11)
    .setVerticalAlignment('middle');
  sheet.setRowHeight(1, 42);
  sheet.setFrozenRows(1);

  // Column widths tuned for scanning
  sheet.setColumnWidth(1, 170); // Timestamp
  sheet.setColumnWidth(2, 180); // Name
  sheet.setColumnWidth(3, 240); // Email
  sheet.setColumnWidth(4, 520); // Message

  // Body defaults
  const maxRows = sheet.getMaxRows();
  if (maxRows > 1) {
    const body = sheet.getRange(2, 1, maxRows - 1, HEADER.length);
    body.setFontSize(10).setVerticalAlignment('top');
    sheet.getRange(2, 1, maxRows - 1, 1).setNumberFormat('dd mmm yyyy · HH:mm');
    sheet.getRange(2, 4, maxRows - 1, 1).setWrap(true);

    // Alternating row colors (remove old banding first so re-runs don't error)
    sheet.getBandings().forEach(function (b) { b.remove(); });
    const banding = sheet.getRange(2, 1, maxRows - 1, HEADER.length).applyRowBanding();
    banding.setFirstRowColor('#ffffff');
    banding.setSecondRowColor(COLOR_BAND);
    banding.setHeaderRowColor(null);
  }
}

/** Keep newly appended rows consistent with the sheet styling. */
function styleLastRow_(sheet) {
  const r = sheet.getLastRow();
  if (r < 2) return;
  sheet.getRange(r, 1).setNumberFormat('dd mmm yyyy · HH:mm');
  sheet.getRange(r, 4).setWrap(true);
  sheet.getRange(r, 1, 1, HEADER.length).setFontSize(10).setVerticalAlignment('top');
}

function escapeHtml_(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
