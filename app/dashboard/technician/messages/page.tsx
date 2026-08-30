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
import TechnicianSidebar from "@/app/components/TechnicianSidebar";
import DashboardHeader from "@/app/components/DashboardHeader";

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

const translations: Record<string, Record<string, string>> = {
  en: {
    searchConversations: "Search conversations...",
    title: "Messages",
    searchMessages: "Search messages...",
    noConversationsYet: "No conversations yet",
    clickMessageClient: "Click \"Message Client\" on a task you bid on to start chatting.",
    noMessagesYet: "No messages yet. Start the conversation!",
    selectAConversation: "Select a conversation to start messaging.",
    attachFile: "Attach file",
    uploading: "Uploading...",
    send: "Send",
    sending: "Sending...",
    placeholder: "Type a message...",
  },
  fr: {
    searchConversations: "Rechercher une conversation...",
    title: "Messagerie",
    searchMessages: "Rechercher dans les messages...",
    noConversationsYet: "Aucune conversation pour le moment",
    clickMessageClient: "Cliquez sur « Contacter le client » depuis une mission pour démarrer un échange.",
    noMessagesYet: "Aucun message pour l'instant. Démarrez la discussion !",
    selectAConversation: "Sélectionnez une conversation pour commencer à échanger.",
    attachFile: "Joindre un fichier",
    uploading: "Téléchargement...",
    send: "Envoyer",
    sending: "Envoi en cours...",
    placeholder: "Écrivez un message...",
  }
};

export default function TechnicianMessagesPage() {
  const toast = useToast();
  const searchParams = useSearchParams();
  const [lang, setLang] = useState("en");

  useEffect(() => {
    const updateLang = () => {
      setLang(localStorage.getItem("lang") || "en");
    };
    updateLang();
    window.addEventListener("languageChange", updateLang);
    return () => window.removeEventListener("languageChange", updateLang);
  }, []);

  const t = translations[lang] || translations["en"];

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
  const isNearBottomRef = useRef(true);
  const messagesContainerRef = useRef<HTMLDivElement>(null);


  type ConversationItem = {
    id: string;
    participant: { name: string; initials: string; role: string };
    taskTitle: string;
    lastMessagePreview: string;
    lastMessageAt: string | null;
    unreadCount: number;
  };

  const targetClientName = searchParams.get("name") || (searchParams.get("client") ? `Client #${searchParams.get("client")}` : null);
  const targetTaskId = searchParams.get("task");
  const chatKey = targetTaskId 
    ? `boulotman_chat_task_${targetTaskId}` 
    : `boulotman_chat_direct_${(targetClientName || "client").toLowerCase().replace(/\s+/g, "_")}`;

  const conversations: ConversationItem[] = useMemo(() => {
    const raw = Array.isArray(conversationsData) ? conversationsData : (conversationsData as any)?.results || [];
    const list: ConversationItem[] = raw.map((c: any) => ({
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

    if (targetClientName && !list.some(c => c.participant.name.toLowerCase() === targetClientName.toLowerCase())) {
      list.unshift({
        id: "direct_client",
        participant: {
          name: targetClientName,
          initials: targetClientName.slice(0, 2).toUpperCase(),
          role: "Client",
        },
        taskTitle: targetTaskId ? `Task #${targetTaskId}` : "Direct Project Chat",
        lastMessagePreview: "Start conversation with client...",
        lastMessageAt: new Date().toISOString(),
        unreadCount: 0,
      });
    }

    return list;
  }, [conversationsData, targetClientName, targetTaskId]);

  useEffect(() => {
    const raw = Array.isArray(conversationsData) ? conversationsData : (conversationsData as any)?.results || [];
    const existing = raw.find((c: any) => 
      (targetTaskId && c.task?.id === Number(targetTaskId)) ||
      (targetClientName && c.other_participant?.name?.toLowerCase().includes(targetClientName.toLowerCase()))
    );

    if (existing) {
      setActiveConversationId(String(existing.id));
    } else if (targetTaskId || targetClientName) {
      api.createConversation({
        task_id: targetTaskId ? Number(targetTaskId) : undefined,
        participant_name: targetClientName || undefined,
      }).then((created: any) => {
        if (created && created.id) {
          setActiveConversationId(String(created.id));
          refetchConvos();
        }
      }).catch(() => {
        if (!activeConversationId) setActiveConversationId("direct_client");
      });
    } else if (!activeConversationId && conversations.length) {
      setActiveConversationId(conversations[0].id);
    }
  }, [conversationsData, targetTaskId, targetClientName, conversations]);

  useEffect(() => {
    const interval = setInterval(() => refetchConvos(), 3000);
    return () => clearInterval(interval);
  }, [refetchConvos]);

  // Load and poll messages
  useEffect(() => {
    if (!activeConversationId) return;

    let cancelled = false;
    let interval: ReturnType<typeof setInterval>;

    const load = () => {
      const numericId = Number(activeConversationId);
      if (!isNaN(numericId)) {
        api.getConversation(numericId)
          .then((data: any) => {
            if (!cancelled && data.messages) setActiveMessages(data.messages);
          })
          .catch(() => {});
      }
    };

    load();
    interval = setInterval(load, 2000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [activeConversationId]);


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
    if (!threadSearch.trim()) return conversations;
    const q = threadSearch.toLowerCase().trim();
    return conversations.filter(
      (c) =>
        c.participant.name.toLowerCase().includes(q) ||
        c.participant.role.toLowerCase().includes(q) ||
        c.taskTitle.toLowerCase().includes(q) ||
        c.lastMessagePreview.toLowerCase().includes(q)
    );
  }, [conversations, threadSearch]);

  const activeConversation = useMemo(() => {
    return conversations.find((c) => String(c.id) === String(activeConversationId)) ?? conversations[0] ?? null;
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
    const techName = userData ? `${userData.first_name || ""} ${userData.last_name || ""}`.trim() || userData.username : "Technician";

    const optimistic = {
      id: tempId,
      sender: userData?.id,
      sender_id: userData?.id,
      sender_name: techName,
      isClient: false,
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
      let convId = Number(activeConversation.id);
      if (isNaN(convId)) {
        const created = await api.createConversation({
          task_id: targetTaskId ? Number(targetTaskId) : undefined,
          participant_name: targetClientName || undefined,
        });
        if (created && created.id) {
          convId = created.id;
          setActiveConversationId(String(convId));
        }
      }

      if (!isNaN(convId)) {
        const real = await api.sendMessage(convId, {
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

        // Sync with project workspace thread if task is associated
        const taskNum = targetTaskId || (activeConversation?.taskTitle?.match(/#?(\d+)/)?.[1]);
        if (taskNum) {
          const key = `boulotman_chat_task_${taskNum}`;
          const currentStored = localStorage.getItem(key);
          let list = [];
          if (currentStored) {
            try { list = JSON.parse(currentStored); } catch {}
          }
          list.push({
            id: Date.now(),
            sender: "You",
            text,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isClient: false
          });
          localStorage.setItem(key, JSON.stringify(list));
        }
      }
    } catch (err: any) {
      console.warn("API message failed", err);
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

  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className={styles.page}>
      <div className={styles.layout}>
        <TechnicianSidebar isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

        <div className={styles.mainArea}>
          <DashboardHeader
            onMenuClick={() => setMobileNavOpen(true)}
            searchPlaceholder={t.searchConversations}
            searchQuery={threadSearch}
            setSearchQuery={setThreadSearch}
          />

          <div className={styles.chatAppContainer}>
        <aside className={`${styles.sidebar} ${!mobileListOpen ? styles.sidebarHiddenMobile : ""}`}>
          <div className={styles.sidebarHead}>
            <h1>{t.title}</h1>
            <label className={styles.searchBox}>
              <iconify-icon icon="lucide:search" />
              <input
                type="search"
                placeholder={t.searchMessages}
                value={threadSearch}
                onChange={(e) => setThreadSearch(e.target.value)}
              />
            </label>
          </div>

          <div className={styles.conversationsList}>
            {conversationsLoading ? (
              <div style={{ padding: 16 }}>
                <SkeletonBlock style={{ height: 48, marginBottom: 12 }} />
                <SkeletonBlock style={{ height: 48, marginBottom: 12 }} />
                <SkeletonBlock style={{ height: 48 }} />
              </div>
            ) : filteredConversations.length > 0 ? (

              filteredConversations.map((c) => {
                const isActive = c.id === activeConversationId;
                return (
                  <button
                    key={c.id}
                    type="button"
                    className={`${styles.conversationItem} ${isActive ? styles.conversationItemActive : ""}`}
                    onClick={() => selectConversation(c.id)}
                  >
                    <span className={styles.avatar}>{c.participant.initials}</span>
                    <div className={styles.conversationInfo}>
                      <div className={styles.nameRow}>
                        <span className={styles.userName}>{c.participant.name}</span>
                        <span className={styles.messageTime}>{formatTime(c.lastMessageAt)}</span>
                      </div>
                      <p className={styles.preview}>{c.lastMessagePreview || (lang === "fr" ? "Aucun message pour l'instant" : "No messages yet")}</p>
                      <div className={styles.taskMetaRow}>
                        {c.taskTitle ? <span className={styles.taskSnippet}>{c.taskTitle}</span> : null}
                        {c.unreadCount > 0 ? (
                          <span className={styles.badge}>{c.unreadCount}</span>
                        ) : null}
                      </div>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className={styles.emptyState}>
                <iconify-icon icon="lucide:message-square-off" style={{ fontSize: 36, opacity: 0.3 }} />
                <p>{t.noConversationsYet}</p>
                <span style={{ fontSize: 13, color: "#94a3b8" }}>{t.clickMessageClient}</span>
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
                    <p>{t.noMessagesYet}</p>
                  </div>
                ) : (
                  <div className={styles.thread}>
                    {activeMessages.map((message: any) => {
                      // Check if message was sent by technician (logged-in user)
                      const isMine = message.sender === userData?.id || message.sender_id === userData?.id || message.isClient === false;
                      return (
                        <article key={message.id} className={`${styles.messageRow} ${isMine ? styles.messageRowSent : styles.messageRowReceived}`}>
                          {!isMine ? <span className={styles.messageAvatar}>{activeConversation.participant.initials}</span> : null}
                          <div className={styles.bubbleGroup}>
                            <div className={styles.bubble}>{message.text}</div>
                            {message.attachment_url ? (
                              <a href={message.attachment_url} target="_blank" rel="noreferrer" className={styles.attachmentBubble}>
                                <iconify-icon icon="lucide:paperclip" />
                                <span>{message.attachment_name || (lang === "fr" ? "Fichier joint" : "Attachment")}</span>
                              </a>
                            ) : null}
                            <span className={styles.timestamp}>{formatMessageTime(message.created_at)}</span>
                          </div>
                          {isMine ? <span className={styles.messageAvatarMine}>{userInitials}</span> : null}
                        </article>
                      );
                    })}
                  </div>
                )}
              </div>

              <form
                className={styles.inputBar}
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage();
                }}
              >
                {attachmentDraft ? (
                  <div className={styles.attachmentChip}>
                    <iconify-icon icon="lucide:paperclip" />
                    <span>{attachmentDraft.name}</span>
                    <button type="button" onClick={() => setAttachmentDraft(null)} aria-label="Remove attachment">
                      <iconify-icon icon="lucide:x" />
                    </button>
                  </div>
                ) : null}

                <div className={styles.composeBox}>
                  <textarea
                    className={styles.composerTextarea}
                    placeholder={lang === "fr" ? "Écrivez votre message..." : "Type your message..."}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                  />

                  <div className={styles.composerTools}>
                    <input
                      type="file"
                      ref={attachmentInputRef}
                      style={{ display: "none" }}
                      onChange={(e) => handleAttachmentPick(e.target.files?.[0])}
                    />
                    <button
                      type="button"
                      onClick={() => attachmentInputRef.current?.click()}
                      disabled={attachmentUploading}
                      style={{ background: "none", border: "none", display: "inline-flex", alignItems: "center", gap: "6px", cursor: "pointer", color: "#64748b", fontSize: "13.5px" }}
                    >
                      <iconify-icon icon="lucide:paperclip" style={{ fontSize: "16px" }} />
                      <span>{attachmentUploading ? t.uploading : t.attachFile}</span>
                    </button>

                    <button
                      type="submit"
                      className={styles.sendButton}
                      disabled={sending || (!draft.trim() && !attachmentDraft)}
                    >
                      {sending ? t.sending : t.send}
                    </button>
                  </div>
                </div>
              </form>
            </>
          ) : (
            <div className={styles.emptyState}>
              <iconify-icon icon="lucide:messages-square" style={{ fontSize: 48, opacity: 0.3 }} />
              <p>{t.selectAConversation}</p>
            </div>
          )}
        </section>
      </div>
      </div>
    </div>
    </div>
  );
}
