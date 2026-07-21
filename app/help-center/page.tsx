"use client";

import React, { useState } from "react";
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import styles from "./page.module.css";

function Accordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={`${styles.accordionItem} ${isOpen ? styles.accordionItemActive : ""}`}>
      <div className={styles.accordionTitle} onClick={() => setIsOpen(!isOpen)}>
        {title} 
        <div className={styles.accordionIcon}>
          <iconify-icon icon="lucide:chevron-down"></iconify-icon>
        </div>
      </div>
      {isOpen && <div className={styles.accordionContent}>{children}</div>}
    </div>
  );
}

export default function HelpCenterPage() {
  return (
    <div style={{ background: "#f5f7fb", minHeight: "100vh" }}>
      <Header />

      {/* HERO SECTION */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>How can we help you today?</h1>
          <p className={styles.heroSubtitle}>
            Search our knowledge base or browse categories below to find exactly what you need.
          </p>
          <div className={styles.searchWrapper}>
            <iconify-icon icon="lucide:search" className={styles.searchIcon}></iconify-icon>
            <input 
              type="text" 
              className={styles.searchInput} 
              placeholder="Search for articles, guides, or FAQs..." 
            />
            <button className={styles.searchBtn}>Search</button>
          </div>
        </div>
      </section>

      <div className={styles.container}>
        {/* CATEGORY GRID */}
        <div className={styles.categoriesGrid}>
          <Link href="#getting-started" style={{textDecoration: 'none'}}>
            <div className={styles.categoryCard}>
              <div className={styles.categoryIcon}>
                <iconify-icon icon="lucide:rocket"></iconify-icon>
              </div>
              <h3 className={styles.categoryTitle}>Getting Started</h3>
              <p className={styles.categoryDesc}>
                Everything you need to know about setting up your account and posting your first task.
              </p>
            </div>
          </Link>

          <Link href="#technicians" style={{textDecoration: 'none'}}>
            <div className={styles.categoryCard}>
              <div className={styles.categoryIcon}>
                <iconify-icon icon="lucide:users"></iconify-icon>
              </div>
              <h3 className={styles.categoryTitle}>For Technicians</h3>
              <p className={styles.categoryDesc}>
                Learn how to get verified, bid on jobs, and grow your freelance career on Boulot Man.
              </p>
            </div>
          </Link>

          <Link href="#payments" style={{textDecoration: 'none'}}>
            <div className={styles.categoryCard}>
              <div className={styles.categoryIcon}>
                <iconify-icon icon="lucide:credit-card"></iconify-icon>
              </div>
              <h3 className={styles.categoryTitle}>Payments & Escrow</h3>
              <p className={styles.categoryDesc}>
                Understand BPay Wallet, secure escrow services, and how you get paid.
              </p>
            </div>
          </Link>
        </div>

        {/* FAQ SECTIONS */}
        <div id="getting-started" className={styles.faqSection}>
          <div className={styles.faqHeader}>
            <h2>Getting Started</h2>
            <p>The basics of navigating and utilizing the Boulot Man platform for clients and individuals.</p>
          </div>
          <div className={styles.faqList}>
            <Accordion title="What is Boulot Man?">
              Boulot Man is a digital platform that connects{" "}
              <strong>verified technicians, engineers, companies, and service teams</strong>{" "}
              with individuals, businesses, and organizations that need reliable technical services.
              <br /><br />
              <strong>Mission:</strong> Home for Technicians and Engineers in Africa.
            </Accordion>
            <Accordion title="How does Boulot Man work for Clients?">
              <ol>
                <li>Visit <Link href="/search" className={styles.link}>Browse Services</Link></li>
                <li>Select a technician, company, or team</li>
                <li>Book or <Link href="/post-task" className={styles.link}>Post a Task</Link></li>
                <li>Pay securely via BPay Wallet</li>
                <li>Approve work and leave a review</li>
              </ol>
            </Accordion>
          </div>
        </div>

        <div id="technicians" className={styles.faqSection}>
          <div className={styles.faqHeader}>
            <h2>For Technicians</h2>
            <p>Guidelines for professionals, from registration and verification to climbing the premium tiers.</p>
          </div>
          <div className={styles.faqList}>
            <Accordion title="How does Boulot Man work for Technicians?">
              <ol>
                <li>Register as a technician or free agent</li>
                <li>Complete verification (ID, skills, experience)</li>
                <li>Publish services or receive task requests</li>
                <li>Complete jobs professionally</li>
                <li>Get paid via BPay</li>
              </ol>
            </Accordion>
            <Accordion title="What are the Premium Tiers?">
              <ul>
                <li><strong>Basic</strong> – Get verified & visible</li>
                <li><strong>Advance</strong> – Priority jobs & higher earnings</li>
                <li><strong>Pro</strong> – Elite access, cross-border work</li>
                <li><strong>Enterprise</strong> – Large institutions & governments</li>
              </ul>
            </Accordion>
          </div>
        </div>

        <div id="payments" className={styles.faqSection}>
          <div className={styles.faqHeader}>
            <h2>Payments & Escrow</h2>
            <p>Secure transactions, wallet management, and dispute resolutions.</p>
          </div>
          <div className={styles.faqList}>
            <Accordion title="What is BPay Wallet?">
              BPay is Boulot Man’s secure digital wallet used for:
              <ul>
                <li>Paying for services</li>
                <li>Receiving earnings</li>
                <li>Escrow protection</li>
                <li>Withdrawals & transaction tracking</li>
              </ul>
            </Accordion>
            <Accordion title="What is Escrow and how does it work?">
              Funds are held securely until work is completed and approved. This
              protects both clients and service providers, ensuring that payment is only released when milestones are met.
            </Accordion>
          </div>
        </div>

        {/* CONTACT BANNER */}
        <div className={styles.contactBanner}>
          <h2 className={styles.contactTitle}>Still need help?</h2>
          <p className={styles.contactDesc}>
            Can&apos;t find the answer you&apos;re looking for? Our dedicated support team is here to assist you with any questions or concerns.
          </p>
          <Link href="/contact" className={styles.contactBtn}>Contact Support</Link>
        </div>

      </div>

      <Footer />
    </div>
  );
}
