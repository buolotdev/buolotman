"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";

export interface CountryInfo {
  code: string;
  name: string;
  flag: string;
  currency: string;
  currencySymbol: string;
  defaultCity: string;
  callingCode: string;
  exchangeRateToRWF?: number; // Approximate conversion rate for live currency converter if needed
}

export const SUPPORTED_COUNTRIES: Record<string, CountryInfo> = {
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

export const DEFAULT_COUNTRY = SUPPORTED_COUNTRIES["RW"];

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
  formatPrice: (amt) => `${amt || 0} RWF`,
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
          return { ...parsed, isAutoDetected: false };
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

  // Background IP detection
  useEffect(() => {
    let isMounted = true;

    async function detectGeoLocation() {
      // If user has already explicitly chosen their country in localStorage, keep their choice
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("boulotman_user_location");
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (isMounted) {
              setLocationState({ ...parsed, isAutoDetected: false });
              setIsLoaded(true);
            }
            return;
          } catch {
            // continue detection
          }
        }
      }

      try {
        // Primary ultra-fast Geo-IP service
        const res = await fetch("https://ipapi.co/json/", { cache: "no-store" });
        if (!res.ok) throw new Error("ipapi failed");
        const data = await res.json();

        if (data && data.country_code) {
          const code = (data.country_code || "").toUpperCase();
          const countryMatch = SUPPORTED_COUNTRIES[code];

          const countryName = countryMatch ? countryMatch.name : (data.country_name || DEFAULT_COUNTRY.name);
          const detectedCity = data.city || (countryMatch ? countryMatch.defaultCity : DEFAULT_COUNTRY.defaultCity);
          const flag = countryMatch ? countryMatch.flag : getFlagEmoji(code);
          const currency = countryMatch ? countryMatch.currency : (data.currency || DEFAULT_COUNTRY.currency);
          const currencySymbol = countryMatch ? countryMatch.currencySymbol : (data.currency || DEFAULT_COUNTRY.currencySymbol);

          const newLocation: UserLocation = {
            country: countryName,
            countryCode: code,
            city: detectedCity,
            flag,
            currency,
            currencySymbol,
            isAutoDetected: true,
            latitude: data.latitude,
            longitude: data.longitude,
          };

          if (isMounted) {
            setLocationState(newLocation);
            setIsLoaded(true);
            try {
              localStorage.setItem("boulotman_user_location", JSON.stringify(newLocation));
            } catch {
              // ignore
            }
          }
          return;
        }
      } catch {
        // Secondary fallback
        try {
          const fallbackRes = await fetch("https://api.country.is/", { cache: "no-store" });
          if (fallbackRes.ok) {
            const fallbackData = await fallbackRes.json();
            const code = (fallbackData.country || "RW").toUpperCase();
            const countryMatch = SUPPORTED_COUNTRIES[code];
            const newLocation: UserLocation = {
              country: countryMatch ? countryMatch.name : (code === "PK" ? "Pakistan" : DEFAULT_COUNTRY.name),
              countryCode: code,
              city: countryMatch ? countryMatch.defaultCity : DEFAULT_COUNTRY.defaultCity,
              flag: countryMatch ? countryMatch.flag : getFlagEmoji(code),
              currency: countryMatch ? countryMatch.currency : DEFAULT_COUNTRY.currency,
              currencySymbol: countryMatch ? countryMatch.currencySymbol : DEFAULT_COUNTRY.currencySymbol,
              isAutoDetected: true,
            };
            if (isMounted) {
              setLocationState(newLocation);
              setIsLoaded(true);
            }
            return;
          }
        } catch {
          // Keep default
        }
      }

      if (isMounted) {
        setIsLoaded(true);
      }
    }

    detectGeoLocation();

    return () => {
      isMounted = false;
    };
  }, []);

  // Manual country switch
  const setCountry = (countryCode: string) => {
    const code = countryCode.toUpperCase();
    const info = SUPPORTED_COUNTRIES[code] || DEFAULT_COUNTRY;
    const newLocation: UserLocation = {
      country: info.name,
      countryCode: info.code,
      city: info.defaultCity,
      flag: info.flag,
      currency: info.currency,
      currencySymbol: info.currencySymbol,
      isAutoDetected: false,
    };
    setLocationState(newLocation);
    try {
      localStorage.setItem("boulotman_user_location", JSON.stringify(newLocation));
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

      // Score items by geographic proximity / match:
      // Exact city match => priority 3
      // Country match => priority 2
      // General/Other => priority 1
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
