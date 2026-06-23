"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import { useToast } from "@/app/components/Toast";
import { SkeletonBlock, SkeletonCard, SkeletonStat } from "@/app/components/skeleton/Skeleton";
import { formatXOF } from "@/app/lib/format";
import styles from "./admin-disputes.module.css";
import LogoutButton from "@/app/components/LogoutButton";

export default function AdminDisputesPage() {
  const toast = useToast();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  // Fetch disputes & logged in user
  const { data: user, loading: userLoading } = useFetch(() => api.getMe(), []);
  const { data: disputesData, loading: disputesLoading, refetch: refetchDisputes } = useFetch(() => api.getDisputes(), []);

  // Modal States
  const [activeDisputeId, setActiveDisputeId] = useState<string | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailDispute, setDetailDispute] = useState<any>(null);

  // Form States for Mediation
  const [formStatus, setFormStatus] = useState("under_review");
  const [formResolution, setFormResolution] = useState("");
  const [savingMediation, setSavingMediation] = useState(false);

  const userName = user ? `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.username || "" : "";
  const userInitials = user ? `${(user.first_name || "")[0] || ""}${(user.last_name || "")[0] || ""}`.toUpperCase() : "";
  const userRole = user?.role || "";

  const disputes = useMemo(() => (Array.isArray(disputesData) ? disputesData : []), [disputesData]);

  // Aggregate statistics
  const totalCount = disputes.length;
  const openCount = disputes.filter((d: any) => d.status === "open").length;
  const inReviewCount = disputes.filter((d: any) => d.status === "under_review" || d.status === "awaiting_response").length;
  const resolvedCount = disputes.filter((d: any) => d.status === "resolved" || d.status === "closed").length;

  // Filter & search implementation
  const filteredDisputes = useMemo(() => {
    let next = disputes;

    // Filter tab status mappings
    if (activeFilter === "open") {
      next = next.filter((d: any) => d.status === "open");
    } else if (activeFilter === "under_review") {
      next = next.filter((d: any) => d.status === "under_review" || d.status === "awaiting_response");
    } else if (activeFilter === "resolved") {
      next = next.filter((d: any) => d.status === "resolved" || d.status === "closed");
    }

    // Keyword search
    const query = searchQuery.trim().toLowerCase();
    if (query) {
      next = next.filter((d: any) =>
        String(d.id).toLowerCase().includes(query) ||
        (d.title || "").toLowerCase().includes(query) ||
        (d.opened_by_name || "").toLowerCase().includes(query) ||
        (d.against_name || "").toLowerCase().includes(query) ||
        (d.task_title || "").toLowerCase().includes(query) ||
        (d.reason || "").toLowerCase().includes(query)
      );
    }

    return next;
  }, [disputes, activeFilter, searchQuery]);

  // Modal interactions
  const openMediation = async (id: string) => {
    setActiveDisputeId(id);
    setDetailLoading(true);
    setDetailDispute(null);
    try {
      const data = await api.getDispute(Number(id));
      setDetailDispute(data);
      setFormStatus(data.status || "under_review");
      setFormResolution(data.resolution || "");
    } catch (err: any) {
      toast.error("Failed to load details", err?.message || "Could not retrieve case info.");
      setActiveDisputeId(null);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleSaveMediation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDisputeId) return;

    // Frontend validation matching backend requirements
    if (formStatus === "resolved" && !formResolution.trim()) {
      toast.warning("Resolution required", "Please enter resolution text summary before marking as resolved.");
      return;
    }

    setSavingMediation(true);
    try {
      await api.updateDispute(Number(activeDisputeId), {
        status: formStatus,
        resolution: formResolution,
      });
      toast.success("Case updated", "The dispute status and mediation notes have been successfully updated.");
      setActiveDisputeId(null);
      refetchDisputes();
    } catch (err: any) {
      toast.error("Failed to update case", err?.message || "Please check inputs and try again.");
    } finally {
      setSavingMediation(false);
    }
  };

  // Label mappings
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "open":
        return styles.statusOpen;
      case "under_review":
      case "awaiting_response":
        return styles.statusReview;
      case "resolved":
      case "closed":
        return styles.statusResolved;
      default:
        return "";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "open":
        return "Open Case";
      case "under_review":
        return "Under Review";
      case "awaiting_response":
        return "Awaiting Response";
      case "resolved":
        return "Resolved";
      case "closed":
        return "Closed";
      default:
        return status;
    }
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", href: "/dashboard/admin", icon: "lucide:layout-dashboard" },
    { id: "users", label: "Users", href: "/dashboard/admin/users", icon: "lucide:users" },
    { id: "tasks", label: "Tasks", href: "/dashboard/admin/tasks", icon: "lucide:file-text" },
    { id: "verification", label: "Verification", href: "/dashboard/admin/verification", icon: "lucide:shield-check" },
    { id: "payments", label: "Payments", href: "/dashboard/admin/payments", icon: "lucide:credit-card" },
    { id: "disputes", label: "Disputes", href: "/dashboard/admin/disputes", icon: "lucide:scale" },
    { id: "content", label: "Content", href: "/dashboard/admin/content", icon: "lucide:layers" },
    { id: "settings", label: "Settings", href: "/dashboard/admin/settings", icon: "lucide:settings" },
  ];

  return (
    <div className={`${styles.layoutWrapper} ${mobileSidebarOpen ? styles.sidebarOpenMobile : ""}`}>
      <div className={styles.sidebarOverlay} onClick={() => setMobileSidebarOpen(false)} />

      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <Link href="/" className={styles.brand}>
            <Image src="/boulotman-logo.png" alt="Boulot Man" width={180} height={46} className={styles.brandImage} priority />
            <span className={styles.adminBadge}>Admin</span>
          </Link>
        </div>
        <nav className={styles.navMenu}>
          {navItems.map((item) => (
            <Link key={item.id} href={item.href} className={`${styles.navItem} ${item.id === "disputes" ? styles.navItemActive : ""}`}>
              <iconify-icon icon={item.icon} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <LogoutButton className={styles.logoutBtn} />
        </div>
      </aside>

      <main className={styles.mainContent}>
        <header className={styles.topbar}>
          <div className={styles.topbarLeft}>
            <button className={styles.mobileMenuBtn} onClick={() => setMobileSidebarOpen(true)}>
              <iconify-icon icon="lucide:menu" />
            </button>
            <div className={styles.searchBar}>
              <iconify-icon icon="lucide:search" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search disputes by ID, user, or task..."
              />
            </div>
          </div>
          <div className={styles.topbarRight}>
            <div className={styles.adminProfile}>
              <div className={styles.avatar}>
                {userLoading ? <SkeletonBlock style={{ width: 36, height: 36, borderRadius: "50%" }} /> : userInitials}
              </div>
              <div className={styles.profileInfo}>
                <div className={styles.profileName}>{userLoading ? <SkeletonBlock style={{ width: 80, height: 14 }} /> : userName}</div>
                <span className={styles.profileRole}>{userRole}</span>
              </div>
            </div>
          </div>
        </header>

        <div className={styles.dashboardBody}>
          <div className={styles.pageHeader}>
            <div className={styles.headerContent}>
              <h1>Dispute Management</h1>
              <p>Review, mediate, and resolve platform conflicts securely.</p>
            </div>
            <div className={styles.headerActions}>
              <button className={styles.btnOutline} onClick={() => window.print()}>
                <iconify-icon icon="lucide:download" /> Export Log
              </button>
            </div>
          </div>

          <div className={styles.overviewGrid}>
            {disputesLoading ? (
              <>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={styles.statCard}><SkeletonStat /></div>
                ))}
              </>
            ) : (
              <>
                <div className={styles.statCard}>
                  <div className={styles.statHeader}>
                    <span className={styles.statLabel}>Total Disputes</span>
                    <div className={styles.statIcon}>
                      <iconify-icon icon="lucide:scale" />
                    </div>
                  </div>
                  <span className={styles.statValue}>{totalCount}</span>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statHeader}>
                    <span className={styles.statLabel}>Open Cases</span>
                    <div className={`${styles.statIcon} ${styles.statIconRed}`}>
                      <iconify-icon icon="lucide:alert-triangle" />
                    </div>
                  </div>
                  <span className={styles.statValue}>{openCount}</span>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statHeader}>
                    <span className={styles.statLabel}>In Review</span>
                    <div className={`${styles.statIcon} ${styles.statIconOrange}`}>
                      <iconify-icon icon="lucide:search" />
                    </div>
                  </div>
                  <span className={styles.statValue}>{inReviewCount}</span>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statHeader}>
                    <span className={styles.statLabel}>Resolved / Closed</span>
                    <div className={`${styles.statIcon} ${styles.statIconGreen}`}>
                      <iconify-icon icon="lucide:check-circle" />
                    </div>
                  </div>
                  <span className={styles.statValue}>{resolvedCount}</span>
                </div>
              </>
            )}
          </div>

          {/* Filter Bar */}
          <div className={styles.filterBar}>
            <button className={`${styles.filterBtn} ${activeFilter === "all" ? styles.filterBtnActive : ""}`} onClick={() => setActiveFilter("all")}>All Disputes</button>
            <button className={`${styles.filterBtn} ${activeFilter === "open" ? styles.filterBtnActive : ""}`} onClick={() => setActiveFilter("open")}>Open Cases</button>
            <button className={`${styles.filterBtn} ${activeFilter === "under_review" ? styles.filterBtnActive : ""}`} onClick={() => setActiveFilter("under_review")}>In Review</button>
            <button className={`${styles.filterBtn} ${activeFilter === "resolved" ? styles.filterBtnActive : ""}`} onClick={() => setActiveFilter("resolved")}>Resolved</button>
          </div>

          <div className={styles.sectionCard}>
            {disputesLoading ? (
              <div style={{ padding: "24px" }}>
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </div>
            ) : filteredDisputes.length === 0 ? (
              <div style={{ padding: 40, textAlign: "center", color: "#94a3b8", fontSize: 14 }}>
                <iconify-icon icon="lucide:scale" style={{ fontSize: 48, marginBottom: 16, display: "block", opacity: 0.4 }} />
                <p>No disputes found matching current filters.</p>
              </div>
            ) : (
              <div className={styles.tableWrapper}>
                <table className={styles.adminTable}>
                  <thead>
                    <tr>
                      <th>Case ID</th>
                      <th>Task Details</th>
                      <th>Parties Involved</th>
                      <th>Issue & Reason</th>
                      <th>Status</th>
                      <th style={{ textAlign: "right" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDisputes.map((dispute: any) => (
                      <tr key={dispute.id}>
                        <td>
                          <div className={styles.caseCell}>
                            <span className={styles.caseId}>#DISP-{dispute.id}</span>
                            <span className={styles.caseDate}>{new Date(dispute.opened_at).toLocaleDateString()}</span>
                          </div>
                        </td>
                        <td>
                          <div className={styles.taskCell}>
                            <span className={styles.taskTitle}>{dispute.task_title || `Task #${dispute.task}`}</span>
                            <span className={styles.taskAmount}>
                              <iconify-icon icon="lucide:wallet" style={{ fontSize: "14px" }} />
                              {dispute.task_budget ? formatXOF(dispute.task_budget) : "TBD"}
                            </span>
                          </div>
                        </td>
                        <td>
                          <div className={styles.partiesCell}>
                            <div className={styles.party}>
                              <div className={styles.partyAvatarFallback}>
                                {dispute.opened_by_name.slice(0, 2).toUpperCase()}
                              </div>
                              <div className={styles.partyInfo}>
                                <span className={styles.partyName}>{dispute.opened_by_name}</span>
                                <span className={styles.partyRole}>Opened By</span>
                              </div>
                            </div>
                            <span className={styles.vsBadge}>VS</span>
                            <div className={styles.party}>
                              <div className={styles.partyAvatarFallback}>
                                {dispute.against_name ? dispute.against_name.slice(0, 2).toUpperCase() : "??"}
                              </div>
                              <div className={styles.partyInfo}>
                                <span className={styles.partyName}>{dispute.against_name || "Assigned Pro"}</span>
                                <span className={styles.partyRole}>Against</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className={styles.issueCell}>
                            <span className={styles.issueCategory}>{dispute.reason.toUpperCase()}</span>
                            <span className={styles.taskTitle} style={{ display: "block", marginBottom: 4 }}>{dispute.title}</span>
                          </div>
                        </td>
                        <td>
                          <span className={`${styles.statusBadge} ${getStatusBadgeClass(dispute.status)}`}>
                            {getStatusLabel(dispute.status)}
                          </span>
                        </td>
                        <td>
                          <div className={styles.actions}>
                            <button
                              type="button"
                              className={styles.btnPrimary}
                              onClick={() => openMediation(String(dispute.id))}
                            >
                              Mediate
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mediation Modal Overlay */}
      {activeDisputeId && (
        <div className={styles.modalOverlay} onClick={() => setActiveDisputeId(null)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <header className={styles.modalHeader}>
              <h2>Dispute Mediation - Case #DISP-{activeDisputeId}</h2>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setActiveDisputeId(null)}
              >
                <iconify-icon icon="lucide:x" />
              </button>
            </header>

            {detailLoading ? (
              <div className={styles.modalBody} style={{ padding: "40px" }}>
                <SkeletonBlock style={{ height: 20, width: "30%", marginBottom: 16 }} />
                <SkeletonBlock style={{ height: 100, borderRadius: 12, marginBottom: 24 }} />
                <SkeletonBlock style={{ height: 20, width: "40%", marginBottom: 16 }} />
                <SkeletonBlock style={{ height: 100, borderRadius: 12 }} />
              </div>
            ) : detailDispute ? (
              <form onSubmit={handleSaveMediation} style={{ display: "contents" }}>
                <div className={styles.modalBody}>
                  <div className={styles.disputeSplitGrid}>
                    {/* Left Column: Details */}
                    <div className={styles.detailSection}>
                      <div className={styles.detailGroup}>
                        <h3>Issue Description</h3>
                        <p>{detailDispute.description || "No description provided."}</p>
                      </div>

                      <div className={styles.detailGroup}>
                        <h3>Related Task</h3>
                        <div className={styles.detailMetaList}>
                          <div className={styles.metaCard}>
                            <span>Task Title</span>
                            <strong>{detailDispute.task_title || `Task #${detailDispute.task}`}</strong>
                          </div>
                          <div className={styles.metaCard}>
                            <span>Task Budget</span>
                            <strong>{detailDispute.task_budget ? formatXOF(detailDispute.task_budget) : "TBD"}</strong>
                          </div>
                        </div>
                      </div>

                      <div className={styles.detailGroup}>
                        <h3>Disputing Parties</h3>
                        <div className={styles.detailMetaList}>
                          <div className={styles.metaCard}>
                            <span>Opened By</span>
                            <strong>{detailDispute.opened_by_name}</strong>
                          </div>
                          <div className={styles.metaCard}>
                            <span>Against</span>
                            <strong>{detailDispute.against_name || "Assigned Professional"}</strong>
                          </div>
                        </div>
                      </div>

                      <div className={styles.detailGroup}>
                        <h3>Evidence Submissions ({detailDispute.evidence?.length || 0})</h3>
                        <div className={styles.evidenceList}>
                          {!detailDispute.evidence || detailDispute.evidence.length === 0 ? (
                            <span style={{ fontSize: "14px", color: "#94a3b8" }}>No files or evidence submitted.</span>
                          ) : (
                            detailDispute.evidence.map((file: any) => (
                              <div key={file.id} className={styles.evidenceItem}>
                                <div className={styles.evidenceInfo}>
                                  <div className={styles.evidenceIcon}>
                                    <iconify-icon icon={file.file_type === "image" ? "lucide:image" : "lucide:file-text"} />
                                  </div>
                                  <div className={styles.evidenceNameWrap}>
                                    <span className={styles.evidenceName}>{file.file_name || "Evidence Document"}</span>
                                    <span className={styles.evidenceMeta}>Uploaded by {file.uploaded_by_name}</span>
                                  </div>
                                </div>
                                {file.file_url ? (
                                  <a
                                    href={file.file_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={styles.evidenceLink}
                                  >
                                    View File
                                    <iconify-icon icon="lucide:external-link" />
                                  </a>
                                ) : null}
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Mediation Action form */}
                    <div className={styles.actionPanel}>
                      <h3>Resolution Control</h3>

                      <div className={styles.formGroup}>
                        <label htmlFor="mediation-status">Set Case Status</label>
                        <select
                          id="mediation-status"
                          className={styles.selectField}
                          value={formStatus}
                          onChange={(e) => setFormStatus(e.target.value)}
                        >
                          <option value="under_review">Under Review</option>
                          <option value="awaiting_response">Awaiting Response</option>
                          <option value="resolved">Resolved</option>
                          <option value="closed">Closed</option>
                        </select>
                      </div>

                      <div className={styles.formGroup}>
                        <label htmlFor="mediation-resolution">
                          Resolution Summary {formStatus === "resolved" && <span style={{ color: "#dc2626" }}>*</span>}
                        </label>
                        <textarea
                          id="mediation-resolution"
                          className={styles.textareaField}
                          value={formResolution}
                          onChange={(e) => setFormResolution(e.target.value)}
                          placeholder="Provide mediation notes, final settlement, and terms of resolution..."
                          required={formStatus === "resolved"}
                        />
                        {formStatus === "resolved" && (
                          <span style={{ fontSize: "12px", color: "#64748b" }}>
                            Resolution notes are required to resolve the case.
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <footer className={styles.modalFooter}>
                  <button
                    type="button"
                    className={styles.btnOutline}
                    style={{ width: "auto" }}
                    onClick={() => setActiveDisputeId(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={styles.btnPrimary}
                    style={{ width: "auto", maxWidth: "none" }}
                    disabled={savingMediation || (formStatus === "resolved" && !formResolution.trim())}
                  >
                    {savingMediation ? "Saving..." : "Save Resolution"}
                  </button>
                </footer>
              </form>
            ) : (
              <div className={styles.modalBody} style={{ padding: "40px", textAlign: "center" }}>
                <p>Failed to load case information.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

