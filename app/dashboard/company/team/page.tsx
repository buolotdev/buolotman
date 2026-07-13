"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./team.module.css";
import DashboardHeader from "@/app/components/DashboardHeader";

const mockTeam = [
  { id: 1, name: "Ali Ahmad Ramzan", role: "Owner", email: "ali@boulotman.com", status: "active", initials: "AA" },
  { id: 2, name: "Sarah Connor", role: "Manager", email: "sarah@boulotman.com", status: "active", initials: "SC" },
  { id: 3, name: "John Smith", role: "Technician", email: "john@boulotman.com", status: "pending", initials: "JS" },
];

export default function CompanyTeamPage() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const team = mockTeam;

  return (
    <main className={styles.mainWrapper}>
      <DashboardHeader onMenuClick={() => setMobileSidebarOpen(true)} />
      <div className={styles.container} style={{ marginTop: 32 }}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <p className={styles.subtitle}>Company dashboard</p>
            <h1 className={styles.title}>Team & Staff</h1>
            <Link href="/dashboard/company" className={styles.backLink}>
              <iconify-icon icon="lucide:arrow-left" /> Back to dashboard
            </Link>
          </div>
          <div className={styles.headerActions}>
            <button className={styles.inviteBtn} onClick={() => alert("Invite flow pending.")}>
              <iconify-icon icon="lucide:user-plus" /> Invite Member
            </button>
          </div>
        </header>

        <div className={styles.teamList}>
          {team.map((member) => (
            <div key={member.id} className={styles.memberCard}>
              <div className={styles.memberHeader}>
                <div className={styles.memberInfo}>
                  <div className={styles.avatar}>{member.initials}</div>
                  <div className={styles.details}>
                    <h3 className={styles.name}>{member.name}</h3>
                    <span className={styles.role}>{member.role}</span>
                  </div>
                </div>
                <span className={`${styles.status} ${member.status === 'active' ? styles.statusActive : styles.statusPending}`}>
                  {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                </span>
              </div>
              <div className={styles.memberContact}>
                <div className={styles.contactItem}>
                  <iconify-icon icon="lucide:mail" /> {member.email}
                </div>
              </div>
              <div className={styles.cardActions}>
                <button className={styles.actionBtn}>Edit Role</button>
                <button className={`${styles.actionBtn} ${styles.actionBtnRemove}`}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
