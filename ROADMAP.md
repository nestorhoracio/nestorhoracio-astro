# ROADMAP.md — nestorhoracio-astro

## Estado actual (2026-08-17)

**El sitio ya levanta y las 19 páginas se generan bien** (`npm run build` — verificado con capturas y scripts de Playwright en home, blog, portfolio, contacto, política de privacidad, 404, dark mode y menú mobile; sin errores de consola en ninguna ruta). Lo que existe:

- Scaffold de Astro (`package.json`, `astro.config.mjs`, `tsconfig.json`) — mismo patrón minimalista que jesuseselcamino-astro, sin starter template de por medio.
- `src/content.config.ts` con dos collections: `blog` (8 posts) y `portfolio` (6 proyectos, incluyendo Atalaias Rou — no está en el sitio WP original, se agregó a pedido del usuario con captura de su deploy temporal en Netlify, ver changelog).
- `scripts/fetch-wp-content.mjs` — extrae los posts del blog desde la REST API y limpia el contenido de Divi (ver CLAUDE.md, sección Gotchas).
- Diseño portado: `src/styles/global.css` (tokens), `header.css`, `footer.css`, `home.css`, `blog.css`, `contact.css`. Fuente Blinker self-hosted, logos reales en `public/images/logo/`.
- `Layout.astro`, `Header.astro` (dark mode con swap de logo + scroll-spy + menú mobile, todo funcional) y `Footer.astro`.
- Páginas: `index.astro` (home one-pager, con contenido real transcripto del sitio en vivo), `blog/index.astro` (hub), `[slug].astro` (plantilla plana compartida por posts de blog y proyectos de portfolio), `contacto/index.astro` + `public/contact.php` (formulario funcional, ver CLAUDE.md), `politica-de-privacidad/index.astro` (redactada de cero, ver CLAUDE.md).

**SEO, `.htaccess` y 404 ya están hechos** (JSON-LD por tipo de página, `robots.txt`, apple-touch-icon, página 404 propia). Lo que **no** existe todavía: una imagen OG de marca (1200×630, hoy el fallback es el isotipo circular) y todo lo de deploy (repo en GitHub, GitHub Actions, cuenta FTP) — **deploy queda para el final a pedido del usuario**, que quiere verlo bien terminado antes de subirlo. El usuario ya dio el visto bueno a la parte visual/UX ("para mi visión ya estaría pronto").

## Decisiones tomadas en la sesión de arranque (2026-08-17)

- **Hosting**: HostGator (ya contratado, 2 años), no Cloudflare Pages. Plan compartido básico: **sin SSH, sin Git Version Control, sin Node.js** (confirmado por el usuario revisando su cPanel).
- **Deploy**: GitHub Actions compila (`npm run build`) y sube `dist/` por FTP/SFTP a HostGator. Pendiente: crear el repo en GitHub, crear una cuenta FTP dedicada en cPanel (no usar la cuenta principal), armar el workflow y guardar las credenciales como secrets.
- **Formulario de contacto**: script PHP propio en HostGator (no Web3Forms). Pendiente de construir — necesita honeypot + validación server-side como mínimo.
- **Blog a futuro**: sin CMS, sin panel de edición. Publicar = agregar un `.md` a `src/content/blog/` + build + deploy. Decisión explícita del usuario, revisar si en algún momento pide agregar Decap CMS u otra cosa.
- **URLs/redirects/404 en Apache**: pendiente de armar `.htaccess` (no hay `_redirects`/`_headers` como en Cloudflare).
- **SSL**: pendiente confirmar que AutoSSL de cPanel esté activo para el dominio.
- **Orden de trabajo** (agregado 2026-08-17, sesión 2): el deploy se hace al final, cuando el usuario dé el OK — prioridad es dejar el sitio completo primero.

## Próximo (en orden sugerido)

**Deploy pospuesto a propósito** — decisión del usuario (2026-08-17, sesión 2): quiere ver el sitio bien terminado antes de subirlo a HostGator. No arrancar el repo en GitHub / GitHub Actions / cuenta FTP hasta que lo pida.

1. **Antes de subir en algún momento**: completar `$destinatario` en `public/contact.php` con el email real (hoy es un placeholder, ver CLAUDE.md) y que el usuario revise el texto de `politica-de-privacidad/index.astro` (lo redacté yo, es un borrador razonable pero no asesoramiento legal).
2. (Opcional, no bloqueante) Diseñar una imagen OG de marca 1200×630 — hoy el `og:image` cae al isotipo, que funciona pero no es un banner pensado para compartir en redes.
3. **Cuando el usuario pida arrancar el deploy**: repo en GitHub + GitHub Actions (build + FTP deploy) + cuenta FTP dedicada en cPanel + confirmar que nestorhoracio.com ya apunta a este hosting HostGator (si el WordPress actual vive en otro proveedor, hay que planear el corte de DNS) + SSL activo + probar en el hosting real que las reglas de `.htaccess` funcionan (`mod_rewrite`/`mod_expires`/`mod_headers`).

## Changelog

### 2026-08-17 (sesión 6) — SEO, .htaccess, 404, y fix real del bug de listas
El usuario dio el visto bueno a lo visual ("para mi visión ya estaría pronto") y pidió seguir con otra cosa — se avanzó con los pendientes técnicos que quedaban antes del deploy:
- **Bug de listas del blog, arreglado de verdad** (no solo diagnosticado): eran 4 posts, no 3 como decía CLAUDE.md, y el problema real no era solo la duplicación de wrapper sino que además cada paso de una secuencia quedaba como una lista de 1 solo ítem (`<ol start="1">` repetido en vez de un `<ol>` con varios `<li>`) — se veía "1. ... 1. ... 1." en vez de "1. 2. 3.". Arreglado con un script de una sola vez: colapsar duplicados + fusionar listas del mismo tipo separadas solo por una línea en blanco. Verificado con Playwright leyendo la cantidad real de `<li>` por `<ol>`/`<ul>` en el DOM, no solo mirando la captura.
- **SEO**: `src/lib/seo.ts` con helpers de JSON-LD (`WebSite` en el home, `BlogPosting` en los posts, `CreativeWork` en el portfolio, todos con `Person` compartido). `Layout.astro` ahora acepta `image`/`type`/`jsonLd`; los posts y proyectos pasan su propia portada como `og:image`/`twitter:image` real (vía `getImage`, no solo el isotipo genérico). Agregado `public/robots.txt` con referencia al sitemap y `apple-touch-icon`.
- **`src/pages/404.astro`**: página propia, con el mismo Layout/Header/Footer que el resto.
- **`public/.htaccess`**: fuerza HTTPS, fuerza `nestorhoracio.com` sin `www`, agrega `/` final cuando falta, `ErrorDocument 404 /404.html`, cache largo para `/_astro/`. No probado contra HostGator real todavía (recién se puede confirmar en el deploy).
- `npm run build`: 19 páginas (sumó la 404). Verificado con un script de Playwright que visita las 7 rutas principales y lee la consola: sin errores en ninguna.

### 2026-08-17 (sesión 5) — Fix de orden del nav (scroll-spy)
- El usuario notó que el menú "se salía mal" al hacer scroll y diagnosticó bien la causa: `Blog` (una página real, sin ancla) estaba metido en el medio de los 3 links de ancla (Portfolio/Servicios/Sobre Mí), así que el resaltado del scroll-spy "saltaba" un item muerto en el medio del recorrido visual.
- Reordenado `links` en `Header.astro`: Inicio → Portfolio → Servicios → Sobre Mí → Blog → Contacto (las anclas quedan contiguas, las páginas reales al final).
- Verificado con un script de Playwright que hace scroll a varias posiciones y lee las clases `is-active`: ahora resalta en secuencia limpia (Portfolio → Servicios → Sobre Mí), sin saltos.

### 2026-08-17 (sesión 4) — Mejoras de conversión/UX pedidas por el usuario
El usuario revisó el sitio y pidió mi opinión sobre qué mejorar antes de seguir con lo técnico. Propuse 4 puntos, dio el visto bueno para los 4:
- **CTA en el hero**: agregado botón "Hablemos por WhatsApp" (link real, mismo número que el footer: `wa.me/59898472684`) + botón secundario "Ver mi trabajo" (ancla a `#portfolio`). Nueva clase `.btn--outline` en `global.css`.
- **Prueba social**: agregada una fila de 3 stats bajo el CTA del hero (6 proyectos reales / 2 stacks / 100% código a medida). Deliberadamente **no** se agregaron testimonios ni citas de clientes — no hay testimonios reales disponibles y no correspondía inventarlos; los stats elegidos son datos verificables desde el propio sitio.
- **Placeholder de portada del blog**: los 3 posts sin imagen ahora muestran el isotipo de marca centrado sobre un degradé (en vez del rectángulo de color liso anterior). Clase `.post-card__placeholder` en `blog.css`.
- **Nav apretado en 800-1000px**: se revisó con capturas en 800/850/900/1000px — en realidad encaja bien en todo ese rango, no hacía falta ningún cambio (se descarta como falso positivo).
- `npm run build`: sigue en 18 páginas, sin errores. Verificado visualmente en claro y oscuro, sin errores de consola.

### 2026-08-17 (sesión 3) — Nuevo proyecto de portfolio: Atalaias Rou
- El usuario pidió agregar un 6to proyecto que no está en el sitio original: **Atalaias Rou** (`f:/proyecto astro abril 2026/atalaias-rou`), sitio de un ministerio evangélico (Atalaias Rou / IMTF Uruguay y Brasil) con portal de 20 radios en vivo + subsitios institucionales UY/BR. Deploy temporal en `https://atalaiasrou.netlify.app/` hasta pasar al dominio definitivo.
- Descripción y stack sacados del README.md real del proyecto (no inventados). Captura de portada tomada en vivo del deploy de Netlify con Playwright (con autorización explícita del usuario para sacar captura y descripción).
- Agregado `src/content/portfolio/atalaias-rou.md` (`order: 6`, mismo patrón que los otros 5) — aparece solo en el grid del home, no requirió tocar ningún componente.
- `npm run build`: 18 páginas. Verificado visualmente: la card nueva encaja bien en el grid (3×2) y la página de detalle se ve consistente con el resto.

### 2026-08-17 (sesión 2) — Commit inicial + formulario de contacto + Política de Privacidad
- Primer commit del repo (todo lo de la sesión 1: scaffold, contenido, diseño, home/blog/portfolio).
- El usuario revisó el sitio corriendo local y le pareció "más lindo que el original". Pidió mover el deploy al final (quiere verlo terminado antes de subirlo) y seguir con formulario de contacto + Política de Privacidad.
- `public/contact.php`: honeypot, validación server-side, sanitización anti header-injection, `mail()` nativo (sin dependencias). `$destinatario` queda como placeholder a propósito — no se asumió el email del usuario sin confirmar que sea el correcto para recibir mensajes del formulario.
- `src/pages/contacto/index.astro`: formulario + feedback de éxito/error vía query param (sin JS de fetch, POST normal a `/contact.php`). Agregado "Contacto" al nav del Header.
- `src/pages/politica-de-privacidad/index.astro`: redactada de cero (la real está vacía en WordPress) — refleja solo lo que el sitio hace de verdad (formulario por email, `localStorage` para dark mode, sin cookies/analítica), cita Ley N.º 18.331 (Uruguay). Linkeada desde el footer.
- `npm run build`: 17 páginas, sin errores. Verificado visualmente con Playwright: contacto (vacío y en estado `?ok=1`) y política de privacidad.

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
