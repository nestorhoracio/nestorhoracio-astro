<?php
/**
 * Procesa el formulario de /contacto/. Vive en la raíz del sitio (Astro
 * copia todo lo de public/ tal cual al build) porque HostGator no puede
 * ejecutar nada del build de Astro — esto es lo único server-side del
 * sitio. Ver CLAUDE.md.
 *
 * El envío usa la API de Resend (no mail() nativo de PHP): mail() reportaba
 * éxito pero el correo nunca llegaba a Gmail, ni a spam, con SPF/DKIM bien
 * configurados — típico problema de reputación de la IP compartida de
 * HostGator, no algo arreglable por config. Resend saca el envío del Exim
 * local del hosting. Ver ROADMAP.md.
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

// config.php no se commitea (ver .gitignore) — lo genera el workflow de
// deploy a partir del secret RESEND_API_KEY. Si falta (deploy sin
// configurar todavía), fallar en vez de intentar mail() de nuevo.
$configPath = __DIR__ . '/config.php';
$apiKey = file_exists($configPath) ? (string) require $configPath : '';
if ($apiKey === '') {
    volver('error=envio');
}

$asunto = 'Nuevo mensaje de contacto — nestorhoracio.com';
$cuerpo = "Nombre: $nombre\n" .
          "Email: $email\n\n" .
          "Mensaje:\n$mensaje\n";

// From con el dominio propio (mejor entregabilidad); Reply-To al
// visitante para poder responderle directo desde el mail.
$payload = json_encode([
    'from' => 'Formulario nestorhoracio.com <noreply@send.nestorhoracio.com>',
    'to' => [$destinatario],
    'reply_to' => $email,
    'subject' => $asunto,
    'text' => $cuerpo,
]);

$ch = curl_init('https://api.resend.com/emails');
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 10,
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer ' . $apiKey,
        'Content-Type: application/json',
    ],
    CURLOPT_POSTFIELDS => $payload,
]);
curl_exec($ch);
$http = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

volver(($http >= 200 && $http < 300) ? 'ok=1' : 'error=envio');
