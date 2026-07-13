"use client";

import { useState } from "react";
import Link from "next/link";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import styles from "./wallet.module.css";
import DashboardHeader from "@/app/components/DashboardHeader";

export default function CompanyWalletPage() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { data: wallet, loading: walletLoading, refetch: refetchWallet } = useFetch(() => api.getWallet(), []);
  const { data: txData, loading: txLoading } = useFetch(() => api.getTransactions(), []);

  const transactions = txData?.results || [];

  return (
    <main className={styles.mainWrapper}>
      <DashboardHeader onMenuClick={() => setMobileSidebarOpen(true)} />
      <div className={styles.container} style={{ marginTop: 32 }}>
        <header className={styles.header}>
          <div>
            <p className={styles.subtitle}>Company dashboard</p>
            <h1 className={styles.title}>Wallet & Payments</h1>
          </div>
          <Link href="/dashboard/company" className={styles.backLink} style={{ color: "#ff4500", fontWeight: 600, textDecoration: "none" }}>
            <iconify-icon icon="lucide:arrow-left" /> Back to dashboard
          </Link>
        </header>

        <section className={styles.balanceCard}>
          <div className={styles.balanceInfo}>
            <span className={styles.balanceLabel}>Available Balance</span>
            <h2 className={styles.balanceAmount}>
              {walletLoading ? "..." : `${wallet?.available_balance || "0.00"} ${wallet?.currency || "XOF"}`}
            </h2>
          </div>
          <button className={styles.withdrawBtn} onClick={() => alert("Withdrawal flow to be integrated with payment gateway.")}>
            <iconify-icon icon="lucide:arrow-up-right" /> Withdraw Funds
          </button>
        </section>

        <section className={styles.transactionsCard}>
          <div className={styles.transactionsHeader}>
            <h3 className={styles.transactionsTitle}>Recent Transactions</h3>
          </div>

          {txLoading ? (
            <div className={styles.emptyState}>Loading transactions...</div>
          ) : transactions.length === 0 ? (
            <div className={styles.emptyState}>
              <iconify-icon icon="lucide:receipt" className={styles.emptyIcon} />
              <p>No transactions found.</p>
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
    </main>
  );
}
