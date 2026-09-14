"use client";

import React, { useState } from "react";
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import "./contracts.css";

const CATEGORIES = [
  {
    title: "Nannies & Childcare",
    desc: "Live-in or live-out nannies, after-school caregivers, night nannies and family support professionals.",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=900&q=80",
    linkUrl: "/service-providers/technicians?q=nanny",
  },
  {
    title: "Caregivers & Home Support",
    desc: "Elderly companions, personal care assistants, recovery support and qualified home-care professionals.",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=80",
    linkUrl: "/service-providers/technicians?q=caregiver",
  },
  {
    title: "Private Chefs & Cooks",
    desc: "Family cooks, private chefs, meal-preparation professionals and dietary-specialist cooks.",
    image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=900&q=80",
    linkUrl: "/service-providers/technicians?q=chef",
  },
  {
    title: "Tutors & Instructors",
    desc: "Academic tutors, language teachers, music instructors, ICT tutors and exam-preparation professionals.",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80",
    linkUrl: "/service-providers/technicians?q=tutor",
  },
  {
    title: "Household Support",
    desc: "Housekeepers, domestic assistants, laundry professionals, home organizers and household supervisors.",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80",
    linkUrl: "/service-providers/technicians?q=housekeeper",
  },
  {
    title: "Drivers & Chauffeurs",
    desc: "Private drivers, family drivers, school drivers, executive drivers and personal chauffeurs.",
    image: "https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=900&q=80",
    linkUrl: "/service-providers/technicians?q=driver",
  },
  {
    title: "Property & Estate Support",
    desc: "Property caretakers, groundskeepers, gardeners, pool technicians and estate attendants.",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=900&q=80",
    linkUrl: "/service-providers/technicians?q=caretaker",
  },
  {
    title: "Technical Professionals",
    desc: "Electricians, plumbers, AC technicians, generator technicians, solar installers and maintenance specialists.",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=900&q=80",
    linkUrl: "/service-providers/technicians",
  },
  {
    title: "Personal & Administrative Support",
    desc: "Personal assistants, private secretaries, household administrators and property coordinators.",
    image: "https://images.unsplash.com/photo-1551836022-4c4c79ecde51?auto=format&fit=crop&w=900&q=80",
    linkUrl: "/service-providers/technicians?q=assistant",
  },
];

const FAQS = [
  {
    q: "Is Professional Contracts the same as posting a task?",
    a: "No. Tasks are generally shorter, defined jobs. Professional Contracts are intended for recurring or longer-term professional service relationships.",
  },
  {
    q: "How long can a contract last?",
    a: "Contracts may run from approximately one month to one year or longer, depending on the arrangement and applicable law.",
  },
  {
    q: "What is an agency-managed professional?",
    a: "An agency-managed professional is supported by a participating workforce or service agency that may provide supervision, replacement options, contract administration or other support depending on the plan.",
  },
  {
    q: "Can I hire an independent professional directly?",
    a: "Yes. Clients can choose eligible independent professionals where the contract structure permits and manage the relationship directly.",
  },
  {
    q: "Does Boulot Man guarantee every professional?",
    a: "No. Verification and screening can reduce uncertainty, but they cannot eliminate all risk or guarantee future conduct or performance.",
  },
  {
    q: "Can professionals report problems with clients?",
    a: "Yes. Contract-support processes should provide appropriate channels for concerns raised by both clients and professionals.",
  },
  {
    q: "Can I keep my contract request private?",
    a: "Yes. Private recruitment can be used when a client does not want to publicly advertise personal or household staffing requirements.",
  },
  {
    q: "Can a contract be renewed?",
    a: "Yes. Where both parties agree, the contract can be renewed, extended or renegotiated.",
  },
];

export default function ProfessionalContractsPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <>
      <Header />

      <main className="bmpcPage">
        {/* HERO */}
        <section className="bmpcHero">
          <div className="bmpcHeroOverlay"></div>

          <div className="bmpcContainer bmpcHeroContent">
            <div className="bmpcHeroCopy">
              <div className="bmpcKicker">BOULOT MAN PROFESSIONAL CONTRACTS</div>

              <h1>Hire trusted professionals for longer-term personal and household services.</h1>

              <p className="bmpcHeroLead">
                Find qualified professionals for recurring or longer-term engagements —
                from one month to one year or longer.
              </p>

              <p className="bmpcHeroSub">
                Hire an independent professional directly, or choose an agency-managed
                professional when you want additional continuity, support and replacement options.
              </p>

              <div className="bmpcHeroActions">
                <a href="#find-professional" className="bmpcBtn bmpcBtnPrimary">Find a Professional</a>
                <Link href="/post-task" className="bmpcBtn bmpcBtnSecondary">Post a Contract</Link>
              </div>

              <div className="bmpcHeroMeta">
                <span>1 Month+</span>
                <span>Independent or Agency-Managed</span>
                <span>Qualified Applications</span>
              </div>
            </div>

            <div className="bmpcHeroCard">
              <div className="bmpcHeroCardLabel">Popular Contract Needs</div>
              <div className="bmpcHeroCardGrid">
                <div>Nannies</div>
                <div>Caregivers</div>
                <div>Private Chefs</div>
                <div>Tutors</div>
                <div>Drivers</div>
                <div>Housekeepers</div>
                <div>Personal Assistants</div>
                <div>Technical Professionals</div>
              </div>
            </div>
          </div>
        </section>

        {/* INTRO */}
        <section className="bmpcSection bmpcIntro">
          <div className="bmpcContainer bmpcGrid2">
            <div>
              <span className="bmpcSectionLabel">A PROFESSIONAL FOR MORE THAN JUST ONE TASK</span>
              <h2>Some services require continuity, trust and consistency.</h2>

              <p>
                You may need a nanny who understands your family routine, a caregiver who can
                reliably support someone every day, a chef who prepares meals throughout the week,
                a tutor who works with a student throughout the academic year, a driver you can
                trust with your family, or a technician who regularly maintains your home or property.
              </p>

              <p>
                Boulot Man Professional Contracts is designed for these longer professional relationships.
              </p>

              <div className="bmpcDurationRow">
                <span>1 Month</span>
                <span>3 Months</span>
                <span>6 Months</span>
                <span>12 Months</span>
                <span>Renewable</span>
                <span>Longer-Term</span>
              </div>
            </div>

            <div className="bmpcPhotoPanel bmpcPhotoPanelIntro">
              <div className="bmpcPhotoCaption">
                <strong>Flexible arrangements</strong>
                <span>Full-time · Part-time · Live-in · Live-out · Weekends · Scheduled visits</span>
              </div>
            </div>
          </div>
        </section>

        {/* CATEGORIES */}
        <section className="bmpcSection bmpcSectionSoft" id="find-professional">
          <div className="bmpcContainer">
            <div className="bmpcSectionHead">
              <div>
                <span className="bmpcSectionLabel">FIND THE RIGHT PROFESSIONAL</span>
                <h2>Professional contracts across personal, household and technical services.</h2>
              </div>
              <Link href="/service-providers/technicians" className="bmpcTextLink">Browse all professionals →</Link>
            </div>

            <div className="bmpcCategoryGrid">
              {CATEGORIES.map((cat, idx) => (
                <Link key={idx} href={cat.linkUrl} style={{ textDecoration: "none", color: "inherit" }}>
                  <article className="bmpcCategoryCard">
                    <div
                      className="bmpcCategoryCardImage"
                      style={{ backgroundImage: `url("${cat.image}")` }}
                    />
                    <div className="bmpcCategoryCardBody">
                      <h3>{cat.title}</h3>
                      <p>{cat.desc}</p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* TWO WAYS TO HIRE */}
        <section className="bmpcSection bmpcHireOptions">
          <div className="bmpcContainer">
            <div className="bmpcSectionHead bmpcSectionHeadCenter">
              <div>
                <span className="bmpcSectionLabel">CHOOSE HOW YOU WANT TO HIRE</span>
                <h2>Independent flexibility or agency-supported continuity.</h2>
                <p>Choose the level of support that fits your needs, budget and risk preference.</p>
              </div>
            </div>

            <div className="bmpcHireGrid">
              <article className="bmpcHireCard">
                <div className="bmpcHireCardTop">
                  <span className="bmpcBadge bmpcBadgeBlue">DIRECT HIRE</span>
                  <h3>Independent Professional</h3>
                  <p>Hire and manage the professional directly.</p>
                </div>

                <ul>
                  <li>Verified professional profile</li>
                  <li>Qualifications and experience where applicable</li>
                  <li>References where available</li>
                  <li>Previous reviews and contract history</li>
                  <li>Direct communication</li>
                  <li>Flexible negotiation</li>
                  <li>Usually lower overall cost</li>
                </ul>

                <div className="bmpcHireNote">
                  Independent arrangements generally do not include automatic agency replacement,
                  backup staffing or agency supervision.
                </div>

                <Link href="/service-providers/technicians" className="bmpcBtn bmpcBtnOutlineDark">
                  Browse Independent Professionals
                </Link>
              </article>

              <article className="bmpcHireCard bmpcHireCardFeatured">
                <div className="bmpcHireCardTop">
                  <span className="bmpcBadge bmpcBadgeOrange">MANAGED SUPPORT</span>
                  <h3>Agency-Managed Professional</h3>
                  <p>Choose a professional supported by an approved network agency.</p>
                </div>

                <ul>
                  <li>Professional screening</li>
                  <li>Agency supervision</li>
                  <li>Replacement support where included</li>
                  <li>Temporary backup personnel where available</li>
                  <li>Performance support</li>
                  <li>Contract administration</li>
                  <li>Training support</li>
                  <li>Insurance where specifically included</li>
                </ul>

                <div className="bmpcHireNote">
                  Best suited for clients who value continuity, support and structured contract management.
                </div>

                <Link href="/search?type=company" className="bmpcBtn bmpcBtnPrimary">
                  Browse Agency-Managed Professionals
                </Link>
              </article>
            </div>
          </div>
        </section>

        {/* IMAGE STORY */}
        <section className="bmpcStory">
          <div className="bmpcContainer bmpcStoryGrid">
            <div className="bmpcStoryImage"></div>

            <div className="bmpcStoryCopy">
              <span className="bmpcSectionLabel bmpcSectionLabelLight">BUILT FOR CONTINUITY</span>
              <h2>When one person becomes part of your routine, continuity matters.</h2>

              <p>
                Longer contracts often involve family routines, property access, children,
                elderly relatives, confidential information or recurring technical responsibility.
              </p>

              <p>
                Agency-managed arrangements can provide additional continuity through replacement
                support, backup personnel, training intervention and contract management where included.
              </p>

              <div className="bmpcStoryPoints">
                <div>
                  <strong>Nanny unavailable?</strong>
                  <span>An eligible agency plan may provide replacement candidates.</span>
                </div>

                <div>
                  <strong>Caregiver needs unexpected leave?</strong>
                  <span>Temporary backup support may be available.</span>
                </div>

                <div>
                  <strong>Professional needs additional training?</strong>
                  <span>An agency may coordinate improvement or retraining.</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* QUALIFIED APPLICATIONS */}
        <section className="bmpcSection bmpcQualified">
          <div className="bmpcContainer bmpcGrid2">
            <div>
              <span className="bmpcSectionLabel">QUALIFIED APPLICATIONS</span>
              <h2>Better matching starts before the interview.</h2>

              <p>
                For sensitive or specialized contracts, Boulot Man can limit applications
                to professionals who meet relevant eligibility requirements.
              </p>

              <div className="bmpcCheckGrid">
                <span>Identity verification</span>
                <span>Relevant experience</span>
                <span>Qualifications</span>
                <span>References</span>
                <span>Location compatibility</span>
                <span>Availability</span>
                <span>Relevant certifications</span>
                <span>Previous contract history</span>
                <span>Background screening where applicable</span>
              </div>

              <blockquote>
                The goal is not to send clients the most applications. It is to help them find the most suitable candidates.
              </blockquote>
            </div>

            <div className="bmpcPhotoPanel bmpcPhotoPanelQualified">
              <div className="bmpcFloatingCard">
                <span className="bmpcMiniLabel">EXAMPLE PROFILE STATUS</span>
                <strong>Qualified for Contract Application</strong>
                <ul>
                  <li>Identity verified</li>
                  <li>References reviewed</li>
                  <li>Relevant experience confirmed</li>
                  <li>Availability matched</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* SENSITIVE ROLES */}
        <section className="bmpcSection bmpcSectionSoft">
          <div className="bmpcContainer">
            <div className="bmpcSectionHead bmpcSectionHeadCenter">
              <div>
                <span className="bmpcSectionLabel">EXTRA CARE FOR SENSITIVE ROLES</span>
                <h2>Some roles require more than a profile.</h2>
                <p>Requirements vary by profession, country and available verification sources.</p>
              </div>
            </div>

            <div className="bmpcSecurityGrid">
              <article>
                <h3>Nannies & Childcare</h3>
                <p>Identity, references, childcare experience, relevant training, safeguarding requirements and first aid where appropriate.</p>
              </article>

              <article>
                <h3>Caregivers</h3>
                <p>Relevant caregiving experience, qualifications where required, references and role-specific competence.</p>
              </article>

              <article>
                <h3>Drivers</h3>
                <p>Valid driving licence, relevant vehicle class, driving experience and references.</p>
              </article>

              <article>
                <h3>Tutors Working With Children</h3>
                <p>Identity verification, qualification or subject competence, references and applicable safeguarding requirements.</p>
              </article>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="bmpcSection">
          <div className="bmpcContainer">
            <div className="bmpcSectionHead bmpcSectionHeadCenter">
              <div>
                <span className="bmpcSectionLabel">HOW IT WORKS</span>
                <h2>A clearer way to hire for longer-term professional needs.</h2>
              </div>
            </div>

            <div className="bmpcSteps">
              <article>
                <span>01</span>
                <h3>Tell Us Who You Need</h3>
                <p>Choose the professional, location, contract duration, responsibilities and preferred hiring model.</p>
              </article>

              <article>
                <span>02</span>
                <h3>Browse Qualified Profiles</h3>
                <p>Compare relevant experience, verification, availability, references and contract history.</p>
              </article>

              <article>
                <span>03</span>
                <h3>Interview & Select</h3>
                <p>Speak with suitable candidates and choose the person who best fits your needs.</p>
              </article>

              <article>
                <span>04</span>
                <h3>Set Up the Contract</h3>
                <p>Agree on responsibilities, schedule, compensation, duration and other relevant terms.</p>
              </article>

              <article>
                <span>05</span>
                <h3>Start the Engagement</h3>
                <p>Begin the contract with the chosen professional and any applicable agency support.</p>
              </article>

              <article>
                <span>06</span>
                <h3>Renew, Replace or Complete</h3>
                <p>Extend a successful relationship, use eligible replacement support, or complete the contract.</p>
              </article>
            </div>
          </div>
        </section>

        {/* CONTRACT TERMS */}
        <section className="bmpcContractTerms" id="post-contract">
          <div className="bmpcContainer bmpcContractTermsGrid">
            <div>
              <span className="bmpcSectionLabel bmpcSectionLabelLight">CLEAR FROM THE BEGINNING</span>
              <h2>Your contract. Your terms. Defined before work begins.</h2>

              <p>
                Longer professional relationships work better when both sides understand what has been agreed.
              </p>
            </div>

            <div className="bmpcTermList">
              <span>Responsibilities</span>
              <span>Start date</span>
              <span>Duration</span>
              <span>Working days & hours</span>
              <span>Live-in / live-out</span>
              <span>Compensation</span>
              <span>Payment schedule</span>
              <span>Accommodation where applicable</span>
              <span>Transport / meals where applicable</span>
              <span>Rest days / leave where applicable</span>
              <span>Confidentiality</span>
              <span>Notice requirements</span>
              <span>Renewal</span>
              <span>Termination</span>
              <span>Agency responsibilities where applicable</span>
            </div>
          </div>
        </section>

        {/* BOTH SIDES */}
        <section className="bmpcSection bmpcProtection">
          <div className="bmpcContainer">
            <div className="bmpcSectionHead bmpcSectionHeadCenter">
              <div>
                <span className="bmpcSectionLabel">PROTECTION GOES BOTH WAYS</span>
                <h2>Professional relationships work best when both sides are treated fairly.</h2>
              </div>
            </div>

            <div className="bmpcProtectionGrid">
              <article>
                <h3>For Clients</h3>
                <p>Structured support may be available for:</p>
                <ul>
                  <li>Repeated unexplained absence</li>
                  <li>Serious performance concerns</li>
                  <li>Contract abandonment</li>
                  <li>Confidentiality concerns</li>
                  <li>Misrepresentation of qualifications</li>
                  <li>Property or safety concerns</li>
                  <li>Replacement under eligible agency arrangements</li>
                </ul>
              </article>

              <article>
                <h3>For Professionals</h3>
                <p>Structured support may be available for:</p>
                <ul>
                  <li>Unpaid or delayed agreed compensation</li>
                  <li>Harassment</li>
                  <li>Unsafe working conditions</li>
                  <li>Unreasonable changes to agreed duties</li>
                  <li>Threats or abusive conduct</li>
                  <li>Contract disputes</li>
                  <li>Improper withholding of personal documents</li>
                </ul>
              </article>
            </div>

            <p className="bmpcLegalNote">
              Boulot Man and participating agencies provide structured support within the limits of their role.
              Matters requiring legal, police, regulatory or emergency intervention remain with the appropriate authorities.
            </p>
          </div>
        </section>

        {/* PRIVATE RECRUITMENT */}
        <section className="bmpcPrivate">
          <div className="bmpcPrivateImage"></div>

          <div className="bmpcPrivateContent">
            <span className="bmpcSectionLabel bmpcSectionLabelLight">PRIVATE CONTRACT RECRUITMENT</span>
            <h2>Prefer not to search yourself?</h2>

            <p>
              Tell Boulot Man what you need and let us help identify suitable professionals.
            </p>

            <div className="bmpcPrivateList">
              <span>Specific professional requirements</span>
              <span>Confidential household searches</span>
              <span>High-trust roles</span>
              <span>Urgent replacements</span>
              <span>Live-in professionals</span>
              <span>Bilingual professionals</span>
            </div>

            <div>
              <Link href="/contact" className="bmpcBtn bmpcBtnLight">
                Request Private Recruitment
              </Link>
            </div>
          </div>
        </section>

        {/* PROFESSIONAL CTA */}
        <section className="bmpcSection bmpcProfessionalCta">
          <div className="bmpcContainer bmpcGrid2">
            <div>
              <span className="bmpcSectionLabel">ARE YOU A PROFESSIONAL?</span>
              <h2>Turn your skills into longer-term contract opportunities.</h2>

              <p>
                Build a professional profile, apply for suitable contracts, grow your work history,
                receive reviews and strengthen your reputation across the Boulot Man network.
              </p>

              <div className="bmpcProfessionalActions">
                <Link href="/signup?role=technician" className="bmpcBtn bmpcBtnPrimary">
                  Create Professional Profile
                </Link>
                <Link href="/find-tasks" className="bmpcBtn bmpcBtnOutlineDark">
                  Browse Contract Opportunities
                </Link>
              </div>
            </div>

            <div className="bmpcOpportunityCard">
              <span className="bmpcMiniLabel">EXAMPLE OPPORTUNITY</span>
              <h3>Live-In Private Chef</h3>
              <p className="bmpcOpportunityLocation">Bonamoussadi, Douala</p>

              <div className="bmpcOpportunityMeta">
                <span>12-month renewable</span>
                <span>Family household</span>
                <span>6 days/week</span>
                <span>Accommodation provided</span>
                <span>4+ years experience</span>
                <span>Verified candidates only</span>
              </div>

              <Link href="/find-tasks" className="bmpcBtn bmpcBtnDark">
                View Opportunity
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bmpcSection bmpcSectionSoft">
          <div className="bmpcContainer bmpcFaqWrap">
            <div className="bmpcSectionHead bmpcSectionHeadCenter">
              <div>
                <span className="bmpcSectionLabel">FREQUENTLY ASKED QUESTIONS</span>
                <h2>Professional Contracts explained.</h2>
              </div>
            </div>

            <div className="bmpcFaq">
              {FAQS.map((faq, idx) => (
                <div key={idx} className={`bmpcFaqItem ${openFaq === idx ? "isOpen" : ""}`}>
                  <button
                    className="bmpcFaqQuestion"
                    type="button"
                    onClick={() => toggleFaq(idx)}
                  >
                    <span>{faq.q}</span>
                    <span className="bmpcFaqIcon">{openFaq === idx ? "−" : "+"}</span>
                  </button>
                  <div className={`bmpcFaqAnswer ${openFaq === idx ? "isOpen" : ""}`}>
                    <p>{faq.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="bmpcFinalCta">
          <div className="bmpcContainer bmpcFinalCtaInner">
            <div>
              <span className="bmpcSectionLabel bmpcSectionLabelLight">PROFESSIONAL CONTRACTS</span>
              <h2>Some jobs last a day. Some professional relationships become part of everyday life.</h2>

              <p>
                Find the right person, choose how you want to hire, and build a more structured professional relationship from the beginning.
              </p>
            </div>

            <div className="bmpcFinalCtaActions">
              <Link href="/service-providers/technicians" className="bmpcBtn bmpcBtnLight">
                Find a Contract Professional
              </Link>
              <Link href="/post-task" className="bmpcBtn bmpcBtnOutlineLight">
                Post a Professional Contract
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
