"use client";

import Link from "next/link";
import { use, useMemo, useState } from "react";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import { useToast } from "@/app/components/Toast";
import { SkeletonBlock, SkeletonCard } from "@/app/components/skeleton/Skeleton";
import styles from "./page.module.css";

const deliveryOptions = ["1 Day", "2 Days", "3 Days", "5 Days", "1 Week"];

export default function TechnicianSubmitBidPage({ params }: { params: Promise<{ taskId: string }> }) {
  const { taskId } = use(params);
  const toast = useToast();

  const { data: task, loading } = useFetch(() => api.getTask(Number(taskId)), [taskId]);
  const { data: myBids } = useFetch(() => api.getMyBids(), []);

  const [paymentType, setPaymentType] = useState<"project" | "milestone">("project");
  const [offerPrice, setOfferPrice] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("3 Days");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const numericOffer = Number(offerPrice.replace(/[^0-9.]/g, "")) || 0;
  const serviceFee = numericOffer * 0.1;
  const payout = numericOffer - serviceFee;
  const activeBid = useMemo(() => {
    const bids = Array.isArray(myBids) ? myBids : (myBids as any)?.results ?? [];
    return bids.find((bid: any) => String(bid.task_id ?? bid.taskId) === String(taskId) && bid.status !== "withdrawn") || null;
  }, [myBids, taskId]);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "XOF", minimumFractionDigits: 0 }).format(amount);

  const handleSubmit = async () => {
    if (!task || !numericOffer) {
      toast.warning("Missing details", "Please enter your offer price before submitting.");
      return;
    }
    if (activeBid) {
      toast.warning("Bid already submitted", "Withdraw your existing bid from My Bids before submitting a new one.");
      return;
    }
    setSubmitting(true);
    try {
      await api.submitBid(task.id, {
        amount: numericOffer,
        amount_type: paymentType === "milestone" ? "hourly" : "fixed",
        message,
        duration: deliveryTime,
      });
      setSubmitted(true);
      toast.success("Bid submitted", "Your proposal is now with the client for review.");
    } catch (err: any) {
      const msg = err?.message || "Failed to submit bid. Please try again.";
      toast.error("Could not submit bid", msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className={styles.page}>
        <header className={styles.topbar}>
          <div className={styles.topbarLeft}>
            <Link href="/dashboard/technician/tasks" className={styles.backButton}>
              <iconify-icon icon="lucide:arrow-left" />
              <span>Back to Task</span>
            </Link>
          </div>
        </header>
        <div className={styles.container}>
          <div className={styles.grid}>
            <div className={styles.mainColumn}><div className={styles.previewCard}><SkeletonCard /></div></div>
            <aside className={styles.sideColumn}><div className={styles.sideCard}><SkeletonCard /></div></aside>
          </div>
        </div>
      </main>
    );
  }

  if (!task) {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <p style={{ padding: 40, textAlign: "center", color: "#64748b" }}>Task not found.</p>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <header className={styles.topbar}>
        <div className={styles.topbarLeft}>
          <Link href={`/dashboard/technician/tasks/${task.id}`} className={styles.backButton}>
            <iconify-icon icon="lucide:arrow-left" />
            <span>Back to Task Details</span>
          </Link>
        </div>
      </header>

      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Submit Your Bid</h1>
          <p>Offer your services, define your terms, and send a focused proposal to the client.</p>
        </div>

        <div className={styles.grid}>
          <div className={styles.mainColumn}>
            <section className={styles.previewCard}>
              <div className={styles.previewHeader}>
                <h2>{task.title}</h2>
                <div className={styles.previewBudget}>
                  <strong>{task.budget_min ? `${Number(task.budget_min).toLocaleString()} XOF` : "TBD"}</strong>
                  <span>Client Budget</span>
                </div>
              </div>
              <div className={styles.previewMeta}>
                <span><iconify-icon icon="lucide:map-pin" /> {task.city || "Not specified"}</span>
                <span><iconify-icon icon="lucide:calendar" /> {task.schedule || "Flexible"}</span>
              </div>
            </section>

            <section className={styles.formCard}>
              {activeBid && (
                <div className={styles.successPanel} style={{ marginBottom: 20 }}>
                  <strong>You already have an active bid on this task.</strong>
                  <p>Go to My Bids to withdraw it before submitting a new proposal.</p>
                  <Link href="/dashboard/technician/bids" className={styles.successLink}>Open My Bids</Link>
                </div>
              )}
              <div className={styles.sectionTitle}>Terms & Payment</div>

              <div className={styles.paymentTypeSelector}>
                <button type="button" className={`${styles.radioCard} ${paymentType === "project" ? styles.radioCardSelected : ""}`} onClick={() => setPaymentType("project")}>
                  <div className={styles.radioHeader}>
                    <span className={styles.radioCircle} />
                    <span className={styles.radioLabel}>By Project</span>
                  </div>
                  <p>Get paid for the full scope after the complete task is delivered and approved.</p>
                </button>
                <button type="button" className={`${styles.radioCard} ${paymentType === "milestone" ? styles.radioCardSelected : ""}`} onClick={() => setPaymentType("milestone")}>
                  <div className={styles.radioHeader}>
                    <span className={styles.radioCircle} />
                    <span className={styles.radioLabel}>By Milestone</span>
                  </div>
                  <p>Split the work into phases and collect payment as each milestone is completed.</p>
                </button>
              </div>

              <div className={styles.formGrid}>
                <label className={styles.formGroup}>
                  <span className={styles.formLabel}>Offer Price (XOF)</span>
                  <span className={styles.inputWrap}>
                    <span className={styles.inputIcon}><iconify-icon icon="lucide:dollar-sign" /></span>
                    <input className={`${styles.formInput} ${styles.formInputWithIcon}`} type="text" inputMode="decimal" value={offerPrice} onChange={(e) => setOfferPrice(e.target.value)} placeholder="e.g. 50000" />
                  </span>
                </label>
                <label className={styles.formGroup}>
                  <span className={styles.formLabel}>Estimated Delivery Time</span>
                  <span className={styles.inputWrap}>
                    <span className={styles.inputIcon}><iconify-icon icon="lucide:clock-3" /></span>
                    <select className={`${styles.formInput} ${styles.formInputWithIcon} ${styles.formSelect}`} value={deliveryTime} onChange={(e) => setDeliveryTime(e.target.value)}>
                      {deliveryOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </span>
                </label>
              </div>

              {numericOffer > 0 && (
                <div className={styles.feeBreakdown}>
                  <div className={styles.feeRow}><span>Your Proposal</span><span>{formatCurrency(numericOffer)}</span></div>
                  <div className={styles.feeRow}><span>Service Fee (10%)</span><span>-{formatCurrency(serviceFee)}</span></div>
                  <div className={`${styles.feeRow} ${styles.feeTotal}`}><span>You&apos;ll Receive</span><span>{formatCurrency(Math.max(0, payout))}</span></div>
                </div>
              )}

              <div className={styles.sectionTitle}>Cover Letter</div>
              <label className={`${styles.formGroup} ${styles.formGroupFull}`}>
                <span className={styles.formLabel}>Message to Client</span>
                <textarea className={styles.formTextarea} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Introduce yourself and explain your approach..." rows={6} />
              </label>

              <div className={styles.formActions}>
                <Link href={`/dashboard/technician/tasks/${task.id}`} className={styles.ghostButton}>Cancel</Link>
                <button
                  type="button"
                  className={`${styles.primaryButton} ${submitted ? styles.successButton : ""}`}
                  disabled={submitting || !numericOffer || Boolean(activeBid)}
                  onClick={handleSubmit}
                >
                  <span>
                    {submitting ? "Submitting..." : submitted ? "Bid Submitted" : activeBid ? "Bid Already Submitted" : "Submit Bid"}
                  </span>
                  <iconify-icon icon={submitted ? "lucide:check-circle-2" : "lucide:send"} />
                </button>
              </div>

              {submitted && (
                <div className={styles.successPanel}>
                  <strong>Bid sent.</strong>
                  <p>Your proposal is now queued in the client&apos;s review list.</p>
                  <Link href="/dashboard/technician/bids" className={styles.successLink}>Go to My Bids</Link>
                </div>
              )}
            </section>
          </div>

          <aside className={styles.sideColumn}>
            <section className={styles.sideCard}>
              <h2 className={styles.sideCardTitle}>Bidding Tips</h2>
              <ul className={styles.tipsList}>
                <li><strong>Be specific</strong> — Clients respond better when your scope and deliverables are clear.</li>
                <li><strong>Lead with relevant work</strong> — Mention comparable jobs you&apos;ve completed.</li>
                <li><strong>Stay competitive</strong> — Consider the client&apos;s budget when setting your price.</li>
              </ul>
            </section>
            <section className={styles.sideCard}>
              <div className={styles.trustBadge}>
                <iconify-icon icon="lucide:shield-check" />
                <div>
                  <strong>Safe Payment Protection</strong>
                  <p>Funds are held in escrow until the work is completed and approved.</p>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
