"use client";

import { useState } from "react";
import Link from "next/link";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import TechnicianSidebar from "@/app/components/TechnicianSidebar";
import DashboardHeader from "@/app/components/DashboardHeader";
import TaskBoard from "@/app/components/TaskBoard";
import styles from "./page.module.css";

export default function TechnicianTasksPage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { data: user, loading } = useFetch(() => api.getMe(), []);

  const isVerified = Boolean(user?.is_verified || (user as any)?.technician_profile?.is_verified);

  return (
    <main className={styles.page}>
      <div className={styles.layout}>
        <TechnicianSidebar isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

        <div className={styles.main}>
          <DashboardHeader
            onMenuClick={() => setMobileNavOpen(true)}
            searchPlaceholder="Search tasks or keywords"
            searchQuery={query}
            setSearchQuery={setQuery}
          />

          <div className={styles.content}>
            <section className={styles.pageHeader} style={{ marginBottom: "20px" }}>
              <div>
                <p className={styles.eyebrow}>Marketplace</p>
                <h1>Browse Tasks</h1>
                <p>Find the best tasks and apply easily.</p>
              </div>
            </section>

            {loading ? (
              <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>Loading marketplace access...</div>
            ) : !isVerified ? (
              <div style={{
                background: "#ffffff",
                borderRadius: "24px",
                border: "1.5px solid #fcd34d",
                padding: "48px 32px",
                textAlign: "center",
                maxWidth: "700px",
                margin: "40px auto",
                boxShadow: "0 12px 36px rgba(0, 31, 63, 0.06)"
              }}>
                <div style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "20px",
                  background: "#fffbeb",
                  color: "#d97706",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "32px",
                  marginBottom: "20px"
                }}>
                  <iconify-icon icon="lucide:lock" />
                </div>
                <h2 style={{ color: "#001F3F", fontSize: "1.6rem", fontWeight: 800, margin: "0 0 12px 0" }}>
                  Admin Verification Required to Browse &amp; Bid Tasks
                </h2>
                <p style={{ color: "#64748b", fontSize: "15px", lineHeight: 1.65, margin: "0 0 28px 0" }}>
                  Your technician profile is currently under review by the Boulot Man verification team. To protect platform clients and ensure work quality, task browsing and bid submissions unlock once your National ID and credentials are fully approved.
                </p>
                <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
                  <Link href="/dashboard/technician/profile" style={{
                    background: "#FF4500",
                    color: "#fff",
                    padding: "14px 28px",
                    borderRadius: "12px",
                    fontWeight: 800,
                    fontSize: "14.5px",
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    boxShadow: "0 6px 16px rgba(255, 69, 0, 0.25)"
                  }}>
                    <iconify-icon icon="lucide:upload" /> Upload ID &amp; Certificates
                  </Link>
                  <Link href="/dashboard/technician" style={{
                    background: "#f1f5f9",
                    color: "#001F3F",
                    padding: "14px 24px",
                    borderRadius: "12px",
                    fontWeight: 700,
                    fontSize: "14.5px",
                    textDecoration: "none"
                  }}>
                    Back to Dashboard
                  </Link>
                </div>
              </div>
            ) : (
              <TaskBoard />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
