"use client";

import React, { useEffect, useState } from "react";

// Set to TRUE to show "Project Not Found" screen. Set to FALSE to restore full website normally.
export const IS_LOCK_ACTIVE = true;

export default function MaintenanceGuard({ children }: { children: React.ReactNode }) {
  const [isBypassed, setIsBypassed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      // Secret bypass parameters for you to access anytime
      if (urlParams.get("bypass") === "1" || urlParams.get("unlock") === "1" || urlParams.get("admin") === "buolot") {
        localStorage.setItem("boulot_dev_bypass", "true");
        setIsBypassed(true);
      } else if (localStorage.getItem("boulot_dev_bypass") === "true") {
        setIsBypassed(true);
      }

      // Keyboard shortcut bypass: Press Ctrl + Shift + U
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "u") {
          localStorage.setItem("boulot_dev_bypass", "true");
          setIsBypassed(true);
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, []);

  if (!IS_LOCK_ACTIVE || isBypassed) {
    return <>{children}</>;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0f1d",
        color: "#ffffff",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        padding: "24px",
        textAlign: "center",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: "540px",
          width: "100%",
          background: "rgba(255, 255, 255, 0.03)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "16px",
          padding: "40px 32px",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.5)",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(239, 68, 68, 0.12)",
            color: "#f87171",
            padding: "6px 14px",
            borderRadius: "999px",
            fontSize: "13px",
            fontWeight: 700,
            marginBottom: "24px",
            letterSpacing: "0.05em",
          }}
        >
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#ef4444",
              display: "inline-block",
            }}
          />
          SERVICE NOT AVAILABLE
        </div>

        <h1
          style={{
            fontSize: "30px",
            fontWeight: 800,
            color: "#ffffff",
            margin: "0 0 14px",
            lineHeight: 1.3,
          }}
        >
          Not Available
        </h1>

        <p
          style={{
            fontSize: "15px",
            lineHeight: 1.6,
            color: "#94a3b8",
            margin: "0 0 28px",
          }}
        >
          This service is currently not available. Access to this platform has been temporarily disabled. Please check back later or contact the administrator.
        </p>

        <div
          style={{
            background: "rgba(0, 0, 0, 0.4)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
            borderRadius: "8px",
            padding: "12px 16px",
            fontSize: "12.5px",
            color: "#64748b",
            fontFamily: "monospace",
            textAlign: "left",
            wordBreak: "break-all",
          }}
        >
          <div style={{ marginBottom: "4px" }}>
            <span style={{ color: "#94a3b8" }}>Status:</span> 503 SERVICE_UNAVAILABLE
          </div>
          <div style={{ marginBottom: "4px" }}>
            <span style={{ color: "#94a3b8" }}>Code:</span> ERR_SERVICE_NOT_AVAILABLE
          </div>
          <div>
            <span style={{ color: "#94a3b8" }}>Host:</span> boulotman.com
          </div>
        </div>

        <p
          style={{
            fontSize: "13px",
            color: "#64748b",
            marginTop: "24px",
            marginBottom: 0,
          }}
        >
          If you are the administrator, please contact the developer to restore access.
        </p>
      </div>
    </div>
  );
}
