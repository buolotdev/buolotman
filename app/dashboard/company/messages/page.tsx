"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo, useEffect, useRef } from "react";
import styles from "./page.module.css";
import LogoutButton from "@/app/components/LogoutButton";
import { useFetch } from "@/app/lib/useFetch";
import { api } from "@/app/lib/api";
import { useToast } from "@/app/components/Toast";
import { SkeletonCard } from "@/app/components/skeleton/Skeleton";
import DashboardHeader from "@/app/components/DashboardHeader";

type Message = {
  id: string;
  sender: number;
  text: string;
  time: string;
  attachment_url?: string;
  attachment_name?: string;
  attachment_type?: string;
};

type Conversation = {
  id: string;
  participant: {
    name: string;
    role: string;
    initials: string;
  };
  lastMessage: string;
  time: string;
  unreadCount: number;
  taskTitle?: string;
};

export default function CompanyMessages() {
  const toast = useToast();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [mobileConversationOpen, setMobileConversationOpen] = useState(false);
  const [threadSearch, setThreadSearch] = useState("");
  const [draft, setDraft] = useState("");
  const [attachmentDraft, setAttachmentDraft] = useState<any>(null);
  const [attachmentUploading, setAttachmentUploading] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeMessages, setActiveMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const attachmentInputRef = useRef<HTMLInputElement>(null);

  const { data: user } = useFetch(() => api.getMe(), []);
  const { data: rawConversations, loading, refetch: refetchConvos } = useFetch(() => api.getConversations(), []);

  const conversations: Conversation[] = useMemo(() => {
    if (!rawConversations || !Array.isArray(rawConversations)) return [];
    return rawConversations.map((c: any) => ({
      id: String(c.id),
      participant: {
        name: c.other_participant?.name || "",
        role: c.other_participant?.role || "",
        initials: c.other_participant?.initials || "?",
      },
      lastMessage: c.last_message?.text || "",
      time: c.last_message_at || c.last_message?.time || "",
      unreadCount: c.unread_count || 0,
      taskTitle: c.task_title || undefined,
    }));
  }, [rawConversations]);

  useEffect(() => {
    if (conversations.length > 0 && !activeId) {
      setActiveId(conversations[0].id);
    }
  }, [conversations, activeId]);

  useEffect(() => {
    if (!activeId) {
      setActiveMessages([]);
      return;
    }
    let cancelled = false;
    let interval: ReturnType<typeof setInterval>;

    const load = () => {
      api.getConversation(Number(activeId))
        .then((data: any) => {
          if (!cancelled) setActiveMessages(data.messages || []);
        })
        .catch(() => {});
    };

    load();
    interval = setInterval(load, 3000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [activeId]);

  useEffect(() => {
    const interval = setInterval(() => refetchConvos(), 5000);
    return () => clearInterval(interval);
  }, [refetchConvos]);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const isNearBottomRef = useRef(true);

  useEffect(() => {
    const el = messagesContainerRef.current;
    if (!el) return;
    const onScroll = () => {
      const threshold = 100;
      isNearBottomRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const el = messagesContainerRef.current;
    if (el && isNearBottomRef.current) {
      el.scrollTop = el.scrollHeight;
    }
  }, [activeMessages]);

  const navItems = [
    { id: "dashboard", label: "Dashboard", href: "/dashboard/company", icon: "lucide:layout-dashboard" },
    { id: "services", label: "Services", href: "/dashboard/company/services", icon: "lucide:layers" },
    { id: "projects", label: "Projects", href: "/dashboard/company/projects", icon: "lucide:briefcase" },
    { id: "messages", label: "Messages", href: "/dashboard/company/messages", icon: "lucide:message-square" },
    { id: "profile", label: "Profile", href: "/dashboard/company/profile", icon: "lucide:user" },
    { id: "settings", label: "Settings", href: "/dashboard/company/settings", icon: "lucide:settings" },
  ];

  const activeConv = conversations.find((c) => c.id === activeId) || conversations[0];

  const filteredConversations = useMemo(() => {
    return conversations.filter((c) =>
      c.participant.name.toLowerCase().includes(threadSearch.toLowerCase()) ||
      c.taskTitle?.toLowerCase().includes(threadSearch.toLowerCase())
    );
  }, [conversations, threadSearch]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = draft.trim();
    if ((!text && !attachmentDraft) || !activeId || sending) return;
    const tempId = `tmp-${Date.now()}`;
    setActiveMessages((prev) => [...prev, { id: tempId, sender: user?.id || 0, text, time: new Date().toISOString() }]);
    setDraft("");
    const attachment = attachmentDraft;
    setAttachmentDraft(null);
    setSending(true);
    isNearBottomRef.current = true;
    requestAnimationFrame(() => {
      const el = messagesContainerRef.current;
      if (el) el.scrollTop = el.scrollHeight;
    });
    try {
      await api.sendMessage(Number(activeId), {
        text,
        attachment_url: attachment?.url || "",
        attachment_key: attachment?.key || "",
        attachment_name: attachment?.name || "",
        attachment_type: attachment?.type || "file",
        attachment_size: attachment?.size || 0,
        attachment_content_type: attachment?.content_type || "",
      });
      refetchConvos();
    } catch (err: any) {
      setActiveMessages((prev) => prev.filter((m) => m.id !== tempId));
      toast.error("Send failed", err?.message || "Please try again.");
    } finally {
      setSending(false);
    }
  };

  const handleAttachmentPick = async (file?: File | null) => {
    if (!file || !activeId || attachmentUploading) return;
    setAttachmentUploading(true);
    try {
      const uploaded = await api.uploadMessageAttachment(Number(activeId), file);
      setAttachmentDraft(uploaded);
    } catch (err: any) {
      toast.error("Upload failed", err?.message || "Please try again.");
    } finally {
      setAttachmentUploading(false);
    }
  };

  const selectConversation = (id: string) => {
    isNearBottomRef.current = true;
    setActiveId(id);
    setMobileConversationOpen(true);
  };

  const formatTime = (timeStr: string) => {
    if (!timeStr) return "";
    try {
      const date = new Date(timeStr);
      if (isNaN(date.getTime())) return timeStr;
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      if (diffDays === 0) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      if (diffDays === 1) return "Yesterday";
      if (diffDays < 7) return date.toLocaleDateString([], { weekday: 'long' });
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch {
      return timeStr;
    }
  };

  return (
    <div className={`${styles.layoutWrapper} ${mobileSidebarOpen ? styles.sidebarOpenMobile : ""}`}>
      <div className={styles.sidebarOverlay} onClick={() => setMobileSidebarOpen(false)} />

      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <Link href="/" className={styles.brand}>
            <Image
              src="/boulotman-logo.png"
              alt="Boulot Man"
              width={180}
              height={46}
              className={styles.brandImage}
              priority
            />
          </Link>
          <button
            className={styles.sidebarCloseBtn}
            onClick={() => setMobileSidebarOpen(false)}
            aria-label="Close Sidebar"
          >
            <iconify-icon icon="lucide:x" />
          </button>
        </div>

        <nav className={styles.navMenu}>
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`${styles.navItem} ${item.id === "messages" ? styles.navItemActive : ""}`}
            >
              <iconify-icon icon={item.icon} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      <div className={styles.mainWrapper}>
        <DashboardHeader
          onMenuClick={() => setMobileSidebarOpen(true)}
        />

        <div className={styles.chatShell}>
          <aside className={`${styles.conversationPanel} ${mobileConversationOpen ? styles.conversationPanelHiddenMobile : ""}`}>
            <div className={styles.panelHeader}>
              <div className={styles.panelTitleRow}>
                <h1 className={styles.panelTitle}>Messages</h1>
                <button className={styles.newMessageBtn}>
                  <iconify-icon icon="lucide:square-pen" />
                </button>
              </div>
              <div className={styles.threadSearch}>
                <iconify-icon icon="lucide:search" />
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={threadSearch}
                  onChange={(e) => setThreadSearch(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.conversationList}>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} style={{ padding: "16px" }}>
                    <SkeletonCard />
                  </div>
                ))
              ) : filteredConversations.length === 0 ? (
                <div style={{ textAlign: "center", padding: "48px 24px", color: "#64748b", animation: "fadeIn 0.5s ease" }}>
                  <div style={{ width: "64px", height: "64px", background: "#f8fafc", borderRadius: "20px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", color: "#ff4500", boxShadow: "0 8px 16px rgba(255,69,0,0.1)" }}>
                    <iconify-icon icon="lucide:message-circle" style={{ fontSize: "32px" }}></iconify-icon>
                  </div>
                  <h3 style={{ margin: "0 0 8px", color: "#001f3f", fontSize: "16px", fontWeight: "700" }}>No conversations</h3>
                  <p style={{ margin: 0, fontSize: "14px" }}>When clients contact you, they will appear here.</p>
                </div>
              ) : (
                filteredConversations.map((conv) => (
                  <button
                    key={conv.id}
                    className={`${styles.conversationItem} ${activeId === conv.id ? styles.conversationItemActive : ""}`}
                    onClick={() => selectConversation(conv.id)}
                  >
                    <div className={styles.avatarWrap}>
                      <div className={styles.avatar}>{conv.participant.initials}</div>
                    </div>
                    <div className={styles.conversationContent}>
                      <div className={styles.conversationMeta}>
                        <strong>{conv.participant.name}</strong>
                        <span>{formatTime(conv.time)}</span>
                      </div>
                      <div className={styles.conversationPreviewRow}>
                        <p className={`${styles.conversationPreview} ${conv.unreadCount > 0 ? styles.conversationPreviewStrong : ""}`}>
                          {conv.lastMessage}
                        </p>
                        {conv.unreadCount > 0 && <span className={styles.unreadPill}>{conv.unreadCount}</span>}
                      </div>
                      {conv.taskTitle && <span className={styles.conversationTask}>{conv.taskTitle}</span>}
                    </div>
                  </button>
                ))
              )}
            </div>
          </aside>

          <section className={`${styles.chatPanel} ${mobileConversationOpen ? styles.chatPanelOpenMobile : ""}`}>
            {activeConv ? (
              <>
                <header className={styles.chatHeader}>
                  <div className={styles.chatUser}>
                    <button
                      className={styles.mobileBackBtn}
                      onClick={() => setMobileConversationOpen(false)}
                    >
                      <iconify-icon icon="lucide:arrow-left" />
                    </button>
                    <div className={styles.avatarWrap} style={{ width: 44, height: 44 }}>
                      <div className={styles.avatar} style={{ width: 44, height: 44 }}>
                        {activeConv.participant.initials}
                      </div>
                    </div>
                    <div className={styles.chatUserDetails}>
                      <strong>{activeConv.participant.name}</strong>
                      <span>{activeConv.participant.role ? activeConv.participant.role.toLowerCase() : "contact"} • {activeConv.taskTitle || "General"}</span>
                    </div>
                  </div>
                  <div className={styles.chatHeaderActions}>
                    <button className={styles.circleIcon}><iconify-icon icon="lucide:phone" /></button>
                    <button className={styles.circleIcon}><iconify-icon icon="lucide:video" /></button>
                    <button className={styles.circleIcon}><iconify-icon icon="lucide:more-vertical" /></button>
                  </div>
                </header>

                <div className={styles.messagesArea} ref={messagesContainerRef}>
                  {loadingMessages ? (
                    <div style={{ textAlign: "center", padding: "48px 0", color: "#64748b" }}>Loading...</div>
                  ) : activeMessages.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "48px 0", color: "#64748b" }}>
                      <p>No messages yet. Start the conversation!</p>
                    </div>
                  ) : (
                    activeMessages.map((m) => (
                      <div
                        key={m.id}
                        className={`${styles.messageGroup} ${m.sender === user?.id ? styles.messageGroupSent : styles.messageGroupReceived}`}
                      >
                        <div className={styles.messageBubble}>{m.text}</div>
                        {m.attachment_url ? (
                          <a href={m.attachment_url} target="_blank" rel="noreferrer" className={styles.attachmentBubble}>
                            <iconify-icon icon="lucide:paperclip" />
                            <span>{m.attachment_name || "Attachment"}</span>
                          </a>
                        ) : null}
                        <div className={styles.messageMeta}>
                          {formatTime(m.time)}
                          {m.sender === user?.id && <iconify-icon icon="lucide:check-check" style={{ fontSize: 14 }} />}
                        </div>
                      </div>
                    ))
                    )}
                  </div>

                <form className={styles.composer} onSubmit={handleSendMessage}>
                  <div className={styles.composerField}>
                    <input
                      type="text"
                      placeholder="Type a message..."
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                    />
                    <input
                      ref={attachmentInputRef}
                      type="file"
                      hidden
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        event.target.value = "";
                        handleAttachmentPick(file);
                      }}
                    />
                    {attachmentDraft ? (
                      <button type="button" className={styles.attachmentChip} onClick={() => setAttachmentDraft(null)}>
                        <iconify-icon icon="lucide:paperclip" />
                        <span>{attachmentDraft.name}</span>
                        <iconify-icon icon="lucide:x" />
                      </button>
                    ) : null}
                    <button
                      type="button"
                      className={styles.composerIconButton}
                      onClick={() => attachmentInputRef.current?.click()}
                      disabled={attachmentUploading}
                    >
                      <iconify-icon icon="lucide:paperclip" />
                    </button>
                  </div>
                  <button
                    type="submit"
                    className={styles.sendBtn}
                    disabled={(!draft.trim() && !attachmentDraft) || sending}
                  >
                    <iconify-icon icon="lucide:send-horizontal" />
                  </button>
                </form>
              </>
            ) : (
              <div className={styles.emptyChat}>
                <div className={styles.emptyIcon}>
                  <iconify-icon icon="lucide:message-square" />
                </div>
                <h2>Your Messages</h2>
                <p>Select a conversation from the list to start messaging.</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
