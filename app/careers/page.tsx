"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import styles from "./careers.module.css";

interface JobPosition {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
}

const JOBS_DATA: JobPosition[] = [
  {
    id: "fs-eng",
    title: "Senior Full-Stack Engineer (Next.js / Django)",
    department: "Engineering",
    location: "Remote (Pan-Africa) / Kigali",
    type: "Full-time",
    experience: "4+ years",
  },
  {
    id: "mob-eng",
    title: "Mobile App Engineer (React Native / iOS & Android)",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    experience: "3+ years",
  },
  {
    id: "escrow-ops",
    title: "Escrow & Dispute Resolution Officer",
    department: "Operations & Trust",
    location: "Kigali / Douala / Remote",
    type: "Full-time",
    experience: "2+ years",
  },
  {
    id: "ent-lead",
    title: "Enterprise Sales & Contractor Partnerships Lead",
    department: "Sales & Growth",
    location: "Nairobi / Lagos / Kigali",
    type: "Full-time",
    experience: "5+ years",
  },
  {
    id: "vetting-spec",
    title: "Technician Quality & Skills Vetting Specialist",
    department: "Operations & Trust",
    location: "Remote",
    type: "Full-time",
    experience: "2+ years",
  },
  {
    id: "cs-lead",
    title: "Customer Support & Dispatch Lead (Bilingual EN/FR)",
    department: "Customer Experience",
    location: "Remote",
    type: "Full-time",
    experience: "2+ years",
  },
];

export default function CareersPage() {
  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedJob, setSelectedJob] = useState<JobPosition | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", linkedin: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const departments = ["All", "Engineering", "Operations & Trust", "Sales & Growth", "Customer Experience"];

  const filteredJobs = selectedDept === "All" 
    ? JOBS_DATA 
    : JOBS_DATA.filter(j => j.department === selectedDept);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setSelectedJob(null);
      setFormData({ name: "", email: "", phone: "", linkedin: "", message: "" });
    }, 2500);
  };

  return (
    <div className={styles.page}>
      <Header />

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <iconify-icon icon="lucide:rocket" /> Work With High Impact
          </div>
          <h1 className={styles.heroTitle}>Build the Operating System for African Labor</h1>
          <p className={styles.heroSubtitle}>
            Join our mission to connect millions of skilled technicians, engineers, and companies with verified opportunities, transparent contracts, and guaranteed escrow payments.
          </p>
        </div>
      </section>

      <main className={styles.container}>
        {/* CULTURE & PERKS */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Why Work at Boulot Man?</h2>
            <p className={styles.sectionDesc}>
              We are a high-velocity, mission-driven team committed to technical excellence and real-world African economic empowerment.
            </p>
          </div>

          <div className={styles.grid3}>
            <div className={styles.benefitCard}>
              <div className={styles.benefitIconWrap}>
                <iconify-icon icon="lucide:globe-2" />
              </div>
              <h3 className={styles.benefitTitle}>Pan-African Remote First</h3>
              <p className={styles.benefitDesc}>
                Work from anywhere across Africa or join our regional innovation hubs with full flexibility and autonomy.
              </p>
            </div>

            <div className={styles.benefitCard}>
              <div className={styles.benefitIconWrap}>
                <iconify-icon icon="lucide:award" />
              </div>
              <h3 className={styles.benefitTitle}>Competitive Compensation &amp; Equity</h3>
              <p className={styles.benefitDesc}>
                We offer competitive salaries benchmarked globally, stock options, and performance incentives.
              </p>
            </div>

            <div className={styles.benefitCard}>
              <div className={styles.benefitIconWrap}>
                <iconify-icon icon="lucide:heart-pulse" />
              </div>
              <h3 className={styles.benefitTitle}>Comprehensive Health &amp; Wellness</h3>
              <p className={styles.benefitDesc}>
                Top-tier medical coverage for you and your dependents, mental health support, and equipment stipends.
              </p>
            </div>
          </div>
        </section>

        {/* OPEN POSITIONS */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Open Positions</h2>
            <p className={styles.sectionDesc}>
              Find your next career chapter and help scale Africa&apos;s leading technical services infrastructure.
            </p>
          </div>

          {/* Department Filter Tabs */}
          <div className={styles.filterTabs}>
            {departments.map((dept) => (
              <button
                type="button"
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`${styles.filterBtn} ${selectedDept === dept ? styles.filterBtnActive : ""}`}
              >
                {dept}
              </button>
            ))}
          </div>

          {/* Job Cards */}
          <div className={styles.jobsList}>
            {filteredJobs.map((job) => (
              <div key={job.id} className={styles.jobCard}>
                <div className={styles.jobInfo}>
                  <span className={styles.jobDept}>{job.department}</span>
                  <h3 className={styles.jobTitle}>{job.title}</h3>
                  <div className={styles.jobMeta}>
                    <span className={styles.jobMetaItem}>
                      <iconify-icon icon="lucide:map-pin" /> {job.location}
                    </span>
                    <span className={styles.jobMetaItem}>
                      <iconify-icon icon="lucide:clock" /> {job.type}
                    </span>
                    <span className={styles.jobMetaItem}>
                      <iconify-icon icon="lucide:briefcase" /> {job.experience}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedJob(job)}
                  className={styles.applyBtn}
                >
                  Apply Now <iconify-icon icon="lucide:arrow-right" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* CTA BANNER */}
        <section className={styles.cta}>
          <div>
            <h2 className={styles.ctaTitle}>Don&apos;t See the Right Role?</h2>
            <p className={styles.ctaDesc}>
              We are always seeking exceptional engineering, operations, and product talent. Submit an open speculative application.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSelectedJob({
              id: "speculative",
              title: "General / Speculative Application",
              department: "General Talent",
              location: "Remote",
              type: "Full-time / Part-time",
              experience: "Any Level",
            })}
            className={styles.ctaBtn}
          >
            Submit General Application <iconify-icon icon="lucide:send" />
          </button>
        </section>
      </main>

      <Footer />

      {/* JOB APPLICATION MODAL */}
      {selectedJob && (
        <div className={styles.modalOverlay} onClick={() => setSelectedJob(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setSelectedJob(null)}>×</button>
            <h2>Apply: {selectedJob.title}</h2>
            <p style={{ color: "#64748b", fontSize: "14px", margin: "0 0 20px" }}>
              {selectedJob.department} • {selectedJob.location}
            </p>

            {submitted ? (
              <div className={styles.successMsg}>
                🎉 Thank you for applying! Our talent acquisition team will review your application within 48 hours.
              </div>
            ) : (
              <form onSubmit={handleApply}>
                <div className={styles.formGroup}>
                  <label>Full Name</label>
                  <input
                    required
                    type="text"
                    placeholder="Jane Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Email Address</label>
                  <input
                    required
                    type="email"
                    placeholder="jane@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Phone / WhatsApp</label>
                  <input
                    required
                    type="tel"
                    placeholder="+250 788 123 456"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>LinkedIn / Portfolio URL</label>
                  <input
                    type="url"
                    placeholder="https://linkedin.com/in/username"
                    value={formData.linkedin}
                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Cover Note / Why Boulot Man?</label>
                  <textarea
                    rows={3}
                    placeholder="Tell us about your background and what excites you about our mission..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <button type="submit" className={styles.submitBtn}>
                  Submit Application <iconify-icon icon="lucide:send" />
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
