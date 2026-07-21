"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import styles from "./contractors.module.css";
import { api } from "@/app/lib/api";

export default function ContractorsPage() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", company_name: "", details: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.submitInquiry({ ...formData, inquiry_type: "enterprise" });
      setSuccess(true);
      setFormData({ name: "", email: "", phone: "", company_name: "", details: "" });
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

  return (
    <div className={styles.pageWrapper}>
      <Header />

      <main className={styles.mainContent}>
        {/* HERO */}
        <div className={styles.hero}>
          <h1 className={styles.heroTitle}>Contractors & Enterprise Solutions</h1>
          <p className={styles.heroSubtitle}>
            Boulot Man Contractors is the enterprise-grade execution arm of the Boulot Man platform.
            We deliver medium to large-scale technical, engineering, and construction projects
            through verified professionals, structured teams, and strict project governance.
          </p>
        </div>

        {/* OVERVIEW */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>What Is Boulot Man Contractors?</h2>
          <p className={styles.sectionDesc}>
            Boulot Man Contractors provides <strong>end-to-end project execution</strong> for organizations
            that require reliability, compliance, and accountability.
            This service is designed for enterprises, governments, NGOs, developers,
            and institutions that cannot rely on informal labor or unmanaged teams.
          </p>

          <div className={styles.grid3}>
            <div className={styles.card}>
              <span className={styles.badge}>Who We Serve</span>
              <ul>
                <li>Large contractors & engineering firms</li>
                <li>Infrastructure & construction companies</li>
                <li>Government agencies & public institutions</li>
                <li>NGOs & international organizations</li>
                <li>Hotels, factories & warehouses</li>
                <li>Diaspora-led development projects</li>
              </ul>
            </div>

            <div className={styles.card}>
              <span className={styles.badge}>What We Deliver</span>
              <ul>
                <li>Full project execution</li>
                <li>Certified technical workforce</li>
                <li>Engineering supervision</li>
                <li>Compliance & documentation</li>
                <li>Quality assurance</li>
              </ul>
            </div>

            <div className={styles.card}>
              <span className={styles.badge}>Why Enterprises Choose Us</span>
              <ul>
                <li>Verified professionals only</li>
                <li>Structured governance</li>
                <li>Escrow & milestone payments</li>
                <li>Clear accountability</li>
                <li>Cross-border readiness</li>
              </ul>
            </div>
          </div>
        </div>

        {/* SERVICES */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Contracting Services</h2>
          <div className={styles.grid3}>
            <div className={styles.card}>
              <h3>Construction & Civil Works</h3>
              <ul>
                <li>Residential & commercial construction</li>
                <li>Renovation & remodeling</li>
                <li>Finishing & interior works</li>
                <li>Structural & masonry works</li>
              </ul>
            </div>
            <div className={styles.card}>
              <h3>Electrical, Mechanical & Energy</h3>
              <ul>
                <li>Industrial & residential wiring</li>
                <li>HVAC & mechanical installations</li>
                <li>Solar & hybrid power systems</li>
                <li>Generators & backup power</li>
              </ul>
            </div>
            <div className={styles.card}>
              <h3>ICT & Security Infrastructure</h3>
              <ul>
                <li>CCTV & access control</li>
                <li>Enterprise networking</li>
                <li>Server rooms & data cabling</li>
                <li>Smart building integration</li>
              </ul>
            </div>
          </div>
        </div>

        {/* HOW IT WORKS */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>How Enterprise Engagement Works</h2>
          <div className={styles.flow}>
            <div className={styles.flowStep}>
              <span className={styles.stepLabel}>STEP 1</span>
              <p>Enterprise consultation & needs assessment</p>
            </div>
            <div className={styles.flowStep}>
              <span className={styles.stepLabel}>STEP 2</span>
              <p>Technical evaluation & site assessment</p>
            </div>
            <div className={styles.flowStep}>
              <span className={styles.stepLabel}>STEP 3</span>
              <p>Project plan, budget & timeline</p>
            </div>
            <div className={styles.flowStep}>
              <span className={styles.stepLabel}>STEP 4</span>
              <p>Deployment of verified teams</p>
            </div>
            <div className={styles.flowStep}>
              <span className={styles.stepLabel}>STEP 5</span>
              <p>Supervision, reporting & compliance</p>
            </div>
            <div className={styles.flowStep}>
              <span className={styles.stepLabel}>STEP 6</span>
              <p>Completion, handover & warranty</p>
            </div>
          </div>
        </div>

        {/* ENTERPRISE TIERS */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Enterprise Access Model</h2>
          <div className={styles.compare}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Tier</th>
                  <th>Access Type</th>
                  <th>Best For</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Pro</td>
                  <td>Subscription</td>
                  <td>Mid-size companies & contractors</td>
                </tr>
                <tr>
                  <td><strong>Enterprise</strong></td>
                  <td>Approval Only</td>
                  <td>Large organizations & governments</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA */}
        <div className={styles.cta}>
          <div>
            <h2>Partner With Us</h2>
            <p>
              Require reliable execution for your next large-scale project? 
              Contact our Enterprise team today.
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <button className={styles.ctaBtn} onClick={() => setShowModal(true)}>
              Request Enterprise Consultation
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
            <h2>Enterprise Consultation</h2>
            
            {success ? (
              <div className={styles.successMsg}>
                Your request has been received. Our Enterprise team will contact you shortly!
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <label>Full Name</label>
                  <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Your name" />
                </div>
                <div className={styles.formGroup}>
                  <label>Company / Organization</label>
                  <input required value={formData.company_name} onChange={e => setFormData({...formData, company_name: e.target.value})} placeholder="Company Name" />
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
                  <label>Project Details</label>
                  <textarea required value={formData.details} onChange={e => setFormData({...formData, details: e.target.value})} rows={4} placeholder="Describe your project needs..." />
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
