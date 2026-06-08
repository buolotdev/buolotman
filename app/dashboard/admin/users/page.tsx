"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import { useToast } from "@/app/components/Toast";
import { useDialog } from "@/app/components/Dialog";
import { SkeletonBlock, SkeletonTable } from "@/app/components/skeleton/Skeleton";
import styles from "./admin-users.module.css";
import LogoutButton from "@/app/components/LogoutButton";

export default function AdminUsersPage() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const toast = useToast();
  const dialog = useDialog();

  const { data: user, loading: userLoading } = useFetch(() => api.getMe(), []);
  const { data: usersData, loading: usersLoading, error: usersError, refetch: refetchUsers } = useFetch(() => api.adminListUsers(), []);
  const userName = user ? `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.username || "" : "";
  const userInitials = user ? `${(user.first_name || "")[0] || ""}${(user.last_name || "")[0] || ""}`.toUpperCase() : "";
  const userRole = user?.role || "";

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
            <Link key={item.id} href={item.href} className={`${styles.navItem} ${item.id === "users" ? styles.navItemActive : ""}`}>
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
              <input type="text" placeholder="Search by name, email, or ID..." />
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
              <h1>User Management</h1>
              <p>Manage all platform users, roles, and account statuses.</p>
            </div>
            <div className={styles.headerActions}>
              <button className={styles.btnOutline}>
                <iconify-icon icon="lucide:download" /> Export CSV
              </button>
              <button className={styles.btnPrimary}>
                <iconify-icon icon="lucide:plus" /> Add User
              </button>
            </div>
          </div>

          <div className={styles.tableCard}>
            <div className={styles.tableToolbar}>
              <div className={styles.searchBar}>
                <iconify-icon icon="lucide:search" />
                <input type="text" placeholder="Filter by name or email..." />
              </div>
              <div className={styles.toolbarFilters}>
                <div className={styles.filterDropdown}>
                  Role: All <iconify-icon icon="lucide:chevron-down" />
                </div>
                <div className={styles.filterDropdown}>
                  Status: All <iconify-icon icon="lucide:chevron-down" />
                </div>
              </div>
            </div>

            <div className={styles.tableWrapper}>
              {usersLoading ? (
                <SkeletonTable />
              ) : usersError ? (
                <div style={{ padding: 40, textAlign: "center", color: "#dc2626" }}>
                  <p>{usersError}</p>
                </div>
              ) : usersData && usersData.length > 0 ? (
                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Joined</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersData.map((u: any) => (
                      <tr key={u.id}>
                        <td>{`${u.first_name || ""} ${u.last_name || ""}`.trim() || u.username}</td>
                        <td>{u.username}</td>
                        <td>{u.role}</td>
                        <td>{u.is_active ? "Active" : "Suspended"}</td>
                        <td>{u.created_at?.slice(0, 10) || ""}</td>
                        <td style={{ display: "flex", gap: 8 }}>
                          {!u.is_verified ? (
                            <button
                              className={styles.btnOutline}
                              onClick={async () => {
                                try {
                                  await api.adminVerifyUser(u.id);
                                  refetchUsers();
                                  toast.success("User verified", `${u.first_name || u.username} is now verified.`);
                                } catch (err: any) { toast.error("Verify failed", err?.message); }
                              }}
                            >
                              <iconify-icon icon="lucide:badge-check" /> Verify
                            </button>
                          ) : null}
                          <button
                            className={styles.btnOutline}
                            onClick={async () => {
                              const action = u.is_active ? "suspend" : "unsuspend";
                              const ok = await dialog.confirm({
                                title: `${action.charAt(0).toUpperCase() + action.slice(1)} user?`,
                                message: `This will ${action} ${u.first_name || u.username}.`,
                                confirmText: action.charAt(0).toUpperCase() + action.slice(1),
                                variant: u.is_active ? "danger" : "default",
                              });
                              if (!ok) return;
                              try {
                                await api.adminSuspendUser(u.id, action);
                                refetchUsers();
                                toast.success(action === "suspend" ? "User suspended" : "User reactivated", `${u.first_name || u.username}`);
                              } catch (err: any) { toast.error(`${action} failed`, err?.message); }
                            }}
                            style={{ color: u.is_active ? "#dc2626" : "#16a34a" }}
                          >
                            <iconify-icon icon={u.is_active ? "lucide:ban" : "lucide:rotate-ccw"} />
                            {u.is_active ? "Suspend" : "Reactivate"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div style={{ padding: 40, textAlign: "center", color: "#94a3b8", fontSize: 14 }}>
                  <iconify-icon icon="lucide:users" style={{ fontSize: 48, marginBottom: 16, display: "block", opacity: 0.4 }} />
                  <p>No users yet.</p>
                </div>
              )}
            </div>

            <div className={styles.pagination}>
              <div className={styles.paginationInfo}>{usersData?.length || 0} users</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
