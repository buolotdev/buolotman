"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { api } from "./lib/api";
import { useFetch } from "./lib/useFetch";
import { SkeletonBlock, SkeletonStat } from "./components/skeleton/Skeleton";

const ICON_BY_KEY: Record<string, string> = {
  "software-and-digital-engineering": "lucide:cpu",
  "it-infrastructure-and-networking": "lucide:network",
  "cybersecurity-services": "lucide:shield-check",
  "cloud-and-systems-engineering": "lucide:cloud",
  "electrical-and-electronics-engineering": "lucide:zap",
  "civil-construction-and-architecture": "lucide:hard-hat",
  "mechanical-and-industrial-engineering": "lucide:settings",
  "renewable-energy-and-utilities": "lucide:sun",
  "automotive-and-heavy-equipment": "lucide:car",
  "telecom-broadcast-and-security-systems": "lucide:radio-tower",
  "handyman-and-home-maintenance": "lucide:hammer",
  "cleaning-outdoor-and-environmental-services": "lucide:leaf",
  "transport-logistics-and-support-services": "lucide:truck",
  "health-beauty-and-personal-care": "lucide:heart",
  "education-language-and-document-services": "lucide:book-open",
  default: "lucide:briefcase",
};

type PublicProfessional = {
  id: number | string;
  first_name?: string;
  last_name?: string;
  username?: string;
  country?: string;
  skills?: string[];
  completed_jobs?: number;
  average_rating?: number | string;
};

type PublicCompany = {
  id: number | string;
  company_name?: string;
  city?: string;
  country?: string;
  description?: string;
  projects_count?: number;
  services_count?: number;
  average_rating?: number | string;
  review_count?: number;
};


const CountUpNumber = ({ end, duration = 2000, suffix = "" }: { end: number, duration?: number, suffix?: string }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (end === 0) {
      setCount(0);
      return;
    }
    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      // ease out expo
      const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(easeOut * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return <>{count.toLocaleString()}{suffix}</>;
};


const translations: Record<string, Record<string, any>> = {
  en: {
    heroTitle1: "Connecting clients with",
    heroTitle2: "verified technicians and engineers",
    heroDesc: "Join Africa’s growing workforce marketplace connecting professionals, businesses, and communities at scale.",
    searchPlaceholder: "What service do you offer or are you looking for? e.g Electrical installation, Web development, Plumbing, Solar systems, CCTV installation, Mobile apps",
    allCategories: "All Categories",
    btnSearch: "Search",
    btnSignUpProvider: "Sign up as Service Provider",
    btnPostService: "Post a Service",
    liveTasksTitle: "🔴 Live Tasks",
    liveTasksLoading: "Loading tasks...",
    liveTasksNoTasks: "No tasks available",
    liveTasksCta: "See more people finding services around you →",
    statsTitle: "Boulot Man at a Glance",
    statsDesc: "A growing marketplace connecting clients, technicians, and companies through verified services and secure project engagement.",
    statUsers: "Registered Users",
    statTechs: "Verified Technicians",
    statComps: "Verified Companies",
    statMonthly: "Tasks Posted Monthly",
    statCompletion: "Successful Project Completion",
    ftxTitle: "Boulot Man connects clients with verified technicians and engineers — securely and efficiently.",
    ftxRoleTech: "Verified Technician",
    ftxMeta: "Available now",
    ftxBtnView: "View Profile",
    ftxBtnHire: "Hire Now",
    ftxFooterLink: "Hire verified professionals with confidence. See more →",
    prosLoading: "Loading technicians...",
    prosNoTasks: "No featured technicians available.",
    entHeaderTitle: "Partner with Top Enterprise & Maintenance Companies",
    entHeaderSubtitle: "Connect with highly rated enterprise firms capable of executing large scale projects securely and efficiently.",
    entRoleComp: "Registered Company",
    entMeta: "Projects",
    entDescFallback: "Comprehensive enterprise and maintenance services.",
    entBtnView: "View Profile",
    entBtnHire: "Request Quote",
    entExplore: "Explore all registered companies →",
    companiesLoading: "Loading companies...",
    companiesNoTasks: "No companies available at the moment.",
    catEyebrow: "Popular categories",
    catTitle: "Browse services by category",
    catDesc: "Discover vetted experts across the most requested home, office, and commercial service categories.",
    catViewAll: "View all",
    catExplorePrefix: "Explore verified",
    catExploreSuffix: "professionals ready to help.",
    catBrowse: "Browse category",
    catLoading: "Loading categories...",
    catNone: "No categories available yet.",
    hiwEyebrow: "Why choose us",
    hiwTitle: "Built for trust and efficiency",
    hiwDesc: "We make sure that every interaction on the platform is secure, transparent, and focused on delivering high quality results.",
    hiwCard1Title: "Verified Professionals",
    hiwCard1Desc: "Every technician and company is rigorously vetted for skills, quality, and safety. Our platform ensures compliance with strict standards.",
    hiwCard2Title: "Success Rate",
    hiwCard2Desc: "With a proven track record, thousands of clients have completed their projects successfully. Our experts focus on solid outcomes.",
    hiwCard3Title: "Secure Payments",
    hiwCard3Desc: "We value your privacy and support you with top security. Boulot Man ensures the safety and integrity of all payments.",
    hiwCard4Title: "Tailored Pathways",
    hiwCard4Desc: "Every project is unique, and so is our support. Boulot Man designs customized service pathways that fit your goals and budget.",
    promoTitle: "Let experts find the right professional for you",
    promoList1: "Work with experts who search, interview, and evaluate professionals for you",
    promoList2: "Get a report with clear recommendations",
    promoList3: "Hire verified technical talent with complete confidence",
    promoBtn: "Discover expert sourcing",
    promoGuarantee: "100% Money-back guarantee"
  },
  fr: {
    heroTitle1: "Connecter les clients avec des",
    heroTitle2: "techniciens et ingénieurs vérifiés",
    heroDesc: "Rejoignez le marché du travail en pleine croissance en Afrique reliant les professionnels, les entreprises et les communautés à grande échelle.",
    searchPlaceholder: "Quel service proposez-vous ou recherchez-vous ? Ex: Installation électrique, Développement Web, Plomberie, Systèmes solaires, Installation de caméras, Applications mobiles",
    allCategories: "Toutes les catégories",
    btnSearch: "Rechercher",
    btnSignUpProvider: "S'inscrire comme prestataire",
    btnPostService: "Publier un service",
    liveTasksTitle: "🔴 Demandes en direct",
    liveTasksLoading: "Chargement des tâches...",
    liveTasksNoTasks: "Aucune tâche disponible",
    liveTasksCta: "Voir plus de personnes cherchant des services autour de vous →",
    statsTitle: "Boulot Man en un coup d'œil",
    statsDesc: "Un marché en pleine croissance reliant clients, techniciens et entreprises grâce à des services vérifiés et un engagement de projet sécurisé.",
    statUsers: "Utilisateurs enregistrés",
    statTechs: "Techniciens vérifiés",
    statComps: "Entreprises vérifiées",
    statMonthly: "Tâches publiées par mois",
    statCompletion: "Taux de réussite des projets",
    ftxTitle: "Boulot Man connecte les clients avec des techniciens et des ingénieurs vérifiés — de manière sécurisée et efficace.",
    ftxRoleTech: "Technicien vérifié",
    ftxMeta: "Disponible maintenant",
    ftxBtnView: "Voir le profil",
    ftxBtnHire: "Recruter",
    ftxFooterLink: "Embauchez des professionnels vérifiés en toute confiance. En savoir plus →",
    prosLoading: "Chargement des techniciens...",
    prosNoTasks: "Aucun technicien vedette disponible.",
    entHeaderTitle: "Associez-vous aux meilleures entreprises",
    entHeaderSubtitle: "Connectez-vous avec des entreprises hautement qualifiées capables d'exécuter de grands projets de manière sécurisée et efficace.",
    entRoleComp: "Entreprise enregistrée",
    entMeta: "Projets",
    entDescFallback: "Services complets d'entreprise et de maintenance.",
    entBtnView: "Voir le profil",
    entBtnHire: "Demander un devis",
    entExplore: "Découvrir toutes les entreprises enregistrées →",
    companiesLoading: "Chargement des entreprises...",
    companiesNoTasks: "Aucune entreprise disponible pour le moment.",
    catEyebrow: "Catégories populaires",
    catTitle: "Parcourir les services par catégorie",
    catDesc: "Découvrez des experts qualifiés dans les catégories de services résidentiels, professionnels et commerciaux les plus demandées.",
    catViewAll: "Voir tout",
    catExplorePrefix: "Découvrez des professionnels en",
    catExploreSuffix: "vérifiés et prêts à vous aider.",
    catBrowse: "Parcourir la catégorie",
    catLoading: "Chargement des catégories...",
    catNone: "Aucune catégorie disponible pour le moment.",
    hiwEyebrow: "Pourquoi nous choisir",
    hiwTitle: "Conçu pour la confiance et l'efficacité",
    hiwDesc: "Nous veillons à ce que chaque interaction sur la plateforme soit sécurisée, transparente et axée sur la fourniture de résultats de haute qualité.",
    hiwCard1Title: "Professionnels vérifiés",
    hiwCard1Desc: "Chaque technicien et entreprise est rigoureusement évalué pour ses compétences, sa qualité et sa sécurité. Notre plateforme garantit le respect de normes strictes.",
    hiwCard2Title: "Taux de réussite",
    hiwCard2Desc: "Avec un historique éprouvé, des milliers de clients ont réussi leurs projets grâce à ProMatch. Nos experts se concentrent sur l'atteinte de résultats solides.",
    hiwCard3Title: "Paiements sécurisés",
    hiwCard3Desc: "Nous respectons votre vie privée et assurons un soutien professionnel et sécurisé. ProMatch garantit la sécurité et l'intégrité de tous vos paiements.",
    hiwCard4Title: "Parcours sur mesure",
    hiwCard4Desc: "Chaque projet est unique, tout comme notre accompagnement. ProMatch conçoit des parcours de service personnalisés selon vos objectifs et votre budget.",
    promoTitle: "Laissez nos experts trouver le bon professionnel pour vous",
    promoList1: "Travaillez avec des experts qui recherchent, interviewent et évaluent les professionnels pour vous",
    promoList2: "Obtenez un rapport avec des recommandations claires",
    promoList3: "Embauchez des talents techniques vérifiés en toute confiance",
    promoBtn: "Découvrir la recherche d'experts",
    promoGuarantee: "Garantie de remboursement à 100%"
  }
};

export default function Home() {
  // Language state
  const [lang, setLang] = useState("en");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLang = localStorage.getItem("lang") || "en";
      if (savedLang === "fr" || savedLang === "en") {
        setLang(savedLang);
      } else if (savedLang === "rw") {
        setLang("fr");
      } else {
        setLang("en");
      }
    }
  }, []);

  const t = translations[lang] || translations["en"];

  const handleApplyClick = (e: React.MouseEvent, taskId: number) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setShowLoginPopup(true);
      } else {
        router.push('/dashboard/technician/tasks/' + taskId);
      }
    }
  };

  
  const [stats, setStats] = useState({
    registered_users: 50000,
    verified_technicians: 12000,
    verified_companies: 3500,
    tasks_posted_monthly: 8000,
    successful_completion: 95
  });

  useEffect(() => {
    api.getPlatformStats().then(data => {
      setStats({
        registered_users: data.registered_users ?? 50000,
        verified_technicians: data.verified_technicians ?? 12000,
        verified_companies: data.verified_companies ?? 3500,
        tasks_posted_monthly: data.tasks_posted_monthly ?? 8000,
        successful_completion: data.successful_completion ?? 95
      });
    }).catch(() => {});
  }, []);

  const router = useRouter();
    const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [liveTaskIndex, setLiveTaskIndex] = useState(0);

  const { data: categoriesData, loading: categoriesLoading } = useFetch(
    () => api.getCategories(),
    []
  );
  const { data: meData } = useFetch(
    () => {
      if (typeof window === "undefined") {
        return Promise.resolve(null);
      }
      return localStorage.getItem("access_token") ? api.getMe() : Promise.resolve(null);
    },
    []
  );
  const { data: prosData, loading: prosLoading } = useFetch(
    () => api.listUsers({ role: "technician", limit: "6" }),
    []
  );
  const { data: companiesData, loading: companiesLoading } = useFetch(
    () => api.listCompanies({ limit: "3" }),
    []
  );
  const { data: liveTasksData, error: liveTasksError } = useFetch(
    () => api.getTasks({ sort: "newest", limit: "8" }),
    []
  );

  useEffect(() => {
    setIsLoggedIn(Boolean(localStorage.getItem("access_token")));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveTaskIndex((prev) => {
        const count = liveTasksData?.results?.length || 0;
        if (count === 0) return 0;
        return (prev + 1) % count;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [liveTasksData]);

  /* ── Intersection Observer for scroll animations ── */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
          } else {
            // Remove the class when out of view so it animates again next time
            entry.target.classList.remove("animate-in");
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px -5% 0px" } // Triggers slightly earlier
    );

    const benefitsSection = document.getElementById("benefits");
    if (benefitsSection) {
      observer.observe(benefitsSection);
    }

    return () => observer.disconnect();
  }, []);

  /* ── Scroll-driven SVG connector line between HIW circles ── */
  useEffect(() => {
    const section = document.getElementById("how-it-works");
    if (!section) return;

    // Create SVG overlay (z-index 0 so it stays behind images/text)
    const NS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("id", "hiw-scroll-svg");
    svg.setAttribute("aria-hidden", "true");
    svg.style.cssText =
      "position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:0;overflow:visible;";

    // Glow filter
    const defs = document.createElementNS(NS, "defs");
    defs.innerHTML = `
      <filter id="hiw-glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    `;
    svg.appendChild(defs);

    // Background (faded) track
    const pathBg = document.createElementNS(NS, "path");
    pathBg.setAttribute("fill", "none");
    pathBg.setAttribute("stroke", "rgba(255,100,0,0.1)");
    pathBg.setAttribute("stroke-width", "3");
    pathBg.setAttribute("stroke-dasharray", "6 8");
    svg.appendChild(pathBg);

    // Animated foreground path
    const path = document.createElementNS(NS, "path");
    path.setAttribute("id", "hiw-connector-path");
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "#ff4500");
    path.setAttribute("stroke-width", "3");
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("filter", "url(#hiw-glow)");
    svg.appendChild(path);

    // Moving dot at the front of the line
    const dot = document.createElementNS(NS, "circle");
    dot.setAttribute("r", "6");
    dot.setAttribute("fill", "#ff4500");
    dot.setAttribute("filter", "url(#hiw-glow)");
    svg.appendChild(dot);

    section.style.position = "relative";
    section.insertBefore(svg, section.firstChild);

    let totalLength = 0;

    const buildPath = () => {
      const circles = section.querySelectorAll<HTMLElement>(".hiw-img-circle");
      if (circles.length < 2) return 0;

      const secRect = section.getBoundingClientRect();
      const points: { x: number; y: number }[] = [];

      circles.forEach((c) => {
        const r = c.getBoundingClientRect();
        points.push({
          x: r.left - secRect.left + r.width / 2,
          y: r.top - secRect.top + r.height / 2,
        });
      });

      // Elegant gentle S-curve (doesn't swing out wildy)
      let d = `M ${points[0].x} ${points[0].y}`;
      for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i];
        const p1 = points[i + 1];
        // Control points exactly halfway vertically between the two points
        const cy = p0.y + (p1.y - p0.y) / 2;
        d += ` C ${p0.x} ${cy}, ${p1.x} ${cy}, ${p1.x} ${p1.y}`;
      }

      path.setAttribute("d", d);
      pathBg.setAttribute("d", d);

      const len = path.getTotalLength();
      path.setAttribute("stroke-dasharray", String(len));
      path.setAttribute("stroke-dashoffset", String(len));
      return len;
    };

    const onScroll = () => {
      if (totalLength === 0) totalLength = buildPath();
      if (totalLength === 0) return;

      const secRect = section.getBoundingClientRect();
      const secH = section.offsetHeight;
      const vh = window.innerHeight;

      // Calculate scroll progress (0 to 1) based on section visibility
      const scrolled = Math.max(0, vh - secRect.top - 200); // offset so it starts drawing a bit later
      const maxScroll = secH + vh - 400;
      const progress = Math.min(1, Math.max(0, scrolled / maxScroll));

      const drawn = totalLength * progress;
      const remaining = totalLength - drawn;

      path.setAttribute("stroke-dashoffset", String(remaining));

      if (progress > 0 && progress < 1) {
        try {
          const pt = path.getPointAtLength(drawn);
          dot.setAttribute("cx", String(pt.x));
          dot.setAttribute("cy", String(pt.y));
          dot.setAttribute("opacity", "1");
        } catch {
          dot.setAttribute("opacity", "0");
        }
      } else {
        dot.setAttribute("opacity", "0");
      }
    };

    const timer = setTimeout(() => {
      totalLength = buildPath();
      onScroll();
    }, 400);

    window.addEventListener("scroll", onScroll, { passive: true });
    const resizeOb = new ResizeObserver(() => {
      totalLength = buildPath();
      onScroll();
    });
    resizeOb.observe(section);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
      resizeOb.disconnect();
      svg.remove();
    };
  }, []);





  const categories = (categoriesData && categoriesData.length > 0
    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
      categoriesData.map((c: any) => {
        const slug = (c.slug || c.name || "").toString().toLowerCase();
        return {
          name: c.name || c.title || slug,
          slug,
          icon: ICON_BY_KEY[slug] || ICON_BY_KEY.default,
        };
      })
    : []
  ).slice(0, 15);

  const pros = (Array.isArray(prosData) ? prosData : []) as PublicProfessional[];
  const companies = (Array.isArray(companiesData) ? companiesData : []) as PublicCompany[];
  const liveTasks = Array.isArray((liveTasksData as any)?.results)
    ? (liveTasksData as any).results
    : Array.isArray(liveTasksData)
      ? liveTasksData
      : [];

  const firstName = meData?.first_name || meData?.firstName || "";
  const greeting = firstName ? `Welcome back, ${firstName}` : "";

  const submitGlobalSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("q", searchQuery.trim());
    if (searchCategory) params.set("category", searchCategory);
    if (searchLocation.trim()) params.set("location", searchLocation.trim());
    router.push(`/search${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const postTaskHref = isLoggedIn ? "/post-task" : "/login?next=%2Fpost-task";

  return (
    <div id="homepage-screen">
      <Header />

      <section id="hero" className="bm-main-hero">
        <div className="bm-main-hero-grid">
          <div>
            <h1>
              {lang === 'fr' ? (
                <>Connecter les clients avec des<br /><span>techniciens et ingénieurs vérifiés</span></>
              ) : (
                <>Connecting clients with<br /><span>verified technicians and engineers</span></>
              )}
            </h1>

            <p>{t.heroDesc}</p>

            <form className="bm-main-search" onSubmit={submitGlobalSearch}>
              <div className="bm-main-search-field">
                <input
                  className="bm-main-search-input"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
                {!isSearchFocused && !searchQuery && (
                  <div className="bm-main-search-marquee">
                    <span>
                      What service do you offer or are you looking for? e.g Electrical installation, Web development, Plumbing, Solar systems, CCTV installation, Mobile apps
                    </span>
                  </div>
                )}
              </div>

              <select
                value={searchCategory}
                onChange={(event) => setSearchCategory(event.target.value)}
              >
                <option value="">{t.allCategories}</option>
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>{c.name}</option>
                ))}
              </select>

              <select
                value={searchLocation}
                onChange={(event) => setSearchLocation(event.target.value)}
              >
                <option value="Global">Global</option>
                <option value="Nigeria">Nigeria</option>
                <option value="Rwanda">Rwanda</option>
                <option value="Kenya">Kenya</option>
                <option value="Ghana">Ghana</option>
                <option value="South Africa">South Africa</option>
                <option value="Ivory Coast">Ivory Coast</option>
                <option value="Cameroon">Cameroon</option>
              </select>

              <button type="submit">{t.btnSearch}</button>
            </form>

            <div className="bm-main-cta">
              <Link href="/signup" className="bm-main-cta-provider">{t.btnSignUpProvider}</Link>
              <Link href={postTaskHref} className="bm-main-cta-post">{t.btnPostService}</Link>
            </div>
          </div>

          <div className="bm-main-live-box">
            <h4>{t.liveTasksTitle}</h4>
            <div className="bm-main-task-window">
              <div
                className="bm-main-task-track"
                style={{ transform: `translateY(-${liveTaskIndex * 85}px)` }}
              >
                {liveTasksData?.results?.length > 0 ? (
                  [...liveTasksData.results, ...liveTasksData.results].map((task: any, i: number) => (
                    <div className="bm-main-task" key={`${task.id}-${i}`}>
                      <div className="bm-main-task-top">
                        <div className="bm-main-task-user">
                          <img src={`https://ui-avatars.com/api/?name=${task.client?.first_name || 'U'}&background=random`} alt="User" />
                          <div className="bm-main-task-title">{task.title}</div>
                        </div>
                        <a href="#" onClick={(e) => handleApplyClick(e, task.id)} className="bm-main-task-apply" style={{ textDecoration: 'none' }}>{lang === 'fr' ? 'Postuler' : 'Apply'}</a>
                      </div>
                      <div className="bm-main-task-meta">📍 {task.location || 'Remote'} • {task.budget_type === 'fixed' ? (lang === 'fr' ? 'Fixe' : 'Fixed') : (lang === 'fr' ? 'Horaire' : 'Hourly')}</div>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: "20px", color: "#64748b" }}>
                    {liveTasksError ? liveTasksError : liveTasksData ? t.liveTasksNoTasks : t.liveTasksLoading}
                  </div>
                )}
              </div>
            </div>
            <div className="bm-main-live-cta">
              <Link href="/find-tasks">{t.liveTasksCta}</Link>
            </div>
          </div>
        </div>
      </section>



      <section className="bm-stats-section">
        <div className="bm-stats-inner">
          <div className="bm-stats-header">
            <h2>{t.statsTitle}</h2>
            <p>{t.statsDesc}</p>
          </div>
          <div className="bm-stats-grid">
            <div className="bm-stat-card">
              <strong><CountUpNumber end={stats.registered_users} suffix="+" /></strong>
              <span>{t.statUsers}</span>
            </div>
            <div className="bm-stat-card">
              <strong><CountUpNumber end={stats.verified_technicians} suffix="+" /></strong>
              <span>{t.statTechs}</span>
            </div>
            <div className="bm-stat-card">
              <strong><CountUpNumber end={stats.verified_companies} suffix="+" /></strong>
              <span>{t.statComps}</span>
            </div>
            <div className="bm-stat-card">
              <strong><CountUpNumber end={stats.tasks_posted_monthly} suffix="+" /></strong>
              <span>{t.statMonthly}</span>
            </div>
            <div className="bm-stat-card">
              <strong><CountUpNumber end={stats.successful_completion} suffix="%" /></strong>
              <span>{t.statCompletion}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="bm-ftx-root">
        <div className="bm-ftx-container">
          <div className="bm-ftx-header">
            <h2 className="bm-ftx-header-title">{t.ftxTitle}</h2>
          </div>

          <div className="bm-ftx-grid">
            {prosLoading ? (
              <div style={{ padding: "20px", color: "#64748b" }}>{t.prosLoading}</div>
            ) : prosData && prosData.length > 0 ? (
              prosData.slice(0, 3).map((pro: any) => (
                <div className="bm-ftx-card" key={pro.id}>
                  <div className="bm-ftx-profile">
                    <img className="bm-ftx-avatar" src={pro.avatar || `https://ui-avatars.com/api/?name=${pro.first_name || 'U'}&background=random`} alt={pro.first_name} />
                    <div>
                      <div className="bm-ftx-name">{pro.first_name} {pro.last_name}</div>
                      <div className="bm-ftx-role">{pro.title || t.ftxRoleTech}</div>
                    </div>
                  </div>
                  <div className="bm-ftx-rating">
                    <span className="bm-ftx-stars">★★★★★</span><span>({pro.average_rating || "4.9"})</span>
                  </div>
                  <div className="bm-ftx-meta">📍 {pro.city || pro.country || "Remote"} • {t.ftxMeta}</div>
                  <div className="bm-ftx-description" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {pro.bio || "Professional technical services and support."}
                  </div>
                  <div className="bm-ftx-actions">
                    <Link href={`/profile/${pro.id}`} className="bm-ftx-btn bm-ftx-btn-view">{t.ftxBtnView}</Link>
                    <Link href={isLoggedIn ? `/dashboard/client/tasks/create?invite=${pro.id}` : "/login"} className="bm-ftx-btn bm-ftx-btn-hire">{t.ftxBtnHire}</Link>
                  </div>
                </div>
              ))
            ) : (
               <div style={{ padding: "20px", color: "#64748b" }}>{t.prosNoTasks}</div>
            )}
          </div>

          <div className="bm-ftx-footer">
            <Link href="/technicians">{t.ftxFooterLink}</Link>
          </div>
        </div>
      </section>

      <section className="bm-enterprise-root">
        <div className="bm-enterprise-container">
          <div className="bm-enterprise-header">
            <h2 className="bm-enterprise-header-title">{t.entHeaderTitle}</h2>
            <p className="bm-enterprise-header-subtitle">{t.entHeaderSubtitle}</p>
          </div>

          <div className="bm-enterprise-grid">
            {companiesLoading ? (
              <div style={{ padding: "20px", color: "#94a3b8" }}>{t.companiesLoading}</div>
            ) : companiesData && companiesData.length > 0 ? (
              companiesData.slice(0, 3).map((company: any) => (
                <div className="bm-enterprise-card" key={company.id}>
                  <div className="bm-enterprise-profile">
                    <img className="bm-enterprise-avatar" src={company.logo || `https://ui-avatars.com/api/?name=${company.company_name || 'C'}&background=random`} alt={company.company_name} />
                    <div>
                      <div className="bm-enterprise-name">{company.company_name}</div>
                      <div className="bm-enterprise-role">{t.entRoleComp}</div>
                    </div>
                  </div>
                  <div className="bm-enterprise-rating">
                    <span className="bm-enterprise-stars">⭐⭐⭐⭐⭐</span><span>({company.average_rating || "4.8"})</span>
                  </div>
                  <div className="bm-enterprise-meta">📍 {company.city || company.country || "Multiple Locations"} • {company.projects_count || 0} {lang === 'fr' ? 'Projets' : 'Projects'}</div>
                  <div className="bm-enterprise-description" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {company.description || t.entDescFallback}
                  </div>
                  <div className="bm-enterprise-actions">
                    <Link href={`/search?type=company&q=${company.company_name}`} className="bm-enterprise-btn bm-enterprise-btn-view">{t.entBtnView}</Link>
                    <Link href={isLoggedIn ? `/dashboard/client/tasks/create?invite_company=${company.id}` : "/login"} className="bm-enterprise-btn bm-enterprise-btn-hire">{t.entBtnHire}</Link>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: "20px", color: "#94a3b8" }}>{t.companiesNoTasks}</div>
            )}
          </div>
          <div style={{ textAlign: "center", marginTop: "40px" }}>
            <Link href="/search?type=company" className="bm-enterprise-explore">
              {t.entExplore}
            </Link>
          </div>
        </div>
      </section>

      <section id="categories" className="section">
        <div className="container">
          <div className="section-header-flex">
            <div className="section-header section-header-left">
              <div className="eyebrow">{t.catEyebrow}</div>
              <h2 className="section-title">{t.catTitle}</h2>
              <p className="section-copy">{t.catDesc}</p>
            </div>
            <Link href="/search" className="btn btn-secondary" data-media-type="banani-button">
              {t.catViewAll}
              <div
                className="icon-wrap"
                style={{ fontSize: "16px", width: "16px", height: "16px" }}
              >
                <iconify-icon icon="lucide:arrow-right"></iconify-icon>
              </div>
            </Link>
          </div>

          <div className="categories-grid">
            {categoriesLoading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="card category-card">
                    <div className="category-icon">
                      <SkeletonBlock style={{ width: 40, height: 40, borderRadius: 8 }} />
                    </div>
                    <SkeletonBlock style={{ width: "60%", height: 18, marginTop: 12 }} />
                    <SkeletonBlock style={{ width: "100%", height: 12, marginTop: 8 }} />
                    <SkeletonBlock style={{ width: "40%", height: 10, marginTop: 8 }} />
                  </div>
                ))
              : categories.length === 0
                ? (
                  <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "32px 0", color: "#64748b" }}>
                    <p>{t.catNone}</p>
                  </div>
                )
                : categories.map((category) => {
                    const card = (
                      <>
                        <div className="category-icon">
                          <div className="icon-wrap" style={{ fontSize: "28px" }}>
                            <iconify-icon icon={ICON_BY_KEY[category.slug] || category.icon || ICON_BY_KEY.default}></iconify-icon>
                          </div>
                        </div>
                        <h3 className="category-title">{category.name}</h3>
                        <p className="category-copy">
                          {t.catExplorePrefix} {lang === 'fr' ? category.name : category.name.toLowerCase()} {t.catExploreSuffix}
                        </p>
                        <div className="category-count">{t.catBrowse}</div>
                      </>
                    );

                    if (category.slug === "electrical") {
                      return (
                        <Link
                          key={category.slug}
                          href={`/categories/${category.slug}`}
                          className="card category-card"
                          data-media-type="banani-button"
                        >
                          {card}
                        </Link>
                      );
                    }

                    return (
                      <Link
                        key={category.slug}
                        href={`/search?category=${category.slug}`}
                        className="card category-card"
                        data-media-type="banani-button"
                      >
                        {card}
                      </Link>
                    );
                  })}
          </div>
        </div>
      </section>

      <section id="benefits" style={{ background: "#fdfdfd", padding: "100px 0", position: "relative", overflow: "hidden" }}>
        <style>{`
          .mb-header { text-align: center; max-width: 800px; margin: 0 auto 60px; position: relative; z-index: 2; opacity: 0; transform: translateY(20px); transition: opacity 0.8s, transform 0.8s; }
          #benefits.animate-in .mb-header { opacity: 1; transform: translateY(0); }
          .mb-eyebrow { font-size: 14px; text-transform: uppercase; letter-spacing: 2px; color: #ff4500; margin-bottom: 16px; font-weight: 700; background: rgba(255,69,0,0.1); padding: 6px 16px; border-radius: 20px; display: inline-block; }
          .mb-title { font-family: 'Playfair Display', serif; font-size: 48px; color: #0a1628; margin-bottom: 24px; font-weight: 800; line-height: 1.2; }
          .mb-copy { font-size: 18px; color: #4a5568; line-height: 1.6; }
          
          /* 3D Perspective Grid */
          .mb-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; position: relative; z-index: 2; max-width: 1280px; margin: 0 auto; padding: 0 32px; perspective: 1500px; }
          
          /* 3D Flip In Animation */
          @keyframes flipIn3D {
            0% { opacity: 0; transform: rotateY(-70deg) scale(0.85) translateZ(-50px); }
            60% { opacity: 1; transform: rotateY(8deg) scale(1.02) translateZ(10px); }
            100% { opacity: 1; transform: rotateY(0deg) scale(1) translateZ(0); }
          }
          
          .mb-card { background: #0F2C4A; border-radius: 28px; padding: 44px 36px 36px; color: #fff; display: flex; flex-direction: column; transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.4s, background 0.4s; position: relative; overflow: hidden; border: 1px solid rgba(255,255,255,0.08); height: 510px; opacity: 0; transform-style: preserve-3d; transform-origin: left center; }
          
          #benefits.animate-in .mb-card { animation: flipIn3D 0.9s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
          #benefits.animate-in .mb-card:nth-child(1) { animation-delay: 0.1s; }
          #benefits.animate-in .mb-card:nth-child(2) { animation-delay: 0.25s; }
          #benefits.animate-in .mb-card:nth-child(3) { animation-delay: 0.4s; }
          #benefits.animate-in .mb-card:nth-child(4) { animation-delay: 0.55s; }
          
          /* Premium Hover Effects */
          .mb-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: radial-gradient(circle at top right, rgba(255,69,0,0.15), transparent 60%); opacity: 0; transition: opacity 0.5s; pointer-events: none; z-index: 1; }
          .mb-card:hover { transform: translateY(-12px) scale(1.02); box-shadow: 0 30px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,69,0,0.3); }
          .mb-card:hover::before { opacity: 1; }
          
          /* Card Header */
          .mb-card-header { 
            position: relative; 
            z-index: 2; 
            transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
            transform: translateY(130px);
          }
          .mb-card:hover .mb-card-header {
            transform: translateY(0);
          }
          
          .mb-card-title { 
            font-family: 'Playfair Display', serif; 
            font-size: 34px; 
            font-weight: 700; 
            margin: 0; 
            line-height: 1.2; 
            transition: all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1); 
            text-align: center;
            margin-top: 110px; /* Space for the absolute center icon */
          }
          .mb-card:hover .mb-card-title { 
            text-align: left;
            margin-top: 0;
            padding-right: 50px;
          }
          
          .mb-card-icon { 
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            font-size: 80px; 
            color: #fff; 
            transition: all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1); 
          }
          .mb-card:hover .mb-card-icon { 
            left: 100%;
            transform: translateX(-100%) rotate(5deg);
            font-size: 34px; 
            color: #ff4500; 
          }
          
          /* Card Content */
          .mb-hidden-content { 
            position: relative; 
            z-index: 2; 
            opacity: 0;
            transform: translateY(40px);
            transition: all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
            pointer-events: none;
            margin-top: 30px;
          }
          .mb-card:hover .mb-hidden-content {
            opacity: 1;
            transform: translateY(0);
            pointer-events: auto;
          }
          
          .mb-card-content { color: #b8c8d8; font-size: 16px; line-height: 1.7; transition: color 0.3s; }
          .mb-card:hover .mb-card-content { color: #fff; }
          
          /* Faint Icons (Bottom Left) */
          .mb-faint-icon { font-size: 140px; color: rgba(255,255,255,0.02); position: absolute; bottom: 20px; left: 20px; pointer-events: none; z-index: 1; transition: all 0.8s cubic-bezier(0.2,0.8,0.2,1); opacity: 0; transform: translateY(20px); }
          .mb-card:hover .mb-faint-icon { color: rgba(255,255,255,0.06); transform: translateY(0); opacity: 1; }
          
          /* Circle Progress */
          @keyframes fillCircle { from { background: conic-gradient(#ff4500 0% 0%, rgba(255,255,255,0.1) 0% 100%); } to { background: conic-gradient(#ff4500 0% 96%, rgba(255,255,255,0.1) 96% 100%); } }
          .mb-progress-circle { width: 160px; height: 160px; border-radius: 50%; background: conic-gradient(rgba(255,255,255,0.1) 0% 100%); margin: 0 auto 30px; display: flex; align-items: center; justify-content: center; }
          .mb-card:hover .mb-progress-circle { animation: fillCircle 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
          .mb-progress-circle-inner { width: 140px; height: 140px; border-radius: 50%; background: #001F3F; display: flex; flex-direction: column; align-items: center; justify-content: center; transition: background 0.5s; }
          .mb-card:hover .mb-progress-circle-inner { background: #0F2C4A; }
          .mb-progress-val { font-size: 36px; font-weight: 800; color: #fff; line-height: 1; }
          .mb-progress-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #ffaa00; margin-top: 10px; }
          
          /* Horizontal Progress */
          @keyframes growBar { from { width: 0%; } to { width: 99%; } }
          .mb-progress-bar-container { height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; margin: 10px 0 30px; overflow: hidden; }
          .mb-progress-bar-fill { height: 100%; background: linear-gradient(90deg, #ff4500, #ff8c00); border-radius: 3px; width: 0%; }
          .mb-card:hover .mb-progress-bar-fill { animation: growBar 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
          
          @media (max-width: 1024px) {
            .mb-grid { grid-template-columns: repeat(2, 1fr); }
          }
          @media (max-width: 640px) {
            .mb-grid { grid-template-columns: 1fr; }
            .mb-card { height: 420px; }
          }
        `}</style>
        
        {/* Background SVGs (Matsols style wavy lines) */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, pointerEvents: "none", opacity: 0.8 }}>
          <svg viewBox="0 0 1440 800" fill="none" style={{ position: "absolute", width: "120%", height: "auto", top: "-10%", left: "-10%" }}>
            <path d="M-100 300 C 400 -100, 800 600, 1500 200" stroke="#dcb4a0" strokeWidth="2" strokeOpacity="0.4" fill="none" strokeLinecap="round" />
            <path d="M-100 400 C 500 -50, 1000 800, 1500 400" stroke="#dcb4a0" strokeWidth="8" strokeOpacity="0.3" fill="none" strokeLinecap="round" />
            <path d="M-100 700 C 600 300, 1200 900, 1500 100" stroke="#dcb4a0" strokeWidth="12" strokeOpacity="0.2" fill="none" strokeLinecap="round" />
          </svg>
        </div>

        <div className="mb-header">
          <div className="mb-eyebrow">{t.hiwEyebrow}</div>
          <h2 className="mb-title">{t.hiwTitle}</h2>
          <p className="mb-copy">
            {t.hiwDesc}
          </p>
        </div>

        <div className="mb-grid">
          {/* Card 1 */}
          <div className="mb-card">
            <div className="mb-card-header">
              <h3 className="mb-card-title">{lang === 'fr' ? <>Professionnels<br/>Vérifiés</> : <>Verified<br/>Professionals</>}</h3>
              <div className="mb-card-icon"><iconify-icon icon="lucide:globe"></iconify-icon></div>
            </div>
            <div className="mb-hidden-content">
              <p className="mb-card-content">
                {t.hiwCard1Desc}
              </p>
            </div>
            <div className="mb-faint-icon"><iconify-icon icon="lucide:globe"></iconify-icon></div>
          </div>

          {/* Card 2 */}
          <div className="mb-card">
            <div className="mb-card-header">
              <h3 className="mb-card-title">{t.hiwCard2Title}</h3>
              <div className="mb-card-icon"><iconify-icon icon="lucide:line-chart"></iconify-icon></div>
            </div>
            <div className="mb-hidden-content">
              <div className="mb-progress-circle">
                <div className="mb-progress-circle-inner">
                  <div className="mb-progress-val">96%</div>
                  <div className="mb-progress-label">SATISFACTION</div>
                </div>
              </div>
              <p className="mb-card-content">
                {t.hiwCard2Desc}
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="mb-card">
            <div className="mb-card-header">
              <h3 className="mb-card-title">{lang === 'fr' ? <>Paiements<br/>Sécurisés</> : <>Secure<br/>Payments</>}</h3>
              <div className="mb-card-icon"><iconify-icon icon="lucide:shield"></iconify-icon></div>
            </div>
            <div className="mb-hidden-content">
              <p className="mb-card-content">
                {t.hiwCard3Desc}
              </p>
            </div>
            <div className="mb-faint-icon"><iconify-icon icon="lucide:fingerprint"></iconify-icon></div>
          </div>

          {/* Card 4 */}
          <div className="mb-card">
            <div className="mb-card-header">
              <h3 className="mb-card-title">{lang === 'fr' ? <>Parcours<br/>sur Mesure</> : <>Tailored<br/>Pathways</>}</h3>
              <div className="mb-card-icon"><iconify-icon icon="lucide:git-pull-request"></iconify-icon></div>
            </div>
            <div className="mb-hidden-content">
              <div className="mb-progress-bar-container">
                <div className="mb-progress-bar-fill"></div>
              </div>
              <p className="mb-card-content">
                {t.hiwCard4Desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="promo-banner" className="section" style={{ paddingBottom: 0 }}>
        <div className="container">
          <div className="promo-banner-container">
            <div className="promo-banner-grid">
              <div className="promo-banner-left">
                <div className="promo-banner-brand">
                  Boulot Man <span>Pro.</span>
                </div>
                <h2 className="promo-banner-title">{t.promoTitle}</h2>
                <ul className="promo-banner-list">
                  <li>{t.promoList1}</li>
                  <li>{t.promoList2}</li>
                  <li>{t.promoList3}</li>
                </ul>
                <Link href="/search" className="promo-banner-btn" data-media-type="banani-button">{t.promoBtn}</Link>
                <div className="promo-banner-guarantee">
                  <iconify-icon icon="lucide:shield-check" style={{ fontSize: "18px", color: "#fff" }}></iconify-icon>
                  {t.promoGuarantee}
                </div>
              </div>
              <div className="promo-banner-right">
                <div className="promo-visuals">
                  <div className="promo-card promo-card-1">
                    <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" alt="Professional 1" />
                    <div className="promo-card-info">
                      <h4>Ngozi O.</h4>
                      <p>IT Infrastructure</p>
                    </div>
                  </div>
                  <div className="promo-card promo-card-2">
                    <img src="https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" alt="Professional 2" />
                    <div className="promo-card-info">
                      <h4>Adebayo A.</h4>
                      <p>Lead Engineer</p>
                    </div>
                  </div>
                  <div className="promo-card promo-card-3">
                    <img src="https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" alt="Professional 3" />
                    <div className="promo-card-info">
                      <h4>Fatima I.</h4>
                      <p>Systems Architect</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ WHY CHOOSE US (MATSOLS STYLE) ══════════ */}
      <section id="why-choose-us" style={{ background: "#001F3F", color: "#fff", padding: "100px 0", position: "relative", overflow: "hidden" }}>
        {/* Top-Right Background Circles */}
        <div style={{ position: "absolute", top: "-50px", right: "-20px", width: "250px", height: "250px", borderRadius: "50%", background: "rgba(255, 69, 0, 0.05)", border: "2px solid #ff4500", zIndex: 0, pointerEvents: "none" }}></div>
        <div style={{ position: "absolute", top: "-100px", right: "-100px", width: "350px", height: "350px", borderRadius: "50%", background: "rgba(255, 69, 0, 0.02)", border: "2px solid rgba(255, 69, 0, 0.5)", zIndex: 0, pointerEvents: "none" }}></div>

        {/* Bottom Background Circles with Watermark */}
        <div style={{ position: "absolute", bottom: "-100px", left: "-80px", width: "350px", height: "350px", borderRadius: "50%", background: "rgba(255, 69, 0, 0.02)", border: "2px solid rgba(255, 69, 0, 0.5)", zIndex: 0, pointerEvents: "none", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
          <span style={{ fontSize: "34px", fontWeight: "900", color: "rgba(255, 255, 255, 0.05)", letterSpacing: "4px", whiteSpace: "nowrap" }}>BOULOT MAN</span>
        </div>
        <div style={{ position: "absolute", bottom: "-50px", right: "-50px", width: "250px", height: "250px", borderRadius: "50%", background: "rgba(255, 69, 0, 0.05)", border: "2px solid #ff4500", zIndex: 0, pointerEvents: "none", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
          <span style={{ fontSize: "24px", fontWeight: "900", color: "rgba(255, 255, 255, 0.1)", letterSpacing: "3px", whiteSpace: "nowrap" }}>BOULOT MAN</span>
        </div>

        {/* Wavy background SVGs and abstract floating shapes */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, pointerEvents: "none", opacity: 0.7 }}>
          <svg viewBox="0 0 1440 800" fill="none" style={{ position: "absolute", width: "150%", height: "auto", top: "-10%", left: "-25%", transform: "rotate(-5deg)" }}>
            {/* Wavy Lines */}
            <path d="M0 400 C 400 200, 800 600, 1440 400" stroke="#ff4500" strokeWidth="6" strokeOpacity="0.15" fill="none" strokeLinecap="round" />
            <path d="M0 500 C 500 200, 1000 800, 1440 600" stroke="#ff4500" strokeWidth="3" strokeOpacity="0.15" fill="none" strokeLinecap="round" />
            <path d="M0 600 C 600 300, 1200 700, 1440 300" stroke="#cc3700" strokeWidth="10" strokeOpacity="0.1" fill="none" strokeLinecap="round" />
            <path d="M200 200 C 500 800, 900 100, 1440 500" stroke="#ffaa00" strokeWidth="4" strokeOpacity="0.08" fill="none" strokeLinecap="round" />
            
            {/* Abstract Hand-drawn Shapes */}
            {/* Top Left Triangle with dot */}
            <g transform="translate(300, 250) rotate(15)">
              <path d="M 0,-20 L 25,20 L -25,20 Z" stroke="#ffaa00" strokeWidth="2" strokeOpacity="0.3" strokeLinejoin="round" />
              <circle cx="0" cy="8" r="3" fill="#ffaa00" fillOpacity="0.4" />
            </g>
            
            {/* Center Top Triangle with dot */}
            <g transform="translate(850, 280) rotate(-20)">
              <path d="M 0,-25 L 30,25 L -30,25 Z" stroke="#ffaa00" strokeWidth="2" strokeOpacity="0.3" strokeLinejoin="round" />
              <circle cx="0" cy="10" r="4" fill="#ffaa00" fillOpacity="0.4" />
            </g>

            {/* Floating Dots/Circles */}
            <circle cx="200" cy="150" r="4" fill="#ff4500" fillOpacity="0.3" />
            <circle cx="1100" cy="120" r="6" fill="#ffaa00" fillOpacity="0.2" />
            <circle cx="1300" cy="500" r="5" fill="#ff4500" fillOpacity="0.3" />
            <circle cx="450" cy="650" r="7" stroke="#ffaa00" strokeWidth="2" strokeOpacity="0.3" fill="none" />
            <circle cx="750" cy="180" r="5" stroke="#ff4500" strokeWidth="2" strokeOpacity="0.3" fill="none" />
            
            {/* Squiggly line right side */}
            <path d="M 1200 300 Q 1230 350, 1200 400 T 1200 500" stroke="#ff4500" strokeWidth="2" strokeOpacity="0.2" fill="none" strokeLinecap="round" />
            
            {/* Crosses */}
            <g transform="translate(600, 600)" stroke="#ff4500" strokeWidth="2" strokeOpacity="0.3" strokeLinecap="round">
              <line x1="-10" y1="-10" x2="10" y2="10" />
              <line x1="10" y1="-10" x2="-10" y2="10" />
            </g>
          </svg>
        </div>

        <style dangerouslySetInnerHTML={{ __html: `
          .wcu-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 24px;
            position: relative;
            z-index: 1;
            display: grid;
            grid-template-columns: 1fr 1.2fr;
            gap: 80px;
            align-items: center;
          }
          .wcu-left {
            display: flex;
            flex-direction: column;
            gap: 24px;
          }
          .wcu-title {
            font-size: 56px;
            font-weight: 800;
            line-height: 1.1;
            font-family: 'Playfair Display', 'Times New Roman', Times, serif;
            color: #fff;
          }
          .wcu-desc {
            font-size: 18px;
            line-height: 1.6;
            color: rgba(255,255,255,0.75);
            max-width: 440px;
          }
          .wcu-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 16px 32px;
            background: #ff4500;
            color: #fff;
            border-radius: 999px;
            font-weight: 700;
            font-size: 16px;
            text-decoration: none;
            width: fit-content;
            transition: all 0.2s;
            margin-top: 16px;
          }
          .wcu-btn:hover {
            transform: scale(1.05);
            background: #e03d00;
          }
          .wcu-image-circle {
            width: 380px;
            height: 380px;
            border-radius: 50%;
            overflow: hidden;
            border: 4px solid rgba(255,69,0,0.3);
            margin-top: 40px;
            position: relative;
          }
          .wcu-image-circle img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          .wcu-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 24px;
          }
          .wcu-card {
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(255,255,255,0.05);
            border-radius: 24px;
            height: 280px;
            position: relative;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            padding: 24px;
            transition: transform 0.3s, border-color 0.3s;
          }
          .wcu-card:hover {
            transform: scale(1.05) translateY(-5px);
            border-color: rgba(255,69,0,0.6);
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            z-index: 10;
          }
          .wcu-card-bg {
            position: absolute;
            inset: 0;
            z-index: 0;
          }
          .wcu-card-bg img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            opacity: 0.75;
            transition: opacity 0.3s, transform 0.5s;
          }
          .wcu-card:hover .wcu-card-bg img {
            opacity: 1;
            transform: scale(1.05);
          }
          .wcu-card-gradient {
            position: absolute;
            inset: 0;
            background: linear-gradient(to top, rgba(15,44,74,0.95) 0%, rgba(15,44,74,0.0) 80%);
            z-index: 1;
          }
          .wcu-card-content {
            position: relative;
            z-index: 2;
          }
          .wcu-card-label {
            color: #ff4500;
            font-size: 11px;
            font-weight: 800;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            margin-bottom: 12px;
          }
          .wcu-card-title {
            color: #fff;
            font-size: 22px;
            font-weight: 700;
            margin-bottom: 8px;
            font-family: 'Space Grotesk', sans-serif;
          }
          .wcu-card-desc {
            color: rgba(255,255,255,0.7);
            font-size: 14px;
            line-height: 1.5;
          }
          /* Layout adjustments for masonry-like stagger */
          .wcu-col-1 {
            margin-top: 60px;
          }
          
          @media (max-width: 1024px) {
            .wcu-container {
              grid-template-columns: 1fr;
              gap: 40px;
            }
            .wcu-image-circle {
              width: 300px;
              height: 300px;
              margin: 24px auto 0;
            }
            .wcu-left {
              align-items: center;
              text-align: center;
            }
          }
          @media (max-width: 640px) {
            .wcu-grid {
              grid-template-columns: 1fr;
            }
            .wcu-col-1 {
              margin-top: 0;
            }
          }
        `}} />

        <div className="wcu-container">
          <div className="wcu-left">
            <h2 className="wcu-title">Why Choose ProMatch?</h2>
            <p className="wcu-desc">
              We don't just find you a service provider—we deliver peace of mind. The principles that drive our excellence and innovation ensure your success every step of the way.
            </p>
            <Link href="/search" className="wcu-btn">
              Start Your Journey
            </Link>
            
            <div className="wcu-image-circle">
              <img src="/black_african_professional_male.png" alt="African professional" />
            </div>
          </div>

          <div className="wcu-grid">
            <div className="wcu-col wcu-col-1" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="wcu-card">
                <div className="wcu-card-bg">
                  <img src="/hiw-step1.png" alt="Strategy" />
                </div>
                <div className="wcu-card-gradient"></div>
                <div className="wcu-card-content">
                  <div className="wcu-card-label">STRATEGY</div>
                  <h3 className="wcu-card-title">Personalized Strategy</h3>
                  <p className="wcu-card-desc">Tailored service roadmaps, not just generic worker lists.</p>
                </div>
              </div>

              <div className="wcu-card">
                <div className="wcu-card-bg">
                  <img src="/hiw-step3.png" alt="Network" />
                </div>
                <div className="wcu-card-gradient"></div>
                <div className="wcu-card-content">
                  <div className="wcu-card-label">NETWORK</div>
                  <h3 className="wcu-card-title">Global Network</h3>
                  <p className="wcu-card-desc">Direct partnerships with top-tier verified professionals.</p>
                </div>
              </div>
            </div>

            <div className="wcu-col wcu-col-2" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="wcu-card">
                <div className="wcu-card-bg">
                  <img src="/hiw-step2.png" alt="Support" />
                </div>
                <div className="wcu-card-gradient"></div>
                <div className="wcu-card-content">
                  <div className="wcu-card-label">SUPPORT</div>
                  <h3 className="wcu-card-title">End-to-End Support</h3>
                  <p className="wcu-card-desc">From request to completion, we handle it all.</p>
                </div>
              </div>

              <div className="wcu-card">
                <div className="wcu-card-bg">
                  <img src="/hiw-step4.png" alt="Funding" />
                </div>
                <div className="wcu-card-gradient"></div>
                <div className="wcu-card-content">
                  <div className="wcu-card-label">SECURITY</div>
                  <h3 className="wcu-card-title">Secure Escrow Payments</h3>
                  <p className="wcu-card-desc">Maximized security through our verified escrow system.</p>
                </div>
              </div>
              
              <div className="wcu-card">
                <div className="wcu-card-bg">
                  <img src="/black_african_professional.png" alt="Legal" />
                </div>
                <div className="wcu-card-gradient"></div>
                <div className="wcu-card-content">
                  <div className="wcu-card-label">VERIFIED</div>
                  <h3 className="wcu-card-title">100% Guaranteed Success</h3>
                  <p className="wcu-card-desc">99% approval rate with our compliance and vetting team.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="companies" className="section section-muted">
        <div className="container">
          <div className="section-header-flex">
            <div className="section-header section-header-left">
              <div className="eyebrow">Featured companies</div>
              <h2 className="section-title">
                Trusted business teams for larger jobs
              </h2>
              <p className="section-copy">
                Compare established service companies for recurring work,
                office support, and large-scale projects.
              </p>
            </div>
            <Link href="/search" className="btn btn-secondary" data-media-type="banani-button">
              {t.catViewAll} companies
              <div
                className="icon-wrap"
                style={{ fontSize: "16px", width: "16px", height: "16px" }}
              >
                <iconify-icon icon="lucide:arrow-right"></iconify-icon>
              </div>
            </Link>
          </div>

          <div className="company-grid">
            {companiesLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="card company-card">
                  <div className="company-head">
                    <div className="company-mark">
                      <SkeletonBlock style={{ width: 40, height: 40, borderRadius: 8 }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <SkeletonBlock style={{ width: "60%", height: 16, marginBottom: 8 }} />
                      <SkeletonBlock style={{ width: "40%", height: 12 }} />
                    </div>
                  </div>
                  <SkeletonBlock style={{ width: "100%", height: 12, marginTop: 12 }} />
                  <SkeletonBlock style={{ width: "80%", height: 12, marginTop: 6 }} />
                  <div className="company-stats" style={{ marginTop: 16 }}>
                    <SkeletonStat />
                    <SkeletonStat />
                    <SkeletonStat />
                  </div>
                </div>
              ))
            ) : companies.length === 0 ? (
              <div style={{ gridColumn: "1 / -1", padding: "32px 0", textAlign: "center", color: "#64748b" }}>
                <p>No companies available yet.</p>
              </div>
            ) : (
              companies.map((company) => (
                <Link
                  key={company.id}
                  href={`/search?type=company`}
                  className="card company-card"
                  data-media-type="banani-button"
                >
                  <div className="company-head">
                    <div className="company-mark">
                      <iconify-icon icon="lucide:building-2" style={{ fontSize: "22px", color: "#ffffff" }}></iconify-icon>
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 className="company-name">{company.company_name || ""}</h3>
                      <p className="company-loc">{company.city || company.country || ""}</p>
                    </div>
                  </div>
                  <p className="company-desc">
                    {company.description?.slice(0, 120) || ""}
                  </p>
                  <div className="company-stats" style={{ marginTop: 16 }}>
                    <div className="company-stat">
                      <strong>{company.projects_count ?? 0}</strong>
                      <span>Projects</span>
                    </div>
                    <div className="company-stat">
                      <strong>{company.services_count ?? 0}</strong>
                      <span>Services</span>
                    </div>
                    <div className="company-stat">
                      <strong>{company.review_count ?? 0}</strong>
                      <span>Reviews</span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ══════════ HOW IT WORKS ══════════ */}
      <section id="how-it-works" style={{ background: "#001F3F", color: "#fff", padding: "0", overflow: "visible", position: "relative" }}>
        <style dangerouslySetInnerHTML={{ __html: `
          /* Orange progress line */
          @keyframes hiwLine {
            from { width: 0; }
            to   { width: 100%; }
          }
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(40px); }
            to   { opacity: 1; transform: translateY(0); }
          }

          .hiw-wrapper { max-width: 1280px; margin: 0 auto; padding: 0 40px; }

          /* Sticky progress bar at top */
          .hiw-progress-bar {
            position: relative;
            height: 5px;
            background: rgba(255,255,255,0.08);
            overflow: hidden;
          }
          .hiw-progress-fill {
            height: 100%;
            width: 0;
            background: linear-gradient(90deg, #ff4500, #ff7c3a, #ff4500);
            background-size: 200% 100%;
            animation: hiwLine 2.8s cubic-bezier(.4,0,.2,1) 0.3s forwards;
          }

          /* Header area */
          .hiw-header {
            text-align: center;
            padding: 80px 40px 60px;
            max-width: 1280px;
            margin: 0 auto;
          }
          .hiw-eyebrow {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 8px 18px;
            border-radius: 999px;
            background: rgba(255,69,0,0.18);
            color: #ff7c3a;
            font-size: 13px;
            font-weight: 700;
            letter-spacing: 0.06em;
            text-transform: uppercase;
            margin-bottom: 20px;
            font-family: 'Space Grotesk', sans-serif;
          }
          .hiw-main-title {
            font-size: 48px;
            font-weight: 800;
            line-height: 1.1;
            letter-spacing: -0.03em;
            color: #fff;
            margin: 0 0 16px;
            font-family: 'Space Grotesk', sans-serif;
          }
          .hiw-main-title span { color: #ff7c3a; }
          .hiw-main-copy {
            font-size: 17px;
            color: rgba(255,255,255,0.6);
            line-height: 1.65;
            margin: 0;
            font-family: 'Space Grotesk', sans-serif;
          }

          /* Individual step row */
          .hiw-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            align-items: center;
            gap: 0;
            min-height: 520px;
            position: relative;
            opacity: 0;
            animation: fadeUp 0.8s cubic-bezier(.34,1.2,.64,1) forwards;
          }
          .hiw-row:nth-child(2) { animation-delay: 0.1s; }
          .hiw-row:nth-child(3) { animation-delay: 0.25s; }
          .hiw-row:nth-child(4) { animation-delay: 0.4s; }
          .hiw-row:nth-child(5) { animation-delay: 0.55s; }

          /* Text side */
          .hiw-text {
            padding: 64px 56px;
            position: relative;
            z-index: 1;
          }
          .hiw-step-label {
            font-size: 13px;
            font-weight: 700;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            color: #ff7c3a;
            margin-bottom: 12px;
            font-family: 'Space Grotesk', sans-serif;
          }
          .hiw-step-title {
            font-size: 36px;
            font-weight: 800;
            line-height: 1.12;
            letter-spacing: -0.02em;
            color: #fff;
            margin: 0 0 16px;
            font-family: 'Space Grotesk', sans-serif;
          }
          .hiw-step-copy {
            font-size: 16px;
            line-height: 1.7;
            color: rgba(255,255,255,0.65);
            margin: 0 0 28px;
            font-family: 'Space Grotesk', sans-serif;
          }
          .hiw-step-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 14px 28px;
            background: #ff4500;
            color: #fff;
            border-radius: 999px;
            font-size: 15px;
            font-weight: 700;
            text-decoration: none;
            transition: background 0.2s, transform 0.2s;
            font-family: 'Space Grotesk', sans-serif;
          }
          .hiw-step-btn:hover { background: #e03d00; transform: scale(1.03); }

          /* Image side */
          .hiw-img-wrap {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 48px 40px;
            position: relative;
            z-index: 1;
          }
          .hiw-img-circle {
            width: 360px;
            height: 360px;
            border-radius: 50%;
            overflow: hidden;
            border: 5px solid rgba(255,69,0,0.35);
            box-shadow: 0 0 0 16px rgba(255,69,0,0.08), 0 32px 80px rgba(0,0,0,0.4);
            flex-shrink: 0;
          }
          .hiw-img-circle img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
          }



          @media (max-width: 860px) {
            .hiw-row { grid-template-columns: 1fr; min-height: auto; }
            .hiw-row.hiw-reverse .hiw-text  { order: 2; }
            .hiw-row.hiw-reverse .hiw-img-wrap { order: 1; }
            .hiw-text { padding: 40px 24px 24px; }
            .hiw-img-wrap { padding: 24px; }
            .hiw-img-circle { width: 260px; height: 260px; }
            .hiw-main-title { font-size: 32px; }
            .hiw-step-title { font-size: 26px; }
            .hiw-header { padding: 60px 24px 40px; }
          }
        `}} />

        {/* Animated orange progress line */}
        <div className="hiw-progress-bar">
          <div className="hiw-progress-fill" />
        </div>

        {/* Section header */}
        <div className="hiw-header">
          <div className="hiw-eyebrow">How It Works</div>
          <h2 className="hiw-main-title">
            Book the right service in <span>four simple steps</span>
          </h2>
          <p className="hiw-main-copy">
            A straightforward flow designed to help clients discover, compare, and hire with confidence.
          </p>
        </div>

        {/* ── Step 1: Search ── */}
        <div className="hiw-row hiw-reverse">
          <div className="hiw-img-wrap">
            <div className="hiw-img-circle">
              <img src="/hiw-step1.png" alt="Search for services" />
            </div>
          </div>
          <div className="hiw-text">
            <div className="hiw-step-label">Step 1</div>
            <h3 className="hiw-step-title">Search &amp; Filter Services</h3>
            <p className="hiw-step-copy">
              Enter the service you need, pick a category, and set your location. Our smart search instantly surfaces the most relevant professionals near you.
            </p>
            <a href="/search" className="hiw-step-btn">
              Browse services <iconify-icon icon="lucide:arrow-right" />
            </a>
          </div>
        </div>

        {/* ── Step 2: Compare ── */}
        <div className="hiw-row">
          <div className="hiw-text">
            <div className="hiw-step-label">Step 2</div>
            <h3 className="hiw-step-title">Compare Verified Profiles</h3>
            <p className="hiw-step-copy">
              Review ratings, experience, response times, and pricing. Every professional on Boulot Man is verified — so you always hire with confidence.
            </p>
            <a href="/search" className="hiw-step-btn">
              View professionals <iconify-icon icon="lucide:arrow-right" />
            </a>
          </div>
          <div className="hiw-img-wrap">
            <div className="hiw-img-circle">
              <img src="/hiw-step2.png" alt="Compare verified profiles" />
            </div>
          </div>
        </div>

        {/* ── Step 3: Book ── */}
        <div className="hiw-row hiw-reverse">
          <div className="hiw-img-wrap">
            <div className="hiw-img-circle">
              <img src="/hiw-step3.png" alt="Book and schedule" />
            </div>
          </div>
          <div className="hiw-text">
            <div className="hiw-step-label">Step 3</div>
            <h3 className="hiw-step-title">Book &amp; Schedule</h3>
            <p className="hiw-step-copy">
              Contact the professional, confirm the schedule, and lock in your appointment — all from one place. No back-and-forth calls needed.
            </p>
            <a href="/signup" className="hiw-step-btn">
              Get started <iconify-icon icon="lucide:arrow-right" />
            </a>
          </div>
        </div>

        {/* ── Step 4: Done ── */}
        <div className="hiw-row">
          <div className="hiw-text">
            <div className="hiw-step-label">Step 4</div>
            <h3 className="hiw-step-title">Sit Back &amp; Get It Done</h3>
            <p className="hiw-step-copy">
              Your professional arrives on time, completes the job to a high standard, and you leave a review. It's that simple — quality service, every time.
            </p>
            <a href="/signup" className="hiw-step-btn">
              Hire now <iconify-icon icon="lucide:arrow-right" />
            </a>
          </div>
          <div className="hiw-img-wrap">
            <div className="hiw-img-circle">
              <img src="/hiw-step4.png" alt="Job completed" />
            </div>
          </div>
        </div>
      </section>






      <section id="cta" className="section">
        <div className="container">
          <div className="cta-band">
            <div>
              <h2 className="cta-title">
                Ready to hire faster or grow your business?
              </h2>
              <p className="cta-copy">
                Join clients, freelancers, and companies using Boulot Man to
                connect with trusted service opportunities every day.
              </p>
            </div>
            <div className="cta-actions">
              <Link href="/search" className="btn btn-secondary" data-media-type="banani-button">
                Browse services
              </Link>
              <Link href="/signup" className="btn btn-primary" data-media-type="banani-button">
                Get started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ====== COUNTRIES SECTION ====== */}
      <section id="countries-section" className="section">
        <style dangerouslySetInnerHTML={{ __html: `
          #countries-section {
            background: #0F172A;
            padding: 80px 0;
          }
          .countries-eyebrow {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: rgba(255, 69, 0, 0.12);
            color: #ff4500;
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            padding: 8px 16px;
            border-radius: 999px;
            margin-bottom: 16px;
          }
          .countries-header {
            text-align: center;
            margin-bottom: 52px;
          }
          .countries-header h2 {
            font-size: 44px;
            font-weight: 800;
            color: #ffffff;
            margin: 0 0 12px;
            line-height: 1.1;
          }
          .countries-header h2 span {
            color: #ff4500;
          }
          .countries-header p {
            color: #64748b;
            font-size: 17px;
            max-width: 520px;
            margin: 0 auto;
          }
          .countries-grid {
            display: flex;
            gap: 12px;
            height: 480px;
            align-items: stretch;
          }
          .country-card-exp {
            position: relative;
            border-radius: 24px;
            overflow: hidden;
            cursor: pointer;
            flex: 1;
            min-width: 0;
            transition: flex 0.7s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .country-card-exp:hover {
            flex: 4;
          }
          .country-card-exp img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
            transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .country-card-exp:hover img {
            transform: scale(1.06);
          }
          .country-card-overlay {
            position: absolute;
            inset: 0;
            background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 50%, transparent 100%);
            transition: background 0.5s ease;
          }
          .country-card-exp:hover .country-card-overlay {
            background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 60%, transparent 100%);
          }
          .country-card-info {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 28px 24px;
            color: #fff;
          }
          .country-card-flag {
            font-size: 32px;
            margin-bottom: 8px;
            display: block;
          }
          .country-card-name {
            font-size: 22px;
            font-weight: 800;
            margin: 0 0 4px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .country-card-desc {
            font-size: 14px;
            color: rgba(255,255,255,0.8);
            margin: 0 0 16px;
            line-height: 1.5;
            max-height: 0;
            overflow: hidden;
            opacity: 0;
            transition: max-height 0.5s ease, opacity 0.4s ease;
          }
          .country-card-exp:hover .country-card-desc {
            max-height: 80px;
            opacity: 1;
          }
          .country-card-link {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: #ff4500;
            color: #fff;
            font-size: 13px;
            font-weight: 700;
            padding: 10px 20px;
            border-radius: 999px;
            text-decoration: none;
            opacity: 0;
            transform: translateY(10px);
            transition: opacity 0.4s ease 0.1s, transform 0.4s ease 0.1s;
          }
          .country-card-exp:hover .country-card-link {
            opacity: 1;
            transform: translateY(0);
          }
          .country-card-link:hover {
            background: #e03d00;
          }
          @media (max-width: 768px) {
            .countries-grid {
              flex-direction: column;
              height: auto;
            }
            .country-card-exp {
              flex: none !important;
              height: 200px;
            }
            .country-card-exp:hover {
              height: 300px;
            }
            .country-card-desc { max-height: 60px; opacity: 1; }
            .country-card-link { opacity: 1; transform: none; }
          }
        `}} />
        <div className="container">
          <div className="countries-header">
            <div className="countries-eyebrow">🌍 Our Reach</div>
            <h2>Where We <span>Operate</span></h2>
            <p>Boulot Man connects clients and professionals across Africa and beyond.</p>
          </div>
          <div className="countries-grid">
            {[
              {
                name: "Rwanda",
                flag: "🇷🇼",
                img: "/rwanda.jpg",
                desc: "Kigali's fastest-growing tech and service market — clean, connected, and opportunity-rich."
              },
              {
                name: "Kenya",
                flag: "🇰🇪",
                img: "/kenya.jpg",
                desc: "Nairobi's dynamic economy drives demand for top-tier professionals across every industry."
              },
              {
                name: "Nigeria",
                flag: "🇳🇬",
                img: "/nigeria.jpg",
                desc: "Africa's largest economy with millions of skilled professionals ready to deliver."
              },
              {
                name: "Ghana",
                flag: "🇬🇭",
                img: "/ghana.jpg",
                desc: "Accra's thriving business hub where talent meets opportunity every day."
              },
              {
                name: "South Africa",
                flag: "🇿🇦",
                img: "/south-africa.jpg",
                desc: "Cape Town and Johannesburg — Africa's most developed professional service markets."
              },
              {
                name: "Ivory Coast",
                flag: "🇨🇮",
                img: "/ivory-coast.png",
                desc: "Abidjan's dynamic business environment connecting francophone Africa's best talent."
              },
              {
                name: "Cameroon",
                flag: "🇨🇲",
                img: "/cameroon.png",
                desc: "Douala and Yaoundé — Central Africa's growing hub for top-tier specialized talent."
              },
              {
                name: "Global",
                flag: "🌐",
                img: "/global.jpg",
                desc: "Remote-ready professionals available worldwide — no borders, just results."
              },
            ].map((country) => (
              <div key={country.name} className="country-card-exp">
                <img src={country.img} alt={country.name} />
                <div className="country-card-overlay" />
                <div className="country-card-info">
                  <span className="country-card-flag">{country.flag}</span>
                  <h3 className="country-card-name">{country.name}</h3>
                  <p className="country-card-desc">{country.desc}</p>
                  <a href="/search" className="country-card-link">
                    Explore {country.name} →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* ====== END COUNTRIES SECTION ====== */}

      <section id="interactive-testimonials" className="section" style={{ paddingTop: 0 }}>
        <style dangerouslySetInnerHTML={{ __html: `
          .floating-testimonials-area {
            position: relative;
            width: 100%;
            min-height: 600px;
            background: var(--background);
            overflow: hidden;
            margin: 48px 0;
            border-radius: 32px;
          }
          .testimonial-bubble {
            position: absolute;
            width: 120px;
            height: 120px;
            border-radius: 50%;
            border: 4px solid #001F3F;
            box-shadow: 0 10px 25px rgba(0, 31, 63, 0.1);
            cursor: pointer;
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            z-index: 2;
            background: #f1f5f9;
          }
          .testimonial-bubble img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            object-fit: cover;
          }
          .testimonial-bubble:hover {
            transform: scale(1.1);
            border-color: #ea580c;
            z-index: 10;
            box-shadow: 0 15px 35px rgba(234, 88, 12, 0.3);
          }
          .testimonial-dropdown-card {
            position: absolute;
            top: 130px;
            left: 50%;
            transform: translateX(-50%) translateY(10px);
            width: 320px;
            background: #fff;
            border-radius: 20px;
            padding: 24px;
            box-shadow: 0 20px 50px rgba(0, 31, 63, 0.15);
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            z-index: -1;
            text-align: center;
          }
          .testimonial-dropdown-card::before {
            content: "";
            position: absolute;
            top: -8px;
            left: 50%;
            transform: translateX(-50%);
            border-width: 0 10px 10px 10px;
            border-style: solid;
            border-color: transparent transparent #fff transparent;
          }
          .testimonial-bubble:hover .testimonial-dropdown-card {
            opacity: 1;
            visibility: visible;
            pointer-events: auto;
            transform: translateX(-50%) translateY(0);
          }
          .testi-quote-icon {
            color: #ea580c;
            font-size: 24px;
            margin-bottom: 12px;
          }
          .testi-text {
            font-size: 15px;
            line-height: 1.6;
            color: #334155;
            margin: 0 0 16px;
            font-weight: 500;
          }
          .testi-author {
            font-weight: 800;
            font-size: 16px;
            color: #0f172a;
            margin: 0;
          }
          .testi-role {
            font-size: 13px;
            color: #64748b;
            margin: 4px 0 12px;
          }
          .testi-stars {
            color: #fbbf24;
            font-size: 16px;
            display: flex;
            justify-content: center;
            gap: 4px;
          }
          .tb-1 { top: 20%; left: 10%; }
          .tb-2 { top: 60%; left: 30%; }
          .tb-3 { top: 15%; left: 50%; transform: translateX(-50%); }
          .tb-4 { top: 60%; right: 30%; }
          .tb-5 { top: 25%; right: 10%; }
          
          /* Make bottom bubbles open upwards so they don't get clipped */
          .tb-2 .testimonial-dropdown-card,
          .tb-4 .testimonial-dropdown-card {
            top: auto;
            bottom: 135px;
          }
          .tb-2 .testimonial-dropdown-card::before,
          .tb-4 .testimonial-dropdown-card::before {
            top: auto;
            bottom: -10px;
            border-width: 10px 10px 0 10px;
            border-color: #fff transparent transparent transparent;
          }
          
          .testimonial-bubble.tb-3:hover {
            transform: translateX(-50%) scale(1.1);
          }
          .testimonial-bubble.tb-3 .testimonial-dropdown-card {
            /* Fix for the centered one */
            transform: translateX(-50%) translateY(10px);
          }
          .testimonial-bubble.tb-3:hover .testimonial-dropdown-card {
            transform: translateX(-50%) translateY(0);
          }
          
          @media (max-width: 1200px) {
            .tb-1 { left: 5%; }
            .tb-2 { left: 20%; }
            .tb-4 { right: 20%; }
            .tb-5 { right: 5%; }
          }
          @media (max-width: 768px) {
            .floating-testimonials-area {
              min-height: auto !important;
              height: auto !important;
              display: flex !important;
              flex-direction: column !important;
              gap: 20px !important;
              padding: 10px 0 !important;
              margin: 24px 0 !important;
              overflow: visible !important;
            }
            .testimonial-bubble,
            .testimonial-bubble.tb-1,
            .testimonial-bubble.tb-2,
            .testimonial-bubble.tb-3,
            .testimonial-bubble.tb-4,
            .testimonial-bubble.tb-5 {
              position: relative !important;
              top: auto !important;
              left: auto !important;
              right: auto !important;
              bottom: auto !important;
              transform: none !important;
              width: 100% !important;
              height: auto !important;
              border: 1px solid #e2e8f0 !important;
              border-radius: 20px !important;
              box-shadow: 0 8px 24px rgba(0, 31, 63, 0.06) !important;
              padding: 24px 20px !important;
              background: #ffffff !important;
              display: flex !important;
              flex-direction: column !important;
              align-items: center !important;
              text-align: center !important;
              cursor: default !important;
            }
            .testimonial-bubble:hover,
            .testimonial-bubble.tb-3:hover {
              transform: none !important;
              box-shadow: 0 8px 24px rgba(0, 31, 63, 0.06) !important;
              border-color: #e2e8f0 !important;
            }
            .testimonial-bubble img {
              width: 72px !important;
              height: 72px !important;
              border-radius: 50% !important;
              object-fit: cover !important;
              border: 3px solid #ff4500 !important;
              margin: 0 auto 16px !important;
              display: block !important;
            }
            .testimonial-dropdown-card,
            .tb-1 .testimonial-dropdown-card,
            .tb-2 .testimonial-dropdown-card,
            .tb-3 .testimonial-dropdown-card,
            .tb-4 .testimonial-dropdown-card,
            .tb-5 .testimonial-dropdown-card {
              position: static !important;
              top: auto !important;
              left: auto !important;
              right: auto !important;
              bottom: auto !important;
              transform: none !important;
              width: 100% !important;
              opacity: 1 !important;
              visibility: visible !important;
              pointer-events: auto !important;
              box-shadow: none !important;
              padding: 0 !important;
              background: transparent !important;
              z-index: 1 !important;
              margin-top: 0 !important;
            }
            .testimonial-dropdown-card::before {
              display: none !important;
            }
            .testi-quote-icon {
              font-size: 22px !important;
              margin-bottom: 8px !important;
            }
            .testi-text {
              font-size: 14.5px !important;
              line-height: 1.6 !important;
              margin-bottom: 14px !important;
            }
            .testi-author {
              font-size: 15px !important;
              font-weight: 800 !important;
            }
            .testi-role {
              font-size: 12.5px !important;
              margin: 2px 0 8px !important;
            }
            .testi-stars {
              font-size: 15px !important;
            }
          }
        `}} />
        <div className="container">
          <div className="section-header">
            <div className="eyebrow">Success Stories</div>
            <h2 className="section-title">See why people trust Boulot Man</h2>
            <p className="section-copy">
              Discover how we've helped companies and individuals across Africa find perfect, vetted professionals they can rely on.
            </p>
          </div>

          <div className="floating-testimonials-area">
            {/* Bubble 1 */}
            <div className="testimonial-bubble tb-1">
              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=60" alt="Client 1" />
              <div className="testimonial-dropdown-card">
                <div className="testi-quote-icon">
                  <iconify-icon icon="lucide:quote"></iconify-icon>
                </div>
                <p className="testi-text">
                  "Finding reliable IT infrastructure experts in Lagos used to take weeks. With Boulot Man, we had a vetted professional on-site within 48 hours."
                </p>
                <h4 className="testi-author">Ngozi O.</h4>
                <p className="testi-role">Operations Manager</p>
                <div className="testi-stars">★★★★★</div>
              </div>
            </div>

            {/* Bubble 2 */}
            <div className="testimonial-bubble tb-2">
              <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=500&auto=format&fit=crop&q=60" alt="Client 2" />
              <div className="testimonial-dropdown-card">
                <div className="testi-quote-icon">
                  <iconify-icon icon="lucide:quote"></iconify-icon>
                </div>
                <p className="testi-text">
                  "Our engineering firm relies on specialized talent. The talent pool here is unmatched, and the escrow system makes payments worry-free."
                </p>
                <h4 className="testi-author">Adebayo A.</h4>
                <p className="testi-role">Lead Engineer</p>
                <div className="testi-stars">★★★★★</div>
              </div>
            </div>

            {/* Bubble 3 */}
            <div className="testimonial-bubble tb-3">
              <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&auto=format&fit=crop&q=60" alt="Client 3" />
              <div className="testimonial-dropdown-card">
                <div className="testi-quote-icon">
                  <iconify-icon icon="lucide:quote"></iconify-icon>
                </div>
                <p className="testi-text">
                  "I needed an expert to handle my home automation system. The technician I hired was extremely professional and knew exactly what to do."
                </p>
                <h4 className="testi-author">David S.</h4>
                <p className="testi-role">Homeowner</p>
                <div className="testi-stars">★★★★☆</div>
              </div>
            </div>

            {/* Bubble 4 */}
            <div className="testimonial-bubble tb-4">
              <img src="https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=500&auto=format&fit=crop&q=60" alt="Client 4" />
              <div className="testimonial-dropdown-card">
                <div className="testi-quote-icon">
                  <iconify-icon icon="lucide:quote"></iconify-icon>
                </div>
                <p className="testi-text">
                  "Outstanding platform! The vetting process gave me confidence, and the results exceeded my expectations."
                </p>
                <h4 className="testi-author">Chidinma E.</h4>
                <p className="testi-role">Creative Director</p>
                <div className="testi-stars">★★★★★</div>
              </div>
            </div>

            {/* Bubble 5 */}
            <div className="testimonial-bubble tb-5">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=60" alt="Client 5" />
              <div className="testimonial-dropdown-card">
                <div className="testi-quote-icon">
                  <iconify-icon icon="lucide:quote"></iconify-icon>
                </div>
                <p className="testi-text">
                  "We've hired multiple contractors for civil works through Boulot Man. The tracking and milestone payments keep everything transparent."
                </p>
                <h4 className="testi-author">Olamide O.</h4>
                <p className="testi-role">Project Manager</p>
                <div className="testi-stars">★★★★★</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    
      {showLoginPopup && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999,
          animation: 'fadeIn 0.2s ease-out'
        }} onClick={() => setShowLoginPopup(false)}>
          <div style={{
            background: '#ffffff', borderRadius: '16px', padding: '32px',
            width: '90%', maxWidth: '400px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            textAlign: 'center', position: 'relative', transform: 'scale(1)',
            animation: 'scaleUp 0.3s ease-out'
          }} onClick={e => e.stopPropagation()}>
            <div style={{
              width: '64px', height: '64px', background: '#fff3e0', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px',
              color: 'var(--brand-orange)', fontSize: '32px'
            }}>
              <iconify-icon icon="lucide:lock"></iconify-icon>
            </div>
            <h3 style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>Authentication Required</h3>
            <p style={{ color: '#64748b', fontSize: '16px', lineHeight: '1.5', marginBottom: '32px' }}>
              You need to be logged into a Service Provider account to apply for tasks.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button 
                onClick={() => setShowLoginPopup(false)}
                style={{
                  padding: '12px 24px', borderRadius: '8px', border: '1px solid #e2e8f0',
                  background: '#fff', color: '#64748b', fontWeight: 600, cursor: 'pointer',
                  flex: 1
                }}>
                Cancel
              </button>
              <button 
                onClick={() => router.push('/login')}
                style={{
                  padding: '12px 24px', borderRadius: '8px', border: 'none',
                  background: 'var(--brand-orange)', color: '#fff', fontWeight: 600, cursor: 'pointer',
                  flex: 1
                }}>
                Login Now
              </button>
            </div>
          </div>
        </div>
      )}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleUp { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }

        /* --- Enterprise Companies Section --- */
        .bm-enterprise-root { background: linear-gradient(145deg, #001F3F 0%, #001224 100%); padding: 100px 0; position: relative; overflow: hidden; color: #fff; }
        .bm-enterprise-root::before { content: ""; position: absolute; top: -50%; right: -20%; width: 800px; height: 800px; background: radial-gradient(circle, rgba(255, 69, 0, 0.15) 0%, rgba(0, 31, 63, 0) 70%); border-radius: 50%; pointer-events: none; }
        .bm-enterprise-container { max-width: 1300px; margin: 0 auto; padding: 0 40px; position: relative; z-index: 1; }
        .bm-enterprise-header { text-align: center; margin-bottom: 60px; }
        .bm-enterprise-header-title { font-size: 2.8rem; font-weight: 700; letter-spacing: -0.5px; margin-bottom: 16px; background: linear-gradient(to right, #ffffff, #cbd5e1); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .bm-enterprise-header-subtitle { font-size: 1.15rem; color: #94a3b8; max-width: 650px; margin: 0 auto; line-height: 1.6; }
        .bm-enterprise-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; }
        .bm-enterprise-card { background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 20px; padding: 24px; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); display: flex; flex-direction: column; backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); position: relative; overflow: hidden; }
        .bm-enterprise-card:hover { transform: translateY(-8px); border-color: rgba(255, 69, 0, 0.4); box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(255, 69, 0, 0.15); background: rgba(255, 255, 255, 0.06); }
        .bm-enterprise-profile { display: flex; align-items: center; gap: 16px; margin-bottom: 16px; }
        .bm-enterprise-avatar { width: 60px; height: 60px; border-radius: 14px; object-fit: cover; border: 2px solid rgba(255, 255, 255, 0.1); background: #fff; }
        .bm-enterprise-name { font-size: 1.25rem; font-weight: 700; color: #fff; line-height: 1.2; margin-bottom: 6px; }
        .bm-enterprise-role { font-size: 0.85rem; color: #38bdf8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
        .bm-enterprise-rating { display: flex; align-items: center; gap: 8px; font-size: 0.95rem; margin-bottom: 12px; color: #e2e8f0; }
        .bm-enterprise-stars { color: #facc15; }
        .bm-enterprise-meta { font-size: 0.85rem; color: #94a3b8; margin-bottom: 12px; display: flex; align-items: center; gap: 6px; }
        .bm-enterprise-description { font-size: 0.95rem; color: #cbd5e1; line-height: 1.6; margin-bottom: 18px; flex: 1; }
        .bm-enterprise-actions { display: flex; gap: 12px; margin-top: auto; }
        .bm-enterprise-btn { flex: 1; padding: 12px; font-size: 0.9rem; border-radius: 10px; text-decoration: none; text-align: center; font-weight: 600; transition: all 0.3s ease; }
        .bm-enterprise-btn-view { background: rgba(255, 255, 255, 0.05); color: #fff; border: 1px solid rgba(255, 255, 255, 0.2); }
        .bm-enterprise-btn-view:hover { background: rgba(255, 255, 255, 0.12); border-color: rgba(255, 255, 255, 0.35); }
        .bm-enterprise-btn-hire { background: #FF4500; color: #fff; border: 1px solid #FF4500; box-shadow: 0 4px 14px rgba(255, 69, 0, 0.3); }
        .bm-enterprise-btn-hire:hover { background: #e63e00; border-color: #e63e00; box-shadow: 0 6px 18px rgba(255, 69, 0, 0.45); }
        .bm-enterprise-explore { display: inline-flex; align-items: center; gap: 10px; color: #fff; font-weight: 600; text-decoration: none; font-size: 1.1rem; padding: 16px 32px; border-radius: 50px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); transition: all 0.3s ease; backdrop-filter: blur(8px); }
        .bm-enterprise-explore:hover { background: rgba(255, 255, 255, 0.1); border-color: rgba(255, 69, 0, 0.6); color: #FF4500; transform: translateX(4px); }
        @media(max-width: 1200px) { .bm-enterprise-grid { grid-template-columns: repeat(3, 1fr); } }
        @media(max-width: 900px) { .bm-enterprise-grid { grid-template-columns: repeat(2, 1fr); } .bm-enterprise-header-title { font-size: 2.2rem; } }
        @media(max-width: 600px) { .bm-enterprise-grid { grid-template-columns: 1fr; } .bm-enterprise-header-title { font-size: 1.8rem; } .bm-enterprise-explore { width: 100%; justify-content: center; } }
      `}} />

    </div>
  );
}
