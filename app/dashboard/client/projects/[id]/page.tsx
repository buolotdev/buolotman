"use client";

import React, { useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./page.module.css";
import ClientSidebar from "@/app/components/ClientSidebar";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";

const navItems = [
  { key: "dashboard", label: "Dashboard", icon: "lucide:layout-dashboard", href: "/dashboard/client", match: (p: string) => p === "/dashboard/client" },
  { key: "tasks", label: "My Tasks", icon: "lucide:clipboard-list", href: "/dashboard/client/tasks", match: (p: string) => p.startsWith("/dashboard/client/tasks") },
  { key: "projects", label: "My Projects", icon: "lucide:briefcase", href: "/dashboard/client/projects", match: (p: string) => p.startsWith("/dashboard/client/projects") },
  { key: "messages", label: "Messages", icon: "lucide:message-square", href: "/dashboard/client/messages", match: (p: string) => p.startsWith("/dashboard/client/messages") },
  { key: "payments", label: "Payments", icon: "lucide:credit-card", href: "/dashboard/client/payments", match: (p: string) => p.startsWith("/dashboard/client/payments") },
  { key: "saved", label: "Saved", icon: "lucide:bookmark", href: "/dashboard/client/saved", match: (p: string) => p.startsWith("/dashboard/client/saved") },
  { key: "support", label: "Support Tickets", icon: "lucide:life-buoy", href: "/dashboard/client/support", match: (p: string) => p.startsWith("/dashboard/client/support") },
  { key: "settings", label: "Settings", icon: "lucide:settings", href: "/dashboard/client/settings", match: (p: string) => p.startsWith("/dashboard/client/settings") },
];

export default function ProjectWorkspace({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [notifyOpen, setNotifyOpen] = useState(false);
  const [notifications, setNotifications] = useState<{id: string; title: string; text: string}[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<{name: string, type: string}[]>([]);
  
  const { data: task, loading: taskLoading } = useFetch(
    () => api.getTask(parseInt(id)), 
    [id]
  );
  
  // Modal State
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmSuccess, setConfirmSuccess] = useState(false);
  
  const [chatDraft, setChatDraft] = useState("");
  const [messages, setMessages] = useState<{id: number, sender: string, text: string}[]>([
    { id: 1, sender: "Kigali Prime Constructors", text: "We have finished the planning phase." }
  ]);

  const totalCost = task?.budget ? parseInt(task.budget) : 40000;
  const released = confirmSuccess ? 20000 : 12000;
  const milestone2Status = confirmSuccess ? "Released" : "Pending";
  const milestone3Status: string = "On Hold";


  const handleConfirmRelease = () => {
    setConfirmSuccess(true);
    setTimeout(() => {
      setConfirmModalOpen(false);
      setConfirmSuccess(false);
    }, 2000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatDraft.trim()) return;
    setMessages([...messages, { id: Date.now(), sender: "You", text: chatDraft.trim() }]);
    setChatDraft("");
    
    setNotifications((prev) => [
      { id: String(Date.now()), title: "New Message", text: "A new project message was sent" },
      ...prev
    ]);
  };

  return (
    <main className={styles.page}>
      <div className={styles.layout}>
        <ClientSidebar isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

        <div className={styles.main}>
          <header className={styles.header}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <button className={styles.mobileMenuButton} onClick={() => setMobileNavOpen(true)}>
                <iconify-icon icon="lucide:menu" />
              </button>
              <h1 className={styles.headerTitle}>Project Workspace</h1>
            </div>

            <div className={styles.headerRight}>
              <div className={styles.notifyContainer}>
                <button className={styles.notifyBtn} onClick={() => setNotifyOpen(!notifyOpen)}>
                  <iconify-icon icon="lucide:bell" />
                  {notifications.length > 0 && <span className={styles.notifyBadge}>{notifications.length}</span>}
                </button>

                {notifyOpen && (
                  <div className={styles.notifyPanel}>
                    {notifications.map(n => (
                      <div key={n.id} className={styles.notifyItem}>
                        <strong>{n.title}</strong>
                        <span>{n.text}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <span style={{ color: "#64748b", fontSize: 14, fontWeight: 600 }}>Residential Renovation</span>
            </div>
          </header>

          <div className={styles.content}>
            <div className={styles.projectHeader}>
              <h2>Residential Renovation – Kigali</h2>
              <div className={styles.meta}>
                <div><strong>Client:</strong> John Mukasa</div>
                <div><strong>Executor:</strong> Kigali Prime Constructors</div>
                <div><strong>Total Cost:</strong> ${totalCost.toLocaleString()}</div>
                <div><strong>Released:</strong> ${released.toLocaleString()}</div>
                <div><strong>Balance:</strong> ${(totalCost - released).toLocaleString()}</div>
              </div>
            </div>

            <div className={styles.card}>
              <h3>Milestones & Escrow</h3>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Milestone</th>
                    <th>Percentage</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Planning</td>
                    <td>30%</td>
                    <td>$12,000</td>
                    <td><span className={`${styles.status} ${styles.completed}`}>Released</span></td>
                    <td>-</td>
                  </tr>
                  <tr>
                    <td>Execution</td>
                    <td>20%</td>
                    <td>$8,000</td>
                    <td>
                      <span className={`${styles.status} ${milestone2Status === 'Released' ? styles.completed : styles.pending}`}>
                        {milestone2Status}
                      </span>
                    </td>
                    <td>
                      {milestone2Status !== 'Released' ? (
                        <button className={styles.primaryButton} onClick={() => setConfirmModalOpen(true)}>Confirm</button>
                      ) : "-"}
                    </td>
                  </tr>
                  <tr>
                    <td>Completion</td>
                    <td>50%</td>
                    <td>$20,000</td>
                    <td>
                      <span className={`${styles.status} ${milestone3Status === 'Pending' ? styles.hold : styles.pending}`}>
                        {milestone3Status}
                      </span>
                    </td>
                    <td>-</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className={styles.card}>
              <h3>Activity Log</h3>
              <div className={styles.log}>
                <iconify-icon icon="lucide:check-circle-2" className={styles.logIcon} style={{color: '#16a34a'}} />
                Project created successfully
              </div>
            </div>

            <div className={styles.card}>
              <h3>Project Files</h3>
              <div className={styles.files}>
                <a href="#" className={styles.fileItem}>
                  <iconify-icon icon="lucide:file-text" /> Floor_plan_v2.pdf
                </a>
                <a href="#" className={styles.fileItem}>
                  <iconify-icon icon="lucide:image" /> Progress_Photo_01.jpg
                </a>
                {uploadedFiles.map((file, i) => (
                  <a key={i} href="#" className={styles.fileItem}>
                    <iconify-icon icon={file.type.startsWith('image') ? "lucide:image" : "lucide:file-text"} /> {file.name}
                  </a>
                ))}
              </div>
              <input 
                type="file" 
                className={styles.fileInput}
                onChange={(e) => {
                  if(e.target.files?.length) {
                    const newFiles = Array.from(e.target.files).map(f => ({ name: f.name, type: f.type }));
                    setUploadedFiles(prev => [...prev, ...newFiles]);
                    setNotifications((prev) => [{ id: String(Date.now()), title: "File Uploaded", text: `${newFiles.length} file(s) added` }, ...prev]);
                    e.target.value = '';
                  }
                }}
              />
            </div>

            <div className={styles.card}>
              <h3>Project Messages</h3>
              <div className={styles.chat}>
                {messages.map((m, i) => (
                  <div key={m.id || i} className={styles.msg} style={{ alignSelf: m.sender === 'You' ? 'flex-end' : 'flex-start', background: m.sender === 'You' ? '#001f3f' : '#f1f5f9', color: m.sender === 'You' ? '#fff' : '#0f172a' }}>
                    <strong style={{ color: m.sender === 'You' ? '#94a3b8' : '#ff4500' }}>{m.sender}:</strong>
                    {m.text}
                  </div>
                ))}
              </div>
              <form className={styles.chatInputWrap} onSubmit={handleSendMessage}>
                <input 
                  type="text" 
                  className={styles.chatInput} 
                  placeholder="Type a message..." 
                  value={chatDraft}
                  onChange={(e) => setChatDraft(e.target.value)}
                />
                <button type="submit" className={styles.primaryButton} disabled={!chatDraft.trim()}>Send</button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {confirmModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <button className={styles.modalClose} onClick={() => setConfirmModalOpen(false)}>
              <iconify-icon icon="lucide:x" />
            </button>
            <h3>Confirm Milestone Release</h3>
            <p>This will release <strong>$8,000 (20%)</strong> from escrow to the executor.</p>
            
            {!confirmSuccess ? (
              <button className={styles.primaryButton} onClick={handleConfirmRelease}>Confirm & Release</button>
            ) : (
              <div className={styles.successText}>
                <iconify-icon icon="lucide:check-circle-2" style={{ fontSize: 20 }} />
                Milestone released successfully!
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
