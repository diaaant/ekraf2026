import { describe, it, expect } from "vitest";
import CertificateCard from "./CertificateCard.svelte";
import { renderWithProviders } from "../../../test-utils";
import { seedProducts } from "../../../data/seedProducts";

describe("CertificateCard", () => {
  it("menampilkan data lengkap produk yang terlindungi HAKI", () => {
    const { wrapper } = renderWithProviders(CertificateCard, {
      props: { product: seedProducts[0] },
    });

    expect(wrapper.find('[data-testid="certificate-code"]').text()).toContain("KRAF-SUMUT-001");
    expect(wrapper.find('[data-testid="certificate-artisan"]').text()).toBe("Ibu Sari br. Situmorang");
    expect(wrapper.find('[data-testid="certificate-origin"]').text()).toContain("Desa Tomok, Samosir");
    expect(wrapper.find('[data-testid="certificate-origin"]').text()).toContain("Sumatera Utara");
    expect(wrapper.find('[data-testid="certificate-subsector"]').text()).toContain("Kriya - Tenun Ulos");
    expect(wrapper.find('[data-testid="certificate-status"]').text()).toContain(
      "100% Asli & Terlindungi HAKI"
    );
    expect(wrapper.find('[data-testid="certificate-story"]').text()).toContain("Tomok");
    expect(wrapper.find('[data-testid="pattern-ulos"]').exists()).toBe(true);
  });

  it("menampilkan status HAKI dalam proses untuk produk baru", () => {
    const { wrapper } = renderWithProviders(CertificateCard, {
      props: { product: { ...seedProducts[1], hakiStatus: "pending" } },
    });
    const status = wrapper.find('[data-testid="certificate-status"]');
    expect(status.text()).toContain("HAKI Dalam Proses");
    expect(status.classes()).toContain("text-gold-700");
  });
});
