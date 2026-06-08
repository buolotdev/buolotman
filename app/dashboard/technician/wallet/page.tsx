"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import { SkeletonBlock, SkeletonCard, SkeletonStat } from "@/app/components/skeleton/Skeleton";
import { useToast } from "@/app/components/Toast";
import { useDialog } from "@/app/components/Dialog";
import { formatXOF } from "@/app/lib/format";
import styles from "./page.module.css";
import LogoutButton from "@/app/components/LogoutButton";

type TransactionTab = "all" | "earnings" | "withdrawals";

type Transaction = {
  id: string;
  title: string;
  date: string;
  amount: number;
  amountLabel: string;
  kind: "credit" | "debit" | "pending";
  status: string;
  tab: Exclude<TransactionTab, "all"> | "pending";
};

const PAGE_SIZE = 4;

export default function TechnicianWalletPage() {
  const toast = useToast();
  const dialog = useDialog();
  const { data: walletData, loading: walletLoading } = useFetch(() => api.getWallet(), []);
  const { data: transactionsData, loading: txLoading, refetch: refetchTx } = useFetch(() => api.getTransactions(), []);

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<TransactionTab>("all");
  const [page, setPage] = useState(1);

  const availableBalance = walletData?.available_balance ?? 0;
  const pendingEscrow = walletData?.pending_balance ?? 0;

  const { data: userData } = useFetch(() => api.getMe(), []);
  const userName = `${userData?.first_name ?? ""} ${userData?.last_name ?? ""}`.trim() || userData?.username || "";
  const userInitials = useMemo(() => {
    const first = userData?.first_name?.[0] ?? "";
    const last = userData?.last_name?.[0] ?? "";
    return `${first}${last}`.toUpperCase();
  }, [userData]);
  const userRole = userData?.role ?? "";

  const transactions: Transaction[] = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw = (Array.isArray(transactionsData) ? transactionsData : transactionsData?.results ?? []) as any[];
    return raw.map((t) => ({
      id: String(t.id),
      title: t.title ?? "",
      date: t.date ?? "",
      amount: t.amount ?? 0,
      amountLabel: t.amount_label ?? (t.amount >= 0 ? `+${formatXOF(t.amount)}` : `-${formatXOF(Math.abs(t.amount))}`),
      kind: t.kind ?? (t.amount >= 0 ? "credit" : "debit"),
      status: t.status ?? "Completed",
      tab: t.tab ?? (t.kind === "debit" ? "withdrawals" : t.kind === "pending" ? "pending" : "earnings"),
    }));
  }, [transactionsData]);

  const normalizedQuery = query.trim().toLowerCase();

  const filteredTransactions = useMemo(() => {
    let next = transactions;

    if (activeTab === "earnings") {
      next = next.filter((transaction) => transaction.tab === "earnings");
    } else if (activeTab === "withdrawals") {
      next = next.filter((transaction) => transaction.tab === "withdrawals");
    }

    if (normalizedQuery) {
      next = next.filter((transaction) => [transaction.title, transaction.date, transaction.status].join(" ").toLowerCase().includes(normalizedQuery));
    }

    return next;
  }, [activeTab, normalizedQuery, transactions]);

  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedTransactions = filteredTransactions.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const totalEarnings = transactions
    .filter((transaction) => transaction.kind === "credit")
    .reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);

  const loading = walletLoading || txLoading;

  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawMethod, setWithdrawMethod] = useState("wave");
  const [withdrawPhone, setWithdrawPhone] = useState("");
  const [withdrawing, setWithdrawing] = useState(false);
  const [withdrawError, setWithdrawError] = useState<string | null>(null);

  const withdrawFunds = async () => {
    const amount = Number(withdrawAmount);
    if (!amount || amount <= 0) {
      setWithdrawError("Enter a valid amount");
      return;
    }
    if (amount > availableBalance) {
      setWithdrawError("Amount exceeds available balance");
      return;
    }
    setWithdrawing(true);
    setWithdrawError(null);
    try {
      await api.withdraw({
        amount,
        account_details: { method: withdrawMethod, phone: withdrawPhone },
      });
      setWithdrawAmount("");
      setWithdrawPhone("");
      window.location.reload();
    } catch (err: any) {
      setWithdrawError(err?.message || "Withdrawal failed");
    } finally {
      setWithdrawing(false);
    }
  };

  const exportTransactions = () => {};

  const releaseEscrow = () => {
    if (pendingEscrow <= 0) return;
  };

  const changeTab = (tab: TransactionTab) => {
    setActiveTab(tab);
    setPage(1);
  };

  return (
    <main className={styles.page}>
      <div className={styles.layout}>
        <aside className={`${styles.sidebar} ${mobileNavOpen ? styles.sidebarOpen : ""}`}>
          <div className={styles.sidebarTop}>
            <Link href="/" className={styles.brand} aria-label="Boulot Man home">
              <Image src="/boulotman-logo.png" alt="Boulot Man" width={220} height={56} className={styles.brandImage} priority />
            </Link>
            <button type="button" className={styles.sidebarClose} aria-label="Close navigation" onClick={() => setMobileNavOpen(false)}>
              <iconify-icon icon="lucide:x" />
            </button>
          </div>

          <div className={styles.profileCard}>
            <div className={styles.profileAvatar}>{userInitials}</div>
            <div className={styles.profileMeta}>
              <strong>{userName}</strong>
              <span>{userRole}</span>
            </div>
          </div>

          <nav className={styles.sidebarNav} aria-label="Technician navigation">
            <Link href="/dashboard/technician" className={styles.navItem}>
              <span className={styles.navIcon}><iconify-icon icon="lucide:layout-dashboard" /></span>
              <span>Dashboard</span>
            </Link>
            <Link href="/dashboard/technician/tasks" className={styles.navItem}>
              <span className={styles.navIcon}><iconify-icon icon="lucide:search" /></span>
              <span>Browse Tasks</span>
            </Link>
            <Link href="/dashboard/technician/bids" className={styles.navItem}>
              <span className={styles.navIcon}><iconify-icon icon="lucide:file-text" /></span>
              <span>My Bids</span>
            </Link>
            <Link href="/dashboard/technician/messages" className={styles.navItem}>
              <span className={styles.navIcon}><iconify-icon icon="lucide:message-square" /></span>
              <span>Messages</span>
            </Link>
            <Link href="/dashboard/technician/wallet" className={`${styles.navItem} ${styles.navItemActive}`}>
              <span className={styles.navIcon}><iconify-icon icon="lucide:wallet" /></span>
              <span>Wallet</span>
            </Link>
            <Link href="/dashboard/technician/profile" className={styles.navItem}>
              <span className={styles.navIcon}><iconify-icon icon="lucide:user" /></span>
              <span>Profile</span>
            </Link>
          </nav>

          <LogoutButton className={styles.logoutButton} />
        </aside>

        <div className={styles.main}>
          <header className={styles.topbar}>
            <div className={styles.topbarLeft}>
              <button type="button" className={styles.mobileMenuButton} aria-label="Open navigation" onClick={() => setMobileNavOpen(true)}>
                <iconify-icon icon="lucide:menu" />
              </button>
              <label className={styles.searchBox}>
                <iconify-icon icon="lucide:search" />
                <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tasks or users..." aria-label="Search wallet activity" />
              </label>
            </div>

            <div className={styles.topbarActions}>
              <button type="button" className={styles.iconButton} aria-label="Notifications">
                <iconify-icon icon="lucide:bell" />
                <span className={styles.notificationDot} />
              </button>
              <div className={styles.topbarProfile}>
                <div className={styles.topbarAvatar}>{userInitials}</div>
                <div className={styles.topbarProfileLines}>
                  <strong>{userName}</strong>
                  <span>{userRole}</span>
                </div>
              </div>
            </div>
          </header>

          <div className={styles.content}>
            <section className={styles.pageHeader}>
              <div>
                <p className={styles.eyebrow}>Earnings</p>
                <h1>Wallet & Earnings</h1>
              </div>
              <button
                type="button"
                className={styles.primaryButton}
                onClick={async () => {
                  const amountStr = await dialog.prompt({
                    title: "Withdraw funds",
                    message: `Available balance: ${availableBalance.toLocaleString()} XOF. How much do you want to withdraw?`,
                    placeholder: "Amount in XOF",
                    inputType: "number",
                    confirmText: "Next",
                  });
                  if (!amountStr) return;
                  const amount = Number(amountStr);
                  if (!amount || amount <= 0) { toast.warning("Invalid amount", "Please enter a number greater than zero."); return; }
                  const phone = await dialog.prompt({
                    title: "Mobile money number",
                    message: "Enter the mobile money phone number to receive funds (e.g. +22177...).",
                    placeholder: "+22177...",
                    confirmText: "Withdraw",
                  }) || "";
                  if (!phone) return;
                  setWithdrawing(true);
                  try {
                    await api.withdraw({ amount, account_details: { method: "mobile_money", phone } });
                    toast.success("Withdrawal initiated", "Your funds are on the way. Refresh to see status.");
                    window.location.reload();
                  } catch (err: any) {
                    toast.error("Withdrawal failed", err?.message || "Please try again.");
                  } finally {
                    setWithdrawing(false);
                  }
                }}
                disabled={availableBalance <= 0 || withdrawing}
              >
                <iconify-icon icon="lucide:arrow-down-to-line" />
                {withdrawing ? "Processing..." : "Withdraw Funds"}
              </button>
            </section>

            {loading ? (
              <section className={styles.walletOverview}>
                <SkeletonBlock style={{ height: 120, borderRadius: 12 }} />
                <div className={styles.statGrid}>
                  <SkeletonStat />
                  <SkeletonStat />
                </div>
              </section>
            ) : (
              <section className={styles.walletOverview}>
                <article className={`${styles.balanceCard} ${styles.balanceCardPrimary}`}>
                  <small>Available Balance</small>
                  <strong>{formatXOF(availableBalance)}</strong>
                  <span><iconify-icon icon="lucide:check-circle-2" />Ready to withdraw</span>
                </article>

                <div className={styles.statGrid}>
                  <article className={styles.statCard}>
                    <div className={styles.statHeader}>
                      <small>Pending Escrow</small>
                      <span className={`${styles.statIcon} ${styles.statWarning}`}><iconify-icon icon="lucide:lock" /></span>
                    </div>
                    <strong>{formatXOF(pendingEscrow)}</strong>
                    <button type="button" className={styles.outlineButton} onClick={releaseEscrow} disabled={pendingEscrow <= 0}>
                      Release Escrow
                    </button>
                  </article>

                  <article className={styles.statCard}>
                    <div className={styles.statHeader}>
                      <small>Total Earnings</small>
                      <span className={`${styles.statIcon} ${styles.statSuccess}`}><iconify-icon icon="lucide:trending-up" /></span>
                    </div>
                    <strong>{formatXOF(totalEarnings)}</strong>
                    <span className={styles.statNote}>Marketplace lifetime earnings</span>
                  </article>
                </div>
              </section>
            )}

            <section className={styles.transactionsCard}>
              <div className={styles.transactionsHeader}>
                <h2>Transaction History</h2>
                <div className={styles.transactionsActions}>
                  <div className={styles.tabs}>
                    <button type="button" className={`${styles.tab} ${activeTab === "all" ? styles.tabActive : ""}`} onClick={() => changeTab("all")}>All</button>
                    <button type="button" className={`${styles.tab} ${activeTab === "earnings" ? styles.tabActive : ""}`} onClick={() => changeTab("earnings")}>Earnings</button>
                    <button type="button" className={`${styles.tab} ${activeTab === "withdrawals" ? styles.tabActive : ""}`} onClick={() => changeTab("withdrawals")}>Withdrawals</button>
                  </div>
                  <button type="button" className={styles.outlineButton} onClick={exportTransactions}>
                    <iconify-icon icon="lucide:download" />
                    Export
                  </button>
                </div>
              </div>

              <div className={styles.transactionList}>
                {txLoading ? (
                  Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
                ) : pagedTransactions.length ? (
                  pagedTransactions.map((transaction) => (
                    <article key={transaction.id} className={styles.transactionItem}>
                      <span className={`${styles.txIcon} ${transaction.kind === "credit" ? styles.txCredit : transaction.kind === "debit" ? styles.txDebit : styles.txPending}`}>
                        <iconify-icon icon={transaction.kind === "credit" ? "lucide:arrow-down-left" : transaction.kind === "debit" ? "lucide:building-2" : "lucide:lock"} />
                      </span>
                      <div className={styles.txDetails}>
                        <strong>{transaction.title}</strong>
                        <span><iconify-icon icon="lucide:calendar" />{transaction.date}</span>
                      </div>
                      <span className={`${styles.txStatus} ${transaction.kind === "credit" ? styles.statusCompleted : transaction.kind === "debit" ? styles.statusProcessed : styles.statusPending}`}>
                        {transaction.status}
                      </span>
                      <strong className={`${styles.txAmount} ${transaction.kind === "credit" ? styles.amountCredit : transaction.kind === "debit" ? styles.amountDebit : styles.amountPending}`}>
                        {transaction.amountLabel}
                      </strong>
                    </article>
                  ))
                ) : (
                  <div className={styles.emptyState}>No wallet transactions yet.</div>
                )}
              </div>
            </section>

            {!loading && filteredTransactions.length > 0 && (
              <div className={styles.pagination}>
                <button type="button" className={styles.pageButton} disabled={currentPage === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>
                  <iconify-icon icon="lucide:chevron-left" />
                </button>
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((value) => (
                  <button key={value} type="button" className={`${styles.pageButton} ${value === currentPage ? styles.pageButtonActive : ""}`} onClick={() => setPage(value)}>
                    {value}
                  </button>
                ))}
                <button type="button" className={styles.pageButton} disabled={currentPage === totalPages} onClick={() => setPage((value) => Math.min(totalPages, value + 1))}>
                  <iconify-icon icon="lucide:chevron-right" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
