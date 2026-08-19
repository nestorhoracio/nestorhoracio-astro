---
title: "Mi Guía Definitiva: Cómo logré un 95 en PageSpeed Móvil con Divi y LiteSpeed"
date: 2025-10-29
category: "diseño web"
description: "¿Es Divi lento? Si has pasado algo de tiempo en foros de WordPress o grupos de Facebook, seguro que has leído esa afirmación docenas de veces. Es, quizás, el mito más grande que rodea a este increíble constructor visual. Tal vez tú mismo estés frustrado porque tu sitio web Divi no logra despegar en Google…"
cover: "./95-en-pagespeed-movil.png"
---

¿Es Divi lento?

Si has pasado algo de tiempo en foros de WordPress o grupos de Facebook, seguro que has leído esa afirmación docenas de veces. Es, quizás, el mito más grande que rodea a este increíble constructor visual. Tal vez tú mismo estés frustrado porque tu sitio web Divi no logra despegar en Google PageSpeed Insights, especialmente en la temida puntuación "Móvil".

Estoy aquí para decirte que, en gran medida, <strong>es un mito</strong>.

Divi no es lento; una mala configuración sí lo es. Con la arquitectura correcta, Divi puede ser una bala. ¿Cómo estoy tan seguro?

Porque mi propio sitio web, <code>nestorhoracio.com</code>, está construido 100% con Divi y su Theme Builder, y estos son los resultados:

<figure class="wp-block-image size-large"><img loading="lazy" decoding="async" width="1024" height="439" src="/images/blog/pagespeedmovil-1024x439.png" alt="Resultado de PageSpeed Insights en móvil: 95 de rendimiento" /></figure>

<figure class="wp-block-image size-large"><img loading="lazy" decoding="async" width="1024" height="492" src="/images/blog/pagespeedordenador-1024x492.png" alt="Resultado de PageSpeed Insights en ordenador: 100 de rendimiento" /></figure>

<figure class="wp-block-image size-large"><img loading="lazy" decoding="async" width="1024" height="375" src="/images/blog/gtmetrix-1024x375.jpg" alt="Resultado de GTmetrix: calificación A" /></figure>

Un <strong>95 en Rendimiento Móvil</strong> y un <strong>100 en Ordenador</strong> no son un accidente. Son el resultado de una configuración metódica y el uso de las herramientas correctas. Ademas como veras GTmetrix (el performan report de WordPress), lo puntua en A

En esta guía definitiva, no te daré teorías vagas. Voy a compartir el <em>stack exacto</em> y los <em>ajustes precisos</em> que usé para lograr estos puntajes. El secreto no está en instalar 20 plugins de optimización; está en la "santísima trinidad" del rendimiento moderno:

<ol start="1" class="wp-block-list">
<li>Un servidor de hosting de calidad (<strong>LiteSpeed Server</strong>).</li>

<li>El plugin de caché correcto (<strong>LiteSpeed Cache</strong>).</li>

<li>Una configuración precisa que <strong>respete</strong> cómo funciona Divi (y no rompa el sitio en el proceso).</li>
</ol>

Si estás cansado de pelear con tu sitio Divi, sigue leyendo. Te mostraré exactamente cómo lo hice.

<h3 class="wp-block-heading"><strong>¿Por Qué Obsesionarse con la Velocidad?</strong></h3>

Antes de sumergirnos en la configuración, detengámonos un segundo: ¿por qué es tan vital un sitio web rápido? La respuesta es simple: afecta a todo.

<ul class="wp-block-list">
<li><strong>Google te Premia:</strong> Desde 2021, la velocidad de carga (específicamente las métricas Core Web Vitals) es un factor directo de <strong>posicionamiento SEO</strong>. Un sitio lento no rankeará bien, por mucho contenido bueno que tengas.</li>

<li><strong>Tus Visitantes se Quedan:</strong> Estudios demuestran que si una página tarda más de 3 segundos en cargar en móvil, más de la mitad de los visitantes la abandonan. ¡Pierdes clientes antes de que siquiera vean tu oferta!</li>

<li><strong>Las Conversiones Aumentan:</strong> Un sitio rápido se siente profesional, confiable. Mejora la experiencia del usuario y, por lo tanto, la probabilidad de que te contacten o compren tus productos.</li>
</ul>

<strong>La Fórmula Ganadora:</strong>

Lograr esa velocidad no depende de un solo truco, sino de una combinación sólida:

<ol start="1" class="wp-block-list">
<li><strong>Un Buen Motor (El Servidor):</strong> Necesitas una base rápida. Aquí es donde <strong>LiteSpeed Server</strong> brilla.</li>

<li><strong>Un Buen Mecánico (La Caché):</strong> Necesitas un sistema inteligente que "prepare" tu sitio para servirlo rápido. El plugin <strong>LiteSpeed Cache</strong> es el mejor copiloto para su servidor homónimo.</li>

<li><strong>Un Buen Chasis (El Tema):</strong> Necesitas un tema bien construido que no genere "peso muerto". <strong>Divi</strong>, a pesar de los mitos, es perfectamente capaz si se configura bien.</li>
</ol>

Ahora, veamos cómo encajan estas piezas.

<h3 class="wp-block-heading"><strong>Paso 1: Todo Empieza en el Servidor (LiteSpeed Server)</strong></h3>

Puedes tener el mejor plugin de caché del mundo, pero si el "motor" de tu sitio web (el servidor de hosting) es lento, nunca alcanzarás velocidades de élite. La elección del hosting es, literalmente, el cimiento de tu rendimiento.

En mi caso, y lo que recomiendo encarecidamente para sitios WordPress (especialmente con Divi), es optar por un proveedor que utilice <strong>servidores web LiteSpeed</strong>.

<strong>¿Qué es LiteSpeed Server?</strong>

Es un tipo de software de servidor web de alto rendimiento diseñado específicamente para ser más rápido que las opciones tradicionales (como Apache, que usan muchos hostings económicos). Es como comparar un motor de última generación con uno más antiguo: simplemente procesa las solicitudes de tu sitio de manera mucho más eficiente.

<strong>La Ventaja Clave:</strong>

La verdadera magia ocurre cuando combinas un servidor LiteSpeed con su plugin hermano, <strong>LiteSpeed Cache</strong> (que veremos en el siguiente paso). Trabajan en perfecta armonía, logrando niveles de optimización que otros plugins genéricos simplemente no pueden igualar porque no tienen esa comunicación directa con el hardware.

<em>Mi experiencia personal:</em> Al migrar sitios a hostings con LiteSpeed Server, he visto mejoras instantáneas en los tiempos de carga, incluso antes de instalar el plugin de caché. Simplemente, la base es más sólida. Si estás buscando hosting o pensando en cambiar, asegúrate de que ofrezcan LiteSpeed.

<h3 class="wp-block-heading"><strong>Paso 2: Configuración Óptima de LiteSpeed Cache (El "Cómo")</strong></h3>

Aquí es donde ocurre la magia… y también donde muchos cometen errores. El plugin LiteSpeed Cache es increíblemente potente, pero tiene tantas opciones que es fácil perderse o activar algo que, en lugar de ayudar, rompa el diseño o la funcionalidad (¡créeme, me ha pasado!).

Después de muchas pruebas (y errores), llegué a la configuración que me dio ese <strong>95 en móvil</strong> sin sacrificar la estabilidad de mi sitio Divi. Estos son los ajustes exactos que necesitas activar (y, crucialmente, los que debes dejar <em>desactivados</em>).

<em>(Nota: Asumiré que ya has instalado y activado el plugin LiteSpeed Cache. Si no, ¡hazlo ahora!)</em>

<strong>Navega a <code>LiteSpeed Cache > Ajustes > Optimización de página</code> en tu panel de WordPress.</strong>

<strong>1. Pestaña [1] Ajustes de CSS:</strong>

<ul class="wp-block-list">
<li><strong>Minificar CSS:</strong><strong><code>ON</code></strong>
<ul class="wp-block-list">
<li><em>¿Por qué?</em> Elimina espacios y comentarios innecesarios del código CSS, haciendo los archivos más pequeños y rápidos de descargar. Es una optimización segura.</li>
</ul>

</li>

<li><strong>Combinar CSS:</strong><strong><code>OFF</code></strong>
<ul class="wp-block-list">
<li><em>¿Por qué?</em> <strong>Este es el ajuste CLAVE para Divi.</strong> Aunque combinar archivos suena bien, con Divi suele romper el orden en que se aplican los estilos, haciendo que tu diseño se vea mal. Es mucho más seguro (y casi igual de rápido) dejarlo apagado y confiar en la minificación y en HTTP/2 (que maneja múltiples archivos eficientemente).</li>
</ul>

</li>

<li><em>Resto de opciones:</em> Déjalas en sus valores por defecto (OFF).</li>
</ul>

<strong>2. Pestaña [2] Ajustes de JS (JavaScript):</strong>

<ul class="wp-block-list">
<li><strong>Minificar JS:</strong><strong><code>ON</code></strong>
<ul class="wp-block-list">
<li><em>¿Por qué?</em> Igual que con el CSS, reduce el tamaño de los archivos JavaScript eliminando lo innecesario. Optimización segura.</li>
</ul>

</li>

<li><strong>Combinar JS:</strong><strong><code>OFF</code></strong>
<ul class="wp-block-list">
<li><em>¿Por qué?</em> <strong>Segundo ajuste CLAVE.</strong> Combinar JS es aún más peligroso que combinar CSS, especialmente si usas scripts personalizados (como los que usamos para el modo oscuro o el resaltado del menú). Puede romper la funcionalidad del sitio fácilmente. Déjalo apagado.</li>
</ul>

</li>

<li><strong>Aplazar la carga de JS:</strong><strong><code>Diferido</code></strong> (Deferred)
<ul class="wp-block-list">
<li><em>¿Por qué?</em> Esto le dice al navegador que cargue el contenido HTML y CSS primero, y deje los archivos JavaScript (que suelen ser más pesados y bloqueantes) para el final. Mejora enormemente la percepción de velocidad inicial.</li>
</ul>

</li>

<li><em>Resto de opciones:</em> Déjalas en sus valores por defecto (OFF).</li>
</ul>

<strong>3. Pestaña [4] Ajustes de Medios:</strong>

<ul class="wp-block-list">
<li><strong>Carga diferida de imágenes (Lazy Load):</strong><strong><code>ON</code></strong>
<ul class="wp-block-list">
<li><em>¿Por qué?</em> Una de las optimizaciones más impactantes. Las imágenes solo se cargan cuando el usuario está a punto de verlas al hacer scroll. Acelera drásticamente el tiempo de carga inicial de la página.</li>
</ul>

</li>
</ul>

<strong>4. Optimización de Imágenes (WebP):</strong>

<ul class="wp-block-list">
<li>Ve a <code>LiteSpeed Cache > Optimización de Imágenes > [2] Ajustes de optimización de imágenes</code>.</li>

<li><strong>Formato de imagen de próxima generación:</strong> Selecciona <strong><code>WebP</code></strong>.</li>

<li><strong>WebP/AVIF para srcset adicional:</strong> Ponlo en <strong><code>ON</code></strong>.
<ul class="wp-block-list">
<li><em>¿Por qué?</em> WebP es un formato de imagen moderno mucho más ligero que JPG o PNG. LiteSpeed creará automáticamente copias WebP de tus imágenes y las servirá a los navegadores compatibles, reduciendo significativamente el "peso" de tu página. (Recuerda que quizás necesites crear una cuenta gratuita en QUIC.cloud para optimizar todas tus imágenes).</li>
</ul>

</li>
</ul>

<strong>5. Optimización de Base de Datos (Mantenimiento):</strong>

<ul class="wp-block-list">
<li>Ve a <code>LiteSpeed Cache > Optimización de BD</code>.</li>

<li><strong>Limpieza:</strong> Usa la pestaña <code>[1] Gestionar</code> para limpiar revisiones antiguas, borradores automáticos y transitorios periódicamente.</li>

<li><strong>Prevención:</strong> En la pestaña <code>[2] Ajustes de optimización de BD</code>, limita el <strong><code>Número máximo de revisiones</code></strong> a un valor bajo (ej. <code>5</code>) para evitar que la base de datos crezca innecesariamente.</li>
</ul>

<strong>¡Importante! Después de guardar estos cambios, recuerda siempre hacer una "Purga Total"</strong> (<code>LiteSpeed Cache > Herramientas > Purgar todo</code> y también <code>Divi > Opciones del Tema > Constructor > Avanzado > Limpiar</code>) y <strong>probar tu sitio en una ventana de incógnito</strong> para asegurarte de que todo se vea y funcione correctamente.

Esta configuración es el corazón de la optimización. Es el equilibrio perfecto entre velocidad y compatibilidad con Divi.

<h3 class="wp-block-heading"><strong>Paso 3: Detalles Adicionales (Las Buenas Prácticas que Suman)</strong></h3>

Si bien la configuración de LiteSpeed Cache es el motor principal para alcanzar ese 95+ en PageSpeed, hay algunas prácticas adicionales que implementé en <code class="">nestorhoracio.com</code> y que recomiendo siempre para mantener un sitio WordPress saludable y ágil:

<ol start="1" class="wp-block-list">
<li><strong>Usar un Tema Hijo (<code>Child Theme</code>):</strong>
<ul class="wp-block-list">
<li><em>¿Por qué?</em> Como hemos visto en mi propio sitio, todas las personalizaciones importantes (código PHP en <code class="">functions.php</code>, estilos en <code class="">style.css</code>, scripts JS) las realizamos en un <strong>tema hijo</strong>. Esto asegura que, cuando actualices Divi, no pierdas ninguna de tus modificaciones. Además, mantiene el código organizado y facilita el mantenimiento. Es la forma profesional de trabajar con cualquier tema de WordPress.</li>
</ul>

</li>

<li><strong>Optimizar Imágenes <em>Antes</em> de Subirlas:</strong>
<ul class="wp-block-list">
<li><em>¿Por qué?</em> Aunque LiteSpeed Cache hace un trabajo fantástico creando versiones WebP, siempre es mejor subir imágenes que ya tengan un tamaño y peso razonables. Herramientas online gratuitas como TinyPNG o Squoosh pueden reducir drásticamente el peso de tus JPEGs y PNGs <em>antes</em> de que lleguen a tu biblioteca de medios. Esto ahorra espacio en tu hosting y acelera el proceso de optimización de LiteSpeed.</li>
</ul>

</li>

<li><strong>Minimalismo de Plugins:</strong>
<ul class="wp-block-list">
<li><em>¿Por qué?</em> Cada plugin que instalas añade código, potenciales conflictos y, a menudo, carga adicional (CSS, JS). Antes de instalar un nuevo plugin, pregúntate: "¿Es absolutamente esencial?". En mi sitio, utilizamos un stack muy reducido y cuidadosamente seleccionado: Divi, LiteSpeed Cache, Rank Math SEO, Solid Security y UpdraftPlus. Nada más que lo estrictamente necesario para un sitio profesional, rápido y seguro.</li>
</ul>

</li>
</ol>

Estos "pequeños" detalles suman. Mantener tu sitio limpio, organizado y optimizado desde la base facilita enormemente el trabajo de las herramientas de caché y contribuye al rendimiento general.

<h3 class="wp-block-heading"><strong>Conclusión: Divi Rápido No Es un Mito, Es una Realidad (Si Sabes Cómo)</strong></h3>

Como has visto en esta guía, alcanzar un puntaje de <strong>95 en PageSpeed Móvil</strong> con un sitio construido en Divi no solo es posible, sino que es totalmente alcanzable con la configuración correcta. El secreto no está en trucos complejos ni en sacrificar diseño, sino en entender la sinergia entre un buen servidor (<strong>LiteSpeed Server</strong>), un plugin de caché inteligente (<strong>LiteSpeed Cache</strong>) y una configuración que respete las particularidades de Divi.

Hemos desmentido el mito. Divi, combinado con las herramientas adecuadas y los ajustes precisos (minificación sí, combinación no; WebP sí, scripts innecesarios no), puede ofrecer una experiencia de usuario increíblemente rápida.

<strong>¿Los beneficios?</strong>

<ul class="wp-block-list">
<li>Mejor posicionamiento en Google (SEO).</li>

<li>Menor tasa de rebote (visitantes que se quedan).</li>

<li>Una imagen más profesional y confiable.</li>

<li>Mayor probabilidad de conversión (clientes que te contactan).</li>
</ul>

Implementar estos pasos requiere atención al detalle, pero el resultado vale cada minuto invertido.

<hr class="wp-block-separator has-alpha-channel-opacity" />

<h3 class="wp-block-heading"><strong>¿Prefieres que un Experto lo Haga por Ti?</strong></h3>

Si todo esto te parece demasiado técnico o simplemente prefieres dedicar tu tiempo a lo que mejor sabes hacer (tu propio negocio), estoy aquí para ayudarte.

Como especialista en <strong>optimización de rendimiento para Divi y WordPress</strong>, puedo aplicar esta misma metodología (y más) a tu sitio web para asegurar que vuele en PageSpeed y ofrezca la mejor experiencia a tus visitantes.

<strong>¿Quieres dejar de preocuparte por la velocidad y enfocarte en crecer?</strong>

<a class="wp-block-button__link wp-element-button" href="https://wa.me/59898472684?text=Hola%20Néstor%2C%20vi%20tu%20portfolio%20y%20me%20gustaría%20consultarte.HD1" target="_blank" rel="noopener">Hablemos de tu Velocidad</a>
