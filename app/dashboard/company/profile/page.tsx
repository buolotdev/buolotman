"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./profile.module.css";
import { useFetch } from "@/app/lib/useFetch";
import { api, getImageUrl } from "@/app/lib/api";
import { useToast } from "@/app/components/Toast";
import { useDialog } from "@/app/components/Dialog";
import ImageCropperModal from "@/app/components/ImageCropperModal";

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  qualification: string;
  experienceYears?: string;
  technicianId?: string;
  avatarUrl?: string;
}

const DEFAULT_TEAM: TeamMember[] = [
  {
    id: "tm-1",
    name: "Nelson Tagor",
    role: "Managing Director / CEO",
    qualification: "M.Sc. Civil & Structural Engineering",
    experienceYears: "14+ Years",
  },
  {
    id: "tm-2",
    name: "Marcelle Dossou",
    role: "Lead Project Manager",
    qualification: "PMP Certified / B.Sc. Construction Mgmt",
    experienceYears: "9+ Years",
  },
  {
    id: "tm-3",
    name: "Alexandre Houeto",
    role: "Chief Electrical & Solar Engineer",
    qualification: "Chartered Electrical Engineer (OIB)",
    experienceYears: "11+ Years",
  }
];

const DEFAULT_CAPABILITIES = {
  maxProjectBudget: "250,000,000 XOF",
  simultaneousProjects: "5 Sites",
  permanentWorkforce: "42 Staff",
  qualifiedEngineers: "8 Engineers",
  fieldSupervisors: "6 Supervisors",
  geographicMobility: "Nationwide & Cross-Border (West Africa)",
  facilities: "Central Workshop & 1,200m² Storage Depot",
  equipment: [
    "Caterpillar 320D Excavator",
    "2x Mercedes 20T Dump Trucks",
    "Potain Self-Erecting Tower Crane",
    "50kVA Perkins Diesel Backup Generator",
    "Total Station Leica TS07 Survey Gear",
    "Heavy Scaffolding Systems (2,000m²)"
  ]
};

export default function CompanyProfilePage() {
  const toast = useToast();
  const dialog = useDialog();

  // Tab State
  const [activeTab, setActiveTab] = useState<"overview" | "verification" | "capabilities" | "services" | "projects" | "team" | "insurance">("overview");

  // Fetches
  const { data: user, refetch: refetchUser } = useFetch(() => api.getMe(), []);
  const { data: profile, loading: profileLoading, refetch: refetchProfile } = useFetch(() => api.getCompanyProfile(), []);
  const { data: servicesData, refetch: refetchServices } = useFetch(() => api.getCompanyServices(), []);
  const { data: projectsData, refetch: refetchProjects } = useFetch(() => api.getCompanyProjects(), []);
  const { data: rawDocuments, refetch: mutateDocuments } = useFetch(() => api.getTechnicianDocuments(), []);
  const documents = useMemo(() => (Array.isArray(rawDocuments) ? rawDocuments : []), [rawDocuments]);

  // Form State - Overview & Branding
  const [form, setForm] = useState({
    company_name: "",
    trading_name: "",
    company_type: "Limited Liability Company (SARL)",
    year_founded: "",
    industry: "Construction",
    subject_title: "",
    about: "",
    website: "",
    country: "",
    city: "",
    headquarters: "",
    employee_count: "25 - 50 Employees",
    primary_contact_name: "",
    primary_contact_role: "",
    primary_phone: "",
    primary_email: "",
    preferred_language: "fr",
    working_hours: "Mon - Sat: 07:30 - 18:00",
    areas_of_expertise: [] as string[],
    services_offered: [] as string[],
  });

  const [expertiseInput, setExpertiseInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  // Form State - Capabilities & Fleet
  const [capabilities, setCapabilities] = useState(DEFAULT_CAPABILITIES);
  const [equipmentInput, setEquipmentInput] = useState("");

  // Form State - Team Members
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(DEFAULT_TEAM);
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamRole, setNewTeamRole] = useState("");
  const [newTeamQual, setNewTeamQual] = useState("");
  const [newTeamExp, setNewTeamExp] = useState("");

  // Form State - Insurance, Banking & Matchmaking
  const [insurancePolicyNo, setInsurancePolicyNo] = useState("AXA-BENIN-PL-902341");
  const [insuranceProvider, setInsuranceProvider] = useState("AXA Assurances Bénin");
  const [insuranceCoverage, setInsuranceCoverage] = useState("500,000,000 XOF Public Liability");
  const [bankName, setBankName] = useState("Bank of Africa (BOA)");
  const [accountNumber, setAccountNumber] = useState("BJ061 01001 0023491823 45");
  const [swiftBic, setSwiftBic] = useState("AFRIBJBJ");
  const [matchLargeBidding, setMatchLargeBidding] = useState(true);
  const [matchSubcontracting, setMatchSubcontracting] = useState(true);
  const [matchConcierge, setMatchConcierge] = useState(true);
  const [matchEmergency, setMatchEmergency] = useState(false);

  // Upload & Cropper State
  const [cropData, setCropData] = useState<{ src: string; type: "logo" | "cover" } | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingSlot, setUploadingSlot] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // Add Service Form State
  const [showAddService, setShowAddService] = useState(false);
  const [newServiceTitle, setNewServiceTitle] = useState("");
  const [newServiceCategory, setNewServiceCategory] = useState("General Contracting");
  const [newServicePricing, setNewServicePricing] = useState("Request Quote");
  const [newServiceDesc, setNewServiceDesc] = useState("");
  const [addingService, setAddingService] = useState(false);

  // Add Portfolio Project Form State
  const [showAddProject, setShowAddProject] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [newProjectClient, setNewProjectClient] = useState("");
  const [newProjectUrl, setNewProjectUrl] = useState("");
  const [newProjectBudget, setNewProjectBudget] = useState("");
  const [newProjectTimeline, setNewProjectTimeline] = useState("");
  const [addingProject, setAddingProject] = useState(false);

  // Sync profile data to form
  useEffect(() => {
    if (profile && !profileLoading) {
      setForm({
        company_name: profile.company_name || user?.company_name || "",
        trading_name: profile.trading_name || profile.company_name || user?.company_name || "",
        company_type: profile.company_type || "Limited Liability Company (SARL)",
        year_founded: profile.year_founded || "",
        industry: profile.industry || "Construction",
        subject_title: profile.subject_title || "",
        about: profile.about || "",
        website: profile.website || "",
        country: profile.country || user?.country || "Benin",
        city: profile.city || user?.city || "Cotonou",
        headquarters: profile.headquarters || user?.address || "",
        employee_count: profile.employee_count || "25 - 50 Employees",
        primary_contact_name: profile.primary_contact_name || `${user?.first_name || ""} ${user?.last_name || ""}`.trim(),
        primary_contact_role: profile.primary_contact_role || "Managing Director",
        primary_phone: profile.primary_phone || user?.phone || "",
        primary_email: profile.primary_email || user?.email || "",
        preferred_language: profile.preferred_language || "fr",
        working_hours: profile.working_hours || "Mon - Sat: 07:30 - 18:00",
        areas_of_expertise: Array.isArray(profile.areas_of_expertise) ? profile.areas_of_expertise : [],
        services_offered: Array.isArray(profile.services_offered) ? profile.services_offered : [],
      });
      if (profile.logo_url) setLogoUrl(profile.logo_url);
      if (profile.cover_url) setCoverUrl(profile.cover_url);
    }
  }, [profile, profileLoading, user]);

  // Load Saved Capabilities & Team from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const rawCaps = localStorage.getItem("boulotman_company_capabilities");
      if (rawCaps) {
        try { setCapabilities(JSON.parse(rawCaps)); } catch {}
      }
      const rawTeam = localStorage.getItem("boulotman_company_team");
      if (rawTeam) {
        try { setTeamMembers(JSON.parse(rawTeam)); } catch {}
      }
    }
  }, []);

  const isVerified = Boolean(profile?.is_verified || user?.is_verified || user?.company_profile?.is_verified);
  const companyName = form.company_name || user?.company_name || "Enterprise Contractor";
  const initials = useMemo(() => {
    return companyName.substring(0, 2).toUpperCase() || "CO";
  }, [companyName]);

  const services = useMemo(() => {
    if (Array.isArray(servicesData) && servicesData.length > 0) return servicesData;
    if (Array.isArray(profile?.services) && profile.services.length > 0) return profile.services;
    if (form.services_offered && form.services_offered.length > 0) {
      return form.services_offered.map((title, idx) => ({
        id: `mock-${idx}`,
        title,
        category: "General Contracting",
        pricing_model: "Request Quote",
        description: "",
      }));
    }
    return [];
  }, [servicesData, profile, form.services_offered]);

  const projects = useMemo(() => {
    if (Array.isArray(projectsData) && projectsData.length > 0) return projectsData;
    if (Array.isArray(profile?.projects) && profile.projects.length > 0) return profile.projects;
    return [];
  }, [projectsData, profile]);

  // Image Upload Handlers
  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: "logo" | "cover") => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setCropData({ src: reader.result as string, type });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleCropComplete = async (croppedFile: File) => {
    if (!cropData) return;
    const { type } = cropData;
    setCropData(null);

    if (type === "logo") {
      setUploadingLogo(true);
      try {
        const res = await api.uploadAvatar(croppedFile);
        const url = res.avatar_url || res.url || res.file_url;
        setLogoUrl(url);
        await api.updateCompanyProfile({ logo_url: url });
        await refetchProfile();
        toast.success("Logo Updated", "Company logo has been updated successfully.");
      } catch (err: any) {
        toast.error("Upload Failed", err?.message || "Could not upload company logo.");
      } finally {
        setUploadingLogo(false);
      }
    } else {
      setUploadingCover(true);
      try {
        const res = await api.uploadBanner(croppedFile);
        const url = res.banner_url || res.url || res.file_url;
        setCoverUrl(url);
        await api.updateCompanyProfile({ cover_url: url });
        await refetchProfile();
        toast.success("Banner Updated", "Company cover banner has been updated.");
      } catch (err: any) {
        toast.error("Upload Failed", err?.message || "Could not upload banner.");
      } finally {
        setUploadingCover(false);
      }
    }
  };

  // Save All Profile Details
  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await api.updateCompanyProfile({
        company_name: form.company_name.trim(),
        trading_name: form.trading_name.trim(),
        company_type: form.company_type,
        year_founded: form.year_founded.trim(),
        industry: form.industry,
        subject_title: form.subject_title.trim(),
        about: form.about.trim(),
        website: form.website.trim(),
        country: form.country.trim(),
        city: form.city.trim(),
        headquarters: form.headquarters.trim(),
        employee_count: form.employee_count,
        primary_contact_name: form.primary_contact_name.trim(),
        primary_contact_role: form.primary_contact_role.trim(),
        primary_phone: form.primary_phone.trim(),
        primary_email: form.primary_email.trim(),
        preferred_language: form.preferred_language,
        working_hours: form.working_hours.trim(),
        areas_of_expertise: form.areas_of_expertise,
      });

      // Save capabilities & team to localStorage
      localStorage.setItem("boulotman_company_capabilities", JSON.stringify(capabilities));
      localStorage.setItem("boulotman_company_team", JSON.stringify(teamMembers));

      await refetchProfile();
      await refetchUser();
      toast.success("Profile Saved", "Company profile and enterprise details updated successfully.");
    } catch (err: any) {
      toast.error("Save Failed", err?.message || "Could not save company profile changes.");
    } finally {
      setSaving(false);
    }
  };

  const handleShare = () => {
    const url = typeof window !== "undefined" ? window.location.origin + `/profile/${profile?.id || user?.id}` : "";
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setShareCopied(true);
      toast.info("Link Copied", "Public company profile link copied to clipboard.");
      setTimeout(() => setShareCopied(false), 2500);
    }
  };

  // Expertise Tags
  const addExpertise = () => {
    if (!expertiseInput.trim()) return;
    const val = expertiseInput.trim();
    if (!form.areas_of_expertise.includes(val)) {
      setForm(prev => ({ ...prev, areas_of_expertise: [...prev.areas_of_expertise, val] }));
    }
    setExpertiseInput("");
  };

  const removeExpertise = (tag: string) => {
    setForm(prev => ({
      ...prev,
      areas_of_expertise: prev.areas_of_expertise.filter(t => t !== tag),
    }));
  };

  // Equipment Tags
  const addEquipment = () => {
    if (!equipmentInput.trim()) return;
    const val = equipmentInput.trim();
    if (!capabilities.equipment.includes(val)) {
      const updated = { ...capabilities, equipment: [...capabilities.equipment, val] };
      setCapabilities(updated);
      localStorage.setItem("boulotman_company_capabilities", JSON.stringify(updated));
    }
    setEquipmentInput("");
  };

  const removeEquipment = (item: string) => {
    const updated = { ...capabilities, equipment: capabilities.equipment.filter(e => e !== item) };
    setCapabilities(updated);
    localStorage.setItem("boulotman_company_capabilities", JSON.stringify(updated));
  };

  // Services CRUD
  const handleCreateService = async () => {
    if (!newServiceTitle.trim()) {
      toast.error("Required", "Please provide a service title.");
      return;
    }
    setAddingService(true);
    try {
      await api.createCompanyService({
        title: newServiceTitle.trim(),
        category: newServiceCategory,
        pricing_model: newServicePricing,
        description: newServiceDesc.trim(),
        status: "Active",
      });
      if (!form.services_offered.includes(newServiceTitle.trim())) {
        const updated = [...form.services_offered, newServiceTitle.trim()];
        setForm(prev => ({ ...prev, services_offered: updated }));
        await api.updateCompanyProfile({ services_offered: updated });
      }
      await refetchServices();
      await refetchProfile();
      setNewServiceTitle("");
      setNewServiceDesc("");
      setShowAddService(false);
      toast.success("Service Added", "New enterprise service is now visible to clients.");
    } catch (err: any) {
      toast.error("Failed to add service", err?.message || "Please try again.");
    } finally {
      setAddingService(false);
    }
  };

  const handleDeleteService = async (serviceId: string | number, serviceTitle: string) => {
    const ok = await dialog.confirm({
      title: "Remove Service?",
      message: `Are you sure you want to remove "${serviceTitle}"?`,
      confirmText: "Delete",
    });
    if (!ok) return;

    try {
      if (typeof serviceId === "number" || !String(serviceId).startsWith("mock-")) {
        await api.deleteCompanyService(Number(serviceId));
      }
      const updated = form.services_offered.filter(s => s !== serviceTitle);
      setForm(prev => ({ ...prev, services_offered: updated }));
      await api.updateCompanyProfile({ services_offered: updated });
      await refetchServices();
      await refetchProfile();
      toast.success("Service Removed", "Service deleted successfully.");
    } catch (err: any) {
      toast.error("Error", err?.message || "Failed to delete service.");
    }
  };

  // Projects CRUD
  const handleCreateProject = async () => {
    if (!newProjectTitle.trim()) {
      toast.error("Required", "Please provide a project title.");
      return;
    }
    setAddingProject(true);
    try {
      await api.createCompanyProject({
        title: newProjectTitle.trim(),
        client_name: newProjectClient.trim() || "Corporate Client",
        location: newProjectUrl.trim(),
        budget: newProjectBudget ? Number(newProjectBudget.replace(/[^0-9.]/g, "")) : null,
        timeline: newProjectTimeline.trim() || "Completed",
        status: "completed",
        progress: 100,
      });
      await refetchProjects();
      setNewProjectTitle("");
      setNewProjectClient("");
      setNewProjectUrl("");
      setNewProjectBudget("");
      setNewProjectTimeline("");
      setShowAddProject(false);
      toast.success("Portfolio Updated", "Project added to your past projects showcase.");
    } catch (err: any) {
      toast.error("Failed to add project", err?.message || "Please try again.");
    } finally {
      setAddingProject(false);
    }
  };

  // Team CRUD
  const handleAddTeamMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim() || !newTeamRole.trim()) {
      toast.error("Required", "Please provide name and position.");
      return;
    }
    const newMember: TeamMember = {
      id: `tm-${Date.now()}`,
      name: newTeamName.trim(),
      role: newTeamRole.trim(),
      qualification: newTeamQual.trim() || "Qualified Technical Personnel",
      experienceYears: newTeamExp.trim() || "5+ Years",
    };
    const updated = [...teamMembers, newMember];
    setTeamMembers(updated);
    localStorage.setItem("boulotman_company_team", JSON.stringify(updated));
    setNewTeamName("");
    setNewTeamRole("");
    setNewTeamQual("");
    setNewTeamExp("");
    setShowAddTeamModal(false);
    toast.success("Team Member Added", `${newMember.name} added to key personnel.`);
  };

  const handleDeleteTeamMember = (id: string) => {
    const updated = teamMembers.filter(t => t.id !== id);
    setTeamMembers(updated);
    localStorage.setItem("boulotman_company_team", JSON.stringify(updated));
    toast.info("Member Removed", "Key personnel removed from company profile.");
  };

  // Document Upload Handlers
  const handleDocumentUpload = async (file: File, slotName: string, docType: string) => {
    setUploadingSlot(slotName);
    try {
      await api.uploadTechnicianDocument(file);
      await mutateDocuments();
      toast.success("Document Uploaded", `${slotName} uploaded for admin verification.`);
    } catch (err: any) {
      toast.error("Upload Failed", err?.message || "Please try again.");
    } finally {
      setUploadingSlot(null);
    }
  };

  const handleDeleteDoc = async (docId: number, title: string) => {
    const ok = await dialog.confirm({
      title: "Delete Document?",
      message: `Are you sure you want to remove "${title}"?`,
      confirmText: "Delete",
    });
    if (!ok) return;

    try {
      await api.deleteTechnicianDocument(docId);
      await mutateDocuments();
      toast.success("Document Deleted", "Document removed.");
    } catch (err: any) {
      toast.error("Error", err?.message || "Failed to delete document.");
    }
  };

  return (
    <div className={styles.content}>
      {/* CROPPER MODAL */}
      {cropData && (
        <ImageCropperModal
          imageSrc={cropData.src}
          aspectRatio={cropData.type === "logo" ? 1 : 16 / 5}
          isCircular={cropData.type === "logo"}
          onCropComplete={handleCropComplete}
          onCancel={() => setCropData(null)}
        />
      )}

      {/* ==================== 1. TOP HERO BANNER ==================== */}
      <section className={styles.heroCard}>
        <div
          className={styles.cover}
          onClick={() => coverInputRef.current?.click()}
          title="Click to change banner"
          style={{
            cursor: "pointer",
            backgroundImage: (coverUrl || profile?.cover_url)
              ? `url(${getImageUrl(coverUrl || profile?.cover_url)})`
              : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div style={{
            position: "absolute", inset: 0,
            background: (coverUrl || profile?.cover_url)
              ? "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.5) 100%)"
              : "linear-gradient(135deg, #001f3f 0%, #1e3a8a 100%)",
          }} />
          <div className={styles.bannerOverlay}>
            <div className={styles.bannerUploadHint}>
              {uploadingCover ? (
                <><iconify-icon icon="lucide:loader" className={styles.spinIcon} /> Uploading...</>
              ) : (
                <><iconify-icon icon="lucide:camera" /> {(coverUrl || profile?.cover_url) ? "Change Cover Photo" : "Add Cover Photo"}</>
              )}
            </div>
          </div>
          <input
            ref={coverInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            style={{ display: "none" }}
            onChange={(e) => onFileSelect(e, "cover")}
          />
        </div>

        <div className={styles.heroBody}>
          <div className={styles.identityBlock}>
            <div
              className={styles.avatarLarge}
              onClick={() => logoInputRef.current?.click()}
              title="Click to change company logo"
              style={{ cursor: "pointer" }}
            >
              {logoUrl || profile?.logo_url ? (
                <Image
                  src={getImageUrl(logoUrl || profile?.logo_url)}
                  alt="Company Logo"
                  fill
                  unoptimized
                  style={{ objectFit: "cover" }}
                />
              ) : (
                initials
              )}
              <div style={{
                position: "absolute", inset: 0,
                background: "rgba(0,0,0,0.45)", display: "flex",
                alignItems: "center", justifyContent: "center",
                opacity: uploadingLogo ? 1 : 0, transition: "opacity 0.2s",
                fontSize: 16, color: "#fff",
              }}>
                {uploadingLogo ? "..." : <iconify-icon icon="lucide:camera" />}
              </div>
              <input
                ref={logoInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                style={{ display: "none" }}
                onChange={(e) => onFileSelect(e, "logo")}
              />
            </div>

            <div className={styles.identityMeta}>
              <div className={styles.nameRow}>
                <h1>{companyName}</h1>
                {isVerified ? (
                  <span className={styles.verifiedBadge} title="Boulot Man Verified Enterprise">
                    <iconify-icon icon="lucide:badge-check" style={{ fontSize: 16 }} />
                    <span>Verified Company ✓</span>
                  </span>
                ) : (
                  <span style={{ background: "rgba(2,132,199,0.1)", color: "#0284c7", padding: "4px 10px", borderRadius: "999px", fontSize: "12px", fontWeight: 800, display: "inline-flex", alignItems: "center", gap: "4px" }}>
                    <iconify-icon icon="lucide:building-2" /> Business Registered
                  </span>
                )}
                <span style={{ background: "rgba(22,163,74,0.1)", color: "#16a34a", padding: "4px 10px", borderRadius: "999px", fontSize: "12px", fontWeight: 800, display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  <iconify-icon icon="lucide:shield-check" /> Insured ✓
                </span>
              </div>
              <div className={styles.metaList}>
                <span><iconify-icon icon="lucide:building-2" /> {form.industry}</span>
                <span><iconify-icon icon="lucide:map-pin" /> {form.city ? `${form.city}, ` : ""}{form.country || "Benin"}</span>
                {form.year_founded && <span><iconify-icon icon="lucide:calendar" /> Est. {form.year_founded}</span>}
                <span><iconify-icon icon="lucide:users" /> {capabilities.permanentWorkforce}</span>
                <span><iconify-icon icon="lucide:star" /> 4.8 (86 Reviews)</span>
              </div>
            </div>
          </div>

          <div className={styles.heroActions}>
            <button type="button" className={styles.outlineButton} onClick={handleShare}>
              <iconify-icon icon="lucide:share-2" />
              {shareCopied ? "Copied" : "Share"}
            </button>
            <Link
              href={profile?.id ? `/profile/${profile.id}` : "/contractors"}
              className={styles.outlineButton}
              target="_blank"
            >
              <iconify-icon icon="lucide:external-link" /> View Public Profile
            </Link>
            <button
              type="button"
              className={styles.primaryButton}
              onClick={handleSaveProfile}
              disabled={saving}
            >
              <iconify-icon icon={saving ? "lucide:loader" : "lucide:save"} className={saving ? styles.spinIcon : ""} />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </section>

      {/* ==================== 7-TAB NAVIGATION ==================== */}
      <div className={styles.tabNav}>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === "overview" ? styles.tabBtnActive : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          <iconify-icon icon="lucide:building" /> 1. Overview & Branding
        </button>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === "verification" ? styles.tabBtnActive : ""}`}
          onClick={() => setActiveTab("verification")}
        >
          <iconify-icon icon="lucide:shield-check" /> 2. Legal Verification & Badges
        </button>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === "capabilities" ? styles.tabBtnActive : ""}`}
          onClick={() => setActiveTab("capabilities")}
        >
          <iconify-icon icon="lucide:hard-hat" /> 3. Capabilities & Fleet
        </button>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === "services" ? styles.tabBtnActive : ""}`}
          onClick={() => setActiveTab("services")}
        >
          <iconify-icon icon="lucide:layers" /> 4. Services Offered ({services.length})
        </button>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === "projects" ? styles.tabBtnActive : ""}`}
          onClick={() => setActiveTab("projects")}
        >
          <iconify-icon icon="lucide:folder-check" /> 5. Past Projects ({projects.length})
        </button>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === "team" ? styles.tabBtnActive : ""}`}
          onClick={() => setActiveTab("team")}
        >
          <iconify-icon icon="lucide:users" /> 6. Key Personnel ({teamMembers.length})
        </button>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === "insurance" ? styles.tabBtnActive : ""}`}
          onClick={() => setActiveTab("insurance")}
        >
          <iconify-icon icon="lucide:lock" /> 7. Insurance & Matchmaking
        </button>
      </div>

      {/* ==================== TAB 1: OVERVIEW & BRANDING ==================== */}
      {activeTab === "overview" && (
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h3><iconify-icon icon="lucide:building-2" /> Company Overview & Contact Information</h3>
          </div>

          <div className={styles.twoCol}>
            <div>
              <label className={styles.label}>Legal Registered Company Name *</label>
              <input
                className={styles.input}
                value={form.company_name}
                onChange={(e) => setForm({ ...form, company_name: e.target.value })}
                placeholder="e.g. ABC Construction International SARL"
              />
            </div>
            <div>
              <label className={styles.label}>Trading / Commercial Name (Optional)</label>
              <input
                className={styles.input}
                value={form.trading_name}
                onChange={(e) => setForm({ ...form, trading_name: e.target.value })}
                placeholder="e.g. ABC Bâtiment"
              />
            </div>
          </div>

          <div className={styles.twoCol}>
            <div>
              <label className={styles.label}>Company Structure / Type</label>
              <select
                className={styles.select}
                value={form.company_type}
                onChange={(e) => setForm({ ...form, company_type: e.target.value })}
              >
                <option value="Limited Liability Company (SARL)">Limited Liability Company (SARL / Ltd)</option>
                <option value="Public Limited Company (SA)">Public Limited Company (SA / Corp)</option>
                <option value="Sole Proprietorship (Ets)">Sole Proprietorship (Établissement)</option>
                <option value="Partnership / Joint Venture">Partnership / Joint Venture</option>
                <option value="Cooperative / Consortium">Cooperative / Consortium</option>
              </select>
            </div>
            <div>
              <label className={styles.label}>Primary Industry Sector *</label>
              <select
                className={styles.select}
                value={form.industry}
                onChange={(e) => setForm({ ...form, industry: e.target.value })}
              >
                <option value="Construction">Civil & Building Construction</option>
                <option value="Engineering">Structural & Mechanical Engineering</option>
                <option value="Electrical">Electrical, Power & Solar Energy</option>
                <option value="HVAC">HVAC & Industrial Cooling</option>
                <option value="Plumbing">Industrial Plumbing & Water Sanitation</option>
                <option value="Technology">IT Networks, Telecom & Security</option>
                <option value="Logistics">Heavy Logistics, Transport & Fleet</option>
                <option value="Facility Management">Facility Management & Industrial Maintenance</option>
              </select>
            </div>
          </div>

          <div className={styles.twoCol}>
            <div>
              <label className={styles.label}>Year Founded / Established</label>
              <input
                className={styles.input}
                placeholder="e.g. 2014"
                value={form.year_founded}
                onChange={(e) => setForm({ ...form, year_founded: e.target.value })}
              />
            </div>
            <div>
              <label className={styles.label}>Total Company Headcount</label>
              <select
                className={styles.select}
                value={form.employee_count}
                onChange={(e) => setForm({ ...form, employee_count: e.target.value })}
              >
                <option value="1 - 10 Employees">1 - 10 Employees (Small Contractor)</option>
                <option value="11 - 25 Employees">11 - 25 Employees (Growing Enterprise)</option>
                <option value="26 - 50 Employees">26 - 50 Employees (Mid-Sized Company)</option>
                <option value="50 - 150 Employees">50 - 150 Employees (Large Contractor)</option>
                <option value="150+ Employees">150+ Employees (Major Corporation)</option>
              </select>
            </div>
          </div>

          <div className={styles.twoCol}>
            <div>
              <label className={styles.label}>Primary Contact Person Full Name</label>
              <input
                className={styles.input}
                placeholder="e.g. Nelson Tagor"
                value={form.primary_contact_name}
                onChange={(e) => setForm({ ...form, primary_contact_name: e.target.value })}
              />
            </div>
            <div>
              <label className={styles.label}>Contact Person Position / Title</label>
              <input
                className={styles.input}
                placeholder="e.g. Managing Director & CEO"
                value={form.primary_contact_role}
                onChange={(e) => setForm({ ...form, primary_contact_role: e.target.value })}
              />
            </div>
          </div>

          <div className={styles.twoCol}>
            <div>
              <label className={styles.label}>Official Business Phone</label>
              <input
                className={styles.input}
                placeholder="+229 97 00 00 00"
                value={form.primary_phone}
                onChange={(e) => setForm({ ...form, primary_phone: e.target.value })}
              />
            </div>
            <div>
              <label className={styles.label}>Official Corporate Email</label>
              <input
                className={styles.input}
                placeholder="contact@yourcompany.com"
                value={form.primary_email}
                onChange={(e) => setForm({ ...form, primary_email: e.target.value })}
              />
            </div>
          </div>

          <div className={styles.twoCol}>
            <div>
              <label className={styles.label}>Official Website URL</label>
              <input
                className={styles.input}
                placeholder="https://www.yourcompany.com"
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
              />
            </div>
            <div>
              <label className={styles.label}>Headquarters Physical Address</label>
              <input
                className={styles.input}
                placeholder="Plot 45, Industrial Zone, Boulevard de la Marina"
                value={form.headquarters}
                onChange={(e) => setForm({ ...form, headquarters: e.target.value })}
              />
            </div>
          </div>

          <label className={styles.label}>Executive Tagline / Slogan</label>
          <input
            className={styles.input}
            placeholder="e.g. Turnkey Civil Engineering & Renewable Power Solutions across West Africa"
            value={form.subject_title}
            onChange={(e) => setForm({ ...form, subject_title: e.target.value })}
          />

          <label className={styles.label}>Comprehensive Company Biography & Overview</label>
          <textarea
            className={styles.textarea}
            rows={4}
            placeholder="Provide a detailed overview of your company history, mission, execution standards, and key achievements..."
            value={form.about}
            onChange={(e) => setForm({ ...form, about: e.target.value })}
          />

          {/* Areas of Expertise Tags */}
          <div style={{ marginTop: 20 }}>
            <label className={styles.label}>Areas of Expertise & Trade Keywords</label>
            <div className={styles.tags}>
              {form.areas_of_expertise.map((tag) => (
                <span key={tag} className={styles.tag}>
                  {tag}
                  <iconify-icon icon="lucide:x" className={styles.tagRemove} onClick={() => removeExpertise(tag)} />
                </span>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10, maxWidth: 500 }}>
              <input
                className={styles.input}
                style={{ marginBottom: 0 }}
                placeholder="Type tag (e.g. High-Voltage, Renovation, BOQ) and click Add"
                value={expertiseInput}
                onChange={(e) => setExpertiseInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addExpertise(); } }}
              />
              <button type="button" className={styles.outlineButton} onClick={addExpertise}>Add</button>
            </div>
          </div>
        </section>
      )}

      {/* ==================== TAB 2: LEGAL VERIFICATION & 4-TIER BADGES ==================== */}
      {activeTab === "verification" && (
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h3><iconify-icon icon="lucide:shield-check" style={{ color: "#16a34a" }} /> Legal & Business Verification (4-Tier Progression)</h3>
            <span className={styles.verifiedBadge}>
              <iconify-icon icon="lucide:check-circle-2" /> Tier 3: Capability Verified ✓
            </span>
          </div>

          {/* 4-Tier Interactive Tracker */}
          <div className={styles.tierGrid}>
            <div className={`${styles.tierCard} ${styles.tierCardActive}`}>
              <div className={styles.tierHeader}>
                <span style={{ fontSize: 20 }}>🥉</span>
                <span className={styles.tierBadge} style={{ background: "#dcfce7", color: "#16a34a" }}>Completed ✓</span>
              </div>
              <h4 className={styles.tierTitle}>1. Registered Company</h4>
              <p className={styles.tierDesc}>Basic corporate profile and contact information created.</p>
            </div>

            <div className={`${styles.tierCard} ${styles.tierCardActive}`}>
              <div className={styles.tierHeader}>
                <span style={{ fontSize: 20 }}>🥈</span>
                <span className={styles.tierBadge} style={{ background: "#dcfce7", color: "#16a34a" }}>Business Verified ✓</span>
              </div>
              <h4 className={styles.tierTitle}>2. Business Verified</h4>
              <p className={styles.tierDesc}>Legal incorporation (RCCM) and Tax ID (IFU) validated.</p>
            </div>

            <div className={`${styles.tierCard} ${styles.tierCardCurrent}`}>
              <div className={styles.tierHeader}>
                <span style={{ fontSize: 20 }}>🥇</span>
                <span className={styles.tierBadge} style={{ background: "rgba(255,69,0,0.1)", color: "#ff4500" }}>Capability Verified ✓</span>
              </div>
              <h4 className={styles.tierTitle}>3. Capability Verified</h4>
              <p className={styles.tierDesc}>Engineers, equipment fleet, and past project portfolio confirmed.</p>
            </div>

            <div className={styles.tierCard}>
              <div className={styles.tierHeader}>
                <span style={{ fontSize: 20 }}>💎</span>
                <span className={styles.tierBadge} style={{ background: "#f1f5f9", color: "#64748b" }}>Target Level</span>
              </div>
              <h4 className={styles.tierTitle}>4. Verified Company</h4>
              <p className={styles.tierDesc}>Full insurance compliance and top-tier marketplace trust rating.</p>
            </div>
          </div>

          <p style={{ margin: "0 0 16px", fontSize: 13.5, color: "#64748b", lineHeight: 1.5 }}>
            Upload legal registration certificates and official trade licenses. <strong>Documents remain 100% confidential to Boulot Man administrators</strong> and are never exposed publicly to clients.
          </p>

          {/* Upload Document Slots */}
          <div className={styles.docGrid}>
            <div className={styles.docItem}>
              <div className={styles.docLeft}>
                <div className={styles.docIcon}><iconify-icon icon="lucide:file-text" /></div>
                <div>
                  <h5 className={styles.docTitle}>Business Registration (RCCM Certificate)</h5>
                  <p className={styles.docSub}>Official Commercial Registry Certificate</p>
                </div>
              </div>
              <button
                type="button"
                className={styles.uploadDocBtn}
                disabled={uploadingSlot === "RCCM Certificate"}
                onClick={() => {
                  const input = document.createElement("input");
                  input.type = "file";
                  input.accept = "image/*,application/pdf";
                  input.onchange = (e: any) => {
                    const file = e.target.files?.[0];
                    if (file) handleDocumentUpload(file, "RCCM Certificate", "certificate");
                  };
                  input.click();
                }}
              >
                <iconify-icon icon={uploadingSlot === "RCCM Certificate" ? "lucide:loader" : "lucide:upload"} />
                {uploadingSlot === "RCCM Certificate" ? "Uploading..." : "Upload File"}
              </button>
            </div>

            <div className={styles.docItem}>
              <div className={styles.docLeft}>
                <div className={styles.docIcon}><iconify-icon icon="lucide:receipt" /></div>
                <div>
                  <h5 className={styles.docTitle}>Tax ID / IFU Clearance Certificate</h5>
                  <p className={styles.docSub}>Taxpayer Identification & Status Document</p>
                </div>
              </div>
              <button
                type="button"
                className={styles.uploadDocBtn}
                disabled={uploadingSlot === "IFU Tax Certificate"}
                onClick={() => {
                  const input = document.createElement("input");
                  input.type = "file";
                  input.accept = "image/*,application/pdf";
                  input.onchange = (e: any) => {
                    const file = e.target.files?.[0];
                    if (file) handleDocumentUpload(file, "IFU Tax Certificate", "certificate");
                  };
                  input.click();
                }}
              >
                <iconify-icon icon={uploadingSlot === "IFU Tax Certificate" ? "lucide:loader" : "lucide:upload"} />
                {uploadingSlot === "IFU Tax Certificate" ? "Uploading..." : "Upload File"}
              </button>
            </div>

            <div className={styles.docItem}>
              <div className={styles.docLeft}>
                <div className={styles.docIcon}><iconify-icon icon="lucide:user-check" /></div>
                <div>
                  <h5 className={styles.docTitle}>Authorized Representative ID & Authorization</h5>
                  <p className={styles.docSub}>National ID/Passport & Power of Attorney</p>
                </div>
              </div>
              <button
                type="button"
                className={styles.uploadDocBtn}
                disabled={uploadingSlot === "Representative Authorization"}
                onClick={() => {
                  const input = document.createElement("input");
                  input.type = "file";
                  input.accept = "image/*,application/pdf";
                  input.onchange = (e: any) => {
                    const file = e.target.files?.[0];
                    if (file) handleDocumentUpload(file, "Representative Authorization", "identity");
                  };
                  input.click();
                }}
              >
                <iconify-icon icon={uploadingSlot === "Representative Authorization" ? "lucide:loader" : "lucide:upload"} />
                {uploadingSlot === "Representative Authorization" ? "Uploading..." : "Upload File"}
              </button>
            </div>
          </div>

          {/* Submitted Document List */}
          <div className={styles.submittedDocsList}>
            <strong style={{ fontSize: 14, color: "#001f3f", display: "flex", alignItems: "center", gap: 6 }}>
              <iconify-icon icon="lucide:paperclip" style={{ color: "#ff4500" }} /> Verified Document Vault ({documents.length})
            </strong>

            {documents.length === 0 ? (
              <div style={{ padding: 18, background: "#f8fafc", borderRadius: 12, textAlign: "center", color: "#64748b", fontSize: 13, border: "1px dashed #cbd5e1" }}>
                No documents uploaded yet. Upload your RCCM and IFU documents using the buttons above.
              </div>
            ) : (
              documents.map((doc: any) => (
                <div key={doc.id} className={styles.submittedDocItem}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <iconify-icon icon="lucide:file-check" style={{ fontSize: 24, color: "#001f3f" }} />
                    <div>
                      <strong style={{ display: "block", fontSize: 14, color: "#001f3f" }}>{doc.title || "Legal Document"}</strong>
                      <small style={{ color: "#64748b", fontSize: 12 }}>
                        {doc.document_type === "certificate" ? "Corporate Registration" : "Official Verification"} • Uploaded {doc.created_at ? new Date(doc.created_at).toLocaleDateString() : "Recently"}
                      </small>
                    </div>
                  </div>

                  <div className={styles.docActions}>
                    <span className={`${styles.docStatusPill} ${doc.is_verified ? styles.statusApproved : styles.statusPending}`}>
                      <iconify-icon icon={doc.is_verified ? "lucide:check-circle-2" : "lucide:clock"} />
                      {doc.is_verified ? "Verified ✓" : "Under Review"}
                    </span>
                    {doc.file_url && (
                      <a href={getImageUrl(doc.file_url)} target="_blank" rel="noopener noreferrer" className={styles.docViewLink}>
                        <iconify-icon icon="lucide:eye" /> View
                      </a>
                    )}
                    <button type="button" className={styles.docDeleteBtn} onClick={() => handleDeleteDoc(doc.id, doc.title)}>
                      <iconify-icon icon="lucide:trash-2" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      )}

      {/* ==================== TAB 3: EXECUTION CAPABILITIES & FLEET ==================== */}
      {activeTab === "capabilities" && (
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h3><iconify-icon icon="lucide:hard-hat" style={{ color: "#ff4500" }} /> Execution Capacity, Equipment & Fleet</h3>
          </div>

          <p style={{ margin: "0 0 20px", fontSize: 13.5, color: "#64748b", lineHeight: 1.5 }}>
            State your actual operational capacity so Boulot Man can accurately match your company with large infrastructure, construction, and enterprise tenders.
          </p>

          {/* Quick Metrics Grid */}
          <div className={styles.capabilitiesGrid}>
            <div className={styles.capStatCard}>
              <span className={styles.capStatNumber}>{capabilities.maxProjectBudget}</span>
              <span className={styles.capStatLabel}>Maximum Project Capacity</span>
            </div>
            <div className={styles.capStatCard}>
              <span className={styles.capStatNumber}>{capabilities.simultaneousProjects}</span>
              <span className={styles.capStatLabel}>Concurrent Project Sites</span>
            </div>
            <div className={styles.capStatCard}>
              <span className={styles.capStatNumber}>{capabilities.qualifiedEngineers}</span>
              <span className={styles.capStatLabel}>Chartered Engineers</span>
            </div>
            <div className={styles.capStatCard}>
              <span className={styles.capStatNumber}>{capabilities.permanentWorkforce}</span>
              <span className={styles.capStatLabel}>Permanent Workforce</span>
            </div>
          </div>

          <div className={styles.twoCol}>
            <div>
              <label className={styles.label}>Maximum Single Project Value (XOF)</label>
              <input
                className={styles.input}
                value={capabilities.maxProjectBudget}
                onChange={(e) => setCapabilities({ ...capabilities, maxProjectBudget: e.target.value })}
                placeholder="e.g. 250,000,000 XOF"
              />
            </div>
            <div>
              <label className={styles.label}>Simultaneous Project Sites Capacity</label>
              <input
                className={styles.input}
                value={capabilities.simultaneousProjects}
                onChange={(e) => setCapabilities({ ...capabilities, simultaneousProjects: e.target.value })}
                placeholder="e.g. 5 Concurrent Sites"
              />
            </div>
          </div>

          <div className={styles.twoCol}>
            <div>
              <label className={styles.label}>Number of Qualified Engineers on Staff</label>
              <input
                className={styles.input}
                value={capabilities.qualifiedEngineers}
                onChange={(e) => setCapabilities({ ...capabilities, qualifiedEngineers: e.target.value })}
                placeholder="e.g. 8 Engineers"
              />
            </div>
            <div>
              <label className={styles.label}>Geographic Mobilization Radius</label>
              <input
                className={styles.input}
                value={capabilities.geographicMobility}
                onChange={(e) => setCapabilities({ ...capabilities, geographicMobility: e.target.value })}
                placeholder="e.g. Nationwide & Cross-Border (West Africa)"
              />
            </div>
          </div>

          <label className={styles.label}>Office, Workshops & Warehouse Facilities</label>
          <input
            className={styles.input}
            value={capabilities.facilities}
            onChange={(e) => setCapabilities({ ...capabilities, facilities: e.target.value })}
            placeholder="e.g. Central Workshop & 1,200m² Storage Depot in Cotonou Industrial Zone"
          />

          {/* Equipment & Heavy Machinery Fleet */}
          <div style={{ marginTop: 20 }}>
            <label className={styles.label}>Owned & Leased Heavy Machinery, Equipment & Fleet</label>
            <div className={styles.equipmentGrid}>
              {capabilities.equipment.map((eq) => (
                <span key={eq} className={styles.equipmentTag}>
                  <iconify-icon icon="lucide:truck" style={{ color: "#ff4500" }} />
                  {eq}
                  <iconify-icon icon="lucide:x" style={{ cursor: "pointer", marginLeft: 4 }} onClick={() => removeEquipment(eq)} />
                </span>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10, maxWidth: 550, marginTop: 12 }}>
              <input
                className={styles.input}
                style={{ marginBottom: 0 }}
                placeholder="Add equipment (e.g. 20T Crane, Scaffolding, Excavator)"
                value={equipmentInput}
                onChange={(e) => setEquipmentInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addEquipment(); } }}
              />
              <button type="button" className={styles.outlineButton} onClick={addEquipment}>Add Equipment</button>
            </div>
          </div>
        </section>
      )}

      {/* ==================== TAB 4: SERVICES OFFERED ==================== */}
      {activeTab === "services" && (
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h3><iconify-icon icon="lucide:layers" /> Commercial Services Offered & Catalog</h3>
            <button
              type="button"
              className={styles.primaryButton}
              style={{ minHeight: 38, padding: "0 16px", fontSize: 13 }}
              onClick={() => setShowAddService(!showAddService)}
            >
              <iconify-icon icon={showAddService ? "lucide:x" : "lucide:plus"} />
              {showAddService ? "Cancel" : "Add New Service"}
            </button>
          </div>

          <p style={{ margin: "0 0 16px", fontSize: 13.5, color: "#64748b", lineHeight: 1.5 }}>
            List all services your company provides. Clients browsing for enterprise contractors will see these on your public company profile.
          </p>

          {/* Add Service Box */}
          {showAddService && (
            <div className={styles.addItemBox}>
              <div className={styles.addItemHeader}>Add a New Service Offering</div>
              <div className={styles.twoCol}>
                <div>
                  <label className={styles.label}>Service Title *</label>
                  <input
                    className={styles.input}
                    placeholder="e.g. Commercial Building Construction & Finishing"
                    value={newServiceTitle}
                    onChange={(e) => setNewServiceTitle(e.target.value)}
                  />
                </div>
                <div>
                  <label className={styles.label}>Category</label>
                  <select
                    className={styles.select}
                    value={newServiceCategory}
                    onChange={(e) => setNewServiceCategory(e.target.value)}
                  >
                    <option value="Civil & Construction">Civil & Building Construction</option>
                    <option value="Electrical & Solar">Electrical & Solar Energy</option>
                    <option value="HVAC & Cooling">HVAC & Industrial Cooling</option>
                    <option value="Plumbing & Water">Plumbing & Water Sanitation</option>
                    <option value="IT & Telecom">IT Networks, Telecom & CCTV</option>
                    <option value="Facility Management">Facility Management & Cleaning</option>
                  </select>
                </div>
              </div>

              <div className={styles.twoCol}>
                <div>
                  <label className={styles.label}>Pricing / Quotation Model</label>
                  <select
                    className={styles.select}
                    value={newServicePricing}
                    onChange={(e) => setNewServicePricing(e.target.value)}
                  >
                    <option value="Request Quote">Request Quote (Enterprise Tender)</option>
                    <option value="Fixed Quote">Fixed Project Price</option>
                    <option value="Daily Rate">Daily Rate</option>
                    <option value="Consultation Fee">Initial Consultation Fee</option>
                  </select>
                </div>
                <div>
                  <label className={styles.label}>Short Scope Description</label>
                  <input
                    className={styles.input}
                    placeholder="Brief description of work scope, supervision and standards"
                    value={newServiceDesc}
                    onChange={(e) => setNewServiceDesc(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.addActions}>
                <button type="button" className={styles.addBtn} onClick={handleCreateService} disabled={addingService}>
                  <iconify-icon icon={addingService ? "lucide:loader" : "lucide:check"} />
                  {addingService ? "Adding Service..." : "Confirm & Add Service"}
                </button>
                <button type="button" className={styles.outlineButton} style={{ minHeight: 38, padding: "0 16px" }} onClick={() => setShowAddService(false)}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Services Grid */}
          <div className={styles.servicesGrid}>
            {services.length === 0 ? (
              <div style={{ padding: 24, textAlign: "center", color: "#64748b", fontStyle: "italic", gridColumn: "1 / -1" }}>
                No services listed yet. Click &quot;Add New Service&quot; above to list your company offerings.
              </div>
            ) : (
              services.map((srv: any, idx: number) => (
                <div key={srv.id || idx} className={styles.serviceCard}>
                  <button type="button" className={styles.serviceDeleteBtn} title="Delete Service" onClick={() => handleDeleteService(srv.id, srv.title)}>
                    <iconify-icon icon="lucide:trash-2" />
                  </button>
                  <span className={styles.serviceCategoryBadge}>{srv.category || "Service"}</span>
                  <h4 className={styles.serviceTitle}>{srv.title}</h4>
                  <div className={styles.servicePricePill}>
                    <iconify-icon icon="lucide:tag" /> {srv.pricing_model || "Request Quote"}
                  </div>
                  {srv.description && <p className={styles.serviceDesc}>{srv.description}</p>}
                </div>
              ))
            )}
          </div>
        </section>
      )}

      {/* ==================== TAB 5: PAST PROJECTS & PORTFOLIO SHOWCASE ==================== */}
      {activeTab === "projects" && (
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h3><iconify-icon icon="lucide:folder-check" /> Past Projects & Portfolio Showcase</h3>
            <button
              type="button"
              className={styles.primaryButton}
              style={{ minHeight: 38, padding: "0 16px", fontSize: 13 }}
              onClick={() => setShowAddProject(!showAddProject)}
            >
              <iconify-icon icon={showAddProject ? "lucide:x" : "lucide:plus"} />
              {showAddProject ? "Cancel" : "Add Past Project"}
            </button>
          </div>

          <p style={{ margin: "0 0 16px", fontSize: 13.5, color: "#64748b", lineHeight: 1.5 }}>
            Showcase successfully completed contracts, site photographs, client case studies, and contract values to build high trust with clients.
          </p>

          {/* Add Project Form Box */}
          {showAddProject && (
            <div className={styles.addItemBox}>
              <div className={styles.addItemHeader}>Add a Completed Contract / Case Study</div>
              <div className={styles.twoCol}>
                <div>
                  <label className={styles.label}>Project Name / Title *</label>
                  <input
                    className={styles.input}
                    placeholder="e.g. 5-Storey Residential Complex - Haie Vive"
                    value={newProjectTitle}
                    onChange={(e) => setNewProjectTitle(e.target.value)}
                  />
                </div>
                <div>
                  <label className={styles.label}>Client / Partner Organization</label>
                  <input
                    className={styles.input}
                    placeholder="e.g. Société Immobilière du Bénin"
                    value={newProjectClient}
                    onChange={(e) => setNewProjectClient(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.twoCol}>
                <div>
                  <label className={styles.label}>Contract / Project Value (XOF)</label>
                  <input
                    className={styles.input}
                    placeholder="e.g. 85,000,000 XOF"
                    value={newProjectBudget}
                    onChange={(e) => setNewProjectBudget(e.target.value)}
                  />
                </div>
                <div>
                  <label className={styles.label}>Project Completion Timeline</label>
                  <input
                    className={styles.input}
                    placeholder="e.g. Completed in 8 Months (2025)"
                    value={newProjectTimeline}
                    onChange={(e) => setNewProjectTimeline(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.addActions}>
                <button type="button" className={styles.addBtn} onClick={handleCreateProject} disabled={addingProject}>
                  <iconify-icon icon={addingProject ? "lucide:loader" : "lucide:check"} />
                  {addingProject ? "Saving..." : "Add to Portfolio"}
                </button>
                <button type="button" className={styles.outlineButton} style={{ minHeight: 38, padding: "0 16px" }} onClick={() => setShowAddProject(false)}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Portfolio Grid */}
          <div className={styles.portfolioGrid}>
            {projects.length === 0 ? (
              <div style={{ padding: 24, textAlign: "center", color: "#64748b", fontStyle: "italic", gridColumn: "1 / -1" }}>
                No portfolio projects added yet. Click &quot;Add Past Project&quot; above to showcase your work.
              </div>
            ) : (
              projects.map((proj: any, idx: number) => (
                <div key={proj.id || idx} className={styles.portfolioCard}>
                  <div className={styles.portfolioThumbnail}>
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.7)", fontSize: 36 }}>
                      <iconify-icon icon="lucide:building" />
                    </div>
                    {proj.budget && (
                      <div style={{ position: "absolute", top: 12, right: 12, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)", color: "#4ade80", padding: "4px 10px", borderRadius: 999, fontSize: 12, fontWeight: 800 }}>
                        {Number(proj.budget).toLocaleString()} XOF
                      </div>
                    )}
                  </div>
                  <div className={styles.portfolioInfo}>
                    <h4 className={styles.portfolioTitle}>{proj.title}</h4>
                    <div className={styles.portfolioMeta}>
                      <span><iconify-icon icon="lucide:user" /> {proj.client_name || "Corporate Client"}</span>
                      <span><iconify-icon icon="lucide:check-circle" /> {proj.status || "Completed"}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      )}

      {/* ==================== TAB 6: KEY PERSONNEL & TEAM ==================== */}
      {activeTab === "team" && (
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h3><iconify-icon icon="lucide:users" style={{ color: "#001f3f" }} /> Key Personnel & Engineering Leadership</h3>
            <button
              type="button"
              className={styles.primaryButton}
              style={{ minHeight: 38, padding: "0 16px", fontSize: 13 }}
              onClick={() => setShowAddTeamModal(true)}
            >
              <iconify-icon icon="lucide:plus" /> Add Team Member
            </button>
          </div>

          <p style={{ margin: "0 0 16px", fontSize: 13.5, color: "#64748b", lineHeight: 1.5 }}>
            Highlight your Managing Director, Project Managers, Lead Civil/Electrical Engineers, Site Supervisors, and HSE Safety Officers.
          </p>

          <div className={styles.teamGrid}>
            {teamMembers.map((member) => (
              <div key={member.id} className={styles.teamCard}>
                <div className={styles.teamAvatar}>
                  {member.name.substring(0, 2).toUpperCase()}
                </div>
                <div className={styles.teamInfo}>
                  <h4 className={styles.teamName}>{member.name}</h4>
                  <div className={styles.teamRole}>{member.role}</div>
                  <p className={styles.teamQualification}>🎓 {member.qualification}</p>
                  {member.experienceYears && (
                    <span style={{ fontSize: 11, color: "#64748b", fontWeight: 700, display: "inline-block", marginTop: 4 }}>
                      ⏳ {member.experienceYears} Experience
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteTeamMember(member.id)}
                  style={{ position: "absolute", top: 12, right: 12, border: "none", background: "transparent", color: "#94a3b8", cursor: "pointer" }}
                  title="Remove Member"
                >
                  <iconify-icon icon="lucide:trash-2" />
                </button>
              </div>
            ))}
          </div>

          {/* Add Team Modal */}
          {showAddTeamModal && (
            <div style={{ position: "fixed", inset: 0, background: "rgba(0,15,30,0.75)", backdropFilter: "blur(8px)", zIndex: 99999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
              <div style={{ background: "#ffffff", borderRadius: 20, width: "100%", maxWidth: 480, padding: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, borderBottom: "1px solid #f1f5f9", paddingBottom: 12 }}>
                  <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#001f3f" }}>Add Key Technical Personnel</h3>
                  <button type="button" onClick={() => setShowAddTeamModal(false)} style={{ border: "none", background: "#f1f5f9", borderRadius: "50%", width: 32, height: 32, cursor: "pointer" }}>
                    <iconify-icon icon="lucide:x" />
                  </button>
                </div>

                <form onSubmit={handleAddTeamMember}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    <div>
                      <label style={{ display: "block", fontSize: "12.5px", fontWeight: 700, color: "#001f3f", marginBottom: 5 }}>Full Name *</label>
                      <input className={styles.formInput} value={newTeamName} onChange={(e) => setNewTeamName(e.target.value)} placeholder="e.g. Dr. Marcelle Dossou" required />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "12.5px", fontWeight: 700, color: "#001f3f", marginBottom: 5 }}>Position / Role *</label>
                      <input className={styles.formInput} value={newTeamRole} onChange={(e) => setNewTeamRole(e.target.value)} placeholder="e.g. Lead Structural Engineer" required />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "12.5px", fontWeight: 700, color: "#001f3f", marginBottom: 5 }}>Qualification / Degrees</label>
                      <input className={styles.formInput} value={newTeamQual} onChange={(e) => setNewTeamQual(e.target.value)} placeholder="e.g. M.Sc. Civil Engineering / Chartered Member" />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "12.5px", fontWeight: 700, color: "#001f3f", marginBottom: 5 }}>Years of Experience</label>
                      <input className={styles.formInput} value={newTeamExp} onChange={(e) => setNewTeamExp(e.target.value)} placeholder="e.g. 10+ Years" />
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                    <button type="button" onClick={() => setShowAddTeamModal(false)} className={styles.outlineButton} style={{ flex: 1, justifyContent: "center" }}>Cancel</button>
                    <button type="submit" className={styles.primaryButton} style={{ flex: 1.2, justifyContent: "center" }}>Save Member</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </section>
      )}

      {/* ==================== TAB 7: INSURANCE, BANKING & MATCHMAKING ==================== */}
      {activeTab === "insurance" && (
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h3><iconify-icon icon="lucide:lock" style={{ color: "#001f3f" }} /> Insurance, Corporate Payouts & Project Participation</h3>
          </div>

          <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 16, padding: "16px 20px", marginBottom: 24, display: "flex", gap: 12 }}>
            <iconify-icon icon="lucide:shield-check" style={{ fontSize: 24, color: "#16a34a", flexShrink: 0 }} />
            <div>
              <strong style={{ display: "block", color: "#166534", fontSize: 14 }}>Corporate Insurance & Safety Compliance</strong>
              <span style={{ fontSize: 13, color: "#166534" }}>Holding public liability and workers&apos; compensation insurance qualifies your company for high-budget government and institutional tenders.</span>
            </div>
          </div>

          <div className={styles.twoCol}>
            <div>
              <label className={styles.label}>Insurance Provider</label>
              <input className={styles.input} value={insuranceProvider} onChange={(e) => setInsuranceProvider(e.target.value)} placeholder="e.g. AXA Assurances Bénin" />
            </div>
            <div>
              <label className={styles.label}>Policy Number</label>
              <input className={styles.input} value={insurancePolicyNo} onChange={(e) => setInsurancePolicyNo(e.target.value)} placeholder="e.g. POL-8923401-CIVIL" />
            </div>
          </div>

          <label className={styles.label}>Coverage Scope & Amount</label>
          <input className={styles.input} value={insuranceCoverage} onChange={(e) => setInsuranceCoverage(e.target.value)} placeholder="e.g. 500,000,000 XOF Public Liability & Comprehensive Contractor All Risks" />

          {/* Private Corporate Banking */}
          <h4 style={{ margin: "24px 0 14px", fontSize: 16, fontWeight: 800, color: "#001f3f" }}>Corporate Banking & Payout Account (Confidential)</h4>
          <div className={styles.twoCol}>
            <div>
              <label className={styles.label}>Bank Name</label>
              <input className={styles.input} value={bankName} onChange={(e) => setBankName(e.target.value)} placeholder="e.g. Bank of Africa (BOA)" />
            </div>
            <div>
              <label className={styles.label}>Account Number / IBAN</label>
              <input className={styles.input} value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} placeholder="BJ061 01001 0023491823 45" />
            </div>
          </div>

          {/* Project Participation Matchmaking */}
          <h4 style={{ margin: "24px 0 10px", fontSize: 16, fontWeight: 800, color: "#001f3f" }}>Boulot Man Project Matchmaking Preferences</h4>
          <div className={styles.matchmakingGrid}>
            <div className={`${styles.matchCard} ${matchLargeBidding ? styles.matchCardActive : ""}`} onClick={() => setMatchLargeBidding(!matchLargeBidding)}>
              <input type="checkbox" checked={matchLargeBidding} onChange={() => {}} style={{ marginTop: 2 }} />
              <div>
                <strong style={{ display: "block", fontSize: 14, color: "#001f3f" }}>Large Project Bidding</strong>
                <small style={{ color: "#64748b" }}>Receive notifications for tenders over 10,000,000 XOF</small>
              </div>
            </div>

            <div className={`${styles.matchCard} ${matchSubcontracting ? styles.matchCardActive : ""}`} onClick={() => setMatchSubcontracting(!matchSubcontracting)}>
              <input type="checkbox" checked={matchSubcontracting} onChange={() => {}} style={{ marginTop: 2 }} />
              <div>
                <strong style={{ display: "block", fontSize: 14, color: "#001f3f" }}>Subcontracting Opportunities</strong>
                <small style={{ color: "#64748b" }}>Partner with international contractors on local site execution</small>
              </div>
            </div>

            <div className={`${styles.matchCard} ${matchConcierge ? styles.matchCardActive : ""}`} onClick={() => setMatchConcierge(!matchConcierge)}>
              <input type="checkbox" checked={matchConcierge} onChange={() => {}} style={{ marginTop: 2 }} />
              <div>
                <strong style={{ display: "block", fontSize: 14, color: "#001f3f" }}>Concierge Supervision</strong>
                <small style={{ color: "#64748b" }}>Direct dispatch for Boulot Man managed enterprise clients</small>
              </div>
            </div>

            <div className={`${styles.matchCard} ${matchEmergency ? styles.matchCardActive : ""}`} onClick={() => setMatchEmergency(!matchEmergency)}>
              <input type="checkbox" checked={matchEmergency} onChange={() => {}} style={{ marginTop: 2 }} />
              <div>
                <strong style={{ display: "block", fontSize: 14, color: "#001f3f" }}>24/7 Emergency Dispatch</strong>
                <small style={{ color: "#64748b" }}>Priority mobilization for urgent utility/commercial breakdowns</small>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ==================== BOTTOM SAVE ACTION ==================== */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 14, marginTop: 10 }}>
        <Link href="/dashboard/company" className={styles.outlineButton}>
          Back to Dashboard
        </Link>
        <button
          type="button"
          className={styles.primaryButton}
          onClick={handleSaveProfile}
          disabled={saving}
          style={{ minHeight: 48, padding: "0 32px", fontSize: 15 }}
        >
          <iconify-icon icon={saving ? "lucide:loader" : "lucide:save"} className={saving ? styles.spinIcon : ""} />
          {saving ? "Saving All Changes..." : "Save Enterprise Profile"}
        </button>
      </div>
    </div>
  );
}
