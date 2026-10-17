<script>
  import { provinces } from "../../../data/provinces";
  import { projectToMap } from "../../../helpers/toolsHelper";

  // Kode provinsi yang sudah memiliki produk terverifikasi.
  export let activeCodes = [];

  $: points = provinces.map((province) => ({
    ...province,
    ...projectToMap(province.lon, province.lat),
    active: activeCodes.includes(province.code),
  }));
</script>

<figure class="relative">
  <svg
    viewBox="-20 -20 1000 400"
    class="w-full h-auto"
    role="img"
    aria-label="Peta titik sebaran produk ekraf di 38 provinsi Indonesia"
    data-testid="indonesia-map"
  >
    <defs>
      <radialGradient id="glow" cx="50%" cy="50%" r="50%">
        <stop offset="0" stop-color="#f3d98b" stop-opacity="0.9" />
        <stop offset="1" stop-color="#f3d98b" stop-opacity="0" />
      </radialGradient>
    </defs>

    {#each [0, 1, 2, 3, 4, 5, 6, 7, 8] as line}
      <line x1="0" x2="960" y1={line * 45} y2={line * 45} stroke="#cdbfae" stroke-opacity="0.35" stroke-dasharray="2 8" />
    {/each}

    {#each points as point (point.code)}
      {#if point.active}
        <g data-testid={`map-active-${point.code}`}>
          <circle class="pin-pulse" cx={point.x} cy={point.y} r="10" fill="url(#glow)" />
          <circle cx={point.x} cy={point.y} r="7" fill="#c8962e" stroke="#2a1d15" stroke-width="2" />
          <title>{point.name} - ada produk terverifikasi</title>
        </g>
      {:else}
        <circle cx={point.x} cy={point.y} r="4" fill="#cdbfae" data-testid={`map-dot-${point.code}`}>
          <title>{point.name}</title>
        </circle>
      {/if}
    {/each}
  </svg>
  <figcaption class="mt-2 text-xs text-ink-500">
    Peta titik ilustrasi: setiap titik mewakili satu provinsi, titik emas berarti sudah ada produk terverifikasi.
  </figcaption>
</figure>
