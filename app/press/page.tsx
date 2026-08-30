"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

const translations: Record<string, Record<string, any>> = {
  en: {
    heroTitle: "Press & Media",
    heroDesc: "Latest news, announcements, and media resources from Boulot Man. We welcome journalists, bloggers, and media partners.",
    pressMeta: "For press inquiries: press@boulotman.com",
    newsTitle: "Latest News",
    newsDesc: "Official announcements and coverage from Boulot Man.",
    tagRelease: "Press Release",
    tagCoverage: "Media Coverage",
    tagAnnouncement: "Announcement",
    card1Title: "Boulot Man Launches Across New African Markets",
    card1Desc: "The platform expands operations to new regions, empowering more technicians and businesses.",
    card2Title: "How Boulot Man Is Reshaping the African Workforce",
    card2Desc: "Industry leaders discuss the impact of verified digital labor platforms.",
    card3Title: "Introducing Secure Escrow Payments for All Projects",
    card3Desc: "Ensuring trust, transparency, and accountability across the platform.",
    readMore: "Read more →",
    mediaKitTitle: "Media Kit",
    mediaKitDesc: "Download official Boulot Man assets and brand resources.",
    kit1Title: "Brand Logos",
    kit1Desc: "Official logos in multiple formats.",
    kit2Title: "Brand Guidelines",
    kit2Desc: "Usage rules, colors, and typography.",
    kit3Title: "Product Screenshots",
    kit3Desc: "High-resolution platform images.",
    kit4Title: "Company Fact Sheet",
    kit4Desc: "Quick overview of Boulot Man.",
    btnDownload: "Download",
    glanceTitle: "Boulot Man at a Glance",
    glanceDesc: "Key facts for journalists and partners.",
    fact1Number: "50,000+",
    fact1Label: "Tasks Completed",
    fact2Number: "12,000+",
    fact2Label: "Verified Professionals",
    fact3Number: "8+",
    fact3Label: "Countries Served",
    fact4Number: "4.8/5",
    fact4Label: "Average Rating",
    mediaInquiriesTitle: "Media Inquiries",
    mediaInquiriesDesc: "For interviews, press materials, or speaking opportunities, contact our media team.",
    btnContactPress: "Contact Press Team"
  },
  fr: {
    heroTitle: "Presse & Médias",
    heroDesc: "Dernières actualités, communiqués et ressources médias de Boulot Man. Bienvenue aux journalistes et partenaires de presse.",
    pressMeta: "Pour toute demande presse : press@boulotman.com",
    newsTitle: "Dernières Actualités",
    newsDesc: "Communiqués officiels et couverture médiatique de Boulot Man.",
    tagRelease: "Communiqué de Presse",
    tagCoverage: "Couverture Médias",
    tagAnnouncement: "Annonce Officielle",
    card1Title: "Boulot Man s'étend sur de nouveaux marchés africains",
    card1Desc: "La plateforme élargit ses opérations vers de nouveaux pays pour autonomiser plus de techniciens et d'entreprises.",
    card2Title: "Comment Boulot Man transforme le travail technique en Afrique",
    card2Desc: "Les leaders économiques débattent de l'impact des plateformes de main-d'œuvre vérifiée.",
    card3Title: "Lancement du paiement sous séquestre sécurisé pour tous les projets",
    card3Desc: "Garantir confiance, transparence et sérénité sur toute la plateforme.",
    readMore: "Lire la suite →",
    mediaKitTitle: "Kit Média",
    mediaKitDesc: "Téléchargez les logos officiels, visuels et ressources de marque Boulot Man.",
    kit1Title: "Logos Officiels",
    kit1Desc: "Fichiers vectoriels et formats haute définition.",
    kit2Title: "Charte Graphique",
    kit2Desc: "Guide des couleurs, typographies et règles d'utilisation.",
    kit3Title: "Captures d'Écran",
    kit3Desc: "Visuels haute résolution de la plateforme.",
    kit4Title: "Fiche Synthétique",
    kit4Desc: "Vue d'ensemble rapide et chiffres clés de Boulot Man.",
    btnDownload: "Télécharger",
    glanceTitle: "Boulot Man en Chiffres",
    glanceDesc: "Données clés pour journalistes et investisseurs.",
    fact1Number: "50 000+",
    fact1Label: "Missions Réalisées",
    fact2Number: "12 000+",
    fact2Label: "Professionnels Vérifiés",
    fact3Number: "8+",
    fact3Label: "Pays Couverts",
    fact4Number: "4.8/5",
    fact4Label: "Note Moyenne",
    mediaInquiriesTitle: "Relations Presse",
    mediaInquiriesDesc: "Pour des demandes d'interviews, des reportages ou des dossiers de presse, contactez notre équipe.",
    btnContactPress: "Contacter l'Équipe Presse"
  }
};

export default function PressPage() {
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
    <div id="press-screen">
      <Header />

      <style dangerouslySetInnerHTML={{ __html: `
        .press-hero {
          padding: 90px 60px;
          background: linear-gradient(135deg, #001F3F, #003366);
          color: #fff;
          text-align: center;
        }
        .press-hero h2 {
          font-size: 3rem;
          margin-bottom: 16px;
        }
        .press-hero p {
          max-width: 900px;
          margin: 0 auto 30px;
          font-size: 1.15rem;
        }
        .press-hero .press-meta {
          font-size: 0.9rem;
          color: #cfe0f1;
        }
        
        .press-section {
          padding: 80px 60px;
        }
        .press-section-title {
          text-align: center;
          margin-bottom: 60px;
        }
        .press-section-title h3 {
          font-size: 2.4rem;
          color: #001F3F;
        }
        .press-section-title p {
          max-width: 900px;
          margin: 14px auto 0;
          color: #555;
          font-size: 1.05rem;
        }
        
        .press-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
          max-width: 1400px;
          margin: 0 auto;
        }
        .press-card {
          background: #0F2C4A;
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .press-card img {
          width: 100%;
          height: 180px;
          object-fit: cover;
        }
        .press-content {
          padding: 22px;
        }
        .press-content span {
          display: inline-block;
          font-size: 0.8rem;
          color: #FF4500;
          font-weight: 600;
          margin-bottom: 8px;
        }
        .press-content h4 {
          color: #fff;
          margin-bottom: 10px;
          font-size: 1.1rem;
        }
        .press-content p {
          font-size: 0.95rem;
          color: rgba(255, 255, 255, 0.85);
          margin-bottom: 16px;
        }
        .press-content a {
          color: #FF4500;
          font-weight: 600;
          text-decoration: none;
        }
        .press-content a:hover {
          text-decoration: underline;
        }
        
        .media-kit {
          background: #F4F6F9;
        }
        .media-kit .press-section-title h3 {
          color: #001F3F;
        }
        .media-kit .press-section-title p {
          color: #555;
        }
        .kit-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
          max-width: 1400px;
          margin: 0 auto;
        }
        .kit-card {
          background: #fff;
          border-radius: 16px;
          padding: 28px;
          border: 1px solid #E0E6ED;
          text-align: center;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .kit-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 24px rgba(0,0,0,0.06);
        }
        .kit-card h4 {
          color: #001F3F;
          font-size: 1.15rem;
          margin-bottom: 8px;
        }
        .kit-card p {
          font-size: 0.9rem;
          color: #666;
          margin-bottom: 18px;
        }
        .kit-card a {
          display: inline-block;
          padding: 8px 20px;
          border-radius: 6px;
          background: #001F3F;
          color: #fff;
          text-decoration: none;
          font-size: 0.85rem;
          font-weight: 600;
          transition: background 0.2s ease;
        }
        .kit-card a:hover {
          background: #FF4500;
        }
        
        .press-facts {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 30px;
          text-align: center;
          max-width: 1400px;
          margin: 0 auto;
        }
        .press-fact strong {
          display: block;
          font-size: 2rem;
          color: #001F3F;
        }
        .press-fact span {
          font-size: 0.9rem;
          color: #555;
        }
        
        .press-contact {
          background: linear-gradient(135deg, #001F3F, #002b55);
          color: #fff;
          text-align: center;
          padding: 90px 60px;
        }
        .press-contact h3 {
          font-size: 2.4rem;
          margin-bottom: 18px;
        }
        .press-contact p {
          max-width: 800px;
          margin: 0 auto 30px;
          font-size: 1.1rem;
        }
        .press-contact a {
          background: #FF4500;
          color: #fff;
          padding: 14px 34px;
          border-radius: 8px;
          text-decoration: none;
          font-size: 1rem;
          display: inline-block;
          font-weight: 600;
          transition: background 0.2s ease;
        }
        .press-contact a:hover {
          background: #e63e00;
        }
        
        @media (max-width: 1100px) {
          .press-grid, .kit-grid, .press-facts {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (max-width: 700px) {
          .press-section {
            padding: 60px 30px;
          }
          .press-hero {
            padding: 60px 30px;
          }
          .press-grid, .kit-grid, .press-facts {
            grid-template-columns: 1fr;
          }
        }
      `}} />

      <section className="press-hero">
        <h2>{t.heroTitle}</h2>
        <p>{t.heroDesc}</p>
        <div className="press-meta">{t.pressMeta}</div>
      </section>

      <section className="press-section">
        <div className="press-section-title">
          <h3>{t.newsTitle}</h3>
          <p>{t.newsDesc}</p>
        </div>
        <div className="press-grid">
          <div className="press-card">
            <img src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg" alt="Press Release" />
            <div className="press-content">
              <span>{t.tagRelease}</span>
              <h4>{t.card1Title}</h4>
              <p>{t.card1Desc}</p>
              <Link href="#">{t.readMore}</Link>
            </div>
          </div>
          <div className="press-card">
            <img src="https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg" alt="Media Coverage" />
            <div className="press-content">
              <span>{t.tagCoverage}</span>
              <h4>{t.card2Title}</h4>
              <p>{t.card2Desc}</p>
              <Link href="#">{t.readMore}</Link>
            </div>
          </div>
          <div className="press-card">
            <img src="https://images.pexels.com/photos/3183173/pexels-photo-3183173.jpeg" alt="Announcement" />
            <div className="press-content">
              <span>{t.tagAnnouncement}</span>
              <h4>{t.card3Title}</h4>
              <p>{t.card3Desc}</p>
              <Link href="#">{t.readMore}</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="press-section media-kit">
        <div className="press-section-title">
          <h3>{t.mediaKitTitle}</h3>
          <p>{t.mediaKitDesc}</p>
        </div>
        <div className="kit-grid">
          <div className="kit-card">
            <h4>{t.kit1Title}</h4>
            <p>{t.kit1Desc}</p>
            <Link href="#">{t.btnDownload}</Link>
          </div>
          <div className="kit-card">
            <h4>{t.kit2Title}</h4>
            <p>{t.kit2Desc}</p>
            <Link href="#">{t.btnDownload}</Link>
          </div>
          <div className="kit-card">
            <h4>{t.kit3Title}</h4>
            <p>{t.kit3Desc}</p>
            <Link href="#">{t.btnDownload}</Link>
          </div>
          <div className="kit-card">
            <h4>{t.kit4Title}</h4>
            <p>{t.kit4Desc}</p>
            <Link href="#">{t.btnDownload}</Link>
          </div>
        </div>
      </section>

      <section className="press-section">
        <div className="press-section-title">
          <h3>{t.glanceTitle}</h3>
          <p>{t.glanceDesc}</p>
        </div>
        <div className="press-facts">
          <div className="press-fact"><strong>{t.fact1Number}</strong><span>{t.fact1Label}</span></div>
          <div className="press-fact"><strong>{t.fact2Number}</strong><span>{t.fact2Label}</span></div>
          <div className="press-fact"><strong>{t.fact3Number}</strong><span>{t.fact3Label}</span></div>
          <div className="press-fact"><strong>{t.fact4Number}</strong><span>{t.fact4Label}</span></div>
        </div>
      </section>

      <section className="press-contact">
        <h3>{t.mediaInquiriesTitle}</h3>
        <p>{t.mediaInquiriesDesc}</p>
        <a href="mailto:press@boulotman.com">{t.btnContactPress}</a>
      </section>

      <Footer />
    </div>
  );
}
