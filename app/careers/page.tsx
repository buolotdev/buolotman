"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import styles from "./careers.module.css";

interface JobPosition {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
}

const JOBS_DATA: JobPosition[] = [
  {
    id: "fs-eng",
    title: "Senior Full-Stack Engineer (Next.js / Django)",
    department: "Engineering",
    location: "Remote (Pan-Africa) / Kigali",
    type: "Full-time",
    experience: "4+ years",
  },
  {
    id: "mob-eng",
    title: "Mobile App Engineer (React Native / iOS & Android)",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    experience: "3+ years",
  },
  {
    id: "escrow-ops",
    title: "Escrow & Dispute Resolution Officer",
    department: "Operations & Trust",
    location: "Kigali / Douala / Remote",
    type: "Full-time",
    experience: "2+ years",
  },
  {
    id: "ent-lead",
    title: "Enterprise Sales & Contractor Partnerships Lead",
    department: "Sales & Growth",
    location: "Nairobi / Lagos / Kigali",
    type: "Full-time",
    experience: "5+ years",
  },
  {
    id: "vetting-spec",
    title: "Technician Quality & Skills Vetting Specialist",
    department: "Operations & Trust",
    location: "Remote",
    type: "Full-time",
    experience: "2+ years",
  },
  {
    id: "cs-lead",
    title: "Customer Support & Dispatch Lead (Bilingual EN/FR)",
    department: "Customer Experience",
    location: "Remote",
    type: "Full-time",
    experience: "2+ years",
  },
];

const translations: Record<string, Record<string, any>> = {
  en: {
    heroBadge: "Work With High Impact",
    heroTitle: "Build the Operating System for African Labor",
    heroSubtitle: "Join our mission to connect millions of skilled technicians, engineers, and companies with verified opportunities, transparent contracts, and guaranteed escrow payments.",
    whyTitle: "Why Work at Boulot Man?",
    whyDesc: "We are a high-velocity, mission-driven team committed to technical excellence and real-world African economic empowerment.",
    benefit1Title: "Pan-African Remote First",
    benefit1Desc: "Work from anywhere across Africa or join our regional innovation hubs with full flexibility and autonomy.",
    benefit2Title: "Competitive Compensation & Equity",
    benefit2Desc: "We offer competitive salaries benchmarked globally, stock options, and performance incentives.",
    benefit3Title: "Comprehensive Health & Wellness",
    benefit3Desc: "Top-tier medical coverage for you and your dependents, mental health support, and equipment stipends.",
    openPositionsTitle: "Open Positions",
    openPositionsDesc: "Find your next career chapter and help scale Africa's leading technical services infrastructure.",
    deptAll: "All",
    deptEngineering: "Engineering",
    deptOperations: "Operations & Trust",
    deptSales: "Sales & Growth",
    deptCustomer: "Customer Experience",
    btnApplyNow: "Apply Now",
    ctaTitle: "Don't See the Right Role?",
    ctaDesc: "We are always seeking exceptional engineering, operations, and product talent. Submit an open speculative application.",
    btnGeneralApp: "Submit General Application",
    speculativeTitle: "General / Speculative Application",
    speculativeDept: "General Talent",
    speculativeLoc: "Remote",
    speculativeType: "Full-time / Part-time",
    speculativeExp: "Any Level",
    applyModalTitle: "Apply:",
    successMsg: "🎉 Thank you for applying! Our talent acquisition team will review your application within 48 hours.",
    labelFullName: "Full Name",
    phFullName: "Jane Doe",
    labelEmail: "Email Address",
    phEmail: "jane@example.com",
    labelPhone: "Phone / WhatsApp",
    phPhone: "+250 788 123 456",
    labelLinkedIn: "LinkedIn / Portfolio URL",
    labelCover: "Cover Note / Why Boulot Man?",
    phCover: "Tell us about your background and what excites you about our mission...",
    btnSubmitApplication: "Submit Application"
  },
  fr: {
    heroBadge: "Impactez l'Économie Africaine",
    heroTitle: "Bâtissez le Système d'Exploitation du Travail en Afrique",
    heroSubtitle: "Rejoignez notre mission : connecter des millions d'artisans, techniciens et entreprises à des opportunités fiables, des contrats transparents et des paiements garantis sous séquestre.",
    whyTitle: "Pourquoi Rejoindre Boulot Man ?",
    whyDesc: "Une équipe dynamique et passionnée qui place l'excellence technologique au service de l'autonomisation économique en Afrique.",
    benefit1Title: "Télétravail Panafricain",
    benefit1Desc: "Travaillez depuis n'importe quel pays africain ou rejoignez nos hubs d'innovation régionaux avec flexibilité et autonomie.",
    benefit2Title: "Rémunération Compétitive & Actions",
    benefit2Desc: "Salaires attractifs alignés sur les standards internationaux, stock-options et primes de performance.",
    benefit3Title: "Couverture Santé & Bien-être",
    benefit3Desc: "Assurance médicale de premier ordre pour vous et vos proches, soutien bien-être et budget équipement informatique.",
    openPositionsTitle: "Postes Ouverts",
    openPositionsDesc: "Trouvez votre prochaine opportunité et participez à l'essor de la plateforme de services techniques leader en Afrique.",
    deptAll: "Tous",
    deptEngineering: "Ingénierie",
    deptOperations: "Opérations & Confiance",
    deptSales: "Ventes & Croissance",
    deptCustomer: "Expérience Client",
    btnApplyNow: "Postuler",
    ctaTitle: "Vous ne trouvez pas votre poste ?",
    ctaDesc: "Nous recherchons en permanence des talents exceptionnels en tech, produit et opérations. Déposez une candidature spontanée.",
    btnGeneralApp: "Candidature Spontanée",
    speculativeTitle: "Candidature Générale / Spontanée",
    speculativeDept: "Talents Généraux",
    speculativeLoc: "À distance",
    speculativeType: "Temps plein / Temps partiel",
    speculativeExp: "Tous niveaux",
    applyModalTitle: "Postuler :",
    successMsg: "🎉 Merci pour votre candidature ! Notre équipe recrutement étudiera votre profil sous 48 heures.",
    labelFullName: "Nom complet",
    phFullName: "Jean Dupont",
    labelEmail: "Adresse e-mail",
    phEmail: "jean@exemple.com",
    labelPhone: "Téléphone / WhatsApp",
    phPhone: "+250 788 123 456",
    labelLinkedIn: "Lien LinkedIn / Portfolio",
    labelCover: "Lettre de motivation / Pourquoi Boulot Man ?",
    phCover: "Présentez-nous votre parcours et vos motivations pour rejoindre l'aventure...",
    btnSubmitApplication: "Envoyer la candidature"
  }
};

export default function CareersPage() {
  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedJob, setSelectedJob] = useState<JobPosition | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", linkedin: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
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

  const departments = [
    { key: "All", label: t.deptAll },
    { key: "Engineering", label: t.deptEngineering },
    { key: "Operations & Trust", label: t.deptOperations },
    { key: "Sales & Growth", label: t.deptSales },
    { key: "Customer Experience", label: t.deptCustomer }
  ];

  const filteredJobs = selectedDept === "All" 
    ? JOBS_DATA 
    : JOBS_DATA.filter(j => j.department === selectedDept);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setSelectedJob(null);
      setFormData({ name: "", email: "", phone: "", linkedin: "", message: "" });
    }, 2500);
  };

  return (
    <div className={styles.page}>
      <Header />

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <iconify-icon icon="lucide:rocket" /> {t.heroBadge}
          </div>
          <h1 className={styles.heroTitle}>{t.heroTitle}</h1>
          <p className={styles.heroSubtitle}>
            {t.heroSubtitle}
          </p>
        </div>
      </section>

      <main className={styles.container}>
        {/* CULTURE & PERKS */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>{t.whyTitle}</h2>
            <p className={styles.sectionDesc}>
              {t.whyDesc}
            </p>
          </div>

          <div className={styles.grid3}>
            <div className={styles.benefitCard}>
              <div className={styles.benefitIconWrap}>
                <iconify-icon icon="lucide:globe-2" />
              </div>
              <h3 className={styles.benefitTitle}>{t.benefit1Title}</h3>
              <p className={styles.benefitDesc}>
                {t.benefit1Desc}
              </p>
            </div>

            <div className={styles.benefitCard}>
              <div className={styles.benefitIconWrap}>
                <iconify-icon icon="lucide:award" />
              </div>
              <h3 className={styles.benefitTitle}>{t.benefit2Title}</h3>
              <p className={styles.benefitDesc}>
                {t.benefit2Desc}
              </p>
            </div>

            <div className={styles.benefitCard}>
              <div className={styles.benefitIconWrap}>
                <iconify-icon icon="lucide:heart-pulse" />
              </div>
              <h3 className={styles.benefitTitle}>{t.benefit3Title}</h3>
              <p className={styles.benefitDesc}>
                {t.benefit3Desc}
              </p>
            </div>
          </div>
        </section>

        {/* OPEN POSITIONS */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>{t.openPositionsTitle}</h2>
            <p className={styles.sectionDesc}>
              {t.openPositionsDesc}
            </p>
          </div>

          {/* Department Filter Tabs */}
          <div className={styles.filterTabs}>
            {departments.map((dept) => (
              <button
                type="button"
                key={dept.key}
                onClick={() => setSelectedDept(dept.key)}
                className={`${styles.filterBtn} ${selectedDept === dept.key ? styles.filterBtnActive : ""}`}
              >
                {dept.label}
              </button>
            ))}
          </div>

          {/* Job Cards */}
          <div className={styles.jobsList}>
            {filteredJobs.map((job) => (
              <div key={job.id} className={styles.jobCard}>
                <div className={styles.jobInfo}>
                  <span className={styles.jobDept}>{job.department}</span>
                  <h3 className={styles.jobTitle}>{job.title}</h3>
                  <div className={styles.jobMeta}>
                    <span className={styles.jobMetaItem}>
                      <iconify-icon icon="lucide:map-pin" /> {job.location}
                    </span>
                    <span className={styles.jobMetaItem}>
                      <iconify-icon icon="lucide:clock" /> {job.type}
                    </span>
                    <span className={styles.jobMetaItem}>
                      <iconify-icon icon="lucide:briefcase" /> {job.experience}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedJob(job)}
                  className={styles.applyBtn}
                >
                  {t.btnApplyNow} <iconify-icon icon="lucide:arrow-right" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* CTA BANNER */}
        <section className={styles.cta}>
          <div>
            <h2 className={styles.ctaTitle}>{t.ctaTitle}</h2>
            <p className={styles.ctaDesc}>
              {t.ctaDesc}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSelectedJob({
              id: "speculative",
              title: t.speculativeTitle,
              department: t.speculativeDept,
              location: t.speculativeLoc,
              type: t.speculativeType,
              experience: t.speculativeExp,
            })}
            className={styles.ctaBtn}
          >
            {t.btnGeneralApp} <iconify-icon icon="lucide:send" />
          </button>
        </section>
      </main>

      <Footer />

      {/* JOB APPLICATION MODAL */}
      {selectedJob && (
        <div className={styles.modalOverlay} onClick={() => setSelectedJob(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setSelectedJob(null)}>×</button>
            <h2>{t.applyModalTitle} {selectedJob.title}</h2>
            <p style={{ color: "#64748b", fontSize: "14px", margin: "0 0 20px" }}>
              {selectedJob.department} • {selectedJob.location}
            </p>

            {submitted ? (
              <div className={styles.successMsg}>
                {t.successMsg}
              </div>
            ) : (
              <form onSubmit={handleApply}>
                <div className={styles.formGroup}>
                  <label>{t.labelFullName}</label>
                  <input
                    required
                    type="text"
                    placeholder={t.phFullName}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>{t.labelEmail}</label>
                  <input
                    required
                    type="email"
                    placeholder={t.phEmail}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>{t.labelPhone}</label>
                  <input
                    required
                    type="tel"
                    placeholder={t.phPhone}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>{t.labelLinkedIn}</label>
                  <input
                    type="url"
                    placeholder="https://linkedin.com/in/username"
                    value={formData.linkedin}
                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>{t.labelCover}</label>
                  <textarea
                    rows={3}
                    placeholder={t.phCover}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <button type="submit" className={styles.submitBtn}>
                  {t.btnSubmitApplication} <iconify-icon icon="lucide:send" />
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

