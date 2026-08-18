# ROADMAP.md — nestorhoracio-astro

## Estado actual (2026-08-17)

**El sitio ya levanta y las 15 páginas se generan bien** (`npm run build` — verificado con capturas de Playwright en home, un post de blog, una página de portfolio, el hub del blog, dark mode y menú mobile; sin errores de consola). Lo que existe:

- Scaffold de Astro (`package.json`, `astro.config.mjs`, `tsconfig.json`) — mismo patrón minimalista que jesuseselcamino-astro, sin starter template de por medio.
- `src/content.config.ts` con dos collections: `blog` (8 posts) y `portfolio` (5 proyectos).
- `scripts/fetch-wp-content.mjs` — extrae los posts del blog desde la REST API y limpia el contenido de Divi (ver CLAUDE.md, sección Gotchas).
- Diseño portado: `src/styles/global.css` (tokens), `header.css`, `footer.css`, `home.css`, `blog.css`. Fuente Blinker self-hosted, logos reales en `public/images/logo/`.
- `Layout.astro`, `Header.astro` (dark mode con swap de logo + scroll-spy + menú mobile, todo funcional) y `Footer.astro`.
- Páginas: `index.astro` (home one-pager, con contenido real transcripto del sitio en vivo), `blog/index.astro` (hub), `[slug].astro` (plantilla plana compartida por posts de blog y proyectos de portfolio, mismo patrón que jesuseselcamino-astro).

Lo que **no** existe todavía: Política de Privacidad (la página real está vacía en WordPress, hay que escribirla de cero — no se inventó texto legal sin que el usuario lo revise), SEO real (JSON-LD, sitemap probado, og:image por página), formulario de contacto, `.htaccess`, y todo lo de deploy (repo en GitHub, GitHub Actions, cuenta FTP).

## Decisiones tomadas en la sesión de arranque (2026-08-17)

- **Hosting**: HostGator (ya contratado, 2 años), no Cloudflare Pages. Plan compartido básico: **sin SSH, sin Git Version Control, sin Node.js** (confirmado por el usuario revisando su cPanel).
- **Deploy**: GitHub Actions compila (`npm run build`) y sube `dist/` por FTP/SFTP a HostGator. Pendiente: crear el repo en GitHub, crear una cuenta FTP dedicada en cPanel (no usar la cuenta principal), armar el workflow y guardar las credenciales como secrets.
- **Formulario de contacto**: script PHP propio en HostGator (no Web3Forms). Pendiente de construir — necesita honeypot + validación server-side como mínimo.
- **Blog a futuro**: sin CMS, sin panel de edición. Publicar = agregar un `.md` a `src/content/blog/` + build + deploy. Decisión explícita del usuario, revisar si en algún momento pide agregar Decap CMS u otra cosa.
- **URLs/redirects/404 en Apache**: pendiente de armar `.htaccess` (no hay `_redirects`/`_headers` como en Cloudflare).
- **SSL**: pendiente confirmar que AutoSSL de cPanel esté activo para el dominio.

## Próximo (en orden sugerido)

1. **Política de Privacidad**: pendiente que el usuario defina qué debe cubrir (datos de contacto, analytics, cookies) — no inventar el texto legal.
2. **SEO**: componente `<SEO />` propio (ya hay `title`/`description`/`og:*`/canonical básicos en `Layout.astro`, falta JSON-LD, `robots.txt`, verificar `sitemap-index.xml` generado por `@astrojs/sitemap`, favicon real en más tamaños).
3. Revisar a mano el bug de listas `<ol>`/`<ul>` anidadas duplicadas que traen 3 posts del blog desde WordPress (ver CLAUDE.md) — no es un error de la migración, viene así del contenido original.
4. Placeholder de portada para los 3 posts sin imagen (`salto-de-ancla`, `ia-asistente-profesional`, `cpt-vs-modulos-manuales`) — hoy es un rectángulo de color liso en `blog/index.astro`, se puede mejorar.
5. Formulario de contacto (PHP propio en HostGator) + `.htaccess` (trailing slash / 404 real de Apache, hoy el 404 de Astro no está armado).
6. Repo en GitHub + GitHub Actions (build + FTP deploy) + cuenta FTP dedicada en cPanel.
7. Dominio: confirmar que nestorhoracio.com ya apunta a este mismo hosting HostGator (si el WordPress actual vive en otro proveedor, hay que planear el corte de DNS) y que SSL está activo.
8. Revisión visual pasada a mano contra el sitio real — el layout/colores/tipografía están portados fielmente pero no pixel-perfect (por ejemplo el nav desktop es una aproximación de la píldora original, no viene de un archivo fuente).

## Changelog

### 2026-08-17 — Arranque del proyecto
- Relevado jesuseselcamino-astro como referencia de patrón (Content Collections, script de fetch vía REST API, CLAUDE.md/ROADMAP.md).
- Relevado nestorhoracio.com vía REST API: 8 posts de blog (categorías diseño web / IA y Desarrollo web), 9 páginas (Inicio, Portfolio + 5 proyectos, Servicios, Sobre Mí, Blog, Política de Privacidad).
- Descubierto que el sitio usa Divi y la REST API no devuelve HTML final — esto no pasaba en jesuseselcamino-astro. Ver CLAUDE.md para el detalle completo.
- Definidas con el usuario las 3 decisiones técnicas pendientes: deploy (GitHub Actions + FTP, tras confirmar que el hosting no tiene SSH/Git/Node), formulario de contacto (PHP propio) y publicación de posts futuros (solo por código).
- Scaffold del proyecto + `content.config.ts` (collection `blog`) + `scripts/fetch-wp-content.mjs` con limpieza de Divi por regex.
- Migrados los 8 posts del blog, revisados a mano.
- El usuario pasó capturas de pantalla (home, página de portfolio, blog, mobile devtools) y bajó de cPanel el child theme real (`functions.php`, `style.css`, `dark-mode.js`, `menu-scroll.js`, fuente Blinker) a la raíz del proyecto. Se leyeron, se portaron los tokens de diseño a `src/styles/global.css`, se documentó el resto (header/footer/cards/dark-mode/scroll-spy/aria-labels) en CLAUDE.md sección "Diseño", se movió la fuente a `public/fonts/`, y se descartaron los archivos originales (ya no están en el repo). Aclarado además que los íconos flotantes de WhatsApp/Spotify de las capturas eran de la barra lateral de Opera, no del sitio.
- Encontrado que la REST API no sirve para Home ni para `/portfolio/`: ambas dependen del Custom Body del Theme Builder de Divi, que no se expone ahí (la REST API devolvía contenido de prueba/placeholder, no lo real). Se resolvió bajando el HTML en vivo (no la REST API) y convirtiéndolo a texto legible con un script propio. Encontrado de paso que `/portfolio/` **no está linkeada desde ningún lado** (el nav real usa `#portfolio`, un ancla en el home) — no se migra esa página, era contenido de borrador sin relación. Política de Privacidad confirmada vacía en el sitio real.
- Bajados los assets reales: 5 capturas de proyecto (`src/content/portfolio/`) y los 2 logos (`public/images/logo/`).
- Creada la collection `portfolio` (5 entradas, contenido real transcripto a mano) y construido todo el front: `Layout.astro`, `Header.astro` (dark mode + scroll-spy + menú mobile), `Footer.astro`, `index.astro` (home one-pager con el copy real: hero, 5 cards de portfolio, 4 servicios + "¿Por qué trabajar conmigo?", bio + 3 sub-secciones), `blog/index.astro` (hub) y `[slug].astro` (plantilla compartida por blog y portfolio, permalinks planos).
- `npm run build` genera las 15 páginas sin errores. Verificado visualmente con Playwright (`npx playwright screenshot`, y un script propio para click + consola): home, post de blog, detalle de portfolio, hub de blog, dark mode y menú mobile — todo renderiza correctamente, sin errores de consola.
