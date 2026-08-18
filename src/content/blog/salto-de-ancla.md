---
title: "Por qué el Salto de Ancla de Divi Falla en el Theme Builder (y la ÚNICA solución que funciona)"
date: 2025-10-30
category: "diseño web"
description: "Estás en la recta final. Has creado una hermosa página web “One-Page” con Divi. Has utilizado el poderoso Constructor de Temas (Theme Builder) para diseñar una cabecera fija (header) que se mantiene visible mientras te desplazas y un cuerpo personalizado (Custom Body) para tu página de inicio. Creas tu menú de navegación con enlaces de…"
---

Estás en la recta final. Has creado una hermosa página web "One-Page" con Divi. Has utilizado el poderoso Constructor de Temas (Theme Builder) para diseñar una cabecera fija (header) que se mantiene visible mientras te desplazas y un cuerpo personalizado (Custom Body) para tu página de inicio. Creas tu menú de navegación con enlaces de ancla (ej. <code>/#servicios</code>), lo pruebas con orgullo y…

…el desastre.

Al hacer clic, la página salta correctamente, pero el título de tu sección de "Servicios" ha desaparecido. Está oculto, "tragado" por esa cabecera fija que tanto te costó diseñar.

Si te está pasando esto, bienvenido. Acabas de toparte con uno de los problemas más frustrantes y específicos del ecosistema Divi. Y lo que es peor, has buscado en Google y has probado todas las soluciones obvias: <code>padding</code>, <code>margin</code>, <code>scroll-margin-top</code>… y nada funciona.

Tranquilo, no estás loco y tu Divi no está roto.

Pasé horas depurando exactamente este problema. Probé cada método conocido (y algunos que inventé sobre la marcha) y todos fallaron. ¿La razón? El culpable es un conflicto directo entre el script de <em>smooth scroll</em> de Divi y la forma en que el Theme Builder calcula la posición de las secciones.

Pero hay una solución. Una que funciona siempre.

En este artículo, te ahorraré ese dolor de cabeza. Te explicaré por qué fallan los métodos comunes y te daré la <strong>única solución CSS</strong> que soluciona este problema de forma limpia, definitiva y sin necesidad de complicados scripts.

<h3 class="wp-block-heading"><strong>Sección 1: ¿Por Qué Falla Realmente? (El Culpable Oculto)</strong></h3>

Lo primero que debes entender es que <strong>no estás haciendo nada mal</strong>. El problema no es un "bug" en el sentido tradicional, sino un <strong>conflicto de scripts</strong>.

El culpable es la propia función de <strong>"desplazamiento suave" (smooth scroll) de Divi</strong>.

Así es como funciona (y por qué falla):

<ol start="1" class="wp-block-list">
<li>Cuando un visitante hace clic en un enlace de ancla (ej. <code>/#servicios</code>), Divi <strong>impide</strong> que el navegador haga su "salto" instantáneo por defecto.</li>

<li>En su lugar, el <strong>JavaScript de Divi toma el control</strong>.</li>

<li>El script localiza la sección (la que tiene el ID <code>#servicios</code>) y le pregunta al navegador: "¿Cuál es tu posición exacta en la parte superior de la página?" (su <code>offsetTop</code>).</li>

<li>Luego, el script anima el desplazamiento de la pantalla <em>exactamente</em> a esa coordenada de píxel.</li>
</ol>

<strong>Aquí está el fallo:</strong> El script de Divi es "ciego". No tiene en cuenta la altura de tu <strong>cabecera fija del Theme Builder</strong>, que está flotando por encima de todo. Simplemente te lleva al borde superior de la sección, y ese borde queda, por supuesto, tapado por tu cabecera.

<strong>¿Por qué es peor en el Theme Builder?</strong> Porque el Constructor de Temas envuelve tu contenido en contenedores especiales (como <code>.et-boc</code> y <code>.et-l--body</code>), lo que hace que los cálculos de posición sean aún más complejos y propensos a que el script de Divi se confunda.

Por eso, la mayoría de las soluciones CSS modernas, como <code>scroll-margin-top</code>, están destinadas a fallar. Estamos intentando solucionar un problema de cálculo de JavaScript con una regla de CSS, y el script de Divi simplemente la ignora.

<h3 class="wp-block-heading"><strong>Sección 2: Las Soluciones que "Deberían" Funcionar (Pero Fallan en el Theme Builder)</strong></h3>

Cuando te enfrentas a este problema, tu primer impulso (y el mío) es buscar una solución en Google o foros de desarrollo. Invariablemente, encontrarás tres soluciones principales. El problema es que, en el contexto específico del Constructor de Temas de Divi, estas soluciones fallan estrepitosamente.

Aquí te resumo los métodos que probé y por qué no funcionaron, para que no pierdas tu tiempo:

<h4 class="wp-block-heading">Intento #1: El CSS Moderno (<code>scroll-margin-top</code>)</h4>

<ul class="wp-block-list">
<li><strong>La Teoría:</strong> Esta es la propiedad CSS moderna, diseñada exactamente para este problema. Con una simple regla como <code>scroll-margin-top: 140px;</code>, le dices al navegador: "Cuando saltes a esta ancla, por favor, detente 140 píxeles <em>antes</em> de llegar a ella".</li>

<li><strong>Por Qué Falló:</strong> Como explicamos en la sección anterior, el <strong>script de Divi anula el comportamiento nativo del navegador.</strong> El script no le pide al navegador que salte, sino que calcula una posición de píxel exacta y anima el <code>scrollTop</code> hasta allí. La propiedad <code>scroll-margin-top</code> nunca llega a actuar.</li>
</ul>

<h4 class="wp-block-heading">Intento #2: El "Truco" Clásico de CSS (<code>padding-top</code> y <code>margin-top</code>)</h4>

<ul class="wp-block-list">
<li><strong>La Teoría:</strong> Esta es la solución de la vieja escuela. Aplicas un <code>padding-top: 140px;</code> a tu sección para "empujar" el contenido hacia abajo, y luego un <code>margin-top: -140px;</code> para "subir" la sección y que no quede un espacio en blanco.</li>

<li><strong>Por Qué Falló:</strong> De nuevo, el script de Divi es demasiado listo. No calcula la posición del <em>contenido</em> dentro de la sección; calcula la posición de la <strong>sección misma</strong>. Aunque el contenido esté 140px más abajo, el script sigue animando el scroll hasta el borde superior de la sección (<code>offsetTop</code>), que sigue estando detrás de la cabecera.</li>
</ul>

<h4 class="wp-block-heading">Intento #3: La "Guerra de Scripts" (JavaScript Personalizado)</h4>

<ul class="wp-block-list">
<li><strong>La Teoría:</strong> Si el problema es un script de Divi, ¡luchemos contra él con nuestro propio script! Usando jQuery o JavaScript, podemos "interceptar" el clic (<code>e.preventDefault()</code>), detener el script de Divi y calcular manualmente el salto correcto restando la altura de la cabecera.</li>

<li><strong>Por Qué Falló (O por qué es una mala idea):</strong> Esto es como intentar cambiar una pieza del motor de un coche en marcha. Entras en una "guerra de scripts". Puede que soluciones el salto, pero es muy probable que <strong>rompas otras funciones</strong> (como el script que resalta el enlace activo en el menú mientras haces scroll) o que tu script entre en conflicto con futuras actualizaciones de Divi. Es una solución frágil, complicada y poco mantenible.</li>
</ul>

Tras probar todo esto, me di cuenta de que el enfoque era erróneo. La solución no era luchar contra el script de Divi. Era aceptarlo y usar una especificidad de CSS aún mayor para <em>ganarle la partida</em> al diseño.

<h3 class="wp-block-heading"><strong>Sección 3: La Solución Definitiva (El CSS de "Fuerza Bruta")</strong></h3>

Después de todos esos intentos fallidos, la solución correcta resultó ser sorprendentemente simple. La filosofía es: <strong>dejar de luchar contra el script de Divi.</strong>

Dejamos que el script haga su cálculo erróneo y nos lleve detrás de la cabecera. Luego, usamos una regla de CSS con una <strong>especificidad tan alta</strong> que Divi no puede ignorarla, forzando al <em>contenido</em> dentro de esa sección a "empujarse" hacia abajo, haciéndose visible.

Aquí tienes el método exacto, paso a paso.

<h4 class="wp-block-heading">Paso 1: Confirmar la Ubicación del ID</h4>

Este método funciona asumiendo que tus IDs de ancla (<code>#infoproductos</code>, <code>#diseno-web</code>, etc.) están colocados en el lugar correcto: la <strong>Sección principal de Divi (la de color azul)</strong>, en la pestaña <code>Avanzado > ID de CSS</code>.

<h4 class="wp-block-heading">Paso 2: El Código Mágico (La Solución)</h4>

Ahora, ve a <code>Divi > Opciones del Tema > CSS Personalizado</code> (o al <code>style.css</code> de tu tema hijo) y añade el siguiente bloque de código:

CSS

<pre class="wp-block-code"><code>/*
* SOLUCIÓN DEFINITIVA: ANCLA DE THEME BUILDER
*
* Fuerza un padding superior solo a las secciones
* ancla que están dentro de un cuerpo de plantilla
* personalizado de Divi (et-l--body).
*/
body.home .et-boc .et-l--body .et_pb_section#infoproductos,
body.home .et-boc .et-l--body .et_pb_section#diseno-web,
body.home .et-boc .et-l--body .et_pb_section#sobre-mi {
padding-top: 140px !important;
}
</code></pre>

<em>(<strong>Nota:</strong> Asegúrate de cambiar <code>#infoproductos</code>, <code>#diseno-web</code> y <code>#sobre-mi</code> por los IDs exactos de tus secciones. Y si tu cabecera es más alta o más baja, ajusta el valor de <code>140px</code> hasta que quede perfecto).</em>

<h4 class="wp-block-heading">Paso 3: ¿Por Qué Funciona Este Código?</h4>

Este código gana la batalla por dos razones:

<ol start="1" class="wp-block-list">
<li><strong>Selector Ultra-Específico:</strong> La clave es <code>body.home .et-boc .et-l--body .et_pb_section#infoproductos</code>. Al ser tan largo y específico, tiene más "peso" que los estilos por defecto de Divi. Le estamos diciendo al navegador: "Ignora las reglas de padding de Divi para esta sección; esta es la que manda".</li>

<li><strong><code>padding-top: 140px !important;</code>:</strong> El <code>padding-top</code> crea un "relleno" interno en la parte superior de la sección azul. El script de Divi sigue saltando al borde de la sección, pero el <em>contenido</em> (tus filas y módulos) ahora empieza 140px más abajo, quedando perfectamente visible. El <code>!important</code> es el seguro final para garantizar que nuestra regla gane siempre.</li>
</ol>

<hr class="wp-block-separator has-alpha-channel-opacity" />

<h3 class="wp-block-heading"><strong>Conclusión: ¡Problema Resuelto!</strong></h3>

¡Y listo! Con esta simple regla de CSS, tu navegación por anclas en el Constructor de Temas de Divi funcionará perfectamente, el contenido será visible y habrás solucionado uno de los problemas más frustrantes de esta plataforma.

Como has visto, Divi es increíblemente potente, pero a veces hay que conocer sus secretos más profundos para dominarlo por completo.

Espero que esta guía te haya ahorrado horas de frustración. Resolver estos desafíos técnicos es mi especialidad. Si estás cansado de pelear con tu sitio web y prefieres que un experto se encargue de la optimización, el mantenimiento y la solución de problemas, <strong>hablemos.</strong>

<a class="wp-block-button__link wp-element-button" href="https://wa.me/59898472684?text=Hola%20Néstor%2C%20vi%20tu%20portfolio%20y%20me%20gustaría%20consultarte.HD1" target="_blank" rel="noopener">Contactar Ahora</a>
