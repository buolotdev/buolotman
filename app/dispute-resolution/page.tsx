"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import styles from "./dispute-resolution.module.css";
import { api } from "@/app/lib/api";

export default function DisputeResolutionPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", details: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.submitContact(formData);
      setSuccess(true);
      setFormData({ name: "", email: "", phone: "", details: "" });
      setTimeout(() => {
        setShowModal(false);
        setSuccess(false);
      }, 3000);
    } catch (err) {
      alert("Failed to submit inquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const faqs = [
    {
      q: "Is Boulot Man a legal court?",
      a: "No. Boulot Man provides platform-level mediation and facilitation. Legal disputes may still be pursued independently if necessary."
    },
    {
      q: "How long does resolution take?",
      a: "Most disputes are resolved within 3–7 business days, depending on complexity and evidence availability."
    },
    {
      q: "Can funds be refunded?",
      a: "Yes. Escrow funds may be refunded, partially released, or reallocated based on the resolution outcome."
    },
    {
      q: "Does raising disputes affect ratings?",
      a: "Abuse of the dispute system may affect ratings or account standing. Legitimate disputes do not penalize users."
    }
  ];

  return (
    <div className={styles.pageWrapper}>
      <Header />

      <main className={styles.mainContent}>
        {/* HERO */}
        <div className={styles.hero}>
          <h1 className={styles.heroTitle}>Dispute Resolution</h1>
          <p className={styles.heroSubtitle}>
            Boulot Man provides a structured, fair, and transparent dispute resolution process
            to protect clients, technicians, freelancers, companies, and enterprise partners.
          </p>
        </div>

        {/* OVERVIEW */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>What Is Dispute Resolution?</h2>
          <p className={styles.sectionDesc}>
            Dispute Resolution is the process used when a disagreement arises between a client
            and a service provider regarding work quality, scope, payment, delays, or conduct.
            Boulot Man acts as a neutral facilitator to ensure fairness and accountability.
          </p>

          <div className={styles.grid3}>
            <div className={styles.card}>
              <h3>Who Can Raise a Dispute</h3>
              <ul>
                <li>Clients</li>
                <li>Technicians & Free Agents</li>
                <li>Companies</li>
                <li>Enterprise partners</li>
              </ul>
            </div>

            <div className={styles.card}>
              <h3>When to Raise a Dispute</h3>
              <ul>
                <li>Incomplete or poor-quality work</li>
                <li>Payment disagreements</li>
                <li>Missed deadlines</li>
                <li>Misrepresentation</li>
                <li>Professional misconduct</li>
              </ul>
            </div>

            <div className={styles.card}>
              <h3>What Is Protected</h3>
              <ul>
                <li>Escrow-held payments</li>
                <li>Job agreements</li>
                <li>Milestone approvals</li>
                <li>Platform integrity</li>
              </ul>
            </div>
          </div>
        </div>

        {/* HOW IT WORKS */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>How the Dispute Process Works</h2>
          <div className={styles.flow}>
            <div className={styles.flowStep}>
              <span className={styles.stepLabel}>STEP 1</span>
              <p>Dispute is raised via dashboard</p>
            </div>
            <div className={styles.flowStep}>
              <span className={styles.stepLabel}>STEP 2</span>
              <p>Automatic escrow hold (if applicable)</p>
            </div>
            <div className={styles.flowStep}>
              <span className={styles.stepLabel}>STEP 3</span>
              <p>Evidence submission by both parties</p>
            </div>
            <div className={styles.flowStep}>
              <span className={styles.stepLabel}>STEP 4</span>
              <p>Boulot Man review & mediation</p>
            </div>
            <div className={styles.flowStep}>
              <span className={styles.stepLabel}>STEP 5</span>
              <p>Resolution decision issued</p>
            </div>
            <div className={styles.flowStep}>
              <span className={styles.stepLabel}>STEP 6</span>
              <p>Payment release, refund, or correction</p>
            </div>
          </div>
        </div>

        {/* TYPES */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Types of Disputes</h2>
          <div className={styles.grid3}>
            <div className={styles.card}>
              <h3>Payment Disputes</h3>
              <ul>
                <li>Non-payment</li>
                <li>Partial payment disagreements</li>
                <li>Escrow release conflicts</li>
              </ul>
            </div>
            <div className={styles.card}>
              <h3>Service Quality Disputes</h3>
              <ul>
                <li>Work not meeting agreed standards</li>
                <li>Incomplete delivery</li>
                <li>Unauthorized changes</li>
              </ul>
            </div>
            <div className={styles.card}>
              <h3>Conduct & Compliance</h3>
              <ul>
                <li>Professional misconduct</li>
                <li>Safety violations</li>
                <li>Policy breaches</li>
              </ul>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Dispute Resolution FAQ</h2>
          <div className={styles.card}>
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className={styles.accordionItem} 
                onClick={() => toggleFaq(index)}
              >
                <div className={styles.accordionTitle}>
                  {faq.q}
                  <span>{activeFaq === index ? "−" : "+"}</span>
                </div>
                {activeFaq === index && (
                  <div className={styles.accordionContent}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className={styles.cta}>
          <div>
            <h2>Need Help Resolving an Issue?</h2>
            <p>
              If you have an active task, please raise a dispute from your dashboard. 
              For general inquiries, feel free to contact us.
            </p>
          </div>
          <div style={{ display: "flex", gap: "16px", alignItems: "center", justifyContent: "center" }}>
            <Link href="/login" style={{ width: '100%' }}>
              <button className={styles.ctaBtn} style={{ background: '#fff', color: '#001F3F' }}>
                Go to Dashboard
              </button>
            </Link>
            <button className={styles.ctaBtn} onClick={() => setShowModal(true)}>
              Contact Support
            </button>
          </div>
        </div>
      </main>

      <Footer />

      {/* Inquiry Modal */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setShowModal(false)}>×</button>
            <h2>Contact Support</h2>
            
            {success ? (
              <div className={styles.successMsg}>
                Your message has been received. Our support team will get back to you!
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <label>Full Name</label>
                  <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Your name" />
                </div>
                <div className={styles.formGroup}>
                  <label>Email</label>
                  <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="your@email.com" />
                </div>
                <div className={styles.formGroup}>
                  <label>Phone Number (Optional)</label>
                  <input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+123..." />
                </div>
                <div className={styles.formGroup}>
                  <label>How can we help?</label>
                  <textarea required value={formData.details} onChange={e => setFormData({...formData, details: e.target.value})} rows={4} placeholder="Describe your issue..." />
                </div>
                <button type="submit" className={styles.submitBtn} disabled={loading}>
                  {loading ? "Submitting..." : "Send Message"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
