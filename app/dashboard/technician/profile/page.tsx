"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { api, getImageUrl } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import { useToast } from "@/app/components/Toast";
import { useDialog } from "@/app/components/Dialog";
import { SkeletonBlock } from "@/app/components/skeleton/Skeleton";
import styles from "./page.module.css";
import TechnicianSidebar from "@/app/components/TechnicianSidebar";
import DashboardHeader from "@/app/components/DashboardHeader";
import ImageCropperModal from "@/app/components/ImageCropperModal";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  description: string;
  location: string;
  completionDate: string;
  budget?: string;
  photoUrl?: string;
}

const DEFAULT_PORTFOLIO: PortfolioItem[] = [
  {
    id: "port-1",
    title: "15kVA Solar PV & Hybrid Inverter Installation",
    category: "Electrical & Solar",
    description: "Complete off-grid solar system with 12x 540W Mono panels and lithium battery bank.",
    location: "Cotonou, Benin",
    completionDate: "January 2026",
    budget: "4,500,000 XOF",
  },
  {
    id: "port-2",
    title: "Commercial Building Electrical Distribution Board",
    category: "Electrical & Power",
    description: "Installation of 3-phase main distribution board, surge arresters, and cable tray systems.",
    location: "Porto-Novo, Benin",
    completionDate: "December 2025",
    budget: "1,850,000 XOF",
  }
];

const DEFAULT_TOOLS = [
  "Digital Multimeter (Fluke)",
  "Heavy Duty Rotary Hammer Drill",
  "Solar PV Crimping & Testing Kit",
  "Full PPE Gear (Insulated Boots, Helmet, Gloves)",
  "Insulated VDE Screwdriver Set (1000V)",
  "Cable Puller & Conduit Bender"
];

export default function TechnicianProfilePage() {
  const toast = useToast();
  const dialog = useDialog();

  // Tab State
  const [activeTab, setActiveTab] = useState<"overview" | "verification" | "portfolio" | "availability" | "pricing" | "tools" | "payouts">("overview");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  // Fetches
  const { data: userData, loading: userLoading, refetch: refetchUser } = useFetch(() => api.getMe(), []);
  const { data: rawDocuments, refetch: mutateDocuments } = useFetch(() => api.getTechnicianDocuments(), []);
  const documents = useMemo(() => (Array.isArray(rawDocuments) ? rawDocuments : []), [rawDocuments]);

  // Upload & Cropper State
  const [cropData, setCropData] = useState<{ src: string; type: 'avatar' | 'banner' } | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [bannerUploading, setBannerUploading] = useState(false);
  const [uploadingSlot, setUploadingSlot] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  // Tab 1: Overview Form State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [headline, setHeadline] = useState("Certified Electrician & Solar Specialist");
  const [bio, setBio] = useState("");
  const [experienceYears, setExperienceYears] = useState("8");
  const [primaryOccupation, setPrimaryOccupation] = useState("Electrician");
  const [expertiseLevel, setExpertiseLevel] = useState("Senior");
  const [educationLevel, setEducationLevel] = useState("B.Sc. Electrical Engineering");
  const [country, setCountry] = useState("Benin");
  const [city, setCity] = useState("Cotonou");
  const [address, setAddress] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [skills, setSkills] = useState<string[]>(["Solar PV Installation", "Electrical Rewiring", "Inverter Setup", "Fault Diagnostics", "HVAC Wiring"]);
  const [newSkill, setNewSkill] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);

  // Tab 3: Visual Portfolio State
  const [portfolioList, setPortfolioList] = useState<PortfolioItem[]>(DEFAULT_PORTFOLIO);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [newProjTitle, setNewProjTitle] = useState("");
  const [newProjCategory, setNewProjCategory] = useState("Electrical & Solar");
  const [newProjDesc, setNewProjDesc] = useState("");
  const [newProjLocation, setNewProjLocation] = useState("");
  const [newProjBudget, setNewProjBudget] = useState("");

  // Tab 4: Work Preferences & "Available Now" State
  const [availableNow, setAvailableNow] = useState(true);
  const [workPreference, setWorkPreference] = useState<"on_site" | "remote" | "hybrid">("on_site");
  const [workSchedule, setWorkSchedule] = useState("Full-time & Weekend Emergency");
  const [serviceRadius, setServiceRadius] = useState("25 km Radius");
  const [acceptEmergency, setAcceptEmergency] = useState(true);
  const [acceptTeamProjects, setAcceptTeamProjects] = useState(true);

  // Tab 5: Flexible Pricing Model State
  const [startingPrice, setStartingPrice] = useState("15,000 XOF");
  const [hourlyRate, setHourlyRate] = useState("5,000 XOF / hr");
  const [dailyRate, setDailyRate] = useState("35,000 XOF / day");
  const [inspectionFee, setInspectionFee] = useState("10,000 XOF");
  const [isNegotiable, setIsNegotiable] = useState(true);

  // Tab 6: Tools & Equipment State
  const [hasOwnTools, setHasOwnTools] = useState(true);
  const [toolsList, setToolsList] = useState<string[]>(DEFAULT_TOOLS);
  const [newTool, setNewTool] = useState("");
  const [vehicleType, setVehicleType] = useState("Motorcycle & Utility Van");
  const [canTransportHeavy, setCanTransportHeavy] = useState(true);
  const [hasPpe, setHasPpe] = useState(true);
  const [hasDrivingLicense, setHasDrivingLicense] = useState(true);

  // Tab 7: Payouts & Matchmaking State
  const [payoutMethod, setPayoutMethod] = useState("MTN Mobile Money / Moov Money");
  const [payoutAccountNo, setPayoutAccountNo] = useState("+229 97 12 34 56");
  const [payoutHolder, setPayoutHolder] = useState("Nelson Tagor");
  const [matchConcierge, setMatchConcierge] = useState(true);
  const [matchBuildTeam, setMatchBuildTeam] = useState(true);
  const [matchSupervisor, setMatchSupervisor] = useState(true);

  // Sync User Data
  useEffect(() => {
    if (userData) {
      setFirstName(userData.first_name || "");
      setLastName(userData.last_name || "");
      setDisplayName(userData.first_name ? `${userData.first_name} ${(userData.last_name || "")[0] || ""}.` : userData.username || "");
      setEmail(userData.email || "");
      setPhone(userData.phone || "");
      setBio(userData.bio || userData.about || "");
      if (Array.isArray(userData.skills) && userData.skills.length > 0) setSkills(userData.skills);
      setDateOfBirth(userData.date_of_birth || "");
      setAddress(userData.address || "");
      setEducationLevel(userData.education_level || "Technical License");
      setExpertiseLevel(userData.expertise_level || "Senior");
      setCountry(userData.country || "Benin");
      setCity(userData.city || "Cotonou");
      if (userData.avatar_url) setAvatarUrl(userData.avatar_url);
      if (userData.banner_url) setBannerUrl(userData.banner_url);
    }
  }, [userData]);

  // Load Saved Preferences from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const rawPort = localStorage.getItem("boulotman_technician_portfolio");
      if (rawPort) { try { setPortfolioList(JSON.parse(rawPort)); } catch {} }
      const rawTools = localStorage.getItem("boulotman_technician_tools");
      if (rawTools) { try { setToolsList(JSON.parse(rawTools)); } catch {} }
      const rawAvail = localStorage.getItem("boulotman_technician_available_now");
      if (rawAvail !== null) setAvailableNow(rawAvail === "true");
    }
  }, []);

  const userName = `${firstName} ${lastName}`.trim() || userData?.username || "Specialist";
  const userInitials = useMemo(() => {
    const f = firstName[0] || userData?.first_name?.[0] || "";
    const l = lastName[0] || userData?.last_name?.[0] || "";
    return `${f}${l}`.toUpperCase() || "SP";
  }, [firstName, lastName, userData]);

  const isVerified = Boolean(userData?.is_verified || userData?.technician_profile?.is_verified);

  // Cropper Handlers
  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'banner') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setCropData({ src: reader.result as string, type });
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleCropComplete = async (croppedFile: File) => {
    if (!cropData) return;
    const type = cropData.type;
    setCropData(null);

    if (type === 'avatar') {
      setAvatarUploading(true);
      try {
        const result = await api.uploadAvatar(croppedFile);
        const url = result.avatar_url || result.url || result.file_url;
        setAvatarUrl(url);
        toast.success("Photo Updated", "Your profile photo has been updated.");
      } catch (err: any) {
        toast.error("Upload failed", err?.message || "Please try again.");
      } finally {
        setAvatarUploading(false);
      }
    } else {
      setBannerUploading(true);
      try {
        const result = await api.uploadBanner(croppedFile);
        const url = result.banner_url || result.url || result.file_url;
        setBannerUrl(url);
        toast.success("Banner Updated", "Your profile cover banner has been updated.");
      } catch (err: any) {
        toast.error("Upload failed", err?.message || "Please try again.");
      } finally {
        setBannerUploading(false);
      }
    }
  };

  // Save All Profile Details
  const handleSaveProfile = async () => {
    setProfileSaving(true);
    try {
      await api.updateProfile({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        bio: bio.trim(),
        skills: skills,
        country: country.trim(),
        city: city.trim(),
        address: address.trim(),
        date_of_birth: dateOfBirth || null,
        education_level: educationLevel,
        expertise_level: expertiseLevel,
      });

      // Save custom fields to localStorage
      localStorage.setItem("boulotman_technician_portfolio", JSON.stringify(portfolioList));
      localStorage.setItem("boulotman_technician_tools", JSON.stringify(toolsList));
      localStorage.setItem("boulotman_technician_available_now", String(availableNow));

      await refetchUser();
      toast.success("Profile Saved", "All technician profile details updated successfully.");
    } catch (err: any) {
      toast.error("Save failed", err?.message || "Please try again.");
    } finally {
      setProfileSaving(false);
    }
  };

  const handleToggleAvailableNow = () => {
    const next = !availableNow;
    setAvailableNow(next);
    localStorage.setItem("boulotman_technician_available_now", String(next));
    toast.info(next ? "Status: Available Now 🟢" : "Status: Busy / Offline ⚪", next ? "Clients can hire you for immediate emergency dispatch." : "You are marked as offline.");
  };

  // Add Skill
  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    const val = newSkill.trim();
    if (!skills.includes(val)) setSkills([...skills, val]);
    setNewSkill("");
  };

  // Add Tool
  const handleAddTool = () => {
    if (!newTool.trim()) return;
    const val = newTool.trim();
    if (!toolsList.includes(val)) {
      const updated = [...toolsList, val];
      setToolsList(updated);
      localStorage.setItem("boulotman_technician_tools", JSON.stringify(updated));
    }
    setNewTool("");
  };

  const handleRemoveTool = (tool: string) => {
    const updated = toolsList.filter(t => t !== tool);
    setToolsList(updated);
    localStorage.setItem("boulotman_technician_tools", JSON.stringify(updated));
  };

  // Add Portfolio
  const handleAddPortfolio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjTitle.trim()) return;
    const newPort: PortfolioItem = {
      id: `port-${Date.now()}`,
      title: newProjTitle.trim(),
      category: newProjCategory,
      description: newProjDesc.trim() || "Completed technical assignment with precision and verified compliance.",
      location: newProjLocation.trim() || `${city}, ${country}`,
      completionDate: "Recent",
      budget: newProjBudget.trim() || undefined,
    };
    const updated = [newPort, ...portfolioList];
    setPortfolioList(updated);
    localStorage.setItem("boulotman_technician_portfolio", JSON.stringify(updated));
    setNewProjTitle("");
    setNewProjDesc("");
    setNewProjLocation("");
    setNewProjBudget("");
    setShowAddProjectModal(false);
    toast.success("Portfolio Added", "Your completed work has been added to your profile gallery.");
  };

  const handleDeletePortfolio = (id: string) => {
    const updated = portfolioList.filter(p => p.id !== id);
    setPortfolioList(updated);
    localStorage.setItem("boulotman_technician_portfolio", JSON.stringify(updated));
    toast.info("Project Removed", "Portfolio project deleted.");
  };

  // Document Upload
  const handleDocumentUpload = async (file: File, slotName: string) => {
    setUploadingSlot(slotName);
    try {
      await api.uploadTechnicianDocument(file);
      await mutateDocuments();
      toast.success("Document Uploaded", `${slotName} sent for admin verification.`);
    } catch (err: any) {
      toast.error("Upload failed", err?.message || "Please try again.");
    } finally {
      setUploadingSlot(null);
    }
  };

  const handleDeleteDoc = async (id: number, title: string) => {
    if (!await dialog.confirm({ title: "Delete Document", message: `Delete "${title}"?` })) return;
    try {
      await api.deleteTechnicianDocument(id);
      await mutateDocuments();
      toast.success("Document Deleted", "Document removed.");
    } catch (err: any) {
      toast.error("Error", "Could not delete document.");
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.layout}>
        <TechnicianSidebar isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

        <div className={styles.main}>
          <DashboardHeader onMenuClick={() => setMobileNavOpen(true)} />

          <div className={styles.content}>
            {/* CROPPER MODAL */}
            {cropData && (
              <ImageCropperModal
                imageSrc={cropData.src}
                aspectRatio={cropData.type === 'avatar' ? 1 : 16 / 5}
                isCircular={cropData.type === 'avatar'}
                onCropComplete={handleCropComplete}
                onCancel={() => setCropData(null)}
              />
            )}

            {/* ==================== HERO SECTION ==================== */}
            <section className={styles.heroCard}>
              <div
                className={styles.cover}
                onClick={() => bannerInputRef.current?.click()}
                title="Click to change banner"
                style={{
                  cursor: "pointer",
                  position: "relative",
                  backgroundImage: (bannerUrl || userData?.banner_url)
                    ? `url(${getImageUrl(bannerUrl || userData?.banner_url)})`
                    : "none",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.45) 100%)", borderRadius: "inherit" }} />
                <div className={styles.bannerOverlay}>
                  <div className={styles.bannerUploadHint}>
                    {bannerUploading ? (
                      <><iconify-icon icon="lucide:loader" className={styles.spinIcon} /> Uploading...</>
                    ) : (
                      <><iconify-icon icon="lucide:camera" /> {(bannerUrl || userData?.banner_url) ? "Change Cover Photo" : "Add Cover Photo"}</>
                    )}
                  </div>
                </div>
                <input ref={bannerInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => onFileSelect(e, 'banner')} />
              </div>

              <div className={styles.heroBody}>
                <div className={styles.identityBlock}>
                  <div
                    className={styles.avatarLarge}
                    onClick={() => avatarInputRef.current?.click()}
                    title="Click to change profile picture"
                    style={{ cursor: "pointer", position: "relative" }}
                  >
                    {avatarUrl || userData?.avatar_url ? (
                      <Image
                        src={getImageUrl(avatarUrl || userData?.avatar_url)}
                        alt="Profile photo"
                        fill
                        unoptimized
                        style={{ objectFit: "cover", borderRadius: "50%" }}
                      />
                    ) : (
                      userInitials
                    )}
                    <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center", opacity: avatarUploading ? 1 : 0, transition: "opacity 0.2s", fontSize: 14, color: "#fff" }}>
                      {avatarUploading ? "..." : <iconify-icon icon="lucide:camera" />}
                    </div>
                    <input ref={avatarInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => onFileSelect(e, 'avatar')} />
                  </div>

                  <div className={styles.identityMeta}>
                    <div className={styles.nameRow}>
                      <h1>{displayName || userName}</h1>
                      {isVerified ? (
                        <span className={styles.verifiedBadge} title="Boulot Man Verified Professional">
                          <iconify-icon icon="lucide:badge-check" style={{ fontSize: 16 }} />
                          <span style={{ fontSize: '11.5px', fontWeight: 800 }}>Verified Pro ✓</span>
                        </span>
                      ) : (
                        <span style={{ background: "rgba(2,132,199,0.1)", color: "#0284c7", padding: "3px 10px", borderRadius: "999px", fontSize: "11.5px", fontWeight: 800, display: "inline-flex", alignItems: "center", gap: 4 }}>
                          <iconify-icon icon="lucide:shield" /> Identity Verified ✓
                        </span>
                      )}
                      {availableNow ? (
                        <span style={{ background: "#dcfce7", color: "#16a34a", padding: "3px 10px", borderRadius: "999px", fontSize: "11.5px", fontWeight: 800, display: "inline-flex", alignItems: "center", gap: 4 }}>
                          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#16a34a", display: "inline-block" }} /> Available Now
                        </span>
                      ) : (
                        <span style={{ background: "#f1f5f9", color: "#64748b", padding: "3px 10px", borderRadius: "999px", fontSize: "11.5px", fontWeight: 700 }}>
                          Busy / Offline
                        </span>
                      )}
                    </div>
                    <div className={styles.metaList}>
                      <span><iconify-icon icon="lucide:wrench" /> {headline}</span>
                      <span><iconify-icon icon="lucide:map-pin" /> {city}, {country}</span>
                      <span><iconify-icon icon="lucide:star" /> 4.9 (127 Reviews)</span>
                      <span><iconify-icon icon="lucide:check-circle-2" /> 94 Completed Jobs</span>
                      <span><iconify-icon icon="lucide:trending-up" /> 96% Completion Rate</span>
                    </div>
                  </div>
                </div>

                <div className={styles.heroActions}>
                  <button
                    type="button"
                    onClick={handleToggleAvailableNow}
                    style={{
                      background: availableNow ? "#dcfce7" : "#f1f5f9",
                      color: availableNow ? "#166534" : "#475569",
                      border: `1.5px solid ${availableNow ? "#86efac" : "#cbd5e1"}`,
                      borderRadius: 12,
                      padding: "8px 14px",
                      fontSize: "13px",
                      fontWeight: 800,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6
                    }}
                  >
                    <iconify-icon icon={availableNow ? "lucide:radio" : "lucide:power-off"} />
                    {availableNow ? "Available Now: ON" : "Available Now: OFF"}
                  </button>

                  <Link href={userData?.id ? `/profile/${userData.id}` : "/dashboard/technician"} className={styles.outlineButton} target="_blank">
                    <iconify-icon icon="lucide:external-link" /> Preview Public
                  </Link>

                  <button type="button" className={styles.primaryButton} onClick={handleSaveProfile} disabled={profileSaving}>
                    <iconify-icon icon={profileSaving ? "lucide:loader" : "lucide:save"} className={profileSaving ? styles.spinIcon : ""} />
                    {profileSaving ? "Saving..." : "Save Profile"}
                  </button>
                </div>
              </div>
            </section>

            {/* ==================== 7-TAB NAVIGATION ==================== */}
            <div className={styles.tabNav}>
              <button type="button" className={`${styles.tabBtn} ${activeTab === "overview" ? styles.tabBtnActive : ""}`} onClick={() => setActiveTab("overview")}>
                <iconify-icon icon="lucide:user" /> 1. Profile & Bio
              </button>
              <button type="button" className={`${styles.tabBtn} ${activeTab === "verification" ? styles.tabBtnActive : ""}`} onClick={() => setActiveTab("verification")}>
                <iconify-icon icon="lucide:shield-check" /> 2. 3-Tier Verification
              </button>
              <button type="button" className={`${styles.tabBtn} ${activeTab === "portfolio" ? styles.tabBtnActive : ""}`} onClick={() => setActiveTab("portfolio")}>
                <iconify-icon icon="lucide:image" /> 3. Visual Portfolio ({portfolioList.length})
              </button>
              <button type="button" className={`${styles.tabBtn} ${activeTab === "availability" ? styles.tabBtnActive : ""}`} onClick={() => setActiveTab("availability")}>
                <iconify-icon icon="lucide:clock" /> 4. Availability & Radius
              </button>
              <button type="button" className={`${styles.tabBtn} ${activeTab === "pricing" ? styles.tabBtnActive : ""}`} onClick={() => setActiveTab("pricing")}>
                <iconify-icon icon="lucide:tag" /> 5. Pricing Models
              </button>
              <button type="button" className={`${styles.tabBtn} ${activeTab === "tools" ? styles.tabBtnActive : ""}`} onClick={() => setActiveTab("tools")}>
                <iconify-icon icon="lucide:hammer" /> 6. Tools & Mobility
              </button>
              <button type="button" className={`${styles.tabBtn} ${activeTab === "payouts" ? styles.tabBtnActive : ""}`} onClick={() => setActiveTab("payouts")}>
                <iconify-icon icon="lucide:wallet" /> 7. Payouts & Teams
              </button>
            </div>

            {/* ==================== TAB 1: OVERVIEW & CREDENTIALS ==================== */}
            {activeTab === "overview" && (
              <section className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2 style={{ fontSize: 18, fontWeight: 800, color: "#001f3f", margin: 0 }}>
                    <iconify-icon icon="lucide:user-check" style={{ color: "#ff4500" }} /> Professional Information & Summary
                  </h2>
                </div>

                <div className={styles.twoCol}>
                  <div>
                    <label className={styles.label} style={{ fontSize: 13, fontWeight: 700, color: "#001f3f", marginBottom: 6, display: "block" }}>Full Legal Name *</label>
                    <input className={styles.formInput} placeholder="e.g. Nelson Tagor" value={`${firstName} ${lastName}`.trim()} onChange={(e) => {
                      const parts = e.target.value.split(" ");
                      setFirstName(parts[0] || "");
                      setLastName(parts.slice(1).join(" ") || "");
                    }} />
                  </div>
                  <div>
                    <label className={styles.label} style={{ fontSize: 13, fontWeight: 700, color: "#001f3f", marginBottom: 6, display: "block" }}>Display / Privacy Name (Shown to clients)</label>
                    <input className={styles.formInput} placeholder="e.g. Nelson T." value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                  </div>
                </div>

                <div className={styles.twoCol}>
                  <div>
                    <label className={styles.label} style={{ fontSize: 13, fontWeight: 700, color: "#001f3f", marginBottom: 6, display: "block" }}>Professional Headline *</label>
                    <input className={styles.formInput} placeholder="e.g. Certified Electrician & Solar PV Specialist" value={headline} onChange={(e) => setHeadline(e.target.value)} />
                  </div>
                  <div>
                    <label className={styles.label} style={{ fontSize: 13, fontWeight: 700, color: "#001f3f", marginBottom: 6, display: "block" }}>Primary Trade / Occupation</label>
                    <select className={styles.formInput} value={primaryOccupation} onChange={(e) => setPrimaryOccupation(e.target.value)} style={{ width: "100%", height: 44, padding: "0 12px", border: "1.5px solid #cbd5e1", borderRadius: 10 }}>
                      <option value="Electrician">Electrician & Solar Specialist</option>
                      <option value="Plumber">Plumber & Pipefitter</option>
                      <option value="HVAC">HVAC & Refrigeration Tech</option>
                      <option value="Carpenter">Carpenter & Woodworker</option>
                      <option value="Mason">Mason & Bricklayer</option>
                      <option value="Painter">Painter & Finisher</option>
                      <option value="Welder">Welder & Metal Fabricator</option>
                      <option value="IT Technician">IT Network & Telecom Tech</option>
                    </select>
                  </div>
                </div>

                <div className={styles.twoCol}>
                  <div>
                    <label className={styles.label} style={{ fontSize: 13, fontWeight: 700, color: "#001f3f", marginBottom: 6, display: "block" }}>Years of Hands-on Experience</label>
                    <input className={styles.formInput} placeholder="e.g. 8" value={experienceYears} onChange={(e) => setExperienceYears(e.target.value)} />
                  </div>
                  <div>
                    <label className={styles.label} style={{ fontSize: 13, fontWeight: 700, color: "#001f3f", marginBottom: 6, display: "block" }}>Skill / Seniority Level</label>
                    <select className={styles.formInput} value={expertiseLevel} onChange={(e) => setExpertiseLevel(e.target.value)} style={{ width: "100%", height: 44, padding: "0 12px", border: "1.5px solid #cbd5e1", borderRadius: 10 }}>
                      <option value="Junior">Junior (1-3 Years)</option>
                      <option value="Intermediate">Intermediate (3-6 Years)</option>
                      <option value="Senior">Senior Master (6-12 Years)</option>
                      <option value="Expert">Lead Expert / Site Supervisor (12+ Years)</option>
                    </select>
                  </div>
                </div>

                <div className={styles.twoCol}>
                  <div>
                    <label className={styles.label} style={{ fontSize: 13, fontWeight: 700, color: "#001f3f", marginBottom: 6, display: "block" }}>Education & Training Institution</label>
                    <input className={styles.formInput} placeholder="e.g. Lycée Technique Coulibaly / B.Sc. Electrical Eng" value={educationLevel} onChange={(e) => setEducationLevel(e.target.value)} />
                  </div>
                  <div>
                    <label className={styles.label} style={{ fontSize: 13, fontWeight: 700, color: "#001f3f", marginBottom: 6, display: "block" }}>Operating City & Country</label>
                    <input className={styles.formInput} placeholder="e.g. Cotonou, Benin" value={`${city}, ${country}`} onChange={(e) => {
                      const parts = e.target.value.split(",");
                      setCity(parts[0]?.trim() || "");
                      setCountry(parts[1]?.trim() || "Benin");
                    }} />
                  </div>
                </div>

                <label className={styles.label} style={{ fontSize: 13, fontWeight: 700, color: "#001f3f", marginBottom: 6, display: "block" }}>About Me & Professional Summary</label>
                <textarea
                  className={styles.formTextarea}
                  rows={4}
                  placeholder="Detail your background, specialties, standard safety practices, and client satisfaction guarantee..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />

                {/* Skills Manager */}
                <div style={{ marginTop: 20 }}>
                  <label className={styles.label} style={{ fontSize: 13, fontWeight: 700, color: "#001f3f", marginBottom: 6, display: "block" }}>Trade Skills & Specializations</label>
                  <div className={styles.skillsListEditable}>
                    {skills.map((skill, index) => (
                      <span key={index} className={styles.skillTag}>
                        {skill}
                        <button type="button" className={styles.skillAction} onClick={() => setSkills(skills.filter((_, i) => i !== index))}>
                          <iconify-icon icon="lucide:x" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 10, maxWidth: 500, marginTop: 10 }}>
                    <input
                      className={styles.formInput}
                      style={{ marginBottom: 0 }}
                      placeholder="Add trade skill (e.g. Solar Inverter Setup, 3-Phase Wiring)"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddSkill(); } }}
                    />
                    <button type="button" className={styles.outlineButton} onClick={handleAddSkill}>Add</button>
                  </div>
                </div>
              </section>
            )}

            {/* ==================== TAB 2: 3-TIER VERIFICATION ==================== */}
            {activeTab === "verification" && (
              <section className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2 style={{ fontSize: 18, fontWeight: 800, color: "#001f3f", margin: 0 }}>
                    <iconify-icon icon="lucide:shield-check" style={{ color: "#16a34a" }} /> 3-Tier Specialist Verification Progression
                  </h2>
                  <span className={styles.verifiedBadge}>
                    <iconify-icon icon="lucide:check-circle-2" /> Tier 2: Professional Verified ✓
                  </span>
                </div>

                {/* 3-Tier Progression Tracker */}
                <div className={styles.tierGrid}>
                  <div className={`${styles.tierCard} ${styles.tierCardActive}`}>
                    <div className={styles.tierHeader}>
                      <span style={{ fontSize: 20 }}>🥉</span>
                      <span className={styles.tierBadge} style={{ background: "#dcfce7", color: "#16a34a" }}>Completed ✓</span>
                    </div>
                    <h4 className={styles.tierTitle}>1. Identity Verified</h4>
                    <p className={styles.tierDesc}>National ID or Passport confirmed by Boulot Man security team.</p>
                  </div>

                  <div className={`${styles.tierCard} ${styles.tierCardCurrent}`}>
                    <div className={styles.tierHeader}>
                      <span style={{ fontSize: 20 }}>🥈</span>
                      <span className={styles.tierBadge} style={{ background: "rgba(255,69,0,0.1)", color: "#ff4500" }}>Active Status ✓</span>
                    </div>
                    <h4 className={styles.tierTitle}>2. Professional Verified</h4>
                    <p className={styles.tierDesc}>Trade certifications, diploma, and hands-on skills evaluated.</p>
                  </div>

                  <div className={styles.tierCard}>
                    <div className={styles.tierHeader}>
                      <span style={{ fontSize: 20 }}>🥇</span>
                      <span className={styles.tierBadge} style={{ background: "#f1f5f9", color: "#64748b" }}>Target Badge</span>
                    </div>
                    <h4 className={styles.tierTitle}>3. Boulot Man Approved Pro</h4>
                    <p className={styles.tierDesc}>Full background clearance, 10+ jobs completed with ⭐ 4.8+ rating.</p>
                  </div>
                </div>

                <p style={{ margin: "0 0 16px", fontSize: 13.5, color: "#64748b", lineHeight: 1.5 }}>
                  Upload your National ID, trade certificates, and professional licenses. <strong>Sensitive identity documents remain strictly private</strong> and are never displayed publicly.
                </p>

                {/* Upload Slots */}
                <div className={styles.idUploadBoxes}>
                  <div className={styles.idUploadCard}>
                    <div className={styles.idBoxIcon}><iconify-icon icon="lucide:id-card" /></div>
                    <div className={styles.idBoxContent}>
                      <h4 className={styles.idBoxTitle}>National ID / Passport</h4>
                      <p className={styles.idBoxSub}>Government-issued identity document</p>
                    </div>
                    <button
                      type="button"
                      className={styles.idUploadBtn}
                      disabled={uploadingSlot === "National ID"}
                      onClick={() => {
                        const input = document.createElement("input");
                        input.type = "file";
                        input.accept = "image/*,application/pdf";
                        input.onchange = (e: any) => {
                          const file = e.target.files?.[0];
                          if (file) handleDocumentUpload(file, "National ID");
                        };
                        input.click();
                      }}
                    >
                      <iconify-icon icon={uploadingSlot === "National ID" ? "lucide:loader" : "lucide:upload"} />
                      {uploadingSlot === "National ID" ? "Uploading..." : "Upload ID"}
                    </button>
                  </div>

                  <div className={styles.idUploadCard}>
                    <div className={styles.idBoxIcon}><iconify-icon icon="lucide:award" /></div>
                    <div className={styles.idBoxContent}>
                      <h4 className={styles.idBoxTitle}>Trade License & Certifications</h4>
                      <p className={styles.idBoxSub}>Electrical, Plumbing, or Trade diploma</p>
                    </div>
                    <button
                      type="button"
                      className={styles.idUploadBtn}
                      disabled={uploadingSlot === "Trade Certificate"}
                      onClick={() => {
                        const input = document.createElement("input");
                        input.type = "file";
                        input.accept = "image/*,application/pdf";
                        input.onchange = (e: any) => {
                          const file = e.target.files?.[0];
                          if (file) handleDocumentUpload(file, "Trade Certificate");
                        };
                        input.click();
                      }}
                    >
                      <iconify-icon icon={uploadingSlot === "Trade Certificate" ? "lucide:loader" : "lucide:upload"} />
                      {uploadingSlot === "Trade Certificate" ? "Uploading..." : "Upload Cert"}
                    </button>
                  </div>
                </div>

                {/* Submitted Documents List */}
                <div className={styles.documentsArea}>
                  <div className={styles.documentsHeader}>
                    <h3>Verified Document Vault ({documents.length})</h3>
                  </div>

                  {documents.length === 0 ? (
                    <p className={styles.noDocuments}>No documents uploaded yet. Upload your National ID to unlock priority jobs.</p>
                  ) : (
                    <div className={styles.documentList}>
                      {documents.map((doc: any) => (
                        <div key={doc.id} className={styles.documentItem}>
                          <iconify-icon icon="lucide:file-check" className={styles.docIcon} />
                          <div className={styles.docInfo}>
                            <strong>{doc.title || "Verification Document"}</strong>
                            <span>{doc.document_type === "certificate" ? "Trade Qualification" : "Identity Document"} • Verified ✓</span>
                          </div>
                          <div className={styles.docActions}>
                            {doc.file_url && (
                              <a href={getImageUrl(doc.file_url)} target="_blank" rel="noopener noreferrer" title="View Document">
                                <iconify-icon icon="lucide:eye" />
                              </a>
                            )}
                            <button type="button" className={styles.deleteBtn} onClick={() => handleDeleteDoc(doc.id, doc.title)}>
                              <iconify-icon icon="lucide:trash-2" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* ==================== TAB 3: VISUAL PORTFOLIO ==================== */}
            {activeTab === "portfolio" && (
              <section className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2 style={{ fontSize: 18, fontWeight: 800, color: "#001f3f", margin: 0 }}>
                    <iconify-icon icon="lucide:image" style={{ color: "#ff4500" }} /> Visual Portfolio & Previous Work Showcase
                  </h2>
                  <button type="button" className={styles.primaryButton} onClick={() => setShowAddProjectModal(true)} style={{ minHeight: 38, padding: "0 16px", fontSize: 13 }}>
                    <iconify-icon icon="lucide:plus" /> Add Completed Work
                  </button>
                </div>

                <p style={{ margin: "0 0 16px", fontSize: 13.5, color: "#64748b", lineHeight: 1.5 }}>
                  Photos and proof of your previous jobs allow clients to visually verify the quality of your craftsmanship before hiring.
                </p>

                <div className={styles.portfolioGrid}>
                  {portfolioList.map((item) => (
                    <div key={item.id} className={styles.portfolioCard}>
                      <div className={styles.portfolioVisual}>
                        <iconify-icon icon="lucide:hard-hat" style={{ fontSize: 36, color: "rgba(255,255,255,0.7)" }} />
                        {item.budget && (
                          <div style={{ position: "absolute", top: 10, right: 10, background: "rgba(0,0,0,0.65)", color: "#4ade80", padding: "3px 8px", borderRadius: 999, fontSize: 11.5, fontWeight: 800 }}>
                            {item.budget}
                          </div>
                        )}
                      </div>
                      <div className={styles.portfolioBody}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <span style={{ fontSize: 11.5, fontWeight: 800, color: "#ff4500", textTransform: "uppercase" }}>{item.category}</span>
                          <button type="button" onClick={() => handleDeletePortfolio(item.id)} style={{ border: "none", background: "transparent", color: "#94a3b8", cursor: "pointer" }}>
                            <iconify-icon icon="lucide:trash-2" />
                          </button>
                        </div>
                        <h4 style={{ margin: "6px 0 4px", fontSize: 14.5, fontWeight: 800, color: "#001f3f" }}>{item.title}</h4>
                        <p style={{ margin: 0, fontSize: 12.5, color: "#64748b", lineHeight: 1.45 }}>{item.description}</p>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, color: "#94a3b8", marginTop: 10 }}>
                          <span>📍 {item.location}</span>
                          <span>⏳ {item.completionDate}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Portfolio Modal */}
                {showAddProjectModal && (
                  <div style={{ position: "fixed", inset: 0, background: "rgba(0,15,30,0.75)", backdropFilter: "blur(8px)", zIndex: 99999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
                    <div style={{ background: "#ffffff", borderRadius: 20, width: "100%", maxWidth: 480, padding: 24 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, borderBottom: "1px solid #f1f5f9", paddingBottom: 12 }}>
                        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#001f3f" }}>Add Completed Work / Project</h3>
                        <button type="button" onClick={() => setShowAddProjectModal(false)} style={{ border: "none", background: "#f1f5f9", borderRadius: "50%", width: 32, height: 32, cursor: "pointer" }}>
                          <iconify-icon icon="lucide:x" />
                        </button>
                      </div>

                      <form onSubmit={handleAddPortfolio}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                          <div>
                            <label style={{ display: "block", fontSize: "12.5px", fontWeight: 700, color: "#001f3f", marginBottom: 5 }}>Job Title *</label>
                            <input className={styles.formInput} value={newProjTitle} onChange={(e) => setNewProjTitle(e.target.value)} placeholder="e.g. 10kVA Solar System & Distribution Panel" required />
                          </div>
                          <div>
                            <label style={{ display: "block", fontSize: "12.5px", fontWeight: 700, color: "#001f3f", marginBottom: 5 }}>Trade Category</label>
                            <select className={styles.formInput} value={newProjCategory} onChange={(e) => setNewProjCategory(e.target.value)} style={{ width: "100%", height: 42, padding: "0 12px", border: "1.5px solid #cbd5e1", borderRadius: 8 }}>
                              <option value="Electrical & Solar">Electrical & Solar</option>
                              <option value="Plumbing & Sanitation">Plumbing & Sanitation</option>
                              <option value="HVAC & Cooling">HVAC & Cooling</option>
                              <option value="Carpentry & Furniture">Carpentry & Furniture</option>
                              <option value="Masonry & Renovation">Masonry & Renovation</option>
                            </select>
                          </div>
                          <div>
                            <label style={{ display: "block", fontSize: "12.5px", fontWeight: 700, color: "#001f3f", marginBottom: 5 }}>Job Description</label>
                            <textarea className={styles.formTextarea} rows={3} value={newProjDesc} onChange={(e) => setNewProjDesc(e.target.value)} placeholder="Explain the problem solved, materials installed, and outcome..." />
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                            <div>
                              <label style={{ display: "block", fontSize: "12.5px", fontWeight: 700, color: "#001f3f", marginBottom: 5 }}>Location</label>
                              <input className={styles.formInput} value={newProjLocation} onChange={(e) => setNewProjLocation(e.target.value)} placeholder="e.g. Haie Vive, Cotonou" />
                            </div>
                            <div>
                              <label style={{ display: "block", fontSize: "12.5px", fontWeight: 700, color: "#001f3f", marginBottom: 5 }}>Job Value (Optional)</label>
                              <input className={styles.formInput} value={newProjBudget} onChange={(e) => setNewProjBudget(e.target.value)} placeholder="e.g. 750,000 XOF" />
                            </div>
                          </div>
                        </div>

                        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                          <button type="button" onClick={() => setShowAddProjectModal(false)} className={styles.outlineButton} style={{ flex: 1, justifyContent: "center" }}>Cancel</button>
                          <button type="submit" className={styles.primaryButton} style={{ flex: 1.2, justifyContent: "center" }}>Save Project</button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* ==================== TAB 4: AVAILABILITY & RADIUS ==================== */}
            {activeTab === "availability" && (
              <section className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2 style={{ fontSize: 18, fontWeight: 800, color: "#001f3f", margin: 0 }}>
                    <iconify-icon icon="lucide:clock" style={{ color: "#001f3f" }} /> Work Preferences, Schedule & Service Radius
                  </h2>
                </div>

                {/* Available Now Live Banner */}
                <div style={{ background: availableNow ? "#f0fdf4" : "#f8fafc", border: `1.5px solid ${availableNow ? "#bbf7d0" : "#e2e8f0"}`, borderRadius: 16, padding: "16px 20px", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 44, height: 44, borderRadius: "50%", background: availableNow ? "#dcfce7" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, color: availableNow ? "#16a34a" : "#64748b" }}>
                      <iconify-icon icon={availableNow ? "lucide:radio" : "lucide:power-off"} />
                    </div>
                    <div>
                      <strong style={{ display: "block", fontSize: 15, color: "#001f3f" }}>
                        {availableNow ? "Live Status: Available Now (Online)" : "Live Status: Busy / Offline"}
                      </strong>
                      <span style={{ fontSize: 12.5, color: "#64748b" }}>
                        {availableNow ? "Clients searching for immediate dispatch in your area can view your live badge." : "Your profile will not receive emergency dispatch calls right now."}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleToggleAvailableNow}
                    className={styles.primaryButton}
                    style={{ background: availableNow ? "#16a34a" : "#001f3f", minHeight: 40, padding: "0 18px", fontSize: 13 }}
                  >
                    {availableNow ? "Switch to Offline" : "Go Available Now"}
                  </button>
                </div>

                <div className={styles.twoCol}>
                  <div>
                    <label className={styles.label} style={{ fontSize: 13, fontWeight: 700, color: "#001f3f", marginBottom: 6, display: "block" }}>Work Mode</label>
                    <select className={styles.formInput} value={workPreference} onChange={(e: any) => setWorkPreference(e.target.value)} style={{ width: "100%", height: 44, padding: "0 12px", border: "1.5px solid #cbd5e1", borderRadius: 10 }}>
                      <option value="on_site">On-Site Only (Physical Job Sites)</option>
                      <option value="hybrid">Hybrid (On-Site Inspections + Remote Consulting)</option>
                      <option value="remote">Remote (Designs, BOQ & CAD only)</option>
                    </select>
                  </div>
                  <div>
                    <label className={styles.label} style={{ fontSize: 13, fontWeight: 700, color: "#001f3f", marginBottom: 6, display: "block" }}>Service Travel Radius</label>
                    <select className={styles.formInput} value={serviceRadius} onChange={(e) => setServiceRadius(e.target.value)} style={{ width: "100%", height: 44, padding: "0 12px", border: "1.5px solid #cbd5e1", borderRadius: 10 }}>
                      <option value="5 km Radius">5 km Radius (Neighborhood only)</option>
                      <option value="10 km Radius">10 km Radius (Local District)</option>
                      <option value="25 km Radius">25 km Radius (City-Wide & Suburbs)</option>
                      <option value="50 km Radius">50 km Radius (Greater Metropolitan Area)</option>
                      <option value="Nationwide">Nationwide (Willing to travel for large contracts)</option>
                    </select>
                  </div>
                </div>

                <div className={styles.twoCol}>
                  <div>
                    <label className={styles.label} style={{ fontSize: 13, fontWeight: 700, color: "#001f3f", marginBottom: 6, display: "block" }}>Working Schedule</label>
                    <input className={styles.formInput} value={workSchedule} onChange={(e) => setWorkSchedule(e.target.value)} placeholder="e.g. Mon - Sat: 08:00 - 18:00" />
                  </div>
                  <div>
                    <label className={styles.label} style={{ fontSize: 13, fontWeight: 700, color: "#001f3f", marginBottom: 6, display: "block" }}>Emergency 24/7 Calls</label>
                    <select className={styles.formInput} value={acceptEmergency ? "yes" : "no"} onChange={(e) => setAcceptEmergency(e.target.value === "yes")} style={{ width: "100%", height: 44, padding: "0 12px", border: "1.5px solid #cbd5e1", borderRadius: 10 }}>
                      <option value="yes">Yes — Accept Urgent Breakdown Calls</option>
                      <option value="no">No — Standard Hours Only</option>
                    </select>
                  </div>
                </div>
              </section>
            )}

            {/* ==================== TAB 5: FLEXIBLE PRICING ==================== */}
            {activeTab === "pricing" && (
              <section className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2 style={{ fontSize: 18, fontWeight: 800, color: "#001f3f", margin: 0 }}>
                    <iconify-icon icon="lucide:tag" style={{ color: "#ff4500" }} /> Flexible Pricing & Quotation Options
                  </h2>
                </div>

                <p style={{ margin: "0 0 16px", fontSize: 13.5, color: "#64748b", lineHeight: 1.5 }}>
                  Different tasks require different pricing structures. Set your standard base rates so clients have clear budget expectations.
                </p>

                <div className={styles.pricingGrid}>
                  <div className={styles.pricingCard}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#64748b" }}>Starting Rate (Base)</span>
                    <input className={styles.formInput} value={startingPrice} onChange={(e) => setStartingPrice(e.target.value)} placeholder="e.g. 15,000 XOF" />
                  </div>
                  <div className={styles.pricingCard}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#64748b" }}>Hourly Rate</span>
                    <input className={styles.formInput} value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} placeholder="e.g. 5,000 XOF / hr" />
                  </div>
                  <div className={styles.pricingCard}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#64748b" }}>Daily Rate</span>
                    <input className={styles.formInput} value={dailyRate} onChange={(e) => setDailyRate(e.target.value)} placeholder="e.g. 35,000 XOF / day" />
                  </div>
                  <div className={styles.pricingCard}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#64748b" }}>Inspection / Call-out Fee</span>
                    <input className={styles.formInput} value={inspectionFee} onChange={(e) => setInspectionFee(e.target.value)} placeholder="e.g. 10,000 XOF" />
                  </div>
                </div>

                <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 10 }}>
                  <input type="checkbox" id="negCheck" checked={isNegotiable} onChange={(e) => setIsNegotiable(e.target.checked)} />
                  <label htmlFor="negCheck" style={{ fontSize: 13.5, fontWeight: 700, color: "#001f3f", cursor: "pointer" }}>
                    Allow Quotation Requests & Price Negotiation on Custom Projects
                  </label>
                </div>
              </section>
            )}

            {/* ==================== TAB 6: TOOLS & MOBILITY ==================== */}
            {activeTab === "tools" && (
              <section className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2 style={{ fontSize: 18, fontWeight: 800, color: "#001f3f", margin: 0 }}>
                    <iconify-icon icon="lucide:hammer" style={{ color: "#001f3f" }} /> Tools, Equipment & Mobility Fleet
                  </h2>
                </div>

                <div className={styles.twoCol}>
                  <div>
                    <label className={styles.label} style={{ fontSize: 13, fontWeight: 700, color: "#001f3f", marginBottom: 6, display: "block" }}>Own Professional Tools</label>
                    <select className={styles.formInput} value={hasOwnTools ? "yes" : "no"} onChange={(e) => setHasOwnTools(e.target.value === "yes")} style={{ width: "100%", height: 44, padding: "0 12px", border: "1.5px solid #cbd5e1", borderRadius: 10 }}>
                      <option value="yes">Yes — Fully Equipped with Professional Tools</option>
                      <option value="no">No — Basic Hand Tools Only</option>
                    </select>
                  </div>
                  <div>
                    <label className={styles.label} style={{ fontSize: 13, fontWeight: 700, color: "#001f3f", marginBottom: 6, display: "block" }}>Transport & Vehicle</label>
                    <input className={styles.formInput} value={vehicleType} onChange={(e) => setVehicleType(e.target.value)} placeholder="e.g. Motorcycle & Utility Pickup" />
                  </div>
                </div>

                <div className={styles.twoCol}>
                  <div>
                    <label className={styles.label} style={{ fontSize: 13, fontWeight: 700, color: "#001f3f", marginBottom: 6, display: "block" }}>PPE Safety Gear Available</label>
                    <select className={styles.formInput} value={hasPpe ? "yes" : "no"} onChange={(e) => setHasPpe(e.target.value === "yes")} style={{ width: "100%", height: 44, padding: "0 12px", border: "1.5px solid #cbd5e1", borderRadius: 10 }}>
                      <option value="yes">Yes — Complete PPE (Helmet, Safety Boots, High-Vis, Gloves)</option>
                      <option value="no">No — Standard Workwear</option>
                    </select>
                  </div>
                  <div>
                    <label className={styles.label} style={{ fontSize: 13, fontWeight: 700, color: "#001f3f", marginBottom: 6, display: "block" }}>Valid Driving License</label>
                    <select className={styles.formInput} value={hasDrivingLicense ? "yes" : "no"} onChange={(e) => setHasDrivingLicense(e.target.value === "yes")} style={{ width: "100%", height: 44, padding: "0 12px", border: "1.5px solid #cbd5e1", borderRadius: 10 }}>
                      <option value="yes">Yes — Valid Category A & B License</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                </div>

                {/* Tools Tag Manager */}
                <div style={{ marginTop: 18 }}>
                  <label className={styles.label} style={{ fontSize: 13, fontWeight: 700, color: "#001f3f", marginBottom: 6, display: "block" }}>Specialized Tools & Equipment Available</label>
                  <div className={styles.toolsGrid}>
                    {toolsList.map((tool) => (
                      <span key={tool} className={styles.toolTag}>
                        <iconify-icon icon="lucide:wrench" style={{ color: "#ff4500" }} />
                        {tool}
                        <iconify-icon icon="lucide:x" style={{ cursor: "pointer", marginLeft: 4 }} onClick={() => handleRemoveTool(tool)} />
                      </span>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 10, maxWidth: 500, marginTop: 12 }}>
                    <input
                      className={styles.formInput}
                      style={{ marginBottom: 0 }}
                      placeholder="Add equipment (e.g. Thermal Camera, Scaffolding, Drill)"
                      value={newTool}
                      onChange={(e) => setNewTool(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddTool(); } }}
                    />
                    <button type="button" className={styles.outlineButton} onClick={handleAddTool}>Add Tool</button>
                  </div>
                </div>
              </section>
            )}

            {/* ==================== TAB 7: PAYOUTS & OPERATIONAL MATCHING ==================== */}
            {activeTab === "payouts" && (
              <section className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2 style={{ fontSize: 18, fontWeight: 800, color: "#001f3f", margin: 0 }}>
                    <iconify-icon icon="lucide:wallet" style={{ color: "#001f3f" }} /> Payout Account & Project Team Eligibility
                  </h2>
                </div>

                {/* Confidential Payout Details */}
                <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 16, padding: "16px 20px", marginBottom: 24 }}>
                  <strong style={{ display: "block", color: "#001f3f", fontSize: 14, marginBottom: 4 }}>
                    <iconify-icon icon="lucide:lock" style={{ color: "#ff4500", marginRight: 6 }} />
                    Confidential Escrow Payout Account
                  </strong>
                  <p style={{ margin: "0 0 14px", fontSize: 12.5, color: "#64748b" }}>
                    Your financial details are encrypted and never shared publicly. Funds released from escrow are transferred directly to this account.
                  </p>

                  <div className={styles.twoCol}>
                    <div>
                      <label className={styles.label} style={{ fontSize: 12.5, fontWeight: 700, color: "#001f3f", marginBottom: 4, display: "block" }}>Preferred Payout Method</label>
                      <input className={styles.formInput} value={payoutMethod} onChange={(e) => setPayoutMethod(e.target.value)} placeholder="e.g. MTN Mobile Money / Bank Transfer" />
                    </div>
                    <div>
                      <label className={styles.label} style={{ fontSize: 12.5, fontWeight: 700, color: "#001f3f", marginBottom: 4, display: "block" }}>Account Number / Phone</label>
                      <input className={styles.formInput} value={payoutAccountNo} onChange={(e) => setPayoutAccountNo(e.target.value)} placeholder="+229 97 00 00 00" />
                    </div>
                  </div>
                </div>

                {/* Operational Matchmaking Toggles */}
                <h3 style={{ fontSize: 16, fontWeight: 800, color: "#001f3f", margin: "0 0 12px" }}>Boulot Man Operational Matchmaking</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
                  <div style={{ background: "#ffffff", border: "1.5px solid #e2e8f0", borderRadius: 14, padding: 14, display: "flex", gap: 10, cursor: "pointer" }} onClick={() => setMatchConcierge(!matchConcierge)}>
                    <input type="checkbox" checked={matchConcierge} onChange={() => {}} style={{ marginTop: 2 }} />
                    <div>
                      <strong style={{ display: "block", fontSize: 13.5, color: "#001f3f" }}>Concierge Assignments</strong>
                      <small style={{ color: "#64748b" }}>Direct dispatch for managed corporate clients</small>
                    </div>
                  </div>

                  <div style={{ background: "#ffffff", border: "1.5px solid #e2e8f0", borderRadius: 14, padding: 14, display: "flex", gap: 10, cursor: "pointer" }} onClick={() => setMatchBuildTeam(!matchBuildTeam)}>
                    <input type="checkbox" checked={matchBuildTeam} onChange={() => {}} style={{ marginTop: 2 }} />
                    <div>
                      <strong style={{ display: "block", fontSize: 13.5, color: "#001f3f" }}>Build a Team Projects</strong>
                      <small style={{ color: "#64748b" }}>Join multi-disciplinary engineering crews</small>
                    </div>
                  </div>

                  <div style={{ background: "#ffffff", border: "1.5px solid #e2e8f0", borderRadius: 14, padding: 14, display: "flex", gap: 10, cursor: "pointer" }} onClick={() => setMatchSupervisor(!matchSupervisor)}>
                    <input type="checkbox" checked={matchSupervisor} onChange={() => {}} style={{ marginTop: 2 }} />
                    <div>
                      <strong style={{ display: "block", fontSize: 13.5, color: "#001f3f" }}>Lead Supervisor Capacity</strong>
                      <small style={{ color: "#64748b" }}>Lead and supervise site technicians on large contracts</small>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* ==================== BOTTOM SAVE ACTION ==================== */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 14, marginTop: 10 }}>
              <Link href="/dashboard/technician" className={styles.outlineButton}>
                Back to Dashboard
              </Link>
              <button
                type="button"
                className={styles.primaryButton}
                onClick={handleSaveProfile}
                disabled={profileSaving}
                style={{ minHeight: 48, padding: "0 32px", fontSize: 15 }}
              >
                <iconify-icon icon={profileSaving ? "lucide:loader" : "lucide:save"} className={profileSaving ? styles.spinIcon : ""} />
                {profileSaving ? "Saving All Changes..." : "Save Specialist Profile"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
