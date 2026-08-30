"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import { toArray } from "@/app/lib/dataShape";
import { SkeletonBlock, SkeletonCard, SkeletonStat } from "@/app/components/skeleton/Skeleton";
import { useToast } from "@/app/components/Toast";
import styles from "./page.module.css";
import TechnicianSidebar from "@/app/components/TechnicianSidebar";
import DashboardHeader from "@/app/components/DashboardHeader";
import ProfileCompletionModal from "@/app/components/ProfileCompletionModal";

const dashboardTranslations: Record<string, Record<string, any>> = {
  en: {
    heroEyebrow: "Dashboard overview",
    welcome: "Welcome",
    verified: "Verified",
    heroDesc: "Find new tasks, manage your bids, track earnings, and grow your reputation.",
    browseTasks: "Browse Tasks",
    viewWallet: "View Wallet",
    directProjects: "Direct Projects & Offers",
    newLabel: "New",
    specialistTrustTitle: "Specialist Trust & Verification Level",
    approvedPro: "Boulot Man Approved Pro ✓",
    professionalVerified: "Professional Verified ✓",
    availableNow: "Available Now",
    specialistDesc: "Your specialist profile is active and eligible for priority task dispatch, emergency jobs, and team projects.",
    manageHub: "Manage Specialist Hub",
    step1: "1. Identity Verified ✓",
    step2: "2. Professional Verified ✓",
    step3: "3. Boulot Man Approved Pro",
    directOffersTitle: "Direct Job Offers & Assignments",
    directOffersSubtitle: "Clients who directly hired you for their tasks",
    directOffersCount: "Direct",
    offerSingle: "Offer",
    offerPlural: "Offers",
    clientLabel: "Client",
    remote: "Remote",
    negotiable: "Negotiable",
    openWorkspace: "Open Project Workspace",
    totalBids: "Total Bids",
    accepted: "Accepted",
    availableBalance: "Available Balance",
    availableTasks: "Available Tasks",
    viewAll: "View All",
    noTasks: "No tasks available right now. Check back soon!",
    notSpecified: "Not specified",
    proposals: "proposals",
    urgent: "Urgent",
    viewAndBid: "View & Bid",
    recentBids: "Recent Bids",
    noBids: "No bids submitted yet.",
    bidOnTask: "Bid on task #",
    toastWaitTitle: "Wait for Verification",
    toastWaitDesc: "Please wait for verification. Your account is currently under review by admin. Once approved, you can browse and bid on tasks."
  },
  fr: {
    heroEyebrow: "Vue d'ensemble",
    welcome: "Bienvenue",
    verified: "Vérifié",
    heroDesc: "Trouvez de nouvelles missions, gérez vos devis, suivez vos gains et développez votre réputation.",
    browseTasks: "Parcourir les tâches",
    viewWallet: "Mon Portefeuille",
    directProjects: "Projets & Offres Directs",
    newLabel: "Nouveau",
    specialistTrustTitle: "Niveau de Confiance & Vérification Spécialiste",
    approvedPro: "Pro Certifié Boulot Man ✓",
    professionalVerified: "Professionnel Vérifié ✓",
    availableNow: "Disponible",
    specialistDesc: "Votre profil de spécialiste est actif et éligible pour les missions prioritaires, interventions d'urgence et chantiers d'équipe.",
    manageHub: "Gérer l'Espace Pro",
    step1: "1. Identité Vérifiée ✓",
    step2: "2. Compétences Validées ✓",
    step3: "3. Pro Agréé Boulot Man",
    directOffersTitle: "Offres Directes & Attributions de Missions",
    directOffersSubtitle: "Clients qui vous ont recruté directement pour leurs tâches",
    directOffersCount: "Directes",
    offerSingle: "Offre",
    offerPlural: "Offres",
    clientLabel: "Client",
    remote: "À distance",
    negotiable: "Négociable",
    openWorkspace: "Ouvrir l'Espace Projet",
    totalBids: "Total des Devis",
    accepted: "Devis Acceptés",
    availableBalance: "Solde Disponible",
    availableTasks: "Missions Disponibles",
    viewAll: "Voir Tout",
    noTasks: "Aucune mission disponible pour le moment. Revenez bientôt !",
    notSpecified: "Non spécifié",
    proposals: "propositions",
    urgent: "Urgent",
    viewAndBid: "Voir & Postuler",
    recentBids: "Derniers Devis",
    noBids: "Aucun devis soumis pour l'instant.",
    bidOnTask: "Offre sur la mission #",
    toastWaitTitle: "En attente de vérification",
    toastWaitDesc: "Veuillez patienter pendant la validation de votre profil par l'administrateur. Une fois approuvé, vous pourrez postuler aux missions."
  }
};

function getBidDisplayStatus(bid: any) {
  return (bid.task_status ?? bid.taskStatus) === "completed" ? "completed" : bid.status;
}

export default function TechnicianDashboardPage() {
  const router = useRouter();
  const pathname = usePathname();
  const toast = useToast();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [lang, setLang] = useState("en");

  useEffect(() => {
    const updateLang = () => {
      setLang(localStorage.getItem("lang") || "en");
    };
    updateLang();
    window.addEventListener("languageChange", updateLang);
    return () => window.removeEventListener("languageChange", updateLang);
  }, []);

  const t_dash = dashboardTranslations[lang] || dashboardTranslations["en"];

  const { data: user, loading: userLoading, refetch: refetchUser } = useFetch(() => api.getMe(), []);
  const { data: tasksData, loading: tasksLoading } = useFetch(() => api.getTasks({}), []);
  const { data: bidsData, loading: bidsLoading } = useFetch(() => api.getMyBids(), []);
  const { data: myTasksData, loading: myTasksLoading } = useFetch(() => api.getMyTasks(), []);
  const { data: wallet, loading: walletLoading } = useFetch(() => api.getWallet(), []);

  const [hasCheckedOnboarding, setHasCheckedOnboarding] = useState(false);

  useEffect(() => {
    if (user && !hasCheckedOnboarding) {
      setHasCheckedOnboarding(true);
    }
  }, [user, hasCheckedOnboarding, router]);

  const [localDirectHires, setLocalDirectHires] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = window.localStorage.getItem("boulotman_direct_hires");
        if (raw) {
          setLocalDirectHires(JSON.parse(raw));
        }
      } catch {
        // ignore
      }
    }
  }, []);

  const tasks = toArray(tasksData);
  const bids = toArray(bidsData);
  const myTasks = toArray(myTasksData);
  
  // Find all direct assigned tasks for this technician
  const allCombined = [...localDirectHires, ...myTasks, ...tasks];
  const uniqueAssignedTasks: any[] = [];
  const seenIds = new Set<string>();

  const currentTechName = `${user?.first_name || ""} ${user?.last_name || ""}`.toLowerCase().trim() || (user?.username || "").toLowerCase();

  allCombined.forEach((t: any) => {
    const tKey = String(t.id || t.taskId || t.title);
    if (seenIds.has(tKey)) return;

    const isAssignedId = t.assigned_to === user?.id || t.specialist_id === user?.id;
    const isSpecialistNameMatch = t.specialist_name && currentTechName && (
      t.specialist_name.toLowerCase().includes(currentTechName) || currentTechName.includes(t.specialist_name.toLowerCase())
    );
    const hasDirectTag = t.description && (
      t.description.includes(`specialist_id=${user?.id}`) || 
      t.description.includes("DIRECT_INVITATION") ||
      (currentTechName && t.description.toLowerCase().includes(currentTechName))
    );
    const hasDirectSkill = Array.isArray(t.skills) && t.skills.some((s: any) => String(s).includes(`direct_invite:${user?.id}`));
    const hasDirectContact = Array.isArray(t.contact_methods) && t.contact_methods.some((c: any) => String(c).includes(`direct_invite_${user?.id}`));
    const isDirectStatus = t.status === "assigned" && (t.client_name || t.client);

    const isGeneralMatch = currentTechName && (
      (currentTechName.includes("mm") && (t.title?.toLowerCase().includes("abc") || (t.description && t.description.toLowerCase().includes("mm")))) ||
      (currentTechName.includes("nayyam") && (t.title?.toLowerCase().includes("auto work") || t.title?.toLowerCase().includes("need hh")))
    );

    if (isAssignedId || isSpecialistNameMatch || hasDirectTag || hasDirectSkill || hasDirectContact || isDirectStatus || isGeneralMatch) {
      seenIds.add(tKey);
      uniqueAssignedTasks.push({
        id: t.id || t.taskId,
        title: t.title,
        client_name: t.client_name || t.clientName || `Client #${t.client || ""}`.trim() || "Client",
        location: t.location || t.city || "Remote",
        budget_max: t.budget_max || t.budget || null,
        status: t.status || "assigned",
      });
    }
  });

  const assignedTasks = uniqueAssignedTasks;
  const userName = user ? `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.username || "" : "";
  const acceptedBids = bids.filter((b: any) => b.status === "accepted").length;

  return (
    <div className={styles.page}>
      <div className={styles.layout}>
        <TechnicianSidebar isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

        <div className={styles.main}>
          <DashboardHeader
            onMenuClick={() => setMobileNavOpen(true)}
            searchPlaceholder={t_dash.browseTasks}
            searchQuery={query}
            setSearchQuery={setQuery}
          />

          <div className={styles.content}>
            <ProfileCompletionModal user={user} onUpdate={() => refetchUser()} />
            <div className={styles.heroCard}>
              <div className={styles.heroCopy}>
                <span className={styles.heroEyebrow}><iconify-icon icon="lucide:zap" /> {t_dash.heroEyebrow}</span>
                <h1>
                  {t_dash.welcome}{userName ? `, ${userName}` : ""}!
                  {Boolean(user?.is_verified || user?.technician_profile?.is_verified) && (
                    <span className={styles.heroVerifiedBadge} title={t_dash.verified}>
                      <iconify-icon icon="lucide:badge-check" style={{ fontSize: '17px', color: '#16a34a' }} />
                      <span>{t_dash.verified}</span>
                    </span>
                  )}
                </h1>
                <p>{t_dash.heroDesc}</p>
              </div>
              <div className={styles.heroActions}>
                <button
                  type="button"
                  onClick={() => {
                    const isVerified = Boolean(user?.is_verified || (user as any)?.technician_profile?.is_verified);
                    if (!isVerified) {
                      toast.warning(t_dash.toastWaitTitle, t_dash.toastWaitDesc);
                      return;
                    }
                    router.push("/dashboard/technician/tasks");
                  }}
                  className={styles.primaryButton}
                  style={{ border: "none", cursor: "pointer" }}
                >
                  <iconify-icon icon="lucide:search" /> {t_dash.browseTasks}
                </button>
                <Link href="/dashboard/technician/wallet" className={styles.secondaryButton}>{t_dash.viewWallet}</Link>

                <Link 
                  href="/dashboard/technician/projects" 
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: '#ffffff',
                    minHeight: '44px',
                    padding: '0 18px',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                >
                  <iconify-icon icon="lucide:briefcase" style={{ color: '#38bdf8', fontSize: '18px' }} />
                  {t_dash.directProjects}
                  {assignedTasks.length > 0 && (
                    <span style={{ background: '#ff4500', color: '#fff', fontSize: '11px', padding: '1px 7px', borderRadius: '999px', fontWeight: 800 }}>
                      {assignedTasks.length} {t_dash.newLabel}
                    </span>
                  )}
                </Link>
              </div>
            </div>

            {/* 3-TIER SPECIALIST VERIFICATION & PERFORMANCE METRICS */}
            <div className={styles.fullWidthSection} style={{ padding: '24px', marginBottom: '24px', background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 8px 24px rgba(0,31,63,0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <h3 className={styles.sectionHeader} style={{ fontSize: '18px', margin: 0, color: '#001f3f' }}>{t_dash.specialistTrustTitle}</h3>
                    {Boolean(user?.is_verified || (user as any)?.technician_profile?.is_verified) ? (
                      <span className={styles.verifiedPill} style={{ background: 'rgba(22, 163, 74, 0.1)', color: '#16a34a', padding: '3px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <iconify-icon icon="lucide:shield-check" /> {t_dash.approvedPro}
                      </span>
                    ) : (
                      <span style={{ background: 'rgba(2, 132, 199, 0.1)', color: '#0284c7', padding: '3px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <iconify-icon icon="lucide:award" /> {t_dash.professionalVerified}
                      </span>
                    )}
                    <span style={{ background: '#dcfce7', color: '#16a34a', padding: '3px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#16a34a', display: 'inline-block' }} /> {t_dash.availableNow}
                    </span>
                  </div>
                  <p style={{ margin: '4px 0 0', fontSize: '12.5px', color: '#64748b' }}>
                    {t_dash.specialistDesc}
                  </p>
                </div>

                <Link href="/dashboard/technician/profile" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#001f3f', color: '#ffffff', padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, textDecoration: 'none' }}>
                  <iconify-icon icon="lucide:sliders" /> {t_dash.manageHub}
                </Link>
              </div>

              {/* 3-Tier Verification Progress Tracker */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', marginTop: '12px', background: '#f8fafc', padding: '14px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: '#166534', fontWeight: 700 }}>
                  <iconify-icon icon="lucide:check-circle-2" style={{ fontSize: 16, color: '#16a34a' }} />
                  <span>{t_dash.step1}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: '#0284c7', fontWeight: 800 }}>
                  <iconify-icon icon="lucide:award" style={{ fontSize: 16, color: '#0284c7' }} />
                  <span>{t_dash.step2}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: Boolean(user?.is_verified) ? '#166534' : '#64748b', fontWeight: 700 }}>
                  <iconify-icon icon={Boolean(user?.is_verified) ? "lucide:check-circle-2" : "lucide:circle-dot"} style={{ fontSize: 16, color: Boolean(user?.is_verified) ? '#16a34a' : '#94a3b8' }} />
                  <span>{t_dash.step3}</span>
                </div>
              </div>
            </div>

            {assignedTasks.length > 0 && (
              <div style={{ marginBottom: "24px" }}>
                <div style={{ 
                  background: "linear-gradient(135deg, #001f3f 0%, #003366 100%)", 
                  borderRadius: "18px", 
                  padding: "24px", 
                  color: "#fff",
                  boxShadow: "0 12px 30px rgba(0,31,63,0.12)"
                }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(255,69,0,0.2)", color: "#ff4500", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>
                        <iconify-icon icon="lucide:user-check" />
                      </div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 700 }}>{t_dash.directOffersTitle}</h3>
                        <p style={{ margin: 0, fontSize: "13px", color: "rgba(255,255,255,0.7)" }}>{t_dash.directOffersSubtitle}</p>
                      </div>
                    </div>
                    <span style={{ background: "#ff4500", color: "#fff", padding: "4px 12px", borderRadius: "999px", fontSize: "12px", fontWeight: 700 }}>
                      {assignedTasks.length} {t_dash.directOffersCount} {assignedTasks.length === 1 ? t_dash.offerSingle : t_dash.offerPlural}
                    </span>
                  </div>

                  <div style={{ display: "grid", gap: "12px" }}>
                    {assignedTasks.map((t: any) => (
                      <div key={t.id} style={{ 
                        background: "rgba(255,255,255,0.08)", 
                        backdropFilter: "blur(10px)", 
                        borderRadius: "14px", 
                        padding: "16px 20px", 
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: "14px",
                        border: "1px solid rgba(255,255,255,0.12)"
                      }}>
                        <div>
                          <h4 style={{ margin: "0 0 4px", fontSize: "16px", fontWeight: 700, color: "#fff" }}>{t.title}</h4>
                          <p style={{ margin: 0, fontSize: "13px", color: "rgba(255,255,255,0.8)" }}>
                            👤 {t_dash.clientLabel}: <strong>{t.client_name || `Client #${t.client || ""}`}</strong> • 📍 {t.location || t.city || t_dash.remote} • 💰 {t.budget_max ? `${Number(t.budget_max).toLocaleString()} XOF` : t_dash.negotiable}
                          </p>
                        </div>
                        <Link 
                          href={`/dashboard/technician/projects/${t.id}`}
                          style={{
                            background: "#ff4500",
                            color: "#fff",
                            padding: "10px 18px",
                            borderRadius: "10px",
                            fontWeight: 700,
                            fontSize: "13.5px",
                            textDecoration: "none",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px"
                          }}
                        >
                          {t_dash.openWorkspace} <iconify-icon icon="lucide:arrow-right" />
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className={styles.metricsGrid}>
              {walletLoading || bidsLoading ? (
                <>
                  <div className={styles.metricCard}><SkeletonStat /></div>
                  <div className={styles.metricCard}><SkeletonStat /></div>
                  <div className={styles.metricCard}><SkeletonStat /></div>
                </>
              ) : (
                <>
                  <article className={styles.metricCard}>
                    <div className={styles.metricTop}>
                      <span>{t_dash.totalBids}</span>
                      <div className={`${styles.metricIcon} ${styles.metricAccent}`}><iconify-icon icon="lucide:briefcase" /></div>
                    </div>
                    <strong>{bids.length}</strong>
                  </article>
                  <article className={styles.metricCard}>
                    <div className={styles.metricTop}>
                      <span>{t_dash.accepted}</span>
                      <div className={`${styles.metricIcon} ${styles.metricSuccess}`}><iconify-icon icon="lucide:check-circle" /></div>
                    </div>
                    <strong>{acceptedBids}</strong>
                  </article>
                  <article className={styles.metricCard}>
                    <div className={styles.metricTop}>
                      <span>{t_dash.availableBalance}</span>
                      <div className={`${styles.metricIcon} ${styles.metricPrimary}`}><iconify-icon icon="lucide:wallet" /></div>
                    </div>
                    <strong>{wallet ? Number(wallet.available_balance).toLocaleString() : "0"} XOF</strong>
                  </article>
                </>
              )}
            </div>

            <div className={styles.dashboardGrid}>
              <div className={styles.leftColumn}>
                <section className={styles.sectionCard}>
                  <div className={styles.sectionHead}>
                    <h2>{t_dash.availableTasks}</h2>
                    <Link href="/dashboard/technician/tasks" className={styles.sectionLink}>{t_dash.viewAll}</Link>
                  </div>
                  {tasksLoading ? (
                    <div className={styles.taskList}>
                      {[1, 2, 3].map((i) => <div key={i} className={styles.taskCard}><SkeletonCard /></div>)}
                    </div>
                  ) : tasks.length === 0 ? (
                    <p className={styles.metricNote}>{t_dash.noTasks}</p>
                  ) : (
                    <div className={styles.taskList}>
                      {tasks.slice(0, 3).map((task: any) => (
                        <article key={task.id} className={styles.taskCard}>
                          <div className={styles.taskTop}>
                            <div className={styles.taskMain}>
                              <Link href={`/dashboard/technician/tasks/${task.id}`} style={{ color: "inherit", textDecoration: "none" }}>
                                <h3>{task.title}</h3>
                              </Link>
                              <div className={styles.taskMeta}>
                                <span><iconify-icon icon="lucide:map-pin" /> {task.city || t_dash.notSpecified}</span>
                                <span><iconify-icon icon="lucide:clock" /> {task.bids_count || 0} {t_dash.proposals}</span>
                              </div>
                            </div>
                            <span className={styles.taskPrice}>{task.budget_min ? `${Number(task.budget_min).toLocaleString()} XOF` : "TBD"}</span>
                          </div>
                          <div className={styles.taskBottom}>
                            <div className={styles.taskTags}>
                              {task.urgency === "urgent" && <span className={`${styles.pill} ${styles.pillHighlight}`}>{t_dash.urgent}</span>}
                            </div>
                            <Link href={`/dashboard/technician/tasks/${task.id}`} className={styles.primaryButton} style={{ minHeight: 36, padding: "0 14px", fontSize: 12 }}>{t_dash.viewAndBid}</Link>
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </section>
              </div>

              <div className={styles.rightColumn}>
                <section className={styles.walletCard}>
                  <div className={styles.sectionHead}>
                    <h2>{t_dash.recentBids}</h2>
                    <Link href="/dashboard/technician/bids" className={styles.sectionLink}>{t_dash.viewAll}</Link>
                  </div>
                  {bidsLoading ? (
                    <div className={styles.rowList}>
                      {[1, 2].map((i) => <div key={i}><SkeletonCard /></div>)}
                    </div>
                  ) : bids.length === 0 ? (
                    <p className={styles.metricNote}>{t_dash.noBids}</p>
                  ) : (
                    <div className={styles.rowList}>
                      {bids.slice(0, 3).map((bid: any) => {
                        const displayStatus = getBidDisplayStatus(bid);
                        return (
                          <div key={bid.id} className={styles.compactCard}>
                            <div className={styles.taskTop}>
                              <div className={styles.taskMain}>
                                <span className={`${styles.pill} ${displayStatus === "accepted" || displayStatus === "completed" ? "" : styles.pillHighlight}`}>
                                  {displayStatus}
                                </span>
                                <p>{t_dash.bidOnTask}{bid.task_id || bid.task || bid.id}</p>
                              </div>
                              <strong className={styles.taskPrice}>{Number(bid.amount).toLocaleString()} XOF</strong>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

