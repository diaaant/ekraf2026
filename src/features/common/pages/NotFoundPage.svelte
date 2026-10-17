<script>
  import { SearchX, ArrowLeft, House } from "lucide-svelte";
  import { navigate } from "../../../router.js";
</script>

<section class="mx-auto flex max-w-md flex-col items-center gap-6 px-4 py-24 text-center">
  <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-gold-100 text-gold-700">
    <SearchX size={34} />
  </div>

  <div class="space-y-2">
    <h1 class="font-display text-5xl font-extrabold text-ink-900">404</h1>
    <h2 class="text-xl font-bold text-ink-900">Halaman Tidak Ditemukan</h2>
    <p class="text-sm leading-relaxed text-ink-700">
      Halaman yang Anda cari tidak ada atau sudah dipindahkan.
    </p>
  </div>

  <div class="flex flex-col gap-3 sm:flex-row">
    <button
      type="button"
      data-testid="back-button"
      on:click={() => window.history.back()}
      class="inline-flex items-center justify-center gap-2 rounded-xl border border-ink-300 px-5 py-2.5 text-sm font-semibold text-ink-700 hover:bg-gold-100"
    >
      <ArrowLeft size={16} /> Kembali
    </button>
    <button
      type="button"
      data-testid="home-button"
      on:click={() => navigate("/")}
      class="inline-flex items-center justify-center gap-2 rounded-xl bg-ink-900 px-5 py-2.5 text-sm font-semibold text-gold-300 hover:bg-ink-700"
    >
      <House size={16} /> Beranda
    </button>
  </div>
</section>
