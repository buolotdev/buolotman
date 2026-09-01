"use client";

import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
import "./footer.css";

interface CountryOption {
  country: string;
  currency: string;
  symbol: string;
  city: string;
  callingCode: string;
  flag: string;
}

const COUNTRIES_LIST: CountryOption[] = [
  {
    country: "Cameroon",
    currency: "XAF",
    symbol: "FCFA",
    city: "Douala",
    callingCode: "+237",
    flag: "https://flagcdn.com/w80/cm.png",
  },
  {
    country: "Rwanda",
    currency: "RWF",
    symbol: "FRw",
    city: "Kigali",
    callingCode: "+250",
    flag: "https://flagcdn.com/w80/rw.png",
  },
  {
    country: "Nigeria",
    currency: "NGN",
    symbol: "₦",
    city: "Lagos",
    callingCode: "+234",
    flag: "https://flagcdn.com/w80/ng.png",
  },
  {
    country: "Ivory Coast",
    currency: "XOF",
    symbol: "CFA",
    city: "Abidjan",
    callingCode: "+225",
    flag: "https://flagcdn.com/w80/ci.png",
  },
  {
    country: "Ghana",
    currency: "GHS",
    symbol: "GH₵",
    city: "Accra",
    callingCode: "+233",
    flag: "https://flagcdn.com/w80/gh.png",
  },
  {
    country: "Kenya",
    currency: "KES",
    symbol: "KSh",
    city: "Nairobi",
    callingCode: "+254",
    flag: "https://flagcdn.com/w80/ke.png",
  },
  {
    country: "South Africa",
    currency: "ZAR",
    symbol: "R",
    city: "Johannesburg",
    callingCode: "+27",
    flag: "https://flagcdn.com/w80/za.png",
  },
];

const LANGUAGES = [
  { label: "English", code: "en" },
  { label: "Français", code: "fr" },
  { label: "Kinyarwanda", code: "rw" },
  { label: "العربية", code: "ar" },
];

export default function Footer() {
  const [selectedCountry, setSelectedCountry] = useState<CountryOption>(COUNTRIES_LIST[0]);
  const [countryOpen, setCountryOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");

  const [selectedLang, setSelectedLang] = useState(LANGUAGES[0]);
  const [langOpen, setLangOpen] = useState(false);

  const countryPickerRef = useRef<HTMLDivElement>(null);
  const langPickerRef = useRef<HTMLDivElement>(null);

  // Restore saved country & language on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCountry = localStorage.getItem("bmSelectedCountry") || localStorage.getItem("country");
      if (savedCountry) {
        const found = COUNTRIES_LIST.find(
          (c) => c.country.toLowerCase() === savedCountry.toLowerCase()
        );
        if (found) setSelectedCountry(found);
      }

      const savedLang = localStorage.getItem("lang") || "en";
      const foundLang = LANGUAGES.find((l) => l.code === savedLang);
      if (foundLang) setSelectedLang(foundLang);
    }
  }, []);

  // Close dropdowns on outside click or escape
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (countryPickerRef.current && !countryPickerRef.current.contains(e.target as Node)) {
        setCountryOpen(false);
        setCountrySearch("");
      }
      if (langPickerRef.current && !langPickerRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setCountryOpen(false);
        setLangOpen(false);
        setCountrySearch("");
      }
    };

    document.addEventListener("click", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleCountrySelect = (c: CountryOption) => {
    setSelectedCountry(c);
    setCountryOpen(false);
    setCountrySearch("");
    if (typeof window !== "undefined") {
      localStorage.setItem("bmSelectedCountry", c.country);
      localStorage.setItem("country", c.country);
      localStorage.setItem("bmSelectedCurrency", c.currency);
      localStorage.setItem("bmSelectedCurrencySymbol", c.symbol);
      localStorage.setItem("bmSelectedCountryFlag", c.flag);
      document.dispatchEvent(
        new CustomEvent("bmCountryChanged", { detail: c })
      );
    }
  };

  const handleLanguageSelect = (lang: (typeof LANGUAGES)[0]) => {
    setSelectedLang(lang);
    setLangOpen(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("lang", lang.code);
      localStorage.setItem("user_selected_lang", "true");
      document.documentElement.dir = lang.code === "ar" ? "rtl" : "ltr";
      document.documentElement.setAttribute("lang", lang.code);
      window.dispatchEvent(new Event("languageChange"));
      document.dispatchEvent(
        new CustomEvent("bmLanguageChanged", { detail: lang })
      );
    }
  };

  const filteredCountries = COUNTRIES_LIST.filter((c) => {
    const q = countrySearch.trim().toLowerCase();
    if (!q) return true;
    return (
      c.country.toLowerCase().includes(q) ||
      c.currency.toLowerCase().includes(q) ||
      c.city.toLowerCase().includes(q) ||
      c.callingCode.toLowerCase().includes(q)
    );
  });

  return (
    <footer className="bmf-footer" id="bmfFooter">
      <div className="bmf-inner">
        {/* =====================================================
             TOP SECTION: BRAND + ACTION BUTTONS
        ====================================================== */}
        <section className="bmf-top">
          <div className="bmf-brand">
            <Link href="/" className="bmf-brand-link" aria-label="Boulot Man Home">
              <img
                src="/boulotman-logo.png"
                alt="Boulot Man"
                className="bmf-logo"
              />
              <div className="bmf-brand-text">
                <h2>Boulot Man</h2>
                <p className="bmf-tagline">
                  Home for technicians and engineers in Africa.
                </p>
              </div>
            </Link>

            <p className="bmf-description">
              Boulot Man connects clients with verified technicians, engineers,
              professionals and companies for everyday services, skilled work
              and large projects across Africa.
            </p>
          </div>

          <div className="bmf-actions">
            <Link href="/post-task" className="bmf-action bmf-action-primary">
              Post a Task
            </Link>
            <Link href="/service-providers/technicians" className="bmf-action">
              Find Professionals
            </Link>
            <Link href="/search?type=company" className="bmf-action">
              Find Companies
            </Link>
          </div>
        </section>

        {/* =====================================================
             MAIN 5-COLUMN NAVIGATION
        ====================================================== */}
        <nav className="bmf-navigation" aria-label="Boulot Man Footer Navigation">
          {/* COLUMN 1: BOULOT MAN */}
          <div className="bmf-nav-column">
            <h3 className="bmf-nav-title">Boulot Man</h3>
            <ul className="bmf-nav-list">
              <li>
                <Link href="/about">The Platform</Link>
              </li>
              <li>
                <Link href="/how-it-works">How it works</Link>
              </li>
              <li>
                <Link href="/search">Locations</Link>
              </li>
              <li>
                <Link href="/partnerships">Partnerships</Link>
              </li>
              <li>
                <Link href="/investors">Invest</Link>
              </li>
              <li>
                <Link href="/careers">Career/Jobs</Link>
              </li>
              <li>
                <Link href="/press">Press &amp; Media</Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 2: CLIENTS */}
          <div className="bmf-nav-column">
            <h3 className="bmf-nav-title">Clients</h3>
            <ul className="bmf-nav-list">
              <li>
                <Link href="/signup?role=client">Sign up</Link>
              </li>
              <li>
                <Link href="/post-task">Post a Task</Link>
              </li>
              <li>
                <Link href="/search">Browse Services</Link>
              </li>
              <li>
                <Link href="/service-providers/technicians">Find Technicians</Link>
              </li>
              <li>
                <Link href="/search?type=company">Hire Companies</Link>
              </li>
              <li>
                <Link href="/build-a-team">Build a Team</Link>
              </li>
              <li>
                <Link href="/concierge">Concierge</Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 3: PROFESSIONALS */}
          <div className="bmf-nav-column">
            <h3 className="bmf-nav-title">Professionals</h3>
            <ul className="bmf-nav-list">
              <li>
                <Link href="/signup?role=technician">Join as a Technician</Link>
              </li>
              <li>
                <Link href="/dashboard/technician/services/new">Post Services</Link>
              </li>
              <li>
                <Link href="/find-tasks">Browse Task</Link>
              </li>
              <li>
                <Link href="/dashboard/technician/profile">My Profile</Link>
              </li>
              <li>
                <Link href="/contractors">Contracts</Link>
              </li>
              <li>
                <Link href="/upgrade">Upgrade Plan</Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 4: COMPANIES */}
          <div className="bmf-nav-column">
            <h3 className="bmf-nav-title">Companies</h3>
            <ul className="bmf-nav-list">
              <li>
                <Link href="/signup?role=company">Join as a Company</Link>
              </li>
              <li>
                <Link href="/dashboard/company/services">Post Services</Link>
              </li>
              <li>
                <Link href="/find-tasks">Browse Projects</Link>
              </li>
              <li>
                <Link href="/dashboard/company/profile">Your profile</Link>
              </li>
              <li>
                <Link href="/contractors">Subcontracting Opportunities</Link>
              </li>
              <li>
                <Link href="/contractors">Contractors</Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 5: RESOURCES & COMMUNITY */}
          <div className="bmf-nav-column">
            <h3 className="bmf-nav-title">Resources &amp; Community</h3>
            <ul className="bmf-nav-list">
              <li>
                <Link href="/help-center">Help Center</Link>
              </li>
              <li>
                <Link href="/help-center">Safety Center</Link>
              </li>
              <li>
                <Link href="/search">Service Categories</Link>
              </li>
              <li>
                <Link href="/search">Locations</Link>
              </li>
              <li>
                <Link href="/upgrade">Pricing and Fees</Link>
              </li>
              <li>
                <Link href="/terms">Community Guidelines</Link>
              </li>
              <li>
                <Link href="/payments-and-earnings">Earnings</Link>
              </li>
              <li>
                <Link href="/dispute-resolution">Escrow &amp; Safe Payments</Link>
              </li>
            </ul>
          </div>
        </nav>

        {/* =====================================================
             LEGAL LINKS STRIP
        ====================================================== */}
        <div className="bmf-legal">
          <nav className="bmf-legal-links" aria-label="Boulot Man Legal Navigation">
            <Link href="/terms">Terms of Service</Link>
            <span aria-hidden="true">•</span>
            <Link href="/privacy">Privacy Policy</Link>
            <span aria-hidden="true">•</span>
            <Link href="/signup/verify">Trust &amp; Safety</Link>
            <span aria-hidden="true">•</span>
            <Link href="/dispute-resolution">Payments &amp; Escrow</Link>
            <span aria-hidden="true">•</span>
            <Link href="/dispute-resolution">Refunds</Link>
            <span aria-hidden="true">•</span>
            <Link href="/search">Reviews &amp; Ratings</Link>
            <span aria-hidden="true">•</span>
            <Link href="/privacy">Cookies</Link>
            <span aria-hidden="true">•</span>
            <Link href="/terms">Legal Center</Link>
          </nav>
        </div>
      </div>

      {/* =====================================================
           BOTTOM BAR: COPYRIGHT + PICKERS + SOCIALS
      ====================================================== */}
      <div className="bmf-bottom">
        <div className="bmf-bottom-inner">
          <div className="bmf-bottom-grid">
            {/* LEFT: COPYRIGHT */}
            <div className="bmf-bottom-left">
              <p className="bmf-copyright">
                © 2026 Boulot Man Engineering Company. All rights reserved.
              </p>
            </div>

            {/* CENTER: COUNTRY & LANGUAGE PICKERS */}
            <div className="bmf-bottom-center">
              {/* COUNTRY PICKER */}
              <div className="bmf-picker bmf-country-picker" ref={countryPickerRef}>
                <button
                  type="button"
                  className={`bmf-picker-button ${countryOpen ? "is-open" : ""}`}
                  id="bmfCountryButton"
                  aria-expanded={countryOpen}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCountryOpen(!countryOpen);
                    setLangOpen(false);
                  }}
                >
                  <span className="bmf-picker-main">
                    <span className="bmf-selected-flag" id="bmfSelectedFlag">
                      <img
                        src={selectedCountry.flag}
                        alt={`${selectedCountry.country} flag`}
                      />
                    </span>
                    <span className="bmf-picker-label" id="bmfCountryLabel">
                      {selectedCountry.country} · {selectedCountry.currency}
                    </span>
                  </span>
                  <span className="bmf-picker-arrow" aria-hidden="true">
                    ▾
                  </span>
                </button>

                {/* COUNTRY DROPDOWN */}
                <div
                  className={`bmf-country-dropdown ${countryOpen ? "is-open" : ""}`}
                  id="bmfCountryDropdown"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="bmf-country-header">
                    <h4>Select Region &amp; Currency</h4>
                    <input
                      type="search"
                      className="bmf-country-search"
                      id="bmfCountrySearch"
                      placeholder="Search country or currency..."
                      autoComplete="off"
                      value={countrySearch}
                      onChange={(e) => setCountrySearch(e.target.value)}
                      autoFocus={countryOpen}
                    />
                  </div>

                  <div className="bmf-country-list" id="bmfCountryList">
                    {filteredCountries.map((c) => {
                      const isSelected = c.country === selectedCountry.country;
                      return (
                        <button
                          key={c.country}
                          type="button"
                          className={`bmf-country-option ${isSelected ? "is-selected" : ""}`}
                          onClick={() => handleCountrySelect(c)}
                        >
                          <span className="bmf-option-flag">
                            <img src={c.flag} alt={`${c.country} flag`} />
                          </span>
                          <span className="bmf-option-copy">
                            <strong>{c.country}</strong>
                            <small>{c.city} · {c.callingCode}</small>
                          </span>
                          <span className="bmf-option-currency">
                            {c.currency}
                          </span>
                        </button>
                      );
                    })}
                    {filteredCountries.length === 0 && (
                      <div style={{ padding: "16px 14px", color: "#9fb1c3", fontSize: "13px", textAlign: "center" }}>
                        No region found.
                      </div>
                    )}
                  </div>

                  <div className="bmf-country-footer">
                    <span>Auto-localizes jobs &amp; pricing</span>
                    <strong>Boulot Man Africa</strong>
                  </div>
                </div>
              </div>

              {/* LANGUAGE PICKER */}
              <div className="bmf-picker bmf-language-picker" ref={langPickerRef}>
                <button
                  type="button"
                  className={`bmf-picker-button ${langOpen ? "is-open" : ""}`}
                  id="bmfLanguageButton"
                  aria-expanded={langOpen}
                  onClick={(e) => {
                    e.stopPropagation();
                    setLangOpen(!langOpen);
                    setCountryOpen(false);
                  }}
                >
                  <span className="bmf-picker-main">
                    <span className="bmf-language-icon" aria-hidden="true">
                      🌐
                    </span>
                    <span className="bmf-picker-label" id="bmfLanguageLabel">
                      {selectedLang.label}
                    </span>
                  </span>
                  <span className="bmf-picker-arrow" aria-hidden="true">
                    ▾
                  </span>
                </button>

                {/* LANGUAGE DROPDOWN */}
                <div
                  className={`bmf-language-dropdown ${langOpen ? "is-open" : ""}`}
                  id="bmfLanguageDropdown"
                  onClick={(e) => e.stopPropagation()}
                >
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      className={`bmf-language-option ${l.code === selectedLang.code ? "is-selected" : ""}`}
                      onClick={() => handleLanguageSelect(l)}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT: SOCIAL MEDIA */}
            <nav className="bmf-social" aria-label="Boulot Man Social Media">
              <a
                href="https://cm.linkedin.com/company/boulotman"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
              >
                LinkedIn
              </a>
              <a
                href="https://x.com/boulotman"
                target="_blank"
                rel="noreferrer"
                aria-label="X"
              >
                X
              </a>
              <a
                href="https://www.facebook.com/boulotman.inc/"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
              >
                Facebook
              </a>
              <a
                href="https://www.instagram.com/boulotman?igsh=M3NmZWFiemt1ZHly"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
              >
                Instagram
              </a>
              <a
                href="https://youtube.com/@boulotmancameroon?si=m9FUCuWen8xLnmT4"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
              >
                YouTube
              </a>
              <a
                href="https://www.tiktok.com/@boulotman.inc?_r=1&_t=ZS-99N2jDEWSPA"
                target="_blank"
                rel="noreferrer"
                aria-label="TikTok"
              >
                TikTok
              </a>
              <a
                href="https://www.pinterest.com/boulotman/"
                target="_blank"
                rel="noreferrer"
                aria-label="Pinterest"
              >
                Pinterest
              </a>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
