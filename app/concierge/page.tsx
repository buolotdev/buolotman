"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import styles from "./concierge.module.css";
import { api } from "@/app/lib/api";

export default function ConciergePage() {
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
      await api.submitInquiry({ ...formData, inquiry_type: "concierge" });
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
      q: "How is Concierge different from regular services?",
      a: "Concierge means Boulot Man manages everything for you. Regular services require you to select and coordinate technicians yourself."
    },
    {
      q: "Is there a subscription fee?",
      a: "Yes. Packages include Basic, Standard, Premium, and Corporate plans. Pricing depends on usage level and response priority."
    },
    {
      q: "Can diaspora clients use Concierge?",
      a: "Absolutely. Clients receive photos, reports, and updates remotely."
    },
    {
      q: "How fast is response time?",
      a: "Emergencies: within 1 hour. Regular requests: same day."
    }
  ];

  return (
    <div className={styles.pageWrapper}>
      <Header />

      <main className={styles.mainContent}>
        {/* HERO */}
        <div className={styles.hero}>
          <h1 className={styles.heroTitle}>Boulot Man Concierge Services</h1>
          <p className={styles.heroSubtitle}>
            A premium, fully managed technical service designed for individuals, families,
            companies, and diaspora clients who want all their technical needs handled
            professionally — without stress.
          </p>
        </div>

        {/* OVERVIEW */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>What Is Boulot Man Concierge?</h2>
          <p className={styles.sectionDesc}>
            Boulot Man Concierge is a <strong>VIP, hands-off service</strong> where Boulot Man manages
            everything for you — from technician selection to supervision, reporting,
            follow-up, and quality control.
          </p>

          <div className={styles.grid3}>
            <div className={styles.card}>
              <h3>Who It's For</h3>
              <ul>
                <li>Busy professionals</li>
                <li>Families & homeowners</li>
                <li>Property managers & landlords</li>
                <li>Companies & offices</li>
                <li>Embassies, NGOs & institutions</li>
                <li>Diaspora managing property remotely</li>
              </ul>
            </div>

            <div className={styles.card}>
              <h3>Why Concierge?</h3>
              <ul>
                <li>No searching for technicians</li>
                <li>No coordination stress</li>
                <li>Priority response</li>
                <li>Supervised work</li>
                <li>Quality guarantee</li>
              </ul>
            </div>

            <div className={styles.card}>
              <h3>Service Coverage</h3>
              <ul>
                <li>Homes & apartments</li>
                <li>Offices & commercial spaces</li>
                <li>Facilities & compounds</li>
                <li>Remote & diaspora properties</li>
              </ul>
            </div>
          </div>
        </div>

        {/* HOW IT WORKS */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>How Concierge Works</h2>
          <div className={styles.flow}>
            <div className={styles.flowStep}>
              <span className={styles.stepLabel}>STEP 1</span>
              <p>Client requests support via phone, WhatsApp, or website</p>
            </div>
            <div className={styles.flowStep}>
              <span className={styles.stepLabel}>STEP 2</span>
              <p>Needs assessment (issue, urgency, location, schedule)</p>
            </div>
            <div className={styles.flowStep}>
              <span className={styles.stepLabel}>STEP 3</span>
              <p>Verified technician is assigned</p>
            </div>
            <div className={styles.flowStep}>
              <span className={styles.stepLabel}>STEP 4</span>
              <p>Service is supervised by a concierge coordinator</p>
            </div>
            <div className={styles.flowStep}>
              <span className={styles.stepLabel}>STEP 5</span>
              <p>Completion report, photos & feedback</p>
            </div>
            <div className={styles.flowStep}>
              <span className={styles.stepLabel}>STEP 6</span>
              <p>Payment & after-service follow-up</p>
            </div>
          </div>
        </div>

        {/* SERVICES COVERED */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Services Covered</h2>
          <div className={styles.grid3}>
            <div className={styles.card}>
              <h3>Home & Office</h3>
              <ul>
                <li>Electrical repairs & installations</li>
                <li>Plumbing & sewage</li>
                <li>AC & refrigeration</li>
                <li>Carpentry & furniture repair</li>
                <li>Painting & renovations</li>
              </ul>
            </div>
            <div className={styles.card}>
              <h3>Security & Energy</h3>
              <ul>
                <li>CCTV & access control</li>
                <li>Solar systems</li>
                <li>Generators & backup power</li>
                <li>Smart home systems</li>
              </ul>
            </div>
            <div className={styles.card}>
              <h3>Special Services</h3>
              <ul>
                <li>Appliance repairs</li>
                <li>Mobile mechanics</li>
                <li>IT & networking</li>
                <li>Moving & handyman tasks</li>
              </ul>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Concierge FAQ</h2>
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
            <h2>Let Us Handle Everything</h2>
            <p>
              Stop managing technicians. Focus on your life or business while
              Boulot Man Concierge takes care of the rest.
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <button className={styles.ctaBtn} onClick={() => setShowModal(true)}>
              Request Concierge Service
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
            <h2>Request VIP Concierge</h2>
            
            {success ? (
              <div className={styles.successMsg}>
                Your request has been received. Our Concierge team will contact you shortly!
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
                  <label>Phone Number</label>
                  <input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+123..." />
                </div>
                <div className={styles.formGroup}>
                  <label>How can we help?</label>
                  <textarea required value={formData.details} onChange={e => setFormData({...formData, details: e.target.value})} rows={4} placeholder="Describe your needs..." />
                </div>
                <button type="submit" className={styles.submitBtn} disabled={loading}>
                  {loading ? "Submitting..." : "Send Request"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
