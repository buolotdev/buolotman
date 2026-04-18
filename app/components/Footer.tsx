"use client";
import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const t = translations[lang] || translations["en"];

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
            <img
              className="footer-logo"
              src="/boulotman-logo.png"
              alt="Boulot Man Logo"
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
            <a href="/post-task">Post a Task</a>
            <a href="/services">Browse Services</a>
            <a href="/technicians">Find Technicians</a>
            <a href="/companies">Hire Companies</a>
            <a href="/build-team">Build a Team</a>
            <a href="/concierge">Concierge</a>
            <a href="/it-on-demand">IT on Demand</a>
          </div>

          {/* TECHNICIANS */}
          <div className="footer-col">
            <h4>{t.technicians}</h4>
            <a href="/technician-register">Join as Technician</a>
            <a href="/technician-profile">My Profile</a>
            <a href="/post-service">Post Services</a>
            <a href="/tasks">Find Tasks</a>
            <a href="/payments">Earnings</a>
            <a href="/verification">Verification</a>
            <a href="/tier-pricing">Upgrade Plan</a>
          </div>

          {/* COMPANIES */}
          <div className="footer-col">
            <h4>{t.companies}</h4>
            <a href="/company-register">Register Company</a>
            <a href="/company-profile">Company Profile</a>
            <a href="/company-services">Post Services</a>
            <a href="/contracts">Contracts</a>
            <a href="/enterprise">Enterprise</a>
            <a href="/compliance">Compliance</a>
            <a href="/partnership">Partnerships</a>
          </div>

          {/* PAYMENTS */}
          <div className="footer-col">
            <h4>{t.payments}</h4>
            <a href="/escrow">Escrow System</a>
            <a href="/milestones">Milestones</a>
            <a href="/secure-payments">Secure Payments</a>
            <a href="/refunds">Refunds</a>
            <a href="/disputes">Disputes</a>
            <a href="/trust">Trust &amp; Safety</a>
          </div>

          {/* RESOURCES */}
          <div className="footer-col">
            <h4>{t.resources}</h4>
            <a href="/how-it-works">How It Works</a>
            <a href="/help-center">Help Center</a>
            <a href="/reviews">Reviews</a>
            <a href="/press">Press &amp; Media</a>
            <a href="/developers">Developers</a>
            <a href="/api">API</a>
          </div>

          {/* COMPANY */}
          <div className="footer-col">
            <h4>{t.company}</h4>
            <a href="/about">About Us</a>
            <a href="/careers">Careers</a>
            <a href="/investors">Investors</a>
            <a href="/legal">Legal</a>
            <a href="/terms">Terms</a>
            <a href="/privacy">Privacy</a>
            <a href="/contact">Contact</a>
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
            <a href="#">LinkedIn</a>
            <a href="#">Twitter</a>
            <a href="#">Facebook</a>
            <a href="#">Instagram</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
