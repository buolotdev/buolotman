"use client";
import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { api } from "../lib/api";
import { useFetch } from "../lib/useFetch";
import CountrySelector from "./CountrySelector";
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
    // Clients
    postTask: "Post a Task",
    browseServices: "Browse Services",
    findTechnicians: "Find Technicians",
    hireCompanies: "Hire Companies",
    buildTeam: "Build a Team",
    concierge: "Concierge",
    itOnDemand: "IT on Demand",
    // Technicians
    joinAsTechnician: "Join as Technician",
    myProfile: "My Profile",
    postServices: "Post Services",
    findTasks: "Find Tasks",
    earnings: "Earnings",
    verification: "Verification",
    upgradePlan: "Upgrade Plan",
    // Companies
    registerCompany: "Register Company",
    companyProfile: "Company Profile",
    contracts: "Contracts",
    enterprise: "Enterprise",
    compliance: "Compliance",
    partnerships: "Partnerships",
    // Payments
    escrowSystem: "Escrow System",
    milestones: "Milestones",
    securePayments: "Secure Payments",
    refunds: "Refunds",
    disputes: "Disputes",
    trustSafety: "Trust & Safety",
    // Resources
    howItWorks: "How It Works",
    helpCenter: "Help Center",
    paymentsEarnings: "Payments & Earnings",
    pricingUpgrades: "Pricing & Upgrades",
    reviews: "Reviews",
    pressMedia: "Press & Media",
    developers: "Developers",
    apiDoc: "API",
    pagesTitle: "Pages",
    // Company
    aboutUs: "About Us",
    careers: "Careers",
    investors: "Investors",
    legal: "Legal",
    terms: "Terms",
    privacy: "Privacy",
    contact: "Contact",
  },
  fr: {
    desc: "La plateforme professionnelle africaine pour les techniciens, ingénieurs, indépendants et entreprises vérifiées — fondée sur la confiance, le séquestre et des prestations sécurisées.",
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
    // Clients
    postTask: "Publier une tâche",
    browseServices: "Parcourir les services",
    findTechnicians: "Trouver des techniciens",
    hireCompanies: "Engager des entreprises",
    buildTeam: "Former une équipe",
    concierge: "Service Concierge",
    itOnDemand: "Informatique à la demande",
    // Technicians
    joinAsTechnician: "Devenir Technicien",
    myProfile: "Mon Profil",
    postServices: "Publier des services",
    findTasks: "Trouver des missions",
    earnings: "Revenus & Portefeuille",
    verification: "Vérification de profil",
    upgradePlan: "Changer de forfait",
    // Companies
    registerCompany: "Inscrire une Entreprise",
    companyProfile: "Profil Entreprise",
    contracts: "Contrats & Appels d'offres",
    enterprise: "Solutions Entreprises",
    compliance: "Conformité & Légal",
    partnerships: "Partenariats institutionnels",
    // Payments
    escrowSystem: "Système de Séquestre",
    milestones: "Jalons de paiement",
    securePayments: "Paiements sécurisés",
    refunds: "Remboursements",
    disputes: "Gestion des litiges",
    trustSafety: "Confiance & Sécurité",
    // Resources
    howItWorks: "Comment ça marche",
    helpCenter: "Centre d'aide & FAQ",
    paymentsEarnings: "Paiements & Gains",
    pricingUpgrades: "Tarifs & Forfaits",
    reviews: "Avis & Évaluations",
    pressMedia: "Presse & Médias",
    developers: "Développeurs",
    apiDoc: "Documentation API",
    pagesTitle: "Pages publiques",
    // Company
    aboutUs: "À propos de nous",
    careers: "Carrières & Recrutement",
    investors: "Investisseurs",
    legal: "Mentions légales",
    terms: "Conditions d'utilisation",
    privacy: "Politique de confidentialité",
    contact: "Contactez-nous",
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
    postTask: "Tanga akazi",
    browseServices: "Reba serivisi",
    findTechnicians: "Shaka abatekinisiye",
    hireCompanies: "Koresha ibigo",
    buildTeam: "Kora itsinda",
    concierge: "Concierge",
    itOnDemand: "IT on Demand",
    joinAsTechnician: "Iyandikishe nk'umutekinisiye",
    myProfile: "Umwirondoro wanjye",
    postServices: "Tanga serivisi",
    findTasks: "Shaka imirimo",
    earnings: "Inyungu",
    verification: "Isuzuma",
    upgradePlan: "Guhindura ifatabuguzi",
    registerCompany: "Iyandikishe nk'ikigo",
    companyProfile: "Umwirondoro w'ikigo",
    contracts: "Amasezerano",
    enterprise: "Ibigo binini",
    compliance: "Amategeko",
    partnerships: "Ubufatanye",
    escrowSystem: "Uburyo bwa Escrow",
    milestones: "Ibyiciro by'akazi",
    securePayments: "Kwishyura birinzwe",
    refunds: "Gusubizwa amafaranga",
    disputes: "Gukemura amakimbirane",
    trustSafety: "Umutekano n'icyizere",
    howItWorks: "Uko bikora",
    helpCenter: "Ubufasha",
    paymentsEarnings: "Kwishyura & Inyungu",
    pricingUpgrades: "Ibiciro",
    reviews: "Ubuhamya",
    pressMedia: "Amakuru",
    developers: "Abateza imbere",
    apiDoc: "API",
    pagesTitle: "Impapuro",
    aboutUs: "Ibyerekeye twebwe",
    careers: "Imyanya y'akazi",
    investors: "Abashoramari",
    legal: "Amategeko",
    terms: "Amabwiriza",
    privacy: "Ubuzima bwite",
    contact: "Tuvugishe",
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
    postTask: "نشر مهمة",
    browseServices: "تصفح الخدمات",
    findTechnicians: "البحث عن فنيين",
    hireCompanies: "توظيف الشركات",
    buildTeam: "بناء فريق",
    concierge: "الكونسيرج",
    itOnDemand: "تكنولوجيا المعلومات عند الطلب",
    joinAsTechnician: "انضم كفني",
    myProfile: "ملفي الشخصي",
    postServices: "نشر الخدمات",
    findTasks: "البحث عن مهام",
    earnings: "الأرباح",
    verification: "التحقق",
    upgradePlan: "ترقية الخطة",
    registerCompany: "تسجيل شركة",
    companyProfile: "ملف الشركة",
    contracts: "العقود",
    enterprise: "المؤسسات",
    compliance: "الامتثال",
    partnerships: "الشراكات",
    escrowSystem: "نظام الضمان",
    milestones: "المراحل",
    securePayments: "مدفوعات آمنة",
    refunds: "المستردات",
    disputes: "النزاعات",
    trustSafety: "الثقة والأمان",
    howItWorks: "كيف يعمل",
    helpCenter: "مركز المساعدة",
    paymentsEarnings: "المدفوعats والأرباح",
    pricingUpgrades: "الأسعار والترقيات",
    reviews: "التقييمات",
    pressMedia: "الصحافة والإعلام",
    developers: "المطورون",
    apiDoc: "واجهة برمجة التطبيقات",
    pagesTitle: "الصفحات",
    aboutUs: "معلومات عنا",
    careers: "وظائف",
    investors: "المستثمرون",
    legal: "قانوني",
    terms: "الشروط",
    privacy: "الخصوصية",
    contact: "اتصل بنا",
  },
};

export default function Footer() {
  const [lang, setLangState] = useState("en");
  const [langOpen, setLangOpen] = useState(false);
  const { data: pagesData } = useFetch(() => api.getPublicPages(), []);

  useEffect(() => {
    const updateLang = () => {
      const currentLang = localStorage.getItem("lang") || "en";
      setLangState(currentLang);
      document.documentElement.dir = currentLang === "ar" ? "rtl" : "ltr";
    };
    updateLang();
    window.addEventListener("languageChange", updateLang);
    return () => window.removeEventListener("languageChange", updateLang);
  }, []);

  const t = translations[lang] || translations["en"];
  const pages = Array.isArray(pagesData) ? pagesData : [];

  const changeLang = (l: string) => {
    setLangState(l);
    localStorage.setItem("lang", l);
    localStorage.setItem("user_selected_lang", "true");
    document.documentElement.dir = l === "ar" ? "rtl" : "ltr";
    setLangOpen(false);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("languageChange"));
    }
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
            <Link href="/post-task">{t.postTask}</Link>
            <Link href="/search">{t.browseServices}</Link>
            <Link href="/service-providers/technicians">{t.findTechnicians}</Link>
            <Link href="/search?type=company">{t.hireCompanies}</Link>
            <Link href="/build-a-team">{t.buildTeam}</Link>
            <Link href="/concierge">{t.concierge}</Link>
            <Link href="/it-on-demand">{t.itOnDemand}</Link>
          </div>

          {/* TECHNICIANS */}
          <div className="footer-col">
            <h4>{t.technicians}</h4>
            <Link href="/signup?role=technician">{t.joinAsTechnician}</Link>
            <Link href="/dashboard/technician/profile">{t.myProfile}</Link>
            <Link href="/dashboard/company/services">{t.postServices}</Link>
            <Link href="/dashboard/technician/tasks">{t.findTasks}</Link>
            <Link href="/dashboard/technician/wallet">{t.earnings}</Link>
            <Link href="/signup/verify">{t.verification}</Link>
            <Link href="/upgrade">{t.upgradePlan}</Link>
          </div>

          {/* COMPANIES */}
          <div className="footer-col">
            <h4>{t.companies}</h4>
            <Link href="/signup?role=company">{t.registerCompany}</Link>
            <Link href="/dashboard/company/profile">{t.companyProfile}</Link>
            <Link href="/dashboard/company/services">{t.postServices}</Link>
            <Link href="/contractors">{t.contracts}</Link>
            <Link href="/contractors">{t.enterprise}</Link>
            <Link href="/dashboard/admin/verification">{t.compliance}</Link>
            <Link href="/partnerships">{t.partnerships}</Link>
          </div>

          {/* PAYMENTS */}
          <div className="footer-col">
            <h4>{t.payments}</h4>
            <Link href="/dashboard/client/payments">{t.escrowSystem}</Link>
            <Link href="/dashboard/company/projects/tracking">{t.milestones}</Link>
            <Link href="/dashboard/client/payments">{t.securePayments}</Link>
            <Link href="/dashboard/client/payments">{t.refunds}</Link>
            <Link href="/dispute-resolution">{t.disputes}</Link>
            <Link href="/signup/verify">{t.trustSafety}</Link>
          </div>

          {/* RESOURCES */}
          <div className="footer-col">
            <h4>{t.resources}</h4>
            <Link href="/how-it-works">{t.howItWorks}</Link>
            <Link href="/help-center">{t.helpCenter}</Link>
            <Link href="/payments-and-earnings">{t.paymentsEarnings}</Link>
            <Link href="/upgrade">{t.pricingUpgrades}</Link>
            <Link href="/search">{t.reviews}</Link>
            <Link href="/press">{t.pressMedia}</Link>
            <Link href="/">{t.developers}</Link>
            <Link href="/search">{t.apiDoc}</Link>
            {pages.length > 0 ? <h4 style={{ marginTop: 18 }}>{t.pagesTitle}</h4> : null}
            {pages.slice(0, 6).map((page: any) => (
              <Link key={page.id} href={`/pages/${page.slug}`}>
                {page.title}
              </Link>
            ))}
          </div>

          {/* COMPANY */}
          <div className="footer-col">
            <h4>{t.company}</h4>
            <Link href="/about">{t.aboutUs}</Link>
            <Link href="/careers">{t.careers}</Link>
            <Link href="/investors">{t.investors}</Link>
            <Link href="/terms">{t.legal}</Link>
            <Link href="/terms">{t.terms}</Link>
            <Link href="/privacy">{t.privacy}</Link>
            <Link href="/contact">{t.contact}</Link>
          </div>

        </div>

        <div className="footer-divider" />

        {/* BOTTOM BAR */}
        <div className="footer-bottom">
          <div>{t.copyright}</div>

          <div className="footer-switch">
            {/* LANGUAGE */}
            <div className="switch">
              <div className="switch-btn" onClick={() => setLangOpen(!langOpen)}>
                🌐 <span>{t.label}</span>
              </div>
              {langOpen && (
                <div className="switch-list" style={{ display: "block" }}>
                  <button type="button" onClick={() => changeLang("en")}>English</button>
                  <button type="button" onClick={() => changeLang("fr")}>Français</button>
                  <button type="button" onClick={() => changeLang("rw")}>Kinyarwanda</button>
                  <button type="button" onClick={() => changeLang("ar")}>العربية</button>
                </div>
              )}
            </div>

            {/* COUNTRY */}
            <CountrySelector variant="footer" />
          </div>

          <div className="footer-socials">
            <a href="https://cm.linkedin.com/company/boulotman" target="_blank" rel="noreferrer">LinkedIn</a>
            <a href="https://x.com/boulotman" target="_blank" rel="noreferrer">Twitter</a>
            <a href="https://www.facebook.com/boulotman.inc/" target="_blank" rel="noreferrer">Facebook</a>
            <a href="https://www.instagram.com/boulotman?igsh=M3NmZWFiemt1ZHly" target="_blank" rel="noreferrer">Instagram</a>
          </div>
        </div>

      </div>
    </footer>
  );
}

