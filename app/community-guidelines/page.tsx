"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
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
    role: "",
    concern: "",
    user: "",
    reference: "",
    description: "",
    contact: "Email"
  });
  const [reportSubmitted, setReportSubmitted] = useState(false);

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

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReportSubmitted(true);
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
                    <h3 className={styles.reportFormTitle}>Community Report</h3>

                    {reportSubmitted && (
                      <div style={{ padding: "16px", background: "#ecfdf5", border: "1px solid #a7f3d0", color: "#065f46", borderRadius: "8px", marginBottom: "16px", fontSize: "13.5px" }}>
                        ✓ Your report has been submitted to the Boulot Man moderation team for investigation.
                      </div>
                    )}

                    <div className={styles.formGrid}>
                      <div className={styles.formGroup}>
                        <label htmlFor="commName">Your Name</label>
                        <input
                          type="text"
                          id="commName"
                          required
                          value={reportForm.name}
                          onChange={(e) => setReportForm({ ...reportForm, name: e.target.value })}
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label htmlFor="commEmail">Email Address</label>
                        <input
                          type="email"
                          id="commEmail"
                          required
                          value={reportForm.email}
                          onChange={(e) => setReportForm({ ...reportForm, email: e.target.value })}
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label htmlFor="commRole">Your Role</label>
                        <select
                          id="commRole"
                          required
                          value={reportForm.role}
                          onChange={(e) => setReportForm({ ...reportForm, role: e.target.value })}
                        >
                          <option value="">Select role</option>
                          <option>Client</option>
                          <option>Technician / Professional</option>
                          <option>Engineer</option>
                          <option>Company</option>
                          <option>Contractor</option>
                          <option>B-Market Seller</option>
                          <option>Other</option>
                        </select>
                      </div>

                      <div className={styles.formGroup}>
                        <label htmlFor="commConcern">Concern Type</label>
                        <select
                          id="commConcern"
                          required
                          value={reportForm.concern}
                          onChange={(e) => setReportForm({ ...reportForm, concern: e.target.value })}
                        >
                          <option value="">Select concern</option>
                          <option>Fake Account / Impersonation</option>
                          <option>Fraud / Deception</option>
                          <option>Harassment / Threat</option>
                          <option>False Credentials</option>
                          <option>Unsafe Conduct</option>
                          <option>Review Manipulation</option>
                          <option>Misleading Marketplace Listing</option>
                          <option>Spam / Unwanted Solicitation</option>
                          <option>Other</option>
                        </select>
                      </div>

                      <div className={styles.formGroup}>
                        <label htmlFor="commUser">Username / Company Reported</label>
                        <input
                          type="text"
                          id="commUser"
                          placeholder="Optional"
                          value={reportForm.user}
                          onChange={(e) => setReportForm({ ...reportForm, user: e.target.value })}
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label htmlFor="commRef">Task / Project Reference</label>
                        <input
                          type="text"
                          id="commRef"
                          placeholder="Optional"
                          value={reportForm.reference}
                          onChange={(e) => setReportForm({ ...reportForm, reference: e.target.value })}
                        />
                      </div>

                      <div className={`${styles.formGroup} ${styles.formFull}`}>
                        <label htmlFor="commDesc">What Happened?</label>
                        <textarea
                          id="commDesc"
                          placeholder="Describe the conduct and provide any relevant details."
                          required
                          value={reportForm.description}
                          onChange={(e) => setReportForm({ ...reportForm, description: e.target.value })}
                        ></textarea>
                      </div>

                      <div className={`${styles.formGroup} ${styles.formFull}`}>
                        <label htmlFor="commContact">Preferred Contact Method</label>
                        <select
                          id="commContact"
                          value={reportForm.contact}
                          onChange={(e) => setReportForm({ ...reportForm, contact: e.target.value })}
                        >
                          <option>Email</option>
                          <option>Phone</option>
                          <option>Platform Message</option>
                        </select>
                      </div>
                    </div>

                    <button type="submit" className={styles.submitBtn}>
                      Submit Community Report
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
