"use client";

import React, { useState } from "react";
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import { useToast } from "@/app/components/Toast";
import styles from "./page.module.css";

function CheckItem({ text, highlight = false }: { text: string; highlight?: boolean }) {
  return (
    <li style={{ color: highlight ? "#001f3f" : "#475569", fontWeight: highlight ? 700 : 400 }}>
      <div className={styles.checkIcon}>
        <iconify-icon icon="lucide:check-circle-2"></iconify-icon>
      </div>
      <span>{text}</span>
    </li>
  );
}

export default function UpgradePage() {
  const toast = useToast();
  const [isAnnual, setIsAnnual] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{ tier: string; name: string; price: number; cycle: string } | null>(null);
  const [upgrading, setUpgrading] = useState(false);
  const [depositAmount, setDepositAmount] = useState("50");
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositing, setDepositing] = useState(false);

  // Fetch current user & wallet
  const { data: user, refetch: refetchUser } = useFetch(() => api.getMe().catch(() => null), []);
  const { data: wallet, refetch: refetchWallet } = useFetch(() => api.getWallet().catch(() => null), []);

  const currentTier = user?.technician_profile?.is_verified ? "PRO" : "FREE";
  const walletBalance = Number(wallet?.available_balance || 0);

  const handleUpgradeClick = (tier: string, name: string, price: number) => {
    if (!user) {
      window.location.href = "/login?redirect=/upgrade";
      return;
    }
    setSelectedPlan({
      tier,
      name,
      price,
      cycle: isAnnual ? "yearly" : "monthly",
    });
  };

  const confirmUpgrade = async () => {
    if (!selectedPlan) return;
    setUpgrading(true);
    try {
      await api.upgradeSubscriptionPlan({
        tier: selectedPlan.tier,
        billing_cycle: selectedPlan.cycle,
        payment_source: walletBalance >= selectedPlan.price ? "wallet" : "direct",
      });
      toast.success("Upgrade Successful!", `Your account is now upgraded to ${selectedPlan.name}.`);
      setSelectedPlan(null);
      refetchUser();
      refetchWallet();
    } catch (err: any) {
      toast.error("Upgrade Failed", err?.message || "Could not complete plan upgrade.");
    } finally {
      setUpgrading(false);
    }
  };

  const handleDeposit = async () => {
    const num = Number(depositAmount);
    if (isNaN(num) || num <= 0) {
      toast.error("Invalid Amount", "Please enter a valid deposit amount.");
      return;
    }
    setDepositing(true);
    try {
      await api.depositFunds({ amount: num, payment_method: "Credit Card / Mobile Money" });
      toast.success("Deposit Successful", `$${num} has been added to your wallet balance.`);
      setShowDepositModal(false);
      refetchWallet();
    } catch (err: any) {
      toast.error("Deposit Failed", err?.message || "Could not add funds.");
    } finally {
      setDepositing(false);
    }
  };

  return (
    <div style={{ background: "#f5f7fb", minHeight: "100vh" }}>
      <Header />

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <iconify-icon icon="lucide:sparkles" /> Maximize Your Growth
          </div>
          <h1 className={styles.heroTitle}>Tier Pricing &amp; Subscriptions</h1>
          <p className={styles.heroSubtitle}>
            Choose the tier that matches your ambitions. Increase daily post limits, reply to unlimited tasks, 
            unlock instant payouts, and get priority exposure across Africa.
          </p>

          {/* Billing Toggle */}
          <div className={styles.billingToggle}>
            <span 
              className={`${styles.billingLabel} ${!isAnnual ? styles.billingLabelActive : ""}`}
              onClick={() => setIsAnnual(false)}
            >
              Monthly Billing
            </span>
            <button
              type="button"
              aria-label="Toggle annual billing"
              onClick={() => setIsAnnual(!isAnnual)}
              style={{
                width: 48,
                height: 26,
                borderRadius: 999,
                background: isAnnual ? "#ff4500" : "rgba(255,255,255,0.3)",
                border: "none",
                cursor: "pointer",
                position: "relative",
                transition: "all 0.2s ease",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: "#ffffff",
                  position: "absolute",
                  top: 3,
                  left: isAnnual ? 25 : 3,
                  transition: "all 0.2s ease",
                }}
              />
            </button>
            <span 
              className={`${styles.billingLabel} ${isAnnual ? styles.billingLabelActive : ""}`}
              onClick={() => setIsAnnual(true)}
            >
              Annual Billing <span className={styles.saveBadge}>Save 20%</span>
            </span>
          </div>
        </div>
      </section>

      <div className={styles.container}>
        {/* TIERS GRID */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Choose Your Professional Tier</h2>
            <p style={{ color: "#64748b", margin: "8px 0 0", fontSize: "1.05rem" }}>
              Upgrade or cancel anytime. All plans include secure escrow protection.
            </p>
          </div>

          <div className={styles.grid4}>
            {/* FREE TIER */}
            <div className={styles.card}>
              {currentTier === "FREE" && (
                <div className={styles.activeTag}>
                  <iconify-icon icon="lucide:check-circle" style={{ fontSize: "13px", color: "#22c55e" }}></iconify-icon>
                  Active Plan
                </div>
              )}
              <h3 className={styles.tierName}>Free Tier</h3>

              <p className={styles.price}>$0 <span>/ month</span></p>
              <p style={{ color: "#64748b", fontSize: "0.9rem", margin: "-10px 0 20px" }}>Standard entry access for starting professionals.</p>

              <ul className={styles.featureList}>
                <CheckItem text="5 Task Proposals / month" />
                <CheckItem text="1 Daily Task Post limit" />
                <CheckItem text="Standard search listing" />
                <CheckItem text="Basic direct messaging" />
                <CheckItem text="Standard escrow payouts (48h)" />
              </ul>

              <button
                disabled={currentTier === "FREE"}
                style={{
                  width: "100%",
                  padding: "16px",
                  borderRadius: "16px",
                  border: "none",
                  background: currentTier === "FREE" ? "#e2e8f0" : "#001f3f",
                  color: currentTier === "FREE" ? "#64748b" : "#fff",
                  fontWeight: 800,
                  fontSize: "1rem",
                  cursor: currentTier === "FREE" ? "default" : "pointer",
                }}
              >
                {currentTier === "FREE" ? "Current Plan" : "Downgrade to Free"}
              </button>
            </div>

            {/* BASIC */}
            <div className={styles.card}>
              <h3 className={styles.tierName}>Basic</h3>
              <p className={styles.price}>
                ${isAnnual ? 7 : 9} <span>/ month</span>
              </p>
              <p style={{ color: "#64748b", fontSize: "0.9rem", margin: "-10px 0 20px" }}>For active freelancers building their portfolio.</p>

              <ul className={styles.featureList}>
                <CheckItem text="20 Task Proposals / month" highlight />
                <CheckItem text="3 Daily Task Posts" highlight />
                <CheckItem text="Verified Starter Badge" />
                <CheckItem text="1.5x Search Exposure Boost" />
                <CheckItem text="Priority SMS / Push alerts" />
                <CheckItem text="Standard escrow protection" />
              </ul>

              <button
                className={`${styles.upgradeBtn} ${styles.upgradeBtnDark}`}
                onClick={() => handleUpgradeClick("BASIC", "Basic Plan", isAnnual ? 90 : 9)}
              >
                Upgrade to Basic
              </button>
            </div>

            {/* PRO - POPULAR */}
            <div className={`${styles.card} ${styles.cardPro}`}>
              <div className={styles.tag}>Most Popular</div>
              <h3 className={styles.tierName}>Pro</h3>
              <p className={styles.price}>
                ${isAnnual ? 15 : 19} <span>/ month</span>
              </p>
              <p style={{ color: "#64748b", fontSize: "0.9rem", margin: "-10px 0 20px" }}>For elite technicians demanding maximum work volume.</p>

              <ul className={styles.featureList}>
                <CheckItem text="Unlimited Task Proposals" highlight />
                <CheckItem text="10 Daily Task Posts" highlight />
                <CheckItem text="Top-Ranked Pro Badge" highlight />
                <CheckItem text="3x Higher Search Visibility" highlight />
                <CheckItem text="Fast-track identity vetting" />
                <CheckItem text="Reduced Platform Fee (5% off)" />
                <CheckItem text="Same-day Escrow Payouts" />
              </ul>

              <button
                className={`${styles.upgradeBtn} ${styles.upgradeBtnAccent}`}
                onClick={() => handleUpgradeClick("PRO", "Pro Plan", isAnnual ? 190 : 19)}
              >
                Upgrade to Pro
              </button>
            </div>

            {/* ENTERPRISE */}
            <div className={`${styles.card} ${styles.cardEnterprise}`}>
              <h3 className={styles.tierName}>Enterprise</h3>
              <p className={styles.price}>
                ${isAnnual ? 119 : 149} <span>/ month</span>
              </p>
              <p style={{ color: "#64748b", fontSize: "0.9rem", margin: "-10px 0 20px" }}>For contracting companies & multi-technician teams.</p>

              <ul className={styles.featureList}>
                <CheckItem text="Unlimited Task Proposals" highlight />
                <CheckItem text="Unlimited Daily Task Posts" highlight />
                <CheckItem text="Multi-seat Team Workspace" highlight />
                <CheckItem text="Top #1 Featured Directory placement" highlight />
                <CheckItem text="Dedicated Account Manager" />
                <CheckItem text="Custom invoicing & SLA" />
                <CheckItem text="Instant Escrow Payouts" />
              </ul>

              <button
                className={`${styles.upgradeBtn} ${styles.upgradeBtnDark}`}
                onClick={() => handleUpgradeClick("ENTERPRISE", "Enterprise Plan", isAnnual ? 1490 : 149)}
              >
                Get Enterprise
              </button>
            </div>
          </div>
        </section>

        {/* COMPARISON TABLE */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Full Feature Comparison</h2>
          </div>

          <div className={styles.compareWrap}>
            <table className={styles.compareTable}>
              <thead>
                <tr>
                  <th>Features & Capabilities</th>
                  <th>Free</th>
                  <th>Basic</th>
                  <th>Pro</th>
                  <th>Enterprise</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Monthly Task Proposals / Bids</td>
                  <td>5 / mo</td>
                  <td>20 / mo</td>
                  <td><strong>Unlimited</strong></td>
                  <td><strong>Unlimited</strong></td>
                </tr>
                <tr>
                  <td>Daily Task Posts</td>
                  <td>1 / day</td>
                  <td>3 / day</td>
                  <td>10 / day</td>
                  <td><strong>Unlimited</strong></td>
                </tr>
                <tr>
                  <td>Search Placement & Exposure</td>
                  <td>Standard</td>
                  <td>1.5x Boost</td>
                  <td><strong>3x High Ranking</strong></td>
                  <td><strong>Top #1 Featured</strong></td>
                </tr>
                <tr>
                  <td>Verified Trust Badge</td>
                  <td>No</td>
                  <td>Starter Badge</td>
                  <td><strong>Verified Pro Badge</strong></td>
                  <td><strong>Enterprise Gold Badge</strong></td>
                </tr>
                <tr>
                  <td>Escrow Payout Speed</td>
                  <td>48 Hours</td>
                  <td>24 Hours</td>
                  <td><strong>Same Day (6h)</strong></td>
                  <td><strong>Instant</strong></td>
                </tr>
                <tr>
                  <td>Platform Commission Discount</td>
                  <td>0%</td>
                  <td>2%</td>
                  <td><strong>5%</strong></td>
                  <td><strong>10%</strong></td>
                </tr>
                <tr>
                  <td>Team Member Seats</td>
                  <td>1</td>
                  <td>1</td>
                  <td>1</td>
                  <td><strong>Unlimited Seats</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* CTA */}
        <section className={styles.cta}>
          <div>
            <h2 className={styles.ctaTitle}>Ready to Unlock Higher Earnings?</h2>
            <p className={styles.ctaDesc}>
              Join over 2,500+ verified professionals growing their contracting and technical business on Boulot Man.
            </p>
          </div>
          <button
            className={styles.ctaBtn}
            onClick={() => handleUpgradeClick("PRO", "Pro Plan", isAnnual ? 190 : 19)}
          >
            Upgrade to Pro Now <iconify-icon icon="lucide:arrow-right" />
          </button>
        </section>
      </div>

      {/* UPGRADE CHECKOUT MODAL */}
      {selectedPlan && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0, 31, 63, 0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: 20 }}>
          <div style={{ background: "#ffffff", borderRadius: 24, maxWidth: 480, width: "100%", padding: 32, boxShadow: "0 25px 50px rgba(0,0,0,0.25)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: "1.4rem", color: "#001f3f" }}>Confirm Upgrade</h3>
              <button
                onClick={() => setSelectedPlan(null)}
                style={{ border: "none", background: "transparent", cursor: "pointer", fontSize: 24, color: "#64748b" }}
              >
                <iconify-icon icon="lucide:x" />
              </button>
            </div>

            <div style={{ background: "#f8fafc", padding: "16px 20px", borderRadius: 16, border: "1px solid #e2e8f0", marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontWeight: 700, color: "#001f3f", fontSize: "1.1rem" }}>{selectedPlan.name}</span>
                <span style={{ fontWeight: 900, color: "#ff4500", fontSize: "1.3rem" }}>${selectedPlan.price} USD</span>
              </div>
              <span style={{ fontSize: "0.85rem", color: "#64748b", textTransform: "capitalize" }}>
                Billed {selectedPlan.cycle} • Instant Activation
              </span>
            </div>

            {/* Payment Source */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 700, color: "#001f3f", marginBottom: 8 }}>
                Payment Method
              </label>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", borderRadius: 12, border: "2px solid #001f3f", background: "#f0fdf4" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <iconify-icon icon="lucide:wallet" style={{ fontSize: 24, color: "#16a34a" }} />
                  <div>
                    <strong style={{ display: "block", fontSize: "0.95rem", color: "#001f3f" }}>Wallet Balance</strong>
                    <small style={{ color: "#64748b" }}>Available: ${walletBalance.toFixed(2)} USD</small>
                  </div>
                </div>
                {walletBalance < selectedPlan.price && (
                  <button
                    onClick={() => setShowDepositModal(true)}
                    style={{ background: "#001f3f", color: "#fff", border: "none", borderRadius: 8, padding: "6px 12px", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer" }}
                  >
                    + Add Funds
                  </button>
                )}
              </div>
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={() => setSelectedPlan(null)}
                style={{ flex: 1, padding: 14, borderRadius: 12, border: "1px solid #cbd5e1", background: "#fff", color: "#64748b", fontWeight: 700, cursor: "pointer" }}
              >
                Cancel
              </button>
              <button
                onClick={confirmUpgrade}
                disabled={upgrading}
                style={{ flex: 2, padding: 14, borderRadius: 12, border: "none", background: "#ff4500", color: "#fff", fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
              >
                {upgrading ? "Activating..." : `Pay $${selectedPlan.price} & Upgrade`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOP-UP / DEPOSIT MODAL */}
      {showDepositModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0, 31, 63, 0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10000, padding: 20 }}>
          <div style={{ background: "#ffffff", borderRadius: 24, maxWidth: 440, width: "100%", padding: 32 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: "1.3rem", color: "#001f3f" }}>Add Funds to Wallet</h3>
              <button onClick={() => setShowDepositModal(false)} style={{ border: "none", background: "transparent", cursor: "pointer", fontSize: 24 }}>
                <iconify-icon icon="lucide:x" />
              </button>
            </div>

            <p style={{ color: "#64748b", fontSize: "0.9rem", marginBottom: 20 }}>
              Top up your wallet via Mobile Money (Orange, MTN, Wave) or Credit Card.
            </p>

            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#001f3f", marginBottom: 6 }}>
              Deposit Amount (USD)
            </label>
            <input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid #cbd5e1", fontSize: "1.2rem", fontWeight: 800, outline: "none", marginBottom: 24 }}
            />

            <button
              onClick={handleDeposit}
              disabled={depositing}
              style={{ width: "100%", padding: 14, borderRadius: 12, border: "none", background: "#16a34a", color: "#fff", fontWeight: 800, fontSize: "1rem", cursor: "pointer" }}
            >
              {depositing ? "Processing..." : `Deposit $${depositAmount} Now`}
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
