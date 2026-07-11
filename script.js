/**
 * ============================================================
 * script.js — Undangan Pernikahan Adam & Hawa
 * ============================================================
 * KONFIGURASI GOOGLE APPS SCRIPT:
 * Setelah deploy Apps Script, ganti URL di bawah ini.
 * Selama URL masih placeholder, data disimpan di localStorage.
 * ============================================================
 */
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxfIY5bQ1m4VxKlRRK6Lx4HBWEE3Wp3M5CHlB1GHmy1YI_zkcKGeqAAOzXoe73tuH0YMQ/exec';

// Deteksi apakah integrasi Google Sheets sudah dikonfigurasi
const USE_GOOGLE_SHEETS = APPS_SCRIPT_URL !== 'PASTE_YOUR_APPS_SCRIPT_URL_HERE';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Personalized Guest Name
  const getQueryParam = (param) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  };

  const guestNameElement = document.getElementById('guestName');
  const rawGuestName = getQueryParam('to') || getQueryParam('guest') || getQueryParam('nama');
  if (rawGuestName) {
    const formattedName = decodeURIComponent(rawGuestName.replace(/\+/g, ' '));
    guestNameElement.textContent = formattedName;
    
    // Perbarui judul halaman di browser tab secara dinamis
    document.title = `Undangan Pernikahan Adam & Hawa - Spesial untuk ${formattedName}`;
    
    // Perbarui meta tag Open Graph & Twitter secara dinamis
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', `Undangan Pernikahan Adam & Hawa - Spesial untuk ${formattedName}`);
    }
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) {
      twitterTitle.setAttribute('content', `Undangan Pernikahan Adam & Hawa - Spesial untuk ${formattedName}`);
    }
  } else {
    guestNameElement.textContent = 'Tamu Undangan';
  }

  // 2. Open Invitation Curtain & Audio Autoplay
  const btnOpenInvitation = document.getElementById('btnOpenInvitation');
  const coverOverlay = document.getElementById('coverOverlay');
  const mainContent = document.getElementById('mainContent');
  const musicBtn = document.getElementById('musicBtn');
  const bgMusic = document.getElementById('bgMusic');

  let isMusicPlaying = false;

  btnOpenInvitation.addEventListener('click', () => {
    coverOverlay.classList.add('opened');
    mainContent.classList.add('visible');
    musicBtn.style.display = 'flex';
    musicBtn.classList.add('playing');
    playMusic();
    initScrollAnimations();
    document.body.style.overflowY = 'auto';

    // Aktifkan mode layar penuh (Fullscreen) untuk menyembunyikan bar URL di HP/Mobile
    const docEl = document.documentElement;
    if (docEl.requestFullscreen) {
      docEl.requestFullscreen();
    } else if (docEl.webkitRequestFullscreen) { /* Chrome, Safari & Opera Mobile */
      docEl.webkitRequestFullscreen();
    } else if (docEl.msRequestFullscreen) { /* IE/Edge */
      docEl.msRequestFullscreen();
    }
  });

  // 3. Audio Controller
  function playMusic() {
    bgMusic.play()
      .then(() => {
        isMusicPlaying = true;
        musicBtn.classList.add('playing');
      })
      .catch((error) => {
        console.log("Autoplay music was prevented or failed: ", error);
        isMusicPlaying = false;
        musicBtn.classList.remove('playing');
      });
  }

  function pauseMusic() {
    bgMusic.pause();
    isMusicPlaying = false;
    musicBtn.classList.remove('playing');
  }

  musicBtn.addEventListener('click', () => {
    if (isMusicPlaying) pauseMusic();
    else playMusic();
  });

  // 4. Countdown Timer — 18 Oktober 2026
  const targetDate = new Date('October 18, 2026 08:00:00').getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference <= 0) {
      ['days', 'hours', 'minutes', 'seconds'].forEach(id => {
        document.getElementById(id).textContent = '00';
      });
      return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // 5. Scroll Animations
  function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('appear');
          observer.unobserve(entry.target);
        }
      });
    }, { root: null, threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    animatedElements.forEach(el => observer.observe(el));
  }

  // ============================================================
  // 6. Buku Tamu & RSVP — integrasi Google Sheets
  // ============================================================
  const rsvpForm = document.getElementById('rsvpForm');
  const wishesCard = document.getElementById('wishesCard');
  const wishesEmpty = document.getElementById('wishesEmpty');
  const LOCAL_KEY = 'wedding_wishes_comments';

  // Data contoh untuk tampilan awal saat belum ada data nyata
  const sampleWishes = [
    {
      nama: 'Rian & Dini', kehadiran: 'Hadir',
      ucapan: 'Selamat ya Adam dan Hawa! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah.',
      timestamp: '11 Juli 2026, 09:00 WIB'
    },
    {
      nama: 'Budi Hartono', kehadiran: 'Hadir',
      ucapan: 'Selamat menempuh hidup baru kawan! Semoga langgeng pernikahan kalian.',
      timestamp: '10 Juli 2026, 20:30 WIB'
    }
  ];

  // ── HTML sanitizer ──────────────────────────────────────────
  function escapeHTML(str) {
    return String(str).replace(/[&<>'"]/g,
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }

  // ── Render daftar ucapan ke DOM ─────────────────────────────
  function renderWishes(wishes) {
    wishesCard.innerHTML = '';

    if (!wishes || wishes.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'wishes-empty';
      empty.textContent = 'Belum ada ucapan. Jadilah yang pertama memberikan doa restu!';
      wishesCard.appendChild(empty);
      return;
    }

    wishes.forEach(item => {
      const statusClass = item.kehadiran === 'Hadir'
        ? 'status-hadir'
        : item.kehadiran === 'Ragu-ragu'
          ? 'status-ragu'
          : 'status-tidak';

      const div = document.createElement('div');
      div.className = 'wish-item';
      div.innerHTML = `
        <div class="wish-header">
          <span class="wish-author">${escapeHTML(item.nama)}</span>
          <span class="wish-status ${statusClass}">${escapeHTML(item.kehadiran)}</span>
        </div>
        <div class="wish-content">${escapeHTML(item.ucapan)}</div>
        <span class="wish-time">${escapeHTML(item.timestamp || '')}</span>
      `;
      wishesCard.appendChild(div);
    });
  }

  // ── BACA: Ambil ucapan dari Google Sheets atau localStorage ─
  async function loadWishes() {
    if (USE_GOOGLE_SHEETS) {
      try {
        wishesCard.innerHTML = '<div class="wishes-empty">Memuat ucapan...</div>';
        const url = `${APPS_SCRIPT_URL}?action=read&t=${Date.now()}`;
        const res = await fetch(url);
        const json = await res.json();
        if (json.status === 'success') {
          renderWishes(json.data.length > 0 ? json.data : sampleWishes);
        } else {
          renderWishes(sampleWishes);
        }
      } catch (err) {
        console.error('Gagal memuat data dari Google Sheets:', err);
        renderWishes(sampleWishes);
      }
    } else {
      // Fallback: localStorage (untuk testing lokal)
      const stored = localStorage.getItem(LOCAL_KEY);
      renderWishes(stored ? JSON.parse(stored) : sampleWishes);
    }
  }

  // ── TULIS: Kirim data ke Google Sheets atau localStorage ────
  async function submitWish(nama, kehadiran, jumlah, ucapan) {
    if (USE_GOOGLE_SHEETS) {
      // Kirim via GET params ke Apps Script (aman untuk static site)
      const params = new URLSearchParams({
        action: 'submit',
        nama, kehadiran, jumlah, ucapan
      });
      const url = `${APPS_SCRIPT_URL}?${params.toString()}`;
      const res = await fetch(url);
      const json = await res.json();
      return json;
    } else {
      // Fallback: localStorage
      const stored = localStorage.getItem(LOCAL_KEY);
      const list = stored ? JSON.parse(stored) : [...sampleWishes];
      list.unshift({
        nama, kehadiran, jumlah, ucapan,
        timestamp: new Date().toLocaleString('id-ID')
      });
      localStorage.setItem(LOCAL_KEY, JSON.stringify(list));
      return { status: 'success', message: `Terima kasih ${nama}!` };
    }
  }

  // ── Form Submit Handler ─────────────────────────────────────
  rsvpForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nama = document.getElementById('inputName').value.trim();
    const kehadiran = document.querySelector('input[name="attendance"]:checked').value;
    const jumlah = document.getElementById('selectGuests').value;
    const ucapan = document.getElementById('textareaWish').value.trim();

    if (!nama || !ucapan) return;

    // Nonaktifkan tombol sementara
    const submitBtn = rsvpForm.querySelector('.btn-submit');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Mengirim...';

    try {
      const result = await submitWish(nama, kehadiran, jumlah, ucapan);

      if (result.status === 'success') {
        showToast(result.message || `Terima kasih ${nama}, ucapan Anda telah terkirim!`);
        rsvpForm.reset();
        // Muat ulang ucapan dari server agar ucapan terbaru tampil
        await loadWishes();
      } else {
        showToast('Gagal mengirim: ' + (result.message || 'Coba lagi.'));
      }
    } catch (err) {
      console.error('Error submit:', err);
      showToast('Koneksi gagal. Periksa internet Anda dan coba lagi.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
        Kirim Ucapan &amp; RSVP
      `;
    }
  });

  // 7. Toast Notification
  function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    if (window.toastTimeout) clearTimeout(window.toastTimeout);
    window.toastTimeout = setTimeout(() => toast.classList.remove('show'), 4000);
  }

  // 8. Copy Account Number
  window.copyAccountNumber = function (elementId, bankName) {
    const text = document.getElementById(elementId).innerText;
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text)
        .then(() => showToast(`Nomor rekening ${bankName} berhasil disalin!`))
        .catch(() => fallbackCopy(text, bankName));
    } else {
      fallbackCopy(text, bankName);
    }
  };

  function fallbackCopy(text, bankName) {
    const ta = document.createElement('textarea');
    ta.value = text;
    Object.assign(ta.style, { top: '0', left: '0', position: 'fixed' });
    document.body.appendChild(ta);
    ta.focus(); ta.select();
    try {
      if (document.execCommand('copy')) showToast(`Nomor rekening ${bankName} berhasil disalin!`);
      else showToast('Gagal menyalin nomor rekening.');
    } catch { showToast('Gagal menyalin nomor rekening.'); }
    document.body.removeChild(ta);
  }

  // ── Inisialisasi ────────────────────────────────────────────
  loadWishes();
});
