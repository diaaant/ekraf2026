import { describe, it, expect, vi } from "vitest";
import ProductCard from "./ProductCard.svelte";
import { renderWithProviders } from "../../../test-utils";
import { seedProducts } from "../../../data/seedProducts";

describe("ProductCard", () => {
  it("menampilkan informasi produk dan label Verified", () => {
    const { wrapper } = renderWithProviders(ProductCard, {
      props: { product: seedProducts[1], onVerify: vi.fn() },
    });
    expect(wrapper.text()).toContain("Panel Ukiran Kayu Kamboja");
    expect(wrapper.text()).toContain("Bapak Wayan Sudarma");
    expect(wrapper.text()).toContain("Ubud, Gianyar, Bali");
    expect(wrapper.text()).toContain("Verified");
    expect(wrapper.find('[data-testid="pattern-ukiran"]').exists()).toBe(true);
  });

  it("memanggil onVerify dengan kode produk saat tombol diklik", async () => {
    const onVerify = vi.fn();
    const { wrapper } = renderWithProviders(ProductCard, {
      props: { product: seedProducts[2], onVerify },
    });
    await wrapper.find('[data-testid="verify-KRAF-JOGJA-003"]').trigger("click");
    expect(onVerify).toHaveBeenCalledWith("KRAF-JOGJA-003");
  });
});
