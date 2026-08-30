"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import styles from "./page.module.css";

const translations: Record<string, Record<string, any>> = {
  en: {
    heroTitle: "IT On-Demand Services",
    heroDesc: "Fast, reliable, professional IT support — when you need it. Boulot Man IT On-Demand provides certified technicians and engineers for homes, businesses, institutions, and complex technical environments.",
    section1Title: "What Is IT On-Demand?",
    section1Desc: "Boulot Man IT On-Demand Services allow you to access expert IT support without hiring full-time staff. Whether you need quick troubleshooting, system installation, cybersecurity, or infrastructure deployment, our verified professionals are available on-site or remotely.",
    badge1: "Who It’s For",
    badge1List: ["Homes & individuals", "SMEs & startups", "Corporate offices", "Schools & institutions", "NGOs & projects", "Construction & engineering sites"],
    badge2: "What Problems It Solves",
    badge2List: ["System downtime", "Network failures", "Cybersecurity risks", "Lack of in-house IT staff", "Complex technical setups"],
    badge3: "Service Modes",
    badge3List: ["On-site IT support", "Remote IT assistance", "Project-based deployment", "Recurring IT support contracts"],
    servicesTitle: "IT Services We Offer",
    cat1Title: "Hardware & Devices",
    cat1List: ["Laptop & desktop troubleshooting", "Hardware upgrades & repairs", "Printer & office equipment setup", "System diagnostics & optimization"],
    cat2Title: "Networking & Infrastructure",
    cat2List: ["Wi-Fi & LAN/WAN installation", "Router & firewall configuration", "Structured cabling", "Server room setup"],
    cat3Title: "Cybersecurity & Data",
    cat3List: ["Antivirus & endpoint protection", "System security audits", "Data backup & recovery", "Cloud security configuration"],
    cat4Title: "Software & Systems",
    cat4List: ["OS installation (Windows, Linux, macOS)", "Business software setup", "Updates & patch management", "Remote troubleshooting"],
    cat5Title: "Smart Home & Office",
    cat5List: ["Smart lighting & automation", "IoT device setup", "Smart security systems", "Platform integrations"],
    cat6Title: "Business & Enterprise IT",
    cat6List: ["IT consulting & planning", "POS & business systems", "Digital transformation", "IT support contracts"],
    howTitle: "How IT On-Demand Works",
    step1: "Client submits IT request",
    step2: "Needs assessment & urgency check",
    step3: "Technician or engineer assigned",
    step4: "On-site or remote support delivered",
    step5: "Testing & confirmation",
    step6: "Payment & optional follow-up",
    faqTitle: "IT On-Demand FAQ",
    faqs: [
      {
        question: "Do you provide remote IT support?",
        answer: "Yes. Many issues can be resolved remotely for faster response."
      },
      {
        question: "Are IT technicians verified?",
        answer: "All IT professionals are ID-verified, skill-assessed, and rated."
      },
      {
        question: "Can companies get recurring IT support?",
        answer: "Yes. Monthly and annual IT support contracts are available."
      }
    ],
    ctaTitle: "Get IT Support Now",
    ctaDesc: "From urgent fixes to complex IT deployments, Boulot Man gives you instant access to trusted IT professionals.",
    ctaButton: "Request IT Support"
  },
  fr: {
    heroTitle: "Services Informatiques sur Demande",
    heroDesc: "Support informatique rapide, fiable et professionnel — quand vous en avez besoin. Boulot Man IT met à votre disposition des techniciens et ingénieurs certifiés pour particuliers, entreprises et institutions.",
    section1Title: "Qu'est-ce que l'IT sur Demande ?",
    section1Desc: "Les services informatiques sur demande Boulot Man vous permettent d'accéder à une expertise de pointe sans embaucher à temps plein. Dépannage rapide, installation réseau, cybersécurité ou déploiement d'infrastructures : nos professionnels vérifiés interviennent sur site ou à distance.",
    badge1: "À qui cela s'adresse",
    badge1List: ["Particuliers & résidences", "PME & Startups", "Bureaux d'entreprises", "Écoles & universités", "ONG & projets de développement", "Chantiers & sites d'ingénierie"],
    badge2: "Problèmes résolus",
    badge2List: ["Pannes & temps d'arrêt système", "Défaillances de connexion réseau", "Risques de cybersécurité", "Absence d'équipe IT interne", "Configurations techniques complexes"],
    badge3: "Modes d'intervention",
    badge3List: ["Assistance sur site", "Support à distance (Télémaintenance)", "Déploiement par projet", "Contrats de maintenance récurrents"],
    servicesTitle: "Nos Prestations Informatiques",
    cat1Title: "Matériel & Équipements",
    cat1List: ["Dépannage PC & Mac", "Réparation et mise à niveau composants", "Configuration imprimantes et périphériques", "Diagnostic et optimisation système"],
    cat2Title: "Réseaux & Infrastructures",
    cat2List: ["Installation Wi-Fi & LAN/WAN", "Configuration routeurs et pare-feu", "Câblage structuré et baie de brassage", "Aménagement de salle serveurs"],
    cat3Title: "Cybersécurité & Données",
    cat3List: ["Antivirus et protection des postes", "Audits de sécurité informatique", "Sauvegarde et récupération de données", "Sécurisation des environnements Cloud"],
    cat4Title: "Logiciels & Systèmes",
    cat4List: ["Installation OS (Windows, Linux, macOS)", "Déploiement logiciels professionnels", "Gestion des mises à jour & correctifs", "Téléassistance en direct"],
    cat5Title: "Domotique & Bureaux Intelligents",
    cat5List: ["Éclairage intelligent et automatisation", "Configuration appareils connectés (IoT)", "Systèmes de surveillance IP", "Intégrations de plateformes"],
    cat6Title: "IT Entreprise & Conseil",
    cat6List: ["Conseil et stratégie informatique", "Systèmes de caisse (POS) et ERP", "Transformation numérique", "Contrats de support infogérance"],
    howTitle: "Comment ça marche",
    step1: "Soumission de votre besoin IT",
    step2: "Évaluation et analyse de l'urgence",
    step3: "Attribution du technicien ou ingénieur",
    step4: "Intervention sur site ou à distance",
    step5: "Tests et validation du bon fonctionnement",
    step6: "Paiement sécurisé et suivi",
    faqTitle: "Foire Aux Questions IT",
    faqs: [
      {
        question: "Proposez-vous une assistance informatique à distance ?",
        answer: "Oui. De nombreux diagnostics et résolutions logicielles peuvent être effectués rapidement à distance."
      },
      {
        question: "Les techniciens informatiques sont-ils certifiés ?",
        answer: "Tous nos spécialistes font l'objet d'une vérification d'identité, d'un test de compétences et sont évalués par les clients."
      },
      {
        question: "Les entreprises peuvent-elles souscrire un contrat régulier ?",
        answer: "Absolument. Des formules de maintenance mensuelle ou annuelle sont disponibles sur mesure."
      }
    ],
    ctaTitle: "Obtenir un Support Informatique Immédiat",
    ctaDesc: "De la panne urgente au déploiement d'infrastructures complètes, Boulot Man vous donne un accès direct aux meilleurs experts IT.",
    ctaButton: "Demander une Intervention IT"
  }
};

export default function ITOnDemandPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
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

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className={styles.page}>
      <Header />

      <div className={styles.container}>
        {/* HERO */}
        <div className={styles.hero}>
          <h1 className={styles.heroTitle}>{t.heroTitle}</h1>
          <p className={styles.heroDesc}>
            {t.heroDesc}
          </p>
        </div>

        {/* OVERVIEW */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>{t.section1Title}</h2>
          <p className={styles.sectionDesc}>
            {t.section1Desc}
          </p>

          <div className={styles.grid3}>
            <div className={styles.card}>
              <span className={styles.badge}>{t.badge1}</span>
              <ul className={styles.cardList}>
                {t.badge1List.map((item: string, i: number) => (
                  <li key={i} className={styles.cardListItem}>{item}</li>
                ))}
              </ul>
            </div>

            <div className={styles.card}>
              <span className={styles.badge}>{t.badge2}</span>
              <ul className={styles.cardList}>
                {t.badge2List.map((item: string, i: number) => (
                  <li key={i} className={styles.cardListItem}>{item}</li>
                ))}
              </ul>
            </div>

            <div className={styles.card}>
              <span className={styles.badge}>{t.badge3}</span>
              <ul className={styles.cardList}>
                {t.badge3List.map((item: string, i: number) => (
                  <li key={i} className={styles.cardListItem}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* SERVICES */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>{t.servicesTitle}</h2>

          <div className={styles.grid3}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>{t.cat1Title}</h3>
              <ul className={styles.cardList}>
                {t.cat1List.map((item: string, i: number) => (
                  <li key={i} className={styles.cardListItem}>{item}</li>
                ))}
              </ul>
            </div>

            <div className={styles.card}>
              <h3 className={styles.cardTitle}>{t.cat2Title}</h3>
              <ul className={styles.cardList}>
                {t.cat2List.map((item: string, i: number) => (
                  <li key={i} className={styles.cardListItem}>{item}</li>
                ))}
              </ul>
            </div>

            <div className={styles.card}>
              <h3 className={styles.cardTitle}>{t.cat3Title}</h3>
              <ul className={styles.cardList}>
                {t.cat3List.map((item: string, i: number) => (
                  <li key={i} className={styles.cardListItem}>{item}</li>
                ))}
              </ul>
            </div>

            <div className={styles.card}>
              <h3 className={styles.cardTitle}>{t.cat4Title}</h3>
              <ul className={styles.cardList}>
                {t.cat4List.map((item: string, i: number) => (
                  <li key={i} className={styles.cardListItem}>{item}</li>
                ))}
              </ul>
            </div>

            <div className={styles.card}>
              <h3 className={styles.cardTitle}>{t.cat5Title}</h3>
              <ul className={styles.cardList}>
                {t.cat5List.map((item: string, i: number) => (
                  <li key={i} className={styles.cardListItem}>{item}</li>
                ))}
              </ul>
            </div>

            <div className={styles.card}>
              <h3 className={styles.cardTitle}>{t.cat6Title}</h3>
              <ul className={styles.cardList}>
                {t.cat6List.map((item: string, i: number) => (
                  <li key={i} className={styles.cardListItem}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* HOW IT WORKS */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>{t.howTitle}</h2>

          <div className={styles.flow}>
            <div className={styles.flowStep}><span className={styles.flowStepBadge}>STEP 1</span><p className={styles.flowStepDesc}>{t.step1}</p></div>
            <div className={styles.flowStep}><span className={styles.flowStepBadge}>STEP 2</span><p className={styles.flowStepDesc}>{t.step2}</p></div>
            <div className={styles.flowStep}><span className={styles.flowStepBadge}>STEP 3</span><p className={styles.flowStepDesc}>{t.step3}</p></div>
            <div className={styles.flowStep}><span className={styles.flowStepBadge}>STEP 4</span><p className={styles.flowStepDesc}>{t.step4}</p></div>
            <div className={styles.flowStep}><span className={styles.flowStepBadge}>STEP 5</span><p className={styles.flowStepDesc}>{t.step5}</p></div>
            <div className={styles.flowStep}><span className={styles.flowStepBadge}>STEP 6</span><p className={styles.flowStepDesc}>{t.step6}</p></div>
          </div>
        </div>

        {/* FAQ */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>{t.faqTitle}</h2>

          <div className={styles.card}>
            {t.faqs.map((faq: any, index: number) => (
              <div 
                key={index} 
                className={styles.accordionItem} 
                onClick={() => toggleFaq(index)}
              >
                <div className={styles.accordionTitle}>
                  {faq.question} 
                  <span className={styles.accordionIcon}>
                    {openFaqIndex === index ? "−" : "+"}
                  </span>
                </div>
                {openFaqIndex === index && (
                  <div className={styles.accordionContent}>{faq.answer}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className={styles.cta}>
          <div>
            <h2 className={styles.ctaTitle}>{t.ctaTitle}</h2>
            <p className={styles.ctaDesc}>
              {t.ctaDesc}
            </p>
          </div>
          <Link href="/post-task" className={styles.ctaButton}>
            {t.ctaButton}
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}

