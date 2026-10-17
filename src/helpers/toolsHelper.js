export function normalizeCode(code) {
  return code.trim().toUpperCase().replace(/\s+/g, "");
}

export function formatDate(date) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function buildVerifyPath(code) {
  return `/verifikasi?kode=${encodeURIComponent(code)}`;
}

export function getCodeFromSearch(search) {
  return new URLSearchParams(search).get("kode") ?? "";
}

// Proyeksi sederhana (equirectangular) ke kanvas peta 960 x 360.
export function projectToMap(lon, lat) {
  return {
    x: Math.round(((lon - 94) / 48) * 960),
    y: Math.round(((7 - lat) / 18) * 360),
  };
}
