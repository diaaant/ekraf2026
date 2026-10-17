import { describe, it, expect, vi } from "vitest";
import QRCode from "qrcode";
import useQrCode from "./useQrCode";

describe("useQrCode", () => {
  it("generate memanggil QRCode.toDataURL dan mengembalikan data URL", async () => {
    const { generate } = useQrCode();
    const url = await generate("https://ekrafchain.test/verifikasi?kode=KRAF-SUMUT-001");
    expect(url).toBe("data:image/png;base64,MOCK");
    expect(QRCode.toDataURL).toHaveBeenCalledWith(
      "https://ekrafchain.test/verifikasi?kode=KRAF-SUMUT-001",
      expect.objectContaining({ width: 320 })
    );
    expect(vi.isMockFunction(QRCode.toDataURL)).toBe(true);
  });
});
