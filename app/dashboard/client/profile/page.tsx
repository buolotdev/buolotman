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

export default function ClientProfilePage() {
  const toast = useToast();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Fetch current user
  const { data: user, loading, refetch: refetchUser } = useFetch(() => api.getMe(), []);

  // Form State
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
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);

  // Upload & Cropper State
  const [cropData, setCropData] = useState<{ src: string; type: "avatar" | "cover" } | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [saving, setSaving] = useState(false);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // Sync user data to form
  useEffect(() => {
    if (user && !loading) {
      setFirstName(user.first_name || "");
      setLastName(user.last_name || "");
      setUsername(user.username || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setCountry(user.country || "Benin");
      setCity(user.city || "Cotonou");
      setAddress(user.address || user.location || "");
      setAbout(user.about || user.bio || "");
      if (user.avatar) setAvatarUrl(user.avatar);
      if (user.cover_image || user.banner) setCoverUrl(user.cover_image || user.banner);
    }
  }, [user, loading]);

  const fullName = useMemo(() => {
    const name = `${firstName} ${lastName}`.trim();
    return name || user?.username || "Client";
  }, [firstName, lastName, user?.username]);

  const initials = useMemo(() => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    if (fullName) {
      return fullName.substring(0, 2).toUpperCase();
    }
    return "CL";
  }, [firstName, lastName, fullName]);

  const isVerified = Boolean(user?.is_verified || user?.email_verified);

  // Avatar / Cover Image Handlers
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "avatar" | "cover") => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.show("error", "Please select a valid image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.show("error", "Image must be smaller than 5MB");
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
    } else {
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
    }
  };

  const handleSaveProfile = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      await api.updateMe({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone: phone.trim(),
        country: country.trim(),
        city: city.trim(),
        address: address.trim(),
        location: address.trim(),
        bio: about.trim(),
        about: about.trim(),
      });
      await refetchUser();
      toast.show("success", "Profile updated successfully");
    } catch (err: any) {
      toast.show("error", err.message || "Failed to save profile changes");
    } finally {
      setSaving(false);
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
          {/* ==================== HERO SECTION ==================== */}
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
                  {uploadingCover ? "Uploading..." : "Change Cover"}
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
                      alt={fullName}
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
                    <h1 className={styles.companyName}>{fullName}</h1>
                    {isVerified ? (
                      <span className={styles.verifiedBadge}>
                        <iconify-icon icon="lucide:shield-check" /> Verified Client
                      </span>
                    ) : (
                      <span className={styles.pendingBadge}>
                        <iconify-icon icon="lucide:clock" /> Verified Account
                      </span>
                    )}
                  </div>
                  <p className={styles.companyTagline}>
                    {user?.role ? user.role.toUpperCase() : "CLIENT"} • Member since{" "}
                    {user?.date_joined
                      ? new Date(user.date_joined).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })
                      : "Recently"}
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
                  </div>
                </div>
              </div>

              <div className={styles.heroActions}>
                <button
                  type="button"
                  className={styles.primaryBtn}
                  onClick={() => handleSaveProfile()}
                  disabled={saving}
                >
                  <iconify-icon
                    icon={saving ? "lucide:loader-2" : "lucide:save"}
                    className={saving ? styles.spinIcon : ""}
                  />
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>

          {/* ==================== SECTION 1: PERSONAL INFORMATION ==================== */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div>
                <h3>
                  <iconify-icon icon="lucide:user" style={{ color: "#ff4500" }} />
                  Personal Information
                </h3>
                <p>Update your personal details, contact number, and service delivery address.</p>
              </div>
            </div>

            <form onSubmit={handleSaveProfile}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="first_name">
                    <iconify-icon icon="lucide:user" /> First Name
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
                    <iconify-icon icon="lucide:user" /> Last Name
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
                  <label htmlFor="username">
                    <iconify-icon icon="lucide:at-sign" /> Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    className={styles.formInput}
                    value={username}
                    disabled
                    title="Username cannot be changed"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email">
                    <iconify-icon icon="lucide:mail" /> Email Address
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
                    <iconify-icon icon="lucide:phone" /> Phone Number
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
                    <iconify-icon icon="lucide:globe" /> Country
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
                    <iconify-icon icon="lucide:map-pin" /> City / Region
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

                <div className={styles.formGroup}>
                  <label htmlFor="address">
                    <iconify-icon icon="lucide:home" /> Residential / Office Address
                  </label>
                  <input
                    id="address"
                    type="text"
                    className={styles.formInput}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Quartier Haie Vive, Rue 340"
                  />
                </div>

                <div className={`${styles.formGroup} ${styles.formGridFull}`}>
                  <label htmlFor="about">
                    <iconify-icon icon="lucide:file-text" /> Bio / Client Note
                  </label>
                  <textarea
                    id="about"
                    className={styles.formTextarea}
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    placeholder="Add brief details about your service requirements or property context..."
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
                  {saving ? "Saving..." : "Save Profile Details"}
                </button>
              </div>
            </form>
          </div>

          {/* ==================== SECTION 2: TRUST & SECURITY STATUS ==================== */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div>
                <h3>
                  <iconify-icon icon="lucide:shield-alert" style={{ color: "#0284c7" }} />
                  Account Trust & Escrow Guarantee
                </h3>
                <p>Security measures and verified safeguards linked to your client profile.</p>
              </div>
            </div>

            <div className={styles.verificationGrid}>
              <div className={styles.verificationCard}>
                <div className={styles.verificationCardHeader}>
                  <div className={`${styles.vIconWrap} ${styles.vIconGreen}`}>
                    <iconify-icon icon="lucide:shield-check" />
                  </div>
                  <span className={`${styles.vStatusBadge} ${styles.vBadgeGreen}`}>Active</span>
                </div>
                <h4 className={styles.verificationCardTitle}>Verified Email Security</h4>
                <p className={styles.verificationCardDesc}>
                  Your primary communication email is verified for instant booking receipts and contracts.
                </p>
              </div>

              <div className={styles.verificationCard}>
                <div className={styles.verificationCardHeader}>
                  <div className={`${styles.vIconWrap} ${styles.vIconBlue}`}>
                    <iconify-icon icon="lucide:lock" />
                  </div>
                  <span className={`${styles.vStatusBadge} ${styles.vBadgeBlue}`}>100% Protected</span>
                </div>
                <h4 className={styles.verificationCardTitle}>BoulotMan Escrow Safe</h4>
                <p className={styles.verificationCardDesc}>
                  Payments are locked safely in escrow and only released when you approve completed work.
                </p>
              </div>

              <div className={styles.verificationCard}>
                <div className={styles.verificationCardHeader}>
                  <div className={`${styles.vIconWrap} ${styles.vIconAmber}`}>
                    <iconify-icon icon="lucide:phone-call" />
                  </div>
                  <span className={`${styles.vStatusBadge} ${styles.vBadgeAmber}`}>Direct Dispatch</span>
                </div>
                <h4 className={styles.verificationCardTitle}>Fast Technician Dispatch</h4>
                <p className={styles.verificationCardDesc}>
                  Your phone contact is shared securely with assigned technicians for prompt on-site arrival.
                </p>
              </div>
            </div>
          </div>

          {/* ==================== SECTION 3: PREFERENCES ==================== */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div>
                <h3>
                  <iconify-icon icon="lucide:sliders" style={{ color: "#64748b" }} />
                  Regional & Currency Preferences
                </h3>
                <p>Configure how prices and communications are displayed across your dashboard.</p>
              </div>
            </div>

            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="currency">
                  <iconify-icon icon="lucide:credit-card" /> Preferred Currency
                </label>
                <select
                  id="currency"
                  className={styles.formSelect}
                  value={preferredCurrency}
                  onChange={(e) => setPreferredCurrency(e.target.value)}
                >
                  <option value="XOF">XOF (CFA Franc BCEAO) - West Africa</option>
                  <option value="EUR">EUR (€) - Euro</option>
                  <option value="USD">USD ($) - US Dollar</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="language">
                  <iconify-icon icon="lucide:languages" /> Platform Language
                </label>
                <select
                  id="language"
                  className={styles.formSelect}
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value)}
                >
                  <option value="fr">Français (French)</option>
                  <option value="en">English (US/UK)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== IMAGE CROPPER MODAL ==================== */}
      {cropData && (
        <ImageCropperModal
          imageSrc={cropData.src}
          aspectRatio={cropData.type === "avatar" ? 1 : 3 / 1}
          onCropComplete={handleCropComplete}
          onCancel={() => setCropData(null)}
        />
      )}
    </div>
  );
}
