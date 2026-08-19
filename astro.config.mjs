// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Los permalinks reales de WP (verificados vía REST API) terminan en "/"
  // (ej. /barraca-hefesto/, /como-protejo-y-acelero-los-sitios-web/) — para
  // no romper URLs indexadas al migrar. Ver CLAUDE.md.
  site: 'https://nestorhoracio.com',
  trailingSlash: 'always',
  integrations: [sitemap()],
  // assetsInlineLimit: 0 fuerza que Astro/Vite externalicen scripts y CSS
  // chicos en vez de embeberlos como <style>/<script> inline en el HTML.
  // El CSP de public/.htaccess es "default-src 'self'" (sin 'unsafe-inline'),
  // así que cualquier <style>/<script> inline queda bloqueado por el
  // navegador -- pasó de verdad en producción (Header.astro se embebía
  // inline en las 19 páginas). Ver CLAUDE.md.
  vite: {
    build: {
      assetsInlineLimit: 0,
    },
  },
});
