"use client";

import React, { useState } from "react";
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import styles from "./refunds.module.css";

interface RefundSection {
  id: string;
  num: number;
  title: string;
  category: "general" | "full-partial" | "cancellation" | "materials" | "services" | "workflow" | "cases" | "governance";
  content: string[];
  subsections?: { title: string; items: string[] }[];
  listItems?: string[];
  caseStudy?: { situation: string; outcome: string };
  callout?: string;
  directory?: string[];
}

const REFUND_SECTIONS: RefundSection[] = [
  {
    id: "sec-1",
    num: 1,
    title: "GENERAL PRINCIPLE",
    category: "general",
    content: [
      "Boulot Man aims to handle refunds and cancellations fairly for all participants. A refund evaluation considers: Whether service started, Work already completed, Milestones achieved, Materials purchased, Mobilization costs, Professional time utilized, Client approvals, Changes requested, Cancellation timing, Evidence provided, Escrow status, and Applicable statutory consumer law.",
      "A refund request does not automatically mean that the full transaction amount will be returned."
    ]
  },
  {
    id: "sec-2",
    num: 2,
    title: "TYPES OF TRANSACTIONS",
    category: "general",
    content: [
      "This Policy applies to Technician services, Engineering services, Handyman services, Company quotations, Task-based work, Fixed-price jobs, Hourly or daily services, Call-out & diagnostic visits, Milestone projects, Escrow-backed contracts, Concierge services, Build a Team engagements, and Boulot Man Contractors enterprise projects."
    ]
  },
  {
    id: "sec-3",
    num: 3,
    title: "WHEN A FULL REFUND MAY APPLY",
    category: "full-partial",
    content: [
      "A Client may be eligible for a full refund where: The Provider cancels before starting work; The Provider fails to appear (no-show); The Provider cannot deliver agreed services; A duplicate transaction occurred; An unauthorized charge is confirmed; The task was cancelled before any chargeable activity or mobilization began; Escrow funds remain unearned; or Serious misrepresentation of ability occurred."
    ]
  },
  {
    id: "sec-4",
    num: 4,
    title: "WHEN A PARTIAL REFUND MAY APPLY",
    category: "full-partial",
    content: [
      "A partial refund applies where: Some work has been completed; Certain milestones were delivered and accepted; Materials were purchased; Mobilization costs were incurred; The Client modifies the project midway; or Legitimate non-refundable supplier expenses were incurred.",
      "The refund amount is calculated after deducting verifiable compensation for completed work and authorized expenses."
    ]
  },
  {
    id: "sec-5",
    num: 5,
    title: "WHEN A REFUND MAY NOT APPLY",
    category: "full-partial",
    content: [
      "A refund may be refused where: Work was completed per agreed scope; The Client changes their mind after completion; The Client approved completed work and later seeks reversal; Custom materials cannot be returned; The Client denied necessary site access; or The Client knowingly bypassed platform payment protections."
    ]
  },
  {
    id: "sec-6",
    num: 6,
    title: "CANCELLATION BEFORE WORK STARTS",
    category: "cancellation",
    content: [
      "If a Client cancels before work begins, refund entitlement depends on whether the Provider incurred verifiable costs (inspection fees, travel, equipment booking, or special-order materials). If no costs were incurred, a 100% full refund is issued."
    ]
  },
  {
    id: "sec-7",
    num: 7,
    title: "PROVIDER CANCELLATION BEFORE WORK STARTS",
    category: "cancellation",
    content: [
      "If a Provider cancels before work begins without a valid substitute, the Client is entitled to a full refund. Repeated unjustified cancellations by a Provider trigger platform penalties, search demotion, or verification review."
    ]
  },
  {
    id: "sec-8",
    num: 8,
    title: "CANCELLATION AFTER WORK STARTS",
    category: "cancellation",
    content: [
      "Where work has commenced, the parties must document work completed, materials used, site condition, remaining tasks, and expenses incurred for fair proportional settlement."
    ]
  },
  {
    id: "sec-9",
    num: 9,
    title: "CLIENT-INITIATED CANCELLATION",
    category: "cancellation",
    content: [
      "Clients may cancel, but earned portions remain payable (completed stages, approved milestones, call-out charges, non-refundable materials, and equipment demobilization). Remaining unearned balances are refunded."
    ]
  },
  {
    id: "sec-10",
    num: 10,
    title: "PROVIDER-INITIATED CANCELLATION",
    category: "cancellation",
    content: [
      "If a Provider cancels midway, Boulot Man reviews usable value delivered to the Client, materials left on site, and reasons for cancellation. The Provider is compensated only for accepted completed portions."
    ]
  },
  {
    id: "sec-11",
    num: 11,
    title: "FAILURE TO PERFORM",
    category: "cancellation",
    content: [
      "Clients may claim a full refund where a Provider abandons a project, refuses to perform agreed scope without cause, or delivers work materially different from the contract."
    ]
  },
  {
    id: "sec-12",
    num: 12,
    title: "POOR QUALITY WORK",
    category: "cancellation",
    content: [
      "A disagreement over quality does not automatically generate a full refund. The Provider is first offered a reasonable window to rectify defects. Outcomes include correction, milestone adjustment, or independent inspection."
    ]
  },
  {
    id: "sec-13",
    num: 13,
    title: "CHANGE OF MIND",
    category: "cancellation",
    content: [
      "A Client's change of mind after work has been completed (e.g. changing an approved paint color or redesigning layout after fabrication) constitutes new billable work rather than a refundable defect."
    ]
  },
  {
    id: "sec-14",
    num: 14,
    title: "SCOPE CHANGES",
    category: "cancellation",
    content: [
      "Any material project changes must be recorded in writing on the platform, adjusting price, schedule, materials, and milestone refund calculations accordingly."
    ]
  },
  {
    id: "sec-15",
    num: 15,
    title: "MATERIALS PURCHASED FOR A PROJECT",
    category: "materials",
    content: [
      "When materials are purchased using client funds, decisions consider authorization, delivery, supplier return policies, restocking fees, and ownership transfer. Clients retain full ownership of paid materials."
    ]
  },
  {
    id: "sec-16",
    num: 16,
    title: "UNUSED MATERIALS",
    category: "materials",
    content: [
      "Unused materials must either remain with the Client, be returned for supplier credit applied to the Client, or accounted for in the final balance. Providers must not withhold Client-funded inventory."
    ]
  },
  {
    id: "sec-17",
    num: 17,
    title: "SPECIAL-ORDER MATERIALS",
    category: "materials",
    content: [
      "Custom-fabricated metalwork, specialized glass, custom cabinetry, or made-to-order mechanical units are non-refundable once manufactured. Clients must be informed of non-refundable commitments before ordering."
    ]
  },
  {
    id: "sec-18",
    num: 18,
    title: "CALL-OUT AND INSPECTION FEES",
    category: "services",
    content: [
      "Where a technician completes an agreed diagnostic visit or site inspection, the call-out fee remains payable even if the Client chooses not to proceed with the larger proposed quote."
    ]
  },
  {
    id: "sec-19",
    num: 19,
    title: "HOURLY AND DAILY SERVICES",
    category: "services",
    content: [
      "For time-based contracts, actual hours or days worked according to logged timesheets and platform check-ins remain payable."
    ]
  },
  {
    id: "sec-20",
    num: 20,
    title: "FIXED-PRICE SERVICES",
    category: "services",
    content: [
      "Fixed-price jobs are assessed on percentage completed, deliverables delivered, materials used, and the estimated cost to complete or remedy remaining items."
    ]
  },
  {
    id: "sec-21",
    num: 21,
    title: "MILESTONE PROJECTS",
    category: "services",
    content: [
      "Each milestone is evaluated individually. Approved milestones are payable, while unstarted milestones are refundable subject to incurred procurement costs."
    ]
  },
  {
    id: "sec-22",
    num: 22,
    title: "ESCROW REFUNDS",
    category: "services",
    content: [
      "Escrowed funds remain protected in the Boulot Man vault until milestone verification or formal mediation concludes. Chargeback abuse is strictly prohibited."
    ]
  },
  {
    id: "sec-23",
    num: 23,
    title: "CLIENT APPROVAL OF A MILESTONE",
    category: "services",
    content: [
      "Client milestone approval confirms satisfaction, releasing escrow funds to the Provider, subject only to latent defects or mandatory statutory warranties."
    ]
  },
  {
    id: "sec-24",
    num: 24,
    title: "AUTOMATIC MILESTONE RELEASES",
    category: "services",
    content: [
      "Where automated milestone approval applies after an unanswered inspection window, Clients receive advance reminders to review or lodge a dispute."
    ]
  },
  {
    id: "sec-25",
    num: 25,
    title: "CONCIERGE SERVICE REFUNDS",
    category: "services",
    content: [
      "Concierge coordination, professional sourcing, and site supervision already performed remain billable even if the underlying project is cancelled."
    ]
  },
  {
    id: "sec-26",
    num: 26,
    title: "BUILD A TEAM REFUNDS",
    category: "services",
    content: [
      "Team recruitment, screening, mobilization, and scheduling expenses incurred prior to cancellation are deducted from refundable balances."
    ]
  },
  {
    id: "sec-27",
    num: 27,
    title: "BOULOT MAN CONTRACTORS PROJECTS",
    category: "services",
    content: [
      "Enterprise construction and engineering contracts follow the specific termination and milestone clauses stipulated in the executed project contract."
    ]
  },
  {
    id: "sec-28",
    num: 28,
    title: "COMPANY PROJECTS",
    category: "services",
    content: [
      "Corporate project cancellations consider plant rental, subcontractor commitments, engineering designs, municipal permits, and mobilization costs."
    ]
  },
  {
    id: "sec-29",
    num: 29,
    title: "DIGITAL OR REMOTE SERVICES",
    category: "services",
    content: [
      "For IT, software, or design projects, refunds are calculated based on code commits, API integrations, and milestone deliverables rather than physical presence."
    ]
  },
  {
    id: "sec-30",
    num: 30,
    title: "UNAUTHORIZED TRANSACTIONS",
    category: "workflow",
    content: [
      "Suspected unauthorized transactions are investigated via audit logs and security telemetry, with full reversals issued upon confirmation."
    ]
  },
  {
    id: "sec-31",
    num: 31,
    title: "DUPLICATE PAYMENTS",
    category: "workflow",
    content: [
      "Confirmed duplicate charges are promptly reversed to the original payment method upon receipt of transaction references."
    ]
  },
  {
    id: "sec-32",
    num: 32,
    title: "INCORRECT PAYMENT AMOUNTS",
    category: "workflow",
    content: [
      "Discrepancies in billing amounts or transaction calculations are investigated and corrected immediately by financial support."
    ]
  },
  {
    id: "sec-33",
    num: 33,
    title: "PAYMENT PROCESSING FEES",
    category: "workflow",
    content: [
      "Gateway processing and mobile-money fees may be non-refundable depending on banking network rules and the reason for the refund."
    ]
  },
  {
    id: "sec-34",
    num: 34,
    title: "PLATFORM FEES",
    category: "workflow",
    content: [
      "Boulot Man service fees are refundable if cancellation occurs prior to any service delivery or due to provider fault."
    ]
  },
  {
    id: "sec-35",
    num: 35,
    title: "CURRENCY CONVERSION",
    category: "workflow",
    content: [
      "Refunds involving currency conversion reflect prevailing market rates and intermediary banking charges."
    ]
  },
  {
    id: "sec-36",
    num: 36,
    title: "REFUND METHOD",
    category: "workflow",
    content: [
      "Approved refunds are remitted to the original payment method, digital wallet, mobile money account, or direct bank transfer."
    ]
  },
  {
    id: "sec-37",
    num: 37,
    title: "REFUND PROCESSING TIME",
    category: "workflow",
    content: [
      "Platform authorization occurs within 24-48 hours. Bank and mobile money provider processing typically completes within 3 to 7 business days."
    ]
  },
  {
    id: "sec-38",
    num: 38,
    title: "REQUESTING A REFUND",
    category: "workflow",
    content: [
      "Clients submit refund claims directly via the project dashboard with transaction details, reasons, and supporting evidence (messages, photos, inspection notes)."
    ]
  },
  {
    id: "sec-39",
    num: 39,
    title: "REFUND REQUEST WORKFLOW",
    category: "workflow",
    content: [
      "9-step structured resolution workflow:"
    ],
    listItems: [
      "Step 1: Open project transaction",
      "Step 2: Select 'Request Refund'",
      "Step 3: Choose refund classification",
      "Step 4: Enter requested amount",
      "Step 5: Attach photo/document evidence",
      "Step 6: Submit request",
      "Step 7: Provider review & response (48h)",
      "Step 8: Mutual agreement or dispute mediation",
      "Step 9: Settlement execution & funds release"
    ]
  },
  {
    id: "sec-40",
    num: 40,
    title: "REFUND REASONS",
    category: "workflow",
    content: [
      "Standard refund categories: Provider No-Show, Provider Cancelled, Work Incomplete, Significant Scope Deviation, Quality Defect, Duplicate Charge, Milestone Conflict."
    ]
  },
  {
    id: "sec-41",
    num: 41,
    title: "PROVIDER RESPONSE",
    category: "workflow",
    content: [
      "Providers may accept full refund, offer partial refund with completed work deduction, propose defect rectification, or submit counter-evidence."
    ]
  },
  {
    id: "sec-42",
    num: 42,
    title: "MUTUAL AGREEMENT",
    category: "workflow",
    content: [
      "Where client and provider agree on a settlement figure, Boulot Man instantly executes the payout and refund balance."
    ]
  },
  {
    id: "sec-43",
    num: 43,
    title: "PARTIAL REFUND AGREEMENTS",
    category: "workflow",
    content: [
      "Mutual agreements can partition completed milestones, material ownership, and remaining escrow release."
    ]
  },
  {
    id: "sec-44",
    num: 44,
    title: "DISPUTED REFUND REQUESTS",
    category: "workflow",
    content: [
      "Unresolved claims are escalated to the Dispute Resolution Mediation Panel for binding determination based on submitted evidence."
    ]
  },
  {
    id: "sec-45",
    num: 45,
    title: "EVIDENCE REVIEW",
    category: "workflow",
    content: [
      "Mediation evaluates task specifications, time-stamped messages, photos, material receipts, and sign-off records."
    ]
  },
  {
    id: "sec-46",
    num: 46,
    title: "INDEPENDENT INSPECTION",
    category: "workflow",
    content: [
      "For large structural or MEP disputes, independent licensed engineers may be dispatched to inspect workmanship and assess remedial costs."
    ]
  },
  {
    id: "sec-47",
    num: 47,
    title: "FRAUDULENT REFUND REQUESTS",
    category: "governance",
    content: [
      "Filing fraudulent non-delivery claims, altering photographic evidence, or abusing chargeback mechanisms results in account termination."
    ]
  },
  {
    id: "sec-48",
    num: 48,
    title: "PROVIDER REFUND ABUSE",
    category: "governance",
    content: [
      "Coercing clients to drop claims, forging completion sign-offs, or unlawfully removing client-funded materials is strictly prohibited."
    ]
  },
  {
    id: "sec-49",
    num: 49,
    title: "CHARGEBACKS",
    category: "governance",
    content: [
      "Initiating external bank chargebacks during active mediation violates platform terms and triggers immediate account review."
    ]
  },
  {
    id: "sec-50",
    num: 50,
    title: "CANCELLATION DUE TO SAFETY",
    category: "cancellation",
    content: [
      "Either party may stop work if severe safety hazards arise. Settlement accounts for hazards disclosed, work completed, and costs incurred."
    ]
  },
  {
    id: "sec-51",
    num: 51,
    title: "CANCELLATION DUE TO CLIENT CONDUCT",
    category: "cancellation",
    content: [
      "Providers may withdraw if clients threaten workers, demand illegal activities, or repeatedly deny site access, receiving compensation for completed work."
    ]
  },
  {
    id: "sec-52",
    num: 52,
    title: "CANCELLATION DUE TO PROVIDER CONDUCT",
    category: "cancellation",
    content: [
      "Clients may terminate engagements if providers use unqualified personnel, commit fraud, or create dangerous hazards."
    ]
  },
  {
    id: "sec-53",
    num: 53,
    title: "DELAYS",
    category: "cancellation",
    content: [
      "Project delays are assessed based on communication, material supply disruptions, weather, and whether completion dates were time-critical."
    ]
  },
  {
    id: "sec-54",
    num: 54,
    title: "FORCE MAJEURE",
    category: "cancellation",
    content: [
      "Natural disasters, civil unrest, or widespread infrastructure outages allow parties to pause, reschedule, or reallocate project expenses without penalty."
    ]
  },
  {
    id: "sec-55",
    num: 55,
    title: "CLIENT NO-SHOWS",
    category: "cancellation",
    content: [
      "If a client misses a scheduled appointment without notice, agreed diagnostic/travel call-out fees remain payable."
    ]
  },
  {
    id: "sec-56",
    num: 56,
    title: "PROVIDER NO-SHOWS",
    category: "cancellation",
    content: [
      "If a provider fails to appear, the client receives a 100% refund of unperformed services, and the provider receives a platform penalty."
    ]
  },
  {
    id: "sec-57",
    num: 57,
    title: "RESCHEDULING",
    category: "cancellation",
    content: [
      "Parties are encouraged to reschedule rather than cancel when weather or temporary supply delays arise."
    ]
  },
  {
    id: "sec-58",
    num: 58,
    title: "PROJECT HANDOVER AFTER CANCELLATION",
    category: "cancellation",
    content: [
      "Upon cancellation, providers must reasonably handover site drawings, technical notes, and access credentials to allow project continuation."
    ]
  },
  {
    id: "sec-59",
    num: 59,
    title: "SOFTWARE AND DIGITAL PROJECT HANDOVER",
    category: "cancellation",
    content: [
      "Digital project cancellations require delivery of completed source code, credentials, documentation, and design assets for approved milestones."
    ]
  },
  {
    id: "sec-60",
    num: 60,
    title: "WARRANTIES AND CORRECTION PERIODS",
    category: "governance",
    content: [
      "Workmanship warranties provide defect correction as the primary remedy prior to financial dispute escalation."
    ]
  },
  {
    id: "sec-61",
    num: 61,
    title: "CONSUMER RIGHTS",
    category: "governance",
    content: [
      "Statutory, non-waivable consumer protection regulations in local jurisdictions always take precedence."
    ]
  },
  {
    id: "sec-62",
    num: 62,
    title: "COUNTRY-SPECIFIC RULES",
    category: "governance",
    content: [
      "Local banking, tax, and commercial regulations across Rwanda, Cameroon, Nigeria, Kenya, Ghana, South Africa, and Ivory Coast apply."
    ]
  },
  {
    id: "sec-63",
    num: 63,
    title: "RECORD KEEPING",
    category: "governance",
    content: [
      "Transaction, refund, and dispute logs are archived for accounting, taxation, and anti-fraud verification."
    ]
  },
  {
    id: "sec-64",
    num: 64,
    title: "EFFECT ON RATINGS",
    category: "governance",
    content: [
      "A mutual amicable refund does not harm profile ratings; repeated unexcused no-shows or payment fraud impact reputation standing."
    ]
  },
  {
    id: "sec-65",
    num: 65,
    title: "EFFECT ON VERIFICATION",
    category: "governance",
    content: [
      "Verified status is unaffected by normal cancellations, but proven fraud or forged claims trigger credential revocation."
    ]
  },
  {
    id: "sec-66",
    num: 66,
    title: "SUPPORTING DOCUMENTS",
    category: "workflow",
    content: [
      "Users should preserve quotes, invoices, receipts, photos, delivery sign-offs, and chat logs to expedite refund processing."
    ]
  },
  {
    id: "sec-67",
    num: 67,
    title: "OFF-PLATFORM PAYMENTS",
    category: "governance",
    content: [
      "Transactions conducted off-platform forfeit automated escrow refund protections and platform mediation."
    ]
  },
  {
    id: "sec-68",
    num: 68,
    title: "REFUND STATUS",
    category: "workflow",
    content: [
      "Live status tracker displays: Requested, Awaiting Provider Response, Under Review, Approved, Partially Approved, Processing, or Refunded."
    ]
  },
  {
    id: "sec-69",
    num: 69,
    title: "REFUND NOTIFICATIONS",
    category: "workflow",
    content: [
      "Real-time alerts regarding claims, responses, and payout updates are sent via email, SMS, and dashboard notifications."
    ]
  },
  {
    id: "sec-70",
    num: 70,
    title: "NO RETALIATION",
    category: "governance",
    content: [
      "Retaliatory harassment, threats, or coerced bad reviews against users filing legitimate refund claims are strictly prohibited."
    ]
  },
  {
    id: "sec-71",
    num: 71,
    title: "FAIRNESS TO CLIENTS",
    category: "general",
    content: [
      "Protects clients from paying for unperformed work, fraudulent services, unauthorized charges, or substandard work."
    ]
  },
  {
    id: "sec-72",
    num: 72,
    title: "FAIRNESS TO PROVIDERS",
    category: "general",
    content: [
      "Guarantees providers compensation for verified completed work, legitimate material purchases, and protection against false claims."
    ]
  },
  {
    id: "sec-73",
    num: 73,
    title: "FAIRNESS IN PARTIAL PROJECTS",
    category: "general",
    content: [
      "Proportional formula: (Value of completed work + Approved expenses + Non-refundable materials) = Amount payable to Provider, with balance refunded to Client."
    ]
  },
  {
    id: "sec-74",
    num: 74,
    title: "EXAMPLE — TASK CANCELLED BEFORE START",
    category: "cases",
    content: [
      "A Client books an electrician for a future appointment and cancels before the electrician travels or incurs costs."
    ],
    caseStudy: {
      situation: "Booking cancelled in advance with zero mobilization or materials incurred.",
      outcome: "100% Full Refund issued to Client."
    }
  },
  {
    id: "sec-75",
    num: 75,
    title: "EXAMPLE — INSPECTION COMPLETED",
    category: "cases",
    content: [
      "A plumber charges an agreed diagnostic fee, attends the property, identifies the fault and provides a quote. The Client decides not to proceed with the repair."
    ],
    caseStudy: {
      situation: "Diagnostic inspection completed as contracted.",
      outcome: "Inspection fee remains payable; no refund for the completed diagnostic visit."
    }
  },
  {
    id: "sec-76",
    num: 76,
    title: "EXAMPLE — PROJECT PARTIALLY COMPLETED",
    category: "cases",
    content: [
      "A Company completes 40% of an agreed renovation before the Client cancels for personal reasons."
    ],
    caseStudy: {
      situation: "40% work verified and accepted; no contractor fault.",
      outcome: "40% plus non-refundable expenses paid to Company; remaining 60% unearned balance refunded to Client."
    }
  },
  {
    id: "sec-77",
    num: 77,
    title: "EXAMPLE — PROVIDER ABANDONS PROJECT",
    category: "cases",
    content: [
      "A Client funds 3 milestones. Milestone 1 is completed and accepted, but the Provider abandons Milestones 2 and 3."
    ],
    caseStudy: {
      situation: "Milestone 1 delivered; Milestones 2 & 3 abandoned without cause.",
      outcome: "Milestone 1 released to Provider; Milestones 2 & 3 unearned funds refunded in full to Client."
    }
  },
  {
    id: "sec-78",
    num: 78,
    title: "EXAMPLE — MATERIALS ALREADY PURCHASED",
    category: "cases",
    content: [
      "A Client authorizes custom-fabricated windows and later cancels construction after windows are manufactured."
    ],
    caseStudy: {
      situation: "Custom windows cannot be returned to fabricator.",
      outcome: "Window cost paid to provider (Client retains ownership of windows); unperformed labour refunded."
    }
  },
  {
    id: "sec-79",
    num: 79,
    title: "EXAMPLE — DEFECT CAN BE CORRECTED",
    category: "cases",
    content: [
      "A Technician completes an AC installation with a correctable electrical connection fault and offers immediate rectification."
    ],
    caseStudy: {
      situation: "Defect is prompt and easily repairable by original technician.",
      outcome: "Technician rectifies fault at zero extra charge; no refund required once approved."
    }
  },
  {
    id: "sec-80",
    num: 80,
    title: "EXAMPLE — DUPLICATE PAYMENT",
    category: "cases",
    content: [
      "A Client is accidentally charged twice for the same transaction due to a network glitch."
    ],
    caseStudy: {
      situation: "Confirmed duplicate billing reference.",
      outcome: "Duplicate payment reversed immediately in full."
    }
  },
  {
    id: "sec-81",
    num: 81,
    title: "CHANGES TO THIS POLICY",
    category: "governance",
    content: [
      "Boulot Man may update this policy as payment infrastructures and regional consumer laws evolve, displaying the latest effective date."
    ]
  },
  {
    id: "sec-82",
    num: 82,
    title: "RELATED POLICIES",
    category: "governance",
    content: [
      "This Refunds & Cancellations Policy operates alongside the complete Boulot Man policy framework:"
    ],
    directory: [
      "Terms of Service",
      "Privacy Policy",
      "Trust & Safety",
      "Payments & Escrow Policy",
      "Dispute Resolution Policy",
      "Marketplace Rules",
      "Client Terms",
      "Technician & Professional Terms",
      "Company Terms",
      "Reviews & Ratings Policy",
      "Verification Policy",
      "Concierge Service Terms",
      "Build a Team Terms",
      "Boulot Man Contractors Terms"
    ]
  },
  {
    id: "sec-83",
    num: 83,
    title: "CONTACT BOULOT MAN",
    category: "governance",
    content: [
      "For refund claims, cancellation queries, or payment inquiries, contact the Financial Support Division:"
    ],
    callout: "Boulot Man Payments & Refunds Support\nAddress: KK 371 St, Kigali, Rwanda\nPhone: 0793 762 949\nEmail: office@boulotman.com\nWebsite: www.boulotman.com"
  },
  {
    id: "sec-84",
    num: 84,
    title: "FINAL PRINCIPLE",
    category: "general",
    content: [
      "Boulot Man's refund framework protects both sides: Clients never pay for unperformed work, and Professionals never lose compensation for verified labour and materials.",
      "Settlement = (Work performed + Verified Evidence + Contractual Terms + Applicable Law).",
      "BOULOT MAN — Home for technicians and engineers in Africa. (www.boulotman.com)"
    ]
  }
];

export default function RefundsPolicyPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeSectionId, setActiveSectionId] = useState<string>("sec-1");
  const [showModal, setShowModal] = useState(false);
  const [modalSubmitted, setModalSubmitted] = useState(false);
  const [refundForm, setRefundForm] = useState({
    name: "",
    email: "",
    taskId: "",
    amount: "",
    reason: "Provider Did Not Show / No-Show",
    description: ""
  });

  const filteredSections = REFUND_SECTIONS.filter((s) => {
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

  const handleRefundSubmit = (e: React.FormEvent) => {
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
              <span className={styles.heroBadge}>💳 Refunds &amp; Cancellations</span>
              <span className={styles.heroDate}>Effective Date &amp; Updated: August 31, 2026</span>
            </div>

            <h1 className={styles.heroTitle}>Boulot Man Refunds &amp; Cancellations Policy</h1>
            <p className={styles.heroSubtitle}>
              Fair, transparent, and balanced rules governing cancellations, partial refunds, milestone
              adjustments, and escrow releases across all transactions on Boulot Man.
            </p>

            {/* QUICK NAV CATEGORIES */}
            <div className={styles.quickNav}>
              <button
                type="button"
                className={styles.navPill}
                onClick={() => {
                  setActiveCategory("general");
                  handleScrollTo("sec-1");
                }}
              >
                ⚖️ General Principles (Sec 1-2)
              </button>
              <button
                type="button"
                className={styles.navPill}
                onClick={() => {
                  setActiveCategory("full-partial");
                  handleScrollTo("sec-3");
                }}
              >
                💰 Full vs Partial (Sec 3-5)
              </button>
              <button
                type="button"
                className={styles.navPill}
                onClick={() => {
                  setActiveCategory("cancellation");
                  handleScrollTo("sec-6");
                }}
              >
                ❌ Cancellation Rules (Sec 6-14)
              </button>
              <button
                type="button"
                className={styles.navPill}
                onClick={() => {
                  setActiveCategory("materials");
                  handleScrollTo("sec-15");
                }}
              >
                🧱 Materials &amp; Custom Orders (Sec 15-17)
              </button>
              <button
                type="button"
                className={styles.navPill}
                onClick={() => {
                  setActiveCategory("services");
                  handleScrollTo("sec-18");
                }}
              >
                ⚡ Milestones &amp; Escrow (Sec 18-29)
              </button>
              <button
                type="button"
                className={styles.navPill}
                onClick={() => {
                  setActiveCategory("workflow");
                  handleScrollTo("sec-38");
                }}
              >
                📋 9-Step Workflow (Sec 38-46)
              </button>
              <button
                type="button"
                className={styles.navPill}
                onClick={() => {
                  setActiveCategory("cases");
                  handleScrollTo("sec-74");
                }}
              >
                💡 7 Case Studies (Sec 74-80)
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
           MAIN LAYOUT: STICKY SIDEBAR + 84 SECTIONS
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
                placeholder="Search 84 refund sections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className={styles.sidebarTitle}>
              <span>Table of Contents</span>
              <span className={styles.sectionCount}>{filteredSections.length} / 84</span>
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
              className={styles.refundRequestBtn}
              onClick={() => {
                setShowModal(true);
                setModalSubmitted(false);
              }}
            >
              💵 Submit Refund Request
            </button>
          </aside>

          {/* POLICY CONTENT: ALL 84 SECTIONS */}
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

                  {sec.listItems && (
                    <ul className={styles.policyList} style={{ marginTop: "14px" }}>
                      {sec.listItems.map((item, lIdx) => (
                        <li key={lIdx}>{item}</li>
                      ))}
                    </ul>
                  )}

                  {sec.caseStudy && (
                    <div className={styles.caseStudyBox}>
                      <div className={styles.caseStudyTitle}>📌 Scenario Analysis: {sec.caseStudy.situation}</div>
                      <div className={styles.caseStudyOutcome}>✓ Standard Determination: {sec.caseStudy.outcome}</div>
                    </div>
                  )}

                  {sec.directory && (
                    <div className={styles.directoryGrid}>
                      {sec.directory.map((policy, pIdx) => (
                        <div key={pIdx} className={styles.directoryCard}>
                          <span>📄</span>
                          <span>{policy}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {sec.id === "sec-83" && (
                    <div className={styles.contactBox}>
                      <h3>Boulot Man Financial &amp; Refund Support</h3>
                      <p>
                        For questions regarding payment reversals, cancellation claims, or escrow disbursements:
                      </p>
                      <div className={styles.contactGrid}>
                        <div className={styles.contactItem}>
                          <span>Corporate Office</span>
                          <strong>KK 371 St, Kigali, Rwanda</strong>
                        </div>
                        <div className={styles.contactItem}>
                          <span>Direct Phone</span>
                          <strong>0793 762 949</strong>
                        </div>
                        <div className={styles.contactItem}>
                          <span>Refunds Email</span>
                          <strong>
                            <a href="mailto:office@boulotman.com">office@boulotman.com</a>
                          </strong>
                        </div>
                        <div className={styles.contactItem}>
                          <span>Website</span>
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
                <h3 style={{ color: "#001f3f", marginBottom: "8px" }}>No matching refund sections found</h3>
                <p style={{ color: "#64748b" }}>
                  Try a different search term like "escrow", "materials", "no-show", "case study", or "call-out".
                </p>
                <button
                  type="button"
                  className={styles.refundRequestBtn}
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
           REFUND REQUEST MODAL
      ====================================================== */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Submit Refund Request</h2>
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
                <div style={{ fontSize: "40px", marginBottom: "12px" }}>💵</div>
                <h3 style={{ color: "#001f3f", margin: "0 0 8px" }}>Refund Request Logged</h3>
                <p style={{ color: "#64748b", fontSize: "14px", lineHeight: "1.6" }}>
                  Your claim has been submitted to the Boulot Man Financial Disbursal team. The service provider
                  has 48 hours to review. You will receive real-time updates via email.
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
              <form onSubmit={handleRefundSubmit}>
                <p style={{ color: "#64748b", fontSize: "13.5px", marginTop: 0, marginBottom: "18px" }}>
                  Submit a formal refund claim for task cancellation, milestone adjustment, or unperformed services.
                </p>

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label htmlFor="refName">Your Name</label>
                    <input
                      type="text"
                      id="refName"
                      required
                      value={refundForm.name}
                      onChange={(e) => setRefundForm({ ...refundForm, name: e.target.value })}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="refEmail">Your Email</label>
                    <input
                      type="email"
                      id="refEmail"
                      required
                      value={refundForm.email}
                      onChange={(e) => setRefundForm({ ...refundForm, email: e.target.value })}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="refTask">Task / Project ID</label>
                    <input
                      type="text"
                      id="refTask"
                      required
                      placeholder="e.g. TSK-98214"
                      value={refundForm.taskId}
                      onChange={(e) => setRefundForm({ ...refundForm, taskId: e.target.value })}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="refAmt">Claim Amount</label>
                    <input
                      type="text"
                      id="refAmt"
                      required
                      placeholder="e.g. 50,000 RWF"
                      value={refundForm.amount}
                      onChange={(e) => setRefundForm({ ...refundForm, amount: e.target.value })}
                    />
                  </div>

                  <div className={`${styles.formGroup} ${styles.formFull}`}>
                    <label htmlFor="refReason">Refund Reason</label>
                    <select
                      id="refReason"
                      value={refundForm.reason}
                      onChange={(e) => setRefundForm({ ...refundForm, reason: e.target.value })}
                    >
                      <option>Provider Did Not Show / No-Show</option>
                      <option>Provider Cancelled Before Starting</option>
                      <option>Work Incomplete / Abandoned Midway</option>
                      <option>Work Materially Different from Agreed Scope</option>
                      <option>Quality Defect / Unsatisfactory Rectification</option>
                      <option>Duplicate Transaction / Overcharge</option>
                      <option>Milestone Not Delivered</option>
                      <option>Mutual Project Cancellation</option>
                    </select>
                  </div>

                  <div className={`${styles.formGroup} ${styles.formFull}`}>
                    <label htmlFor="refDesc">Claim Explanation &amp; Evidence Summary</label>
                    <textarea
                      id="refDesc"
                      rows={4}
                      required
                      placeholder="Describe work completed, materials delivered, and specific reasons for refund amount requested."
                      value={refundForm.description}
                      onChange={(e) => setRefundForm({ ...refundForm, description: e.target.value })}
                    ></textarea>
                  </div>
                </div>

                <button type="submit" className={styles.formSubmitBtn}>
                  Submit Refund Claim
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
