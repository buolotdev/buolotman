"use client";

import React, { useState, useEffect } from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { useRouter } from "next/navigation";
import styles from "./build-team.module.css";

const translations: Record<string, Record<string, any>> = {
  en: {
    heroTitle: "Build a Team",
    heroDesc: "Your on-demand technical workforce. Boulot Man assembles, deploys, and manages complete teams of verified professionals for construction, engineering, IT, renovation, and large-scale projects.",
    section1Title: "What Is Build a Team?",
    section1DescStart: "Build a Team is a structured Boulot Man service that allows clients to hire ",
    section1DescStrong: "ready-made, coordinated technical teams",
    section1DescEnd: " instead of managing individuals. It is ideal for projects that require multiple skills, long duration, or strict supervision.",
    card1Title: "Who It’s For",
    card1List: ["Homeowners & property developers", "Construction companies", "SMEs & startups", "NGOs & institutions", "Hotels & real estate owners", "Diaspora managing projects remotely"],
    card2Title: "What Problems It Solves",
    card2List: ["No recruitment stress", "No supervision gaps", "Reduced delays", "Clear accountability", "Controlled costs"],
    card3Title: "Team Types",
    card3List: ["Electrical teams", "Plumbing teams", "Construction & renovation teams", "ICT & networking teams", "Solar & renewable energy teams", "Mixed discipline teams"],
    howTitle: "How Build a Team Works",
    step1: "Client submits project request and requirements",
    step2: "Boulot Man designs team structure",
    step3: "Verified technicians are selected",
    step4: "Deployment, scheduling & coordination",
    step5: "Supervision, reporting & tracking",
    step6: "Completion, handover & warranty",
    pricingTitle: "Pricing Models",
    pricing1Title: "Pay Per Technician",
    pricing1Desc: "Daily or weekly rates for flexible staffing.",
    pricing2Title: "Pay Per Team",
    pricing2Desc: "Fixed pricing for defined projects.",
    pricing3Title: "Contract / Retainer",
    pricing3Desc: "Monthly deployment for companies & institutions.",
    compareTitle: "Concierge vs Build a Team",
    thFeature: "Feature",
    thConcierge: "Concierge",
    thBuildTeam: "Build a Team",
    row1Type: "Type",
    row1C: "On-demand management",
    row1B: "Full workforce",
    row2Size: "Team Size",
    row2C: "1–2 technicians",
    row2B: "3–50+ workers",
    row3Dur: "Duration",
    row3C: "Short tasks",
    row3B: "Multi-day / long-term",
    row4Sup: "Supervision",
    row4C: "Concierge coordinator",
    row4B: "Team leader / foreman",
    row5Best: "Best For",
    row5C: "Homes & offices",
    row5B: "Projects & construction",
    faqTitle: "Build a Team FAQ",
    faqs: [
      {
        q: "How fast can a team be deployed?",
        a: "Usually within 1–24 hours depending on size and location."
      },
      {
        q: "Are technicians verified?",
        a: "Yes. All team members are ID-verified, skill-assessed, and rated."
      },
      {
        q: "Can diaspora clients manage remotely?",
        a: "Yes. Reports, photos, and updates are provided remotely."
      }
    ],
    ctaTitle: "Build Your Team Today",
    ctaDesc: "Whether it’s a renovation, installation, or full project, Boulot Man gives you a ready workforce — fast, verified, and managed.",
    ctaBtn: "Request a Team"
  },
  fr: {
    heroTitle: "Créer une Équipe",
    heroDesc: "Votre main-d'œuvre technique sur mesure. Boulot Man compose, déploie et supervise des équipes complètes de professionnels vérifiés pour la construction, l'ingénierie, l'IT, la rénovation et les chantiers d'envergure.",
    section1Title: "Qu'est-ce que le service Créer une Équipe ?",
    section1DescStart: "Le service Créer une Équipe est une solution structurée Boulot Man permettant de recruter des ",
    section1DescStrong: "équipes techniques coordonnées et prêtes à l'emploi",
    section1DescEnd: " au lieu de gérer chaque intervenant individuellement. Idéal pour les projets complexes, de longue durée ou nécessitant un encadrement strict.",
    card1Title: "À qui cela s'adresse",
    card1List: ["Propriétaires & promoteurs immobiliers", "Entreprises du BTP & Génie civil", "PME & Startups en expansion", "ONG & institutions", "Hôtels & gestionnaires d'actifs", "Diaspora gérant des chantiers à distance"],
    card2Title: "Avantages & Solutions",
    card2List: ["Zéro stress de recrutement", "Encadrement et supervision continue", "Délais respectés et optimisés", "Responsabilité claire et unique", "Coûts maîtrisés et transparents"],
    card3Title: "Types d'équipes disponibles",
    card3List: ["Équipes Électriciens", "Équipes Plombiers & Sanitaires", "Équipes BTP & Rénovation", "Équipes Réseaux & Informatique", "Équipes Énergie Solaire & Renouvelable", "Équipes Multidisciplinaires"],
    howTitle: "Comment ça fonctionne",
    step1: "Soumission du cahier des charges et des besoins",
    step2: "Conception de la structure de l'équipe par Boulot Man",
    step3: "Sélection des techniciens et chefs d'équipe qualifiés",
    step4: "Déploiement, planning et coordination sur site",
    step5: "Supervision, rapports d'avancement et suivi",
    step6: "Fin de chantier, livraison et garantie",
    pricingTitle: "Modèles de Tarification",
    pricing1Title: "Paiement par Technicien",
    pricing1Desc: "Tarifs journaliers ou hebdomadaires pour renfort ponctuel.",
    pricing2Title: "Forfait par Équipe",
    pricing2Desc: "Budget fixe tout compris pour chantiers définis.",
    pricing3Title: "Contrat / Régie Mensuelle",
    pricing3Desc: "Mise à disposition continue pour entreprises & institutions.",
    compareTitle: "Conciergerie vs Créer une Équipe",
    thFeature: "Caractéristique",
    thConcierge: "Conciergerie",
    thBuildTeam: "Créer une Équipe",
    row1Type: "Type de service",
    row1C: "Gestion clé en main",
    row1B: "Main-d'œuvre complète",
    row2Size: "Taille d'équipe",
    row2C: "1 à 2 techniciens",
    row2B: "3 à 50+ ouvriers & ingénieurs",
    row3Dur: "Durée",
    row3C: "Missions courtes & urgentes",
    row3B: "Plusieurs jours / Long terme",
    row4Sup: "Supervision",
    row4C: "Coordinateur Concierge",
    row4B: "Chef d'équipe / Conducteur de travaux",
    row5Best: "Idéal pour",
    row5C: "Domiciles & petits commerces",
    row5B: "Grands projets & chantiers",
    faqTitle: "Foire Aux Questions",
    faqs: [
      {
        q: "En combien de temps l'équipe est-elle déployée ?",
        a: "Généralement entre 1h et 24h selon l'effectif demandé et la localisation."
      },
      {
        q: "Les ouvriers et techniciens sont-ils vérifiés ?",
        a: "Oui. Tous les membres d'équipe sont contrôlés (identité, qualifications et avis clients)."
      },
      {
        q: "La diaspora peut-elle superviser le chantier à distance ?",
        a: "Absolument. Rapports réguliers, photos, vidéos et suivi en temps réel sont fournis."
      }
    ],
    ctaTitle: "Constituez Votre Équipe Aujourd'hui",
    ctaDesc: "Rénovation, installation industrielle ou construction : bénéficiez d'une main-d'œuvre prête à intervenir, vérifiée et encadrée.",
    ctaBtn: "Demander une Équipe"
  }
};

export default function BuildATeamPage() {
  const router = useRouter();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
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
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <>
      <Header />

      <main className={styles.container}>
        {/* HERO */}
        <div className={styles.hero}>
          <h1>{t.heroTitle}</h1>
          <p>
            {t.heroDesc}
          </p>
        </div>

        {/* OVERVIEW */}
        <div className={styles.section}>
          <h2>{t.section1Title}</h2>
          <p>
            {t.section1DescStart}
            <strong>{t.section1DescStrong}</strong>
            {t.section1DescEnd}
          </p>

          <div className={styles.grid3}>
            <div className={styles.card}>
              <h3>{t.card1Title}</h3>
              <ul>
                {t.card1List.map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            <div className={styles.card}>
              <h3>{t.card2Title}</h3>
              <ul>
                {t.card2List.map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            <div className={styles.card}>
              <h3>{t.card3Title}</h3>
              <ul>
                {t.card3List.map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* HOW IT WORKS */}
        <div className={styles.section}>
          <h2>{t.howTitle}</h2>

          <div className={styles.flow}>
            <div className={styles.flowStep}><span>STEP 1</span><p>{t.step1}</p></div>
            <div className={styles.flowStep}><span>STEP 2</span><p>{t.step2}</p></div>
            <div className={styles.flowStep}><span>STEP 3</span><p>{t.step3}</p></div>
            <div className={styles.flowStep}><span>STEP 4</span><p>{t.step4}</p></div>
            <div className={styles.flowStep}><span>STEP 5</span><p>{t.step5}</p></div>
            <div className={styles.flowStep}><span>STEP 6</span><p>{t.step6}</p></div>
          </div>
        </div>

        {/* PRICING MODELS */}
        <div className={styles.section}>
          <h2>{t.pricingTitle}</h2>

          <div className={styles.grid3}>
            <div className={styles.card}>
              <h3>{t.pricing1Title}</h3>
              <p>{t.pricing1Desc}</p>
            </div>
            <div className={styles.card}>
              <h3>{t.pricing2Title}</h3>
              <p>{t.pricing2Desc}</p>
            </div>
            <div className={styles.card}>
              <h3>{t.pricing3Title}</h3>
              <p>{t.pricing3Desc}</p>
            </div>
          </div>
        </div>

        {/* CONCIERGE VS BUILD */}
        <div className={styles.section}>
          <h2>{t.compareTitle}</h2>

          <div className={styles.compare}>
            <table className={styles.compareTable}>
              <thead>
                <tr>
                  <th>{t.thFeature}</th>
                  <th>{t.thConcierge}</th>
                  <th>{t.thBuildTeam}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{t.row1Type}</td>
                  <td>{t.row1C}</td>
                  <td>{t.row1B}</td>
                </tr>
                <tr>
                  <td>{t.row2Size}</td>
                  <td>{t.row2C}</td>
                  <td>{t.row2B}</td>
                </tr>
                <tr>
                  <td>{t.row3Dur}</td>
                  <td>{t.row3C}</td>
                  <td>{t.row3B}</td>
                </tr>
                <tr>
                  <td>{t.row4Sup}</td>
                  <td>{t.row4C}</td>
                  <td>{t.row4B}</td>
                </tr>
                <tr>
                  <td>{t.row5Best}</td>
                  <td>{t.row5C}</td>
                  <td>{t.row5B}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className={styles.section}>
          <h2>{t.faqTitle}</h2>

          <div className={styles.faqCard}>
            {t.faqs.map((faq: any, idx: number) => (
              <div key={idx} className={styles.accordionItem} onClick={() => toggleFaq(idx + 1)}>
                <div className={styles.accordionTitle}>
                  <span>{faq.q}</span>
                  <span className={styles.accordionIcon}>{activeFaq === (idx + 1) ? "−" : "+"}</span>
                </div>
                {activeFaq === (idx + 1) && <div className={styles.accordionContent}>{faq.a}</div>}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className={styles.cta}>
          <div>
            <h2>{t.ctaTitle}</h2>
            <p>
              {t.ctaDesc}
            </p>
          </div>
          <div className={styles.ctaRight}>
            <button className={styles.ctaBtn} onClick={() => router.push("/login")}>
              {t.ctaBtn}
            </button>
          </div>
        </div>

      </main>

      <Footer />
    </>
  );
}

