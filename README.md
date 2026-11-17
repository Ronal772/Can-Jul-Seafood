# Cak Jul Seafood Negari Klungkung

Website warung makan (HTML, CSS, JavaScript biasa, tanpa framework).

## File
- `index.html`  : struktur halaman (hero, paket promo, menu, tentang, lokasi + peta, panel admin)
- `style.css`   : tampilan dan responsif
- `script.js`   : isi menu bawaan, login admin, panel input data, peta
- `data.json`   : data menu, paket promo, dan background (dibaca website)

## Menjalankan di Visual Studio Code
1. Buka folder ini di VS Code (File > Open Folder).
2. Pasang ekstensi **Live Server**.
3. Klik kanan `index.html` > Open with Live Server.

## Login admin
Menu garis tiga > Login. Username dan password ada di bagian paling atas `script.js`
(`ADMIN_USER`, `ADMIN_PASS`). Ganti sebelum dipakai sungguhan.

## Mengubah data
- Lewat Panel Admin: edit menu, paket promo, foto, dan background lalu tekan **Simpan**.
  Perubahan tersimpan di browser yang dipakai admin.
- Agar tampil untuk semua pengunjung: di Panel Admin tekan **Unduh data.json**,
  ganti file `data.json` di folder ini dengan hasil unduhan, lalu upload ke GitHub.

## Hosting gratis (GitHub Pages)
1. Buat repository di GitHub, upload semua file di folder ini.
2. Settings > Pages > Source: branch `main`, folder `/ (root)` > Save.
3. Website tayang di `https://username.github.io/nama-repository/`.

## Yang perlu diganti
- Alamat lengkap, jam buka, dan nomor WhatsApp (`index.html`).
- Teks "Tentang kami" (`index.html`).
- Menu dan harga contoh (Panel Admin atau `data.json`).
