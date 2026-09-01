"use client";

import React, { useState } from "react";
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import styles from "./safety.module.css";

const CORE_PRACTICES = [
  {
    num: "01",
    title: "Verify Who You Are Working With",
    description: "Review the provider's profile, verification status, experience and relevant information before starting work.",
    points: [
      "Review profile information",
      "Check verification badges",
      "Review previous work",
      "Read ratings and reviews",
      "Confirm company details when applicable"
    ]
  },
  {
    num: "02",
    title: "Keep the Scope Clear",
    description: "Many disputes begin because both sides have different expectations about what was supposed to be delivered.",
    points: [
      "Describe the work clearly",
      "Confirm materials responsibility",
      "Agree on timelines",
      "Define deliverables",
      "Record changes to the scope"
    ]
  },
  {
    num: "03",
    title: "Use Safer Payment Structures",
    description: "Larger assignments should not depend on large uncontrolled payments without clear work stages and completion conditions.",
    points: [
      "Use project milestones",
      "Keep payment records",
      "Confirm completed work",
      "Use B-Pay where available",
      "Use escrow-supported workflows when eligible"
    ]
  },
  {
    num: "04",
    title: "Protect Personal Information",
    description: "Share only information reasonably necessary to complete the service, transaction or project.",
    points: [
      "Never share passwords",
      "Protect OTP and verification codes",
      "Be careful with financial information",
      "Avoid unnecessary ID sharing",
      "Watch for impersonation attempts"
    ]
  },
  {
    num: "05",
    title: "Keep Important Communication Recorded",
    description: "Written communication provides clearer evidence than relying only on informal calls or verbal arrangements.",
    points: [
      "Confirm important decisions",
      "Record scope changes",
      "Keep quotations",
      "Save work evidence",
      "Keep approval records"
    ]
  },
  {
    num: "06",
    title: "Report Problems Early",
    description: "Do not wait until a problem becomes more serious before reporting suspicious behavior, harassment, fraud or unsafe activity.",
    points: [
      "Report suspicious accounts",
      "Report harassment",
      "Report payment scams",
      "Report false credentials",
      "Report unsafe project behavior"
    ]
  }
];

export default function SafetyCenterPage() {
  const [reportForm, setReportForm] = useState({
    name: "",
    email: "",
    role: "",
    issueType: "",
    username: "",
    reference: "",
    description: "",
    contactMethod: ""
  });
  const [reportSubmitted, setReportSubmitted] = useState(false);

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    setReportSubmitted(true);
  };

  return (
    <div className={styles.pageWrapper}>
      <Header />

      {/* =====================================================
           HERO
      ====================================================== */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroGrid}>
            <div>
              <div className={styles.eyebrow}>Boulot Man Safety Center</div>
              <h1>Work, Hire and Transact with Greater Confidence</h1>
              <p className={styles.heroCopy}>
                The Boulot Man Safety Center helps clients, technicians, engineers and companies
                understand how to reduce risk before, during and after a service, task or project.
              </p>

              <div className={styles.heroActions}>
                <a href="#safety-guides" className={`${styles.btn} ${styles.btnPrimary}`}>
                  Explore Safety Guides
                </a>
                <a href="#report-safety-issue" className={`${styles.btn} ${styles.btnSecondary}`}>
                  Report a Safety Issue
                </a>
              </div>
            </div>

            <aside className={styles.heroCard}>
              <h2>Safety starts before the work begins</h2>
              <p>
                Use the information available on Boulot Man and keep important project activity documented
                on the platform whenever possible.
              </p>
              <ul className={styles.heroList}>
                <li>Review verification before hiring.</li>
                <li>Confirm scope, price and responsibilities.</li>
                <li>Use milestones for larger assignments.</li>
                <li>Keep payment and project records.</li>
                <li>Protect account and personal information.</li>
                <li>Report suspicious or unsafe activity quickly.</li>
              </ul>
            </aside>
          </div>
        </div>
      </section>

      {/* =====================================================
           SAFETY STRIP
      ====================================================== */}
      <section className={styles.strip}>
        <div className={styles.container}>
          <div className={styles.stripGrid}>
            <div className={styles.stripItem}>
              <strong>Verified Identities</strong>
              <span>Verification helps increase accountability between users.</span>
            </div>
            <div className={styles.stripItem}>
              <strong>Secure Workflows</strong>
              <span>Structured tasks and projects create clearer records.</span>
            </div>
            <div className={styles.stripItem}>
              <strong>Payment Protection</strong>
              <span>Eligible work can use milestone and escrow-supported payment flows.</span>
            </div>
            <div className={styles.stripItem}>
              <strong>Reporting Tools</strong>
              <span>Users can report suspicious, abusive or unsafe activity.</span>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
           CORE SAFETY GUIDES
      ====================================================== */}
      <section className={styles.section} id="safety-guides">
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <div className={styles.headCopy}>
              <div className={styles.kicker}>Safety fundamentals</div>
              <h2 className={styles.title}>Key Safety Practices for Every Boulot Man User</h2>
              <p className={styles.copy}>
                Safety is shared between the platform, clients and service providers. These practices
                help reduce avoidable problems during hiring and project execution.
              </p>
            </div>
          </div>

          <div className={styles.coreGrid}>
            {CORE_PRACTICES.map((p, idx) => (
              <article key={idx} className={styles.coreCard}>
                <div className={styles.coreIcon}>{p.num}</div>
                <h3>{p.title}</h3>
                <p>{p.description}</p>
                <ul className={styles.coreList}>
                  {p.points.map((pt, pIdx) => (
                    <li key={pIdx}>{pt}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
           BEFORE HIRING
      ====================================================== */}
      <section className={`${styles.section} ${styles.sectionSoft}`}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <div className={styles.headCopy}>
              <div className={styles.kicker}>Before you hire</div>
              <h2 className={styles.title}>Four Checks to Make Before Work Starts</h2>
            </div>
          </div>

          <div className={styles.checkGrid}>
            <article className={styles.checkCard}>
              <div className={styles.checkNumber}>1</div>
              <h3>Check the Profile</h3>
              <p>Make sure account information, service category, location and experience match the work being requested.</p>
            </article>

            <article className={styles.checkCard}>
              <div className={styles.checkNumber}>2</div>
              <h3>Review Verification</h3>
              <p>Higher-risk or higher-value work may justify additional verification, licences or company documents.</p>
            </article>

            <article className={styles.checkCard}>
              <div className={styles.checkNumber}>3</div>
              <h3>Confirm the Agreement</h3>
              <p>Clarify price, expected result, timeline, materials, access conditions and payment arrangement before work.</p>
            </article>

            <article className={styles.checkCard}>
              <div className={styles.checkNumber}>4</div>
              <h3>Use the Right Work Structure</h3>
              <p>Small tasks need simple hiring, while larger work should use quotations, milestones or project workflows.</p>
            </article>
          </div>
        </div>
      </section>

      {/* =====================================================
           WARNING SIGNS (DARK)
      ====================================================== */}
      <section className={`${styles.section} ${styles.sectionDark}`}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <div className={styles.headCopy}>
              <div className={styles.kicker}>Warning signs</div>
              <h2 className={styles.title}>Be Careful When Something Does Not Feel Consistent</h2>
              <p className={styles.copy}>
                Suspicious behavior does not automatically prove fraud, but it is a reason to slow down,
                verify more information and avoid unnecessary risk.
              </p>
            </div>
          </div>

          <div className={styles.warningGrid}>
            <article className={styles.warningCard}>
              <span className={styles.warningLabel}>Payment Warning Signs</span>
              <h3>Be cautious before sending money</h3>
              <p>Avoid payment arrangements that remove all visibility or require large unexplained transfers before work is defined.</p>
              <ul className={styles.warningList}>
                <li>Pressure to pay immediately without documentation</li>
                <li>Sudden changes to payment recipient details</li>
                <li>Large advance requests without clear justification</li>
                <li>Requests for passwords, PINs or OTP codes</li>
                <li>Payment instructions that contradict the agreed workflow</li>
              </ul>
            </article>

            <article className={styles.warningCard}>
              <span className={styles.warningLabel}>Provider Warning Signs</span>
              <h3>Look for consistency between claims and evidence</h3>
              <p>Professional information, identification, experience and company details should reasonably match the service.</p>
              <ul className={styles.warningList}>
                <li>Refusal to provide relevant professional information</li>
                <li>Claims that conflict with profile information</li>
                <li>False or suspicious certificates</li>
                <li>Attempts to impersonate another provider</li>
                <li>Repeated pressure to bypass normal project processes</li>
              </ul>
            </article>

            <article className={styles.warningCard}>
              <span className={styles.warningLabel}>Client Warning Signs</span>
              <h3>Providers should also protect themselves</h3>
              <p>Technicians and companies should not accept unclear, unsafe or suspicious work simply because a client offers payment.</p>
              <ul className={styles.warningList}>
                <li>Requests to perform illegal activity</li>
                <li>Unsafe site conditions</li>
                <li>Pressure to work without agreed payment terms</li>
                <li>Requests for personal financial credentials</li>
                <li>Harassment, threats or abusive behavior</li>
              </ul>
            </article>

            <article className={styles.warningCard}>
              <span className={styles.warningLabel}>Account Warning Signs</span>
              <h3>Protect your Boulot Man account</h3>
              <p>Account takeover can create financial and reputational risk for both clients and providers.</p>
              <ul className={styles.warningList}>
                <li>Unexpected password reset messages</li>
                <li>Unknown login activity</li>
                <li>Requests asking for your verification code</li>
                <li>Messages claiming your account will be closed unless you pay</li>
                <li>Someone pretending to be Boulot Man support outside normal channels</li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      {/* =====================================================
           PAYMENT SAFETY
      ====================================================== */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <div className={styles.headCopy}>
              <div className={styles.kicker}>Payment safety</div>
              <h2 className={styles.title}>Use Payments That Match the Work Being Done</h2>
              <p className={styles.copy}>
                The payment structure should reflect the value, duration and complexity of the job or project.
              </p>
            </div>
          </div>

          <div className={styles.paymentGrid}>
            <article className={styles.paymentCard}>
              <h3>Small Service Jobs</h3>
              <p>For routine work, clearly agree on the price and what is included before the provider starts.</p>
              <ul className={styles.paymentList}>
                <li>Confirm service price</li>
                <li>Clarify materials</li>
                <li>Confirm additional charges first</li>
                <li>Keep payment evidence</li>
              </ul>
            </article>

            <article className={styles.paymentCard}>
              <h3>Larger Projects</h3>
              <p>Break larger assignments into measurable milestones linked to specific project outputs.</p>
              <ul className={styles.paymentList}>
                <li>Define milestones</li>
                <li>Set milestone amounts</li>
                <li>Review work evidence</li>
                <li>Approve completed stages</li>
                <li>Keep project records</li>
              </ul>
            </article>

            <article className={styles.paymentCard}>
              <h3>B-Pay &amp; Escrow</h3>
              <p>Where available and applicable, eligible assignments can use B-Pay and escrow-supported workflows.</p>
              <ul className={styles.paymentList}>
                <li>Recorded funding</li>
                <li>Controlled release conditions</li>
                <li>Project-linked transactions</li>
                <li>Provider payout records</li>
                <li>Better dispute evidence</li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      {/* =====================================================
           PHYSICAL SAFETY
      ====================================================== */}
      <section className={`${styles.section} ${styles.sectionSoft}`}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <div className={styles.headCopy}>
              <div className={styles.kicker}>Physical safety</div>
              <h2 className={styles.title}>Safe Work Requires Safe Conditions</h2>
              <p className={styles.copy}>
                Clients and providers should consider physical safety whenever work involves homes, construction sites,
                machinery, electricity, heights, roads or other hazardous environments.
              </p>
            </div>
          </div>

          <div className={styles.physicalGrid}>
            <article className={styles.physicalCard}>
              <h3>Site Access</h3>
              <p>Confirm who is authorized to enter the work location and when access is permitted.</p>
            </article>
            <article className={styles.physicalCard}>
              <h3>Protective Equipment</h3>
              <p>Appropriate safety equipment should be used whenever the type of work requires it.</p>
            </article>
            <article className={styles.physicalCard}>
              <h3>Technical Competence</h3>
              <p>High-risk electrical, structural, mechanical work should be handled by capable people.</p>
            </article>
            <article className={styles.physicalCard}>
              <h3>Stop Unsafe Work</h3>
              <p>Work should stop when conditions create an immediate and unreasonable safety risk.</p>
            </article>
          </div>
        </div>
      </section>

      {/* =====================================================
           ACCOUNT SAFETY
      ====================================================== */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <div className={styles.headCopy}>
              <div className={styles.kicker}>Account protection</div>
              <h2 className={styles.title}>Protect Your Account and Identity</h2>
            </div>
          </div>

          <div className={styles.accountGrid}>
            <article className={styles.accountCard}>
              <h3>Protect Your Password</h3>
              <p>Use a strong password and do not reuse the same password across multiple important services.</p>
            </article>
            <article className={styles.accountCard}>
              <h3>Never Share Verification Codes</h3>
              <p>Boulot Man support will never require you to give another person your password, PIN or OTP code.</p>
            </article>
            <article className={styles.accountCard}>
              <h3>Watch for Impersonation</h3>
              <p>Be cautious when someone claims to represent Boulot Man asking for unusual payments or credentials.</p>
            </article>
          </div>
        </div>
      </section>

      {/* =====================================================
           EMERGENCY ALERT
      ====================================================== */}
      <section className={`${styles.section} ${styles.sectionSoft}`} style={{ paddingTop: 0 }}>
        <div className={styles.container}>
          <div className={styles.alertCard}>
            <div className={styles.alertIcon}>!</div>
            <div>
              <h3>If someone is in immediate physical danger</h3>
              <p>
                Boulot Man is not an emergency-response service. Contact the appropriate local emergency service,
                police, medical service, fire service or relevant public authority in your area first. You can then
                report the related account or activity to Boulot Man for platform review.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
           REPORT SAFETY ISSUE FORM
      ====================================================== */}
      <section className={styles.reportSection} id="report-safety-issue">
        <div className={styles.container}>
          <div className={styles.reportGrid}>
            <div className={styles.reportCopy}>
              <h2>Report a Safety Concern</h2>
              <p>
                Tell Boulot Man about suspicious accounts, fraud attempts, harassment, false credentials, unsafe behavior
                or another safety concern connected to the platform.
              </p>
              <ul className={styles.reportList}>
                <li>Suspicious or fake profile</li>
                <li>Fraud or payment scam</li>
                <li>Harassment or threatening behavior</li>
                <li>False professional credentials</li>
                <li>Unsafe work or project conduct</li>
                <li>Account impersonation</li>
              </ul>
            </div>

            <form className={styles.formCard} onSubmit={handleSubmitReport}>
              <h3>Safety Report</h3>
              <p>Provide enough information for the concern to be reviewed.</p>

              {reportSubmitted && (
                <div className={styles.successMsg}>
                  <span>✓</span>
                  <span>Your safety report has been submitted to Boulot Man trust &amp; safety team for immediate review.</span>
                </div>
              )}

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="safetyName">Your Name</label>
                  <input
                    type="text"
                    id="safetyName"
                    required
                    value={reportForm.name}
                    onChange={(e) => setReportForm({ ...reportForm, name: e.target.value })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="safetyEmail">Email</label>
                  <input
                    type="email"
                    id="safetyEmail"
                    required
                    value={reportForm.email}
                    onChange={(e) => setReportForm({ ...reportForm, email: e.target.value })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="safetyRole">Your Role</label>
                  <select
                    id="safetyRole"
                    required
                    value={reportForm.role}
                    onChange={(e) => setReportForm({ ...reportForm, role: e.target.value })}
                  >
                    <option value="">Select</option>
                    <option>Client</option>
                    <option>Technician / Professional</option>
                    <option>Engineer</option>
                    <option>Company</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="safetyIssueType">Concern Type</label>
                  <select
                    id="safetyIssueType"
                    required
                    value={reportForm.issueType}
                    onChange={(e) => setReportForm({ ...reportForm, issueType: e.target.value })}
                  >
                    <option value="">Select concern</option>
                    <option>Suspicious / Fake Account</option>
                    <option>Fraud / Payment Scam</option>
                    <option>Harassment / Threat</option>
                    <option>False Credentials</option>
                    <option>Unsafe Work</option>
                    <option>Account Impersonation</option>
                    <option>Privacy Concern</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="safetyUsername">Reported Username / Company</label>
                  <input
                    type="text"
                    id="safetyUsername"
                    placeholder="@username or company name"
                    value={reportForm.username}
                    onChange={(e) => setReportForm({ ...reportForm, username: e.target.value })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="safetyRef">Task / Project Reference</label>
                  <input
                    type="text"
                    id="safetyRef"
                    placeholder="If applicable"
                    value={reportForm.reference}
                    onChange={(e) => setReportForm({ ...reportForm, reference: e.target.value })}
                  />
                </div>

                <div className={`${styles.formGroup} ${styles.formFull}`}>
                  <label htmlFor="safetyDesc">Describe What Happened</label>
                  <textarea
                    id="safetyDesc"
                    placeholder="Describe the concern, when it happened and any important details that may help with review."
                    required
                    value={reportForm.description}
                    onChange={(e) => setReportForm({ ...reportForm, description: e.target.value })}
                  ></textarea>
                </div>

                <div className={`${styles.formGroup} ${styles.formFull}`}>
                  <label htmlFor="safetyContact">Preferred Contact Method</label>
                  <select
                    id="safetyContact"
                    required
                    value={reportForm.contactMethod}
                    onChange={(e) => setReportForm({ ...reportForm, contactMethod: e.target.value })}
                  >
                    <option value="">Select</option>
                    <option>Email</option>
                    <option>Phone</option>
                    <option>Platform Message</option>
                  </select>
                </div>
              </div>

              <button type="submit" className={styles.submitBtn}>
                Submit Safety Report
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* =====================================================
           SAFETY RESOURCES
      ====================================================== */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <div className={styles.headCopy}>
              <div className={styles.kicker}>Related resources</div>
              <h2 className={styles.title}>More Information About Trust and Protection</h2>
            </div>
          </div>

          <div className={styles.resourceGrid}>
            <article className={styles.resourceCard}>
              <h3>Trust &amp; Safety</h3>
              <p>Learn about the broader principles and protections used across the Boulot Man platform.</p>
              <Link href="/legal">Read Trust &amp; Safety →</Link>
            </article>

            <article className={styles.resourceCard}>
              <h3>Verification</h3>
              <p>Understand how identity, professional and company verification support platform accountability.</p>
              <Link href="/signup/verify">Learn About Verification →</Link>
            </article>

            <article className={styles.resourceCard}>
              <h3>Secure Payments</h3>
              <p>Learn how payment records, milestones and eligible secure-payment workflows support safer transactions.</p>
              <Link href="/payments-and-earnings">Explore Secure Payments →</Link>
            </article>

            <article className={styles.resourceCard}>
              <h3>Disputes</h3>
              <p>Learn what happens when clients and providers disagree about work, payments or project completion.</p>
              <Link href="/dispute-resolution">Learn About Disputes →</Link>
            </article>
          </div>
        </div>
      </section>

      {/* =====================================================
           FINAL CTA
      ====================================================== */}
      <section className={styles.finalSection}>
        <div className={styles.container}>
          <div className={styles.finalCard}>
            <div className={styles.finalCopy}>
              <h2>Safety Works Best When Every User Participates</h2>
              <p>
                Review profiles carefully, keep important agreements documented, use appropriate payment
                structures and report suspicious activity when you see it.
              </p>
            </div>

            <div className={styles.finalActions}>
              <Link href="/signup/verify" className={`${styles.btn} ${styles.btnPrimary}`}>
                Learn About Verification
              </Link>
              <Link href="/help-center" className={`${styles.btn} ${styles.btnOutline}`}>
                Visit Help Center
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
