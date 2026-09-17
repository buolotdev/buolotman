"use client";

import { useState, useEffect } from "react";
import { useFetch } from "@/app/lib/useFetch";
import { api } from "@/app/lib/api";
import { formatXOF } from "@/app/lib/format";
import DashboardHeader from "@/app/components/DashboardHeader";
import ClientSidebar from "@/app/components/ClientSidebar";
import styles from "./payments.module.css";

type Transaction = {
  id: number | string;
  created_at?: string;
  type?: string;
  category?: string;
  amount?: number;
  status?: string;
  method?: string;
};

type PaymentMethodItem = {
  id: string;
  type: "mtn" | "orange" | "card" | "wallet";
  name: string;
  detail: string;
  isDefault: boolean;
  icon: string;
  color: string;
  bgColor: string;
};

const translations: Record<string, Record<string, string>> = {
  en: {
    pageTitle: "Payments & Escrows",
    pageSubtitle: "Monitor your available balances, pending deposits, active payment methods, and task payouts.",
    availableBalance: "Available Balance",
    pendingEscrow: "Funds in Escrow Vault",
    depositFunds: "Deposit Funds",
    addPaymentMethod: "Add Payment Method",
    escrowBannerTitle: "Escrow Protection & Automated Billing",
    escrowBannerText: "When you hire a specialist or company, payment is held safely in the BoulotMan Escrow Vault via your default payment method. Funds are only released once you inspect and approve the completed job.",
    paymentMethodsTitle: "Active Payment Methods (Source of Funds)",
    paymentMethodsSubtitle: "Manage the mobile money accounts and cards used to fund tasks, milestone escrows, and direct hires.",
    defaultBadge: "Default Method",
    activeBadge: "Connected",
    makeDefault: "Set as Default",
    removeMethod: "Remove",
    txHistory: "Transaction & Escrow History",
    loading: "Loading transactions...",
    noTx: "No transaction history recorded yet.",
    thDate: "Date",
    thType: "Type",
    thMethod: "Payment Method",
    thCategory: "Category",
    thAmount: "Amount",
    thStatus: "Status",
    // Deposit Modal
    depositModalTitle: "Deposit Funds to Wallet",
    depositModalSubtitle: "Instantly top up your account balance via Mobile Money or Card.",
    operatorLabel: "Select Payment Operator",
    phoneNumberLabel: "Mobile Money Phone Number",
    amountLabel: "Deposit Amount (XOF)",
    confirmDeposit: "Confirm & Pay via CamPay",
    processing: "Processing...",
    depositSuccessMsg: "Payment request sent! Please approve the USSD prompt on your phone.",
    depositCompleteMsg: "Deposit successful! Balance updated.",
    // Add Method Modal
    addMethodModalTitle: "Add New Payment Method",
    addMethodModalSubtitle: "Save a new mobile wallet or card for seamless task payouts.",
    methodTypeLabel: "Payment Type",
    accountHolderLabel: "Account Holder Name",
    cardNumberLabel: "Card Number",
    expiryLabel: "Expiry Date (MM/YY)",
    cvcLabel: "CVC",
    saveMethod: "Save Payment Method",
    cancel: "Cancel",
  },
  fr: {
    pageTitle: "Paiements & Séquestres",
    pageSubtitle: "Suivez vos soldes disponibles, dépôts, moyens de paiement et paiements de missions.",
    availableBalance: "Solde Disponible",
    pendingEscrow: "Fonds sous Séquestre",
    depositFunds: "Déposer des Fonds",
    addPaymentMethod: "Ajouter un Moyen de Paiement",
    escrowBannerTitle: "Protection Séquestre & Facturation Sécurisée",
    escrowBannerText: "Lorsque vous engagez un spécialiste ou une entreprise, les fonds sont bloqués en toute sécurité dans le coffre BoulotMan via votre moyen de paiement par défaut. Ils ne sont libérés qu'après votre validation des travaux.",
    paymentMethodsTitle: "Moyens de Paiement Actifs (Source de Financement)",
    paymentMethodsSubtitle: "Gérez vos comptes Mobile Money et cartes bancaires utilisés pour financer les missions et jalons.",
    defaultBadge: "Par Défaut",
    activeBadge: "Connecté",
    makeDefault: "Définir par défaut",
    removeMethod: "Supprimer",
    txHistory: "Historique des Transactions & Séquestres",
    loading: "Chargement des transactions...",
    noTx: "Aucune transaction enregistrée pour le moment.",
    thDate: "Date",
    thType: "Type",
    thMethod: "Moyen de Paiement",
    thCategory: "Catégorie",
    thAmount: "Montant",
    thStatus: "Statut",
    // Deposit Modal
    depositModalTitle: "Recharger le Solde du Compte",
    depositModalSubtitle: "Rechargez instantanément votre solde via Mobile Money ou Carte Bancaire.",
    operatorLabel: "Sélectionnez l'Opérateur",
    phoneNumberLabel: "Numéro de Téléphone Mobile Money",
    amountLabel: "Montant du Dépôt (XOF)",
    confirmDeposit: "Confirmer & Payer via CamPay",
    processing: "Traitement en cours...",
    depositSuccessMsg: "Demande envoyée ! Veuillez valider le message USSD sur votre téléphone.",
    depositCompleteMsg: "Dépôt réussi ! Solde mis à jour.",
    // Add Method Modal
    addMethodModalTitle: "Ajouter un Moyen de Paiement",
    addMethodModalSubtitle: "Enregistrez un portefeuille mobile ou une carte pour vos paiements.",
    methodTypeLabel: "Type de Paiement",
    accountHolderLabel: "Nom du Titulaire",
    cardNumberLabel: "Numéro de Carte",
    expiryLabel: "Date d'Expiration (MM/AA)",
    cvcLabel: "CVC",
    saveMethod: "Enregistrer le Moyen de Paiement",
    cancel: "Annuler",
  }
};

export default function ClientPaymentsPage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
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

  const { data: user } = useFetch(() => api.getMe(), []);
  const { data: wallet, loading: walletLoading, refetch: refetchWallet } = useFetch(() => api.getWallet(), []);
  const { data: txData, loading: txLoading, refetch: refetchTx } = useFetch(() => api.getTransactions({ limit: "20" }), []);

  const transactions: Transaction[] = Array.isArray(txData) ? txData : ((txData as any)?.results || []);

  // Saved Payment Methods
  const defaultPhone = user?.phone || "+237 670 000 000";
  const [methods, setMethods] = useState<PaymentMethodItem[]>([
    {
      id: "momo-mtn",
      type: "mtn",
      name: "MTN Mobile Money",
      detail: defaultPhone,
      isDefault: true,
      icon: "lucide:smartphone",
      color: "#eab308",
      bgColor: "#fef9c3",
    },
    {
      id: "momo-orange",
      type: "orange",
      name: "Orange Money",
      detail: "+237 690 000 000",
      isDefault: false,
      icon: "lucide:smartphone",
      color: "#ea580c",
      bgColor: "#ffedd5",
    },
    {
      id: "card-visa",
      type: "card",
      name: "Visa / Mastercard",
      detail: "•••• •••• •••• 4242",
      isDefault: false,
      icon: "lucide:credit-card",
      color: "#2563eb",
      bgColor: "#dbeafe",
    },
    {
      id: "escrow-vault",
      type: "wallet",
      name: "BoulotMan Escrow Vault",
      detail: "Available Balance Auto-Deduction",
      isDefault: false,
      icon: "lucide:shield-check",
      color: "#16a34a",
      bgColor: "#dcfce7",
    }
  ]);

  // Load custom default from localStorage if exists
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedDefault = localStorage.getItem("boulotman_default_payment_method");
      if (savedDefault) {
        setMethods(prev => prev.map(m => ({ ...m, isDefault: m.id === savedDefault })));
      }
    }
  }, []);

  const handleSetDefaultMethod = (id: string) => {
    setMethods(prev => prev.map(m => ({ ...m, isDefault: m.id === id })));
    if (typeof window !== "undefined") {
      localStorage.setItem("boulotman_default_payment_method", id);
    }
  };

  // Deposit Modal State
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState("10000");
  const [depositOperator, setDepositOperator] = useState<"MTN" | "ORANGE" | "CARD">("MTN");
  const [depositPhone, setDepositPhone] = useState(user?.phone || "");
  const [depositing, setDepositing] = useState(false);
  const [depositNotice, setDepositNotice] = useState<string | null>(null);
  const [depositError, setDepositError] = useState<string | null>(null);
  const [depositRef, setDepositRef] = useState<string | null>(null);

  // Add Method Modal State
  const [isAddMethodOpen, setIsAddMethodOpen] = useState(false);
  const [newMethodType, setNewMethodType] = useState<"mtn" | "orange" | "card">("mtn");
  const [newPhone, setNewPhone] = useState("");
  const [newCardNumber, setNewCardNumber] = useState("");
  const [newCardHolder, setNewCardHolder] = useState("");

  // Poll CamPay deposit status
  useEffect(() => {
    if (!depositRef) return;
    const interval = setInterval(async () => {
      try {
        const res = await api.campayCheckStatus(depositRef);
        if (res?.status === "SUCCESSFUL" || res?.is_completed) {
          clearInterval(interval);
          setDepositing(false);
          setDepositNotice(t.depositCompleteMsg);
          refetchWallet();
          refetchTx();
          setTimeout(() => {
            setIsDepositOpen(false);
            setDepositNotice(null);
            setDepositRef(null);
          }, 2500);
        } else if (res?.status === "FAILED") {
          clearInterval(interval);
          setDepositing(false);
          setDepositError("Transaction failed or declined on mobile phone.");
        }
      } catch (err) {
        console.error("CamPay status check error:", err);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [depositRef, refetchWallet, refetchTx, t.depositCompleteMsg]);

  const handleDepositSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDepositError(null);
    setDepositNotice(null);

    const amt = parseFloat(depositAmount);
    if (isNaN(amt) || amt < 500) {
      setDepositError("Minimum deposit amount is 500 XOF");
      return;
    }

    if (depositOperator !== "CARD" && !depositPhone.trim()) {
      setDepositError("Please enter a valid phone number");
      return;
    }

    setDepositing(true);
    try {
      if (depositOperator === "CARD") {
        // Direct wallet top up
        const res = await api.campayCollect({
          amount: amt,
          phone_number: depositPhone || "670000000",
          purpose: "wallet_topup",
          description: "Client Wallet Deposit via Card/Gateway"
        });
        if (res?.reference) {
          setDepositRef(res.reference);
          setDepositNotice(t.depositSuccessMsg);
        } else {
          refetchWallet();
          refetchTx();
          setDepositNotice(t.depositCompleteMsg);
          setDepositing(false);
          setTimeout(() => setIsDepositOpen(false), 2000);
        }
      } else {
        const cleanPhone = depositPhone.replace(/[^0-9]/g, "");
        const res = await api.campayCollect({
          amount: amt,
          phone_number: cleanPhone,
          purpose: "wallet_topup",
          description: `Client Wallet Deposit via ${depositOperator} MoMo`
        });
        if (res?.reference) {
          setDepositRef(res.reference);
          setDepositNotice(t.depositSuccessMsg);
        } else {
          setDepositError(res?.message || "Failed to initiate payment. Please try again.");
          setDepositing(false);
        }
      }
    } catch (err: any) {
      setDepositError(err?.message || "Deposit request failed. Please check phone number.");
      setDepositing(false);
    }
  };

  const handleSaveNewMethod = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMethodType === "card") {
      const last4 = newCardNumber.slice(-4) || "8888";
      const newMethod: PaymentMethodItem = {
        id: `card-${Date.now()}`,
        type: "card",
        name: "Credit / Debit Card",
        detail: `•••• •••• •••• ${last4}`,
        isDefault: false,
        icon: "lucide:credit-card",
        color: "#2563eb",
        bgColor: "#dbeafe",
      };
      setMethods(prev => [...prev, newMethod]);
    } else {
      const operatorName = newMethodType === "mtn" ? "MTN Mobile Money" : "Orange Money";
      const newMethod: PaymentMethodItem = {
        id: `momo-${Date.now()}`,
        type: newMethodType,
        name: operatorName,
        detail: newPhone || "+237 6xx xxx xxx",
        isDefault: false,
        icon: "lucide:smartphone",
        color: newMethodType === "mtn" ? "#eab308" : "#ea580c",
        bgColor: newMethodType === "mtn" ? "#fef9c3" : "#ffedd5",
      };
      setMethods(prev => [...prev, newMethod]);
    }
    setIsAddMethodOpen(false);
    setNewPhone("");
    setNewCardNumber("");
    setNewCardHolder("");
  };

  const getStatusClass = (status?: string) => {
    const s = String(status || "").toLowerCase();
    if (s === "completed" || s === "success" || s === "released") return styles.statusSuccess;
    if (s === "pending" || s === "hold") return styles.statusPending;
    if (s === "failed" || s === "cancelled") return styles.statusFailed;
    return styles.statusDefault;
  };

  const getMethodBadgeForTx = (tx: Transaction) => {
    const cat = String(tx.category || "").toLowerCase();
    const type = String(tx.type || "").toLowerCase();
    if (cat.includes("deposit") || type.includes("deposit")) return "📱 MTN / Orange MoMo";
    if (cat.includes("release") || cat.includes("escrow")) return "🛡️ Escrow Vault";
    if (type.includes("withdrawal")) return "📱 Mobile Money";
    return "💳 Card / Online";
  };

  return (
    <main className={styles.page}>
      <div className={styles.layout}>
        <ClientSidebar isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

        {/* Main Content Area */}
        <div className={styles.main}>
          <DashboardHeader
            onMenuClick={() => setMobileNavOpen(true)}
          />

          <div className={styles.content}>
            <div className={styles.pageHeader}>
              <div>
                <h1 className={styles.headerTitle}>{t.pageTitle}</h1>
                <p className={styles.headerSubtitle}>{t.pageSubtitle}</p>
              </div>

              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <button
                  type="button"
                  className={styles.btnSecondary}
                  onClick={() => setIsAddMethodOpen(true)}
                >
                  <iconify-icon icon="lucide:plus-circle" style={{ fontSize: "18px" }} />
                  {t.addPaymentMethod}
                </button>
                <button
                  type="button"
                  className={styles.btnPrimary}
                  onClick={() => setIsDepositOpen(true)}
                >
                  <iconify-icon icon="lucide:arrow-down-left" style={{ fontSize: "18px" }} />
                  {t.depositFunds}
                </button>
              </div>
            </div>

            {/* ESCROW EXPLAINER BANNER */}
            <div className={styles.escrowExplainer}>
              <div className={styles.escrowExplainerLeft}>
                <div className={styles.escrowExplainerIcon}>
                  <iconify-icon icon="lucide:shield-check" />
                </div>
                <div>
                  <h3 className={styles.escrowExplainerTitle}>{t.escrowBannerTitle}</h3>
                  <p className={styles.escrowExplainerText}>{t.escrowBannerText}</p>
                </div>
              </div>
              <button
                type="button"
                className={styles.btnPrimary}
                style={{ background: "#22c55e", boxShadow: "0 4px 14px rgba(34,197,94,0.35)" }}
                onClick={() => setIsDepositOpen(true)}
              >
                <iconify-icon icon="lucide:plus" />
                {t.depositFunds}
              </button>
            </div>

            {/* Stats Overview */}
            <section className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={`${styles.statIcon} ${styles.statIconAccent}`}>
                  <iconify-icon icon="lucide:wallet" />
                </div>
                <div>
                  <h3 className={styles.statLabel}>{t.availableBalance}</h3>
                  <p className={styles.statValue}>
                    {walletLoading ? "..." : formatXOF(wallet?.available_balance || 0)}
                  </p>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={`${styles.statIcon} ${styles.statIconSuccess}`}>
                  <iconify-icon icon="lucide:lock" />
                </div>
                <div>
                  <h3 className={styles.statLabel}>{t.pendingEscrow}</h3>
                  <p className={styles.statValue}>
                    {walletLoading ? "..." : formatXOF(wallet?.pending_escrow || 0)}
                  </p>
                </div>
              </div>
            </section>

            {/* SAVED / ACTIVE PAYMENT METHODS */}
            <section className={styles.methodsCard}>
              <div className={styles.methodsHeader}>
                <div>
                  <h2 className={styles.tableTitle} style={{ margin: "0 0 4px" }}>
                    {t.paymentMethodsTitle}
                  </h2>
                  <p style={{ margin: 0, fontSize: "13.5px", color: "#64748b" }}>
                    {t.paymentMethodsSubtitle}
                  </p>
                </div>
                <button
                  type="button"
                  className={styles.btnSecondary}
                  onClick={() => setIsAddMethodOpen(true)}
                  style={{ padding: "6px 14px", fontSize: "13px" }}
                >
                  <iconify-icon icon="lucide:credit-card" />
                  {t.addPaymentMethod}
                </button>
              </div>

              <div className={styles.methodsGrid}>
                {methods.map((method) => (
                  <div
                    key={method.id}
                    className={`${styles.methodCard} ${method.isDefault ? styles.methodCardDefault : ""}`}
                  >
                    <div className={styles.methodTop}>
                      <div
                        className={styles.methodIconWrap}
                        style={{ background: method.bgColor, color: method.color }}
                      >
                        <iconify-icon icon={method.icon} />
                      </div>

                      {method.isDefault ? (
                        <span className={styles.methodBadgeDefault}>
                          <iconify-icon icon="lucide:check-circle" /> {t.defaultBadge}
                        </span>
                      ) : (
                        <span className={styles.methodBadgeActive}>
                          <iconify-icon icon="lucide:circle-dot" /> {t.activeBadge}
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className={styles.methodTitle}>{method.name}</h4>
                      <p className={styles.methodSubtitle}>{method.detail}</p>
                      {method.isDefault && (
                        <p className={styles.methodDetail}>
                          ✓ Primary source for Task Escrows & Direct Hire
                        </p>
                      )}
                    </div>

                    <div className={styles.methodBottom}>
                      {!method.isDefault ? (
                        <button
                          type="button"
                          className={styles.methodActionBtn}
                          onClick={() => handleSetDefaultMethod(method.id)}
                        >
                          <iconify-icon icon="lucide:check" /> {t.makeDefault}
                        </button>
                      ) : (
                        <span style={{ fontSize: "12px", color: "#16a34a", fontWeight: 700 }}>
                          ✓ Active Payout Source
                        </span>
                      )}

                      {method.type !== "wallet" && (
                        <button
                          type="button"
                          className={styles.methodActionBtn}
                          style={{ color: "#94a3b8" }}
                          onClick={() => setMethods(prev => prev.filter(m => m.id !== method.id))}
                        >
                          <iconify-icon icon="lucide:trash-2" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Transaction History Section */}
            <section className={styles.tableCard}>
              <h2 className={styles.tableTitle}>{t.txHistory}</h2>
              
              {txLoading ? (
                <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
                  <p>{t.loading}</p>
                </div>
              ) : transactions.length === 0 ? (
                <div className={styles.emptyState}>
                  <iconify-icon icon="lucide:file-text" />
                  <p>{t.noTx}</p>
                </div>
              ) : (
                <div className={styles.tableWrapper}>
                  <table className={styles.adminTable}>
                    <thead>
                      <tr>
                        <th>{t.thDate}</th>
                        <th>{t.thType}</th>
                        <th>{t.thMethod}</th>
                        <th>{t.thCategory}</th>
                        <th>{t.thAmount}</th>
                        <th>{t.thStatus}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((tx) => (
                        <tr key={tx.id}>
                          <td>
                            {tx.created_at
                              ? new Date(tx.created_at).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })
                              : "-"}
                          </td>
                          <td style={{ textTransform: "capitalize" }}>{tx.type || "-"}</td>
                          <td style={{ fontWeight: 600, color: "#334155" }}>
                            {getMethodBadgeForTx(tx)}
                          </td>
                          <td style={{ textTransform: "capitalize" }}>{tx.category || "-"}</td>
                          <td style={{ fontWeight: 700, color: "#001f3f" }}>
                            {formatXOF(tx.amount || 0)}
                          </td>
                          <td>
                            <span className={`${styles.statusBadge} ${getStatusClass(tx.status)}`}>
                              {tx.status || "Unknown"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>

      {/* DEPOSIT MODAL */}
      {isDepositOpen && (
        <div className={styles.modalOverlay} onClick={() => !depositing && setIsDepositOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className={styles.modalClose}
              onClick={() => setIsDepositOpen(false)}
              disabled={depositing}
            >
              <iconify-icon icon="lucide:x" />
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(255, 69, 0, 0.12)", color: "#ff4500", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>
                <iconify-icon icon="lucide:arrow-down-left" />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: "19px", fontWeight: 800, color: "#001f3f" }}>
                  {t.depositModalTitle}
                </h3>
                <p style={{ margin: "2px 0 0", fontSize: "13px", color: "#64748b" }}>
                  {t.depositModalSubtitle}
                </p>
              </div>
            </div>

            <form onSubmit={handleDepositSubmit}>
              {/* OPERATOR TABS */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>{t.operatorLabel}</label>
                <div className={styles.operatorTabs}>
                  <div
                    className={`${styles.operatorTab} ${depositOperator === "MTN" ? styles.operatorTabSelected : ""}`}
                    onClick={() => setDepositOperator("MTN")}
                  >
                    <iconify-icon icon="lucide:smartphone" style={{ fontSize: "20px", color: "#eab308" }} />
                    <div style={{ fontSize: "12px", fontWeight: 800, marginTop: "4px" }}>MTN MoMo</div>
                  </div>
                  <div
                    className={`${styles.operatorTab} ${depositOperator === "ORANGE" ? styles.operatorTabSelected : ""}`}
                    onClick={() => setDepositOperator("ORANGE")}
                  >
                    <iconify-icon icon="lucide:smartphone" style={{ fontSize: "20px", color: "#ea580c" }} />
                    <div style={{ fontSize: "12px", fontWeight: 800, marginTop: "4px" }}>Orange Money</div>
                  </div>
                  <div
                    className={`${styles.operatorTab} ${depositOperator === "CARD" ? styles.operatorTabSelected : ""}`}
                    onClick={() => setDepositOperator("CARD")}
                  >
                    <iconify-icon icon="lucide:credit-card" style={{ fontSize: "20px", color: "#2563eb" }} />
                    <div style={{ fontSize: "12px", fontWeight: 800, marginTop: "4px" }}>Card (Visa)</div>
                  </div>
                </div>
              </div>

              {/* PHONE INPUT */}
              {depositOperator !== "CARD" && (
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>{t.phoneNumberLabel}</label>
                  <input
                    type="tel"
                    className={styles.formInput}
                    placeholder="e.g. 670 000 000"
                    value={depositPhone}
                    onChange={(e) => setDepositPhone(e.target.value)}
                    required
                  />
                </div>
              )}

              {/* AMOUNT INPUT */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>{t.amountLabel}</label>
                <input
                  type="number"
                  min="500"
                  step="500"
                  className={styles.formInput}
                  placeholder="e.g. 25000"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  required
                />
                <div className={styles.amountPresets}>
                  {["5000", "10000", "25000", "50000", "100000"].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      className={styles.presetBtn}
                      onClick={() => setDepositAmount(amt)}
                    >
                      {Number(amt).toLocaleString()} XOF
                    </button>
                  ))}
                </div>
              </div>

              {depositNotice && (
                <div style={{ background: "#dcfce7", border: "1px solid #86efac", color: "#166534", padding: "12px 16px", borderRadius: "10px", fontSize: "13.5px", fontWeight: 600, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <iconify-icon icon="lucide:check-circle" style={{ fontSize: "18px", color: "#16a34a" }} />
                  {depositNotice}
                </div>
              )}

              {depositError && (
                <div style={{ background: "#fee2e2", border: "1px solid #fca5a5", color: "#991b1b", padding: "12px 16px", borderRadius: "10px", fontSize: "13.5px", fontWeight: 600, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <iconify-icon icon="lucide:alert-triangle" style={{ fontSize: "18px", color: "#dc2626" }} />
                  {depositError}
                </div>
              )}

              <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
                <button
                  type="button"
                  className={styles.btnSecondary}
                  style={{ flex: 1 }}
                  onClick={() => setIsDepositOpen(false)}
                  disabled={depositing}
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className={styles.btnPrimary}
                  style={{ flex: 2 }}
                  disabled={depositing}
                >
                  {depositing ? (
                    <>
                      <iconify-icon icon="lucide:loader-2" className="spin" /> {t.processing}
                    </>
                  ) : (
                    <>
                      <iconify-icon icon="lucide:shield-check" /> {t.confirmDeposit}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD PAYMENT METHOD MODAL */}
      {isAddMethodOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsAddMethodOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className={styles.modalClose}
              onClick={() => setIsAddMethodOpen(false)}
            >
              <iconify-icon icon="lucide:x" />
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(37, 99, 235, 0.12)", color: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>
                <iconify-icon icon="lucide:credit-card" />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: "19px", fontWeight: 800, color: "#001f3f" }}>
                  {t.addMethodModalTitle}
                </h3>
                <p style={{ margin: "2px 0 0", fontSize: "13px", color: "#64748b" }}>
                  {t.addMethodModalSubtitle}
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveNewMethod}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>{t.methodTypeLabel}</label>
                <div className={styles.operatorTabs}>
                  <div
                    className={`${styles.operatorTab} ${newMethodType === "mtn" ? styles.operatorTabSelected : ""}`}
                    onClick={() => setNewMethodType("mtn")}
                  >
                    <iconify-icon icon="lucide:smartphone" style={{ fontSize: "20px", color: "#eab308" }} />
                    <div style={{ fontSize: "12px", fontWeight: 800, marginTop: "4px" }}>MTN MoMo</div>
                  </div>
                  <div
                    className={`${styles.operatorTab} ${newMethodType === "orange" ? styles.operatorTabSelected : ""}`}
                    onClick={() => setNewMethodType("orange")}
                  >
                    <iconify-icon icon="lucide:smartphone" style={{ fontSize: "20px", color: "#ea580c" }} />
                    <div style={{ fontSize: "12px", fontWeight: 800, marginTop: "4px" }}>Orange Money</div>
                  </div>
                  <div
                    className={`${styles.operatorTab} ${newMethodType === "card" ? styles.operatorTabSelected : ""}`}
                    onClick={() => setNewMethodType("card")}
                  >
                    <iconify-icon icon="lucide:credit-card" style={{ fontSize: "20px", color: "#2563eb" }} />
                    <div style={{ fontSize: "12px", fontWeight: 800, marginTop: "4px" }}>Card</div>
                  </div>
                </div>
              </div>

              {newMethodType !== "card" ? (
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>{t.phoneNumberLabel}</label>
                  <input
                    type="tel"
                    className={styles.formInput}
                    placeholder="e.g. +237 670 123 456"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    required
                  />
                </div>
              ) : (
                <>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>{t.accountHolderLabel}</label>
                    <input
                      type="text"
                      className={styles.formInput}
                      placeholder="e.g. John Doe"
                      value={newCardHolder}
                      onChange={(e) => setNewCardHolder(e.target.value)}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>{t.cardNumberLabel}</label>
                    <input
                      type="text"
                      className={styles.formInput}
                      placeholder="4242 •••• •••• 4242"
                      value={newCardNumber}
                      onChange={(e) => setNewCardNumber(e.target.value)}
                      required
                    />
                  </div>
                </>
              )}

              <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
                <button
                  type="button"
                  className={styles.btnSecondary}
                  style={{ flex: 1 }}
                  onClick={() => setIsAddMethodOpen(false)}
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className={styles.btnPrimary}
                  style={{ flex: 2 }}
                >
                  <iconify-icon icon="lucide:check" /> {t.saveMethod}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
