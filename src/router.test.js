import { describe, it, expect, beforeEach } from "vitest";
import { get } from "svelte/store";
import router, {
  currentPath,
  currentSearch,
  currentRoute,
  navigate,
  matchPath,
  resolveRoute,
  routes,
} from "./router";

describe("router", () => {
  beforeEach(() => {
    navigate("/");
  });

  it("navigate memperbarui path dan mengosongkan search", () => {
    navigate("/katalog");
    expect(get(currentPath)).toBe("/katalog");
    expect(get(currentSearch)).toBe("");
    expect(window.location.pathname).toBe("/katalog");
    expect(window.scrollTo).toHaveBeenCalled();
  });

  it("navigate memisahkan query dari path", () => {
    navigate("/verifikasi?kode=KRAF-BALI-002");
    expect(get(currentPath)).toBe("/verifikasi");
    expect(get(currentSearch)).toBe("?kode=KRAF-BALI-002");
    expect(window.location.search).toBe("?kode=KRAF-BALI-002");
  });

  it("navigate dengan replace tidak menambah riwayat", () => {
    const before = window.history.length;
    navigate("/dasbor", { replace: true });
    expect(window.history.length).toBe(before);
    expect(get(currentPath)).toBe("/dasbor");
  });

  it("router.push dan router.replace memanggil navigate", () => {
    router.push("/katalog");
    expect(get(currentPath)).toBe("/katalog");
    router.replace("/dasbor");
    expect(get(currentPath)).toBe("/dasbor");
  });

  it("menurunkan rute dari path saat ini", () => {
    expect(get(currentRoute)).toEqual({ name: "home", path: "/", params: {} });
    navigate("/verifikasi");
    expect(get(currentRoute).name).toBe("verify");
    navigate("/katalog");
    expect(get(currentRoute).name).toBe("catalog");
    navigate("/dasbor");
    expect(get(currentRoute).name).toBe("creator");
  });

  it("memperlakukan path kosong sebagai beranda", () => {
    currentPath.set("");
    expect(get(currentRoute)).toEqual({ name: "home", path: "/", params: {} });
    expect(matchPath("/", "")).toEqual({ matches: true, params: {} });
  });

  it("mengembalikan not-found untuk path tak dikenal", () => {
    navigate("/tidak-ada");
    expect(get(currentRoute)).toEqual({ name: "not-found", path: "/tidak-ada", params: {} });
  });

  it("menangani event popstate", () => {
    window.history.pushState({}, "", "/katalog?x=1");
    window.dispatchEvent(new PopStateEvent("popstate"));
    expect(get(currentPath)).toBe("/katalog");
    expect(get(currentSearch)).toBe("?x=1");
  });

  it("matchPath mendukung parameter dan menolak yang tidak cocok", () => {
    expect(matchPath("/produk/:id", "/produk/42")).toEqual({ matches: true, params: { id: "42" } });
    expect(matchPath("/produk/:id", "/produk/42/extra")).toBeNull();
    expect(matchPath("/produk/:id", "/lain/42")).toBeNull();
  });

  it("resolveRoute mendukung daftar rute kustom", () => {
    const custom = [{ pattern: "/item/:id", name: "item" }];
    expect(resolveRoute("/item/9", custom)).toEqual({ name: "item", path: "/item/9", params: { id: "9" } });
    expect(resolveRoute("/lain", custom).name).toBe("not-found");
    expect(routes).toHaveLength(4);
  });
});
