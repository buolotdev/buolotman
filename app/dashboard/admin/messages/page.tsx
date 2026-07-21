"use client";

import React, { useState } from "react";
import styles from "./messages.module.css";

const MOCK_CHATS = [
  {
    id: "CHAT-102",
    participants: "John Mukasa & Eric Niyonzima",
    project: "Residential Renovation",
    lastMessage: "I will arrive at 10 AM tomorrow.",
    time: "10:30 AM",
    status: "Active",
    statusClass: styles.statusActive,
  },
  {
    id: "CHAT-103",
    participants: "Mary Uwase & Support",
    project: "Account Verification",
    lastMessage: "Your ID has been rejected due to blurriness.",
    time: "Yesterday",
    status: "Resolved",
    statusClass: styles.statusResolved,
  },
  {
    id: "CHAT-104",
    participants: "Paul Nshimiyimana & Mike Doe",
    project: "Office Plumbing",
    lastMessage: "You ruined my pipes!",
    time: "2 days ago",
    status: "Flagged",
    statusClass: styles.statusFlagged,
  }
];

export default function AdminMessagesPage() {
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
            {MOCK_CHATS.map((chat) => (
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
                <td>{chat.time}</td>
                <td><span className={`${styles.status} ${chat.statusClass}`}>{chat.status}</span></td>
                <td>
                  <button className={styles.actionBtn}>Read Chat</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
