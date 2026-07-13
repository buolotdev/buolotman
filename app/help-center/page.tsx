import Link from "next/link";
import styles from "./page.module.css";

const quickLinks = [
  { href: "/signup", label: "Create an account" },
  { href: "/login", label: "Log in" },
  { href: "/search", label: "Browse professionals" },
  { href: "/post-task", label: "Post a task" },
];

const topics = [
  {
    title: "Getting started",
    items: [
      "How sign-up works",
      "How to complete your profile",
      "Choosing a role: client, technician, or company",
    ],
  },
  {
    title: "Tasks and services",
    items: [
      "Posting a task",
      "Submitting a bid",
      "Managing service listings",
    ],
  },
  {
    title: "Payments and safety",
    items: [
      "Escrow and payouts",
      "Disputes and refunds",
      "Verification and trust badges",
    ],
  },
];

const faqs = [
  {
    question: "How do I get help with my account?",
    answer: "Start from your dashboard, then use the in-app messages or support routes relevant to your role. Account, task, and payment history are all connected to your profile.",
  },
  {
    question: "What if a task payment is stuck?",
    answer: "Check the task status, the bid or project approval, and the escrow record. If the status is unclear, open a dispute with evidence from the task thread.",
  },
  {
    question: "Can I see support pages before I sign up?",
    answer: "Yes. Public help content is available before login, but account-specific actions and support records require an authenticated session.",
  },
];

export default function HelpCenterPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>Support</p>
          <h1>Help Center</h1>
          <p className={styles.lead}>
            Find guidance for sign-up, login, task posting, bids, payments, and verification.
            The support flow is built around the actual product screens so users can move from answer to action without hunting around.
          </p>
        </div>

        <div className={styles.heroPanel}>
          <div className={styles.panelCard}>
            <span className={styles.panelLabel}>Need help now?</span>
            <h2>Start with the fastest path</h2>
            <p>
              Use the links below for the most common onboarding and marketplace tasks.
            </p>
            <div className={styles.quickLinks}>
              {quickLinks.map((item) => (
                <Link key={item.href} href={item.href} className={styles.quickLink}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.gridSection}>
        {topics.map((topic) => (
          <article key={topic.title} className={styles.topicCard}>
            <h3>{topic.title}</h3>
            <ul>
              {topic.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className={styles.faqSection}>
        <div className={styles.sectionHeader}>
          <p className={styles.eyebrow}>FAQ</p>
          <h2>Common support questions</h2>
        </div>
        <div className={styles.faqGrid}>
          {faqs.map((faq) => (
            <details key={faq.question} className={styles.faqItem}>
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
