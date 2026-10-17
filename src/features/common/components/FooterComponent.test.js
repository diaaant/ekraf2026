import { describe, it, expect } from "vitest";
import FooterComponent from "./FooterComponent.svelte";
import { renderWithProviders } from "../../../test-utils";

describe("FooterComponent", () => {
  it("menampilkan hak cipta, tautan Kemenekraf, dan kontak", () => {
    const { wrapper } = renderWithProviders(FooterComponent);
    expect(wrapper.find('[data-testid="footer-copyright"]').text()).toContain(
      String(new Date().getFullYear())
    );
    expect(wrapper.find('[data-testid="footer-ministry"]').attributes("href")).toMatch(/^https:\/\//);
    expect(wrapper.find('[data-testid="footer-ministry"]').text()).toContain("Kemenekraf");
    expect(wrapper.find('[data-testid="footer-contact"]').attributes("href")).toMatch(/^mailto:/);
    expect(wrapper.text()).toContain("data mockup");
  });
});
