/**
 * Automatic Browser / IP Geolocation and Language Detector
 * Supports automatic universal detection for ALL countries globally with full manual override memory.
 */

export function getCountryNameFromCode(code: string): string {
  if (!code || code.length !== 2) return "United States";
  const upper = code.toUpperCase();
  try {
    if (typeof Intl !== "undefined" && Intl.DisplayNames) {
      const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
      const name = regionNames.of(upper);
      if (name) return name;
    }
  } catch {
    // fallback
  }

  const fallbackMap: Record<string, string> = {
    US: "United States",
    GB: "United Kingdom",
    CA: "Canada",
    AU: "Australia",
    FR: "France",
    DE: "Germany",
    IT: "Italy",
    ES: "Spain",
    PK: "Pakistan",
    IN: "India",
    AE: "United Arab Emirates",
    SA: "Saudi Arabia",
    QA: "Qatar",
    EG: "Egypt",
    CN: "China",
    JP: "Japan",
    BR: "Brazil",
    MX: "Mexico",
    RW: "Rwanda",
    KE: "Kenya",
    NG: "Nigeria",
    GH: "Ghana",
    ZA: "South Africa",
    CI: "Ivory Coast",
    CM: "Cameroon",
    UG: "Uganda",
    SN: "Senegal",
    TZ: "Tanzania",
    CD: "DR Congo",
    CG: "Congo",
    ET: "Ethiopia",
    ZM: "Zambia",
    ZW: "Zimbabwe",
  };

  return fallbackMap[upper] || upper;
}

const FRANCOPHONE_CODES = [
  "CI", "CM", "SN", "ML", "BF", "GN", "BJ", "TG", "NE", "CD", "CG", "GA", "FR", "BE", "MG", "HT", "MC", "CH"
];

const ARABIC_CODES = [
  "AE", "SA", "QA", "KW", "OM", "BH", "EG", "DZ", "MA", "TN", "LY", "SD", "IQ", "JO", "LB"
];

export async function detectAndSetGeoLanguage(): Promise<{
  country: string;
  countryCode: string;
  lang: string;
  changed: boolean;
}> {
  if (typeof window === "undefined") {
    return { country: "United States", countryCode: "US", lang: "en", changed: false };
  }

  const hasManualCountry = localStorage.getItem("user_selected_country") === "true";
  const hasManualLang = localStorage.getItem("user_selected_lang") === "true";

  const initialCountry = localStorage.getItem("country");
  const initialCountryCode = localStorage.getItem("country_code") || "";
  const initialLang = localStorage.getItem("lang");

  // If user already manually selected both, respect their explicit choice
  if (hasManualCountry && hasManualLang && initialCountry && initialLang) {
    return {
      country: initialCountry,
      countryCode: initialCountryCode || "US",
      lang: initialLang,
      changed: false,
    };
  }

  let detectedCountry = initialCountry;
  let detectedCountryCode = initialCountryCode;
  let detectedLang = initialLang;
  let changed = false;

  // 1. Instant Browser Language Detection
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
    } catch {
      detectedLang = "en";
    }
  }

  // 2. High-Accuracy IP Geolocation Lookup
  if (!hasManualCountry || !hasManualLang) {
    let lookupSuccess = false;

    // A) Try ipapi.co (detailed IP data with country name + country code + city)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);
      const res = await fetch("https://ipapi.co/json/", {
        signal: controller.signal,
        cache: "no-store",
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data && (data.country_code || data.country)) {
          const code = (data.country_code || data.country || "").toUpperCase();
          const name = data.country_name || getCountryNameFromCode(code);

          if (!hasManualCountry && name) {
            detectedCountry = name;
            detectedCountryCode = code;
            changed = true;
          }

          if (!hasManualLang) {
            if (FRANCOPHONE_CODES.includes(code)) {
              detectedLang = "fr";
              changed = true;
            } else if (ARABIC_CODES.includes(code)) {
              detectedLang = "ar";
              changed = true;
            } else {
              detectedLang = "en";
              changed = true;
            }
          }
          lookupSuccess = true;
        }
      }
    } catch {
      // Try fallback service
    }

    // B) Secondary fallback: api.country.is
    if (!lookupSuccess) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);
        const res = await fetch("https://api.country.is/", {
          signal: controller.signal,
          cache: "no-store",
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          const code = (data.country || "").toUpperCase();
          if (code && code.length === 2) {
            const name = getCountryNameFromCode(code);
            if (!hasManualCountry && name) {
              detectedCountry = name;
              detectedCountryCode = code;
              changed = true;
            }
            if (!hasManualLang) {
              if (FRANCOPHONE_CODES.includes(code)) {
                detectedLang = "fr";
                changed = true;
              } else if (ARABIC_CODES.includes(code)) {
                detectedLang = "ar";
                changed = true;
              } else {
                detectedLang = "en";
                changed = true;
              }
            }
            lookupSuccess = true;
          }
        }
      } catch {
        // Fall back to TimeZone
      }
    }

    // C) Timezone-based Country Detection if network lookup was unavailable
    if (!lookupSuccess && !hasManualCountry && !detectedCountry) {
      try {
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
        if (timeZone.includes("America/") || timeZone.includes("New_York") || timeZone.includes("Chicago") || timeZone.includes("Los_Angeles")) {
          detectedCountry = "United States";
          detectedCountryCode = "US";
        } else if (timeZone.includes("London") || timeZone.includes("Europe/London")) {
          detectedCountry = "United Kingdom";
          detectedCountryCode = "GB";
        } else if (timeZone.includes("Toronto") || timeZone.includes("Vancouver")) {
          detectedCountry = "Canada";
          detectedCountryCode = "CA";
        } else if (timeZone.includes("Paris")) {
          detectedCountry = "France";
          detectedCountryCode = "FR";
          if (!hasManualLang) detectedLang = "fr";
        } else if (timeZone.includes("Karachi")) {
          detectedCountry = "Pakistan";
          detectedCountryCode = "PK";
        } else if (timeZone.includes("Calcutta") || timeZone.includes("Kolkata")) {
          detectedCountry = "India";
          detectedCountryCode = "IN";
        } else if (timeZone.includes("Dubai")) {
          detectedCountry = "United Arab Emirates";
          detectedCountryCode = "AE";
        } else if (timeZone.includes("Lagos")) {
          detectedCountry = "Nigeria";
          detectedCountryCode = "NG";
        } else if (timeZone.includes("Kigali")) {
          detectedCountry = "Rwanda";
          detectedCountryCode = "RW";
        } else if (timeZone.includes("Nairobi")) {
          detectedCountry = "Kenya";
          detectedCountryCode = "KE";
        } else if (timeZone.includes("Accra")) {
          detectedCountry = "Ghana";
          detectedCountryCode = "GH";
        } else if (timeZone.includes("Johannesburg")) {
          detectedCountry = "South Africa";
          detectedCountryCode = "ZA";
        } else if (timeZone.includes("Abidjan")) {
          detectedCountry = "Ivory Coast";
          detectedCountryCode = "CI";
          if (!hasManualLang) detectedLang = "fr";
        } else if (timeZone.includes("Douala") || timeZone.includes("Yaounde")) {
          detectedCountry = "Cameroon";
          detectedCountryCode = "CM";
          if (!hasManualLang) detectedLang = "fr";
        }
        if (detectedCountry) changed = true;
      } catch {
        // ignore
      }
    }
  }

  // Universal Fallbacks
  if (!detectedCountry) {
    detectedCountry = "United States";
    detectedCountryCode = "US";
  }
  if (!detectedCountryCode) {
    detectedCountryCode = "US";
  }
  if (!detectedLang) {
    detectedLang = "en";
  }

  // Store detected defaults if user hasn't manually overridden
  if (!hasManualCountry) {
    localStorage.setItem("country", detectedCountry);
    localStorage.setItem("country_code", detectedCountryCode);
  }
  if (!hasManualLang) {
    localStorage.setItem("lang", detectedLang);
  }

  return {
    country: detectedCountry,
    countryCode: detectedCountryCode,
    lang: detectedLang,
    changed,
  };
}
