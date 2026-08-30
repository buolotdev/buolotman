"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

const translations: Record<string, Record<string, any>> = {
  en: {
    heroTitle: "How Boulot Man Works",
    heroDesc: "Boulot Man connects clients with verified technicians, engineers, freelancers, and companies across Africa — making it easy to find, manage, and pay for trusted services.",
    navClients: "Clients",
    navPostTask: "Post a Task",
    navFindServices: "Find Technicians & Companies",
    navPayments: "Payments & Escrow",
    navDisputes: "Disputes",
    navTechnicians: "Technicians",
    navCompanies: "Companies",
    
    // Clients section
    clientsTitle: "For Clients",
    postTaskTitle: "How to Post a Task",
    postTaskDesc: "Posting a task allows you to receive multiple offers from qualified technicians or companies and choose the best option.",
    postTaskSteps: [
      "Log in to your Boulot Man account",
      "Click Post a Task",
      "Select the service category",
      "Describe your task clearly",
      "Set location, schedule, urgency, and budget",
      "Preview, edit, save as draft, or publish"
    ],
    goToPostTask: "Go to Post a Task →",

    findServicesTitle: "Finding Technicians & Companies",
    findServicesDesc: "You can either post a task or directly browse verified technicians and companies.",
    findServicesSteps: [
      "Browse by category, location, or rating",
      "View verified profiles and portfolios",
      "Check experience and completed jobs"
    ],
    browseTechs: "Browse Technicians →",
    browseComps: "Browse Companies →",

    compareTitle: "Comparing Offers & Profiles",
    compareSteps: [
      "Compare prices from multiple providers",
      "Check ratings & reviews",
      "Review experience and certifications",
      "Ask questions before confirming"
    ],

    paymentsTitle: "Understanding Payments & Escrow",
    paymentsDesc: "Boulot Man uses BPay Wallet & Escrow to protect both clients and service providers.",
    paymentsSteps: [
      "Pay via Mobile Money, Card, or Bank",
      "Funds can be held securely in escrow",
      "Payment is released only after approval"
    ],
    learnPayments: "Learn about Payments & Escrow →",

    disputesTitle: "Reporting Issues or Disputes",
    disputesSteps: [
      "Raise disputes directly from your dashboard",
      "Submit evidence (photos, messages, reports)",
      "Boulot Man mediates fairly"
    ],
    disputesCta: "Dispute Resolution →",

    // Technicians section
    techsTitle: "For Technicians & Free Agents",
    createTechTitle: "Creating a Technician Profile",
    createTechSteps: [
      "Register as a technician or free agent",
      "Add skills, experience, and services",
      "Upload certificates and portfolio",
      "Complete verification"
    ],
    createTechCta: "Create Technician Profile →",

    postServicesTitle: "Posting Your Services",
    postServicesSteps: [
      "Create service listings",
      "Select categories and pricing",
      "Choose onsite or remote services"
    ],

    biddingTitle: "Finding & Bidding on Tasks",
    biddingSteps: [
      "Browse posted tasks",
      "Bid with price and message",
      "Negotiate and accept jobs"
    ],

    receivingPaymentsTitle: "Receiving Payments & Withdrawals",
    receivingPaymentsSteps: [
      "Get paid through BPay Wallet",
      "Escrow-secured payments",
      "Withdraw to bank or mobile money"
    ],

    verificationTitle: "Verification & Certification",
    verificationSteps: [
      "ID and skill verification",
      "Optional certifications",
      "Tier upgrades (Basic → Pro)"
    ],
    viewTiers: "View Tier Levels →",

    // Companies section
    companiesTitle: "For Companies",
    registerCompTitle: "Registering a Company",
    registerCompSteps: [
      "Create a company account",
      "Submit licenses & documents",
      "Get verified by Boulot Man"
    ],
    registerCompCta: "Register Company →",

    postCompServicesTitle: "Posting Company Services",
    postCompServicesSteps: [
      "List company services",
      "Showcase portfolio & past projects",
      "Receive corporate job requests"
    ],

    manageCompTitle: "Managing Company Profiles",
    manageCompSteps: [
      "Update company info",
      "Manage staff and services",
      "Track ratings and performance"
    ],

    contractsTitle: "Contracts & Long-Term Projects",
    contractsSteps: [
      "Access Build-a-Team services",
      "Use escrow for large contracts",
      "Project management & reporting"
    ],

    complianceTitle: "Compliance & Verification",
    complianceSteps: [
      "License validation",
      "Safety and quality standards",
      "Enterprise-level compliance"
    ],
    enterpriseCta: "Enterprise Services →"
  },
  fr: {
    heroTitle: "Comment fonctionne Boulot Man",
    heroDesc: "Boulot Man connecte les clients avec des techniciens, ingénieurs, freelances et entreprises vérifiés à travers l'Afrique — facilitant la recherche, la gestion et le paiement de services de confiance.",
    navClients: "Clients",
    navPostTask: "Publier une tâche",
    navFindServices: "Trouver des techniciens & entreprises",
    navPayments: "Paiements & Séquestre",
    navDisputes: "Litiges",
    navTechnicians: "Techniciens",
    navCompanies: "Entreprises",
    
    // Clients section
    clientsTitle: "Pour les Clients",
    postTaskTitle: "Comment publier une tâche",
    postTaskDesc: "Publier une tâche vous permet de recevoir plusieurs offres de techniciens ou entreprises qualifiés et de choisir la meilleure option.",
    postTaskSteps: [
      "Connectez-vous à votre compte Boulot Man",
      "Cliquez sur Publier une tâche",
      "Sélectionnez la catégorie de service",
      "Décrivez clairement votre tâche",
      "Définissez le lieu, le calendrier, l'urgence et le budget",
      "Prévisualisez, modifiez, enregistrez en brouillon ou publiez"
    ],
    goToPostTask: "Aller à Publier une tâche →",

    findServicesTitle: "Trouver des techniciens & entreprises",
    findServicesDesc: "Vous pouvez soit publier une tâche, soit parcourir directement les techniciens et entreprises vérifiés.",
    findServicesSteps: [
      "Parcourir par catégorie, localisation ou évaluation",
      "Consulter les profils et portfolios vérifiés",
      "Vérifier l'expérience et les tâches accomplies"
    ],
    browseTechs: "Parcourir les techniciens →",
    browseComps: "Parcourir les entreprises →",

    compareTitle: "Comparer les offres & profils",
    compareSteps: [
      "Comparer les prix de plusieurs prestataires",
      "Consulter les avis et évaluations",
      "Examiner l'expérience et les certifications",
      "Poser des questions avant de confirmer"
    ],

    paymentsTitle: "Comprendre les paiements & le séquestre",
    paymentsDesc: "Boulot Man utilise le portefeuille BPay et le séquestre pour protéger à la fois les clients et les prestataires de services.",
    paymentsSteps: [
      "Payer par Mobile Money, Carte ou Virement bancaire",
      "Les fonds sont conservés en toute sécurité sous séquestre",
      "Le paiement n'est débloqué qu'après validation"
    ],
    learnPayments: "En savoir plus sur les paiements & séquestre →",

    disputesTitle: "Signaler des problèmes ou des litiges",
    disputesSteps: [
      "Ouvrir un litige directement depuis votre tableau de bord",
      "Soumettre des preuves (photos, messages, rapports)",
      "Boulot Man arbitre de manière impartiale"
    ],
    disputesCta: "Résolution des litiges →",

    // Technicians section
    techsTitle: "Pour les Techniciens & Agents Indépendants",
    createTechTitle: "Créer un profil de technicien",
    createTechSteps: [
      "Inscrivez-vous en tant que technicien ou indépendant",
      "Ajoutez vos compétences, votre expérience et vos services",
      "Téléversez vos diplômes, certificats et portfolio",
      "Complétez la vérification d'identité"
    ],
    createTechCta: "Créer un profil technicien →",

    postServicesTitle: "Publier vos services",
    postServicesSteps: [
      "Créer des offres de services",
      "Définir vos catégories et tarifs",
      "Choisir des prestations sur site ou à distance"
    ],

    biddingTitle: "Trouver des tâches & postuler",
    biddingSteps: [
      "Parcourir les tâches publiées",
      "Proposer votre tarif avec un message personnalisé",
      "Négocier et accepter les missions"
    ],

    receivingPaymentsTitle: "Recevoir des paiements & retraits",
    receivingPaymentsSteps: [
      "Être payé directement via le portefeuille BPay",
      "Paiements garantis et sécurisés sous séquestre",
      "Retirer vers votre compte bancaire ou Mobile Money"
    ],

    verificationTitle: "Vérification & Certification",
    verificationSteps: [
      "Vérification d'identité et des qualifications",
      "Certifications professionnelles optionnelles",
      "Niveaux de badges (Basique → Pro)"
    ],
    viewTiers: "Voir les niveaux de badges →",

    // Companies section
    companiesTitle: "Pour les Entreprises",
    registerCompTitle: "Enregistrer une entreprise",
    registerCompSteps: [
      "Créer un compte entreprise",
      "Soumettre vos licences et documents administratifs",
      "Obtenir la validation de conformité Boulot Man"
    ],
    registerCompCta: "Inscrire une entreprise →",

    postCompServicesTitle: "Publier les services de l'entreprise",
    postCompServicesSteps: [
      "Lister vos domaines d'expertise et prestations",
      "Mettre en avant votre portfolio et chantiers réalisés",
      "Recevoir des appels d'offres et demandes d'entreprises"
    ],

    manageCompTitle: "Gérer le profil de l'entreprise",
    manageCompSteps: [
      "Mettre à jour les informations de votre société",
      "Gérer vos équipes et collaborateurs",
      "Suivre les évaluations et la performance globale"
    ],

    contractsTitle: "Contrats & Grands Projets",
    contractsSteps: [
      "Accéder aux services de constitution d'équipe (Build-a-Team)",
      "Utiliser le compte séquestre pour les contrats d'envergure",
      "Gestion de projet et rapports d'avancement"
    ],

    complianceTitle: "Conformité & Vérification",
    complianceSteps: [
      "Validation légale et fiscale",
      "Normes strictes de sécurité et de qualité",
      "Conformité pour marchés d'entreprises"
    ],
    enterpriseCta: "Services Entreprises →"
  }
};

export default function HowItWorksPage() {
  const [lang, setLang] = useState("en");

  useEffect(() => {
    const updateLang = () => {
      const saved = localStorage.getItem("lang") || "en";
      setLang(saved);
    };
    updateLang();
    window.addEventListener("languageChange", updateLang);
    return () => window.removeEventListener("languageChange", updateLang);
  }, []);

  const t = translations[lang] || translations["en"];

  return (
    <div id="how-it-works-screen">
      <Header />

      <style dangerouslySetInnerHTML={{ __html: `
        .hiw-container {
          max-width: 1450px;
          margin: 40px auto 150px;
          padding: 0 24px;
        }
        
        .hiw-hero {
          background: linear-gradient(135deg, #001F3F, #0b3c6f);
          color: #fff;
          padding: 85px 65px;
          border-radius: 36px;
          box-shadow: 0 20px 50px rgba(0, 31, 63, 0.15);
        }
        
        .hiw-hero h1 {
          margin: 0;
          font-size: 48px;
          font-weight: 800;
          line-height: 1.15;
        }
        
        .hiw-hero p {
          margin-top: 18px;
          font-size: 18px;
          max-width: 1150px;
          opacity: 0.95;
          line-height: 1.6;
        }
        
        .hiw-anchor-menu {
          background: #fff;
          border-radius: 28px;
          margin-top: -36px;
          padding: 20px 30px;
          box-shadow: 0 18px 50px rgba(0, 0, 0, 0.08);
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          justify-content: center;
          position: relative;
          z-index: 10;
          border: 1px solid #e2e8f0;
        }
        
        .hiw-anchor-menu a {
          background: #f1f5f9;
          padding: 10px 20px;
          border-radius: 999px;
          color: #001F3F;
          font-weight: 700;
          font-size: 14px;
          text-decoration: none;
          transition: all 0.25s ease;
          white-space: nowrap;
        }
        
        .hiw-anchor-menu a:hover {
          background: #FF4500;
          color: #fff;
          transform: translateY(-2px);
        }
        
        .hiw-section {
          margin-top: 90px;
        }
        
        .hiw-section h2 {
          font-size: 34px;
          color: #001F3F;
          margin-bottom: 20px;
          font-weight: 800;
        }
        
        .hiw-card {
          background: #0F2C4A;
          color: #fff;
          border-radius: 28px;
          padding: 38px 32px;
          margin-top: 28px;
          box-shadow: 0 20px 50px rgba(0, 31, 63, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        
        .hiw-card h3 {
          font-size: 24px;
          color: #FF4500;
          margin-top: 0;
          margin-bottom: 16px;
          font-weight: 800;
        }
        
        .hiw-card p {
          color: rgba(255, 255, 255, 0.88);
          line-height: 1.8;
          font-size: 15.5px;
        }
        
        .hiw-card ul {
          padding-left: 20px;
          margin-top: 16px;
          color: rgba(255, 255, 255, 0.9);
        }
        
        .hiw-card li {
          margin-bottom: 10px;
          font-size: 15px;
          line-height: 1.5;
        }
        
        .hiw-card a {
          color: #ff7b47;
          font-weight: 700;
          text-decoration: none;
          display: inline-block;
          margin-top: 10px;
          transition: color 0.2s;
        }
        
        .hiw-card a:hover {
          color: #ff9d75;
          text-decoration: underline;
        }
        
        .hiw-divider {
          margin-top: 80px;
          border-top: 2px dashed #cbd6e2;
          padding-top: 80px;
        }
        
        @media (max-width: 768px) {
          .hiw-container {
            margin: 20px auto 70px;
            padding: 0 16px;
          }
          .hiw-hero {
            padding: 36px 20px;
            border-radius: 22px;
          }
          .hiw-hero h1 {
            font-size: 26px;
            line-height: 1.25;
          }
          .hiw-hero p {
            font-size: 14.5px;
            margin-top: 12px;
            line-height: 1.5;
          }
          .hiw-anchor-menu {
            margin-top: -24px;
            padding: 12px;
            border-radius: 18px;
            gap: 8px;
            justify-content: flex-start;
            overflow-x: auto;
            flex-wrap: nowrap;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
          }
          .hiw-anchor-menu::-webkit-scrollbar {
            display: none;
          }
          .hiw-anchor-menu a {
            padding: 8px 14px;
            font-size: 13px;
            flex-shrink: 0;
          }
          .hiw-section {
            margin-top: 48px;
          }
          .hiw-section h2 {
            font-size: 22px;
            margin-bottom: 12px;
          }
          .hiw-card {
            padding: 24px 18px;
            border-radius: 20px;
            margin-top: 18px;
          }
          .hiw-card h3 {
            font-size: 19px;
            margin-bottom: 12px;
          }
          .hiw-card p {
            font-size: 14px;
          }
          .hiw-card li {
            font-size: 13.5px;
          }
          .hiw-divider {
            margin-top: 48px;
            padding-top: 48px;
          }
        }
      `}} />

      <div className="hiw-container">
        {/* HERO */}
        <div className="hiw-hero">
          <h1>{t.heroTitle}</h1>
          <p>{t.heroDesc}</p>
        </div>

        {/* ANCHOR MENU */}
        <div className="hiw-anchor-menu">
          <a href="#clients">{t.navClients}</a>
          <a href="#post-task">{t.navPostTask}</a>
          <a href="#find-services">{t.navFindServices}</a>
          <a href="#payments">{t.navPayments}</a>
          <a href="#disputes">{t.navDisputes}</a>
          <a href="#technicians">{t.navTechnicians}</a>
          <a href="#companies">{t.navCompanies}</a>
        </div>

        {/* CLIENTS */}
        <div id="clients" className="hiw-section">
          <h2>{t.clientsTitle}</h2>

          <div id="post-task" className="hiw-card">
            <h3>{t.postTaskTitle}</h3>
            <p>{t.postTaskDesc}</p>
            <ul>
              {t.postTaskSteps.map((step: string, index: number) => (
                <li key={index}>{step}</li>
              ))}
            </ul>
            <p><Link href="/post-task">{t.goToPostTask}</Link></p>
          </div>

          <div id="find-services" className="hiw-card">
            <h3>{t.findServicesTitle}</h3>
            <p>{t.findServicesDesc}</p>
            <ul>
              {t.findServicesSteps.map((step: string, index: number) => (
                <li key={index}>{step}</li>
              ))}
            </ul>
            <p>
              <Link href="/technicians">{t.browseTechs}</Link><br/>
              <Link href="/companies">{t.browseComps}</Link>
            </p>
          </div>

          <div className="hiw-card">
            <h3>{t.compareTitle}</h3>
            <ul>
              {t.compareSteps.map((step: string, index: number) => (
                <li key={index}>{step}</li>
              ))}
            </ul>
          </div>

          <div id="payments" className="hiw-card">
            <h3>{t.paymentsTitle}</h3>
            <p>{t.paymentsDesc}</p>
            <ul>
              {t.paymentsSteps.map((step: string, index: number) => (
                <li key={index}>{step}</li>
              ))}
            </ul>
            <p><Link href="/help-center">{t.learnPayments}</Link></p>
          </div>

          <div id="disputes" className="hiw-card">
            <h3>{t.disputesTitle}</h3>
            <ul>
              {t.disputesSteps.map((step: string, index: number) => (
                <li key={index}>{step}</li>
              ))}
            </ul>
            <p><Link href="/help-center">{t.disputesCta}</Link></p>
          </div>
        </div>

        {/* TECHNICIANS */}
        <div id="technicians" className="hiw-section hiw-divider">
          <h2>{t.techsTitle}</h2>

          <div className="hiw-card">
            <h3>{t.createTechTitle}</h3>
            <ul>
              {t.createTechSteps.map((step: string, index: number) => (
                <li key={index}>{step}</li>
              ))}
            </ul>
            <p><Link href="/signup">{t.createTechCta}</Link></p>
          </div>

          <div className="hiw-card">
            <h3>{t.postServicesTitle}</h3>
            <ul>
              {t.postServicesSteps.map((step: string, index: number) => (
                <li key={index}>{step}</li>
              ))}
            </ul>
          </div>

          <div className="hiw-card">
            <h3>{t.biddingTitle}</h3>
            <ul>
              {t.biddingSteps.map((step: string, index: number) => (
                <li key={index}>{step}</li>
              ))}
            </ul>
          </div>

          <div className="hiw-card">
            <h3>{t.receivingPaymentsTitle}</h3>
            <ul>
              {t.receivingPaymentsSteps.map((step: string, index: number) => (
                <li key={index}>{step}</li>
              ))}
            </ul>
          </div>

          <div className="hiw-card">
            <h3>{t.verificationTitle}</h3>
            <ul>
              {t.verificationSteps.map((step: string, index: number) => (
                <li key={index}>{step}</li>
              ))}
            </ul>
            <p><Link href="/help-center">{t.viewTiers}</Link></p>
          </div>
        </div>

        {/* COMPANIES */}
        <div id="companies" className="hiw-section hiw-divider">
          <h2>{t.companiesTitle}</h2>

          <div className="hiw-card">
            <h3>{t.registerCompTitle}</h3>
            <ul>
              {t.registerCompSteps.map((step: string, index: number) => (
                <li key={index}>{step}</li>
              ))}
            </ul>
            <p><Link href="/signup">{t.registerCompCta}</Link></p>
          </div>

          <div className="hiw-card">
            <h3>{t.postCompServicesTitle}</h3>
            <ul>
              {t.postCompServicesSteps.map((step: string, index: number) => (
                <li key={index}>{step}</li>
              ))}
            </ul>
          </div>

          <div className="hiw-card">
            <h3>{t.manageCompTitle}</h3>
            <ul>
              {t.manageCompSteps.map((step: string, index: number) => (
                <li key={index}>{step}</li>
              ))}
            </ul>
          </div>

          <div className="hiw-card">
            <h3>{t.contractsTitle}</h3>
            <ul>
              {t.contractsSteps.map((step: string, index: number) => (
                <li key={index}>{step}</li>
              ))}
            </ul>
          </div>

          <div className="hiw-card">
            <h3>{t.complianceTitle}</h3>
            <ul>
              {t.complianceSteps.map((step: string, index: number) => (
                <li key={index}>{step}</li>
              ))}
            </ul>
            <p><Link href="/contractors">{t.enterpriseCta}</Link></p>
          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
}

