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
      setUsers(data);
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

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1>User Management</h1>
        <p>Manage all platform users, roles, and account statuses.</p>
      </div>

      <div className={styles.mainCard}>
        <h3>Users Directory</h3>

        <div className={styles.tabs}>
          <button className={`${styles.tab} ${activeTab === "all" ? styles.active : ""}`} onClick={() => setActiveTab("all")}>All Users</button>
          <button className={`${styles.tab} ${activeTab === "client" ? styles.active : ""}`} onClick={() => setActiveTab("client")}>Clients</button>
          <button className={`${styles.tab} ${activeTab === "technician" ? styles.active : ""}`} onClick={() => setActiveTab("technician")}>Technicians</button>
          <button className={`${styles.tab} ${activeTab === "company" ? styles.active : ""}`} onClick={() => setActiveTab("company")}>Companies</button>
        </div>

        {loading ? (
          <p style={{ padding: "40px", textAlign: "center" }}>Loading users...</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Join Date</th>
                <th>Status</th>
                <th>Action</th>
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
                        <h4>{u.first_name} {u.last_name}</h4>
                        <span>{u.email}</span>
                      </div>
                    </div>
                  </td>
                  <td>{u.role}</td>
                  <td>{new Date(u.created_at).toLocaleDateString()}</td>
                  <td>
                    <span className={`${styles.status} ${u.is_active ? styles.statusActive : styles.statusSuspended}`}>
                      {u.is_active ? "Active" : "Suspended"}
                    </span>
                  </td>
                  <td>
                    <div className={styles.tableActions}>
                      <button className={styles.btnDanger} onClick={() => handleToggleSuspend(u)}>
                        {u.is_active ? "Suspend" : "Unsuspend"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "40px" }}>No users found in this category.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
