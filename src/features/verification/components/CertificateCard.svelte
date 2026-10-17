<script>
  import { ShieldCheck, MapPin, User, Layers, BadgeCheck } from "lucide-svelte";
  import PatternArt from "../../common/components/PatternArt.svelte";
  import { formatDate } from "../../../helpers/toolsHelper";

  export let product;

  $: isProtected = product.hakiStatus === "protected";
  $: statusText = isProtected
    ? "100% Asli & Terlindungi HAKI"
    : "Asli Terverifikasi - HAKI Dalam Proses";
</script>

<article
  data-testid="certificate-card"
  class="cert-reveal cert-shimmer relative overflow-hidden rounded-[2rem] p-[3px] shadow-2xl shadow-gold-700/30 bg-gradient-to-br from-gold-300 via-gold-500 to-gold-700"
  style="perspective: 1000px"
>
  <div class="relative rounded-[calc(2rem-3px)] bg-gradient-to-b from-gold-100 via-ivory to-gold-100 p-6 sm:p-9">
    <div class="absolute inset-3 rounded-[1.6rem] border border-gold-500/40 pointer-events-none"></div>

    <header class="relative flex items-start justify-between gap-4">
      <div>
        <p class="text-[11px] font-bold uppercase tracking-[0.25em] text-gold-700">
          EkrafChain Digital Passport
        </p>
        <h3 class="mt-2 font-display text-2xl sm:text-3xl font-bold text-ink-900 leading-tight">
          {product.productName}
        </h3>
        <p
          data-testid="certificate-code"
          class="mt-2 inline-block rounded-full bg-ink-900 px-3 py-1 font-mono text-xs font-semibold tracking-wider text-gold-300"
        >
          {product.code}
        </p>
      </div>

      <div
        class="seal-stamp shrink-0 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-gold-300 via-gold-500 to-gold-700 text-ink-900 shadow-lg ring-4 ring-gold-100"
        aria-hidden="true"
      >
        <BadgeCheck size={40} strokeWidth={2} />
      </div>
    </header>

    <div class="relative mt-7 grid gap-4 sm:grid-cols-2">
      <div class="flex gap-3">
        <User class="mt-0.5 shrink-0 text-gold-700" size={20} />
        <div>
          <p class="text-xs font-semibold uppercase tracking-wide text-ink-500">Nama Perajin</p>
          <p data-testid="certificate-artisan" class="font-semibold text-ink-900">{product.artisan}</p>
        </div>
      </div>

      <div class="flex gap-3">
        <MapPin class="mt-0.5 shrink-0 text-gold-700" size={20} />
        <div>
          <p class="text-xs font-semibold uppercase tracking-wide text-ink-500">Asal Daerah</p>
          <p data-testid="certificate-origin" class="font-semibold text-ink-900">
            {product.origin} - {product.province}
          </p>
        </div>
      </div>

      <div class="flex gap-3">
        <Layers class="mt-0.5 shrink-0 text-gold-700" size={20} />
        <div>
          <p class="text-xs font-semibold uppercase tracking-wide text-ink-500">Subsektor</p>
          <p data-testid="certificate-subsector" class="font-semibold text-ink-900">
            {product.subsector} - {product.craft}
          </p>
        </div>
      </div>

      <div class="flex gap-3">
        <ShieldCheck class="mt-0.5 shrink-0 {isProtected ? 'text-leaf-600' : 'text-gold-700'}" size={20} />
        <div>
          <p class="text-xs font-semibold uppercase tracking-wide text-ink-500">Status</p>
          <p
            data-testid="certificate-status"
            class="font-bold {isProtected ? 'text-leaf-600' : 'text-gold-700'}"
          >
            {statusText}
          </p>
        </div>
      </div>
    </div>

    <div class="relative mt-7 flex gap-4 rounded-2xl bg-white/60 p-4 ring-1 ring-gold-500/25">
      <div class="h-20 w-20 shrink-0 overflow-hidden rounded-xl ring-1 ring-ink-300">
        <PatternArt variant={product.pattern} className="h-full w-full" />
      </div>
      <div class="min-w-0">
        <p class="text-xs font-semibold uppercase tracking-wide text-ink-500">Kisah di Balik Karya</p>
        <p data-testid="certificate-story" class="mt-1 text-sm leading-relaxed text-ink-700">
          {product.story}
        </p>
      </div>
    </div>

    <footer class="relative mt-6 flex flex-wrap items-center justify-between gap-2 text-xs text-ink-500">
      <span>Terdaftar {formatDate(product.registeredAt)}</span>
      <span class="font-semibold text-gold-700">Diterbitkan oleh EkrafChain</span>
    </footer>
  </div>
</article>
