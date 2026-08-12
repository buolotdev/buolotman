"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import styles from "./contractors.module.css";
import { api } from "@/app/lib/api";

function CheckItem({ text }: { text: string }) {
  return (
    <li className={styles.checkItem}>
      <div className={styles.checkIcon}>
        <iconify-icon icon="lucide:check-circle-2"></iconify-icon>
      </div>
      <span>{text}</span>
    </li>
  );
}

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
    <div style={{ background: "#f5f7fb", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Contractors & Enterprise Solutions</h1>
          <p className={styles.heroSubtitle}>
            Boulot Man Contractors is the enterprise-grade execution arm of the Boulot Man platform.
            We deliver medium to large-scale technical, engineering, and construction projects
            through verified professionals, structured teams, and strict project governance.
          </p>
        </div>
      </section>

      <main className={styles.container}>
        {/* OVERVIEW */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>What Is Boulot Man Contractors?</h2>
            <p className={styles.sectionDesc}>
              Boulot Man Contractors provides <strong>end-to-end project execution</strong> for organizations
              that require reliability, compliance, and accountability.
              This service is designed for enterprises, governments, NGOs, developers,
              and institutions that cannot rely on informal labor or unmanaged teams.
            </p>
          </div>

          <div className={styles.grid3}>
            <div className={styles.card}>
              <span className={styles.badge}>Who We Serve</span>
              <ul className={styles.featureList}>
                <CheckItem text="Large contractors & engineering firms" />
                <CheckItem text="Infrastructure & construction companies" />
                <CheckItem text="Government agencies & public institutions" />
                <CheckItem text="NGOs & international organizations" />
                <CheckItem text="Hotels, factories & warehouses" />
                <CheckItem text="Diaspora-led development projects" />
              </ul>
            </div>

            <div className={styles.card}>
              <span className={styles.badge}>What We Deliver</span>
              <ul className={styles.featureList}>
                <CheckItem text="Full project execution" />
                <CheckItem text="Certified technical workforce" />
                <CheckItem text="Engineering supervision" />
                <CheckItem text="Compliance & documentation" />
                <CheckItem text="Quality assurance" />
              </ul>
            </div>

            <div className={styles.card}>
              <span className={styles.badge}>Why Enterprises Choose Us</span>
              <ul className={styles.featureList}>
                <CheckItem text="Verified professionals only" />
                <CheckItem text="Structured governance" />
                <CheckItem text="Escrow & milestone payments" />
                <CheckItem text="Clear accountability" />
                <CheckItem text="Cross-border readiness" />
              </ul>
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Contracting Services</h2>
          </div>

          <div className={styles.grid3}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Construction & Civil Works</h3>
              <ul className={styles.featureList}>
                <CheckItem text="Residential & commercial construction" />
                <CheckItem text="Renovation & remodeling" />
                <CheckItem text="Finishing & interior works" />
                <CheckItem text="Structural & masonry works" />
              </ul>
            </div>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Electrical, Mechanical & Energy</h3>
              <ul className={styles.featureList}>
                <CheckItem text="Industrial & residential wiring" />
                <CheckItem text="HVAC & mechanical installations" />
                <CheckItem text="Solar & hybrid power systems" />
                <CheckItem text="Generators & backup power" />
              </ul>
            </div>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>ICT & Security Infrastructure</h3>
              <ul className={styles.featureList}>
                <CheckItem text="CCTV & access control" />
                <CheckItem text="Enterprise networking" />
                <CheckItem text="Server rooms & data cabling" />
                <CheckItem text="Smart building integration" />
              </ul>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>How Enterprise Engagement Works</h2>
          </div>

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
        </section>

        {/* ENTERPRISE TIERS */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Enterprise Access Model</h2>
          </div>

          <div className={styles.compareWrap}>
            <table className={styles.compareTable}>
              <thead>
                <tr>
                  <th>Tier</th>
                  <th>Access Type</th>
                  <th>Best For</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ fontWeight: 600 }}>Pro</td>
                  <td>Subscription</td>
                  <td>Mid-size companies & contractors</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 700, color: "#FF4500" }}>Enterprise</td>
                  <td>Approval Only</td>
                  <td>Large organizations & governments</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* CTA */}
        <section className={styles.cta}>
          <div>
            <h2 className={styles.ctaTitle}>Request Enterprise Access</h2>
            <p className={styles.ctaDesc}>
              Enterprise access is by request only. Speak directly with Boulot Man management to discuss workforce needs, compliance requirements, and project scope.
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <button className={styles.ctaBtn} onClick={() => setShowModal(true)}>
              Chat with Management
              <iconify-icon icon="lucide:arrow-up-right" style={{ fontSize: "22px" }}></iconify-icon>
            </button>
          </div>
        </section>
      </main>

      <Footer />

      {/* Inquiry Modal */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setShowModal(false)}>
              &times;
            </button>
            <h2 className={styles.modalTitle}>Enterprise Consultation</h2>

            {success ? (
              <div className={styles.successMsg}>
                Your request has been received. Our Enterprise team will contact you shortly!
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.modalForm}>
                <div className={styles.formGroup}>
                  <label>Full Name</label>
                  <input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your name"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Company / Organization</label>
                  <input
                    required
                    value={formData.company_name}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                    placeholder="Company Name"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your@email.com"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Phone Number</label>
                  <input
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+123..."
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Project Details</label>
                  <textarea
                    required
                    value={formData.details}
                    onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                    rows={4}
                    placeholder="Describe your project needs..."
                  />
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
