"use client";

import React, { useState } from "react";
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import styles from "./contractors.module.css";

const SERVICES_CAPABILITIES = [
  {
    num: "01",
    title: "Building & Construction",
    description: "Residential, commercial and institutional construction, renovation, structural works, finishing and coordinated site execution."
  },
  {
    num: "02",
    title: "Electrical & Power Systems",
    description: "Electrical installations, power distribution, generators, industrial systems, earthing, lighting, controls and commissioning."
  },
  {
    num: "03",
    title: "Plumbing & Water Systems",
    description: "Plumbing networks, pumping systems, tanks, drainage, water treatment, borehole-related works and utility installations."
  },
  {
    num: "04",
    title: "Mechanical & HVAC",
    description: "Mechanical installation, HVAC, industrial equipment, pumps, motors, fabrication, maintenance and technical system upgrades."
  },
  {
    num: "05",
    title: "Solar & Renewable Energy",
    description: "Solar PV systems, battery storage, inverters, commercial energy systems, installation teams and technical commissioning."
  },
  {
    num: "06",
    title: "Technology & Digital Infrastructure",
    description: "Software platforms, mobile applications, networking, cloud systems, IT infrastructure, APIs, cybersecurity and enterprise technology projects."
  },
  {
    num: "07",
    title: "Telecom & Connectivity",
    description: "Fiber installations, communication infrastructure, towers, wireless networks, VSAT and technical connectivity deployments."
  },
  {
    num: "08",
    title: "Facilities & Maintenance",
    description: "Planned maintenance, repairs, facility support, preventive servicing and coordinated technical maintenance contracts."
  },
  {
    num: "09",
    title: "Specialized Technical Projects",
    description: "Custom project teams can be assembled for specialized engineering, infrastructure, industrial and multidisciplinary assignments."
  }
];

const PROCESS_STEPS = [
  {
    num: "1",
    title: "Project Assessment",
    description: "Boulot Man reviews the project objectives, location, drawings, technical requirements, budget and expected delivery schedule."
  },
  {
    num: "2",
    title: "Planning & Team Formation",
    description: "The project is divided into scopes and suitable companies, technicians, engineers and subcontractors are identified."
  },
  {
    num: "3",
    title: "Proposal & Milestones",
    description: "Deliverables, costs, timelines, responsibilities and payment milestones are structured for approval."
  },
  {
    num: "4",
    title: "Project Execution",
    description: "Teams are mobilized, work begins and progress is coordinated against the approved project plan."
  },
  {
    num: "5",
    title: "Inspection & Handover",
    description: "Completed stages are reviewed, final work is inspected and project records are prepared for handover."
  }
];

const PROJECT_SCALES = [
  {
    tag: "Construction",
    title: "Commercial & Residential Projects",
    description: "New construction, renovation, finishing, extensions and multidisciplinary building works."
  },
  {
    tag: "Institutional",
    title: "Offices, Schools & Facilities",
    description: "Technical upgrades, infrastructure, maintenance and structured execution for organizations."
  },
  {
    tag: "Industrial",
    title: "Equipment & Technical Installations",
    description: "Mechanical, electrical, industrial and specialized installation assignments requiring coordinated teams."
  },
  {
    tag: "Technology",
    title: "Enterprise Digital Projects",
    description: "Applications, systems integration, networking, infrastructure and technical deployment projects."
  }
];

const WHO_IT_SERVES = [
  {
    title: "Property Owners",
    description: "Execute construction, renovation and technical improvement projects without coordinating every trade independently."
  },
  {
    title: "Businesses",
    description: "Deploy technical upgrades, maintenance, facilities, digital systems and commercial projects through one structured delivery framework."
  },
  {
    title: "Institutions & Organizations",
    description: "Access technical capacity for multi-service projects, infrastructure, maintenance and specialist execution."
  },
  {
    title: "Diaspora Clients",
    description: "Execute projects remotely with organized supervision, milestone reporting and accountable local teams."
  }
];

export default function ContractorsPage() {
  const [formData, setFormData] = useState({
    clientName: "",
    clientType: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    category: "",
    budget: "",
    projectTitle: "",
    description: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
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
              <div className={styles.eyebrow}>Boulot Man Contractors</div>
              <h1>Enterprise-Grade Project Execution Across Africa</h1>
              <p className={styles.heroCopy}>
                Boulot Man Contractors is the project execution arm of Boulot Man,
                designed for clients, organizations, property owners and institutions
                that need complete technical projects delivered through coordinated,
                professionally managed teams.
              </p>
              <div className={styles.heroActions}>
                <a href="#request-project" className={`${styles.btn} ${styles.btnPrimary}`}>
                  Request Project Execution
                </a>
                <a href="#services" className={`${styles.btn} ${styles.btnSecondary}`}>
                  Explore Our Capabilities
                </a>
              </div>
            </div>

            <aside className={styles.heroCard}>
              <h2>One coordinated execution partner</h2>
              <ul className={styles.heroList}>
                <li>Project planning and scope organization.</li>
                <li>Mobilization of verified companies, technicians and engineers.</li>
                <li>Procurement and subcontractor coordination.</li>
                <li>Milestone-based project supervision.</li>
                <li>Progress reporting and quality control.</li>
                <li>Structured B-Pay and project payment workflows.</li>
              </ul>
            </aside>
          </div>
        </div>
      </section>

      {/* =====================================================
           INTRO STRIP
      ====================================================== */}
      <section className={styles.intro}>
        <div className={styles.container}>
          <div className={styles.introGrid}>
            <div className={styles.introItem}>
              <strong>Single Project Coordination</strong>
              <span>One structured execution framework for multiple trades, teams and subcontractors.</span>
            </div>
            <div className={styles.introItem}>
              <strong>Verified Workforce</strong>
              <span>Projects are staffed through qualified technicians, engineers, companies and specialists.</span>
            </div>
            <div className={styles.introItem}>
              <strong>Milestone Control</strong>
              <span>Execution can be divided into measurable stages with approvals, evidence and payment controls.</span>
            </div>
            <div className={styles.introItem}>
              <strong>Africa-Focused Delivery</strong>
              <span>Built for local conditions, technical capacity and project realities across African markets.</span>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
           WHAT IS CONTRACTORS
      ====================================================== */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <div className={styles.sectionHeadCopy}>
              <div className={styles.kicker}>About the service</div>
              <h2 className={styles.title}>More Than Finding a Technician or Company</h2>
              <p className={styles.copy}>
                When a project requires several professionals, multiple trades, structured supervision
                and continuous coordination, Boulot Man Contractors provides a more complete execution model.
              </p>
            </div>
          </div>

          <div className={styles.definitionGrid}>
            <article className={styles.definitionCard}>
              <h3>Boulot Man acts as the project execution partner</h3>
              <p>
                Instead of requiring the client to separately search for electricians, plumbers, masons,
                engineers, carpenters, software teams, equipment operators or specialized companies, the
                project can be organized under a coordinated Boulot Man execution structure.
              </p>
              <p>
                The required workforce, companies and subcontractors are selected according to the project
                scope, technical requirements, location, budget, capacity and delivery schedule.
              </p>
            </article>

            <aside className={styles.highlightCard}>
              <h3>Suitable when your project needs:</h3>
              <ul className={styles.highlightList}>
                <li>Several technicians or engineering disciplines.</li>
                <li>A dedicated project manager or supervisor.</li>
                <li>Procurement and materials coordination.</li>
                <li>Multiple subcontractors.</li>
                <li>Milestones, inspections and progress reporting.</li>
                <li>One accountable project execution structure.</li>
              </ul>
            </aside>
          </div>
        </div>
      </section>

      {/* =====================================================
           CAPABILITIES / SERVICES
      ====================================================== */}
      <section className={`${styles.section} ${styles.sectionSoft}`} id="services">
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <div className={styles.sectionHeadCopy}>
              <div className={styles.kicker}>Execution capabilities</div>
              <h2 className={styles.title}>Projects We Can Coordinate and Execute</h2>
              <p className={styles.copy}>
                Boulot Man Contractors can organize technical teams, specialist companies and project
                partners around defined scopes across multiple industries.
              </p>
            </div>
          </div>

          <div className={styles.servicesGrid}>
            {SERVICES_CAPABILITIES.map((srv, idx) => (
              <article key={idx} className={styles.serviceCard}>
                <div className={styles.serviceIcon}>{srv.num}</div>
                <h3>{srv.title}</h3>
                <p>{srv.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
           PROCESS
      ====================================================== */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <div className={styles.sectionHeadCopy}>
              <div className={styles.kicker}>Project workflow</div>
              <h2 className={styles.title}>From Project Request to Final Handover</h2>
              <p className={styles.copy}>
                Each project can be structured around scope, responsibilities, milestones, evidence and approvals
                before execution begins.
              </p>
            </div>
          </div>

          <div className={styles.processGrid}>
            {PROCESS_STEPS.map((step, idx) => (
              <article key={idx} className={styles.processCard}>
                <div className={styles.processNumber}>{step.num}</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
           PROJECT SCALE
      ====================================================== */}
      <section className={`${styles.section} ${styles.sectionDark}`}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <div className={styles.sectionHeadCopy}>
              <div className={styles.kicker}>Project scale</div>
              <h2 className={styles.title}>Built for Projects That Need More Structure</h2>
              <p className={styles.copy}>
                Boulot Man Contractors is intended for assignments where coordination, capability and
                accountability are more important than simply hiring one individual service provider.
              </p>
            </div>
          </div>

          <div className={styles.projectGrid}>
            {PROJECT_SCALES.map((scale, idx) => (
              <article key={idx} className={styles.projectCard}>
                <span>{scale.tag}</span>
                <h3>{scale.title}</h3>
                <p>{scale.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
           DELIVERY MODEL
      ====================================================== */}
      <section className={`${styles.section} ${styles.sectionSoft}`}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <div className={styles.sectionHeadCopy}>
              <div className={styles.kicker}>Execution structure</div>
              <h2 className={styles.title}>A Coordinated Project Delivery Model</h2>
            </div>
          </div>

          <div className={styles.deliveryGrid}>
            <article className={styles.deliveryCard}>
              <h3>Project Management</h3>
              <p>Boulot Man can coordinate the overall execution structure and maintain visibility over project progress.</p>
              <ul className={styles.deliveryList}>
                <li>Project schedules</li>
                <li>Milestone tracking</li>
                <li>Progress reporting</li>
                <li>Issue escalation</li>
              </ul>
            </article>

            <article className={styles.deliveryCard}>
              <h3>Workforce &amp; Subcontractors</h3>
              <p>Appropriate specialists can be mobilized from the wider Boulot Man network according to project requirements.</p>
              <ul className={styles.deliveryList}>
                <li>Verified technicians</li>
                <li>Engineers and supervisors</li>
                <li>Specialized companies</li>
                <li>Subcontracting teams</li>
              </ul>
            </article>

            <article className={styles.deliveryCard}>
              <h3>Quality &amp; Documentation</h3>
              <p>Project activities can be supported with structured evidence, inspections, approvals and handover records.</p>
              <ul className={styles.deliveryList}>
                <li>Work evidence</li>
                <li>Inspection records</li>
                <li>Client approvals</li>
                <li>Final handover</li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      {/* =====================================================
           WHO USES CONTRACTORS
      ====================================================== */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <div className={styles.sectionHeadCopy}>
              <div className={styles.kicker}>Who it serves</div>
              <h2 className={styles.title}>Designed for Serious Project Owners</h2>
            </div>
          </div>

          <div className={styles.usersGrid}>
            {WHO_IT_SERVES.map((user, idx) => (
              <article key={idx} className={styles.userCard}>
                <h3>{user.title}</h3>
                <p>{user.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
           TRUST + PAYMENT
      ====================================================== */}
      <section className={`${styles.section} ${styles.sectionSoft}`}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <div className={styles.sectionHeadCopy}>
              <div className={styles.kicker}>Control &amp; accountability</div>
              <h2 className={styles.title}>Structured Around Verification, Milestones and Secure Payments</h2>
            </div>
          </div>

          <div className={styles.trustGrid}>
            <article className={styles.trustCard}>
              <h3>Verified Project Participants</h3>
              <p>Appropriate verification can be required before professionals, companies or subcontractors are assigned to sensitive or higher-value project scopes.</p>
              <ul className={styles.trustList}>
                <li>Identity verification</li>
                <li>Company verification</li>
                <li>Capability review</li>
                <li>Licence and certification checks where applicable</li>
                <li>Project history and reputation</li>
              </ul>
            </article>

            <article className={styles.trustCard}>
              <h3>B-Pay, Escrow &amp; Milestones</h3>
              <p>Eligible projects can use B-Pay and structured milestone workflows so that project funds, approvals and release conditions are better aligned with actual work progress.</p>
              <ul className={styles.trustList}>
                <li>Defined project milestones</li>
                <li>Secured project funding</li>
                <li>Work submission and evidence</li>
                <li>Client review and approval</li>
                <li>Controlled payment release</li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      {/* =====================================================
           REQUEST PROJECT FORM
      ====================================================== */}
      <section className={styles.requestSection} id="request-project">
        <div className={styles.container}>
          <div className={styles.requestGrid}>
            <div className={styles.requestCopy}>
              <h2>Tell Boulot Man About Your Project</h2>
              <p>
                Submit the basic project information and our project team can review the scope before
                determining the appropriate execution structure, workforce, subcontractors and delivery approach.
              </p>
              <ul className={styles.requestPoints}>
                <li>Construction and renovation projects</li>
                <li>Engineering and technical installations</li>
                <li>Corporate and institutional projects</li>
                <li>Technology and infrastructure deployments</li>
                <li>Multi-trade maintenance contracts</li>
                <li>Remote or diaspora-managed projects</li>
              </ul>
            </div>

            <form className={styles.formCard} onSubmit={handleSubmit}>
              <h3>Request Project Review</h3>
              <p>Provide enough information for an initial project assessment.</p>

              {submitted && (
                <div className={styles.successMsg}>
                  <span>✓</span>
                  <span>Your project request has been submitted to Boulot Man Contractors for initial review. We will contact you shortly.</span>
                </div>
              )}

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="clientName">Your Name</label>
                  <input
                    type="text"
                    id="clientName"
                    required
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="clientType">Client Type</label>
                  <select
                    id="clientType"
                    required
                    value={formData.clientType}
                    onChange={(e) => setFormData({ ...formData, clientType: e.target.value })}
                  >
                    <option value="">Select</option>
                    <option>Individual / Property Owner</option>
                    <option>Business</option>
                    <option>Organization / NGO</option>
                    <option>Institution</option>
                    <option>Developer / Contractor</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="phone">Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="country">Country</label>
                  <select
                    id="country"
                    required
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  >
                    <option value="">Select country</option>
                    <option>Cameroon</option>
                    <option>Rwanda</option>
                    <option>Nigeria</option>
                    <option>Ivory Coast</option>
                    <option>Ghana</option>
                    <option>Kenya</option>
                    <option>South Africa</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="city">Project City</label>
                  <input
                    type="text"
                    id="city"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="category">Project Category</label>
                  <select
                    id="category"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="">Select category</option>
                    <option>Construction</option>
                    <option>Renovation</option>
                    <option>Electrical</option>
                    <option>Plumbing / Water</option>
                    <option>Mechanical / HVAC</option>
                    <option>Solar / Energy</option>
                    <option>IT / Technology</option>
                    <option>Telecom</option>
                    <option>Facilities / Maintenance</option>
                    <option>Specialized Engineering</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="budget">Estimated Budget</label>
                  <select
                    id="budget"
                    required
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  >
                    <option value="">Select range</option>
                    <option>Under $5,000</option>
                    <option>$5,000 – $25,000</option>
                    <option>$25,000 – $100,000</option>
                    <option>$100,000 – $500,000</option>
                    <option>$500,000+</option>
                    <option>Not yet determined</option>
                  </select>
                </div>

                <div className={`${styles.formGroup} ${styles.formFull}`}>
                  <label htmlFor="projectTitle">Project Title</label>
                  <input
                    type="text"
                    id="projectTitle"
                    placeholder="e.g. Commercial Building Renovation"
                    required
                    value={formData.projectTitle}
                    onChange={(e) => setFormData({ ...formData, projectTitle: e.target.value })}
                  />
                </div>

                <div className={`${styles.formGroup} ${styles.formFull}`}>
                  <label htmlFor="description">Project Description</label>
                  <textarea
                    id="description"
                    placeholder="Describe the project, major work required, expected timeline and any important technical information."
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  ></textarea>
                </div>
              </div>

              <button type="submit" className={styles.submitBtn}>
                Submit Project for Review
              </button>
            </form>
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
              <h2>Are You a Company Interested in Working on Boulot Man Projects?</h2>
              <p>
                Verified companies and capable service providers can participate in subcontracting
                opportunities and project execution assignments across the Boulot Man network.
              </p>
            </div>
            <Link href="/signup?role=company" className={`${styles.btn} ${styles.btnPrimary}`}>
              Join as a Company
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
