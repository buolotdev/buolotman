"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import styles from "./privacy.module.css";

interface PrivacySection {
  id: string;
  num: number;
  title: string;
  category: "collect" | "use" | "share" | "security" | "rights" | "special" | "governance";
  content: string[];
  subsections?: { title: string; items: string[] }[];
  listItems?: string[];
  callout?: string;
}

const PRIVACY_SECTIONS: PrivacySection[] = [
  {
    id: "sec-1",
    num: 1,
    title: "ABOUT THIS PRIVACY POLICY",
    category: "collect",
    content: [
      "This Privacy Policy applies to users of Boulot Man, including Clients, Technicians, Engineers, Independent professionals, Companies, Contractors, Business representatives, Project managers, Agents, Team members, Visitors to the Boulot Man website or applications, and other users interacting with Boulot Man services.",
      "The information collected depends on the type of account you create, the services you use, your country, whether you request or provide services, whether you undergo verification, participate in payments or escrow, communicate through the Platform, join managed projects, and other interactions with Boulot Man."
    ]
  },
  {
    id: "sec-2",
    num: 2,
    title: "WHO IS RESPONSIBLE FOR YOUR INFORMATION",
    category: "governance",
    content: [
      "The Boulot Man entity that provides the relevant Platform or service is generally responsible for determining how personal information is processed in connection with that service.",
      "Different Boulot Man entities or service providers may be involved depending on User location, Payment method, Service type, Applicable law, Country of operation, or Project arrangement. Where required, additional country-specific privacy notices may identify the relevant legal entity and local representative."
    ]
  },
  {
    id: "sec-3",
    num: 3,
    title: "INFORMATION WE COLLECT",
    category: "collect",
    content: [
      "Boulot Man may collect information directly from Users, automatically through use of the Platform, from other Users and from authorized third parties."
    ]
  },
  {
    id: "sec-4",
    num: 4,
    title: "ACCOUNT INFORMATION",
    category: "collect",
    content: [
      "When a User creates an account, Boulot Man may collect: First name, Middle name, Last name, Display name, Username, Password or authentication credentials, Profile photograph, Telephone number, Email address, Country, City, Preferred language, Account type, Registration date, Account status, and related account preferences.",
      "Passwords should be stored using appropriate security measures (salted hashing) and are not intended to be accessible in readable form by Boulot Man personnel."
    ]
  },
  {
    id: "sec-5",
    num: 5,
    title: "CLIENT INFORMATION",
    category: "collect",
    content: [
      "For Client accounts, Boulot Man may collect: Full name, Profile photograph, Contact details, Country, City, Service locations, Saved addresses, Client type, Tasks posted, Projects posted, Hiring history, Quotations requested, Professionals contacted, Payment activity, Reviews, Dispute history, Support requests, Communication preferences, and other information provided by the Client.",
      "Clients may also provide project-related information about properties, businesses, organizations or locations where work is requested."
    ]
  },
  {
    id: "sec-6",
    num: 6,
    title: "TECHNICIAN AND PROFESSIONAL INFORMATION",
    category: "collect",
    content: [
      "For Technicians, Engineers and other Professionals, Boulot Man may collect: Legal name, Professional name, Profile photograph, Professional title, Trade or occupation, Skills, Service categories, Years of experience, Professional description, Education, Training, Qualifications, Certifications, Licences, Professional registration numbers, Portfolio information, Previous projects, Availability, Service location, Service radius, Work preferences, Equipment, Tools, Team capacity, Languages, References, Professional documents, Payout information, and Platform performance information."
    ]
  },
  {
    id: "sec-7",
    num: 7,
    title: "COMPANY INFORMATION",
    category: "collect",
    content: [
      "For Company accounts, Boulot Man may collect: Legal company name, Trading name, Company logo, Business registration number, Tax identification number, Incorporation date, Country of registration, Registered address, Operating address, Website, Telephone number, Business email, Company type, Industry, Number of employees, Technical workforce size, Engineers, Project managers, Supervisors, Company description, Services offered, Operational capacity, Equipment, Fleet, Certifications, Professional licences, Insurance information, Project history, References, Key personnel, Banking or payout information, Authorized representative information, and other information relevant to verification or service eligibility."
    ]
  },
  {
    id: "sec-8",
    num: 8,
    title: "IDENTITY VERIFICATION INFORMATION",
    category: "collect",
    content: [
      "Where identity verification is required or available, Boulot Man may collect or process: Full legal name, Date of birth, Nationality, Identification type, National ID number, Passport number, Residence permit details, Document issue country, Issue date, Expiration date, Front and back copies of identification, Selfie or facial image, Live identity verification data, Verification result, Verification timestamp, and Fraud or risk indicators.",
      "Boulot Man may use specialized identity-verification providers to process some of this information. Identity documents are not intended to be publicly displayed."
    ]
  },
  {
    id: "sec-9",
    num: 9,
    title: "PROFESSIONAL VERIFICATION INFORMATION",
    category: "collect",
    content: [
      "Boulot Man may collect or verify information relating to: Qualifications, Professional licences, Certifications, Training, Professional memberships, Work history, References, Previous projects, Client confirmations, Business registrations, Company directors, Authorized representatives, Insurance, Operational capacity, Equipment, Team composition, and other information relevant to professional or company verification.",
      "Verification information may be stored to maintain an audit trail and protect the integrity of Boulot Man's verification system."
    ]
  },
  {
    id: "sec-10",
    num: 10,
    title: "USERNAME AND PUBLIC PROFILE INFORMATION",
    category: "collect",
    content: [
      "Boulot Man may allow Users to create a unique username and public profile link (e.g., @josephelectric / boulotman.com/josephelectric).",
      "Information displayed on public profiles may include: Display name, Username, Profile photo, Professional title, Company name, Company logo, Location at a general level, Services, Skills, Ratings, Reviews, Portfolio, Verification badges, Availability, Completed jobs, Completed projects, Experience, Service area, and other information intentionally made public.",
      "Sensitive information such as Identity document numbers, exact residential addresses, banking details, private verification documents, and internal fraud or security records will not ordinarily be displayed publicly."
    ]
  },
  {
    id: "sec-11",
    num: 11,
    title: "USERNAME CHANGE INFORMATION",
    category: "collect",
    content: [
      "Boulot Man may record: Current username, Previous usernames, Date of username changes, Number of changes within applicable periods, Device or session information related to changes, and Security indicators.",
      "Username change history may be retained to help prevent impersonation, fraud, abuse, account takeover, and misleading identity changes."
    ]
  },
  {
    id: "sec-12",
    num: 12,
    title: "LOCATION INFORMATION",
    category: "collect",
    content: [
      "Boulot Man may process location information to support: Nearby professional discovery, Distance calculations, Task matching, Service availability, Project matching, Country-based Platform settings, Fraud prevention, Safety, and Localized services.",
      "Location information may include: Country, City, Neighborhood, Postal area, User-entered service address, IP-derived approximate location, GPS location where permission is granted, and Service radius.",
      "Precise location information will be used only where necessary and where appropriate permission exists. Boulot Man will not publicly display a User's exact home address unless the User intentionally provides it for a specific lawful purpose."
    ]
  },
  {
    id: "sec-13",
    num: 13,
    title: "TASK AND PROJECT INFORMATION",
    category: "collect",
    content: [
      "When Clients post tasks or projects, Boulot Man may collect: Task title, Description, Category, Service type, Project location, Schedule, Urgency, Budget, Payment preference, Uploaded photographs, Videos, Plans, Drawings, BOQs, Supporting documents, Client instructions, Site information, Quotations, Offers, Milestones, Completion information, and related communications."
    ]
  },
  {
    id: "sec-14",
    num: 14,
    title: "PORTFOLIO AND WORK HISTORY",
    category: "collect",
    content: [
      "Professionals and Companies may upload: Project names, Photos, Videos, Descriptions, Project locations, Completion dates, Client names, Project values, Certificates, References, and other work-related information.",
      "Users are responsible for ensuring they have the right to publish portfolio materials. Boulot Man may remove content where privacy, intellectual-property or other legitimate concerns arise."
    ]
  },
  {
    id: "sec-15",
    num: 15,
    title: "COMMUNICATIONS",
    category: "collect",
    content: [
      "Boulot Man may process communications sent through the Platform, including: Messages, Task discussions, Quotations, Project instructions, Support chats, Dispute communications, Attachments, Notifications, and other Platform interactions.",
      "Communications may be processed where necessary to deliver messaging functionality, support Users, prevent fraud, investigate abuse, resolve disputes, improve safety, enforce Platform rules, and comply with law."
    ]
  },
  {
    id: "sec-16",
    num: 16,
    title: "PAYMENT INFORMATION",
    category: "collect",
    content: [
      "Where payments are supported, Boulot Man or authorized payment providers may process: Account holder name, Bank details, Payment method, Payment-provider account details, Transaction amounts, Currency, Transaction reference, Payment status, Refund information, Escrow status, Milestone payments, Payout history, Billing information, Tax information, and Fraud-prevention data.",
      "Boulot Man does not directly store full payment-card numbers where processing is handled by PCI-DSS compliant third-party payment gateways. Payment information is never publicly displayed."
    ]
  },
  {
    id: "sec-17",
    num: 17,
    title: "ESCROW AND MILESTONE DATA",
    category: "collect",
    content: [
      "Where escrow or milestone payments are used, Boulot Man may process information concerning: Funded amounts, Release conditions, Milestones, Payment dates, Work approval, Completion status, Dispute status, Refund requests, Payout status, and Transaction evidence."
    ]
  },
  {
    id: "sec-18",
    num: 18,
    title: "REVIEWS AND RATINGS",
    category: "collect",
    content: [
      "Boulot Man may collect: Star ratings, Written reviews, Client reviews of Providers, Provider reviews of Clients, Review date, Associated task or project, Moderation status, Reports concerning reviews, and Evidence used to investigate disputed reviews."
    ]
  },
  {
    id: "sec-19",
    num: 19,
    title: "DEVICE AND TECHNICAL INFORMATION",
    category: "collect",
    content: [
      "When Users access Boulot Man, technical data collected automatically includes: IP address, Browser type, Operating system, Device type, Device identifiers, Application version, Language settings, Login timestamps, Referring pages, Pages visited, Session information, Error logs, Performance data, and Security-related activity."
    ]
  },
  {
    id: "sec-20",
    num: 20,
    title: "COOKIES AND SIMILAR TECHNOLOGIES",
    category: "collect",
    content: [
      "Boulot Man may use cookies, local storage, pixels and similar technologies to maintain sessions, remember preferences, authenticate Users, protect accounts, understand Platform usage, measure performance, improve features, detect abuse, and support permitted marketing activities."
    ]
  },
  {
    id: "sec-21",
    num: 21,
    title: "INFORMATION FROM THIRD PARTIES",
    category: "collect",
    content: [
      "Boulot Man may receive information from: Payment providers, Identity-verification providers, Business registries, Professional bodies, Mapping providers, Authentication providers, Security providers, Referral partners, other Users, Project clients, Companies, References, and publicly available lawful sources."
    ]
  },
  {
    id: "sec-22",
    num: 22,
    title: "INFORMATION ABOUT OTHER PEOPLE",
    category: "collect",
    content: [
      "Users may sometimes provide information concerning: Employees, Team members, References, Clients, Company representatives, Emergency contacts, Project stakeholders, or other persons.",
      "Users must only provide another person's personal information where they have an appropriate legal basis or permission to do so."
    ]
  },
  {
    id: "sec-23",
    num: 23,
    title: "HOW BOULOT MAN USES INFORMATION",
    category: "use",
    content: [
      "Boulot Man may use personal information to: Create and manage accounts, Authenticate Users, Maintain public profiles, Generate profile links, Match Clients with Providers, Display nearby Professionals, Process task postings, Process project opportunities, Enable quotations, Facilitate hiring, Support messaging, Process payments, Support escrow, Manage milestones, Verify Users, Verify Companies, Detect fraud, Protect account security, Prevent impersonation, Moderate Platform activity, Handle support requests, Resolve disputes, Process reviews, Improve recommendations, Analyze usage, Maintain business records, Comply with law, Enforce Terms, and Protect the public."
    ]
  },
  {
    id: "sec-24",
    num: 24,
    title: "LEGAL BASES FOR PROCESSING",
    category: "use",
    content: [
      "Depending on applicable law, Boulot Man processes personal data on one or more legal grounds:"
    ],
    subsections: [
      {
        title: "24.1 Performance of a Contract",
        items: [
          "Creating accounts and providing core marketplace matching",
          "Processing task bids, project workflows and messaging",
          "Facilitating escrow funding, milestone approvals and payouts"
        ]
      },
      {
        title: "24.2 Consent",
        items: [
          "Optional marketing communications and promotional emails",
          "Device GPS location permissions and cookie analytics preferences",
          "Specific biometric or specialized document verifications"
        ]
      },
      {
        title: "24.3 Legitimate Interests",
        items: [
          "Protecting account security, platform integrity and anti-fraud systems",
          "Improving algorithms, search relevancy, and service speed",
          "Resolving platform disputes and administering business records"
        ]
      },
      {
        title: "24.4 Legal Obligations & Vital Interests",
        items: [
          "Complying with tax, accounting, financial and regulatory reporting laws",
          "Responding to lawful court orders and law enforcement subpoenas",
          "Protecting life, health or physical safety in critical emergencies"
        ]
      }
    ]
  },
  {
    id: "sec-25",
    num: 25,
    title: "MATCHING AND RECOMMENDATIONS",
    category: "use",
    content: [
      "Boulot Man may use information such as Location, Service category, Skills, Experience, Ratings, Availability, Completed jobs, Company capacity, User preferences, and Task characteristics to recommend Providers, tasks, projects or other opportunities."
    ]
  },
  {
    id: "sec-26",
    num: 26,
    title: "PROFILE RANKING AND SEARCH RESULTS",
    category: "use",
    content: [
      "Professionals and Companies may appear in search or recommendation results based on: Relevance, Location, Service category, Availability, Verification, Ratings, Reviews, Completion history, Responsiveness, Platform performance, Profile completeness, and other legitimate quality signals."
    ]
  },
  {
    id: "sec-27",
    num: 27,
    title: "AUTOMATED DECISION-MAKING",
    category: "use",
    content: [
      "Boulot Man may use automated systems to assist with: Fraud detection, Spam prevention, Identity-risk assessment, Matching, Search rankings, Content moderation, Risk scoring, and Security monitoring. Review mechanisms are provided where required by law."
    ]
  },
  {
    id: "sec-28",
    num: 28,
    title: "VERIFICATION BADGES",
    category: "use",
    content: [
      "Verification badges (Phone Verified, Email Verified, Identity Verified, Skills Verified, Professional Verified, Business Verified, Capability Verified) indicate that specific criteria were verified. Only verification status is public; underlying identity documents remain strictly confidential."
    ]
  },
  {
    id: "sec-29",
    num: 29,
    title: "SHARING BETWEEN CLIENTS AND PROVIDERS",
    category: "share",
    content: [
      "After a Client hires a Provider, Boulot Man discloses information necessary for the engagement, such as Client name, Service location, Contact method, Task details, Project instructions, and Schedule. Only information reasonably necessary for the engagement is shared."
    ]
  },
  {
    id: "sec-30",
    num: 30,
    title: "SHARING WITH COMPANIES AND TEAM MEMBERS",
    category: "share",
    content: [
      "For company or team-based projects, information may be shared with Company representatives, Project managers, Supervisors, Assigned Technicians, Team members, and Subcontractors limited to what is required for project execution."
    ]
  },
  {
    id: "sec-31",
    num: 31,
    title: "CONCIERGE SERVICES",
    category: "share",
    content: [
      "For Boulot Man Concierge, personal and project data is processed for Professional selection, Site supervision, Coordination, Progress reporting, Scheduling, and Client representation."
    ]
  },
  {
    id: "sec-32",
    num: 32,
    title: "BUILD A TEAM SERVICES",
    category: "share",
    content: [
      "Where Boulot Man helps assemble a team, information is used to Identify suitable Professionals, Evaluate skills, Check availability, Organize teams, Assign roles, and Monitor performance."
    ]
  },
  {
    id: "sec-33",
    num: 33,
    title: "BOULOT MAN CONTRACTORS",
    category: "share",
    content: [
      "For Boulot Man Contractors enterprise projects, processing involves project personnel, contractors, engineers, site supervisors, payment information, and compliance records under separate project contracts."
    ]
  },
  {
    id: "sec-34",
    num: 34,
    title: "SHARING WITH SERVICE PROVIDERS",
    category: "share",
    content: [
      "Boulot Man uses trusted third-party providers for Hosting, Cloud infrastructure, Database storage, Identity verification, Payment processing, Analytics, Support, Email, SMS, Maps, and Security. All providers are bound by strict data-protection agreements."
    ]
  },
  {
    id: "sec-35",
    num: 35,
    title: "PAYMENT PROVIDERS",
    category: "share",
    content: [
      "Payment information is shared with authorized Banks, Payment processors, Financial institutions, and Escrow facilitators who process transactions under their own regulatory obligations."
    ]
  },
  {
    id: "sec-36",
    num: 36,
    title: "LEGAL AND REGULATORY DISCLOSURES",
    category: "share",
    content: [
      "Boulot Man may disclose information where required to comply with law, valid court orders, lawful government requests, investigate fraud, protect Users, or prevent serious harm."
    ]
  },
  {
    id: "sec-37",
    num: 37,
    title: "BUSINESS TRANSFERS",
    category: "share",
    content: [
      "In the event of a merger, acquisition, reorganization, or asset sale, personal data may be transferred subject to applicable data protection safeguards."
    ]
  },
  {
    id: "sec-38",
    num: 38,
    title: "PUBLIC INFORMATION",
    category: "share",
    content: [
      "Public profiles intentionally display display name, username, profile photo, services, general location, ratings, reviews, and badges. Users should not post sensitive private information on public profiles."
    ]
  },
  {
    id: "sec-39",
    num: 39,
    title: "INFORMATION WE DO NOT SELL",
    category: "share",
    content: [
      "Boulot Man strictly does NOT sell identity documents, banking details, private communications, or sensitive personal information to data brokers or third parties."
    ]
  },
  {
    id: "sec-40",
    num: 40,
    title: "MARKETING COMMUNICATIONS",
    category: "security",
    content: [
      "Users may receive platform news and opportunities with consent and can opt out of promotional emails at any time. Essential transactional notices will continue to be delivered."
    ]
  },
  {
    id: "sec-41",
    num: 41,
    title: "PUSH NOTIFICATIONS",
    category: "security",
    content: [
      "Users may receive push notifications regarding task invitations, bids, messages, and security updates, and can manage preferences in their app or device settings."
    ]
  },
  {
    id: "sec-42",
    num: 42,
    title: "SECURITY",
    category: "security",
    content: [
      "Boulot Man employs industry-standard technical measures: Data encryption at rest and in transit, Multi-factor authentication, Role-based access control, Audit logging, Regular security audits, and Incident response protocols."
    ]
  },
  {
    id: "sec-43",
    num: 43,
    title: "DATA BREACH RESPONSE",
    category: "security",
    content: [
      "In the event of a detected personal data breach, Boulot Man will contain the incident, assess risk, and notify affected Users and relevant regulators in accordance with applicable laws."
    ]
  },
  {
    id: "sec-44",
    num: 44,
    title: "DATA RETENTION",
    category: "security",
    content: [
      "Personal data is retained only as long as necessary to fulfill contractual obligations, resolve disputes, prevent fraud, and satisfy statutory tax and financial retention laws."
    ]
  },
  {
    id: "sec-45",
    num: 45,
    title: "ACCOUNT DELETION",
    category: "security",
    content: [
      "Users can request full account deletion. Public profile details are removed, while statutory audit, payment, and tax records are securely archived as required by law."
    ]
  },
  {
    id: "sec-46",
    num: 46,
    title: "PROFILE DEACTIVATION",
    category: "security",
    content: [
      "Users can temporarily deactivate their public profile without deleting past project history, stopping new incoming proposals while maintaining past records."
    ]
  },
  {
    id: "sec-47",
    num: 47,
    title: "USER RIGHTS",
    category: "rights",
    content: [
      "Users have rights to Access personal data, Correct inaccuracies, Request erasure, Restrict processing, Object to direct marketing, Receive portable copies, and File complaints with data protection authorities."
    ]
  },
  {
    id: "sec-48",
    num: 48,
    title: "ACCESS REQUESTS",
    category: "rights",
    content: [
      "Users may request copies of personal data stored by Boulot Man. Identity verification will be required before fulfilling data requests."
    ]
  },
  {
    id: "sec-49",
    num: 49,
    title: "CORRECTION",
    category: "rights",
    content: [
      "Users can update profile information directly via dashboard settings or submit proof for sensitive changes like legal name or business registration numbers."
    ]
  },
  {
    id: "sec-50",
    num: 50,
    title: "DATA PORTABILITY",
    category: "rights",
    content: [
      "Users are entitled to request an export of their core profile and project data in a structured, machine-readable format (JSON/CSV)."
    ]
  },
  {
    id: "sec-51",
    num: 51,
    title: "WITHDRAWING CONSENT",
    category: "rights",
    content: [
      "Where processing relies on consent (e.g. optional marketing or precise GPS tracking), consent may be withdrawn at any time through account settings."
    ]
  },
  {
    id: "sec-52",
    num: 52,
    title: "LOCATION PERMISSIONS",
    category: "rights",
    content: [
      "Users can disable GPS permissions on their device. When disabled, distance calculations can still be performed using manually entered cities."
    ]
  },
  {
    id: "sec-53",
    num: 53,
    title: "CHILDREN AND MINORS",
    category: "rights",
    content: [
      "Boulot Man is intended strictly for users of legal working age. Accounts found to be created by minors without authorization will be promptly deactivated."
    ]
  },
  {
    id: "sec-54",
    num: 54,
    title: "PROFESSIONAL SAFETY AND LOCATION PRIVACY",
    category: "special",
    content: [
      "Exact residential addresses are never displayed publicly on discovery cards. Detailed site addresses are only disclosed once a task has been officially accepted and funded."
    ]
  },
  {
    id: "sec-55",
    num: 55,
    title: "IDENTITY DOCUMENT SECURITY",
    category: "special",
    content: [
      "Government IDs and passports are encrypted and stored in restricted private vaults accessible only by authorized verification staff."
    ]
  },
  {
    id: "sec-56",
    num: 56,
    title: "BIOMETRIC OR FACIAL VERIFICATION",
    category: "special",
    content: [
      "Where facial verification is used to prevent impersonation, biometric data is processed solely for identity confirmation and never used for advertising."
    ]
  },
  {
    id: "sec-57",
    num: 57,
    title: "FRAUD PREVENTION",
    category: "special",
    content: [
      "Boulot Man utilizes behavioral monitoring, session checks, and dispute pattern analysis to detect fake accounts, scam attempts, and chargeback abuse."
    ]
  },
  {
    id: "sec-58",
    num: 58,
    title: "ACCOUNT ENFORCEMENT",
    category: "special",
    content: [
      "Where accounts are suspended for violations, relevant logs and evidence are preserved for appeals and regulatory compliance."
    ]
  },
  {
    id: "sec-59",
    num: 59,
    title: "INTERNATIONAL DATA TRANSFERS",
    category: "special",
    content: [
      "When personal data is transferred across borders, Boulot Man ensures lawful transfer mechanisms, Standard Contractual Clauses, and equivalent data protection safeguards."
    ]
  },
  {
    id: "sec-60",
    num: 60,
    title: "CROSS-BORDER PROJECTS",
    category: "special",
    content: [
      "For cross-border assignments, project data is shared only with verified international participants involved in the contract."
    ]
  },
  {
    id: "sec-61",
    num: 61,
    title: "COUNTRY-SPECIFIC PRIVACY RIGHTS",
    category: "governance",
    content: [
      "Additional rights and notices may apply based on local data protection legislation in your jurisdiction."
    ]
  },
  {
    id: "sec-62",
    num: 62,
    title: "EEA, UK AND GDPR COMPLIANCE",
    category: "governance",
    content: [
      "Users in the EEA and UK enjoy full rights under GDPR/UK GDPR regarding data access, erasure, rectification, portability, and lodging complaints with supervisory authorities."
    ]
  },
  {
    id: "sec-63",
    num: 63,
    title: "AFRICAN DATA-PROTECTION REQUIREMENTS",
    category: "governance",
    content: [
      "Boulot Man adheres to national data protection frameworks across Rwanda, Cameroon, Nigeria, Kenya, Ghana, South Africa, and Ivory Coast."
    ]
  },
  {
    id: "sec-64",
    num: 64,
    title: "THIRD-PARTY LINKS",
    category: "governance",
    content: [
      "Boulot Man is not responsible for the independent privacy practices of external third-party websites linked on the platform."
    ]
  },
  {
    id: "sec-65",
    num: 65,
    title: "SOCIAL MEDIA AND EXTERNAL SHARING",
    category: "governance",
    content: [
      "When users share profile links or job postings to social networks, third-party social privacy terms apply."
    ]
  },
  {
    id: "sec-66",
    num: 66,
    title: "QR PROFILE LINKS",
    category: "governance",
    content: [
      "Boulot Man QR codes link to public profiles and do not expose private ID or financial information."
    ]
  },
  {
    id: "sec-67",
    num: 67,
    title: "ANALYTICS",
    category: "governance",
    content: [
      "Aggregated platform analytics are used to measure traffic, page performance, and marketplace feature adoption."
    ]
  },
  {
    id: "sec-68",
    num: 68,
    title: "RESEARCH AND PLATFORM IMPROVEMENT",
    category: "governance",
    content: [
      "Anonymized and de-identified data may be used to analyze workforce trends and improve matchmaking efficiency."
    ]
  },
  {
    id: "sec-69",
    num: 69,
    title: "ARTIFICIAL INTELLIGENCE AND AUTOMATION",
    category: "governance",
    content: [
      "AI tools assist in category matching, search relevance, and spam prevention without compromising sensitive personal data."
    ]
  },
  {
    id: "sec-70",
    num: 70,
    title: "DATA MINIMIZATION",
    category: "governance",
    content: [
      "Boulot Man only requests personal data that is strictly necessary for service delivery, verification, and safety."
    ]
  },
  {
    id: "sec-71",
    num: 71,
    title: "INTERNAL ACCESS CONTROLS",
    category: "governance",
    content: [
      "Staff access to personal records is partitioned by strict role-based access control, monitoring, and non-disclosure agreements."
    ]
  },
  {
    id: "sec-72",
    num: 72,
    title: "CONFIDENTIAL PROJECT INFORMATION",
    category: "governance",
    content: [
      "Confidential architectural drawings, BOQs, and project plans uploaded by clients are protected by strict access control."
    ]
  },
  {
    id: "sec-73",
    num: 73,
    title: "USER RESPONSIBILITY FOR PRIVACY",
    category: "governance",
    content: [
      "Users are responsible for safeguarding their login credentials, avoiding posting private phone numbers in public task titles, and reporting suspicious security events."
    ]
  },
  {
    id: "sec-74",
    num: 74,
    title: "PRIVACY OF REFERENCES",
    category: "governance",
    content: [
      "Contact information of professional references is used solely for verification and is never published publicly."
    ]
  },
  {
    id: "sec-75",
    num: 75,
    title: "PRIVACY OF COMPANY PERSONNEL",
    category: "governance",
    content: [
      "Company profiles show only authorized professional information; private personnel IDs remain strictly protected."
    ]
  },
  {
    id: "sec-76",
    num: 76,
    title: "PRIVACY OF REVIEWS",
    category: "governance",
    content: [
      "Public reviews show reviewer display name and general project context while protecting sensitive private contact details."
    ]
  },
  {
    id: "sec-77",
    num: 77,
    title: "DISPUTE INFORMATION",
    category: "governance",
    content: [
      "Evidence submitted during dispute resolution is shared only with the opposing party, mediators, and authorized adjudicators."
    ]
  },
  {
    id: "sec-78",
    num: 78,
    title: "LAW-ENFORCEMENT REQUESTS",
    category: "governance",
    content: [
      "Boulot Man evaluates all government and law-enforcement requests for legal validity before disclosing required records."
    ]
  },
  {
    id: "sec-79",
    num: 79,
    title: "PRIVACY COMPLAINTS",
    category: "governance",
    content: [
      "Users may file privacy inquiries directly with the Boulot Man Data Protection Officer at office@boulotman.com."
    ]
  },
  {
    id: "sec-80",
    num: 80,
    title: "CHANGES TO THIS PRIVACY POLICY",
    category: "governance",
    content: [
      "When this policy is updated, the revised date will be reflected at the top of the document, with advance notice provided for material changes."
    ]
  },
  {
    id: "sec-81",
    num: 81,
    title: "RELATIONSHIP WITH OTHER POLICIES",
    category: "governance",
    content: [
      "This Privacy Policy operates alongside the Terms of Service, Legal Center, Community Guidelines, and Payments & Escrow rules."
    ]
  },
  {
    id: "sec-82",
    num: 82,
    title: "CONTACT FOR PRIVACY QUESTIONS",
    category: "governance",
    content: [
      "Questions, requests or complaints concerning privacy may be directed to Boulot Man through its official support or privacy channels."
    ],
    callout: "Boulot Man Inc.\nAddress: KK 371 St, Kigali, Rwanda\nPhone: 0793 762 949\nEmail: office@boulotman.com\nWebsite: www.boulotman.com"
  },
  {
    id: "sec-83",
    num: 83,
    title: "PRIVACY REQUESTS",
    category: "rights",
    content: [
      "Users may contact Boulot Man to request access, correction, deletion, restriction, portability, or marketing opt-outs. Reasonable identity verification is required before processing."
    ]
  },
  {
    id: "sec-84",
    num: 84,
    title: "FINAL PRIVACY COMMITMENT",
    category: "governance",
    content: [
      "Boulot Man's trust model depends on Users being able to interact with Clients, Professionals and Companies without unnecessarily exposing sensitive information.",
      "Boulot Man strictly follows the core principles of Transparency, Purpose limitation, Data minimization, Security, Confidentiality, Accuracy, Appropriate retention, User control, and Responsible information sharing."
    ]
  }
];

export default function PrivacyPolicyPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeSectionId, setActiveSectionId] = useState<string>("sec-1");
  const [showModal, setShowModal] = useState(false);
  const [modalSubmitted, setModalSubmitted] = useState(false);
  const [requestForm, setRequestForm] = useState({
    name: "",
    email: "",
    requestType: "Access My Data",
    details: ""
  });

  const filteredSections = PRIVACY_SECTIONS.filter((s) => {
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

  const handleFormSubmit = (e: React.FormEvent) => {
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
              <span className={styles.heroBadge}>🔒 Privacy &amp; Data Protection</span>
              <span className={styles.heroDate}>Effective Date &amp; Updated: August 31, 2026</span>
            </div>

            <h1 className={styles.heroTitle}>Boulot Man Privacy Policy</h1>
            <p className={styles.heroSubtitle}>
              Boulot Man respects the privacy of its users and is committed to handling personal information
              responsibly, transparently and securely across our platform, applications and services.
            </p>

            {/* QUICK NAV CATEGORIES */}
            <div className={styles.quickNav}>
              <button
                type="button"
                className={styles.navPill}
                onClick={() => {
                  setActiveCategory("collect");
                  handleScrollTo("sec-3");
                }}
              >
                🗄️ Data We Collect (Sec 1-22)
              </button>
              <button
                type="button"
                className={styles.navPill}
                onClick={() => {
                  setActiveCategory("use");
                  handleScrollTo("sec-23");
                }}
              >
                ⚙️ How We Use Data (Sec 23-28)
              </button>
              <button
                type="button"
                className={styles.navPill}
                onClick={() => {
                  setActiveCategory("share");
                  handleScrollTo("sec-29");
                }}
              >
                🤝 Sharing &amp; Disclosure (Sec 29-39)
              </button>
              <button
                type="button"
                className={styles.navPill}
                onClick={() => {
                  setActiveCategory("security");
                  handleScrollTo("sec-40");
                }}
              >
                🛡️ Security &amp; Retention (Sec 40-46)
              </button>
              <button
                type="button"
                className={styles.navPill}
                onClick={() => {
                  setActiveCategory("rights");
                  handleScrollTo("sec-47");
                }}
              >
                👤 Your Rights &amp; Choices (Sec 47-53)
              </button>
              <button
                type="button"
                className={styles.navPill}
                onClick={() => {
                  setActiveCategory("governance");
                  handleScrollTo("sec-61");
                }}
              >
                🌍 Global &amp; African Laws (Sec 61-84)
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
                placeholder="Search 84 privacy sections..."
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
              className={styles.requestDpoBtn}
              onClick={() => {
                setShowModal(true);
                setModalSubmitted(false);
              }}
            >
              ✉️ Submit Privacy / GDPR Request
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

                  {sec.id === "sec-82" && (
                    <div className={styles.contactBox}>
                      <h3>Boulot Man Official Contact for Privacy Questions</h3>
                      <p>
                        For questions, requests, or inquiries regarding personal data processing or data protection compliance:
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
                          <span>Privacy Email</span>
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
                <h3 style={{ color: "#001f3f", marginBottom: "8px" }}>No matching privacy sections found</h3>
                <p style={{ color: "#64748b" }}>
                  Try a different search term like "payment", "verification", "cookies", or "rights".
                </p>
                <button
                  type="button"
                  className={styles.requestDpoBtn}
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
           INTERACTIVE PRIVACY REQUEST MODAL
      ====================================================== */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Privacy &amp; Data Rights Request</h2>
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
                <div style={{ fontSize: "40px", marginBottom: "12px" }}>✅</div>
                <h3 style={{ color: "#001f3f", margin: "0 0 8px" }}>Request Submitted Successfully</h3>
                <p style={{ color: "#64748b", fontSize: "14px", lineHeight: "1.6" }}>
                  Your privacy request has been forwarded to the Boulot Man Data Protection Officer. We will
                  verify your identity and respond to your email within 30 calendar days.
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
              <form onSubmit={handleFormSubmit}>
                <p style={{ color: "#64748b", fontSize: "13.5px", marginTop: 0, marginBottom: "18px" }}>
                  Exercise your statutory rights under applicable privacy laws (GDPR / African Data Protection).
                </p>

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label htmlFor="reqName">Full Legal Name</label>
                    <input
                      type="text"
                      id="reqName"
                      required
                      value={requestForm.name}
                      onChange={(e) => setRequestForm({ ...requestForm, name: e.target.value })}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="reqEmail">Registered Email</label>
                    <input
                      type="email"
                      id="reqEmail"
                      required
                      value={requestForm.email}
                      onChange={(e) => setRequestForm({ ...requestForm, email: e.target.value })}
                    />
                  </div>

                  <div className={`${styles.formGroup} ${styles.formFull}`}>
                    <label htmlFor="reqType">Type of Privacy Request</label>
                    <select
                      id="reqType"
                      value={requestForm.requestType}
                      onChange={(e) => setRequestForm({ ...requestForm, requestType: e.target.value })}
                    >
                      <option>Access My Personal Data (Copy / Export)</option>
                      <option>Correct Inaccurate Information</option>
                      <option>Delete My Account &amp; Data (Right to Erasure)</option>
                      <option>Restrict / Object to Processing</option>
                      <option>Withdraw Consent</option>
                      <option>Opt-Out of Marketing Communications</option>
                      <option>Other Data Protection Inquiry</option>
                    </select>
                  </div>

                  <div className={`${styles.formGroup} ${styles.formFull}`}>
                    <label htmlFor="reqDetails">Request Details / Additional Context</label>
                    <textarea
                      id="reqDetails"
                      rows={4}
                      placeholder="Please specify any particular dates, transactions, or documents relevant to your request."
                      value={requestForm.details}
                      onChange={(e) => setRequestForm({ ...requestForm, details: e.target.value })}
                    ></textarea>
                  </div>
                </div>

                <button type="submit" className={styles.formSubmitBtn}>
                  Submit Official Request
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
