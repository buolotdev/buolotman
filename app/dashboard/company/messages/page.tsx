"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useMemo, useEffect, useRef } from "react";
import styles from "./page.module.css";
import LogoutButton from "@/app/components/LogoutButton";
import { useFetch } from "@/app/lib/useFetch";
import { api } from "@/app/lib/api";
import { useToast } from "@/app/components/Toast";
import { SkeletonCard, SkeletonBlock } from "@/app/components/skeleton/Skeleton";

const translations: Record<string, Record<string, string>> = {
  en: {
    messages: "Messages",
    searchMessages: "Search messages...",
    noMessagesYet: "No Messages Yet",
    noMessagesSub: "When clients contact your company regarding quotes and projects, messages will appear here.",
    noMessagesPreview: "No messages yet",
    emptyChat: "No messages yet. Send a message to start communicating with the client!",
    typeMessage: "Type your message to client...",
    attachFile: "Attach file",
    uploading: "Uploading...",
    sendMessage: "Send Message",
    sending: "Sending...",
    selectConversation: "Select a conversation to start messaging.",
    client: "Client",
    attachment: "Attachment",
    yesterday: "Yesterday",
  },
  fr: {
    messages: "Messagerie",
    searchMessages: "Rechercher dans les messages...",
    noMessagesYet: "Aucun message pour l'instant",
    noMessagesSub: "Lorsque les clients contacteront votre entreprise pour des devis ou des projets, les messages apparaîtront ici.",
    noMessagesPreview: "Aucun message",
    emptyChat: "Aucun message. Envoyez un message pour commencer à échanger avec le client !",
    typeMessage: "Écrivez votre message au client...",
    attachFile: "Joindre un fichier",
    uploading: "Téléversement...",
    sendMessage: "Envoyer",
    sending: "Envoi en cours...",
    selectConversation: "Sélectionnez une conversation pour commencer à échanger.",
    client: "Client",
    attachment: "Pièce jointe",
    yesterday: "Hier",
  }
};

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
  const searchParams = useSearchParams();
  const targetClientName = searchParams.get("name") || (searchParams.get("client") ? `Client #${searchParams.get("client")}` : null);
  const targetClientId = searchParams.get("client");
  const targetTaskId = searchParams.get("task");
  
  const [mobileConversationOpen, setMobileConversationOpen] = useState(false);
  const [threadSearch, setThreadSearch] = useState("");
  const [draft, setDraft] = useState("");
  const [attachmentDraft, setAttachmentDraft] = useState<any>(null);
  const [attachmentUploading, setAttachmentUploading] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeMessages, setActiveMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [lang, setLang] = useState("en");
  const attachmentInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const updateLang = () => {
      setLang(localStorage.getItem("lang") || "en");
    };
    updateLang();
    window.addEventListener("languageChange", updateLang);
    return () => window.removeEventListener("languageChange", updateLang);
  }, []);

  const t = translations[lang] || translations["en"];


  const { data: user } = useFetch(() => api.getMe(), []);
  const { data: rawConversations, loading, refetch: refetchConvos } = useFetch(() => api.getConversations(), []);

  const conversations: Conversation[] = useMemo(() => {
    const raw = Array.isArray(rawConversations) ? rawConversations : (rawConversations as any)?.results || [];
    const list: Conversation[] = raw.map((c: any) => ({
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

    if (targetClientName && !list.some(c => c.participant.name.toLowerCase() === targetClientName.toLowerCase())) {
      list.unshift({
        id: "direct_company_client",
        participant: {
          name: targetClientName,
          role: "Client",
          initials: targetClientName.slice(0, 2).toUpperCase(),
        },
        lastMessage: "Start conversation with client...",
        time: new Date().toISOString(),
        unreadCount: 0,
        taskTitle: targetTaskId ? `Task #${targetTaskId}` : undefined,
      });
    }

    return list;
  }, [rawConversations, targetClientName, targetTaskId]);

  useEffect(() => {
    const raw = Array.isArray(rawConversations) ? rawConversations : (rawConversations as any)?.results || [];
    const existing = raw.find((c: any) => 
      (targetTaskId && c.task?.id === Number(targetTaskId)) ||
      (targetClientName && c.other_participant?.name?.toLowerCase().includes(targetClientName.toLowerCase()))
    );

    if (existing) {
      setActiveId(String(existing.id));
    } else if (targetTaskId || targetClientName || targetClientId) {
      api.createConversation({
        task_id: targetTaskId ? Number(targetTaskId) : undefined,
        participant_name: targetClientName || undefined,
        participant_id: targetClientId ? Number(targetClientId) : undefined,
      }).then((created: any) => {
        if (created && created.id) {
          setActiveId(String(created.id));
          refetchConvos();
        }
      }).catch(() => {
        if (!activeId) setActiveId("direct_company_client");
      });
    } else if (!activeId && conversations.length > 0) {
      setActiveId(conversations[0].id);
    }
  }, [rawConversations, targetTaskId, targetClientName, targetClientId, conversations]);

  useEffect(() => {
    if (!activeId) {
      setActiveMessages([]);
      return;
    }
    let cancelled = false;
    let interval: ReturnType<typeof setInterval>;

    const load = () => {
      const numericId = Number(activeId);
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
  }, [activeId]);

  useEffect(() => {
    const interval = setInterval(() => refetchConvos(), 3000);
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

  const activeConv = conversations.find((c) => String(c.id) === String(activeId)) || conversations[0];

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
    const optimistic = { 
      id: tempId, 
      sender: user?.id || 0, 
      text, 
      time: new Date().toISOString() 
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
      let convId = Number(activeId);
      if (isNaN(convId)) {
        const created = await api.createConversation({
          task_id: targetTaskId ? Number(targetTaskId) : undefined,
          participant_name: targetClientName || undefined,
          participant_id: targetClientId ? Number(targetClientId) : undefined,
        });
        if (created && created.id) {
          convId = created.id;
          setActiveId(String(convId));
        }
      }

      if (!isNaN(convId)) {
        await api.sendMessage(convId, {
          text,
          attachment_url: attachment?.url || "",
          attachment_key: attachment?.key || "",
          attachment_name: attachment?.name || "",
          attachment_type: attachment?.type || "file",
          attachment_size: attachment?.size || 0,
          attachment_content_type: attachment?.content_type || "",
        });
        refetchConvos();
      }
    } catch (err: any) {
      console.warn("Company send message error", err);
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
      if (diffDays === 1) return t.yesterday;
      if (diffDays < 7) return date.toLocaleDateString([], { weekday: 'long' });
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch {
      return timeStr;
    }
  };

  return (
    <>
      <div className={styles.chatShell}>
        <aside className={`${styles.conversationPanel} ${mobileConversationOpen ? styles.conversationPanelHiddenMobile : ""}`}>
          <div className={styles.panelHeader}>
            <div className={styles.panelTitleRow}>
              <h1 className={styles.panelTitle}>{t.messages}</h1>
              <button className={styles.newMessageBtn}>
                <iconify-icon icon="lucide:square-pen" />
              </button>
            </div>
            <div className={styles.threadSearch}>
              <iconify-icon icon="lucide:search" />
              <input
                type="text"
                placeholder={t.searchMessages}
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
                <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#001f3f", margin: "0 0 8px" }}>{t.noMessagesYet}</h3>
                <p style={{ fontSize: "14px", margin: 0, lineHeight: "1.5" }}>{t.noMessagesSub}</p>
              </div>
            ) : (
              filteredConversations.map((c) => {
                const isActive = activeConv && String(activeConv.id) === String(c.id);
                return (
                  <button
                    key={c.id}
                    onClick={() => selectConversation(c.id)}
                    className={`${styles.conversationItem} ${isActive ? styles.conversationItemActive : ""}`}
                  >
                    <div className={styles.conversationAvatarWrap}>
                      <span className={styles.conversationAvatar}>{c.participant.initials}</span>
                      <span className={`${styles.onlineDot} ${styles.onlineDotActive}`} />
                    </div>
                    <div className={styles.conversationContent}>
                      <div className={styles.conversationMeta}>
                        <strong>{c.participant.name}</strong>
                        <span>{formatTime(c.time)}</span>
                      </div>
                      {c.taskTitle && (
                        <span className={styles.conversationTask} style={{ color: "#ff4500", fontSize: "11.5px", fontWeight: 700 }}>
                          📋 {c.taskTitle}
                        </span>
                      )}
                      <div className={styles.conversationPreviewRow}>
                        <p className={`${styles.conversationPreview} ${c.unreadCount > 0 ? styles.conversationPreviewStrong : ""}`}>
                          {c.lastMessage || t.noMessagesPreview}
                        </p>
                        {c.unreadCount > 0 && <span className={styles.unreadPill}>{c.unreadCount}</span>}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        <section className={`${styles.chatPanel} ${!mobileConversationOpen ? styles.chatPanelHiddenMobile : ""}`}>
          {activeConv ? (
            <>
              <header className={styles.chatHeader}>
                <div className={styles.chatUser}>
                  <button
                    onClick={() => setMobileConversationOpen(false)}
                    className={styles.mobileBackBtn}
                  >
                    <iconify-icon icon="lucide:arrow-left" />
                  </button>
                  <div className={styles.chatAvatarWrap}>
                    <span className={styles.chatAvatar}>{activeConv.participant.initials}</span>
                    <span className={`${styles.onlineDot} ${styles.onlineDotActive}`} />
                  </div>
                  <div className={styles.chatUserDetails}>
                    <strong>{activeConv.participant.name}</strong>
                    <span>
                      {activeConv.participant.role || t.client}
                      {activeConv.taskTitle ? ` • ${activeConv.taskTitle}` : ""}
                    </span>
                  </div>
                </div>
              </header>

              <div className={styles.messagesArea} ref={messagesContainerRef}>
                {loadingMessages ? (
                  <div style={{ padding: "20px" }}>
                    <SkeletonBlock style={{ width: "60%", height: 40, margin: "8px 0" }} />
                    <SkeletonBlock style={{ width: "50%", height: 40, margin: "8px 0" }} />
                  </div>
                ) : activeMessages.length === 0 ? (
                  <div className={styles.emptyChat}>
                    <iconify-icon icon="lucide:message-circle" style={{ fontSize: 40, opacity: 0.3 }} />
                    <p>{t.emptyChat}</p>
                  </div>
                ) : (
                  activeMessages.map((msg: any) => {
                    const isMine = msg.sender === user?.id || (msg.sender_name && user?.company_name && msg.sender_name.includes(user.company_name));
                    return (
                      <article key={msg.id} className={`${styles.messageGroup} ${isMine ? styles.messageGroupSent : styles.messageGroupReceived}`}>
                        <div className={styles.messageBubble}>{msg.text}</div>
                        {msg.attachment_url && (
                          <a href={msg.attachment_url} target="_blank" rel="noreferrer" className={styles.attachmentBubble}>
                            <iconify-icon icon="lucide:paperclip" />
                            <span>{msg.attachment_name || t.attachment}</span>
                          </a>
                        )}
                        <div className={styles.messageMeta}>
                          <span>{formatTime(msg.created_at || msg.time)}</span>
                          {isMine && <iconify-icon icon="lucide:check-check" />}
                        </div>
                      </article>
                    );
                  })
                )}
              </div>

              <form className={styles.composer} onSubmit={handleSendMessage}>
                {attachmentDraft && (
                  <div className={styles.attachmentChip}>
                    <iconify-icon icon="lucide:paperclip" />
                    <span>{attachmentDraft.name}</span>
                    <button type="button" onClick={() => setAttachmentDraft(null)} aria-label="Remove attachment">
                      <iconify-icon icon="lucide:x" />
                    </button>
                  </div>
                )}
                <div className={styles.composerField}>
                  <textarea
                    className={styles.composerTextarea}
                    placeholder={t.typeMessage}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
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
                      style={{ background: "none", border: "none", display: "inline-flex", alignItems: "center", gap: "6px", cursor: "pointer", color: "#64748b", fontSize: "13px" }}
                    >
                      <iconify-icon icon="lucide:paperclip" style={{ fontSize: "16px" }} />
                      <span>{attachmentUploading ? t.uploading : t.attachFile}</span>
                    </button>
                    <button
                      type="submit"
                      className={styles.sendButton}
                      disabled={sending || (!draft.trim() && !attachmentDraft)}
                    >
                      {sending ? t.sending : t.sendMessage}
                    </button>
                  </div>
                </div>
              </form>
            </>
          ) : (
            <div className={styles.emptyChat}>
              <iconify-icon icon="lucide:messages-square" style={{ fontSize: 48, opacity: 0.3 }} />
              <p>{t.selectConversation}</p>
            </div>
          )}
        </section>
      </div>
    </>
  );
}

