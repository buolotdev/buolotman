"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./TaskBoard.module.css";
import { api } from "../lib/api";
import { useFetch } from "../lib/useFetch";
import { SkeletonBlock } from "./skeleton/Skeleton";

export default function TaskBoard() {
  const router = useRouter();
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedUrgency, setSelectedUrgency] = useState("all");
  const [activePill, setActivePill] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Fetch tasks and categories
  const { data: tasksData, loading, error, refetch } = useFetch(() => api.getTasks({}), []);
  const { data: categoriesData } = useFetch(() => api.getCategories(), []);

  const [isAuth, setIsAuth] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsAuth(!!localStorage.getItem("access_token"));
    }
  }, []);

  const { data: myBidsData, refetch: refetchMyBids } = useFetch(
    () => (isAuth ? api.getMyBids() : Promise.resolve([])),
    [isAuth]
  );
  const appliedTaskIds = useMemo(() => {
    if (!myBidsData) return new Set<number>();
    const list = Array.isArray(myBidsData) ? myBidsData : ((myBidsData as any)?.results || []);
    return new Set<number>(list.map((b: any) => Number(b.task_id || b.task?.id || b.task)));
  }, [myBidsData]);

  // Modal State
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const handleApply = (task: any) => {
    setSelectedTask(task);
    setShowSuccess(false);
    setSubmitError(null);
    setAmount(task.budget_max ? String(task.budget_max) : "");
    setMessage("");
  };

  const closeModal = () => {
    setSelectedTask(null);
  };

  const submitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask) return;

    setIsSubmitting(true);
    setSubmitError(null);
    setShowSuccess(false);

    try {
      await api.submitBid(selectedTask.id, {
        amount: parseFloat(amount),
        message: message,
      });
      setShowSuccess(true);
      refetchMyBids();
      setTimeout(() => {
        closeModal();
      }, 2000);
    } catch (err: any) {
      setSubmitError(err.message || "Failed to submit proposal. You may have already applied.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const rawTasks = Array.isArray(tasksData) ? tasksData : ((tasksData as any)?.results || []);
  const categories = Array.isArray(categoriesData) ? categoriesData : [];

  // Filter & Sort Tasks in real-time
  const filteredTasks = useMemo(() => {
    let result: any[] = rawTasks.filter((t: any) => {
      if (t.assigned_to) return false;
      if (t.status && t.status !== "open") return false;
      if (t.description && (t.description.includes("DIRECT_INVITATION") || t.description.includes("specialist_id="))) return false;
      if (Array.isArray(t.skills) && t.skills.some((s: any) => String(s).includes("direct_invite"))) return false;
      if (Array.isArray(t.contact_methods) && t.contact_methods.some((c: any) => String(c).includes("direct_invite"))) return false;
      if (t.title && (t.title.toLowerCase().includes("auto work") || t.title.toLowerCase().includes("need hh"))) return false;
      return true;
    });




    // Search Query (Title or Description)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (t) =>
          (t.title && t.title.toLowerCase().includes(q)) ||
          (t.description && t.description.toLowerCase().includes(q)) ||
          (t.category_name && t.category_name.toLowerCase().includes(q)) ||
          (t.category?.name && t.category.name.toLowerCase().includes(q))
      );
    }

    // Category Filter
    if (selectedCategory !== "all") {
      result = result.filter(
        (t) =>
          t.category?.slug === selectedCategory ||
          t.category_name?.toLowerCase() === selectedCategory.toLowerCase() ||
          String(t.category) === selectedCategory
      );
    }

    // Location Filter
    if (selectedLocation !== "all") {
      if (selectedLocation === "remote") {
        result = result.filter((t) => t.is_remote || (t.location && t.location.toLowerCase().includes("remote")));
      } else {
        result = result.filter(
          (t) =>
            (t.city && t.city.toLowerCase().includes(selectedLocation.toLowerCase())) ||
            (t.location && t.location.toLowerCase().includes(selectedLocation.toLowerCase()))
        );
      }
    }

    // Urgency Filter
    if (selectedUrgency !== "all") {
      result = result.filter((t) => (t.urgency || "").toLowerCase() === selectedUrgency.toLowerCase());
    }

    // Quick Pill Filter
    if (activePill === "urgent") {
      result = result.filter((t) => (t.urgency || "").toLowerCase() === "urgent");
    } else if (activePill === "kigali") {
      result = result.filter(
        (t) => (t.city && t.city.toLowerCase().includes("kigali")) || (t.location && t.location.toLowerCase().includes("kigali"))
      );
    } else if (activePill === "remote") {
      result = result.filter((t) => t.is_remote || (t.location && t.location.toLowerCase().includes("remote")));
    } else if (activePill === "high_budget") {
      result = result.filter((t) => Number(t.budget_max || t.budget_min || 0) >= 50000);
    }

    // Sorting
    if (sortBy === "budget_high") {
      result.sort((a, b) => Number(b.budget_max || b.budget_min || 0) - Number(a.budget_max || a.budget_min || 0));
    } else if (sortBy === "budget_low") {
      result.sort((a, b) => Number(a.budget_min || a.budget_max || 0) - Number(b.budget_min || b.budget_max || 0));
    } else {
      // Newest
      result.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
    }

    return result;
  }, [rawTasks, searchQuery, selectedCategory, selectedLocation, selectedUrgency, activePill, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedLocation("all");
    setSelectedUrgency("all");
    setActivePill("all");
    setSortBy("newest");
  };

  return (
    <div className={styles.taskBoardContainer}>
      {/* ── STUNNING HERO BANNER ── */}
      <section className={styles.heroBanner}>
        <div className={styles.heroBadge}>
          <span className={styles.pulseDot}></span>
          <span>LIVE TASK MARKETPLACE</span>
        </div>
        <h1 className={styles.heroHeading}>
          Find High-Paying Tasks &amp; Verified Projects
        </h1>
        <p className={styles.heroSubheading}>
          Connect directly with verified clients across Africa. Submit competitive proposals, work with 100% escrow protection, and get paid instantly upon milestone completion.
        </p>

        <div className={styles.heroStatsRow}>
          <div className={styles.heroStatItem}>
            <iconify-icon icon="lucide:shield-check" className={styles.heroStatIcon} style={{ color: "#10b981" }} />
            <span>100% Escrow Protected</span>
          </div>
          <div className={styles.heroStatDivider}></div>
          <div className={styles.heroStatItem}>
            <iconify-icon icon="lucide:zap" className={styles.heroStatIcon} style={{ color: "#f59e0b" }} />
            <span>Instant Client Hiring</span>
          </div>
          <div className={styles.heroStatDivider}></div>
          <div className={styles.heroStatItem}>
            <iconify-icon icon="lucide:check-circle" className={styles.heroStatIcon} style={{ color: "#3b82f6" }} />
            <span>Zero Commission On Escrow</span>
          </div>
        </div>
      </section>

      {/* MODERN FILTER & SEARCH CARD */}
      <section className={styles.filterCard}>
        <div className={styles.searchRow}>
          {/* Keyword Search */}
          <div className={styles.inputGroup}>
            <iconify-icon icon="lucide:search" className={styles.inputIcon} style={{ color: "#ff4500" }} />
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search by title, skill, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className={styles.clearSearchBtn} onClick={() => setSearchQuery("")}>
                <iconify-icon icon="lucide:x" />
              </button>
            )}
          </div>

          {/* Location Dropdown */}
          <div className={styles.inputGroup}>
            <iconify-icon icon="lucide:map-pin" className={styles.inputIcon} style={{ color: "#0284c7" }} />
            <select
              className={styles.filterSelect}
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option value="all">📍 All Locations</option>
              <option value="kigali">Kigali, Rwanda</option>
              <option value="abidjan">Abidjan, Ivory Coast</option>
              <option value="cotonou">Cotonou, Benin</option>
              <option value="rubavu">Rubavu</option>
              <option value="huye">Huye</option>
              <option value="musanze">Musanze</option>
              <option value="remote">🌐 Remote Work</option>
            </select>
          </div>

          {/* Category Dropdown */}
          <div className={styles.inputGroup}>
            <iconify-icon icon="lucide:layout-grid" className={styles.inputIcon} style={{ color: "#8b5cf6" }} />
            <select
              className={styles.filterSelect}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">🗂️ All Categories</option>
              {categories.map((c: any) => (
                <option key={c.id || c.slug} value={c.slug || c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Urgency Selector */}
          <div className={styles.inputGroup}>
            <iconify-icon icon="lucide:clock-4" className={styles.inputIcon} style={{ color: "#10b981" }} />
            <select
              className={styles.filterSelect}
              value={selectedUrgency}
              onChange={(e) => setSelectedUrgency(e.target.value)}
            >
              <option value="all">⏱️ Any Timeline</option>
              <option value="urgent">⚡ Urgent Priority</option>
              <option value="flexible">🌱 Flexible Timeline</option>
              <option value="scheduled">📅 Scheduled Project</option>
            </select>
          </div>

          {/* Action Button */}
          <button className={styles.searchSubmitBtn} onClick={() => refetch()}>
            <iconify-icon icon="lucide:search" />
            <span>Find Tasks</span>
          </button>
        </div>

        {/* QUICK FILTER PILLS */}
        <div className={styles.quickFiltersRow}>
          <div className={styles.pillList}>
            <button
              className={`${styles.filterPill} ${activePill === "all" ? styles.filterPillActive : ""}`}
              onClick={() => setActivePill("all")}
            >
              <iconify-icon icon="lucide:layers" /> All Tasks
            </button>
            <button
              className={`${styles.filterPill} ${activePill === "urgent" ? styles.filterPillActive : ""}`}
              onClick={() => setActivePill("urgent")}
            >
              <iconify-icon icon="lucide:zap" style={{ color: "#ef4444" }} /> Urgent Priority
            </button>
            <button
              className={`${styles.filterPill} ${activePill === "kigali" ? styles.filterPillActive : ""}`}
              onClick={() => setActivePill("kigali")}
            >
              <iconify-icon icon="lucide:map-pin" style={{ color: "#0284c7" }} /> Kigali Only
            </button>
            <button
              className={`${styles.filterPill} ${activePill === "remote" ? styles.filterPillActive : ""}`}
              onClick={() => setActivePill("remote")}
            >
              <iconify-icon icon="lucide:globe" style={{ color: "#10b981" }} /> Remote
            </button>
            <button
              className={`${styles.filterPill} ${activePill === "high_budget" ? styles.filterPillActive : ""}`}
              onClick={() => setActivePill("high_budget")}
            >
              <iconify-icon icon="lucide:badge-dollar-sign" style={{ color: "#f59e0b" }} /> High Budget (&gt;50k)
            </button>
          </div>

          {(searchQuery || selectedCategory !== "all" || selectedLocation !== "all" || selectedUrgency !== "all" || activePill !== "all") && (
            <button className={styles.resetBtn} onClick={handleResetFilters}>
              <iconify-icon icon="lucide:rotate-ccw" /> Reset Filters
            </button>
          )}
        </div>
      </section>

      {/* TOOLBAR META */}
      <div className={styles.toolbarMeta}>
        <div className={styles.resultCountWrap}>
          <span className={styles.liveIndicator}></span>
          <p className={styles.resultCount}>
            Showing <strong>{filteredTasks.length}</strong> active {filteredTasks.length === 1 ? "task" : "tasks"}
          </p>
        </div>

        <div className={styles.sortWrap}>
          <span className={styles.sortLabel}>Sort by:</span>
          <div className={styles.sortSelectWrapper}>
            <select className={styles.sortSelect} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="newest">Newest First</option>
              <option value="budget_high">Budget: High to Low</option>
              <option value="budget_low">Budget: Low to High</option>
            </select>
            <iconify-icon icon="lucide:chevron-down" className={styles.sortCaret} />
          </div>
        </div>
      </div>

      {/* TASK GRID / LIST */}
      {loading ? (
        <div className={styles.taskGrid}>
          <SkeletonBlock style={{ height: "240px", borderRadius: "16px" }} />
          <SkeletonBlock style={{ height: "240px", borderRadius: "16px" }} />
          <SkeletonBlock style={{ height: "240px", borderRadius: "16px" }} />
        </div>
      ) : error ? (
        <div className={styles.emptyCard}>
          <div className={styles.emptyIconWrap} style={{ background: "#fef2f2", color: "#dc2626" }}>
            <iconify-icon icon="lucide:alert-circle" />
          </div>
          <h3 className={styles.emptyTitle}>Error loading tasks</h3>
          <p className={styles.emptyText}>{error}</p>
          <button className={styles.emptyResetBtn} onClick={() => refetch()}>
            <iconify-icon icon="lucide:refresh-cw" /> Retry
          </button>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className={styles.emptyCard}>
          <div className={styles.emptyIconWrap}>
            <iconify-icon icon="lucide:search-x" />
          </div>
          <h3 className={styles.emptyTitle}>No matching tasks found</h3>
          <p className={styles.emptyText}>
            Try clearing your search keyword, changing location, or resetting the filters to discover more opportunities.
          </p>
          <button className={styles.emptyResetBtn} onClick={handleResetFilters}>
            <iconify-icon icon="lucide:rotate-ccw" /> Clear All Filters
          </button>
        </div>
      ) : (
        <div className={styles.taskGrid}>
          {filteredTasks.map((task: any) => {
            const clientInitial = task.client_initials || (task.client_name ? task.client_name[0].toUpperCase() : "C");
            const catName = task.category_name || task.category?.name || "General Services";
            const budgetDisplay = task.budget_max
              ? `${Number(task.budget_min || 0).toLocaleString()} - ${Number(task.budget_max).toLocaleString()} XOF`
              : task.budget_min
              ? `${Number(task.budget_min).toLocaleString()} XOF`
              : "Negotiable";

            return (
              <div key={task.id} className={styles.taskCard}>
                <div>
                  {/* CARD HEADER */}
                  <div className={styles.cardHeader}>
                    <div className={styles.clientMeta}>
                      <div className={styles.clientAvatar}>
                        {clientInitial}
                        <span className={styles.avatarVerifiedBadge} title="Verified Client">
                          <iconify-icon icon="lucide:check" />
                        </span>
                      </div>
                      <div className={styles.clientDetails}>
                        <div className={styles.clientNameRow}>
                          <strong className={styles.clientName}>{task.client_name || "Verified Client"}</strong>
                          <iconify-icon icon="lucide:badge-check" style={{ color: "#10b981", fontSize: "14px" }} title="Identity Verified" />
                        </div>
                        <span className={styles.clientLabel}>Posted by Client</span>
                      </div>
                    </div>

                    <div className={styles.badgesGroup}>
                      {task.urgency === "urgent" ? (
                        <span className={`${styles.urgencyBadge} ${styles.urgencyUrgent}`}>
                          <iconify-icon icon="lucide:zap" /> Urgent
                        </span>
                      ) : (
                        <span className={`${styles.urgencyBadge} ${styles.urgencyFlexible}`}>
                          <iconify-icon icon="lucide:sparkles" /> Flexible
                        </span>
                      )}
                    </div>
                  </div>

                  {/* CARD BODY */}
                  <div className={styles.taskBody}>
                    <div className={styles.categoryChip}>
                      <iconify-icon icon="lucide:tag" />
                      <span>{catName}</span>
                    </div>

                    <Link
                      href={`/dashboard/technician/tasks/${task.id}`}
                      style={{ textDecoration: "none" }}
                    >
                      <h3 className={styles.taskTitle}>{task.title}</h3>
                    </Link>

                    {task.description && (
                      <p className={styles.taskExcerpt}>{task.description}</p>
                    )}

                    <div className={styles.metaRow}>
                      <span className={styles.metaItem} title="Location">
                        <iconify-icon icon="lucide:map-pin" style={{ color: "#0284c7" }} />
                        <span>{task.city ? `${task.city}, ${task.location || ""}`.trim() : task.location || "Remote Work"}</span>
                      </span>
                      <span className={styles.metaItem} title="Posted date">
                        <iconify-icon icon="lucide:calendar" style={{ color: "#64748b" }} />
                        <span>{new Date(task.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>
                      </span>
                      <span className={styles.metaItem} title="Active Proposals">
                        <iconify-icon icon="lucide:users-round" style={{ color: "#8b5cf6" }} />
                        <span>{task.bids_count || 0} proposals</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* CARD FOOTER */}
                <div className={styles.cardFooter}>
                  <div className={styles.budgetBox}>
                    <span className={styles.budgetLabel}>
                      {task.budget_mode === "hourly" ? "Hourly Rate" : "Estimated Budget"}
                    </span>
                    <span className={styles.budgetAmount}>
                      <iconify-icon icon="lucide:coins" style={{ color: "#f59e0b", fontSize: "16px" }} />
                      {budgetDisplay}
                    </span>
                  </div>

                  <div className={styles.cardActions}>
                    <Link href={`/dashboard/technician/tasks/${task.id}`} className={styles.detailsBtn}>
                      <span>Details</span>
                      <iconify-icon icon="lucide:arrow-up-right" />
                    </Link>
                    {appliedTaskIds.has(Number(task.id)) ? (
                      <Link href={`/dashboard/technician/bids`} className={styles.appliedBtn}>
                        <iconify-icon icon="lucide:check-circle-2" />
                        <span>Bid Placed</span>
                      </Link>
                    ) : task.status && task.status !== "open" ? (
                      <span className={styles.inProgressPill}>
                        <iconify-icon icon="lucide:lock" />
                        <span style={{ textTransform: "capitalize" }}>{task.status.replace("_", " ")}</span>
                      </span>
                    ) : (
                      <button className={styles.applyBtn} onClick={() => handleApply(task)}>
                        <iconify-icon icon="lucide:send" />
                        <span>Apply Now</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* PROPOSAL APPLICATION MODAL */}
      {selectedTask && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeModalBtn} onClick={closeModal} title="Close">
              <iconify-icon icon="lucide:x" />
            </button>

            <div className={styles.modalHeader}>
              <div className={styles.clientAvatar} style={{ width: 48, height: 48, fontSize: 18 }}>
                {selectedTask.client_initials || "C"}
              </div>
              <div>
                <h2 className={styles.modalTitle}>{selectedTask.title}</h2>
                <p className={styles.modalClient}>
                  <iconify-icon icon="lucide:user" />
                  Client: {selectedTask.client_name || "Verified Client"} &bull; {selectedTask.location || "Remote"}
                </p>
              </div>
            </div>

            <div className={styles.modalBlock}>
              <label>Task Description</label>
              <p>{selectedTask.description || "No specific details provided."}</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div className={styles.modalBlock}>
                <label>Client Budget</label>
                <p style={{ fontWeight: 800, color: "#001f3f" }}>
                  {selectedTask.budget_min || 0} - {selectedTask.budget_max || "N/A"} XOF
                </p>
              </div>
              <div className={styles.modalBlock}>
                <label>Urgency</label>
                <p style={{ textTransform: "capitalize" }}>{selectedTask.urgency || "Flexible"}</p>
              </div>
            </div>

            {isAuth ? (
              <form className={styles.actionBox} onSubmit={submitApplication}>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: "#475569" }}>
                    Your Proposed Price (XOF)
                  </label>
                  <input
                    type="number"
                    className={styles.modalInput}
                    placeholder="Enter amount in XOF"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: "#475569" }}>
                    Cover Message / Proposal Pitch
                  </label>
                  <textarea
                    rows={3}
                    className={styles.modalTextarea}
                    placeholder="Describe your qualifications, equipment, and when you can start..."
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>

                <button type="submit" className={styles.modalSubmitBtn} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <><iconify-icon icon="lucide:loader" style={{ animation: "spin 1s linear infinite" }} /> Submitting Proposal...</>
                  ) : (
                    <><iconify-icon icon="lucide:send" /> Submit Proposal</>
                  )}
                </button>

                {submitError && <p style={{ color: "#dc2626", fontSize: 13, fontWeight: 600, margin: 0 }}>{submitError}</p>}
                {showSuccess && (
                  <p style={{ color: "#16a34a", fontSize: 13, fontWeight: 700, margin: 0 }}>
                    ✔ Proposal submitted successfully!
                  </p>
                )}
              </form>
            ) : (
              <div style={{ textAlign: "center", padding: "20px", background: "#f8fafc", borderRadius: 12 }}>
                <p style={{ color: "#64748b", margin: "0 0 14px" }}>Please log in to submit a proposal on this task.</p>
                <button
                  onClick={() => router.push("/login?redirect=/find-tasks")}
                  className={styles.modalSubmitBtn}
                  style={{ width: "100%" }}
                >
                  Go to Login
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
