"use client";

import React, { useState } from "react";
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import styles from "./trust.module.css";

interface TrustSection {
  id: string;
  num: number;
  title: string;
  category: "verification" | "reputation" | "security" | "payments" | "workplace" | "disputes" | "checklists" | "responsibility" | "safety";
  content: string[];
  subsections?: { title: string; items: string[] }[];
  listItems?: string[];
  callout?: string;
  directory?: string[];
}

const TRUST_SECTIONS: TrustSection[] = [
  {
    id: "sec-1",
    num: 1,
    title: "OUR APPROACH TO TRUST",
    category: "verification",
    content: [
      "Boulot Man is designed around a simple principle: Know who you are dealing with, understand what they can do, document the agreement, and maintain accountability throughout the engagement.",
      "Trust on Boulot Man does not depend only on a name or profile picture. Users are evaluated using Verified identity, contact details, professional qualifications, company registration, licences, certifications, work history, ratings, completed projects, responsiveness, and dispute history."
    ]
  },
  {
    id: "sec-2",
    num: 2,
    title: "ACCOUNT VERIFICATION",
    category: "verification",
    content: [
      "Boulot Man requires or offers layered account verification tailored to user roles (Clients, Technicians, Engineers, Independent Professionals, Companies, Contractors, Project Managers, and Agents). Verification may be mandatory before accessing certain high-tier platform features."
    ]
  },
  {
    id: "sec-3",
    num: 3,
    title: "PHONE AND EMAIL VERIFICATION",
    category: "verification",
    content: [
      "Boulot Man verifies mobile phone numbers and email addresses via One-Time Passwords (OTP) and secure verification links, reducing fake accounts and ensuring reliable delivery of security alerts, project updates, and payment notifications."
    ]
  },
  {
    id: "sec-4",
    num: 4,
    title: "IDENTITY VERIFICATION",
    category: "verification",
    content: [
      "Identity verification reviews legal name, date of birth, national ID, passport, residence permit, document images, selfie, and live biometric checks. Identity documents are strictly private and never published publicly."
    ]
  },
  {
    id: "sec-5",
    num: 5,
    title: "TECHNICIAN AND PROFESSIONAL VERIFICATION",
    category: "verification",
    content: [
      "Technicians and Engineers undergo enhanced vetting covering skills, years of experience, trade certifications, professional engineering licences, portfolio evidence, equipment capability, and background references."
    ]
  },
  {
    id: "sec-6",
    num: 6,
    title: "BOULOT MAN PROFESSIONAL VERIFICATION LEVELS",
    category: "verification",
    content: [
      "Boulot Man awards progressive trust levels for professionals:"
    ],
    subsections: [
      {
        title: "Level 1: Identity Verified",
        items: ["Government ID, phone number and email reviewed and validated."]
      },
      {
        title: "Level 2: Professional Verified",
        items: ["Trade qualifications, vocational training, engineering degrees or government trade licences verified."]
      },
      {
        title: "Level 3: Boulot Man Verified Professional",
        items: ["Comprehensive audit combining verified identity, vetted credentials, portfolio review, and proven track record."]
      }
    ]
  },
  {
    id: "sec-7",
    num: 7,
    title: "COMPANY VERIFICATION",
    category: "verification",
    content: [
      "Registered corporate entities undergo business verification validating legal entity name, business registration certificate, tax identification numbers, operating physical address, authorized corporate representative, insurance policies, technical workforce, fleet, and corporate project references."
    ]
  },
  {
    id: "sec-8",
    num: 8,
    title: "COMPANY VERIFICATION LEVELS",
    category: "verification",
    content: [
      "Corporate trust tiers include:"
    ],
    subsections: [
      {
        title: "Registered Company",
        items: ["Basic company registration documents provided and validated."]
      },
      {
        title: "Business Verified",
        items: ["Full business registry certificate, tax registration and authorized director identity reviewed."]
      },
      {
        title: "Capability Verified",
        items: ["Operational capacity, machinery, technical staff, and site equipment inspected."]
      },
      {
        title: "Boulot Man Verified Company & Enterprise",
        items: ["Top-tier vetting for companies executing large commercial, institutional, and high-value tenders."]
      }
    ]
  },
  {
    id: "sec-9",
    num: 9,
    title: "WHAT A VERIFICATION BADGE MEANS",
    category: "verification",
    content: [
      "A verification badge communicates that specified documents and credentials were authenticated at a specific time. Verification does not replace individual project due diligence; clients should still assess individual scope, quotation, and milestones."
    ]
  },
  {
    id: "sec-10",
    num: 10,
    title: "PUBLIC TRUST INDICATORS",
    category: "verification",
    content: [
      "Public profile cards display trust signals (badges, star ratings, review count, completed tasks, years of experience, completion rate, response time) while keeping underlying government IDs and bank numbers strictly confidential."
    ]
  },
  {
    id: "sec-11",
    num: 11,
    title: "RATINGS AND REVIEWS",
    category: "reputation",
    content: [
      "Boulot Man operates an authentic two-way review system. Clients review providers upon project completion, and providers review clients regarding payment promptness, communication, and site safety."
    ]
  },
  {
    id: "sec-12",
    num: 12,
    title: "REVIEW INTEGRITY",
    category: "reputation",
    content: [
      "Buying, selling, faking, or coercing reviews is strictly prohibited. Coordinated rating manipulation results in immediate badge removal and account suspension."
    ]
  },
  {
    id: "sec-13",
    num: 13,
    title: "CLIENT REPUTATION",
    category: "reputation",
    content: [
      "Trust operates both ways. Providers have visibility into client credibility metrics (verified identity, task payment completion rate, cancellation history, and past contractor feedback)."
    ]
  },
  {
    id: "sec-14",
    num: 14,
    title: "PROFESSIONAL PROFILE SAFETY",
    category: "reputation",
    content: [
      "Technicians and engineers must never upload forged certificates, misrepresent licences, or claim another professional's work. Supporting documentary proof may be audited at any time."
    ]
  },
  {
    id: "sec-15",
    num: 15,
    title: "COMPANY PROFILE SAFETY",
    category: "reputation",
    content: [
      "Companies must accurately represent workforce size, equipment, certifications, and insurance. Material misrepresentation triggers corporate verification revocation."
    ]
  },
  {
    id: "sec-16",
    num: 16,
    title: "USERNAME AND IMPERSONATION SAFETY",
    category: "reputation",
    content: [
      "Unique usernames must not impersonate other businesses or deceive users regarding official status. Username changes are restricted to a maximum of 3 times per 30-day window."
    ]
  },
  {
    id: "sec-17",
    num: 17,
    title: "PROTECTING PERSONAL INFORMATION",
    category: "security",
    content: [
      "Users should never publicly post national ID numbers, banking details, passwords, OTPs, or exact home addresses in open task titles. The platform displays badges instead of documents."
    ]
  },
  {
    id: "sec-18",
    num: 18,
    title: "LOCATION PRIVACY",
    category: "security",
    content: [
      "General location (city, district, approximate radius) is used for matchmaking. Exact residential addresses are disclosed only once a task has been officially hired and funded."
    ]
  },
  {
    id: "sec-19",
    num: 19,
    title: "SECURE COMMUNICATION",
    category: "security",
    content: [
      "Users are urged to keep all project discussions on Boulot Man messaging tools to maintain a time-stamped evidentiary audit trail of scope, prices, approvals, and deliverables."
    ]
  },
  {
    id: "sec-20",
    num: 20,
    title: "NEVER SHARE SECURITY CODES",
    category: "security",
    content: [
      "Boulot Man staff will NEVER call or message you asking for your password, PIN, or OTP verification code. Treat any such request as an immediate phishing attempt."
    ]
  },
  {
    id: "sec-21",
    num: 21,
    title: "PHISHING AND FAKE COMMUNICATIONS",
    category: "security",
    content: [
      "Beware of fraudsters claiming urgent fees or guaranteed jobs in exchange for direct cash transfers. Verify suspicious communications through official channels (office@boulotman.com)."
    ]
  },
  {
    id: "sec-22",
    num: 22,
    title: "TASK SAFETY",
    category: "workplace",
    content: [
      "Clients must provide truthful task descriptions and disclose known physical or environmental hazards (electrical risks, chemical hazards, structural weaknesses) before work begins."
    ]
  },
  {
    id: "sec-23",
    num: 23,
    title: "PROFESSIONAL SAFETY BEFORE ACCEPTING WORK",
    category: "workplace",
    content: [
      "Professionals should assess whether work matches their competence, whether licences or PPE are needed, whether site conditions are safe, and ensure clear payment terms before mobilizing."
    ]
  },
  {
    id: "sec-24",
    num: 24,
    title: "SITE SAFETY",
    category: "workplace",
    content: [
      "Physical job sites require appropriate personal protective equipment (PPE), safe electrical isolation, scaffolding safeguards, fire prevention, and compliance with local safety regulations."
    ]
  },
  {
    id: "sec-25",
    num: 25,
    title: "HIGH-RISK AND REGULATED SERVICES",
    category: "workplace",
    content: [
      "High-risk sectors (high-voltage electrical, structural engineering, gas lines, heavy plant machinery) require specialized verified government licences before listings are activated."
    ]
  },
  {
    id: "sec-26",
    num: 26,
    title: "PROHIBITED SERVICES",
    category: "workplace",
    content: [
      "Boulot Man strictly prohibits listings involving fraud, theft, violence, unauthorized surveillance, hacking, illegal substances, human exploitation, or illegal construction."
    ]
  },
  {
    id: "sec-27",
    num: 27,
    title: "PAYMENT SAFETY",
    category: "payments",
    content: [
      "Users should clarify total price, deposit, materials responsibility, milestones, and cancellation conditions before commencement. Platform payment tools provide technical transaction safeguards."
    ]
  },
  {
    id: "sec-28",
    num: 28,
    title: "ESCROW SAFETY",
    category: "payments",
    content: [
      "Escrow protection holds client funds securely until work milestones are verified and approved, protecting clients against non-performance and providers against non-payment."
    ]
  },
  {
    id: "sec-29",
    num: 29,
    title: "MILESTONE SAFETY",
    category: "payments",
    content: [
      "Larger projects should be divided into measurable phases: Milestone 1 (Site Prep), Milestone 2 (Structural), Milestone 3 (MEP/Electrical), Milestone 4 (Finishing), Milestone 5 (Handover)."
    ]
  },
  {
    id: "sec-30",
    num: 30,
    title: "CASH TRANSACTIONS",
    category: "payments",
    content: [
      "Where cash is used, parties must retain signed receipts and platform acknowledgements. Cash payments forfeit automated escrow protections and instant dispute resolution."
    ]
  },
  {
    id: "sec-31",
    num: 31,
    title: "LARGE PROJECT SAFETY",
    category: "payments",
    content: [
      "Major commercial/construction projects require formal written scope, verified companies, valid insurance, BOQs, designated site supervision, and structured milestone approvals."
    ]
  },
  {
    id: "sec-32",
    num: 32,
    title: "BOULOT MAN CONCIERGE SAFETY",
    category: "workplace",
    content: [
      "Concierge services assign dedicated project coordinators for professional sourcing, physical site inspections, work monitoring, and progress reporting under formal agreements."
    ]
  },
  {
    id: "sec-33",
    num: 33,
    title: "BUILD A TEAM SAFETY",
    category: "workplace",
    content: [
      "Multi-disciplinary teams assembled through Build a Team include designated team leaders, supervisors, or engineers responsible for site coordination and safety standards."
    ]
  },
  {
    id: "sec-34",
    num: 34,
    title: "BOULOT MAN CONTRACTORS SAFETY",
    category: "workplace",
    content: [
      "Boulot Man Contractors provides end-to-end enterprise execution with verified corporate contractors, engineering oversight, safety plans, quality milestones, and compliance handover."
    ]
  },
  {
    id: "sec-35",
    num: 35,
    title: "MATERIALS AND PROCUREMENT SAFETY",
    category: "workplace",
    content: [
      "When providers purchase materials on behalf of clients, brands, specifications, invoices, receipts, and ownership of surplus materials must be agreed in writing before purchase."
    ]
  },
  {
    id: "sec-36",
    num: 36,
    title: "PROTECTING CLIENT PROPERTY",
    category: "workplace",
    content: [
      "Providers must respect client property, avoid unauthorized zones, secure tools, report accidental damage immediately, and leave the premises secure."
    ]
  },
  {
    id: "sec-37",
    num: 37,
    title: "PROTECTING PROFESSIONAL PROPERTY",
    category: "workplace",
    content: [
      "Clients must not withhold professional tools, damage machinery, or restrict access to retrieve equipment upon completion or dispute."
    ]
  },
  {
    id: "sec-38",
    num: 38,
    title: "HARASSMENT AND ABUSE",
    category: "safety",
    content: [
      "Zero tolerance for harassment, threats, stalking, physical violence, or sexual misconduct. Violations result in immediate permanent banning and potential criminal referral."
    ]
  },
  {
    id: "sec-39",
    num: 39,
    title: "NON-DISCRIMINATION",
    category: "safety",
    content: [
      "Selection must be based on skills, licences, availability, experience, and project merit. Unlawful discrimination based on race, gender, or religion is strictly prohibited."
    ]
  },
  {
    id: "sec-40",
    num: 40,
    title: "FRAUD PREVENTION",
    category: "security",
    content: [
      "Automated risk scoring, transaction monitoring, and session anomaly detection actively prevent identity theft, payment chargeback scams, and fake review rings."
    ]
  },
  {
    id: "sec-41",
    num: 41,
    title: "SUSPICIOUS ACCOUNT ACTIVITY",
    category: "security",
    content: [
      "Security audits are automatically triggered by unusual login locations, rapid identity changes, repeated payment failures, or sudden high-volume dispute spikes."
    ]
  },
  {
    id: "sec-42",
    num: 42,
    title: "ACCOUNT TAKEOVER PROTECTION",
    category: "security",
    content: [
      "In suspected unauthorized access events, Boulot Man instantly terminates active sessions, enforces password resets, and temporarily locks financial payouts."
    ]
  },
  {
    id: "sec-43",
    num: 43,
    title: "REPORTING A USER",
    category: "disputes",
    content: [
      "Users can report suspicious accounts, impersonation, harassment, or safety violations directly via profile cards or the Trust & Safety reporting portal."
    ]
  },
  {
    id: "sec-44",
    num: 44,
    title: "REPORTING A TASK OR PROJECT",
    category: "disputes",
    content: [
      "Misleading, fraudulent, or dangerous project postings can be reported immediately for swift moderation and removal."
    ]
  },
  {
    id: "sec-45",
    num: 45,
    title: "EMERGENCY SITUATIONS",
    category: "safety",
    content: [
      "Boulot Man is not an emergency-dispatch service. In situations involving immediate physical danger, medical emergencies, or crime, contact local emergency services first."
    ]
  },
  {
    id: "sec-46",
    num: 46,
    title: "DISPUTE MANAGEMENT",
    category: "disputes",
    content: [
      "When disagreements arise, users can submit contract notes, milestone records, photographs, and messages for structured mediation."
    ]
  },
  {
    id: "sec-47",
    num: 47,
    title: "FAIR DISPUTE REVIEW",
    category: "disputes",
    content: [
      "Boulot Man evaluates dispute evidence impartially, reviewing time-stamped task logs, payment history, and physical deliverable records."
    ]
  },
  {
    id: "sec-48",
    num: 48,
    title: "REPORTING FALSE CLAIMS",
    category: "disputes",
    content: [
      "Filing fraudulent dispute claims, submitting doctored photos, or falsely claiming non-completion will result in immediate disciplinary account action."
    ]
  },
  {
    id: "sec-49",
    num: 49,
    title: "ACCOUNT WARNINGS",
    category: "disputes",
    content: [
      "Minor policy infractions or communication lapses receive formal administrative warnings to allow corrective action."
    ]
  },
  {
    id: "sec-50",
    num: 50,
    title: "ACCOUNT SUSPENSION",
    category: "disputes",
    content: [
      "Temporary suspension freezes messaging, bidding, and payouts while serious safety, identity, or financial investigations are conducted."
    ]
  },
  {
    id: "sec-51",
    num: 51,
    title: "ACCOUNT TERMINATION",
    category: "disputes",
    content: [
      "Permanent account termination applies to confirmed fraud, forged credentials, violence, theft, or severe platform abuse."
    ]
  },
  {
    id: "sec-52",
    num: 52,
    title: "APPEALS",
    category: "disputes",
    content: [
      "Users may submit formal appeals with supporting documentary evidence for administrative review of enforcement decisions."
    ]
  },
  {
    id: "sec-53",
    num: 53,
    title: "PROFESSIONAL LICENCES AND EXPIRATION",
    category: "verification",
    content: [
      "Verification badges automatically expire if trade licences or corporate insurance policies lapse without updated documentation."
    ]
  },
  {
    id: "sec-54",
    num: 54,
    title: "CONTINUOUS TRUST",
    category: "responsibility",
    content: [
      "Trust is an ongoing relationship evaluated by continuous job completion quality, client feedback, prompt communication, and zero dispute escalation."
    ]
  },
  {
    id: "sec-55",
    num: 55,
    title: "TRUST SHOULD BE EARNED OVER TIME",
    category: "responsibility",
    content: [
      "Long-standing providers build enhanced reputation metrics through consistent 5-star delivery, low dispute rates, and repeat hiring."
    ]
  },
  {
    id: "sec-56",
    num: 56,
    title: "SAFE HIRING CHECKLIST FOR CLIENTS",
    category: "checklists",
    content: [
      "Essential pre-hiring checklist for clients:"
    ],
    listItems: [
      "Is the technician or company account verified?",
      "Does the provider possess relevant trade experience?",
      "Are required professional licences active?",
      "Are past client reviews consistent and positive?",
      "Is the written quotation transparent and detailed?",
      "Is the project scope and timeline documented?",
      "Are payment milestones linked to deliverables?",
      "Is escrow protection available for the transaction?",
      "Are materials and responsibility clearly allocated?",
      "Is adequate site supervision arranged for major work?"
    ]
  },
  {
    id: "sec-57",
    num: 57,
    title: "SAFE WORK CHECKLIST FOR PROFESSIONALS",
    category: "checklists",
    content: [
      "Essential pre-work checklist for professionals:"
    ],
    listItems: [
      "Is the task scope clear and confirmed in writing?",
      "Is the physical location and site access verified?",
      "Is the budget realistic for labour and materials?",
      "Do I possess required tools and PPE?",
      "Are payment terms and escrow funding verified?",
      "Are required permits or municipal approvals in place?",
      "Is the engagement recorded on the platform?"
    ]
  },
  {
    id: "sec-58",
    num: 58,
    title: "SAFE PROJECT CHECKLIST FOR COMPANIES",
    category: "checklists",
    content: [
      "Corporate execution checklist:"
    ],
    listItems: [
      "Formal written contract and project scope signed",
      "Payment milestones and escrow funded",
      "Detailed design drawings and BOQs reviewed",
      "Site safety plan, staffing, and PPE deployed",
      "Subcontractor credentials and insurance verified",
      "Handover and milestone quality inspection criteria agreed"
    ]
  },
  {
    id: "sec-59",
    num: 59,
    title: "SAFE FIRST MEETINGS",
    category: "safety",
    content: [
      "When meeting at a new project site: meet during daylight hours, confirm provider identity badge, keep project communications on the platform, and avoid carrying unnecessary cash."
    ]
  },
  {
    id: "sec-60",
    num: 60,
    title: "CHILDREN AND VULNERABLE PERSONS",
    category: "safety",
    content: [
      "Services involving childcare, elder care, or vulnerable individuals require enhanced reference vetting and strict identity compliance."
    ]
  },
  {
    id: "sec-61",
    num: 61,
    title: "BACKGROUND CHECKS",
    category: "verification",
    content: [
      "Where legally permitted, third-party criminal record and background vetting may be required for sensitive enterprise or in-home categories."
    ]
  },
  {
    id: "sec-62",
    num: 62,
    title: "INSURANCE",
    category: "verification",
    content: [
      "Corporate public liability and contractor insurance badges indicate verified policy coverage for commercial project categories."
    ]
  },
  {
    id: "sec-63",
    num: 63,
    title: "PROJECT INSPECTIONS",
    category: "workplace",
    content: [
      "Independent technical inspections may be conducted at milestone intervals to verify structural, MEP, and finish quality."
    ]
  },
  {
    id: "sec-64",
    num: 64,
    title: "EVIDENCE OF COMPLETION",
    category: "workplace",
    content: [
      "Providers must capture clear photos, videos, delivery notes, and signed handover sign-offs before requesting milestone release."
    ]
  },
  {
    id: "sec-65",
    num: 65,
    title: "QUALITY CONCERNS",
    category: "disputes",
    content: [
      "Clients noticing defects should document the specific issue with photos, allow reasonable correction, and avoid altering disputed work before mediation."
    ]
  },
  {
    id: "sec-66",
    num: 66,
    title: "PAYMENT CONCERNS",
    category: "disputes",
    content: [
      "Providers with withheld payments should preserve task logs, invoices, and work evidence, and submit a formal claim through the dispute portal without unlawful property retention."
    ]
  },
  {
    id: "sec-67",
    num: 67,
    title: "SAFETY INCIDENT REPORTING",
    category: "safety",
    content: [
      "Any site accidents or safety events should be reported with photos, witness notes, and timestamps to the Trust & Safety team."
    ]
  },
  {
    id: "sec-68",
    num: 68,
    title: "COOPERATION WITH AUTHORITIES",
    category: "responsibility",
    content: [
      "Boulot Man cooperates with law enforcement and judicial authorities in investigations involving fraud, theft, violence, or court orders."
    ]
  },
  {
    id: "sec-69",
    num: 69,
    title: "DATA AND SECURITY PROTECTION",
    category: "security",
    content: [
      "Bank-grade encryption, secure token authentication, session timeouts, and role-based permissions protect user records at all times."
    ]
  },
  {
    id: "sec-70",
    num: 70,
    title: "SAFETY BY DESIGN",
    category: "security",
    content: [
      "Platform architecture minimizes data exposure by hiding government ID numbers, shielding personal financial records, and controlling client address releases."
    ]
  },
  {
    id: "sec-71",
    num: 71,
    title: "USER RESPONSIBILITY",
    category: "responsibility",
    content: [
      "Platform safety succeeds when users exercise sound judgment, verify agreements, follow safety precautions, and report suspicious conduct."
    ]
  },
  {
    id: "sec-72",
    num: 72,
    title: "TRUST & SAFETY FOR CLIENTS",
    category: "responsibility",
    content: [
      "Clients hire with peace of mind via verified credentials, ratings, milestone escrow, structured supervision, and dispute mediation."
    ]
  },
  {
    id: "sec-73",
    num: 73,
    title: "TRUST & SAFETY FOR PROFESSIONALS",
    category: "responsibility",
    content: [
      "Professionals work with dignity via protected milestone funds, transparent task scopes, fair review challenges, and reputation building."
    ]
  },
  {
    id: "sec-74",
    num: 74,
    title: "TRUST & SAFETY FOR COMPANIES",
    category: "responsibility",
    content: [
      "Enterprises access verified tender opportunities, formal milestone contracts, workforce management tools, and institutional backing."
    ]
  },
  {
    id: "sec-75",
    num: 75,
    title: "TRUST & SAFETY FOR CLIENT BUSINESSES",
    category: "responsibility",
    content: [
      "Commercial clients commission projects with contractor due diligence, BOQ management, site supervision, and escrow guarantees."
    ]
  },
  {
    id: "sec-76",
    num: 76,
    title: "SHARED RESPONSIBILITY",
    category: "responsibility",
    content: [
      "Verification badges and review scores empower good judgment—they accompany user diligence, site evaluation, and compliance with safety rules."
    ]
  },
  {
    id: "sec-77",
    num: 77,
    title: "CONTACT TRUST & SAFETY",
    category: "responsibility",
    content: [
      "Users may reach out regarding fraud, impersonation, safety risks, payment abuse, or dispute appeals:"
    ],
    callout: "Boulot Man Trust & Safety Division\nAddress: KK 371 St, Kigali, Rwanda\nPhone: 0793 762 949\nEmail: office@boulotman.com\nWebsite: www.boulotman.com"
  },
  {
    id: "sec-78",
    num: 78,
    title: "RELATED POLICIES",
    category: "responsibility",
    content: [
      "Trust & Safety operates in synergy with all Boulot Man platform policies:"
    ],
    directory: [
      "Terms of Service",
      "Privacy Policy",
      "Verification Policy",
      "Marketplace Rules",
      "Client Terms",
      "Technician & Professional Terms",
      "Company Terms",
      "Payments & Escrow Policy",
      "Cancellation & Refund Policy",
      "Dispute Resolution Policy",
      "Reviews & Ratings Policy",
      "Username Policy",
      "Safety & Prohibited Services Policy",
      "Account Enforcement Policy",
      "Concierge Service Terms",
      "Build a Team Terms",
      "Boulot Man Contractors Terms"
    ]
  },
  {
    id: "sec-79",
    num: 79,
    title: "OUR COMMITMENT",
    category: "responsibility",
    content: [
      "Boulot Man's goal is to create Africa's premier trusted workforce ecosystem where identity, capability, reputation, accountability and secure execution work together.",
      "BOULOT MAN — Home for technicians and engineers in Africa. (www.boulotman.com)"
    ]
  }
];

export default function TrustAndSafetyPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeSectionId, setActiveSectionId] = useState<string>("sec-1");
  const [showModal, setShowModal] = useState(false);
  const [modalSubmitted, setModalSubmitted] = useState(false);
  const [reportForm, setReportForm] = useState({
    name: "",
    email: "",
    concernType: "Suspicious Profile / Fraud",
    description: ""
  });

  const filteredSections = TRUST_SECTIONS.filter((s) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      s.title.toLowerCase().includes(q) ||
      s.num.toString().includes(q) ||
      s.content.some((c) => c.toLowerCase().includes(q));

    const matchesCategory = activeCategory === "all" || s.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleScrollTo = (id: string) => {
    setActiveSectionId(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setModalSubmitted(true);
  };

  return (
    <div className={styles.page}>
      <Header />

      {/* =====================================================
           HERO SECTION
      ====================================================== */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <div className={styles.heroMeta}>
              <span className={styles.heroBadge}>🛡️ Trust, Safety &amp; Platform Integrity</span>
              <span className={styles.heroDate}>Effective Date &amp; Updated: August 31, 2026</span>
            </div>

            <h1 className={styles.heroTitle}>Boulot Man Trust &amp; Safety</h1>
            <p className={styles.heroSubtitle}>
              Trust is central to every interaction on Boulot Man. We connect Clients with Technicians,
              Engineers, Professionals and Companies with layered verification, secure escrow payments,
              and proactive risk protection.
            </p>

            {/* QUICK NAV CATEGORIES */}
            <div className={styles.quickNav}>
              <button
                type="button"
                className={styles.navPill}
                onClick={() => {
                  setActiveCategory("verification");
                  handleScrollTo("sec-1");
                }}
              >
                🔍 Verification &amp; Badges (Sec 1-10)
              </button>
              <button
                type="button"
                className={styles.navPill}
                onClick={() => {
                  setActiveCategory("reputation");
                  handleScrollTo("sec-11");
                }}
              >
                ⭐ Reviews &amp; Integrity (Sec 11-18)
              </button>
              <button
                type="button"
                className={styles.navPill}
                onClick={() => {
                  setActiveCategory("security");
                  handleScrollTo("sec-19");
                }}
              >
                🔒 Security &amp; Anti-Fraud (Sec 19-26)
              </button>
              <button
                type="button"
                className={styles.navPill}
                onClick={() => {
                  setActiveCategory("payments");
                  handleScrollTo("sec-27");
                }}
              >
                💳 Payments &amp; Escrow (Sec 27-35)
              </button>
              <button
                type="button"
                className={styles.navPill}
                onClick={() => {
                  setActiveCategory("workplace");
                  handleScrollTo("sec-36");
                }}
              >
                🛠️ Safe Work &amp; Property (Sec 36-45)
              </button>
              <button
                type="button"
                className={styles.navPill}
                onClick={() => {
                  setActiveCategory("disputes");
                  handleScrollTo("sec-46");
                }}
              >
                ⚖️ Disputes &amp; Appeals (Sec 46-55)
              </button>
              <button
                type="button"
                className={styles.navPill}
                onClick={() => {
                  setActiveCategory("checklists");
                  handleScrollTo("sec-56");
                }}
              >
                📋 Safety Checklists (Sec 56-68)
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
           MAIN LAYOUT: STICKY SIDEBAR + 79 SECTIONS
      ====================================================== */}
      <div className={styles.container}>
        <div className={styles.mainLayout}>
          {/* SIDEBAR */}
          <aside className={styles.sidebar}>
            <div className={styles.searchBox}>
              <span className={styles.searchIcon}>⌕</span>
              <input
                type="search"
                className={styles.searchInput}
                placeholder="Search 79 Trust & Safety sections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className={styles.sidebarTitle}>
              <span>Table of Contents</span>
              <span className={styles.sectionCount}>{filteredSections.length} / 79</span>
            </div>

            <div className={styles.sidebarNav}>
              {filteredSections.map((sec) => (
                <button
                  key={sec.id}
                  type="button"
                  className={`${styles.navItem} ${activeSectionId === sec.id ? styles.navItemActive : ""}`}
                  onClick={() => handleScrollTo(sec.id)}
                >
                  <span className={styles.navItemNum}>#{sec.num}</span>
                  <span>{sec.title}</span>
                </button>
              ))}
            </div>

            <button
              type="button"
              className={styles.reportBtn}
              onClick={() => {
                setShowModal(true);
                setModalSubmitted(false);
              }}
            >
              🚨 Report Safety Concern
            </button>
          </aside>

          {/* POLICY CONTENT: ALL 79 SECTIONS */}
          <main className={styles.policyContent}>
            {filteredSections.map((sec) => (
              <article key={sec.id} id={sec.id} className={styles.policyCard}>
                <div className={styles.cardHeader}>
                  <span className={styles.sectionBadge}>Section {sec.num}</span>
                  <h2 className={styles.cardTitle}>{sec.title}</h2>
                </div>

                <div className={styles.cardBody}>
                  {sec.content.map((paragraph, pIdx) => (
                    <p key={pIdx}>{paragraph}</p>
                  ))}

                  {sec.subsections && (
                    <div style={{ marginTop: "16px" }}>
                      {sec.subsections.map((sub, sIdx) => (
                        <div key={sIdx} className={styles.subSection}>
                          <div className={styles.subSectionTitle}>{sub.title}</div>
                          <ul className={styles.policyList}>
                            {sub.items.map((item, iIdx) => (
                              <li key={iIdx}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}

                  {sec.listItems && (
                    <ul className={styles.policyList} style={{ marginTop: "14px" }}>
                      {sec.listItems.map((item, lIdx) => (
                        <li key={lIdx}>{item}</li>
                      ))}
                    </ul>
                  )}

                  {sec.directory && (
                    <div className={styles.directoryGrid}>
                      {sec.directory.map((policy, pIdx) => (
                        <div key={pIdx} className={styles.directoryCard}>
                          <span>🛡️</span>
                          <span>{policy}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {sec.id === "sec-77" && (
                    <div className={styles.contactBox}>
                      <h3>Boulot Man Official Contact for Trust &amp; Safety</h3>
                      <p>
                        Contact the Trust &amp; Safety Division for incident reviews, account investigations, or dispute mediation:
                      </p>
                      <div className={styles.contactGrid}>
                        <div className={styles.contactItem}>
                          <span>Headquarters</span>
                          <strong>KK 371 St, Kigali, Rwanda</strong>
                        </div>
                        <div className={styles.contactItem}>
                          <span>Trust Hotline</span>
                          <strong>0793 762 949</strong>
                        </div>
                        <div className={styles.contactItem}>
                          <span>Trust &amp; Safety Email</span>
                          <strong>
                            <a href="mailto:office@boulotman.com">office@boulotman.com</a>
                          </strong>
                        </div>
                        <div className={styles.contactItem}>
                          <span>Platform</span>
                          <strong>
                            <a href="https://www.boulotman.com">www.boulotman.com</a>
                          </strong>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </article>
            ))}

            {filteredSections.length === 0 && (
              <div className={styles.policyCard} style={{ textAlign: "center", padding: "60px 20px" }}>
                <h3 style={{ color: "#001f3f", marginBottom: "8px" }}>No matching sections found</h3>
                <p style={{ color: "#64748b" }}>
                  Try a different search term like "escrow", "verification", "fraud", or "checklists".
                </p>
                <button
                  type="button"
                  className={styles.reportBtn}
                  style={{ display: "inline-flex", width: "auto", margin: "16px auto 0" }}
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCategory("all");
                  }}
                >
                  Clear Search Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* =====================================================
           REPORT SAFETY MODAL
      ====================================================== */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Report Trust &amp; Safety Issue</h2>
              <button
                type="button"
                className={styles.closeModalBtn}
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>

            {modalSubmitted ? (
              <div style={{ padding: "24px 0", textAlign: "center" }}>
                <div style={{ fontSize: "40px", marginBottom: "12px" }}>🚨</div>
                <h3 style={{ color: "#001f3f", margin: "0 0 8px" }}>Safety Report Logged</h3>
                <p style={{ color: "#64748b", fontSize: "14px", lineHeight: "1.6" }}>
                  Your safety report has been escalated to the Boulot Man Trust &amp; Safety investigations unit.
                  We will review the evidence and take appropriate action immediately.
                </p>
                <button
                  type="button"
                  className={styles.formSubmitBtn}
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit}>
                <p style={{ color: "#64748b", fontSize: "13.5px", marginTop: 0, marginBottom: "18px" }}>
                  Report suspected fraud, fake profiles, harassment, unsafe job conditions, or payment manipulation.
                </p>

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label htmlFor="trustName">Your Name</label>
                    <input
                      type="text"
                      id="trustName"
                      required
                      value={reportForm.name}
                      onChange={(e) => setReportForm({ ...reportForm, name: e.target.value })}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="trustEmail">Your Email</label>
                    <input
                      type="email"
                      id="trustEmail"
                      required
                      value={reportForm.email}
                      onChange={(e) => setReportForm({ ...reportForm, email: e.target.value })}
                    />
                  </div>

                  <div className={`${styles.formGroup} ${styles.formFull}`}>
                    <label htmlFor="trustType">Issue Classification</label>
                    <select
                      id="trustType"
                      value={reportForm.concernType}
                      onChange={(e) => setReportForm({ ...reportForm, concernType: e.target.value })}
                    >
                      <option>Suspicious Profile / Fraudulent Claims</option>
                      <option>Payment Scam / Off-Platform Solicitation</option>
                      <option>Harassment / Abusive Behavior</option>
                      <option>Unsafe Physical Site Conditions</option>
                      <option>Fake / Coerced Reviews</option>
                      <option>Impersonation / Forged Documents</option>
                      <option>Other Urgent Safety Concern</option>
                    </select>
                  </div>

                  <div className={`${styles.formGroup} ${styles.formFull}`}>
                    <label htmlFor="trustDesc">Incident Details</label>
                    <textarea
                      id="trustDesc"
                      rows={4}
                      required
                      placeholder="Please provide usernames, task IDs, timestamps, or descriptions of the incident."
                      value={reportForm.description}
                      onChange={(e) => setReportForm({ ...reportForm, description: e.target.value })}
                    ></textarea>
                  </div>
                </div>

                <button type="submit" className={styles.formSubmitBtn}>
                  Submit Report to Trust &amp; Safety
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
