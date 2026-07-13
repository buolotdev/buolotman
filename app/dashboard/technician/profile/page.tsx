"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useMemo, useState } from "react";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import { useToast } from "@/app/components/Toast";
import { useDialog } from "@/app/components/Dialog";
import { SkeletonBlock, SkeletonCard } from "@/app/components/skeleton/Skeleton";
import styles from "./page.module.css";
import LogoutButton from "@/app/components/LogoutButton";
import DashboardHeader from "@/app/components/DashboardHeader";
import ImageCropperModal from "@/app/components/ImageCropperModal";

const toneClasses = ["toneBlue", "toneGold", "toneGreen", "toneCoral", "toneSlate", "tonePurple"];

export default function TechnicianProfilePage() {
  const toast = useToast();
  const dialog = useDialog();
  const { data: userData, loading: userLoading } = useFetch(() => api.getMe(), []);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [editing, setEditing] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);
  const [bannerUploading, setBannerUploading] = useState(false);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);
  const [cropData, setCropData] = useState<{ src: string; type: 'avatar' | 'banner' } | null>(null);
  const { data: rawDocuments, refetch: mutateDocuments } = useFetch(() => api.getTechnicianDocuments(), []);
  const documents = rawDocuments || [];
  const [documentUploading, setDocumentUploading] = useState(false);

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

  const handleAvatarClick = () => {
    avatarInputRef.current?.click();
  };

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'banner') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setCropData({ src: reader.result as string, type });
    };
    reader.readAsDataURL(file);
    // reset input so the same file can be selected again if needed
    if (type === 'avatar' && avatarInputRef.current) avatarInputRef.current.value = "";
    if (type === 'banner' && bannerInputRef.current) bannerInputRef.current.value = "";
  };

  const onDocumentSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setDocumentUploading(true);
    try {
      // First upload the file
      const result = await api.uploadTechnicianDocument(file);
      // Then link the uploaded file to the profile
      await api.createTechnicianDocument({
        title: file.name,
        document_type: "id", // default, could add a UI for selecting type
        file_url: result.file_url,
      });
      toast.success("Document uploaded", "Your document has been sent for verification.");
      mutateDocuments();
    } catch (err: any) {
      toast.error("Upload failed", err?.message || "Please try again.");
    } finally {
      setDocumentUploading(false);
      if (documentInputRef.current) documentInputRef.current.value = "";
    }
  };

  const deleteDocument = async (id: number) => {
    if (!await dialog.confirm({ title: "Delete Document", message: "Are you sure you want to delete this document?" })) return;
    try {
      await api.deleteTechnicianDocument(id);
      toast.success("Deleted", "Document removed.");
      mutateDocuments();
    } catch (err: any) {
      toast.error("Error", "Could not delete document.");
    }
  };

  const handleCropComplete = async (croppedFile: File) => {
    if (!cropData) return;
    const type = cropData.type;
    setCropData(null); // close modal

    if (type === 'avatar') {
      setAvatarUploading(true);
      try {
        const result = await api.uploadAvatar(croppedFile);
        setAvatarUrl(result.avatar_url);
        toast.success("Avatar updated", "Your profile photo has been updated.");
      } catch (err: any) {
        toast.error("Upload failed", err?.message || "Please try again.");
      } finally {
        setAvatarUploading(false);
      }
    } else if (type === 'banner') {
      setBannerUploading(true);
      try {
        const result = await api.uploadBanner(croppedFile);
        setBannerUrl(result.banner_url);
        toast.success("Banner updated", "Your profile banner has been updated.");
      } catch (err: any) {
        toast.error("Upload failed", err?.message || "Please try again.");
      } finally {
        setBannerUploading(false);
      }
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
          <DashboardHeader
            onMenuClick={() => setMobileNavOpen(true)}
          />

          <div className={styles.content}>
            <section className={styles.heroCard}>
              <div
                className={styles.cover}
                onClick={() => bannerInputRef.current?.click()}
                title="Click to change banner"
                style={{
                  cursor: "pointer",
                  position: "relative",
                  backgroundImage: (bannerUrl || userData?.banner_url)
                    ? `url(${bannerUrl || userData?.banner_url})`
                    : undefined,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {/* Gradient overlay always visible for depth */}
                <div style={{
                  position: "absolute", inset: 0,
                  background: (bannerUrl || userData?.banner_url)
                    ? "linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.35) 100%)"
                    : "transparent",
                  borderRadius: "inherit",
                }} />
                {/* Upload hint overlay */}
                <div className={styles.bannerOverlay}>
                  <div className={styles.bannerUploadHint}>
                    {bannerUploading ? (
                      <><iconify-icon icon="lucide:loader" className={styles.spinIcon} /> Uploading...</>
                    ) : (
                      <><iconify-icon icon="lucide:camera" /> {(bannerUrl || userData?.banner_url) ? "Change Banner" : "Add Cover Photo"}</>
                    )}
                  </div>
                </div>
                <input
                  ref={bannerInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  style={{ display: "none" }}
                  onChange={(e) => onFileSelect(e, 'banner')}
                />
              </div>
              <div className={styles.heroBody}>
                <div className={styles.identityBlock}>
                  {loading ? (
                    <SkeletonBlock style={{ width: 80, height: 80, borderRadius: "50%" }} />
                  ) : (
                    <div
                      className={styles.avatarLarge}
                      onClick={handleAvatarClick}
                      title="Click to change photo"
                      style={{ cursor: "pointer", position: "relative" }}
                    >
                      {avatarUrl || userData?.avatar_url ? (
                        <Image
                          src={avatarUrl || userData?.avatar_url}
                          alt="Profile photo"
                          fill
                          style={{ objectFit: "cover", borderRadius: "50%" }}
                        />
                      ) : (
                        userInitials
                      )}
                      <div style={{
                        position: "absolute", inset: 0, borderRadius: "50%",
                        background: "rgba(0,0,0,0.35)", display: "flex",
                        alignItems: "center", justifyContent: "center",
                        opacity: avatarUploading ? 1 : 0, transition: "opacity 0.2s",
                        fontSize: 13, color: "#fff", fontWeight: 600,
                      }}>
                        {avatarUploading ? "..." : <iconify-icon icon="lucide:camera" />}
                      </div>
                      <input
                        ref={avatarInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        style={{ display: "none" }}
                        onChange={(e) => onFileSelect(e, 'avatar')}
                      />
                    </div>
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
                  <h2><iconify-icon icon="lucide:shield-check" />Verifications & Documents</h2>
                  <div className={styles.verifyList}>
                    {["Identity", "Phone Number", "Email Address"].map((item) => (
                      <div key={item} className={styles.verifyItem}>
                        <span>{item}</span>
                        <iconify-icon icon="lucide:check-circle-2" />
                      </div>
                    ))}
                  </div>
                  
                  <div className={styles.documentsArea}>
                    <div className={styles.documentsHeader}>
                      <h3>Uploaded Documents</h3>
                      <button 
                        className={styles.outlineButton} 
                        style={{ padding: "6px 12px", fontSize: "14px" }}
                        onClick={() => documentInputRef.current?.click()}
                        disabled={documentUploading}
                      >
                        {documentUploading ? "Uploading..." : "Upload Document"}
                      </button>
                      <input
                        ref={documentInputRef}
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg"
                        style={{ display: "none" }}
                        onChange={onDocumentSelect}
                      />
                    </div>
                    {documents.length > 0 ? (
                      <div className={styles.documentList}>
                        {documents.map((doc: any) => (
                          <div key={doc.id} className={styles.documentItem}>
                            <iconify-icon icon="lucide:file-text" className={styles.docIcon} />
                            <div className={styles.docInfo}>
                              <strong>{doc.title}</strong>
                              <span>{doc.is_verified ? "Verified" : "Pending Verification"}</span>
                            </div>
                            <div className={styles.docActions}>
                              <a href={doc.file_url} target="_blank" rel="noreferrer" title="View">
                                <iconify-icon icon="lucide:eye" />
                              </a>
                              <button onClick={() => deleteDocument(doc.id)} title="Delete" className={styles.deleteBtn}>
                                <iconify-icon icon="lucide:trash-2" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className={styles.noDocuments}>No documents uploaded yet. Upload your ID or certifications.</p>
                    )}
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>

      {cropData && (
        <ImageCropperModal
          imageSrc={cropData.src}
          aspectRatio={cropData.type === 'avatar' ? 1 : 1200 / 300}
          isCircular={cropData.type === 'avatar'}
          onCropComplete={handleCropComplete}
          onCancel={() => setCropData(null)}
        />
      )}
    </main>
  );
}
