# Suvarnabhumi Website — Rencana Fitur

## Arah website

Website ini menjadi atlas digital dan pusat referensi untuk dunia Suvarnabhumi: pengunjung bisa menelusuri pembagian wilayah, kota-kota besar, dan sejarah konsesi Eropa. Konten ditampilkan sebagai halaman dan eksplorasi interaktif, bukan sekadar kumpulan CSV.

## Fitur rilis pertama

1. **Beranda peta**
   - Peta dunia menjadi tampilan utama saat website dibuka.
   - Kontrol untuk memilih tingkat administrasi ADM0, ADM1, ADM2, atau ADM3.
   - Pilihan pengelompokan warna berdasarkan Mandala atau Cakravala.
   - Untuk saat ini peta hanya menampilkan basemap; batas wilayah Suvarnabhumi belum dimuat.
   - Pengguna dapat menggeser dan memperbesar peta, lalu membuka Polygon Studio untuk menyiapkan geometri.

2. **Atlas wilayah**
   - Jelajahi struktur wilayah melalui Cakravala, Mandala, negara, dan tingkat administrasi ADM0–ADM3.
   - Cari nama wilayah dan saring berdasarkan tingkat administrasi setelah data batas tersedia.
   - Halaman ringkas untuk melihat wilayah mana yang termasuk dalam suatu Mandala atau Cakravala.
   - Bedakan basemap geografis umum dari batas wilayah dan pengelompokan kanon Suvarnabhumi.

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
   - Menu utama yang konsisten: Peta, Atlas, Kota, Distrik Warisan Barat, Tentang.
   - URL profil yang bisa dibagikan langsung.

## Fitur tahap berikutnya

- **Lapisan batas wilayah:** hubungkan geometri ADM0–ADM3 yang sesuai, warnai berdasarkan Mandala atau Cakravala, dan buka ringkasan wilayah saat poligon dipilih.
- **Timeline sejarah Suvarnabhumi:** peristiwa politik dan perubahan wilayah dari masa ke masa. Memerlukan dataset kronologi karena file bernama `suvarnabhumi_history.csv` yang tersedia saat ini berisi hierarki wilayah, bukan daftar peristiwa bertanggal.
- **Perbandingan kota/wilayah:** bandingkan populasi, kepadatan, demografi, bahasa, dan ekonomi dengan catatan metode yang sama.
- **Versi Bahasa Indonesia dan Inggris:** sediakan pilihan bahasa setelah struktur konten utama stabil.
- **Jelajah tematik:** tur singkat, misalnya “kota terbesar”, “wilayah lintas negara”, atau “bekas konsesi Eropa”.

## Batas data yang perlu dijaga

Berkas saat ini mencakup 18.192 entri wilayah administratif (248 nilai Cakravala, 17 Mandala, dan 150 negara), tabel 50 kota, serta 10 entri enklave ditambah catatan kebijakan dan konteks. Dataset yang tersedia belum menyertakan geometri batas untuk menggambar wilayah kanon secara akurat. Karena itu beranda memakai basemap umum dan membiarkan lapisan Suvarnabhumi kosong sampai data geometri batas siap.

## Urutan pengerjaan yang disarankan

1. Siapkan kerangka halaman dan gaya visual.
2. Bangun beranda peta dan hubungkan data wilayah.
3. Bangun Atlas wilayah, Atlas 50 kota, dan Distrik Warisan Barat.
4. Tambahkan pencarian, tautan profil, serta tampilan ponsel.
5. Rapikan sumber, metode, dan label estimasi.
