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

export default function CompanyProfilePage() {
  const toast = useToast();
  const dialog = useDialog();

  // Fetches
  const { data: user, refetch: refetchUser } = useFetch(() => api.getMe(), []);
  const { data: profile, loading: profileLoading, refetch: refetchProfile } = useFetch(() => api.getCompanyProfile(), []);
  const { data: servicesData, refetch: refetchServices } = useFetch(() => api.getCompanyServices(), []);
  const { data: projectsData, refetch: refetchProjects } = useFetch(() => api.getCompanyProjects(), []);
  const { data: rawDocuments, refetch: mutateDocuments } = useFetch(() => api.getTechnicianDocuments(), []);
  const documents = useMemo(() => (Array.isArray(rawDocuments) ? rawDocuments : []), [rawDocuments]);

  // Form State
  const [form, setForm] = useState({
    company_name: "",
    year_founded: "",
    industry: "Construction",
    subject_title: "",
    about: "",
    website: "",
    country: "",
    city: "",
    headquarters: "",
    latitude: "",
    longitude: "",
    areas_of_expertise: [] as string[],
    services_offered: [] as string[],
  });

  const [expertiseInput, setExpertiseInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

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
  const [newServicePricing, setNewServicePricing] = useState("Fixed Quote");
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
        year_founded: profile.year_founded || "",
        industry: profile.industry || "Construction",
        subject_title: profile.subject_title || "",
        about: profile.about || "",
        website: profile.website || "",
        country: profile.country || user?.country || "",
        city: profile.city || user?.city || "",
        headquarters: profile.headquarters || user?.address || "",
        latitude: profile.latitude || "",
        longitude: profile.longitude || "",
        areas_of_expertise: Array.isArray(profile.areas_of_expertise) ? profile.areas_of_expertise : [],
        services_offered: Array.isArray(profile.services_offered) ? profile.services_offered : [],
      });
      if (profile.logo_url) setLogoUrl(profile.logo_url);
      if (profile.cover_url) setCoverUrl(profile.cover_url);
    }
  }, [profile, profileLoading, user]);

  const isVerified = Boolean(profile?.is_verified || user?.is_verified || user?.company_profile?.is_verified);
  const companyName = form.company_name || user?.company_name || "Company";
  const initials = useMemo(() => {
    return companyName.substring(0, 2).toUpperCase() || "CO";
  }, [companyName]);

  const services = useMemo(() => {
    if (Array.isArray(servicesData) && servicesData.length > 0) return servicesData;
    if (Array.isArray(form.services_offered) && form.services_offered.length > 0) {
      return form.services_offered.map((s, i) => ({
        id: `mock-${i}`,
        title: s,
        category: form.industry || "General",
        pricing_model: "Standard Rate",
        description: "Professional enterprise service offered with quality guarantees.",
      }));
    }
    return [];
  }, [servicesData, form.services_offered, form.industry]);

  const projects = useMemo(() => {
    if (Array.isArray(projectsData)) return projectsData;
    return [];
  }, [projectsData]);

  // Handlers
  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await api.updateCompanyProfile(form);
      await refetchProfile();
      await refetchUser();
      toast.success("Profile Saved", "Company details synced successfully.");
    } catch (err: any) {
      toast.error("Save Failed", err?.message || "Please check your network and try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleShare = async () => {
    try {
      const shareUrl = profile?.id ? `${window.location.origin}/profile/${profile.id}` : window.location.href;
      await navigator.clipboard.writeText(shareUrl);
      setShareCopied(true);
      toast.success("Link Copied", "Public profile link copied to clipboard.");
      setTimeout(() => setShareCopied(false), 2000);
    } catch {
      setShareCopied(false);
    }
  };

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
        const newUrl = res.avatar_url || res.url;
        if (newUrl) {
          setLogoUrl(newUrl);
          await api.updateCompanyProfile({ logo_url: newUrl });
          await refetchProfile();
          toast.success("Logo Updated", "Company logo has been updated.");
        }
      } catch (err: any) {
        toast.error("Logo Upload Failed", err?.message || "Failed to update logo.");
      } finally {
        setUploadingLogo(false);
      }
    } else {
      setUploadingCover(true);
      try {
        const res = await api.uploadBanner(croppedFile);
        const newUrl = res.banner_url || res.url;
        if (newUrl) {
          setCoverUrl(newUrl);
          await api.updateCompanyProfile({ cover_url: newUrl });
          await refetchProfile();
          toast.success("Cover Updated", "Company cover photo has been updated.");
        }
      } catch (err: any) {
        toast.error("Cover Upload Failed", err?.message || "Failed to update cover.");
      } finally {
        setUploadingCover(false);
      }
    }
  };

  // Document Uploads (Linked to Database & Admin Panel)
  const handleDocumentUpload = async (file: File, title: string, docType: string) => {
    setUploadingSlot(title);
    try {
      // 1. Upload binary file
      const res = await api.uploadTechnicianDocument(file);
      const fileUrl = res.file_url || res.url;
      if (!fileUrl) throw new Error("Upload did not return a valid file URL.");

      // 2. Link document record to user profile so it shows in Admin Panel
      await api.createTechnicianDocument({
        title: title || file.name,
        document_type: docType || "certificate",
        file_url: fileUrl,
      });

      await mutateDocuments();
      await refetchProfile();
      toast.success("Document Uploaded", `${title} has been submitted for admin verification.`);
    } catch (err: any) {
      toast.error("Upload Failed", err?.message || "Failed to upload document.");
    } finally {
      setUploadingSlot(null);
    }
  };

  const handleDeleteDoc = async (id: number, title: string) => {
    const ok = await dialog.confirm({
      title: "Delete Document?",
      message: `Are you sure you want to remove "${title}"?`,
      confirmText: "Delete",
    });
    if (!ok) return;
    try {
      await api.deleteTechnicianDocument(id);
      await mutateDocuments();
      toast.success("Document Removed", "Document deleted successfully.");
    } catch (err: any) {
      toast.error("Error", err?.message || "Could not delete document.");
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
      // also update services_offered list
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
      toast.success("Service Added", "New service is now visible to clients.");
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

  // Portfolio Projects CRUD
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
      toast.success("Portfolio Updated", "Project added to your portfolio gallery.");
    } catch (err: any) {
      toast.error("Failed to add project", err?.message || "Please try again.");
    } finally {
      setAddingProject(false);
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
                {isVerified && (
                  <span className={styles.verifiedBadge} title="Verified Enterprise by Admin">
                    <iconify-icon icon="lucide:badge-check" style={{ fontSize: 16 }} />
                    <span>Verified Enterprise</span>
                  </span>
                )}
              </div>
              <div className={styles.metaList}>
                {form.industry && (
                  <span><iconify-icon icon="lucide:building-2" /> {form.industry}</span>
                )}
                {form.country && (
                  <span><iconify-icon icon="lucide:map-pin" /> {form.city ? `${form.city}, ` : ""}{form.country}</span>
                )}
                {form.year_founded && (
                  <span><iconify-icon icon="lucide:calendar" /> Est. {form.year_founded}</span>
                )}
                <span><iconify-icon icon="lucide:star" /> {profile?.average_rating || "5.0"} ({profile?.review_count || 0} Reviews)</span>
              </div>
            </div>
          </div>

          <div className={styles.heroActions}>
            <button type="button" className={styles.outlineButton} onClick={handleShare}>
              <iconify-icon icon="lucide:share-2" />
              {shareCopied ? "Copied" : "Share"}
            </button>
            <Link
              href={profile?.id ? `/profile/${profile.id}` : "/dashboard/company"}
              className={styles.outlineButton}
              target="_blank"
            >
              <iconify-icon icon="lucide:external-link" /> Preview
            </Link>
            <button
              type="button"
              className={styles.primaryButton}
              onClick={handleSaveProfile}
              disabled={saving}
            >
              <iconify-icon icon={saving ? "lucide:loader" : "lucide:save"} className={saving ? styles.spinIcon : ""} />
              {saving ? "Saving..." : "Save Profile Details"}
            </button>
          </div>
        </div>
      </section>

      {/* ==================== 2. SERVICES OFFERED (MULTIPLE SERVICES CRUD) ==================== */}
      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <h3>
            <iconify-icon icon="lucide:layers-3" /> Services Offered & Catalog
          </h3>
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

        <p style={{ margin: "0 0 16px", fontSize: 14, color: "#64748b", lineHeight: 1.5 }}>
          List all specialized services your company provides. Clients searching for contractors and commercial teams will see these in search results and on your public company profile.
        </p>

        {/* Add Service Box */}
        {showAddService && (
          <div className={styles.addItemBox}>
            <div className={styles.addItemHeader}>Add a New Service to Your Catalog</div>
            <div className={styles.twoCol}>
              <div>
                <label className={styles.label}>Service Title *</label>
                <input
                  className={styles.input}
                  placeholder="e.g. Commercial HVAC Maintenance & Installation"
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
                  <option value="General Contracting">General Contracting</option>
                  <option value="Electrical & Power">Electrical & Power</option>
                  <option value="Solar & Energy">Solar & Energy</option>
                  <option value="Plumbing & Sanitation">Plumbing & Sanitation</option>
                  <option value="HVAC & Cooling">HVAC & Cooling</option>
                  <option value="Construction & Masonry">Construction & Masonry</option>
                  <option value="IT, Telecom & CCTV">IT, Telecom & CCTV</option>
                  <option value="Logistics & Transport">Logistics & Transport</option>
                  <option value="Cleaning & Facility Mgmt">Cleaning & Facility Mgmt</option>
                </select>
              </div>
            </div>

            <div className={styles.twoCol}>
              <div>
                <label className={styles.label}>Pricing Model / Starting Rate</label>
                <input
                  className={styles.input}
                  placeholder="e.g. Fixed Quote, 45,000 XOF, or 10,000 XOF/hr"
                  value={newServicePricing}
                  onChange={(e) => setNewServicePricing(e.target.value)}
                />
              </div>
              <div>
                <label className={styles.label}>Short Description</label>
                <input
                  className={styles.input}
                  placeholder="Brief summary of what this service covers"
                  value={newServiceDesc}
                  onChange={(e) => setNewServiceDesc(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.addActions}>
              <button
                type="button"
                className={styles.addBtn}
                onClick={handleCreateService}
                disabled={addingService}
              >
                <iconify-icon icon={addingService ? "lucide:loader" : "lucide:check"} className={addingService ? styles.spinIcon : ""} />
                {addingService ? "Adding Service..." : "Confirm & Add Service"}
              </button>
              <button
                type="button"
                className={styles.outlineButton}
                style={{ minHeight: 38, padding: "0 16px" }}
                onClick={() => setShowAddService(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Services List Grid */}
        <div className={styles.servicesGrid}>
          {services.length === 0 ? (
            <div style={{ padding: 24, textAlign: "center", color: "#64748b", fontStyle: "italic", gridColumn: "1 / -1" }}>
              No services added yet. Click &quot;Add New Service&quot; above to list your company offerings.
            </div>
          ) : (
            services.map((srv: any, idx: number) => (
              <div key={srv.id || idx} className={styles.serviceCard}>
                <button
                  type="button"
                  className={styles.serviceDeleteBtn}
                  title="Delete Service"
                  onClick={() => handleDeleteService(srv.id, srv.title)}
                >
                  <iconify-icon icon="lucide:trash-2" />
                </button>
                <span className={styles.serviceCategoryBadge}>{srv.category || "Service"}</span>
                <h4 className={styles.serviceTitle}>{srv.title}</h4>
                <div className={styles.servicePricePill}>
                  <iconify-icon icon="lucide:tag" /> {srv.pricing_model || "Contact for Quote"}
                </div>
                {srv.description && <p className={styles.serviceDesc}>{srv.description}</p>}
              </div>
            ))
          )}
        </div>
      </section>

      {/* ==================== 3. PORTFOLIO & GALLERY / URLS ==================== */}
      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <h3>
            <iconify-icon icon="lucide:folder-git-2" /> Company Portfolio & Gallery
          </h3>
          <button
            type="button"
            className={styles.primaryButton}
            style={{ minHeight: 38, padding: "0 16px", fontSize: 13 }}
            onClick={() => setShowAddProject(!showAddProject)}
          >
            <iconify-icon icon={showAddProject ? "lucide:x" : "lucide:plus"} />
            {showAddProject ? "Cancel" : "Add Project / Work"}
          </button>
        </div>

        <p style={{ margin: "0 0 16px", fontSize: 14, color: "#64748b", lineHeight: 1.5 }}>
          Showcase past commercial projects, site photographs, client case studies, and external project URLs to build credibility with high-value enterprise clients.
        </p>

        {/* Add Project Form Box */}
        {showAddProject && (
          <div className={styles.addItemBox}>
            <div className={styles.addItemHeader}>Add a Past Project / Case Study</div>
            <div className={styles.twoCol}>
              <div>
                <label className={styles.label}>Project Name / Title *</label>
                <input
                  className={styles.input}
                  placeholder="e.g. 50kW Rooftop Solar Installation - Commercial Plaza"
                  value={newProjectTitle}
                  onChange={(e) => setNewProjectTitle(e.target.value)}
                />
              </div>
              <div>
                <label className={styles.label}>Client / Partner Organization</label>
                <input
                  className={styles.input}
                  placeholder="e.g. West Africa Logistics Hub"
                  value={newProjectClient}
                  onChange={(e) => setNewProjectClient(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.twoCol}>
              <div>
                <label className={styles.label}>Project URL / Case Study Link (Optional)</label>
                <input
                  className={styles.input}
                  placeholder="https://example.com/project-showcase"
                  value={newProjectUrl}
                  onChange={(e) => setNewProjectUrl(e.target.value)}
                />
              </div>
              <div>
                <label className={styles.label}>Project Budget / Value (Optional)</label>
                <input
                  className={styles.input}
                  placeholder="e.g. 2,500,000 XOF"
                  value={newProjectBudget}
                  onChange={(e) => setNewProjectBudget(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.addActions}>
              <button
                type="button"
                className={styles.addBtn}
                onClick={handleCreateProject}
                disabled={addingProject}
              >
                <iconify-icon icon={addingProject ? "lucide:loader" : "lucide:check"} className={addingProject ? styles.spinIcon : ""} />
                {addingProject ? "Saving..." : "Add to Portfolio"}
              </button>
              <button
                type="button"
                className={styles.outlineButton}
                style={{ minHeight: 38, padding: "0 16px" }}
                onClick={() => setShowAddProject(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Portfolio Grid */}
        <div className={styles.portfolioGrid}>
          {projects.length === 0 ? (
            <div style={{ padding: 24, textAlign: "center", color: "#64748b", fontStyle: "italic", gridColumn: "1 / -1" }}>
              No portfolio projects uploaded yet. Click &quot;Add Project / Work&quot; to showcase your past successes.
            </div>
          ) : (
            projects.map((proj: any, idx: number) => (
              <div key={proj.id || idx} className={styles.portfolioCard}>
                <div className={styles.portfolioThumbnail}>
                  <div style={{
                    position: "absolute", inset: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "rgba(255,255,255,0.7)", fontSize: 36
                  }}>
                    <iconify-icon icon="lucide:building" />
                  </div>
                  {proj.budget && (
                    <div style={{
                      position: "absolute", top: 12, right: 12,
                      background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)",
                      color: "#4ade80", padding: "4px 10px", borderRadius: 999,
                      fontSize: 12, fontWeight: 800
                    }}>
                      {Number(proj.budget).toLocaleString()} XOF
                    </div>
                  )}
                </div>
                <div className={styles.portfolioInfo}>
                  <h4 className={styles.portfolioTitle}>{proj.title}</h4>
                  <div className={styles.portfolioMeta}>
                    <span><iconify-icon icon="lucide:user" /> {proj.client_name || "Enterprise Client"}</span>
                    <span><iconify-icon icon="lucide:check-circle" /> {proj.status || "Completed"}</span>
                  </div>
                  {proj.location && (proj.location.startsWith("http://") || proj.location.startsWith("https://")) && (
                    <a
                      href={proj.location}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.portfolioUrlLink}
                    >
                      <iconify-icon icon="lucide:external-link" /> View Live Project Website
                    </a>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* ==================== 4. COMPANY INFORMATION & BIO ==================== */}
      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <h3>
            <iconify-icon icon="lucide:briefcase" /> Company Information & Branding
          </h3>
        </div>

        <div className={styles.twoCol}>
          <div>
            <label className={styles.label}>Registered Company Name *</label>
            <input
              className={styles.input}
              value={form.company_name}
              onChange={(e) => setForm({ ...form, company_name: e.target.value })}
            />
          </div>
          <div>
            <label className={styles.label}>Industry / Sector *</label>
            <select
              className={styles.select}
              value={form.industry}
              onChange={(e) => setForm({ ...form, industry: e.target.value })}
            >
              <option value="Construction">Construction & Civil Works</option>
              <option value="Engineering">Engineering & Fabrication</option>
              <option value="Electrical">Electrical & Solar Energy</option>
              <option value="Technology">Technology, Telecom & CCTV</option>
              <option value="Plumbing">Plumbing & Industrial Sanitation</option>
              <option value="HVAC">HVAC & Mechanical Systems</option>
              <option value="Logistics">Logistics & Supply Chain</option>
              <option value="Facility Management">Facility Management & Cleaning</option>
            </select>
          </div>
        </div>

        <div className={styles.twoCol}>
          <div>
            <label className={styles.label}>Year Founded</label>
            <input
              className={styles.input}
              placeholder="e.g. 2018"
              value={form.year_founded}
              onChange={(e) => setForm({ ...form, year_founded: e.target.value })}
            />
          </div>
          <div>
            <label className={styles.label}>Official Website URL</label>
            <input
              className={styles.input}
              placeholder="https://www.yourcompany.com"
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
            />
          </div>
        </div>

        <label className={styles.label}>Subject / Tagline</label>
        <input
          className={styles.input}
          placeholder="e.g. Leading Electrical & Solar Solutions Provider in West Africa"
          value={form.subject_title}
          onChange={(e) => setForm({ ...form, subject_title: e.target.value })}
        />

        <label className={styles.label}>Company Biography & About Us</label>
        <textarea
          className={styles.textarea}
          placeholder="Describe your company background, equipment, safety standards, and project capacity..."
          value={form.about}
          onChange={(e) => setForm({ ...form, about: e.target.value })}
        />
      </section>

      {/* ==================== 5. LOCATION & HEADQUARTERS ==================== */}
      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <h3>
            <iconify-icon icon="lucide:map-pin" /> Location & Headquarters
          </h3>
        </div>

        <div className={styles.twoCol}>
          <div>
            <label className={styles.label}>Country</label>
            <input
              className={styles.input}
              placeholder="e.g. Senegal, Ivory Coast, Rwanda"
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
            />
          </div>
          <div>
            <label className={styles.label}>City / Region</label>
            <input
              className={styles.input}
              placeholder="e.g. Dakar, Abidjan, Kigali"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            />
          </div>
        </div>

        <label className={styles.label}>Physical Headquarters Address</label>
        <input
          className={styles.input}
          placeholder="e.g. Plot 45, Industrial Zone, Av. Cheikh Anta Diop"
          value={form.headquarters}
          onChange={(e) => setForm({ ...form, headquarters: e.target.value })}
        />

        <div className={styles.twoCol}>
          <div>
            <label className={styles.label}>Latitude (Optional)</label>
            <input
              className={styles.input}
              placeholder="e.g. 14.7167"
              value={form.latitude}
              onChange={(e) => setForm({ ...form, latitude: e.target.value })}
            />
          </div>
          <div>
            <label className={styles.label}>Longitude (Optional)</label>
            <input
              className={styles.input}
              placeholder="e.g. -17.4677"
              value={form.longitude}
              onChange={(e) => setForm({ ...form, longitude: e.target.value })}
            />
          </div>
        </div>
      </section>

      {/* ==================== 6. AREAS OF EXPERTISE ==================== */}
      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <h3>
            <iconify-icon icon="lucide:sparkles" /> Areas of Expertise & Tags
          </h3>
        </div>

        <p style={{ margin: "0 0 14px", fontSize: 14, color: "#64748b" }}>
          Add key trade tags so clients searching by skill or specialization can easily discover your company.
        </p>

        <div className={styles.tags}>
          {form.areas_of_expertise.map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
              <iconify-icon
                icon="lucide:x"
                className={styles.tagRemove}
                onClick={() => removeExpertise(tag)}
              />
            </span>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10, maxWidth: 500 }}>
          <input
            className={styles.input}
            style={{ marginBottom: 0 }}
            placeholder="Add new expertise tag and press Enter"
            value={expertiseInput}
            onChange={(e) => setExpertiseInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addExpertise();
              }
            }}
          />
          <button
            type="button"
            className={styles.outlineButton}
            onClick={addExpertise}
          >
            Add
          </button>
        </div>
      </section>

      {/* ==================== 7. BUSINESS VERIFICATION & LEGAL DOCS ==================== */}
      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <h3>
            <iconify-icon icon="lucide:shield-check" /> Business Verification & Legal Documents
          </h3>
          {isVerified ? (
            <span className={styles.verifiedBadge}>
              <iconify-icon icon="lucide:check-circle-2" /> Verified by Admin
            </span>
          ) : (
            <span style={{ fontSize: 12, fontWeight: 700, color: "#d97706", background: "#fff4e5", padding: "4px 10px", borderRadius: 999 }}>
              ⏳ Pending Vetting
            </span>
          )}
        </div>

        <p style={{ margin: "0 0 16px", fontSize: 14, color: "#64748b", lineHeight: 1.5 }}>
          Upload your Certificate of Incorporation, Tax Clearance, and official trade licenses. Once submitted, documents appear immediately in the <strong>Admin Verification Panel</strong> for rapid vetting and issuance of your <strong>Verified Enterprise</strong> badge.
        </p>

        {/* Upload Slots */}
        <div className={styles.docGrid}>
          <div className={styles.docItem}>
            <div className={styles.docLeft}>
              <div className={styles.docIcon}><iconify-icon icon="lucide:file-text" /></div>
              <div>
                <h5 className={styles.docTitle}>Business Registration / Certificate</h5>
                <p className={styles.docSub}>{isVerified ? "Verified by Admin" : "Required for verified badge"}</p>
              </div>
            </div>
            <button
              type="button"
              className={styles.uploadDocBtn}
              disabled={uploadingSlot === "Business Registration / Certificate"}
              onClick={() => {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = "image/*,application/pdf";
                input.onchange = (e: any) => {
                  const file = e.target.files?.[0];
                  if (file) handleDocumentUpload(file, "Business Registration / Certificate", "certificate");
                };
                input.click();
              }}
            >
              <iconify-icon icon={uploadingSlot === "Business Registration / Certificate" ? "lucide:loader" : "lucide:upload"} className={uploadingSlot === "Business Registration / Certificate" ? styles.spinIcon : ""} />
              {uploadingSlot === "Business Registration / Certificate" ? "Uploading..." : "Upload File"}
            </button>
          </div>

          <div className={styles.docItem}>
            <div className={styles.docLeft}>
              <div className={styles.docIcon}><iconify-icon icon="lucide:award" /></div>
              <div>
                <h5 className={styles.docTitle}>Trade License & Insurance</h5>
                <p className={styles.docSub}>{isVerified ? "Verified by Admin" : "Trade Qualification / Insurance"}</p>
              </div>
            </div>
            <button
              type="button"
              className={styles.uploadDocBtn}
              disabled={uploadingSlot === "Trade License & Insurance"}
              onClick={() => {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = "image/*,application/pdf";
                input.onchange = (e: any) => {
                  const file = e.target.files?.[0];
                  if (file) handleDocumentUpload(file, "Trade License & Insurance", "insurance");
                };
                input.click();
              }}
            >
              <iconify-icon icon={uploadingSlot === "Trade License & Insurance" ? "lucide:loader" : "lucide:upload"} className={uploadingSlot === "Trade License & Insurance" ? styles.spinIcon : ""} />
              {uploadingSlot === "Trade License & Insurance" ? "Uploading..." : "Upload File"}
            </button>
          </div>

          <div className={styles.docItem}>
            <div className={styles.docLeft}>
              <div className={styles.docIcon}><iconify-icon icon="lucide:receipt" /></div>
              <div>
                <h5 className={styles.docTitle}>Tax Clearance Certificate</h5>
                <p className={styles.docSub}>{isVerified ? "Verified by Admin" : "Official Tax Compliance Document"}</p>
              </div>
            </div>
            <button
              type="button"
              className={styles.uploadDocBtn}
              disabled={uploadingSlot === "Tax Clearance Certificate"}
              onClick={() => {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = "image/*,application/pdf";
                input.onchange = (e: any) => {
                  const file = e.target.files?.[0];
                  if (file) handleDocumentUpload(file, "Tax Clearance Certificate", "certificate");
                };
                input.click();
              }}
            >
              <iconify-icon icon={uploadingSlot === "Tax Clearance Certificate" ? "lucide:loader" : "lucide:upload"} className={uploadingSlot === "Tax Clearance Certificate" ? styles.spinIcon : ""} />
              {uploadingSlot === "Tax Clearance Certificate" ? "Uploading..." : "Upload File"}
            </button>
          </div>
        </div>

        {/* Uploaded Documents List */}
        <div className={styles.submittedDocsList}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <strong style={{ fontSize: 14, color: "#001f3f", display: "flex", alignItems: "center", gap: 6 }}>
              <iconify-icon icon="lucide:paperclip" style={{ color: "#ff4500" }} /> Submitted Verification Documents ({documents.length})
            </strong>
          </div>

          {documents.length === 0 ? (
            <div style={{ padding: 18, background: "#f8fafc", borderRadius: 12, textAlign: "center", color: "#64748b", fontSize: 13, border: "1px dashed #cbd5e1" }}>
              No documents uploaded yet. Use the slots above to upload your registration certificate and trade licenses.
            </div>
          ) : (
            documents.map((doc: any) => (
              <div key={doc.id} className={styles.submittedDocItem}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <iconify-icon icon="lucide:file-check" style={{ fontSize: 24, color: "#001f3f" }} />
                  <div>
                    <strong style={{ display: "block", fontSize: 14, color: "#001f3f" }}>{doc.title || "Legal Document"}</strong>
                    <small style={{ color: "#64748b", fontSize: 12 }}>
                      {doc.document_type === "certificate" ? "Business Certificate" : doc.document_type === "insurance" ? "Insurance / License" : "Identity Document"} • Uploaded {doc.created_at ? new Date(doc.created_at).toLocaleDateString() : ""}
                    </small>
                  </div>
                </div>

                <div className={styles.docActions}>
                  <span className={`${styles.docStatusPill} ${doc.is_verified ? styles.statusApproved : styles.statusPending}`}>
                    <iconify-icon icon={doc.is_verified ? "lucide:check-circle-2" : "lucide:clock"} />
                    {doc.is_verified ? "Verified" : "Under Review"}
                  </span>
                  {doc.file_url && (
                    <a
                      href={getImageUrl(doc.file_url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.docViewLink}
                      title="View / Download Document"
                    >
                      <iconify-icon icon="lucide:eye" /> View
                    </a>
                  )}
                  <button
                    type="button"
                    className={styles.docDeleteBtn}
                    title="Delete Document"
                    onClick={() => handleDeleteDoc(doc.id, doc.title)}
                  >
                    <iconify-icon icon="lucide:trash-2" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* ==================== 8. FLOATING / BOTTOM SAVE ACTION ==================== */}
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
          {saving ? "Saving All Changes..." : "Save All Changes"}
        </button>
      </div>
    </div>
  );
}
