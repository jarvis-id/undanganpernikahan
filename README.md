# 💍 Undangan Pernikahan Tema Toraja

Website undangan pernikahan digital yang elegan dengan tema **Toraja Traditional** — memadukan motif ornamen emas khas Toraja, warna merah tua `#8B1414`, dan hitam kayu Tongkonan. Dirancang sebagai template siap pakai yang dapat dikustomisasi untuk setiap pasangan.

> **Demo & Repository:** [github.com/jarvis-id/undanganpernikahan](https://github.com/jarvis-id/undanganpernikahan)
>
> **Live Demo:** [jarvis-id.github.io/undanganpernikahan](https://jarvis-id.github.io/undanganpernikahan/?to=Nama+Tamu)

---

## ✨ Fitur Utama

| Fitur | Keterangan |
|---|---|
| 🎨 **Tema Toraja** | Motif ornamen emas, warna merah Toraja, pola geometris kain Toraja |
| 👤 **Nama Tamu Personalisasi** | Nama tamu otomatis muncul dari parameter URL `?to=Nama+Tamu` |
| ⏳ **Countdown Timer** | Hitung mundur menuju hari pernikahan secara real-time |
| 📸 **Foto Prawedding** | Foto mempelai ditampilkan dengan efek visual premium di halaman sampul |
| 🖼️ **Galeri Foto** | Grid foto prewedding interaktif dengan efek hover |
| 📋 **RSVP + Buku Tamu** | Formulir konfirmasi kehadiran & ucapan yang tersimpan ke Google Sheets |
| 🎵 **Musik Latar** | Pemutar musik otomatis saat undangan dibuka |
| 📱 **Responsif** | Layout 2 kolom di desktop, tumpuk di mobile |
| 💛 **Ornamen Les Toraja** | Border ornamen Toraja (`lestoraja.png`) di tepi setiap halaman |
| 💌 **Amplop Digital** | Informasi rekening bank dengan tombol salin otomatis |
| 🗺️ **Tautan Google Maps** | Petunjuk arah ke lokasi pemberkatan & resepsi |

---

## 🗂️ Struktur Proyek

```
📁 undanganpernikahan/
├── index.html              ← Halaman utama undangan
├── style.css               ← Seluruh gaya tampilan (tema Toraja)
├── script.js               ← Logika interaktif + integrasi Google Sheets
├── Code.gs                 ← Backend Google Apps Script (di-paste ke Google Sheets)
├── lagu.mp3                ← Musik latar belakang undangan
├── README.md               ← Dokumentasi ini
└── assets/
    ├── images/
    │   ├── prewedding_couple.jpg   ← Foto prawedding di halaman sampul
    │   ├── cover.png               ← Foto utama / cover
    │   ├── groom.png               ← Foto mempelai pria
    │   ├── bride.png               ← Foto mempelai wanita
    │   ├── gallery_1.png           ← Foto galeri 1
    │   ├── gallery_2.png           ← Foto galeri 2
    │   ├── gallery_3.png           ← Foto galeri 3
    │   └── wedding_altar.jpg       ← Foto latar belakang pelataran pernikahan
    └── template/
        └── lestoraja.png           ← Ornamen border khas Toraja
```

---

## 🚀 Cara Menggunakan (Panduan Lengkap)

### Langkah 1 — Clone / Download Repository

```bash
git clone https://github.com/jarvis-id/undanganpernikahan.git
cd undanganpernikahan
```

Atau klik tombol **Code → Download ZIP** di halaman GitHub.

### Langkah 2 — Kustomisasi Konten

Edit file `index.html` dan ganti informasi berikut:

| Yang Diganti | Cari Teks | Ganti Dengan |
|---|---|---|
| Nama mempelai pria | `Adam Malik, S.T.` | Nama pria Anda |
| Nama mempelai wanita | `Hawa Salsabila, S.Kom.` | Nama wanita Anda |
| Tanggal pemberkatan & resepsi | `Minggu, 18 Oktober 2026` | Tanggal Anda |
| Lokasi pemberkatan | `Gereja Toraja Jemaat Rantepao` | Lokasi Anda |
| Lokasi resepsi | `Grand Ballroom Ivory Hotel` | Lokasi Anda |
| Nomor rekening | `1234567890123` | No. rekening Anda |

Edit file `script.js` untuk mengubah tanggal countdown:
```javascript
const targetDate = new Date('October 18, 2026 08:00:00').getTime();
```

### Langkah 3 — Ganti Foto & Musik

Ganti file berikut di folder `assets/images/` dengan nama file **yang sama persis**:
- `prewedding_couple.jpg` → foto prawedding untuk halaman sampul
- `groom.png` → foto mempelai pria
- `bride.png` → foto mempelai wanita
- `gallery_1.png`, `gallery_2.png`, `gallery_3.png` → foto galeri

Ganti file `lagu.mp3` dengan musik pilihan Anda (MP3, disarankan < 5 MB).

---

## 📊 Integrasi Google Spreadsheet (Buku Tamu)

Agar ucapan & RSVP tamu tersimpan permanen di Google Sheets:

### 1. Buat Google Spreadsheet
Buka [sheets.google.com](https://sheets.google.com) → buat spreadsheet baru.

### 2. Pasang Apps Script
1. Klik **Extensions → Apps Script**
2. Hapus kode lama, paste seluruh isi file `Code.gs` dari repository ini
3. Klik **Save** (Ctrl+S)

### 3. Deploy sebagai Web App
1. Klik **Deploy → New Deployment**
2. Pilih tipe **Web App**
3. Atur:
   - **Execute as:** `Me`
   - **Who has access:** `Anyone`
4. Klik **Deploy → Authorize access → Allow**
5. **Salin URL** yang muncul (format: `https://script.google.com/macros/s/.../exec`)

### 4. Tempel URL ke script.js
Buka `script.js`, ganti baris ini:
```javascript
const APPS_SCRIPT_URL = 'PASTE_YOUR_APPS_SCRIPT_URL_HERE';
```
Menjadi:
```javascript
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/XXXXXXXXX/exec';
```

> Data buku tamu akan tersimpan di tab **RSVP** pada spreadsheet Anda dengan kolom: Timestamp, Nama, Kehadiran, Jumlah Tamu, Ucapan.

---

## 🌐 Hosting di GitHub Pages (Gratis)

### 1. Fork atau Upload Repository
```bash
# Jika membuat repo baru
git init
git add .
git commit -m "🎊 Undangan Pernikahan Tema Toraja"
git remote add origin https://github.com/USERNAME/undanganpernikahan.git
git branch -M main
git push -u origin main
```

### 2. Aktifkan GitHub Pages
1. Buka repository → **Settings → Pages**
2. Source: Branch `main`, Folder `/ (root)`
3. Klik **Save**

Website aktif dalam 1–2 menit di:
```
https://USERNAME.github.io/undanganpernikahan/
```

### 3. Update Konten
```bash
git add .
git commit -m "Update konten undangan"
git push
```

---

## 📬 Format Link Undangan per Tamu

```
https://USERNAME.github.io/undanganpernikahan/?to=Nama+Tamu
```

**Contoh:**
```
https://jarvis-id.github.io/undanganpernikahan/?to=Budi+Santoso
https://jarvis-id.github.io/undanganpernikahan/?to=Keluarga+Ahmad
https://jarvis-id.github.io/undanganpernikahan/?to=Siti+Rahmawati
```

---

## 🧰 Teknologi

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Google Apps Script](https://img.shields.io/badge/Google%20Apps%20Script-4285F4?style=flat&logo=google&logoColor=white)
![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-222222?style=flat&logo=github&logoColor=white)

- **HTML5** — Struktur halaman semantik
- **CSS3** — Animasi, glassmorphism, `clip-path`, CSS Grid & Flexbox
- **Vanilla JavaScript (ES6+)** — Interaktivitas tanpa framework eksternal
- **Google Apps Script** — Backend serverless gratis untuk Google Sheets
- **Google Fonts** — Playfair Display, Great Vibes, Cinzel

---

## 📄 Lisensi

MIT License — Bebas digunakan dan dimodifikasi untuk keperluan pribadi maupun komersial.
Harap cantumkan kredit jika mendistribusikan ulang.

---

<div align="center">

**[⭐ Beri bintang jika proyek ini bermanfaat!](https://github.com/jarvis-id/undanganpernikahan)**

*Dibuat dengan ❤️ oleh [jarvis-id](https://github.com/jarvis-id)*

</div>
