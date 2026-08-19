# nestorhoracio-astro

> Estado actual, changelog y próximos pasos: ver [ROADMAP.md](./ROADMAP.md). Contexto técnico y gotchas: ver [CLAUDE.md](./CLAUDE.md).

## Sobre el proyecto

Migración de **nestorhoracio.com** (portfolio/sitio profesional de desarrollo web) de WordPress (Divi) a Astro, para alojar en HostGator (hosting ya contratado, sin WordPress) en vez de Cloudflare Pages. Objetivo: velocidad de carga y SEO técnico.

## Stack técnico

- Astro (Content Collections, glob loader), CSS con custom properties, sin Tailwind.
- `astro:assets` para las imágenes.
- Formulario de contacto vía script PHP propio (HostGator soporta PHP; no se usa un servicio externo).
- JSON-LD (`WebSite`/`BlogPosting`/`CreativeWork`) + `robots.txt` + `.htaccess` para Apache.
- Git + GitHub Actions (build) → deploy por FTP/SFTP a HostGator (pospuesto hasta que el usuario dé el OK).

## Estado del proyecto

**El sitio está en producción**: [nestorhoracio.com](https://nestorhoracio.com) ya sirve el sitio Astro (deploy completado y verificado el 2026-08-19). 19 páginas — home (one-pager con hero, portfolio, servicios y sobre mí), hub de blog, 8 posts, 6 proyectos de portfolio, contacto (formulario funcional vía `contact.php`), Política de Privacidad y 404 — con el diseño real portado (colores, tipografía, dark mode con scroll-spy, menú mobile), SEO (JSON-LD, `robots.txt`, imagen OG de marca propia) y seguridad (headers HTTP endurecidos, throttle en el formulario) confirmados en el hosting real. Repo en GitHub ([nestorhoracio/nestorhoracio-astro](https://github.com/nestorhoracio/nestorhoracio-astro)): cada push a `main` redeploya solo vía GitHub Actions + FTPS a HostGator. Queda pendiente el borrado definitivo de WordPress (pospuesto a propósito unos días). Detalle completo en [ROADMAP.md](./ROADMAP.md).

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
├── .github/
│   └── workflows/
│       └── deploy.yml     # build + deploy por FTPS a HostGator (push a main)
├── scripts/
│   └── fetch-wp-content.mjs   # extrae el blog desde la REST API de WP + limpia shortcodes de Divi
├── public/
│   ├── fonts/             # Blinker self-hosted (400/600)
│   ├── images/logo/       # isotipo real (claro/oscuro)
│   ├── contact.php        # procesa el formulario de /contacto/ (único código server-side)
│   ├── robots.txt
│   └── .htaccess          # https, sin www, trailing slash, 404, cache de assets
└── src/
    ├── content.config.ts  # collections: blog, portfolio
    ├── content/
    │   ├── blog/          # .md + portada por post (8 posts)
    │   └── portfolio/     # .md + captura por proyecto (6 proyectos reales)
    ├── lib/
    │   └── seo.ts          # helpers de JSON-LD (WebSite/BlogPosting/CreativeWork)
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
        ├── politica-de-privacidad/index.astro
        └── 404.astro
```
