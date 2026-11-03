# Kasir Sotomie Kang Hendi — v1.0.1

POS sederhana berbasis PWA untuk satu perangkat. Tidak memerlukan backend atau database server.

## Isi paket
- `index.html` — aplikasi kasir
- `manifest.json` — konfigurasi instalasi PWA
- `sw.js` — cache app-shell dengan scope terbatas
- `icon.svg` — ikon aplikasi

## Deploy ke GitHub Pages
1. Buat repository baru dan upload semua file ke root repository.
2. Buka **Settings → Pages**.
3. Pilih **Deploy from a branch**, branch `main`, folder `/ (root)`.
4. Buka URL GitHub Pages yang diberikan.
5. Buka sekali saat online sampai aplikasi termuat dan Service Worker terpasang.
6. Di Chrome Android pilih menu ⋮ → **Install app** / **Add to Home screen**.

## Penggunaan
1. Buka **Atur → Produk** dan isi harga setiap menu.
2. Atur nama warung, alamat, nomor WA, dan ucapan struk.
3. Atur PIN 4 digit bila ingin mengunci tampilan aplikasi.
4. Tambahkan item, pilih dine-in/takeaway, lalu selesaikan pembayaran.
5. Untuk QRIS, kasir wajib memastikan dana masuk sebelum mencentang konfirmasi.
6. Ekspor backup JSON secara rutin dan simpan di luar HP, misalnya Google Drive.

## Menu awal
Daftar awal diisi dengan menu dan harga yang pernah ditetapkan:
- Soto Tangkar Rp25.000
- Soto Mie Rp16.000
- Nasi Rp5.000
- Risol (3 pcs) Rp5.000
- Es Teh Manis Rp5.000
- Es Teh Tawar Rp3.000
- Teh Manis Hangat Rp4.000
- Es Jeruk Rp5.000
- Jeruk Hangat Rp5.000
- Nutrisari Rp5.000

Harga dapat disesuaikan melalui **Atur → Produk**.

## Perbaikan v1.0.1
- Menolak transaksi dengan total nol atau harga produk tidak valid.
- Menangani kegagalan penyimpanan lokal agar transaksi tidak dianggap berhasil.
- Mencegah klik simpan transaksi berulang dalam satu sesi.
- Menghapus jalur reset dari layar PIN dan meminta PIN saat reset dari menu Atur.
- Menambahkan jeda sementara setelah beberapa kali PIN salah.
- Memvalidasi struktur backup sebelum restore.
- Membatasi Service Worker pada app-shell dan scope aplikasi; tidak menghapus cache aplikasi lain di origin yang sama.

## Batasan yang wajib dipahami
- **Data hanya tersimpan pada browser/perangkat ini.** Tidak ada sinkronisasi antar-HP dan tidak ada backup cloud otomatis.
- PIN di aplikasi sisi-klien hanya pengunci tampilan/deterrent; bukan autentikasi kuat. Orang yang menguasai perangkat/browser masih dapat mengakses atau menghapus data.
- QRIS masih dicatat manual; tidak ada verifikasi otomatis dari payment gateway.
- Printer thermal Bluetooth belum diintegrasikan.
- PWA offline baru dapat digunakan setelah aplikasi berhasil dibuka online dan app-shell berhasil di-cache.
- Backup harian internal browser bukan pengganti ekspor JSON ke lokasi eksternal.

## QA minimum sebelum operasional
- Uji transaksi tunai: uang pas, uang lebih, uang kurang.
- Uji QRIS: belum dicentang harus ditolak; sudah dicentang baru dapat disimpan.
- Uji produk harga 0: tidak boleh masuk keranjang/checkout.
- Uji tutup-buka aplikasi dalam mode pesawat setelah instalasi dan cache awal.
- Uji ekspor JSON, restore ke browser uji, dan cocokkan jumlah transaksi serta total.
- Uji transaksi batal: omzet laporan tidak boleh menghitung transaksi batal.
- Uji kapasitas penyimpanan: pastikan pesan error tampil bila browser menolak penyimpanan.
- Lakukan backup JSON sebelum update aplikasi atau reset browser.
