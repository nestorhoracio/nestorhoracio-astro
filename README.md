# nestorhoracio-astro

> Estado actual, changelog y próximos pasos: ver [ROADMAP.md](./ROADMAP.md). Contexto técnico y gotchas: ver [CLAUDE.md](./CLAUDE.md).

## Sobre el proyecto

Migración de **nestorhoracio.com** (portfolio/sitio profesional de desarrollo web) de WordPress (Divi) a Astro, para alojar en HostGator (hosting ya contratado, sin WordPress) en vez de Cloudflare Pages. Objetivo: velocidad de carga y SEO técnico.

## Stack técnico

- Astro (Content Collections, glob loader), CSS con custom properties, sin Tailwind.
- `astro:assets` para las imágenes.
- Formulario de contacto vía script PHP propio (HostGator soporta PHP; no se usa un servicio externo).
- Git + GitHub Actions (build) → deploy por FTP/SFTP a HostGator.

## Estado del proyecto

**El sitio ya build-ea y las 17 páginas se ven bien**: home (one-pager con hero, portfolio, servicios y sobre mí), hub de blog, 8 posts, 5 páginas de proyecto de portfolio, contacto (formulario funcional vía `contact.php`) y Política de Privacidad — todo con el diseño real portado (colores, tipografía, dark mode con scroll-spy, menú mobile). Falta: SEO completo, `.htaccess`, y todo el deploy — **pospuesto a pedido del usuario** hasta que el sitio esté terminado. Detalle completo en [ROADMAP.md](./ROADMAP.md).

## Instalación y desarrollo local

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # build estático a dist/
npm run preview    # sirve el build de dist/ localmente
npm run fetch:wp   # re-extrae el blog desde nestorhoracio.com (ver aviso en CLAUDE.md)
```

## Estructura del proyecto

```
nestorhoracio-astro/
├── CLAUDE.md              # contexto técnico + gotchas (cargado cada sesión)
├── ROADMAP.md             # estado, pendientes, changelog
├── README.md              # este archivo
├── astro.config.mjs
├── tsconfig.json
├── scripts/
│   └── fetch-wp-content.mjs   # extrae el blog desde la REST API de WP + limpia shortcodes de Divi
├── public/
│   ├── fonts/             # Blinker self-hosted (400/600)
│   ├── images/logo/       # isotipo real (claro/oscuro)
│   └── contact.php        # procesa el formulario de /contacto/ (único código server-side)
└── src/
    ├── content.config.ts  # collections: blog, portfolio
    ├── content/
    │   ├── blog/          # .md + portada por post
    │   └── portfolio/     # .md + captura por proyecto (5 proyectos reales)
    ├── styles/            # global.css (tokens), header.css, footer.css, home.css, blog.css, contact.css
    ├── layouts/
    │   └── Layout.astro
    ├── components/
    │   ├── Header.astro   # dark mode + scroll-spy + menú mobile
    │   └── Footer.astro
    └── pages/
        ├── index.astro                    # home one-pager (hero + #portfolio + #diseno-web + #sobre-mi)
        ├── blog/index.astro               # hub del blog
        ├── [slug].astro                   # plantilla plana para posts de blog Y proyectos de portfolio
        ├── contacto/index.astro           # formulario (POST a /contact.php)
        └── politica-de-privacidad/index.astro
```
