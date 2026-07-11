/**
 * ============================================================
 * Google Apps Script — Backend Undangan Pernikahan
 * ============================================================
 * CARA PASANG:
 * 1. Buka Google Spreadsheet Anda
 * 2. Klik Extensions → Apps Script
 * 3. Hapus semua kode lama, paste seluruh kode ini
 * 4. Klik Save (Ctrl+S)
 * 5. Deploy → New Deployment → Web App
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 6. Salin URL yang muncul, paste ke script.js di APPS_SCRIPT_URL
 * ============================================================
 */

const SHEET_NAME = 'RSVP';
const HEADER = ['Timestamp', 'Nama', 'Kehadiran', 'Jumlah Tamu', 'Ucapan'];

// ── Helper: pastikan sheet RSVP ada ──────────────────────────
function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADER);
    // Bold header
    sheet.getRange(1, 1, 1, HEADER.length).setFontWeight('bold');
    // Freeze header row
    sheet.setFrozenRows(1);
    // Set column widths
    sheet.setColumnWidth(1, 180); // Timestamp
    sheet.setColumnWidth(2, 160); // Nama
    sheet.setColumnWidth(3, 100); // Kehadiran
    sheet.setColumnWidth(4, 100); // Jumlah
    sheet.setColumnWidth(5, 400); // Ucapan
  }
  return sheet;
}

// ── Helper: buat JSON response dengan CORS header ────────────
function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── Format tanggal ke bahasa Indonesia ───────────────────────
function formatTanggal(date) {
  const bulan = [
    'Januari','Februari','Maret','April','Mei','Juni',
    'Juli','Agustus','September','Oktober','November','Desember'
  ];
  const d = new Date(date);
  const h = String(d.getHours()).padStart(2, '0');
  const m = String(d.getMinutes()).padStart(2, '0');
  return `${d.getDate()} ${bulan[d.getMonth()]} ${d.getFullYear()}, ${h}:${m} WIB`;
}

// ── doGet: entry point utama ──────────────────────────────────
// Semua request (baca & tulis) masuk via GET agar compatible
// dengan GitHub Pages (static site, no server-side proxy)
function doGet(e) {
  try {
    const sheet = getSheet();
    const action = e.parameter.action || 'read';

    // ──────────────────────────────────
    // TULIS: Simpan RSVP + ucapan baru
    // ──────────────────────────────────
    if (action === 'submit') {
      const nama     = (e.parameter.nama     || '').trim();
      const kehadiran = (e.parameter.kehadiran || 'Tidak Hadir').trim();
      const jumlah   = (e.parameter.jumlah   || '1').trim();
      const ucapan   = (e.parameter.ucapan   || '').trim();

      if (!nama) {
        return jsonResponse({ status: 'error', message: 'Nama tidak boleh kosong' });
      }
      if (!ucapan) {
        return jsonResponse({ status: 'error', message: 'Ucapan tidak boleh kosong' });
      }

      sheet.appendRow([new Date(), nama, kehadiran, jumlah, ucapan]);

      return jsonResponse({
        status: 'success',
        message: `Terima kasih ${nama}, ucapan Anda telah tersimpan!`
      });
    }

    // ──────────────────────────────────
    // BACA: Kembalikan semua ucapan
    // ──────────────────────────────────
    if (action === 'read') {
      const rows = sheet.getDataRange().getValues();

      // Lewati baris header, filter baris kosong, urutan terbaru dulu
      const wishes = rows
        .slice(1)
        .filter(row => row[1] && row[4]) // harus ada nama & ucapan
        .reverse()
        .map(row => ({
          timestamp : row[0] ? formatTanggal(row[0]) : '',
          nama      : String(row[1]),
          kehadiran : String(row[2] || 'Tidak Hadir'),
          jumlah    : String(row[3] || '1'),
          ucapan    : String(row[4])
        }));

      return jsonResponse({ status: 'success', data: wishes });
    }

    // Fallback
    return jsonResponse({ status: 'error', message: 'Action tidak dikenal' });

  } catch (err) {
    return jsonResponse({ status: 'error', message: err.toString() });
  }
}
