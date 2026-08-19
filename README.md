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

**El sitio está terminado** (el usuario ya dio el visto bueno y aprobó la Política de Privacidad): 19 páginas — home (one-pager con hero, portfolio, servicios y sobre mí), hub de blog, 8 posts, 6 proyectos de portfolio, contacto (formulario funcional vía `contact.php`, con el email real ya configurado), Política de Privacidad y 404 — con el diseño real portado (colores, tipografía, dark mode con scroll-spy, menú mobile), SEO (JSON-LD, `robots.txt`, imagen OG de marca propia), seguridad (headers HTTP endurecidos, throttle en el formulario) y `.htaccess` para Apache. El deploy ya arrancó: repo en GitHub ([nestorhoracio/nestorhoracio-astro](https://github.com/nestorhoracio/nestorhoracio-astro)) y workflow de GitHub Actions (build + FTPS a HostGator) listos; falta que el usuario cree la cuenta FTP dedicada en cPanel y cargue los secrets. Detalle completo en [ROADMAP.md](./ROADMAP.md).

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
