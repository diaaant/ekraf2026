<script>
  import { onMount } from "svelte";
  import {
    ScanLine,
    ArrowRight,
    BadgeCheck,
    TriangleAlert,
    Scale,
    ShoppingBag,
    Database,
    Store,
    Landmark,
    User,
  } from "lucide-svelte";
  import IndonesiaMap from "../components/IndonesiaMap.svelte";
  import PatternArt from "../../common/components/PatternArt.svelte";
  import { productsStore } from "../../products/states/productsStore";
  import { navigate } from "../../../router.js";
  import { stats, problems, personas, siteInfo } from "../../../data/content";
  import { seedProducts } from "../../../data/seedProducts";
  import { normalizeCode, buildVerifyPath } from "../../../helpers/toolsHelper";

  const problemIcons = [TriangleAlert, Scale, ShoppingBag, Database];
  const personaIcons = [Store, User, Landmark];
  const showcase = seedProducts[0];

  let code = "";

  $: activeCodes = [...new Set($productsStore.products.map((product) => product.provinceCode))];

  onMount(() => {
    productsStore.asyncSetProducts();
  });

  function handleSubmit() {
    navigate(code.trim() ? buildVerifyPath(normalizeCode(code)) : "/verifikasi");
  }
</script>

<div>
  <!-- Hero -->
  <section class="relative overflow-hidden">
    <div class="pointer-events-none absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-gold-300/30 blur-3xl"></div>
    <div class="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1.15fr_0.85fr]">
      <div class="relative">
        <span
          class="inline-flex items-center gap-2 rounded-full bg-gold-100 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-gold-700"
        >
          <BadgeCheck size={14} /> Digital Passport Ekonomi Kreatif
        </span>
        <h1
          data-testid="hero-title"
          class="mt-6 font-display text-5xl font-extrabold leading-[1.05] text-ink-900 sm:text-6xl"
        >
          Satu Pindai,<br /><span class="text-gold-500">Sejuta Keaslian.</span>
        </h1>
        <p class="mt-6 max-w-xl text-lg leading-relaxed text-ink-700">
          EkrafChain memberi setiap karya perajin Indonesia sertifikat digital yang bisa dicek siapa saja,
          kapan saja. Lindungi karya, bangun kepercayaan, dan buka akses pasar.
        </p>

        <form
          on:submit|preventDefault={handleSubmit}
          class="mt-8 flex max-w-xl flex-col gap-3 rounded-3xl bg-white p-3 shadow-xl shadow-gold-700/10 ring-1 ring-gold-500/30 sm:flex-row"
        >
          <label for="hero-code-input" class="sr-only">Kode unik produk</label>
          <input
            id="hero-code-input"
            type="text"
            data-testid="hero-code-input"
            bind:value={code}
            autocomplete="off"
            placeholder="Masukkan kode, mis. KRAF-SUMUT-001"
            class="min-w-0 flex-1 rounded-2xl bg-ivory px-5 py-3.5 font-mono text-sm tracking-wider placeholder:text-ink-300 focus:outline-none"
          />
          <button
            type="submit"
            data-testid="hero-submit"
            class="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-gold-500 to-gold-700 px-6 py-3.5 font-bold text-white shadow-lg shadow-gold-700/30 transition hover:brightness-110"
          >
            <ScanLine size={18} /> Cek Keaslian
          </button>
        </form>

        <div class="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold">
          <button
            type="button"
            data-testid="hero-catalog"
            on:click={() => navigate("/katalog")}
            class="inline-flex items-center gap-1.5 text-ink-900 underline underline-offset-4 hover:text-gold-700"
          >
            Jelajahi katalog <ArrowRight size={16} />
          </button>
          <button
            type="button"
            data-testid="hero-creator"
            on:click={() => navigate("/dasbor")}
            class="inline-flex items-center gap-1.5 text-ink-900 underline underline-offset-4 hover:text-gold-700"
          >
            Saya perajin <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <!-- Pratinjau sertifikat -->
      <div class="relative mx-auto w-full max-w-sm" aria-hidden="true">
        <div class="rotate-3 rounded-[2rem] bg-gradient-to-br from-gold-300 via-gold-500 to-gold-700 p-[3px] shadow-2xl shadow-gold-700/30">
          <div class="rounded-[calc(2rem-3px)] bg-gradient-to-b from-gold-100 to-ivory p-6">
            <div class="flex items-center justify-between">
              <p class="text-[10px] font-bold uppercase tracking-[0.25em] text-gold-700">Digital Passport</p>
              <BadgeCheck class="text-leaf-600" size={22} />
            </div>
            <div class="mt-4 h-32 overflow-hidden rounded-2xl ring-1 ring-ink-300">
              <PatternArt variant={showcase.pattern} className="h-full w-full" />
            </div>
            <p class="mt-4 font-display text-xl font-bold text-ink-900">{showcase.productName}</p>
            <p class="text-sm text-ink-700">{showcase.artisan}</p>
            <p class="mt-1 text-xs text-ink-500">{showcase.origin}</p>
            <p class="mt-4 inline-block rounded-full bg-ink-900 px-3 py-1 font-mono text-[11px] font-semibold tracking-wider text-gold-300">
              {showcase.code}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Statistik -->
  <section class="mx-auto max-w-6xl px-4 sm:px-6">
    <dl class="grid grid-cols-2 gap-4 rounded-3xl bg-ink-900 p-6 sm:p-8 lg:grid-cols-4">
      {#each stats as stat (stat.label)}
        <div data-testid="stat-item" class="text-center">
          <dt class="font-display text-3xl font-extrabold text-gold-300 sm:text-4xl">{stat.value}</dt>
          <dd class="mt-1 text-xs font-semibold uppercase tracking-wider text-ink-300">{stat.label}</dd>
        </div>
      {/each}
    </dl>
    <p class="mt-2 text-center text-xs text-ink-500">Angka ilustrasi untuk keperluan pitch demo.</p>
  </section>

  <!-- Masalah -->
  <section class="mx-auto max-w-6xl px-4 py-20 sm:px-6">
    <p class="text-xs font-bold uppercase tracking-[0.25em] text-gold-700">Masalah yang kami selesaikan</p>
    <h2 class="mt-3 max-w-2xl font-display text-3xl font-extrabold leading-tight text-ink-900 sm:text-4xl">
      Karya asli kalah oleh tiruan, perajin yang menanggung rugi.
    </h2>
    <div class="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {#each problems as problem, index (problem.title)}
        <article data-testid="problem-item" class="rounded-3xl bg-white p-6 ring-1 ring-ink-300/60">
          <div class="flex h-11 w-11 items-center justify-center rounded-2xl bg-ulos-700/10 text-ulos-700">
            <svelte:component this={problemIcons[index]} size={22} />
          </div>
          <h3 class="mt-4 font-display text-lg font-bold text-ink-900">{problem.title}</h3>
          <p class="mt-2 text-sm leading-relaxed text-ink-700">{problem.text}</p>
        </article>
      {/each}
    </div>
  </section>

  <!-- Solusi -->
  <section class="bg-sand py-20">
    <div class="mx-auto max-w-6xl px-4 sm:px-6">
      <p class="text-xs font-bold uppercase tracking-[0.25em] text-gold-700">Solusi</p>
      <h2 class="mt-3 max-w-2xl font-display text-3xl font-extrabold leading-tight text-ink-900 sm:text-4xl">
        Satu sertifikat digital untuk perajin, pembeli, dan pemerintah.
      </h2>
      <div class="mt-10 grid gap-5 md:grid-cols-3">
        {#each personas as persona, index (persona.title)}
          <article data-testid="persona-item" class="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-gold-500/25">
            <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold-100 text-gold-700">
              <svelte:component this={personaIcons[index]} size={24} />
            </div>
            <h3 class="mt-5 font-display text-xl font-bold text-ink-900">{persona.title}</h3>
            <p class="mt-2 text-sm leading-relaxed text-ink-700">{persona.text}</p>
          </article>
        {/each}
      </div>
    </div>
  </section>

  <!-- Peta -->
  <section class="mx-auto max-w-6xl px-4 py-20 sm:px-6">
    <p class="text-xs font-bold uppercase tracking-[0.25em] text-gold-700">Sebaran Produk</p>
    <h2 class="mt-3 max-w-2xl font-display text-3xl font-extrabold leading-tight text-ink-900 sm:text-4xl">
      Dari Samosir hingga Kotagede, terpantau di satu peta.
    </h2>
    <div class="mt-8 rounded-3xl bg-white p-4 ring-1 ring-ink-300/60 sm:p-8">
      <IndonesiaMap {activeCodes} />
    </div>
  </section>

  <!-- CTA -->
  <section class="mx-auto max-w-6xl px-4 sm:px-6">
    <div
      class="rounded-[2rem] bg-gradient-to-br from-gold-500 to-gold-700 p-8 text-center shadow-xl shadow-gold-700/30 sm:p-14"
    >
      <h2 class="mx-auto max-w-2xl font-display text-3xl font-extrabold leading-tight text-white sm:text-4xl">
        Bersama {siteInfo.ministryName}, kita digitalkan 1 juta produk ekraf.
      </h2>
      <button
        type="button"
        data-testid="cta-verify"
        on:click={() => navigate("/verifikasi")}
        class="mt-8 inline-flex items-center gap-2 rounded-2xl bg-ink-900 px-7 py-4 font-bold text-gold-300 transition hover:bg-ink-700"
      >
        Coba Cek Keaslian <ArrowRight size={18} />
      </button>
    </div>
  </section>
</div>
