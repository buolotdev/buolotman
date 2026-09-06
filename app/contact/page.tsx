"use client";

import { useState, useEffect } from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { api } from "@/app/lib/api";
import styles from "./contact.module.css";

const translations: Record<string, Record<string, any>> = {
  en: {
    heroBadge: "24/7 Dedicated Support",
    heroTitle: "We're Here to Help — Get in Touch",
    heroSubtitle: "Have a question about a task contract, escrow payment, technician verification, or enterprise partnership? Our support specialists are available around the clock.",
    channel1Title: "General & Task Support",
    channel1Desc: "Help with active tasks, bid proposals, milestone approvals, and account access.",
    channel2Title: "Escrow & Dispute Team",
    channel2Desc: "Direct assistance with payment holds, mobile money payouts, and mediation appeals.",
    channel3Title: "Enterprise & Partnerships",
    channel3Desc: "Custom contractor pooling, government tenders, and institutional procurement solutions.",
    formTitle: "Send Our Support Team a Message",
    formDesc: "Fill out the contact form with your inquiry details. A specialist from the relevant department will review your case and respond promptly.",
    point1Title: "Average Response Time:",
    point1Desc: "Under 2 hours during active business operations across Africa.",
    point2Title: "Escrow Protection:",
    point2Desc: "Urgent payment disputes receive highest priority routing.",
    point3Title: "Bilingual Support:",
    point3Desc: "Available in English and French (Français).",
    successTitle: "Message Sent Successfully!",
    thankYou: "Thank you for reaching out,",
    ticketCreated: "Ticket has been created and assigned to our support team. We will email you shortly.",
    sendAnother: "Send Another Message",
    fullName: "Your Full Name *",
    emailAddr: "Email Address *",
    phoneNum: "Phone / WhatsApp Number",
    inquiryTopic: "Inquiry Topic *",
    topicGeneral: "General Platform Inquiry",
    topicTask: "Task or Job Proposal Issue",
    topicEscrow: "Escrow, Refund & Wallet Payouts",
    topicVerif: "Identity & Skills Verification",
    topicEnterprise: "Enterprise & Contractor Teams",
    topicBug: "Technical Issue / Bug Report",
    messageDetails: "Your Message / Issue Details *",
    messagePlaceholder: "Please describe your question or issue in detail...",
    btnSend: "Send Message to Support"
  },
  fr: {
    heroBadge: "Support dédié 24/7",
    heroTitle: "Nous sommes là pour vous aider — Contactez-nous",
    heroSubtitle: "Une question sur un contrat, un paiement sous séquestre, la vérification d'un profil ou un partenariat entreprise ? Nos conseillers sont à votre écoute.",
    channel1Title: "Support Général & Missions",
    channel1Desc: "Assistance pour les tâches en cours, offres de prix, validation d'étapes et accès aux comptes.",
    channel2Title: "Séquestre & Gestion des Litiges",
    channel2Desc: "Assistance directe pour le déblocage des paiements, les transferts Mobile Money et la médiation.",
    channel3Title: "Entreprises & Partenariats",
    channel3Desc: "Solutions sur mesure pour chantiers d'envergure, appels d'offres et approvisionnement institutionnel.",
    formTitle: "Envoyez un message à notre équipe",
    formDesc: "Remplissez le formulaire de contact. Un spécialiste du département concerné étudiera votre demande et vous répondra dans les plus brefs délais.",
    point1Title: "Délai moyen de réponse :",
    point1Desc: "Moins de 2 heures pendant les heures d'ouverture à travers l'Afrique.",
    point2Title: "Protection sous séquestre :",
    point2Desc: "Les litiges de paiement urgents sont traités en priorité absolue.",
    point3Title: "Support Bilingue :",
    point3Desc: "Disponible en Français et en Anglais.",
    successTitle: "Message envoyé avec succès !",
    thankYou: "Merci de nous avoir contactés,",
    ticketCreated: "Votre ticket d'assistance a été créé et transmis à notre équipe. Nous vous répondrons par e-mail très rapidement.",
    sendAnother: "Envoyer un autre message",
    fullName: "Votre nom complet *",
    emailAddr: "Adresse e-mail *",
    phoneNum: "Numéro de téléphone / WhatsApp",
    inquiryTopic: "Objet de la demande *",
    topicGeneral: "Renseignement général",
    topicTask: "Problème sur une tâche ou un devis",
    topicEscrow: "Séquestre, Remboursement & Portefeuille",
    topicVerif: "Vérification d'identité & compétences",
    topicEnterprise: "Solutions Entreprises & Équipes",
    topicBug: "Problème technique / Signalement de bug",
    messageDetails: "Détails de votre message *",
    messagePlaceholder: "Veuillez décrire précisément votre demande ou votre problème...",
    btnSend: "Envoyer le message au support"
  }
};

export default function ContactPage() {
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

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    topic: "General Inquiry",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.submitContactForm({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        topic: formData.topic,
        message: formData.message,
      });
    } catch (err) {
      console.error("Error sending contact message:", err);
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  };

  return (
    <div className={styles.page}>
      <Header />

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <iconify-icon icon="lucide:headset" /> {t.heroBadge}
          </div>
          <h1 className={styles.heroTitle}>{t.heroTitle}</h1>
          <p className={styles.heroSubtitle}>
            {t.heroSubtitle}
          </p>
        </div>
      </section>

      <main className={styles.container}>
        {/* CONTACT CHANNELS */}
        <section className={styles.channelsSection}>
          <div className={styles.grid3}>
            <div className={styles.channelCard}>
              <div className={styles.channelIconWrap}>
                <iconify-icon icon="lucide:message-square" />
              </div>
              <h3 className={styles.channelTitle}>{t.channel1Title}</h3>
              <p className={styles.channelDesc}>
                {t.channel1Desc}
              </p>
              <a href="mailto:support@boulotman.com" className={styles.channelLink}>
                support@boulotman.com <iconify-icon icon="lucide:arrow-right" />
              </a>
            </div>

            <div className={styles.channelCard}>
              <div className={styles.channelIconWrap}>
                <iconify-icon icon="lucide:lock" />
              </div>
              <h3 className={styles.channelTitle}>{t.channel2Title}</h3>
              <p className={styles.channelDesc}>
                {t.channel2Desc}
              </p>
              <a href="mailto:payments@boulotman.com" className={styles.channelLink}>
                payments@boulotman.com <iconify-icon icon="lucide:arrow-right" />
              </a>
            </div>

            <div className={styles.channelCard}>
              <div className={styles.channelIconWrap}>
                <iconify-icon icon="lucide:building-2" />
              </div>
              <h3 className={styles.channelTitle}>{t.channel3Title}</h3>
              <p className={styles.channelDesc}>
                {t.channel3Desc}
              </p>
              <a href="mailto:enterprise@boulotman.com" className={styles.channelLink}>
                enterprise@boulotman.com <iconify-icon icon="lucide:arrow-right" />
              </a>
            </div>
          </div>
        </section>

        {/* CONTACT FORM */}
        <section className={styles.formSection}>
          <div className={styles.formWrapper}>
            <div>
              <h2 className={styles.formInfoTitle}>{t.formTitle}</h2>
              <p className={styles.formInfoDesc}>
                {t.formDesc}
              </p>

              <div className={styles.infoPoints}>
                <div className={styles.infoPoint}>
                  <iconify-icon icon="lucide:check-circle-2" className={styles.infoPointIcon} />
                  <div className={styles.infoPointText}>
                    <strong>{t.point1Title}</strong> {t.point1Desc}
                  </div>
                </div>

                <div className={styles.infoPoint}>
                  <iconify-icon icon="lucide:check-circle-2" className={styles.infoPointIcon} />
                  <div className={styles.infoPointText}>
                    <strong>{t.point2Title}</strong> {t.point2Desc}
                  </div>
                </div>

                <div className={styles.infoPoint}>
                  <iconify-icon icon="lucide:check-circle-2" className={styles.infoPointIcon} />
                  <div className={styles.infoPointText}>
                    <strong>{t.point3Title}</strong> {t.point3Desc}
                  </div>
                </div>
              </div>
            </div>

            <div>
              {submitted ? (
                <div className={styles.successAlert}>
                  <iconify-icon icon="lucide:check-circle" style={{ fontSize: "40px", color: "#16a34a", marginBottom: "12px" }} />
                  <h3>{t.successTitle}</h3>
                  <p>
                    {t.thankYou} <strong>{formData.name}</strong>. {t.ticketCreated} (<strong>{formData.email}</strong>).
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: "", email: "", phone: "", topic: "General Inquiry", message: "" });
                    }}
                    style={{
                      marginTop: "18px",
                      background: "#001F3F",
                      color: "#fff",
                      border: "none",
                      padding: "10px 20px",
                      borderRadius: "10px",
                      fontWeight: "700",
                      cursor: "pointer"
                    }}
                  >
                    {t.sendAnother}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className={styles.formGrid}>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>{t.fullName}</label>
                      <input
                        required
                        type="text"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>{t.emailAddr}</label>
                      <input
                        required
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>{t.phoneNum}</label>
                      <input
                        type="tel"
                        placeholder="+250 788 000 000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>{t.inquiryTopic}</label>
                      <select
                        value={formData.topic}
                        onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                      >
                        <option value="General Inquiry">{t.topicGeneral}</option>
                        <option value="Task or Job Issue">{t.topicTask}</option>
                        <option value="Escrow & Payments">{t.topicEscrow}</option>
                        <option value="ID Verification">{t.topicVerif}</option>
                        <option value="Enterprise Solution">{t.topicEnterprise}</option>
                        <option value="Bug Report">{t.topicBug}</option>
                      </select>
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label>{t.messageDetails}</label>
                    <textarea
                      required
                      rows={4}
                      placeholder={t.messagePlaceholder}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>

                  <button type="submit" className={styles.submitBtn} disabled={loading}>
                    {loading ? "Sending..." : t.btnSend} <iconify-icon icon={loading ? "lucide:loader-2" : "lucide:send"} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

