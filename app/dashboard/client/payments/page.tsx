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
};

const translations: Record<string, Record<string, string>> = {
  en: {
    pageTitle: "Payments & Escrows",
    pageSubtitle: "Monitor your available balances, pending deposits, and task payouts.",
    availableBalance: "Available Balance",
    pendingEscrow: "Pending Escrow",
    txHistory: "Transaction History",
    loading: "Loading transactions...",
    noTx: "No transaction history recorded yet.",
    thDate: "Date",
    thType: "Type",
    thCategory: "Category",
    thAmount: "Amount",
    thStatus: "Status",
  },
  fr: {
    pageTitle: "Paiements & Séquestres",
    pageSubtitle: "Suivez vos soldes disponibles, dépôts et paiements de missions.",
    availableBalance: "Solde Disponible",
    pendingEscrow: "Bloqué sous Séquestre",
    txHistory: "Historique des Transactions",
    loading: "Chargement des transactions...",
    noTx: "Aucune transaction enregistrée pour le moment.",
    thDate: "Date",
    thType: "Type",
    thCategory: "Catégorie",
    thAmount: "Montant",
    thStatus: "Statut",
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

  const { data: wallet, loading: walletLoading } = useFetch(() => api.getWallet(), []);
  const { data: txData, loading: txLoading } = useFetch(() => api.getTransactions({ limit: "20" }), []);

  const transactions: Transaction[] = Array.isArray(txData) ? txData : ((txData as any)?.results || []);

  const getStatusClass = (status?: string) => {
    const s = String(status || "").toLowerCase();
    if (s === "completed" || s === "success" || s === "released") return styles.statusSuccess;
    if (s === "pending" || s === "hold") return styles.statusPending;
    if (s === "failed" || s === "cancelled") return styles.statusFailed;
    return styles.statusDefault;
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
    </main>
  );
}

