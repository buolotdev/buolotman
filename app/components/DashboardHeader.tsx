"use client";

import { useEffect, useRef, useState, useTransition, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api, getImageUrl } from "../lib/api";
import { useFetch } from "../lib/useFetch";
import { SkeletonBlock } from "./skeleton/Skeleton";
import styles from "./DashboardHeader.module.css";

interface DashboardHeaderProps {
  onMenuClick?: () => void;
  searchPlaceholder?: string;
  searchQuery?: string;
  setSearchQuery?: (val: string) => void;
}

const headerTranslations: Record<string, Record<string, string>> = {
  en: {
    searchPlaceholder: "Search tasks, resources...",
    proPlan: "Pro Plan",
    freeTier: "Free Tier • Upgrade",
    notifications: "Notifications",
    markAllRead: "Mark all read",
    allCaughtUp: "You're all caught up!",
    newNotif: "New Notification",
    viewProfile: "View Public Profile",
    settings: "Account Settings",
    logout: "Logout",
  },
  fr: {
    searchPlaceholder: "Rechercher des tâches, ressources...",
    proPlan: "Forfait Pro",
    freeTier: "Forfait Gratuit • Mettre à niveau",
    notifications: "Notifications",
    markAllRead: "Tout marquer comme lu",
    allCaughtUp: "Vous êtes à jour !",
    newNotif: "Nouvelle notification",
    viewProfile: "Voir le profil public",
    settings: "Paramètres du compte",
    logout: "Se déconnecter",
  },
  rw: {
    searchPlaceholder: "Shakisha imirimo, ubufasha...",
    proPlan: "Ifatabuguzi rya Pro",
    freeTier: "Ubuntu • Guhindura",
    notifications: "Imenyekanisha",
    markAllRead: "Soma byose",
    allCaughtUp: "Nta bishya bihari!",
    newNotif: "Imenyekanisha rishya",
    viewProfile: "Reba umwirondoro",
    settings: "Igenamiterere rya konti",
    logout: "Sohoka",
  },
  ar: {
    searchPlaceholder: "البحث عن المهام والموارد...",
    proPlan: "خطة برو",
    freeTier: "المستوى المجاني • ترقية",
    notifications: "الإشعارات",
    markAllRead: "تحديد الكل كمقروء",
    allCaughtUp: "لقد اطلعت على كل شيء!",
    newNotif: "إشعار جديد",
    viewProfile: "عرض الملف العام",
    settings: "إعدادات الحساب",
    logout: "تسجيل الخروج",
  }
};

const LANGUAGES = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "rw", name: "Kinyarwanda", flag: "🇷🇼" },
];

export default function DashboardHeader({
  onMenuClick,
  searchPlaceholder,
  searchQuery,
  setSearchQuery,
}: DashboardHeaderProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [lang, setLang] = useState("en");

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateLang = () => {
      const current = localStorage.getItem("lang") || "en";
      setLang(current);
    };
    updateLang();
    window.addEventListener("languageChange", updateLang);
    return () => window.removeEventListener("languageChange", updateLang);
  }, []);

  const t = headerTranslations[lang] || headerTranslations["en"];
  const currentLangObj = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];

  const handleLanguageChange = (code: string) => {
    localStorage.setItem("lang", code);
    localStorage.setItem("user_selected_lang", "true");
    setLang(code);
    setLangOpen(false);
    document.documentElement.dir = code === "ar" ? "rtl" : "ltr";
    window.dispatchEvent(new Event("languageChange"));
  };

  // Fetch User and Notifications data
  const { data: user, loading: userLoading } = useFetch(() => api.getMe(), []);
  const userRole = (user?.role || "").toUpperCase();
  const isCompany = userRole === "COMPANY";

  // If company, also fetch company profile to get company logo and company name
  const { data: companyProfile } = useFetch(
    () => (isCompany ? api.getCompanyProfile() : Promise.resolve(null)),
    [isCompany]
  );

  const { data: notificationsData, refetch: refetchNotifs } = useFetch(() => api.getNotifications(), []);
  const notifications = Array.isArray(notificationsData) ? notificationsData : [];
  const unreadCount = notifications.filter((n: any) => !n.is_read).length;

  // Resolve Company / User Name
  const companyName = companyProfile?.company_name || user?.company_name || "";
  const userName = userLoading
    ? ""
    : isCompany
    ? (companyName || `${user?.first_name || ""} ${user?.last_name || ""}`.trim() || user?.username || "Company")
    : (`${user?.first_name || ""} ${user?.last_name || ""}`.trim() || user?.username || "User");

  // Resolve Avatar / Company Logo URL
  const avatarUrl = useMemo(() => {
    return (
      user?.avatar_url ||
      user?.avatar ||
      (user as any)?.company_profile?.logo_url ||
      companyProfile?.logo_url ||
      null
    );
  }, [user, companyProfile]);

  // Resolve Initials Fallback
  const userInitials = useMemo(() => {
    if (isCompany) {
      if (companyName) {
        const parts = companyName.split(" ").filter(Boolean);
        if (parts.length >= 2) {
          return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        }
        return companyName.substring(0, 2).toUpperCase();
      }
      return "CO";
    }
    const initials = `${(user?.first_name || "")[0] || ""}${(user?.last_name || "")[0] || ""}`.toUpperCase();
    return initials || (userName ? userName.substring(0, 2).toUpperCase() : "U");
  }, [isCompany, companyName, user, userName]);

  const isVerified = Boolean(
    user?.is_verified ||
    user?.technician_profile?.is_verified ||
    companyProfile?.is_verified ||
    (user as any)?.company_profile?.is_verified
  );

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handlers
  const handleMarkAllRead = async () => {
    try {
      const unreadNotifs = notifications.filter((n: any) => !n.is_read);
      await Promise.all(unreadNotifs.map((n: any) => api.markNotificationRead(n.id)));
      refetchNotifs();
    } catch (err) {
      console.error("Failed to mark all notifications as read", err);
    }
  };

  const handleNotificationClick = async (notif: any) => {
    try {
      if (!notif.is_read) {
        await api.markNotificationRead(notif.id).catch(() => {});
        refetchNotifs();
      }
      setNotifOpen(false);

      const role = (userRole || "").toLowerCase();
      const title = (notif.title || "").toLowerCase();
      const body = (notif.body || "").toLowerCase();
      const category = (notif.category || "").toLowerCase();

      if (notif.link) {
        if (notif.link.startsWith("/dashboard/messages")) {
          if (role === "technician") router.push("/dashboard/technician/messages");
          else if (role === "company") router.push("/dashboard/company/messages");
          else router.push("/dashboard/client/messages");
        } else {
          router.push(notif.link);
        }
        return;
      }

      // Smart routing if no explicit link
      if (category === "message" || title.includes("message") || body.includes("message")) {
        if (role === "technician") router.push("/dashboard/technician/messages");
        else if (role === "company") router.push("/dashboard/company/messages");
        else router.push("/dashboard/client/messages");
      } else if (category === "payment" || title.includes("payment") || title.includes("escrow") || title.includes("balance") || title.includes("wallet")) {
        if (role === "technician") router.push("/dashboard/technician/wallet");
        else if (role === "company") router.push("/dashboard/company/wallet");
        else router.push("/dashboard/client/payments");
      } else if (category === "task" || category === "project" || title.includes("task") || title.includes("project") || title.includes("bid")) {
        if (role === "technician") router.push("/dashboard/technician/projects");
        else if (role === "company") router.push("/dashboard/company/projects");
        else router.push("/dashboard/client/projects");
      } else if (category === "dispute" || title.includes("dispute") || title.includes("ticket") || title.includes("support")) {
        if (role === "technician") router.push("/dashboard/technician/support");
        else if (role === "client") router.push("/dashboard/client/support");
      }
    } catch (err) {
      console.error("Failed to process notification click", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_role");
    startTransition(() => {
      router.push("/login");
    });
  };

  const getProfileLink = () => {
    const role = userRole.toLowerCase();
    if (role === "admin") return "/dashboard/admin/settings";
    if (role === "company") return "/dashboard/company/profile";
    if (role === "technician") return user?.id ? `/profile/${user.id}` : "/dashboard/technician/profile";
    return "/dashboard/client/profile";
  };

  const getSettingsLink = () => {
    const role = userRole.toLowerCase();
    if (role === "admin") return "/dashboard/admin/settings";
    if (role === "company") return "/dashboard/company/settings";
    if (role === "technician") return "/dashboard/technician/settings";
    return "/dashboard/client/settings";
  };

  return (
    <header className={styles.topbar}>
      <div className={styles.topbarLeft}>
        {onMenuClick && (
          <button type="button" className={styles.mobileMenuButton} onClick={onMenuClick} aria-label="Toggle Navigation Menu">
            <iconify-icon icon="lucide:menu" />
          </button>
        )}
        {setSearchQuery !== undefined && (
          <div className={styles.searchBar}>
            <iconify-icon icon="lucide:search" />
            <input
              type="search"
              value={searchQuery || ""}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={searchPlaceholder || t.searchPlaceholder}
            />
          </div>
        )}
      </div>

      <div className={styles.topbarActions}>
        {/* Subscription Tier Badge */}
        {(userRole === "TECHNICIAN" || userRole === "COMPANY" || userRole === "CLIENT") && (
          <Link
            href="/upgrade"
            className={styles.upgradeBadge}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 14px",
              background: isVerified ? "rgba(255, 69, 0, 0.12)" : "#f8fafc",
              color: isVerified ? "#ff4500" : "#001f3f",
              borderRadius: 999,
              fontSize: "0.78rem",
              fontWeight: 800,
              textDecoration: "none",
              border: isVerified ? "1px solid rgba(255, 69, 0, 0.25)" : "1px solid #e2e8f0",
              transition: "all 0.2s ease",
            }}
          >
            <iconify-icon
              icon={isVerified ? "lucide:sparkles" : "lucide:arrow-up-circle"}
              style={{ color: "#ff4500", fontSize: 15 }}
            />
            <span>{isVerified ? t.proPlan : t.freeTier}</span>
          </Link>
        )}

        {/* LANGUAGE SWITCHER FLAG DROPDOWN */}
        <div className={styles.actionWrapper} ref={langRef}>
          <button
            type="button"
            className={`${styles.iconButton} ${langOpen ? styles.iconButtonActive : ""}`}
            onClick={() => {
              setLangOpen(!langOpen);
              setNotifOpen(false);
              setProfileOpen(false);
            }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "0 10px",
              width: "auto",
              minWidth: "44px",
              borderRadius: "12px",
              fontWeight: 700,
              fontSize: "13px",
              color: "#001f3f"
            }}
            aria-label="Change Language"
          >
            <span style={{ fontSize: "17px", lineHeight: 1 }}>{currentLangObj.flag}</span>
            <span style={{ textTransform: "uppercase", fontSize: "12px", letterSpacing: "0.5px" }}>{currentLangObj.code}</span>
            <iconify-icon icon="lucide:chevron-down" style={{ fontSize: "14px", color: "#64748b" }} />
          </button>

          {langOpen && (
            <div
              className={styles.dropdown}
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                right: 0,
                background: "#ffffff",
                borderRadius: "14px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 10px 25px rgba(0, 31, 63, 0.1)",
                minWidth: "160px",
                padding: "6px",
                zIndex: 100,
                display: "flex",
                flexDirection: "column",
                gap: "2px"
              }}
            >
              {LANGUAGES.map((item) => (
                <button
                  type="button"
                  key={item.code}
                  onClick={() => handleLanguageChange(item.code)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    width: "100%",
                    padding: "8px 12px",
                    border: "none",
                    background: lang === item.code ? "rgba(255, 69, 0, 0.08)" : "transparent",
                    color: lang === item.code ? "#ff4500" : "#001f3f",
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontWeight: lang === item.code ? 700 : 500,
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.15s ease"
                  }}
                >
                  <span style={{ fontSize: "16px" }}>{item.flag}</span>
                  <span>{item.name}</span>
                  {lang === item.code && (
                    <iconify-icon icon="lucide:check" style={{ marginLeft: "auto", color: "#ff4500" }} />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications button and dropdown */}
        <div className={styles.actionWrapper} ref={notifRef}>
          <button
            type="button"
            className={`${styles.iconButton} ${notifOpen ? styles.iconButtonActive : ""}`}
            onClick={() => {
              setNotifOpen(!notifOpen);
              setProfileOpen(false);
              setLangOpen(false);
            }}
            aria-label={`Notifications, ${unreadCount} unread`}
          >
            <iconify-icon icon="lucide:bell" />
            {unreadCount > 0 && <span className={styles.notificationDot} />}
          </button>

          {notifOpen && (
            <div className={`${styles.dropdown} ${styles.notificationDropdown}`}>
              <div className={styles.dropdownHeader}>
                <span className={styles.dropdownTitle}>{t.notifications}</span>
                {unreadCount > 0 && (
                  <button type="button" className={styles.markAllButton} onClick={handleMarkAllRead}>
                    {t.markAllRead}
                  </button>
                )}
              </div>
              <div className={styles.notificationList}>
                {notifications.length === 0 ? (
                  <div className={styles.emptyState}>
                    <iconify-icon icon="lucide:check-circle" />
                    <p>{t.allCaughtUp}</p>
                  </div>
                ) : (
                  notifications.map((notif: any) => (
                    <div
                      key={notif.id}
                      className={`${styles.notificationItem} ${!notif.is_read ? styles.notificationUnread : ""}`}
                      onClick={() => handleNotificationClick(notif)}
                    >
                      <div className={styles.notificationItemIcon}>
                        <iconify-icon icon={notif.category === "dispute" ? "lucide:alert-circle" : notif.category === "payment" ? "lucide:credit-card" : "lucide:info"} />
                      </div>
                      <div className={styles.notificationItemContent}>
                        <div className={styles.notificationItemTitle}>{notif.title || t.newNotif}</div>
                        <div className={styles.notificationItemBody}>{notif.body || ""}</div>
                        {notif.created_at && (
                          <div className={styles.notificationItemTime}>
                            {new Date(notif.created_at).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                          </div>
                        )}
                      </div>
                      {!notif.is_read && <span className={styles.notificationItemIndicator} />}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar and dropdown */}
        <div className={styles.actionWrapper} ref={profileRef}>
          <div
            className={`${styles.userMenu} ${profileOpen ? styles.userMenuActive : ""}`}
            onClick={() => {
              setProfileOpen(!profileOpen);
              setNotifOpen(false);
              setLangOpen(false);
            }}
          >
            <div className={styles.userAvatar}>
              {userLoading ? (
                <SkeletonBlock style={{ width: 38, height: 38, borderRadius: "50%" }} />
              ) : avatarUrl ? (
                <img
                  src={getImageUrl(avatarUrl)}
                  alt={userName || "Profile photo"}
                  style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%", display: "block" }}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                userInitials
              )}
            </div>
            <div className={styles.userDetails}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span className={styles.userName}>
                  {userLoading ? <SkeletonBlock style={{ width: 80, height: 14 }} /> : userName}
                </span>
                {isVerified && (
                  <span title="Verified Account" style={{ display: 'inline-flex', alignItems: 'center', color: '#16a34a', fontSize: '15px' }}>
                    <iconify-icon icon="lucide:badge-check" />
                  </span>
                )}
              </div>
              <span className={styles.userRole}>{userRole}</span>
            </div>
          </div>

          {profileOpen && (
            <div className={`${styles.dropdown} ${styles.profileDropdown}`}>
              <div className={styles.profileSummary}>
                <div className={styles.profileSummaryAvatar}>
                  {avatarUrl ? (
                    <img
                      src={getImageUrl(avatarUrl)}
                      alt={userName || "Profile photo"}
                      style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%", display: "block" }}
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    userInitials
                  )}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <div className={styles.userName}>{userName}</div>
                    {isVerified && (
                      <span title="Verified Account" style={{ display: 'inline-flex', alignItems: 'center', color: '#16a34a', fontSize: '16px' }}>
                        <iconify-icon icon="lucide:badge-check" />
                      </span>
                    )}
                  </div>
                  <span className={styles.userRole}>{userRole}</span>
                </div>
              </div>
              <Link href={getProfileLink()} className={styles.profileMenuLink} onClick={() => setProfileOpen(false)}>
                <iconify-icon icon="lucide:eye" />
                <span>{t.viewProfile}</span>
              </Link>
              <Link href={getSettingsLink()} className={styles.profileMenuLink} onClick={() => setProfileOpen(false)}>
                <iconify-icon icon="lucide:settings" />
                <span>{t.settings}</span>
              </Link>
              <div className={styles.profileDivider} />
              <button type="button" className={styles.profileLogoutButton} onClick={handleLogout}>
                <iconify-icon icon="lucide:log-out" />
                <span>{t.logout}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

