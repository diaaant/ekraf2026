<script>
  export let variant = "ulos";
  export let className = "";

  const PALETTES = {
    ulos: { base: "#8f1d21", line: "#2a1d15", accent: "#f3d98b" },
    ukiran: { base: "#4a382c", line: "#c8962e", accent: "#f3ead7" },
    batik: { base: "#1f3a5f", line: "#f3ead7", accent: "#c8962e" },
  };

  $: palette = PALETTES[variant];
</script>

<svg
  class={className}
  viewBox="0 0 200 200"
  preserveAspectRatio="xMidYMid slice"
  role="img"
  aria-label={`Ilustrasi motif ${variant}`}
  data-testid={`pattern-${variant}`}
>
  <rect width="200" height="200" fill={palette.base} />
  {#if variant === "ulos"}
    {#each [0, 1, 2, 3, 4] as band}
      <rect y={band * 40 + 6} width="200" height="6" fill={palette.line} />
      <rect y={band * 40 + 30} width="200" height="3" fill={palette.accent} />
      {#each [0, 1, 2, 3, 4] as col}
        <path
          d={`M${col * 40 + 20} ${band * 40 + 13} l9 8 -9 8 -9 -8z`}
          fill={palette.accent}
          opacity="0.9"
        />
      {/each}
    {/each}
  {:else if variant === "ukiran"}
    {#each [0, 1, 2] as row}
      {#each [0, 1, 2] as col}
        <g transform={`translate(${col * 66 + 34} ${row * 66 + 34})`} fill="none" stroke={palette.line} stroke-width="2.5">
          <circle r="24" />
          <circle r="14" stroke={palette.accent} />
          <path d="M0 -24 C10 -10 10 10 0 24 C-10 10 -10 -10 0 -24z" />
          <path d="M-24 0 C-10 10 10 10 24 0 C10 -10 -10 -10 -24 0z" />
        </g>
      {/each}
    {/each}
  {:else}
    {#each [0, 1, 2, 3] as row}
      {#each [0, 1, 2, 3] as col}
        <g transform={`translate(${col * 50 + 25} ${row * 50 + 25})`} fill="none" stroke={palette.line} stroke-width="1.8">
          <ellipse cx="0" cy="-10" rx="7" ry="12" />
          <ellipse cx="0" cy="10" rx="7" ry="12" />
          <ellipse cx="-10" cy="0" rx="12" ry="7" />
          <ellipse cx="10" cy="0" rx="12" ry="7" />
          <circle r="2.5" fill={palette.accent} stroke="none" />
        </g>
      {/each}
    {/each}
  {/if}
</svg>
