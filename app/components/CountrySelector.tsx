"use client";

import React, { useState, useRef, useEffect } from "react";
import { useLocation, SUPPORTED_COUNTRIES, CountryInfo } from "@/app/context/LocationContext";

interface CountrySelectorProps {
  variant?: "header" | "footer" | "compact";
}

export default function CountrySelector({ variant = "header" }: CountrySelectorProps) {
  const { location, setCountry, isLoaded } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const countriesList: CountryInfo[] = Object.values(SUPPORTED_COUNTRIES);
  const filteredCountries = countriesList.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.currency.toLowerCase().includes(search.toLowerCase()) ||
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      ref={dropdownRef}
      style={{
        position: "relative",
        display: "inline-block",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label="Select Country and Currency"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "7px",
          background: variant === "footer" ? "#0b2a4d" : "rgba(255,255,255,0.12)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: variant === "footer" ? "8px" : "24px",
          padding: variant === "footer" ? "8px 14px" : variant === "compact" ? "4px 10px" : "6px 14px",
          color: "#ffffff",
          cursor: "pointer",
          fontSize: variant === "footer" ? "0.78rem" : "13.5px",
          fontWeight: 600,
          transition: "all 0.2s ease",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = variant === "footer" ? "#113c6e" : "rgba(255,255,255,0.22)";
          e.currentTarget.style.borderColor = "#FF4500";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = variant === "footer" ? "#0b2a4d" : "rgba(255,255,255,0.12)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
        }}
      >
        <span style={{ fontSize: "16px", lineHeight: 1 }}>{location.flag}</span>
        <span style={{ whiteSpace: "nowrap" }}>
          {variant === "compact" ? location.countryCode : `${location.country} (${location.currency})`}
        </span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
            opacity: 0.8,
          }}
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      {/* Floating Dropdown Modal */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            bottom: variant === "footer" ? "calc(100% + 8px)" : undefined,
            top: variant === "footer" ? undefined : "calc(100% + 8px)",
            right: 0,
            width: "300px",
            background: "#ffffff",
            borderRadius: "14px",
            boxShadow: "0 18px 45px rgba(0, 31, 63, 0.22), 0 4px 12px rgba(0,0,0,0.08)",
            border: "1px solid #e2e8f0",
            zIndex: 99999,
            overflow: "hidden",
            animation: "bmFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "14px 16px 10px",
              borderBottom: "1px solid #f1f5f9",
              background: "#fafcff",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ fontSize: "12px", fontWeight: 800, color: "#001F3F", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Select Region & Currency
              </span>
              {location.isAutoDetected && (
                <span
                  style={{
                    fontSize: "10.5px",
                    background: "#ecfdf5",
                    color: "#059669",
                    padding: "2px 7px",
                    borderRadius: "10px",
                    fontWeight: 700,
                    border: "1px solid #a7f3d0",
                  }}
                >
                  📍 Auto-located
                </span>
              )}
            </div>

            {/* Search Input */}
            <input
              type="text"
              placeholder="Search country or currency..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
              style={{
                width: "100%",
                padding: "7px 11px",
                borderRadius: "8px",
                border: "1px solid #cbd5e1",
                fontSize: "13px",
                color: "#0f172a",
                outline: "none",
                boxSizing: "border-box",
                background: "#ffffff",
              }}
            />
          </div>

          {/* Country List */}
          <div
            style={{
              maxHeight: "260px",
              overflowY: "auto",
              padding: "6px",
            }}
          >
            {filteredCountries.map((c) => {
              const isSelected = location.countryCode === c.code;
              return (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => {
                    setCountry(c.code);
                    setIsOpen(false);
                    setSearch("");
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: "8px",
                    border: "none",
                    background: isSelected ? "#fff7ed" : "transparent",
                    color: isSelected ? "#c2410c" : "#1e293b",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "background 0.15s ease",
                    marginBottom: "2px",
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.background = "#f8fafc";
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.background = "transparent";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "20px", lineHeight: 1 }}>{c.flag}</span>
                    <div>
                      <div style={{ fontSize: "13.5px", fontWeight: isSelected ? 700 : 600, color: isSelected ? "#c2410c" : "#0f172a" }}>
                        {c.name}
                      </div>
                      <div style={{ fontSize: "11px", color: "#64748b" }}>
                        Capital: {c.defaultCity} • {c.callingCode}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "2px 7px",
                        borderRadius: "6px",
                        fontSize: "11px",
                        fontWeight: 700,
                        background: isSelected ? "#ffedd5" : "#f1f5f9",
                        color: isSelected ? "#ea580c" : "#475569",
                      }}
                    >
                      {c.currency} ({c.currencySymbol})
                    </span>
                  </div>
                </button>
              );
            })}

            {filteredCountries.length === 0 && (
              <div style={{ padding: "16px", textAlign: "center", color: "#94a3b8", fontSize: "13px" }}>
                No country matching "{search}"
              </div>
            )}
          </div>

          {/* Footer note */}
          <div
            style={{
              padding: "8px 14px",
              background: "#f8fafc",
              borderTop: "1px solid #f1f5f9",
              fontSize: "11px",
              color: "#64748b",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span>Auto-localizes jobs & pricing</span>
            <span style={{ color: "#FF4500", fontWeight: 700 }}>Boulot Man Pan-Africa</span>
          </div>
        </div>
      )}
    </div>
  );
}
