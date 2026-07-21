"use client";

import React, { useState } from "react";
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import styles from "./page.module.css";

function Accordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={`${styles.accordionItem} ${isOpen ? styles.accordionItemActive : ""}`} onClick={() => setIsOpen(!isOpen)}>
      <div className={styles.accordionTitle}>
        {title} 
        <div className={styles.accordionIcon}>
          <iconify-icon icon="lucide:chevron-down"></iconify-icon>
        </div>
      </div>
      {isOpen && <div className={styles.accordionContent}>{children}</div>}
    </div>
  );
}

export default function PaymentsAndEarningsPage() {
  return (
    <div style={{ background: "#f5f7fb", minHeight: "100vh" }}>
      <Header />

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Payments & Earnings</h1>
          <p className={styles.heroSubtitle}>
            Understand how payments, escrow, earnings, and withdrawals work securely on the Boulot Man platform.
          </p>
        </div>
      </section>

      <div className={styles.container}>
        
        {/* OVERVIEW */}
        <section className={styles.section} style={{marginTop: '60px'}}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Overview</h2>
            <p className={styles.sectionDesc}>
              Boulot Man uses secure, transparent payment systems to protect both clients and service providers.
              Depending on the service type, payments may be held in escrow, released by milestones, or paid
              upon full completion.
            </p>
          </div>
        </section>

        {/* PAYMENT FLOW */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>How Payments Work</h2>
            <p className={styles.sectionDesc}>A simple, secure three-step process to ensure everyone is protected.</p>
          </div>
          
          <div className={styles.flow}>
            <div className={styles.flowStep}>
              <div className={styles.flowIconWrap}>
                <iconify-icon icon="lucide:wallet"></iconify-icon>
              </div>
              <span className={styles.flowStepLabel}>STEP 1</span>
              <h4 className={styles.flowStepTitle}>Client Funds the Task</h4>
              <p className={styles.flowStepDesc}>
                The client deposits the agreed amount. Funds are held securely in Escrow and are not released immediately.
              </p>
            </div>
            
            <div className={styles.flowStep}>
              <div className={styles.flowIconWrap}>
                <iconify-icon icon="lucide:hammer"></iconify-icon>
              </div>
              <span className={styles.flowStepLabel}>STEP 2</span>
              <h4 className={styles.flowStepTitle}>Work Is Performed</h4>
              <p className={styles.flowStepDesc}>
                The technician or company completes the task or milestone according to the mutually agreed timeline.
              </p>
            </div>
            
            <div className={styles.flowStep}>
              <div className={styles.flowIconWrap}>
                <iconify-icon icon="lucide:check-circle-2"></iconify-icon>
              </div>
              <span className={styles.flowStepLabel}>STEP 3</span>
              <h4 className={styles.flowStepTitle}>Payment Is Released</h4>
              <p className={styles.flowStepDesc}>
                Once the client approves the work, funds are instantly released to the service provider’s earnings wallet.
              </p>
            </div>
          </div>
        </section>

        {/* CLIENT PAYMENTS */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>For Clients</h2>
            <p className={styles.sectionDesc}>Everything you need to know about making secure payments.</p>
          </div>
          
          <div className={styles.grid3}>
            <div className={styles.card}>
              <div className={styles.cardIcon}>
                <iconify-icon icon="lucide:credit-card"></iconify-icon>
              </div>
              <h3 className={styles.cardTitle}>Accepted Payment Methods</h3>
              <ul className={styles.cardList}>
                <li>Mobile Money (M-Pesa, MTN, Airtel)</li>
                <li>Direct Bank Transfers</li>
                <li>Debit / Credit Cards (Visa, Mastercard)</li>
              </ul>
            </div>
            
            <div className={styles.card}>
              <div className={styles.cardIcon}>
                <iconify-icon icon="lucide:shield-check"></iconify-icon>
              </div>
              <h3 className={styles.cardTitle}>Escrow Protection</h3>
              <p className={styles.cardDesc}>
                Your payment is protected until the service is delivered as agreed. Providers cannot access funds until you approve the work.
              </p>
              <Link href="/dispute-resolution" className={styles.cardLink}>
                Learn about dispute resolution <iconify-icon icon="lucide:arrow-right"></iconify-icon>
              </Link>
            </div>
            
            <div className={styles.card}>
              <div className={styles.cardIcon}>
                <iconify-icon icon="lucide:refresh-ccw"></iconify-icon>
              </div>
              <h3 className={styles.cardTitle}>Refunds</h3>
              <p className={styles.cardDesc}>
                If work is not delivered or fails to meet requirements, immediate refunds may be issued according to our policy.
              </p>
              <Link href="/help-center" className={styles.cardLink}>
                View refund policy <iconify-icon icon="lucide:arrow-right"></iconify-icon>
              </Link>
            </div>
          </div>
        </section>

        {/* EARNINGS */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>For Service Providers</h2>
            <p className={styles.sectionDesc}>Managing your earnings and getting paid on time.</p>
          </div>
          
          <div className={styles.grid3}>
            <div className={styles.card}>
              <div className={styles.cardIcon}>
                <iconify-icon icon="lucide:piggy-bank"></iconify-icon>
              </div>
              <h3 className={styles.cardTitle}>Earnings Wallet</h3>
              <p className={styles.cardDesc}>
                Completed task payments are stored instantly in your earnings wallet, visible securely on your provider dashboard.
              </p>
            </div>
            
            <div className={styles.card}>
              <div className={styles.cardIcon}>
                <iconify-icon icon="lucide:banknote"></iconify-icon>
              </div>
              <h3 className={styles.cardTitle}>Withdrawals</h3>
              <p className={styles.cardDesc}>
                Withdraw funds to your local bank or mobile money account as soon as they become available.
              </p>
              <Link href="/dashboard/technician/wallet" className={styles.cardLink}>
                Go to earnings dashboard <iconify-icon icon="lucide:arrow-right"></iconify-icon>
              </Link>
            </div>
            
            <div className={styles.card}>
              <div className={styles.cardIcon}>
                <iconify-icon icon="lucide:clock"></iconify-icon>
              </div>
              <h3 className={styles.cardTitle}>Processing Time</h3>
              <p className={styles.cardDesc}>
                Mobile money withdrawals are near-instant. Bank transfers may take 1–3 business days depending on the financial institution.
              </p>
            </div>
          </div>
        </section>

        {/* FEES */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Platform Fees</h2>
            <p className={styles.sectionDesc}>
              Boulot Man charges nominal service fees to maintain platform operations, security, escrow, and 24/7 support.
            </p>
          </div>
          
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
                  <td>A small transaction fee may apply during checkout to cover processing costs.</td>
                </tr>
                <tr>
                  <td>Technicians</td>
                  <td>Platform Commission</td>
                  <td>A standard percentage is automatically deducted from total earnings upon task completion.</td>
                </tr>
                <tr>
                  <td>Companies (Enterprise)</td>
                  <td>Subscription / Commission</td>
                  <td>Custom fee structures based on monthly subscription plans and volume agreements.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
          </div>
          
          <div className={styles.accordion}>
            <Accordion title="When do I get paid after completing a task?">
              Once you mark a task as complete, the client will review your work. Upon their approval, the funds held in Escrow are instantly released into your Boulot Man Earnings Wallet.
            </Accordion>
            <Accordion title="What happens in case of a dispute?">
              If a client is unsatisfied, they can open a dispute. The funds will remain locked in Escrow while our dedicated resolution team reviews the evidence (messages, photos, and task requirements) to make a fair decision.
            </Accordion>
            <Accordion title="Are there any hidden withdrawal fees?">
              Boulot Man does not charge hidden fees. However, standard withdrawal charges levied by your mobile network operator or bank will apply based on the withdrawal method you choose.
            </Accordion>
          </div>
        </section>

        {/* CTA */}
        <section className={styles.cta}>
          <div>
            <h2 className={styles.ctaTitle}>Need more help with payments?</h2>
            <p className={styles.ctaDesc}>
              If you have specific questions about transactions, missing earnings, or withdrawal issues, our financial support team is available 24/7.
            </p>
          </div>
          <div className={styles.ctaAction}>
            <Link href="/help-center" className={styles.ctaBtn}>
              Contact Support
              <iconify-icon icon="lucide:arrow-right" style={{fontSize: '18px'}}></iconify-icon>
            </Link>
          </div>
        </section>

      </div>

      <Footer />
    </div>
  );
}
