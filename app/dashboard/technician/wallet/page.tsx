"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import { SkeletonBlock } from "@/app/components/skeleton/Skeleton";
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
  const [depositAmount, setDepositAmount] = useState("50");
  const [depositMethod, setDepositMethod] = useState("Credit / Debit Card");
  const [depositing, setDepositing] = useState(false);
  const [depositError, setDepositError] = useState<string | null>(null);
  const [depositSuccess, setDepositSuccess] = useState(false);

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
      setDepositError("Enter a valid deposit amount.");
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
            searchPlaceholder="Search wallet history..."
            searchQuery={query}
            setSearchQuery={setQuery}
          />

          <div className={styles.content}>
            <section className={styles.pageHeader}>
              <div>
                <p className={styles.eyebrow}>Payments & Wallet</p>
                <h1>Wallet & Payouts</h1>
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
                  <iconify-icon icon="lucide:sparkles" /> Upgrade Tier
                </Link>
              </div>
            </section>

            {/* STATS */}
            <section className={styles.walletOverview}>
              <article className={styles.statCard}>
                <span>Available Balance</span>
                <h3>{availableBalance.toLocaleString()} XOF</h3>
                <small style={{ color: "#16a34a", fontWeight: 600 }}>Ready for withdrawal / upgrade</small>
              </article>
              <article className={styles.statCard}>
                <span>Held in Escrow</span>
                <h3>{pendingEscrow.toLocaleString()} XOF</h3>
                <small style={{ color: "#64748b" }}>Released upon milestone sign-off</small>
              </article>
              <article className={styles.statCard}>
                <span>Total Lifetime Earnings</span>
                <h3>{totalEarnings.toLocaleString()} XOF</h3>
                <small style={{ color: "#001f3f", fontWeight: 600 }}>100% Escrow Protected</small>
              </article>
            </section>

            {/* ACTIONS BAR */}
            <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, marginBottom: 30 }}>
              <div className={styles.withdrawCard} style={{ margin: 0 }}>
                <h3>Add Funds to Wallet</h3>
                <p className={styles.notice}>Top up your balance via Mobile Money or Card to fund upgrades or tasks.</p>
                <button
                  className={styles.primaryButton}
                  style={{ background: "#001f3f" }}
                  onClick={() => setDepositOpen(true)}
                >
                  <iconify-icon icon="lucide:plus-circle" /> Add Money (Deposit)
                </button>
              </div>

              <div className={styles.withdrawCard} style={{ margin: 0 }}>
                <h3>Withdraw Earnings</h3>
                <p className={styles.notice}>Instant transfers to Mobile Money wallets or direct bank accounts.</p>
                <button className={styles.primaryButton} onClick={() => setModalOpen(true)}>
                  <iconify-icon icon="lucide:arrow-down-circle" /> Withdraw Money
                </button>
              </div>
            </section>

            {/* TRANSACTIONS TABLE */}
            <section className={styles.transactionsCard}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h3 style={{ margin: 0 }}>Transaction History</h3>
                <button
                  onClick={() => { refetchWallet(); refetchTx(); }}
                  style={{ border: "none", background: "transparent", color: "#64748b", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: 13 }}
                >
                  <iconify-icon icon="lucide:refresh-cw" /> Refresh
                </button>
              </div>

              <div className={styles.tableWrapper}>
                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Description</th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {walletLoading || txLoading ? (
                      <tr><td colSpan={5} style={{ textAlign: "center", padding: "20px" }}>Loading records...</td></tr>
                    ) : transactionsData.length === 0 ? (
                      <tr><td colSpan={5} style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>No wallet transactions found.</td></tr>
                    ) : transactionsData.map((tx: any, idx: number) => {
                      const isCredit = tx.transaction_type === "credit" || tx.type === "deposit" || tx.type === "payment_received";
                      const amount = parseFloat(tx.amount) || 0;
                      const date = tx.created_at ? new Date(tx.created_at).toLocaleDateString() : "Recent";
                      const desc = tx.description || tx.reference || (isCredit ? "Wallet Top-up / Escrow Payout" : "Withdrawal / Fee Transfer");
                      const status = tx.status || "Completed";

                      return (
                        <tr key={tx.id || idx}>
                          <td>
                            <strong style={{ color: isCredit ? "#16a34a" : "#001f3f" }}>
                              {isCredit ? "Deposit / Credit" : "Withdrawal / Debit"}
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
            
            <h3>Withdraw Funds</h3>
            <p className={styles.notice} style={{ marginBottom: '16px' }}>
              Available balance only. On-hold escrow funds cannot be withdrawn until task sign-off.
            </p>

            <div className={styles.formGroup}>
              <label>Amount (Available: {availableBalance.toLocaleString()} XOF)</label>
              <input 
                type="number" 
                className={styles.formInput} 
                placeholder="0" 
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
                <option value="Mobile Money (Orange/MTN/Wave)">Mobile Money (Orange / MTN / Wave)</option>
                <option value="Direct Bank Wire Transfer">Direct Bank Wire Transfer</option>
                <option value="International Transfer">International Transfer</option>
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

      {/* DEPOSIT MODAL */}
      {depositOpen && (
        <div className={styles.modalOverlay} onClick={() => setDepositOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setDepositOpen(false)}>
              <iconify-icon icon="lucide:x" />
            </button>
            
            <h3>Deposit Money into Wallet</h3>
            <p className={styles.notice} style={{ marginBottom: '16px' }}>
              Add funds to pay for plan upgrades, bid packages, or task escrow.
            </p>

            <div className={styles.formGroup}>
              <label>Deposit Amount (XOF)</label>
              <input 
                type="number" 
                className={styles.formInput} 
                placeholder="5000" 
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Payment Method</label>
              <select 
                className={styles.formInput}
                value={depositMethod}
                onChange={(e) => setDepositMethod(e.target.value)}
              >
                <option value="Credit / Debit Card">Credit / Debit Card (Visa, Mastercard)</option>
                <option value="Mobile Money (Orange/MTN/Wave)">Mobile Money (Orange, MTN, Wave)</option>
                <option value="Direct Bank Deposit">Direct Bank Transfer</option>
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
                Funds added to wallet successfully!
              </div>
            )}

            <div className={styles.modalActions}>
              <button 
                className={`${styles.primaryButton} ${styles.fullButton}`} 
                style={{ background: "#16a34a" }}
                onClick={handleDeposit}
                disabled={depositing || depositSuccess}
              >
                {depositing ? "Processing..." : `Deposit ${depositAmount || 0} XOF Now`}
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
