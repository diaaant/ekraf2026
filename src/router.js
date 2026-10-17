import { writable, derived } from "svelte/store";

export const currentPath = writable(window.location.pathname);
export const currentSearch = writable(window.location.search);

window.addEventListener("popstate", () => {
  currentPath.set(window.location.pathname);
  currentSearch.set(window.location.search);
});

function splitTarget(to) {
  const index = to.indexOf("?");
  if (index === -1) {
    return { path: to, search: "" };
  }
  return { path: to.slice(0, index), search: to.slice(index) };
}

export function navigate(to, options = {}) {
  const { path, search } = splitTarget(to);
  if (options.replace) {
    window.history.replaceState({}, "", to);
  } else {
    window.history.pushState({}, "", to);
    window.scrollTo(0, 0);
  }
  currentSearch.set(search);
  currentPath.set(path);
}

export const router = {
  push: (to) => navigate(to),
  replace: (to) => navigate(to, { replace: true }),
};

export const routes = [
  { pattern: "/", name: "home" },
  { pattern: "/verifikasi", name: "verify" },
  { pattern: "/katalog", name: "catalog" },
  { pattern: "/dasbor", name: "creator" },
];

export function matchPath(pattern, path) {
  const cleanPath = path === "" ? "/" : path;
  if (pattern === cleanPath) {
    return { matches: true, params: {} };
  }

  const patternSegments = pattern.split("/").filter(Boolean);
  const pathSegments = cleanPath.split("/").filter(Boolean);

  if (patternSegments.length !== pathSegments.length) {
    return null;
  }

  const params = {};
  for (let i = 0; i < patternSegments.length; i++) {
    const pSeg = patternSegments[i];
    const aSeg = pathSegments[i];

    if (pSeg.startsWith(":")) {
      params[pSeg.slice(1)] = aSeg;
    } else if (pSeg !== aSeg) {
      return null;
    }
  }

  return { matches: true, params };
}

export function resolveRoute(path, routesList = routes) {
  const cleanPath = path === "" ? "/" : path;
  for (const route of routesList) {
    const match = matchPath(route.pattern, cleanPath);
    if (match) {
      return { name: route.name, path: cleanPath, params: match.params };
    }
  }

  return { name: "not-found", path: cleanPath, params: {} };
}

export const currentRoute = derived(currentPath, ($path) => resolveRoute($path));

export default router;
