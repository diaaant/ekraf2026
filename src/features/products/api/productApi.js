import { seedProducts } from "../../../data/seedProducts";
import { provinces, patternBySubsector } from "../../../data/provinces";
import { normalizeCode } from "../../../helpers/toolsHelper";

const REQUIRED_FIELDS = ["productName", "artisan", "origin", "provinceCode", "subsector", "craft", "story"];

// "Backend" tiruan di memori untuk demo. Bentuk fungsinya meniru REST API sungguhan,
// sehingga mudah diganti dengan fetch ke server nanti.
const productApi = (() => {
  let latency = 700;
  let db = seedProducts.map((product) => ({ ...product }));

  function wait() {
    return new Promise((resolve) => setTimeout(resolve, latency));
  }

  function setLatency(ms) {
    latency = ms;
  }

  function resetDb() {
    db = seedProducts.map((product) => ({ ...product }));
  }

  async function getProducts() {
    await wait();
    return db.map((product) => ({ ...product }));
  }

  async function verifyCode(code) {
    await wait();
    const found = db.find((product) => product.code === normalizeCode(code));
    return found ? { ...found } : null;
  }

  async function registerProduct(payload) {
    await wait();
    if (REQUIRED_FIELDS.some((field) => !String(payload[field]).trim())) {
      throw new Error("Data produk belum lengkap");
    }

    const province = provinces.find((item) => item.code === payload.provinceCode);
    const sequence = String(db.length + 1).padStart(3, "0");
    const product = {
      code: `KRAF-${province.code}-${sequence}`,
      productName: payload.productName.trim(),
      artisan: payload.artisan.trim(),
      origin: payload.origin.trim(),
      province: province.name,
      provinceCode: province.code,
      subsector: payload.subsector,
      craft: payload.craft.trim(),
      pattern: patternBySubsector[payload.subsector],
      hakiStatus: "pending",
      registeredAt: new Date().toISOString().slice(0, 10),
      story: payload.story.trim(),
    };

    db.push(product);
    return { ...product };
  }

  return { setLatency, resetDb, getProducts, verifyCode, registerProduct };
})();

export default productApi;
