import { describe, it, expect, vi, beforeEach } from "vitest";
import { get } from "svelte/store";
import productsStore, { useProductsStore } from "./productsStore";
import productApi from "../api/productApi";

describe("productsStore", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    productsStore.reset();
  });

  it("useProductsStore mengembalikan store yang sama", () => {
    expect(useProductsStore()).toBe(productsStore);
  });

  it("memiliki state awal yang bersih", () => {
    expect(productsStore.products).toEqual([]);
    expect(productsStore.registered).toBeNull();
    expect(productsStore.verification).toEqual({ status: "idle", code: "", product: null });
    expect(productsStore.$state.isRegistering).toBe(false);
    expect(get(productsStore).registerError).toBe("");
  });

  it("reset menerima state kustom", () => {
    productsStore.reset({ products: [{ code: "A" }] });
    expect(productsStore.products).toEqual([{ code: "A" }]);
  });

  it("setVerification dan resetVerification", () => {
    productsStore.setVerification({ status: "found", code: "X", product: { code: "X" } });
    expect(productsStore.verification.status).toBe("found");
    productsStore.resetVerification();
    expect(productsStore.verification.status).toBe("idle");
  });

  describe("asyncSetProducts", () => {
    it("mengisi daftar produk", async () => {
      vi.spyOn(productApi, "getProducts").mockResolvedValue([{ code: "A" }]);
      await productsStore.asyncSetProducts();
      expect(productsStore.products).toEqual([{ code: "A" }]);
    });

    it("mengosongkan daftar saat gagal", async () => {
      productsStore.setProducts([{ code: "A" }]);
      vi.spyOn(productApi, "getProducts").mockRejectedValue(new Error("x"));
      await productsStore.asyncSetProducts();
      expect(productsStore.products).toEqual([]);
    });
  });

  describe("asyncVerify", () => {
    it("menandai found dan menyimpan produk", async () => {
      vi.spyOn(productApi, "verifyCode").mockResolvedValue({ code: "A" });
      const promise = productsStore.asyncVerify("A");
      expect(productsStore.verification.status).toBe("loading");
      await promise;
      expect(productsStore.verification).toEqual({ status: "found", code: "A", product: { code: "A" } });
    });

    it("menandai notfound bila produk tidak ada", async () => {
      vi.spyOn(productApi, "verifyCode").mockResolvedValue(null);
      await productsStore.asyncVerify("Z");
      expect(productsStore.verification).toEqual({ status: "notfound", code: "Z", product: null });
    });

    it("menandai error saat API gagal", async () => {
      vi.spyOn(productApi, "verifyCode").mockRejectedValue(new Error("x"));
      await productsStore.asyncVerify("Z");
      expect(productsStore.verification.status).toBe("error");
    });
  });

  describe("asyncRegister", () => {
    it("menyimpan produk terdaftar dan menambahkannya ke daftar", async () => {
      productsStore.setProducts([{ code: "A" }]);
      vi.spyOn(productApi, "registerProduct").mockResolvedValue({ code: "B" });
      const promise = productsStore.asyncRegister({});
      expect(productsStore.$state.isRegistering).toBe(true);
      await promise;
      expect(productsStore.registered).toEqual({ code: "B" });
      expect(productsStore.products).toEqual([{ code: "A" }, { code: "B" }]);
      expect(productsStore.$state.isRegistering).toBe(false);
    });

    it("menyimpan pesan error saat gagal", async () => {
      vi.spyOn(productApi, "registerProduct").mockRejectedValue(new Error("Data produk belum lengkap"));
      await productsStore.asyncRegister({});
      expect(productsStore.registered).toBeNull();
      expect(productsStore.$state.registerError).toBe("Data produk belum lengkap");
      expect(productsStore.$state.isRegistering).toBe(false);
    });
  });
});
