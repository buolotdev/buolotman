"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { api, getImageUrl } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import { useToast } from "@/app/components/Toast";
import { useDialog } from "@/app/components/Dialog";
import styles from "./admin-verification.module.css";

interface DocItem {
  id: number;
  title: string;
  document_type: string;
  file_url: string;
  is_verified: boolean;
  created_at: string;
}

interface VerificationUser {
  id: number;
  email: string;
  username: string;
  phone?: string;
  country?: string;
  first_name?: string;
  last_name?: string;
  role: string;
  created_at: string;
  is_active: boolean;
  is_verified: boolean;
  avatar_url?: string;
  documents?: DocItem[];
  title?: string;
  bio?: string;
}

export default function AdminVerificationPage() {
  const toast = useToast();
  const dialog = useDialog();

  const [statusFilter, setStatusFilter] = useState<"pending" | "verified" | "all">("pending");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDoc, setSelectedDoc] = useState<{ title: string; url: string; type: string } | null>(null);

  const { data: usersData, loading, refetch } = useFetch(
    () => api.adminListUsers(),
    []
  );

  const users: VerificationUser[] = useMemo(() => {
    return Array.isArray(usersData) ? usersData : [];
  }, [usersData]);

  // Counts
  const pendingCount = users.filter((u) => !u.is_verified && u.role !== "ADMIN").length;
  const verifiedCount = users.filter((u) => u.is_verified && u.role !== "ADMIN").length;
  const totalDocsCount = users.reduce((acc, u) => acc + (u.documents?.length || 0), 0);

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      if (u.role === "ADMIN") return false;

      // Status filter
      if (statusFilter === "pending" && u.is_verified) return false;
      if (statusFilter === "verified" && !u.is_verified) return false;

      // Role filter
      if (roleFilter !== "ALL" && u.role !== roleFilter) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const fullName = `${u.first_name || ""} ${u.last_name || ""}`.toLowerCase();
        const email = (u.email || "").toLowerCase();
        const username = (u.username || "").toLowerCase();
        const country = (u.country || "").toLowerCase();
        const title = (u.title || "").toLowerCase();
        if (
          !fullName.includes(q) &&
          !email.includes(q) &&
          !username.includes(q) &&
          !country.includes(q) &&
          !title.includes(q)
        ) {
          return false;
        }
      }

      return true;
    });
  }, [users, statusFilter, roleFilter, searchQuery]);

  const handleApprove = async (u: VerificationUser) => {
    const name = `${u.first_name || ""} ${u.last_name || ""}`.trim() || u.username;
    const ok = await dialog.confirm({
      title: "Approve Verification?",
      message: `Are you sure you want to approve ${name}? Their account and all submitted credentials will be marked as verified with priority trust badges.`,
      confirmText: "Approve & Verify",
    });
    if (!ok) return;

    try {
      await api.adminVerifyUser(u.id);
      toast.success("User Verified", `${name} is now verified on the marketplace.`);
      refetch();
    } catch (err: any) {
      toast.error("Verification Failed", err?.message || "Could not verify user.");
    }
  };

  const handleReject = async (u: VerificationUser) => {
    const name = `${u.first_name || ""} ${u.last_name || ""}`.trim() || u.username;
    const ok = await dialog.confirm({
      title: "Suspend / Reject Account?",
      message: `Are you sure you want to suspend verification access for ${name}?`,
      confirmText: "Suspend Account",
    });
    if (!ok) return;

    try {
      await api.adminSuspendUser(u.id, "suspend");
      toast.info("Account Suspended", `${name} verification has been flagged.`);
      refetch();
    } catch (err: any) {
      toast.error("Action Failed", err?.message || "Could not update user status.");
    }
  };

  const getDocTypeLabel = (type: string) => {
    switch (type) {
      case "id":
        return "National ID / Passport";
      case "certificate":
        return "License / Certificate";
      case "insurance":
        return "Insurance Policy";
      default:
        return "Supporting Document";
    }
  };

  return (
    <div className={styles.dashboardBody}>
      {/* ROYAL BLUE HERO BANNER */}
      <div className={styles.heroBanner}>
        <div className={styles.heroContent}>
          <div className={styles.heroTag}>
            <iconify-icon icon="lucide:shield-check" /> Trust & Compliance Center
          </div>
          <h1 className={styles.heroTitle}>Verification & Vetting</h1>
          <p className={styles.heroSubtitle}>
            Supervise professional credentials, review identity documents, and fast-track trusted approvals across the Boulot Man marketplace.
          </p>
        </div>
        <div className={styles.heroDecoIcon}>
          <iconify-icon icon="lucide:badge-check" />
        </div>
      </div>

      {/* TOP STATS OVERVIEW */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(0, 31, 63, 0.08)", color: "#001f3f" }}>
            <iconify-icon icon="lucide:clock-3" />
          </div>
          <div>
            <div className={styles.statValue}>{pendingCount}</div>
            <div className={styles.statLabel}>Pending Review</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(34, 197, 94, 0.12)", color: "#16a34a" }}>
            <iconify-icon icon="lucide:shield-check" />
          </div>
          <div>
            <div className={styles.statValue}>{verifiedCount}</div>
            <div className={styles.statLabel}>Verified Accounts</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(0, 31, 63, 0.08)", color: "#001f3f" }}>
            <iconify-icon icon="lucide:file-text" />
          </div>
          <div>
            <div className={styles.statValue}>{totalDocsCount}</div>
            <div className={styles.statLabel}>Uploaded Documents</div>
          </div>
        </div>
      </div>

      {/* TOOLBAR & FILTERS */}
      <div className={styles.toolbarFilters}>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
          {/* Status Filter */}
          <div className={styles.filterPillGroup}>
            <button
              onClick={() => setStatusFilter("pending")}
              className={`${styles.filterPill} ${statusFilter === "pending" ? styles.filterPillActive : ""}`}
            >
              <iconify-icon icon="lucide:clock" /> Pending ({pendingCount})
            </button>
            <button
              onClick={() => setStatusFilter("verified")}
              className={`${styles.filterPill} ${statusFilter === "verified" ? styles.filterPillActive : ""}`}
            >
              <iconify-icon icon="lucide:check-circle-2" /> Verified ({verifiedCount})
            </button>
            <button
              onClick={() => setStatusFilter("all")}
              className={`${styles.filterPill} ${statusFilter === "all" ? styles.filterPillActive : ""}`}
            >
              All Users ({users.length})
            </button>
          </div>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className={styles.roleSelect}
          >
            <option value="ALL">All Roles</option>
            <option value="TECHNICIAN">Technicians</option>
            <option value="COMPANY">Companies</option>
            <option value="CLIENT">Clients</option>
          </select>
        </div>

        {/* Search Bar */}
        <div className={styles.searchWrap}>
          <iconify-icon
            icon="lucide:search"
            style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8", fontSize: "17px" }}
          />
          <input
            type="text"
            placeholder="Search by name, email, country..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      {/* VERIFICATION CARDS GRID */}
      <div>
        {loading ? (
          <div style={{ padding: 60, textAlign: "center", color: "#64748b" }}>
            <iconify-icon icon="lucide:loader-2" style={{ fontSize: 36, animation: "spin 1s linear infinite", color: "#001f3f" }} />
            <p style={{ marginTop: 14, fontWeight: 600 }}>Loading verification requests...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div style={{ padding: 60, textAlign: "center", background: "#ffffff", borderRadius: 20, border: "1px solid #e2e8f0", boxShadow: "0 4px 16px rgba(0,0,0,0.02)" }}>
            <iconify-icon icon="lucide:shield-check" style={{ fontSize: 56, color: "#16a34a", marginBottom: 16, display: "block" }} />
            <h3 style={{ margin: "0 0 8px", fontSize: 20, color: "#001f3f", fontWeight: 800 }}>Verification queue is clear</h3>
            <p style={{ color: "#64748b", margin: 0, fontSize: 14 }}>No pending user accounts match the current filter criteria.</p>
          </div>
        ) : (
          <div className={styles.verificationGrid}>
            {filteredUsers.map((u) => {
              const fullName = `${u.first_name || ""} ${u.last_name || ""}`.trim() || u.username;
              const initials = `${(u.first_name || "")[0] || ""}${(u.last_name || "")[0] || ""}`.toUpperCase() || u.username?.[0]?.toUpperCase() || "U";
              const docs = u.documents || [];

              return (
                <div key={u.id} className={styles.verificationCard}>
                  {/* Card Header */}
                  <div className={styles.cardHeader}>
                    <div className={styles.userMeta}>
                      {u.avatar_url ? (
                        <img src={getImageUrl(u.avatar_url)} alt={fullName} className={styles.userAvatar} />
                      ) : (
                        <div className={styles.userAvatarFallback}>{initials}</div>
                      )}
                      <div className={styles.userDetails}>
                        <span className={styles.applicantName}>{fullName}</span>
                        <span className={styles.applicantRole}>
                          <iconify-icon icon={u.role === "COMPANY" ? "lucide:building-2" : "lucide:wrench"} style={{ color: "#ff4500" }} />
                          {u.role} • {u.country || "Global"}
                        </span>
                        <span className={styles.submissionDate}>
                          Joined: {u.created_at ? new Date(u.created_at).toLocaleDateString() : "—"}
                        </span>
                      </div>
                    </div>

                    <span className={`${styles.statusBadge} ${u.is_verified ? styles.statusApproved : styles.statusPending}`}>
                      <iconify-icon icon={u.is_verified ? "lucide:check-circle" : "lucide:clock"} />
                      {u.is_verified ? "Verified" : "Pending"}
                    </span>
                  </div>

                  {/* Profile Bio / Title */}
                  {u.title || u.bio ? (
                    <div style={{ background: "#f8fafc", padding: "12px 14px", borderRadius: "12px", fontSize: "13px", border: "1px solid #edf2f7" }}>
                      {u.title && <strong style={{ color: "#001f3f", display: "block", marginBottom: 3, fontWeight: 700 }}>{u.title}</strong>}
                      {u.bio && <p style={{ margin: 0, color: "#64748b", lineHeight: 1.4 }}>{u.bio.substring(0, 140)}...</p>}
                    </div>
                  ) : null}

                  {/* Contact Meta */}
                  <div style={{ display: "flex", gap: "16px", fontSize: "12.5px", color: "#64748b", flexWrap: "wrap" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
                      <iconify-icon icon="lucide:mail" style={{ color: "#001f3f" }} /> {u.email}
                    </span>
                    {u.phone && (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
                        <iconify-icon icon="lucide:phone" style={{ color: "#001f3f" }} /> {u.phone}
                      </span>
                    )}
                  </div>

                  {/* Documents Section */}
                  <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "14px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <strong style={{ fontSize: "13px", color: "#001f3f", display: "flex", alignItems: "center", gap: 6 }}>
                        <iconify-icon icon="lucide:paperclip" style={{ color: "#ff4500" }} /> Submitted Documents ({docs.length})
                      </strong>
                    </div>

                    {docs.length === 0 ? (
                      <div style={{ padding: "14px", background: "#f8fafc", borderRadius: "10px", textAlign: "center", fontSize: "12px", color: "#94a3b8" }}>
                        No identity documents uploaded yet.
                      </div>
                    ) : (
                      <div>
                        {docs.map((doc) => (
                          <div key={doc.id} className={styles.documentItem}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <iconify-icon icon="lucide:file-text" style={{ fontSize: 20, color: "#001f3f" }} />
                              <div>
                                <strong style={{ display: "block", fontSize: 13, color: "#001f3f" }}>{doc.title || "Identity Document"}</strong>
                                <small style={{ color: "#64748b", fontSize: 11 }}>{getDocTypeLabel(doc.document_type)}</small>
                              </div>
                            </div>
                            <button
                              type="button"
                              className={styles.docActionBtn}
                              onClick={() => {
                                setSelectedDoc({
                                  title: doc.title || getDocTypeLabel(doc.document_type),
                                  url: getImageUrl(doc.file_url),
                                  type: doc.document_type,
                                });
                              }}
                            >
                              <iconify-icon icon="lucide:eye" /> View
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Card Actions with Stylish Orange Approve Button */}
                  <div className={styles.cardActions}>
                    <Link href={`/profile/${u.id}`} target="_blank" className={styles.btnView}>
                      <iconify-icon icon="lucide:external-link" /> Profile
                    </Link>

                    {!u.is_verified ? (
                      <>
                        <button type="button" onClick={() => handleReject(u)} className={styles.btnReject}>
                          <iconify-icon icon="lucide:x-circle" /> Reject
                        </button>
                        <button type="button" onClick={() => handleApprove(u)} className={styles.btnApprove}>
                          <iconify-icon icon="lucide:check-circle" /> Approve
                        </button>
                      </>
                    ) : (
                      <button type="button" onClick={() => handleReject(u)} className={styles.btnReject}>
                        <iconify-icon icon="lucide:ban" /> Suspend
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Full Document Viewer Modal */}
      {selectedDoc && (
        <div className={styles.modalOverlay} onClick={() => setSelectedDoc(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h3 style={{ margin: 0, fontSize: 19, color: "#001f3f", fontWeight: 800 }}>{selectedDoc.title}</h3>
                <span style={{ fontSize: 12.5, color: "#64748b", fontWeight: 600 }}>{getDocTypeLabel(selectedDoc.type)}</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDoc(null)}
                className={styles.modalCloseBtn}
              >
                <iconify-icon icon="lucide:x" />
              </button>
            </div>

            <div style={{ flex: 1, overflow: "auto", minHeight: 280, display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc", borderRadius: 16, border: "1px solid #e2e8f0", padding: 12 }}>
              {selectedDoc.url.match(/\.(jpg|jpeg|png|webp|gif)$/i) ? (
                <img src={selectedDoc.url} alt={selectedDoc.title} style={{ maxWidth: "100%", maxHeight: "65vh", objectFit: "contain", borderRadius: 8 }} />
              ) : (
                <div style={{ textAlign: "center", padding: 40 }}>
                  <iconify-icon icon="lucide:file-text" style={{ fontSize: 64, color: "#001f3f", marginBottom: 16 }} />
                  <p style={{ color: "#001f3f", fontWeight: 700, margin: "0 0 12px" }}>{selectedDoc.title}</p>
                  <a
                    href={selectedDoc.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#001f3f", color: "#fff", padding: "10px 20px", borderRadius: 10, textDecoration: "none", fontWeight: 700, fontSize: 13 }}
                  >
                    <iconify-icon icon="lucide:download" /> Open / Download Document
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
