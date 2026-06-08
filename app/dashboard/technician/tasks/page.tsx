"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import { toArray } from "@/app/lib/dataShape";
import { SkeletonBlock, SkeletonCard, SkeletonStat } from "@/app/components/skeleton/Skeleton";
import styles from "./page.module.css";
import LogoutButton from "@/app/components/LogoutButton";

type TaskFilter = "all" | "urgent" | "residential" | "commercial";
type SortOption = "newest" | "budget" | "match";

type ActivityItem = {
  id: string;
  title: string;
  detail: string;
  time: string;
};

type MarketplaceTask = {
  id: string;
  title: string;
  description: string;
  location: string;
  posted: string;
  schedule: string;
  urgent: boolean;
  type: string;
  tags: string[];
  budgetLabel: string;
  budgetValue: number;
  match: number;
  attachments: number;
  proposals: string[];
};

const navItems = [
  { key: "dashboard", label: "Dashboard", icon: "lucide:layout-dashboard", href: "/dashboard/technician", match: (p: string) => p === "/dashboard/technician" },
  { key: "tasks", label: "Browse Tasks", icon: "lucide:search", href: "/dashboard/technician/tasks", match: (p: string) => p.startsWith("/dashboard/technician/tasks") },
  { key: "bids", label: "My Bids", icon: "lucide:send", href: "/dashboard/technician/bids", match: (p: string) => p.startsWith("/dashboard/technician/bids") },
  { key: "messages", label: "Messages", icon: "lucide:message-square", href: "/dashboard/technician/messages", match: (p: string) => p.startsWith("/dashboard/technician/messages") },
  { key: "wallet", label: "Wallet", icon: "lucide:wallet", href: "/dashboard/technician/wallet", match: (p: string) => p.startsWith("/dashboard/technician/wallet") },
  { key: "profile", label: "Profile", icon: "lucide:user", href: "/dashboard/technician/profile", match: (p: string) => p.startsWith("/dashboard/technician/profile") },
];

export default function TechnicianTasksPage() {
  const { data: tasksData, loading: tasksLoading } = useFetch(() => api.getTasks(), []);
  const { data: walletData } = useFetch(() => api.getWallet(), []);
  const { data: userData } = useFetch(() => api.getMe(), []);

  const router = useRouter();
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<TaskFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [submittedIds, setSubmittedIds] = useState<string[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  const tasks: MarketplaceTask[] = useMemo(() => {
    const raw = toArray(tasksData);
    return raw.map((t: any) => ({
      id: String(t.id),
      title: t.title ?? "",
      description: t.description ?? "",
      location: t.location ?? "",
      posted: t.posted ?? t.created_at ?? "",
      schedule: t.schedule ?? "",
      urgent: t.urgent ?? false,
      type: t.type ?? "residential",
      tags: t.tags ?? t.skills ?? [],
      budgetLabel: t.budget_label ?? `$${t.budget ?? 0}`,
      budgetValue: t.budget ?? t.budget_value ?? 0,
      match: t.match ?? 0,
      attachments: t.attachments ?? 0,
      proposals: t.proposals ?? [],
    }));
  }, [tasksData]);

  const walletAvailable = walletData?.available_balance ?? 0;

  const userName = `${userData?.first_name ?? ""} ${userData?.last_name ?? ""}`.trim() || userData?.username || "";
  const userInitials = useMemo(() => {
    const first = userData?.first_name?.[0] ?? "";
    const last = userData?.last_name?.[0] ?? "";
    return `${first}${last}`.toUpperCase();
  }, [userData]);
  const userRole = userData?.role ?? "";
  const userRating = userData?.rating ? `${userData.rating}` : "";
  const userCompletedJobs = userData?.completed_jobs ?? userData?.completed_tasks ?? "";

  const normalizedQuery = query.trim().toLowerCase();

  const filteredTasks = useMemo(() => {
    let next = tasks.filter((task) => {
      if (activeFilter === "urgent" && !task.urgent) return false;
      if (activeFilter === "residential" && task.type !== "residential") return false;
      if (activeFilter === "commercial" && task.type !== "commercial") return false;

      if (!normalizedQuery) return true;

      return [task.title, task.description, task.location, task.schedule, ...task.tags]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);
    });

    if (sortBy === "budget") next = [...next].sort((a, b) => b.budgetValue - a.budgetValue);
    else if (sortBy === "match") next = [...next].sort((a, b) => b.match - a.match);

    return next;
  }, [tasks, activeFilter, normalizedQuery, sortBy]);

  const activeJobs = tasks.filter((task) => submittedIds.includes(task.id)).length;
  const urgentCount = tasks.filter((task) => task.urgent).length;
  const averageMatch = tasks.length ? Math.round(tasks.reduce((sum, task) => sum + task.match, 0) / tasks.length) : 0;

  const pushActivity = (title: string, detail: string, time: string) => {
    setActivities((current) => [{ id: `${Date.now()}-${Math.random()}`, title, detail, time }, ...current]);
  };

  const toggleSaved = (taskId: string) => {
    const isSaved = savedIds.includes(taskId);
    setSavedIds((current) => (isSaved ? current.filter((id) => id !== taskId) : [...current, taskId]));
    pushActivity(
      isSaved ? "Removed task from saved list" : "Saved task for later",
      tasks.find((task) => task.id === taskId)?.title ?? "Marketplace task",
      "Now"
    );
  };

  const submitBid = (task: MarketplaceTask) => {
    if (submittedIds.includes(task.id)) return;
    setSubmittedIds((current) => [...current, task.id]);
    pushActivity("Bid submitted", `You sent a proposal for ${task.title}.`, "Now");
  };

  const addFunds = () => {
    pushActivity("Wallet topped up", "Added working capital for travel, materials, and marketplace fees.", "Now");
  };

  return (
    <main className={styles.page}>
      <div className={styles.layout}>
        <aside className={`${styles.sidebar} ${mobileNavOpen ? styles.sidebarOpen : ""}`}>
          <div className={styles.sidebarTop}>
            <Link href="/" className={styles.brand} aria-label="Boulot Man home">
              <Image src="/boulotman-logo.png" alt="Boulot Man" width={220} height={56} className={styles.brandImage} priority />
            </Link>
            <button type="button" className={styles.sidebarClose} aria-label="Close navigation" onClick={() => setMobileNavOpen(false)}>
              <iconify-icon icon="lucide:x" />
            </button>
          </div>

          <div className={styles.profileCard}>
            <div className={styles.profileAvatar}>{userInitials}</div>
            <div className={styles.profileMeta}>
              <strong>{userName}</strong>
              <span>{userRole}{userRating ? ` · ${userRating} rating` : ""}{userCompletedJobs ? ` · ${userCompletedJobs} completed jobs` : ""}</span>
            </div>
          </div>

          <nav className={styles.sidebarNav} aria-label="Technician navigation">
            {navItems.map((item) => {
              const isActive = item.match(pathname || "");
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
                  onClick={(e) => {
                    if (pathname === item.href) {
                      e.preventDefault();
                      window.location.reload();
                    }
                  }}
                >
                  <span className={styles.navIcon}><iconify-icon icon={item.icon} /></span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className={styles.sidebarCard}>
            <strong>Bid smarter</strong>
            <p>Use match score, budget, and urgency to prioritize the requests most likely to convert into paid work.</p>
          </div>

          <LogoutButton className={styles.logoutButton} />
        </aside>

        <div className={styles.main}>
          <header className={styles.topbar}>
            <div className={styles.topbarLeft}>
              <button type="button" className={styles.mobileMenuButton} aria-label="Open navigation" onClick={() => setMobileNavOpen(true)}>
                <iconify-icon icon="lucide:menu" />
              </button>
              <label className={styles.searchBox}>
                <iconify-icon icon="lucide:search" />
                <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tasks or keywords" aria-label="Search tasks" />
              </label>
            </div>

            <div className={styles.topbarActions}>
              <button type="button" className={styles.iconButton} aria-label="Notifications">
                <iconify-icon icon="lucide:bell" />
                <span className={styles.notificationDot} />
              </button>
              <div className={styles.topbarProfile}>
                <div className={styles.topbarAvatar}>{userInitials}</div>
                <div className={styles.topbarProfileLines}>
                  <strong>{userName}</strong>
                  <span>{userRole}</span>
                </div>
              </div>
            </div>
          </header>

          <div className={styles.content}>
            <section className={styles.pageHeader}>
              <div>
                <p className={styles.eyebrow}>Marketplace</p>
                <h1>Browse Tasks</h1>
                <p>Review active requests, compare budgets, and send bids from one focused workspace.</p>
              </div>
              <Link href="/dashboard/technician" className={styles.primaryButton}>
                <iconify-icon icon="lucide:layout-dashboard" />
                Back to Dashboard
              </Link>
            </section>

            {tasksLoading ? (
              <section className={styles.statsGrid}>
                <SkeletonStat />
                <SkeletonStat />
                <SkeletonStat />
              </section>
            ) : (
              <section className={styles.statsGrid}>
                <article className={styles.statCard}>
                  <div className={styles.statHeader}>
                    <span>Available tasks</span>
                    <span className={styles.statIcon}><iconify-icon icon="lucide:layers-3" /></span>
                  </div>
                  <strong>{tasks.length}</strong>
                  <p>{urgentCount} urgent requests need fast replies.</p>
                </article>
                <article className={styles.statCard}>
                  <div className={styles.statHeader}>
                    <span>Average match</span>
                    <span className={styles.statIcon}><iconify-icon icon="lucide:target" /></span>
                  </div>
                  <strong>{averageMatch}%</strong>
                  <p>Based on your profile, category fit, and response speed.</p>
                </article>
                <article className={styles.statCard}>
                  <div className={styles.statHeader}>
                    <span>Bids sent</span>
                    <span className={styles.statIcon}><iconify-icon icon="lucide:send" /></span>
                  </div>
                  <strong>{activeJobs}</strong>
                  <p>Fresh proposals submitted from this marketplace view.</p>
                </article>
              </section>
            )}

            <div className={styles.dashboardGrid}>
              <div className={styles.mainColumn}>
                <section className={styles.filtersCard}>
                  <div className={styles.tabs}>
                    <button type="button" className={`${styles.tab} ${activeFilter === "all" ? styles.tabActive : ""}`} onClick={() => setActiveFilter("all")}>All Tasks</button>
                    <button type="button" className={`${styles.tab} ${activeFilter === "urgent" ? styles.tabActive : ""}`} onClick={() => setActiveFilter("urgent")}>Urgent</button>
                    <button type="button" className={`${styles.tab} ${activeFilter === "residential" ? styles.tabActive : ""}`} onClick={() => setActiveFilter("residential")}>Residential</button>
                    <button type="button" className={`${styles.tab} ${activeFilter === "commercial" ? styles.tabActive : ""}`} onClick={() => setActiveFilter("commercial")}>Commercial</button>
                  </div>

                  <label className={styles.sortWrap}>
                    <span>Sort by</span>
                    <select value={sortBy} onChange={(event) => setSortBy(event.target.value as SortOption)} className={styles.sortSelect}>
                      <option value="newest">Newest</option>
                      <option value="budget">Highest Budget</option>
                      <option value="match">Best Match</option>
                    </select>
                  </label>
                </section>

                <section className={styles.taskList}>
                  {tasksLoading ? (
                    Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
                  ) : filteredTasks.length ? (
                    filteredTasks.map((task) => {
                      const isSaved = savedIds.includes(task.id);
                      const isSubmitted = submittedIds.includes(task.id);

                      return (
                        <article key={task.id} className={styles.taskCard}>
                          <div className={styles.taskHeader}>
                            <div className={styles.taskMain}>
                              <div className={styles.titleRow}>
                                <Link href={`/dashboard/technician/tasks/${task.id}`} className={styles.titleLink}>
                                  <h2>{task.title}</h2>
                                </Link>
                                <span className={`${styles.badge} ${task.urgent ? styles.badgeUrgent : styles.badgeOpen}`}>
                                  <iconify-icon icon={task.urgent ? "lucide:zap" : "lucide:circle-dashed"} />
                                  {task.urgent ? "Urgent" : "Open"}
                                </span>
                              </div>
                              <p>{task.description}</p>
                              <div className={styles.tagList}>
                                {task.tags.map((tag) => (
                                  <span key={tag} className={styles.tag}>{tag}</span>
                                ))}
                              </div>
                              <div className={styles.metaRow}>
                                <span><iconify-icon icon="lucide:map-pin" />{task.location}</span>
                                <span><iconify-icon icon="lucide:calendar" />{task.posted}</span>
                                <span><iconify-icon icon="lucide:clock-3" />{task.schedule}</span>
                                <span><iconify-icon icon="lucide:paperclip" />{task.attachments} attachments</span>
                              </div>
                            </div>

                            <div className={styles.priceBlock}>
                              <strong>{task.budgetLabel}</strong>
                              <span>{task.match}% match</span>
                            </div>
                          </div>

                          <div className={styles.taskFooter}>
                            <div className={styles.proposalsInfo}>
                              <div className={styles.proposalAvatars} aria-hidden="true">
                                {task.proposals.map((initials) => (
                                  <span key={initials}>{initials}</span>
                                ))}
                              </div>
                              <small>{task.proposals.length} active bids already in play</small>
                            </div>

                            <div className={styles.actions}>
                              <Link href={`/dashboard/technician/tasks/${task.id}`} className={styles.secondaryButton}>
                                <iconify-icon icon="lucide:arrow-up-right" />
                                View Details
                              </Link>
                              <button type="button" className={styles.secondaryButton} onClick={() => toggleSaved(task.id)}>
                                <iconify-icon icon={isSaved ? "lucide:bookmark-check" : "lucide:bookmark"} />
                                {isSaved ? "Saved" : "Save"}
                              </button>
                              <button type="button" className={`${styles.primarySmallButton} ${isSubmitted ? styles.successButton : ""}`} onClick={() => submitBid(task)}>
                                <iconify-icon icon={isSubmitted ? "lucide:check-circle-2" : "lucide:send-horizontal"} />
                                {isSubmitted ? "Bid Submitted" : "Submit Bid"}
                              </button>
                            </div>
                          </div>
                        </article>
                      );
                    })
                  ) : (
                    <div className={styles.emptyState}>No tasks available yet.</div>
                  )}
                </section>
              </div>

              <aside className={styles.sideColumn}>
                <section className={styles.panelCard}>
                  <div className={styles.panelHeader}>
                    <h3>Wallet Balance</h3>
                    <iconify-icon icon="lucide:wallet" />
                  </div>
                  <strong className={styles.walletValue}>${walletAvailable.toLocaleString()}</strong>
                  <p>Available funds for transport, materials, and fast-turnaround marketplace jobs.</p>
                  <button type="button" className={styles.outlineButton} onClick={addFunds}>
                    <iconify-icon icon="lucide:plus-circle" />
                    Add Funds
                  </button>
                </section>

                <section className={styles.panelCard}>
                  <div className={styles.panelHeader}>
                    <h3>Recent Activity</h3>
                    <span>{activities.length}</span>
                  </div>
                  <div className={styles.timeline}>
                    {activities.length === 0 ? (
                      <p style={{ fontSize: 14, color: "#6b7280" }}>No recent activity.</p>
                    ) : (
                      activities.map((item, index) => (
                        <div key={item.id} className={styles.timelineItem}>
                          <span className={`${styles.timelineIcon} ${index === 0 ? styles.timelineIconActive : ""}`}>
                            <iconify-icon icon={index === 0 ? "lucide:sparkles" : "lucide:file-text"} />
                          </span>
                          <div className={styles.timelineContent}>
                            <strong>{item.title}</strong>
                            <p>{item.detail}</p>
                            <span>{item.time}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </section>

                <section className={`${styles.panelCard} ${styles.helpCard}`}>
                  <h3>Need Help?</h3>
                  <p>Support can review suspicious requests, payment issues, or task scope questions before you bid.</p>
                  <button type="button" className={styles.helpButton}>Contact Support</button>
                </section>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
