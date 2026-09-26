"use client";

import React, { useState, useEffect } from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { useRouter } from "next/navigation";
import { api } from "@/app/lib/api";
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
    ctaBtn: "Request a Team",
    modalTitle: "Request a Technical Team",
    modalSub: "Specify your project needs and workforce requirements. Boulot Man will assemble, structure, and dispatch your verified team.",
    labelName: "Your Full Name *",
    labelEmail: "Email Address *",
    labelPhone: "Phone / WhatsApp Number *",
    labelTeamType: "Primary Trade / Team Type *",
    labelTeamSize: "Team Size Needed *",
    labelDuration: "Project Duration *",
    labelLocation: "Project Location / City *",
    labelDetails: "Project Scope & Requirements *",
    placeholderDetails: "Describe project scope, site conditions, required certifications, materials, and any deadlines...",
    btnSubmit: "Submit Team Request",
    btnSubmitting: "Submitting Request...",
    modalSuccess: "Your team request has been submitted successfully! A Boulot Man operations coordinator will contact you shortly to finalize details.",
    teamOpt1: "Electrical, Power & Solar PV",
    teamOpt2: "Plumbing, Water Sanitation & Networks",
    teamOpt3: "Civil Construction, Masonry & Finishing",
    teamOpt4: "Carpentry, Joinery & Woodwork",
    teamOpt5: "HVAC, Industrial Cooling & Cold Rooms",
    teamOpt6: "IT Infrastructure, CCTV & Fiber Optics",
    teamOpt7: "Welding, Metalwork & Steel Structures",
    teamOpt8: "Painting, Plastering & Drywall",
    teamOpt9: "Multi-Disciplinary Project Team",
    teamOptOther: "Other (Custom Technical Team)",
    sizeOpt1: "Small Squad (2–4 Technicians)",
    sizeOpt2: "Standard Crew (5–10 Technicians)",
    sizeOpt3: "Large Workforce (11–25 Workers)",
    sizeOpt4: "Major Industrial Team (25+ Workers)",
    durOpt1: "Immediate Emergency (1–3 Days)",
    durOpt2: "Short Term Project (1–4 Weeks)",
    durOpt3: "Medium Term Project (1–3 Months)",
    durOpt4: "Long-Term / Ongoing Retainer (3+ Months)"
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
    ctaBtn: "Demander une Équipe",
    modalTitle: "Demander une Équipe Technique",
    modalSub: "Précisez vos besoins et votre cahier des charges. Boulot Man assemble, structure et déploie votre équipe sur site.",
    labelName: "Nom et Prénom *",
    labelEmail: "Adresse E-mail *",
    labelPhone: "Numéro de Téléphone / WhatsApp *",
    labelTeamType: "Corps de Métier / Type d'Équipe *",
    labelTeamSize: "Taille d'Équipe Souhaitée *",
    labelDuration: "Durée Estimée du Chantier *",
    labelLocation: "Localisation du Projet / Ville *",
    labelDetails: "Description du Projet & Exigences *",
    placeholderDetails: "Décrivez l'envergure du projet, l'état du site, les certifications requises, l'outillage et les délais attendus...",
    btnSubmit: "Envoyer la Demande d'Équipe",
    btnSubmitting: "Envoi en cours...",
    modalSuccess: "Votre demande d'équipe a été soumise avec succès ! Un coordinateur d'opérations Boulot Man vous contactera rapidement.",
    teamOpt1: "Électricité, Énergie & Solaire PV",
    teamOpt2: "Plomberie, Sanitaire & Canalisations",
    teamOpt3: "BTP, Maçonnerie & Gros Œuvre",
    teamOpt4: "Menuiserie, Bois & Agencement",
    teamOpt5: "Climatisation, Froid Industriel & CVC",
    teamOpt6: "Réseaux Informatiques, Fibre & CCTV",
    teamOpt7: "Soudure, Métallerie & Charpentes",
    teamOpt8: "Peinture, Finitions & Plâtrerie",
    teamOpt9: "Équipe Multidisciplinaire de Chantier",
    teamOptOther: "Autre (Équipe Technique Sur Mesure)",
    sizeOpt1: "Petite Équipe (2 à 4 Techniciens)",
    sizeOpt2: "Équipe Standard (5 à 10 Techniciens)",
    sizeOpt3: "Effectif Important (11 à 25 Ouvriers)",
    sizeOpt4: "Grand Chantier Industriel (25+ Ouvriers)",
    durOpt1: "Intervention Urgente (1 à 3 Jours)",
    durOpt2: "Court Terme (1 à 4 Semaines)",
    durOpt3: "Moyen Terme (1 à 3 Mois)",
    durOpt4: "Long Terme / Contrat Continu (3+ Mois)"
  }
};

export default function BuildATeamPage() {
  const router = useRouter();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [lang, setLang] = useState("en");

  // Request a Team Modal State
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    team_type: "Electrical, Power & Solar PV",
    team_size: "Standard Crew (5–10 Technicians)",
    duration: "Short Term Project (1–4 Weeks)",
    location: "",
    details: "",
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const detailsBody = `[Build a Team Request]\nClient Name: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nLocation: ${formData.location}\nTeam Type: ${formData.team_type}\nTeam Size: ${formData.team_size}\nDuration: ${formData.duration}\n\nProject Scope & Requirements:\n${formData.details}`;

    const inquiryRecord = {
      id: `TEAM-${Date.now().toString().slice(-6)}`,
      created_at: new Date().toISOString(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      location: formData.location,
      team_type: formData.team_type,
      team_size: formData.team_size,
      duration: formData.duration,
      details: formData.details,
      status: "Pending Review"
    };

    if (typeof window !== "undefined") {
      try {
        const existing = JSON.parse(localStorage.getItem("boulotman_team_inquiries") || "[]");
        localStorage.setItem("boulotman_team_inquiries", JSON.stringify([inquiryRecord, ...existing]));
      } catch {}
    }

    try {
      await Promise.allSettled([
        api.submitInquiry({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          company_name: `${formData.team_type} (${formData.team_size})`.trim(),
          inquiry_type: "general",
          topic: "Build a Team Request",
          message: detailsBody,
          details: detailsBody,
        } as any),
        api.submitContactForm({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          topic: "Build a Team Request",
          message: detailsBody,
        }),
      ]);
    } catch {}

    setSuccess(true);
    setFormData({
      name: "",
      email: "",
      phone: "",
      team_type: "Electrical, Power & Solar PV",
      team_size: "Standard Crew (5–10 Technicians)",
      duration: "Short Term Project (1–4 Weeks)",
      location: "",
      details: "",
    });
    setLoading(false);
    setTimeout(() => {
      setShowModal(false);
      setSuccess(false);
    }, 3500);
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
            <button className={styles.ctaBtn} onClick={() => setShowModal(true)}>
              {t.ctaBtn}
            </button>
          </div>
        </div>

      </main>

      <Footer />

      {/* Request a Team Inquiry Modal */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.modalClose}
              onClick={() => setShowModal(false)}
              aria-label="Close modal"
            >
              ×
            </button>

            <div className={styles.modalHeader}>
              <h2>{t.modalTitle}</h2>
              <p>{t.modalSub}</p>
            </div>

            {success ? (
              <div className={styles.successMsg}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>🎉</div>
                {t.modalSuccess}
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className={styles.twoCol}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>{t.labelName}</label>
                    <input
                      className={styles.input}
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={lang === "fr" ? "ex: Marc Dubois" : "e.g. John Doe"}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>{t.labelEmail}</label>
                    <input
                      type="email"
                      className={styles.input}
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="client@domain.com"
                    />
                  </div>
                </div>

                <div className={styles.twoCol}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>{t.labelPhone}</label>
                    <input
                      className={styles.input}
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+229 97 00 00 00"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>{t.labelLocation}</label>
                    <input
                      className={styles.input}
                      required
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder={lang === "fr" ? "ex: Cotonou / Douala / Abidjan" : "e.g. Cotonou / Lagos / Abidjan"}
                    />
                  </div>
                </div>

                <div className={styles.twoCol}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>{t.labelTeamType}</label>
                    <select
                      className={styles.select}
                      value={formData.team_type}
                      onChange={(e) => setFormData({ ...formData, team_type: e.target.value })}
                    >
                      <option value="Electrical, Power & Solar PV">{t.teamOpt1}</option>
                      <option value="Plumbing, Water Sanitation & Networks">{t.teamOpt2}</option>
                      <option value="Civil Construction, Masonry & Finishing">{t.teamOpt3}</option>
                      <option value="Carpentry, Joinery & Woodwork">{t.teamOpt4}</option>
                      <option value="HVAC, Industrial Cooling & Cold Rooms">{t.teamOpt5}</option>
                      <option value="IT Infrastructure, CCTV & Fiber Optics">{t.teamOpt6}</option>
                      <option value="Welding, Metalwork & Steel Structures">{t.teamOpt7}</option>
                      <option value="Painting, Plastering & Drywall">{t.teamOpt8}</option>
                      <option value="Multi-Disciplinary Project Team">{t.teamOpt9}</option>
                      <option value="Other (Custom Technical Team)">{t.teamOptOther}</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>{t.labelTeamSize}</label>
                    <select
                      className={styles.select}
                      value={formData.team_size}
                      onChange={(e) => setFormData({ ...formData, team_size: e.target.value })}
                    >
                      <option value="Small Squad (2–4 Technicians)">{t.sizeOpt1}</option>
                      <option value="Standard Crew (5–10 Technicians)">{t.sizeOpt2}</option>
                      <option value="Large Workforce (11–25 Workers)">{t.sizeOpt3}</option>
                      <option value="Major Industrial Team (25+ Workers)">{t.sizeOpt4}</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>{t.labelDuration}</label>
                  <select
                    className={styles.select}
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  >
                    <option value="Immediate Emergency (1–3 Days)">{t.durOpt1}</option>
                    <option value="Short Term Project (1–4 Weeks)">{t.durOpt2}</option>
                    <option value="Medium Term Project (1–3 Months)">{t.durOpt3}</option>
                    <option value="Long-Term / Ongoing Retainer (3+ Months)">{t.durOpt4}</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>{t.labelDetails}</label>
                  <textarea
                    className={styles.textarea}
                    required
                    rows={4}
                    value={formData.details}
                    onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                    placeholder={t.placeholderDetails}
                  />
                </div>

                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={loading}
                >
                  {loading ? t.btnSubmitting : t.btnSubmit}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}

