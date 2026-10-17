<script>
  import { BadgeCheck, MapPin, ScanLine } from "lucide-svelte";
  import PatternArt from "../../common/components/PatternArt.svelte";

  export let product;
  export let onVerify;
</script>

<article
  data-testid={`product-card-${product.code}`}
  class="group flex flex-col overflow-hidden rounded-3xl border border-ink-300/60 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-gold-700/15"
>
  <div class="relative h-44 overflow-hidden">
    <PatternArt
      variant={product.pattern}
      className="h-full w-full transition duration-500 group-hover:scale-105"
    />
    <span
      class="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-leaf-100 px-2.5 py-1 text-xs font-bold text-leaf-600 shadow"
    >
      <BadgeCheck size={14} /> Verified
    </span>
  </div>

  <div class="flex flex-1 flex-col gap-2 p-5">
    <p class="text-[11px] font-bold uppercase tracking-widest text-gold-700">
      {product.subsector} - {product.craft}
    </p>
    <h3 class="font-display text-lg font-bold leading-snug text-ink-900">{product.productName}</h3>
    <p class="text-sm text-ink-700">oleh {product.artisan}</p>
    <p class="flex items-center gap-1.5 text-xs text-ink-500">
      <MapPin size={14} /> {product.origin}, {product.province}
    </p>

    <button
      type="button"
      data-testid={`verify-${product.code}`}
      on:click={() => onVerify(product.code)}
      class="mt-auto inline-flex items-center justify-center gap-2 rounded-xl bg-ink-900 px-4 py-2.5 text-sm font-semibold text-gold-300 transition hover:bg-ink-700"
    >
      <ScanLine size={16} /> Cek Keaslian
    </button>
  </div>
</article>
