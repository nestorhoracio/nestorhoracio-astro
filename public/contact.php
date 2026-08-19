<?php
/**
 * Procesa el formulario de /contacto/. Vive en la raíz del sitio (Astro
 * copia todo lo de public/ tal cual al build) porque HostGator no puede
 * ejecutar nada del build de Astro — esto es lo único server-side del
 * sitio. Ver CLAUDE.md.
 */

$destinatario = 'nesthora@gmail.com';
$sitio = 'https://nestorhoracio.com';

function volver($query) {
    global $sitio;
    header("Location: $sitio/contacto/?$query", true, 303);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    volver('error=metodo');
}

// Honeypot: campo invisible para humanos. Si viene lleno, es un bot —
// fingimos éxito para no darle feedback de que lo detectamos.
if (!empty($_POST['website'])) {
    volver('ok=1');
}

// Throttle simple: no más de un envío cada 20s desde el mismo navegador.
// Fricción básica (doble-click, script simple) — no es CAPTCHA, un bot
// que no persiste cookies lo esquiva sin esfuerzo.
if (isset($_COOKIE['nh_last_submit']) && (time() - (int) $_COOKIE['nh_last_submit']) < 20) {
    volver('error=espera');
}
setcookie('nh_last_submit', (string) time(), time() + 3600, '/');

$nombre = trim($_POST['nombre'] ?? '');
$email = trim($_POST['email'] ?? '');
$mensaje = trim($_POST['mensaje'] ?? '');

if ($nombre === '' || $email === '' || $mensaje === '') {
    volver('error=incompleto');
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    volver('error=email');
}

// Anti header-injection: ningún campo puede meter saltos de línea en los
// headers del mail (los que sí van a headers: email, nombre).
$limpiar_header = fn($v) => str_replace(["\r", "\n"], '', $v);
$nombre_h = $limpiar_header($nombre);
$email_h = $limpiar_header($email);

$asunto = 'Nuevo mensaje de contacto — nestorhoracio.com';
$cuerpo = "Nombre: $nombre\n" .
          "Email: $email\n\n" .
          "Mensaje:\n$mensaje\n";

// From con el dominio propio (mejor entregabilidad); Reply-To al
// visitante para poder responderle directo desde el mail.
$headers = "From: Formulario nestorhoracio.com <noreply@nestorhoracio.com>\r\n" .
           "Reply-To: $nombre_h <$email_h>\r\n" .
           "Content-Type: text/plain; charset=UTF-8\r\n";

$enviado = mail($destinatario, $asunto, $cuerpo, $headers);

volver($enviado ? 'ok=1' : 'error=envio');
