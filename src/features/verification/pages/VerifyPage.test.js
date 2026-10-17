import { describe, it, expect, vi, beforeEach } from "vitest";
import VerifyPage from "./VerifyPage.svelte";
import { renderWithProviders } from "../../../test-utils";
import productsStore from "../../products/states/productsStore";
import productApi from "../../products/api/productApi";
import { navigate } from "../../../router";

const tick = () => new Promise((r) => setTimeout(r, 20));

describe("VerifyPage", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    productApi.setLatency(0);
    productApi.resetDb();
  });

  it("menampilkan form dan kode contoh pada keadaan awal", () => {
    const { wrapper } = renderWithProviders(VerifyPage, { route: "/verifikasi" });
    expect(wrapper.text()).toContain("Cek Keaslian");
    expect(wrapper.find('[data-testid="verify-code-input"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="sample-KRAF-SUMUT-001"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="certificate-card"]').exists()).toBe(false);
  });

  it("menolak kode kosong", async () => {
    const asyncVerify = vi.spyOn(productsStore, "asyncVerify");
    const { wrapper } = renderWithProviders(VerifyPage, { route: "/verifikasi" });
    await wrapper.find('[data-testid="verify-submit-btn"]').trigger("click");
    expect(wrapper.find('[data-testid="verify-input-error"]').text()).toContain("Masukkan kode unik");
    expect(asyncVerify).not.toHaveBeenCalled();
  });

  it("menampilkan sertifikat untuk kode yang valid dan memperbarui URL", async () => {
    const { wrapper } = renderWithProviders(VerifyPage, { route: "/verifikasi" });
    await wrapper.find('[data-testid="verify-code-input"]').setValue(" kraf-sumut-001 ");
    await wrapper.find("form").trigger("submit");
    await tick();

    expect(wrapper.find('[data-testid="certificate-card"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="certificate-artisan"]').text()).toBe("Ibu Sari br. Situmorang");
    expect(window.location.search).toBe("?kode=KRAF-SUMUT-001");
    expect(wrapper.find('[data-testid="verify-input-error"]').exists()).toBe(false);
  });

  it("menghapus pesan error setelah pengguna mengirim kode yang valid", async () => {
    const { wrapper } = renderWithProviders(VerifyPage, { route: "/verifikasi" });
    await wrapper.find("form").trigger("submit");
    expect(wrapper.find('[data-testid="verify-input-error"]').exists()).toBe(true);

    await wrapper.find('[data-testid="verify-code-input"]').setValue("KRAF-BALI-002");
    await wrapper.find("form").trigger("submit");
    await tick();
    expect(wrapper.find('[data-testid="verify-input-error"]').exists()).toBe(false);
    expect(wrapper.find('[data-testid="certificate-card"]').exists()).toBe(true);
  });

  it("menampilkan indikator memuat selama verifikasi berjalan", async () => {
    const { wrapper } = renderWithProviders(VerifyPage, { route: "/verifikasi" });
    productsStore.setVerification({ status: "loading", code: "X", product: null });
    await tick();
    expect(wrapper.find('[data-testid="verify-loading"]').exists()).toBe(true);
  });

  it("menampilkan peringatan untuk kode yang tidak terdaftar", async () => {
    const { wrapper } = renderWithProviders(VerifyPage, { route: "/verifikasi" });
    await wrapper.find('[data-testid="verify-code-input"]').setValue("KRAF-PALSU-999");
    await wrapper.find("form").trigger("submit");
    await tick();

    const notFound = wrapper.find('[data-testid="verify-notfound"]');
    expect(notFound.exists()).toBe(true);
    expect(notFound.text()).toContain("KRAF-PALSU-999");
  });

  it("menampilkan pesan gangguan saat verifikasi error", async () => {
    vi.spyOn(productApi, "verifyCode").mockRejectedValue(new Error("x"));
    const { wrapper } = renderWithProviders(VerifyPage, { route: "/verifikasi" });
    await wrapper.find('[data-testid="verify-code-input"]').setValue("KRAF-SUMUT-001");
    await wrapper.find("form").trigger("submit");
    await tick();
    expect(wrapper.find('[data-testid="verify-error"]').exists()).toBe(true);
  });

  it("memverifikasi kode contoh saat chip diklik", async () => {
    const { wrapper } = renderWithProviders(VerifyPage, { route: "/verifikasi" });
    await wrapper.find('[data-testid="sample-KRAF-JOGJA-003"]').trigger("click");
    await tick();
    expect(wrapper.find('[data-testid="verify-code-input"]').element.value).toBe("KRAF-JOGJA-003");
    expect(wrapper.find('[data-testid="certificate-subsector"]').text()).toContain("Fesyen - Batik Tulis");
  });

  it("langsung memverifikasi kode dari URL (hasil pindai QR)", async () => {
    const { wrapper } = renderWithProviders(VerifyPage, {
      route: "/verifikasi?kode=KRAF-BALI-002",
    });
    await tick();
    expect(wrapper.find('[data-testid="verify-code-input"]').element.value).toBe("KRAF-BALI-002");
    expect(wrapper.find('[data-testid="certificate-artisan"]').text()).toBe("Bapak Wayan Sudarma");
  });

  it("memverifikasi ulang saat query URL berubah", async () => {
    const { wrapper } = renderWithProviders(VerifyPage, {
      route: "/verifikasi?kode=KRAF-BALI-002",
    });
    await tick();
    navigate("/verifikasi?kode=KRAF-JOGJA-003");
    await tick();
    expect(wrapper.find('[data-testid="certificate-artisan"]').text()).toBe("Ibu Retno Wulandari");
  });

  it("mengembalikan status verifikasi ke awal saat halaman ditutup", () => {
    const { unmount } = renderWithProviders(VerifyPage, { route: "/verifikasi" });
    productsStore.setVerification({ status: "notfound", code: "X", product: null });
    unmount();
    expect(productsStore.verification.status).toBe("idle");
  });
});
