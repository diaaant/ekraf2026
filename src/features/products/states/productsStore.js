import { writable } from "svelte/store";
import productApi from "../api/productApi";

function createProductsStore() {
  const initial = {
    products: [],
    verification: { status: "idle", code: "", product: null },
    registered: null,
    registerError: "",
    isRegistering: false,
  };

  let currentState = { ...initial };
  const innerStore = writable(currentState);
  innerStore.subscribe((val) => {
    currentState = val;
  });

  function patch(values) {
    innerStore.update((s) => ({ ...s, ...values }));
  }

  return {
    subscribe: innerStore.subscribe,
    get $state() {
      return currentState;
    },
    get products() {
      return currentState.products;
    },
    get verification() {
      return currentState.verification;
    },
    get registered() {
      return currentState.registered;
    },
    reset(state = initial) {
      innerStore.set({ ...initial, ...state });
    },
    setProducts(products) {
      patch({ products });
    },
    setVerification(verification) {
      patch({ verification });
    },
    resetVerification() {
      patch({ verification: initial.verification });
    },
    async asyncSetProducts() {
      try {
        this.setProducts(await productApi.getProducts());
      } catch {
        this.setProducts([]);
      }
    },
    async asyncVerify(code) {
      this.setVerification({ status: "loading", code, product: null });
      try {
        const product = await productApi.verifyCode(code);
        this.setVerification({
          status: product ? "found" : "notfound",
          code,
          product,
        });
      } catch {
        this.setVerification({ status: "error", code, product: null });
      }
    },
    async asyncRegister(payload) {
      patch({ isRegistering: true, registered: null, registerError: "" });
      try {
        const product = await productApi.registerProduct(payload);
        patch({ registered: product, products: [...currentState.products, product] });
      } catch (error) {
        patch({ registerError: error.message });
      } finally {
        patch({ isRegistering: false });
      }
    },
  };
}

export const productsStore = createProductsStore();
export const useProductsStore = () => productsStore;
export default productsStore;
