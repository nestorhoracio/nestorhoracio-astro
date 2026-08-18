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
- **Páginas** (`/wp-json/wp/v2/pages`): Inicio, Portfolio (hub), 5 páginas de proyecto (Barraca Hefesto, 252 Plaza, Santa Isabel FM, Mimosos, Jesús es el Camino), Servicios, Sobre Mí, Blog (hub), Política de Privacidad. **Estas páginas todavía no se migraron** — ver "Pendiente" abajo.

## Gotchas / hallazgos técnicos

- **El sitio está armado con Divi, y `content.rendered` de la REST API NO trae HTML final.** Esto es la diferencia más importante con jesuseselcamino-astro (que sí traía HTML limpio). Hay dos formatos de contenido crudo, según cuándo/cómo se escribió cada pieza:
  1. **Shortcodes de Divi sin procesar**: `[et_pb_section ...][et_pb_row ...][et_pb_column ...][et_pb_text ...]<p>...</p>[/et_pb_text]...`. Lo tienen las 5 páginas de portfolio y las páginas fijas (Inicio, Servicios, etc.) — todas construidas con el Divi Visual Builder clásico.
  2. **HTML ya renderizado por Divi pero con toda la sopa de `<div class="et_pb_section ...">` de por medio** (sin corchetes). Lo tienen algunos posts del blog.
  3. Un tercer grupo de posts (los 3 más "técnicos", sobre Divi/CPT) están escritos en **Gutenberg puro**, HTML limpio de entrada — no necesitan limpieza.
  - `scripts/fetch-wp-content.mjs` tiene una función `cleanDivi()` que destripa los tres casos con regex (no es un parser real de shortcodes: tira los wrappers estructurales — section/row/column/text/div — y convierte `et_pb_image`/`et_pb_button` a `<img>`/`<a>`). Funciona bien para los 8 posts del blog (revisados a mano el 2026-08-17). **No está probado contra las páginas de portfolio/fijas** — esas van a necesitar revisión manual post por post, no solo correr el script, porque además tienen layout real (columnas, imagen al lado de botón) que no tiene sentido reconstruir a partir del shortcode limpio — mejor maquetarlas a mano en Astro con el contenido real como referencia.
  - Las comillas dentro de los atributos de shortcode a veces vienen texturizadas por WP (`&#8220;`/`&#8221;` en vez de `"`) — `cleanDivi()` las normaliza antes de parsear atributos.
- **Algunos posts del blog no tienen imagen destacada** (featured_media: 0) ni imágenes en el cuerpo (son artículos de solo texto: `salto-de-ancla`, `ia-asistente-profesional`, `cpt-vs-modulos-manuales`). Por eso `cover` es **opcional** en el schema de `blog` (a diferencia de jesuseselcamino-astro, donde `cover` es obligatorio en podcast/ninos). El post `95-en-pagespeed-movil` no tenía featured image pero sí 3 imágenes en el cuerpo — el script usa la primera como cover y **no** las saca del cuerpo (son contenido real, capturas de PageSpeed, no un embed a deduplicar).
- **Permalinks reales terminan en `/`** (confirmado vía REST API, ej. `/barraca-hefesto/`, `/como-protejo-y-acelero-los-sitios-web/`) → `trailingSlash: 'always'` en `astro.config.mjs`, igual que jesuseselcamino-astro.
- **3 de los 8 posts del blog tienen un bug de WordPress preexistente**: listas `<ol>`/`<ul>` duplicadas anidadas (`<ol><ol><li>...</li></ol></ol>` en vez de `<ol><li>...</li></ol>`). Viene así del contenido original (bug de conversión de bloques de WordPress, no algo que introdujo el script de limpieza) — visualmente puede no notarse pero no es HTML válido. Pendiente decidir si se limpia a mano o se deja (no rompe nada, solo es ruido semántico).
- **Hosting sin SSH/Git/Node** (confirmado por el usuario el 2026-08-17): el deploy tiene que ser GitHub Actions + FTP, no hay alternativa server-side.

## Arquitectura real del sitio (relevado 2026-08-17, vía HTML en vivo, no REST API)

**Home (`/`) es un one-pager real**, no hay páginas separadas para Portfolio/Servicios/Sobre Mí:
- Hero: "Néstor Horacio Díaz" + tagline + párrafo.
- `#portfolio` ("Mi trabajo"): grid de 5 cards (screenshot + título + bajada corta), cada una linkeando a su página de detalle (`/barraca-hefesto/`, `/252-plaza/`, `/santa-isabel-fm/`, `/mimosos/`, `/jesus-es-el-camino/` — permalinks planos, sin prefijo).
- `#diseno-web` ("Lo que puedo hacer por tu negocio" — el link de nav dice "Servicios" pero el copy real dice otra cosa): 4 bloques de servicio + "¿Por qué trabajar conmigo?".
- `#sobre-mi` ("Sobre MI"): bio + 3 subsecciones.
- Footer: social follow (Facebook/Instagram/WhatsApp), link a Blog, copyright.

**IMPORTANTE — la página WP `/portfolio/` NO se usa.** El nav real linkea "Portfolio" a `#portfolio` (ancla en el home), no a `/portfolio/`. La página `/portfolio/` existe en WordPress pero tiene contenido de borrador/staging sin relación (casos de estudio genéricos de "Climatización", "Inmobiliaria" — parece ser un sales page a medio escribir, no publicado ni linkeado desde ningún lado). **No migrar esa página** — no hace falta un hub de portfolio, las 5 cards viven en el home.

**Política de Privacidad está vacía en el sitio real** (confirmado tanto por REST API como por el HTML en vivo — no hay contenido entre el nav y el footer). Hay que escribirla de cero — no inventar el texto legal sin que el usuario lo revise/apruebe.

Permalinks reales confirmados: blog y portfolio son **planos**, sin prefijo (`/mi-post/`, `/mi-proyecto/`), salvo el hub `/blog/`. Mismo patrón que jesuseselcamino-astro: un solo `src/pages/[slug].astro` sirviendo ambas collections.

## Diseño

Relevado el 2026-08-17 a partir de capturas de pantalla (desktop + mobile devtools) y de `functions.php`/`style.css`/`dark-mode.js`/`menu-scroll.js` del child theme real (el usuario los bajó de cPanel a la raíz del proyecto, se leyeron y se descartaron — no quedan en el repo). Los tokens de color/tipografía ya están portados en `src/styles/global.css`; lo que sigue es lo que falta portar cuando se construyan los componentes.

- **Tipografía**: Blinker (Google Font, self-hosted, pesos 400/600) — ya en `public/fonts/` + `@font-face` en `global.css`. El theme original precargaba (`<link rel="preload">`) solo el peso regular en el `<head>` — replicar en `Layout.astro`.
- **Logo**: isotipo circular NH. Dos variantes según modo (bajadas a `public/images/logo/`): `isotipo-full-color.png` (claro) e `isotipo-black.png` (oscuro).
- **Header**: fixed, altura 60px (50px en mobile ≤980px), fondo `#0F0F0F` siempre (no cambia con dark mode). Nav flotante en forma de píldora, texto uppercase, hover/activo en `--color-secundario` (ámbar). En mobile colapsa a hamburguesa con menú desplegable del mismo fondo oscuro.
- **Home es one-page**: confirmado por el propio usuario en un post del blog ("Has creado una hermosa página web One-Page con Divi"). Anchors reales encontrados en el CSS/JS: `#infoproductos` (la sección "Mi trabajo" / portfolio), `#diseno-web`, `#sobre-mi`. El menú resalta el link activo hciendo scroll-spy (`menu-scroll.js`: mide `offsetTop` de cada sección contra `scroll + headerHeight + 50px`, agrega clase `active-link`) — portar esta lógica al FloatingNav/Header cuando se construya, adaptando los selectors (ya no van a ser `.et-menu`/`.et_pb_section`).
- **Dark mode**: toggle circular fijo abajo a la derecha (ícono de luna SVG, `#F2D22E`), 25px de los bordes. Lógica (`dark-mode.js`): respeta `prefers-color-scheme` si no hay preferencia guardada, guarda en `localStorage` (`darkMode: "enabled"/"disabled"`), aplica clase `dark-mode` en `<body>`, y **además cambia el `src` del logo** (swap entre las dos variantes de arriba). Replicar como script cliente al construir el Header — los nombres de variables CSS ya están listos para esto en `global.css` (bloque `body.dark-mode`).
- **Botones**: clase `.btn` en `global.css` (antes `.et_pb_button`/`.nh-btn`). Texto "Leer más" (no "Read more") en cualquier CTA de tipo "seguir leyendo" — era un filtro de Divi (`et_read_more_button_text`) que hay que respetar como convención propia, no como código a portar.
- **Grid de cards del blog**: 3 columnas desktop → 2 (≤980px) → 1 (≤580px), `gap: 24px`, cards con `border-radius: 12px`, borde 1px `--color-primario` que pasa a `--color-secundario` en hover, imagen de portada `height: 220px` con `object-fit: cover`, título `1.1rem`, extracto `0.9rem`. Fondo de card `--bg-superficie`.
- **Footer**: fondo `#0F0F0F` siempre, texto `#CCCCCC` @ 0.85 opacidad, iconos sociales centrados. Links reales: Facebook `facebook.com/nhdigitalspace`, Instagram `instagram.com/nh_digital_space`, WhatsApp `wa.me/59898472684` — con `aria-label` en español en cada uno (era un filtro PHP sobre el output de Divi; en Astro estos van directo como atributo en el markup, no hace falta el filtro).
- **Secciones alternadas**: en el home, las secciones de Divi alternan `--bg-principal`/`--bg-superficie` por `nth-child(even)` — replicar ese alternado en la maquetación de las secciones del home cuando se construya.

## Formulario de contacto y Política de Privacidad

- `public/contact.php` — el único código server-side del sitio. Astro copia todo `public/` tal cual a `dist/`, así que esto viaja con el build y HostGator lo ejecuta directo (no pasa por Astro/Node en ningún momento). Recibe el POST de `/contacto/`, valida (honeypot + campos requeridos + `filter_var` email), sanitiza contra header injection, y manda el mail con `mail()` nativo de PHP — sin librería ni dependencia externa. Redirige de vuelta a `/contacto/?ok=1` o `?error=...`, y la página Astro (`src/pages/contacto/index.astro`) lee ese query param con un `<script>` inline para mostrar el mensaje — no hace falta JS de fetch/AJAX, funciona con un POST normal.
- **`$destinatario` en `contact.php` es un placeholder** (`PON-TU-EMAIL-AQUI@nestorhoracio.com`) — hay que completarlo con el email real antes de subir a HostGator. No se asumió `nesthora@gmail.com` (el email del usuario en este entorno) porque no está confirmado que sea la casilla que debe recibir los mensajes del formulario del sitio.
- Política de Privacidad (`src/pages/politica-de-privacidad/index.astro`): redactada de cero por Claude a pedido explícito del usuario (la del sitio real estaba vacía, ver arriba). Refleja únicamente lo que el sitio realmente hace hoy — formulario de contacto vía email, preferencia de dark mode en `localStorage`, sin cookies/analítica/terceros — y cita la Ley N.º 18.331 de Uruguay. **Es un borrador razonable, no asesoramiento legal** — si en algún momento se agrega Analytics, un CMS, o cualquier otra recolección de datos, esta página hay que actualizarla.

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
