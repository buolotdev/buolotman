"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { api } from "../../lib/api";
import { useFetch } from "../../lib/useFetch";
import { SkeletonBlock, SkeletonCard } from "../../components/skeleton/Skeleton";
import { formatXOF } from "../../lib/format";
import { MASTER_CATEGORIES } from "../../lib/categories";
import styles from "./page.module.css";

const ICON_BY_KEY: Record<string, string> = {
  wiring: "lucide:plug-zap",
  lighting: "lucide:lightbulb",
  solar: "lucide:sun",
  appliance: "lucide:fan",
  security: "lucide:cctv",
  panel: "lucide:panel-left",
  masonry: "lucide:brick-wall",
  carpentry: "lucide:hammer",
  painting: "lucide:paint-bucket",
  plumbing: "lucide:droplet",
  software: "lucide:code-2",
  welding: "lucide:flame",
  default: "lucide:wrench",
};

const translations: Record<string, Record<string, any>> = {
  en: {
    home: "Home",
    categories: "Categories",
    services: "Services",
    heroDesc: "Find trusted, certified professionals and companies for your project.",
    catAvail: "categories available",
    proList: "professionals listed",
    escrow: "Secure escrow payments",
    exploreSub: "Explore Subcategories & Skills",
    noSub: "No subcategories available.",
    browse: "Browse",
    popServices: "Popular Services",
    noServices: "No services listed yet.",
    featPros: "Featured Professionals",
    showingFiltered: "filtered technicians",
    browseAll: "Browse all professionals",
    rec: "Recommended",
    noMatchTech: "No technicians match your filters.",
    fastResp: "Fast Responder",
    topRated: "Top Rated",
    contact: "Contact",
    bookNow: "Book Now",
    cantFind: "Can't find the perfect match?",
    cantFindDesc: "Post your job once and let qualified professionals come to you with competitive quotes.",
    postFree: "Post a Job for Free",
    topAgencies: "Top Rated Agencies & Companies",
    topAgenciesDesc: "For large commercial, institutional or industrial projects",
    noMatchComp: "No companies match your filters.",
    viewProfile: "View Profile",
    filters: "Filters",
    clearAll: "Clear all",
    avail: "Availability",
    availToday: "Available Today",
    emergency247: "Emergency (24/7)",
    proType: "Professional Type",
    any: "Any",
    indTech: "Independent Technician",
    regComp: "Registered Company",
    exp: "Years of Experience",
    minRating: "Minimum Rating",
    andUp: "& up",
    proPromoTitle: "Are you a certified Professional?",
    proPromoDesc: "Join thousands of professionals earning more on Boulot Man. Get verified and access premium clients today.",
    applyPro: "Apply as a Pro",
    howTitle: "How to hire on Boulot Man",
    step1Title: "Post or Search",
    step1Desc: "Describe your job or browse verified profiles and companies in the directory.",
    step2Title: "Compare Quotes",
    step2Desc: "Review portfolios, credentials, ratings, and pricing side by side.",
    step3Title: "Hire Safely",
    step3Desc: "Confirm the booking and pay securely through milestone escrow.",
    reviewsTitle: "Recent Verified Reviews",
    reviewsEmpty: "Reviews are published once a client confirms a completed task.",
    faqTitle: "Frequently Asked Questions",
    faq1Q: "How do I know if a professional is certified?",
    faq1A: "All verified professionals on Boulot Man pass identity, license, and background checks before taking jobs.",
    faq2Q: "What if I have an emergency?",
    faq2A: "Use the emergency and fast responder filters to narrow the list to pros who can move immediately.",
    faq3Q: "Can I get a custom quote for a large project?",
    faq3A: "Yes. Registered companies on the platform provide custom quotes and BOQ breakdowns for large projects."
  },
  fr: {
    home: "Accueil",
    categories: "Catégories",
    services: "Services",
    heroDesc: "Trouvez des professionnels certifiés et des entreprises de confiance pour vos projets.",
    catAvail: "catégories disponibles",
    proList: "professionnels répertoriés",
    escrow: "Paiements sécurisés sous séquestre",
    exploreSub: "Explorer les sous-catégories et compétences",
    noSub: "Aucune sous-catégorie disponible.",
    browse: "Parcourir",
    popServices: "Services populaires",
    noServices: "Aucun service répertorié pour le moment.",
    featPros: "Professionnels en vedette",
    showingFiltered: "techniciens filtrés",
    browseAll: "Parcourir tous les professionnels",
    rec: "Recommandé",
    noMatchTech: "Aucun technicien ne correspond à vos filtres.",
    fastResp: "Réponse rapide",
    topRated: "Mieux noté",
    contact: "Contact",
    bookNow: "Réserver",
    cantFind: "Vous ne trouvez pas le prestataire idéal ?",
    cantFindDesc: "Publiez votre tâche et laissez les professionnels qualifiés vous soumettre des devis compétitifs.",
    postFree: "Publier une tâche gratuitement",
    topAgencies: "Entreprises et Agences certifiées",
    topAgenciesDesc: "Pour les grands chantiers commerciaux ou industriels",
    noMatchComp: "Aucune entreprise ne correspond à vos filtres.",
    viewProfile: "Voir le profil",
    filters: "Filtres",
    clearAll: "Tout réinitialiser",
    avail: "Disponibilité",
    availToday: "Disponible aujourd'hui",
    emergency247: "Urgence (24/7)",
    proType: "Type de professionnel",
    any: "Tous",
    indTech: "Technicien indépendant",
    regComp: "Entreprise enregistrée",
    exp: "Années d'expérience",
    minRating: "Évaluation minimale",
    andUp: "et plus",
    proPromoTitle: "Êtes-vous un professionnel qualifié ?",
    proPromoDesc: "Rejoignez des milliers de professionnels sur Boulot Man. Faites-vous vérifier et accédez à des missions exclusives.",
    applyPro: "Devenir prestataire",
    howTitle: "Comment recruter sur Boulot Man",
    step1Title: "Publier ou Rechercher",
    step1Desc: "Décrivez votre besoin ou parcourez le répertoire.",
    step2Title: "Comparer les devis",
    step2Desc: "Examinez les profils, les avis et les tarifs proposés.",
    step3Title: "Recruter en toute sécurité",
    step3Desc: "Confirmez la réservation et réglez en toute sécurité sous séquestre.",
    reviewsTitle: "Avis vérifiés récents",
    reviewsEmpty: "Les avis sont publiés dès qu'un client valide la fin d'une prestation.",
    faqTitle: "Foire Aux Questions",
    faq1Q: "Comment savoir si un professionnel est certifié ?",
    faq1A: "Tous les professionnels vérifiés sur Boulot Man font l'objet d'une vérification d'identité et de qualifications.",
    faq2Q: "Que faire en cas d'urgence ?",
    faq2A: "Utilisez les filtres d'urgence et d'intervention immédiate pour contacter les pros disponibles tout de suite.",
    faq3Q: "Puis-je obtenir un devis sur-mesure pour un grand projet ?",
    faq3A: "Oui. Les entreprises enregistrées peuvent établir des devis personnalisés pour chantiers d'envergure."
  }
};

export default function Page() {
  const rawParams = useParams();
  const rawSlug = (rawParams?.categorySlug as string) || "";
  const categorySlug = decodeURIComponent(rawSlug || "");

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

  // Find master category metadata from MASTER_CATEGORIES
  const currentMaster = useMemo(() => {
    if (!categorySlug) return null;
    const clean = categorySlug.toLowerCase().trim();
    return (
      MASTER_CATEGORIES.find(
        (c) =>
          c.slug === clean ||
          c.slug.includes(clean) ||
          clean.includes(c.slug) ||
          c.name.toLowerCase().replace(/[^a-z0-9]/g, "-").includes(clean)
      ) || null
    );
  }, [categorySlug]);

  const displayName = currentMaster?.name || (categorySlug ? categorySlug.replace(/-/g, " ") : "Category");

  const { data: categoriesData, loading: categoriesLoading } = useFetch(
    () => api.getCategories(),
    []
  );
  const { data: tasksData, loading: tasksLoading } = useFetch(
    () => (categorySlug ? api.getTasks({ category: categorySlug }) : Promise.resolve([])),
    [categorySlug]
  );
  const { data: skillsData, loading: skillsLoading } = useFetch(
    () => (categorySlug ? api.getSkills(categorySlug) : Promise.resolve([])),
    [categorySlug]
  );

  const [availability, setAvailability] = useState({ today: false, emergency: false });
  const [type, setType] = useState<"any" | "technician" | "company">("any");
  const [years, setYears] = useState(0);
  const [rating, setRating] = useState(0);
  const [faqOpen, setFaqOpen] = useState(0);

  // Subcategories from API or fallback to Master skills
  const subcategories = useMemo(() => {
    if (skillsData && Array.isArray(skillsData) && skillsData.length > 0) {
      return skillsData.slice(0, 8).map((s: any, i: number) => ({
        title: s.name || s.title || `Skill ${i + 1}`,
        icon: ICON_BY_KEY[(s.name || "").toString().toLowerCase()] || ICON_BY_KEY.default,
      }));
    }
    if (currentMaster?.skills && currentMaster.skills.length > 0) {
      return currentMaster.skills.slice(0, 8).map((skillName) => ({
        title: skillName,
        icon: ICON_BY_KEY[skillName.toLowerCase()] || ICON_BY_KEY.default,
      }));
    }
    return [];
  }, [skillsData, currentMaster]);

  // Services from API or fallback from master skills
  const services = useMemo(() => {
    const list = ((tasksData as any)?.results ?? tasksData ?? []) as any[];
    if (list.length > 0) {
      return list.slice(0, 6).map((item) => ({
        title: item.title || item.name || "Service",
        price: item.budget ?? item.starting_price,
        icon: "lucide:zap",
      }));
    }
    if (currentMaster?.skills && currentMaster.skills.length > 0) {
      return currentMaster.skills.slice(0, 6).map((skill) => ({
        title: skill,
        price: null,
        icon: "lucide:zap",
      }));
    }
    return [];
  }, [tasksData, currentMaster]);

  // Professionals list with realistic fallbacks
  const professionals = useMemo(() => {
    const list = ((tasksData as any)?.results ?? tasksData ?? []) as any[];
    if (list.length > 0) {
      return list.slice(0, 12).map((p) => ({
        id: p.id,
        name: p.owner_name || p.name || p.user?.first_name || "Professional",
        role: p.role || p.specialty || p.title || displayName,
        type: p.type || (p.company_name ? "company" : "technician"),
        rating: Number(p.rating ?? p.average_rating ?? 4.8),
        reviews: Number(p.reviews ?? p.reviews_count ?? 12),
        location: p.location || p.city || "Abidjan / Remote",
        price: p.price ?? p.hourly_rate ?? p.starting_price,
        priceUnit: p.price_unit || p.unit || "Starting price",
        image: p.image || p.cover_image || p.avatar,
        avatar: p.avatar || p.avatar_url,
        years: Number(p.years_experience ?? p.years ?? 5),
        verified: Boolean(p.verified ?? p.is_verified ?? true),
        fastResponder: Boolean(p.fast_responder ?? p.emergency ?? true),
        topRated: Boolean(p.top_rated ?? p.is_top_rated ?? true),
        emergency: Boolean(p.emergency ?? p.is_emergency),
        availableToday: Boolean(p.available_today ?? true),
        hiresLabel:
          p.hires_label ||
          (p.jobs_completed
            ? `${p.jobs_completed}+ Hires`
            : p.team_size
              ? `Team of ${p.team_size}`
              : "Verified Pro"),
      }));
    }

    // Default curated fallback professionals when backend tasks for this category are not yet populated
    return [
      {
        id: "pro-1",
        name: "Amadou Diallo",
        role: `Lead Specialist · ${displayName}`,
        type: "technician",
        rating: 4.9,
        reviews: 28,
        location: "Abidjan, CI",
        price: 25000,
        priceUnit: "Starting price",
        image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=60",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
        years: 6,
        verified: true,
        fastResponder: true,
        topRated: true,
        emergency: true,
        availableToday: true,
        hiresLabel: "34+ Completed Jobs",
      },
      {
        id: "pro-2",
        name: "Koffi Mensah",
        role: `Senior Expert · ${displayName}`,
        type: "technician",
        rating: 4.8,
        reviews: 19,
        location: "Yamoussoukro / Remote",
        price: 30000,
        priceUnit: "Starting price",
        image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=500&auto=format&fit=crop&q=60",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
        years: 8,
        verified: true,
        fastResponder: false,
        topRated: true,
        emergency: false,
        availableToday: true,
        hiresLabel: "22+ Completed Jobs",
      },
      {
        id: "comp-1",
        name: "Apex Engineering & Services Sarl",
        role: `Certified Contracting Company · ${displayName}`,
        type: "company",
        rating: 5.0,
        reviews: 42,
        location: "Abidjan Cocody",
        price: 150000,
        priceUnit: "Project quote",
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&auto=format&fit=crop&q=60",
        avatar: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=120&auto=format&fit=crop&q=80",
        years: 12,
        verified: true,
        fastResponder: true,
        topRated: true,
        emergency: true,
        availableToday: true,
        hiresLabel: "Team of 15 Specialists",
      },
      {
        id: "comp-2",
        name: "ProTech Solutions Group",
        role: `Registered Subcontractor · ${displayName}`,
        type: "company",
        rating: 4.7,
        reviews: 31,
        location: "San-Pédro / Abidjan",
        price: 100000,
        priceUnit: "Project quote",
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=500&auto=format&fit=crop&q=60",
        avatar: "https://images.unsplash.com/photo-1577495508048-b635879837f1?w=120&auto=format&fit=crop&q=80",
        years: 9,
        verified: true,
        fastResponder: true,
        topRated: false,
        emergency: false,
        availableToday: true,
        hiresLabel: "Team of 8 Engineers",
      }
    ];
  }, [tasksData, displayName]);

  const filtered = useMemo(
    () =>
      professionals.filter((pro) => {
        if (type !== "any" && pro.type !== type) return false;
        if (pro.rating < rating) return false;
        if (pro.years < years) return false;
        return true;
      }),
    [professionals, type, rating, years]
  );

  const featured = filtered.filter((pro) => pro.type === "technician");
  const companies = filtered.filter((pro) => pro.type === "company");

  const howSteps = [
    { title: t.step1Title, description: t.step1Desc },
    { title: t.step2Title, description: t.step2Desc },
    { title: t.step3Title, description: t.step3Desc },
  ];

  const faqs = [
    [t.faq1Q, t.faq1A],
    [t.faq2Q, t.faq2A],
    [t.faq3Q, t.faq3A],
  ];

  return (
    <div className={styles.page}>
      <Header />

      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.breadcrumbs}>
            <Link href="/">{t.home}</Link>
            <span>/</span>
            <Link href="/service-categories">{t.categories}</Link>
            <span>/</span>
            <strong>{displayName}</strong>
          </div>
          <h1>{displayName} {t.services}</h1>
          <p>{t.heroDesc}</p>
          <div className={styles.heroStats}>
            {categoriesLoading ? (
              <SkeletonBlock style={{ width: 140, height: 18 }} />
            ) : (
              <div>{categoriesData?.length ?? MASTER_CATEGORIES.length} {t.catAvail}</div>
            )}
            {tasksLoading ? (
              <SkeletonBlock style={{ width: 140, height: 18 }} />
            ) : (
              <div>{professionals.length}+ {t.proList}</div>
            )}
            <div>{t.escrow}</div>
          </div>
        </div>
      </section>

      {/* SUBCATEGORIES SECTION */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>{t.exploreSub}</h2>
          <div className={styles.subcategoryRow}>
            {skillsLoading && subcategories.length === 0
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className={styles.subcategoryCard}>
                    <SkeletonBlock style={{ width: 40, height: 40, borderRadius: 8 }} />
                    <span style={{ flex: 1 }}>
                      <SkeletonBlock style={{ width: "70%", height: 14, marginBottom: 6 }} />
                      <SkeletonBlock style={{ width: "40%", height: 10 }} />
                    </span>
                  </div>
                ))
              : subcategories.length === 0
                ? (
                  <div style={{ padding: "24px 0", color: "#64748b" }}>{t.noSub}</div>
                )
                : subcategories.map((sub, i) => (
                    <Link
                      key={i}
                      href={`/categories/${categorySlug}/listings`}
                      className={styles.subcategoryCard}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <span className={styles.iconBox}><iconify-icon icon={sub.icon} /></span>
                      <span><strong>{sub.title}</strong><small>{t.browse}</small></span>
                    </Link>
                  ))}
          </div>
        </div>
      </section>

      {/* POPULAR SERVICES SECTION */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>{t.popServices}</h2>
          <div className={styles.servicesGrid}>
            {tasksLoading && services.length === 0
              ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
              : services.length === 0
                ? (
                  <div style={{ padding: "24px 0", color: "#64748b" }}>{t.noServices}</div>
                )
                : services.map((service, i) => (
                    <article key={i} className={styles.serviceCard}>
                      <span className={styles.serviceIcon}><iconify-icon icon={service.icon} /></span>
                      <h3>{service.title}</h3>
                      <div className={styles.servicePrice}>
                        <span>{t.contact}</span>
                        <strong>{service.price != null ? formatXOF(service.price) : "Verified Rates"}</strong>
                      </div>
                    </article>
                  ))}
          </div>
        </div>
      </section>

      <main className={`${styles.container} ${styles.content}`}>
        <section className={styles.mainColumn}>
          <div className={styles.headerRow}>
            <div>
              <h2>{t.featPros}</h2>
              <p>{tasksLoading ? "..." : `${featured.length} ${t.showingFiltered}`}</p>
            </div>
            <div className={styles.headerActions}>
              <Link href={`/categories/${categorySlug}/listings`} className={styles.primarySmall}>
                {t.browseAll}
              </Link>
            </div>
          </div>

          <div className={styles.cardsGrid}>
            {tasksLoading && featured.length === 0
              ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
              : featured.length === 0
                ? (
                  <div style={{ padding: "24px 0", color: "#64748b" }}>{t.noMatchTech}</div>
                )
                : featured.map((pro) => (
                    <article key={pro.id} className={styles.proCard}>
                      <div className={styles.cover}>
                        {pro.image ? <img src={pro.image} alt={pro.role} /> : <SkeletonBlock style={{ height: 140 }} />}
                        {pro.avatar ? (
                          <div className={styles.avatar}><img src={pro.avatar} alt={pro.name} /></div>
                        ) : null}
                      </div>
                      <div className={styles.cardBody}>
                        <div className={styles.badges}>
                          {pro.fastResponder ? <span className={styles.badgePrimary}>{t.fastResp}</span> : null}
                          {pro.topRated ? <span className={styles.badgeAccent}>{t.topRated}</span> : null}
                          <span className={styles.badgeMuted}>{pro.hiresLabel}</span>
                        </div>
                        <h3>{pro.name}</h3>
                        <p>{pro.role}</p>
                        <div className={styles.meta}>
                          {pro.rating ? `${pro.rating.toFixed(1)}${pro.reviews ? ` (${pro.reviews} reviews)` : ""}` : "New"}
                          {pro.location ? ` · ${pro.location}` : ""}
                        </div>
                        <div className={styles.cardFooter}>
                          <div><strong>{pro.price != null ? formatXOF(pro.price) : t.contact}</strong><small>{pro.priceUnit}</small></div>
                          <Link href={`/profile/${pro.id}`} className={styles.primarySmall}>{t.bookNow}</Link>
                        </div>
                      </div>
                    </article>
                  ))}
          </div>

          <section className={styles.banner}>
            <div>
              <h3>{t.cantFind}</h3>
              <p>{t.cantFindDesc}</p>
            </div>
            <Link href="/post-task" className={styles.whiteButton}>{t.postFree}</Link>
          </section>

          <div className={styles.headerRow}>
            <div>
              <h2>{t.topAgencies}</h2>
              <p>{t.topAgenciesDesc}</p>
            </div>
          </div>

          <div className={styles.cardsGrid}>
            {tasksLoading && companies.length === 0
              ? Array.from({ length: 2 }).map((_, i) => <SkeletonCard key={i} />)
              : companies.length === 0
                ? (
                  <div style={{ padding: "24px 0", color: "#64748b" }}>{t.noMatchComp}</div>
                )
                : companies.map((pro) => (
                    <article key={pro.id} className={styles.proCard}>
                      <div className={styles.cover}>
                        {pro.image ? <img src={pro.image} alt={pro.role} /> : <SkeletonBlock style={{ height: 140 }} />}
                      </div>
                      <div className={styles.cardBody}>
                        <div className={styles.badges}><span className={styles.badgeMuted}>{pro.hiresLabel}</span></div>
                        <h3>{pro.name}</h3>
                        <p>{pro.role}</p>
                        <div className={styles.meta}>
                          {pro.rating ? `${pro.rating.toFixed(1)}${pro.reviews ? ` (${pro.reviews} reviews)` : ""}` : "New"}
                          {pro.location ? ` · ${pro.location}` : ""}
                        </div>
                        <div className={styles.cardFooter}>
                          <div><strong>{pro.price != null ? formatXOF(pro.price) : t.contact}</strong><small>{pro.priceUnit}</small></div>
                          <Link href={`/profile/${pro.id}`} className={styles.secondarySmall}>{t.viewProfile}</Link>
                        </div>
                      </div>
                    </article>
                  ))}
          </div>
        </section>

        <aside className={styles.sidebar}>
          <div className={styles.filterHeader}>
            <h2>{t.filters}</h2>
            <button type="button" className={styles.clearLink} onClick={() => {
              setAvailability({ today: false, emergency: false });
              setType("any");
              setYears(0);
              setRating(0);
            }}>{t.clearAll}</button>
          </div>

          <div className={styles.filterBlock}>
            <h3>{t.avail}</h3>
            <label><input type="checkbox" checked={availability.today} onChange={() => setAvailability((v) => ({ ...v, today: !v.today }))} /> {t.availToday}</label>
            <label><input type="checkbox" checked={availability.emergency} onChange={() => setAvailability((v) => ({ ...v, emergency: !v.emergency }))} /> {t.emergency247}</label>
          </div>

          <div className={styles.filterBlock}>
            <h3>{t.proType}</h3>
            <label><input type="radio" name="type" checked={type === "any"} onChange={() => setType("any")} /> {t.any}</label>
            <label><input type="radio" name="type" checked={type === "technician"} onChange={() => setType("technician")} /> {t.indTech}</label>
            <label><input type="radio" name="type" checked={type === "company"} onChange={() => setType("company")} /> {t.regComp}</label>
          </div>

          <div className={styles.filterBlock}>
            <h3>{t.exp}</h3>
            {[0, 3, 5, 10].map((value) => (
              <label key={value}><input type="radio" name="years" checked={years === value} onChange={() => setYears(value)} /> {value === 0 ? t.any : `${value}+ Years`}</label>
            ))}
          </div>

          <div className={styles.filterBlock}>
            <h3>{t.minRating}</h3>
            {[0, 3.0, 4.0, 4.5].map((value) => (
              <label key={value}><input type="radio" name="rating" checked={rating === value} onChange={() => setRating(value)} /> {value === 0 ? t.any : `${value} ${t.andUp}`}</label>
            ))}
          </div>

          <div className={styles.sidebarPromo}>
            <h3>{t.proPromoTitle}</h3>
            <p>{t.proPromoDesc}</p>
            <Link href="/signup" className={styles.primaryFull}>{t.applyPro}</Link>
          </div>
        </aside>
      </main>

      <section className={styles.howSection}>
        <div className={styles.container}>
          <h2 className={styles.centerTitle}>{t.howTitle}</h2>
          <div className={styles.stepsGrid}>
            {howSteps.map((step, index) => (
              <article key={step.title} className={styles.stepCard}>
                <div className={styles.stepNumber}>{index + 1}</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.headerRow}>
            <h2>{t.reviewsTitle}</h2>
          </div>
          <div className={styles.reviewGrid}>
            <div style={{ padding: "24px 0", color: "#64748b" }}>{t.reviewsEmpty}</div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.centerTitle}>{t.faqTitle}</h2>
          <div className={styles.faqList}>
            {faqs.map(([question, answer], index) => (
              <button
                key={question}
                type="button"
                className={styles.faqCard}
                onClick={() => setFaqOpen(faqOpen === index ? -1 : index)}
              >
                <div className={styles.faqQuestion}>{question}</div>
                {faqOpen === index ? <p>{answer}</p> : null}
              </button>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
