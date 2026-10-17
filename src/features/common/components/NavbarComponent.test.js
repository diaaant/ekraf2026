import { describe, it, expect } from "vitest";
import NavbarComponent from "./NavbarComponent.svelte";
import { renderWithProviders } from "../../../test-utils";

describe("NavbarComponent", () => {
  it("menampilkan logo dan empat menu utama", () => {
    const { wrapper } = renderWithProviders(NavbarComponent);
    expect(wrapper.text()).toContain("EkrafChain");
    for (const label of ["Beranda", "Verifikasi", "Katalog", "Dasbor Kreator"]) {
      expect(wrapper.text()).toContain(label);
    }
  });

  it("menandai menu aktif sesuai rute", () => {
    const { wrapper } = renderWithProviders(NavbarComponent, { route: "/katalog" });
    expect(wrapper.find('[data-testid="nav-link-/katalog"]').classes()).toContain("bg-ink-900");
    expect(wrapper.find('[data-testid="nav-link-/"]').classes()).not.toContain("bg-ink-900");
  });

  it("menandai beranda aktif hanya pada path persis '/'", () => {
    const { wrapper } = renderWithProviders(NavbarComponent, { route: "/" });
    expect(wrapper.find('[data-testid="nav-link-/"]').classes()).toContain("bg-ink-900");
    expect(wrapper.find('[data-testid="nav-link-/verifikasi"]').classes()).not.toContain("bg-ink-900");
  });

  it("berpindah halaman saat menu diklik", async () => {
    const { wrapper } = renderWithProviders(NavbarComponent);
    await wrapper.find('[data-testid="nav-link-/dasbor"]').trigger("click");
    expect(window.location.pathname).toBe("/dasbor");
    await wrapper.find('[data-testid="nav-logo"]').trigger("click");
    expect(window.location.pathname).toBe("/");
  });

  it("membuka dan menutup menu seluler, lalu menutupnya setelah navigasi", async () => {
    const { wrapper } = renderWithProviders(NavbarComponent, { route: "/verifikasi" });
    expect(wrapper.find('[data-testid="nav-mobile"]').exists()).toBe(false);

    await wrapper.find('[data-testid="nav-toggle"]').trigger("click");
    expect(wrapper.find('[data-testid="nav-mobile"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="nav-mobile-link-/verifikasi"]').classes()).toContain("bg-ink-900");
    expect(wrapper.find('[data-testid="nav-mobile-link-/katalog"]').classes()).not.toContain("bg-ink-900");

    await wrapper.find('[data-testid="nav-mobile-link-/katalog"]').trigger("click");
    expect(window.location.pathname).toBe("/katalog");
    expect(wrapper.find('[data-testid="nav-mobile"]').exists()).toBe(false);

    await wrapper.find('[data-testid="nav-toggle"]').trigger("click");
    await wrapper.find('[data-testid="nav-toggle"]').trigger("click");
    expect(wrapper.find('[data-testid="nav-mobile"]').exists()).toBe(false);
  });
});
