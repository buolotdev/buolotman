"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";

const translations: Record<string, Record<string, string>> = {
  en: {
    dashboard: "Company dashboard",
    title: "Teams",
    backToDashboard: "Back to dashboard",
    overview: "Team Overview",
    teamSize: "Team size:",
    desc: "We do not yet have a dedicated team-member model, so this page shows the company-level team summary from the verified profile.",
  },
  fr: {
    dashboard: "Espace Entreprise",
    title: "Équipes",
    backToDashboard: "Retour au tableau de bord",
    overview: "Aperçu de l'Équipe",
    teamSize: "Taille de l'équipe :",
    desc: "Cette page présente le résumé des effectifs de l'entreprise d'après le profil vérifié.",
  }
};

export default function CompanyTeamsPage() {
  const [lang, setLang] = useState("en");

  useEffect(() => {
    const updateLang = () => {
      setLang(localStorage.getItem("lang") || "en");
    };
    updateLang();
    window.addEventListener("languageChange", updateLang);
    return () => window.removeEventListener("languageChange", updateLang);
  }, []);

  const t = translations[lang] || translations["en"];
  const { data: profile } = useFetch(() => api.getCompanyProfile(), []);

  return (
    <main style={{ padding: 24 }}>
      <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gap: 20 }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <div>
            <p style={{ margin: 0, color: "#64748b" }}>{t.dashboard}</p>
            <h1 style={{ margin: "4px 0 0" }}>{t.title}</h1>
          </div>
          <Link href="/dashboard/company" style={{ color: "#0f172a" }}>{t.backToDashboard}</Link>
        </header>

        <section style={{ background: "#fff", borderRadius: 20, padding: 24 }}>
          <h2 style={{ marginTop: 0 }}>{t.overview}</h2>
          <p>{t.teamSize} {profile?.team_size || 0}</p>
          <p>{t.desc}</p>
        </section>
      </div>
    </main>
  );
}

