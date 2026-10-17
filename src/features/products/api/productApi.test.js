import { describe, it, expect, beforeEach } from "vitest";
import productApi from "./productApi";

const payload = {
  productName: "Songket Palembang",
  artisan: "Ibu Dewi",
  origin: "Ilir Timur, Palembang",
  provinceCode: "SUMSEL",
  subsector: "Fesyen",
  craft: "Songket",
  story: "Ditenun dengan benang emas.",
};

describe("productApi", () => {
  beforeEach(() => {
    productApi.setLatency(0);
    productApi.resetDb();
  });

  it("getProducts mengembalikan 3 produk mockup", async () => {
    const products = await productApi.getProducts();
    expect(products.map((p) => p.code)).toEqual([
      "KRAF-SUMUT-001",
      "KRAF-BALI-002",
      "KRAF-JOGJA-003",
    ]);
  });

  it("getProducts mengembalikan salinan, bukan referensi asli", async () => {
    const products = await productApi.getProducts();
    products[0].productName = "diubah";
    const again = await productApi.getProducts();
    expect(again[0].productName).toBe("Ulos Ragidup Tenun Tangan");
  });

  it("verifyCode menemukan produk meski huruf kecil dan ada spasi", async () => {
    const product = await productApi.verifyCode("  kraf-sumut-001 ");
    expect(product.artisan).toBe("Ibu Sari br. Situmorang");
    expect(product.hakiStatus).toBe("protected");
  });

  it("verifyCode mengembalikan null bila kode tidak terdaftar", async () => {
    expect(await productApi.verifyCode("KRAF-PALSU-999")).toBeNull();
  });

  it("registerProduct menerbitkan kode berurutan dan bisa diverifikasi", async () => {
    const product = await productApi.registerProduct(payload);
    expect(product.code).toBe("KRAF-SUMSEL-004");
    expect(product.province).toBe("Sumatera Selatan");
    expect(product.pattern).toBe("batik");
    expect(product.hakiStatus).toBe("pending");
    expect(product.registeredAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);

    expect(await productApi.verifyCode("KRAF-SUMSEL-004")).toEqual(product);
    const second = await productApi.registerProduct({ ...payload, provinceCode: "BALI" });
    expect(second.code).toBe("KRAF-BALI-005");
  });

  it("registerProduct menolak data yang tidak lengkap", async () => {
    await expect(productApi.registerProduct({ ...payload, story: "   " })).rejects.toThrow(
      "Data produk belum lengkap"
    );
  });
});
