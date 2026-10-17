import { describe, it, expect } from "vitest";
import MainLayout from "./MainLayout.svelte";
import { renderWithProviders } from "../../../test-utils";

describe("MainLayout", () => {
  it("membungkus konten dengan navbar dan footer", () => {
    const { wrapper } = renderWithProviders(MainLayout);
    expect(wrapper.find("header").exists()).toBe(true);
    expect(wrapper.find("main").exists()).toBe(true);
    expect(wrapper.find("footer").exists()).toBe(true);
  });
});
