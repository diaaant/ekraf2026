<script>
  import { onDestroy } from "svelte";
  import { ScanLine, Search, LoaderCircle, ShieldAlert, TriangleAlert } from "lucide-svelte";
  import CertificateCard from "../components/CertificateCard.svelte";
  import { productsStore } from "../../products/states/productsStore";
  import { currentSearch } from "../../../router.js";
  import { seedProducts } from "../../../data/seedProducts";
  import {
    normalizeCode,
    buildVerifyPath,
    getCodeFromSearch,
  } from "../../../helpers/toolsHelper";

  const sampleCodes = seedProducts.map((product) => product.code);

  let code = "";
  let inputError = "";

  $: verification = $productsStore.verification;

  // Kode dari URL (hasil pindai QR atau klik dari katalog) langsung diverifikasi.
  $: urlCode = getCodeFromSearch($currentSearch);
  $: if (urlCode) {
    code = urlCode;
    runVerify(urlCode);
  }

  function runVerify(value) {
    inputError = "";
    return productsStore.asyncVerify(normalizeCode(value));
  }

  function handleSubmit() {
    if (!code.trim()) {
      inputError = "Masukkan kode unik produk terlebih dahulu.";
      return;
    }

    window.history.replaceState({}, "", buildVerifyPath(normalizeCode(code)));
    runVerify(code);
  }

  function handleSample(sample) {
    code = sample;
    handleSubmit();
  }

  onDestroy(() => {
    productsStore.resetVerification();
  });
</script>

<section class="mx-auto max-w-3xl px-4 sm:px-6 py-14 sm:py-20">
  <div class="text-center">
    <span
      class="inline-flex items-center gap-2 rounded-full bg-gold-100 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-gold-700"
    >
      <ScanLine size={14} /> Cek Keaslian
    </span>
    <h1 class="mt-5 font-display text-4xl sm:text-5xl font-extrabold leading-tight text-ink-900">
      Pastikan karya yang Anda beli <span class="text-gold-500">benar-benar asli.</span>
    </h1>
    <p class="mt-4 text-ink-700">
      Ketik kode unik pada kemasan, atau pindai QR Code produk untuk membuka sertifikat digitalnya.
    </p>
  </div>

  <form on:submit|preventDefault={handleSubmit} class="mt-9">
    <div
      class="flex flex-col sm:flex-row gap-3 rounded-3xl bg-white p-3 shadow-xl shadow-gold-700/10 ring-1 ring-gold-500/30"
    >
      <label for="verify-code-input" class="sr-only">Kode unik produk</label>
      <input
        id="verify-code-input"
        type="text"
        data-testid="verify-code-input"
        bind:value={code}
        autocomplete="off"
        placeholder="Contoh: KRAF-SUMUT-001"
        class="min-w-0 flex-1 rounded-2xl bg-ivory px-5 py-4 font-mono text-base tracking-wider text-ink-900 placeholder:text-ink-300 focus:outline-none"
      />
      <button
        type="submit"
        data-testid="verify-submit-btn"
        class="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-gold-500 to-gold-700 px-7 py-4 font-bold text-white shadow-lg shadow-gold-700/30 transition hover:brightness-110"
      >
        <Search size={18} /> Verifikasi
      </button>
    </div>

    {#if inputError}
      <p data-testid="verify-input-error" class="mt-3 text-center text-sm font-semibold text-ulos-700" role="alert">
        {inputError}
      </p>
    {/if}

    <div class="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
      <span class="text-ink-500">Coba kode contoh:</span>
      {#each sampleCodes as sample}
        <button
          type="button"
          data-testid={`sample-${sample}`}
          on:click={() => handleSample(sample)}
          class="rounded-full border border-gold-500/50 bg-white px-3 py-1 font-mono font-semibold text-gold-700 transition hover:bg-gold-100"
        >
          {sample}
        </button>
      {/each}
    </div>
  </form>

  <div class="mt-12" aria-live="polite">
    {#if verification.status === "loading"}
      <div data-testid="verify-loading" class="flex flex-col items-center gap-3 py-12 text-ink-700">
        <LoaderCircle size={40} class="animate-spin text-gold-500" />
        <p class="font-semibold">Memeriksa keaslian produk...</p>
      </div>
    {:else if verification.status === "found"}
      <CertificateCard product={verification.product} />
    {:else if verification.status === "notfound"}
      <div
        data-testid="verify-notfound"
        class="rounded-3xl border border-ulos-700/30 bg-white p-8 text-center shadow-lg"
      >
        <ShieldAlert class="mx-auto text-ulos-700" size={44} />
        <h2 class="mt-3 font-display text-2xl font-bold text-ink-900">Kode tidak terdaftar</h2>
        <p class="mt-2 text-sm text-ink-700">
          Kode <span class="font-mono font-bold">{verification.code}</span> tidak ditemukan di
          EkrafChain. Produk ini belum terverifikasi dan berpotensi bukan karya asli. Periksa kembali
          penulisan kode, atau hubungi penjual.
        </p>
      </div>
    {:else if verification.status === "error"}
      <div
        data-testid="verify-error"
        class="rounded-3xl border border-gold-500/40 bg-white p-8 text-center shadow-lg"
      >
        <TriangleAlert class="mx-auto text-gold-700" size={44} />
        <h2 class="mt-3 font-display text-2xl font-bold text-ink-900">Verifikasi gagal</h2>
        <p class="mt-2 text-sm text-ink-700">Terjadi gangguan saat memeriksa kode. Silakan coba lagi.</p>
      </div>
    {/if}
  </div>
</section>
