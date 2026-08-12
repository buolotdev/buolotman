"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

const translations: Record<string, Record<string, string>> = {
  en: {
    heroTitle: "Join Africa’s growing workforce marketplace and collaborate with a trusted platform connecting professionals, businesses, and communities at scale.",
    heroSubtitle: "Search live service requests posted by clients around you and get hired securely.",
    searchPlaceholder: "What service are you looking for?",
    searchWho: "Who are you searching for?",
    searchWhoTech: "Technicians",
    searchWhoComp: "Companies",
    searchWhoClient: "Clients",
    searchLocation: "Select location",
    searchBtn: "Search",
    btnFindTasks: "Find Tasks",
    btnPostService: "Post Your Service",
    liveTasksTitle: "🔴 Live Tasks",
    liveTasksError: "Failed to load live requests.",
    liveTasksLoading: "Loading tasks...",
    liveTasksCta: "See more people finding services around you →",
    apply: "Apply",
    quoteRequired: "Quote required",
    fixedPrice: "Fixed",
    hourlyRate: "Hourly",
  },
  fr: {
    heroTitle: "Rejoignez le marché du travail en pleine croissance en Afrique et collaborez avec une plateforme de confiance reliant les professionnels, les entreprises et les communautés à grande échelle.",
    heroSubtitle: "Recherchez des demandes de services en direct publiées par des clients autour de vous et soyez embauché en toute sécurité.",
    searchPlaceholder: "Quel service recherchez-vous ?",
    searchWho: "Qui recherchez-vous ?",
    searchWhoTech: "Techniciens",
    searchWhoComp: "Entreprises",
    searchWhoClient: "Clients",
    searchLocation: "Sélectionnez l'emplacement",
    searchBtn: "Rechercher",
    btnFindTasks: "Trouver des tâches",
    btnPostService: "Publiez votre service",
    liveTasksTitle: "🔴 Demandes en direct",
    liveTasksError: "Échec du chargement des demandes en direct.",
    liveTasksLoading: "Chargement des tâches...",
    liveTasksCta: "Voir plus de personnes cherchant des services autour de vous →",
    apply: "Postuler",
    quoteRequired: "Devis requis",
    fixedPrice: "Fixe",
    hourlyRate: "Horaire",
  },
};

export default function PartnershipsPage() {
  const router = useRouter();

  // Language state
  const [lang, setLang] = useState("en");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLang = localStorage.getItem("lang") || "en";
      // Support Kinyarwanda/Arabic fallbacks to French or English if translation not explicitly defined
      if (savedLang === "fr" || savedLang === "en") {
        setLang(savedLang);
      } else if (savedLang === "rw") {
        setLang("fr"); // Fallback to French for Rwanda
      } else {
        setLang("en"); // Default fallback
      }
    }
  }, []);

  const t = translations[lang] || translations["en"];

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchRole, setSearchRole] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Live tasks data for slider
  const { data: liveTasksData, error: liveTasksError } = useFetch(
    () => api.getTasks({ sort: "newest", limit: "8" }),
    []
  );

  const tasks = liveTasksData?.results || [];

  const [liveTaskIndex, setLiveTaskIndex] = useState(0);

  useEffect(() => {
    if (tasks.length === 0) return;
    const interval = setInterval(() => {
      setLiveTaskIndex((prev) => {
        const count = tasks.length;
        if (count === 0) return 0;
        return (prev + 1) % count;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [tasks]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("q", searchQuery.trim());
    if (searchRole) params.set("type", searchRole.toLowerCase());
    if (searchLocation) params.set("location", searchLocation);
    router.push(`/search${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const handleApplyClick = (e: React.MouseEvent, taskId: number) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      if (!token) {
        router.push("/login?next=" + encodeURIComponent(`/dashboard/technician/tasks/${taskId}`));
      } else {
        router.push(`/dashboard/technician/tasks/${taskId}`);
      }
    }
  };

  return (
    <div id="homepage-screen">
      <Header />

      <section id="hero" className="bm-main-hero">
        <div className="bm-main-hero-grid">
          <div>
            <h1>{t.heroTitle}</h1>

            <p>{t.heroSubtitle}</p>

            <form className="bm-main-search" onSubmit={handleSearchSubmit}>
              <div className="bm-main-search-field">
                <input
                  className="bm-main-search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
                {!isSearchFocused && !searchQuery && (
                  <div className="bm-main-search-marquee">
                    <span>
                      {t.searchPlaceholder} e.g Electrical installation, Web development, Plumbing, Solar systems, CCTV installation, Mobile apps
                    </span>
                  </div>
                )}
              </div>

              <select value={searchRole} onChange={(e) => setSearchRole(e.target.value)}>
                <option value="">{t.searchWho}</option>
                <option value="technician">{t.searchWhoTech}</option>
                <option value="company">{t.searchWhoComp}</option>
                <option value="client">{t.searchWhoClient}</option>
              </select>

              <select value={searchLocation} onChange={(e) => setSearchLocation(e.target.value)}>
                <option value="Global">Global</option>
                <option value="Nigeria">Nigeria</option>
                <option value="Rwanda">Rwanda</option>
                <option value="Kenya">Kenya</option>
                <option value="Ghana">Ghana</option>
                <option value="South Africa">South Africa</option>
                <option value="Ivory Coast">Ivory Coast</option>
                <option value="Cameroon">Cameroon</option>
              </select>

              <button type="submit">{t.searchBtn}</button>
            </form>

            <div className="bm-main-cta">
              <Link href="/search" className="bm-main-cta-provider" style={{ textDecoration: "none" }}>
                {t.btnFindTasks}
              </Link>
              <Link href="/signup?role=technician" className="bm-main-cta-post" style={{ textDecoration: "none" }}>
                {t.btnPostService}
              </Link>
            </div>
          </div>

          <div className="bm-main-live-box">
            <h4>{t.liveTasksTitle}</h4>
            <div className="bm-main-task-window">
              <div
                className="bm-main-task-track"
                style={{ transform: `translateY(-${liveTaskIndex * 85}px)` }}
              >
                {tasks.length > 0 ? (
                  [...tasks, ...tasks].map((task: any, i: number) => (
                    <div className="bm-main-task" key={`${task.id}-${i}`}>
                      <div className="bm-main-task-top">
                        <div className="bm-main-task-user">
                          <img
                            src={
                              task.client?.avatar_url ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                task.client?.first_name || "User"
                              )}&background=001F3F&color=fff`
                            }
                            alt="User"
                          />
                          <div className="bm-main-task-title">{task.title}</div>
                        </div>
                        <a
                          href="#"
                          onClick={(e) => handleApplyClick(e, task.id)}
                          className="bm-main-task-apply"
                          style={{ textDecoration: "none" }}
                        >
                          {t.apply}
                        </a>
                      </div>
                      <div className="bm-main-task-meta">
                        📍 {task.location || "Remote"} &bull; {task.budget_type === "fixed" ? t.fixedPrice : t.hourlyRate}
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: "20px", color: "#64748b" }}>
                    {liveTasksError ? t.liveTasksError : t.liveTasksLoading}
                  </div>
                )}
              </div>
            </div>
            <div className="bm-main-live-cta">
              <Link href="/find-tasks" style={{ textDecoration: "none" }}>
                {t.liveTasksCta}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
