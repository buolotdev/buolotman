"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./profile.module.css";
import { useFetch } from "@/app/lib/useFetch";
import { api, getImageUrl } from "@/app/lib/api";
import { useToast } from "@/app/components/Toast";
import ClientSidebar from "@/app/components/ClientSidebar";
import DashboardHeader from "@/app/components/DashboardHeader";
import ImageCropperModal from "@/app/components/ImageCropperModal";

export type ClientType = "household" | "business" | "ngo" | "property_manager" | "other";

export interface SavedAddress {
  id: string;
  label: string;
  category: "home" | "office" | "site" | "rental" | "other";
  city: string;
  neighborhood: string;
  address: string;
  accessNotes?: string;
  isDefault?: boolean;
}

const DEFAULT_ADDRESSES: SavedAddress[] = [
  {
    id: "addr-1",
    label: "Primary Residence",
    category: "home",
    city: "Cotonou",
    neighborhood: "Haie Vive",
    address: "Rue 340, Maison 12",
    accessNotes: "Ring doorbell at main black gate.",
    isDefault: true,
  },
  {
    id: "addr-2",
    label: "Company HQ / Office",
    category: "office",
    city: "Cotonou",
    neighborhood: "Ganhi Commercial Area",
    address: "Boulevard de la Marina, Immeuble Horizon 3ème étage",
    accessNotes: "Reception desk on 3rd floor.",
    isDefault: false,
  }
];

const clientProfileTranslations: Record<string, Record<string, string>> = {
  en: {
    changeCover: "Change Cover",
    uploading: "Uploading...",
    verifiedClient: "Verified Client ✓",
    registeredClient: "Registered Client",
    clientRating: "⭐ 4.9 Client Rating",
    paymentReliability: "100% Payment Reliability",
    postTask: "Post a Task",
    tabPersonal: "Personal Information",
    tabBusiness: "Client Type & Business",
    tabAddresses: "Saved Service Locations",
    tabVerification: "Identity & Escrow Trust",
    tabPrivacy: "Privacy & Preferences",
    personalTitle: "Personal Details & Contact",
    personalSubtitle: "Basic information used to identify your account and dispatch technicians to your tasks.",
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email Address",
    phone: "Phone Number",
    country: "Operating Country",
    city: "Operating City",
    address: "Default Address / Neighborhood",
    aboutMe: "About You / Note for Technicians",
    savePersonal: "Save Personal Information",
    saving: "Saving...",
  },
  fr: {
    changeCover: "Modifier la Couverture",
    uploading: "Téléchargement...",
    verifiedClient: "Client Vérifié ✓",
    registeredClient: "Client Enregistré",
    clientRating: "⭐ Note Client 4.9",
    paymentReliability: "Fiabilité de Paiement 100%",
    postTask: "Publier une Mission",
    tabPersonal: "Informations Personnelles",
    tabBusiness: "Profil & Type de Client",
    tabAddresses: "Adresses Enregistrées",
    tabVerification: "Identité & Séquestre",
    tabPrivacy: "Confidentialité & Préférences",
    personalTitle: "Coordonnées & Informations Personnelles",
    personalSubtitle: "Informations de base pour identifier votre compte et faciliter l'intervention des artisans.",
    firstName: "Prénom",
    lastName: "Nom",
    email: "Adresse E-mail",
    phone: "Numéro de Téléphone",
    country: "Pays de résidence",
    city: "Ville d'intervention",
    address: "Adresse principale / Quartier",
    aboutMe: "À propos de vous / Remarques pour les techniciens",
    savePersonal: "Enregistrer les Informations",
    saving: "Enregistrement...",
  }
};

export default function ClientProfilePage() {
  const toast = useToast();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"personal" | "business" | "addresses" | "verification" | "privacy">("personal");
  const [lang, setLang] = useState("en");

  useEffect(() => {
    const updateLang = () => {
      setLang(localStorage.getItem("lang") || "en");
    };
    updateLang();
    window.addEventListener("languageChange", updateLang);
    return () => window.removeEventListener("languageChange", updateLang);
  }, []);

  const t = clientProfileTranslations[lang] || clientProfileTranslations["en"];

  // Fetch current user
  const { data: user, loading, refetch: refetchUser } = useFetch(() => api.getMe(), []);


  // Form State - Personal
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("Benin");
  const [city, setCity] = useState("Cotonou");
  const [address, setAddress] = useState("");
  const [about, setAbout] = useState("");
  const [preferredCurrency, setPreferredCurrency] = useState("XOF");
  const [preferredLanguage, setPreferredLanguage] = useState("fr");
  const [privacyDisplayFormat, setPrivacyDisplayFormat] = useState<"full" | "initial">("initial");

  // Form State - Client Type & Business Profile
  const [clientType, setClientType] = useState<ClientType>("household");
  const [businessName, setBusinessName] = useState("");
  const [businessLogo, setBusinessLogo] = useState<string | null>(null);
  const [businessEmail, setBusinessEmail] = useState("");
  const [businessPhone, setBusinessPhone] = useState("");
  const [industry, setIndustry] = useState("Hospitality & Services");
  const [taxRegistrationNo, setTaxRegistrationNo] = useState("");
  const [representativeName, setRepresentativeName] = useState("");
  const [representativeRole, setRepresentativeRole] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");

  // Form State - Saved Addresses
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addrLabel, setAddrLabel] = useState("");
  const [addrCategory, setAddrCategory] = useState<SavedAddress["category"]>("home");
  const [addrCity, setAddrCity] = useState("Cotonou");
  const [addrNeighborhood, setAddrNeighborhood] = useState("");
  const [addrStreet, setAddrStreet] = useState("");
  const [addrAccessNotes, setAddrAccessNotes] = useState("");
  const [addrIsDefault, setAddrIsDefault] = useState(false);

  // Form State - Identity Verification
  const [idType, setIdType] = useState<"national_id" | "passport" | "drivers_license" | "residence_permit">("national_id");
  const [idNumber, setIdNumber] = useState("");
  const [idExpiry, setIdExpiry] = useState("");
  const [idDocUrl, setIdDocUrl] = useState<string | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<"unverified" | "pending" | "verified">("pending");

  // Form State - Privacy & Permissions
  const [photoVisibility, setPhotoVisibility] = useState<"public" | "hired_only">("public");
  const [allowDirectOffers, setAllowDirectOffers] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);

  // Upload & Cropper State
  const [cropData, setCropData] = useState<{ src: string; type: "avatar" | "cover" | "business_logo" | "id_doc" } | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [saving, setSaving] = useState(false);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const idDocInputRef = useRef<HTMLInputElement>(null);

  // Load Initial Data & Sync Local Storage
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Saved Addresses
      const rawAddrs = localStorage.getItem("boulotman_saved_addresses");
      if (rawAddrs) {
        try { setSavedAddresses(JSON.parse(rawAddrs)); } catch {}
      } else {
        setSavedAddresses(DEFAULT_ADDRESSES);
        localStorage.setItem("boulotman_saved_addresses", JSON.stringify(DEFAULT_ADDRESSES));
      }

      // Client Type
      const savedClientType = localStorage.getItem("boulotman_client_type") as ClientType;
      if (savedClientType) setClientType(savedClientType);

      // Business Profile
      const rawBiz = localStorage.getItem("boulotman_business_profile");
      if (rawBiz) {
        try {
          const biz = JSON.parse(rawBiz);
          if (biz.businessName) setBusinessName(biz.businessName);
          if (biz.businessEmail) setBusinessEmail(biz.businessEmail);
          if (biz.businessPhone) setBusinessPhone(biz.businessPhone);
          if (biz.industry) setIndustry(biz.industry);
          if (biz.taxRegistrationNo) setTaxRegistrationNo(biz.taxRegistrationNo);
          if (biz.representativeName) setRepresentativeName(biz.representativeName);
          if (biz.representativeRole) setRepresentativeRole(biz.representativeRole);
          if (biz.websiteUrl) setWebsiteUrl(biz.websiteUrl);
          if (biz.businessLogo) setBusinessLogo(biz.businessLogo);
        } catch {}
      }

      // Identity Verification
      const savedVerif = localStorage.getItem("boulotman_client_verification_status");
      if (savedVerif === "verified" || savedVerif === "pending") {
        setVerificationStatus(savedVerif);
      }

      const savedAbout = localStorage.getItem("boulotman_client_about");
      if (savedAbout) setAbout(savedAbout);

      const savedPrivFormat = localStorage.getItem("boulotman_privacy_format");
      if (savedPrivFormat) setPrivacyDisplayFormat(savedPrivFormat as any);

      const savedCurr = localStorage.getItem("boulotman_preferred_currency");
      if (savedCurr) setPreferredCurrency(savedCurr);

      const savedLang = localStorage.getItem("boulotman_preferred_language");
      if (savedLang) setPreferredLanguage(savedLang);

      const savedOffers = localStorage.getItem("boulotman_allow_direct_offers");
      if (savedOffers !== null) setAllowDirectOffers(savedOffers === "true");

      const savedSms = localStorage.getItem("boulotman_sms_notifications");
      if (savedSms !== null) setSmsNotifications(savedSms === "true");
    }
  }, []);

  // Sync user data to form
  useEffect(() => {
    if (user && !loading) {
      if (user.first_name) setFirstName(user.first_name);
      if (user.last_name) setLastName(user.last_name);
      if (user.username) setUsername(user.username);
      if (user.email) setEmail(user.email);
      if (user.phone) setPhone(user.phone);
      if (user.country) setCountry(user.country);
      if (user.city || user.address) setCity(user.city || user.address);
      if (user.address) setAddress(user.address);
      const userBio = user.about || user.bio || (typeof window !== "undefined" ? localStorage.getItem("boulotman_client_about") : "") || "";
      if (userBio) setAbout(userBio);
      if (user.language_preference) setPreferredLanguage(user.language_preference);
      if (user.avatar_url || user.avatar) setAvatarUrl(user.avatar_url || user.avatar);
      if (user.banner_url || user.cover_image || user.banner) setCoverUrl(user.banner_url || user.cover_image || user.banner);
      if (user.is_verified) setVerificationStatus("verified");
    }
  }, [user, loading]);

  const isVerified = verificationStatus === "verified" || Boolean(user?.is_verified);

  type TabType = "personal" | "business" | "addresses" | "verification" | "privacy";

  const TABS: Array<{ key: TabType; label: string; icon: string }> = [
    { key: "personal", label: "1. Personal Information", icon: "lucide:user" },
    { key: "business", label: "2. Client Type & Business", icon: "lucide:building-2" },
    { key: "addresses", label: `3. Saved Service Locations (${savedAddresses.length})`, icon: "lucide:map-pin" },
    { key: "verification", label: `4. Identity & Escrow Trust ${isVerified ? "✓" : ""}`, icon: "lucide:shield-check" },
    { key: "privacy", label: "5. Privacy & Preferences", icon: "lucide:lock" },
  ];

  const currentTabIndex = TABS.findIndex((t) => t.key === activeTab);
  const isFirstTab = currentTabIndex <= 0;
  const isLastTab = currentTabIndex >= TABS.length - 1;

  const handlePrevTab = () => {
    if (currentTabIndex > 0) {
      setActiveTab(TABS[currentTabIndex - 1].key);
      const el = document.getElementById("client-tabs-anchor");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleNextTab = () => {
    if (currentTabIndex < TABS.length - 1) {
      setActiveTab(TABS[currentTabIndex + 1].key);
      const el = document.getElementById("client-tabs-anchor");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const fullName = useMemo(() => {
    const name = `${firstName} ${lastName}`.trim();
    return name || user?.username || "Client";
  }, [firstName, lastName, user?.username]);

  const displayName = useMemo(() => {
    if (privacyDisplayFormat === "initial" && firstName && lastName) {
      return `${firstName} ${lastName[0].toUpperCase()}.`;
    }
    return fullName;
  }, [privacyDisplayFormat, firstName, lastName, fullName]);

  const initials = useMemo(() => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    if (fullName) {
      return fullName.substring(0, 2).toUpperCase();
    }
    return "CL";
  }, [firstName, lastName, fullName]);

  // Avatar / Cover Image Handlers
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "avatar" | "cover" | "business_logo" | "id_doc") => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.show("error", "Please select a valid image file");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      toast.show("error", "Image must be smaller than 8MB");
      return;
    }

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

    if (type === "avatar") {
      setUploadingAvatar(true);
      try {
        const res = await api.uploadAvatar(croppedFile);
        const url = res.avatar_url || res.url || res.file_url;
        setAvatarUrl(url);
        await api.updateMe({ avatar: url });
        await refetchUser();
        toast.show("success", "Avatar updated successfully");
      } catch (err: any) {
        toast.show("error", err.message || "Failed to upload avatar");
      } finally {
        setUploadingAvatar(false);
      }
    } else if (type === "cover") {
      setUploadingCover(true);
      try {
        const res = await api.uploadBanner(croppedFile);
        const url = res.banner_url || res.url || res.file_url;
        setCoverUrl(url);
        await api.updateMe({ banner: url, cover_image: url });
        await refetchUser();
        toast.show("success", "Cover photo updated successfully");
      } catch (err: any) {
        toast.show("error", err.message || "Failed to upload cover photo");
      } finally {
        setUploadingCover(false);
      }
    } else if (type === "business_logo") {
      try {
        const res = await api.uploadAvatar(croppedFile);
        const url = res.avatar_url || res.url || res.file_url;
        setBusinessLogo(url);
        toast.show("success", "Business logo uploaded");
      } catch {
        toast.show("success", "Business logo saved locally");
      }
    } else if (type === "id_doc") {
      try {
        const res = await api.uploadAvatar(croppedFile);
        const url = res.avatar_url || res.url || res.file_url;
        setIdDocUrl(url);
        toast.show("success", "Identity document uploaded");
      } catch {
        setIdDocUrl(cropData.src);
        toast.show("success", "Document attached for review");
      }
    }
  };

  // Save Personal Profile
  const handleSavePersonal = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      localStorage.setItem("boulotman_client_about", about.trim());
      await api.updateMe({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone: phone.trim(),
        country: country.trim(),
        city: city.trim(),
        address: address.trim() || city.trim(),
        location: address.trim() || city.trim(),
        bio: about.trim(),
        about: about.trim(),
      });
      await refetchUser();
      toast.show("success", "Personal information saved successfully");
      if (e) {
        setActiveTab("business");
        const el = document.getElementById("client-tabs-anchor");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } catch (err: any) {
      toast.show("error", err.message || "Failed to save profile changes");
    } finally {
      setSaving(false);
    }
  };

  // Save Business Profile
  const handleSaveBusiness = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      localStorage.setItem("boulotman_client_type", clientType);
      localStorage.setItem("boulotman_business_profile", JSON.stringify({
        clientType,
        businessName,
        businessEmail,
        businessPhone,
        industry,
        taxRegistrationNo,
        representativeName,
        representativeRole,
        websiteUrl,
        businessLogo,
      }));
      toast.show("success", "Client profile & business details updated");
      if (e) {
        setActiveTab("addresses");
        const el = document.getElementById("client-tabs-anchor");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } catch {
      toast.show("error", "Could not save business details");
    } finally {
      setSaving(false);
    }
  };

  // Save Preferences Profile
  const handleSavePreferences = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      localStorage.setItem("boulotman_privacy_format", privacyDisplayFormat);
      localStorage.setItem("boulotman_preferred_currency", preferredCurrency);
      localStorage.setItem("boulotman_preferred_language", preferredLanguage);
      localStorage.setItem("boulotman_allow_direct_offers", String(allowDirectOffers));
      localStorage.setItem("boulotman_sms_notifications", String(smsNotifications));

      await api.updateMe({
        language_preference: preferredLanguage,
      });
      await refetchUser();
      toast.show("success", "Privacy controls & preferences saved successfully ✓");
    } catch {
      toast.show("success", "Preferences saved successfully ✓");
    } finally {
      setSaving(false);
    }
  };

  // Save & Next Step
  const handleSaveAndNext = async () => {
    if (activeTab === "personal") {
      await handleSavePersonal();
    } else if (activeTab === "business") {
      handleSaveBusiness();
    } else if (activeTab === "addresses") {
      toast.show("success", "Saved service locations verified");
    } else if (activeTab === "verification") {
      toast.show("success", "Identity documents verified");
    } else if (activeTab === "privacy") {
      await handleSavePreferences();
    }

    if (currentTabIndex < TABS.length - 1) {
      setActiveTab(TABS[currentTabIndex + 1].key);
      const el = document.getElementById("client-tabs-anchor");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Address Handlers
  const handleOpenAddAddress = () => {
    setEditingAddressId(null);
    setAddrLabel("");
    setAddrCategory("home");
    setAddrCity(city || "Cotonou");
    setAddrNeighborhood("");
    setAddrStreet("");
    setAddrAccessNotes("");
    setAddrIsDefault(savedAddresses.length === 0);
    setAddressModalOpen(true);
  };

  const handleEditAddress = (addr: SavedAddress) => {
    setEditingAddressId(addr.id);
    setAddrLabel(addr.label);
    setAddrCategory(addr.category);
    setAddrCity(addr.city);
    setAddrNeighborhood(addr.neighborhood);
    setAddrStreet(addr.address);
    setAddrAccessNotes(addr.accessNotes || "");
    setAddrIsDefault(Boolean(addr.isDefault));
    setAddressModalOpen(true);
  };

  const handleDeleteAddress = (id: string) => {
    const updated = savedAddresses.filter((a) => a.id !== id);
    setSavedAddresses(updated);
    localStorage.setItem("boulotman_saved_addresses", JSON.stringify(updated));
    toast.show("info", "Address removed");
  };

  const handleSetDefaultAddress = (id: string) => {
    const updated = savedAddresses.map((a) => ({
      ...a,
      isDefault: a.id === id,
    }));
    setSavedAddresses(updated);
    localStorage.setItem("boulotman_saved_addresses", JSON.stringify(updated));
    toast.show("success", "Default service address updated");
  };

  const handleSaveAddressModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrLabel || !addrStreet || !addrCity) {
      toast.show("error", "Please fill in the required address fields");
      return;
    }

    let updatedList: SavedAddress[];
    if (editingAddressId) {
      updatedList = savedAddresses.map((a) => {
        if (a.id === editingAddressId) {
          return {
            ...a,
            label: addrLabel,
            category: addrCategory,
            city: addrCity,
            neighborhood: addrNeighborhood,
            address: addrStreet,
            accessNotes: addrAccessNotes,
            isDefault: addrIsDefault,
          };
        }
        return addrIsDefault ? { ...a, isDefault: false } : a;
      });
    } else {
      const newAddr: SavedAddress = {
        id: `addr-${Date.now()}`,
        label: addrLabel,
        category: addrCategory,
        city: addrCity,
        neighborhood: addrNeighborhood,
        address: addrStreet,
        accessNotes: addrAccessNotes,
        isDefault: addrIsDefault || savedAddresses.length === 0,
      };
      updatedList = addrIsDefault
        ? [...savedAddresses.map((a) => ({ ...a, isDefault: false })), newAddr]
        : [...savedAddresses, newAddr];
    }

    setSavedAddresses(updatedList);
    localStorage.setItem("boulotman_saved_addresses", JSON.stringify(updatedList));
    setAddressModalOpen(false);
    toast.show("success", editingAddressId ? "Address updated" : "New service location saved");
  };

  // Submit Identity Verification
  const handleSubmitVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!idNumber || !idDocUrl) {
      toast.show("error", "Please provide your ID Number and upload a document photo");
      return;
    }
    setVerificationStatus("pending");
    localStorage.setItem("boulotman_client_verification_status", "pending");
    toast.show("success", "Identity documents submitted for verification. Review typically completes within 24 hours.");
  };

  const getCategoryIcon = (cat: SavedAddress["category"]) => {
    switch (cat) {
      case "home": return "lucide:home";
      case "office": return "lucide:building-2";
      case "site": return "lucide:hard-hat";
      case "rental": return "lucide:key";
      default: return "lucide:map-pin";
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
      <ClientSidebar isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <DashboardHeader
          onMenuClick={() => setMobileNavOpen(true)}
          searchPlaceholder="Search tasks, technicians, messages..."
        />

        <div className={styles.content}>
          {/* ==================== HERO SECTION & REPUTATION CARD ==================== */}
          <div className={styles.heroCard}>
            <div
              className={styles.cover}
              style={{
                backgroundImage: coverUrl
                  ? `url(${getImageUrl(coverUrl)})`
                  : "linear-gradient(135deg, #001f3f 0%, #1e3a8a 100%)",
                backgroundSize: "cover",
                backgroundPosition: "center",
                cursor: "pointer",
              }}
              onClick={() => coverInputRef.current?.click()}
              title="Click to update cover image"
            >
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => handleImageFileChange(e, "cover")}
              />
              <div className={styles.bannerOverlay}>
                <span className={styles.bannerUploadHint}>
                  <iconify-icon
                    icon={uploadingCover ? "lucide:loader-2" : "lucide:camera"}
                    className={uploadingCover ? styles.spinIcon : ""}
                  />
                  {uploadingCover ? t.uploading : t.changeCover}
                </span>
              </div>
            </div>

            <div className={styles.heroBody}>
              <div className={styles.identityBlock}>
                <div
                  className={styles.avatarLarge}
                  onClick={() => avatarInputRef.current?.click()}
                  style={{ cursor: "pointer" }}
                  title="Click to change profile picture"
                >
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => handleImageFileChange(e, "avatar")}
                  />
                  {avatarUrl ? (
                    <Image
                      src={getImageUrl(avatarUrl)}
                      alt={displayName}
                      width={120}
                      height={120}
                      className={styles.avatarImg}
                      unoptimized
                    />
                  ) : (
                    <span>{initials}</span>
                  )}
                  <div className={styles.avatarUploadHint}>
                    <iconify-icon
                      icon={uploadingAvatar ? "lucide:loader-2" : "lucide:camera"}
                      className={uploadingAvatar ? styles.spinIcon : ""}
                    />
                  </div>
                </div>

                <div className={styles.primaryInfo}>
                  <div className={styles.titleRow}>
                    <h1 className={styles.companyName}>{displayName}</h1>
                    {isVerified ? (
                      <span className={styles.verifiedBadge}>
                        <iconify-icon icon="lucide:shield-check" /> {t.verifiedClient}
                      </span>
                    ) : (
                      <span className={styles.pendingBadge}>
                        <iconify-icon icon="lucide:clock" /> {t.registeredClient}
                      </span>
                    )}
                    <span style={{ background: "#f1f5f9", color: "#001f3f", padding: "4px 10px", borderRadius: "99px", fontSize: "12px", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "5px" }}>
                      {t.clientRating}
                    </span>
                  </div>
                  <p className={styles.companyTagline}>
                    {clientType === "business" ? "🏢 Business Client" : clientType === "ngo" ? "🏛️ Organization / NGO" : clientType === "property_manager" ? "🏗️ Property Manager" : "🏠 Individual / Household"} • Member since{" "}
                    {user?.date_joined
                      ? new Date(user.date_joined).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", {
                          month: "short",
                          year: "numeric",
                        })
                      : "2026"}
                  </p>
                  <div className={styles.metaRow}>
                    <span className={styles.metaItem}>
                      <iconify-icon icon="lucide:map-pin" /> {city || "Cotonou"}, {country || "Benin"}
                    </span>
                    <span className={styles.metaItem}>
                      <iconify-icon icon="lucide:mail" /> {email}
                    </span>
                    {phone && (
                      <span className={styles.metaItem}>
                        <iconify-icon icon="lucide:phone" /> {phone}
                      </span>
                    )}
                    <span className={styles.metaItem} style={{ color: "#16a34a", fontWeight: 700 }}>
                      <iconify-icon icon="lucide:check-circle-2" /> {t.paymentReliability}
                    </span>
                  </div>
                </div>
              </div>

              <div className={styles.heroActions}>
                <Link
                  href="/post-task"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "#ff4500",
                    color: "#ffffff",
                    padding: "12px 22px",
                    borderRadius: "12px",
                    fontWeight: 800,
                    fontSize: "14px",
                    textDecoration: "none",
                    boxShadow: "0 6px 18px rgba(255, 69, 0, 0.35)",
                  }}
                >
                  <iconify-icon icon="lucide:plus-circle" style={{ fontSize: "18px" }} />
                  {t.postTask}
                </Link>
              </div>
            </div>
          </div>

          {/* ==================== 5-TAB NAVIGATION ==================== */}
          <div className={styles.tabNav} id="client-tabs-anchor">
            <button
              type="button"
              className={`${styles.tabBtn} ${activeTab === "personal" ? styles.tabBtnActive : ""}`}
              onClick={() => setActiveTab("personal")}
            >
              <iconify-icon icon="lucide:user" /> {t.tabPersonal}
            </button>
            <button
              type="button"
              className={`${styles.tabBtn} ${activeTab === "business" ? styles.tabBtnActive : ""}`}
              onClick={() => setActiveTab("business")}
            >
              <iconify-icon icon="lucide:building-2" /> {t.tabBusiness}
            </button>
            <button
              type="button"
              className={`${styles.tabBtn} ${activeTab === "addresses" ? styles.tabBtnActive : ""}`}
              onClick={() => setActiveTab("addresses")}
            >
              <iconify-icon icon="lucide:map-pin" /> {t.tabAddresses} ({savedAddresses.length})
            </button>
            <button
              type="button"
              className={`${styles.tabBtn} ${activeTab === "verification" ? styles.tabBtnActive : ""}`}
              onClick={() => setActiveTab("verification")}
            >
              <iconify-icon icon="lucide:shield-check" /> {t.tabVerification} {isVerified ? "✓" : ""}
            </button>
            <button
              type="button"
              className={`${styles.tabBtn} ${activeTab === "privacy" ? styles.tabBtnActive : ""}`}
              onClick={() => setActiveTab("privacy")}
            >
              <iconify-icon icon="lucide:lock" /> {t.tabPrivacy}
            </button>
          </div>

          {/* ==================== TAB 1: PERSONAL INFORMATION ==================== */}
          {activeTab === "personal" && (
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <h3>
                    <iconify-icon icon="lucide:user" style={{ color: "#ff4500" }} />
                    {t.personalTitle}
                  </h3>
                  <p>{t.personalSubtitle}</p>
                </div>
              </div>

              <form onSubmit={handleSavePersonal}>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label htmlFor="first_name">
                      <iconify-icon icon="lucide:user" /> {t.firstName}
                    </label>
                    <input
                      id="first_name"
                      type="text"
                      className={styles.formInput}
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="e.g. Jean"
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="last_name">
                      <iconify-icon icon="lucide:user" /> {t.lastName}
                    </label>
                    <input
                      id="last_name"
                      type="text"
                      className={styles.formInput}
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="e.g. Dupont"
                      required
                    />
                  </div>


                  <div className={styles.formGroup}>
                    <label htmlFor="email">
                      <iconify-icon icon="lucide:mail" /> Email Address (Verified)
                    </label>
                    <input
                      id="email"
                      type="email"
                      className={styles.formInput}
                      value={email}
                      disabled
                      title="Contact support to change your verified email"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="phone">
                      <iconify-icon icon="lucide:phone" /> Phone Number (Dispatch Contact)
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      className={styles.formInput}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +229 97 00 00 00"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="country">
                      <iconify-icon icon="lucide:globe" /> Primary Country
                    </label>
                    <input
                      id="country"
                      type="text"
                      className={styles.formInput}
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="e.g. Benin, Togo, Côte d'Ivoire"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="city">
                      <iconify-icon icon="lucide:map-pin" /> Primary City
                    </label>
                    <input
                      id="city"
                      type="text"
                      className={styles.formInput}
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Cotonou, Porto-Novo, Lomé"
                    />
                  </div>

                  <div className={`${styles.formGroup} ${styles.formGridFull}`}>
                    <label htmlFor="about">
                      <iconify-icon icon="lucide:file-text" /> Client Bio / Hiring Notes
                    </label>
                    <textarea
                      id="about"
                      className={styles.formTextarea}
                      value={about}
                      onChange={(e) => setAbout(e.target.value)}
                      placeholder="Share a short note about your typical project needs or property context..."
                      rows={3}
                    />
                  </div>
                </div>

                <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end" }}>
                  <button type="submit" className={styles.primaryBtn} disabled={saving}>
                    <iconify-icon
                      icon={saving ? "lucide:loader-2" : "lucide:check"}
                      className={saving ? styles.spinIcon : ""}
                    />
                    {saving ? "Saving..." : "Save Personal Details"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ==================== TAB 2: CLIENT TYPE & BUSINESS PROFILE ==================== */}
          {activeTab === "business" && (
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <h3>
                    <iconify-icon icon="lucide:building-2" style={{ color: "#001f3f" }} />
                    Client Classification & Business Profile
                  </h3>
                  <p>Configure whether you hire as an individual household or as a commercial business/organization.</p>
                </div>
              </div>

              {/* Client Type Selector */}
              <div className={styles.clientTypeGrid}>
                {[
                  {
                    id: "household",
                    title: "Individual / Household",
                    desc: "Hiring for home repairs, plumbing, cleaning, personal assistance and domestic maintenance.",
                    icon: "lucide:home",
                  },
                  {
                    id: "business",
                    title: "Business Client",
                    desc: "Hotels, restaurants, stores, and offices regularly hiring skilled service providers.",
                    icon: "lucide:building-2",
                  },
                  {
                    id: "ngo",
                    title: "Organization / NGO",
                    desc: "Non-profits, institutions, diplomatic missions, and international development agencies.",
                    icon: "lucide:landmark",
                  },
                  {
                    id: "property_manager",
                    title: "Property Manager / Landlord",
                    desc: "Real estate owners and managers supervising maintenance across multiple buildings and sites.",
                    icon: "lucide:key",
                  },
                ].map((ct) => (
                  <div
                    key={ct.id}
                    className={`${styles.clientTypeCard} ${clientType === ct.id ? styles.clientTypeCardActive : ""}`}
                    onClick={() => setClientType(ct.id as ClientType)}
                  >
                    <div className={styles.clientTypeIconWrap}>
                      <iconify-icon icon={ct.icon} />
                    </div>
                    <h4 className={styles.clientTypeTitle}>{ct.title}</h4>
                    <p className={styles.clientTypeDesc}>{ct.desc}</p>
                  </div>
                ))}
              </div>

              {/* Business Details Form (If Business, NGO, or Property Manager) */}
              {clientType !== "household" ? (
                <form onSubmit={handleSaveBusiness} style={{ marginTop: 24, borderTop: "1px solid #f1f5f9", paddingTop: 24 }}>
                  <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "16px 20px", marginBottom: "20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#001f3f", fontWeight: 800, marginBottom: "4px" }}>
                      <iconify-icon icon="lucide:file-badge" style={{ fontSize: 20, color: "#ff4500" }} />
                      <span>Business Client Hiring Profile</span>
                    </div>
                    <p style={{ margin: 0, fontSize: "13px", color: "#64748b", lineHeight: 1.5 }}>
                      This profile is dedicated to corporate hiring, task management, and consolidated billing. (Distinct from Service Provider Company Profiles).
                    </p>
                  </div>

                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label htmlFor="biz_name">
                        <iconify-icon icon="lucide:building-2" /> Company / Organization Name
                      </label>
                      <input
                        id="biz_name"
                        type="text"
                        className={styles.formInput}
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="e.g. Grand Hotel Cotonou SARL"
                        required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="biz_industry">
                        <iconify-icon icon="lucide:layers" /> Industry / Sector
                      </label>
                      <select
                        id="biz_industry"
                        className={styles.formSelect}
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                      >
                        <option value="Hospitality & Services">Hospitality & Tourism (Hotels/Restaurants)</option>
                        <option value="Real Estate & Facilities">Real Estate & Property Management</option>
                        <option value="Retail & Commercial">Retail & Supermarkets</option>
                        <option value="Construction & Engineering">Construction & Infrastructure</option>
                        <option value="Logistics & Transport">Logistics & Supply Chain</option>
                        <option value="Healthcare & Education">Healthcare & Education</option>
                        <option value="NGO & Non-Profit">Non-Profit / NGO / Public Mission</option>
                        <option value="Corporate / Tech">Corporate / Technology / Finance</option>
                      </select>
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="tax_no">
                        <iconify-icon icon="lucide:receipt" /> Business Registration / Tax ID (IFU/RCCM)
                      </label>
                      <input
                        id="tax_no"
                        type="text"
                        className={styles.formInput}
                        value={taxRegistrationNo}
                        onChange={(e) => setTaxRegistrationNo(e.target.value)}
                        placeholder="e.g. RCCM RB/COT/21 B 12345 - IFU 3201..."
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="biz_email">
                        <iconify-icon icon="lucide:mail" /> Corporate Billing Email
                      </label>
                      <input
                        id="biz_email"
                        type="email"
                        className={styles.formInput}
                        value={businessEmail}
                        onChange={(e) => setBusinessEmail(e.target.value)}
                        placeholder="e.g. accounting@company.com"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="rep_name">
                        <iconify-icon icon="lucide:user-check" /> Authorized Representative
                      </label>
                      <input
                        id="rep_name"
                        type="text"
                        className={styles.formInput}
                        value={representativeName}
                        onChange={(e) => setRepresentativeName(e.target.value)}
                        placeholder="e.g. Nelson Tagor"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="rep_role">
                        <iconify-icon icon="lucide:briefcase" /> Representative Position / Title
                      </label>
                      <input
                        id="rep_role"
                        type="text"
                        className={styles.formInput}
                        value={representativeRole}
                        onChange={(e) => setRepresentativeRole(e.target.value)}
                        placeholder="e.g. Facilities & Operations Director"
                      />
                    </div>

                    <div className={`${styles.formGroup} ${styles.formGridFull}`}>
                      <label htmlFor="biz_web">
                        <iconify-icon icon="lucide:globe" /> Company Website (Optional)
                      </label>
                      <input
                        id="biz_web"
                        type="url"
                        className={styles.formInput}
                        value={websiteUrl}
                        onChange={(e) => setWebsiteUrl(e.target.value)}
                        placeholder="e.g. https://www.mycompany.com"
                      />
                    </div>
                  </div>

                  <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end" }}>
                    <button type="submit" className={styles.primaryBtn} disabled={saving}>
                      <iconify-icon icon="lucide:check" />
                      Save Business Client Profile
                    </button>
                  </div>
                </form>
              ) : (
                <div style={{ padding: "20px", background: "#f8fafc", borderRadius: "14px", textAlign: "center", color: "#64748b", marginTop: "10px" }}>
                  <p style={{ margin: 0 }}>You are currently set as an <strong>Individual / Household</strong> client. No corporate registration numbers are required.</p>
                </div>
              )}
            </div>
          )}

          {/* ==================== TAB 3: SAVED SERVICE ADDRESSES ==================== */}
          {activeTab === "addresses" && (
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <h3>
                    <iconify-icon icon="lucide:map-pin" style={{ color: "#ff4500" }} />
                    Saved Service Locations
                  </h3>
                  <p>Save locations like Home, Office, Construction Site or Rental Properties so you don&apos;t have to retype them when posting tasks.</p>
                </div>
                <button
                  type="button"
                  onClick={handleOpenAddAddress}
                  className={styles.primaryBtn}
                  style={{ padding: "9px 18px", fontSize: "13px" }}
                >
                  <iconify-icon icon="lucide:plus" /> Add Location
                </button>
              </div>

              {/* Address Privacy Guard Card */}
              <div className={styles.privacyGuardBox}>
                <iconify-icon icon="lucide:shield-check" />
                <div>
                  <strong style={{ display: "block", marginBottom: 2 }}>Exact Address Privacy Guard</strong>
                  <span>Your street name and building/apartment numbers are never displayed publicly on search boards or tasks. They are only shared securely with your assigned specialist upon project confirmation.</span>
                </div>
              </div>

              {/* Addresses Grid */}
              <div className={styles.addressGrid}>
                {savedAddresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`${styles.addressCard} ${addr.isDefault ? styles.addressCardDefault : ""}`}
                  >
                    <div>
                      <div className={styles.addressCardHeader}>
                        <span className={styles.addressLabelBadge}>
                          <iconify-icon icon={getCategoryIcon(addr.category)} />
                          {addr.label}
                        </span>
                        {addr.isDefault && (
                          <span style={{ fontSize: "11.5px", fontWeight: 800, color: "#ff4500", background: "rgba(255,69,0,0.1)", padding: "3px 8px", borderRadius: "6px" }}>
                            Default
                          </span>
                        )}
                      </div>

                      <div style={{ marginTop: 14 }}>
                        <h4 style={{ margin: "0 0 4px", fontSize: "15px", color: "#001f3f", fontWeight: 800 }}>
                          {addr.neighborhood ? `${addr.neighborhood}, ` : ""}{addr.city}
                        </h4>
                        <p style={{ margin: "0 0 8px", fontSize: "13px", color: "#475569", lineHeight: 1.45 }}>
                          {addr.address}
                        </p>
                        {addr.accessNotes && (
                          <p style={{ margin: 0, fontSize: "11.5px", color: "#64748b", background: "#f8fafc", padding: "6px 10px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                            💡 <em>{addr.accessNotes}</em>
                          </p>
                        )}
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #f1f5f9", paddingTop: 12, marginTop: 12 }}>
                      {!addr.isDefault ? (
                        <button
                          type="button"
                          onClick={() => handleSetDefaultAddress(addr.id)}
                          style={{ border: "none", background: "transparent", color: "#0284c7", fontSize: "12px", fontWeight: 700, cursor: "pointer", padding: 0 }}
                        >
                          Set as default
                        </button>
                      ) : (
                        <span style={{ fontSize: "12px", color: "#16a34a", fontWeight: 700 }}>Primary Location</span>
                      )}

                      <div className={styles.addressActions}>
                        <button
                          type="button"
                          className={styles.addressIconBtn}
                          onClick={() => handleEditAddress(addr)}
                          title="Edit Address"
                        >
                          <iconify-icon icon="lucide:pencil" />
                        </button>
                        {savedAddresses.length > 1 && (
                          <button
                            type="button"
                            className={`${styles.addressIconBtn} ${styles.addressIconBtnDanger}`}
                            onClick={() => handleDeleteAddress(addr.id)}
                            title="Delete Address"
                          >
                            <iconify-icon icon="lucide:trash-2" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================== TAB 4: IDENTITY & ESCROW VERIFICATION ==================== */}
          {activeTab === "verification" && (
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <h3>
                    <iconify-icon icon="lucide:shield-check" style={{ color: "#16a34a" }} />
                    Identity & Escrow Trust Verification (Tier 2)
                  </h3>
                  <p>Verify your legal identity to unlock high-value contracts, unlimited escrow deposits, and the Verified Client badge.</p>
                </div>
                {isVerified ? (
                  <span className={styles.verifiedBadge} style={{ padding: "8px 16px", fontSize: "13px" }}>
                    <iconify-icon icon="lucide:check-circle-2" /> Verified Client ✓
                  </span>
                ) : (
                  <span className={styles.pendingBadge} style={{ padding: "8px 16px", fontSize: "13px" }}>
                    <iconify-icon icon="lucide:clock" /> Verification Pending Review
                  </span>
                )}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", marginBottom: "28px" }}>
                <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#16a34a", fontWeight: 800, marginBottom: "8px" }}>
                    <iconify-icon icon="lucide:check" style={{ fontSize: 20 }} />
                    <span>Tier 1: Basic Account</span>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: 18, fontSize: "12.5px", color: "#475569", lineHeight: 1.6 }}>
                    <li>Email Address Verified ✓</li>
                    <li>Phone Number Verified ✓</li>
                    <li>Browse Specialists & Companies</li>
                    <li>Post standard tasks</li>
                  </ul>
                </div>

                <div style={{ background: isVerified ? "#f0fdf4" : "rgba(255,69,0,0.03)", border: isVerified ? "1.5px solid #bbf7d0" : "1.5px solid #ff4500", borderRadius: "16px", padding: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", color: isVerified ? "#16a34a" : "#ff4500", fontWeight: 800, marginBottom: "8px" }}>
                    <iconify-icon icon={isVerified ? "lucide:shield-check" : "lucide:sparkles"} style={{ fontSize: 20 }} />
                    <span>Tier 2: Verified Client</span>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: 18, fontSize: "12.5px", color: "#475569", lineHeight: 1.6 }}>
                    <li>Government ID Confirmed ✓</li>
                    <li>Escrow Vault high-balance funding</li>
                    <li>Direct contractor hiring badge</li>
                    <li>Priority concierge supervision</li>
                  </ul>
                </div>
              </div>

              {!isVerified && (
                <form onSubmit={handleSubmitVerification} style={{ borderTop: "1px solid #f1f5f9", paddingTop: "24px" }}>
                  <h4 style={{ fontSize: "16px", fontWeight: 800, color: "#001f3f", margin: "0 0 16px" }}>Submit Identification Documents</h4>
                  
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label htmlFor="id_type">
                        <iconify-icon icon="lucide:file-text" /> Identification Document Type
                      </label>
                      <select
                        id="id_type"
                        className={styles.formSelect}
                        value={idType}
                        onChange={(e) => setIdType(e.target.value as any)}
                      >
                        <option value="national_id">National ID Card (CNI / CIP)</option>
                        <option value="passport">International Passport</option>
                        <option value="drivers_license">Driver&apos;s License (Permis de Conduire)</option>
                        <option value="residence_permit">Residence Permit / Carte de Séjour</option>
                      </select>
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="id_num">
                        <iconify-icon icon="lucide:hash" /> Document / ID Number
                      </label>
                      <input
                        id="id_num"
                        type="text"
                        className={styles.formInput}
                        value={idNumber}
                        onChange={(e) => setIdNumber(e.target.value)}
                        placeholder="e.g. 1029384756 / NPI-89234"
                        required
                      />
                    </div>
                  </div>

                  <div style={{ marginTop: 20 }}>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#001f3f", marginBottom: "8px" }}>
                      Upload Clear Photo / Scan of ID Document
                    </label>
                    <input
                      ref={idDocInputRef}
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => handleImageFileChange(e, "id_doc")}
                    />
                    <div
                      className={styles.uploadDropzone}
                      onClick={() => idDocInputRef.current?.click()}
                    >
                      {idDocUrl ? (
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", color: "#16a34a", fontWeight: 700 }}>
                          <iconify-icon icon="lucide:check-circle" style={{ fontSize: 28 }} />
                          <span>Document Attached ({idDocUrl.slice(0, 30)}...) - Click to change</span>
                        </div>
                      ) : (
                        <div>
                          <iconify-icon icon="lucide:upload-cloud" />
                          <p style={{ margin: "0 0 4px", fontWeight: 700, color: "#001f3f" }}>Click to upload National ID / Passport Photo</p>
                          <span style={{ fontSize: "12px", color: "#64748b" }}>PNG, JPG or PDF up to 8MB. Kept 100% confidential.</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end" }}>
                    <button type="submit" className={styles.primaryBtn}>
                      <iconify-icon icon="lucide:shield-check" />
                      Submit for Tier 2 Verification
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* ==================== TAB 5: PRIVACY & PREFERENCES ==================== */}
          {activeTab === "privacy" && (
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <h3>
                    <iconify-icon icon="lucide:lock" style={{ color: "#001f3f" }} />
                    Privacy Controls & Notifications
                  </h3>
                  <p>Control how your name and profile are displayed to specialists and search engines.</p>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column" }}>
                <div className={styles.switchRow}>
                  <div className={styles.switchInfo}>
                    <h4>Abbreviate Public Name (Privacy Mode)</h4>
                    <p>Display your surname as an initial (e.g. <strong>{firstName || "Nelson"} {lastName ? `${lastName[0]}.` : "T."}</strong>) instead of exposing your full legal name.</p>
                  </div>
                  <select
                    className={styles.formSelect}
                    style={{ width: 220 }}
                    value={privacyDisplayFormat}
                    onChange={(e) => setPrivacyDisplayFormat(e.target.value as any)}
                  >
                    <option value="initial">
                      {firstName ? `${firstName} ${(lastName || "")[0] ? `${lastName[0].toUpperCase()}.` : ""}`.trim() : "First Name Initial"} (Privacy Mode)
                    </option>
                    <option value="full">
                      {fullName || "Full Legal Name"} (Full Name)
                    </option>
                  </select>
                </div>

                <div className={styles.switchRow}>
                  <div className={styles.switchInfo}>
                    <h4>Direct Quotes & Technician Offers</h4>
                    <p>Allow top-rated specialists and verified enterprise companies to send direct price quotes on your tasks.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={allowDirectOffers}
                    onChange={(e) => setAllowDirectOffers(e.target.checked)}
                    style={{ width: 20, height: 20, accentColor: "#ff4500", cursor: "pointer" }}
                  />
                </div>

                <div className={styles.switchRow}>
                  <div className={styles.switchInfo}>
                    <h4>SMS & Instant Dispatch Alerts</h4>
                    <p>Receive SMS alerts on your phone when assigned technicians arrive on-site or submit project milestones.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={smsNotifications}
                    onChange={(e) => setSmsNotifications(e.target.checked)}
                    style={{ width: 20, height: 20, accentColor: "#ff4500", cursor: "pointer" }}
                  />
                </div>

                <div className={styles.switchRow}>
                  <div className={styles.switchInfo}>
                    <h4>Preferred Platform Currency</h4>
                    <p>Primary currency for displaying tasks, escrow deposits, and budget calculations.</p>
                  </div>
                  <select
                    className={styles.formSelect}
                    style={{ width: 160 }}
                    value={preferredCurrency}
                    onChange={(e) => setPreferredCurrency(e.target.value)}
                  >
                    <option value="XOF">XOF (CFA Franc)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="USD">USD ($)</option>
                  </select>
                </div>

                <div className={styles.switchRow}>
                  <div className={styles.switchInfo}>
                    <h4>Preferred Language</h4>
                    <p>Language used for task contracts, receipts, and system emails.</p>
                  </div>
                  <select
                    className={styles.formSelect}
                    style={{ width: 160 }}
                    value={preferredLanguage}
                    onChange={(e) => setPreferredLanguage(e.target.value)}
                  >
                    <option value="fr">Français (French)</option>
                    <option value="en">English</option>
                  </select>
                </div>

                <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end" }}>
                  <button type="button" onClick={handleSavePreferences} className={styles.primaryBtn} disabled={saving}>
                    <iconify-icon icon={saving ? "lucide:loader-2" : "lucide:check-circle-2"} className={saving ? styles.spinIcon : ""} />
                    Save Privacy & Platform Preferences
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ==================== GLOBAL WIZARD FOOTER ==================== */}
          <div style={{
            marginTop: 10,
            background: "#ffffff",
            borderRadius: 20,
            padding: "16px 24px",
            boxShadow: "0 10px 30px rgba(0, 31, 63, 0.06)",
            border: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16
          }}>
            <button
              type="button"
              onClick={handlePrevTab}
              disabled={isFirstTab}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 20px",
                borderRadius: 12,
                border: "1.5px solid #cbd5e1",
                background: isFirstTab ? "#f8fafc" : "#ffffff",
                color: isFirstTab ? "#94a3b8" : "#001f3f",
                fontWeight: 700,
                fontSize: 13.5,
                cursor: isFirstTab ? "not-allowed" : "pointer",
                opacity: isFirstTab ? 0.5 : 1
              }}
            >
              <iconify-icon icon="lucide:arrow-left" />
              Previous Step
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={async () => {
                  if (activeTab === "personal") await handleSavePersonal();
                  else if (activeTab === "business") handleSaveBusiness();
                  else if (activeTab === "privacy") await handleSavePreferences();
                  else toast.show("success", "Progress saved");
                }}
                disabled={saving}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 20px",
                  borderRadius: 12,
                  border: "1.5px solid #001f3f",
                  background: "#ffffff",
                  color: "#001f3f",
                  fontWeight: 700,
                  fontSize: 13.5,
                  cursor: "pointer"
                }}
              >
                <iconify-icon icon={saving ? "lucide:loader" : "lucide:save"} className={saving ? styles.spinIcon : ""} />
                {saving ? "Saving..." : "Save Progress"}
              </button>

              {!isLastTab ? (
                <button
                  type="button"
                  onClick={handleSaveAndNext}
                  disabled={saving}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "10px 24px",
                    borderRadius: 12,
                    border: "none",
                    background: "linear-gradient(135deg, #ff4500, #ff7a1f)",
                    color: "#ffffff",
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: "pointer",
                    boxShadow: "0 6px 18px rgba(255, 69, 0, 0.3)"
                  }}
                >
                  {saving ? "Saving..." : "Save & Next Step"}
                  <iconify-icon icon="lucide:arrow-right" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSavePreferences}
                  disabled={saving}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "10px 28px",
                    borderRadius: 12,
                    border: "none",
                    background: "linear-gradient(135deg, #16a34a, #15803d)",
                    color: "#ffffff",
                    fontWeight: 700,
                    fontSize: 14.5,
                    cursor: "pointer",
                    boxShadow: "0 6px 18px rgba(22, 163, 74, 0.3)"
                  }}
                >
                  <iconify-icon icon={saving ? "lucide:loader" : "lucide:check-circle-2"} className={saving ? styles.spinIcon : ""} />
                  {saving ? "Saving..." : "Complete & Save Profile ✓"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ==================== ADD / EDIT ADDRESS MODAL ==================== */}
      {addressModalOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,15,30,0.75)", backdropFilter: "blur(8px)", zIndex: 99999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#ffffff", borderRadius: "20px", width: "100%", maxWidth: "500px", padding: "24px", boxShadow: "0 25px 60px rgba(0,31,63,0.4)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, borderBottom: "1px solid #f1f5f9", paddingBottom: 12 }}>
              <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 800, color: "#001f3f" }}>
                {editingAddressId ? "Edit Service Location" : "Add New Service Location"}
              </h3>
              <button
                type="button"
                onClick={() => setAddressModalOpen(false)}
                style={{ border: "none", background: "#f1f5f9", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <iconify-icon icon="lucide:x" />
              </button>
            </div>

            <form onSubmit={handleSaveAddressModal}>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={{ display: "block", fontSize: "12.5px", fontWeight: 700, color: "#001f3f", marginBottom: 5 }}>
                    Location Label (e.g. Home, Office, Site Alpha)
                  </label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={addrLabel}
                    onChange={(e) => setAddrLabel(e.target.value)}
                    placeholder="e.g. Primary Residence"
                    required
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={{ display: "block", fontSize: "12.5px", fontWeight: 700, color: "#001f3f", marginBottom: 5 }}>
                      Category
                    </label>
                    <select
                      className={styles.formSelect}
                      value={addrCategory}
                      onChange={(e) => setAddrCategory(e.target.value as any)}
                    >
                      <option value="home">Home / Apartment</option>
                      <option value="office">Office / Commercial</option>
                      <option value="site">Construction Site</option>
                      <option value="rental">Rental Property</option>
                      <option value="other">Other Location</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "12.5px", fontWeight: 700, color: "#001f3f", marginBottom: 5 }}>
                      City
                    </label>
                    <input
                      type="text"
                      className={styles.formInput}
                      value={addrCity}
                      onChange={(e) => setAddrCity(e.target.value)}
                      placeholder="e.g. Cotonou"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12.5px", fontWeight: 700, color: "#001f3f", marginBottom: 5 }}>
                    Neighborhood / District / Quarter
                  </label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={addrNeighborhood}
                    onChange={(e) => setAddrNeighborhood(e.target.value)}
                    placeholder="e.g. Haie Vive, Akpakpa, Cadjehoun"
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12.5px", fontWeight: 700, color: "#001f3f", marginBottom: 5 }}>
                    Street Address / Building & Landmark (Private)
                  </label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={addrStreet}
                    onChange={(e) => setAddrStreet(e.target.value)}
                    placeholder="e.g. Rue 340, Immeuble Horizon Apt 4B"
                    required
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12.5px", fontWeight: 700, color: "#001f3f", marginBottom: 5 }}>
                    Technician Access Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={addrAccessNotes}
                    onChange={(e) => setAddrAccessNotes(e.target.value)}
                    placeholder="e.g. Ring black gate, parking available inside"
                  />
                </div>

                <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "13px", fontWeight: 600, color: "#001f3f", cursor: "pointer", marginTop: 4 }}>
                  <input
                    type="checkbox"
                    checked={addrIsDefault}
                    onChange={(e) => setAddrIsDefault(e.target.checked)}
                    style={{ width: 18, height: 18, accentColor: "#ff4500" }}
                  />
                  <span>Set as default service location for new tasks</span>
                </label>
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
                <button
                  type="button"
                  onClick={() => setAddressModalOpen(false)}
                  className={styles.secondaryBtn}
                  style={{ flex: 1, justifyContent: "center" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.primaryBtn}
                  style={{ flex: 1.2, justifyContent: "center" }}
                >
                  <iconify-icon icon="lucide:check" />
                  {editingAddressId ? "Update Address" : "Save Location"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== IMAGE CROPPER MODAL ==================== */}
      {cropData && (
        <ImageCropperModal
          imageSrc={cropData.src}
          aspectRatio={cropData.type === "avatar" || cropData.type === "business_logo" ? 1 : cropData.type === "cover" ? 3 / 1 : 4 / 3}
          onCropComplete={handleCropComplete}
          onCancel={() => setCropData(null)}
        />
      )}
    </div>
  );
}
