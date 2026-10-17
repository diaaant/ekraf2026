<script>
  import { Menu, X } from "lucide-svelte";
  import { currentPath, navigate } from "../../../router.js";
  import { siteInfo } from "../../../data/content";

  const navItems = [
    { to: "/", label: "Beranda", exact: true },
    { to: "/verifikasi", label: "Verifikasi", exact: false },
    { to: "/katalog", label: "Katalog", exact: false },
    { to: "/dasbor", label: "Dasbor Kreator", exact: false },
  ];

  let isMenuOpen = false;

  function isActive(item, path) {
    return item.exact ? path === item.to : path.startsWith(item.to);
  }

  function handleNav(to) {
    isMenuOpen = false;
    navigate(to);
  }
</script>

<header class="sticky top-0 z-40 border-b border-gold-500/20 bg-ivory/85 backdrop-blur-md">
  <div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
    <a
      href="/"
      data-testid="nav-logo"
      on:click|preventDefault={() => handleNav("/")}
      class="flex items-center gap-2.5"
    >
      <img src="/logo.svg" alt="" class="h-9 w-9" />
      <span class="font-display text-xl font-extrabold tracking-tight text-ink-900">
        Ekraf<span class="text-gold-500">Chain</span>
      </span>
    </a>

    <nav class="hidden items-center gap-1 md:flex" aria-label="Navigasi utama">
      {#each navItems as item (item.to)}
        <a
          href={item.to}
          data-testid={`nav-link-${item.to}`}
          on:click|preventDefault={() => handleNav(item.to)}
          class="rounded-full px-4 py-2 text-sm font-semibold transition {isActive(item, $currentPath)
            ? 'bg-ink-900 text-gold-300'
            : 'text-ink-700 hover:bg-gold-100'}"
        >
          {item.label}
        </a>
      {/each}
    </nav>

    <button
      type="button"
      data-testid="nav-toggle"
      aria-label="Buka menu"
      aria-expanded={isMenuOpen}
      on:click={() => (isMenuOpen = !isMenuOpen)}
      class="rounded-xl p-2 text-ink-900 hover:bg-gold-100 md:hidden"
    >
      {#if isMenuOpen}
        <X size={22} />
      {:else}
        <Menu size={22} />
      {/if}
    </button>
  </div>

  {#if isMenuOpen}
    <nav data-testid="nav-mobile" class="border-t border-gold-500/20 bg-ivory px-4 py-3 md:hidden" aria-label="Navigasi seluler">
      <ul class="space-y-1">
        {#each navItems as item (item.to)}
          <li>
            <a
              href={item.to}
              data-testid={`nav-mobile-link-${item.to}`}
              on:click|preventDefault={() => handleNav(item.to)}
              class="block rounded-xl px-4 py-3 text-sm font-semibold {isActive(item, $currentPath)
                ? 'bg-ink-900 text-gold-300'
                : 'text-ink-700 hover:bg-gold-100'}"
            >
              {item.label}
            </a>
          </li>
        {/each}
      </ul>
      <p class="px-4 pt-3 text-xs text-ink-500">{siteInfo.tagline}</p>
    </nav>
  {/if}
</header>
