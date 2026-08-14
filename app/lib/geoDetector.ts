/**
 * Automatic Browser / IP Geolocation and Language Detector
 * Supports automatic detection with full manual override memory.
 */

const COUNTRY_MAP: Record<string, string> = {
  RW: "Rwanda",
  KE: "Kenya",
  NG: "Nigeria",
  GH: "Ghana",
  ZA: "South Africa",
  CI: "Ivory Coast",
  CM: "Cameroon",
};

const FRANCOPHONE_CODES = [
  "CI", "CM", "SN", "ML", "BF", "GN", "BJ", "TG", "NE", "CD", "CG", "GA", "FR", "BE", "MG"
];

const ANGLOPHONE_CODES = [
  "NG", "GH", "KE", "ZA", "GB", "US", "CA", "AU", "UG", "TZ", "ZM", "ZW"
];

export async function detectAndSetGeoLanguage(): Promise<{ country: string; lang: string; changed: boolean }> {
  if (typeof window === "undefined") {
    return { country: "Rwanda", lang: "en", changed: false };
  }

  const hasManualCountry = localStorage.getItem("user_selected_country") === "true";
  const hasManualLang = localStorage.getItem("user_selected_lang") === "true";

  const initialCountry = localStorage.getItem("country");
  const initialLang = localStorage.getItem("lang");

  // If user already manually selected both, respect their choice
  if (hasManualCountry && hasManualLang && initialCountry && initialLang) {
    return {
      country: initialCountry,
      lang: initialLang,
      changed: false,
    };
  }

  let detectedCountry = initialCountry;
  let detectedLang = initialLang;
  let changed = false;

  // 1. Instant Browser Language Detection (if not manually chosen)
  if (!hasManualLang && !detectedLang) {
    try {
      const browserLang = (navigator.language || (navigator as any).userLanguage || "en").toLowerCase();
      if (browserLang.startsWith("fr")) {
        detectedLang = "fr";
      } else if (browserLang.startsWith("ar")) {
        detectedLang = "ar";
      } else {
        detectedLang = "en";
      }
      changed = true;
    } catch (e) {
      detectedLang = "en";
    }
  }

  // 2. Instant Timezone-based Country Detection (instant fallback before IP API)
  if (!hasManualCountry && !detectedCountry) {
    try {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
      if (timeZone.includes("Lagos")) {
        detectedCountry = "Nigeria";
        if (!hasManualLang) detectedLang = "en";
      } else if (timeZone.includes("Kigali")) {
        detectedCountry = "Rwanda";
      } else if (timeZone.includes("Nairobi")) {
        detectedCountry = "Kenya";
        if (!hasManualLang) detectedLang = "en";
      } else if (timeZone.includes("Accra")) {
        detectedCountry = "Ghana";
        if (!hasManualLang) detectedLang = "en";
      } else if (timeZone.includes("Johannesburg")) {
        detectedCountry = "South Africa";
        if (!hasManualLang) detectedLang = "en";
      } else if (timeZone.includes("Abidjan")) {
        detectedCountry = "Ivory Coast";
        if (!hasManualLang) detectedLang = "fr";
      } else if (timeZone.includes("Douala") || timeZone.includes("Yaounde")) {
        detectedCountry = "Cameroon";
        if (!hasManualLang) detectedLang = "fr";
      }
      if (detectedCountry) changed = true;
    } catch (e) {
      // ignore
    }
  }

  // 3. Fast IP Geolocation Lookup (non-blocking)
  if (!hasManualCountry || !hasManualLang) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      // Fast, lightweight country-by-IP lookup
      const res = await fetch("https://api.country.is/", { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const code = (data.country || "").toUpperCase();

        if (!hasManualCountry && COUNTRY_MAP[code]) {
          detectedCountry = COUNTRY_MAP[code];
          changed = true;
        }

        if (!hasManualLang) {
          if (FRANCOPHONE_CODES.includes(code)) {
            detectedLang = "fr";
            changed = true;
          } else if (ANGLOPHONE_CODES.includes(code)) {
            detectedLang = "en";
            changed = true;
          }
        }
      }
    } catch (e) {
      // IP lookup timed out or network blocked; keep timezone / browser defaults
    }
  }

  // Fallbacks
  if (!detectedCountry) detectedCountry = "Rwanda";
  if (!detectedLang) detectedLang = "en";

  // Store detected defaults if user hasn't manually overridden
  if (!hasManualCountry) {
    localStorage.setItem("country", detectedCountry);
  }
  if (!hasManualLang) {
    localStorage.setItem("lang", detectedLang);
  }

  return { country: detectedCountry, lang: detectedLang, changed };
}
