// ===== PENGATURAN ADMIN =====
// PENTING: ganti username dan password ini. Karena website ini statis (GitHub Pages),
// kode ini bisa dibaca siapa saja, jadi ini hanya pengaman sederhana, bukan keamanan penuh.
const ADMIN_USER = "ronal";
const ADMIN_PASS = "123";

// ===== DATA MENU BAWAAN =====
// Isi "max" kalau harga berupa kisaran. "foto" diisi lewat panel admin.
const KATEGORI = ["Seafood", "Nasi & Pendamping", "Minuman"];
const menuBawaan = [
  { kategori: "Seafood", ikon: "🐟", nama: "Ikan Bakar", desk: "Ikan laut segar, bumbu bakar, sambal matah.", min: 35000, max: 70000 },
  { kategori: "Seafood", ikon: "🦑", nama: "Cumi Bakar / Goreng", desk: "Cumi empuk, pilih bakar atau goreng tepung.", min: 30000, max: 50000 },
  { kategori: "Seafood", ikon: "🦐", nama: "Udang Bakar / Goreng", desk: "Udang segar dengan saus pilihan.", min: 35000, max: 60000 },
  { kategori: "Seafood", ikon: "🦀", nama: "Kepiting Saus Padang", desk: "Kepiting besar, saus pedas gurih.", min: 60000, max: 120000 },
  { kategori: "Seafood", ikon: "🐚", nama: "Kerang Saus Tiram", desk: "Kerang rebus disiram saus tiram.", min: 25000, max: 40000 },
  { kategori: "Seafood", ikon: "🍢", nama: "Sate Ikan", desk: "Sate ikan bumbu Bali, per porsi.", min: 20000, max: 30000 },
  { kategori: "Nasi & Pendamping", ikon: "🍚", nama: "Nasi Putih", desk: "Nasi hangat.", min: 5000 },
  { kategori: "Nasi & Pendamping", ikon: "🥬", nama: "Plecing Kangkung", desk: "Kangkung rebus, sambal tomat khas Lombok.", min: 12000, max: 18000 },
  { kategori: "Nasi & Pendamping", ikon: "🌶️", nama: "Sambal Matah", desk: "Sambal irisan bawang, serai, cabai.", min: 5000, max: 10000 },
  { kategori: "Nasi & Pendamping", ikon: "🍤", nama: "Tahu Tempe Goreng", desk: "Goreng garing, per porsi.", min: 8000, max: 12000 },
  { kategori: "Minuman", ikon: "🧊", nama: "Es Teh", desk: "Manis atau tawar.", min: 5000, max: 8000 },
  { kategori: "Minuman", ikon: "🍊", nama: "Es Jeruk", desk: "Jeruk peras segar.", min: 8000, max: 12000 },
  { kategori: "Minuman", ikon: "🥥", nama: "Es Kelapa Muda", desk: "Kelapa muda utuh atau gelas.", min: 12000, max: 18000 },
  { kategori: "Minuman", ikon: "🍧", nama: "Es Campur", desk: "Aneka isi, sirup, susu.", min: 12000, max: 18000 },
  { kategori: "Minuman", ikon: "☕", nama: "Kopi Bali", desk: "Kopi tubruk panas.", min: 8000, max: 12000 },
  { kategori: "Minuman", ikon: "💧", nama: "Air Mineral", desk: "Botol dingin atau biasa.", min: 4000, max: 6000 },
];

// ===== DATA PAKET PROMO BAWAAN (contoh, ubah lewat panel admin) =====
// "hargaAsli" boleh dikosongkan. Kalau diisi, harga dicoret dan muncul label hemat.
const promoBawaan = [
  { nama: "Paket Hemat Berdua", desk: "1 ikan bakar, 1 cumi goreng, 2 nasi putih, 2 es teh.", harga: 85000, hargaAsli: 105000 },
  { nama: "Paket Keluarga", desk: "2 ikan bakar, 1 kepiting saus padang, 1 udang bakar, 4 nasi putih, plecing kangkung, 4 es teh.", harga: 225000, hargaAsli: 270000 },
];
const salin = x => JSON.parse(JSON.stringify(x));

// ===== PENYIMPANAN =====
// Urutan baca data: simpanan browser (hasil edit admin) -> data.json -> menu bawaan.
const KUNCI = "cakjul-data";
let data = { hero: "", menu: salin(menuBawaan), promo: salin(promoBawaan) };

// Lengkapi data lama yang belum punya bagian promo
function lengkapi(d) {
  if (typeof d.hero !== "string") d.hero = "";
  if (!Array.isArray(d.promo)) d.promo = salin(promoBawaan);
  return d;
}

function bacaLokal() {
  try { const s = localStorage.getItem(KUNCI); return s ? JSON.parse(s) : null; } catch (e) { return null; }
}
async function muatData() {
  const lokal = bacaLokal();
  if (lokal && Array.isArray(lokal.menu)) return lengkapi(lokal);
  try {
    const r = await fetch("data.json", { cache: "no-store" });
    if (r.ok) { const d = await r.json(); if (Array.isArray(d.menu)) return lengkapi(d); }
  } catch (e) { /* tidak ada data.json: pakai bawaan */ }
  return data;
}
const esc = s => String(s ?? "").replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));

// ===== TAMPILAN PUBLIK =====
const rupiah = n => "Rp " + Number(n).toLocaleString("id-ID");
const hargaTeks = i => i.max ? `${rupiah(i.min)} – ${rupiah(i.max)}` : rupiah(i.min || 0);
const tabs = document.getElementById("tabs");
const grid = document.getElementById("menu-grid");
const hero = document.getElementById("hero");
let tabAktif = "Semua";

function terapkanHero() {
  hero.style.backgroundImage = data.hero
    ? `linear-gradient(rgba(14,59,67,.62), rgba(14,59,67,.62)), url("${data.hero}")`
    : "";
}
const promoSec = document.getElementById("promo");
const promoGrid = document.getElementById("promo-grid");
function lencana(p) {
  return p.hargaAsli > p.harga ? `Hemat ${rupiah(p.hargaAsli - p.harga)}` : "Promo";
}
function renderPromo() {
  promoSec.hidden = !data.promo.length;
  promoGrid.innerHTML = data.promo.map(p => `
    <article class="item item-promo">
      <div class="foto-wrap">
        ${p.foto ? `<img class="foto" src="${p.foto}" alt="${esc(p.nama)}" loading="lazy">`
                 : `<div class="icon" aria-hidden="true">🍱</div>`}
        <span class="lencana">${lencana(p)}</span>
      </div>
      <div class="isi">
        <h3>${esc(p.nama)}</h3>
        <p>${esc(p.desk)}</p>
        <div class="harga-promo">
          <span class="harga">${rupiah(p.harga || 0)}</span>
          ${p.hargaAsli > p.harga ? `<s>${rupiah(p.hargaAsli)}</s>` : ""}
        </div>
      </div>
    </article>`).join("");
}

function renderPublik() {
  terapkanHero();
  renderPromo();
  const kat = ["Semua", ...new Set(data.menu.map(i => i.kategori))];
  if (!kat.includes(tabAktif)) tabAktif = "Semua";
  tabs.innerHTML = kat.map(k =>
    `<button class="tab" role="tab" data-k="${esc(k)}" aria-selected="${k === tabAktif}">${esc(k)}</button>`).join("");
  const daftar = tabAktif === "Semua" ? data.menu : data.menu.filter(i => i.kategori === tabAktif);
  grid.innerHTML = daftar.map(i => `
    <article class="item">
      ${i.foto ? `<img class="foto" src="${i.foto}" alt="${esc(i.nama)}" loading="lazy">`
               : `<div class="icon" aria-hidden="true">${i.ikon || "🍽️"}</div>`}
      <div class="isi">
        <h3>${esc(i.nama)}</h3>
        <p>${esc(i.desk)}</p>
        <span class="harga">${hargaTeks(i)}</span>
      </div>
    </article>`).join("");
}
tabs.addEventListener("click", e => {
  const b = e.target.closest(".tab");
  if (b) { tabAktif = b.dataset.k; renderPublik(); }
});
document.getElementById("tahun").textContent = new Date().getFullYear();

// ===== MENU GARIS TIGA =====
const burger = document.getElementById("burger");
const drawer = document.getElementById("drawer");
function setDrawer(buka) {
  drawer.hidden = !buka;
  burger.setAttribute("aria-expanded", String(buka));
  burger.setAttribute("aria-label", buka ? "Tutup menu" : "Buka menu");
}
burger.addEventListener("click", () => setDrawer(drawer.hidden));
drawer.addEventListener("click", e => { if (e.target.closest("a")) setDrawer(false); });
document.addEventListener("click", e => {
  if (!drawer.hidden && !e.target.closest("#drawer, #burger")) setDrawer(false);
});
document.addEventListener("keydown", e => { if (e.key === "Escape") setDrawer(false); });

// ===== LOGIN =====
const dlg = document.getElementById("login");
const pesan = document.getElementById("login-pesan");
const sudahLogin = () => { try { return sessionStorage.getItem("cakjul-admin") === "1"; } catch (e) { return window.__admin === true; } };
const setLogin = v => { try { v ? sessionStorage.setItem("cakjul-admin", "1") : sessionStorage.removeItem("cakjul-admin"); } catch (e) {} window.__admin = v; };

function bukaLogin() {
  setDrawer(false);
  if (sudahLogin()) { location.hash = "admin"; return; }
  pesan.textContent = "";
  document.getElementById("login-form").reset();
  dlg.showModal();
}
document.getElementById("open-login").addEventListener("click", bukaLogin);
document.getElementById("tutup-login").addEventListener("click", () => dlg.close());
dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); });
document.getElementById("login-form").addEventListener("submit", e => {
  e.preventDefault();
  const f = e.target;
  if (f.user.value.trim() === ADMIN_USER && f.pass.value === ADMIN_PASS) {
    setLogin(true);
    dlg.close();
    location.hash = "admin";
  } else {
    pesan.textContent = "Username atau password salah.";
  }
});

// ===== PANEL ADMIN =====
let kerja = null; // salinan data yang sedang diedit
const admList = document.getElementById("adm-list");
const statusEl = document.getElementById("adm-status");
const heroPrev = document.getElementById("hero-prev");

function info(t) { statusEl.textContent = t; }

function kompres(file, lebar) {
  return new Promise((ok, gagal) => {
    const fr = new FileReader();
    fr.onerror = gagal;
    fr.onload = () => {
      const im = new Image();
      im.onerror = gagal;
      im.onload = () => {
        const s = Math.min(1, lebar / im.width);
        const cv = document.createElement("canvas");
        cv.width = Math.round(im.width * s);
        cv.height = Math.round(im.height * s);
        cv.getContext("2d").drawImage(im, 0, 0, cv.width, cv.height);
        ok(cv.toDataURL("image/jpeg", 0.75));
      };
      im.src = fr.result;
    };
    fr.readAsDataURL(file);
  });
}

function renderHeroPrev() {
  heroPrev.style.backgroundImage = kerja.hero ? `url("${kerja.hero}")` : "";
  heroPrev.innerHTML = kerja.hero ? "" : "<span>Belum ada gambar</span>";
}
const admPromo = document.getElementById("adm-promo");
function renderAdminPromo() {
  admPromo.innerHTML = kerja.promo.map((p, i) => `
    <div class="adm-item" data-i="${i}">
      <div class="adm-foto">
        ${p.foto ? `<img class="foto" src="${p.foto}" alt="">` : `<div class="kosong">🍱</div>`}
        <label class="btn btn-small file-btn">${p.foto ? "Ganti foto" : "Tambah foto"}
          <input type="file" accept="image/*" data-fotop="${i}" hidden>
        </label>
        ${p.foto ? `<button type="button" class="btn-batal" data-hapusfotop="${i}">Hapus foto</button>` : ""}
      </div>
      <div class="adm-form">
        <label class="penuh">Nama paket
          <input type="text" data-fp="nama" value="${esc(p.nama)}">
        </label>
        <label class="penuh">Isi paket / deskripsi
          <textarea data-fp="desk">${esc(p.desk)}</textarea>
        </label>
        <label>Harga promo (Rp)
          <input type="number" min="0" step="500" data-fp="harga" value="${p.harga ?? ""}">
        </label>
        <label>Harga normal (Rp, boleh kosong)
          <input type="number" min="0" step="500" data-fp="hargaAsli" value="${p.hargaAsli ?? ""}">
        </label>
        <button type="button" class="btn-batal adm-hapus" data-hapusp="${i}">Hapus paket</button>
      </div>
    </div>`).join("");
}

function renderAdmin() {
  renderHeroPrev();
  renderAdminPromo();
  admList.innerHTML = kerja.menu.map((m, i) => `
    <div class="adm-item" data-i="${i}">
      <div class="adm-foto">
        ${m.foto ? `<img class="foto" src="${m.foto}" alt="">` : `<div class="kosong">${m.ikon || "🍽️"}</div>`}
        <label class="btn btn-small file-btn">${m.foto ? "Ganti foto" : "Tambah foto"}
          <input type="file" accept="image/*" data-foto="${i}" hidden>
        </label>
        ${m.foto ? `<button type="button" class="btn-batal" data-hapusfoto="${i}">Hapus foto</button>` : ""}
      </div>
      <div class="adm-form">
        <label class="penuh">Nama menu
          <input type="text" data-f="nama" value="${esc(m.nama)}">
        </label>
        <label class="penuh">Deskripsi
          <textarea data-f="desk">${esc(m.desk)}</textarea>
        </label>
        <label>Kategori
          <select data-f="kategori">
            ${KATEGORI.map(k => `<option ${k === m.kategori ? "selected" : ""}>${k}</option>`).join("")}
          </select>
        </label>
        <label>Harga terendah (Rp)
          <input type="number" min="0" step="500" data-f="min" value="${m.min ?? ""}">
        </label>
        <label>Harga tertinggi (Rp, kosongkan jika tetap)
          <input type="number" min="0" step="500" data-f="max" value="${m.max ?? ""}">
        </label>
        <button type="button" class="btn-batal adm-hapus" data-hapus="${i}">Hapus menu</button>
      </div>
    </div>`).join("");
}

admList.addEventListener("input", e => {
  const f = e.target.dataset.f;
  if (!f) return;
  const m = kerja.menu[e.target.closest(".adm-item").dataset.i];
  if (f === "min" || f === "max") {
    const v = e.target.value === "" ? undefined : Number(e.target.value);
    if (v === undefined) delete m[f]; else m[f] = v;
  } else m[f] = e.target.value;
  info("Ada perubahan yang belum disimpan");
});
admList.addEventListener("change", async e => {
  if (e.target.dataset.f === "kategori") return;
  if (e.target.dataset.foto !== undefined && e.target.files[0]) {
    try {
      kerja.menu[e.target.dataset.foto].foto = await kompres(e.target.files[0], 600);
      renderAdmin(); info("Foto ditambahkan. Jangan lupa Simpan");
    } catch (err) { info("Gambar tidak bisa dibaca"); }
  }
});
admList.addEventListener("click", e => {
  const hf = e.target.dataset.hapusfoto, h = e.target.dataset.hapus;
  if (hf !== undefined) { delete kerja.menu[hf].foto; renderAdmin(); info("Ada perubahan yang belum disimpan"); }
  if (h !== undefined && confirm("Hapus menu ini?")) { kerja.menu.splice(h, 1); renderAdmin(); info("Ada perubahan yang belum disimpan"); }
});
admPromo.addEventListener("input", e => {
  const f = e.target.dataset.fp;
  if (!f) return;
  const p = kerja.promo[e.target.closest(".adm-item").dataset.i];
  if (f === "harga" || f === "hargaAsli") {
    const v = e.target.value === "" ? undefined : Number(e.target.value);
    if (v === undefined) delete p[f]; else p[f] = v;
  } else p[f] = e.target.value;
  info("Ada perubahan yang belum disimpan");
});
admPromo.addEventListener("change", async e => {
  if (e.target.dataset.fotop !== undefined && e.target.files[0]) {
    try {
      kerja.promo[e.target.dataset.fotop].foto = await kompres(e.target.files[0], 600);
      renderAdminPromo(); info("Foto ditambahkan. Jangan lupa Simpan");
    } catch (err) { info("Gambar tidak bisa dibaca"); }
  }
});
admPromo.addEventListener("click", e => {
  const hf = e.target.dataset.hapusfotop, h = e.target.dataset.hapusp;
  if (hf !== undefined) { delete kerja.promo[hf].foto; renderAdminPromo(); info("Ada perubahan yang belum disimpan"); }
  if (h !== undefined && confirm("Hapus paket promo ini?")) { kerja.promo.splice(h, 1); renderAdminPromo(); info("Ada perubahan yang belum disimpan"); }
});
document.getElementById("tambah-promo").addEventListener("click", () => {
  kerja.promo.push({ nama: "Paket baru", desk: "", harga: 0 });
  renderAdminPromo();
  admPromo.lastElementChild.scrollIntoView({ behavior: "smooth", block: "center" });
  info("Paket baru ditambahkan. Isi lalu Simpan");
});

document.getElementById("tambah").addEventListener("click", () => {
  kerja.menu.push({ kategori: KATEGORI[0], ikon: "🍽️", nama: "Menu baru", desk: "", min: 0 });
  renderAdmin();
  admList.lastElementChild.scrollIntoView({ behavior: "smooth", block: "center" });
  info("Menu baru ditambahkan. Isi lalu Simpan");
});
document.getElementById("hero-file").addEventListener("change", async e => {
  if (!e.target.files[0]) return;
  try { kerja.hero = await kompres(e.target.files[0], 1400); renderHeroPrev(); info("Background diganti. Jangan lupa Simpan"); }
  catch (err) { info("Gambar tidak bisa dibaca"); }
  e.target.value = "";
});
document.getElementById("hero-hapus").addEventListener("click", () => { kerja.hero = ""; renderHeroPrev(); info("Ada perubahan yang belum disimpan"); });

document.getElementById("simpan").addEventListener("click", () => {
  try {
    localStorage.setItem(KUNCI, JSON.stringify(kerja));
    data = JSON.parse(JSON.stringify(kerja));
    renderPublik();
    info("Tersimpan di browser ini");
  } catch (err) {
    info("Gagal menyimpan: penyimpanan penuh. Kecilkan atau hapus beberapa foto");
  }
});
document.getElementById("ekspor").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(kerja)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "data.json";
  a.click();
  URL.revokeObjectURL(a.href);
  info("data.json terunduh. Upload ke GitHub agar tampil untuk semua orang");
});
document.getElementById("reset").addEventListener("click", () => {
  if (!confirm("Kembalikan menu, paket promo, dan background ke bawaan? Perubahan yang tersimpan akan dihapus.")) return;
  try { localStorage.removeItem(KUNCI); } catch (e) {}
  data = { hero: "", menu: salin(menuBawaan), promo: salin(promoBawaan) };
  kerja = salin(data);
  renderAdmin(); renderPublik(); info("Dikembalikan ke bawaan");
});
document.getElementById("keluar").addEventListener("click", () => { setLogin(false); location.hash = ""; });

// ===== PETA LOKASI =====
// Gambar peta disusun dari tile OpenStreetMap di titik koordinat warung.
// Kalau tile gagal dimuat (offline), yang tampil adalah gambar peta sederhana bawaan.
let zPeta = 16;
function ubahZoom(d) {
  const baru = Math.min(18, Math.max(12, zPeta + d));
  if (baru !== zPeta) { zPeta = baru; buatPeta(); }
}
document.getElementById("zoom-in").addEventListener("click", () => ubahZoom(1));
document.getElementById("zoom-out").addEventListener("click", () => ubahZoom(-1));

function buatPeta() {
  const el = document.getElementById("peta");
  const kotak = document.getElementById("peta-tiles");
  if (!el || !kotak) return;
  const W = el.clientWidth, H = el.clientHeight;
  if (!W) return;
  const lat = Number(el.dataset.lat), lng = Number(el.dataset.lng), z = zPeta, n = 2 ** z;
  const rad = lat * Math.PI / 180;
  const x = (lng + 180) / 360 * n;
  const y = (1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2 * n;
  const cx = W / 2, cy = H / 2;
  kotak.innerHTML = "";
  el.classList.remove("tile-ok");
  for (let ty = Math.floor(y - cy / 256); ty <= Math.floor(y + cy / 256); ty++) {
    for (let tx = Math.floor(x - cx / 256); tx <= Math.floor(x + cx / 256); tx++) {
      const im = new Image();
      im.alt = "";
      im.draggable = false;
      im.style.left = (cx + (tx - x) * 256) + "px";
      im.style.top = (cy + (ty - y) * 256) + "px";
      im.onload = () => el.classList.add("tile-ok");
      im.src = `https://tile.openstreetmap.org/${z}/${tx}/${ty}.png`;
      kotak.appendChild(im);
    }
  }
}
let tundaPeta;
window.addEventListener("resize", () => { clearTimeout(tundaPeta); tundaPeta = setTimeout(buatPeta, 200); });

// ===== PENGALIH HALAMAN (#admin) =====
function rute() {
  const admin = location.hash === "#admin";
  if (admin && !sudahLogin()) { history.replaceState(null, "", location.pathname + location.search); bukaLogin(); return; }
  document.body.classList.toggle("mode-admin", admin);
  if (!admin) requestAnimationFrame(buatPeta);
  if (admin) { kerja = JSON.parse(JSON.stringify(data)); renderAdmin(); info(""); window.scrollTo(0, 0); }
}
window.addEventListener("hashchange", rute);
document.getElementById("lihat").addEventListener("click", e => { e.preventDefault(); location.hash = ""; });

// ===== MULAI =====
muatData().then(d => { data = d; renderPublik(); rute(); });
