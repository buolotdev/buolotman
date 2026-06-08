"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import { useToast } from "@/app/components/Toast";
import { useDialog } from "@/app/components/Dialog";
import { SkeletonBlock, SkeletonCard } from "@/app/components/skeleton/Skeleton";
import styles from "./page.module.css";
import LogoutButton from "@/app/components/LogoutButton";

const toneClasses = ["toneBlue", "toneGold", "toneGreen", "toneCoral", "toneSlate", "tonePurple"];

export default function TechnicianProfilePage() {
  const toast = useToast();
  const dialog = useDialog();
  const { data: userData, loading: userLoading } = useFetch(() => api.getMe(), []);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [editing, setEditing] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  const userName = `${userData?.first_name ?? ""} ${userData?.last_name ?? ""}`.trim() || userData?.username || "";
  const userInitials = useMemo(() => {
    const first = userData?.first_name?.[0] ?? "";
    const last = userData?.last_name?.[0] ?? "";
    return `${first}${last}`.toUpperCase();
  }, [userData]);
  const userRole = userData?.role ?? userData?.job_title ?? "";
  const userLocation = userData?.location ?? "";
  const userRating = userData?.rating ?? "";
  const userReviewCount = userData?.review_count ?? userData?.reviews_count ?? 0;
  const userAbout = userData?.bio ?? userData?.about ?? "";
  const userSkills: string[] = userData?.skills ?? [];
  const userCompletedTasks = userData?.completed_tasks ?? userData?.completed_jobs ?? 0;
  const userSuccessRate = userData?.success_rate ?? "";
  const userResponseTime = userData?.response_time ?? "";
  const userMemberSince = userData?.member_since ?? userData?.date_joined ?? "";
  const portfolioItems: { id: string; title: string; tone: string }[] = useMemo(() => {
    const raw = userData?.portfolio ?? [];
    return raw.map((p: any, i: number) => ({
      id: String(p.id ?? i),
      title: p.title ?? "",
      tone: toneClasses[i % toneClasses.length],
    }));
  }, [userData]);
  const reviews: { id: string; name: string; initials: string; date: string; rating: number; text: string }[] = useMemo(() => {
    const raw = userData?.reviews ?? [];
    return raw.map((r: any) => {
      const first = r.first_name?.[0] ?? r.name?.[0] ?? "";
      const last = r.last_name?.[0] ?? (r.name?.split(" ")[1]?.[0] ?? "");
      return {
        id: String(r.id),
        name: `${r.first_name ?? ""} ${r.last_name ?? ""}`.trim() || r.name || r.reviewer_name || "",
        initials: `${first}${last}`.toUpperCase(),
        date: r.date ?? r.created_at ?? "",
        rating: r.rating ?? 0,
        text: r.text ?? r.comment ?? "",
      };
    });
  }, [userData]);

  const visibleReviews = showAllReviews ? reviews : reviews.slice(0, 3);
  const loading = userLoading;

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/dashboard/technician/profile`);
      setShareCopied(true);
      window.setTimeout(() => setShareCopied(false), 1600);
    } catch {
      setShareCopied(false);
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.layout}>
        <aside className={`${styles.sidebar} ${mobileNavOpen ? styles.sidebarOpen : ""}`}>
          <div className={styles.sidebarTop}>
            <Link href="/" className={styles.brand} aria-label="Boulot Man home">
              <Image src="/boulotman-logo.png" alt="Boulot Man" width={220} height={56} className={styles.brandImage} priority />
            </Link>
            <button type="button" className={styles.sidebarClose} aria-label="Close navigation" onClick={() => setMobileNavOpen(false)}>
              <iconify-icon icon="lucide:x" />
            </button>
          </div>

          <div className={styles.profileCardMini}>
            <div className={styles.profileAvatarMini}>{userInitials}</div>
            <div className={styles.profileMetaMini}>
              <strong>{userName}</strong>
              <span>{userRole}</span>
            </div>
          </div>

          <nav className={styles.sidebarNav} aria-label="Technician navigation">
            <Link href="/dashboard/technician" className={styles.navItem}>
              <span className={styles.navIcon}><iconify-icon icon="lucide:layout-dashboard" /></span>
              <span>Dashboard</span>
            </Link>
            <Link href="/dashboard/technician/tasks" className={styles.navItem}>
              <span className={styles.navIcon}><iconify-icon icon="lucide:search" /></span>
              <span>Browse Tasks</span>
            </Link>
            <Link href="/dashboard/technician/bids" className={styles.navItem}>
              <span className={styles.navIcon}><iconify-icon icon="lucide:file-text" /></span>
              <span>My Bids</span>
            </Link>
            <Link href="/dashboard/technician/messages" className={styles.navItem}>
              <span className={styles.navIcon}><iconify-icon icon="lucide:message-square" /></span>
              <span>Messages</span>
            </Link>
            <Link href="/dashboard/technician/wallet" className={styles.navItem}>
              <span className={styles.navIcon}><iconify-icon icon="lucide:wallet" /></span>
              <span>Wallet</span>
            </Link>
            <Link href="/dashboard/technician/profile" className={`${styles.navItem} ${styles.navItemActive}`}>
              <span className={styles.navIcon}><iconify-icon icon="lucide:user" /></span>
              <span>Profile</span>
            </Link>
          </nav>

          <LogoutButton className={styles.logoutButton} />
        </aside>

        <div className={styles.main}>
          <header className={styles.topbar}>
            <div className={styles.topbarLeft}>
              <button type="button" className={styles.mobileMenuButton} aria-label="Open navigation" onClick={() => setMobileNavOpen(true)}>
                <iconify-icon icon="lucide:menu" />
              </button>
              <label className={styles.searchBox}>
                <iconify-icon icon="lucide:search" />
                <input type="search" placeholder="Search tasks or users..." aria-label="Search tasks or users" />
              </label>
            </div>

            <div className={styles.topbarActions}>
              <button type="button" className={styles.iconButton} aria-label="Notifications">
                <iconify-icon icon="lucide:bell" />
                <span className={styles.notificationDot} />
              </button>
              <div className={styles.topbarProfile}>
                <div className={styles.topbarAvatar}>{userInitials}</div>
                <div className={styles.topbarProfileLines}>
                  <strong>{userName}</strong>
                  <span>{userRole}</span>
                </div>
              </div>
            </div>
          </header>

          <div className={styles.content}>
            <section className={styles.heroCard}>
              <div className={styles.cover} />
              <div className={styles.heroBody}>
                <div className={styles.identityBlock}>
                  {loading ? (
                    <SkeletonBlock style={{ width: 80, height: 80, borderRadius: "50%" }} />
                  ) : (
                    <div className={styles.avatarLarge}>{userInitials}</div>
                  )}
                  <div className={styles.identityMeta}>
                    <div className={styles.nameRow}>
                      {loading ? (
                        <SkeletonBlock style={{ width: 200, height: 28 }} />
                      ) : (
                        <>
                          <h1>{userName}</h1>
                          <span className={styles.verifiedBadge}>
                            <iconify-icon icon="lucide:badge-check" />
                          </span>
                        </>
                      )}
                    </div>
                    <div className={styles.metaList}>
                      {userRole ? <span><iconify-icon icon="lucide:wrench" />{userRole}</span> : null}
                      {userLocation ? <span><iconify-icon icon="lucide:map-pin" />{userLocation}</span> : null}
                      {userRating !== "" && userRating !== null && userRating !== undefined ? (
                        <span><iconify-icon icon="lucide:star" />{userRating} ({userReviewCount} Reviews)</span>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className={styles.heroActions}>
                  <button type="button" className={styles.outlineButton} onClick={handleShare}>
                    <iconify-icon icon="lucide:share-2" />
                    {shareCopied ? "Copied" : "Share"}
                  </button>
                  <button
                    type="button"
                    className={styles.primaryButton}
                    onClick={async () => {
                      const ok = await dialog.confirm({
                        title: "Save profile?",
                        message: "This will sync your latest info to the database.",
                        confirmText: "Save",
                      });
                      if (!ok) return;
                      try {
                        await api.updateProfile({
                          first_name: userData?.first_name,
                          last_name: userData?.last_name,
                          phone: userData?.phone,
                          country: userData?.country,
                        });
                        toast.success("Profile saved", "Your changes are live.");
                      } catch (err: any) {
                        toast.error("Save failed", err?.message || "Please try again.");
                      }
                    }}
                  >
                    <iconify-icon icon="lucide:save" />
                    Save Profile
                  </button>
                </div>
              </div>
            </section>

            <div className={styles.profileGrid}>
              <div className={styles.leftColumn}>
                <section className={styles.card}>
                  <h2><iconify-icon icon="lucide:user" />About Me</h2>
                  {loading ? (
                    <SkeletonBlock style={{ height: 80 }} />
                  ) : userAbout ? (
                    <p>{userAbout}</p>
                  ) : (
                    <p>No bio provided yet.</p>
                  )}
                </section>

                <section className={styles.card}>
                  <h2><iconify-icon icon="lucide:image" />Portfolio Gallery</h2>
                  {loading ? (
                    <div className={styles.portfolioGrid}>
                      {Array.from({ length: 4 }).map((_, i) => (
                        <SkeletonBlock key={i} style={{ height: 80, borderRadius: 8 }} />
                      ))}
                    </div>
                  ) : portfolioItems.length ? (
                    <div className={styles.portfolioGrid}>
                      {portfolioItems.map((item) => (
                        <article key={item.id} className={`${styles.portfolioCard} ${styles[item.tone]}`}>
                          <strong>{item.title}</strong>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <p>No portfolio items yet.</p>
                  )}
                </section>

                <section className={styles.card}>
                  <h2><iconify-icon icon="lucide:message-square" />Client Reviews</h2>
                  {loading ? (
                    <div className={styles.reviewList}>
                      {Array.from({ length: 2 }).map((_, i) => (
                        <SkeletonCard key={i} />
                      ))}
                    </div>
                  ) : reviews.length ? (
                    <>
                      <div className={styles.reviewList}>
                        {visibleReviews.map((review) => (
                          <article key={review.id} className={styles.reviewItem}>
                            <div className={styles.reviewHeader}>
                              <div className={styles.reviewer}>
                                <div className={styles.reviewerAvatar}>{review.initials}</div>
                                <div>
                                  <strong>{review.name}</strong>
                                  <span>{review.date}</span>
                                </div>
                              </div>
                              <div className={styles.reviewStars}>
                                {Array.from({ length: 5 }, (_, index) => (
                                  <iconify-icon key={`${review.id}-${index}`} icon={index < review.rating ? "lucide:star" : "lucide:star"} className={index < review.rating ? styles.starFilled : styles.starMuted} />
                                ))}
                              </div>
                            </div>
                            <p>{review.text}</p>
                          </article>
                        ))}
                      </div>
                      <button type="button" className={styles.outlineButton} onClick={() => setShowAllReviews((value) => !value)}>
                        {showAllReviews ? "Show Less Reviews" : `View All ${reviews.length} Reviews`}
                      </button>
                    </>
                  ) : (
                    <p>No reviews yet.</p>
                  )}
                </section>
              </div>

              <div className={styles.rightColumn}>
                <section className={styles.card}>
                  <h2><iconify-icon icon="lucide:bar-chart-2" />At a Glance</h2>
                  {loading ? (
                    <div className={styles.statList}>
                      {Array.from({ length: 4 }).map((_, i) => (
                        <SkeletonBlock key={i} style={{ height: 40, marginBottom: 8 }} />
                      ))}
                    </div>
                  ) : (
                    <div className={styles.statList}>
                      <div className={styles.statItem}>
                        <span className={styles.statIcon}><iconify-icon icon="lucide:check-square" /></span>
                        <div><strong>{userCompletedTasks}</strong><small>Completed Tasks</small></div>
                      </div>
                      {userSuccessRate ? (
                        <div className={styles.statItem}>
                          <span className={styles.statIcon}><iconify-icon icon="lucide:trending-up" /></span>
                          <div><strong>{userSuccessRate}</strong><small>Success Rate</small></div>
                        </div>
                      ) : null}
                      {userResponseTime ? (
                        <div className={styles.statItem}>
                          <span className={styles.statIcon}><iconify-icon icon="lucide:clock" /></span>
                          <div><strong>{userResponseTime}</strong><small>Avg. Response Time</small></div>
                        </div>
                      ) : null}
                      {userMemberSince ? (
                        <div className={styles.statItem}>
                          <span className={styles.statIcon}><iconify-icon icon="lucide:calendar" /></span>
                          <div><strong>{userMemberSince}</strong><small>Member Since</small></div>
                        </div>
                      ) : null}
                    </div>
                  )}
                </section>

                <section className={styles.card}>
                  <h2><iconify-icon icon="lucide:award" />Skills & Expertise</h2>
                  {loading ? (
                    <div className={styles.skillList}>
                      {Array.from({ length: 4 }).map((_, i) => (
                        <SkeletonBlock key={i} style={{ width: 100, height: 28, borderRadius: 14 }} />
                      ))}
                    </div>
                  ) : userSkills.length ? (
                    <div className={styles.skillList}>
                      {userSkills.map((skill) => (
                        <span key={skill} className={styles.skillPill}>{skill}</span>
                      ))}
                    </div>
                  ) : (
                    <p>No skills listed yet.</p>
                  )}
                </section>

                <section className={styles.card}>
                  <h2><iconify-icon icon="lucide:shield-check" />Verifications</h2>
                  <div className={styles.verifyList}>
                    {["Identity", "Phone Number", "Email Address", "Professional License"].map((item) => (
                      <div key={item} className={styles.verifyItem}>
                        <span>{item}</span>
                        <iconify-icon icon="lucide:check-circle-2" />
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
