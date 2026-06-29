"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "../lib/api";
import { useFetch } from "../lib/useFetch";
import { SkeletonBlock } from "./skeleton/Skeleton";
import styles from "./DashboardHeader.module.css";

interface DashboardHeaderProps {
  onMenuClick?: () => void;
  searchPlaceholder?: string;
  searchQuery?: string;
  setSearchQuery?: (val: string) => void;
}

export default function DashboardHeader({
  onMenuClick,
  searchPlaceholder = "Search tasks, resources...",
  searchQuery,
  setSearchQuery,
}: DashboardHeaderProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Fetch User and Notifications data
  const { data: user, loading: userLoading } = useFetch(() => api.getMe(), []);
  const { data: notificationsData, refetch: refetchNotifs } = useFetch(() => api.getNotifications(), []);

  const notifications = Array.isArray(notificationsData) ? notificationsData : [];
  const unreadCount = notifications.filter((n: any) => !n.is_read).length;

  const userName = user ? `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.username || "" : "";
  const userInitials = user ? `${(user.first_name || "")[0] || ""}${(user.last_name || "")[0] || ""}`.toUpperCase() : "";
  const userRole = user?.role || "";

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
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
        await api.markNotificationRead(notif.id);
        refetchNotifs();
      }
      if (notif.link) {
        setNotifOpen(false);
        router.push(notif.link);
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
    if (role === "technician") return "/dashboard/technician/profile";
    return "/dashboard/client/profile";
  };

  const getSettingsLink = () => {
    const role = userRole.toLowerCase();
    if (role === "admin") return "/dashboard/admin/settings";
    if (role === "company") return "/dashboard/company/settings";
    if (role === "technician") return "/dashboard/technician/profile";
    return "/dashboard/client/profile";
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
              placeholder={searchPlaceholder}
            />
          </div>
        )}
      </div>

      <div className={styles.topbarActions}>
        {/* Notifications button and dropdown */}
        <div className={styles.actionWrapper} ref={notifRef}>
          <button
            type="button"
            className={`${styles.iconButton} ${notifOpen ? styles.iconButtonActive : ""}`}
            onClick={() => {
              setNotifOpen(!notifOpen);
              setProfileOpen(false);
            }}
            aria-label={`Notifications, ${unreadCount} unread`}
          >
            <iconify-icon icon="lucide:bell" />
            {unreadCount > 0 && <span className={styles.notificationDot} />}
          </button>

          {notifOpen && (
            <div className={`${styles.dropdown} ${styles.notificationDropdown}`}>
              <div className={styles.dropdownHeader}>
                <span className={styles.dropdownTitle}>Notifications</span>
                {unreadCount > 0 && (
                  <button type="button" className={styles.markAllButton} onClick={handleMarkAllRead}>
                    Mark all read
                  </button>
                )}
              </div>
              <div className={styles.notificationList}>
                {notifications.length === 0 ? (
                  <div className={styles.emptyState}>
                    <iconify-icon icon="lucide:check-circle" />
                    <p>You&apos;re all caught up!</p>
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
                        <div className={styles.notificationItemTitle}>{notif.title || "New Notification"}</div>
                        <div className={styles.notificationItemBody}>{notif.body || ""}</div>
                        {notif.created_at && (
                          <div className={styles.notificationItemTime}>
                            {new Date(notif.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
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
            }}
          >
            <div className={styles.userAvatar}>
              {userLoading ? <SkeletonBlock style={{ width: 36, height: 36, borderRadius: "50%" }} /> : userInitials}
            </div>
            <div className={styles.userDetails}>
              <span className={styles.userName}>
                {userLoading ? <SkeletonBlock style={{ width: 80, height: 14 }} /> : userName}
              </span>
              <span className={styles.userRole}>{userRole}</span>
            </div>
          </div>

          {profileOpen && (
            <div className={`${styles.dropdown} ${styles.profileDropdown}`}>
              <div className={styles.profileSummary}>
                <div className={styles.profileSummaryAvatar}>{userInitials}</div>
                <div>
                  <div className={styles.userName}>{userName}</div>
                  <span className={styles.userRole}>{userRole}</span>
                </div>
              </div>
              <Link href={getProfileLink()} className={styles.profileMenuLink} onClick={() => setProfileOpen(false)}>
                <iconify-icon icon="lucide:user" />
                <span>View Profile</span>
              </Link>
              <Link href={getSettingsLink()} className={styles.profileMenuLink} onClick={() => setProfileOpen(false)}>
                <iconify-icon icon="lucide:settings" />
                <span>Account Settings</span>
              </Link>
              <div className={styles.profileDivider} />
              <button type="button" className={styles.profileLogoutButton} onClick={handleLogout}>
                <iconify-icon icon="lucide:log-out" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
