import { describe, it, expect, vi, beforeEach } from "vitest";
import App from "./App.svelte";
import { renderWithProviders } from "./test-utils";
import productApi from "./features/products/api/productApi";

const tick = () => new Promise((r) => setTimeout(r, 30));

describe("App", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    productApi.setLatency(0);
    productApi.resetDb();
  });

  it("merender beranda pada rute '/'", () => {
    const { wrapper } = renderWithProviders(App, { route: "/" });
    expect(wrapper.text()).toContain("Sejuta Keaslian.");
    expect(wrapper.find("header").exists()).toBe(true);
    expect(wrapper.find("footer").exists()).toBe(true);
  });

  it("merender halaman verifikasi pada rute '/verifikasi'", () => {
    const { wrapper } = renderWithProviders(App, { route: "/verifikasi" });
    expect(wrapper.text()).toContain("Pastikan karya yang Anda beli");
  });

  it("merender katalog pada rute '/katalog'", async () => {
    const { wrapper } = renderWithProviders(App, { route: "/katalog" });
    await tick();
    expect(wrapper.text()).toContain("Karya unggulan");
    expect(wrapper.findAll('[data-testid^="product-card-"]')).toHaveLength(3);
  });

  it("merender dasbor kreator pada rute '/dasbor'", () => {
    const { wrapper } = renderWithProviders(App, { route: "/dasbor" });
    expect(wrapper.text()).toContain("Mockup Dasbor Kreator");
  });

  it("merender halaman 404 untuk rute tak dikenal", () => {
    const { wrapper } = renderWithProviders(App, { route: "/tidak-ada" });
    expect(wrapper.text()).toContain("Halaman Tidak Ditemukan");
  });

  it("alur demo: ketik KRAF-SUMUT-001 lalu sertifikat emas muncul", async () => {
    const { wrapper } = renderWithProviders(App, { route: "/" });
    await wrapper.find('[data-testid="hero-code-input"]').setValue("KRAF-SUMUT-001");
    await wrapper.find('[data-testid="hero-submit"]').trigger("click");
    await tick();

    expect(wrapper.find('[data-testid="certificate-card"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="certificate-artisan"]').text()).toBe("Ibu Sari br. Situmorang");
    expect(wrapper.find('[data-testid="certificate-status"]').text()).toContain("Terlindungi HAKI");
  });
});
