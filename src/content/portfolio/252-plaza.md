---
title: "252 Plaza"
summary: "Mercado gastronómico con 4 marcas independientes, asistente IA por local y dark mode."
liveUrl: "https://252plaza.netlify.app/"
stack: "Astro · CSS Custom Properties · Claude API (Haiku) · Netlify Functions · Google Fonts · Deploy automático desde GitHub"
order: 2
cover: "./252-plaza.jpg"
---

<p>Sitio web para mercado gastronómico ubicado en Ruta 5, Km 252, Paso de los Toros, Uruguay.</p>

<h2>El proyecto</h2>

<p>252 Plaza es un mercado gastronómico con 4 locales independientes — Pizzería Del Tomate, Cafetería Modo Café, Heladería Chelato y Restaurante El Paso. Cada local necesitaba su propia identidad visual dentro de un mismo sitio.</p>

<h2>La solución</h2>

<h4>Sistema multi-marca</h4>
<p>Desarrollé un sistema de identidad visual dinámica usando data-brand como switch — cada local tiene sus propios colores, tipografía y contenido sin necesidad de sitios separados.</p>

<h4>Asistente IA por local</h4>
<p>Cada local tiene su propio asistente con Claude API que responde preguntas sobre el menú, horarios y promociones. La API key está protegida mediante Netlify Functions.</p>

<h4>Dark mode y video hero</h4>
<p>Sitio con dark/light mode persistente vía localStorage, video hero de fondo y 4 sub-páginas de menú independientes por local.</p>
