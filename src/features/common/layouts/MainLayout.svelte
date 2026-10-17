<script>
  import NavbarComponent from "../components/NavbarComponent.svelte";
  import FooterComponent from "../components/FooterComponent.svelte";
</script>

<div class="flex min-h-screen flex-col bg-ivory">
  <NavbarComponent />
  <main class="flex-1">
    <slot />
  </main>
  <FooterComponent />
</div>
