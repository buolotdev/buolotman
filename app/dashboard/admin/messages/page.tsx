"use client";

import React, { useState } from "react";
import styles from "./messages.module.css";

import { useFetch } from "@/app/lib/useFetch";
import { api } from "@/app/lib/api";

export default function AdminMessagesPage() {
  const { data: chats, loading } = useFetch(() => api.getAdminConversations(), []);

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1>Platform Messages</h1>
          <p>Monitor active chats, flagged conversations, and send platform-wide broadcasts.</p>
        </div>
        <button className={styles.broadcastBtn}>
          <iconify-icon icon="lucide:radio" />
          Send Broadcast
        </button>
      </div>

      <div className={styles.card}>
        <h3>Recent Conversations</h3>
        {loading ? (
          <p style={{ padding: 20 }}>Loading messages...</p>
        ) : chats && chats.length > 0 ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Participants</th>
                <th>Project / Topic</th>
                <th>Last Message</th>
                <th>Time</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {chats.map((chat: any) => (
                <tr key={chat.id}>
                  <td>
                    <div className={styles.userCell}>
                      <div className={styles.avatar}>
                        <iconify-icon icon="lucide:users" />
                      </div>
                      <div className={styles.userInfo}>
                        <h4>{chat.participants}</h4>
                        <span>{chat.id}</span>
                      </div>
                    </div>
                  </td>
                  <td>{chat.project}</td>
                  <td style={{ maxWidth: 250, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {chat.lastMessage}
                  </td>
                  <td>{new Date(chat.time).toLocaleDateString()}</td>
                  <td><span className={`${styles.status} ${styles[chat.statusClass] || styles.statusActive}`}>{chat.status}</span></td>
                  <td>
                    <button className={styles.actionBtn}>Read Chat</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ padding: 20 }}>No conversations found.</p>
        )}
      </div>
    </div>
  );
}
