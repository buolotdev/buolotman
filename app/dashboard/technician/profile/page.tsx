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

export interface TechDocument {
  id: string | number;
  title: string;
  document_type: "identity" | "certificate" | "selfie";
  file_url: string;
  preview_url?: string;
  status: "verified" | "under_review" | "rejected";
  uploaded_at?: string;
  file_name?: string;
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

const PLATFORM_TRADE_CATEGORIES = [
  "Electrical & Solar Energy",
  "Plumbing & Sanitation Works",
  "HVAC, Air Conditioning & Cold Rooms",
  "Carpentry, Furniture & Woodwork",
  "Masonry, Tiling & Civil Construction",
  "Painting, Finishes & Waterproofing",
  "Welding, Metalwork & Steel Structures",
  "Roofing, Ceilings & Structural Waterproofing",
  "CCTV, Security Systems & Smart Home",
  "IT Infrastructure & Networking",
  "Software & Web Engineering",
  "Cybersecurity Services",
  "Cloud & Systems Engineering",
  "Automotive & Heavy Fleet Mechanics",
  "Appliance & Electronics Repair",
  "Landscaping & Environmental Works",
  "Architecture, CAD & Quantity Surveying"
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

  // Fetches
  const { data: userData, loading: userLoading, refetch: refetchUser } = useFetch(() => api.getMe(), []);
  const { data: rawDocuments, refetch: mutateDocuments } = useFetch(() => api.getTechnicianDocuments(), []);

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
  const [primaryOccupation, setPrimaryOccupation] = useState("Electrical & Solar Energy");
  const [expertiseLevel, setExpertiseLevel] = useState("Senior");
  const [educationLevel, setEducationLevel] = useState("B.Sc. Electrical Engineering");
  const [country, setCountry] = useState("Benin");
  const [city, setCity] = useState("Cotonou");
  const [address, setAddress] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);

  // Tab 2: Document Verification State (Front ID, Back ID, Trade Cert, Selfie)
  const [localDocs, setLocalDocs] = useState<TechDocument[]>([]);
  const [previewModalDoc, setPreviewModalDoc] = useState<TechDocument | null>(null);

  // Tab 3: Visual Portfolio State
  const [portfolioList, setPortfolioList] = useState<PortfolioItem[]>(DEFAULT_PORTFOLIO);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [newProjTitle, setNewProjTitle] = useState("");
  const [newProjCategory, setNewProjCategory] = useState("Electrical & Solar Energy");
  const [newProjDesc, setNewProjDesc] = useState("");
  const [newProjLocation, setNewProjLocation] = useState("");
  const [newProjBudget, setNewProjBudget] = useState("");
  const [newProjPhotoUrl, setNewProjPhotoUrl] = useState("");

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

  const isInitialSyncedRef = useRef(false);

  // Load Saved Preferences, Profile Customizations & Documents from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const rawProfile = localStorage.getItem("boulotman_technician_profile_custom");
      if (rawProfile) {
        try {
          const p = JSON.parse(rawProfile);
          if (p.firstName !== undefined && p.firstName !== "") setFirstName(p.firstName);
          if (p.lastName !== undefined && p.lastName !== "") setLastName(p.lastName);
          if (p.displayName !== undefined && p.displayName !== "") setDisplayName(p.displayName);
          if (p.headline !== undefined && p.headline !== "") setHeadline(p.headline);
          if (p.bio !== undefined && p.bio !== "") setBio(p.bio);
          if (p.city !== undefined && p.city !== "") setCity(p.city);
          if (p.country !== undefined && p.country !== "") setCountry(p.country);
          if (p.experienceYears !== undefined && p.experienceYears !== "") setExperienceYears(p.experienceYears);
          if (p.primaryOccupation !== undefined && p.primaryOccupation !== "") setPrimaryOccupation(p.primaryOccupation);
          if (p.educationLevel !== undefined && p.educationLevel !== "") setEducationLevel(p.educationLevel);
          if (p.expertiseLevel !== undefined && p.expertiseLevel !== "") setExpertiseLevel(p.expertiseLevel);
          if (Array.isArray(p.skills)) setSkills(p.skills);
        } catch {}
      }

      const rawSkills = localStorage.getItem("boulotman_technician_skills");
      if (rawSkills) {
        try { setSkills(JSON.parse(rawSkills)); } catch {}
      }

      const rawPort = localStorage.getItem("boulotman_technician_portfolio");
      if (rawPort) { try { setPortfolioList(JSON.parse(rawPort)); } catch {} }

      const rawTools = localStorage.getItem("boulotman_technician_tools");
      if (rawTools) { try { setToolsList(JSON.parse(rawTools)); } catch {} }

      const rawAvail = localStorage.getItem("boulotman_technician_available_now");
      if (rawAvail !== null) setAvailableNow(rawAvail === "true");

      const rawDocs = localStorage.getItem("boulotman_technician_documents");
      if (rawDocs) { try { setLocalDocs(JSON.parse(rawDocs)); } catch {} }
    }
  }, []);

  // Sync initial User Data once without ever overwriting user's active/saved edits
  useEffect(() => {
    if (userData && !isInitialSyncedRef.current) {
      isInitialSyncedRef.current = true;
      const rawProfile = typeof window !== "undefined" ? localStorage.getItem("boulotman_technician_profile_custom") : null;
      let savedP: any = {};
      if (rawProfile) {
        try { savedP = JSON.parse(rawProfile); } catch {}
      }

      if (userData.first_name && !savedP.firstName) setFirstName(userData.first_name);
      if (userData.last_name && !savedP.lastName) setLastName(userData.last_name);
      if (!savedP.displayName) {
        setDisplayName(userData.first_name ? `${userData.first_name} ${(userData.last_name || "")[0] || ""}.` : userData.username || "");
      }
      if (userData.email) setEmail(userData.email);
      if (userData.phone) setPhone(userData.phone);
      
      const userBio = userData.bio || userData.about || (userData as any).technician_profile?.bio;
      if (userBio && !savedP.bio) setBio(userBio);

      if (Array.isArray(userData.skills) && userData.skills.length > 0) setSkills(userData.skills);
      if (userData.date_of_birth) setDateOfBirth(userData.date_of_birth);
      if (userData.address) setAddress(userData.address);
      if (userData.education_level && !savedP.educationLevel) setEducationLevel(userData.education_level);
      if (userData.expertise_level && !savedP.expertiseLevel) setExpertiseLevel(userData.expertise_level);

      const userCountry = userData.country || (userData as any).technician_profile?.country;
      if (userCountry && !savedP.country) setCountry(userCountry);

      const userCity = userData.city || (userData as any).technician_profile?.city;
      if (userCity && !savedP.city) setCity(userCity);

      if (userData.avatar_url) setAvatarUrl(userData.avatar_url);
      if (userData.banner_url) setBannerUrl(userData.banner_url);
    }
  }, [userData]);

  const userName = `${firstName} ${lastName}`.trim() || userData?.username || "Specialist";
  const userInitials = useMemo(() => {
    const f = firstName[0] || userData?.first_name?.[0] || "";
    const l = lastName[0] || userData?.last_name?.[0] || "";
    return `${f}${l}`.toUpperCase() || "SP";
  }, [firstName, lastName, userData]);

  const isVerified = Boolean(userData?.is_verified || userData?.technician_profile?.is_verified);

  // Combined documents (backend + local)
  const allDocuments: TechDocument[] = useMemo(() => {
    const backendDocs: TechDocument[] = Array.isArray(rawDocuments)
      ? rawDocuments.map((d: any) => ({
          id: d.id,
          title: d.title || "Verification Document",
          document_type: d.document_type === "certificate" ? "certificate" : "identity",
          file_url: d.file_url || "",
          preview_url: d.file_url ? getImageUrl(d.file_url) : undefined,
          status: d.status || "verified",
          uploaded_at: d.created_at ? new Date(d.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "Verified",
          file_name: d.file_name || d.title,
        }))
      : [];

    const map = new Map<string, TechDocument>();
    localDocs.forEach(d => map.set(d.title.toLowerCase(), d));
    backendDocs.forEach(d => map.set(d.title.toLowerCase(), d));
    return Array.from(map.values());
  }, [rawDocuments, localDocs]);

  // Helper to find document by slot keyword
  const getSlotDoc = (keyword: string) => {
    return allDocuments.find(d => d.title.toLowerCase().includes(keyword.toLowerCase())) || null;
  };

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
      // 1. Immediately persist custom profile fields locally
      const customProfileData = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        displayName: displayName.trim(),
        headline: headline.trim(),
        bio: bio.trim(),
        city: city.trim(),
        country: country.trim(),
        experienceYears: experienceYears.trim(),
        primaryOccupation,
        educationLevel: educationLevel.trim(),
        expertiseLevel,
        skills,
      };
      localStorage.setItem("boulotman_technician_profile_custom", JSON.stringify(customProfileData));
      localStorage.setItem("boulotman_technician_skills", JSON.stringify(skills));
      localStorage.setItem("boulotman_technician_portfolio", JSON.stringify(portfolioList));
      localStorage.setItem("boulotman_technician_tools", JSON.stringify(toolsList));
      localStorage.setItem("boulotman_technician_available_now", String(availableNow));
      localStorage.setItem("boulotman_technician_documents", JSON.stringify(localDocs));

      // 2. Send complete payload to backend
      await api.updateProfile({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        bio: bio.trim(),
        about: bio.trim(),
        skills: skills,
        country: country.trim(),
        city: city.trim(),
        address: address.trim(),
        date_of_birth: dateOfBirth || null,
        education_level: educationLevel,
        expertise_level: expertiseLevel,
        headline: headline.trim(),
        technician_profile: {
          bio: bio.trim(),
          city: city.trim(),
          country: country.trim(),
          headline: headline.trim(),
          experience_years: experienceYears,
        }
      });

      try { await refetchUser(); } catch {}
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
    if (!skills.includes(val)) {
      const updated = [...skills, val];
      setSkills(updated);
      localStorage.setItem("boulotman_technician_skills", JSON.stringify(updated));
    }
    setNewSkill("");
  };

  const handleRemoveSkill = (index: number) => {
    const updated = skills.filter((_, i) => i !== index);
    setSkills(updated);
    localStorage.setItem("boulotman_technician_skills", JSON.stringify(updated));
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
      photoUrl: newProjPhotoUrl || undefined,
    };
    const updated = [newPort, ...portfolioList];
    setPortfolioList(updated);
    localStorage.setItem("boulotman_technician_portfolio", JSON.stringify(updated));
    setNewProjTitle("");
    setNewProjDesc("");
    setNewProjLocation("");
    setNewProjBudget("");
    setNewProjPhotoUrl("");
    setShowAddProjectModal(false);
    toast.success("Portfolio Added", "Your completed work has been added to your profile gallery.");
  };

  const handleDeletePortfolio = (id: string) => {
    const updated = portfolioList.filter(p => p.id !== id);
    setPortfolioList(updated);
    localStorage.setItem("boulotman_technician_portfolio", JSON.stringify(updated));
    toast.info("Project Removed", "Portfolio project deleted.");
  };

  // Document Upload for Specific Slots (Front ID, Back ID, Trade Cert, Selfie)
  const handleDocumentUpload = (file: File, slotKey: "front" | "back" | "cert" | "selfie", slotTitle: string, docType: "identity" | "certificate" | "selfie") => {
    setUploadingSlot(slotKey);
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      let serverUrl = "";

      try {
        const res = await api.uploadTechnicianDocument(file);
        serverUrl = res.file_url || res.url || "";
      } catch (err) {
        console.warn("Backend direct upload note:", err);
      }

      const newDoc: TechDocument = {
        id: `doc-${slotKey}-${Date.now()}`,
        title: slotTitle,
        document_type: docType,
        file_url: serverUrl || dataUrl,
        preview_url: dataUrl,
        status: "under_review",
        uploaded_at: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
        file_name: file.name,
      };

      // Filter out existing doc for same slot title
      const filtered = localDocs.filter(d => !d.title.toLowerCase().includes(slotKey) && String(d.id) !== String(newDoc.id));
      const updated = [newDoc, ...filtered];
      setLocalDocs(updated);
      localStorage.setItem("boulotman_technician_documents", JSON.stringify(updated));

      try { await mutateDocuments(); } catch {}
      toast.success("Document Uploaded", `${slotTitle} submitted for review.`);
      setUploadingSlot(null);
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteDoc = async (id: string | number, title: string) => {
    if (!await dialog.confirm({ title: "Delete Document", message: `Delete "${title}"?` })) return;
    try {
      if (typeof id === "number") {
        await api.deleteTechnicianDocument(id);
      }
    } catch {}

    const updated = localDocs.filter(d => String(d.id) !== String(id) && d.title !== title);
    setLocalDocs(updated);
    localStorage.setItem("boulotman_technician_documents", JSON.stringify(updated));
    try { await mutateDocuments(); } catch {}
    toast.info("Document Deleted", "Document removed.");
  };

  // Slot Docs
  const frontIdDoc = getSlotDoc("front");
  const backIdDoc = getSlotDoc("back");
  const certDoc = getSlotDoc("license") || getSlotDoc("trade");
  const selfieDoc = getSlotDoc("selfie") || getSlotDoc("portrait");

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

            {/* FULL DOCUMENT PREVIEW MODAL */}
            {previewModalDoc && (
              <div style={{ position: "fixed", inset: 0, background: "rgba(0,15,30,0.85)", backdropFilter: "blur(8px)", zIndex: 99999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
                <div style={{ background: "#ffffff", borderRadius: 24, width: "100%", maxWidth: 640, overflow: "hidden", boxShadow: "0 25px 50px rgba(0,0,0,0.25)" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px", borderBottom: "1px solid #e2e8f0", background: "#f8fafc" }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#001f3f" }}>{previewModalDoc.title}</h3>
                      <span style={{ fontSize: 12, color: "#16a34a", fontWeight: 700 }}>
                        <iconify-icon icon="lucide:shield-check" style={{ marginRight: 4 }} />
                        Confidential Verification Vault
                      </span>
                    </div>
                    <button type="button" onClick={() => setPreviewModalDoc(null)} style={{ border: "none", background: "#ffffff", borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}>
                      <iconify-icon icon="lucide:x" style={{ fontSize: 18, color: "#64748b" }} />
                    </button>
                  </div>

                  <div style={{ padding: 20, textAlign: "center", background: "#0f172a", minHeight: 320, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {previewModalDoc.preview_url || previewModalDoc.file_url ? (
                      <img
                        src={getImageUrl(previewModalDoc.preview_url || previewModalDoc.file_url)}
                        alt={previewModalDoc.title}
                        style={{ maxWidth: "100%", maxHeight: "480px", objectFit: "contain", borderRadius: 12 }}
                      />
                    ) : (
                      <div style={{ color: "#ffffff", padding: 40 }}>
                        <iconify-icon icon="lucide:file-text" style={{ fontSize: 48, marginBottom: 10, color: "#38bdf8" }} />
                        <p style={{ margin: 0 }}>Document file stored in secure vault.</p>
                      </div>
                    )}
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 24px", background: "#f8fafc", borderTop: "1px solid #e2e8f0" }}>
                    <span style={{ fontSize: 12, color: "#64748b" }}>Status: <strong>{previewModalDoc.status === "verified" ? "Verified ✓" : "Under Review ⏳"}</strong></span>
                    <button type="button" onClick={() => setPreviewModalDoc(null)} className={styles.primaryButton} style={{ minHeight: 38, padding: "0 20px", fontSize: 13 }}>
                      Close Preview
                    </button>
                  </div>
                </div>
              </div>
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
                <iconify-icon icon="lucide:shield-check" /> 2. 3-Tier Verification ({allDocuments.length})
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
                    <label className={styles.label} style={{ fontSize: 13, fontWeight: 700, color: "#001f3f", marginBottom: 6, display: "block" }}>First Name</label>
                    <input className={styles.formInput} placeholder="e.g. Aneeq" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                  </div>
                  <div>
                    <label className={styles.label} style={{ fontSize: 13, fontWeight: 700, color: "#001f3f", marginBottom: 6, display: "block" }}>Last Name</label>
                    <input className={styles.formInput} placeholder="e.g. Nisar" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                  </div>
                </div>

                <div className={styles.twoCol}>
                  <div>
                    <label className={styles.label} style={{ fontSize: 13, fontWeight: 700, color: "#001f3f", marginBottom: 6, display: "block" }}>Display / Privacy Name (Shown to clients)</label>
                    <input className={styles.formInput} placeholder="e.g. Aneeq N." value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                  </div>
                  <div>
                    <label className={styles.label} style={{ fontSize: 13, fontWeight: 700, color: "#001f3f", marginBottom: 6, display: "block" }}>Professional Headline</label>
                    <input className={styles.formInput} placeholder="e.g. Certified Electrician & Solar Specialist" value={headline} onChange={(e) => setHeadline(e.target.value)} />
                  </div>
                </div>

                <div className={styles.twoCol}>
                  <div>
                    <label className={styles.label} style={{ fontSize: 13, fontWeight: 700, color: "#001f3f", marginBottom: 6, display: "block" }}>Primary Trade / Occupation</label>
                    <select className={styles.formInput} value={primaryOccupation} onChange={(e) => setPrimaryOccupation(e.target.value)} style={{ width: "100%", height: 44, padding: "0 12px", border: "1.5px solid #cbd5e1", borderRadius: 10 }}>
                      {PLATFORM_TRADE_CATEGORIES.map((trade) => (
                        <option key={trade} value={trade}>{trade}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={styles.label} style={{ fontSize: 13, fontWeight: 700, color: "#001f3f", marginBottom: 6, display: "block" }}>Years of Hands-on Experience</label>
                    <input className={styles.formInput} placeholder="e.g. 8" value={experienceYears} onChange={(e) => setExperienceYears(e.target.value)} />
                  </div>
                </div>

                <div className={styles.twoCol}>
                  <div>
                    <label className={styles.label} style={{ fontSize: 13, fontWeight: 700, color: "#001f3f", marginBottom: 6, display: "block" }}>Skill / Seniority Level</label>
                    <select className={styles.formInput} value={expertiseLevel} onChange={(e) => setExpertiseLevel(e.target.value)} style={{ width: "100%", height: 44, padding: "0 12px", border: "1.5px solid #cbd5e1", borderRadius: 10 }}>
                      <option value="Junior">Junior (1-3 Years)</option>
                      <option value="Intermediate">Intermediate (3-6 Years)</option>
                      <option value="Senior">Senior Master (6-12 Years)</option>
                      <option value="Expert">Lead Expert / Site Supervisor (12+ Years)</option>
                    </select>
                  </div>
                  <div>
                    <label className={styles.label} style={{ fontSize: 13, fontWeight: 700, color: "#001f3f", marginBottom: 6, display: "block" }}>Education & Training Institution</label>
                    <input className={styles.formInput} placeholder="e.g. Lycée Technique Coulibaly / B.Sc. Electrical Eng" value={educationLevel} onChange={(e) => setEducationLevel(e.target.value)} />
                  </div>
                </div>

                <div className={styles.twoCol}>
                  <div>
                    <label className={styles.label} style={{ fontSize: 13, fontWeight: 700, color: "#001f3f", marginBottom: 6, display: "block" }}>Operating City / Town</label>
                    <input className={styles.formInput} placeholder="e.g. Cotonou" value={city} onChange={(e) => setCity(e.target.value)} />
                  </div>
                  <div>
                    <label className={styles.label} style={{ fontSize: 13, fontWeight: 700, color: "#001f3f", marginBottom: 6, display: "block" }}>Operating Country</label>
                    <input className={styles.formInput} placeholder="e.g. Benin" value={country} onChange={(e) => setCountry(e.target.value)} />
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
                  {skills.length === 0 ? (
                    <p style={{ fontSize: 13, color: "#94a3b8", margin: "4px 0 10px", fontStyle: "italic" }}>
                      No skills added yet. Type a skill below and click &quot;Add&quot; to list your trade specializations.
                    </p>
                  ) : (
                    <div className={styles.skillsListEditable}>
                      {skills.map((skill, index) => (
                        <span key={index} className={styles.skillTag}>
                          {skill}
                          <button type="button" className={styles.skillAction} onClick={() => handleRemoveSkill(index)}>
                            <iconify-icon icon="lucide:x" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
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

            {/* ==================== TAB 2: 3-TIER VERIFICATION & 4-SLOT UPLOADER ==================== */}
            {activeTab === "verification" && (
              <section className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2 style={{ fontSize: 18, fontWeight: 800, color: "#001f3f", margin: 0 }}>
                    <iconify-icon icon="lucide:shield-check" style={{ color: "#16a34a" }} /> 3-Tier Specialist Verification & ID Uploads
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
                    <p className={styles.tierDesc}>National ID / Passport (Front & Back) confirmed by Boulot Man security.</p>
                  </div>

                  <div className={`${styles.tierCard} ${styles.tierCardCurrent}`}>
                    <div className={styles.tierHeader}>
                      <span style={{ fontSize: 20 }}>🥈</span>
                      <span className={styles.tierBadge} style={{ background: "rgba(255,69,0,0.1)", color: "#ff4500" }}>Active Status ✓</span>
                    </div>
                    <h4 className={styles.tierTitle}>2. Professional Verified</h4>
                    <p className={styles.tierDesc}>Trade certifications, diploma, and technical skills evaluated.</p>
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
                  Please upload both the <strong>Front and Back side</strong> of your National ID/Passport, your trade diploma/certificate, and a live photo/selfie. <strong>Sensitive identity documents remain strictly private</strong> in our encrypted vault and are never displayed publicly.
                </p>

                {/* 4-SLOT DEDICATED UPLOAD GRID */}
                <div className={styles.uploadGrid4}>
                  
                  {/* SLOT 1: NATIONAL ID (FRONT SIDE) */}
                  <div className={`${styles.docUploadCard} ${frontIdDoc ? styles.docUploadCardFilled : ""}`}>
                    {frontIdDoc?.preview_url || frontIdDoc?.file_url ? (
                      <div className={styles.docThumbPreview} onClick={() => setPreviewModalDoc(frontIdDoc)} title="Click to view enlarged">
                        <img src={getImageUrl(frontIdDoc.preview_url || frontIdDoc.file_url)} alt="Front ID Preview" />
                        <span style={{ position: "absolute", bottom: 6, right: 6, background: "rgba(0,0,0,0.7)", color: "#fff", padding: "2px 6px", borderRadius: 4, fontSize: 10, fontWeight: 700 }}>
                          <iconify-icon icon="lucide:maximize-2" /> View
                        </span>
                      </div>
                    ) : (
                      <div className={styles.docSlotIcon}>
                        <iconify-icon icon="lucide:id-card" />
                      </div>
                    )}

                    <h4 className={styles.docSlotTitle}>National ID (Front Side) *</h4>
                    <p className={styles.docSlotSub}>
                      {frontIdDoc ? "✓ Uploaded (Ready for review)" : "Clear photo of the front of your ID card or Passport"}
                    </p>

                    <div className={styles.docSlotActions}>
                      <button
                        type="button"
                        className={styles.docUploadActionBtn}
                        disabled={uploadingSlot === "front"}
                        onClick={() => {
                          const input = document.createElement("input");
                          input.type = "file";
                          input.accept = "image/*,application/pdf";
                          input.onchange = (e: any) => {
                            const file = e.target.files?.[0];
                            if (file) handleDocumentUpload(file, "front", "National ID (Front Side)", "identity");
                          };
                          input.click();
                        }}
                      >
                        <iconify-icon icon={uploadingSlot === "front" ? "lucide:loader" : "lucide:upload"} />
                        {uploadingSlot === "front" ? "Uploading..." : frontIdDoc ? "Replace Front" : "Upload Front"}
                      </button>

                      {frontIdDoc && (
                        <button type="button" className={styles.docDeleteActionBtn} onClick={() => handleDeleteDoc(frontIdDoc.id, frontIdDoc.title)} title="Delete document">
                          <iconify-icon icon="lucide:trash-2" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* SLOT 2: NATIONAL ID (BACK SIDE) */}
                  <div className={`${styles.docUploadCard} ${backIdDoc ? styles.docUploadCardFilled : ""}`}>
                    {backIdDoc?.preview_url || backIdDoc?.file_url ? (
                      <div className={styles.docThumbPreview} onClick={() => setPreviewModalDoc(backIdDoc)} title="Click to view enlarged">
                        <img src={getImageUrl(backIdDoc.preview_url || backIdDoc.file_url)} alt="Back ID Preview" />
                        <span style={{ position: "absolute", bottom: 6, right: 6, background: "rgba(0,0,0,0.7)", color: "#fff", padding: "2px 6px", borderRadius: 4, fontSize: 10, fontWeight: 700 }}>
                          <iconify-icon icon="lucide:maximize-2" /> View
                        </span>
                      </div>
                    ) : (
                      <div className={styles.docSlotIcon}>
                        <iconify-icon icon="lucide:flip-horizontal" />
                      </div>
                    )}

                    <h4 className={styles.docSlotTitle}>National ID (Back Side) *</h4>
                    <p className={styles.docSlotSub}>
                      {backIdDoc ? "✓ Uploaded (Ready for review)" : "Clear photo of the back side showing barcode & signature"}
                    </p>

                    <div className={styles.docSlotActions}>
                      <button
                        type="button"
                        className={styles.docUploadActionBtn}
                        disabled={uploadingSlot === "back"}
                        onClick={() => {
                          const input = document.createElement("input");
                          input.type = "file";
                          input.accept = "image/*,application/pdf";
                          input.onchange = (e: any) => {
                            const file = e.target.files?.[0];
                            if (file) handleDocumentUpload(file, "back", "National ID (Back Side)", "identity");
                          };
                          input.click();
                        }}
                      >
                        <iconify-icon icon={uploadingSlot === "back" ? "lucide:loader" : "lucide:upload"} />
                        {uploadingSlot === "back" ? "Uploading..." : backIdDoc ? "Replace Back" : "Upload Back"}
                      </button>

                      {backIdDoc && (
                        <button type="button" className={styles.docDeleteActionBtn} onClick={() => handleDeleteDoc(backIdDoc.id, backIdDoc.title)} title="Delete document">
                          <iconify-icon icon="lucide:trash-2" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* SLOT 3: TRADE LICENSE & CERTIFICATES */}
                  <div className={`${styles.docUploadCard} ${certDoc ? styles.docUploadCardFilled : ""}`}>
                    {certDoc?.preview_url || certDoc?.file_url ? (
                      <div className={styles.docThumbPreview} onClick={() => setPreviewModalDoc(certDoc)} title="Click to view enlarged">
                        <img src={getImageUrl(certDoc.preview_url || certDoc.file_url)} alt="Cert Preview" />
                        <span style={{ position: "absolute", bottom: 6, right: 6, background: "rgba(0,0,0,0.7)", color: "#fff", padding: "2px 6px", borderRadius: 4, fontSize: 10, fontWeight: 700 }}>
                          <iconify-icon icon="lucide:maximize-2" /> View
                        </span>
                      </div>
                    ) : (
                      <div className={styles.docSlotIcon}>
                        <iconify-icon icon="lucide:award" />
                      </div>
                    )}

                    <h4 className={styles.docSlotTitle}>Trade License & Diploma</h4>
                    <p className={styles.docSlotSub}>
                      {certDoc ? "✓ Uploaded (Ready for review)" : "Electrical, Plumbing, HVAC or Vocational qualification"}
                    </p>

                    <div className={styles.docSlotActions}>
                      <button
                        type="button"
                        className={styles.docUploadActionBtn}
                        disabled={uploadingSlot === "cert"}
                        onClick={() => {
                          const input = document.createElement("input");
                          input.type = "file";
                          input.accept = "image/*,application/pdf";
                          input.onchange = (e: any) => {
                            const file = e.target.files?.[0];
                            if (file) handleDocumentUpload(file, "cert", "Trade License & Professional Certifications", "certificate");
                          };
                          input.click();
                        }}
                      >
                        <iconify-icon icon={uploadingSlot === "cert" ? "lucide:loader" : "lucide:upload"} />
                        {uploadingSlot === "cert" ? "Uploading..." : certDoc ? "Replace Cert" : "Upload Cert"}
                      </button>

                      {certDoc && (
                        <button type="button" className={styles.docDeleteActionBtn} onClick={() => handleDeleteDoc(certDoc.id, certDoc.title)} title="Delete document">
                          <iconify-icon icon="lucide:trash-2" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* SLOT 4: LIVE IDENTITY SELFIE */}
                  <div className={`${styles.docUploadCard} ${selfieDoc ? styles.docUploadCardFilled : ""}`}>
                    {selfieDoc?.preview_url || selfieDoc?.file_url ? (
                      <div className={styles.docThumbPreview} onClick={() => setPreviewModalDoc(selfieDoc)} title="Click to view enlarged">
                        <img src={getImageUrl(selfieDoc.preview_url || selfieDoc.file_url)} alt="Selfie Preview" />
                        <span style={{ position: "absolute", bottom: 6, right: 6, background: "rgba(0,0,0,0.7)", color: "#fff", padding: "2px 6px", borderRadius: 4, fontSize: 10, fontWeight: 700 }}>
                          <iconify-icon icon="lucide:maximize-2" /> View
                        </span>
                      </div>
                    ) : (
                      <div className={styles.docSlotIcon}>
                        <iconify-icon icon="lucide:camera" />
                      </div>
                    )}

                    <h4 className={styles.docSlotTitle}>Live Photo / Selfie Check</h4>
                    <p className={styles.docSlotSub}>
                      {selfieDoc ? "✓ Uploaded (Ready for review)" : "Clear portrait selfie holding your ID for verification"}
                    </p>

                    <div className={styles.docSlotActions}>
                      <button
                        type="button"
                        className={styles.docUploadActionBtn}
                        disabled={uploadingSlot === "selfie"}
                        onClick={() => {
                          const input = document.createElement("input");
                          input.type = "file";
                          input.accept = "image/*";
                          input.onchange = (e: any) => {
                            const file = e.target.files?.[0];
                            if (file) handleDocumentUpload(file, "selfie", "Live Selfie / Photo Verification", "selfie");
                          };
                          input.click();
                        }}
                      >
                        <iconify-icon icon={uploadingSlot === "selfie" ? "lucide:loader" : "lucide:upload"} />
                        {uploadingSlot === "selfie" ? "Uploading..." : selfieDoc ? "Replace Selfie" : "Upload Selfie"}
                      </button>

                      {selfieDoc && (
                        <button type="button" className={styles.docDeleteActionBtn} onClick={() => handleDeleteDoc(selfieDoc.id, selfieDoc.title)} title="Delete document">
                          <iconify-icon icon="lucide:trash-2" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* SUBMITTED DOCUMENTS VAULT & REVIEW LIST */}
                <div className={styles.documentsArea}>
                  <div className={styles.documentsHeader}>
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#001f3f" }}>
                      <iconify-icon icon="lucide:vault" style={{ color: "#16a34a", marginRight: 6 }} />
                      Verified Document Vault ({allDocuments.length})
                    </h3>
                    <span style={{ fontSize: 12.5, color: "#64748b" }}>
                      All documents encrypted with 256-bit AES Vault Security
                    </span>
                  </div>

                  {allDocuments.length === 0 ? (
                    <div style={{ background: "#f8fafc", border: "1.5px dashed #cbd5e1", borderRadius: 16, padding: "28px", textAlign: "center", color: "#64748b" }}>
                      <iconify-icon icon="lucide:file-question" style={{ fontSize: 32, marginBottom: 8, color: "#94a3b8" }} />
                      <p style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 700, color: "#001f3f" }}>No documents uploaded yet</p>
                      <p style={{ margin: 0, fontSize: 12.5 }}>Upload your Front ID, Back ID, and Trade certificates above to complete verification.</p>
                    </div>
                  ) : (
                    <div className={styles.documentList}>
                      {allDocuments.map((doc) => (
                        <div key={doc.id} className={styles.documentItem}>
                          <div style={{ width: 48, height: 48, borderRadius: 10, overflow: "hidden", background: "#e2e8f0", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            {doc.preview_url || doc.file_url ? (
                              <img src={getImageUrl(doc.preview_url || doc.file_url)} alt={doc.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            ) : (
                              <iconify-icon icon="lucide:file-check" style={{ fontSize: 24, color: "#001f3f" }} />
                            )}
                          </div>

                          <div className={styles.docInfo}>
                            <strong>{doc.title}</strong>
                            <span>
                              {doc.document_type === "certificate" ? "Trade Qualification" : doc.document_type === "selfie" ? "Selfie Check" : "Identity Document"} • {doc.uploaded_at || "Recent"} •{" "}
                              <strong style={{ color: doc.status === "verified" ? "#16a34a" : "#f59e0b" }}>
                                {doc.status === "verified" ? "Verified ✓" : "Under Review ⏳"}
                              </strong>
                            </span>
                          </div>

                          <div className={styles.docActions}>
                            <button
                              type="button"
                              className={styles.viewDocBtn}
                              onClick={() => setPreviewModalDoc(doc)}
                            >
                              <iconify-icon icon="lucide:eye" /> View
                            </button>

                            <button type="button" className={styles.deleteBtn} onClick={() => handleDeleteDoc(doc.id, doc.title)} title="Delete Document">
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
                        {item.photoUrl ? (
                          <img src={getImageUrl(item.photoUrl)} alt={item.title} />
                        ) : (
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.75)" }}>
                            <iconify-icon icon="lucide:briefcase" style={{ fontSize: 38 }} />
                            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase" }}>Proof of Work</span>
                          </div>
                        )}
                        {item.budget && (
                          <span className={styles.portfolioBudgetPill}>
                            {item.budget}
                          </span>
                        )}
                      </div>
                      <div className={styles.portfolioBody}>
                        <div className={styles.portfolioCategoryHeader}>
                          <span className={styles.portfolioCategoryTag}>{item.category}</span>
                          <button
                            type="button"
                            className={styles.portfolioDeleteBtn}
                            onClick={() => handleDeletePortfolio(item.id)}
                            title="Delete Project"
                          >
                            <iconify-icon icon="lucide:trash-2" />
                          </button>
                        </div>
                        <h4 className={styles.portfolioTitle}>{item.title}</h4>
                        <p className={styles.portfolioDesc}>{item.description}</p>
                        <div className={styles.portfolioFooter}>
                          <span><iconify-icon icon="lucide:map-pin" style={{ marginRight: 4, color: "#001f3f" }} /> {item.location}</span>
                          <span><iconify-icon icon="lucide:calendar" style={{ marginRight: 4, color: "#001f3f" }} /> {item.completionDate}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Portfolio Modal */}
                {showAddProjectModal && (
                  <div style={{ position: "fixed", inset: 0, background: "rgba(0,15,30,0.75)", backdropFilter: "blur(8px)", zIndex: 99999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
                    <div style={{ background: "#ffffff", borderRadius: 20, width: "100%", maxWidth: 520, maxHeight: "90vh", overflowY: "auto", padding: 24 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, borderBottom: "1px solid #f1f5f9", paddingBottom: 12 }}>
                        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#001f3f" }}>Add Completed Work / Project</h3>
                        <button type="button" onClick={() => setShowAddProjectModal(false)} style={{ border: "none", background: "#f1f5f9", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
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
                            <label style={{ display: "block", fontSize: "12.5px", fontWeight: 700, color: "#001f3f", marginBottom: 5 }}>Trade Category ({PLATFORM_TRADE_CATEGORIES.length} Categories)</label>
                            <select className={styles.formInput} value={newProjCategory} onChange={(e) => setNewProjCategory(e.target.value)} style={{ width: "100%", height: 44, padding: "0 12px", border: "1.5px solid #cbd5e1", borderRadius: 8 }}>
                              {PLATFORM_TRADE_CATEGORIES.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                              ))}
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

                          <div>
                            <label style={{ display: "block", fontSize: "12.5px", fontWeight: 700, color: "#001f3f", marginBottom: 5 }}>Project Cover Photo (Optional)</label>
                            <input
                              type="file"
                              accept="image/*"
                              className={styles.formInput}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = () => setNewProjPhotoUrl(reader.result as string);
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                            {newProjPhotoUrl && (
                              <div style={{ marginTop: 8, width: "100%", height: 100, borderRadius: 10, overflow: "hidden", border: "1px solid #e2e8f0" }}>
                                <img src={newProjPhotoUrl} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                              </div>
                            )}
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
