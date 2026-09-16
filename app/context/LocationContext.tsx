"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { getCountryNameFromCode } from "@/app/lib/geoDetector";

export interface CountryInfo {
  code: string;
  name: string;
  flag: string;
  currency: string;
  currencySymbol: string;
  defaultCity: string;
  callingCode: string;
  exchangeRateToRWF?: number;
}

export const SUPPORTED_COUNTRIES: Record<string, CountryInfo> = {
  US: {
    code: "US",
    name: "United States",
    flag: "🇺🇸",
    currency: "USD",
    currencySymbol: "$",
    defaultCity: "New York",
    callingCode: "+1",
  },
  GB: {
    code: "GB",
    name: "United Kingdom",
    flag: "🇬🇧",
    currency: "GBP",
    currencySymbol: "£",
    defaultCity: "London",
    callingCode: "+44",
  },
  CA: {
    code: "CA",
    name: "Canada",
    flag: "🇨🇦",
    currency: "CAD",
    currencySymbol: "$",
    defaultCity: "Toronto",
    callingCode: "+1",
  },
  FR: {
    code: "FR",
    name: "France",
    flag: "🇫🇷",
    currency: "EUR",
    currencySymbol: "€",
    defaultCity: "Paris",
    callingCode: "+33",
  },
  DE: {
    code: "DE",
    name: "Germany",
    flag: "🇩🇪",
    currency: "EUR",
    currencySymbol: "€",
    defaultCity: "Berlin",
    callingCode: "+49",
  },
  AE: {
    code: "AE",
    name: "United Arab Emirates",
    flag: "🇦🇪",
    currency: "AED",
    currencySymbol: "AED",
    defaultCity: "Dubai",
    callingCode: "+971",
  },
  PK: {
    code: "PK",
    name: "Pakistan",
    flag: "🇵🇰",
    currency: "PKR",
    currencySymbol: "Rs",
    defaultCity: "Islamabad",
    callingCode: "+92",
  },
  IN: {
    code: "IN",
    name: "India",
    flag: "🇮🇳",
    currency: "INR",
    currencySymbol: "₹",
    defaultCity: "New Delhi",
    callingCode: "+91",
  },
  RW: {
    code: "RW",
    name: "Rwanda",
    flag: "🇷🇼",
    currency: "RWF",
    currencySymbol: "FRw",
    defaultCity: "Kigali",
    callingCode: "+250",
  },
  NG: {
    code: "NG",
    name: "Nigeria",
    flag: "🇳🇬",
    currency: "NGN",
    currencySymbol: "₦",
    defaultCity: "Lagos",
    callingCode: "+234",
  },
  KE: {
    code: "KE",
    name: "Kenya",
    flag: "🇰🇪",
    currency: "KES",
    currencySymbol: "KSh",
    defaultCity: "Nairobi",
    callingCode: "+254",
  },
  GH: {
    code: "GH",
    name: "Ghana",
    flag: "🇬🇭",
    currency: "GHS",
    currencySymbol: "GH₵",
    defaultCity: "Accra",
    callingCode: "+233",
  },
  ZA: {
    code: "ZA",
    name: "South Africa",
    flag: "🇿🇦",
    currency: "ZAR",
    currencySymbol: "R",
    defaultCity: "Johannesburg",
    callingCode: "+27",
  },
  CI: {
    code: "CI",
    name: "Ivory Coast",
    flag: "🇨🇮",
    currency: "XOF",
    currencySymbol: "CFA",
    defaultCity: "Abidjan",
    callingCode: "+225",
  },
  CM: {
    code: "CM",
    name: "Cameroon",
    flag: "🇨🇲",
    currency: "XAF",
    currencySymbol: "FCFA",
    defaultCity: "Douala",
    callingCode: "+237",
  },
  UG: {
    code: "UG",
    name: "Uganda",
    flag: "🇺🇬",
    currency: "UGX",
    currencySymbol: "USh",
    defaultCity: "Kampala",
    callingCode: "+256",
  },
  SN: {
    code: "SN",
    name: "Senegal",
    flag: "🇸🇳",
    currency: "XOF",
    currencySymbol: "CFA",
    defaultCity: "Dakar",
    callingCode: "+221",
  },
  TZ: {
    code: "TZ",
    name: "Tanzania",
    flag: "🇹🇿",
    currency: "TZS",
    currencySymbol: "TSh",
    defaultCity: "Dar es Salaam",
    callingCode: "+255",
  },
};

export function getFlagEmoji(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) return "🌍";
  try {
    const codePoints = countryCode
      .toUpperCase()
      .split("")
      .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  } catch {
    return "🌍";
  }
}

export function resolveCountryInfo(code: string, fallbackName?: string, fallbackCurrency?: string, fallbackCity?: string): CountryInfo {
  const upper = (code || "US").toUpperCase();
  if (SUPPORTED_COUNTRIES[upper]) {
    return SUPPORTED_COUNTRIES[upper];
  }

  const name = fallbackName || getCountryNameFromCode(upper);
  const flag = getFlagEmoji(upper);
  const currency = fallbackCurrency || "USD";
  const currencySymbol = currency === "USD" ? "$" : currency === "EUR" ? "€" : currency === "GBP" ? "£" : currency;

  return {
    code: upper,
    name,
    flag,
    currency,
    currencySymbol,
    defaultCity: fallbackCity || name,
    callingCode: "+1",
  };
}

export const DEFAULT_COUNTRY = SUPPORTED_COUNTRIES["US"];

interface UserLocation {
  country: string;
  countryCode: string;
  city: string;
  flag: string;
  currency: string;
  currencySymbol: string;
  isAutoDetected: boolean;
  latitude?: number;
  longitude?: number;
}

interface LocationContextType {
  location: UserLocation;
  setCountry: (countryCode: string) => void;
  formatPrice: (amount: number | string | undefined | null) => string;
  filterByLocation: <T extends { city?: string; location?: string; country?: string }>(items: T[]) => T[];
  isLoaded: boolean;
}

const LocationContext = createContext<LocationContextType>({
  location: {
    country: DEFAULT_COUNTRY.name,
    countryCode: DEFAULT_COUNTRY.code,
    city: DEFAULT_COUNTRY.defaultCity,
    flag: DEFAULT_COUNTRY.flag,
    currency: DEFAULT_COUNTRY.currency,
    currencySymbol: DEFAULT_COUNTRY.currencySymbol,
    isAutoDetected: false,
  },
  setCountry: () => {},
  formatPrice: (amt) => `${amt || 0} USD`,
  filterByLocation: (items) => items,
  isLoaded: false,
});

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [location, setLocationState] = useState<UserLocation>(() => {
    // Check local storage on initialization
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("boulotman_user_location");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.country) {
            return { ...parsed, isAutoDetected: false };
          }
        }
      } catch {
        // ignore
      }
    }
    return {
      country: DEFAULT_COUNTRY.name,
      countryCode: DEFAULT_COUNTRY.code,
      city: DEFAULT_COUNTRY.defaultCity,
      flag: DEFAULT_COUNTRY.flag,
      currency: DEFAULT_COUNTRY.currency,
      currencySymbol: DEFAULT_COUNTRY.currencySymbol,
      isAutoDetected: false,
    };
  });

  const [isLoaded, setIsLoaded] = useState(false);

  // Background IP detection - strictly retains detected user country and never forces Rwanda
  useEffect(() => {
    let isMounted = true;

    async function detectGeoLocation() {
      // If user has manually chosen country, keep choice
      if (typeof window !== "undefined") {
        const hasManual = localStorage.getItem("user_selected_country") === "true";
        const saved = localStorage.getItem("boulotman_user_location");
        if (hasManual && saved) {
          try {
            const parsed = JSON.parse(saved);
            if (isMounted && parsed && parsed.country) {
              setLocationState({ ...parsed, isAutoDetected: false });
              setIsLoaded(true);
              return;
            }
          } catch {
            // continue detection
          }
        }
      }

      let detectedLoc: UserLocation | null = null;

      try {
        // Primary ultra-fast Geo-IP service
        const res = await fetch("https://ipapi.co/json/", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data && (data.country_code || data.country)) {
            const code = (data.country_code || data.country || "").toUpperCase();
            const resolved = resolveCountryInfo(code, data.country_name, data.currency, data.city);

            detectedLoc = {
              country: resolved.name,
              countryCode: resolved.code,
              city: data.city || resolved.defaultCity,
              flag: resolved.flag,
              currency: resolved.currency,
              currencySymbol: resolved.currencySymbol,
              isAutoDetected: true,
              latitude: data.latitude,
              longitude: data.longitude,
            };
          }
        }
      } catch {
        // Try secondary fallback
      }

      if (!detectedLoc) {
        try {
          const fallbackRes = await fetch("https://api.country.is/", { cache: "no-store" });
          if (fallbackRes.ok) {
            const fallbackData = await fallbackRes.json();
            const code = (fallbackData.country || "").toUpperCase();
            if (code && code.length === 2) {
              const resolved = resolveCountryInfo(code);
              detectedLoc = {
                country: resolved.name,
                countryCode: resolved.code,
                city: resolved.defaultCity,
                flag: resolved.flag,
                currency: resolved.currency,
                currencySymbol: resolved.currencySymbol,
                isAutoDetected: true,
              };
            }
          }
        } catch {
          // Fall back to Timezone
        }
      }

      if (!detectedLoc) {
        // Timezone heuristic
        try {
          const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
          let code = "US";
          if (timeZone.includes("America/") || timeZone.includes("New_York") || timeZone.includes("Chicago") || timeZone.includes("Los_Angeles")) {
            code = "US";
          } else if (timeZone.includes("London") || timeZone.includes("Europe/London")) {
            code = "GB";
          } else if (timeZone.includes("Toronto") || timeZone.includes("Vancouver")) {
            code = "CA";
          } else if (timeZone.includes("Paris")) {
            code = "FR";
          } else if (timeZone.includes("Karachi")) {
            code = "PK";
          } else if (timeZone.includes("Lagos")) {
            code = "NG";
          } else if (timeZone.includes("Nairobi")) {
            code = "KE";
          } else if (timeZone.includes("Kigali")) {
            code = "RW";
          } else if (timeZone.includes("Accra")) {
            code = "GH";
          } else if (timeZone.includes("Johannesburg")) {
            code = "ZA";
          } else if (timeZone.includes("Douala") || timeZone.includes("Yaounde")) {
            code = "CM";
          } else if (timeZone.includes("Abidjan")) {
            code = "CI";
          }

          const resolved = resolveCountryInfo(code);
          detectedLoc = {
            country: resolved.name,
            countryCode: resolved.code,
            city: resolved.defaultCity,
            flag: resolved.flag,
            currency: resolved.currency,
            currencySymbol: resolved.currencySymbol,
            isAutoDetected: true,
          };
        } catch {
          detectedLoc = {
            country: DEFAULT_COUNTRY.name,
            countryCode: DEFAULT_COUNTRY.code,
            city: DEFAULT_COUNTRY.defaultCity,
            flag: DEFAULT_COUNTRY.flag,
            currency: DEFAULT_COUNTRY.currency,
            currencySymbol: DEFAULT_COUNTRY.currencySymbol,
            isAutoDetected: true,
          };
        }
      }

      if (isMounted && detectedLoc) {
        setLocationState(detectedLoc);
        setIsLoaded(true);
        try {
          localStorage.setItem("boulotman_user_location", JSON.stringify(detectedLoc));
          localStorage.setItem("country", detectedLoc.country);
          localStorage.setItem("country_code", detectedLoc.countryCode);
        } catch {
          // ignore
        }
      }
    }

    detectGeoLocation();

    return () => {
      isMounted = false;
    };
  }, []);

  // Manual country switch
  const setCountry = (countryCode: string) => {
    const resolved = resolveCountryInfo(countryCode);
    const newLocation: UserLocation = {
      country: resolved.name,
      countryCode: resolved.code,
      city: resolved.defaultCity,
      flag: resolved.flag,
      currency: resolved.currency,
      currencySymbol: resolved.currencySymbol,
      isAutoDetected: false,
    };
    setLocationState(newLocation);
    try {
      localStorage.setItem("boulotman_user_location", JSON.stringify(newLocation));
      localStorage.setItem("country", newLocation.country);
      localStorage.setItem("country_code", newLocation.countryCode);
      localStorage.setItem("user_selected_country", "true");
    } catch {
      // ignore
    }
  };

  // Currency formatter
  const formatPrice = useMemo(() => {
    return (amount: number | string | undefined | null) => {
      const num = Number(amount) || 0;
      if (num === 0) return `0 ${location.currency}`;
      return `${num.toLocaleString()} ${location.currency}`;
    };
  }, [location.currency]);

  // Intelligent Location-Based Sorting & Filtering
  const filterByLocation = useMemo(() => {
    return <T extends { city?: string; location?: string; country?: string }>(items: T[]): T[] => {
      if (!items || !items.length) return [];
      const userCity = (location.city || "").toLowerCase();
      const userCountry = (location.country || "").toLowerCase();

      return [...items].sort((a, b) => {
        const aLoc = `${a.city || ""} ${a.location || ""} ${a.country || ""}`.toLowerCase();
        const bLoc = `${b.city || ""} ${b.location || ""} ${b.country || ""}`.toLowerCase();

        let aScore = 0;
        let bScore = 0;

        if (userCity && aLoc.includes(userCity)) aScore += 3;
        if (userCountry && aLoc.includes(userCountry)) aScore += 2;

        if (userCity && bLoc.includes(userCity)) bScore += 3;
        if (userCountry && bLoc.includes(userCountry)) bScore += 2;

        return bScore - aScore;
      });
    };
  }, [location.city, location.country]);

  return (
    <LocationContext.Provider
      value={{
        location,
        setCountry,
        formatPrice,
        filterByLocation,
        isLoaded,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  return useContext(LocationContext);
}
