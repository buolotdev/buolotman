"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import ClientSidebar from "@/app/components/ClientSidebar";
import DashboardHeader from "@/app/components/DashboardHeader";

export default function TaskPublishSuccessPage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [lastQuote, setLastQuote] = useState<{ isCompanyQuote: boolean; companyName: string; service: string } | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = window.localStorage.getItem("boulotman_last_quote");
        if (raw) {
          setLastQuote(JSON.parse(raw));
        }
      } catch {
        // ignore
      }
    }
  }, []);

  const isQuote = Boolean(lastQuote?.isCompanyQuote);

  return (
    <main className={styles.page}>
      <div className={styles.layout}>
        <ClientSidebar isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

        <div className={styles.main}>
          <DashboardHeader
            onMenuClick={() => setMobileNavOpen(true)}
            searchPlaceholder="Search tasks, professionals..."
          />

          <div className={styles.content}>
            <section className={styles.successWrap}>
              <div className={styles.successCard}>
                <div className={styles.successIconWrap} style={{ background: isQuote ? "#001f3f" : undefined, color: isQuote ? "#ff4500" : undefined }}>
                  <iconify-icon icon={isQuote ? "lucide:building-2" : "lucide:check"} />
                </div>

                <h2 className={styles.successTitle}>
                  {isQuote 
                    ? `Quote Request Sent to ${lastQuote?.companyName || "Enterprise"}!`
                    : "Your task has been posted successfully!"}
                </h2>
                <p className={styles.successText}>
                  {isQuote
                    ? `Your project specifications for "${lastQuote?.service || "the service"}" have been delivered to ${lastQuote?.companyName || "the enterprise"}'s Quote Requests Inbox. They will review your details and send you a formal quotation.`
                    : "You will start receiving bids shortly from qualified professionals in your area."}
                </p>

                <div className={styles.actionRow}>
                  <Link href="/dashboard/client" className={styles.secondaryButton}>
                    Go to Dashboard
                  </Link>
                  <Link href={isQuote ? "/dashboard/client/projects" : "/dashboard/client/tasks"} className={styles.primaryButton}>
                    {isQuote ? "View My Projects" : "View Task Details"}
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
