"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import styles from "./dispute-resolution.module.css";
import { api } from "@/app/lib/api";

const translations: Record<string, Record<string, any>> = {
  en: {
    heroTitle: "Dispute Resolution & Escrow Mediation",
    heroSubtitle: "Boulot Man provides a structured, fair, and transparent dispute resolution process to protect clients, technicians, freelancers, companies, and enterprise partners.",
    section1Title: "What Is Dispute Resolution?",
    section1Desc: "Dispute Resolution is the formal process used when a disagreement arises between a client and a service provider regarding work quality, scope, payment, delays, or conduct. Boulot Man acts as a neutral facilitator to ensure fairness, protect escrow funds, and enforce accountability.",
    card1Title: "Who Can Raise a Dispute",
    card1List: ["Clients & Homeowners", "Technicians & Free Agents", "General Contractors & Companies", "Enterprise & Institutional Partners"],
    card2Title: "When to Raise a Dispute",
    card2List: ["Incomplete or poor-quality workmanship", "Payment release disagreements & escrow holds", "Unapproved scope expansion or budget creep", "Severe unnotified project abandonment", "Professional conduct & safety breaches"],
    card3Title: "What Is Protected",
    card3List: ["Milestone-held escrow payments", "Signed service specifications & quotes", "QA inspection & proof of delivery", "Marketplace trust & reputation integrity"],
    howTitle: "How the Dispute Process Works",
    step1: "Dispute is raised via case intake",
    step2: "Automatic escrow hold applied",
    step3: "Evidence & work proof submitted",
    step4: "Boulot Man technical mediation review",
    step5: "Binding resolution decision issued",
    step6: "Payment release, refund, or rectification",
    typesTitle: "Types of Disputes",
    type1Title: "Payment & Escrow Disputes",
    type1List: ["Non-payment & premature release demands", "Partial milestone payment disagreements", "Material cost & reimbursement conflicts"],
    type2Title: "Workmanship & Quality Disputes",
    type2List: ["Work not meeting agreed technical standards", "Incomplete delivery & defect refusal", "Unauthorized alterations to site/specs"],
    type3Title: "Conduct & Contractual Compliance",
    type3List: ["Workplace harassment or safety violations", "Severe delays & site abandonment", "Direct circumvention / platform policy breaches"],
    faqTitle: "Dispute Resolution FAQ",
    faqs: [
      {
        q: "Is Boulot Man a legal court?",
        a: "No. Boulot Man provides platform-level contractual mediation and escrow administration. Legal disputes may still be pursued independently through regional arbitration courts if necessary."
      },
      {
        q: "How long does dispute resolution take?",
        a: "Most disputes are resolved within 24 to 72 business hours upon submission of photographic evidence and scope documentation."
      },
      {
        q: "Can escrow funds be refunded to the client?",
        a: "Yes. Escrow funds may be refunded in full, partially released to the provider, or reallocated based on the technical mediation findings."
      },
      {
        q: "Does raising a dispute affect ratings or account standing?",
        a: "Legitimate disputes raised in good faith do not penalize users. Platform abuse or repeated bad-faith defaults will result in account sanctions."
      }
    ],
    ctaTitle: "Need Immediate Mediation or Case Review?",
    ctaDesc: "Submit your dispute details, contract reference, and supporting evidence below. Our dedicated dispute operations tribunal will intervene immediately.",
    btnDashboard: "Go to Dashboard",
    btnContactSupport: "Open Dispute / Mediation Case",
    modalTitle: "Formal Dispute & Mediation Case Intake",
    modalSubtitle: "Provide full context and evidence for neutral escrow review and dispute mediation.",
    modalSuccess: "Your dispute case has been officially registered! Escrow is locked and our mediation officer will review all evidence.",
    
    sec1: "1. Claimant Profile & Contact",
    labelName: "Full Name *",
    labelEmail: "Official Email *",
    labelPhone: "Phone / WhatsApp Number *",
    labelRole: "Your Role in This Assignment *",

    sec2: "2. Counterparty & Contract Reference",
    labelTarget: "Counterparty Name / Username / Company *",
    phTarget: "e.g. @john_electrician or Acme Contracting Ltd",
    labelRef: "Task / Project Reference ID *",
    phRef: "e.g. TSK-98214 or Project Contract Title",
    labelAmount: "Disputed Amount & Currency *",
    phAmount: "e.g. 250,000 RWF / 150,000 XAF / $500 USD",
    labelEscrow: "Current Escrow Status",

    sec3: "3. Dispute Category & Desired Outcome",
    labelCategory: "Dispute Classification *",
    labelOutcome: "Desired Resolution Outcome *",
    labelUrgency: "Urgency Level",

    sec4: "4. Detailed Chronology of What Transpired",
    labelHelp: "Statement of Facts & Specific Deficiencies *",
    phHelp: "Provide a clear chronological summary: agreed deliverables vs what was actually delivered, dates of communication, and attempts made to resolve amicably...",

    sec5: "5. Worksite Evidence & Documentation",
    uploadPrompt: "Click to upload photos of worksite, invoices, chat screenshots, or signed agreements (PNG, JPG, PDF up to 20MB)",
    noFiles: "No evidence documents attached.",

    btnSend: "Submit Formal Dispute Case",
    btnSending: "Registering Dispute Case..."
  },
  fr: {
    heroTitle: "Résolution des Litiges & Médiation Séquestre",
    heroSubtitle: "Boulot Man assure une procédure de médiation structurée, équitable et transparente pour protéger clients, techniciens, indépendants et entreprises partenaires.",
    section1Title: "Qu'est-ce que la Résolution des Litiges ?",
    section1Desc: "La résolution des litiges intervient lorsqu'un désaccord survient entre un client et un prestataire sur la qualité des travaux, le périmètre, les délais ou le paiement. Boulot Man agit comme médiateur neutre pour garantir une issue juste, sécuriser les fonds et faire respecter les engagements.",
    card1Title: "Qui peut ouvrir un litige",
    card1List: ["Clients & Particuliers", "Techniciens & Artisans indépendants", "Entreprises générales & BTP", "Partenaires Institutionnels"],
    card2Title: "Quand ouvrir un litige",
    card2List: ["Travail inachevé ou non conforme", "Désaccord sur le déblocage du séquestre", "Modifications de périmètre non autorisées", "Abandon injustifié de chantier", "Manquement aux règles professionnelles et de sécurité"],
    card3Title: "Éléments protégés",
    card3List: ["Fonds bloqués sous séquestre", "Contrats et devis de mission", "Validation des étapes et jalons", "Intégrité et sécurité du marché"],
    howTitle: "Étapes de la Procédure de Litige",
    step1: "Ouverture du dossier de médiation",
    step2: "Blocage conservatoire du séquestre",
    step3: "Dépôt des éléments de preuve et photos",
    step4: "Examen technique par Boulot Man",
    step5: "Notification de la décision arbitrale",
    step6: "Déblocage, remboursement ou reprise",
    typesTitle: "Types de Litiges Pris en Charge",
    type1Title: "Litiges Financiers & Séquestre",
    type1List: ["Refus de paiement ou déblocage abusif", "Contestation sur les acomptes et jalons", "Conflit sur les frais de matériaux"],
    type2Title: "Litiges Qualité & Malfaçons",
    type2List: ["Non-conformité aux normes convenues", "Prestation incomplète ou bâclée", "Modifications non autorisées sur le chantier"],
    type3Title: "Comportement & Non-Respect Contractuel",
    type3List: ["Harcèlement ou violation de sécurité", "Retards excessifs et abandon de chantier", "Tentatives de contournement de la plateforme"],
    faqTitle: "Foire Aux Questions Médiation",
    faqs: [
      {
        q: "Boulot Man est-il un tribunal juridique ?",
        a: "Non. Boulot Man fournit une médiation contractuelle sur sa plateforme. Les parties conservent leur droit de recours judiciaire indépendant si nécessaire."
      },
      {
        q: "Quel est le délai de traitement d'un litige ?",
        a: "La majorité des dossiers sont arbitrés sous 24 à 72 heures ouvrées dès réception des pièces justificatives et photos."
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
    ctaTitle: "Besoin d'une médiation immédiate ?",
    ctaDesc: "Déposez les détails du litige, les références de mission et les pièces justificatives ci-dessous. Notre cellule médiation interviendra sans délai.",
    btnDashboard: "Tableau de Bord",
    btnContactSupport: "Ouvrir un Dossier de Litige",
    modalTitle: "Dépôt Formel de Dossier de Litige & Séquestre",
    modalSubtitle: "Fournissez le contexte complet et les preuves pour l'examen neutre du séquestre.",
    modalSuccess: "Votre dossier de litige a été enregistré ! Le séquestre est sécurisé et un médiateur prend contact sous peu.",

    sec1: "1. Profil du Demandeur & Contact",
    labelName: "Nom Complet *",
    labelEmail: "E-mail Officiel *",
    labelPhone: "Numéro Téléphone / WhatsApp *",
    labelRole: "Votre Rôle dans cette Mission *",

    sec2: "2. Partie Adverse & Référence de Mission",
    labelTarget: "Nom / Identifiant de la Partie Adverse *",
    phTarget: "ex. @jean_electricien ou Entreprise BTP SARL",
    labelRef: "Référence de la Tâche / Projet *",
    phRef: "ex. TSK-98214 ou Titre du Devis",
    labelAmount: "Montant Contesté & Devise *",
    phAmount: "ex. 250 000 RWF / 150 000 XAF / 500 $",
    labelEscrow: "Statut Actuel du Séquestre",

    sec3: "3. Nature du Litige & Issue Souhaitée",
    labelCategory: "Classification du Litige *",
    labelOutcome: "Issue Souhaitée *",
    labelUrgency: "Degré d'Urgence",

    sec4: "4. Exposé Chronologique des Faits",
    labelHelp: "Exposé des Faits & Manquements Précis *",
    phHelp: "Décrivez la chronologie exacte : prestations convenues vs livrées, échanges réalisés et tentatives de conciliation amiable...",

    sec5: "5. Pièces Justificatives & Photos du Chantier",
    uploadPrompt: "Cliquez pour joindre photos du chantier, devis, captures de conversation ou reçus (PNG, JPG, PDF jusqu'à 20 Mo)",
    noFiles: "Aucun fichier joint pour l'instant.",

    btnSend: "Déposer Formellement le Litige",
    btnSending: "Enregistrement du Dossier..."
  }
};

export default function DisputeResolutionPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [lang, setLang] = useState("en");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Client / Property Owner",
    targetUser: "",
    taskRef: "",
    disputedAmount: "",
    escrowStatus: "Funds Currently in Escrow (Locked)",
    category: "Incomplete / Poor Quality Workmanship",
    desiredOutcome: "Full Escrow Refund to Client",
    urgency: "High / Priority Action",
    details: ""
  });

  const [attachedFiles, setAttachedFiles] = useState<Array<{ name: string; size: number; type: string; data: string }>>([]);

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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      const loadedFiles: Array<{ name: string; size: number; type: string; data: string }> = [];

      for (const file of filesArray) {
        const base64Data = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve((reader.result as string) || "");
          reader.onerror = () => resolve("");
          reader.readAsDataURL(file);
        });

        loadedFiles.push({
          name: file.name,
          size: file.size,
          type: file.type || "application/octet-stream",
          data: base64Data
        });
      }

      setAttachedFiles((prev) => [...prev, ...loadedFiles]);
    }
  };

  const removeFile = (idx: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.taskRef.trim() || !formData.details.trim()) {
      return;
    }

    setLoading(true);
    try {
      const attachedNames = attachedFiles.map((f) => f.name);
      const payloadDetails = `=== 1. Claimant Profile ===
Claimant: ${formData.name} (${formData.role})
Email: ${formData.email}
Phone / WhatsApp: ${formData.phone || "N/A"}

=== 2. Counterparty & Contract Reference ===
Reported Counterparty: ${formData.targetUser || "N/A"}
Task / Contract Reference: ${formData.taskRef}
Disputed Amount: ${formData.disputedAmount || "Unspecified"}
Escrow Status: ${formData.escrowStatus}

=== 3. Classification & Requested Resolution ===
Dispute Category: ${formData.category}
Desired Outcome: ${formData.desiredOutcome}
Urgency Level: ${formData.urgency}

=== 4. Statement of Facts ===
${formData.details}

=== 5. Evidence Attachments ===
Attachments: ${attachedNames.length > 0 ? attachedNames.join(", ") : "None attached"}`;

      const newDispute = {
        id: `DISP-${Date.now().toString().slice(-6)}`,
        created_at: new Date().toISOString(),
        topic: `[DISPUTE CASE] ${formData.taskRef} - ${formData.category}`,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        city: "Platform Dispute",
        category: formData.category,
        details: payloadDetails,
        attached_files: attachedFiles,
        status: "Pending"
      };

      if (typeof window !== "undefined") {
        const existing = JSON.parse(localStorage.getItem("boulotman_dispute_inquiries") || "[]");
        localStorage.setItem("boulotman_dispute_inquiries", JSON.stringify([newDispute, ...existing]));
      }

      await Promise.allSettled([
        api.createDispute({
          reason: `Dispute [${formData.category}] - ${formData.taskRef}`,
          description: payloadDetails,
          against_name: formData.targetUser || "",
          amount: formData.disputedAmount || "0"
        }),
        api.createSupportTicket({
          subject: `[Dispute & Escrow Mediation] ${formData.taskRef} - ${formData.name} vs ${formData.targetUser || "Counterparty"}`,
          body: `Claimant: ${formData.name} (${formData.role} | ${formData.email} | ${formData.phone})\nCounterparty: ${formData.targetUser}\nRef: ${formData.taskRef}\nAmount: ${formData.disputedAmount}\nEscrow: ${formData.escrowStatus}\nCategory: ${formData.category}\nOutcome: ${formData.desiredOutcome}\nUrgency: ${formData.urgency}\nEvidence: ${attachedNames.join(", ") || "None"}\n\nFacts:\n${formData.details}`
        })
      ]);

      setSuccess(true);
      setTimeout(() => {
        setShowModal(false);
        setSuccess(false);
        setFormData({
          name: "",
          email: "",
          phone: "",
          role: "Client / Property Owner",
          targetUser: "",
          taskRef: "",
          disputedAmount: "",
          escrowStatus: "Funds Currently in Escrow (Locked)",
          category: "Incomplete / Poor Quality Workmanship",
          desiredOutcome: "Full Escrow Refund to Client",
          urgency: "High / Priority Action",
          details: ""
        });
        setAttachedFiles([]);
      }, 3500);
    } catch (err) {
      alert("Failed to submit dispute. Please try again.");
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

      {/* Structured Dispute Intake Modal */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setShowModal(false)}>×</button>
            <h2>{t.modalTitle}</h2>
            <p style={{ fontSize: "13.5px", color: "#64748b", margin: "-8px 0 20px 0" }}>
              {t.modalSubtitle}
            </p>
            
            {success ? (
              <div className={styles.successMsg}>
                <iconify-icon icon="lucide:check-circle-2" style={{ fontSize: "24px", color: "#166534" }} />
                <p style={{ margin: "10px 0 0 0" }}>{t.modalSuccess}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* SECTION 1: Claimant Profile */}
                <div className={styles.formBlock}>
                  <div className={styles.blockTitle}>
                    <iconify-icon icon="lucide:user-check" /> {t.sec1}
                  </div>
                  <div className={styles.formGrid2}>
                    <div className={styles.formGroup}>
                      <label>{t.labelName}</label>
                      <input
                        required
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        placeholder={lang === "fr" ? "Votre nom" : "Your name"}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>{t.labelRole}</label>
                      <select
                        value={formData.role}
                        onChange={e => setFormData({ ...formData, role: e.target.value })}
                      >
                        <option value="Client / Property Owner">Client / Property Owner</option>
                        <option value="Technician / Service Provider">Technician / Service Provider</option>
                        <option value="General Contractor / Builder">General Contractor / Builder</option>
                        <option value="Subcontractor / Specialist">Subcontractor / Specialist</option>
                        <option value="Enterprise Account Lead">Enterprise Account Lead</option>
                      </select>
                    </div>
                    <div className={styles.formGroup}>
                      <label>{t.labelEmail}</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        placeholder="your@email.com"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>{t.labelPhone}</label>
                      <input
                        required
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+250 ..."
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION 2: Target & Contract */}
                <div className={styles.formBlock}>
                  <div className={styles.blockTitle}>
                    <iconify-icon icon="lucide:file-text" /> {t.sec2}
                  </div>
                  <div className={styles.formGrid2}>
                    <div className={styles.formGroup}>
                      <label>{t.labelTarget}</label>
                      <input
                        required
                        value={formData.targetUser}
                        onChange={e => setFormData({ ...formData, targetUser: e.target.value })}
                        placeholder={t.phTarget}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>{t.labelRef}</label>
                      <input
                        required
                        value={formData.taskRef}
                        onChange={e => setFormData({ ...formData, taskRef: e.target.value })}
                        placeholder={t.phRef}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>{t.labelAmount}</label>
                      <input
                        required
                        value={formData.disputedAmount}
                        onChange={e => setFormData({ ...formData, disputedAmount: e.target.value })}
                        placeholder={t.phAmount}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>{t.labelEscrow}</label>
                      <select
                        value={formData.escrowStatus}
                        onChange={e => setFormData({ ...formData, escrowStatus: e.target.value })}
                      >
                        <option value="Funds Currently in Escrow (Locked)">Funds in Escrow (Locked)</option>
                        <option value="Released Prematurely without Approval">Released Prematurely without Approval</option>
                        <option value="Direct Invoice / Non-Payment">Direct Invoice / Payment Refusal</option>
                        <option value="Milestone Approvals Pending">Milestone Approvals Pending</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* SECTION 3: Dispute Classification & Outcome */}
                <div className={styles.formBlock}>
                  <div className={styles.blockTitle}>
                    <iconify-icon icon="lucide:scale" /> {t.sec3}
                  </div>
                  <div className={styles.formGrid2}>
                    <div className={styles.formGroup}>
                      <label>{t.labelCategory}</label>
                      <select
                        value={formData.category}
                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                      >
                        <option value="Incomplete / Poor Quality Workmanship">Incomplete / Poor Quality Workmanship</option>
                        <option value="Non-Payment / Refusal to Release Escrow">Non-Payment / Refusal to Release Escrow</option>
                        <option value="Unapproved Scope Expansion / Overcharge">Unapproved Scope Expansion / Overcharge</option>
                        <option value="Severe Project Abandonment / Delays">Severe Project Abandonment / Delays</option>
                        <option value="Property Damage / Material Waste">Property Damage / Material Waste</option>
                        <option value="Safety Violation / Misconduct">Safety Violation / Misconduct</option>
                      </select>
                    </div>
                    <div className={styles.formGroup}>
                      <label>{t.labelOutcome}</label>
                      <select
                        value={formData.desiredOutcome}
                        onChange={e => setFormData({ ...formData, desiredOutcome: e.target.value })}
                      >
                        <option value="Full Escrow Refund to Client">Full Escrow Refund to Client</option>
                        <option value="Full Escrow Release to Service Provider">Full Escrow Release to Service Provider</option>
                        <option value="Partial Settlement / Divided Release">Partial Settlement / Divided Release</option>
                        <option value="Mandatory Defect Rectification by Provider">Mandatory Defect Rectification by Provider</option>
                        <option value="Cancellation with Materials Compensation">Cancellation with Materials Compensation</option>
                      </select>
                    </div>
                    <div className={styles.formGroup} style={{ gridColumn: "1 / -1" }}>
                      <label>{t.labelUrgency}</label>
                      <select
                        value={formData.urgency}
                        onChange={e => setFormData({ ...formData, urgency: e.target.value })}
                      >
                        <option value="High / Priority Action">High / Priority Action (Active work stoppage)</option>
                        <option value="Standard / Review in 48h">Standard / Review in 48h</option>
                        <option value="Critical / Legal Escalation">Critical / Legal Escalation</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* SECTION 4: Statement */}
                <div className={styles.formBlock}>
                  <div className={styles.blockTitle}>
                    <iconify-icon icon="lucide:message-square" /> {t.sec4}
                  </div>
                  <div className={styles.formGroup}>
                    <label>{t.labelHelp}</label>
                    <textarea
                      required
                      value={formData.details}
                      onChange={e => setFormData({ ...formData, details: e.target.value })}
                      rows={4}
                      placeholder={t.phHelp}
                    />
                  </div>
                </div>

                {/* SECTION 5: Evidence Upload */}
                <div className={styles.formBlock}>
                  <div className={styles.blockTitle}>
                    <iconify-icon icon="lucide:paperclip" /> {t.sec5}
                  </div>
                  <label className={styles.uploadZone}>
                    <input
                      type="file"
                      multiple
                      style={{ display: "none" }}
                      onChange={handleFileUpload}
                      accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                    />
                    <iconify-icon icon="lucide:upload-cloud" style={{ fontSize: "24px", color: "#ff4500" }} />
                    <span style={{ fontSize: "13px", color: "#001F3F", fontWeight: 600 }}>{t.uploadPrompt}</span>
                  </label>

                  {attachedFiles.length > 0 ? (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "10px" }}>
                      {attachedFiles.map((file, idx) => (
                        <span key={idx} className={styles.fileBadge}>
                          📎 {file.name}
                          <button type="button" onClick={() => removeFile(idx)} className={styles.fileRemove}>
                            ✕
                          </button>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p style={{ fontSize: "12px", color: "#94a3b8", margin: "6px 0 0 0" }}>{t.noFiles}</p>
                  )}
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
