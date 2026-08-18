#!/usr/bin/env node
// Extrae los posts del Blog desde la REST API de nestorhoracio.com y genera
// los .md + imagen de portada para la content collection `blog`.
//
// A diferencia de jesuseselcamino-astro, este sitio está armado con Divi:
// `content.rendered` no trae HTML final, trae shortcodes de Divi sin
// procesar (Divi no engancha `do_shortcode` al filtro REST). `cleanDivi()`
// destripa la estructura (section/row/column/text) y convierte los
// shortcodes de imagen/botón a HTML plano. Salida pensada para revisión
// manual — son pocos posts, no un pipeline de producción. Ver CLAUDE.md.
//
// Uso: node scripts/fetch-wp-content.mjs

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const SITE = "https://nestorhoracio.com";
const DIR = "src/content/blog";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

function decodeEntities(str) {
  return str
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&hellip;/g, "…")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&(?:lsquo|rsquo);/g, "'")
    .replace(/&(?:ldquo|rdquo);/g, '"');
}

function getAttr(tag, name) {
  const match = tag.match(new RegExp(`${name}="([^"]*)"`));
  return match ? match[1] : null;
}

// Convierte el contenido crudo de Divi (shortcodes) en HTML plano: tira los
// wrappers estructurales (section/row/column/text), convierte imagen/botón
// a <img>/<a>, y saca cualquier shortcode sobrante que no reconozca (mejor
// perder el wrapper que perder el texto adentro).
function cleanDivi(raw) {
  let html = raw
    // Divi texturiza comillas rectas a curvas dentro de los atributos de
    // shortcode en contenido legado — normalizamos antes de parsear attrs.
    .replace(/&#8220;|&#8221;/g, '"')
    .replace(/&#8216;|&#8217;/g, "'");

  html = html.replace(/\[et_pb_image\b([^\]]*)\]\s*\[\/et_pb_image\]/g, (_, attrs) => {
    const src = getAttr(attrs, "src");
    const alt = getAttr(attrs, "alt") || getAttr(attrs, "title_text") || "";
    return src ? `<img src="${src}" alt="${alt}">` : "";
  });

  html = html.replace(/\[et_pb_button\b([^\]]*)\]\s*\[\/et_pb_button\]/g, (_, attrs) => {
    const url = getAttr(attrs, "button_url");
    const text = getAttr(attrs, "button_text") || url;
    return url ? `<a class="btn" href="${url}">${text}</a>` : "";
  });

  // Wrappers puramente estructurales: se descartan, se conserva el interior.
  html = html.replace(/\[\/?et_pb_(section|row|column|text)\b[^\]]*\]/g, "");

  // Cualquier otro shortcode de Divi no contemplado arriba (blurb, divider,
  // gallery, code, etc.) — se descarta el wrapper, se conserva el interior.
  html = html.replace(/\[\/?et_pb_[a-z_]+\b[^\]]*\]/g, "");

  // Algunos posts (más recientes) no usan la sintaxis [et_pb_*] sino el HTML
  // que Divi ya renderiza (<div class="et_pb_section ...">...). No hay
  // ningún <div> con valor semántico en este contenido — todos son wrappers
  // de layout de Divi — así que se tiran todos y se conserva el interior
  // (h2/p/etc.).
  html = html.replace(/<\/?div\b[^>]*>/g, "");

  html = html
    .replace(/ style="[^"]*"/g, "")
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return html;
}

function stripTags(html) {
  return decodeEntities(html.replace(/<[^>]+>/g, ""))
    .replace(/\s+/g, " ")
    .trim()
    // El excerpt truncado por WP termina en "[…]" — se ve mejor como "…".
    .replace(/\s*\[…\]$/, "…");
}

async function fetchJson(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} — ${url}`);
  return res.json();
}

async function fetchAllPosts() {
  const posts = [];
  let page = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const url = `${SITE}/wp-json/wp/v2/posts?per_page=50&page=${page}&orderby=date&order=asc&_embed=1`;
    const batch = await fetchJson(url);
    if (!Array.isArray(batch) || batch.length === 0) break;
    posts.push(...batch);
    if (batch.length < 50) break;
    page += 1;
  }
  return posts;
}

async function downloadImage(url, destPath) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`No se pudo bajar la imagen: ${res.status} ${url}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  await writeFile(destPath, buffer);
}

const yamlString = (value) => JSON.stringify(value);

async function main() {
  await mkdir(DIR, { recursive: true });

  const posts = await fetchAllPosts();
  console.log(`${posts.length} posts encontrados`);

  let ok = 0;
  const warnings = [];

  for (const post of posts) {
    const slug = post.slug;
    const title = decodeEntities(post.title?.rendered ?? "").trim();
    const date = (post.date ?? "").slice(0, 10);
    const bodyHtml = decodeEntities(cleanDivi((post.content?.rendered ?? "").trim()));
    const description = stripTags(post.excerpt?.rendered ?? "");

    const terms = (post._embedded?.["wp:term"] ?? []).flat();
    const category = terms.find((t) => t.taxonomy === "category" && t.slug !== "uncategorized");
    const categoryName = category ? decodeEntities(category.name) : "Sin categoría";

    const media = post._embedded?.["wp:featuredmedia"]?.[0];
    // Sin imagen destacada en WP: varios posts (sobre todo los más viejos,
    // de solo texto) no tienen una. Si hay al menos una <img> en el cuerpo
    // ya limpiado, se usa esa como cover (no se saca del cuerpo, es
    // contenido real del post, no un embed a deduplicar). Si no hay
    // ninguna, el post queda sin cover (campo optativo).
    const firstBodyImage = bodyHtml.match(/<img[^>]+src="([^"]+)"/);
    const imageUrl = media?.source_url || firstBodyImage?.[1] || null;

    const frontmatterLines = [
      `title: ${yamlString(title)}`,
      `date: ${date}`,
      `category: ${yamlString(categoryName)}`,
      `description: ${yamlString(description)}`,
    ];

    if (imageUrl) {
      const ext = path.extname(new URL(imageUrl).pathname) || ".webp";
      const imageFilename = `${slug}${ext}`;
      await downloadImage(imageUrl, path.join(DIR, imageFilename));
      frontmatterLines.push(`cover: ${yamlString(`./${imageFilename}`)}`);
    } else {
      warnings.push(`${slug}: sin imagen destacada ni imágenes en el cuerpo, queda sin cover`);
    }

    const frontmatter = `---\n${frontmatterLines.join("\n")}\n---\n`;
    const fileContent = bodyHtml ? `${frontmatter}\n${bodyHtml}\n` : frontmatter;

    await writeFile(path.join(DIR, `${slug}.md`), fileContent, "utf-8");
    ok += 1;
  }

  console.log(`blog: ${ok}/${posts.length} generados`);
  if (warnings.length) {
    console.log(`Avisos (${warnings.length}):`);
    for (const w of warnings) console.log(`  - ${w}`);
  }
  console.log(
    "\nOJO: el contenido viene de shortcodes de Divi destripados por regex, no de un parser real." +
      " Revisar cada .md generado antes de darlo por bueno (puede quedar algún shortcode raro sin limpiar).",
  );
}

await main();
