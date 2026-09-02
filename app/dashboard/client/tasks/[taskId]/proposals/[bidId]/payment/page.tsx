"use client";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { use, useMemo, useState, useEffect } from "react";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import { SkeletonBlock } from "@/app/components/skeleton/Skeleton";
import styles from "./page.module.css";

type PaymentMethod = "card" | "bank" | "mobile";

function parseAmount(value: any) {
  if (typeof value === "number") return value;
  if (!value) return 0;
  const num = parseFloat(String(value).replace(/,/g, ""));
  return isNaN(num) ? 0 : num;
}

function formatXof(value: number) {
  return `${Math.round(value).toLocaleString()} XOF`;
}

export default function ProposalPaymentPage({ params }: { params: Promise<{ taskId: string; bidId: string }> }) {
  const { taskId, bidId } = use(params);

  const { data: task, loading: taskLoading } = useFetch(() => api.getTask(Number(taskId)), [taskId]);
  const { data: bidsData, loading: bidLoading } = useFetch(() => api.getTaskBids(Number(taskId)), [taskId]);

  const [mobileOperator, setMobileOperator] = useState<"MTN" | "ORANGE">("MTN");
  const [mobilePhone, setMobilePhone] = useState("");
  const [momoPending, setMomoPending] = useState(false);
  const [momoReference, setMomoReference] = useState<string | null>(null);
  const [momoMessage, setMomoMessage] = useState<string | null>(null);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("mobile");
  const [note, setNote] = useState("");
  const [sameAsTaskAddress, setSameAsTaskAddress] = useState(true);
  const [billingAddress, setBillingAddress] = useState({
    street: "",
    city: "",
    zip: "",
  });
  const [cardForm, setCardForm] = useState({
    number: "",
    expiry: "",
    cvc: "",
    holder: "",
  });
  const [depositSubmitted, setDepositSubmitted] = useState(false);
  const [depositing, setDepositing] = useState(false);
  const [depositError, setDepositError] = useState<string | null>(null);

  // Poll CamPay Mobile Money status
  useEffect(() => {
    if (!momoPending || !momoReference) return;
    const interval = setInterval(async () => {
      try {
        const res = await api.campayCheckStatus(momoReference);
        if (res?.status === "SUCCESSFUL" || res?.is_completed) {
          clearInterval(interval);
          setMomoPending(false);
          setDepositSubmitted(true);
        } else if (res?.status === "FAILED") {
          clearInterval(interval);
          setMomoPending(false);
          setDepositError("Mobile Money transaction was declined or failed. Please try again.");
        }
      } catch (e) {
        console.error("CamPay polling error:", e);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [momoPending, momoReference]);

  const loading = taskLoading || bidLoading;

  const bid = (() => {
    if (!bidsData) return null;
    const list = Array.isArray(bidsData) ? bidsData : (bidsData as any)?.results || [];
    return list.find((b: any) => String(b.id) === bidId) || null;
  })();
  const acceptedBid = useMemo(() => {
    if (!bidsData) return null;
    const list = Array.isArray(bidsData) ? bidsData : (bidsData as any)?.results || [];
    return list.find((b: any) => b.status === "accepted") || null;
  }, [bidsData]);
  const lockedToAcceptedBid = Boolean(acceptedBid && String((acceptedBid as any).id) !== bidId);

  if (loading) {
    return (
      <main className={styles.page}>
        <div className={styles.logoBar}>
          <Link href="/" className={styles.logoLink} aria-label="Boulot Man home">
            <Image src="/boulotman-logo.png" alt="Boulot Man" width={280} height={72} className={styles.logoImage} priority />
          </Link>
        </div>
        <div className={styles.shell}>
          <SkeletonBlock style={{ width: "40%", height: 24, marginBottom: 16 }} />
          <SkeletonBlock style={{ width: "60%", height: 16 }} />
        </div>
      </main>
    );
  }

  if (!task || !bid) notFound();
  if (lockedToAcceptedBid) {
    return (
      <main className={styles.page}>
        <div className={styles.logoBar}>
          <Link href="/" className={styles.logoLink} aria-label="Boulot Man home">
            <Image src="/boulotman-logo.png" alt="Boulot Man" width={280} height={72} className={styles.logoImage} priority />
          </Link>
        </div>
        <div className={styles.shell}>
          <section className={styles.successCard}>
            <h2>Proposal already accepted</h2>
            <p>This task has already been hired. Only the accepted proposal can proceed to escrow and review.</p>
            <div className={styles.successActions}>
              <Link href={`/dashboard/client/tasks/${task.id}/proposals`} className={styles.secondaryButton}>
                View accepted proposal
              </Link>
              <Link href={`/dashboard/client/tasks/${task.id}`} className={styles.primaryButton}>
                Back to task
              </Link>
            </div>
          </section>
        </div>
      </main>
    );
  }

  const agreedPrice = parseAmount((bid as any).amount);
  const platformFee = Math.round(agreedPrice * 0.05);
  const total = Math.max(agreedPrice + platformFee, 0);

  const canSubmit =
    paymentMethod !== "card" ||
    Boolean(cardForm.number.trim() && cardForm.expiry.trim() && cardForm.cvc.trim() && cardForm.holder.trim());

  return (
    <main className={styles.page}>
      <div className={styles.logoBar}>
        <Link href="/" className={styles.logoLink} aria-label="Boulot Man home">
          <Image src="/boulotman-logo.png" alt="Boulot Man" width={280} height={72} className={styles.logoImage} priority />
        </Link>
      </div>

      <div className={styles.shell}>
        <div className={styles.intro}>
          <Link href={`/dashboard/client/tasks/${task.id}/proposals`} className={styles.backLink}>
            Back to proposals
          </Link>
          <h1 className={styles.title}>Fund escrow and start task</h1>
          <p className={styles.subtitle}>
            This page fits after proposal acceptance. Funds are held securely until you approve the completed work.
          </p>
        </div>

        {depositSubmitted ? (
          <section className={styles.successCard}>
            <h2>Escrow funded successfully</h2>
            <p>
              {formatXof(total)} is now held for {(bid as any).bidder || "the professional"}. The task can start, and payment remains locked until you confirm completion.
            </p>
            <div className={styles.successActions}>
              <Link href={`/dashboard/client/tasks/${task.id}`} className={styles.secondaryButton}>
                Back to task
              </Link>
              <Link href={`/dashboard/client/tasks/${task.id}/proposals/${bid.id}/review`} className={styles.primaryButton}>
                Rate experience
              </Link>
            </div>
          </section>
        ) : (
          <div className={styles.layout}>
            <section className={styles.leftColumn}>
              <article className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2>How escrow works</h2>
                  <span className={styles.secureLabel}>Protected checkout</span>
                </div>

                <div className={styles.steps}>
                  <div className={styles.step}>
                    <span className={styles.stepIndex}>1</span>
                    <div>
                      <strong>Deposit funds</strong>
                      <p>Securely fund the agreed amount for this exact proposal.</p>
                    </div>
                  </div>
                  <div className={styles.stepConnector} />
                  <div className={styles.step}>
                    <span className={styles.stepIndex}>2</span>
                    <div>
                      <strong>Work begins</strong>
                      <p>{(bid as any).bidder || "The professional"} starts the task with funding already reserved.</p>
                    </div>
                  </div>
                  <div className={styles.stepConnector} />
                  <div className={styles.step}>
                    <span className={styles.stepIndex}>3</span>
                    <div>
                      <strong>Release payment</strong>
                      <p>You approve completion before funds are released.</p>
                    </div>
                  </div>
                </div>
              </article>

              <article className={styles.card}>
                <h2>Message to professional</h2>
                <textarea
                  className={styles.textarea}
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  placeholder={`Add any final notes, access codes, or instructions for ${((bid as any).bidder || "the professional").split(" ")[0]}...`}
                />
              </article>

              <section className={styles.paymentSection}>
                <h2 className={styles.sectionTitle}>Select payment method</h2>

                <article className={`${styles.methodCard} ${paymentMethod === "card" ? styles.methodCardActive : ""}`}>
                  <button type="button" className={styles.methodHeader} onClick={() => setPaymentMethod("card")}>
                    <div className={styles.methodTitle}>
                      <span className={styles.radioCircle} />
                      <span>Credit or debit card</span>
                    </div>
                    <span className={styles.methodIcon}>Card</span>
                  </button>

                  {paymentMethod === "card" ? (
                    <div className={styles.methodBody}>
                      <div className={styles.formField}>
                        <label htmlFor="card-number">Card Number</label>
                        <input
                          id="card-number"
                          value={cardForm.number}
                          onChange={(event) => setCardForm((current) => ({ ...current, number: event.target.value }))}
                        />
                      </div>

                      <div className={styles.formSplit}>
                        <div className={styles.formField}>
                          <label htmlFor="card-expiry">Expiry Date</label>
                          <input
                            id="card-expiry"
                            value={cardForm.expiry}
                            onChange={(event) => setCardForm((current) => ({ ...current, expiry: event.target.value }))}
                          />
                        </div>

                        <div className={styles.formField}>
                          <label htmlFor="card-cvc">CVC</label>
                          <input
                            id="card-cvc"
                            value={cardForm.cvc}
                            onChange={(event) => setCardForm((current) => ({ ...current, cvc: event.target.value }))}
                          />
                        </div>
                      </div>

                      <div className={styles.formField}>
                        <label htmlFor="card-holder">Cardholder Name</label>
                        <input
                          id="card-holder"
                          value={cardForm.holder}
                          onChange={(event) => setCardForm((current) => ({ ...current, holder: event.target.value }))}
                        />
                      </div>

                      <div className={styles.billingBlock}>
                        <label className={styles.checkboxRow}>
                          <input
                            type="checkbox"
                            checked={sameAsTaskAddress}
                            onChange={(event) => setSameAsTaskAddress(event.target.checked)}
                          />
                          <span>Billing address is the same as the task location</span>
                        </label>

                        {!sameAsTaskAddress ? (
                          <>
                            <div className={styles.formField}>
                              <label htmlFor="billing-street">Street Address</label>
                              <input
                                id="billing-street"
                                value={billingAddress.street}
                                onChange={(event) =>
                                  setBillingAddress((current) => ({ ...current, street: event.target.value }))
                                }
                              />
                            </div>

                            <div className={styles.formSplit}>
                              <div className={styles.formField}>
                                <label htmlFor="billing-city">City</label>
                                <input
                                  id="billing-city"
                                  value={billingAddress.city}
                                  onChange={(event) =>
                                    setBillingAddress((current) => ({ ...current, city: event.target.value }))
                                  }
                                />
                              </div>

                              <div className={styles.formField}>
                                <label htmlFor="billing-zip">ZIP / Postal Code</label>
                                <input
                                  id="billing-zip"
                                  value={billingAddress.zip}
                                  onChange={(event) =>
                                    setBillingAddress((current) => ({ ...current, zip: event.target.value }))
                                  }
                                />
                              </div>
                            </div>
                          </>
                        ) : null}
                      </div>
                    </div>
                  ) : null}
                </article>

                <article className={`${styles.methodCard} ${paymentMethod === "bank" ? styles.methodCardActive : ""}`}>
                  <button type="button" className={styles.methodHeader} onClick={() => setPaymentMethod("bank")}>
                    <div className={styles.methodTitle}>
                      <span className={styles.radioCircle} />
                      <span>Bank transfer</span>
                    </div>
                    <span className={styles.methodIcon}>Bank</span>
                  </button>

                  {paymentMethod === "bank" ? (
                    <div className={styles.methodNote}>We will show a transfer reference and reserve the proposal once funds arrive.</div>
                  ) : null}
                </article>

                <article className={`${styles.methodCard} ${paymentMethod === "mobile" ? styles.methodCardActive : ""}`}>
                  <button type="button" className={styles.methodHeader} onClick={() => setPaymentMethod("mobile")}>
                    <div className={styles.methodTitle}>
                      <span className={styles.radioCircle} />
                      <span>Cameroon Mobile Money (MTN MoMo & Orange Money)</span>
                    </div>
                    <span className={styles.methodIcon} style={{ background: "#fef3c7", color: "#b45309", fontWeight: 700 }}>MoMo</span>
                  </button>

                  {paymentMethod === "mobile" ? (
                    <div className={styles.methodBody}>
                      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                        <button
                          type="button"
                          onClick={() => setMobileOperator("MTN")}
                          style={{
                            flex: 1,
                            padding: "12px 16px",
                            borderRadius: 10,
                            border: mobileOperator === "MTN" ? "2px solid #eab308" : "1px solid #e2e8f0",
                            background: mobileOperator === "MTN" ? "#fefce8" : "#ffffff",
                            fontWeight: 700,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 8,
                          }}
                        >
                          <span style={{ display: "inline-block", width: 12, height: 12, borderRadius: "50%", background: "#eab308" }} />
                          MTN Mobile Money
                        </button>
                        <button
                          type="button"
                          onClick={() => setMobileOperator("ORANGE")}
                          style={{
                            flex: 1,
                            padding: "12px 16px",
                            borderRadius: 10,
                            border: mobileOperator === "ORANGE" ? "2px solid #f97316" : "1px solid #e2e8f0",
                            background: mobileOperator === "ORANGE" ? "#fff7ed" : "#ffffff",
                            fontWeight: 700,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 8,
                          }}
                        >
                          <span style={{ display: "inline-block", width: 12, height: 12, borderRadius: "50%", background: "#f97316" }} />
                          Orange Money
                        </button>
                      </div>

                      <div className={styles.formField}>
                        <label htmlFor="momo-phone">Mobile Money Number (Cameroon)</label>
                        <div style={{ display: "flex", gap: 8 }}>
                          <span style={{ padding: "10px 14px", background: "#f1f5f9", borderRadius: 8, fontWeight: 600, border: "1px solid #cbd5e1" }}>+237</span>
                          <input
                            id="momo-phone"
                            type="tel"
                            placeholder="67X XX XX XX or 69X XX XX XX"
                            value={mobilePhone}
                            onChange={(event) => setMobilePhone(event.target.value)}
                            style={{ flex: 1 }}
                          />
                        </div>
                        <p style={{ fontSize: 12, color: "#64748b", marginTop: 6 }}>
                          A USSD push notification will be sent directly to this phone to enter your PIN.
                        </p>
                      </div>
                    </div>
                  ) : null}
                </article>
              </section>

              <section className={styles.faqSection}>
                <h2 className={styles.sectionTitle}>Frequently asked questions</h2>
                <div className={styles.faqList}>
                  <article className={styles.faqItem}>
                    <strong>When is my payment charged?</strong>
                    <p>Your payment method is charged immediately, but the funds stay locked in escrow until you approve the completed work.</p>
                  </article>
                  <article className={styles.faqItem}>
                    <strong>What if I cancel the task?</strong>
                    <p>You can cancel before work starts. Refund handling depends on timing and whether the professional already committed time or materials.</p>
                  </article>
                  <article className={styles.faqItem}>
                    <strong>What if there is a dispute?</strong>
                    <p>If the delivered work does not match the agreement, escrow stays locked while the case is reviewed.</p>
                  </article>
                </div>
              </section>
            </section>

            <aside className={styles.rightColumn}>
              <article className={styles.summaryCard}>
                <h2>Task summary</h2>

                <div className={styles.summaryBlock}>
                  <h3>{task.title}</h3>
                  <div className={styles.summaryMeta}>
                    <div><span>Location</span><strong>{task.city || task.location || "Not specified"}</strong></div>
                    <div><span>Schedule</span><strong>{task.logistics?.scheduleLabel || task.schedule || "Flexible"}</strong></div>
                    <div><span>Property</span><strong>{task.logistics?.propertyType || task.property_type || "Not specified"}</strong></div>
                  </div>

                  <div className={styles.proCard}>
                    <div className={styles.proAvatar}>
                      {(bid as any)?.technician_initials || (bid as any)?.initials || ((bid as any)?.technician_name || (bid as any)?.bidder || "P").slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <strong>{(bid as any)?.technician_name || (bid as any)?.bidder || "Assigned Specialist"}</strong>
                      <p>
                        Verified Specialist{((bid as any)?.technician_rating || (bid as any)?.rating) ? ` • ★ ${((bid as any)?.technician_rating || (bid as any)?.rating)}` : ""}
                      </p>
                    </div>
                  </div>
                </div>

                <div className={styles.breakdown}>
                  <div><span>Agreed price</span><strong>{formatXof(agreedPrice)}</strong></div>
                  <div><span>Platform fee (5%)</span><strong>{formatXof(platformFee)}</strong></div>
                  <div className={styles.totalRow}><span>Total to pay</span><strong>{formatXof(total)}</strong></div>
                </div>

                <button
                  type="button"
                  className={styles.depositButton}
                  disabled={depositing || momoPending || (paymentMethod === "mobile" && !mobilePhone.trim()) || (paymentMethod === "card" && !cardForm.number.trim())}
                  onClick={async () => {
                    setDepositing(true);
                    setDepositError(null);

                    if (paymentMethod === "mobile") {
                      try {
                        const cleanPhone = mobilePhone.replace(/[^0-9]/g, "");
                        const res = await api.campayCollect({
                          amount: total,
                          phone_number: cleanPhone.startsWith("237") ? cleanPhone : `237${cleanPhone}`,
                          task_id: task.id,
                          bid_id: Number(bidId),
                          purpose: "escrow_deposit",
                          description: `Escrow for ${task.title}`,
                        });
                        if (res?.success && res?.reference) {
                          setMomoReference(res.reference);
                          setMomoMessage(res.message || "Payment prompt sent. Please confirm on your mobile.");
                          setMomoPending(true);
                        } else {
                          setDepositError(res?.error?.detail || "Failed to initiate Mobile Money request.");
                        }
                      } catch (err: any) {
                        setDepositError(err?.message || "Mobile Money initiation failed.");
                      } finally {
                        setDepositing(false);
                      }
                      return;
                    }

                    try {
                      await api.depositEscrow({
                        task_id: task.id,
                        bid_id: Number(bidId),
                        amount: total,
                      });
                      setDepositSubmitted(true);
                    } catch (err: any) {
                      setDepositError(err?.message || "Deposit failed");
                    } finally {
                      setDepositing(false);
                    }
                  }}
                >
                  {depositing ? "Processing..." : paymentMethod === "mobile" ? "Pay with Mobile Money" : "Deposit and start task"}
                </button>

                {depositError ? <p className={styles.terms} style={{ color: "#dc2626", fontWeight: 600 }}>{depositError}</p> : null}

                <p className={styles.terms}>
                  By depositing, you agree to the escrow and service terms for this proposal.
                </p>
              </article>
            </aside>
          </div>
        )}

        {/* CamPay USSD Waiting Overlay Modal */}
        {momoPending ? (
          <div style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.75)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: 16
          }}>
            <div style={{
              background: "#ffffff",
              borderRadius: 16,
              padding: "32px 24px",
              maxWidth: 440,
              width: "100%",
              textAlign: "center",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
            }}>
              <div style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "#fef3c7",
                color: "#b45309",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 32,
                margin: "0 auto 16px"
              }}>
                📲
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>
                Approve Payment on Phone
              </h3>
              <p style={{ fontSize: 14, color: "#64748b", marginBottom: 16, lineHeight: 1.5 }}>
                A USSD prompt for <strong>{formatXof(total)}</strong> has been sent to <strong>+237 {mobilePhone}</strong>.
              </p>
              <div style={{
                padding: "12px 16px",
                borderRadius: 8,
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                fontSize: 13,
                color: "#334155",
                marginBottom: 24
              }}>
                ⏳ <strong>Waiting for your Mobile Money PIN...</strong>
                <p style={{ marginTop: 4, fontSize: 12, color: "#64748b" }}>
                  Please check your phone screen right now and enter your PIN to approve the escrow payment.
                </p>
              </div>

              <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                <button
                  type="button"
                  onClick={() => {
                    setMomoPending(false);
                    setMomoReference(null);
                  }}
                  style={{
                    padding: "10px 20px",
                    borderRadius: 8,
                    border: "1px solid #cbd5e1",
                    background: "#ffffff",
                    color: "#475569",
                    fontWeight: 600,
                    cursor: "pointer"
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}
