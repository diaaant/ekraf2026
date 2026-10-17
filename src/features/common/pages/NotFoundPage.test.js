import { describe, it, expect, vi } from "vitest";
import NotFoundPage from "./NotFoundPage.svelte";
import { renderWithProviders } from "../../../test-utils";

describe("NotFoundPage", () => {
  it("menampilkan pesan 404", () => {
    const { wrapper } = renderWithProviders(NotFoundPage);
    expect(wrapper.text()).toContain("404");
    expect(wrapper.text()).toContain("Halaman Tidak Ditemukan");
  });

  it("tombol kembali memanggil history.back", async () => {
    const backSpy = vi.spyOn(window.history, "back").mockImplementation(() => {});
    const { wrapper } = renderWithProviders(NotFoundPage);
    await wrapper.find('[data-testid="back-button"]').trigger("click");
    expect(backSpy).toHaveBeenCalled();
    backSpy.mockRestore();
  });

  it("tombol beranda menuju '/'", async () => {
    const { wrapper } = renderWithProviders(NotFoundPage, { route: "/nyasar" });
    await wrapper.find('[data-testid="home-button"]').trigger("click");
    expect(window.location.pathname).toBe("/");
  });
});
