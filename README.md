# EkrafChain - Satu Pindai, Sejuta Keaslian.

Platform web Digital Passport untuk produk ekonomi kreatif Indonesia
(Svelte 5 + Vite + Tailwind CSS v4, JavaScript, struktur fitur ala praktikum PABWE).

## Menjalankan

```bash
bun install
bun run dev               # http://localhost:3010
bun run test:coverage     # target coverage 100%
bun run build && bun run preview
```

## Halaman

| Rute          | Isi                                                                 |
| ------------- | ------------------------------------------------------------------- |
| `/`           | Hero, statistik, masalah, solusi, peta sebaran 38 provinsi          |
| `/verifikasi` | **Cek Keaslian**: input kode / hasil pindai QR -> sertifikat emas    |
| `/katalog`    | Grid produk terverifikasi dengan filter subsektor dan pencarian     |
| `/dasbor`     | Mockup dasbor kreator: daftar produk -> kode unik + QR Code unduhan |

QR Code mengarah ke `/verifikasi?kode=KRAF-...`, sehingga memindainya langsung membuka sertifikat.

## Data demo

`src/data/seedProducts.js` berisi 3 produk mockup:
`KRAF-SUMUT-001`, `KRAF-BALI-002`, `KRAF-JOGJA-003`.
Angka statistik di `src/data/content.js` adalah angka ilustrasi pitch; sesuaikan sebelum presentasi.
`src/features/products/api/productApi.js` adalah "backend" tiruan di memori; bentuk fungsinya
meniru REST API sehingga mudah diganti `fetch` ke server sungguhan.

## Struktur

```
src/
├── App.svelte, main.js, router.js, index.css
├── data/                 provinsi, produk mockup, konten landing
├── helpers/              toolsHelper
├── hooks/                useQrCode
└── features/
    ├── common/           layouts, navbar, footer, motif, 404
    ├── home/             HomePage, IndonesiaMap
    ├── verification/     VerifyPage, CertificateCard (sertifikat emas)
    ├── catalog/          CatalogPage, ProductCard
    ├── creator/          CreatorDashboardPage
    └── products/         api + states (productsStore)
```
