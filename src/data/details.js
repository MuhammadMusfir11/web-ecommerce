// Spesifikasi dan ulasan CONTOH. Ganti sesuai produk asli Wali Cell.
// Kalau produk belum ada di sini, tab spesifikasinya menampilkan "belum diisi".

export const specs = {
  "galaxy-a55": [
    ["Layar", "AMOLED 6,6 inci"],
    ["RAM", "8 GB"],
    ["Baterai", "5000 mAh"],
    ["Jaringan", "5G"],
  ],
  "redmi-note-13": [
    ["Kamera", "108 MP"],
    ["Layar", "AMOLED 120 Hz"],
    ["Pengisian", "33 W"],
  ],
  "poco-x6": [
    ["Prosesor", "Snapdragon 7s Gen 2"],
    ["Layar", "AMOLED 120 Hz"],
    ["RAM", "8 GB"],
    ["Jaringan", "5G"],
  ],
  "infinix-hot-40": [
    ["Layar", "120 Hz"],
    ["RAM", "8 GB"],
    ["Baterai", "5000 mAh"],
  ],
  "asus-vivobook-14": [
    ["Prosesor", "Ryzen 5"],
    ["RAM", "8 GB"],
    ["Penyimpanan", "SSD 512 GB"],
    ["Layar", "14 inci"],
  ],
  "acer-aspire-5": [
    ["Prosesor", "Core i5"],
    ["RAM", "16 GB"],
    ["Penyimpanan", "SSD 512 GB"],
    ["Layar", "Full HD 15,6 inci"],
  ],
  "ideapad-slim-3": [
    ["Prosesor", "Core i3"],
    ["RAM", "8 GB"],
    ["Penyimpanan", "SSD 256 GB"],
    ["Bobot", "Ringan dan tipis"],
  ],
  "tws-sonic": [
    ["Konektivitas", "Bluetooth 5.3"],
    ["Mode", "Low latency"],
    ["Daya tahan", "24 jam dengan case"],
  ],
  "headset-gaming-x7": [
    ["Suara", "Surround 7.1"],
    ["Mikrofon", "Bisa dilepas"],
    ["Bantalan", "Empuk"],
  ],
  "speaker-mini": [
    ["Ketahanan", "Tahan cipratan air"],
    ["Baterai", "12 jam"],
    ["Suara", "Bass tebal"],
  ],
  "powerbank-20k": [
    ["Kapasitas", "20.000 mAh"],
    ["Pengisian", "Fast charging 22,5 W"],
    ["Port", "2 port keluaran"],
    ["Indikator", "Digital"],
  ],
  "charger-65w": [
    ["Daya", "65 W"],
    ["Teknologi", "GaN"],
    ["Port", "3 port USB"],
    ["Cocok untuk", "HP dan laptop"],
  ],
  "kabel-usbc-100w": [
    ["Daya", "100 W"],
    ["Panjang", "1,5 m"],
    ["Bahan", "Braided"],
    ["Fungsi", "Pengisian cepat dan transfer data"],
  ],
};

// Ulasan bawaan untuk semua produk. Mau beda per produk, isi di `reviews` di bawah.
export const defaultReviews = [
  { name: "Rina", rating: 5, date: "3 hari lalu", text: "Barang sesuai deskripsi, packing rapi dan sampai cepat." },
  { name: "Budi", rating: 4, date: "1 minggu lalu", text: "Kualitas bagus untuk harganya. Pelayanan toko ramah." },
  { name: "Siti", rating: 5, date: "2 minggu lalu", text: "Sudah beli di sini dua kali, tidak pernah kecewa." },
];

// Contoh override: reviews["galaxy-a55"] = [ { name, rating, date, text } ]
export const reviews = {};