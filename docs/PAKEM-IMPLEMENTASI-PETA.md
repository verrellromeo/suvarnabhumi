# Pakem implementasi peta Suvarnabhumi

Panduan kerja untuk membangun setiap Mandala, membaginya menjadi Cakravala, dan membuka ADM2 di dalamnya. Gunakan Maharaja Mandala sebagai contoh implementasi; jumlah wilayah, daftar negara, nama frame, dan toleransi geometri Mandala lain harus ditentukan dari datanya sendiri.

## 1. Prinsip yang wajib dijaga

1. **GitHub adalah sumber implementasi situs.** Simpan hasil yang siap ditinjau melalui commit bertahap. Cloudflare Pages menerbitkan perubahan dari `main`.
2. **Cakupan wilayah mengikuti keputusan kanon pengguna.** SVG adalah referensi pengelompokan dan warna; koreksi pengguna mengungguli label atau perkiraan otomatis.
3. **Geometri mengikuti data peta yang sudah dipakai situs.** Jangan mengganti bentuk seluruh peta dengan koordinat gambar SVG. SVG harus dicocokkan ke ID wilayah geografis.
4. **ID ADM2 adalah pengenal utama.** Nama, ejaan, level administrasi, dan batas bisa berbeda antarsumber. Nama yang tidak ditemukan bukan bukti wilayah tidak masuk.
5. **Setiap ADM2 anggota memiliki tepat satu Mandala dan satu Cakravala.** Seluruh komponen pulau dari satu fitur harus tetap ikut. Wilayah yang belum disepakati dicatat sebagai perlu tinjauan.
6. **Batas harus dibangun sebagai satu cakupan bersama.** Menggabungkan tiap kelompok secara terpisah saja belum menjamin tidak ada celah atau tumpang tindih.
7. **Pemeriksaan angka, geometri, dan tampilan adalah tiga pemeriksaan berbeda.** Jumlah path tidak membuktikan ada atau tidak ada lubang. Geometri valid juga belum membuktikan tampilan browser benar.

## 2. Alur hasil di website

| Tingkat | Yang terlihat | Saat dipilih | Kembali ke |
|---|---|---|---|
| Mandala | Satu isian wilayah Mandala; Maharaja berwarna emas | Membuka batas, nama, dan daftar Cakravala | Tampilan awal atlas |
| Cakravala | Batas bersama dan warna tiap Cakravala dari SVG | Memuat poligon serta daftar ADM2 Cakravala itu | Mandala |
| ADM2 | Wilayah administratif anggota Cakravala terpilih | Menampilkan nama, detail, dan penetapan wilayah | Daftar Cakravala |

Pilihan pada daftar dan poligon harus menghasilkan navigasi yang sama. Detail ADM2 dimuat saat diperlukan. Peta per negara dapat tersedia sebagai alat tambahan, tetapi navigasi utama mengikuti Mandala → Cakravala → ADM2.

## 3. Tahap A — Kunci masukan dan versi awal

- Catat commit awal, SVG yang dipakai, sumber batas, tanggal/versi dataset, level administrasi, dan aturan penggunaan sumbernya.
- Identifikasi manifest serta paket geometri yang benar-benar dibaca situs, bukan hanya file regional lama.
- Catat jumlah ID sebelum perubahan dan simpan pembanding geometri/tangkapan layar.
- Pastikan SVG sumber dapat ditemukan kembali. Skrip saat ini merujuk file di direktori unggahan workspace; direktori itu bukan arsip permanen repo. Sebelum membangun ulang dari lingkungan baru, sediakan SVG versi yang sama atau ubah jalurnya secara eksplisit.
- Catat dependensi pembangun. Skrip saat ini membutuhkan Python, `lxml`, dan Shapely 2.x.

**Hasil:** daftar masukan dan versi yang bisa ditelusuri, serta kondisi awal yang dapat dipulihkan.

## 4. Tahap B — Tetapkan cakupan Mandala

Buat tabel cakupan sebelum membentuk batas:

| Jenis keanggotaan | Cara mencatat |
|---|---|
| Seluruh entitas ADM0 | Kode entitas dan keputusan masuk seluruhnya |
| Seluruh ADM1 tertentu | ID ADM1 dan seluruh ID ADM2 anaknya |
| Sebagian ADM1 | Daftar ID ADM2 yang masuk |
| Gugus pulau | Daftar fitur/ID seluruh gugus, termasuk pulau kecil |
| Pengecualian | ID yang dikeluarkan beserta alasannya |

Untuk Maharaja yang sudah disepakati:

- Brunei, Kamboja, Laos, Malaysia, Myanmar, Filipina, Singapura, Thailand, Timor-Leste, Taiwan, Hong Kong, dan Macau masuk seluruhnya.
- Indonesia, China, India, Bangladesh, dan Jepang masuk sebagian sesuai inventaris ID yang sudah dikonfirmasi.
- Sumatra, Jawa, Kalimantan, Kepulauan Riau, NTT–NTB, serta Andaman harus tercakup lengkap menurut keputusan pengguna.
- Bagian India timur laut mengikuti pilihan yang telah dikoreksi. **Jangan memasukkan Assam, Meghalaya, atau Arunachal Pradesh seluruhnya hanya untuk menutup celah.**
- Untuk rincian setiap distrik, gunakan `membership.json` dan inventaris ADM2; uraian geografis di atas tidak menggantikan daftar ID.

**Hasil:** keanggotaan Mandala yang eksplisit. Ketidakpastian cakupan harus diselesaikan sebelum dijadikan batas final.

## 5. Tahap C — Ekstrak inventaris SVG

1. Baca grup/frame induk Cakravala.
2. Simpan nama frame mentah dan seluruh label path mentah.
3. Ambil warna `fill` dominan setiap frame; simpan kode heksadesimal aslinya.
4. Bedakan ID frame sumber dan nama tampilan kanonis.
5. Catat label yang bertentangan dengan grup induknya. Pada kasus Pagan yang sudah ditemukan, pengelompokan mengikuti grup induk.
6. Jangan memotong label berdasarkan setiap underscore: nama ADM1/ADM2 sendiri bisa mengandung underscore.

Nama tampilan yang sudah dikoreksi:

| ID frame sumber | Nama tampilan |
|---|---|
| `Srivijaya_Suvarnabhumi_Capital_Region` | Srivijaya Special Administrative Region |
| `Malaya_Islands` | Malaya Islands Capital Region |

**Hasil:** CSV inventaris SVG, daftar Cakravala, palet warna, dan catatan konflik.

## 6. Tahap D — Cocokkan SVG ke ADM2 aktif

Urutan pencocokan yang dipakai untuk menyusun inventaris:

1. Pilih fitur dari paket aktif menurut daftar keanggotaan Mandala.
2. Cari pasangan ID jika sumber menyediakan hubungan ID yang andal.
3. Cocokkan nama yang dinormalisasi dalam negara dan konteks ADM1/Cakravala yang tepat. Jangan menyatukan dua distrik hanya karena namanya sama.
4. Gunakan irisan geometri untuk kasus beda ejaan atau beda tingkat administrasi. Rekam proporsi irisan dan sumber pembanding.
5. Jika tidak ada irisan, catat kandidat berdasarkan kedekatan sebagai **perkiraan yang perlu konfirmasi**. Kedekatan tidak otomatis menetapkan kanon.
6. Simpan koreksi pengguna berdasarkan ID ADM2 agar tidak hilang ketika skrip dijalankan ulang.

Kolom minimal inventaris:

| Kolom | Isi |
|---|---|
| `adm0_code` | Kode negara/entitas di atlas |
| `adm1_id` | ID induk administratif di atlas |
| `adm2_id` | ID unik yang dipakai situs |
| `adm2_name_in_web` | Nama pada dataset aktif |
| `cakravala_svg_frame` | ID frame Cakravala sumber |
| `svg_name_status` | Nama tertulis, kecocokan geometri, atau tanpa irisan |
| `svg_reference_label` | Label pembanding SVG/regional |
| `cakravala_overlap_fraction` | Bukti proporsi irisan geometri |
| `cakravala_assignment_status` | Hasil turunan SVG atau konfirmasi pengguna |

Status nama SVG dan status konfirmasi adalah dua hal berbeda. Konfirmasi pengguna tidak berarti nama itu tiba-tiba tercantum dalam SVG.

Pada Maharaja, 34 penempatan yang sebelumnya tanpa irisan sudah dikonfirmasi pengguna. **Karimun dan Lingga masuk Malaya Islands; penempatan 32 wilayah lainnya disetujui.** Keputusan ini tersimpan di `confirmed-cakravala.json`.

**Hasil:** inventaris satu baris per ADM2 dengan satu Cakravala dan bukti penetapannya.

## 7. Tahap E — Bentuk batas Mandala terlebih dahulu

- Bentuk cakupan dari fitur yang benar-benar masuk, lalu gabungkan menjadi wilayah Mandala.
- Tampilkan Maharaja sebagai isian emas sejak halaman dibuka. Klik Mandala membuka tingkat Cakravala.
- Jangan menambahkan lagi garis ADM0 di atas isian Mandala. Periksa urutan layer dan handler kliknya.
- Periksa seluruh gugus pulau dan area parsial terhadap referensi kanon.
- Tinjau cekungan, semenanjung, lubang, dan tonjolan baru. Penambahan satu ADM1 penuh harus didasari keputusan cakupan, bukan sekadar agar area kosong hilang.

**Hasil:** cakupan luar Mandala yang disetujui, sebelum warna dan batas Cakravala diaktifkan.

## 8. Tahap F — Rapikan topologi Cakravala dan ADM2

Geometri dari negara atau level berbeda dapat menyisakan garis pantai yang berbeda, celah tipis, dan area bertumpuk. Prosedur yang dipakai pada perbaikan Maharaja:

1. Perbaiki geometri tidak valid dan ambil hanya komponen poligon.
2. Gabungkan fitur ADM2 per Cakravala untuk membentuk cakupan awal.
3. Tetapkan domain cakupan yang disetujui. Pembangun Maharaja kini menggabungkan batas Mandala dengan geometri seluruh ADM2 terpilih agar pulau kecil dari sumber detail tetap terjaga. Setiap penambahan cakupan perlu dibandingkan dengan batas kanon.
4. Tutup celah sumber yang sempit pada cakupan awal. Pertahankan komponen asli agar pulau kecil tidak lenyap oleh proses perapihan.
5. Satukan garis batas dan buat simpul pada seluruh perpotongannya, kemudian pecah domain menjadi bidang poligon yang tidak bertumpuk.
6. Tetapkan setiap bidang kepada satu Cakravala berdasarkan irisan terbesar. Untuk bidang yang sepenuhnya tercakup beberapa kandidat, pembangun saat ini memilih kandidat terkecil agar fitur kecil tidak tertutup fitur besar.
7. Untuk bidang celah tanpa irisan, gunakan kandidat terdekat dalam domain. Tinjau perubahan yang bermakna; aturan ini merapikan geometri dan tidak menggantikan keputusan kanon.
8. Ulangi pembagian bidang pada ADM2 di dalam **batas Cakravala yang sudah dibersihkan**.
9. Pastikan tidak ada ID yang menjadi geometri kosong, termasuk fitur danau dan pulau kecil.
10. Gunakan hasil bersih yang sama untuk layer peta dan paket detail. Aktifkan `smoothFactor: 0` pada layer Leaflet terkait agar penyederhanaan ulang tidak memisahkan batas bersama.

Parameter Maharaja saat ini:

- Detail sumber regional mempertahankan 3% titik menurut pengaturan sebelumnya. Angka ini adalah persentase titik yang dipertahankan, bukan ukuran galat posisi.
- Penutupan celah awal memakai buffer keluar/masuk `0.008` derajat. Ini parameter tampilan lokal, **bukan jarak meter yang seragam**; jangan menerapkannya secara buta pada Mandala lain.
- Skrip menguji selisih cakupan dan tumpang tindih dengan toleransi area planar `1e-8` derajat kuadrat. Ini toleransi perhitungan, bukan jaminan akurasi geografis.

Jangan menghapus semua lubang tanpa pemeriksaan: lubang bisa berupa danau, wilayah yang memang dikecualikan, atau celah sumber. Jangan membuat convex hull, karena dapat mengisi laut dan wilayah di luar Mandala. Simpan sumber asli; hasil topologi adalah geometri tampilan yang telah disesuaikan.

**Hasil:** Cakravala saling berbatasan tanpa tumpang tindih; ADM2 menutup tepat cakupan Cakravalanya, dengan seluruh ID terjaga.

## 9. Tahap G — Kemas data untuk website

Struktur Maharaja saat ini:

```text
assets/map/maharaja/
  membership.json                 # Keanggotaan Mandala
  svg-membership.csv              # Label mentah SVG
  adm2-cakravala.csv               # Inventaris ID dan pasangan Cakravala
  confirmed-cakravala.json         # Koreksi pengguna berdasarkan ID
  boundary.geojson.gz              # Batas Mandala pembuka
  cakravala/
    index.json                    # ID, nama, warna, jumlah, nama paket
    boundaries.json.gz            # Batas 29 Cakravala yang sudah dibersihkan
    <frame-id>.json.gz             # ADM2 bersih untuk satu Cakravala
```

- Pakai gzip dan muat detail per Cakravala.
- Verifikasi setiap paket yang disebut indeks tersedia dan dapat didekompresi.
- Pertahankan ID, nama, negara sumber, serta Cakravala pada properti fitur.
- Periksa ukuran setiap paket terhadap batas hosting sebelum commit.
- Atribusi sumber tetap tersedia di situs.

## 10. Tahap H — Implementasikan navigasi dan warna

- Ambil warna dari frame SVG; atur transparansi dan ketebalan garis agar nyaman dibaca pada latar situs.
- Gunakan nama tampilan kanonis di tooltip, panel, dan breadcrumb.
- Klik Mandala menampilkan semua Cakravala. Klik Cakravala memuat hanya ADM2 anggotanya.
- Klik ADM2 membuka detail yang sesuai ID. Pencarian mengikuti tingkat aktif.
- Tombol kembali harus memulihkan layer, daftar, dan breadcrumb yang sesuai.
- Cegah respons pemuatan lama menimpa pilihan baru ketika pengguna mengklik cepat.
- Jangan menumpuk layer detail lama atau layer negara di atas layer aktif.
- Jangan menampilkan pilihan yang belum selesai dimuat sebagai hasil final; sediakan status pemuatan dan kegagalan yang terbaca.

## 11. Tahap I — Gerbang pemeriksaan sebelum rilis

| Pemeriksaan | Syarat lulus |
|---|---|
| ID | Jumlah unik sesuai inventaris; tidak ada duplikat atau kehilangan |
| Keanggotaan | Setiap ADM2 punya satu Cakravala; koreksi pengguna tetap berlaku |
| Geometri | Semua fitur valid, poligonal, dan tidak kosong |
| Cakupan Cakravala | Gabungannya sama dengan domain yang disetujui dalam toleransi hitungan |
| Tumpang tindih Cakravala | Jumlah area fitur sama dengan area gabungannya dalam toleransi |
| Cakupan ADM2 | Gabungan ADM2 sama dengan batas Cakravala induknya |
| Warna/nama | Seluruh Cakravala punya warna SVG dan nama tampilan benar |
| Paket | Seluruh referensi indeks dapat dibuka dan hitungannya sesuai |
| JavaScript | Pemeriksaan sintaks berhasil |
| Browser | Klik peta/daftar, pencarian, kembali, pilihan cepat, dan pemuatan gagal berjalan |
| Visual | Periksa zoom jauh/dekat, pulau kecil, batas negara lama, dan batas antar-Cakravala |
| Deployment | Pastikan halaman publik benar-benar memuat commit dan data baru |

Daerah uji visual Maharaja: Sumatra, Jawa, Kalimantan–Malaysia, Kepulauan Riau, NTT–NTB–Timor-Leste, Andaman, Bangladesh–India–Myanmar, Myanmar–Laos–Vietnam, Filipina, Taiwan, dan Ryukyu.

Jika browser pengujian tidak dapat dijalankan, catat keterbatasan itu secara eksplisit. Jangan menyatakan pemeriksaan visual sudah lulus hanya dari jumlah fitur atau validitas geometri.

## 12. Tahap J — Commit, deployment, dan pemulihan

1. Commit inventaris cakupan dan koreksi yang sudah dapat ditinjau.
2. Commit paket geometri dan indeks yang lengkap.
3. Commit antarmuka dengan seluruh referensi data tersedia. Jangan mengaktifkan manifest parsial di situs publik.
4. Push progres ke GitHub agar pekerjaan tidak hilang jika sesi terputus.
5. Saat memakai konektor GitHub, unggah blob terlebih dahulu, bentuk tree/commit lengkap, lalu ubah `main` dengan pemeriksaan SHA kepala yang diharapkan.
6. Tunggu deployment Cloudflare dan periksa data yang disajikan situs, bukan hanya cabang lokal.
7. Jika tampilan masih lama, bandingkan versi atau hash berkas publik dengan hasil baru sebelum membuat perbaikan geometri tambahan.
8. Untuk rollback, buat commit pemulihan ke isi versi terakhir yang disetujui. Penulisan ulang riwayat memerlukan keputusan khusus.

## 13. Membangun ulang Maharaja dengan skrip yang ada

Jalankan dari akar repo setelah masukan sumber tersedia dan versinya diperiksa:

```bash
python scripts/build-maharaja.py
python scripts/build-maharaja-adm2-list.py
python scripts/build-cakravala.py
node --input-type=module --check < src/atlas.js
```

**Perhatian:** `build-maharaja.py` masih mengandung aturan historis berupa ambang irisan 45%, kelompok ADM1 tertentu, dan pembersihan lubang kecil. `build-maharaja-adm2-list.py` masih memakai pencocokan nama/geometri serta kandidat terdekat. Jalankan ulang hanya dengan membandingkan perubahan inventaris dan bentuk terhadap versi yang telah disetujui. Skrip tersebut belum merupakan pembangun generik bagi semua Mandala.

Baseline Maharaja setelah koreksi dan perapihan:

| Atribut | Nilai |
|---|---:|
| Cakravala | 29 |
| ADM2 unik | 4.474 |
| Nama ditemukan dalam SVG | 3.793 |
| Cocok geometri dengan beda nama/level | 647 |
| Tanpa irisan, penempatan dikonfirmasi pengguna | 34 |

Untuk Mandala berikutnya, buat inventaris dan konfigurasi miliknya sendiri, lalu ulangi tahap A–J. Setiap tahap menghasilkan berkas yang bisa ditinjau; implementasi baru dianggap selesai setelah data, interaksi, dan tampilan deployment diperiksa.
