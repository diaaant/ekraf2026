import { describe, it, expect, vi, beforeEach } from "vitest";
import HomePage from "./HomePage.svelte";
import { renderWithProviders } from "../../../test-utils";
import productApi from "../../products/api/productApi";

const tick = () => new Promise((r) => setTimeout(r, 20));

describe("HomePage", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    productApi.setLatency(0);
    productApi.resetDb();
  });

  it("menampilkan headline, statistik, masalah, dan solusi", () => {
    const { wrapper } = renderWithProviders(HomePage);
    expect(wrapper.find('[data-testid="hero-title"]').text()).toContain("Satu Pindai");
    expect(wrapper.find('[data-testid="hero-title"]').text()).toContain("Sejuta Keaslian.");
    expect(wrapper.text()).toContain("1.000+");
    expect(wrapper.text()).toContain("Produk Terverifikasi");
    expect(wrapper.findAll('[data-testid="stat-item"]')).toHaveLength(4);
    expect(wrapper.findAll('[data-testid="problem-item"]')).toHaveLength(4);
    expect(wrapper.findAll('[data-testid="persona-item"]')).toHaveLength(3);
    expect(wrapper.text()).toContain("KRAF-SUMUT-001");
  });

  it("menandai provinsi yang punya produk pada peta setelah data dimuat", async () => {
    const { wrapper } = renderWithProviders(HomePage);
    await tick();
    expect(wrapper.findAll('[data-testid^="map-active-"]')).toHaveLength(3);
    expect(wrapper.find('[data-testid="map-active-SUMUT"]').exists()).toBe(true);
  });

  it("mengarahkan form ke verifikasi dengan kode yang dinormalisasi", async () => {
    const { wrapper } = renderWithProviders(HomePage);
    await wrapper.find('[data-testid="hero-code-input"]').setValue(" kraf-bali-002 ");
    await wrapper.find("form").trigger("submit");
    expect(window.location.pathname).toBe("/verifikasi");
    expect(window.location.search).toBe("?kode=KRAF-BALI-002");
  });

  it("membuka halaman verifikasi kosong bila kode tidak diisi", async () => {
    const { wrapper } = renderWithProviders(HomePage);
    await wrapper.find("form").trigger("submit");
    expect(window.location.pathname).toBe("/verifikasi");
    expect(window.location.search).toBe("");
  });

  it("tombol navigasi mengarah ke katalog, dasbor, dan verifikasi", async () => {
    const { wrapper } = renderWithProviders(HomePage);
    await wrapper.find('[data-testid="hero-catalog"]').trigger("click");
    expect(window.location.pathname).toBe("/katalog");
    await wrapper.find('[data-testid="hero-creator"]').trigger("click");
    expect(window.location.pathname).toBe("/dasbor");
    await wrapper.find('[data-testid="cta-verify"]').trigger("click");
    expect(window.location.pathname).toBe("/verifikasi");
  });
});
