// Centralized environment detection and server address resolution.
// Single source of truth - components should import from here instead of
// reading import.meta.env or userAgent directly.

export const isDev: boolean = import.meta.env.DEV;

// electron injects its identity into the user agent string
export const isElectron: boolean =
    typeof navigator !== 'undefined' && navigator.userAgent.includes('time-tidy');

// backend address: absolute in dev (vite dev server runs on another port) and
// in electron (page loaded from local files, not served by the backend);
// empty in browser production builds where the frontend is served by the backend
export const srvPrefix: string = isElectron || isDev ? 'http://127.0.0.1:38080' : '';
