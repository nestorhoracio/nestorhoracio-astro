import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// Blog: migrado desde WordPress (Divi). El campo `content.rendered` de la
// REST API trae shortcodes de Divi sin procesar, no HTML final — el script
// de fetch los limpia antes de generar estos .md. Ver CLAUDE.md.
const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.coerce.date(),
      category: z.string(),
      description: z.string(),
      // Optativa: varios posts del blog no tienen imagen destacada en WP ni
      // imágenes en el cuerpo (son artículos de solo texto). Ver CLAUDE.md.
      cover: image().optional(),
    }),
});

// Portfolio: los 5 proyectos reales, transcriptos a mano desde el HTML en
// vivo de cada página (la REST API para estas sí trae contenido real, no
// como Home/Portfolio-hub — ver CLAUDE.md). `summary` es la bajada corta
// que aparece en la card del home; el body es "El proyecto"/"La solución".
const portfolio = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/portfolio" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      liveUrl: z.string().url(),
      stack: z.string(),
      order: z.number(),
      cover: image(),
    }),
});

export const collections = { blog, portfolio };
