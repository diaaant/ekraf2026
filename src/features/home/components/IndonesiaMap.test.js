import { describe, it, expect } from "vitest";
import IndonesiaMap from "./IndonesiaMap.svelte";
import { renderWithProviders } from "../../../test-utils";

describe("IndonesiaMap", () => {
  it("menampilkan 38 titik provinsi, semuanya non-aktif secara bawaan", () => {
    const { wrapper } = renderWithProviders(IndonesiaMap);
    expect(wrapper.findAll('[data-testid^="map-dot-"]')).toHaveLength(38);
    expect(wrapper.findAll('[data-testid^="map-active-"]')).toHaveLength(0);
  });

  it("menandai provinsi yang punya produk sebagai titik emas", () => {
    const { wrapper } = renderWithProviders(IndonesiaMap, {
      props: { activeCodes: ["SUMUT", "BALI", "JOGJA"] },
    });
    expect(wrapper.findAll('[data-testid^="map-active-"]')).toHaveLength(3);
    expect(wrapper.findAll('[data-testid^="map-dot-"]')).toHaveLength(35);
    expect(wrapper.find('[data-testid="map-active-BALI"]').text()).toContain("Bali");
  });
});
