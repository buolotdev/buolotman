"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import { useToast } from "@/app/components/Toast";
import styles from "./page.module.css";

const translations: Record<string, Record<string, string>> = {
  en: {
    heroBadge: "Maximize Your Growth",
    heroTitle: "Tier Pricing & Subscriptions",
    heroSubtitle: "Choose the tier that matches your ambitions. Increase daily post limits, reply to unlimited tasks, unlock instant payouts, and get priority exposure across Africa.",
    monthlyBilling: "Monthly Billing",
    annualBilling: "Annual Billing",
    save20: "Save 20%",
    chooseTier: "Choose Your Professional Tier",
    chooseTierSub: "Upgrade or cancel anytime. All plans include secure escrow protection.",
    
    // Tiers
    activePlan: "Active Plan",
    perMonth: "/ month",
    freeTier: "Free Tier",
    freeDesc: "Standard entry access for starting professionals.",
    freeF1: "5 Task Proposals / month",
    freeF2: "1 Daily Task Post limit",
    freeF3: "Standard search listing",
    freeF4: "Basic direct messaging",
    freeF5: "Standard escrow payouts (48h)",
    currentPlan: "Current Plan",
    downgradeFree: "Downgrade to Free",

    basicTier: "Basic",
    basicDesc: "For active freelancers building their portfolio.",
    basicF1: "20 Task Proposals / month",
    basicF2: "3 Daily Task Posts",
    basicF3: "Verified Starter Badge",
    basicF4: "1.5x Search Exposure Boost",
    basicF5: "Priority SMS / Push alerts",
    basicF6: "Standard escrow protection",
    upgradeBasic: "Upgrade to Basic",

    mostPopular: "Most Popular",
    proTier: "Pro",
    proDesc: "For elite technicians demanding maximum work volume.",
    proF1: "Unlimited Task Proposals",
    proF2: "10 Daily Task Posts",
    proF3: "Top-Ranked Pro Badge",
    proF4: "3x Higher Search Visibility",
    proF5: "Fast-track identity vetting",
    proF6: "Reduced Platform Fee (5% off)",
    proF7: "Same-day Escrow Payouts",
    upgradePro: "Upgrade to Pro",

    enterpriseTier: "Enterprise",
    enterpriseDesc: "For contracting companies & multi-technician teams.",
    enterpriseF1: "Unlimited Task Proposals",
    enterpriseF2: "Unlimited Daily Task Posts",
    enterpriseF3: "Multi-seat Team Workspace",
    enterpriseF4: "Top #1 Featured Directory placement",
    enterpriseF5: "Dedicated Account Manager",
    enterpriseF6: "Custom invoicing & SLA",
    enterpriseF7: "Instant Escrow Payouts",
    getEnterprise: "Get Enterprise",

    // Comparison Table
    compareTitle: "Full Feature Comparison",
    thFeatures: "Features & Capabilities",
    thFree: "Free",
    thBasic: "Basic",
    thPro: "Pro",
    thEnterprise: "Enterprise",
    rowBids: "Monthly Task Proposals / Bids",
    rowBidsFree: "5 / mo",
    rowBidsBasic: "20 / mo",
    rowBidsPro: "Unlimited",
    rowBidsEnterprise: "Unlimited",
    rowPosts: "Daily Task Posts",
    rowPostsFree: "1 / day",
    rowPostsBasic: "3 / day",
    rowPostsPro: "10 / day",
    rowPostsEnterprise: "Unlimited",
    rowSearch: "Search Placement & Exposure",
    rowSearchFree: "Standard",
    rowSearchBasic: "1.5x Boost",
    rowSearchPro: "3x High Ranking",
    rowSearchEnterprise: "Top #1 Featured",
    rowBadge: "Verified Trust Badge",
    rowBadgeFree: "No",
    rowBadgeBasic: "Starter Badge",
    rowBadgePro: "Verified Pro Badge",
    rowBadgeEnterprise: "Enterprise Gold Badge",
    rowPayout: "Escrow Payout Speed",
    rowPayoutFree: "48 Hours",
    rowPayoutBasic: "24 Hours",
    rowPayoutPro: "Same Day (6h)",
    rowPayoutEnterprise: "Instant",
    rowDiscount: "Platform Commission Discount",
    rowDiscountFree: "0%",
    rowDiscountBasic: "2%",
    rowDiscountPro: "5%",
    rowDiscountEnterprise: "10%",
    rowSeats: "Team Member Seats",
    rowSeatsFree: "1",
    rowSeatsBasic: "1",
    rowSeatsPro: "1",
    rowSeatsEnterprise: "Unlimited Seats",

    // CTA
    ctaTitle: "Ready to Unlock Higher Earnings?",
    ctaDesc: "Join over 2,500+ verified professionals growing their contracting and technical business on Boulot Man.",
    upgradeProNow: "Upgrade to Pro Now",

    // Modal
    confirmUpgrade: "Confirm Upgrade",
    billedCycle: "Billed",
    instantActivation: "Instant Activation",
    paymentMethod: "Payment Method",
    walletBalance: "Wallet Balance",
    available: "Available:",
    addFunds: "+ Add Funds",
    cancel: "Cancel",
    activating: "Activating...",
    payAndUpgrade: "Pay",
    andUpgrade: "& Upgrade",

    // Deposit Modal
    addFundsTitle: "Add Funds to Wallet",
    addFundsDesc: "Top up your wallet via Mobile Money (Orange, MTN, Wave) or Credit Card.",
    depositAmountLabel: "Deposit Amount (USD)",
    processing: "Processing...",
    depositNow: "Deposit",
    now: "Now",
    
    // Toasts
    upgradeSuccess: "Upgrade Successful!",
    upgradeSuccessDesc: "Your account is now upgraded to",
    upgradeFailed: "Upgrade Failed",
    upgradeFailedDesc: "Could not complete plan upgrade.",
    invalidAmount: "Invalid Amount",
    invalidAmountDesc: "Please enter a valid deposit amount.",
    depositSuccess: "Deposit Successful",
    depositSuccessDesc: "has been added to your wallet balance.",
    depositFailed: "Deposit Failed",
    depositFailedDesc: "Could not add funds.",
  },
  fr: {
    heroBadge: "Maximisez Votre Croissance",
    heroTitle: "Tarifs des Niveaux & Abonnements",
    heroSubtitle: "Choisissez le forfait adapté à vos ambitions. Augmentez vos limites d'annonces, répondez à des missions illimitées, débloquez les paiements instantanés et gagnez en visibilité prioritaire dans toute l'Afrique.",
    monthlyBilling: "Facturation Mensuelle",
    annualBilling: "Facturation Annuelle",
    save20: "-20% d'économie",
    chooseTier: "Choisissez Votre Niveau Professionnel",
    chooseTierSub: "Changez ou résiliez à tout moment. Tous les forfaits incluent la protection sécurisée du compte séquestre.",
    
    // Tiers
    activePlan: "Forfait Actif",
    perMonth: "/ mois",
    freeTier: "Niveau Gratuit",
    freeDesc: "Accès standard pour les professionnels qui débutent.",
    freeF1: "5 propositions de mission / mois",
    freeF2: "Limite d'1 annonce par jour",
    freeF3: "Référencement standard",
    freeF4: "Messagerie directe basique",
    freeF5: "Paiements séquestre standards (48h)",
    currentPlan: "Forfait Actuel",
    downgradeFree: "Rétrograder vers Gratuit",

    basicTier: "Basique",
    basicDesc: "Pour les indépendants actifs qui développent leur portefeuille.",
    basicF1: "20 propositions de mission / mois",
    basicF2: "3 annonces de mission par jour",
    basicF3: "Badge Débutant Vérifié",
    basicF4: "Visibilité boostée x1.5 dans les recherches",
    basicF5: "Alertes prioritaires SMS / Push",
    basicF6: "Protection séquestre standard",
    upgradeBasic: "Passer à Basique",

    mostPopular: "Le Plus Populaire",
    proTier: "Pro",
    proDesc: "Pour les techniciens d'élite exigeant un volume de travail maximal.",
    proF1: "Propositions de mission illimitées",
    proF2: "10 annonces de mission par jour",
    proF3: "Badge Pro Premier Rang",
    proF4: "Visibilité dans les recherches x3",
    proF5: "Vérification d'identité prioritaire",
    proF6: "Frais de commission réduits (-5%)",
    proF7: "Paiements séquestre le jour même",
    upgradePro: "Passer à Pro",

    enterpriseTier: "Entreprise",
    enterpriseDesc: "Pour les entreprises du BTP et équipes de techniciens.",
    enterpriseF1: "Propositions de mission illimitées",
    enterpriseF2: "Annonces de mission illimitées",
    enterpriseF3: "Espace d'équipe multi-utilisateurs",
    enterpriseF4: "En tête de l'annuaire n°1 en vedette",
    enterpriseF5: "Gestionnaire de compte dédié",
    enterpriseF6: "Facturation personnalisée & SLA",
    enterpriseF7: "Paiements séquestre instantanés",
    getEnterprise: "Obtenir Entreprise",

    // Comparison Table
    compareTitle: "Comparatif Complet des Fonctionnalités",
    thFeatures: "Fonctionnalités & Capacités",
    thFree: "Gratuit",
    thBasic: "Basique",
    thPro: "Pro",
    thEnterprise: "Entreprise",
    rowBids: "Propositions / Offres mensuelles",
    rowBidsFree: "5 / mois",
    rowBidsBasic: "20 / mois",
    rowBidsPro: "Illimité",
    rowBidsEnterprise: "Illimité",
    rowPosts: "Publications de missions / jour",
    rowPostsFree: "1 / jour",
    rowPostsBasic: "3 / jour",
    rowPostsPro: "10 / jour",
    rowPostsEnterprise: "Illimité",
    rowSearch: "Positionnement & Visibilité",
    rowSearchFree: "Standard",
    rowSearchBasic: "Boost x1.5",
    rowSearchPro: "Classement Supérieur x3",
    rowSearchEnterprise: "Top n°1 En Vedette",
    rowBadge: "Badge de Confiance Vérifié",
    rowBadgeFree: "Non",
    rowBadgeBasic: "Badge Débutant",
    rowBadgePro: "Badge Pro Vérifié",
    rowBadgeEnterprise: "Badge Or Entreprise",
    rowPayout: "Délai de Paiement Séquestre",
    rowPayoutFree: "48 Heures",
    rowPayoutBasic: "24 Heures",
    rowPayoutPro: "Le Jour Même (6h)",
    rowPayoutEnterprise: "Instantané",
    rowDiscount: "Réduction Commission Plateforme",
    rowDiscountFree: "0%",
    rowDiscountBasic: "2%",
    rowDiscountPro: "5%",
    rowDiscountEnterprise: "10%",
    rowSeats: "Postes Membres d'Équipe",
    rowSeatsFree: "1",
    rowSeatsBasic: "1",
    rowSeatsPro: "1",
    rowSeatsEnterprise: "Postes Illimités",

    // CTA
    ctaTitle: "Prêt à Développer Vos Revenus ?",
    ctaDesc: "Rejoignez plus de 2 500 professionnels vérifiés qui développent leur activité technique et commerciale sur Boulot Man.",
    upgradeProNow: "Passer à Pro Maintenant",

    // Modal
    confirmUpgrade: "Confirmer le Changement de Forfait",
    billedCycle: "Facturé",
    instantActivation: "Activation Immédiate",
    paymentMethod: "Moyen de Paiement",
    walletBalance: "Solde du Portefeuille",
    available: "Disponible :",
    addFunds: "+ Recharger",
    cancel: "Annuler",
    activating: "Activation en cours...",
    payAndUpgrade: "Payer",
    andUpgrade: "& Activer",

    // Deposit Modal
    addFundsTitle: "Recharger le Portefeuille",
    addFundsDesc: "Rechargez votre portefeuille via Mobile Money (Orange, MTN, Wave) ou Carte Bancaire.",
    depositAmountLabel: "Montant du Rechargement (USD)",
    processing: "Traitement en cours...",
    depositNow: "Déposer",
    now: "Maintenant",

    // Toasts
    upgradeSuccess: "Mise à niveau réussie !",
    upgradeSuccessDesc: "Votre compte a bien été mis à niveau vers",
    upgradeFailed: "Échec de la mise à niveau",
    upgradeFailedDesc: "Impossible de finaliser le changement de forfait.",
    invalidAmount: "Montant Invalide",
    invalidAmountDesc: "Veuillez saisir un montant de dépôt valide.",
    depositSuccess: "Rechargement Réussi",
    depositSuccessDesc: "a été ajouté à votre solde de portefeuille.",
    depositFailed: "Échec du Rechargement",
    depositFailedDesc: "Impossible d'ajouter les fonds.",
  }
};

function CheckItem({ text, highlight = false }: { text: string; highlight?: boolean }) {
  return (
    <li style={{ color: highlight ? "#001f3f" : "#475569", fontWeight: highlight ? 700 : 400 }}>
      <div className={styles.checkIcon}>
        <iconify-icon icon="lucide:check-circle-2"></iconify-icon>
      </div>
      <span>{text}</span>
    </li>
  );
}

export default function UpgradePage() {
  const toast = useToast();
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

  const [isAnnual, setIsAnnual] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{ tier: string; name: string; price: number; cycle: string } | null>(null);
  const [upgrading, setUpgrading] = useState(false);
  const [depositAmount, setDepositAmount] = useState("50");
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositing, setDepositing] = useState(false);

  // Fetch current user & wallet
  const { data: user, refetch: refetchUser } = useFetch(() => api.getMe().catch(() => null), []);
  const { data: wallet, refetch: refetchWallet } = useFetch(() => api.getWallet().catch(() => null), []);

  const currentTier = user?.technician_profile?.is_verified ? "PRO" : "FREE";
  const walletBalance = Number(wallet?.available_balance || 0);

  const handleUpgradeClick = (tier: string, name: string, price: number) => {
    if (!user) {
      window.location.href = "/login?redirect=/upgrade";
      return;
    }
    setSelectedPlan({
      tier,
      name,
      price,
      cycle: isAnnual ? "yearly" : "monthly",
    });
  };

  const confirmUpgrade = async () => {
    if (!selectedPlan) return;
    setUpgrading(true);
    try {
      await api.upgradeSubscriptionPlan({
        tier: selectedPlan.tier,
        billing_cycle: selectedPlan.cycle,
        payment_source: walletBalance >= selectedPlan.price ? "wallet" : "direct",
      });
      toast.success(t.upgradeSuccess, `${t.upgradeSuccessDesc} ${selectedPlan.name}.`);
      setSelectedPlan(null);
      refetchUser();
      refetchWallet();
    } catch (err: any) {
      toast.error(t.upgradeFailed, err?.message || t.upgradeFailedDesc);
    } finally {
      setUpgrading(false);
    }
  };

  const handleDeposit = async () => {
    const num = Number(depositAmount);
    if (isNaN(num) || num <= 0) {
      toast.error(t.invalidAmount, t.invalidAmountDesc);
      return;
    }
    setDepositing(true);
    try {
      await api.depositFunds({ amount: num, payment_method: "Credit Card / Mobile Money" });
      toast.success(t.depositSuccess, `$${num} ${t.depositSuccessDesc}`);
      setShowDepositModal(false);
      refetchWallet();
    } catch (err: any) {
      toast.error(t.depositFailed, err?.message || t.depositFailedDesc);
    } finally {
      setDepositing(false);
    }
  };

  return (
    <div style={{ background: "#f5f7fb", minHeight: "100vh" }}>
      <Header />

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <iconify-icon icon="lucide:sparkles" /> {t.heroBadge}
          </div>
          <h1 className={styles.heroTitle}>{t.heroTitle}</h1>
          <p className={styles.heroSubtitle}>
            {t.heroSubtitle}
          </p>

          {/* Billing Toggle */}
          <div className={styles.billingToggle}>
            <span 
              className={`${styles.billingLabel} ${!isAnnual ? styles.billingLabelActive : ""}`}
              onClick={() => setIsAnnual(false)}
            >
              {t.monthlyBilling}
            </span>
            <button
              type="button"
              aria-label="Toggle annual billing"
              onClick={() => setIsAnnual(!isAnnual)}
              style={{
                width: 48,
                height: 26,
                borderRadius: 999,
                background: isAnnual ? "#ff4500" : "rgba(255,255,255,0.3)",
                border: "none",
                cursor: "pointer",
                position: "relative",
                transition: "all 0.2s ease",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: "#ffffff",
                  position: "absolute",
                  top: 3,
                  left: isAnnual ? 25 : 3,
                  transition: "all 0.2s ease",
                }}
              />
            </button>
            <span 
              className={`${styles.billingLabel} ${isAnnual ? styles.billingLabelActive : ""}`}
              onClick={() => setIsAnnual(true)}
            >
              {t.annualBilling} <span className={styles.saveBadge}>{t.save20}</span>
            </span>
          </div>
        </div>
      </section>

      <div className={styles.container}>
        {/* TIERS GRID */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>{t.chooseTier}</h2>
            <p style={{ color: "#64748b", margin: "8px 0 0", fontSize: "1.05rem" }}>
              {t.chooseTierSub}
            </p>
          </div>

          <div className={styles.grid4}>
            {/* FREE TIER */}
            <div className={styles.card}>
              {currentTier === "FREE" && (
                <div className={styles.activeTag}>
                  <iconify-icon icon="lucide:check-circle" style={{ fontSize: "13px", color: "#22c55e" }}></iconify-icon>
                  {t.activePlan}
                </div>
              )}
              <h3 className={styles.tierName}>{t.freeTier}</h3>

              <p className={styles.price}>$0 <span>{t.perMonth}</span></p>
              <p style={{ color: "#64748b", fontSize: "0.9rem", margin: "-10px 0 20px" }}>{t.freeDesc}</p>

              <ul className={styles.featureList}>
                <CheckItem text={t.freeF1} />
                <CheckItem text={t.freeF2} />
                <CheckItem text={t.freeF3} />
                <CheckItem text={t.freeF4} />
                <CheckItem text={t.freeF5} />
              </ul>

              <button
                disabled={currentTier === "FREE"}
                style={{
                  width: "100%",
                  padding: "16px",
                  borderRadius: "16px",
                  border: "none",
                  background: currentTier === "FREE" ? "#e2e8f0" : "#001f3f",
                  color: currentTier === "FREE" ? "#64748b" : "#fff",
                  fontWeight: 800,
                  fontSize: "1rem",
                  cursor: currentTier === "FREE" ? "default" : "pointer",
                }}
              >
                {currentTier === "FREE" ? t.currentPlan : t.downgradeFree}
              </button>
            </div>

            {/* BASIC */}
            <div className={styles.card}>
              <h3 className={styles.tierName}>{t.basicTier}</h3>
              <p className={styles.price}>
                ${isAnnual ? 7 : 9} <span>{t.perMonth}</span>
              </p>
              <p style={{ color: "#64748b", fontSize: "0.9rem", margin: "-10px 0 20px" }}>{t.basicDesc}</p>

              <ul className={styles.featureList}>
                <CheckItem text={t.basicF1} highlight />
                <CheckItem text={t.basicF2} highlight />
                <CheckItem text={t.basicF3} />
                <CheckItem text={t.basicF4} />
                <CheckItem text={t.basicF5} />
                <CheckItem text={t.basicF6} />
              </ul>

              <button
                className={`${styles.upgradeBtn} ${styles.upgradeBtnDark}`}
                onClick={() => handleUpgradeClick("BASIC", "Basic Plan", isAnnual ? 90 : 9)}
              >
                {t.upgradeBasic}
              </button>
            </div>

            {/* PRO - POPULAR */}
            <div className={`${styles.card} ${styles.cardPro}`}>
              <div className={styles.tag}>{t.mostPopular}</div>
              <h3 className={styles.tierName}>{t.proTier}</h3>
              <p className={styles.price}>
                ${isAnnual ? 15 : 19} <span>{t.perMonth}</span>
              </p>
              <p style={{ color: "#64748b", fontSize: "0.9rem", margin: "-10px 0 20px" }}>{t.proDesc}</p>

              <ul className={styles.featureList}>
                <CheckItem text={t.proF1} highlight />
                <CheckItem text={t.proF2} highlight />
                <CheckItem text={t.proF3} highlight />
                <CheckItem text={t.proF4} highlight />
                <CheckItem text={t.proF5} />
                <CheckItem text={t.proF6} />
                <CheckItem text={t.proF7} />
              </ul>

              <button
                className={`${styles.upgradeBtn} ${styles.upgradeBtnAccent}`}
                onClick={() => handleUpgradeClick("PRO", "Pro Plan", isAnnual ? 190 : 19)}
              >
                {t.upgradePro}
              </button>
            </div>

            {/* ENTERPRISE */}
            <div className={`${styles.card} ${styles.cardEnterprise}`}>
              <h3 className={styles.tierName}>{t.enterpriseTier}</h3>
              <p className={styles.price}>
                ${isAnnual ? 119 : 149} <span>{t.perMonth}</span>
              </p>
              <p style={{ color: "#64748b", fontSize: "0.9rem", margin: "-10px 0 20px" }}>{t.enterpriseDesc}</p>

              <ul className={styles.featureList}>
                <CheckItem text={t.enterpriseF1} highlight />
                <CheckItem text={t.enterpriseF2} highlight />
                <CheckItem text={t.enterpriseF3} highlight />
                <CheckItem text={t.enterpriseF4} highlight />
                <CheckItem text={t.enterpriseF5} />
                <CheckItem text={t.enterpriseF6} />
                <CheckItem text={t.enterpriseF7} />
              </ul>

              <button
                className={`${styles.upgradeBtn} ${styles.upgradeBtnDark}`}
                onClick={() => handleUpgradeClick("ENTERPRISE", "Enterprise Plan", isAnnual ? 1490 : 149)}
              >
                {t.getEnterprise}
              </button>
            </div>
          </div>
        </section>

        {/* COMPARISON TABLE */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>{t.compareTitle}</h2>
          </div>

          <div className={styles.compareWrap}>
            <table className={styles.compareTable}>
              <thead>
                <tr>
                  <th>{t.thFeatures}</th>
                  <th>{t.thFree}</th>
                  <th>{t.thBasic}</th>
                  <th>{t.thPro}</th>
                  <th>{t.thEnterprise}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{t.rowBids}</td>
                  <td>{t.rowBidsFree}</td>
                  <td>{t.rowBidsBasic}</td>
                  <td><strong>{t.rowBidsPro}</strong></td>
                  <td><strong>{t.rowBidsEnterprise}</strong></td>
                </tr>
                <tr>
                  <td>{t.rowPosts}</td>
                  <td>{t.rowPostsFree}</td>
                  <td>{t.rowPostsBasic}</td>
                  <td>{t.rowPostsPro}</td>
                  <td><strong>{t.rowPostsEnterprise}</strong></td>
                </tr>
                <tr>
                  <td>{t.rowSearch}</td>
                  <td>{t.rowSearchFree}</td>
                  <td>{t.rowSearchBasic}</td>
                  <td><strong>{t.rowSearchPro}</strong></td>
                  <td><strong>{t.rowSearchEnterprise}</strong></td>
                </tr>
                <tr>
                  <td>{t.rowBadge}</td>
                  <td>{t.rowBadgeFree}</td>
                  <td>{t.rowBadgeBasic}</td>
                  <td><strong>{t.rowBadgePro}</strong></td>
                  <td><strong>{t.rowBadgeEnterprise}</strong></td>
                </tr>
                <tr>
                  <td>{t.rowPayout}</td>
                  <td>{t.rowPayoutFree}</td>
                  <td>{t.rowPayoutBasic}</td>
                  <td><strong>{t.rowPayoutPro}</strong></td>
                  <td><strong>{t.rowPayoutEnterprise}</strong></td>
                </tr>
                <tr>
                  <td>{t.rowDiscount}</td>
                  <td>{t.rowDiscountFree}</td>
                  <td>{t.rowDiscountBasic}</td>
                  <td><strong>{t.rowDiscountPro}</strong></td>
                  <td><strong>{t.rowDiscountEnterprise}</strong></td>
                </tr>
                <tr>
                  <td>{t.rowSeats}</td>
                  <td>{t.rowSeatsFree}</td>
                  <td>{t.rowSeatsBasic}</td>
                  <td>{t.rowSeatsPro}</td>
                  <td><strong>{t.rowSeatsEnterprise}</strong></td>
                </tr>
              </tbody>
            </table>
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
          <button
            className={styles.ctaBtn}
            onClick={() => handleUpgradeClick("PRO", "Pro Plan", isAnnual ? 190 : 19)}
          >
            {t.upgradeProNow} <iconify-icon icon="lucide:arrow-right" />
          </button>
        </section>
      </div>

      {/* UPGRADE CHECKOUT MODAL */}
      {selectedPlan && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0, 31, 63, 0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: 20 }}>
          <div style={{ background: "#ffffff", borderRadius: 24, maxWidth: 480, width: "100%", padding: 32, boxShadow: "0 25px 50px rgba(0,0,0,0.25)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: "1.4rem", color: "#001f3f" }}>{t.confirmUpgrade}</h3>
              <button
                onClick={() => setSelectedPlan(null)}
                style={{ border: "none", background: "transparent", cursor: "pointer", fontSize: 24, color: "#64748b" }}
              >
                <iconify-icon icon="lucide:x" />
              </button>
            </div>

            <div style={{ background: "#f8fafc", padding: "16px 20px", borderRadius: 16, border: "1px solid #e2e8f0", marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontWeight: 700, color: "#001f3f", fontSize: "1.1rem" }}>{selectedPlan.name}</span>
                <span style={{ fontWeight: 900, color: "#ff4500", fontSize: "1.3rem" }}>${selectedPlan.price} USD</span>
              </div>
              <span style={{ fontSize: "0.85rem", color: "#64748b", textTransform: "capitalize" }}>
                {t.billedCycle} {selectedPlan.cycle} • {t.instantActivation}
              </span>
            </div>

            {/* Payment Source */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 700, color: "#001f3f", marginBottom: 8 }}>
                {t.paymentMethod}
              </label>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", borderRadius: 12, border: "2px solid #001f3f", background: "#f0fdf4" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <iconify-icon icon="lucide:wallet" style={{ fontSize: 24, color: "#16a34a" }} />
                  <div>
                    <strong style={{ display: "block", fontSize: "0.95rem", color: "#001f3f" }}>{t.walletBalance}</strong>
                    <small style={{ color: "#64748b" }}>{t.available} ${walletBalance.toFixed(2)} USD</small>
                  </div>
                </div>
                {walletBalance < selectedPlan.price && (
                  <button
                    onClick={() => setShowDepositModal(true)}
                    style={{ background: "#001f3f", color: "#fff", border: "none", borderRadius: 8, padding: "6px 12px", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer" }}
                  >
                    {t.addFunds}
                  </button>
                )}
              </div>
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={() => setSelectedPlan(null)}
                style={{ flex: 1, padding: 14, borderRadius: 12, border: "1px solid #cbd5e1", background: "#fff", color: "#64748b", fontWeight: 700, cursor: "pointer" }}
              >
                {t.cancel}
              </button>
              <button
                onClick={confirmUpgrade}
                disabled={upgrading}
                style={{ flex: 2, padding: 14, borderRadius: 12, border: "none", background: "#ff4500", color: "#fff", fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
              >
                {upgrading ? t.activating : `${t.payAndUpgrade} $${selectedPlan.price} ${t.andUpgrade}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOP-UP / DEPOSIT MODAL */}
      {showDepositModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0, 31, 63, 0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10000, padding: 20 }}>
          <div style={{ background: "#ffffff", borderRadius: 24, maxWidth: 440, width: "100%", padding: 32 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: "1.3rem", color: "#001f3f" }}>{t.addFundsTitle}</h3>
              <button onClick={() => setShowDepositModal(false)} style={{ border: "none", background: "transparent", cursor: "pointer", fontSize: 24 }}>
                <iconify-icon icon="lucide:x" />
              </button>
            </div>

            <p style={{ color: "#64748b", fontSize: "0.9rem", marginBottom: 20 }}>
              {t.addFundsDesc}
            </p>

            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#001f3f", marginBottom: 6 }}>
              {t.depositAmountLabel}
            </label>
            <input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid #cbd5e1", fontSize: "1.2rem", fontWeight: 800, outline: "none", marginBottom: 24 }}
            />

            <button
              onClick={handleDeposit}
              disabled={depositing}
              style={{ width: "100%", padding: 14, borderRadius: 12, border: "none", background: "#16a34a", color: "#fff", fontWeight: 800, fontSize: "1rem", cursor: "pointer" }}
            >
              {depositing ? t.processing : `${t.depositNow} $${depositAmount} ${t.now}`}
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
