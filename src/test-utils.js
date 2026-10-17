import { render } from "@testing-library/svelte";
import { productsStore } from "./features/products/states/productsStore";
import { router, navigate, currentPath, currentSearch } from "./router";

export function setupMockStores(initialState = {}) {
  productsStore.reset(initialState);
  return { productsStore };
}

function createWrapperElement(el) {
  if (!el) {
    return {
      exists: () => false,
      element: null,
      text: () => "",
      attributes: () => null,
      classes: () => [],
      trigger: async () => {},
      setValue: async () => {},
      find: () => createWrapperElement(null),
      findAll: () => [],
    };
  }
  return {
    exists: () => true,
    element: el,
    text: () => el.textContent || "",
    attributes: (name) => el.getAttribute(name),
    classes: () => Array.from(el.classList),
    trigger: async (event, eventInit = {}) => {
      if (event === "click") {
        el.click();
      } else if (event === "submit") {
        el.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
      } else {
        el.dispatchEvent(new Event(event, { bubbles: true, ...eventInit }));
      }
      await new Promise((r) => setTimeout(r, 0));
    },
    setValue: async (val) => {
      el.value = val;
      el.dispatchEvent(new Event("input", { bubbles: true }));
      el.dispatchEvent(new Event("change", { bubbles: true }));
      await new Promise((r) => setTimeout(r, 0));
    },
    find: (sel) => createWrapperElement(el.querySelector(sel)),
    findAll: (sel) => Array.from(el.querySelectorAll(sel)).map(createWrapperElement),
  };
}

export function renderWithProviders(
  component,
  { props = {}, preloadedState = {}, route = "/", ...options } = {}
) {
  const stores = setupMockStores(preloadedState);
  if (route) {
    navigate(route);
  }

  const result = render(component, { props, ...options });

  const wrapper = {
    exists: () => !!result.container.firstElementChild,
    element: result.container.firstElementChild,
    text: () => result.container.textContent || "",
    html: () => result.container.innerHTML,
    find: (selector) => createWrapperElement(result.container.querySelector(selector)),
    findAll: (selector) =>
      Array.from(result.container.querySelectorAll(selector)).map(createWrapperElement),
    unmount: result.unmount,
  };

  return { ...result, wrapper, ...stores, router, currentPath, currentSearch };
}
