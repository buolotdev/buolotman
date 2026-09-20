/**
 * Automatic Browser / IP Geolocation and Language Detector
 * Supports automatic universal detection for ALL countries globally with full manual override memory.
 */

export function getCountryCodeFromName(name: string): string {
  if (!name) return "US";
  const trimmed = name.trim().toLowerCase();
  
  if (/^[a-z]{2}$/i.test(trimmed)) {
    return trimmed.toUpperCase();
  }

  const nameToCode: Record<string, string> = {
    "united states": "US",
    "united states of america": "US",
    "usa": "US",
    "us": "US",
    "united kingdom": "GB",
    "uk": "GB",
    "great britain": "GB",
    "england": "GB",
    "canada": "CA",
    "australia": "AU",
    "france": "FR",
    "germany": "DE",
    "italy": "IT",
    "spain": "ES",
    "pakistan": "PK",
    "india": "IN",
    "united arab emirates": "AE",
    "uae": "AE",
    "saudi arabia": "SA",
    "qatar": "QA",
    "egypt": "EG",
    "china": "CN",
    "japan": "JP",
    "brazil": "BR",
    "mexico": "MX",
    "rwanda": "RW",
    "kenya": "KE",
    "nigeria": "NG",
    "ghana": "GH",
    "south africa": "ZA",
    "ivory coast": "CI",
    "côte d'ivoire": "CI",
    "cote d'ivoire": "CI",
    "cameroon": "CM",
    "cameroun": "CM",
    "uganda": "UG",
    "senegal": "SN",
    "sénégal": "SN",
    "tanzania": "TZ",
    "dr congo": "CD",
    "democratic republic of the congo": "CD",
    "congo": "CG",
    "ethiopia": "ET",
    "zambia": "ZM",
    "zimbabwe": "ZW",
    "mali": "ML",
    "burkina faso": "BF",
    "guinea": "GN",
    "benin": "BJ",
    "togo": "TG",
    "niger": "NE",
    "gabon": "GA",
    "belgium": "BE",
    "madagascar": "MG",
    "morocco": "MA",
    "algeria": "DZ",
    "tunisia": "TN",
    "kuwait": "KW",
    "oman": "OM",
    "bahrain": "BH",
  };

  return nameToCode[trimmed] || "US";
}

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
    const finalCode = (initialCountryCode && initialCountryCode.length === 2) 
      ? initialCountryCode 
      : getCountryCodeFromName(initialCountry);
    return {
      country: initialCountry,
      countryCode: finalCode || "US",
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

    // A) Try internal Next.js /api/geo (Zero CORS, checks headers/server IP)
    try {
      const res = await fetch("/api/geo", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        const code = (data.country_code || "").toUpperCase();
        if (code && code.length === 2) {
          const name = data.country || getCountryNameFromCode(code);
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
      // fallback
    }

    // B) Try CORS-free ipwho.is
    if (!lookupSuccess) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);
        const res = await fetch("https://ipwho.is/", {
          signal: controller.signal,
          cache: "no-store",
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          if (data && data.success && data.country_code) {
            const code = (data.country_code || "").toUpperCase();
            const name = data.country || getCountryNameFromCode(code);

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
        // fallback
      }
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
  if (!detectedCountryCode || detectedCountryCode.length !== 2) {
    detectedCountryCode = getCountryCodeFromName(detectedCountry);
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
