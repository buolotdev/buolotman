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
import ClientSidebar from "@/app/components/ClientSidebar";
import DashboardHeader from "@/app/components/DashboardHeader";

const translations: Record<string, Record<string, string>> = {
  en: {
    panelTitle: "Messages",
    searchPlaceholder: "Search messages...",
    noConvos: "No conversations yet.",
    noConvosDesc: "Accept a proposal to start chatting with a technician.",
    noMessages: "No messages yet. Say hi!",
    typeMessage: "Type your message...",
    uploading: "Uploading...",
    send: "Send",
    selectConvo: "Select a conversation to start messaging.",
    noMessagesYet: "No messages yet.",
  },
  fr: {
    panelTitle: "Messagerie",
    searchPlaceholder: "Rechercher dans les messages...",
    noConvos: "Aucune conversation pour le moment.",
    noConvosDesc: "Acceptez une offre pour démarrer une discussion avec un artisan.",
    noMessages: "Aucun message pour l'instant. Dites bonjour !",
    typeMessage: "Écrivez votre message...",
    uploading: "Téléchargement...",
    send: "Envoyer",
    selectConvo: "Sélectionnez une conversation pour commencer à échanger.",
    noMessagesYet: "Aucun message pour l'instant.",
  }
};

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


  const { data: apiConversations, loading, refetch: refetchConvos } = useFetch(() => api.getConversations(), []);
  const { data: userData } = useFetch(() => api.getMe(), []);

  const userName = `${userData?.first_name ?? ""} ${userData?.last_name ?? ""}`.trim() || userData?.username || "";
  const userInitials = useMemo(() => {
    const first = userData?.first_name?.[0] ?? "";
    const last = userData?.last_name?.[0] ?? "";
    return `${first}${last}`.toUpperCase();
  }, [userData]);
  const userRole = userData?.role ?? "";

  const targetName = searchParams.get("name");
  const targetTask = searchParams.get("task");
  const targetSpecialistId = searchParams.get("specialist") || searchParams.get("user") || searchParams.get("participant");

  useEffect(() => {
    let list = Array.isArray(apiConversations) ? [...apiConversations] : [...((apiConversations as any)?.results || [])];
    
    const existing = list.find((c: any) => 
      (targetTask && c.task?.id === Number(targetTask)) ||
      (targetName && c.other_participant?.name?.toLowerCase().includes(targetName.toLowerCase()))
    );

    if (existing) {
      setActiveConversationId(String(existing.id));
    } else if (targetName || targetTask || targetSpecialistId) {
      api.createConversation({
        task_id: targetTask ? Number(targetTask) : undefined,
        participant_name: targetName || undefined,
        participant_id: targetSpecialistId ? Number(targetSpecialistId) : undefined,
      }).then((created: any) => {
        if (created && created.id) {
          setActiveConversationId(String(created.id));
          refetchConvos();
        }
      }).catch(() => {
        if (!activeConversationId) setActiveConversationId("direct_specialist");
      });
    } else if (!activeConversationId && list[0]) {
      setActiveConversationId(String(list[0].id));
    }


    if (targetName && !list.some((c: any) => c.other_participant?.name?.toLowerCase() === targetName.toLowerCase())) {
      list.unshift({
        id: "direct_specialist",
        other_participant: {
          name: targetName,
          initials: targetName.slice(0, 2).toUpperCase(),
          role: "Technician",
        },
        task_title: targetTask ? `Task #${targetTask}` : "Direct Project Chat",
        last_message: { text: "Start messaging with technician..." },
        last_message_at: new Date().toISOString(),
        unread_count: 0,
      });
    }

    setConversations(list);
  }, [apiConversations, targetName, targetTask]);

  useEffect(() => {
    const interval = setInterval(() => refetchConvos(), 3000);
    return () => clearInterval(interval);
  }, [refetchConvos]);

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
    if (!threadSearch.trim()) return conversations;
    const q = threadSearch.toLowerCase().trim();
    return conversations.filter(
      (c: any) =>
        c.other_participant?.name?.toLowerCase().includes(q) ||
        c.other_participant?.role?.toLowerCase().includes(q) ||
        c.task_title?.toLowerCase().includes(q)
    );
  }, [conversations, threadSearch]);

  const activeConversation = useMemo(() => {
    return conversations.find((c: any) => String(c.id) === String(activeConversationId)) ?? conversations[0] ?? null;
  }, [conversations, activeConversationId]);

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
      sender_id: userData?.id,
      sender_name: userName || "Client",
      isClient: true,
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
      let convId = Number(activeConversation.id);
      if (isNaN(convId)) {
        const created = await api.createConversation({
          task_id: targetTask ? Number(targetTask) : undefined,
          participant_name: targetName || undefined,
        });
        if (created && created.id) {
          convId = created.id;
          setActiveConversationId(String(convId));
        }
      }

      if (!isNaN(convId)) {
        const real = await api.sendMessage(convId, {
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

        // Sync with project workspace thread if task is associated
        const taskNum = targetTask || (activeConversation?.task_title?.match(/#?(\d+)/)?.[1]);
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
            text: message,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isClient: true
          });
          localStorage.setItem(key, JSON.stringify(list));
        }
      }
    } catch (err: any) {
      console.warn("Backend send message error", err);
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
        <ClientSidebar isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

        <div className={styles.main}>
          <DashboardHeader
            onMenuClick={() => setMobileNavOpen(true)}
          />

          <div className={styles.chatShell}>
            <aside className={`${styles.conversationPanel} ${mobileConversationOpen ? styles.conversationPanelHiddenMobile : ""}`}>
              <div className={styles.panelHeader}>
                <div className={styles.panelTitleRow}>
                  <h1 className={styles.panelTitle}>{t.panelTitle}</h1>
                </div>
                <label className={styles.threadSearch}>
                  <iconify-icon icon="lucide:search" />
                  <input
                    type="search"
                    value={threadSearch}
                    onChange={(event) => setThreadSearch(event.target.value)}
                    placeholder={t.searchPlaceholder}
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
                    const preview = conversation.last_message?.text || t.noMessagesYet;
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
                            <span>{conversation.last_message_at || conversation.last_message?.time ? new Date(conversation.last_message_at || conversation.last_message?.time).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US") : ""}</span>
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
                    <p>{t.noConvos}</p>
                    <span>{t.noConvosDesc}</span>
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
                        <p>{t.noMessages}</p>
                      </div>
                    ) : (
                      activeMessages.map((message: any) => {
                        const isMine = message.sender === userData?.id || message.sender_id === userData?.id || message.isClient === true;
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
                              <span>{message.created_at ? new Date(message.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}</span>
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
                        placeholder={t.typeMessage}
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
                          {attachmentUploading && <span style={{ fontSize: 12, color: '#64748b' }}>{t.uploading}</span>}
                          {attachmentDraft && !attachmentUploading && (
                            <button type="button" className={styles.attachmentChip} onClick={() => { setAttachmentDraft(null); if (attachmentInputRef.current) attachmentInputRef.current.value = ""; }}>
                              <span>{attachmentDraft.name}</span>
                              <iconify-icon icon="lucide:x" style={{ fontSize: 14, marginLeft: 4 }} />
                            </button>
                          )}
                        </div>
                        <button type="submit" className={styles.sendButton} aria-label="Send message" disabled={(!draft.trim() && !attachmentDraft) || sending || attachmentUploading}>
                          {t.send}
                        </button>
                      </div>
                    </div>
                  </form>
                </>
              ) : (
                <div className={styles.emptyChat}>
                  <iconify-icon icon="lucide:message-square" style={{ fontSize: 48, opacity: 0.3 }} />
                  <p>{t.selectConvo}</p>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

