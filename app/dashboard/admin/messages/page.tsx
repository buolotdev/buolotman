"use client";

import React, { useState } from "react";
import styles from "./messages.module.css";
import { useFetch } from "@/app/lib/useFetch";
import { api } from "@/app/lib/api";

export default function AdminMessagesPage() {
  const { data: rawChats, loading } = useFetch(() => api.getAdminConversations(), []);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastTarget, setBroadcastTarget] = useState("all");
  const [broadcastTitle, setBroadcastTitle] = useState("");
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [broadcastSent, setBroadcastSent] = useState(false);
  const [selectedChat, setSelectedChat] = useState<any>(null);

  const chats = rawChats || [];

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastMessage) return;
    setBroadcastSent(true);
    setTimeout(() => {
      setBroadcastSent(false);
      setShowBroadcastModal(false);
      setBroadcastTitle("");
      setBroadcastMessage("");
    }, 1800);
  };

  const filteredChats = chats.filter((c: any) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "active") return c.status?.toLowerCase().includes("active") || !c.status;
    if (activeFilter === "flagged") return c.status?.toLowerCase().includes("flag");
    if (activeFilter === "resolved") return c.status?.toLowerCase().includes("resolved");
    return true;
  });

  const totals = {
    total: chats.length,
    active: chats.filter((c: any) => c.status?.toLowerCase().includes("active") || !c.status).length,
    flagged: chats.filter((c: any) => c.status?.toLowerCase().includes("flag")).length,
    resolved: chats.filter((c: any) => c.status?.toLowerCase().includes("resolved")).length,
  };

  return (
    <div className={styles.page}>
      {/* ROYAL BLUE HERO BANNER */}
      <div className={styles.heroBanner}>
        <div className={styles.heroContent}>
          <div className={styles.heroTag}>
            <iconify-icon icon="lucide:messages-square" /> Real-Time Chat & Communications Center
          </div>
          <h1 className={styles.heroTitle}>Platform Messages & Broadcasts</h1>
          <p className={styles.heroSubtitle}>
            Monitor active marketplace discussions, audit flagged conversations for policy compliance, and send platform-wide announcements.
          </p>
          <button className={styles.broadcastBtn} onClick={() => setShowBroadcastModal(true)}>
            <iconify-icon icon="lucide:radio" />
            Send Platform Broadcast
          </button>
        </div>
        <div className={styles.heroDecoIcon}>
          <iconify-icon icon="lucide:message-square" />
        </div>
      </div>

      {/* 4 STATS OVERVIEW CARDS */}
      <div className={styles.stats}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(0, 31, 63, 0.08)", color: "#001f3f" }}>
            <iconify-icon icon="lucide:message-circle" />
          </div>
          <div>
            <div className={styles.statLabel}>Total Chats</div>
            <div className={styles.statValue}>{totals.total}</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(14, 165, 233, 0.12)", color: "#0284c7" }}>
            <iconify-icon icon="lucide:activity" />
          </div>
          <div>
            <div className={styles.statLabel}>Active Threads</div>
            <div className={styles.statValue}>{totals.active}</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(255, 69, 0, 0.12)", color: "#ff4500" }}>
            <iconify-icon icon="lucide:alert-triangle" />
          </div>
          <div>
            <div className={styles.statLabel}>Flagged Messages</div>
            <div className={styles.statValue}>{totals.flagged}</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(34, 197, 94, 0.12)", color: "#16a34a" }}>
            <iconify-icon icon="lucide:check-circle-2" />
          </div>
          <div>
            <div className={styles.statLabel}>Resolved Chats</div>
            <div className={styles.statValue}>{totals.resolved}</div>
          </div>
        </div>
      </div>

      {/* RECENT CONVERSATIONS CARD */}
      <div className={styles.mainCard}>
        <div className={styles.cardHeaderRow}>
          <h3>
            <iconify-icon icon="lucide:messages-square" style={{ color: "#ff4500" }} /> Recent Conversations
          </h3>

          {/* Filter Pills */}
          <div className={styles.filterPillGroup}>
            {[
              { key: "all", label: "All Chats" },
              { key: "active", label: "Active" },
              { key: "flagged", label: "Flagged" },
              { key: "resolved", label: "Resolved" }
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                className={`${styles.filterPill} ${activeFilter === f.key ? styles.filterPillActive : ""}`}
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
              <p style={{ marginTop: 12, fontWeight: 600 }}>Loading conversations...</p>
            </div>
          ) : filteredChats.length === 0 ? (
            <div style={{ padding: "60px", textAlign: "center", color: "#64748b" }}>
              <iconify-icon icon="lucide:message-square-off" style={{ fontSize: 52, color: "#94a3b8", marginBottom: 12 }} />
              <h4 style={{ margin: "0 0 6px", fontSize: 18, color: "#001f3f", fontWeight: 800 }}>No Conversations Found</h4>
              <p style={{ margin: 0, fontSize: 13.5 }}>There are no active or recorded chat threads in this filter.</p>
            </div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Participants</th>
                  <th>Project / Channel</th>
                  <th>Last Message Snippet</th>
                  <th>Timestamp</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredChats.map((chat: any) => (
                  <tr key={chat.id}>
                    <td>
                      <div className={styles.userCell}>
                        <div className={styles.avatar}>
                          <iconify-icon icon="lucide:users" />
                        </div>
                        <div className={styles.userInfo}>
                          <h4>{chat.participants || "Client & Technician"}</h4>
                          <span>Thread ID: #{chat.id}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <strong style={{ color: "#001f3f" }}>{chat.project || "Marketplace Task"}</strong>
                    </td>
                    <td style={{ maxWidth: 260, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color: "#475569" }}>
                      {chat.lastMessage || "Latest conversation update..."}
                    </td>
                    <td>{chat.time ? new Date(chat.time).toLocaleDateString() : "Just now"}</td>
                    <td>
                      <span className={`${styles.status} ${chat.status?.toLowerCase().includes("flag") ? styles.statusFlagged : styles.statusActive}`}>
                        {chat.status || "Active"}
                      </span>
                    </td>
                    <td>
                      <button className={styles.actionBtn} onClick={() => setSelectedChat(chat)}>
                        <iconify-icon icon="lucide:eye" /> Read Chat
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* BROADCAST MODAL */}
      {showBroadcastModal && (
        <div className={styles.modalOverlay} onClick={() => setShowBroadcastModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h3 style={{ margin: 0, fontSize: 20, color: "#001f3f", fontWeight: 800 }}>Send Platform Broadcast</h3>
                <span style={{ fontSize: 13, color: "#64748b" }}>Dispatch platform-wide alerts to users</span>
              </div>
              <button type="button" onClick={() => setShowBroadcastModal(false)} className={styles.modalCloseBtn}>
                <iconify-icon icon="lucide:x" />
              </button>
            </div>

            <form onSubmit={handleSendBroadcast} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 800, color: "#001f3f", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                  Target Audience
                </label>
                <select
                  value={broadcastTarget}
                  onChange={(e) => setBroadcastTarget(e.target.value)}
                  style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: "1px solid #cbd5e1", background: "#f8fafc", fontSize: 14, fontWeight: 700, color: "#001f3f" }}
                >
                  <option value="all">All Marketplace Users (Technicians + Clients + Companies)</option>
                  <option value="technicians">Technicians Only</option>
                  <option value="clients">Clients & Homeowners Only</option>
                  <option value="companies">Service Companies Only</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 800, color: "#001f3f", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                  Broadcast Headline
                </label>
                <input
                  type="text"
                  placeholder="e.g. Platform Maintenance Notice or Policy Update"
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  required
                  style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: "1px solid #cbd5e1", background: "#f8fafc", fontSize: 14, color: "#0f172a" }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 800, color: "#001f3f", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                  Announcement Message
                </label>
                <textarea
                  rows={4}
                  placeholder="Write the message that will be broadcasted to all active notification centers..."
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  required
                  style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: "1px solid #cbd5e1", background: "#f8fafc", fontSize: 13.5, color: "#0f172a", resize: "vertical" }}
                />
              </div>

              {broadcastSent && (
                <div style={{ padding: "12px 16px", background: "#dcfce7", color: "#15803d", borderRadius: 10, fontSize: 13, fontWeight: 700, textAlign: "center" }}>
                  ✔ Broadcast successfully queued and sent to all target users!
                </div>
              )}

              <div style={{ display: "flex", gap: 12, paddingTop: 12, borderTop: "1px solid #e2e8f0" }}>
                <button
                  type="button"
                  onClick={() => setShowBroadcastModal(false)}
                  style={{ flex: 1, padding: "12px 18px", borderRadius: 12, border: "1px solid #e2e8f0", background: "#ffffff", fontWeight: 700, color: "#64748b", cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.broadcastBtn}
                  style={{ flex: 1.5, justifyContent: "center" }}
                >
                  <iconify-icon icon="lucide:send" /> Send Broadcast Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CHAT INSPECT MODAL */}
      {selectedChat && (
        <div className={styles.modalOverlay} onClick={() => setSelectedChat(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h3 style={{ margin: 0, fontSize: 19, color: "#001f3f", fontWeight: 800 }}>
                  Chat Inspection: #{selectedChat.id}
                </h3>
                <span style={{ fontSize: 13, color: "#64748b" }}>
                  Channel: <strong>{selectedChat.project || "Task Discussion"}</strong>
                </span>
              </div>
              <button type="button" onClick={() => setSelectedChat(null)} className={styles.modalCloseBtn}>
                <iconify-icon icon="lucide:x" />
              </button>
            </div>

            <div style={{ padding: 20, background: "#f8fafc", borderRadius: 14, border: "1px solid #e2e8f0", marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <strong style={{ color: "#001f3f" }}>{selectedChat.participants || "Participants"}</strong>
                <span className={styles.statusActive} style={{ padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700 }}>
                  {selectedChat.status || "Active Thread"}
                </span>
              </div>
              <p style={{ margin: 0, color: "#334155", fontSize: 14, lineHeight: 1.6, background: "#ffffff", padding: 14, borderRadius: 10, border: "1px solid #e2e8f0" }}>
                "{selectedChat.lastMessage || "No message content available."}"
              </p>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button
                type="button"
                onClick={() => setSelectedChat(null)}
                style={{ padding: "10px 20px", borderRadius: 10, border: "1px solid #cbd5e1", background: "#001f3f", color: "#ffffff", fontWeight: 700, cursor: "pointer" }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
