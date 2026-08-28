"use client";

import React, { useState, useRef, useEffect } from "react";
import { useLocation, SUPPORTED_COUNTRIES, CountryInfo } from "@/app/context/LocationContext";

interface CountrySelectorProps {
  variant?: "header" | "footer" | "compact";
}

export default function CountrySelector({ variant = "footer" }: CountrySelectorProps) {
  const { location, setCountry } = useLocation();
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
      {/* Trigger Button Matching Footer Styling */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label="Select Country and Currency"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          background: "#0b2a4d",
          border: "1px solid rgba(255, 255, 255, 0.18)",
          borderRadius: "8px",
          padding: "8px 14px",
          color: "#ffffff",
          cursor: "pointer",
          fontSize: "0.78rem",
          fontWeight: 600,
          transition: "all 0.2s ease",
          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#123a6b";
          e.currentTarget.style.borderColor = "#FF4500";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "#0b2a4d";
          e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.18)";
        }}
      >
        <img
          src={`https://flagcdn.com/w40/${(location.countryCode || "rw").toLowerCase()}.png`}
          alt={location.country}
          style={{
            width: "18px",
            height: "13px",
            objectFit: "cover",
            borderRadius: "2px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
          }}
          onError={(e) => {
            (e.currentTarget as HTMLElement).style.display = "none";
          }}
        />
        <span style={{ whiteSpace: "nowrap", color: "#f8fafc" }}>
          {location.country} ({location.currency})
        </span>
        <svg
          width="11"
          height="11"
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
            color: "#FF4500",
          }}
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      {/* Floating Dark-Navy Brand Dropdown Modal */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            bottom: "calc(100% + 10px)",
            right: 0,
            width: "320px",
            background: "linear-gradient(180deg, #07264a 0%, #00172e 100%)",
            borderRadius: "14px",
            boxShadow: "0 24px 60px rgba(0, 10, 25, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.12)",
            border: "1px solid rgba(255, 69, 0, 0.35)",
            zIndex: 99999,
            overflow: "hidden",
            backdropFilter: "blur(16px)",
            animation: "bmFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {/* Modal Header */}
          <div
            style={{
              padding: "14px 16px 10px",
              borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
              background: "rgba(255, 255, 255, 0.03)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
              <span style={{ fontSize: "11.5px", fontWeight: 800, color: "#f8fafc", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Select Region & Currency
              </span>
              {location.isAutoDetected && (
                <span
                  style={{
                    fontSize: "10px",
                    background: "rgba(16, 185, 129, 0.15)",
                    color: "#34d399",
                    padding: "2px 8px",
                    borderRadius: "10px",
                    fontWeight: 700,
                    border: "1px solid rgba(16, 185, 129, 0.35)",
                  }}
                >
                  📍 Auto-located
                </span>
              )}
            </div>

            {/* Dark Search Input */}
            <div style={{ position: "relative" }}>
              <input
                type="text"
                placeholder="Search country or currency..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "1px solid rgba(255, 255, 255, 0.16)",
                  fontSize: "12.5px",
                  color: "#ffffff",
                  outline: "none",
                  boxSizing: "border-box",
                  background: "rgba(255, 255, 255, 0.07)",
                  transition: "border 0.2s ease, background 0.2s ease",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#FF4500";
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.12)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.16)";
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.07)";
                }}
              />
            </div>
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
                    borderLeft: isSelected ? "3px solid #FF4500" : "3px solid transparent",
                    background: isSelected ? "rgba(255, 69, 0, 0.16)" : "transparent",
                    color: "#ffffff",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.15s ease",
                    marginBottom: "2px",
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)";
                      e.currentTarget.style.borderLeftColor = "rgba(255, 69, 0, 0.5)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.borderLeftColor = "transparent";
                    }
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <img
                      src={`https://flagcdn.com/w40/${c.code.toLowerCase()}.png`}
                      alt={c.name}
                      style={{
                        width: "20px",
                        height: "14px",
                        objectFit: "cover",
                        borderRadius: "2px",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.4)",
                      }}
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.display = "none";
                      }}
                    />
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: isSelected ? 700 : 600, color: isSelected ? "#ff7a45" : "#f8fafc" }}>
                        {c.name}
                      </div>
                      <div style={{ fontSize: "10.5px", color: "#94a3b8" }}>
                        {c.defaultCity} • {c.callingCode}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "3px 8px",
                        borderRadius: "6px",
                        fontSize: "11px",
                        fontWeight: 700,
                        background: isSelected ? "rgba(255, 69, 0, 0.3)" : "rgba(255, 255, 255, 0.08)",
                        color: isSelected ? "#ff9265" : "#cbd5e1",
                        border: isSelected ? "1px solid rgba(255, 69, 0, 0.5)" : "1px solid rgba(255, 255, 255, 0.06)",
                      }}
                    >
                      {c.currency} ({c.currencySymbol})
                    </span>
                  </div>
                </button>
              );
            })}

            {filteredCountries.length === 0 && (
              <div style={{ padding: "16px", textAlign: "center", color: "#64748b", fontSize: "12px" }}>
                No country matching "{search}"
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div
            style={{
              padding: "10px 14px",
              background: "rgba(0, 0, 0, 0.25)",
              borderTop: "1px solid rgba(255, 255, 255, 0.06)",
              fontSize: "11px",
              color: "#94a3b8",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span>Auto-localizes jobs & pricing</span>
            <span style={{ color: "#FF4500", fontWeight: 700, letterSpacing: "0.04em" }}>Boulot Man Africa</span>
          </div>
        </div>
      )}
    </div>
  );
}
