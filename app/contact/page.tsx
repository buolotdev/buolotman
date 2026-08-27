"use client";

import { useState } from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import styles from "./contact.module.css";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    topic: "General Inquiry",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className={styles.page}>
      <Header />

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <iconify-icon icon="lucide:headset" /> 24/7 Dedicated Support
          </div>
          <h1 className={styles.heroTitle}>We&apos;re Here to Help — Get in Touch</h1>
          <p className={styles.heroSubtitle}>
            Have a question about a task contract, escrow payment, technician verification, or enterprise partnership? Our support specialists are available around the clock.
          </p>
        </div>
      </section>

      <main className={styles.container}>
        {/* CONTACT CHANNELS */}
        <section className={styles.channelsSection}>
          <div className={styles.grid3}>
            <div className={styles.channelCard}>
              <div className={styles.channelIconWrap}>
                <iconify-icon icon="lucide:message-square" />
              </div>
              <h3 className={styles.channelTitle}>General &amp; Task Support</h3>
              <p className={styles.channelDesc}>
                Help with active tasks, bid proposals, milestone approvals, and account access.
              </p>
              <a href="mailto:support@boulotman.com" className={styles.channelLink}>
                support@boulotman.com <iconify-icon icon="lucide:arrow-right" />
              </a>
            </div>

            <div className={styles.channelCard}>
              <div className={styles.channelIconWrap}>
                <iconify-icon icon="lucide:lock" />
              </div>
              <h3 className={styles.channelTitle}>Escrow &amp; Dispute Team</h3>
              <p className={styles.channelDesc}>
                Direct assistance with payment holds, mobile money payouts, and mediation appeals.
              </p>
              <a href="mailto:payments@boulotman.com" className={styles.channelLink}>
                payments@boulotman.com <iconify-icon icon="lucide:arrow-right" />
              </a>
            </div>

            <div className={styles.channelCard}>
              <div className={styles.channelIconWrap}>
                <iconify-icon icon="lucide:building-2" />
              </div>
              <h3 className={styles.channelTitle}>Enterprise &amp; Partnerships</h3>
              <p className={styles.channelDesc}>
                Custom contractor pooling, government tenders, and institutional procurement solutions.
              </p>
              <a href="mailto:enterprise@boulotman.com" className={styles.channelLink}>
                enterprise@boulotman.com <iconify-icon icon="lucide:arrow-right" />
              </a>
            </div>
          </div>
        </section>

        {/* CONTACT FORM */}
        <section className={styles.formSection}>
          <div className={styles.formWrapper}>
            <div>
              <h2 className={styles.formInfoTitle}>Send Our Support Team a Message</h2>
              <p className={styles.formInfoDesc}>
                Fill out the contact form with your inquiry details. A specialist from the relevant department will review your case and respond promptly.
              </p>

              <div className={styles.infoPoints}>
                <div className={styles.infoPoint}>
                  <iconify-icon icon="lucide:check-circle-2" className={styles.infoPointIcon} />
                  <div className={styles.infoPointText}>
                    <strong>Average Response Time:</strong> Under 2 hours during active business operations across Africa.
                  </div>
                </div>

                <div className={styles.infoPoint}>
                  <iconify-icon icon="lucide:check-circle-2" className={styles.infoPointIcon} />
                  <div className={styles.infoPointText}>
                    <strong>Escrow Protection:</strong> Urgent payment disputes receive highest priority routing.
                  </div>
                </div>

                <div className={styles.infoPoint}>
                  <iconify-icon icon="lucide:check-circle-2" className={styles.infoPointIcon} />
                  <div className={styles.infoPointText}>
                    <strong>Bilingual Support:</strong> Available in English and French (Français).
                  </div>
                </div>
              </div>
            </div>

            <div>
              {submitted ? (
                <div className={styles.successAlert}>
                  <iconify-icon icon="lucide:check-circle" style={{ fontSize: "40px", color: "#16a34a", marginBottom: "12px" }} />
                  <h3>Message Sent Successfully!</h3>
                  <p>
                    Thank you for reaching out, <strong>{formData.name}</strong>. Ticket #{Math.floor(100000 + Math.random() * 900000)} has been created and assigned to our support team. We will email you at <strong>{formData.email}</strong> shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: "", email: "", phone: "", topic: "General Inquiry", message: "" });
                    }}
                    style={{
                      marginTop: "18px",
                      background: "#001F3F",
                      color: "#fff",
                      border: "none",
                      padding: "10px 20px",
                      borderRadius: "10px",
                      fontWeight: "700",
                      cursor: "pointer"
                    }}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className={styles.formGrid}>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Your Full Name *</label>
                      <input
                        required
                        type="text"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Email Address *</label>
                      <input
                        required
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Phone / WhatsApp Number</label>
                      <input
                        type="tel"
                        placeholder="+250 788 000 000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Inquiry Topic *</label>
                      <select
                        value={formData.topic}
                        onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                      >
                        <option value="General Inquiry">General Platform Inquiry</option>
                        <option value="Task or Job Issue">Task or Job Proposal Issue</option>
                        <option value="Escrow & Payments">Escrow, Refund &amp; Wallet Payouts</option>
                        <option value="ID Verification">Identity &amp; Skills Verification</option>
                        <option value="Enterprise Solution">Enterprise &amp; Contractor Teams</option>
                        <option value="Bug Report">Technical Issue / Bug Report</option>
                      </select>
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Your Message / Issue Details *</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Please describe your question or issue in detail..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>

                  <button type="submit" className={styles.submitBtn}>
                    Send Message to Support <iconify-icon icon="lucide:send" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
