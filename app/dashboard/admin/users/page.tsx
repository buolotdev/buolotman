"use client";

import React, { useState, useEffect } from "react";
import styles from "./admin-users.module.css";
import { api } from "@/app/lib/api";

export default function AdminUsersPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, [activeTab]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (activeTab !== "all") {
        params.role = activeTab.toUpperCase();
      }
      const data = await api.adminListUsers(params);
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSuspend = async (user: any) => {
    try {
      const action = user.is_active ? "suspend" : "unsuspend";
      if (!confirm(`Are you sure you want to ${action} ${user.email}?`)) return;

      const res = await api.adminSuspendUser(user.id, action);
      alert(res.message || `User ${action}ed`);
      fetchUsers();
    } catch (err) {
      alert("Action failed. Try again.");
    }
  };

  const totals = {
    total: users.length,
    technicians: users.filter((u) => u.role === "TECHNICIAN").length,
    clients: users.filter((u) => u.role === "CLIENT").length,
    companies: users.filter((u) => u.role === "COMPANY").length,
  };

  return (
    <div className={styles.page}>
      {/* ROYAL BLUE HERO BANNER */}
      <div className={styles.heroBanner}>
        <div className={styles.heroContent}>
          <div className={styles.heroTag}>
            <iconify-icon icon="lucide:users" /> User Governance & Access Control
          </div>
          <h1 className={styles.heroTitle}>User Management & Directory</h1>
          <p className={styles.heroSubtitle}>
            Search, audit, and regulate user accounts, technician profiles, company credentials, and manage platform access statuses.
          </p>
        </div>
        <div className={styles.heroDecoIcon}>
          <iconify-icon icon="lucide:user-check" />
        </div>
      </div>

      {/* 4 STATS OVERVIEW CARDS */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(0, 31, 63, 0.08)", color: "#001f3f" }}>
            <iconify-icon icon="lucide:users" />
          </div>
          <div>
            <div className={styles.statLabel}>Total Users</div>
            <div className={styles.statValue}>{totals.total}</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(255, 69, 0, 0.12)", color: "#ff4500" }}>
            <iconify-icon icon="lucide:wrench" />
          </div>
          <div>
            <div className={styles.statLabel}>Technicians</div>
            <div className={styles.statValue}>{totals.technicians}</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(14, 165, 233, 0.12)", color: "#0284c7" }}>
            <iconify-icon icon="lucide:briefcase" />
          </div>
          <div>
            <div className={styles.statLabel}>Clients</div>
            <div className={styles.statValue}>{totals.clients}</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(34, 197, 94, 0.12)", color: "#16a34a" }}>
            <iconify-icon icon="lucide:building-2" />
          </div>
          <div>
            <div className={styles.statLabel}>Companies</div>
            <div className={styles.statValue}>{totals.companies}</div>
          </div>
        </div>
      </div>

      {/* USERS DIRECTORY CARD */}
      <div className={styles.mainCard}>
        <div className={styles.cardHeaderRow}>
          <h3>
            <iconify-icon icon="lucide:contact-2" style={{ color: "#ff4500" }} /> Verified Accounts Directory
          </h3>

          {/* Filter Pills */}
          <div className={styles.filterPillGroup}>
            {[
              { key: "all", label: "All Users" },
              { key: "client", label: "Clients" },
              { key: "technician", label: "Technicians" },
              { key: "company", label: "Companies" }
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setActiveTab(f.key)}
                className={`${styles.filterPill} ${activeTab === f.key ? styles.filterPillActive : ""}`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.tableWrapper}>
          {loading ? (
            <div style={{ padding: "60px", textAlign: "center", color: "#64748b" }}>
              <iconify-icon icon="lucide:loader-2" style={{ fontSize: 32, animation: "spin 1s linear infinite", color: "#001f3f" }} />
              <p style={{ marginTop: 12, fontWeight: 600 }}>Loading user directory...</p>
            </div>
          ) : users.length === 0 ? (
            <div style={{ padding: "60px", textAlign: "center", color: "#64748b" }}>
              <iconify-icon icon="lucide:user-x" style={{ fontSize: 52, color: "#94a3b8", marginBottom: 12 }} />
              <h4 style={{ margin: "0 0 6px", fontSize: 18, color: "#001f3f", fontWeight: 800 }}>No Users Found</h4>
              <p style={{ margin: 0, fontSize: 13.5 }}>No registered accounts matched this category.</p>
            </div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>User Profile</th>
                  <th>Role</th>
                  <th>Join Date</th>
                  <th>Account Status</th>
                  <th>Governance Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div className={styles.userCell}>
                        <div className={styles.avatar}>
                          {(u.first_name?.[0] || u.email[0]).toUpperCase()}
                        </div>
                        <div className={styles.userInfo}>
                          <h4>{u.first_name} {u.last_name || ""}</h4>
                          <span>{u.email}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <strong style={{ color: "#001f3f", fontSize: 12.5 }}>{u.role}</strong>
                    </td>
                    <td>{new Date(u.created_at).toLocaleDateString()}</td>
                    <td>
                      <span className={`${styles.status} ${u.is_active ? styles.statusActive : styles.statusSuspended}`}>
                        {u.is_active ? "✔ Active" : "⛔ Suspended"}
                      </span>
                    </td>
                    <td>
                      {u.is_active ? (
                        <button className={styles.btnDanger} onClick={() => handleToggleSuspend(u)}>
                          <iconify-icon icon="lucide:ban" /> Suspend
                        </button>
                      ) : (
                        <button className={styles.btnSuccess} onClick={() => handleToggleSuspend(u)}>
                          <iconify-icon icon="lucide:check-circle" /> Unsuspend
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
