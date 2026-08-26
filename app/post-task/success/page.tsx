"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import ClientSidebar from "@/app/components/ClientSidebar";
import DashboardHeader from "@/app/components/DashboardHeader";

export default function TaskPublishSuccessPage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [lastQuote, setLastQuote] = useState<{ 
    isCompanyQuote?: boolean; 
    isSpecialistInvite?: boolean;
    companyName?: string; 
    specialistName?: string;
    service?: string;
  } | null>(null);

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

  const isCompanyQuote = Boolean(lastQuote?.isCompanyQuote);
  const isSpecialistInvite = Boolean(lastQuote?.isSpecialistInvite);

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
                <div 
                  className={styles.successIconWrap} 
                  style={{ 
                    background: (isCompanyQuote || isSpecialistInvite) ? "#001f3f" : undefined, 
                    color: (isCompanyQuote || isSpecialistInvite) ? "#ff4500" : undefined 
                  }}
                >
                  <iconify-icon icon={isCompanyQuote ? "lucide:building-2" : isSpecialistInvite ? "lucide:user-check" : "lucide:check"} />
                </div>

                <h2 className={styles.successTitle}>
                  {isCompanyQuote 
                    ? `Quote Request Sent to ${lastQuote?.companyName || "Enterprise"}!`
                    : isSpecialistInvite
                    ? `Direct Job Invitation Sent to ${lastQuote?.specialistName || "Technician"}!`
                    : "Your task has been posted successfully!"}
                </h2>
                <p className={styles.successText}>
                  {isCompanyQuote
                    ? `Your project specifications for "${lastQuote?.service || "the service"}" have been delivered to ${lastQuote?.companyName || "the enterprise"}'s Quote Requests Inbox. They will review your details and send you a formal quotation.`
                    : isSpecialistInvite
                    ? `Your task details for "${lastQuote?.service || "the job"}" have been sent directly to ${lastQuote?.specialistName || "the specialist"}. They have received an instant alert on their dashboard and can review and accept the job.`
                    : "You will start receiving bids shortly from qualified professionals in your area."}
                </p>

                <div className={styles.actionRow}>
                  <Link href="/dashboard/client" className={styles.secondaryButton}>
                    Go to Dashboard
                  </Link>
                  <Link href={isCompanyQuote ? "/dashboard/client/projects" : "/dashboard/client/tasks"} className={styles.primaryButton}>
                    {isCompanyQuote ? "View My Projects" : "View My Tasks"}
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
