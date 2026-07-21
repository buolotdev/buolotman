"use client";

import React, { useState } from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { useRouter } from "next/navigation";
import styles from "./build-team.module.css";

export default function BuildATeamPage() {
  const router = useRouter();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <>
      <Header />

      <main className={styles.container}>
        {/* HERO */}
        <div className={styles.hero}>
          <h1>Build a Team</h1>
          <p>
            Your on-demand technical workforce.
            Boulot Man assembles, deploys, and manages complete teams of verified professionals
            for construction, engineering, IT, renovation, and large-scale projects.
          </p>
        </div>

        {/* OVERVIEW */}
        <div className={styles.section}>
          <h2>What Is Build a Team?</h2>
          <p>
            Build a Team is a structured Boulot Man service that allows clients to hire{" "}
            <strong>ready-made, coordinated technical teams</strong> instead of managing individuals.
            It is ideal for projects that require multiple skills, long duration, or strict supervision.
          </p>

          <div className={styles.grid3}>
            <div className={styles.card}>
              <h3>Who It’s For</h3>
              <ul>
                <li>Homeowners & property developers</li>
                <li>Construction companies</li>
                <li>SMEs & startups</li>
                <li>NGOs & institutions</li>
                <li>Hotels & real estate owners</li>
                <li>Diaspora managing projects remotely</li>
              </ul>
            </div>

            <div className={styles.card}>
              <h3>What Problems It Solves</h3>
              <ul>
                <li>No recruitment stress</li>
                <li>No supervision gaps</li>
                <li>Reduced delays</li>
                <li>Clear accountability</li>
                <li>Controlled costs</li>
              </ul>
            </div>

            <div className={styles.card}>
              <h3>Team Types</h3>
              <ul>
                <li>Electrical teams</li>
                <li>Plumbing teams</li>
                <li>Construction & renovation teams</li>
                <li>ICT & networking teams</li>
                <li>Solar & renewable energy teams</li>
                <li>Mixed discipline teams</li>
              </ul>
            </div>
          </div>
        </div>

        {/* HOW IT WORKS */}
        <div className={styles.section}>
          <h2>How Build a Team Works</h2>

          <div className={styles.flow}>
            <div className={styles.flowStep}><span>STEP 1</span><p>Client submits project request and requirements</p></div>
            <div className={styles.flowStep}><span>STEP 2</span><p>Boulot Man designs team structure</p></div>
            <div className={styles.flowStep}><span>STEP 3</span><p>Verified technicians are selected</p></div>
            <div className={styles.flowStep}><span>STEP 4</span><p>Deployment, scheduling & coordination</p></div>
            <div className={styles.flowStep}><span>STEP 5</span><p>Supervision, reporting & tracking</p></div>
            <div className={styles.flowStep}><span>STEP 6</span><p>Completion, handover & warranty</p></div>
          </div>
        </div>

        {/* PRICING MODELS */}
        <div className={styles.section}>
          <h2>Pricing Models</h2>

          <div className={styles.grid3}>
            <div className={styles.card}>
              <h3>Pay Per Technician</h3>
              <p>Daily or weekly rates for flexible staffing.</p>
            </div>
            <div className={styles.card}>
              <h3>Pay Per Team</h3>
              <p>Fixed pricing for defined projects.</p>
            </div>
            <div className={styles.card}>
              <h3>Contract / Retainer</h3>
              <p>Monthly deployment for companies & institutions.</p>
            </div>
          </div>
        </div>

        {/* CONCIERGE VS BUILD */}
        <div className={styles.section}>
          <h2>Concierge vs Build a Team</h2>

          <div className={styles.compare}>
            <table className={styles.compareTable}>
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Concierge</th>
                  <th>Build a Team</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Type</td>
                  <td>On-demand management</td>
                  <td>Full workforce</td>
                </tr>
                <tr>
                  <td>Team Size</td>
                  <td>1–2 technicians</td>
                  <td>3–50+ workers</td>
                </tr>
                <tr>
                  <td>Duration</td>
                  <td>Short tasks</td>
                  <td>Multi-day / long-term</td>
                </tr>
                <tr>
                  <td>Supervision</td>
                  <td>Concierge coordinator</td>
                  <td>Team leader / foreman</td>
                </tr>
                <tr>
                  <td>Best For</td>
                  <td>Homes & offices</td>
                  <td>Projects & construction</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className={styles.section}>
          <h2>Build a Team FAQ</h2>

          <div className={styles.card} style={{ padding: "10px 40px" }}>
            <div className={styles.accordionItem} onClick={() => toggleFaq(1)}>
              <div className={styles.accordionTitle}>How fast can a team be deployed? <span>{activeFaq === 1 ? "-" : "+"}</span></div>
              {activeFaq === 1 && <div className={styles.accordionContent}>Usually within 1–24 hours depending on size and location.</div>}
            </div>

            <div className={styles.accordionItem} onClick={() => toggleFaq(2)}>
              <div className={styles.accordionTitle}>Are technicians verified? <span>{activeFaq === 2 ? "-" : "+"}</span></div>
              {activeFaq === 2 && <div className={styles.accordionContent}>Yes. All team members are ID-verified, skill-assessed, and rated.</div>}
            </div>

            <div className={styles.accordionItem} onClick={() => toggleFaq(3)}>
              <div className={styles.accordionTitle}>Can diaspora clients manage remotely? <span>{activeFaq === 3 ? "-" : "+"}</span></div>
              {activeFaq === 3 && <div className={styles.accordionContent}>Yes. Reports, photos, and updates are provided remotely.</div>}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className={styles.cta}>
          <div>
            <h2>Build Your Team Today</h2>
            <p>
              Whether it’s a renovation, installation, or full project,
              Boulot Man gives you a ready workforce — fast, verified, and managed.
            </p>
          </div>
          <div className={styles.ctaRight}>
            <button onClick={() => router.push("/login")}>
              Request a Team
            </button>
          </div>
        </div>

      </main>

      <Footer />
    </>
  );
}
