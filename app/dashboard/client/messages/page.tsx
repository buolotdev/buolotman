"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import { useToast } from "@/app/components/Toast";
import { useDialog } from "@/app/components/Dialog";
import { SkeletonBlock } from "@/app/components/skeleton/Skeleton";
import styles from "./page.module.css";
import LogoutButton from "@/app/components/LogoutButton";
import DashboardHeader from "@/app/components/DashboardHeader";

const navItems = [
  { key: "dashboard", label: "Dashboard", icon: "lucide:layout-dashboard", href: "/dashboard/client", match: (p: string) => p === "/dashboard/client" },
  { key: "tasks", label: "My Tasks", icon: "lucide:clipboard-list", href: "/dashboard/client/tasks", match: (p: string) => p.startsWith("/dashboard/client/tasks") },
  { key: "projects", label: "My Projects", icon: "lucide:briefcase", href: "/dashboard/client/projects", match: (p: string) => p.startsWith("/dashboard/client/projects") },
  { key: "messages", label: "Messages", icon: "lucide:message-square", href: "/dashboard/client/messages", match: (p: string) => p.startsWith("/dashboard/client/messages") },
  { key: "payments", label: "Payments", icon: "lucide:credit-card", href: "/dashboard/client/payments", match: (p: string) => p.startsWith("/dashboard/client/payments") },
  { key: "saved", label: "Saved", icon: "lucide:bookmark", href: "/dashboard/client/saved", match: (p: string) => p.startsWith("/dashboard/client/saved") },
  { key: "support", label: "Support Tickets", icon: "lucide:life-buoy", href: "/dashboard/client/support", match: (p: string) => p.startsWith("/dashboard/client/support") },
  { key: "settings", label: "Settings", icon: "lucide:settings", href: "/dashboard/client/settings", match: (p: string) => p.startsWith("/dashboard/client/settings") },
  { key: "explore", label: "Explore Professionals", icon: "lucide:search", href: "/search", match: (p: string) => p.startsWith("/search") },

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
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

export default function ClientMessagesPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const toast = useToast();
  const dialog = useDialog();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [mobileConversationOpen, setMobileConversationOpen] = useState(false);
  const [threadSearch, setThreadSearch] = useState("");
  const [draft, setDraft] = useState("");
  const [attachmentDraft, setAttachmentDraft] = useState<any>(null);
  const [attachmentUploading, setAttachmentUploading] = useState(false);
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string>(searchParams.get("c") || "");
  const [activeMessages, setActiveMessages] = useState<any[]>([]);
  const [sending, setSending] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const attachmentInputRef = useRef<HTMLInputElement>(null);

  const { data: apiConversations, loading, refetch: refetchConvos } = useFetch(() => api.getConversations(), []);
  const { data: userData } = useFetch(() => api.getMe(), []);

  const userName = `${userData?.first_name ?? ""} ${userData?.last_name ?? ""}`.trim() || userData?.username || "";
  const userInitials = useMemo(() => {
    const first = userData?.first_name?.[0] ?? "";
    const last = userData?.last_name?.[0] ?? "";
    return `${first}${last}`.toUpperCase();
  }, [userData]);
  const userRole = userData?.role ?? "";

  useEffect(() => {
    if (apiConversations) {
      const list = Array.isArray(apiConversations) ? apiConversations : (apiConversations as any)?.results || [];
      setConversations(list);
      if (!activeConversationId && list[0]) {
        setActiveConversationId(String(list[0].id));
      }
    }
  }, [apiConversations]);

  useEffect(() => {
    const interval = setInterval(() => refetchConvos(), 5000);
    return () => clearInterval(interval);
  }, [refetchConvos]);

  useEffect(() => {
    if (!activeConversationId) return;
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
    return conversations.filter((conversation: any) => {
      const name = conversation.other_participant?.name || "";
      const role = conversation.other_participant?.role || "";
      const title = conversation.task_title || "";
      const preview = conversation.last_message?.text || "";
      return [name, role, title, preview].join(" ").toLowerCase().includes(normalized);
    });
  }, [conversations, threadSearch]);

  const activeConversation = filteredConversations.find((c: any) => String(c.id) === activeConversationId) ?? conversations[0];

  const selectConversation = (conversationId: string) => {
    isNearBottomRef.current = true;
    setActiveConversationId(conversationId);
    setMobileConversationOpen(true);
  };

  const handleSendMessage = async () => {
    const message = draft.trim();
    if ((!message && !attachmentDraft) || !activeConversation || sending) return;

    const tempId = `tmp-${Date.now()}`;
    const optimistic = {
      id: tempId,
      sender: userData?.id,
      sender_name: userName,
      text: message,
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
        text: message,
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
      <div className={styles.layout}>
        <aside className={`${styles.sidebar} ${mobileNavOpen ? styles.sidebarOpen : ""}`}>
          <div className={styles.sidebarHeader}>
            <Link href="/" className={styles.brand}>
              <Image src="/boulotman-logo.png" alt="Boulot Man" width={54} height={54} className={styles.brandImage} priority />
              <div className={styles.brandText}>
                <span className={styles.brandEyebrow}>Boulot Man</span>
                <span className={styles.brandTitle}>Client Space</span>
              </div>
            </Link>
            <button type="button" className={styles.sidebarClose} aria-label="Close navigation" onClick={() => setMobileNavOpen(false)}>
              <iconify-icon icon="lucide:x" />
            </button>
          </div>

          <nav className={styles.sidebarNav} aria-label="Dashboard navigation">
            {navItems.map((item) => {
              const isActive = item.match(pathname || "");
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
                  onClick={(e) => {
                    setMobileNavOpen(false);
                    if (pathname === item.href) {
                      e.preventDefault();
                      window.location.reload();
                    }
                  }}
                >
                  <iconify-icon icon={item.icon} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className={styles.sidebarFooter}>
            <LogoutButton className={styles.logoutButton} />
          </div>
        </aside>

        <div className={styles.main}>
          <DashboardHeader
            onMenuClick={() => setMobileNavOpen(true)}
          />

          <div className={styles.chatShell}>
            <aside className={`${styles.conversationPanel} ${mobileConversationOpen ? styles.conversationPanelHiddenMobile : ""}`}>
              <div className={styles.panelHeader}>
                <div className={styles.panelTitleRow}>
                  <h1 className={styles.panelTitle}>Messages</h1>
                </div>
                <label className={styles.threadSearch}>
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
                {loading ? (
                  <div className={styles.emptyThreads}>
                    <SkeletonBlock style={{ width: "100%", height: 60, marginBottom: 8 }} />
                    <SkeletonBlock style={{ width: "100%", height: 60, marginBottom: 8 }} />
                    <SkeletonBlock style={{ width: "100%", height: 60 }} />
                  </div>
                ) : filteredConversations.length ? (
                  filteredConversations.map((conversation: any) => {
                    const isActive = String(conversation.id) === activeConversationId;
                    const preview = conversation.last_message?.text || "No messages yet.";
                    return (
                      <button
                        key={conversation.id}
                        type="button"
                        className={`${styles.conversationItem} ${isActive ? styles.conversationItemActive : ""}`}
                        onClick={() => selectConversation(String(conversation.id))}
                      >
                        <div className={styles.conversationAvatarWrap}>
                          <div className={styles.conversationAvatar}>{conversation.other_participant?.initials || "?"}</div>
                        </div>
                        <div className={styles.conversationContent}>
                          <div className={styles.conversationMeta}>
                            <strong>{conversation.other_participant?.name || ""}</strong>
                            <span>{formatTime(conversation.last_message_at || conversation.last_message?.time)}</span>
                          </div>
                          <div className={styles.conversationPreviewRow}>
                            <span className={`${styles.conversationPreview} ${conversation.unread_count ? styles.conversationPreviewStrong : ""}`}>
                              {preview}
                            </span>
                            {conversation.unread_count ? (
                              <span className={styles.unreadPill}>{conversation.unread_count}</span>
                            ) : null}
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span className={styles.conversationTask}>{conversation.task_title || ""}</span>
                            {conversation.other_participant?.role && (
                              <span className={`${styles.roleBadge} ${
                                conversation.other_participant.role.toLowerCase() === 'admin' ? styles.roleAdmin :
                                conversation.other_participant.role.toLowerCase() === 'technician' ? styles.roleTechnician :
                                conversation.other_participant.role.toLowerCase() === 'company' ? styles.roleCompany :
                                styles.roleProject
                              }`}>
                                {conversation.other_participant.role}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <div className={styles.emptyThreads}>
                    <iconify-icon icon="lucide:message-square" style={{ fontSize: 32, opacity: 0.4 }} />
                    <p>No conversations yet.</p>
                    <span>Accept a proposal to start chatting with a technician.</span>
                  </div>
                )}
              </div>
            </aside>

            <section className={`${styles.chatPanel} ${mobileConversationOpen ? styles.chatPanelOpenMobile : ""}`}>
              {activeConversation ? (
                <>
                  <header className={styles.chatHeader}>
                    <div className={styles.chatUser}>
                      <button type="button" className={styles.mobileBackButton} aria-label="Back to conversations" onClick={() => setMobileConversationOpen(false)}>
                        <iconify-icon icon="lucide:arrow-left" />
                      </button>
                      <div className={styles.chatAvatarWrap}>
                        <div className={styles.chatAvatar}>{activeConversation.other_participant?.initials || "?"}</div>
                      </div>
                      <div className={styles.chatUserDetails}>
                        <strong>{activeConversation.other_participant?.name || ""}</strong>
                        <span>
                          {activeConversation.other_participant?.role ? activeConversation.other_participant.role.toLowerCase() : ""}
                          {activeConversation.task_title ? ` • ${activeConversation.task_title}` : ""}
                        </span>
                      </div>
                    </div>
                  </header>

                  <div className={styles.messagesArea} ref={messagesContainerRef}>
                    {loadingMessages ? (
                      <div className={styles.emptyChat}><SkeletonBlock style={{ width: "60%", height: 40, margin: "8px 0" }} /></div>
                    ) : activeMessages.length === 0 ? (
                      <div className={styles.emptyChat}>
                        <iconify-icon icon="lucide:message-circle" style={{ fontSize: 40, opacity: 0.3 }} />
                        <p>No messages yet. Say hi!</p>
                      </div>
                    ) : (
                      activeMessages.map((message: any) => {
                        const isMine = message.sender === userData?.id;
                        return (
                          <article key={message.id} className={`${styles.messageGroup} ${isMine ? styles.messageGroupSent : styles.messageGroupReceived}`}>
                            <div className={styles.messageBubble}>{message.text}</div>
                            {message.attachment_url ? (
                              <a href={message.attachment_url} target="_blank" rel="noreferrer" className={styles.attachmentBubble}>
                                <iconify-icon icon="lucide:paperclip" />
                                <span>{message.attachment_name || "Attachment"}</span>
                              </a>
                            ) : null}
                            <div className={styles.messageMeta}>
                              <span>{formatMessageTime(message.created_at)}</span>
                              {isMine ? <iconify-icon icon="lucide:check-check" /> : null}
                            </div>
                          </article>
                        );
                      })
                    )}
                  </div>

                  <form
                    className={styles.composer}
                    onSubmit={(event) => {
                      event.preventDefault();
                      handleSendMessage();
                    }}
                  >
                    <div className={styles.composerField}>
                      <textarea
                        className={styles.composerTextarea}
                        value={draft}
                        onChange={(event) => {
                          setDraft(event.target.value);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        placeholder="Type your message..."
                        aria-label="Type a message"
                        rows={3}
                      />
                      <div className={styles.composerTools}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <input
                            ref={attachmentInputRef}
                            type="file"
                            className={styles.fileInput}
                            accept="image/*,video/*,.pdf,.doc,.docx"
                            onChange={(event) => {
                              const file = event.target.files?.[0];
                              handleAttachmentPick(file);
                            }}
                          />
                          {attachmentUploading && <span style={{ fontSize: 12, color: '#64748b' }}>Uploading...</span>}
                          {attachmentDraft && !attachmentUploading && (
                            <button type="button" className={styles.attachmentChip} onClick={() => { setAttachmentDraft(null); if (attachmentInputRef.current) attachmentInputRef.current.value = ""; }}>
                              <span>{attachmentDraft.name}</span>
                              <iconify-icon icon="lucide:x" style={{ fontSize: 14, marginLeft: 4 }} />
                            </button>
                          )}
                        </div>
                        <button type="submit" className={styles.sendButton} aria-label="Send message" disabled={(!draft.trim() && !attachmentDraft) || sending || attachmentUploading}>
                          Send
                        </button>
                      </div>
                    </div>
                  </form>
                </>
              ) : (
                <div className={styles.emptyChat}>
                  <iconify-icon icon="lucide:message-square" style={{ fontSize: 48, opacity: 0.3 }} />
                  <p>Select a conversation to start messaging.</p>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
