"use client";

import { useState } from "react";
import CompanySidebar from "@/app/components/CompanySidebar";
import DashboardHeader from "@/app/components/DashboardHeader";
import styles from "./layout.module.css";

export default function CompanyLayout({ children }: { children: React.ReactNode }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className={styles.layoutWrapper}>
      <CompanySidebar isOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />

      <main className={styles.mainWrapper}>
        <DashboardHeader onMenuClick={() => setMobileSidebarOpen(true)} />
        {children}
      </main>
    </div>
  );
}
