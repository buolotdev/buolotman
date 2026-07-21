"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import TechnicianSidebar from "@/app/components/TechnicianSidebar";
import DashboardHeader from "@/app/components/DashboardHeader";

export default function TechnicianProjectsPage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Static dummy data as shown in the screenshot
  const projects = [
    {
      id: 1,
      name: "Residential Wiring",
      client: "John Mukasa",
      startDate: "2026-01-10",
      progress: "45%",
      milestone: "Milestone 1",
      paymentStatus: "On Hold",
    },
    {
      id: 2,
      name: "Office CCTV Installation",
      client: "Mary Uwase",
      startDate: "2025-12-20",
      progress: "100%",
      milestone: "Final",
      paymentStatus: "Released",
    },
    {
      id: 3,
      name: "Solar Panel Setup",
      client: "Paul Nshimiyimana",
      startDate: "2026-02-01",
      progress: "10%",
      milestone: "Milestone 1",
      paymentStatus: "Pending",
    },
  ];

  const getStatusClass = (status: string) => {
    switch (status) {
      case "On Hold":
        return styles.statusHold;
      case "Released":
        return styles.statusReleased;
      case "Pending":
        return styles.statusPending;
      default:
        return "";
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.layout}>
        <TechnicianSidebar isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

        <main className={styles.main}>
          <DashboardHeader onMenuClick={() => setMobileNavOpen(true)} />

          <div className={styles.content}>
            <section className={styles.card}>
              <h2>My Projects</h2>
              
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Project</th>
                      <th>Client</th>
                      <th>Start Date</th>
                      <th>Progress</th>
                      <th>Milestone</th>
                      <th>Payment</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((project) => (
                      <tr key={project.id}>
                        <td>{project.name}</td>
                        <td>{project.client}</td>
                        <td>{project.startDate}</td>
                        <td>{project.progress}</td>
                        <td>{project.milestone}</td>
                        <td>
                          <span className={`${styles.statusBadge} ${getStatusClass(project.paymentStatus)}`}>
                            {project.paymentStatus}
                          </span>
                        </td>
                        <td>
                          {project.progress === "100%" ? (
                            <Link href={`/dashboard/technician/projects/${project.id}`} className={styles.primaryButton} style={{ textDecoration: 'none', display: 'inline-block' }}>Open Workspace</Link>
                          ) : (
                            <Link href={`/dashboard/technician/projects/${project.id}`} className={styles.outlineButton} style={{ textDecoration: 'none', display: 'inline-block' }}>Update Progress</Link>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
