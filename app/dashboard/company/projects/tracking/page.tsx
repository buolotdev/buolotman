"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./tracking.module.css";

export default function ProjectTracking() {
  return (
    <div className={styles.exportWrapper}>
      {/* Top Navigation */}
      <header className={styles.topNav}>
        <div className={styles.navContainer}>
          <div className={styles.navLeft}>
            <Link href="/dashboard/company" className={styles.brand}>
              <Image 
                src="/boulotman-logo.png" 
                alt="Boulot Man" 
                width={180} 
                height={46} 
                style={{ width: 'auto', height: '46px' }}
                priority 
              />
            </Link>
          </div>
          <div className={styles.navRight}>
            <button className={styles.btnIcon}>
              <iconify-icon
                icon="lucide:bell"
                style={{ fontSize: '20px' }}
              ></iconify-icon>
            </button>
            <div className={styles.avatar}>
              <Image
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&q=80"
                alt="Profile"
                width={36}
                height={36}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.pageContainer}>
        <Link href="/dashboard/company/projects" className={styles.backLink}>
          <iconify-icon
            icon="lucide:arrow-left"
            style={{ fontSize: '16px' }}
          ></iconify-icon>
          Back to Projects
        </Link>

        {/* Project Header */}
        <div className={styles.projectHeader}>
          <div className={styles.phTop}>
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  marginBottom: '8px',
                }}
              >
                <h1
                  style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    color: '#001f3f',
                    margin: 0,
                  }}
                >
                  Electrical Wiring for New Retail Store
                </h1>
                <span className={`${styles.badge} ${styles.badgeSuccess}`}>Active Project</span>
              </div>
              <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
                Project ID: PRJ-9042-BW • Created on Oct 01, 2023
              </p>
            </div>
            <Link href="/dashboard/company/messages" className={styles.btnOutline}>
              <iconify-icon
                icon="lucide:message-square"
                style={{ fontSize: '16px' }}
              ></iconify-icon>
              Message Client
            </Link>
          </div>

          <div className={styles.phStats}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Client</span>
              <div className={styles.statValue}>
                <div className={styles.miniLogo}>
                  <Image
                    src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop&q=80"
                    alt="Client Logo"
                    width={28}
                    height={28}
                  />
                </div>
                Nexus Technologies
              </div>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Total Budget</span>
              <div className={styles.statValue}>
                <span style={{ fontSize: '18px', color: '#001f3f' }}>$7,500.00</span>
              </div>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Estimated Deadline</span>
              <div className={styles.statValue}>
                <iconify-icon
                  icon="lucide:calendar"
                  style={{ fontSize: '16px', color: '#64748b' }}
                ></iconify-icon>
                Nov 15, 2023
              </div>
            </div>
          </div>

          <div className={styles.progressWrapper}>
            <div className={styles.progressInfo}>
              <span>Project Progress</span>
              <span>33%</span>
            </div>
            <div className={styles.progressBarBg}>
              <div className={styles.progressBarFill} style={{ width: '33%' }}></div>
            </div>
            <div className={styles.progressMeta}>
              1 of 3 Milestones Completed
            </div>
          </div>
        </div>

        <h2
          style={{
            fontSize: '20px',
            fontWeight: '700',
            color: '#001f3f',
            marginBottom: '24px',
            marginTop: 0,
          }}
        >
          Milestones
        </h2>

        {/* Timeline Section */}
        <div className={styles.timeline}>
          {/* Milestone 1: Completed */}
          <div className={`${styles.timelineItem} ${styles.completed}`}>
            <div className={styles.timelineMarker}>
              <iconify-icon
                icon="lucide:check"
                style={{ fontSize: '16px', color: '#fff' }}
              ></iconify-icon>
            </div>
            <div className={styles.milestoneCard}>
              <div className={styles.mcHeader}>
                <div>
                  <h3 className={styles.mcTitle}>Initial Wiring & Setup</h3>
                  <span className={styles.mcDate}>Due by Oct 20, 2023</span>
                </div>
                <div className={styles.mcAmount}>$2,500.00</div>
              </div>
              <p className={styles.mcDesc}>
                Complete rough-in wiring for the main floor, install junction
                boxes, and pull necessary cables for lighting and power outlets.
              </p>

              <div className={styles.mcFooter}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <span className={`${styles.badge} ${styles.badgeDefault}`}>Completed</span>
                  <span className={`${styles.badge} ${styles.badgeSuccess}`}>
                    <iconify-icon
                      icon="lucide:check-circle"
                      style={{ fontSize: '12px' }}
                    ></iconify-icon>
                    Paid
                  </span>
                </div>
                <div style={{ color: '#64748b', fontSize: '13px', fontWeight: '500' }}>
                  Approved on Oct 19, 2023
                </div>
              </div>
            </div>
          </div>

          {/* Milestone 2: Active */}
          <div className={`${styles.timelineItem} ${styles.active}`}>
            <div className={styles.timelineMarker}>
              <div className={styles.activeDot}></div>
            </div>
            <div className={styles.milestoneCard}>
              <div className={styles.mcHeader}>
                <div>
                  <h3 className={styles.mcTitle}>Main Panel Installation</h3>
                  <span className={styles.mcDate}>Due by Nov 05, 2023</span>
                </div>
                <div className={styles.mcAmount}>$3,500.00</div>
              </div>
              <p className={styles.mcDesc}>
                Install 200A main service panel, connect all previously pulled
                circuits, and verify correct load balancing across phases.
              </p>

              <div className={styles.attachmentBox}>
                <div className={styles.attachmentIcon}>
                  <iconify-icon
                    icon="lucide:file-text"
                    style={{ fontSize: '16px' }}
                  ></iconify-icon>
                </div>
                <div className={styles.attachmentInfo}>
                  <div className={styles.attachmentName}>Panel_Diagram_v2.pdf</div>
                  <div className={styles.attachmentMeta}>1.2 MB • Uploaded by Client</div>
                </div>
                <button className={`${styles.btnOutline} ${styles.btnSm}`}>
                  View
                </button>
              </div>

              <div className={styles.mcFooter}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <span className={`${styles.badge} ${styles.badgeActive}`}>In Progress</span>
                  <span className={`${styles.badge} ${styles.badgeSuccess}`}>
                    <iconify-icon
                      icon="lucide:lock"
                      style={{ fontSize: '12px' }}
                    ></iconify-icon>
                    Funded in Escrow
                  </span>
                </div>
                <button className={styles.btnPrimary}>
                  <iconify-icon
                    icon="lucide:check-square"
                    style={{ fontSize: '16px' }}
                  ></iconify-icon>
                  Mark as Complete
                </button>
              </div>
            </div>
          </div>

          {/* Milestone 3: Pending */}
          <div className={styles.timelineItem}>
            <div className={styles.timelineMarker}></div>
            <div className={styles.milestoneCard} style={{ opacity: 0.8 }}>
              <div className={styles.mcHeader}>
                <div>
                  <h3 className={styles.mcTitle}>Final Inspection & Handover</h3>
                  <span className={styles.mcDate}>Due by Nov 15, 2023</span>
                </div>
                <div className={styles.mcAmount}>$1,500.00</div>
              </div>
              <p className={styles.mcDesc}>
                Testing of all outlets and fixtures, passing city electrical
                inspection, and final handover to client.
              </p>

              <div className={styles.mcFooter}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <span className={`${styles.badge} ${styles.badgeDefault}`}>Pending</span>
                  <span className={`${styles.badge} ${styles.badgeWarning}`}>
                    <iconify-icon
                      icon="lucide:circle-dashed"
                      style={{ fontSize: '12px' }}
                    ></iconify-icon>
                    Awaiting Deposit
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
