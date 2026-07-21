"use client";

import { useState } from "react";
import TechnicianSidebar from "@/app/components/TechnicianSidebar";
import DashboardHeader from "@/app/components/DashboardHeader";
import TaskBoard from "@/app/components/TaskBoard";
import styles from "./page.module.css";

export default function TechnicianTasksPage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [query, setQuery] = useState("");

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

            <TaskBoard />
          </div>
        </div>
      </div>
    </main>
  );
}
