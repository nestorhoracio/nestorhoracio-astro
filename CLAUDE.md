# CLAUDE.md — nestorhoracio-astro

## Qué es este proyecto

Migración de **nestorhoracio.com** (portfolio/sitio profesional de Néstor Horacio, desarrollador web freelance en Uruguay), de WordPress (Divi) a Astro. A diferencia de [jesuseselcamino-astro](../jesuseselcamino-astro) (que deployea en Cloudflare Pages), este sitio se aloja en **HostGator** (hosting compartido ya contratado por 2 años), sin WordPress.

Objetivo: velocidad de carga y SEO técnico — y de paso, es el propio caso de estudio del developer (el sitio que vende sus servicios de migración a Astro, migrado a Astro).

## Stack

- Astro (Content Collections, glob loader) — sin Tailwind, CSS con custom properties.
- `astro:assets` para imágenes.
- `@astrojs/sitemap`.
- Formulario de contacto: script PHP propio alojado en HostGator (no Web3Forms — decisión explícita del usuario, ver ROADMAP.md sesión 2026-08-17).
- Deploy: GitHub Actions → build → sube `dist/` por FTP/SFTP a HostGator. El hosting es compartido básico (sin SSH, sin Git Version Control, sin Node.js en el servidor — confirmado por el usuario), así que el build **no puede correr en HostGator**: corre en el runner de GitHub y solo se sube el output estático.

## Fuente de verdad del contenido a migrar

`nestorhoracio.com` tiene la REST API de WordPress abierta y sin bloqueos (a diferencia de jesuseselcamino.uy no hace falta User-Agent especial, aunque el script lo manda igual por las dudas). Relevado el 2026-08-17:

- **Blog**: 8 posts reales (la categoría "Uncategorized" con count 0 no aporta nada; los conteos de 6+3 que muestra `/wp-json/wp/v2/categories` no coinciden 1:1 con `/wp-json/wp/v2/posts` porque un post puede tener dos categorías — confirmar si hace falta exactitud). Categorías reales: **diseño web** (slug `diseno-web`) e **IA y Desarrollo web** (slug `ia-y-desarrollo-web`).
- **Páginas** (`/wp-json/wp/v2/pages`): Inicio, Portfolio (hub, no se usa — ver "Arquitectura real" abajo), 5 páginas de proyecto (Barraca Hefesto, 252 Plaza, Santa Isabel FM, Mimosos, Jesús es el Camino), Servicios, Sobre Mí (estas dos últimas resultaron ser anclas del home, no páginas reales — ver abajo), Blog (hub), Política de Privacidad. Ya migradas todas las que correspondía migrar.

## Gotchas / hallazgos técnicos

- **El sitio está armado con Divi, y `content.rendered` de la REST API NO trae HTML final.** Esto es la diferencia más importante con jesuseselcamino-astro (que sí traía HTML limpio). Hay dos formatos de contenido crudo, según cuándo/cómo se escribió cada pieza:
  1. **Shortcodes de Divi sin procesar**: `[et_pb_section ...][et_pb_row ...][et_pb_column ...][et_pb_text ...]<p>...</p>[/et_pb_text]...`. Las 5 páginas de portfolio y las páginas fijas de WP (Inicio, etc.) las tienen así — todas construidas con el Divi Visual Builder clásico.
  2. **HTML ya renderizado por Divi pero con toda la sopa de `<div class="et_pb_section ...">` de por medio** (sin corchetes). Lo tienen algunos posts del blog.
  3. Un tercer grupo de posts (los 3 más "técnicos", sobre Divi/CPT) están escritos en **Gutenberg puro**, HTML limpio de entrada — no necesitan limpieza.
  - `scripts/fetch-wp-content.mjs` tiene una función `cleanDivi()` que destripa los tres casos con regex (no es un parser real de shortcodes: tira los wrappers estructurales — section/row/column/text/div — y convierte `et_pb_image`/`et_pb_button` a `<img>`/`<a>`). Funciona bien para los 8 posts del blog. Las 6 páginas de portfolio (y Home) **no se migraron con el script** — se maquetaron a mano en Astro usando el contenido real (de la REST API para las páginas de proyecto, del HTML en vivo para Home — ver "Arquitectura real" abajo) como referencia, porque además tienen layout propio (columnas, imagen al lado de botón) que no tiene sentido reconstruir a partir del shortcode limpio.
  - Las comillas dentro de los atributos de shortcode a veces vienen texturizadas por WP (`&#8220;`/`&#8221;` en vez de `"`) — `cleanDivi()` las normaliza antes de parsear atributos.
- **Algunos posts del blog no tienen imagen destacada** (featured_media: 0) ni imágenes en el cuerpo (son artículos de solo texto: `salto-de-ancla`, `ia-asistente-profesional`, `cpt-vs-modulos-manuales`). Por eso `cover` es **opcional** en el schema de `blog` (a diferencia de jesuseselcamino-astro, donde `cover` es obligatorio en podcast/ninos). El post `95-en-pagespeed-movil` no tenía featured image pero sí 3 imágenes en el cuerpo — el script usa la primera como cover y **no** las saca del cuerpo (son contenido real, capturas de PageSpeed, no un embed a deduplicar).
- **Permalinks reales terminan en `/`** (confirmado vía REST API, ej. `/barraca-hefesto/`, `/como-protejo-y-acelero-los-sitios-web/`) → `trailingSlash: 'always'` en `astro.config.mjs`, igual que jesuseselcamino-astro.
- **4 de los 8 posts del blog tenían un bug de WordPress preexistente** (resuelto a mano el 2026-08-17, sesión 6): cada `<li>` venía envuelto en su propio `<ol>`/`<ul>` **duplicado** (`<ol><ol><li>...</li></ol></ol>`) y además **no continuo** — una lista de 4 pasos eran 4 `<ol start="1">` separados en vez de un solo `<ol>` con 4 `<li>`, así que se veía "1. ... 1. ... 1. ... 1." en vez de "1. 2. 3. 4.". No era algo que introdujo el script de limpieza, venía así del contenido original (bug de conversión de bloques de WordPress). Se arregló con un script de una sola vez (colapsar aperturas/cierres duplicados, después fusionar listas del mismo tipo separadas solo por una línea en blanco) — no quedó como parte de `fetch-wp-content.mjs` porque es específico de estos 4 posts ya migrados, no algo que vaya a repetirse.
- **Hosting sin SSH/Git/Node** (confirmado por el usuario el 2026-08-17): el deploy tiene que ser GitHub Actions + FTP, no hay alternativa server-side.

## Arquitectura real del sitio (relevado 2026-08-17, vía HTML en vivo, no REST API)

**Home (`/`) es un one-pager real**, no hay páginas separadas para Portfolio/Servicios/Sobre Mí:
- Hero: "Néstor Horacio Díaz" + tagline + párrafo.
- `#portfolio` ("Mi trabajo"): grid de cards (screenshot + título + bajada corta), cada una linkeando a su página de detalle (`/barraca-hefesto/`, `/252-plaza/`, `/santa-isabel-fm/`, `/mimosos/`, `/jesus-es-el-camino/`, `/atalaias-rou/` — permalinks planos, sin prefijo). **Atalaias Rou no está en el sitio WP original** — se agregó a pedido del usuario (sesión 3, ver ROADMAP.md), es un proyecto real en `f:/proyecto astro abril 2026/atalaias-rou` con deploy temporal en Netlify. El resto de la collection `portfolio` sí viene 1:1 del sitio real.
- `#diseno-web` ("Lo que puedo hacer por tu negocio" — el link de nav dice "Servicios" pero el copy real dice otra cosa): 4 bloques de servicio + "¿Por qué trabajar conmigo?".
- `#sobre-mi` ("Sobre MI"): bio + 3 subsecciones.
- Footer: social follow (Facebook/Instagram/WhatsApp), link a Blog, copyright.

**IMPORTANTE — la página WP `/portfolio/` NO se usa.** El nav real linkea "Portfolio" a `#portfolio` (ancla en el home), no a `/portfolio/`. La página `/portfolio/` existe en WordPress pero tiene contenido de borrador/staging sin relación (casos de estudio genéricos de "Climatización", "Inmobiliaria" — parece ser un sales page a medio escribir, no publicado ni linkeado desde ningún lado). **No migrar esa página** — no hace falta un hub de portfolio, las 5 cards viven en el home.

**Política de Privacidad está vacía en el sitio real** (confirmado tanto por REST API como por el HTML en vivo — no hay contenido entre el nav y el footer). Hay que escribirla de cero — no inventar el texto legal sin que el usuario lo revise/apruebe.

Permalinks reales confirmados: blog y portfolio son **planos**, sin prefijo (`/mi-post/`, `/mi-proyecto/`), salvo el hub `/blog/`. Mismo patrón que jesuseselcamino-astro: un solo `src/pages/[slug].astro` sirviendo ambas collections.

## Diseño

Relevado el 2026-08-17 a partir de capturas de pantalla (desktop + mobile devtools) y de `functions.php`/`style.css`/`dark-mode.js`/`menu-scroll.js` del child theme real (el usuario los bajó de cPanel a la raíz del proyecto, se leyeron y se descartaron — no quedan en el repo). Todo lo de acá ya está portado y construido; queda como referencia de dónde salió cada decisión de diseño.

- **Tipografía**: Blinker (Google Font, self-hosted, pesos 400/600) — en `public/fonts/` + `@font-face` en `global.css`, con preload del peso regular en `Layout.astro` (igual que hacía el theme original).
- **Logo**: isotipo circular NH. Dos variantes según modo, en `public/images/logo/`: `isotipo-full-color.png` (claro) e `isotipo-black.png` (oscuro).
- **Header** (`Header.astro` + `header.css`): fixed, altura 60px (50px en mobile ≤980px), fondo `#0F0F0F` siempre (no cambia con dark mode). Nav flotante en forma de píldora, texto uppercase, hover/activo en `--color-secundario` (ámbar). En mobile colapsa a hamburguesa con menú desplegable del mismo fondo oscuro.
- **Home es one-page**: confirmado por el propio usuario en un post del blog ("Has creado una hermosa página web One-Page con Divi"). El CSS/JS original usaba `#infoproductos` como id de la sección "Mi trabajo"; el sitio real ya lo había renombrado a `#portfolio` (el nav en vivo lo confirma) — la implementación usa `#portfolio`, no `#infoproductos`. El scroll-spy (lógica portada de `menu-scroll.js` al script inline de `Header.astro`) mide `offsetTop` de cada sección contra `scroll + headerHeight + 50px` y agrega la clase `is-active` al link del nav correspondiente.
- **Dark mode**: toggle circular fijo abajo a la derecha (ícono de luna SVG, `#F2D22E`), 25px de los bordes. Lógica (portada de `dark-mode.js` al script inline de `Header.astro`): respeta `prefers-color-scheme` si no hay preferencia guardada, guarda en `localStorage` (`darkMode: "enabled"/"disabled"`), aplica clase `dark-mode` en `<body>`, y **además cambia el `src` del logo** (swap entre las dos variantes de arriba).
- **Botones**: clase `.btn` en `global.css` (antes `.et_pb_button`/`.nh-btn`) + `.btn--outline` (variante agregada en sesión 4, no existía en el original). Texto "Leer más" (no "Read more") en cualquier CTA de tipo "seguir leyendo" — era un filtro de Divi (`et_read_more_button_text`), acá es solo una convención de copy, no hay filtro que replicar.
- **Grid de cards del blog** (`blog.css`): 3 columnas desktop → 2 (≤980px) → 1 (≤580px), `gap: 24px`, cards con `border-radius: 12px`, borde 1px `--color-primario` que pasa a `--color-secundario` en hover, imagen de portada `height: 220px` con `object-fit: cover`, título `1.1rem`, extracto `0.9rem`. Fondo de card `--bg-superficie`. Los posts sin portada muestran `.post-card__placeholder` (isotipo sobre degradé, agregado en sesión 4).
- **Footer** (`Footer.astro` + `footer.css`): fondo `#0F0F0F` siempre, texto `#CCCCCC` @ 0.85 opacidad, iconos sociales centrados. Links reales: Facebook `facebook.com/nhdigitalspace`, Instagram `instagram.com/nh_digital_space`, WhatsApp `wa.me/59898472684`, con `aria-label` en español en cada uno directo en el markup (en WP era un filtro PHP sobre el output de Divi).
- **Secciones alternadas**: en el home, las secciones de Divi alternaban `--bg-principal`/`--bg-superficie` por `nth-child(even)` — portado igual en `home.css` (`.section:nth-of-type(even)`).

## Formulario de contacto y Política de Privacidad

- `public/contact.php` — el único código server-side del sitio. Astro copia todo `public/` tal cual a `dist/`, así que esto viaja con el build y HostGator lo ejecuta directo (no pasa por Astro/Node en ningún momento). Recibe el POST de `/contacto/`, valida (honeypot + campos requeridos + `filter_var` email), sanitiza contra header injection, y manda el mail con `mail()` nativo de PHP — sin librería ni dependencia externa. Redirige de vuelta a `/contacto/?ok=1` o `?error=...`, y la página Astro (`src/pages/contacto/index.astro`) lee ese query param con un `<script>` inline para mostrar el mensaje — no hace falta JS de fetch/AJAX, funciona con un POST normal.
- **`$destinatario` en `contact.php` es un placeholder** (`PON-TU-EMAIL-AQUI@nestorhoracio.com`) — hay que completarlo con el email real antes de subir a HostGator. No se asumió `nesthora@gmail.com` (el email del usuario en este entorno) porque no está confirmado que sea la casilla que debe recibir los mensajes del formulario del sitio.
- Política de Privacidad (`src/pages/politica-de-privacidad/index.astro`): redactada de cero por Claude a pedido explícito del usuario (la del sitio real estaba vacía, ver arriba). Refleja únicamente lo que el sitio realmente hace hoy — formulario de contacto vía email, preferencia de dark mode en `localStorage`, sin cookies/analítica/terceros — y cita la Ley N.º 18.331 de Uruguay. El usuario la leyó y la aprobó el 2026-08-18 (ver ROADMAP.md, sesión 9). **Sigue sin ser asesoramiento legal formal** — si en algún momento se agrega Analytics, un CMS, o cualquier otra recolección de datos, esta página hay que actualizarla (y probablemente pedir otra revisión).

## SEO

- `src/lib/seo.ts`: helpers de JSON-LD (`websiteSchema`, `articleSchema`, `creativeWorkSchema`) con un `AUTHOR` (Person) compartido. `Layout.astro` acepta `image`/`type`/`jsonLd` opcionales — cuando no se pasa `image`, cae a `public/images/og/og-default.png` (banner de marca 1200×630, ver más abajo) como default de `og:image`/`twitter:image`. Home usa `WebSite`, posts del blog usan `BlogPosting`, portfolio usa `CreativeWork`.
- `public/robots.txt` + `public/.htaccess` (ver más abajo) + `src/pages/404.astro` (Astro lo compila a `dist/404.html`, no `/404/index.html` — por eso el `.htaccess` apunta a `/404.html`).
- **Imagen OG de marca** (`public/images/og/og-default.png`, 1200×630, sesión 2026-08-18): generada con Playwright (`npx playwright screenshot --viewport-size "1200,630"` sobre un HTML standalone con fuente Blinker y logo embebidos como data URI, ver changelog en ROADMAP.md sesión 10) — no es una captura del sitio, es una pieza de marca aparte, no versionada como script porque es un artefacto de una sola vez. Ojo con los PNG de `public/images/logo/`: **son opacos** (color type 3, sin canal alfa, sin `tRNS`) — el "círculo" es en realidad un cuadrado blanco de fondo; usarlos a tamaño grande sobre un fondo oscuro sin enmascarar se ve como una caja blanca. En el banner OG se resolvió metiendo el logo dentro de un contenedor con `border-radius` + `overflow: hidden` (efecto "app icon"), no editando el PNG.

## `.htaccess` (Apache / HostGator)

`public/.htaccess` es el único punto de configuración de servidor de todo el sitio (se copia tal cual a `dist/.htaccess` — confirmado que Astro SÍ copia archivos que empiezan con punto). Hace: forzar HTTPS, forzar `nestorhoracio.com` sin `www` (coherente con `site` en `astro.config.mjs`), agregar `/` final cuando falta (coherente con `trailingSlash: 'always'`), `ErrorDocument 404 /404.html`, cache largo para assets con hash en `/_astro/`. **No probado contra el HostGator real todavía** — recién se puede confirmar que las reglas de `mod_rewrite`/`mod_expires`/`mod_headers` funcionan como se espera una vez deployado (los módulos deberían estar disponibles en cualquier hosting compartido estándar, pero no está de más revisarlo).

## No tocar sin avisar

- El User-Agent del script de fetch (aunque nestorhoracio.com no lo necesite, por si en el futuro el sitio agrega Cloudflare/WAF).
- El schema de `blog` en `src/content.config.ts`: `cover` es opcional a propósito (ver Gotchas).

## Comandos útiles

```bash
npm run dev            # http://localhost:4321
npm run build
npm run preview
npm run fetch:wp        # re-extrae el blog desde nestorhoracio.com (pisa src/content/blog/)
```
