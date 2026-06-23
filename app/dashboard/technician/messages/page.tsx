"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import { useToast } from "@/app/components/Toast";
import { SkeletonBlock, SkeletonCard } from "@/app/components/skeleton/Skeleton";
import styles from "./page.module.css";
import LogoutButton from "@/app/components/LogoutButton";

const navItems = [
  { key: "dashboard", label: "Dashboard", icon: "lucide:layout-dashboard", href: "/dashboard/technician", match: (p: string) => p === "/dashboard/technician" },
  { key: "tasks", label: "Browse Tasks", icon: "lucide:search", href: "/dashboard/technician/tasks", match: (p: string) => p.startsWith("/dashboard/technician/tasks") },
  { key: "messages", label: "Messages", icon: "lucide:message-square", href: "/dashboard/technician/messages", match: (p: string) => p.startsWith("/dashboard/technician/messages") },
  { key: "wallet", label: "Wallet", icon: "lucide:wallet", href: "/dashboard/technician/wallet", match: (p: string) => p.startsWith("/dashboard/technician/wallet") },
  { key: "profile", label: "Profile", icon: "lucide:user", href: "/dashboard/technician/profile", match: (p: string) => p.startsWith("/dashboard/technician/profile") },
];

function formatTime(iso: string | null | undefined): string {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    const now = new Date();
    const diff = (now.getTime() - d.getTime()) / 1000;
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return d.toLocaleDateString();
  } catch {
    return "";
  }
}

function formatMessageTime(iso: string | null | undefined): string {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

export default function TechnicianMessagesPage() {
  const toast = useToast();
  const searchParams = useSearchParams();
  const { data: conversationsData, loading: conversationsLoading, error: conversationsError, refetch: refetchConvos } = useFetch(() => api.getConversations(), []);
  const { data: userData } = useFetch(() => api.getMe(), []);

  const [threadSearch, setThreadSearch] = useState("");
  const [draft, setDraft] = useState("");
  const [attachmentDraft, setAttachmentDraft] = useState<any>(null);
  const [attachmentUploading, setAttachmentUploading] = useState(false);
  const [mobileListOpen, setMobileListOpen] = useState(true);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(searchParams.get("c"));
  const [activeMessages, setActiveMessages] = useState<any[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const attachmentInputRef = useRef<HTMLInputElement>(null);

  type ConversationItem = {
    id: string;
    participant: { name: string; initials: string; role: string };
    taskTitle: string;
    lastMessagePreview: string;
    lastMessageAt: string | null;
    unreadCount: number;
  };

  const conversations: ConversationItem[] = useMemo(() => {
    const raw = Array.isArray(conversationsData) ? conversationsData : (conversationsData as any)?.results || [];
    return raw.map((c: any) => ({
      id: String(c.id),
      participant: {
        name: c.other_participant?.name || "",
        initials: c.other_participant?.initials || "?",
        role: c.other_participant?.role || "",
      },
      taskTitle: c.task_title || "",
      lastMessagePreview: c.last_message?.text || "",
      lastMessageAt: c.last_message_at || c.last_message?.time || null,
      unreadCount: c.unread_count || 0,
    }));
  }, [conversationsData]);

  useEffect(() => {
    if (!activeConversationId && conversations.length) {
      setActiveConversationId(conversations[0].id);
    }
  }, [conversations, activeConversationId]);

  useEffect(() => {
    const interval = setInterval(() => refetchConvos(), 5000);
    return () => clearInterval(interval);
  }, [refetchConvos]);

  useEffect(() => {
    if (!activeConversationId) {
      setActiveMessages([]);
      return;
    }
    let cancelled = false;
    let interval: ReturnType<typeof setInterval>;

    const load = () => {
      api.getConversation(Number(activeConversationId))
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
  }, [activeConversationId]);

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

  const filteredConversations = useMemo(() => {
    const normalized = threadSearch.trim().toLowerCase();
    if (!normalized) return conversations;
    return conversations.filter((conversation) =>
      [conversation.participant.name, conversation.taskTitle, conversation.lastMessagePreview]
        .join(" ")
        .toLowerCase()
        .includes(normalized)
    );
  }, [conversations, threadSearch]);

  const activeConversation = useMemo(() => {
    return conversations.find((c) => c.id === activeConversationId) ?? conversations[0] ?? null;
  }, [conversations, activeConversationId]);

  const userInitials = useMemo(() => {
    const first = userData?.first_name?.[0] ?? "";
    const last = userData?.last_name?.[0] ?? "";
    return `${first}${last}`.toUpperCase() || "TM";
  }, [userData]);

  const selectConversation = (conversationId: string) => {
    isNearBottomRef.current = true;
    setActiveConversationId(conversationId);
    setMobileListOpen(false);
  };

  const sendMessage = async () => {
    const text = draft.trim();
    if ((!text && !attachmentDraft) || !activeConversation || sending) return;

    const tempId = `tmp-${Date.now()}`;
    const optimistic = {
      id: tempId,
      sender: userData?.id,
      sender_name: userData ? `${userData.first_name} ${userData.last_name}`.trim() : "",
      text,
      attachment_url: attachmentDraft?.url || "",
      attachment_name: attachmentDraft?.name || "",
      attachment_type: attachmentDraft?.type || "file",
      created_at: new Date().toISOString(),
      read_at: null,
    };
    setActiveMessages((prev) => [...prev, optimistic]);
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
      const real = await api.sendMessage(Number(activeConversation.id), {
        text,
        attachment_url: attachment?.url || "",
        attachment_key: attachment?.key || "",
        attachment_name: attachment?.name || "",
        attachment_type: attachment?.type || "file",
        attachment_size: attachment?.size || 0,
        attachment_content_type: attachment?.content_type || "",
      });
      setActiveMessages((prev) => prev.map((m) => (m.id === tempId ? real : m)));
      refetchConvos();
    } catch (err: any) {
      setActiveMessages((prev) => prev.filter((m) => m.id !== tempId));
      toast.error("Send failed", err?.message || "Please try again.");
    } finally {
      setSending(false);
    }
  };

  const handleAttachmentPick = async (file?: File | null) => {
    if (!file || !activeConversation || attachmentUploading) return;
    setAttachmentUploading(true);
    try {
      const uploaded = await api.uploadMessageAttachment(Number(activeConversation.id), file);
      setAttachmentDraft(uploaded);
    } catch (err: any) {
      toast.error("Upload failed", err?.message || "Please try again.");
    } finally {
      setAttachmentUploading(false);
    }
  };

  return (
    <main className={styles.page}>
      <header className={styles.topbar}>
        <Link href="/" className={styles.brand} aria-label="Boulot Man home">
          <Image src="/boulotman-logo.png" alt="Boulot Man" width={220} height={56} className={styles.brandImage} priority />
        </Link>

        <div className={styles.topActions}>
          <Link href="/dashboard/technician" className={styles.dashboardLink}>
            <iconify-icon icon="lucide:layout-dashboard" />
            <span>Dashboard</span>
          </Link>
          <LogoutButton className={styles.logoutButton} />
          <Link href="/dashboard/technician/profile" className={styles.profilePill}>
            <span className={styles.profileAvatar}>{userInitials}</span>
          </Link>
        </div>
      </header>

      <div className={styles.main}>
        <aside className={`${styles.sidebar} ${!mobileListOpen ? styles.sidebarHiddenMobile : ""}`}>
          <div className={styles.sidebarHead}>
            <h1>Messages</h1>
            <label className={styles.searchBox}>
              <iconify-icon icon="lucide:search" />
              <input
                type="search"
                value={threadSearch}
                onChange={(event) => setThreadSearch(event.target.value)}
                placeholder="Search messages..."
                aria-label="Search messages"
              />
            </label>
          </div>

          <div className={styles.conversationList}>
            {conversationsError ? (
              <div className={styles.emptyState}>
                <iconify-icon icon="lucide:alert-circle" style={{ fontSize: 32, opacity: 0.6, color: "#ef4444" }} />
                <p>Failed to load conversations</p>
                <span style={{ fontSize: 13, color: "#94a3b8" }}>{conversationsError}</span>
                <button type="button" onClick={() => refetchConvos()} style={{ marginTop: 12, padding: "8px 16px", background: "#0f172a", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>Retry</button>
              </div>
            ) : conversationsLoading ? (
              Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            ) : filteredConversations.length ? (
              filteredConversations.map((conversation) => {
                const isActive = activeConversation?.id === conversation.id;
                return (
                  <button
                    key={conversation.id}
                    type="button"
                    className={`${styles.conversationItem} ${isActive ? styles.conversationItemActive : ""}`}
                    onClick={() => selectConversation(conversation.id)}
                  >
                    <div className={styles.conversationAvatarWrap}>
                      <span className={styles.conversationAvatar}>{conversation.participant.initials}</span>
                    </div>
                    <div className={styles.conversationBody}>
                      <div className={styles.conversationTop}>
                        <strong>{conversation.participant.name}</strong>
                        <span>{formatTime(conversation.lastMessageAt)}</span>
                      </div>
                      <div className={styles.conversationBottom}>
                        <p>{conversation.lastMessagePreview || "No messages yet."}</p>
                        {conversation.unreadCount ? <span className={styles.unreadPill}>{conversation.unreadCount}</span> : null}
                      </div>
                      {conversation.taskTitle ? <span className={styles.conversationTask}>{conversation.taskTitle}</span> : null}
                    </div>
                  </button>
                );
              })
            ) : (
              <div className={styles.emptyState}>
                <iconify-icon icon="lucide:message-square" style={{ fontSize: 32, opacity: 0.4 }} />
                <p>No conversations yet.</p>
                <span style={{ fontSize: 13, color: "#94a3b8" }}>Click "Message Client" on a task you bid on to start chatting.</span>
              </div>
            )}
          </div>
        </aside>

        <section className={`${styles.chatPanel} ${mobileListOpen ? styles.chatPanelHiddenMobile : ""}`}>
          {activeConversation ? (
            <>
              <header className={styles.chatHeader}>
                <div className={styles.chatUser}>
                  <button type="button" className={styles.mobileBackButton} aria-label="Back to conversations" onClick={() => setMobileListOpen(true)}>
                    <iconify-icon icon="lucide:arrow-left" />
                  </button>
                  <span className={styles.chatAvatar}>{activeConversation.participant.initials}</span>
                  <div className={styles.chatUserCopy}>
                    <strong>{activeConversation.participant.name}</strong>
                    <span className={styles.chatStatus}>
                      {activeConversation.participant.role ? activeConversation.participant.role.toLowerCase() : "contact"}
                      {activeConversation.taskTitle ? ` • ${activeConversation.taskTitle}` : ""}
                    </span>
                  </div>
                </div>
              </header>

              <div className={styles.messagesWrap} ref={messagesContainerRef}>
                {loadingMessages ? (
                  <div style={{ padding: 20 }}>
                    <SkeletonBlock style={{ width: "60%", height: 40, margin: "8px 0" }} />
                    <SkeletonBlock style={{ width: "50%", height: 40, margin: "8px 0" }} />
                  </div>
                ) : activeMessages.length === 0 ? (
                  <div className={styles.emptyState}>
                    <iconify-icon icon="lucide:message-circle" style={{ fontSize: 40, opacity: 0.3 }} />
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  <div className={styles.thread}>
                    {activeMessages.map((message: any) => {
                      const isMine = message.sender === userData?.id;
                      return (
                        <article key={message.id} className={`${styles.messageRow} ${isMine ? styles.messageRowSent : styles.messageRowReceived}`}>
                          {!isMine ? <span className={styles.messageAvatar}>{activeConversation.participant.initials}</span> : null}
                          <div className={styles.bubbleGroup}>
                            <div className={styles.bubble}>{message.text}</div>
                            {message.attachment_url ? (
                              <a href={message.attachment_url} target="_blank" rel="noreferrer" className={styles.attachmentBubble}>
                                <iconify-icon icon="lucide:paperclip" />
                                <span>{message.attachment_name || "Attachment"}</span>
                              </a>
                            ) : null}
                            <div className={styles.messageTime}>{formatMessageTime(message.created_at)}</div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}
              </div>

              <form
                className={styles.inputBar}
                onSubmit={(event) => {
                  event.preventDefault();
                  sendMessage();
                }}
              >
                <label className={styles.composeBox}>
                  <input
                    type="text"
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder="Type a message..."
                    aria-label="Type a message"
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
                    aria-label="Attach a file"
                    onClick={() => attachmentInputRef.current?.click()}
                    disabled={attachmentUploading}
                  >
                    <iconify-icon icon="lucide:paperclip" />
                  </button>
                </label>
                <button type="submit" className={styles.sendButton} aria-label="Send message" disabled={(!draft.trim() && !attachmentDraft) || sending}>
                  <iconify-icon icon="lucide:send" />
                </button>
              </form>
            </>
          ) : (
            <div className={styles.emptyState}>
              <iconify-icon icon="lucide:message-square" style={{ fontSize: 48, opacity: 0.3 }} />
              <p>Select a conversation to start messaging.</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
