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
  const { data: txData, loading: txLoading } = useFetch(() => api.getTransactions(), []);

  const transactions = (txData as any)?.results || [];

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
          <button className={styles.withdrawBtn} onClick={() => alert(t.withdrawNotice)}>
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
      </div>
      </div>
    </>
  );
}
