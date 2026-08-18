---
title: "CPT vs. Módulos Manuales en Divi: Mi experiencia y por qué elegí el método manual"
date: 2025-10-31
category: "diseño web"
description: "Estás frente a tu editor de Divi, listo para construir una de las secciones más importantes de tu sitio: tu portafolio, tus servicios, o como en mi caso, una lista de infoproductos. Y aquí surge el primer gran dilema del desarrollador: ¿Qué es mejor? ¿Usar un Custom Post Type (CPT) con Advanced Custom Fields (ACF)…"
---

<hr class="wp-block-separator has-alpha-channel-opacity" />

Estás frente a tu editor de Divi, listo para construir una de las secciones más importantes de tu sitio: tu portafolio, tus servicios, o como en mi caso, una lista de infoproductos. Y aquí surge el primer gran dilema del desarrollador:

¿Qué es mejor? ¿Usar un <strong>Custom Post Type (CPT)</strong> con <strong>Advanced Custom Fields (ACF)</strong> para crear una solución "profesional", escalable y gestionada desde el Theme Builder?

¿O simplemente construirlo a mano, de forma <strong>manual</strong>, con los módulos estándar de Imagen, Texto y Botón de Divi?

Si buscas en Google, la sabiduría popular y los "puristas" del código te darán una respuesta unánime: usa un CPT. Es más limpio, más escalable y la "forma correcta" de hacerlo.

Y tienen razón… en teoría.

Pero en el mundo real, esta "mejor práctica" puede chocar dolorosamente con las peculiaridades y los errores de la integración de Divi con el contenido dinámico.

Te lo digo por experiencia directa. Acabo de pasar por este dilema exacto para la sección de "Infoproductos" de mi propio sitio. Seguí el camino "pro" primero: instalé CPT UI, configuré mis campos en ACF y me preparé para la magia del Theme Builder.

¿El resultado? Horas de frustración, opciones de Divi que desaparecían misteriosamente y enlaces dinámicos que simplemente se negaban a funcionar.

En este artículo, te contaré esa historia de depuración. Te mostraré por qué la solución "técnicamente elegante" falló y por qué tomé la decisión pragmática de abandonarlo todo y elegir el método manual. Es una historia de por qué la solución "correcta" no siempre es la mejor solución.

<h3 class="wp-block-heading"><strong>Sección 1: La Promesa del CPT (Por qué lo intenté)</strong></h3>

No me malinterpretes. No elegí el método manual a la ligera. Como profesional, mi primer instinto fue seguir la ruta "correcta", la que te enseñan en todos los cursos de desarrollo avanzado de WordPress: el <strong>Custom Post Type (CPT)</strong>.

Sobre el papel, la solución del CPT era, por lejos, la más elegante y profesional. Las ventajas parecían obvias:

<ol start="1" class="wp-block-list">
<li><strong>Organización Impecable:</strong> La idea de tener un menú "Infoproductos" en mi panel de WordPress, completamente separado de mis "Páginas" y "Entradas", era increíblemente atractiva. Mantenía la base de datos limpia y la gestión de contenidos ordenada.</li>

<li><strong>Escalabilidad a Futuro:</strong> Si en el futuro mi portafolio de infoproductos crecía a 50 o 100 artículos, la gestión sería sencilla. Añadir, editar o eliminar productos sería tan fácil como manejar una entrada de blog, sin tener que tocar el diseño de la página de inicio.</li>

<li><strong>La "Magia" del Theme Builder (El Gran Atractivo):</strong> Pero la verdadera promesa para un usuario de Divi estaba en el <strong>Constructor de Temas</strong>. La teoría era simple:
<ul class="wp-block-list">
<li>Creaba mi CPT "Infoproducto" (usando el plugin CPT UI).</li>

<li>Creaba mis campos personalizados, como "Enlace Externo" (usando Advanced Custom Fields – ACF).</li>

<li>Iba al Constructor de Temas de Divi, diseñaba una plantilla <em>una sola vez</em> usando un Módulo de Blog para listar los CPTs y conectaba los títulos, imágenes y botones al <strong>Contenido Dinámico</strong> de ACF.</li>
</ul>

</li>
</ol>

El resultado sería un sistema 100% automatizado. Cada vez que añadiera un nuevo infoproducto, este aparecería mágicamente en la página de inicio, con el diseño perfecto y el enlace correcto.

Era la definición de un sistema escalable, mantenible y profesional. Era, sin duda, la solución perfecta.

Así que, con esa visión en mente, instalé los plugins y me puse manos a la obra… sin saber la frustración que me esperaba por cortesía de las peculiaridades de Divi.

<h3 class="wp-block-heading"><strong>Sección 2: La Frustración (Donde Divi se interpone)</strong></h3>

La teoría era perfecta, pero la práctica fue otra historia. La configuración inicial fue un éxito: creé mi CPT "Infoproducto" con <strong>CPT UI</strong> y añadí mis campos personalizados ("Enlace Externo", "Descripción Corta") con <strong>ACF</strong>. Todo aparecía correctamente en el panel de WordPress.

El problema comenzó, como era de esperar, al intentar conectar todo con el <strong>Constructor de Temas de Divi</strong>.

Fui a mi plantilla de Cuerpo Personalizado, borré mi contenido manual y añadí un Módulo de Blog nuevo, configurándolo para que mostrara mi CPT "Infoproducto". Y ahí, casi al instante, empezaron los problemas.

<h4 class="wp-block-heading">El Problema 1: Las Opciones "Desaparecidas"</h4>

El primer síntoma fue sutil. Quería cambiar el texto del botón "Read More" por "Ver Producto". Fui a <code>Contenido > Elementos</code> y activé "Mostrar botón 'Leer más'".

Pero la opción para <strong>"Usar texto personalizado para 'Leer más'"</strong> simplemente no estaba. Había desaparecido.

Investigando, descubrí que esto ocurre porque Divi vincula esa opción a la función de "Extractos" (Excerpts). Tuve que volver a la configuración del CPT en CPT UI y habilitar forzosamente el soporte para "Extractos". Tras recargar el constructor, la opción apareció. Fue un obstáculo molesto, pero solucionable.

<h4 class="wp-block-heading">El Problema 2: El Bug Fatal del Contenido Dinámico</h4>

El verdadero problema, el que rompió todo, vino después. Intenté conectar los enlaces.

Fui a <code>Contenido > Enlaces</code> y conecté el <strong>"Enlace del título de la entrada"</strong>, el <strong>"Enlace de la imagen destacada"</strong> y el <strong>"Enlace del botón 'Leer más'"</strong> a mi campo de ACF "Enlace Externo". Todo parecía correcto. Guardé los cambios, limpié todas las cachés y fui a probar la página.

<strong>No funcionaba.</strong>

A pesar de que todo estaba configurado perfectamente en el constructor, el enlace en la página en vivo seguía apuntando a la URL del <em>post</em> (ej. <code>.../infoproducto/mi-producto/</code>), no a la URL de venta externa que había guardado en ACF.

Repetí el proceso. Borré el módulo, lo creé de nuevo, limpié la caché de Divi, la caché del servidor. Nada. El Módulo de Blog de Divi, dentro del Constructor de Temas, se negaba obstinadamente a extraer el enlace dinámico de ACF para un CPT.

Ahí fue donde me detuve. Me di cuenta de que estaba gastando horas en <em>depurar</em> una integración defectuosa de Divi, por un problema que ni siquiera era mi culpa.

<h3 class="wp-block-heading"><strong>Sección 3: El Pivote (El Momento de Claridad Prag-mática)</strong></h3>

Estaba atascado en un ciclo de depuración sin fin, intentando forzar una solución "técnicamente pura" que simplemente no quería funcionar.

Y fue entonces cuando mi lado de <strong>Administrador de Empresas</strong> (de mi formación académica) tuvo una charla muy seria con mi lado de "desarrollador".

Dejé de mirar el código y empecé a mirar el <strong>balance costo-beneficio</strong> del problema.

<ul class="wp-block-list">
<li><strong>El Costo:</strong> Ya había invertido horas en configurar plugins (CPT UI, ACF), depurar módulos rotos de Divi y buscar soluciones en foros. El sistema era complejo, requería dos plugins adicionales (más peso para el sitio, más puntos de fallo) y, lo peor de todo, <strong>no funcionaba</strong>.</li>

<li><strong>El Beneficio Esperado:</strong> La "elegancia" de una base de datos limpia y la escalabilidad de poder añadir 100 productos algún día.</li>
</ul>

Me hice la pregunta clave: <strong>¿Cuál es el objetivo real aquí?</strong>

El objetivo no era construir la arquitectura CPT más pura de la historia. El objetivo era mostrar <strong>mis 5 o 10 infoproductos</strong> en la página de inicio, de forma limpia, rápida y con el enlace correcto.

La solución CPT era un caso claro de <strong>sobre-ingeniería</strong> para un problema simple, y el ecosistema Divi estaba castigándome por ello.

<strong>La Decisión:</strong> Decidí "despedir" a los CPTs. El tiempo invertido en depurar ese bug ya era mucho mayor que el tiempo que me llevaría construir la sección entera a mano.

Desactivé los plugins CPT UI y ACF, volví al Constructor de Temas y borré el módulo de Blog defectuoso. Era hora de volver a lo básico.

<h3 class="wp-block-heading"><strong>Sección 4: La Solución Manual (Rápida, Limpia y Eficiente)</strong></h3>

Una vez que borré el módulo de Blog defectuoso, volví a la plantilla de mi Cuerpo Personalizado en el Constructor de Temas. ¿Mi plan ahora? El método directo, el que sabía que no podía fallar.

<ol start="1" class="wp-block-list">
<li>Añadí una nueva <strong>Fila (verde)</strong>, en mi caso, de tres columnas, para mostrar los productos uno al lado del otro.</li>

<li>En la primera columna, construí mi "tarjeta de producto" manualmente. Para esto, solo necesité tres módulos estándar de Divi:
<ul class="wp-block-list">
<li>Un módulo de <strong>Imagen</strong> para la foto del producto.</li>

<li>Un módulo de <strong>Texto</strong> para el título y la descripción.</li>

<li>Un módulo de <strong>Botón</strong> para el enlace de compra.</li>
</ul>

</li>

<li>Abrí los ajustes del módulo de <strong>Botón</strong>, escribí "Ver Producto" y pegué la URL de venta <em>directamente</em> en el campo "Enlace".</li>

<li>Una vez que diseñé esa primera columna exactamente como quería, simplemente la <strong>dupliqué</strong> para la segunda y tercera columna.</li>

<li>Cambié las imágenes, textos y enlaces de las copias.</li>
</ol>

<strong>¿El resultado?</strong>

<strong>Tiempo total de construcción y configuración: menos de 15 minutos.</strong>

Cero bugs. Cero frustración. Cero plugins adicionales.

Para añadir un nuevo producto, todo lo que tengo que hacer es duplicar una fila y cambiar el contenido. Para un portafolio o una sección de productos que no cambia todos los días, este método es infinitamente más rápido y 100% fiable.

<h3 class="wp-block-heading"><strong>Conclusión: La Lección (y la Solución Correcta)</strong></h3>

¿Significa esto que los Custom Post Types (CPT) son malos?

¡Para nada! Los CPTs son una herramienta esencial y poderosa en WordPress. Son la columna vertebral de sitios grandes y complejos con cientos o miles de entradas, como un portal inmobiliario, un directorio de negocios o una tienda WooCommerce avanzada.

Pero para un portafolio personal, una sección de servicios, o una pequeña tienda de infoproductos como la mía, el método CPT demostró ser un claro caso de <strong>sobre-ingeniería</strong>. Añadió una capa de complejidad, dos plugins adicionales y, lo que es peor, nos llevó a un callejón sin salida de depuración gracias a las peculiaridades del Constructor de Temas de Divi.

Al final del día, ser un profesional no significa elegir la herramienta más compleja solo porque es "técnicamente pura". Significa elegir la <strong>solución más eficiente, directa y mantenible</strong> que resuelva el problema real del cliente.

Mi trabajo es entregar sitios web que funcionen, sean rápidos y no te den dolores de cabeza. Si buscas un desarrollador pragmático enfocado en resultados reales, y no en teorías complicadas, hablemos.

<a class="wp-block-button__link wp-element-button" href="https://wa.me/59898472684?text=Hola%20Néstor%2C%20vi%20tu%20portfolio%20y%20me%20gustaría%20consultarte.HD1" target="_blank" rel="noopener">Hablemos de tu proyecto</a>
