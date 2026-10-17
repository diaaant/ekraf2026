import { describe, it, expect, vi, beforeEach } from "vitest";
import CatalogPage from "./CatalogPage.svelte";
import { renderWithProviders } from "../../../test-utils";
import productApi from "../../products/api/productApi";

const tick = () => new Promise((r) => setTimeout(r, 20));

describe("CatalogPage", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    productApi.setLatency(0);
    productApi.resetDb();
  });

  it("memuat dan menampilkan 3 produk terverifikasi", async () => {
    const { wrapper } = renderWithProviders(CatalogPage, { route: "/katalog" });
    await tick();
    expect(wrapper.findAll('[data-testid^="product-card-"]')).toHaveLength(3);
    expect(wrapper.text()).toContain("Karya unggulan dari berbagai penjuru Nusantara");
  });

  it("memfilter berdasarkan subsektor", async () => {
    const { wrapper } = renderWithProviders(CatalogPage, { route: "/katalog" });
    await tick();

    await wrapper.find('[data-testid="filter-Fesyen"]').trigger("click");
    expect(wrapper.findAll('[data-testid^="product-card-"]')).toHaveLength(1);
    expect(wrapper.find('[data-testid="product-card-KRAF-JOGJA-003"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="filter-Fesyen"]').classes()).toContain("bg-ink-900");

    await wrapper.find('[data-testid="filter-Kriya"]').trigger("click");
    expect(wrapper.findAll('[data-testid^="product-card-"]')).toHaveLength(2);

    await wrapper.find('[data-testid="filter-Semua"]').trigger("click");
    expect(wrapper.findAll('[data-testid^="product-card-"]')).toHaveLength(3);
  });

  it("mencari berdasarkan nama, perajin, atau daerah", async () => {
    const { wrapper } = renderWithProviders(CatalogPage, { route: "/katalog" });
    await tick();
    const input = wrapper.find('[data-testid="catalog-search-input"]');

    await input.setValue("ubud");
    expect(wrapper.findAll('[data-testid^="product-card-"]')).toHaveLength(1);
    expect(wrapper.find('[data-testid="product-card-KRAF-BALI-002"]').exists()).toBe(true);

    await input.setValue("tidak-ada-hasil");
    expect(wrapper.find('[data-testid="catalog-empty"]').exists()).toBe(true);
  });

  it("menggabungkan filter dan pencarian", async () => {
    const { wrapper } = renderWithProviders(CatalogPage, { route: "/katalog" });
    await tick();
    await wrapper.find('[data-testid="filter-Fesyen"]').trigger("click");
    await wrapper.find('[data-testid="catalog-search-input"]').setValue("ulos");
    expect(wrapper.find('[data-testid="catalog-empty"]').exists()).toBe(true);
  });

  it("membuka halaman verifikasi saat Cek Keaslian diklik", async () => {
    const { wrapper } = renderWithProviders(CatalogPage, { route: "/katalog" });
    await tick();
    await wrapper.find('[data-testid="verify-KRAF-SUMUT-001"]').trigger("click");
    expect(window.location.pathname).toBe("/verifikasi");
    expect(window.location.search).toBe("?kode=KRAF-SUMUT-001");
  });
});
