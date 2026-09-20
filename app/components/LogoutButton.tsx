"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function LogoutButton({ 
  className, 
  style,
  showLabel = true 
}: { 
  className?: string; 
  style?: React.CSSProperties;
  showLabel?: boolean;
}) {
  const router = useRouter();
  const [lang, setLang] = useState("en");

  useEffect(() => {
    const updateLang = () => {
      setLang(localStorage.getItem("lang") || "en");
    };
    updateLang();
    window.addEventListener("languageChange", updateLang);
    return () => window.removeEventListener("languageChange", updateLang);
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user_role");
      localStorage.removeItem("user");
      localStorage.removeItem("boulotman_user");

      // Clear any cached profile drafts
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && (key.startsWith("boulotman_technician_") || key.startsWith("boulotman_user_") || key.startsWith("boulotman_company_"))) {
          localStorage.removeItem(key);
        }
      }
    } catch {}
    router.replace("/login");
  };

  const label = lang === "fr" ? "Déconnexion" : lang === "rw" ? "Sohoka" : lang === "ar" ? "تسجيل الخروج" : "Logout";

  return (
    <button
      onClick={handleLogout}
      className={className}
      type="button"
      aria-label={label}
      style={{
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        background: "none",
        border: "none",
        color: "inherit",
        font: "inherit",
        ...style,
      }}
    >
      <iconify-icon icon="lucide:log-out" />
      {showLabel && <span>{label}</span>}
    </button>
  );
}

