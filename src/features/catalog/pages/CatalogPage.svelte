<script>
  import { onMount } from "svelte";
  import { Search, PackageOpen } from "lucide-svelte";
  import ProductCard from "../components/ProductCard.svelte";
  import { productsStore } from "../../products/states/productsStore";
  import { navigate } from "../../../router.js";
  import { subsectors } from "../../../data/provinces";
  import { buildVerifyPath } from "../../../helpers/toolsHelper";

  const filters = ["Semua", ...subsectors];

  let activeFilter = "Semua";
  let searchQuery = "";

  $: products = $productsStore.products;

  onMount(() => {
    productsStore.asyncSetProducts();
  });

  $: filteredProducts = products.filter((product) => {
    const matchesFilter = activeFilter === "Semua" || product.subsector === activeFilter;
    const haystack = [product.productName, product.artisan, product.origin, product.province, product.craft]
      .join(" ")
      .toLowerCase();
    return matchesFilter && haystack.includes(searchQuery.trim().toLowerCase());
  });

  function handleVerify(code) {
    navigate(buildVerifyPath(code));
  }
</script>

<section class="mx-auto max-w-6xl px-4 sm:px-6 py-14 sm:py-20">
  <div class="max-w-2xl">
    <p class="text-xs font-bold uppercase tracking-[0.25em] text-gold-700">Katalog Terverifikasi</p>
    <h1 class="mt-3 font-display text-4xl sm:text-5xl font-extrabold leading-tight text-ink-900">
      Karya unggulan dari berbagai penjuru Nusantara
    </h1>
    <p class="mt-4 text-ink-700">
      Setiap produk di sini memiliki Digital Passport. Pilih satu produk untuk melihat sertifikat emasnya.
    </p>
  </div>

  <div class="mt-9 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
    <div class="flex flex-wrap gap-2" role="group" aria-label="Filter subsektor">
      {#each filters as filter}
        <button
          type="button"
          data-testid={`filter-${filter}`}
          on:click={() => (activeFilter = filter)}
          class="rounded-full px-4 py-2 text-sm font-semibold transition {activeFilter === filter
            ? 'bg-ink-900 text-gold-300'
            : 'bg-white text-ink-700 ring-1 ring-ink-300 hover:bg-gold-100'}"
        >
          {filter}
        </button>
      {/each}
    </div>

    <div class="relative w-full md:max-w-xs">
      <Search size={18} class="absolute left-4 top-1/2 -translate-y-1/2 text-ink-500" />
      <input
        type="text"
        data-testid="catalog-search-input"
        bind:value={searchQuery}
        placeholder="Cari produk, perajin, atau daerah..."
        class="w-full rounded-full bg-white py-2.5 pl-11 pr-4 text-sm ring-1 ring-ink-300 focus:outline-none focus:ring-2 focus:ring-gold-500"
      />
    </div>
  </div>

  {#if filteredProducts.length === 0}
    <div data-testid="catalog-empty" class="mt-16 flex flex-col items-center gap-3 text-center text-ink-500">
      <PackageOpen size={44} />
      <p class="font-semibold">Belum ada produk yang cocok dengan pencarian Anda.</p>
    </div>
  {:else}
    <div class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {#each filteredProducts as product (product.code)}
        <ProductCard {product} onVerify={handleVerify} />
      {/each}
    </div>
  {/if}
</section>
