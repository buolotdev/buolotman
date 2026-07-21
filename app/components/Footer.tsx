"use client";
import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { api } from "../lib/api";
import { useFetch } from "../lib/useFetch";
import "./footer.css";


const translations: Record<string, Record<string, string>> = {
  en: {
    desc: "Africa's professional marketplace for technicians, engineers, freelancers, and verified companies — built on trust, escrow, and secure delivery.",
    b1: "✔ Verified Professionals",
    b2: "✔ Escrow Payments",
    b3: "✔ Dispute Resolution",
    b4: "✔ Secure Infrastructure",
    clients: "Clients",
    technicians: "Technicians",
    companies: "Companies",
    payments: "Payments",
    resources: "Resources",
    company: "Company",
    copyright: "© 2026 Boulot Man Engineering Company",
    label: "English",
  },
  fr: {
    desc: "La plateforme professionnelle africaine pour les techniciens, ingénieurs et entreprises vérifiées.",
    b1: "✔ Professionnels vérifiés",
    b2: "✔ Paiements sous séquestre",
    b3: "✔ Résolution des litiges",
    b4: "✔ Infrastructure sécurisée",
    clients: "Clients",
    technicians: "Techniciens",
    companies: "Entreprises",
    payments: "Paiements",
    resources: "Ressources",
    company: "Entreprise",
    copyright: "© 2026 Boulot Man Engineering Company",
    label: "Français",
  },
  rw: {
    desc: "Urubuga rw'umwuga ruhuza abatekinisiye n'ibigo byemewe muri Afurika.",
    b1: "✔ Abanyamwuga bemewe",
    b2: "✔ Ubwishyu bwa escrow",
    b3: "✔ Gukemura amakimbirane",
    b4: "✔ Ikoranabuhanga ryizewe",
    clients: "Abakiriya",
    technicians: "Abatekinisiye",
    companies: "Ibigo",
    payments: "Ubwishyu",
    resources: "Inyunganizi",
    company: "Ikigo",
    copyright: "© 2026 Boulot Man Engineering Company",
    label: "Kinyarwanda",
  },
  ar: {
    desc: "السوق المهنية الرائدة في أفريقيا للفنيين والمهندسين والشركات المعتمدة.",
    b1: "✔ محترفون معتمدون",
    b2: "✔ مدفوعات مضمونة",
    b3: "✔ حل النزاعات",
    b4: "✔ بنية تحتية آمنة",
    clients: "العملاء",
    technicians: "الفنيون",
    companies: "الشركات",
    payments: "المدفوعات",
    resources: "الموارد",
    company: "الشركة",
    copyright: "© 2026 شركة بولوت مان الهندسية",
    label: "العربية",
  },
};

export default function Footer() {
  const [lang, setLangState] = useState(() => {
    if (typeof window === "undefined") return "en";
    return localStorage.getItem("lang") || "en";
  });
  const [country, setCountryState] = useState(() => {
    if (typeof window === "undefined") return "Rwanda";
    return localStorage.getItem("country") || "Rwanda";
  });
  const [langOpen, setLangOpen] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);
  const { data: pagesData } = useFetch(() => api.getPublicPages(), []);

  useEffect(() => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const t = translations[lang] || translations["en"];
  const pages = Array.isArray(pagesData) ? pagesData : [];

  const changeLang = (l: string) => {
    setLangState(l);
    localStorage.setItem("lang", l);
    document.documentElement.dir = l === "ar" ? "rtl" : "ltr";
    setLangOpen(false);
  };

  const changeCountry = (c: string) => {
    setCountryState(c);
    localStorage.setItem("country", c);
    setCountryOpen(false);
  };

  return (
    <footer className="bm-footer">
      <div className="footer-container">
        <div className="footer-grid">

          {/* BRAND */}
          <div className="footer-brand">
            <Image
              className="footer-logo"
              src="/boulotman-logo.png"
              alt="Boulot Man Logo"
              width={160}
              height={48}
            />
            <p>{t.desc}</p>
            <div className="footer-badges">
              <span>{t.b1}</span>
              <span>{t.b2}</span>
              <span>{t.b3}</span>
              <span>{t.b4}</span>
            </div>
          </div>

          {/* CLIENTS */}
          <div className="footer-col">
            <h4>{t.clients}</h4>
            <Link href="/post-task">Post a Task</Link>
            <Link href="/search">Browse Services</Link>
            <Link href="/search?type=technician">Find Technicians</Link>
            <Link href="/search?type=company">Hire Companies</Link>
            <Link href="/dashboard/company/projects">Build a Team</Link>
            <Link href="/concierge">Concierge</Link>
            <Link href="/search?category=it">IT on Demand</Link>
          </div>

          {/* TECHNICIANS */}
          <div className="footer-col">
            <h4>{t.technicians}</h4>
            <Link href="/signup?role=technician">Join as Technician</Link>
            <Link href="/dashboard/technician/profile">My Profile</Link>
            <Link href="/dashboard/company/services">Post Services</Link>
            <Link href="/dashboard/technician/tasks">Find Tasks</Link>
            <Link href="/dashboard/technician/wallet">Earnings</Link>
            <Link href="/signup/verify">Verification</Link>
            <Link href="/search">Upgrade Plan</Link>
          </div>

          {/* COMPANIES */}
          <div className="footer-col">
            <h4>{t.companies}</h4>
            <Link href="/signup?role=company">Register Company</Link>
            <Link href="/dashboard/company/profile">Company Profile</Link>
            <Link href="/dashboard/company/services">Post Services</Link>
            <Link href="/dashboard/company/projects">Contracts</Link>
            <Link href="/contractors">Enterprise</Link>
            <Link href="/dashboard/admin/verification">Compliance</Link>
            <Link href="/search">Partnerships</Link>
          </div>

          {/* PAYMENTS */}
          <div className="footer-col">
            <h4>{t.payments}</h4>
            <Link href="/dashboard/client/payments">Escrow System</Link>
            <Link href="/dashboard/company/projects/tracking">Milestones</Link>
            <Link href="/dashboard/client/payments">Secure Payments</Link>
            <Link href="/dashboard/client/payments">Refunds</Link>
            <Link href="/dispute-resolution">Disputes</Link>
            <Link href="/signup/verify">Trust &amp; Safety</Link>
          </div>

          {/* RESOURCES */}
          <div className="footer-col">
            <h4>{t.resources}</h4>
            <Link href="/#how-it-works">How It Works</Link>
            <Link href="/help-center">Help Center</Link>
            <Link href="/search">Reviews</Link>
            <Link href="/press">Press &amp; Media</Link>
            <Link href="/">Developers</Link>
            <Link href="/search">API</Link>
            {pages.length > 0 ? <h4 style={{ marginTop: 18 }}>Pages</h4> : null}
            {pages.slice(0, 6).map((page: any) => (
              <Link key={page.id} href={`/pages/${page.slug}`}>
                {page.title}
              </Link>
            ))}
          </div>

          {/* COMPANY */}
          <div className="footer-col">
            <h4>{t.company}</h4>
            <Link href="/">About Us</Link>
            <Link href="/">Careers</Link>
            <Link href="/">Investors</Link>
            <Link href="/">Legal</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/">Contact</Link>
          </div>

        </div>

        <div className="footer-divider" />

        {/* BOTTOM BAR */}
        <div className="footer-bottom">
          <div>{t.copyright}</div>

          <div className="footer-switch">
            {/* LANGUAGE */}
            <div className="switch">
              <div className="switch-btn" onClick={() => { setLangOpen(!langOpen); setCountryOpen(false); }}>
                🌐 <span>{t.label}</span>
              </div>
              {langOpen && (
                <div className="switch-list" style={{ display: "block" }}>
                  <button onClick={() => changeLang("en")}>English</button>
                  <button onClick={() => changeLang("fr")}>Français</button>
                  <button onClick={() => changeLang("rw")}>Kinyarwanda</button>
                  <button onClick={() => changeLang("ar")}>العربية</button>
                </div>
              )}
            </div>

            {/* COUNTRY */}
            <div className="switch">
              <div className="switch-btn" onClick={() => { setCountryOpen(!countryOpen); setLangOpen(false); }}>
                📍 <span>{country}</span>
              </div>
              {countryOpen && (
                <div className="switch-list" style={{ display: "block" }}>
                  <button onClick={() => changeCountry("Rwanda")}>Rwanda</button>
                  <button onClick={() => changeCountry("Kenya")}>Kenya</button>
                  <button onClick={() => changeCountry("Nigeria")}>Nigeria</button>
                  <button onClick={() => changeCountry("Ghana")}>Ghana</button>
                  <button onClick={() => changeCountry("South Africa")}>South Africa</button>
                  <button onClick={() => changeCountry("Global")}>Global</button>
                </div>
              )}
            </div>
          </div>

          <div className="footer-socials">
            <a href="https://www.linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a>
            <a href="https://x.com" target="_blank" rel="noreferrer">Twitter</a>
            <a href="https://www.facebook.com" target="_blank" rel="noreferrer">Facebook</a>
            <a href="https://www.instagram.com" target="_blank" rel="noreferrer">Instagram</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
