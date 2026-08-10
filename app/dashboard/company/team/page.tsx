"use client";

import { useState } from "react";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import Link from "next/link";
import layoutStyles from "../page.module.css";
import styles from "./team.module.css";


const mockTeam: any[] = [];

export default function CompanyTeamPage() {
  
  const team = mockTeam;

  return (
    <>
      <div className={layoutStyles.content}>
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
    
      </div>
    </>
  );
}
