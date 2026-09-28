"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { api } from "@/app/lib/api";
import styles from "./guidelines.module.css";

const CHAPTERS = [
  { id: "our-standard", num: "01", title: "Our Community Standard" },
  { id: "real-situations", num: "02", title: "Real Situations" },
  { id: "expected-conduct", num: "03", title: "Expected Conduct" },
  { id: "roles", num: "04", title: "Your Role" },
  { id: "worksite", num: "05", title: "Worksite Conduct" },
  { id: "reputation", num: "06", title: "Reviews & Reputation" },
  { id: "enforcement", num: "07", title: "When Rules Are Broken" },
  { id: "report", num: "08", title: "Report a Concern" }
];

export default function CommunityGuidelinesPage() {
  const [activeChapter, setActiveChapter] = useState("our-standard");
  const [reportForm, setReportForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Client",
    isAnonymous: false,
    offenderRole: "Technician / Professional",
    user: "",
    reference: "",
    concern: "Harassment / Verbal Abuse",
    severity: "High / Repeated Infraction",
    incidentDate: "",
    description: "",
    contact: "Email"
  });
  const [attachedFiles, setAttachedFiles] = useState<string[]>([]);
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 180;
      for (const ch of CHAPTERS) {
        const el = document.getElementById(ch.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveChapter(ch.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToChapter = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveChapter(id);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const names = Array.from(e.target.files).map((f) => f.name);
      setAttachedFiles((prev) => [...prev, ...names]);
    }
  };

  const removeFile = (idx: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportForm.description.trim() || (!reportForm.isAnonymous && (!reportForm.name.trim() || !reportForm.email.trim()))) {
      return;
    }

    setSubmitting(true);
    try {
      const payloadDetails = `=== 1. Reporter Information ===
Reporter: ${reportForm.isAnonymous ? "Anonymous Community Member" : reportForm.name}
Role: ${reportForm.role}
Email: ${reportForm.isAnonymous ? "confidential@boulotman.com" : reportForm.email}
Phone / WhatsApp: ${reportForm.phone || "N/A"}
Preferred Contact: ${reportForm.contact}

=== 2. Reported Party & Reference ===
Reported User / Entity: ${reportForm.user || "Unknown / Unspecified"}
Offender Platform Role: ${reportForm.offenderRole}
Task / Project ID: ${reportForm.reference || "N/A"}

=== 3. Violation Classification ===
Category: ${reportForm.concern}
Severity: ${reportForm.severity}
Approximate Date: ${reportForm.incidentDate || "Recent"}

=== 4. Statement of Facts ===
${reportForm.description}

=== 5. Evidence & Screenshots ===
Attachments: ${attachedFiles.length > 0 ? attachedFiles.join(", ") : "None attached"}`;

      const newReport = {
        id: `COMM-${Date.now().toString().slice(-6)}`,
        created_at: new Date().toISOString(),
        topic: `[COMMUNITY REPORT] ${reportForm.concern} - ${reportForm.user || "User"}`,
        name: reportForm.isAnonymous ? "Anonymous User" : reportForm.name,
        email: reportForm.email,
        phone: reportForm.phone,
        city: "Community Guidelines",
        category: reportForm.concern,
        details: payloadDetails,
        attached_files: attachedFiles,
        status: "Pending"
      };

      if (typeof window !== "undefined") {
        const existing = JSON.parse(localStorage.getItem("boulotman_community_inquiries") || "[]");
        localStorage.setItem("boulotman_community_inquiries", JSON.stringify([newReport, ...existing]));
      }

      await Promise.allSettled([
        api.createSupportTicket({
          subject: `[Community Incident Report] ${reportForm.concern} - Target: ${reportForm.user || "Unknown"}`,
          body: `Reporter: ${reportForm.isAnonymous ? "Confidential/Anonymous" : `${reportForm.name} (${reportForm.role})`}\nReported Target: ${reportForm.user} (${reportForm.offenderRole})\nRef: ${reportForm.reference}\nCategory: ${reportForm.concern}\nSeverity: ${reportForm.severity}\nEvidence: ${attachedFiles.join(", ") || "None"}\n\nIncident Statement:\n${reportForm.description}`
        }),
        api.createDispute({
          reason: `Community Guideline Breach: ${reportForm.concern}`,
          description: payloadDetails,
          against_name: reportForm.user || ""
        })
      ]);

      setReportSubmitted(true);
      setReportForm({
        name: "",
        email: "",
        phone: "",
        role: "Client",
        isAnonymous: false,
        offenderRole: "Technician / Professional",
        user: "",
        reference: "",
        concern: "Harassment / Verbal Abuse",
        severity: "High / Repeated Infraction",
        incidentDate: "",
        description: "",
        contact: "Email"
      });
      setAttachedFiles([]);
    } catch (err) {
      console.error("Failed to submit community report", err);
      setReportSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <Header />

      {/* =========================================================
           INTRODUCTION
      ========================================================== */}
      <section className={styles.intro}>
        <div className={styles.container}>
          <div className={styles.introInner}>
            <div className={styles.introMain}>
              <div className={styles.introLabel}>Community Guidelines</div>
              <h1>
                Good work starts with <em>good conduct.</em>
              </h1>
              <p className={styles.introCopy}>
                Boulot Man brings together people who need work done and people capable of doing it.
                That only works when everyone approaches the platform with honesty, professionalism,
                respect and responsibility.
              </p>

              <div className={styles.introActions}>
                <a
                  href="#our-standard"
                  className={styles.introPrimary}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToChapter("our-standard");
                  }}
                >
                  Explore the Community Standard
                </a>
                <a
                  href="#report"
                  className={styles.introSecondary}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToChapter("report");
                  }}
                >
                  Report a Concern
                </a>
              </div>
            </div>

            <aside className={styles.pledge}>
              <div className={styles.pledgeTitle}>The Boulot Man Community Pledge</div>
              <p className={styles.pledgeText}>
                I will represent myself honestly, respect the people I work with, communicate clearly,
                protect the work environment and take responsibility for the commitments I make.
              </p>
              <div className={styles.pledgeSign}>
                Clients · Professionals · Companies · Sellers
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* =========================================================
           HANDBOOK
      ========================================================== */}
      <section className={styles.handbook}>
        <div className={styles.container}>
          <div className={styles.handbookGrid}>
            {/* STICKY CHAPTER NAV */}
            <aside className={styles.chapterNav}>
              <div className={styles.chapterNavTitle}>In this guide</div>
              {CHAPTERS.map((ch) => (
                <button
                  key={ch.id}
                  type="button"
                  className={`${styles.chapterLink} ${activeChapter === ch.id ? styles.active : ""}`}
                  onClick={() => scrollToChapter(ch.id)}
                >
                  {ch.title}
                </button>
              ))}

              <div className={styles.navReport}>
                <a
                  href="#report"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToChapter("report");
                  }}
                >
                  Report Community Issue
                </a>
              </div>
            </aside>

            {/* CONTENT */}
            <main className={styles.content}>
              {/* CHAPTER 1 */}
              <section className={styles.chapter} id="our-standard">
                <div className={styles.chapterNumber}>Chapter 01</div>
                <h2>What kind of community are we building?</h2>
                <p className={styles.chapterLead}>
                  Boulot Man is not simply a directory of technicians or a place to post jobs. People
                  depend on one another here to enter homes, manage projects, handle property, supply
                  materials, make payments and deliver professional work. Trust therefore has to be part
                  of the product.
                </p>

                <div className={styles.values}>
                  <div className={styles.valueItem}>
                    <div className={styles.valueIndex}>01</div>
                    <h3>Be truthful</h3>
                    <p>
                      Your identity, experience, company information, task descriptions, quotations,
                      products and project information should represent reality.
                    </p>
                  </div>

                  <div className={styles.valueItem}>
                    <div className={styles.valueIndex}>02</div>
                    <h3>Respect people</h3>
                    <p>
                      Clients, technicians, engineers, companies, subcontractors and sellers should be
                      treated professionally even when there is disagreement.
                    </p>
                  </div>

                  <div className={styles.valueItem}>
                    <div className={styles.valueIndex}>03</div>
                    <h3>Respect commitments</h3>
                    <p>
                      Accepting a task, confirming an appointment, approving a quotation or entering a
                      project creates expectations. Communicate when those expectations cannot be met.
                    </p>
                  </div>

                  <div className={styles.valueItem}>
                    <div className={styles.valueIndex}>04</div>
                    <h3>Protect the work</h3>
                    <p>
                      Respect property, equipment, information, materials and work sites. Safety and
                      technical responsibility should never be treated casually.
                    </p>
                  </div>

                  <div className={styles.valueItem}>
                    <div className={styles.valueIndex}>05</div>
                    <h3>Build reputation honestly</h3>
                    <p>
                      Reviews, ratings, project history and verification are intended to help people make
                      better decisions. They should never be fabricated or manipulated.
                    </p>
                  </div>
                </div>
              </section>

              {/* CHAPTER 2 */}
              <section className={styles.chapter} id="real-situations">
                <div className={styles.chapterNumber}>Chapter 02</div>
                <h2>What does good conduct look like in real situations?</h2>
                <p className={styles.chapterLead}>
                  Rules are easier to understand when they are connected to situations users may
                  actually experience on Boulot Man.
                </p>

                <div className={styles.scenarios}>
                  <article className={styles.scenario}>
                    <div className={styles.scenarioTop}>
                      <div className={styles.scenarioType}>Client &amp; Technician</div>
                      <h3>The job becomes larger than originally described</h3>
                    </div>
                    <div className={styles.scenarioBody}>
                      <p className={styles.scenarioQuestion}>
                        A plumber arrives and discovers that the problem requires additional pipework
                        that was not visible from the client's original photographs.
                      </p>
                      <div className={styles.scenarioResponse}>
                        <div className={styles.scenarioIcon}>✓</div>
                        <span>Explain the additional work, materials and cost before continuing.</span>
                      </div>
                      <div className={`${styles.scenarioResponse} ${styles.scenarioBad}`}>
                        <div className={styles.scenarioIcon}>×</div>
                        <span>Complete extra work without approval and demand higher payment afterwards.</span>
                      </div>
                    </div>
                  </article>

                  <article className={styles.scenario}>
                    <div className={styles.scenarioTop}>
                      <div className={styles.scenarioType}>Company &amp; Subcontractor</div>
                      <h3>A subcontractor cannot meet the agreed deadline</h3>
                    </div>
                    <div className={styles.scenarioBody}>
                      <p className={styles.scenarioQuestion}>
                        A subcontracting company realizes that workforce shortages will delay its portion of the project.
                      </p>
                      <div className={styles.scenarioResponse}>
                        <div className={styles.scenarioIcon}>✓</div>
                        <span>Notify the project party early, explain the delay and propose a realistic plan.</span>
                      </div>
                      <div className={`${styles.scenarioResponse} ${styles.scenarioBad}`}>
                        <div className={styles.scenarioIcon}>×</div>
                        <span>Stop responding and wait until the project owner discovers no work is happening.</span>
                      </div>
                    </div>
                  </article>

                  <article className={styles.scenario}>
                    <div className={styles.scenarioTop}>
                      <div className={styles.scenarioType}>Client</div>
                      <h3>The client is unhappy with completed work</h3>
                    </div>
                    <div className={styles.scenarioBody}>
                      <p className={styles.scenarioQuestion}>
                        The result does not match part of what the client expected.
                      </p>
                      <div className={styles.scenarioResponse}>
                        <div className={styles.scenarioIcon}>✓</div>
                        <span>Document the problem, explain disagreement and use dispute process.</span>
                      </div>
                      <div className={`${styles.scenarioResponse} ${styles.scenarioBad}`}>
                        <div className={styles.scenarioIcon}>×</div>
                        <span>Threaten technician or post false claims to damage reputation.</span>
                      </div>
                    </div>
                  </article>

                  <article className={styles.scenario}>
                    <div className={styles.scenarioTop}>
                      <div className={styles.scenarioType}>B-Market Seller</div>
                      <h3>Construction materials are leftover from a project</h3>
                    </div>
                    <div className={styles.scenarioBody}>
                      <p className={styles.scenarioQuestion}>
                        A contractor wants to sell unused roofing sheets remaining after a construction project.
                      </p>
                      <div className={styles.scenarioResponse}>
                        <div className={styles.scenarioIcon}>✓</div>
                        <span>State that they are surplus materials, show condition and specify quantity.</span>
                      </div>
                      <div className={`${styles.scenarioResponse} ${styles.scenarioBad}`}>
                        <div className={styles.scenarioIcon}>×</div>
                        <span>Use unrelated stock images and describe damaged sheets as brand new.</span>
                      </div>
                    </div>
                  </article>
                </div>
              </section>

              {/* CHAPTER 3 */}
              <section className={styles.chapter} id="expected-conduct">
                <div className={styles.chapterNumber}>Chapter 03</div>
                <h2>Keep the community useful, professional and safe.</h2>
                <p className={styles.chapterLead}>
                  Most users will never need to think about enforcement. Following a few basic expectations
                  prevents many of the problems that cause disputes or damage trust.
                </p>

                <div className={styles.board}>
                  <div className={styles.boardDo}>
                    <div className={styles.boardHeading}>
                      <div className={styles.boardIcon}>✓</div>
                      <h3>Do</h3>
                    </div>
                    <ul className={styles.boardList}>
                      <li>Use accurate names, identities and company information.</li>
                      <li>Explain tasks and projects honestly.</li>
                      <li>Keep quotations and prices clear.</li>
                      <li>Communicate when schedules or circumstances change.</li>
                      <li>Respect other people's property and privacy.</li>
                      <li>Use genuine work samples and credentials.</li>
                      <li>Document important project changes and approvals.</li>
                      <li>Report serious fraud, impersonation or unsafe conduct.</li>
                    </ul>
                  </div>

                  <div className={styles.boardDont}>
                    <div className={styles.boardHeading}>
                      <div className={styles.boardIcon}>×</div>
                      <h3>Don't</h3>
                    </div>
                    <ul className={styles.boardList}>
                      <li>Create fake profiles, jobs, projects or seller listings.</li>
                      <li>Harass, threaten or intimidate another user.</li>
                      <li>Falsify qualifications, licences or previous work.</li>
                      <li>Manipulate ratings or reviews.</li>
                      <li>Send spam or misuse contact information.</li>
                      <li>Request passwords, PINs or verification codes.</li>
                      <li>Misrepresent payments or payment confirmations.</li>
                      <li>Use the platform to arrange illegal activity.</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* CHAPTER 4 */}
              <section className={styles.chapter} id="roles">
                <div className={styles.chapterNumber}>Chapter 04</div>
                <h2>Different roles carry different responsibilities.</h2>
                <p className={styles.chapterLead}>
                  Boulot Man connects several kinds of users. The community standard stays the same,
                  but the way it applies depends on what you are doing.
                </p>

                <div className={styles.roleStack}>
                  <article className={styles.roleRule}>
                    <div className={styles.roleLabel}>
                      <small>Hiring</small>
                      <strong>Clients &amp; Project Owners</strong>
                    </div>
                    <div className={styles.roleExpectations}>
                      <div className={styles.roleExpectation}>Describe the job and site conditions accurately.</div>
                      <div className={styles.roleExpectation}>Give professionals reasonable access required for work.</div>
                      <div className={styles.roleExpectation}>Honor confirmed payment arrangements.</div>
                      <div className={styles.roleExpectation}>Raise quality concerns through professional communication.</div>
                      <div className={styles.roleExpectation}>Do not request illegal or knowingly dangerous work.</div>
                      <div className={styles.roleExpectation}>Do not deliberately misrepresent project scope to reduce quotes.</div>
                    </div>
                  </article>

                  <article className={styles.roleRule}>
                    <div className={styles.roleLabel}>
                      <small>Working</small>
                      <strong>Technicians &amp; Engineers</strong>
                    </div>
                    <div className={styles.roleExpectations}>
                      <div className={styles.roleExpectation}>Accept work that matches your reasonable competence.</div>
                      <div className={styles.roleExpectation}>Explain charges and material requirements clearly.</div>
                      <div className={styles.roleExpectation}>Respect appointments and project timelines.</div>
                      <div className={styles.roleExpectation}>Ask before performing additional chargeable work.</div>
                      <div className={styles.roleExpectation}>Do not fabricate credentials or experience.</div>
                      <div className={styles.roleExpectation}>Do not substitute agreed materials without approval.</div>
                    </div>
                  </article>

                  <article className={styles.roleRule}>
                    <div className={styles.roleLabel}>
                      <small>Project Execution</small>
                      <strong>Companies &amp; Contractors</strong>
                    </div>
                    <div className={styles.roleExpectations}>
                      <div className={styles.roleExpectation}>Submit accurate organizational and capability info.</div>
                      <div className={styles.roleExpectation}>Respect procurement and quotation requirements.</div>
                      <div className={styles.roleExpectation}>Represent subcontractor relationships accurately.</div>
                      <div className={styles.roleExpectation}>Protect confidential project information.</div>
                      <div className={styles.roleExpectation}>Do not fabricate references or previous contracts.</div>
                      <div className={styles.roleExpectation}>Do not coordinate deceptive quotations or bid manipulation.</div>
                    </div>
                  </article>

                  <article className={styles.roleRule}>
                    <div className={styles.roleLabel}>
                      <small>B-Market</small>
                      <strong>Sellers &amp; Suppliers</strong>
                    </div>
                    <div className={styles.roleExpectations}>
                      <div className={styles.roleExpectation}>Use photographs that represent the item being sold.</div>
                      <div className={styles.roleExpectation}>State quantity, dimensions, unit and condition accurately.</div>
                      <div className={styles.roleExpectation}>Identify used, surplus or recovered materials clearly.</div>
                      <div className={styles.roleExpectation}>Keep stock and delivery information reasonably current.</div>
                      <div className={styles.roleExpectation}>Do not list stolen, counterfeit or prohibited goods.</div>
                      <div className={styles.roleExpectation}>Do not advertise intentionally unavailable stock.</div>
                    </div>
                  </article>
                </div>
              </section>

              {/* CHAPTER 5 */}
              <section className={styles.chapter} id="worksite">
                <div className={styles.chapterNumber}>Chapter 05</div>
                <h2>Community standards continue when you meet offline.</h2>
                <p className={styles.chapterLead}>
                  A large part of Boulot Man activity eventually happens in somebody's home, office,
                  construction site, workshop or business. Professional conduct follows the assignment
                  wherever it takes place.
                </p>

                <div className={styles.siteCode}>
                  <div className={styles.siteHeader}>
                    <small>The Worksite Code</small>
                    <h3>Four simple expectations whenever Boulot Man users meet in person.</h3>
                  </div>

                  <div className={styles.siteGrid}>
                    <div className={styles.siteRule}>
                      <div className={styles.siteNumber}>01</div>
                      <h4>Respect the property</h4>
                      <p>Take reasonable care around homes, businesses, equipment, materials and work.</p>
                    </div>

                    <div className={styles.siteRule}>
                      <div className={styles.siteNumber}>02</div>
                      <h4>Respect boundaries</h4>
                      <p>Do not access areas unrelated to work without permission.</p>
                    </div>

                    <div className={styles.siteRule}>
                      <div className={styles.siteNumber}>03</div>
                      <h4>Work responsibly</h4>
                      <p>Use suitable tools, professional judgement and applicable safety measures.</p>
                    </div>

                    <div className={styles.siteRule}>
                      <div className={styles.siteNumber}>04</div>
                      <h4>Handle conflict professionally</h4>
                      <p>Do not use threats. Document disputes and use appropriate resolution channels.</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* CHAPTER 6 */}
              <section className={styles.chapter} id="reputation">
                <div className={styles.chapterNumber}>Chapter 06</div>
                <h2>Reputation should be earned, not manufactured.</h2>
                <p className={styles.chapterLead}>
                  Ratings, reviews, completed work, project records and verification all help another
                  user decide whether they are comfortable working with you.
                </p>

                <div className={styles.reputationCard}>
                  <div className={styles.reputationMain}>
                    <div>
                      <div className={styles.reputationScore}>5<span>★</span></div>
                      <div className={styles.reputationLabel}>
                        A good reputation should come from genuine work, genuine transactions and genuine experiences.
                      </div>
                    </div>

                    <div className={styles.reputationRules}>
                      <div className={styles.reputationRule}>
                        <strong>Review what actually happened</strong>
                        <span>Feedback should reflect a real interaction, task, project or transaction.</span>
                      </div>
                      <div className={styles.reputationRule}>
                        <strong>Do not buy or exchange ratings</strong>
                        <span>Reviews should not be traded, sold or coordinated to artificially improve profiles.</span>
                      </div>
                      <div className={styles.reputationRule}>
                        <strong>Do not use reviews as threats</strong>
                        <span>A review should not be used to force another user into unrelated concessions.</span>
                      </div>
                      <div className={styles.reputationRule}>
                        <strong>Criticism can still be professional</strong>
                        <span>Negative experiences may be described honestly without harassment or fabricated claims.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* CHAPTER 7 */}
              <section className={styles.chapter} id="enforcement">
                <div className={styles.chapterNumber}>Chapter 07</div>
                <h2>What happens when community rules are broken?</h2>
                <p className={styles.chapterLead}>
                  Not every problem deserves the same response. Boulot Man may consider seriousness,
                  available evidence, user history, repetition, harm and surrounding circumstances.
                </p>

                <div className={styles.enforcement}>
                  <div className={styles.enforcementStep}>
                    <div className={styles.enforcementDot}>01</div>
                    <div className={styles.enforcementContent}>
                      <h3>Guidance or warning</h3>
                      <p>Minor issues may be addressed by informing the user or asking them to correct information.</p>
                    </div>
                  </div>

                  <div className={styles.enforcementStep}>
                    <div className={styles.enforcementDot}>02</div>
                    <div className={styles.enforcementContent}>
                      <h3>Content or listing action</h3>
                      <p>Inappropriate listings, reviews, profile information or opportunities may be removed.</p>
                    </div>
                  </div>

                  <div className={styles.enforcementStep}>
                    <div className={styles.enforcementDot}>03</div>
                    <div className={styles.enforcementContent}>
                      <h3>Feature or account restrictions</h3>
                      <p>Certain platform functions may be restricted while an issue is investigated.</p>
                    </div>
                  </div>

                  <div className={styles.enforcementStep}>
                    <div className={styles.enforcementDot}>04</div>
                    <div className={styles.enforcementContent}>
                      <h3>Suspension</h3>
                      <p>Serious or repeated violations may result in temporary suspension from platform activities.</p>
                    </div>
                  </div>

                  <div className={styles.enforcementStep}>
                    <div className={styles.enforcementDot}>05</div>
                    <div className={styles.enforcementContent}>
                      <h3>Account removal</h3>
                      <p>Severe fraud, dangerous conduct or significant platform abuse will result in account removal.</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* CHAPTER 8 */}
              <section className={styles.chapter} id="report">
                <div className={styles.chapterNumber}>Chapter 08</div>
                <h2>See something that puts the community at risk?</h2>
                <p className={styles.chapterLead}>
                  Community reports help Boulot Man investigate suspicious activity, misleading accounts
                  and conduct that may affect other users.
                </p>

                <div className={styles.reportPanel}>
                  <div className={styles.reportCopy}>
                    <small>Community Reporting</small>
                    <h3>Tell us what happened.</h3>
                    <p>
                      Provide enough information to identify the account, task, project, order or interaction involved.
                    </p>
                    <ul>
                      <li>Fake or impersonating accounts</li>
                      <li>Fraud or misleading activity</li>
                      <li>Threats or harassment</li>
                      <li>False professional credentials</li>
                      <li>Unsafe professional conduct</li>
                      <li>Review manipulation</li>
                      <li>Misleading B-Market listings</li>
                    </ul>
                  </div>

                  <form className={styles.reportForm} onSubmit={handleReportSubmit}>
                    <h3 className={styles.reportFormTitle}>Community Conduct &amp; Safety Report</h3>
                    <p style={{ fontSize: "13.5px", color: "#64748b", margin: "-8px 0 16px 0" }}>
                      Submit verified incident data to the trust, safety &amp; conduct committee.
                    </p>

                    {reportSubmitted && (
                      <div style={{ padding: "16px", background: "#ecfdf5", border: "1px solid #a7f3d0", color: "#065f46", borderRadius: "10px", marginBottom: "20px", fontSize: "14px", display: "flex", alignItems: "center", gap: "10px" }}>
                        <iconify-icon icon="lucide:check-circle-2" style={{ fontSize: "22px" }} />
                        <span>Your incident report has been securely registered and assigned a case officer for immediate review.</span>
                      </div>
                    )}

                    {/* SECTION 1: Reporter Identity & Confidentiality */}
                    <div className={styles.formBlock}>
                      <div className={styles.blockTitle}>
                        <iconify-icon icon="lucide:shield" /> 1. Reporter Details &amp; Confidentiality
                      </div>
                      <div className={styles.formGrid}>
                        <div className={`${styles.formGroup} ${styles.formFull}`} style={{ marginBottom: "10px" }}>
                          <label className={styles.checkboxLabel}>
                            <input
                              type="checkbox"
                              checked={reportForm.isAnonymous}
                              onChange={(e) => setReportForm({ ...reportForm, isAnonymous: e.target.checked })}
                            />
                            <span>
                              🔒 <strong>Submit as Confidential / Anonymous:</strong> Your name and direct contact will not be disclosed to the reported party.
                            </span>
                          </label>
                        </div>

                        {!reportForm.isAnonymous && (
                          <>
                            <div className={styles.formGroup}>
                              <label htmlFor="commName">Your Full Name *</label>
                              <input
                                type="text"
                                id="commName"
                                required={!reportForm.isAnonymous}
                                value={reportForm.name}
                                onChange={(e) => setReportForm({ ...reportForm, name: e.target.value })}
                              />
                            </div>

                            <div className={styles.formGroup}>
                              <label htmlFor="commEmail">Official Email *</label>
                              <input
                                type="email"
                                id="commEmail"
                                required={!reportForm.isAnonymous}
                                value={reportForm.email}
                                onChange={(e) => setReportForm({ ...reportForm, email: e.target.value })}
                              />
                            </div>

                            <div className={styles.formGroup}>
                              <label htmlFor="commPhone">Phone / WhatsApp</label>
                              <input
                                type="tel"
                                id="commPhone"
                                placeholder="+250 ..."
                                value={reportForm.phone}
                                onChange={(e) => setReportForm({ ...reportForm, phone: e.target.value })}
                              />
                            </div>
                          </>
                        )}

                        <div className={styles.formGroup}>
                          <label htmlFor="commRole">Your Platform Role *</label>
                          <select
                            id="commRole"
                            required
                            value={reportForm.role}
                            onChange={(e) => setReportForm({ ...reportForm, role: e.target.value })}
                          >
                            <option value="Client / Customer">Client / Customer</option>
                            <option value="Technician / Artisan">Technician / Artisan</option>
                            <option value="Engineer / Specialist">Engineer / Specialist</option>
                            <option value="Company / Contractor">Company / Contractor</option>
                            <option value="B-Market Merchant">B-Market Merchant</option>
                            <option value="Third-Party Observer">Third-Party Observer</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* SECTION 2: Offending Party Details */}
                    <div className={styles.formBlock}>
                      <div className={styles.blockTitle}>
                        <iconify-icon icon="lucide:user-x" /> 2. Subject / Offending Party Details
                      </div>
                      <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                          <label htmlFor="commUser">Reported Username / Profile / Company Name</label>
                          <input
                            type="text"
                            id="commUser"
                            placeholder="e.g. @username or business name"
                            value={reportForm.user}
                            onChange={(e) => setReportForm({ ...reportForm, user: e.target.value })}
                          />
                        </div>

                        <div className={styles.formGroup}>
                          <label htmlFor="commOffenderRole">Role of Offending Party</label>
                          <select
                            id="commOffenderRole"
                            value={reportForm.offenderRole}
                            onChange={(e) => setReportForm({ ...reportForm, offenderRole: e.target.value })}
                          >
                            <option value="Technician / Service Provider">Technician / Service Provider</option>
                            <option value="Client / Customer">Client / Customer</option>
                            <option value="Contractor / General Builder">Contractor / General Builder</option>
                            <option value="B-Market Seller">B-Market Seller</option>
                            <option value="Fake / Impersonating Profile">Fake / Impersonating Profile</option>
                          </select>
                        </div>

                        <div className={`${styles.formGroup} ${styles.formFull}`}>
                          <label htmlFor="commRef">Task, Project, or Order Reference ID</label>
                          <input
                            type="text"
                            id="commRef"
                            placeholder="e.g. TSK-4091 or quotation reference if applicable"
                            value={reportForm.reference}
                            onChange={(e) => setReportForm({ ...reportForm, reference: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>

                    {/* SECTION 3: Violation Category & Severity */}
                    <div className={styles.formBlock}>
                      <div className={styles.blockTitle}>
                        <iconify-icon icon="lucide:alert-triangle" /> 3. Violation Category &amp; Severity
                      </div>
                      <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                          <label htmlFor="commConcern">Violation Nature *</label>
                          <select
                            id="commConcern"
                            required
                            value={reportForm.concern}
                            onChange={(e) => setReportForm({ ...reportForm, concern: e.target.value })}
                          >
                            <option value="Harassment / Verbal Abuse">Harassment / Verbal Abuse</option>
                            <option value="Fake Profile / Impersonation">Fake Profile / Impersonation</option>
                            <option value="Fraud / Payment Extortion">Fraud / Payment Extortion</option>
                            <option value="False Certifications / Fake Licenses">False Certifications / Fake Licenses</option>
                            <option value="Unsafe Site Conduct / Endangerment">Unsafe Site Conduct / Endangerment</option>
                            <option value="Review Extortion / Fake Ratings">Review Extortion / Fake Ratings</option>
                            <option value="Platform Circumvention Demand">Platform Circumvention Demand</option>
                            <option value="Spam / Solicitations">Spam / Unsolicited Marketing</option>
                            <option value="Other">Other Community Policy Breach</option>
                          </select>
                        </div>

                        <div className={styles.formGroup}>
                          <label htmlFor="commSeverity">Incident Severity *</label>
                          <select
                            id="commSeverity"
                            value={reportForm.severity}
                            onChange={(e) => setReportForm({ ...reportForm, severity: e.target.value })}
                          >
                            <option value="Critical / Immediate Risk">Critical / Immediate Risk</option>
                            <option value="High / Repeated Infraction">High / Repeated Infraction</option>
                            <option value="Medium / Policy Violation">Medium / Policy Violation</option>
                            <option value="Low / Informational Notice">Low / Informational Notice</option>
                          </select>
                        </div>

                        <div className={styles.formGroup}>
                          <label htmlFor="commDate">Approximate Date of Incident</label>
                          <input
                            type="text"
                            id="commDate"
                            placeholder="e.g. Yesterday morning / 28 Sept"
                            value={reportForm.incidentDate}
                            onChange={(e) => setReportForm({ ...reportForm, incidentDate: e.target.value })}
                          />
                        </div>

                        <div className={styles.formGroup}>
                          <label htmlFor="commContact">Preferred Follow-up Channel</label>
                          <select
                            id="commContact"
                            value={reportForm.contact}
                            onChange={(e) => setReportForm({ ...reportForm, contact: e.target.value })}
                          >
                            <option value="Email">Official Email</option>
                            <option value="Phone">Phone / WhatsApp Call</option>
                            <option value="Platform Message">Direct Platform Message</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* SECTION 4: Statement */}
                    <div className={styles.formBlock}>
                      <div className={styles.blockTitle}>
                        <iconify-icon icon="lucide:file-text" /> 4. Detailed Statement &amp; Chronology
                      </div>
                      <div className={`${styles.formGroup} ${styles.formFull}`}>
                        <label htmlFor="commDesc">What Happened? *</label>
                        <textarea
                          id="commDesc"
                          rows={4}
                          placeholder="Describe the incident clearly: what occurred, location/channel, exact words or conduct, and actions taken..."
                          required
                          value={reportForm.description}
                          onChange={(e) => setReportForm({ ...reportForm, description: e.target.value })}
                        ></textarea>
                      </div>
                    </div>

                    {/* SECTION 5: Evidence Upload */}
                    <div className={styles.formBlock}>
                      <div className={styles.blockTitle}>
                        <iconify-icon icon="lucide:paperclip" /> 5. Supporting Screenshots &amp; Evidence
                      </div>
                      <label className={styles.uploadZone}>
                        <input
                          type="file"
                          multiple
                          style={{ display: "none" }}
                          onChange={handleFileUpload}
                          accept=".png,.jpg,.jpeg,.pdf,.doc,.docx"
                        />
                        <iconify-icon icon="lucide:upload-cloud" style={{ fontSize: "24px", color: "#ff4500" }} />
                        <span style={{ fontSize: "13px", color: "#001F3F", fontWeight: 600 }}>
                          Click to upload chat screenshots, photos, or documents (PNG, JPG, PDF up to 20MB)
                        </span>
                      </label>

                      {attachedFiles.length > 0 ? (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "10px" }}>
                          {attachedFiles.map((name, idx) => (
                            <span key={idx} className={styles.fileBadge}>
                              📎 {name}
                              <button type="button" onClick={() => removeFile(idx)} className={styles.fileRemove}>
                                ✕
                              </button>
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p style={{ fontSize: "12px", color: "#94a3b8", margin: "6px 0 0 0" }}>No evidence files attached yet.</p>
                      )}
                    </div>

                    <button type="submit" disabled={submitting} className={styles.submitBtn}>
                      {submitting ? "Submitting Incident Report..." : "Submit Formal Community Report"}
                    </button>
                  </form>
                </div>

                {/* RELATED RESOURCES */}
                <div className={styles.resources}>
                  <div className={styles.resourceItem}>
                    <strong>Safety Center</strong>
                    <span>Practical guidance for safer hiring, working, payments and projects.</span>
                    <Link href="/safety">Open →</Link>
                  </div>
                  <div className={styles.resourceItem}>
                    <strong>Trust &amp; Safety</strong>
                    <span>Learn how Boulot Man approaches verification, platform trust and protection.</span>
                    <Link href="/legal">Open →</Link>
                  </div>
                  <div className={styles.resourceItem}>
                    <strong>Verification</strong>
                    <span>Understand identity, professional and company verification.</span>
                    <Link href="/signup/verify">Open →</Link>
                  </div>
                  <div className={styles.resourceItem}>
                    <strong>Reviews &amp; Ratings Policy</strong>
                    <span>Detailed rules governing reviews, ratings and reputation.</span>
                    <Link href="/legal">Open →</Link>
                  </div>
                  <div className={styles.resourceItem}>
                    <strong>Help Center</strong>
                    <span>Find assistance with accounts, tasks, projects and payments.</span>
                    <Link href="/help-center">Open →</Link>
                  </div>
                </div>
              </section>
            </main>
          </div>
        </div>
      </section>

      {/* =========================================================
           CLOSING
      ========================================================== */}
      <section className={styles.closing}>
        <div className={styles.container}>
          <div className={styles.closingInner}>
            <small>The community belongs to everyone who uses it</small>
            <h2>Do good work. Treat people well. Build trust.</h2>
            <p>
              Boulot Man works best when clients can hire with confidence, professionals can work with
              dignity, companies can build credible reputations and every participant understands that
              their conduct affects the wider community.
            </p>
            <div className={styles.closingActions}>
              <Link href="/help-center" className={styles.closingPrimary}>
                Visit Help Center
              </Link>
              <Link href="/legal" className={styles.closingSecondary}>
                Legal Center
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
