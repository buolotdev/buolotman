"use client";

import React from "react";
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import styles from "./page.module.css";

function CheckItem({ text }: { text: string }) {
  return (
    <li>
      <div className={styles.checkIcon}>
        <iconify-icon icon="lucide:check-circle-2"></iconify-icon>
      </div>
      <span>{text}</span>
    </li>
  );
}

export default function UpgradePage() {
  return (
    <div style={{ background: "#f5f7fb", minHeight: "100vh" }}>
      <Header />

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Tier Pricing & Upgrades</h1>
          <p className={styles.heroSubtitle}>
            Boulot Man offers a structured tier system that rewards skill, trust, and professionalism. 
            As you grow, your access, visibility, and earning power exponentially increase.
          </p>
        </div>
      </section>

      <div className={styles.container}>
        
        {/* TIERS */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Choose Your Growth Level</h2>
          </div>
          
          <div className={styles.grid4}>
            
            {/* BASIC */}
            <div className={styles.card}>
              <h3 className={styles.tierName}>Basic</h3>
              <p className={styles.price}>$ — <span>Entry tier</span></p>
              
              <ul className={styles.featureList}>
                <CheckItem text="Verified profile badge (basic)" />
                <CheckItem text="Increased visibility over free users" />
                <CheckItem text="Access to standard job listings" />
                <CheckItem text="Limited job applications per month" />
                <CheckItem text="Portfolio upload" />
                <CheckItem text="In-app messaging" />
              </ul>
              
              <button className={`${styles.upgradeBtn} ${styles.upgradeBtnAccent}`}>Upgrade to Basic</button>
            </div>

            {/* ADVANCE */}
            <div className={styles.card}>
              <h3 className={styles.tierName}>Advance</h3>
              <p className={styles.price}>$ — <span>Growth tier</span></p>
              
              <ul className={styles.featureList}>
                <CheckItem text="Everything in Basic" />
                <CheckItem text="Priority search placement" />
                <CheckItem text="Unlimited job applications" />
                <CheckItem text="Advanced skill verification" />
                <CheckItem text="Smart job alerts" />
                <CheckItem text="Earnings analytics dashboard" />
              </ul>
              
              <button className={`${styles.upgradeBtn} ${styles.upgradeBtnAccent}`}>Upgrade to Advance</button>
            </div>

            {/* PRO */}
            <div className={`${styles.card} ${styles.cardPro}`}>
              <div className={styles.tag}>Most Popular</div>
              <h3 className={styles.tierName}>Pro</h3>
              <p className={styles.price}>$ — <span>Elite professionals</span></p>
              
              <ul className={styles.featureList}>
                <CheckItem text="Everything in Advance" />
                <CheckItem text="Top-ranked Pro badge" />
                <CheckItem text="Guaranteed visibility" />
                <CheckItem text="Exclusive high-value contracts" />
                <CheckItem text="Priority escrow payouts" />
                <CheckItem text="Personal brand page" />
                <CheckItem text="Certification fast-track" />
                <CheckItem text="Business tools (invoice, reports)" />
              </ul>
              
              <button className={`${styles.upgradeBtn} ${styles.upgradeBtnAccent}`}>Upgrade to Pro</button>
            </div>

            {/* ENTERPRISE */}
            <div className={`${styles.card} ${styles.cardEnterprise}`}>
              <h3 className={styles.tierName}>Enterprise</h3>
              <p className={styles.price}>Custom <span>Approval only</span></p>
              
              <ul className={styles.featureList}>
                <CheckItem text="Everything in Pro" />
                <CheckItem text="Bulk workforce deployment" />
                <CheckItem text="Dedicated success manager" />
                <CheckItem text="Custom contracts & SLAs" />
                <CheckItem text="Enterprise escrow & invoicing" />
                <CheckItem text="API & system integrations" />
                <CheckItem text="Cross-border workforce access" />
              </ul>
              
              <button className={`${styles.upgradeBtn} ${styles.upgradeBtnAccent}`}>Request Access</button>
            </div>

          </div>
        </section>

        {/* COMPARISON */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Tier Comparison</h2>
          </div>
          
          <div className={styles.compareWrap}>
            <table className={styles.compareTable}>
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Basic</th>
                  <th>Advance</th>
                  <th>Pro</th>
                  <th>Enterprise</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Verification Level</td>
                  <td>Basic</td>
                  <td>Advanced</td>
                  <td>Professional</td>
                  <td>Institutional</td>
                </tr>
                <tr>
                  <td>Job Access</td>
                  <td>Standard</td>
                  <td>Unlimited</td>
                  <td>Premium</td>
                  <td>Custom</td>
                </tr>
                <tr>
                  <td>Escrow Protection</td>
                  <td>Limited</td>
                  <td>Standard</td>
                  <td>Priority</td>
                  <td>Enterprise</td>
                </tr>
                <tr>
                  <td>Analytics & Reports</td>
                  <td>—</td>
                  <td><iconify-icon icon="lucide:check" style={{color: '#10b981', fontSize: '24px'}}></iconify-icon></td>
                  <td><iconify-icon icon="lucide:check" style={{color: '#10b981', fontSize: '24px'}}></iconify-icon></td>
                  <td><iconify-icon icon="lucide:check" style={{color: '#10b981', fontSize: '24px'}}></iconify-icon></td>
                </tr>
                <tr>
                  <td>Enterprise Contracts</td>
                  <td>—</td>
                  <td>—</td>
                  <td><iconify-icon icon="lucide:check" style={{color: '#10b981', fontSize: '24px'}}></iconify-icon></td>
                  <td><iconify-icon icon="lucide:check" style={{color: '#10b981', fontSize: '24px'}}></iconify-icon></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* CTA */}
        <section className={styles.cta}>
          <div>
            <h2 className={styles.ctaTitle}>Grow Your Earnings with the Right Tier</h2>
            <p className={styles.ctaDesc}>
              Upgrade when you’re ready. Each tier is specifically designed to unlock real earning power — not just features. Take your professional career to the next level today.
            </p>
          </div>
          <div>
            <button className={styles.ctaBtn}>
              Upgrade Now
              <iconify-icon icon="lucide:arrow-up-right" style={{fontSize: '22px'}}></iconify-icon>
            </button>
          </div>
        </section>

      </div>

      <Footer />
    </div>
  );
}
