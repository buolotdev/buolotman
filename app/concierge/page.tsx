"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import styles from "./concierge.module.css";
import { api } from "@/app/lib/api";

const translations: Record<string, Record<string, any>> = {
  en: {
    heroTitle: "Boulot Man Concierge Services",
    heroSubtitle: "A premium, fully managed technical service designed for individuals, families, companies, and diaspora clients who want all their technical needs handled professionally — without stress.",
    section1Title: "What Is Boulot Man Concierge?",
    section1DescStart: "Boulot Man Concierge is a ",
    section1DescStrong: "VIP, hands-off service",
    section1DescEnd: " where Boulot Man manages everything for you — from technician selection to supervision, reporting, follow-up, and quality control.",
    card1Title: "Who It's For",
    card1List: ["Busy professionals", "Families & homeowners", "Property managers & landlords", "Companies & offices", "Embassies, NGOs & institutions", "Diaspora managing property remotely"],
    card2Title: "Why Concierge?",
    card2List: ["No searching for technicians", "No coordination stress", "Priority response", "Supervised work", "Quality guarantee"],
    card3Title: "Service Coverage",
    card3List: ["Homes & apartments", "Offices & commercial spaces", "Facilities & compounds", "Remote & diaspora properties"],
    howTitle: "How Concierge Works",
    step1: "Client requests support via phone, WhatsApp, or website",
    step2: "Needs assessment (issue, urgency, location, schedule)",
    step3: "Verified technician is assigned",
    step4: "Service is supervised by a concierge coordinator",
    step5: "Completion report, photos & feedback",
    step6: "Payment & after-service follow-up",
    servicesTitle: "Services Covered",
    cat1Title: "Home & Office",
    cat1List: ["Electrical repairs & installations", "Plumbing & sewage", "AC & refrigeration", "Carpentry & furniture repair", "Painting & renovations"],
    cat2Title: "Security & Energy",
    cat2List: ["CCTV & access control", "Solar systems", "Generators & backup power", "Smart home systems"],
    cat3Title: "Special Services",
    cat3List: ["Appliance repairs", "Mobile mechanics", "IT & networking", "Moving & handyman tasks"],
    faqTitle: "Concierge FAQ",
    faqs: [
      {
        q: "How is Concierge different from regular services?",
        a: "Concierge means Boulot Man manages everything for you. Regular services require you to select and coordinate technicians yourself."
      },
      {
        q: "Is there a subscription fee?",
        a: "Yes. Packages include Basic, Standard, Premium, and Corporate plans. Pricing depends on usage level and response priority."
      },
      {
        q: "Can diaspora clients use Concierge?",
        a: "Absolutely. Clients receive photos, reports, and updates remotely."
      },
      {
        q: "How fast is response time?",
        a: "Emergencies: within 1 hour. Regular requests: same day."
      }
    ],
    ctaTitle: "Let Us Handle Everything",
    ctaDesc: "Stop managing technicians. Focus on your life or business while Boulot Man Concierge takes care of the rest.",
    ctaBtn: "Request Concierge Service",
    modalTitle: "Request VIP Concierge",
    modalSuccess: "Your request has been received. Our Concierge team will contact you shortly!",
    labelName: "Full Name",
    labelEmail: "Email",
    labelPhone: "Phone Number",
    labelHelp: "How can we help?",
    btnSubmit: "Send Request",
    btnSubmitting: "Submitting..."
  },
  fr: {
    heroTitle: "Services Conciergerie Boulot Man",
    heroSubtitle: "Un service technique haut de gamme entièrement managé, conçu pour les particuliers, familles, entreprises et la diaspora souhaitant déléguer tous leurs travaux en toute sérénité.",
    section1Title: "Qu'est-ce que la Conciergerie Boulot Man ?",
    section1DescStart: "La Conciergerie Boulot Man est un ",
    section1DescStrong: "service VIP clé en main",
    section1DescEnd: " où Boulot Man gère l'intégralité de vos besoins — du choix des techniciens jusqu'à la supervision, les rapports d'intervention et le contrôle qualité.",
    card1Title: "À qui s'adresse ce service",
    card1List: ["Professionnels & cadres actifs", "Familles & propriétaires résidents", "Gestionnaires d'immeubles & bailleurs", "Entreprises, sièges & agences", "Ambassades, ONG & institutions", "Diaspora gérant leur patrimoine à distance"],
    card2Title: "Pourquoi la Conciergerie ?",
    card2List: ["Plus besoin de chercher des artisans", "Zéro stress d'organisation", "Interventions en priorité absolue", "Travaux supervisés par un régisseur", "Garantie satisfaction et conformité"],
    card3Title: "Périmètre d'intervention",
    card3List: ["Résidences, villas & appartements", "Bureaux & locaux professionnels", "Complexes immobiliers & domaines", "Propriétés gérées pour la diaspora"],
    howTitle: "Fonctionnement du Service",
    step1: "Demande d'intervention par téléphone, WhatsApp ou formulaire",
    step2: "Diagnostic des besoins (nature du problème, urgence, lieu)",
    step3: "Sélection et affectation du technicien certifié",
    step4: "Supervision du chantier par un coordinateur dédié",
    step5: "Rapport d'intervention détaillé, photos et validation",
    step6: "Paiement sécurisé et suivi après-service",
    servicesTitle: "Prestations Prises en Charge",
    cat1Title: "Bâtiment & Résidentiel",
    cat1List: ["Dépannage et installations électriques", "Plomberie & assainissement", "Climatisation & réfrigération", "Menuiserie & mobilier", "Peinture & rénovations intérieures"],
    cat2Title: "Sécurité & Énergie",
    cat2List: ["Vidéosurveillance & contrôle d'accès", "Installations solaires photovoltaïques", "Groupes électrogènes & onduleurs", "Systèmes connectés & domotique"],
    cat3Title: "Services Spéciaux",
    cat3List: ["Réparation d'électroménager", "Mécanique mobile d'urgence", "Support réseau & informatique", "Déménagement & petits travaux"],
    faqTitle: "Foire Aux Questions Conciergerie",
    faqs: [
      {
        q: "En quoi la Conciergerie diffère-t-elle du service classique ?",
        a: "Avec la Conciergerie, Boulot Man prend tout en charge de A à Z avec un coordinateur dédié. Sur le service classique, vous choisissez et pilotez vous-même les techniciens."
      },
      {
        q: "Existe-t-il des formules d'abonnement ?",
        a: "Oui. Des forfaits Basic, Standard, Premium et Entreprise sont disponibles selon la fréquence des interventions et le niveau d'urgence."
      },
      {
        q: "La diaspora peut-elle utiliser la Conciergerie ?",
        a: "Tout à fait. Nous transmettons rapports, photos et suivis en temps réel pour une gestion transparente de vos biens à distance."
      },
      {
        q: "Quel est le délai d'intervention ?",
        a: "Urgences : moins d'une heure. Demandes standards : dans la journée."
      }
    ],
    ctaTitle: "Confiez-nous la gestion de vos travaux",
    ctaDesc: "Ne perdez plus de temps avec les artisans. Concentrez-vous sur vos priorités pendant que la Conciergerie Boulot Man s'occupe de tout.",
    ctaBtn: "Demander le Service Conciergerie",
    modalTitle: "Demander la Conciergerie VIP",
    modalSuccess: "Votre demande a été enregistrée. Notre équipe Conciergerie vous contactera dans les plus brefs délais !",
    labelName: "Nom complet",
    labelEmail: "Adresse e-mail",
    labelPhone: "Numéro de téléphone",
    labelHelp: "Comment pouvons-nous vous aider ?",
    btnSubmit: "Envoyer la demande",
    btnSubmitting: "Envoi en cours..."
  }
};

export default function ConciergePage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", details: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.submitInquiry({ ...formData, inquiry_type: "concierge" });
      setSuccess(true);
      setFormData({ name: "", email: "", phone: "", details: "" });
      setTimeout(() => {
        setShowModal(false);
        setSuccess(false);
      }, 3000);
    } catch (err) {
      alert("Failed to submit inquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <Header />

      <main className={styles.mainContent}>
        {/* HERO */}
        <div className={styles.hero}>
          <h1 className={styles.heroTitle}>{t.heroTitle}</h1>
          <p className={styles.heroSubtitle}>
            {t.heroSubtitle}
          </p>
        </div>

        {/* OVERVIEW */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>{t.section1Title}</h2>
          <p className={styles.sectionDesc}>
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
          <h2 className={styles.sectionTitle}>{t.howTitle}</h2>
          <div className={styles.flow}>
            <div className={styles.flowStep}>
              <span className={styles.stepLabel}>STEP 1</span>
              <p>{t.step1}</p>
            </div>
            <div className={styles.flowStep}>
              <span className={styles.stepLabel}>STEP 2</span>
              <p>{t.step2}</p>
            </div>
            <div className={styles.flowStep}>
              <span className={styles.stepLabel}>STEP 3</span>
              <p>{t.step3}</p>
            </div>
            <div className={styles.flowStep}>
              <span className={styles.stepLabel}>STEP 4</span>
              <p>{t.step4}</p>
            </div>
            <div className={styles.flowStep}>
              <span className={styles.stepLabel}>STEP 5</span>
              <p>{t.step5}</p>
            </div>
            <div className={styles.flowStep}>
              <span className={styles.stepLabel}>STEP 6</span>
              <p>{t.step6}</p>
            </div>
          </div>
        </div>

        {/* SERVICES COVERED */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>{t.servicesTitle}</h2>
          <div className={styles.grid3}>
            <div className={styles.card}>
              <h3>{t.cat1Title}</h3>
              <ul>
                {t.cat1List.map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
            <div className={styles.card}>
              <h3>{t.cat2Title}</h3>
              <ul>
                {t.cat2List.map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
            <div className={styles.card}>
              <h3>{t.cat3Title}</h3>
              <ul>
                {t.cat3List.map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
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
                  {faq.q}
                  <span>{activeFaq === index ? "−" : "+"}</span>
                </div>
                {activeFaq === index && (
                  <div className={styles.accordionContent}>
                    {faq.a}
                  </div>
                )}
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
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <button className={styles.ctaBtn} onClick={() => setShowModal(true)}>
              {t.ctaBtn}
            </button>
          </div>
        </div>
      </main>

      <Footer />

      {/* Inquiry Modal */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setShowModal(false)}>×</button>
            <h2>{t.modalTitle}</h2>
            
            {success ? (
              <div className={styles.successMsg}>
                {t.modalSuccess}
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <label>{t.labelName}</label>
                  <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder={lang === "fr" ? "Votre nom" : "Your name"} />
                </div>
                <div className={styles.formGroup}>
                  <label>{t.labelEmail}</label>
                  <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="your@email.com" />
                </div>
                <div className={styles.formGroup}>
                  <label>{t.labelPhone}</label>
                  <input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+123..." />
                </div>
                <div className={styles.formGroup}>
                  <label>{t.labelHelp}</label>
                  <textarea required value={formData.details} onChange={e => setFormData({...formData, details: e.target.value})} rows={4} placeholder={lang === "fr" ? "Décrivez vos besoins..." : "Describe your needs..."} />
                </div>
                <button type="submit" className={styles.submitBtn} disabled={loading}>
                  {loading ? t.btnSubmitting : t.btnSubmit}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

