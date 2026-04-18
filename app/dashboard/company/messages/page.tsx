"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import styles from "./page.module.css";

type Message = {
  id: string;
  sender: "company" | "client" | "technician";
  text: string;
  time: string;
  isRead?: boolean;
};

type Participant = {
  name: string;
  role: "Client" | "Technician";
  avatar: string;
  initials: string;
  status: "online" | "offline";
};

type Conversation = {
  id: string;
  participant: Participant;
  lastMessage: string;
  time: string;
  unreadCount: number;
  taskTitle?: string;
  messages: Message[];
};

const initialConversations: Conversation[] = [
  {
    id: "conv-1",
    participant: {
      name: "Carlos Rodriguez",
      role: "Technician",
      avatar: "https://storage.googleapis.com/banani-avatars/avatar%2Fmale%2F35-50%2FHispanic%2F2",
      initials: "CR",
      status: "online",
    },
    lastMessage: "Sounds great, see you then!",
    time: "10:15 AM",
    unreadCount: 0,
    taskTitle: "Electrical Panel Upgrade",
    messages: [
      { id: "m1", sender: "company", text: "Hi Carlos, are you available for the panel upgrade this week?", time: "09:45 AM" },
      { id: "m2", sender: "technician", text: "Hello! Yes, I am available this Thursday morning. Does that work?", time: "09:50 AM" },
      { id: "m3", sender: "company", text: "Thursday works perfectly. What time?", time: "09:52 AM" },
      { id: "m4", sender: "technician", text: "Around 10:00 AM. Sounds great, see you then!", time: "10:15 AM" },
    ],
  },
  {
    id: "conv-2",
    participant: {
      name: "Sarah Jenkins",
      role: "Client",
      avatar: "https://storage.googleapis.com/banani-avatars/avatar%2Ffemale%2F18-25%2FEast%20Asian%2F4",
      initials: "SJ",
      status: "offline",
    },
    lastMessage: "The proposal is attached below.",
    time: "Yesterday",
    unreadCount: 1,
    taskTitle: "Office Renovation Plan",
    messages: [
      { id: "m5", sender: "client", text: "Hi, I've reviewed the initial draft for the office layout.", time: "Yesterday" },
      { id: "m6", sender: "client", text: "The proposal is attached below.", time: "Yesterday" },
    ],
  },
  {
    id: "conv-3",
    participant: {
      name: "Michael Chen",
      role: "Technician",
      avatar: "https://storage.googleapis.com/banani-avatars/avatar%2Fmale%2F50-65%2FEuropean%2F5",
      initials: "MC",
      status: "online",
    },
    lastMessage: "Thanks for the payment. Have a good one!",
    time: "Tuesday",
    unreadCount: 0,
    taskTitle: "HVAC Maintenance",
    messages: [
      { id: "m7", sender: "technician", text: "Job completed! All filters replaced.", time: "Tuesday" },
      { id: "m8", sender: "company", text: "Great work Michael. Payment sent.", time: "Tuesday" },
      { id: "m9", sender: "technician", text: "Thanks for the payment. Have a good one!", time: "Tuesday" },
    ],
  },
];

export default function CompanyMessages() {
  const [activeNav, setActiveNav] = useState("messages");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [mobileConversationOpen, setMobileConversationOpen] = useState(false);
  const [threadSearch, setThreadSearch] = useState("");
  const [draft, setDraft] = useState("");
  const [conversations, setConversations] = useState(initialConversations);
  const [activeId, setActiveId] = useState(initialConversations[0].id);

  const navItems = [
    { id: "dashboard", label: "Dashboard", href: "/dashboard/company", icon: "lucide:layout-dashboard" },
    { id: "services", label: "Services", href: "/dashboard/company/services", icon: "lucide:layers" },
    { id: "projects", label: "Projects", href: "/dashboard/company/projects", icon: "lucide:briefcase", badge: 12 },
    { id: "teams", label: "Teams", href: "/dashboard/company/teams", icon: "lucide:users" },
    { id: "messages", label: "Messages", href: "/dashboard/company/messages", icon: "lucide:message-square", badge: 5 },
    { id: "analytics", label: "Analytics", href: "/dashboard/company/analytics", icon: "lucide:bar-chart-3" },
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

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!draft.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: "company",
      text: draft,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setConversations(prev => prev.map(c => 
      c.id === activeId 
        ? { ...c, messages: [...c.messages, newMessage], lastMessage: draft, time: "Now" } 
        : c
    ));
    setDraft("");
  };

  const selectConversation = (id: string) => {
    setActiveId(id);
    setMobileConversationOpen(true);
    setConversations(prev => prev.map(c => 
      c.id === id ? { ...c, unreadCount: 0 } : c
    ));
  };

  return (
    <div className={`${styles.layoutWrapper} ${mobileSidebarOpen ? styles.sidebarOpenMobile : ""}`}>
      {/* Sidebar Overlay */}
      <div className={styles.sidebarOverlay} onClick={() => setMobileSidebarOpen(false)} />

      {/* Sidebar */}
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
              className={`${styles.navItem} ${activeNav === item.id ? styles.navItemActive : ""}`}
            >
              <iconify-icon icon={item.icon} />
              <span>{item.label}</span>
              {item.badge && <span className={styles.navItemBadge}>{item.badge}</span>}
            </Link>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <Link href="/login" className={styles.logoutButton}>
            <iconify-icon icon="lucide:log-out" />
            <span>Logout</span>
          </Link>
          <p className={styles.copyright}>© 2026 Boulot Man Inc.</p>
        </div>
      </aside>

      {/* Main Content */}
      <div className={styles.mainWrapper}>
        <header className={styles.topbar}>
          <div className={styles.topbarLeft}>
            <button 
              className={styles.mobileMenuBtn} 
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            >
              <iconify-icon icon="lucide:menu" />
            </button>
            <div className={styles.searchBar}>
              <iconify-icon icon="lucide:search" />
              <input type="text" placeholder="Search messages, participants..." />
            </div>
          </div>

          <div className={styles.topbarActions}>
            <button className={styles.iconBtn}>
              <iconify-icon icon="lucide:bell" />
              <span className={styles.notificationDot} />
            </button>
            <div className={styles.companyProfile}>
              <div className={styles.profileImg}>
                <Image src="/boulotman-logo.png" alt="Company" width={36} height={36} />
              </div>
              <div className={styles.profileName}>TechCorp Solutions</div>
            </div>
          </div>
        </header>

        <div className={styles.chatShell}>
          {/* Conversation List */}
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
              {filteredConversations.map((conv) => (
                <button 
                  key={conv.id}
                  className={`${styles.conversationItem} ${activeId === conv.id ? styles.conversationItemActive : ""}`}
                  onClick={() => selectConversation(conv.id)}
                >
                  <div className={styles.avatarWrap}>
                    <div className={styles.avatar}>
                      {conv.participant.avatar ? (
                        <Image src={conv.participant.avatar} alt={conv.participant.name} width={52} height={52} />
                      ) : (
                        conv.participant.initials
                      )}
                    </div>
                    <div className={`${styles.onlineDot} ${conv.participant.status === "online" ? styles.onlineDotActive : ""}`} />
                  </div>
                  <div className={styles.conversationContent}>
                    <div className={styles.conversationMeta}>
                      <strong>{conv.participant.name}</strong>
                      <span>{conv.time}</span>
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
              ))}
            </div>
          </aside>

          {/* Chat Panel */}
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
                        {activeConv.participant.avatar ? (
                          <Image src={activeConv.participant.avatar} alt={activeConv.participant.name} width={44} height={44} />
                        ) : (
                          activeConv.participant.initials
                        )}
                      </div>
                      <div className={`${styles.onlineDot} ${activeConv.participant.status === "online" ? styles.onlineDotActive : ""}`} />
                    </div>
                    <div className={styles.chatUserDetails}>
                      <strong>{activeConv.participant.name}</strong>
                      <span>{activeConv.participant.status === "online" ? "Online" : "Offline"} • {activeConv.participant.role}</span>
                    </div>
                  </div>
                  <div className={styles.chatHeaderActions}>
                    <button className={styles.circleIcon}><iconify-icon icon="lucide:phone" /></button>
                    <button className={styles.circleIcon}><iconify-icon icon="lucide:video" /></button>
                    <button className={styles.circleIcon}><iconify-icon icon="lucide:more-vertical" /></button>
                  </div>
                </header>

                <div className={styles.messagesArea}>
                  <div className={styles.dateRow}>
                    <span className={styles.datePill}>Today, October 24</span>
                  </div>

                  {activeConv.messages.map((m) => (
                    <div 
                      key={m.id} 
                      className={`${styles.messageGroup} ${m.sender === "company" ? styles.messageGroupSent : styles.messageGroupReceived}`}
                    >
                      <div className={styles.messageBubble}>{m.text}</div>
                      <div className={styles.messageMeta}>
                        {m.time}
                        {m.sender === "company" && <iconify-icon icon="lucide:check-check" style={{ fontSize: 14 }} />}
                      </div>
                    </div>
                  ))}
                </div>

                <form className={styles.composer} onSubmit={handleSendMessage}>
                  <div className={styles.composerField}>
                    <input 
                      type="text" 
                      placeholder="Type a message..." 
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                    />
                    <button type="button" className={styles.composerIconButton}>
                      <iconify-icon icon="lucide:paperclip" />
                    </button>
                  </div>
                  <button 
                    type="submit" 
                    className={styles.sendBtn}
                    disabled={!draft.trim()}
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
