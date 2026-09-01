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

const FOOTER_TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    tagline: "Home for technicians and engineers in Africa.",
    description:
      "Boulot Man connects clients with verified technicians, engineers, professionals and companies for everyday services, skilled work and large projects across Africa.",
    postTaskBtn: "Post a Task",
    findProsBtn: "Find Professionals",
    findCompaniesBtn: "Find Companies",

    col1Title: "Boulot Man",
    thePlatform: "The Platform",
    howItWorks: "How it works",
    locations: "Locations",
    partnerships: "Partnerships",
    invest: "Invest",
    careers: "Career/Jobs",
    press: "Press & Media",

    col2Title: "Clients",
    signUp: "Sign up",
    postTask: "Post a Task",
    browseServices: "Browse Services",
    findTechnicians: "Find Technicians",
    hireCompanies: "Hire Companies",
    buildTeam: "Build a Team",
    concierge: "Concierge",

    col3Title: "Professionals",
    joinTechnician: "Join as a Technician",
    postServices: "Post Services",
    browseTasks: "Browse Task",
    myProfile: "My Profile",
    contracts: "Contracts",
    upgradePlan: "Upgrade Plan",

    col4Title: "Companies",
    joinCompany: "Join as a Company",
    postCompanyServices: "Post Services",
    browseProjects: "Browse Projects",
    yourProfile: "Your profile",
    subcontracting: "Subcontracting Opportunities",
    contractors: "Contractors",

    col5Title: "Resources & Community",
    helpCenter: "Help Center",
    safetyCenter: "Safety Center",
    serviceCategories: "Service Categories",
    pricingFees: "Pricing and Fees",
    communityGuidelines: "Community Guidelines",
    earnings: "Earnings",
    escrowPayments: "Escrow & Safe Payments",

    termsOfService: "Terms of Service",
    privacyPolicy: "Privacy Policy",
    trustSafety: "Trust & Safety",
    paymentsEscrow: "Payments & Escrow",
    refunds: "Refunds",
    reviewsRatings: "Reviews & Ratings",
    cookies: "Cookies",
    legalCenter: "Legal Center",

    copyright: "© 2026 Boulot Man Engineering Company. All rights reserved.",
    selectRegion: "Select Region & Currency",
    searchCountry: "Search country or currency...",
    autoLocalizes: "Auto-localizes jobs & pricing",
    noRegionFound: "No region found."
  },
  fr: {
    tagline: "La maison des techniciens et ingénieurs en Afrique.",
    description:
      "Boulot Man met en relation des clients avec des techniciens certifiés, des ingénieurs, des professionnels et des entreprises pour les services du quotidien, les travaux qualifiés et les grands projets en Afrique.",
    postTaskBtn: "Publier une tâche",
    findProsBtn: "Trouver des professionnels",
    findCompaniesBtn: "Trouver des entreprises",

    col1Title: "Boulot Man",
    thePlatform: "La Plateforme",
    howItWorks: "Comment ça marche",
    locations: "Emplacements",
    partnerships: "Partenariats",
    invest: "Investir",
    careers: "Carrières & Emplois",
    press: "Presse & Médias",

    col2Title: "Clients",
    signUp: "S'inscrire",
    postTask: "Publier une tâche",
    browseServices: "Parcourir les services",
    findTechnicians: "Trouver des techniciens",
    hireCompanies: "Engager des entreprises",
    buildTeam: "Créer une équipe",
    concierge: "Conciergerie",

    col3Title: "Professionnels",
    joinTechnician: "Devenir Technicien",
    postServices: "Publier des services",
    browseTasks: "Consulter les tâches",
    myProfile: "Mon Profil",
    contracts: "Contrats",
    upgradePlan: "Mettre à niveau",

    col4Title: "Entreprises",
    joinCompany: "Devenir Entreprise",
    postCompanyServices: "Publier des services",
    browseProjects: "Consulter les projets",
    yourProfile: "Votre profil",
    subcontracting: "Opportunités de sous-traitance",
    contractors: "Contractants",

    col5Title: "Ressources & Communauté",
    helpCenter: "Centre d'aide",
    safetyCenter: "Centre de sécurité",
    serviceCategories: "Catégories de services",
    pricingFees: "Tarifs et frais",
    communityGuidelines: "Règles communautaires",
    earnings: "Gains & Rémunérations",
    escrowPayments: "Paiements Sécurisés & Séquestre",

    termsOfService: "Conditions d'utilisation",
    privacyPolicy: "Politique de confidentialité",
    trustSafety: "Confiance & Sécurité",
    paymentsEscrow: "Paiements & Séquestre",
    refunds: "Remboursements",
    reviewsRatings: "Avis & Évaluations",
    cookies: "Cookies",
    legalCenter: "Centre juridique",

    copyright: "© 2026 Boulot Man Engineering Company. Tous droits réservés.",
    selectRegion: "Sélectionner la région et la devise",
    searchCountry: "Rechercher un pays ou une devise...",
    autoLocalizes: "Localisation automatique des prix",
    noRegionFound: "Aucune région trouvée."
  },
  rw: {
    tagline: "Ihuriro ry'abatekinisiye n'aba enjeniyeri muri Afurika.",
    description:
      "Boulot Man ihuza abakiriya n'abatekinisiye babifitiye ubushobozi, aba enjeniyeri n'ibigo by'ubwubatsi muri Afurika yose.",
    postTaskBtn: "Tanga Akazi",
    findProsBtn: "Shaka Abatekinisiye",
    findCompaniesBtn: "Shaka Ibigo",

    col1Title: "Boulot Man",
    thePlatform: "Urubuga",
    howItWorks: "Uko Bikora",
    locations: "Aho Dukorera",
    partnerships: "Ubufatanye",
    invest: "Ishoramari",
    careers: "Imyanya y'Akazi",
    press: "Amakuru n'Ibitangazamakuru",

    col2Title: "Abakiriya",
    signUp: "Iyandikishe",
    postTask: "Tanga Akazi",
    browseServices: "Reba Serivisi",
    findTechnicians: "Shaka Abatekinisiye",
    hireCompanies: "Koresha Ibigo",
    buildTeam: "Kora Ikipe",
    concierge: "Serivisi Yihariye",

    col3Title: "Abanyamwuga",
    joinTechnician: "Iyandikishe nk'Umutekinisiye",
    postServices: "Shyiraho Serivisi",
    browseTasks: "Reba Imirimo Ihari",
    myProfile: "Umwirondoro Wanjye",
    contracts: "Amasezerano",
    upgradePlan: "Kuzamura Konti",

    col4Title: "Ibigo",
    joinCompany: "Iyandikishe nk'Ikigo",
    postCompanyServices: "Shyiraho Serivisi",
    browseProjects: "Reba Imishinga",
    yourProfile: "Umwirondoro w'Ikigo",
    subcontracting: "Amasoko yo Gufatanya",
    contractors: "Abakandarasi",

    col5Title: "Ubufasha & Umuryango",
    helpCenter: "Ikigo cy'Ubufasha",
    safetyCenter: "Umutekano",
    serviceCategories: "Ibyiciro bya Serivisi",
    pricingFees: "Ibiciro n'Amafaranga",
    communityGuidelines: "Amategeko Agenga Abanyamuryango",
    earnings: "Inyungu",
    escrowPayments: "Uburyo bwo Kwishyura Bwizewe",

    termsOfService: "Amategeko n'Amabwiriza",
    privacyPolicy: "Politiki y'Ubuzima Bwite",
    trustSafety: "Icyizere n'Umutekano",
    paymentsEscrow: "Kwishyura Binyuze muri Escrow",
    refunds: "Gusubizwa Amafaranga",
    reviewsRatings: "Ibitekerezo n'Amanota",
    cookies: "Kuki (Cookies)",
    legalCenter: "Ikigo cy'Amategeko",

    copyright: "© 2026 Boulot Man Engineering Company. Uburenganzira bwose burabitswe.",
    selectRegion: "Hitamo Igihugu & Ifaranga",
    searchCountry: "Shakisha igihugu...",
    autoLocalizes: "Kumenya ibiciro by'aho uri",
    noRegionFound: "Nta gihugu cyabonetse."
  },
  ar: {
    tagline: "المنصة الرائدة للفنيين والمهندسين في إفريقيا.",
    description:
      "تربط بولوت مان العملاء بالفنيين المعتمدين والمهندسين والشركات لتنفيذ المهام اليومية والمشاريع الكبرى في إفريقيا.",
    postTaskBtn: "نشر مهمة",
    findProsBtn: "البحث عن محترفين",
    findCompaniesBtn: "البحث عن شركات",

    col1Title: "بولوت مان",
    thePlatform: "المنصة",
    howItWorks: "كيف تعمل",
    locations: "المواقع",
    partnerships: "الشراكات",
    invest: "الاستثمار",
    careers: "الوظائف",
    press: "الصحافة والإعلام",

    col2Title: "العملاء",
    signUp: "تسجيل جديد",
    postTask: "نشر مهمة",
    browseServices: "تصفح الخدمات",
    findTechnicians: "البحث عن فنيين",
    hireCompanies: "توظيف شركات",
    buildTeam: "بناء فريق",
    concierge: "الخدمة الممتازة",

    col3Title: "المحترفون",
    joinTechnician: "الانضمام كفني",
    postServices: "إضافة خدمات",
    browseTasks: "تصفح المهام",
    myProfile: "ملفي الشخصي",
    contracts: "العقود",
    upgradePlan: "ترقية الخطة",

    col4Title: "الشركات",
    joinCompany: "الانضمام كشركة",
    postCompanyServices: "إضافة خدمات الشركة",
    browseProjects: "تصفح المشاريع",
    yourProfile: "ملف الشركة",
    subcontracting: "فرص المقاولة الفرعية",
    contractors: "المقاولون",

    col5Title: "الموارد والمجتمع",
    helpCenter: "مركز المساعدة",
    safetyCenter: "مركز الأمان",
    serviceCategories: "فئات الخدمات",
    pricingFees: "الأسعار والرسوم",
    communityGuidelines: "إرشادات المجتمع",
    earnings: "الأرباح",
    escrowPayments: "الدفع الآمن والضمان",

    termsOfService: "شروط الخدمة",
    privacyPolicy: "سياسة الخصوصية",
    trustSafety: "الثقة والأمان",
    paymentsEscrow: "المدفوعات والضمان",
    refunds: "استرداد الأموال",
    reviewsRatings: "التقييمات والآراء",
    cookies: "ملفات تعريف الارتباط",
    legalCenter: "المركز القانوني",

    copyright: "© 2026 شركة بولوت مان الهندسية. جميع الحقوق محفوظة.",
    selectRegion: "اختر المنطقة والعملة",
    searchCountry: "ابحث عن دولة أو عملة...",
    autoLocalizes: "تحديد الموقع والأسعار تلقائياً",
    noRegionFound: "لم يتم العثور على منطقة."
  }
};

export default function Footer() {
  const [selectedCountry, setSelectedCountry] = useState<CountryOption>(COUNTRIES_LIST[0]);
  const [countryOpen, setCountryOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");

  const [selectedLang, setSelectedLang] = useState(LANGUAGES[0]);
  const [langOpen, setLangOpen] = useState(false);

  const countryPickerRef = useRef<HTMLDivElement>(null);
  const langPickerRef = useRef<HTMLDivElement>(null);

  const syncLanguageState = () => {
    if (typeof window !== "undefined") {
      const savedLang = localStorage.getItem("lang") || "en";
      const foundLang = LANGUAGES.find((l) => l.code === savedLang);
      if (foundLang) {
        setSelectedLang(foundLang);
      }
    }
  };

  // Restore saved country & language on mount + event listeners
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCountry = localStorage.getItem("bmSelectedCountry") || localStorage.getItem("country");
      if (savedCountry) {
        const found = COUNTRIES_LIST.find(
          (c) => c.country.toLowerCase() === savedCountry.toLowerCase()
        );
        if (found) setSelectedCountry(found);
      }

      syncLanguageState();

      const handleLangChange = () => {
        syncLanguageState();
      };

      const handleCustomLangChange = (e: any) => {
        if (e.detail && e.detail.code) {
          const found = LANGUAGES.find((l) => l.code === e.detail.code);
          if (found) setSelectedLang(found);
        } else {
          syncLanguageState();
        }
      };

      window.addEventListener("languageChange", handleLangChange);
      document.addEventListener("bmLanguageChanged", handleCustomLangChange);

      return () => {
        window.removeEventListener("languageChange", handleLangChange);
        document.removeEventListener("bmLanguageChanged", handleCustomLangChange);
      };
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

  const t = (key: string): string => {
    const dict = FOOTER_TRANSLATIONS[selectedLang.code] || FOOTER_TRANSLATIONS["en"];
    return dict[key] || FOOTER_TRANSLATIONS["en"][key] || key;
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
                  {t("tagline")}
                </p>
              </div>
            </Link>

            <p className="bmf-description">
              {t("description")}
            </p>
          </div>

          <div className="bmf-actions">
            <Link href="/post-task" className="bmf-action bmf-action-primary">
              {t("postTaskBtn")}
            </Link>
            <Link href="/service-providers/technicians" className="bmf-action">
              {t("findProsBtn")}
            </Link>
            <Link href="/search?type=company" className="bmf-action">
              {t("findCompaniesBtn")}
            </Link>
          </div>
        </section>

        {/* =====================================================
             MAIN 5-COLUMN NAVIGATION
        ====================================================== */}
        <nav className="bmf-navigation" aria-label="Boulot Man Footer Navigation">
          {/* COLUMN 1: BOULOT MAN */}
          <div className="bmf-nav-column">
            <h3 className="bmf-nav-title">{t("col1Title")}</h3>
            <ul className="bmf-nav-list">
              <li>
                <Link href="/about">{t("thePlatform")}</Link>
              </li>
              <li>
                <Link href="/how-it-works">{t("howItWorks")}</Link>
              </li>
              <li>
                <Link href="/locations">{t("locations")}</Link>
              </li>
              <li>
                <Link href="/partnerships">{t("partnerships")}</Link>
              </li>
              <li>
                <Link href="/investors">{t("invest")}</Link>
              </li>
              <li>
                <Link href="/careers">{t("careers")}</Link>
              </li>
              <li>
                <Link href="/press">{t("press")}</Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 2: CLIENTS */}
          <div className="bmf-nav-column">
            <h3 className="bmf-nav-title">{t("col2Title")}</h3>
            <ul className="bmf-nav-list">
              <li>
                <Link href="/signup?role=client">{t("signUp")}</Link>
              </li>
              <li>
                <Link href="/post-task">{t("postTask")}</Link>
              </li>
              <li>
                <Link href="/search">{t("browseServices")}</Link>
              </li>
              <li>
                <Link href="/service-providers/technicians">{t("findTechnicians")}</Link>
              </li>
              <li>
                <Link href="/search?type=company">{t("hireCompanies")}</Link>
              </li>
              <li>
                <Link href="/build-a-team">{t("buildTeam")}</Link>
              </li>
              <li>
                <Link href="/concierge">{t("concierge")}</Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 3: PROFESSIONALS */}
          <div className="bmf-nav-column">
            <h3 className="bmf-nav-title">{t("col3Title")}</h3>
            <ul className="bmf-nav-list">
              <li>
                <Link href="/signup?role=technician">{t("joinTechnician")}</Link>
              </li>
              <li>
                <Link href="/dashboard/technician/services/new">{t("postServices")}</Link>
              </li>
              <li>
                <Link href="/find-tasks">{t("browseTasks")}</Link>
              </li>
              <li>
                <Link href="/dashboard/technician/profile">{t("myProfile")}</Link>
              </li>
              <li>
                <Link href="/contractors">{t("contracts")}</Link>
              </li>
              <li>
                <Link href="/upgrade">{t("upgradePlan")}</Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 4: COMPANIES */}
          <div className="bmf-nav-column">
            <h3 className="bmf-nav-title">{t("col4Title")}</h3>
            <ul className="bmf-nav-list">
              <li>
                <Link href="/signup?role=company">{t("joinCompany")}</Link>
              </li>
              <li>
                <Link href="/dashboard/company/services">{t("postCompanyServices")}</Link>
              </li>
              <li>
                <Link href="/find-tasks">{t("browseProjects")}</Link>
              </li>
              <li>
                <Link href="/dashboard/company/profile">{t("yourProfile")}</Link>
              </li>
              <li>
                <Link href="/subcontracting">{t("subcontracting")}</Link>
              </li>
              <li>
                <Link href="/contractors">{t("contractors")}</Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 5: RESOURCES & COMMUNITY */}
          <div className="bmf-nav-column">
            <h3 className="bmf-nav-title">{t("col5Title")}</h3>
            <ul className="bmf-nav-list">
              <li>
                <Link href="/help-center">{t("helpCenter")}</Link>
              </li>
              <li>
                <Link href="/safety">{t("safetyCenter")}</Link>
              </li>
              <li>
                <Link href="/search">{t("serviceCategories")}</Link>
              </li>
              <li>
                <Link href="/locations">{t("locations")}</Link>
              </li>
              <li>
                <Link href="/upgrade">{t("pricingFees")}</Link>
              </li>
              <li>
                <Link href="/community-guidelines">{t("communityGuidelines")}</Link>
              </li>
              <li>
                <Link href="/payments-and-earnings">{t("earnings")}</Link>
              </li>
              <li>
                <Link href="/dispute-resolution">{t("escrowPayments")}</Link>
              </li>
            </ul>
          </div>
        </nav>

        {/* =====================================================
             LEGAL LINKS STRIP
        ====================================================== */}
        <div className="bmf-legal">
          <nav className="bmf-legal-links" aria-label="Boulot Man Legal Navigation">
            <Link href="/terms">{t("termsOfService")}</Link>
            <span aria-hidden="true">•</span>
            <Link href="/privacy">{t("privacyPolicy")}</Link>
            <span aria-hidden="true">•</span>
            <Link href="/trust-and-safety">{t("trustSafety")}</Link>
            <span aria-hidden="true">•</span>
            <Link href="/payments-and-escrow">{t("paymentsEscrow")}</Link>
            <span aria-hidden="true">•</span>
            <Link href="/refunds">{t("refunds")}</Link>
            <span aria-hidden="true">•</span>
            <Link href="/reviews-ratings">{t("reviewsRatings")}</Link>
            <span aria-hidden="true">•</span>
            <Link href="/cookies">{t("cookies")}</Link>
            <span aria-hidden="true">•</span>
            <Link href="/legal">{t("legalCenter")}</Link>
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
                {t("copyright")}
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
                    <h4>{t("selectRegion")}</h4>
                    <input
                      type="search"
                      className="bmf-country-search"
                      id="bmfCountrySearch"
                      placeholder={t("searchCountry")}
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
                        {t("noRegionFound")}
                      </div>
                    )}
                  </div>

                  <div className="bmf-country-footer">
                    <span>{t("autoLocalizes")}</span>
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
                href="https://www.tiktok.com/@boulotman.inc?_r=1&_t=ZS-99N6bj2bAxA"
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
