"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import styles from "./page.module.css";

const translations: Record<string, Record<string, any>> = {
  en: {
    heroTitle: "Payments & Earnings",
    heroSubtitle: "Understand how payments, escrow, earnings, and withdrawals work securely on the Boulot Man platform.",
    overviewTitle: "Overview",
    overviewDesc: "Boulot Man uses secure, transparent payment systems to protect both clients and service providers. Depending on the service type, payments may be held in escrow, released by milestones, or paid upon full completion.",
    howItWorksTitle: "How Payments Work",
    howItWorksDesc: "A simple, secure three-step process to ensure everyone is protected.",
    step1Label: "STEP 1",
    step1Title: "Client Funds the Task",
    step1Desc: "The client deposits the agreed amount. Funds are held securely in Escrow and are not released immediately.",
    step2Label: "STEP 2",
    step2Title: "Work Is Performed",
    step2Desc: "The technician or company completes the task or milestone according to the mutually agreed timeline.",
    step3Label: "STEP 3",
    step3Title: "Payment Is Released",
    step3Desc: "Once the client approves the work, funds are instantly released to the service provider’s earnings wallet.",
    forClientsTitle: "For Clients",
    forClientsDesc: "Everything you need to know about making secure payments.",
    methodsTitle: "Accepted Payment Methods",
    methodsList: ["Mobile Money (M-Pesa, MTN, Airtel)", "Direct Bank Transfers", "Debit / Credit Cards (Visa, Mastercard)"],
    escrowTitle: "Escrow Protection",
    escrowDesc: "Your payment is protected until the service is delivered as agreed. Providers cannot access funds until you approve the work.",
    escrowLink: "Learn about dispute resolution",
    refundsTitle: "Refunds",
    refundsDesc: "If work is not delivered or fails to meet requirements, immediate refunds may be issued according to our policy.",
    refundsLink: "View refund policy",
    forProsTitle: "For Service Providers",
    forProsDesc: "Managing your earnings and getting paid on time.",
    walletTitle: "Earnings Wallet",
    walletDesc: "Completed task payments are stored instantly in your earnings wallet, visible securely on your provider dashboard.",
    withdrawalsTitle: "Withdrawals",
    withdrawalsDesc: "Withdraw funds to your local bank or mobile money account as soon as they become available.",
    withdrawalsLink: "Go to earnings dashboard",
    timeTitle: "Processing Time",
    timeDesc: "Mobile money withdrawals are near-instant. Bank transfers may take 1–3 business days depending on the financial institution.",
    feesTitle: "Platform Fees",
    feesDesc: "Boulot Man charges nominal service fees to maintain platform operations, security, escrow, and 24/7 support.",
    thUser: "User Type",
    thFee: "Fee Type",
    thDetails: "Details",
    row1User: "Clients",
    row1Fee: "Service Fee",
    row1Details: "A small transaction fee may apply during checkout to cover processing costs.",
    row2User: "Technicians",
    row2Fee: "Platform Commission",
    row2Details: "A standard percentage is automatically deducted from total earnings upon task completion.",
    row3User: "Companies (Enterprise)",
    row3Fee: "Subscription / Commission",
    row3Details: "Custom fee structures based on monthly subscription plans and volume agreements.",
    faqTitle: "Frequently Asked Questions",
    faq1Q: "When do I get paid after completing a task?",
    faq1A: "Once you mark a task as complete, the client will review your work. Upon their approval, the funds held in Escrow are instantly released into your Boulot Man Earnings Wallet.",
    faq2Q: "What happens in case of a dispute?",
    faq2A: "If a client is unsatisfied, they can open a dispute. The funds will remain locked in Escrow while our dedicated resolution team reviews the evidence (messages, photos, and task requirements) to make a fair decision.",
    faq3Q: "Are there any hidden withdrawal fees?",
    faq3A: "Boulot Man does not charge hidden fees. However, standard withdrawal charges levied by your mobile network operator or bank will apply based on the withdrawal method you choose.",
    ctaTitle: "Need more help with payments?",
    ctaDesc: "If you have specific questions about transactions, missing earnings, or withdrawal issues, our financial support team is available 24/7.",
    ctaBtn: "Contact Support"
  },
  fr: {
    heroTitle: "Paiements & Gains",
    heroSubtitle: "Découvrez le fonctionnement sécurisé des paiements, du séquestre, des gains et des retraits sur Boulot Man.",
    overviewTitle: "Vue d'ensemble",
    overviewDesc: "Boulot Man utilise des solutions de paiement transparentes et sécurisées pour protéger les clients et les prestataires. Selon la nature du service, les fonds sont placés sous séquestre, libérés par jalons ou versés à la livraison finale.",
    howItWorksTitle: "Fonctionnement des Paiements",
    howItWorksDesc: "Un processus simple et sécurisé en 3 étapes pour la tranquillité de chacun.",
    step1Label: "ÉTAPE 1",
    step1Title: "Approvisionnement sous séquestre",
    step1Desc: "Le client dépose le montant convenu. Les fonds sont verrouillés en toute sécurité sous séquestre et ne sont pas transférés directement.",
    step2Label: "ÉTAPE 2",
    step2Title: "Réalisation des travaux",
    step2Desc: "Le technicien ou l'entreprise exécute la prestation selon les délais et exigences convenus.",
    step3Label: "ÉTAPE 3",
    step3Title: "Libération du paiement",
    step3Desc: "Dès validation par le client, les fonds sont immédiatement crédités sur le portefeuille de gains du prestataire.",
    forClientsTitle: "Pour les Clients",
    forClientsDesc: "Tout ce que vous devez savoir pour régler vos prestations en toute confiance.",
    methodsTitle: "Moyens de Paiement Acceptés",
    methodsList: ["Mobile Money (M-Pesa, MTN, Airtel, Orange)", "Virements bancaires directs", "Cartes de débit / crédit (Visa, Mastercard)"],
    escrowTitle: "Protection sous Séquestre",
    escrowDesc: "Votre argent reste protégé jusqu'à ce que la prestation soit réalisée. Aucun prestataire ne touche les fonds sans votre accord explicite.",
    escrowLink: "En savoir plus sur la médiation",
    refundsTitle: "Remboursements",
    refundsDesc: "Si les travaux ne sont pas réalisés ou ne sont pas conformes, un remboursement rapide est déclenché selon nos conditions.",
    refundsLink: "Consulter la politique de remboursement",
    forProsTitle: "Pour les Prestataires",
    forProsDesc: "Gérer vos revenus et recevoir vos virements sans délai.",
    walletTitle: "Portefeuille de Gains",
    walletDesc: "Les paiements des tâches terminées apparaissent instantanément dans votre portefeuille, consultable sur votre espace.",
    withdrawalsTitle: "Retraits de Fonds",
    withdrawalsDesc: "Transférez vos gains vers votre compte bancaire ou votre compte Mobile Money dès qu'ils sont disponibles.",
    withdrawalsLink: "Accéder au portefeuille",
    timeTitle: "Délais de Traitement",
    timeDesc: "Les retraits Mobile Money sont quasi-instantanés. Les virements bancaires prennent 1 à 3 jours ouvrés selon les établissements.",
    feesTitle: "Frais de Plateforme",
    feesDesc: "Boulot Man applique des frais transparents pour garantir le support 24/7, la sécurité du séquestre et le bon fonctionnement de la plateforme.",
    thUser: "Utilisateur",
    thFee: "Type de frais",
    thDetails: "Détails",
    row1User: "Clients",
    row1Fee: "Frais de service",
    row1Details: "Une commission minime peut s'appliquer lors du paiement pour couvrir les coûts de transaction.",
    row2User: "Techniciens",
    row2Fee: "Commission plateforme",
    row2Details: "Un pourcentage standard est déduit automatiquement des gains bruts lors de la clôture de la mission.",
    row3User: "Entreprises (Partenaires)",
    row3Fee: "Abonnement / Forfait",
    row3Details: "Tarification adaptée selon les formules d'abonnement et le volume des chantiers.",
    faqTitle: "Foire Aux Questions",
    faq1Q: "Quand suis-je payé après la réalisation d'une tâche ?",
    faq1A: "Dès que vous marquez la tâche comme terminée, le client vérifie le travail. Après validation, les fonds sous séquestre sont versés instantanément sur votre portefeuille Boulot Man.",
    faq2Q: "Que se passe-t-il en cas de litige ?",
    faq2A: "Si le client n'est pas satisfait, il peut ouvrir un litige. Les fonds restent bloqués sous séquestre pendant que notre équipe étudie les preuves (photos, échanges et devis) pour trancher équitablement.",
    faq3Q: "Y a-t-il des frais cachés sur les retraits ?",
    faq3A: "Boulot Man ne prélève aucun frais caché. Seuls les frais standards appliqués par votre opérateur Mobile Money ou banque s'appliquent.",
    ctaTitle: "Une question sur vos paiements ?",
    ctaDesc: "Pour toute interrogation concernant un virement, un gain ou un délai de retrait, notre support financier est disponible 24/7.",
    ctaBtn: "Contacter le Support"
  }
};

function Accordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={`${styles.accordionItem} ${isOpen ? styles.accordionItemActive : ""}`} onClick={() => setIsOpen(!isOpen)}>
      <div className={styles.accordionTitle}>
        {title} 
        <div className={styles.accordionIcon}>
          <iconify-icon icon="lucide:chevron-down"></iconify-icon>
        </div>
      </div>
      {isOpen && <div className={styles.accordionContent}>{children}</div>}
    </div>
  );
}

export default function PaymentsAndEarningsPage() {
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

  return (
    <div className={styles.page}>
      <Header />

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>{t.heroTitle}</h1>
          <p className={styles.heroSubtitle}>
            {t.heroSubtitle}
          </p>
        </div>
      </section>

      <div className={styles.container}>
        
        {/* OVERVIEW */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>{t.overviewTitle}</h2>
            <p className={styles.sectionDesc}>
              {t.overviewDesc}
            </p>
          </div>
        </section>

        {/* PAYMENT FLOW */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>{t.howItWorksTitle}</h2>
            <p className={styles.sectionDesc}>{t.howItWorksDesc}</p>
          </div>
          
          <div className={styles.flow}>
            <div className={styles.flowStep}>
              <div className={styles.flowIconWrap}>
                <iconify-icon icon="lucide:wallet"></iconify-icon>
              </div>
              <span className={styles.flowStepLabel}>{t.step1Label}</span>
              <h4 className={styles.flowStepTitle}>{t.step1Title}</h4>
              <p className={styles.flowStepDesc}>
                {t.step1Desc}
              </p>
            </div>
            
            <div className={styles.flowStep}>
              <div className={styles.flowIconWrap}>
                <iconify-icon icon="lucide:hammer"></iconify-icon>
              </div>
              <span className={styles.flowStepLabel}>{t.step2Label}</span>
              <h4 className={styles.flowStepTitle}>{t.step2Title}</h4>
              <p className={styles.flowStepDesc}>
                {t.step2Desc}
              </p>
            </div>
            
            <div className={styles.flowStep}>
              <div className={styles.flowIconWrap}>
                <iconify-icon icon="lucide:check-circle-2"></iconify-icon>
              </div>
              <span className={styles.flowStepLabel}>{t.step3Label}</span>
              <h4 className={styles.flowStepTitle}>{t.step3Title}</h4>
              <p className={styles.flowStepDesc}>
                {t.step3Desc}
              </p>
            </div>
          </div>
        </section>

        {/* CLIENT PAYMENTS */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>{t.forClientsTitle}</h2>
            <p className={styles.sectionDesc}>{t.forClientsDesc}</p>
          </div>
          
          <div className={styles.grid3}>
            <div className={styles.card}>
              <div className={styles.cardIcon}>
                <iconify-icon icon="lucide:credit-card"></iconify-icon>
              </div>
              <h3 className={styles.cardTitle}>{t.methodsTitle}</h3>
              <ul className={styles.cardList}>
                {t.methodsList.map((m: string, i: number) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
            </div>
            
            <div className={styles.card}>
              <div className={styles.cardIcon}>
                <iconify-icon icon="lucide:shield-check"></iconify-icon>
              </div>
              <h3 className={styles.cardTitle}>{t.escrowTitle}</h3>
              <p className={styles.cardDesc}>
                {t.escrowDesc}
              </p>
              <Link href="/dispute-resolution" className={styles.cardLink}>
                {t.escrowLink} <iconify-icon icon="lucide:arrow-right"></iconify-icon>
              </Link>
            </div>
            
            <div className={styles.card}>
              <div className={styles.cardIcon}>
                <iconify-icon icon="lucide:refresh-ccw"></iconify-icon>
              </div>
              <h3 className={styles.cardTitle}>{t.refundsTitle}</h3>
              <p className={styles.cardDesc}>
                {t.refundsDesc}
              </p>
              <Link href="/help-center" className={styles.cardLink}>
                {t.refundsLink} <iconify-icon icon="lucide:arrow-right"></iconify-icon>
              </Link>
            </div>
          </div>
        </section>

        {/* EARNINGS */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>{t.forProsTitle}</h2>
            <p className={styles.sectionDesc}>{t.forProsDesc}</p>
          </div>
          
          <div className={styles.grid3}>
            <div className={styles.card}>
              <div className={styles.cardIcon}>
                <iconify-icon icon="lucide:piggy-bank"></iconify-icon>
              </div>
              <h3 className={styles.cardTitle}>{t.walletTitle}</h3>
              <p className={styles.cardDesc}>
                {t.walletDesc}
              </p>
            </div>
            
            <div className={styles.card}>
              <div className={styles.cardIcon}>
                <iconify-icon icon="lucide:banknote"></iconify-icon>
              </div>
              <h3 className={styles.cardTitle}>{t.withdrawalsTitle}</h3>
              <p className={styles.cardDesc}>
                {t.withdrawalsDesc}
              </p>
              <Link href="/dashboard/technician/wallet" className={styles.cardLink}>
                {t.withdrawalsLink} <iconify-icon icon="lucide:arrow-right"></iconify-icon>
              </Link>
            </div>
            
            <div className={styles.card}>
              <div className={styles.cardIcon}>
                <iconify-icon icon="lucide:clock"></iconify-icon>
              </div>
              <h3 className={styles.cardTitle}>{t.timeTitle}</h3>
              <p className={styles.cardDesc}>
                {t.timeDesc}
              </p>
            </div>
          </div>
        </section>

        {/* FEES */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>{t.feesTitle}</h2>
            <p className={styles.sectionDesc}>
              {t.feesDesc}
            </p>
          </div>
          
          <div className={styles.tableWrap}>
            <table className={styles.styledTable}>
              <thead>
                <tr>
                  <th>{t.thUser}</th>
                  <th>{t.thFee}</th>
                  <th>{t.thDetails}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{t.row1User}</td>
                  <td>{t.row1Fee}</td>
                  <td>{t.row1Details}</td>
                </tr>
                <tr>
                  <td>{t.row2User}</td>
                  <td>{t.row2Fee}</td>
                  <td>{t.row2Details}</td>
                </tr>
                <tr>
                  <td>{t.row3User}</td>
                  <td>{t.row3Fee}</td>
                  <td>{t.row3Details}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>{t.faqTitle}</h2>
          </div>
          
          <div className={styles.accordion}>
            <Accordion title={t.faq1Q}>
              {t.faq1A}
            </Accordion>
            <Accordion title={t.faq2Q}>
              {t.faq2A}
            </Accordion>
            <Accordion title={t.faq3Q}>
              {t.faq3A}
            </Accordion>
          </div>
        </section>

        {/* CTA */}
        <section className={styles.cta}>
          <div>
            <h2 className={styles.ctaTitle}>{t.ctaTitle}</h2>
            <p className={styles.ctaDesc}>
              {t.ctaDesc}
            </p>
          </div>
          <div className={styles.ctaAction}>
            <Link href="/help-center" className={styles.ctaBtn}>
              {t.ctaBtn}
              <iconify-icon icon="lucide:arrow-right" style={{fontSize: '18px'}}></iconify-icon>
            </Link>
          </div>
        </section>

      </div>

      <Footer />
    </div>
  );
}

