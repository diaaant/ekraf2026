import { describe, it, expect, vi, beforeEach } from "vitest";
import QRCode from "qrcode";
import CreatorDashboardPage from "./CreatorDashboardPage.svelte";
import { renderWithProviders } from "../../../test-utils";
import productApi from "../../products/api/productApi";

const tick = () => new Promise((r) => setTimeout(r, 30));

async function fillForm(wrapper, overrides = {}) {
  const values = {
    product: "Songket Palembang",
    artisan: "Ibu Dewi",
    province: "SUMSEL",
    origin: "Ilir Timur, Palembang",
    subsector: "Fesyen",
    craft: "Songket",
    story: "Ditenun dengan benang emas.",
    ...overrides,
  };
  for (const [field, value] of Object.entries(values)) {
    await wrapper.find(`[data-testid="creator-${field}"]`).setValue(value);
  }
}

describe("CreatorDashboardPage", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    productApi.setLatency(0);
    productApi.resetDb();
    QRCode.toDataURL.mockResolvedValue("data:image/png;base64,MOCK");
  });

  it("menampilkan langkah, form, panel kosong, dan daftar produk", async () => {
    const { wrapper } = renderWithProviders(CreatorDashboardPage, { route: "/dasbor" });
    await tick();
    expect(wrapper.text()).toContain("Mockup Dasbor Kreator");
    expect(wrapper.text()).toContain("Daftarkan Produk");
    expect(wrapper.text()).toContain("Terbitkan Passport");
    expect(wrapper.find('[data-testid="passport-empty"]').exists()).toBe(true);
    expect(wrapper.text()).toContain("Produk Terdaftar (3)");
    expect(wrapper.findAll('[data-testid="creator-products"] li')).toHaveLength(3);
  });

  it("menolak form yang belum lengkap", async () => {
    const { wrapper } = renderWithProviders(CreatorDashboardPage, { route: "/dasbor" });
    await tick();
    await fillForm(wrapper, { story: "  " });
    await wrapper.find('[data-testid="creator-form"]').trigger("submit");
    expect(wrapper.find('[data-testid="creator-form-error"]').text()).toContain("Lengkapi semua kolom");
    expect(wrapper.find('[data-testid="passport-empty"]').exists()).toBe(true);
  });

  it("menerbitkan Digital Passport lengkap dengan QR Code", async () => {
    const { wrapper } = renderWithProviders(CreatorDashboardPage, { route: "/dasbor" });
    await tick();
    await fillForm(wrapper);
    await wrapper.find('[data-testid="creator-form"]').trigger("submit");
    await tick();

    expect(wrapper.find('[data-testid="passport-code"]').text()).toBe("KRAF-SUMSEL-004");
    expect(wrapper.find('[data-testid="passport-qr"]').attributes("src")).toBe(
      "data:image/png;base64,MOCK"
    );
    expect(wrapper.find('[data-testid="passport-download"]').attributes("download")).toBe(
      "KRAF-SUMSEL-004.png"
    );
    expect(QRCode.toDataURL).toHaveBeenCalledWith(
      expect.stringContaining("/verifikasi?kode=KRAF-SUMSEL-004"),
      expect.any(Object)
    );
    expect(wrapper.find('[data-testid="creator-form-error"]').exists()).toBe(false);
    expect(wrapper.find('[data-testid="creator-product"]').element.value).toBe("");
    expect(wrapper.text()).toContain("Produk Terdaftar (4)");
  });

  it("menampilkan placeholder bila QR Code gagal dibuat", async () => {
    QRCode.toDataURL.mockRejectedValueOnce(new Error("gagal"));
    const { wrapper } = renderWithProviders(CreatorDashboardPage, { route: "/dasbor" });
    await tick();
    await fillForm(wrapper);
    await wrapper.find('[data-testid="creator-form"]').trigger("submit");
    await tick();
    expect(wrapper.find('[data-testid="passport-code"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="passport-qr"]').exists()).toBe(false);
    expect(wrapper.find('[data-testid="passport-qr-loading"]').exists()).toBe(true);
  });

  it("menampilkan status menerbitkan selama proses berjalan", async () => {
    vi.spyOn(productApi, "registerProduct").mockImplementation(() => new Promise(() => {}));
    const { wrapper } = renderWithProviders(CreatorDashboardPage, { route: "/dasbor" });
    await tick();
    await fillForm(wrapper);
    await wrapper.find('[data-testid="creator-form"]').trigger("submit");
    await tick();
    expect(wrapper.find('[data-testid="creator-submit"]').text()).toContain("Menerbitkan...");
    expect(wrapper.find('[data-testid="creator-submit"]').attributes("disabled")).not.toBeNull();
  });

  it("menampilkan error dari server", async () => {
    vi.spyOn(productApi, "registerProduct").mockRejectedValue(new Error("Data produk belum lengkap"));
    const { wrapper } = renderWithProviders(CreatorDashboardPage, { route: "/dasbor" });
    await tick();
    await fillForm(wrapper);
    await wrapper.find('[data-testid="creator-form"]').trigger("submit");
    await tick();
    expect(wrapper.find('[data-testid="creator-register-error"]').text()).toBe("Data produk belum lengkap");
  });

  it("membuka sertifikat digital produk yang baru terbit", async () => {
    const { wrapper } = renderWithProviders(CreatorDashboardPage, { route: "/dasbor" });
    await tick();
    await fillForm(wrapper);
    await wrapper.find('[data-testid="creator-form"]').trigger("submit");
    await tick();
    await wrapper.find('[data-testid="passport-verify"]').trigger("click");
    expect(window.location.pathname).toBe("/verifikasi");
    expect(window.location.search).toBe("?kode=KRAF-SUMSEL-004");
  });
});
