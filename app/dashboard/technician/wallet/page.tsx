"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import styles from "./page.module.css";
import TechnicianSidebar from "@/app/components/TechnicianSidebar";
import DashboardHeader from "@/app/components/DashboardHeader";

const translations: Record<string, Record<string, string>> = {
  en: {
    searchPlaceholder: "Search wallet history...",
    eyebrow: "Payments & Wallet",
    title: "Wallet & Payouts",
    upgradeTier: "Upgrade Tier",
    availableBalance: "Available Balance",
    availableSub: "Ready for withdrawal / upgrade",
    heldInEscrow: "Held in Escrow",
    heldSub: "Released upon milestone sign-off",
    lifetimeEarnings: "Total Lifetime Earnings",
    lifetimeSub: "100% Escrow Protected",
    addFundsTitle: "Add Funds to Wallet",
    addFundsDesc: "Top up your balance via Mobile Money or Card to fund upgrades or tasks.",
    addMoneyBtn: "Add Money (Deposit)",
    withdrawTitle: "Withdraw Earnings",
    withdrawDesc: "Instant transfers to Mobile Money wallets or direct bank accounts.",
    withdrawMoneyBtn: "Withdraw Money",
    txHistory: "Transaction History",
    refresh: "Refresh",
    thType: "Type",
    thDesc: "Description",
    thDate: "Date",
    thAmount: "Amount",
    thStatus: "Status",
    loadingRecords: "Loading records...",
    noTx: "No wallet transactions found.",
    creditLabel: "Deposit / Credit",
    debitLabel: "Withdrawal / Debit",
    withdrawModalTitle: "Withdraw Funds",
    withdrawModalDesc: "Available balance only. On-hold escrow funds cannot be withdrawn until task sign-off.",
    availableLabel: "Amount (Available: ",
    withdrawMethodLabel: "Withdrawal Method",
    confirmWithdraw: "Confirm Withdrawal",
    processing: "Processing...",
    depositModalTitle: "Deposit Money into Wallet",
    depositModalDesc: "Add funds to pay for plan upgrades, bid packages, or task escrow.",
    depositAmountLabel: "Deposit Amount (XOF)",
    paymentMethodLabel: "Payment Method",
    depositBtnNow: "Deposit Now",
  },
  fr: {
    searchPlaceholder: "Rechercher dans l'historique...",
    eyebrow: "Paiements & Portefeuille",
    title: "Portefeuille & Retraits",
    upgradeTier: "Forfait Supérieur",
    availableBalance: "Solde Disponible",
    availableSub: "Prêt pour le retrait / mise à niveau",
    heldInEscrow: "Bloqué sous Séquestre",
    heldSub: "Débloqué après validation d'étape",
    lifetimeEarnings: "Gains Totaux Cumulés",
    lifetimeSub: "100% Sécurisé sous Séquestre",
    addFundsTitle: "Recharger le Portefeuille",
    addFundsDesc: "Rechargez votre solde par Mobile Money ou Carte bancaire pour financer des options ou tâches.",
    addMoneyBtn: "Recharger (Dépôt)",
    withdrawTitle: "Retirer vos Gains",
    withdrawDesc: "Virements instantanés vers vos comptes Mobile Money ou compte bancaire.",
    withdrawMoneyBtn: "Demander un Retrait",
    txHistory: "Historique des Transactions",
    refresh: "Actualiser",
    thType: "Type",
    thDesc: "Description",
    thDate: "Date",
    thAmount: "Montant",
    thStatus: "Statut",
    loadingRecords: "Chargement des transactions...",
    noTx: "Aucune transaction trouvée.",
    creditLabel: "Dépôt / Crédit",
    debitLabel: "Retrait / Débit",
    withdrawModalTitle: "Retirer des Fonds",
    withdrawModalDesc: "Solde disponible uniquement. Les fonds sous séquestre ne peuvent pas être retirés avant validation finale.",
    availableLabel: "Montant (Disponible : ",
    withdrawMethodLabel: "Mode de Retrait",
    confirmWithdraw: "Confirmer le Retrait",
    processing: "Traitement en cours...",
    depositModalTitle: "Recharger le Portefeuille",
    depositModalDesc: "Ajoutez des fonds pour régler vos forfaits pro ou missions.",
    depositAmountLabel: "Montant du Dépôt (XOF)",
    paymentMethodLabel: "Mode de Paiement",
    depositBtnNow: "Recharger Maintenant",
  }
};

export default function TechnicianWalletPage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [query, setQuery] = useState("");
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

  // Wallet Data
  const { data: walletData, loading: walletLoading, refetch: refetchWallet } = useFetch(() => api.getWallet(), []);
  const { data: txData, loading: txLoading, refetch: refetchTx } = useFetch(() => api.getTransactions(), []);
  
  const transactionsData = Array.isArray(txData) ? txData : (txData as any)?.results || [];

  const availableBalance = parseFloat(walletData?.available_balance) || 0;
  const pendingEscrow = parseFloat(walletData?.pending_escrow || walletData?.pending_balance) || 0;
  const totalEarnings = parseFloat(walletData?.total_earnings) || (availableBalance + pendingEscrow);

  // Withdraw Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawMethod, setWithdrawMethod] = useState("Mobile Money (Orange/MTN/Wave)");
  const [withdrawing, setWithdrawing] = useState(false);
  const [withdrawError, setWithdrawError] = useState<string | null>(null);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  // Deposit Modal State
  const [depositOpen, setDepositOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState("5000");
  const [depositMethod, setDepositMethod] = useState("Credit / Debit Card");
  const [depositing, setDepositing] = useState(false);
  const [depositError, setDepositError] = useState<string | null>(null);
  const [depositSuccess, setDepositSuccess] = useState(false);

  const handleWithdraw = async () => {
    setWithdrawError(null);
    setWithdrawSuccess(false);
    
    const amount = Number(withdrawAmount);
    if (!amount || amount <= 0) {
      setWithdrawError(lang === "fr" ? "Veuillez saisir un montant valide." : "Enter a valid amount.");
      return;
    }
    if (amount > availableBalance) {
      setWithdrawError(lang === "fr" ? "Solde disponible insuffisant." : "Insufficient available balance.");
      return;
    }

    setWithdrawing(true);
    try {
      await api.withdrawFunds({
        amount,
        account_details: { method: withdrawMethod }
      });
      setWithdrawSuccess(true);
      await refetchWallet();
      await refetchTx();
      setTimeout(() => {
        setModalOpen(false);
        setWithdrawSuccess(false);
        setWithdrawAmount("");
      }, 2000);
    } catch (err: any) {
      setWithdrawError(err.message || "Failed to process withdrawal.");
    } finally {
      setWithdrawing(false);
    }
  };

  const handleDeposit = async () => {
    setDepositError(null);
    setDepositSuccess(false);

    const amount = Number(depositAmount);
    if (!amount || amount <= 0) {
      setDepositError(lang === "fr" ? "Veuillez saisir un montant valide." : "Enter a valid deposit amount.");
      return;
    }

    setDepositing(true);
    try {
      await api.depositFunds({
        amount,
        payment_method: depositMethod,
      });
      setDepositSuccess(true);
      await refetchWallet();
      await refetchTx();
      setTimeout(() => {
        setDepositOpen(false);
        setDepositSuccess(false);
      }, 2000);
    } catch (err: any) {
      setDepositError(err.message || "Failed to process deposit.");
    } finally {
      setDepositing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Released':
      case 'COMPLETED':
        return styles.statusReleased;
      case 'On Hold':
      case 'PENDING':
        return styles.statusHold;
      default:
        return styles.statusPending;
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.layout}>
        <TechnicianSidebar isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

        <div className={styles.main}>
          <DashboardHeader
            onMenuClick={() => setMobileNavOpen(true)}
            searchPlaceholder={t.searchPlaceholder}
            searchQuery={query}
            setSearchQuery={setQuery}
          />

          <div className={styles.content}>
            <section className={styles.pageHeader}>
              <div>
                <p className={styles.eyebrow}>{t.eyebrow}</p>
                <h1>{t.title}</h1>
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <Link
                  href="/upgrade"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "10px 18px",
                    background: "rgba(255, 69, 0, 0.1)",
                    color: "#ff4500",
                    borderRadius: "10px",
                    fontWeight: 700,
                    textDecoration: "none",
                    border: "1px solid rgba(255, 69, 0, 0.2)"
                  }}
                >
                  <iconify-icon icon="lucide:sparkles" /> {t.upgradeTier}
                </Link>
              </div>
            </section>

            {/* STATS */}
            <section className={styles.walletOverview}>
              <article className={styles.statCard}>
                <span>{t.availableBalance}</span>
                <h3>{availableBalance.toLocaleString()} XOF</h3>
                <small style={{ color: "#16a34a", fontWeight: 600 }}>{t.availableSub}</small>
              </article>
              <article className={styles.statCard}>
                <span>{t.heldInEscrow}</span>
                <h3>{pendingEscrow.toLocaleString()} XOF</h3>
                <small style={{ color: "#64748b" }}>{t.heldSub}</small>
              </article>
              <article className={styles.statCard}>
                <span>{t.lifetimeEarnings}</span>
                <h3>{totalEarnings.toLocaleString()} XOF</h3>
                <small style={{ color: "#001f3f", fontWeight: 600 }}>{t.lifetimeSub}</small>
              </article>
            </section>

            {/* ACTIONS BAR */}
            <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, marginBottom: 30 }}>
              <div className={styles.withdrawCard} style={{ margin: 0 }}>
                <h3>{t.addFundsTitle}</h3>
                <p className={styles.notice}>{t.addFundsDesc}</p>
                <button
                  className={styles.primaryButton}
                  style={{ background: "#001f3f" }}
                  onClick={() => setDepositOpen(true)}
                >
                  <iconify-icon icon="lucide:plus-circle" /> {t.addMoneyBtn}
                </button>
              </div>

              <div className={styles.withdrawCard} style={{ margin: 0 }}>
                <h3>{t.withdrawTitle}</h3>
                <p className={styles.notice}>{t.withdrawDesc}</p>
                <button className={styles.primaryButton} onClick={() => setModalOpen(true)}>
                  <iconify-icon icon="lucide:arrow-down-circle" /> {t.withdrawMoneyBtn}
                </button>
              </div>
            </section>

            {/* TRANSACTIONS TABLE */}
            <section className={styles.transactionsCard}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h3 style={{ margin: 0 }}>{t.txHistory}</h3>
                <button
                  onClick={() => { refetchWallet(); refetchTx(); }}
                  style={{ border: "none", background: "transparent", color: "#64748b", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: 13 }}
                >
                  <iconify-icon icon="lucide:refresh-cw" /> {t.refresh}
                </button>
              </div>

              <div className={styles.tableWrapper}>
                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      <th>{t.thType}</th>
                      <th>{t.thDesc}</th>
                      <th>{t.thDate}</th>
                      <th>{t.thAmount}</th>
                      <th>{t.thStatus}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {walletLoading || txLoading ? (
                      <tr><td colSpan={5} style={{ textAlign: "center", padding: "20px" }}>{t.loadingRecords}</td></tr>
                    ) : transactionsData.length === 0 ? (
                      <tr><td colSpan={5} style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>{t.noTx}</td></tr>
                    ) : transactionsData.map((tx: any, idx: number) => {
                      const isCredit = tx.transaction_type === "credit" || tx.type === "deposit" || tx.type === "payment_received";
                      const amount = parseFloat(tx.amount) || 0;
                      const date = tx.created_at ? new Date(tx.created_at).toLocaleDateString() : "Recent";
                      const desc = tx.description || tx.reference || (isCredit ? "Recharge / Déblocage Séquestre" : "Virement / Retrait");
                      const status = tx.status || "Completed";

                      return (
                        <tr key={tx.id || idx}>
                          <td>
                            <strong style={{ color: isCredit ? "#16a34a" : "#001f3f" }}>
                              {isCredit ? t.creditLabel : t.debitLabel}
                            </strong>
                          </td>
                          <td>{desc}</td>
                          <td>{date}</td>
                          <td>{amount.toLocaleString()} XOF</td>
                          <td>
                            <span className={`${styles.statusBadge} ${getStatusBadge(status)}`}>
                              {status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* WITHDRAWAL MODAL */}
      {modalOpen && (
        <div className={styles.modalOverlay} onClick={() => setModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setModalOpen(false)}>
              <iconify-icon icon="lucide:x" />
            </button>
            
            <h3>{t.withdrawModalTitle}</h3>
            <p className={styles.notice} style={{ marginBottom: '16px' }}>
              {t.withdrawModalDesc}
            </p>

            <div className={styles.formGroup}>
              <label>{t.availableLabel}{availableBalance.toLocaleString()} XOF)</label>
              <input 
                type="number" 
                className={styles.formInput} 
                placeholder="0" 
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label>{t.withdrawMethodLabel}</label>
              <select 
                className={styles.formInput}
                value={withdrawMethod}
                onChange={(e) => setWithdrawMethod(e.target.value)}
              >
                <option value="Mobile Money (Orange/MTN/Wave)">Mobile Money (Orange / MTN / Wave)</option>
                <option value="Direct Bank Wire Transfer">Virement Bancaire Direct</option>
                <option value="International Transfer">Virement International</option>
              </select>
            </div>

            {withdrawError && (
              <div className={styles.errorMessage}>
                <iconify-icon icon="lucide:alert-circle" />
                {withdrawError}
              </div>
            )}
            
            {withdrawSuccess && (
              <div className={styles.successMessage}>
                <iconify-icon icon="lucide:check-circle-2" />
                {lang === "fr" ? "Demande de retrait transmise avec succès" : "Withdrawal request submitted successfully"}
              </div>
            )}

            <div className={styles.modalActions}>
              <button 
                className={`${styles.primaryButton} ${styles.fullButton}`} 
                onClick={handleWithdraw}
                disabled={withdrawing || withdrawSuccess}
              >
                {withdrawing ? t.processing : t.confirmWithdraw}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DEPOSIT MODAL */}
      {depositOpen && (
        <div className={styles.modalOverlay} onClick={() => setDepositOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setDepositOpen(false)}>
              <iconify-icon icon="lucide:x" />
            </button>
            
            <h3>{t.depositModalTitle}</h3>
            <p className={styles.notice} style={{ marginBottom: '16px' }}>
              {t.depositModalDesc}
            </p>

            <div className={styles.formGroup}>
              <label>{t.depositAmountLabel}</label>
              <input 
                type="number" 
                className={styles.formInput} 
                placeholder="5000" 
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label>{t.paymentMethodLabel}</label>
              <select 
                className={styles.formInput}
                value={depositMethod}
                onChange={(e) => setDepositMethod(e.target.value)}
              >
                <option value="Credit / Debit Card">Carte Bancaire (Visa, Mastercard)</option>
                <option value="Mobile Money (Orange/MTN/Wave)">Mobile Money (Orange, MTN, Wave)</option>
                <option value="Direct Bank Deposit">Virement Bancaire</option>
              </select>
            </div>

            {depositError && (
              <div className={styles.errorMessage}>
                <iconify-icon icon="lucide:alert-circle" />
                {depositError}
              </div>
            )}
            
            {depositSuccess && (
              <div className={styles.successMessage}>
                <iconify-icon icon="lucide:check-circle-2" />
                {lang === "fr" ? "Fonds ajoutés avec succès !" : "Funds added to wallet successfully!"}
              </div>
            )}

            <div className={styles.modalActions}>
              <button 
                className={`${styles.primaryButton} ${styles.fullButton}`} 
                style={{ background: "#16a34a" }}
                onClick={handleDeposit}
                disabled={depositing || depositSuccess}
              >
                {depositing ? t.processing : `${t.depositBtnNow} (${depositAmount || 0} XOF)`}
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}

