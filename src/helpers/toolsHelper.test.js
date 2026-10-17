import { describe, it, expect } from "vitest";
import {
  normalizeCode,
  formatDate,
  buildVerifyPath,
  getCodeFromSearch,
  projectToMap,
} from "./toolsHelper";

describe("toolsHelper", () => {
  it("normalizeCode merapikan spasi dan huruf besar", () => {
    expect(normalizeCode("  kraf-sumut- 001 ")).toBe("KRAF-SUMUT-001");
  });

  it("formatDate memformat tanggal Indonesia", () => {
    expect(formatDate("2026-03-12")).toContain("2026");
    expect(formatDate("2026-03-12")).toContain("12");
  });

  it("formatDate mengembalikan '-' untuk nilai kosong", () => {
    expect(formatDate("")).toBe("-");
    expect(formatDate(null)).toBe("-");
  });

  it("buildVerifyPath membuat path dengan query terenkode", () => {
    expect(buildVerifyPath("KRAF-BALI-002")).toBe("/verifikasi?kode=KRAF-BALI-002");
    expect(buildVerifyPath("a b")).toBe("/verifikasi?kode=a%20b");
  });

  it("getCodeFromSearch membaca parameter kode", () => {
    expect(getCodeFromSearch("?kode=KRAF-SUMUT-001")).toBe("KRAF-SUMUT-001");
  });

  it("getCodeFromSearch mengembalikan string kosong bila tidak ada", () => {
    expect(getCodeFromSearch("")).toBe("");
    expect(getCodeFromSearch("?lain=1")).toBe("");
  });

  it("projectToMap memetakan koordinat ke kanvas", () => {
    expect(projectToMap(94, 7)).toEqual({ x: 0, y: 0 });
    expect(projectToMap(142, -11)).toEqual({ x: 960, y: 360 });
  });
});
