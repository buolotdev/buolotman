"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import { SkeletonBlock } from "@/app/components/skeleton/Skeleton";
import { formatXOF } from "@/app/lib/format";
import styles from "./page.module.css";
import TechnicianSidebar from "@/app/components/TechnicianSidebar";
import DashboardHeader from "@/app/components/DashboardHeader";

export default function TechnicianWalletPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [query, setQuery] = useState("");
  
  // Wallet Data
  const { data: walletData, loading: walletLoading, refetch: refetchWallet } = useFetch(() => api.getWallet(), []);
  const { data: txData, loading: txLoading, refetch: refetchTx } = useFetch(() => api.getTransactions(), []);
  
  const transactionsData = Array.isArray(txData) ? txData : (txData as any)?.results || [];

  const availableBalance = parseFloat(walletData?.available_balance) || 0;
  const pendingEscrow = parseFloat(walletData?.pending_balance) || 0;
  const totalEarnings = availableBalance + pendingEscrow; // Estimate total earnings

  const { data: userData } = useFetch(() => api.getMe(), []);
  const userName = `${userData?.first_name ?? ""} ${userData?.last_name ?? ""}`.trim() || userData?.username || "Eric Niyonzima";
  const userInitials = useMemo(() => {
    const first = userData?.first_name?.[0] ?? "E";
    const last = userData?.last_name?.[0] ?? "N";
    return `${first}${last}`.toUpperCase();
  }, [userData]);
  const userRole = userData?.role ?? "Technician";

  // Withdraw Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawMethod, setWithdrawMethod] = useState("Mobile Money");
  const [withdrawing, setWithdrawing] = useState(false);
  const [withdrawError, setWithdrawError] = useState<string | null>(null);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  const handleWithdraw = async () => {
    setWithdrawError(null);
    setWithdrawSuccess(false);
    
    const amount = Number(withdrawAmount);
    if (!amount || amount <= 0) {
      setWithdrawError("Enter a valid amount.");
      return;
    }
    if (amount > availableBalance) {
      setWithdrawError("Insufficient available balance.");
      return;
    }

    setWithdrawing(true);
    try {
      await api.withdraw({
        amount,
        method: withdrawMethod
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

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Released': return styles.statusReleased;
      case 'On Hold': return styles.statusHold;
      case 'Pending': return styles.statusPending;
      default: return styles.statusPending;
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.layout}>
        <TechnicianSidebar isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

        <div className={styles.main}>
          <DashboardHeader
            onMenuClick={() => setMobileNavOpen(true)}
            searchPlaceholder="Search..."
            searchQuery={query}
            setSearchQuery={setQuery}
          />

          <div className={styles.content}>
            <section className={styles.pageHeader}>
              <div>
                <p className={styles.eyebrow}>Payments</p>
                <h1>Wallet Overview</h1>
              </div>
            </section>

            {/* STATS */}
            <section className={styles.walletOverview}>
              <article className={styles.statCard}>
                <span>Available Balance</span>
                <h3>${availableBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
              </article>
              <article className={styles.statCard}>
                <span>Funds On Hold</span>
                <h3>${pendingEscrow.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
              </article>
              <article className={styles.statCard}>
                <span>Total Earned</span>
                <h3>${totalEarnings.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
              </article>
            </section>

            {/* WITHDRAW CARD */}
            <section className={styles.withdrawCard}>
              <h3>Withdraw Funds</h3>
              <p className={styles.notice}>Withdrawals are processed after admin & client milestone approval.</p>
              <button className={styles.primaryButton} onClick={() => setModalOpen(true)}>
                Withdraw Money
              </button>
            </section>

            {/* TRANSACTIONS TABLE */}
            <section className={styles.transactionsCard}>
              <h3>Transaction History</h3>
              <div className={styles.tableWrapper}>
                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Project</th>
                      <th>Type</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {txLoading ? (
                      <tr><td colSpan={5} style={{ textAlign: "center", padding: "20px" }}>Loading transactions...</td></tr>
                    ) : transactionsData.length === 0 ? (
                      <tr><td colSpan={5} style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>No transactions found.</td></tr>
                    ) : transactionsData.map((tx: any) => {
                      const date = new Date(tx.created_at || Date.now()).toLocaleDateString();
                      const project = tx.task_title || `Task #${tx.task_id || "Unknown"}`;
                      const type = tx.transaction_type || tx.type || "Transfer";
                      const amount = parseFloat(tx.amount) || 0;
                      const status = (tx.status || "Pending").toUpperCase();
                      
                      return (
                        <tr key={tx.id}>
                          <td>{date}</td>
                          <td>{project}</td>
                          <td style={{ textTransform: "capitalize" }}>{type.replace('_', ' ')}</td>
                          <td>${amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                          <td>
                            <span className={`${styles.statusBadge} ${getStatusBadge(tx.status === 'completed' ? 'Released' : tx.status === 'pending' ? 'Pending' : 'On Hold')}`}>
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
            
            <h3>Withdraw Funds</h3>
            <p className={styles.notice} style={{ marginBottom: '16px' }}>
              Available balance only. On-hold funds cannot be withdrawn.
            </p>

            <div className={styles.formGroup}>
              <label>Amount (Max: ${availableBalance})</label>
              <input 
                type="number" 
                className={styles.formInput} 
                placeholder="0.00" 
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Withdrawal Method</label>
              <select 
                className={styles.formInput}
                value={withdrawMethod}
                onChange={(e) => setWithdrawMethod(e.target.value)}
              >
                <option value="Mobile Money">Mobile Money</option>
                <option value="Bank Account">Bank Account</option>
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
                Withdrawal request submitted successfully
              </div>
            )}

            <div className={styles.modalActions}>
              <button 
                className={`${styles.primaryButton} ${styles.fullButton}`} 
                onClick={handleWithdraw}
                disabled={withdrawing || withdrawSuccess}
              >
                {withdrawing ? "Processing..." : "Confirm Withdrawal"}
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
