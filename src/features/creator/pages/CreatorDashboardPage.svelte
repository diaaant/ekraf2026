<script>
  import { onMount } from "svelte";
  import { QrCode, LoaderCircle, Download, ScanLine, Info, CirclePlus } from "lucide-svelte";
  import { productsStore } from "../../products/states/productsStore";
  import useQrCode from "../../../hooks/useQrCode";
  import { navigate } from "../../../router.js";
  import { provinces, subsectors } from "../../../data/provinces";
  import { steps } from "../../../data/content";
  import { buildVerifyPath } from "../../../helpers/toolsHelper";

  const REQUIRED_FIELDS = ["productName", "artisan", "provinceCode", "origin", "subsector", "craft", "story"];
  const { generate } = useQrCode();

  function emptyForm() {
    return {
      productName: "",
      artisan: "",
      provinceCode: "",
      origin: "",
      subsector: "Kriya",
      craft: "",
      story: "",
    };
  }

  let form = emptyForm();
  let formError = "";
  let qrDataUrl = "";

  $: registered = $productsStore.registered;
  $: isRegistering = $productsStore.isRegistering;
  $: registerError = $productsStore.registerError;
  $: products = $productsStore.products;

  onMount(() => {
    productsStore.asyncSetProducts();
  });

  async function makeQr(product) {
    qrDataUrl = "";
    try {
      qrDataUrl = await generate(`${window.location.origin}${buildVerifyPath(product.code)}`);
    } catch {
      qrDataUrl = "";
    }
  }

  $: if (registered) {
    form = emptyForm();
    makeQr(registered);
  }

  function handleSubmit() {
    if (REQUIRED_FIELDS.some((field) => !form[field].trim())) {
      formError = "Lengkapi semua kolom sebelum menerbitkan Digital Passport.";
      return;
    }

    formError = "";
    productsStore.asyncRegister({ ...form });
  }
</script>

<section class="mx-auto max-w-6xl px-4 sm:px-6 py-14 sm:py-20">
  <div class="max-w-2xl">
    <span
      class="inline-flex items-center gap-2 rounded-full bg-sand px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-ink-700"
    >
      <Info size={14} /> Mockup Dasbor Kreator
    </span>
    <h1 class="mt-4 font-display text-4xl sm:text-5xl font-extrabold leading-tight text-ink-900">
      Dari karya ke Digital Passport dalam hitungan menit
    </h1>
    <p class="mt-4 text-ink-700">
      Simulasi alur perajin: isi data karya, terbitkan kode unik, lalu unduh QR Code untuk ditempel di kemasan.
    </p>
  </div>

  <ol class="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
    {#each steps as step, index}
      <li class="rounded-2xl bg-white p-4 ring-1 ring-ink-300/60">
        <span
          class="flex h-7 w-7 items-center justify-center rounded-full bg-ink-900 text-xs font-bold text-gold-300"
        >
          {index + 1}
        </span>
        <p class="mt-2 font-semibold text-ink-900">{step.title}</p>
        <p class="mt-1 text-xs text-ink-500">{step.text}</p>
      </li>
    {/each}
  </ol>

  <div class="mt-10 grid gap-8 lg:grid-cols-2">
    <form
      on:submit|preventDefault={handleSubmit}
      data-testid="creator-form"
      class="space-y-4 rounded-3xl bg-white p-6 sm:p-8 shadow-xl shadow-gold-700/10 ring-1 ring-gold-500/25"
    >
      <h2 class="font-display text-2xl font-bold text-ink-900">Daftarkan Produk</h2>

      <div>
        <label for="creator-product" class="mb-1.5 block text-sm font-semibold text-ink-700">Nama Produk</label>
        <input
          id="creator-product"
          type="text"
          data-testid="creator-product"
          bind:value={form.productName}
          placeholder="Contoh: Songket Palembang"
          class="w-full rounded-xl bg-ivory px-4 py-3 text-sm ring-1 ring-ink-300 focus:outline-none focus:ring-2 focus:ring-gold-500"
        />
      </div>

      <div>
        <label for="creator-artisan" class="mb-1.5 block text-sm font-semibold text-ink-700">Nama Perajin</label>
        <input
          id="creator-artisan"
          type="text"
          data-testid="creator-artisan"
          bind:value={form.artisan}
          class="w-full rounded-xl bg-ivory px-4 py-3 text-sm ring-1 ring-ink-300 focus:outline-none focus:ring-2 focus:ring-gold-500"
        />
      </div>

      <div class="grid gap-4 sm:grid-cols-2">
        <div>
          <label for="creator-province" class="mb-1.5 block text-sm font-semibold text-ink-700">Provinsi</label>
          <select
            id="creator-province"
            data-testid="creator-province"
            bind:value={form.provinceCode}
            class="w-full rounded-xl bg-ivory px-4 py-3 text-sm ring-1 ring-ink-300 focus:outline-none focus:ring-2 focus:ring-gold-500"
          >
            <option value="">Pilih provinsi</option>
            {#each provinces as province (province.code)}
              <option value={province.code}>{province.name}</option>
            {/each}
          </select>
        </div>
        <div>
          <label for="creator-origin" class="mb-1.5 block text-sm font-semibold text-ink-700">Desa / Kota</label>
          <input
            id="creator-origin"
            type="text"
            data-testid="creator-origin"
            bind:value={form.origin}
            placeholder="Contoh: Ilir Timur, Palembang"
            class="w-full rounded-xl bg-ivory px-4 py-3 text-sm ring-1 ring-ink-300 focus:outline-none focus:ring-2 focus:ring-gold-500"
          />
        </div>
      </div>

      <div class="grid gap-4 sm:grid-cols-2">
        <div>
          <label for="creator-subsector" class="mb-1.5 block text-sm font-semibold text-ink-700">Subsektor</label>
          <select
            id="creator-subsector"
            data-testid="creator-subsector"
            bind:value={form.subsector}
            class="w-full rounded-xl bg-ivory px-4 py-3 text-sm ring-1 ring-ink-300 focus:outline-none focus:ring-2 focus:ring-gold-500"
          >
            {#each subsectors as subsector}
              <option value={subsector}>{subsector}</option>
            {/each}
          </select>
        </div>
        <div>
          <label for="creator-craft" class="mb-1.5 block text-sm font-semibold text-ink-700">Jenis Karya</label>
          <input
            id="creator-craft"
            type="text"
            data-testid="creator-craft"
            bind:value={form.craft}
            placeholder="Contoh: Songket"
            class="w-full rounded-xl bg-ivory px-4 py-3 text-sm ring-1 ring-ink-300 focus:outline-none focus:ring-2 focus:ring-gold-500"
          />
        </div>
      </div>

      <div>
        <label for="creator-story" class="mb-1.5 block text-sm font-semibold text-ink-700">Kisah di Balik Karya</label>
        <textarea
          id="creator-story"
          rows="4"
          data-testid="creator-story"
          bind:value={form.story}
          class="w-full rounded-xl bg-ivory px-4 py-3 text-sm ring-1 ring-ink-300 focus:outline-none focus:ring-2 focus:ring-gold-500"
        ></textarea>
      </div>

      {#if formError}
        <p data-testid="creator-form-error" class="text-sm font-semibold text-ulos-700" role="alert">{formError}</p>
      {/if}
      {#if registerError}
        <p data-testid="creator-register-error" class="text-sm font-semibold text-ulos-700" role="alert">
          {registerError}
        </p>
      {/if}

      <button
        type="submit"
        data-testid="creator-submit"
        disabled={isRegistering}
        class="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-gold-500 to-gold-700 px-6 py-3.5 font-bold text-white shadow-lg shadow-gold-700/30 transition hover:brightness-110 disabled:opacity-60"
      >
        {#if isRegistering}
          <LoaderCircle size={18} class="animate-spin" /> Menerbitkan...
        {:else}
          <CirclePlus size={18} /> Terbitkan Digital Passport
        {/if}
      </button>
    </form>

    <div class="space-y-6">
      <div
        data-testid="passport-panel"
        class="rounded-3xl bg-ink-900 p-6 sm:p-8 text-ivory shadow-xl"
      >
        <h2 class="font-display text-2xl font-bold text-gold-300">Digital Passport</h2>

        {#if registered}
          <div class="mt-5 flex flex-col items-center gap-4 text-center">
            <p data-testid="passport-code" class="rounded-full bg-gold-300 px-4 py-1.5 font-mono text-sm font-bold text-ink-900">
              {registered.code}
            </p>
            <p class="font-semibold">{registered.productName}</p>

            {#if qrDataUrl}
              <img
                src={qrDataUrl}
                alt={`QR Code untuk ${registered.code}`}
                data-testid="passport-qr"
                class="h-52 w-52 rounded-2xl bg-white p-2"
              />
              <a
                href={qrDataUrl}
                download={`${registered.code}.png`}
                data-testid="passport-download"
                class="inline-flex items-center gap-2 rounded-xl bg-gold-300 px-4 py-2.5 text-sm font-bold text-ink-900 transition hover:bg-gold-100"
              >
                <Download size={16} /> Unduh QR Code
              </a>
            {:else}
              <div data-testid="passport-qr-loading" class="flex h-52 w-52 items-center justify-center rounded-2xl bg-white/10">
                <LoaderCircle size={32} class="animate-spin text-gold-300" />
              </div>
            {/if}

            <button
              type="button"
              data-testid="passport-verify"
              on:click={() => navigate(buildVerifyPath(registered.code))}
              class="inline-flex items-center gap-2 text-sm font-semibold text-gold-300 underline underline-offset-4"
            >
              <ScanLine size={16} /> Lihat sertifikat digitalnya
            </button>
          </div>
        {:else}
          <div data-testid="passport-empty" class="mt-5 flex flex-col items-center gap-3 py-10 text-center text-ink-300">
            <QrCode size={64} strokeWidth={1.4} />
            <p class="max-w-xs text-sm">
              QR Code dan kode unik produk Anda akan muncul di sini setelah Digital Passport diterbitkan.
            </p>
          </div>
        {/if}
      </div>

      <div class="rounded-3xl bg-white p-6 ring-1 ring-ink-300/60">
        <h2 class="font-display text-xl font-bold text-ink-900">Produk Terdaftar ({products.length})</h2>
        <ul class="mt-4 divide-y divide-ink-300/40" data-testid="creator-products">
          {#each products as product (product.code)}
            <li class="flex items-center justify-between gap-3 py-3 text-sm">
              <div class="min-w-0">
                <p class="truncate font-semibold text-ink-900">{product.productName}</p>
                <p class="truncate text-xs text-ink-500">{product.artisan} - {product.province}</p>
              </div>
              <span class="shrink-0 rounded-full bg-gold-100 px-2.5 py-1 font-mono text-[11px] font-bold text-gold-700">
                {product.code}
              </span>
            </li>
          {/each}
        </ul>
      </div>
    </div>
  </div>
</section>
