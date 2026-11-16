# Suvarnabhumi Website — Rencana Fitur

## Arah website

Website ini menjadi atlas digital dan pusat referensi untuk dunia Suvarnabhumi: pengunjung bisa menelusuri pembagian wilayah, kota-kota besar, dan sejarah konsesi Eropa. Konten ditampilkan sebagai halaman dan eksplorasi interaktif, bukan sekadar kumpulan CSV.

## Fitur rilis pertama

1. **Beranda**
   - Pengenalan singkat tentang Suvarnabhumi.
   - Angka utama sebagai pintu masuk: 17 mandala, 150 negara, dan 50 kota utama.
   - Kartu menuju Atlas, Kota, serta Distrik Warisan Barat.
   - Wilayah atau kota pilihan yang berganti secara editorial.

2. **Atlas wilayah**
   - Jelajahi struktur wilayah melalui Cakravala, Mandala, negara, ADM Level 1, dan ADM Level 2.
   - Cari nama wilayah dan saring berdasarkan tingkat administrasi.
   - Halaman ringkas untuk melihat wilayah mana yang termasuk dalam suatu Mandala atau Cakravala.
   - Pada rilis pertama, gunakan daftar dan kartu wilayah yang akurat. Peta batas geografis penuh menyusul setelah data geometri wilayah tersedia.

3. **Atlas 50 kota**
   - Daftar kota yang dapat dicari, diurutkan, dan disaring menurut Mandala, populasi, atau karakter kota.
   - Profil tiap kota menampilkan estimasi populasi metro, luas dan kepadatan, wilayah pembentuk metro, sejarah, bentuk kota, arsitektur, ekonomi, demografi, dan bahasa.
   - Penanda yang jelas untuk nilai perkiraan beserta catatan dasar estimasinya.

4. **Distrik Warisan Barat**
   - Profil untuk 10 bekas enklave/konsesi Eropa, termasuk asal-usul dan identitas warisannya.
   - Garis waktu konsesi dan perubahan status hingga pengembalian kedaulatan pada 1749.
   - Penjelasan aturan kebijakan dan status distrik setelah 1749.
   - Catatan populasi dan komposisi identitas modern jika tersedia di data.

5. **Pencarian lintas situs**
   - Satu kotak pencarian untuk menemukan Mandala, Cakravala, negara, wilayah administratif, kota, atau enklave.
   - Hasil pencarian mengarahkan ke profil terkait, bukan hanya menampilkan baris data.

6. **Sumber, metode, dan catatan kanon**
   - Tampilkan sumber data, batas wilayah, logika penghitungan, serta catatan kanon yang relevan.
   - Bedakan informasi kanon, estimasi, dan interpretasi.
   - Sediakan halaman “Tentang data” agar angka dan pembagian wilayah tidak terlihat seolah-olah semuanya pasti atau hasil pengukuran resmi.

7. **Navigasi responsif**
   - Nyaman dipakai di ponsel maupun desktop.
   - Menu utama yang konsisten: Beranda, Atlas, Kota, Distrik Warisan Barat, Tentang.
   - URL profil yang bisa dibagikan langsung.

## Fitur tahap berikutnya

- **Peta interaktif penuh:** warna per Mandala/Cakravala, pilihan lapisan, zoom, serta klik wilayah untuk membuka profil. Memerlukan GeoJSON atau data batas wilayah yang cocok dengan daftar ADM.
- **Timeline sejarah Suvarnabhumi:** peristiwa politik dan perubahan wilayah dari masa ke masa. Memerlukan dataset kronologi karena file bernama `suvarnabhumi_history.csv` yang tersedia saat ini berisi hierarki wilayah, bukan daftar peristiwa bertanggal.
- **Perbandingan kota/wilayah:** bandingkan populasi, kepadatan, demografi, bahasa, dan ekonomi dengan catatan metode yang sama.
- **Versi Bahasa Indonesia:** tambahkan pilihan bahasa setelah struktur konten utama stabil.
- **Jelajah tematik:** tur singkat, misalnya “kota terbesar”, “wilayah lintas negara”, atau “bekas konsesi Eropa”.

## Batas data yang perlu dijaga

Berkas saat ini mencakup 18.192 entri wilayah administratif (248 nilai Cakravala, 17 Mandala, dan 150 negara), tabel 50 kota, serta 10 entri enklave ditambah catatan kebijakan dan konteks. Dataset yang tersedia belum menyertakan geometri batas untuk menggambar peta akurat. Karena itu rilis pertama sebaiknya mengutamakan direktori wilayah dan profil berbasis data; peta penuh dan timeline umum masuk tahap berikutnya.

## Urutan pengerjaan yang disarankan

1. Siapkan kerangka halaman dan gaya visual.
2. Bangun Beranda, Atlas wilayah, Atlas 50 kota, dan Distrik Warisan Barat.
3. Tambahkan pencarian, tautan profil, dan tampilan ponsel.
4. Rapikan sumber, metode, dan label estimasi.
5. Tambahkan peta dan timeline setelah data pendukungnya siap.
