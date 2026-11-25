/**
 * Consentimiento de analítica (Google Analytics 4) — Consent Mode v2, modo básico.
 *
 * - Visitante en zona con consentimiento (UE, EEE, Reino Unido, Suiza, o zona
 *   horaria ilegible): NO se carga gtag.js ni se crea ninguna cookie hasta que
 *   acepte en el banner. La elección se guarda en localStorage por 12 meses.
 * - Resto del mundo: GA4 se carga directo, como antes.
 * - La zona se detecta con la zona horaria del navegador (sin red, sin enviar
 *   la IP a nadie). Ver CLAUDE.md → Analytics.
 *
 * Todo corre desde un único script externo (Layout.astro) por la CSP: nada inline.
 */

const GA_ID = "G-78H35GJS30";
// Cookie de la propiedad: GA4 usa el ID SIN el prefijo "G-".
const GA_COOKIES = ["_ga", "_ga_78H35GJS30"];
const COOKIE_DOMAIN = ".nestorhoracio.com";

const STORAGE_KEY = "nhConsent";
const STORAGE_VERSION = 1; // subirlo vuelve a pedir consentimiento a todos
const MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000; // 12 meses

type Choice = "granted" | "denied";

// Zonas IANA de la UE/EEE/UK/Suiza que no empiezan con "Europe/" (o alias viejos).
// Europe/* ya cubre la mayoría, incluidos Gibraltar, Jersey, Guernsey, Isle_of_Man,
// Vaduz, Zurich, Busingen, London y Belfast.
const CONSENT_ZONES = new Set([
  // España
  "Africa/Ceuta",
  "Atlantic/Canary",
  // Portugal
  "Atlantic/Madeira",
  "Atlantic/Azores",
  // Chipre
  "Asia/Nicosia",
  "Asia/Famagusta",
  // Noruega / Islandia / Dinamarca (Feroe)
  "Arctic/Longyearbyen",
  "Atlantic/Jan_Mayen",
  "Atlantic/Reykjavik",
  "Atlantic/Faroe",
  // Francia de ultramar (regiones ultraperiféricas de la UE)
  "America/Guadeloupe",
  "America/Martinique",
  "America/Cayenne",
  "America/Marigot",
  "Indian/Reunion",
  "Indian/Mayotte",
  // Alias legacy que algún navegador/SO todavía puede devolver
  "CET",
  "MET",
  "EET",
  "WET",
]);

export function isConsentRegion(): boolean {
  let tz = "";
  try {
    tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  } catch {
    tz = "";
  }
  // Si no se puede leer la zona, se asume zona con consentimiento (lado seguro).
  if (!tz) return true;
  return tz.startsWith("Europe/") || CONSENT_ZONES.has(tz);
}

function readStored(): Choice | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data || data.v !== STORAGE_VERSION) return null;
    if (data.analytics !== "granted" && data.analytics !== "denied") return null;
    if (typeof data.ts !== "number") return null;
    const age = Date.now() - data.ts;
    if (age > MAX_AGE_MS || age < -60_000) return null; // vencida o con fecha futura
    return data.analytics;
  } catch {
    return null;
  }
}

function writeStored(choice: Choice): void {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ v: STORAGE_VERSION, analytics: choice, ts: Date.now() }),
    );
  } catch {
    // Sin localStorage (modo privado estricto, bloqueado): la elección vale
    // solo para esta página y se vuelve a preguntar en la próxima.
  }
}

// --- GA4 ---------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const w = window as any;
let analyticsEnabled = false;

export function isAnalyticsEnabled(): boolean {
  return analyticsEnabled;
}

function enableAnalytics(): void {
  if (analyticsEnabled) return;
  analyticsEnabled = true;

  w.dataLayer = w.dataLayer || [];
  // gtag.js necesita recibir el objeto `arguments`, no un array.
  w.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    w.dataLayer.push(arguments);
  };

  // Consent Mode v2: el sitio no usa publicidad, así que esas tres señales
  // quedan siempre en "denied". Analítica "granted" porque o aceptó (zona con
  // consentimiento) o está fuera de la zona.
  w.gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "granted",
  });
  w.gtag("js", new Date());
  w.gtag("config", GA_ID);

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);
}

function deleteGaCookies(): void {
  const host = location.hostname;
  const domains = [undefined, host, `.${host}`, COOKIE_DOMAIN];
  for (const name of GA_COOKIES) {
    for (const domain of domains) {
      document.cookie =
        `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/` +
        (domain ? `; domain=${domain}` : "");
    }
  }
}

function revokeAnalytics(): void {
  if (typeof w.gtag === "function") {
    w.gtag("consent", "update", { analytics_storage: "denied" });
  }
  w[`ga-disable-${GA_ID}`] = true;
  deleteGaCookies();
}

// Clics salientes (WhatsApp / redes / reseña). Se evalúa el consentimiento en
// CADA clic: así, tras aceptar, se mide sin recargar; y antes de aceptar no se
// encola nada en el dataLayer.
function onTrackedClick(event: MouseEvent): void {
  if (!analyticsEnabled) return;

  const target = event.target as HTMLElement | null;
  const link = target?.closest("a[href]") as HTMLAnchorElement | null;
  if (!link) return;

  const href = link.href;

  if (href.includes("wa.me") || href.includes("api.whatsapp.com")) {
    w.gtag("event", "whatsapp_click", {
      link_url: href,
      link_text: link.textContent?.trim().slice(0, 100) || "",
      page_path: window.location.pathname,
    });
    return;
  }

  if (href.includes("facebook.com") || href.includes("instagram.com")) {
    w.gtag("event", "social_click", {
      network: href.includes("facebook.com") ? "facebook" : "instagram",
      link_url: href,
      page_path: window.location.pathname,
    });
    return;
  }

  if (href.includes("g.page")) {
    w.gtag("event", "google_review_click", {
      link_url: href,
      page_path: window.location.pathname,
    });
  }
}

// --- Banner ------------------------------------------------------------

export function initConsent(): void {
  document.addEventListener("click", onTrackedClick);

  const region = isConsentRegion();
  const banner = document.getElementById("nh-consent");
  const prefs = document.querySelector<HTMLElement>("[data-consent-prefs]");
  const openButton = document.querySelector<HTMLElement>("[data-consent-open]");

  // "Preferencias de cookies" solo existe para la zona con consentimiento.
  if (region && prefs) prefs.hidden = false;

  const showBanner = (moveFocus: boolean) => {
    if (!banner) return;
    banner.hidden = false;
    if (moveFocus) banner.querySelector<HTMLElement>("[data-consent-choice]")?.focus();
  };

  const hideBanner = () => {
    if (!banner || banner.hidden) return;
    const hadFocus = banner.contains(document.activeElement);
    banner.hidden = true;
    if (hadFocus) openButton?.focus();
  };

  const choose = (choice: Choice) => {
    writeStored(choice);
    if (choice === "granted") {
      enableAnalytics();
    } else if (analyticsEnabled) {
      // Pasó de aceptado a rechazado: cortar, borrar cookies y recargar para
      // que gtag.js no quede cargado en memoria.
      revokeAnalytics();
      location.reload();
      return;
    }
    hideBanner();
  };

  banner?.addEventListener("click", (event) => {
    const button = (event.target as HTMLElement).closest<HTMLElement>("[data-consent-choice]");
    if (button) choose(button.dataset.consentChoice as Choice);
  });
  openButton?.addEventListener("click", () => showBanner(true));

  const stored = readStored();
  if (stored === "granted") {
    enableAnalytics();
  } else if (stored === "denied") {
    // Respetar el rechazo aunque ahora la zona horaria sea otra.
  } else if (region) {
    showBanner(false);
  } else {
    enableAnalytics();
  }
}
