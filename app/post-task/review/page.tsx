"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import { formatXOF } from "@/app/lib/format";
import { useTaskDraft } from "../TaskDraftContext";
import { clearFilesFromDB } from "../idb";

type NavKey = "dashboard" | "tasks" | "messages" | "payments" | "saved" | "profile";

const navItems: Array<{ key: NavKey; label: string; icon: string; href: string }> = [
  { key: "dashboard", label: "Dashboard", icon: "lucide:layout-dashboard", href: "/dashboard/client" },
  { key: "tasks", label: "My Tasks", icon: "lucide:clipboard-list", href: "/dashboard/client" },
  { key: "messages", label: "Messages", icon: "lucide:message-square", href: "/dashboard/client" },
  { key: "payments", label: "Payments", icon: "lucide:credit-card", href: "/dashboard/client" },
  { key: "saved", label: "Saved", icon: "lucide:bookmark", href: "/dashboard/client" },
  { key: "profile", label: "Profile", icon: "lucide:user", href: "/dashboard/client" },
];

const DRAFT_KEY = "boulotman_post_task_draft";

type DraftPayload = {
  title: string;
  category: string;
  subcategory: string;
  description: string;
  address: string;
  apartment: string;
  city: string;
  expectedDate: string;
  timePreference: string;
  budget: string;
  budgetMode: string;
  urgency: string;
  serviceType: string;
  contactMethods: string[];
  materialsProvided: boolean;
  skills: string[];
};

function readDraft(): DraftPayload | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as DraftPayload;
  } catch {
    return null;
  }
}

function dataURLtoFile(dataurl: string, filename: string) {
  var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)![1],
    bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

export default function TaskReviewPage() {
  const router = useRouter();
  const { data: meData } = useFetch(() => api.getMe(), []);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [draft, setDraft] = useState<DraftPayload | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { files, setFiles } = useTaskDraft();

  useEffect(() => {
    setDraft(readDraft());
  }, []);

  const userInitials = (() => {
    const first = meData?.first_name || "";
    const last = meData?.last_name || "";
    if (first || last) return `${first[0] ?? ""}${last[0] ?? ""}`.toUpperCase();
    return "";
  })();
  const userName =
    [meData?.first_name, meData?.last_name].filter(Boolean).join(" ") || meData?.username || "";
  const userRole = meData?.role ? meData.role.charAt(0).toUpperCase() + meData.role.slice(1) : "";

  const title = draft?.title || "Untitled task";
  const description = draft?.description || "";
  const category = draft?.category || "—";
  const subcategory = draft?.subcategory || "";
  const urgency = draft?.urgency === "urgent" ? "Urgent (Within 24h)" : "Standard / Flexible";
  const budget = draft?.budget ? Number(draft.budget) : 0;
  const budgetMode = draft?.budgetMode === "hourly" ? "Hourly Rate" : "Fixed Price";
  const serviceFee = Math.round(budget * 0.05);
  const total = budget + serviceFee;
  const skills = draft?.skills ?? [];
  const address = [draft?.address, draft?.apartment, draft?.city].filter(Boolean).join(", ");

  const publish = async () => {
    if (!draft) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const categoryId = draft.category && /^\d+$/.test(draft.category) ? Number(draft.category) : null;
      const address = [draft.address, draft.apartment, draft.city].filter(Boolean).join(", ");
      const res = await api.createTask({
        title: draft.title,
        description: draft.description,
        category: categoryId,
        location: address || draft.city || "",
        city: draft.city,
        schedule: draft.expectedDate || "",
        deadline: draft.expectedDate || null,
        urgency: draft.urgency || "standard",
        service_type: draft.serviceType || "onsite",
        budget_mode: draft.budgetMode || "fixed",
        budget_min: budget || null,
        budget_max: budget || null,
        materials_provided: !!draft.materialsProvided,
        contact_methods: draft.contactMethods || [],
        skills: draft.skills || [],
      });

      if (res && res.id && files.length > 0) {
        await Promise.all(
          files.map((file) => {
            const fileObj = file instanceof File ? file : dataURLtoFile(file.base64, file.name);
            return api.uploadTaskAttachment(res.id, fileObj).catch(console.error);
          })
        );
      }

      window.localStorage.removeItem(DRAFT_KEY);
      setFiles([]);
      await clearFilesFromDB();
      router.push("/post-task/success");
    } catch (e) {
      setSubmitError((e as Error)?.message || "Could not publish task");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.layout}>
        <aside className={`${styles.sidebar} ${mobileNavOpen ? styles.sidebarOpen : ""}`}>
          <div className={styles.sidebarHeader}>
            <div>
              <p className={styles.sidebarEyebrow}>Boulot Man</p>
              <h1 className={styles.sidebarTitle}>Client Space</h1>
            </div>
            <button
              type="button"
              className={styles.sidebarClose}
              aria-label="Close navigation"
              onClick={() => setMobileNavOpen(false)}
            >
              <iconify-icon icon="lucide:x" />
            </button>
          </div>

          <nav className={styles.sidebarNav} aria-label="Dashboard navigation">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={`${styles.navItem} ${item.key === "tasks" ? styles.navItemActive : ""}`}
              >
                <iconify-icon icon={item.icon} />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        <div className={styles.main}>
          <header className={styles.topbar}>
            <div className={styles.topbarLeft}>
              <button
                type="button"
                className={styles.mobileMenuButton}
                aria-label="Open navigation"
                onClick={() => setMobileNavOpen(true)}
              >
                <iconify-icon icon="lucide:menu" />
              </button>

              <label className={styles.searchBar}>
                <iconify-icon icon="lucide:search" />
                <input type="search" placeholder="Search tasks, professionals..." aria-label="Search tasks and professionals" />
              </label>
            </div>

            <div className={styles.topbarActions}>
              <button type="button" className={styles.iconButton} aria-label="Notifications">
                <iconify-icon icon="lucide:bell" />
                <span className={styles.notificationDot} />
              </button>

              <div className={styles.userMenu}>
                <div className={styles.userAvatar}>{userInitials}</div>
                <div>
                  <p className={styles.userName}>{userName}</p>
                  <p className={styles.userRole}>{userRole}</p>
                </div>
              </div>
            </div>
          </header>

          <div className={styles.content}>
            <div className={styles.contentInner}>
              <section className={styles.pageHeader}>
                <div>
                  <h2>Review & Publish</h2>
                  <p>Here&apos;s how your task will appear to professionals.</p>
                </div>

                <div className={styles.stepper} aria-label="Task publishing progress">
                  <div className={`${styles.step} ${styles.stepCompleted}`}>
                    <span className={styles.stepNumber}>
                      <iconify-icon icon="lucide:check" />
                    </span>
                    <span className={styles.stepText}>Draft</span>
                  </div>
                  <span className={`${styles.stepLine} ${styles.stepLineCompleted}`} />
                  <div className={`${styles.step} ${styles.stepActive}`}>
                    <span className={styles.stepNumber}>2</span>
                    <span className={styles.stepText}>Preview</span>
                  </div>
                  <span className={styles.stepLine} />
                  <div className={styles.step}>
                    <span className={styles.stepNumber}>3</span>
                    <span className={styles.stepText}>Publish</span>
                  </div>
                </div>
              </section>

              {submitError ? (
                <section className={styles.banner} style={{ borderColor: "#ef4444" }}>
                  <div>
                    <strong>Could not publish</strong>
                    <p>{submitError}</p>
                  </div>
                </section>
              ) : null}

              <div className={styles.twoColumnLayout}>
                <div className={styles.mainColumn}>
                  <section className={styles.card}>
                    <div className={styles.previewMeta}>
                      <span className={styles.metaBadge}>{category}</span>
                      {subcategory ? <span className={styles.metaBadge}>{subcategory}</span> : null}
                      <span className={`${styles.metaBadge} ${styles.metaUrgency}`}>{urgency}</span>
                    </div>

                    <h3 className={styles.taskTitle}>{title}</h3>

                    {description ? (
                      <p className={styles.copy}>{description}</p>
                    ) : (
                      <p className={styles.copy} style={{ color: "#94a3b8" }}>No description provided.</p>
                    )}

                    <div className={styles.divider} />

                    {files.length > 0 && (
                      <>
                        <div className={styles.skillsBlock}>
                          <strong>Attachments</strong>
                          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '12px' }}>
                            {files.map((file, idx) => {
                              const imgSrc = file.base64 || (file instanceof File ? URL.createObjectURL(file as any) : "");
                              return (
                                <a key={idx} href={imgSrc || "#"} target={imgSrc ? "_blank" : "_self"} rel="noreferrer" style={{ 
                                  width: '100px', height: '100px', borderRadius: '8px', overflow: 'hidden', 
                                  border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  backgroundColor: '#f8fafc', textDecoration: 'none', cursor: imgSrc ? 'pointer' : 'default'
                                }}>
                                  {(file.kind === 'image' || file.type?.startsWith('image/')) && (file.base64 || file instanceof File) ? (
                                    <img 
                                      src={imgSrc} 
                                      alt={file.name} 
                                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                    />
                                  ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#64748b', fontSize: '12px' }}>
                                      <iconify-icon icon="lucide:file-text" style={{ fontSize: '24px', marginBottom: '4px' }} />
                                      <span style={{ maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</span>
                                    </div>
                                  )}
                                </a>
                              );
                            })}
                          </div>
                        </div>
                        <div className={styles.divider} />
                      </>
                    )}

                    <div className={styles.skillsBlock}>
                      <strong>Required Skills</strong>
                      <div className={styles.tagRow}>
                        {skills.length === 0 ? (
                          <span style={{ color: "#94a3b8", fontSize: 14 }}>No skills specified.</span>
                        ) : (
                          skills.map((skill) => (
                            <span key={skill} className={styles.tag}>
                              {skill}
                            </span>
                          ))
                        )}
                      </div>
                    </div>
                  </section>

                  <section className={styles.card}>
                    <div className={styles.sectionTitle}>
                      <h3>Logistics & Schedule</h3>
                    </div>

                    <div className={styles.detailGrid}>
                      <div className={styles.detailItem}>
                        <span className={styles.detailIcon}><iconify-icon icon="lucide:calendar" /></span>
                        <div>
                          <small>Expected Date</small>
                          <strong>{draft?.expectedDate || "—"}</strong>
                        </div>
                      </div>
                      <div className={styles.detailItem}>
                        <span className={styles.detailIcon}><iconify-icon icon="lucide:sun" /></span>
                        <div>
                          <small>Time Preference</small>
                          <strong>{draft?.timePreference || "—"}</strong>
                        </div>
                      </div>
                      <div className={styles.detailItem}>
                        <span className={styles.detailIcon}><iconify-icon icon="lucide:hammer" /></span>
                        <div>
                          <small>Materials</small>
                          <strong>{draft?.materialsProvided ? "Client provides materials" : "Pro provides materials"}</strong>
                        </div>
                      </div>
                      <div className={styles.detailItem}>
                        <span className={styles.detailIcon}><iconify-icon icon="lucide:smartphone" /></span>
                        <div>
                          <small>Contact Method</small>
                          <strong>{(draft?.contactMethods ?? []).join(", ") || "—"}</strong>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className={styles.card}>
                    <div className={styles.sectionTitle}>
                      <h3>Location</h3>
                    </div>

                    <div className={styles.locationGrid}>
                      <div className={styles.mapPreview}>
                        <div className={styles.mapPin}><iconify-icon icon="lucide:map-pin" /></div>
                      </div>

                      <div className={styles.locationInfo}>
                        <span className={styles.locationBadge}>
                          <iconify-icon icon="lucide:navigation" />
                          {draft?.serviceType === "remote" ? "Remote Task" : "Onsite Task"}
                        </span>
                        <strong>{address || "No address provided"}</strong>
                      </div>
                    </div>
                  </section>
                </div>

                <aside className={styles.sidePanel}>
                  <section className={styles.card}>
                    <small className={styles.eyebrow}>Estimated Budget</small>
                    <div className={styles.priceDisplay}>
                      {budget ? formatXOF(budget) : "—"} <span>XOF</span>
                    </div>
                    <span className={styles.priceType}>{budgetMode}</span>

                    <div className={styles.divider} />

                    <div className={styles.costList}>
                      {budget ? (
                        <>
                          <div>
                            <span>Boulot Man Service Fee (5%)</span>
                            <strong>{formatXOF(serviceFee)}</strong>
                          </div>
                          <div>
                            <span>Total Estimated Cost</span>
                            <strong>{formatXOF(total)}</strong>
                          </div>
                        </>
                      ) : (
                        <div>
                          <span>Set a budget to estimate fees.</span>
                        </div>
                      )}
                    </div>

                    <div className={styles.safeNotice}>
                      <iconify-icon icon="lucide:shield-check" />
                      <p>Your payment is held securely until you confirm the task is completed.</p>
                    </div>
                  </section>

                  <section className={`${styles.card} ${styles.actionCard}`}>
                    <div className={styles.actionIntro}>
                      <h3>Ready to post?</h3>
                      <p>Once published, available professionals in your area will be notified and can start sending offers.</p>
                    </div>

                    <div className={styles.actionStack}>
                      <button
                        type="button"
                        className={styles.primaryButton}
                        onClick={publish}
                        disabled={submitting || !draft}
                      >
                        {submitting ? "Publishing…" : "Publish Task Now"}
                      </button>
                      <Link href="/post-task" className={styles.editButton}>
                        <iconify-icon icon="lucide:pencil" />
                        Edit Details
                      </Link>
                    </div>
                  </section>
                </aside>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
