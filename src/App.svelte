<script>
  import { currentRoute } from "./router.js";
  import MainLayout from "./features/common/layouts/MainLayout.svelte";
  import HomePage from "./features/home/pages/HomePage.svelte";
  import VerifyPage from "./features/verification/pages/VerifyPage.svelte";
  import CatalogPage from "./features/catalog/pages/CatalogPage.svelte";
  import CreatorDashboardPage from "./features/creator/pages/CreatorDashboardPage.svelte";
  import NotFoundPage from "./features/common/pages/NotFoundPage.svelte";
</script>

<MainLayout>
  {#if $currentRoute.name === "home"}
    <HomePage />
  {:else if $currentRoute.name === "verify"}
    <VerifyPage />
  {:else if $currentRoute.name === "catalog"}
    <CatalogPage />
  {:else if $currentRoute.name === "creator"}
    <CreatorDashboardPage />
  {:else}
    <NotFoundPage />
  {/if}
</MainLayout>
