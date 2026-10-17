import { describe, it, expect } from "vitest";
import PatternArt from "./PatternArt.svelte";
import { renderWithProviders } from "../../../test-utils";

describe("PatternArt", () => {
  it("memakai motif ulos secara bawaan", () => {
    const { wrapper } = renderWithProviders(PatternArt);
    expect(wrapper.find('[data-testid="pattern-ulos"]').exists()).toBe(true);
    expect(wrapper.html()).toContain("Ilustrasi motif ulos");
  });

  it("merender motif ukiran", () => {
    const { wrapper } = renderWithProviders(PatternArt, { props: { variant: "ukiran" } });
    expect(wrapper.find('[data-testid="pattern-ukiran"]').exists()).toBe(true);
    expect(wrapper.findAll("circle").length).toBeGreaterThan(0);
  });

  it("merender motif batik dan menerapkan className", () => {
    const { wrapper } = renderWithProviders(PatternArt, {
      props: { variant: "batik", className: "h-full w-full" },
    });
    const svg = wrapper.find('[data-testid="pattern-batik"]');
    expect(svg.exists()).toBe(true);
    expect(svg.attributes("class")).toBe("h-full w-full");
    expect(wrapper.findAll("ellipse").length).toBeGreaterThan(0);
  });
});
