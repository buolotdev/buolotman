"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import styles from "./page.module.css";

function Accordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={`${styles.accordionItem} ${isOpen ? styles.accordionItemActive : ""}`}>
      <div className={styles.accordionTitle} onClick={() => setIsOpen(!isOpen)}>
        {title} 
        <div className={styles.accordionIcon}>
          <iconify-icon icon="lucide:chevron-down"></iconify-icon>
        </div>
      </div>
      {isOpen && <div className={styles.accordionContent}>{children}</div>}
    </div>
  );
}


const translations: Record<string, Record<string, any>> = {
  en: {
    heroTitle: "How can we help you today?",
    heroSubtitle: "Search our knowledge base or browse categories below to find exactly what you need.",
    searchPlaceholder: "Search for articles, guides, or FAQs...",
    btnSearch: "Search",
    cat1Title: "Getting Started",
    cat1Desc: "Everything you need to know about setting up your account and posting your first task.",
    cat2Title: "For Technicians",
    cat2Desc: "Learn how to get verified, bid on jobs, and grow your freelance career on Boulot Man.",
    cat3Title: "Payments & Escrow",
    cat3Desc: "Understand BPay Wallet, secure escrow services, and how you get paid.",
    faqGettingStarted: "Getting Started",
    faqGettingStartedDesc: "The basics of navigating and utilizing the Boulot Man platform for clients and individuals.",
    q1Title: "What is Boulot Man?",
    q1Answer1: "Boulot Man is a digital platform that connects ",
    q1Answer2: "verified technicians, engineers, companies, and service teams",
    q1Answer3: " with individuals, businesses, and organizations that need reliable technical services.",
    q1Mission: "Home for Technicians and Engineers in Africa.",
    q2Title: "How does Boulot Man work for Clients?",
    q2Step1: "Visit Browse Services",
    q2Step2: "Select a technician, company, or team",
    q2Step3: "Book or Post a Task",
    q2Step4: "Pay securely via BPay Wallet",
    q2Step5: "Approve work and leave a review",
    faqForTechnicians: "For Technicians",
    faqForTechniciansDesc: "Guidelines for professionals, from registration and verification to climbing the premium tiers.",
    q3Title: "How does Boulot Man work for Technicians?",
    q3Step1: "Register as a technician or free agent",
    q3Step2: "Complete verification (ID, skills, experience)",
    q3Step3: "Publish services or receive task requests",
    q3Step4: "Complete jobs professionally",
    q3Step5: "Get paid via BPay",
    q4Title: "What are the Premium Tiers?",
    q4Tier1: "Basic",
    q4Tier1Desc: " – Get verified & visible",
    q4Tier2: "Advance",
    q4Tier2Desc: " – Priority jobs & higher earnings",
    q4Tier3: "Pro",
    q4Tier3Desc: " – Elite access, cross-border work",
    q4Tier4: "Enterprise",
    q4Tier4Desc: " – Large institutions & governments",
    faqPayments: "Payments & Escrow",
    faqPaymentsDesc: "Secure transactions, wallet management, and dispute resolutions.",
    q5Title: "What is BPay Wallet?",
    q5Desc: "BPay is Boulot Man’s secure digital wallet used for:",
    q5Bullet1: "Paying for services",
    q5Bullet2: "Receiving earnings",
    q5Bullet3: "Escrow protection",
    q5Bullet4: "Withdrawals & transaction tracking",
    q6Title: "What is Escrow and how does it work?",
    q6Answer: "{t.q6Answer}",
    contactTitle: "Still need help?",
    contactDesc: "Can't find the answer you're looking for? Our dedicated support team is here to assist you with any questions or concerns.",
    contactBtn: "Contact Support"
  },
  fr: {
    heroTitle: "Comment pouvons-nous vous aider aujourd'hui ?",
    heroSubtitle: "Recherchez dans notre base de connaissances ou parcourez les catégories ci-dessous pour trouver exactement ce dont vous avez besoin.",
    searchPlaceholder: "Rechercher des articles, guides ou FAQ...",
    btnSearch: "Rechercher",
    cat1Title: "Prise en main",
    cat1Desc: "Tout ce que vous devez savoir pour configurer votre compte et publier votre premier projet.",
    cat2Title: "Pour les techniciens",
    cat2Desc: "Découvrez comment être vérifié, postuler à des emplois et développer votre carrière sur Boulot Man.",
    cat3Title: "Paiements et Escrow",
    cat3Desc: "Comprendre le portefeuille BPay, les services d'escrow sécurisés et comment vous êtes payé.",
    faqGettingStarted: "Prise en main",
    faqGettingStartedDesc: "Les bases pour naviguer et utiliser la plateforme Boulot Man pour les clients et les particuliers.",
    q1Title: "Qu'est-ce que Boulot Man ?",
    q1Answer1: "Boulot Man est une plateforme numérique qui connecte des ",
    q1Answer2: "techniciens, ingénieurs, entreprises et équipes de service vérifiés",
    q1Answer3: " avec des particuliers, des entreprises et des organisations qui ont besoin de services techniques fiables.",
    q1Mission: "La maison des techniciens et ingénieurs en Afrique.",
    q2Title: "Comment fonctionne Boulot Man pour les clients ?",
    q2Step1: "Consulter les services",
    q2Step2: "Sélectionner un technicien, une entreprise ou une équipe",
    q2Step3: "Réserver ou publier une tâche",
    q2Step4: "Payer en toute sécurité via le portefeuille BPay",
    q2Step5: "Approuver le travail et laisser un avis",
    faqForTechnicians: "Pour les techniciens",
    faqForTechniciansDesc: "Directives pour les professionnels, de l'inscription et la vérification à la progression dans les niveaux premium.",
    q3Title: "Comment fonctionne Boulot Man pour les techniciens ?",
    q3Step1: "S'inscrire en tant que technicien ou agent libre",
    q3Step2: "Compléter la vérification (identité, compétences, expérience)",
    q3Step3: "Publier des services ou recevoir des demandes de tâches",
    q3Step4: "Réaliser les travaux de manière professionnelle",
    q3Step5: "Être payé via BPay",
    q4Title: "Quels sont les niveaux Premium ?",
    q4Tier1: "Basique",
    q4Tier1Desc: " – Être vérifié et visible",
    q4Tier2: "Avancé",
    q4Tier2Desc: " – Emplois prioritaires et gains plus élevés",
    q4Tier3: "Pro",
    q4Tier3Desc: " – Accès élite, travail transfrontalier",
    q4Tier4: "Entreprise",
    q4Tier4Desc: " – Grandes institutions et gouvernements",
    faqPayments: "Paiements et Escrow",
    faqPaymentsDesc: "Transactions sécurisées, gestion de portefeuille et résolution de litiges.",
    q5Title: "Qu'est-ce que le portefeuille BPay ?",
    q5Desc: "BPay est le portefeuille numérique sécurisé de Boulot Man utilisé pour :",
    q5Bullet1: "Payer pour les services",
    q5Bullet2: "Recevoir des gains",
    q5Bullet3: "Protection par escrow (séquestre)",
    q5Bullet4: "Retraits et suivi des transactions",
    q6Title: "Qu'est-ce que l'escrow et comment ça marche ?",
    q6Answer: "Les fonds sont conservés en toute sécurité jusqu'à ce que le travail soit terminé et approuvé. Cela protège à la fois les clients et les prestataires, garantissant que le paiement n'est libéré que lorsque les étapes sont franchies.",
    contactTitle: "Besoin d'aide supplémentaire ?",
    contactDesc: "Vous ne trouvez pas la réponse que vous cherchez ? Notre équipe de support dédiée est là pour vous aider avec toutes vos questions.",
    contactBtn: "Contacter le support"
  }
};

export default function HelpCenterPage() {
  const [lang, setLang] = useState("en");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLang = localStorage.getItem("lang") || "en";
      if (savedLang === "fr" || savedLang === "en") {
        setLang(savedLang);
      } else if (savedLang === "rw") {
        setLang("fr");
      } else {
        setLang("en");
      }
    }
  }, []);

  const t = translations[lang] || translations["en"];

  return (
    <div style={{ background: "#f5f7fb", minHeight: "100vh" }}>
      <Header />

      {/* HERO SECTION */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>{t.heroTitle}</h1>
          <p className={styles.heroSubtitle}>{t.heroSubtitle}</p>
          <div className={styles.searchWrapper}>
            <iconify-icon icon="lucide:search" className={styles.searchIcon}></iconify-icon>
            <input 
              type="text" 
              className={styles.searchInput} 
              placeholder={t.searchPlaceholder} 
            />
            <button className={styles.searchBtn}>{t.btnSearch}</button>
          </div>
        </div>
      </section>

      <div className={styles.container}>
        {/* CATEGORY GRID */}
        <div className={styles.categoriesGrid}>
          <Link href="#getting-started" style={{textDecoration: 'none'}}>
            <div className={styles.categoryCard}>
              <div className={styles.categoryIcon}>
                <iconify-icon icon="lucide:rocket"></iconify-icon>
              </div>
              <h3 className={styles.categoryTitle}>{t.cat1Title}</h3>
              <p className={styles.categoryDesc}>{t.cat1Desc}</p>
            </div>
          </Link>

          <Link href="#technicians" style={{textDecoration: 'none'}}>
            <div className={styles.categoryCard}>
              <div className={styles.categoryIcon}>
                <iconify-icon icon="lucide:users"></iconify-icon>
              </div>
              <h3 className={styles.categoryTitle}>{t.cat2Title}</h3>
              <p className={styles.categoryDesc}>{t.cat2Desc}</p>
            </div>
          </Link>

          <Link href="#payments" style={{textDecoration: 'none'}}>
            <div className={styles.categoryCard}>
              <div className={styles.categoryIcon}>
                <iconify-icon icon="lucide:credit-card"></iconify-icon>
              </div>
              <h3 className={styles.categoryTitle}>{t.cat3Title}</h3>
              <p className={styles.categoryDesc}>{t.cat3Desc}</p>
            </div>
          </Link>
        </div>

        {/* FAQ SECTIONS */}
        <div id="getting-started" className={styles.faqSection}>
          <div className={styles.faqHeader}>
            <h2>{t.faqGettingStarted}</h2>
            <p>{t.faqGettingStartedDesc}</p>
          </div>
          <div className={styles.faqList}>
            <Accordion title={t.q1Title}>
              {t.q1Answer1}<strong>{t.q1Answer2}</strong>{t.q1Answer3}<br /><br /><strong>Mission:</strong> {t.q1Mission}
            </Accordion>
            <Accordion title={t.q2Title}>
              <ol>
                <li>{lang === 'fr' ? 'Consulter les ' : 'Visit '}<Link href="/search" className={styles.link}>{lang === 'fr' ? 'services' : 'Browse Services'}</Link></li>
                <li>{t.q2Step2}</li>
                <li>{lang === 'fr' ? 'Réserver ou ' : 'Book or '}<Link href="/post-task" className={styles.link}>{lang === 'fr' ? 'publier une tâche' : 'Post a Task'}</Link></li>
                <li>{t.q2Step4}</li>
                <li>{t.q2Step5}</li>
              </ol>
            </Accordion>
          </div>
        </div>

        <div id="technicians" className={styles.faqSection}>
          <div className={styles.faqHeader}>
            <h2>{t.faqForTechnicians}</h2>
            <p>{t.faqForTechniciansDesc}</p>
          </div>
          <div className={styles.faqList}>
            <Accordion title={t.q3Title}>
              <ol>
                <li>{t.q3Step1}</li>
                <li>{t.q3Step2}</li>
                <li>{t.q3Step3}</li>
                <li>{t.q3Step4}</li>
                <li>{t.q3Step5}</li>
              </ol>
            </Accordion>
            <Accordion title={t.q4Title}>
              <ul>
                <li><strong>{t.q4Tier1}</strong>{t.q4Tier1Desc}</li>
                <li><strong>{t.q4Tier2}</strong>{t.q4Tier2Desc}</li>
                <li><strong>{t.q4Tier3}</strong>{t.q4Tier3Desc}</li>
                <li><strong>{t.q4Tier4}</strong>{t.q4Tier4Desc}</li>
              </ul>
            </Accordion>
          </div>
        </div>

        <div id="payments" className={styles.faqSection}>
          <div className={styles.faqHeader}>
            <h2>{t.faqPayments}</h2>
            <p>{t.faqPaymentsDesc}</p>
          </div>
          <div className={styles.faqList}>
            <Accordion title={t.q5Title}>
              {t.q5Desc}
              <ul>
                <li>{t.q5Bullet1}</li>
                <li>{t.q5Bullet2}</li>
                <li>{t.q5Bullet3}</li>
                <li>{t.q5Bullet4}</li>
              </ul>
            </Accordion>
            <Accordion title={t.q6Title}>
              {t.q6Answer}
            </Accordion>
          </div>
        </div>

        {/* CONTACT BANNER */}
        <div className={styles.contactBanner}>
          <h2 className={styles.contactTitle}>{t.contactTitle}</h2>
          <p className={styles.contactDesc}>{t.contactDesc}</p>
          <Link href="/contact" className={styles.contactBtn}>{t.contactBtn}</Link>
        </div>

      </div>

      <Footer />
    </div>
  );
}
