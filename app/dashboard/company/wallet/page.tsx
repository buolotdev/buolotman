"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import layoutStyles from "../page.module.css";
import styles from "./wallet.module.css";

const translations: Record<string, Record<string, string>> = {
  en: {
    subtitle: "Company dashboard",
    title: "Wallet & Payments",
    backToDashboard: "Back to dashboard",
    availableBalance: "Available Balance",
    withdrawFunds: "Withdraw Funds",
    recentTransactions: "Recent Transactions",
    loadingTransactions: "Loading transactions...",
    noTransactions: "No transactions found.",
    withdrawNotice: "Withdrawal flow to be integrated with payment gateway.",
  },
  fr: {
    subtitle: "Espace Entreprise",
    title: "Portefeuille & Paiements",
    backToDashboard: "Retour au tableau de bord",
    availableBalance: "Solde Disponible",
    withdrawFunds: "Retirer des Fonds",
    recentTransactions: "Transactions Récentes",
    loadingTransactions: "Chargement des transactions...",
    noTransactions: "Aucune transaction trouvée.",
    withdrawNotice: "Le flux de retrait sera intégré à la passerelle de paiement.",
  }
};

export default function CompanyWalletPage() {
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

  const { data: wallet, loading: walletLoading, refetch: refetchWallet } = useFetch(() => api.getWallet(), []);
  const { data: txData, loading: txLoading, refetch: refetchTx } = useFetch(() => api.getTransactions(), []);

  const [modalOpen, setModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawMethod, setWithdrawMethod] = useState("Mobile Money");
  const [withdrawPhone, setWithdrawPhone] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankAccountName, setBankAccountName] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [bankSwift, setBankSwift] = useState("");
  const [withdrawing, setWithdrawing] = useState(false);
  const [withdrawError, setWithdrawError] = useState<string | null>(null);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  const transactions = (txData as any)?.results || [];
  const availableBalance = parseFloat(wallet?.available_balance) || 0;

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
      if (withdrawMethod === "Mobile Money") {
        if (!withdrawPhone.trim()) {
          setWithdrawError(lang === "fr" ? "Veuillez entrer votre numéro Mobile Money." : "Please enter your Mobile Money phone number.");
          setWithdrawing(false);
          return;
        }
        if (amount < 500) {
          setWithdrawError(
            lang === "fr"
              ? "Le montant minimum pour le retrait instantané Mobile Money est de 500 XAF/XOF. Pour retirer moins, choisissez le virement bancaire."
              : "Minimum amount for instant Mobile Money payout is 500 XAF/XOF. For smaller amounts, please select Direct Bank Transfer."
          );
          setWithdrawing(false);
          return;
        }
        const cleanPhone = withdrawPhone.replace(/[^0-9]/g, "");
        const formattedPhone = cleanPhone.startsWith("237") ? cleanPhone : `237${cleanPhone}`;
        await api.campayWithdraw({
          amount,
          phone_number: formattedPhone,
          description: `Company Wallet Withdrawal (${amount} XAF)`
        });
      } else {
        if (!bankName.trim() || !bankAccountNumber.trim()) {
          setWithdrawError(
            lang === "fr"
              ? "Veuillez renseigner le nom de la banque et le numéro de compte / IBAN."
              : "Please specify bank name and account / IBAN number."
          );
          setWithdrawing(false);
          return;
        }
        await api.withdrawFunds({
          amount,
          method: "bank_transfer",
          account_details: {
            method: "Direct Bank Wire Transfer",
            bank_name: bankName.trim(),
            account_holder: bankAccountName.trim() || undefined,
            account_number_or_iban: bankAccountNumber.trim(),
            swift_bic: bankSwift.trim() || undefined,
          }
        });
      }
      setWithdrawSuccess(true);
      await refetchWallet();
      await refetchTx();
      setTimeout(() => {
        setModalOpen(false);
        setWithdrawSuccess(false);
        setWithdrawAmount("");
        setWithdrawPhone("");
        setBankName("");
        setBankAccountName("");
        setBankAccountNumber("");
        setBankSwift("");
      }, 2000);
    } catch (err: any) {
      setWithdrawError(err.message || "Failed to process withdrawal.");
    } finally {
      setWithdrawing(false);
    }
  };

  return (
    <>
      <div className={layoutStyles.content}>
      <div className={styles.container} style={{ marginTop: 32 }}>
        <header className={styles.header}>
          <div>
            <p className={styles.subtitle}>{t.subtitle}</p>
            <h1 className={styles.title}>{t.title}</h1>
          </div>
          <Link href="/dashboard/company" className={styles.backLink} style={{ color: "#ff4500", fontWeight: 600, textDecoration: "none" }}>
            <iconify-icon icon="lucide:arrow-left" /> {t.backToDashboard}
          </Link>
        </header>

        <section className={styles.balanceCard}>
          <div className={styles.balanceInfo}>
            <span className={styles.balanceLabel}>{t.availableBalance}</span>
            <h2 className={styles.balanceAmount}>
              {walletLoading ? "..." : `${wallet?.available_balance || "0.00"} ${wallet?.currency || "XOF"}`}
            </h2>
          </div>
          <button className={styles.withdrawBtn} onClick={() => setModalOpen(true)}>
            <iconify-icon icon="lucide:arrow-up-right" /> {t.withdrawFunds}
          </button>
        </section>

        <section className={styles.transactionsCard}>
          <div className={styles.transactionsHeader}>
            <h3 className={styles.transactionsTitle}>{t.recentTransactions}</h3>
          </div>

          {txLoading ? (
            <div className={styles.emptyState}>{t.loadingTransactions}</div>
          ) : transactions.length === 0 ? (
            <div className={styles.emptyState}>
              <iconify-icon icon="lucide:receipt" className={styles.emptyIcon} />
              <p>{t.noTransactions}</p>
            </div>
          ) : (
            <div className={styles.transactionList}>
              {transactions.map((tx: any) => (
                <div key={tx.id} className={styles.transactionItem}>
                  <div className={styles.txLeft}>
                    <div className={`${styles.txIcon} ${tx.type === "credit" ? styles.txIconCredit : styles.txIconDebit}`}>
                      <iconify-icon icon={tx.type === "credit" ? "lucide:arrow-down-left" : "lucide:arrow-up-right"} />
                    </div>
                    <div className={styles.txDetails}>
                      <span className={styles.txDesc}>{tx.description || tx.category}</span>
                      <span className={styles.txDate}>{new Date(tx.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className={styles.txRight}>
                    <span className={`${styles.txAmount} ${tx.type === "credit" ? styles.txAmountCredit : styles.txAmountDebit}`}>
                      {tx.type === "credit" ? "+" : "-"}{tx.amount} XOF
                    </span>
                    <span className={`${styles.txStatus} ${tx.status === "completed" ? styles.txStatusCompleted : styles.txStatusPending}`}>
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Withdrawal Modal */}
        {modalOpen && (
          <div style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: 16
          }} onClick={() => setModalOpen(false)}>
            <div style={{
              background: "#ffffff",
              borderRadius: 16,
              padding: 24,
              maxWidth: 420,
              width: "100%",
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)"
            }} onClick={(e) => e.stopPropagation()}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>
                {t.withdrawFunds}
              </h3>
              <p style={{ fontSize: 13, color: "#64748b", marginBottom: 16 }}>
                Instant disbursement via Cameroon MTN Mobile Money & Orange Money.
              </p>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                  Amount (Available: {availableBalance.toLocaleString()} XAF)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 10000"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: 8,
                    border: "1px solid #cbd5e1",
                    fontSize: 14
                  }}
                />
                {withdrawMethod === "Mobile Money" && (
                  <span style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px', display: 'block' }}>
                    ℹ️ Min. 500 XAF pour Mobile Money instantané
                  </span>
                )}
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                  Withdrawal Method
                </label>
                <select
                  value={withdrawMethod}
                  onChange={(e) => setWithdrawMethod(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: 8,
                    border: "1px solid #cbd5e1",
                    fontSize: 14,
                    background: "#ffffff"
                  }}
                >
                  <option value="Mobile Money">Mobile Money (Orange / MTN - Cameroun)</option>
                  <option value="Direct Bank Wire">Virement Bancaire Direct</option>
                </select>
              </div>

              {withdrawMethod === "Mobile Money" ? (
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                    Mobile Money Phone Number (+237)
                  </label>
                  <div style={{ display: "flex", gap: 8 }}>
                    <span style={{ padding: "10px 14px", background: "#f1f5f9", borderRadius: 8, fontWeight: 600, border: "1px solid #cbd5e1" }}>+237</span>
                    <input
                      type="tel"
                      placeholder="67X XX XX XX or 69X XX XX XX"
                      value={withdrawPhone}
                      onChange={(e) => setWithdrawPhone(e.target.value)}
                      style={{
                        flex: 1,
                        padding: "10px 14px",
                        borderRadius: 8,
                        border: "1px solid #cbd5e1",
                        fontSize: 14
                      }}
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 4 }}>
                      Nom de la Banque *
                    </label>
                    <input
                      type="text"
                      placeholder="ex: UBA, Afriland, Ecobank..."
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 14 }}
                    />
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 4 }}>
                      Titulaire du Compte
                    </label>
                    <input
                      type="text"
                      placeholder="Nom et prénom ou raison sociale"
                      value={bankAccountName}
                      onChange={(e) => setBankAccountName(e.target.value)}
                      style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 14 }}
                    />
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 4 }}>
                      Numéro de Compte / IBAN / RIB *
                    </label>
                    <input
                      type="text"
                      placeholder="CM21 1000 5000 1234 5678 9012 34"
                      value={bankAccountNumber}
                      onChange={(e) => setBankAccountNumber(e.target.value)}
                      style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 14 }}
                    />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 4 }}>
                      Code SWIFT / BIC (Optionnel)
                    </label>
                    <input
                      type="text"
                      placeholder="ex: AFRIKCMM"
                      value={bankSwift}
                      onChange={(e) => setBankSwift(e.target.value)}
                      style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 14 }}
                    />
                  </div>
                </>
              )}

              {withdrawError && (
                <p style={{ color: "#dc2626", fontSize: 13, marginBottom: 16, fontWeight: 600 }}>{withdrawError}</p>
              )}

              {withdrawSuccess && (
                <p style={{ color: "#16a34a", fontSize: 13, marginBottom: 16, fontWeight: 600 }}>
                  ✓ Withdrawal successfully sent to Mobile Money!
                </p>
              )}

              <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  style={{
                    padding: "10px 16px",
                    borderRadius: 8,
                    border: "1px solid #cbd5e1",
                    background: "#ffffff",
                    fontWeight: 600,
                    cursor: "pointer"
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleWithdraw}
                  disabled={withdrawing || withdrawSuccess}
                  style={{
                    padding: "10px 18px",
                    borderRadius: 8,
                    border: "none",
                    background: "#ff4500",
                    color: "#ffffff",
                    fontWeight: 700,
                    cursor: "pointer"
                  }}
                >
                  {withdrawing ? "Processing..." : "Confirm Payout"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
    </>
  );
}
