"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import styles from "./page.module.css";

const FAQ_DATA = [
  {
    question: "Do you provide remote IT support?",
    answer: "Yes. Many issues can be resolved remotely for faster response."
  },
  {
    question: "Are IT technicians verified?",
    answer: "All IT professionals are ID-verified, skill-assessed, and rated."
  },
  {
    question: "Can companies get recurring IT support?",
    answer: "Yes. Monthly and annual IT support contracts are available."
  }
];

export default function ITOnDemandPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className={styles.page}>
      <Header />

      <div className={styles.container}>
        {/* HERO */}
        <div className={styles.hero}>
          <h1 className={styles.heroTitle}>IT On-Demand Services</h1>
          <p className={styles.heroDesc}>
            Fast, reliable, professional IT support — when you need it.
            Boulot Man IT On-Demand provides certified technicians and engineers
            for homes, businesses, institutions, and complex technical environments.
          </p>
        </div>

        {/* OVERVIEW */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>What Is IT On-Demand?</h2>
          <p className={styles.sectionDesc}>
            Boulot Man IT On-Demand Services allow you to access expert IT support
            without hiring full-time staff. Whether you need quick troubleshooting,
            system installation, cybersecurity, or infrastructure deployment,
            our verified professionals are available on-site or remotely.
          </p>

          <div className={styles.grid3}>
            <div className={styles.card}>
              <span className={styles.badge}>Who It’s For</span>
              <ul className={styles.cardList}>
                <li className={styles.cardListItem}>Homes & individuals</li>
                <li className={styles.cardListItem}>SMEs & startups</li>
                <li className={styles.cardListItem}>Corporate offices</li>
                <li className={styles.cardListItem}>Schools & institutions</li>
                <li className={styles.cardListItem}>NGOs & projects</li>
                <li className={styles.cardListItem}>Construction & engineering sites</li>
              </ul>
            </div>

            <div className={styles.card}>
              <span className={styles.badge}>What Problems It Solves</span>
              <ul className={styles.cardList}>
                <li className={styles.cardListItem}>System downtime</li>
                <li className={styles.cardListItem}>Network failures</li>
                <li className={styles.cardListItem}>Cybersecurity risks</li>
                <li className={styles.cardListItem}>Lack of in-house IT staff</li>
                <li className={styles.cardListItem}>Complex technical setups</li>
              </ul>
            </div>

            <div className={styles.card}>
              <span className={styles.badge}>Service Modes</span>
              <ul className={styles.cardList}>
                <li className={styles.cardListItem}>On-site IT support</li>
                <li className={styles.cardListItem}>Remote IT assistance</li>
                <li className={styles.cardListItem}>Project-based deployment</li>
                <li className={styles.cardListItem}>Recurring IT support contracts</li>
              </ul>
            </div>
          </div>
        </div>

        {/* SERVICES */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>IT Services We Offer</h2>

          <div className={styles.grid3}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Hardware & Devices</h3>
              <ul className={styles.cardList}>
                <li className={styles.cardListItem}>Laptop & desktop troubleshooting</li>
                <li className={styles.cardListItem}>Hardware upgrades & repairs</li>
                <li className={styles.cardListItem}>Printer & office equipment setup</li>
                <li className={styles.cardListItem}>System diagnostics & optimization</li>
              </ul>
            </div>

            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Networking & Infrastructure</h3>
              <ul className={styles.cardList}>
                <li className={styles.cardListItem}>Wi-Fi & LAN/WAN installation</li>
                <li className={styles.cardListItem}>Router & firewall configuration</li>
                <li className={styles.cardListItem}>Structured cabling</li>
                <li className={styles.cardListItem}>Server room setup</li>
              </ul>
            </div>

            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Cybersecurity & Data</h3>
              <ul className={styles.cardList}>
                <li className={styles.cardListItem}>Antivirus & endpoint protection</li>
                <li className={styles.cardListItem}>System security audits</li>
                <li className={styles.cardListItem}>Data backup & recovery</li>
                <li className={styles.cardListItem}>Cloud security configuration</li>
              </ul>
            </div>

            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Software & Systems</h3>
              <ul className={styles.cardList}>
                <li className={styles.cardListItem}>OS installation (Windows, Linux, macOS)</li>
                <li className={styles.cardListItem}>Business software setup</li>
                <li className={styles.cardListItem}>Updates & patch management</li>
                <li className={styles.cardListItem}>Remote troubleshooting</li>
              </ul>
            </div>

            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Smart Home & Office</h3>
              <ul className={styles.cardList}>
                <li className={styles.cardListItem}>Smart lighting & automation</li>
                <li className={styles.cardListItem}>IoT device setup</li>
                <li className={styles.cardListItem}>Smart security systems</li>
                <li className={styles.cardListItem}>Platform integrations</li>
              </ul>
            </div>

            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Business & Enterprise IT</h3>
              <ul className={styles.cardList}>
                <li className={styles.cardListItem}>IT consulting & planning</li>
                <li className={styles.cardListItem}>POS & business systems</li>
                <li className={styles.cardListItem}>Digital transformation</li>
                <li className={styles.cardListItem}>IT support contracts</li>
              </ul>
            </div>
          </div>
        </div>

        {/* HOW IT WORKS */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>How IT On-Demand Works</h2>

          <div className={styles.flow}>
            <div className={styles.flowStep}><span className={styles.flowStepBadge}>STEP 1</span><p className={styles.flowStepDesc}>Client submits IT request</p></div>
            <div className={styles.flowStep}><span className={styles.flowStepBadge}>STEP 2</span><p className={styles.flowStepDesc}>Needs assessment & urgency check</p></div>
            <div className={styles.flowStep}><span className={styles.flowStepBadge}>STEP 3</span><p className={styles.flowStepDesc}>Technician or engineer assigned</p></div>
            <div className={styles.flowStep}><span className={styles.flowStepBadge}>STEP 4</span><p className={styles.flowStepDesc}>On-site or remote support delivered</p></div>
            <div className={styles.flowStep}><span className={styles.flowStepBadge}>STEP 5</span><p className={styles.flowStepDesc}>Testing & confirmation</p></div>
            <div className={styles.flowStep}><span className={styles.flowStepBadge}>STEP 6</span><p className={styles.flowStepDesc}>Payment & optional follow-up</p></div>
          </div>
        </div>

        {/* FAQ */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>IT On-Demand FAQ</h2>

          <div className={styles.card}>
            {FAQ_DATA.map((faq, index) => (
              <div 
                key={index} 
                className={styles.accordionItem} 
                onClick={() => toggleFaq(index)}
              >
                <div className={styles.accordionTitle}>
                  {faq.question} 
                  <span className={styles.accordionIcon}>
                    {openFaqIndex === index ? "−" : "+"}
                  </span>
                </div>
                {openFaqIndex === index && (
                  <div className={styles.accordionContent}>{faq.answer}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className={styles.cta}>
          <div>
            <h2 className={styles.ctaTitle}>Get IT Support Now</h2>
            <p className={styles.ctaDesc}>
              From urgent fixes to complex IT deployments,
              Boulot Man gives you instant access to trusted IT professionals.
            </p>
          </div>
          <Link href="/post-task" className={styles.ctaButton}>
            Request IT Support
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
