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
});
