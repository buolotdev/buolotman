"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import styles from "./dispute-resolution.module.css";
import { api } from "@/app/lib/api";

const translations: Record<string, Record<string, any>> = {
  en: {
    heroTitle: "Dispute Resolution",
    heroSubtitle: "Boulot Man provides a structured, fair, and transparent dispute resolution process to protect clients, technicians, freelancers, companies, and enterprise partners.",
    section1Title: "What Is Dispute Resolution?",
    section1Desc: "Dispute Resolution is the process used when a disagreement arises between a client and a service provider regarding work quality, scope, payment, delays, or conduct. Boulot Man acts as a neutral facilitator to ensure fairness and accountability.",
    card1Title: "Who Can Raise a Dispute",
    card1List: ["Clients", "Technicians & Free Agents", "Companies", "Enterprise partners"],
    card2Title: "When to Raise a Dispute",
    card2List: ["Incomplete or poor-quality work", "Payment disagreements", "Missed deadlines", "Misrepresentation", "Professional misconduct"],
    card3Title: "What Is Protected",
    card3List: ["Escrow-held payments", "Job agreements", "Milestone approvals", "Platform integrity"],
    howTitle: "How the Dispute Process Works",
    step1: "Dispute is raised via dashboard",
    step2: "Automatic escrow hold (if applicable)",
    step3: "Evidence submission by both parties",
    step4: "Boulot Man review & mediation",
    step5: "Resolution decision issued",
    step6: "Payment release, refund, or correction",
    typesTitle: "Types of Disputes",
    type1Title: "Payment Disputes",
    type1List: ["Non-payment", "Partial payment disagreements", "Escrow release conflicts"],
    type2Title: "Service Quality Disputes",
    type2List: ["Work not meeting agreed standards", "Incomplete delivery", "Unauthorized changes"],
    type3Title: "Conduct & Compliance",
    type3List: ["Professional misconduct", "Safety violations", "Policy breaches"],
    faqTitle: "Dispute Resolution FAQ",
    faqs: [
      {
        q: "Is Boulot Man a legal court?",
        a: "No. Boulot Man provides platform-level mediation and facilitation. Legal disputes may still be pursued independently if necessary."
      },
      {
        q: "How long does resolution take?",
        a: "Most disputes are resolved within 3–7 business days, depending on complexity and evidence availability."
      },
      {
        q: "Can funds be refunded?",
        a: "Yes. Escrow funds may be refunded, partially released, or reallocated based on the resolution outcome."
      },
      {
        q: "Does raising disputes affect ratings?",
        a: "Abuse of the dispute system may affect ratings or account standing. Legitimate disputes do not penalize users."
      }
    ],
    ctaTitle: "Need Help Resolving an Issue?",
    ctaDesc: "If you have an active task, please raise a dispute from your dashboard. For general inquiries, feel free to contact us.",
    btnDashboard: "Go to Dashboard",
    btnContactSupport: "Contact Support",
    modalTitle: "Contact Support",
    modalSuccess: "Your message has been received. Our support team will get back to you!",
    labelName: "Full Name",
    labelEmail: "Email",
    labelPhone: "Phone Number (Optional)",
    labelHelp: "How can we help?",
    btnSend: "Send Message",
    btnSending: "Submitting..."
  },
  fr: {
    heroTitle: "Résolution des Litiges & Médiation",
    heroSubtitle: "Boulot Man assure une procédure de médiation structurée, équitable et transparente pour protéger clients, techniciens, indépendants et entreprises partenaires.",
    section1Title: "Qu'est-ce que la Résolution des Litiges ?",
    section1Desc: "La résolution des litiges intervient lorsqu'un désaccord survient entre un client et un prestataire sur la qualité des travaux, le périmètre, les délais ou le paiement. Boulot Man agit comme médiateur neutre pour garantir une issue juste.",
    card1Title: "Qui peut ouvrir un litige",
    card1List: ["Clients particuliers", "Techniciens & Artisans indépendants", "Entreprises prestataires", "Partenaires Entreprise & BTP"],
    card2Title: "Quand ouvrir un litige",
    card2List: ["Travail inachevé ou non conforme", "Désaccord sur le montant ou le paiement", "Non-respect flagrant des délais", "Fausse déclaration de compétences", "Manquement aux règles professionnelles"],
    card3Title: "Éléments protégés",
    card3List: ["Fonds bloqués sous séquestre", "Contrats et devis de mission", "Validation des étapes et jalons", "Intégrité et sécurité du marché"],
    howTitle: "Étapes de la Procédure de Litige",
    step1: "Ouverture du litige depuis le tableau de bord",
    step2: "Blocage conservatoire automatique du séquestre",
    step3: "Dépôt des éléments de preuve par chaque partie",
    step4: "Examen des pièces et médiation par Boulot Man",
    step5: "Notification de la décision arbitrale",
    step6: "Déblocage des fonds, remboursement ou reprise des travaux",
    typesTitle: "Types de Litiges Pris en Charge",
    type1Title: "Litiges Financiers",
    type1List: ["Refus de paiement injustifié", "Contestation sur les montants", "Conflit sur le déblocage du séquestre"],
    type2Title: "Litiges de Qualité de Service",
    type2List: ["Non-conformité aux normes convenues", "Prestation incomplète ou bâclée", "Modifications non autorisées sur le chantier"],
    type3Title: "Comportement & Conformité",
    type3List: ["Comportement inapproprié", "Non-respect des règles de sécurité", "Violation des conditions d'utilisation"],
    faqTitle: "Foire Aux Questions Médiation",
    faqs: [
      {
        q: "Boulot Man est-il un tribunal juridique ?",
        a: "Non. Boulot Man fournit une médiation contractuelle sur sa plateforme. Les parties conservent leur droit de recours judiciaire indépendant si nécessaire."
      },
      {
        q: "Quel est le délai de traitement d'un litige ?",
        a: "La majorité des dossiers sont arbitrés sous 3 à 7 jours ouvrés selon la réactivité des parties et les preuves fournies."
      },
      {
        q: "Le client peut-il être remboursé ?",
        a: "Oui. Selon les conclusions de la médiation, les fonds sous séquestre peuvent être remboursés en totalité, partiellement ou réalloués."
      },
      {
        q: "Ouvrir un litige impacte-t-il la note ou la réputation ?",
        a: "L'ouverture légitime d'un litige n'a aucun impact négatif. Seuls les abus manifestes peuvent affecter le statut du compte."
      }
    ],
    ctaTitle: "Besoin d'aide pour régler un différend ?",
    ctaDesc: "Si vous avez une tâche en cours, ouvrez un litige directement depuis votre tableau de bord. Pour toute autre question, contactez notre support.",
    btnDashboard: "Tableau de Bord",
    btnContactSupport: "Contacter le Support",
    modalTitle: "Contacter le Support",
    modalSuccess: "Votre message a été bien reçu. Notre équipe d'assistance vous répondra très rapidement !",
    labelName: "Nom complet",
    labelEmail: "Adresse e-mail",
    labelPhone: "Numéro de téléphone (facultatif)",
    labelHelp: "Comment pouvons-nous vous aider ?",
    btnSend: "Envoyer le message",
    btnSending: "Envoi en cours..."
  }
};

export default function DisputeResolutionPage() {
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
      await api.submitContact(formData);
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
            {t.section1Desc}
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

        {/* TYPES */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>{t.typesTitle}</h2>
          <div className={styles.grid3}>
            <div className={styles.card}>
              <h3>{t.type1Title}</h3>
              <ul>
                {t.type1List.map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
            <div className={styles.card}>
              <h3>{t.type2Title}</h3>
              <ul>
                {t.type2List.map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
            <div className={styles.card}>
              <h3>{t.type3Title}</h3>
              <ul>
                {t.type3List.map((item: string, i: number) => (
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
          <div className={styles.ctaButtonGroup}>
            <Link href="/login" style={{ width: '100%', textDecoration: 'none' }}>
              <button type="button" className={`${styles.ctaBtn} ${styles.ctaBtnSecondary}`}>
                {t.btnDashboard}
              </button>
            </Link>
            <button type="button" className={styles.ctaBtn} onClick={() => setShowModal(true)}>
              {t.btnContactSupport}
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
                  <input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+123..." />
                </div>
                <div className={styles.formGroup}>
                  <label>{t.labelHelp}</label>
                  <textarea required value={formData.details} onChange={e => setFormData({...formData, details: e.target.value})} rows={4} placeholder={lang === "fr" ? "Décrivez votre problème..." : "Describe your issue..."} />
                </div>
                <button type="submit" className={styles.submitBtn} disabled={loading}>
                  {loading ? t.btnSending : t.btnSend}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

