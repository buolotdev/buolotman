"use client";

import React, { useState } from "react";
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import styles from "./page.module.css";

function Accordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={styles.accordionItem} onClick={() => setIsOpen(!isOpen)}>
      <div className={styles.accordionTitle}>
        {title} 
        <span style={{color: '#FF4500'}}>{isOpen ? "-" : "+"}</span>
      </div>
      {isOpen && <div className={styles.accordionContent}>{children}</div>}
    </div>
  );
}

export default function PaymentsAndEarningsPage() {
  return (
    <div style={{ background: "#f5f7fb", minHeight: "100vh" }}>
      <Header />

      <div className={styles.container}>
        
        {/* HERO */}
        <div className={styles.hero}>
          <h1 className={styles.heroTitle}>Payments & Earnings</h1>
          <p className={styles.heroSubtitle}>Understand how payments, escrow, earnings, and withdrawals work on Boulot Man.</p>
        </div>

        {/* OVERVIEW */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Overview</h2>
          <p className={styles.sectionDesc}>
            Boulot Man uses secure, transparent payment systems to protect both clients and service providers.
            Depending on the service type, payments may be held in escrow, released by milestones, or paid
            upon completion.
          </p>
        </div>

        {/* PAYMENT FLOW */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>How Payments Work</h2>
          <div className={styles.flow}>
            <div className={styles.flowStep}>
              <span className={styles.flowStepLabel}>STEP 1</span>
              <h4 className={styles.flowStepTitle}>Client Funds the Task</h4>
              <p className={styles.flowStepDesc}>
                The client deposits the agreed amount. Funds are held securely and are not released immediately.
              </p>
            </div>
            <div className={styles.flowStep}>
              <span className={styles.flowStepLabel}>STEP 2</span>
              <h4 className={styles.flowStepTitle}>Work Is Performed</h4>
              <p className={styles.flowStepDesc}>
                The technician or company completes the task or milestone according to the agreement.
              </p>
            </div>
            <div className={styles.flowStep}>
              <span className={styles.flowStepLabel}>STEP 3</span>
              <h4 className={styles.flowStepTitle}>Payment Is Released</h4>
              <p className={styles.flowStepDesc}>
                Once approved, funds are released to the service provider’s earnings wallet.
              </p>
            </div>
          </div>
        </div>

        {/* CLIENT PAYMENTS */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>For Clients</h2>
          <div className={styles.grid3}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Accepted Payment Methods</h3>
              <ul className={styles.cardList}>
                <li>Mobile Money</li>
                <li>Bank Transfer</li>
                <li>Debit / Credit Cards</li>
              </ul>
            </div>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Escrow Protection</h3>
              <p className={styles.cardDesc}>
                Your payment is protected until the service is delivered as agreed.
              </p>
              <Link href="/dispute-resolution" className={styles.cardLink}>Learn about dispute resolution</Link>
            </div>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Refunds</h3>
              <p className={styles.cardDesc}>
                If work is not delivered, refunds may be issued according to platform policy.
              </p>
              <Link href="/help-center" className={styles.cardLink}>View refund policy</Link>
            </div>
          </div>
        </div>

        {/* EARNINGS */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>For Technicians & Companies</h2>
          <div className={styles.grid3}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Earnings Wallet</h3>
              <p className={styles.cardDesc}>
                Completed payments are stored in your earnings wallet and visible in your dashboard.
              </p>
            </div>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Withdrawals</h3>
              <p className={styles.cardDesc}>
                Withdraw funds to your bank or mobile money account once available.
              </p>
              <Link href="/dashboard/technician/wallet" className={styles.cardLink}>Go to earnings dashboard</Link>
            </div>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Processing Time</h3>
              <p className={styles.cardDesc}>
                Withdrawals may take 1–5 business days depending on the method used.
              </p>
            </div>
          </div>
        </div>

        {/* FEES */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Platform Fees</h2>
          <p className={styles.sectionDesc}>
            Boulot Man charges service fees to maintain platform operations, security, and support.
          </p>
          <div className={styles.tableWrap}>
            <table className={styles.styledTable}>
              <thead>
                <tr>
                  <th>User Type</th>
                  <th>Fee Type</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Clients</td>
                  <td>Service Fee</td>
                  <td>May apply on task posting or payment</td>
                </tr>
                <tr>
                  <td>Technicians</td>
                  <td>Commission</td>
                  <td>Percentage deducted from earnings</td>
                </tr>
                <tr>
                  <td>Companies</td>
                  <td>Commission / Subscription</td>
                  <td>Based on agreement or plan</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
          <div className={styles.accordion}>
            <Accordion title="When do I get paid?">
              Payments are released after task completion and client approval.
            </Accordion>
            <Accordion title="What happens in case of a dispute?">
              Funds may be temporarily held while Boulot Man reviews the case.
            </Accordion>
          </div>
        </div>

        {/* CTA */}
        <div className={styles.cta}>
          <div>
            <h2 className={styles.ctaTitle}>Need help with payments?</h2>
            <p className={styles.ctaDesc}>
              If you have questions about payments, earnings, or withdrawals, contact our support team.
            </p>
          </div>
          <div className={styles.ctaAction}>
            <Link href="/help-center" className={styles.ctaBtn}>Contact Support</Link>
          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
}
