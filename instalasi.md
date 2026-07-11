# 🛠️ Panduan Instalasi & Keamanan Undangan Pernikahan

Panduan ini menjelaskan cara menginstal website secara lokal, menghubungkannya ke database Google Sheets, meng-hosting ke GitHub, serta **cara melindungi kode sumber dan aset gambar Anda agar tidak bisa diunduh atau disalin oleh orang lain**.

---

## 📅 BAGIAN 1: Panduan Instalasi & Konfigurasi

### 1. Uji Coba Lokal
1. Pastikan seluruh file berikut berada dalam satu folder di komputer Anda:
   - `index.html`
   - `style.css`
   - `script.js`
   - `manifest.json`
   - `lagu.mp3`
   - Folder `assets/images/` (berisi foto prewedding)
   - Folder `assets/template/lestoraja.png` (border ornamen Toraja)
2. Untuk menjalankan server lokal di folder tersebut, buka PowerShell/Terminal lalu ketik:
   ```bash
   python -m http.server 8000
   ```
3. Buka browser Anda ke alamat: `http://localhost:8000/?to=NamaTamu`

---

### 2. Setup Database Google Spreadsheet
1. Buka [Google Sheets](https://sheets.google.com) dan buat spreadsheet kosong baru.
2. Di dalam spreadsheet, buka menu **Extensions (Ekstensi) → Apps Script**.
3. Hapus kode default yang ada, lalu paste seluruh kode dari file **`Code.gs`**.
4. Klik tombol **Save** (ikon disket 💾).
5. Klik **Deploy → New Deployment**.
6. Klik ikon gerigi (⚙️) di samping *Select type*, pilih **Web App**.
7. Konfigurasikan:
   - **Description:** `Buku Tamu Undangan`
   - **Execute as:** `Me (email-anda@gmail.com)`
   - **Who has access:** `Anyone` (harus diatur ke 'Anyone' agar website static dapat mengirim data tanpa login)
8. Klik **Deploy** → **Authorize access** → Pilih akun Google Anda → Klik **Advanced** (Lanjutan) → Klik **Go to... (unsafe)** → Klik **Allow**.
9. **Salin URL Web App** yang muncul.
10. Buka file **`script.js`** di komputer Anda, lalu ganti nilai variabel `APPS_SCRIPT_URL` di baris ke-10 dengan URL yang baru saja Anda salin:
    ```javascript
    const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/XXXXXXXXX/exec';
    ```

---

## 🔒 BAGIAN 2: Cara Melindungi Website & Kode Sumber dari Pencurian

Karena GitHub Pages gratis mengharuskan repositori Anda bersifat **Public** agar bisa diakses oleh browser internet, secara default orang lain dapat melihat dan mengunduh (*clone*) kode Anda. 

Berikut adalah **3 metode terbaik** untuk mencegah orang lain menyalin atau mengunduh kode template Toraja dan aset gambar Anda:

### Metode A: Hosting dengan Repositori Privat (Sangat Direkomendasikan)
Jika Anda memiliki akun **GitHub Pro / Student Developer Pack**, Anda dapat mengaktifkan GitHub Pages langsung dari repositori **Private**. Dengan cara ini:
- Kode sumber dan gambar di GitHub bersifat privat (hanya Anda yang bisa lihat).
- Halaman website tetap dapat diakses publik oleh tamu undangan Anda.
- **Cara mengubah repositori menjadi privat:**
  1. Masuk ke halaman repository Anda di GitHub.
  2. Klik tab **Settings** (Pengaturan).
  3. Scroll ke bagian paling bawah (**Danger Zone**).
  4. Klik **Change visibility** → Pilih **Change to private**.
  5. Ikuti petunjuk konfirmasi yang muncul di layar.

---

### Metode B: Mengaburkan Kode (Obfuscation) & Meminimalisasi CSS
Jika Anda menggunakan akun GitHub gratis biasa (yang mewajibkan repositori bersifat *Public* untuk GitHub Pages), Anda dapat mengamankan kode dengan cara **mengaburkan (obfuscate)** javascript dan **memadatkan (minify)** CSS Anda sebelum di-push ke GitHub. 

Dengan cara ini, file CSS dan JS Anda tidak akan bisa dibaca atau dimodifikasi oleh orang lain karena bentuknya akan berubah menjadi karakter acak.

1. **Untuk Javascript (`script.js`):**
   - Buka situs web gratis [javascriptobfuscator.com](https://obfuscator.io/) atau [js-obfuscator-free](https://www.javascriptobfuscator.com/).
   - Copy semua kode dari `script.js` Anda dan paste di sana, lalu klik **Obfuscate**.
   - Copy kode hasil obfuscate tersebut dan timpa ke file `script.js` Anda sebelum di-upload ke GitHub. Kode Anda akan berubah menjadi tidak terbaca seperti ini: `var _0x5a12=["\x44\x4f\x4d..."]`.
   
2. **Untuk CSS (`style.css`):**
   - Buka situs [cssminifier.com](https://cssminifier.com/).
   - Paste isi file `style.css` Anda, lalu minimalkan. Seluruh whitespace dan baris baru akan hilang, membuat kode CSS sangat sulit dipahami dan disalin oleh orang biasa.

---

### Metode C: Menambahkan Proteksi Anti-Copy & Anti-Inspect Element
Tambahkan skrip berikut di bagian paling bawah `index.html` (sebelum tag penutup `</body>`) untuk menonaktifkan klik kanan (*No-Right-Click*), tombol salin, dan tombol F12 / Inspect Element. Hal ini mencegah tamu undangan awam untuk mengunduh gambar ornamen `lestoraja.png` atau foto prewedding Anda secara langsung:

```html
<script>
  // Mencegah Klik Kanan (Konteks Menu)
  document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
  });

  // Mencegah Shortcut F12, Ctrl+Shift+I (Inspect), Ctrl+U (View Source)
  document.addEventListener('keydown', function(e) {
    if (e.key === 'F12' || 
        (e.ctrlKey && e.shiftKey && e.key === 'I') || 
        (e.ctrlKey && e.shiftKey && e.key === 'J') || 
        (e.ctrlKey && e.key === 'u') || 
        (e.ctrlKey && e.key === 'U') ||
        (e.ctrlKey && e.key === 's') ||
        (e.ctrlKey && e.key === 'S')) {
      e.preventDefault();
      return false;
    }
  });
</script>
```

---

### Metode D: Gunakan File Lisensi Hukum Cipta
Tambahkan berkas baru bernama `LICENSE` di repositori GitHub Anda dengan pernyataan larangan keras untuk menyalin:

```text
Copyright (c) 2026 jarvis-id. All Rights Reserved.

NO WARRANTY OR LICENSES GRANTED.
Unauthorized copying, modifying, downloading, or distributing of this project's code, layout, assets, stylesheets, or files via any medium is strictly prohibited.
All graphics assets (including lestoraja.png and wedding couple photographs) are intellectual property of the authors.
```
