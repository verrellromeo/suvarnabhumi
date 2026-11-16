# Suvarnabhumi Website — Fitur & Struktur

## Arah website

Atlas digital Suvarnabhumi dengan peta sebagai beranda. Peta batas kanon dimulai kosong; halaman lain tetap memuat direktori wilayah, kota, tokoh, sejarah terpilih, dan enklave.

## Navigasi utama

- **Peta** — tampilan dunia sebagai landing page, basemap dapat digeser/diperbesar, pilihan ADM0–ADM3, dan batas kanon Suvarnabhumi kosong sampai geometri siap.
- **Wilayah** — hierarki, indeks Mandala/Cakravala, dan ringkasan kawasan.
- **Kota** — profil urban dengan karakter tempat, sejarah, arsitektur, dan demografi bila sumbernya tersedia.
- **Sejarah** — garis waktu milestone kanon yang bertanggal.
- **Tokoh** — profil penguasa, pemimpin, dan tokoh historis dengan peran serta peristiwa yang tercatat.
- **Enklave** — profil bekas konsesi Eropa, identitas kota, dan pengembalian kedaulatan 1749.
- **Sumber** — provenance, metodologi, status data, dan catatan kanon.

## Data yang tersedia dalam proyek

- Hierarki wilayah: 17 Mandala, 248 Cakravala, 150 negara, dan 18.192 entri administratif menurut inventaris proyek.
- Tabel Top 50 kota dan demografi.
- Kanon 10 enklave Eropa pada 1749.
- Memori proyek berisi profil dan catatan kota, kawasan, serta beberapa milestone sejarah.
- Berkas `suvarnabhumi_history.csv` menyimpan hierarki wilayah, bukan daftar peristiwa bertanggal.

## Batas kanon yang perlu dijaga

- Bedakan kawasan ibu kota Malaya Islands Capital Region dari Srivijaya Special Administrative Region.
- Bedakan tahun pendirian kota, penaklukan wilayah, kesetiaan politik, dan pengembalian kedaulatan.
- Jangan mengisi tahun pendirian atau biografi tokoh yang belum dikonfirmasi.
- Hubungan Cakravala dengan jenjang tradisional Kadipatra, Viṣaya, Thāna, dan Kampong masih memerlukan pencocokan.
- Basemap umum bukan batas politik Suvarnabhumi. Overlay wilayah harus memakai geometri yang sesuai dengan data kanon.

## Status implementasi

Beranda peta dan halaman Wilayah, Kota, Sejarah, Tokoh, Enklave, serta Sumber sudah tersedia sebagai fitur dasar. Konten awal memakai catatan kanon yang telah dibahas; angka demografi dan seluruh baris CSV harus tetap ditampilkan setelah pemetaan kolom dan impor sumber selesai. Peta saat ini memakai basemap umum tanpa overlay batas Suvarnabhumi.
