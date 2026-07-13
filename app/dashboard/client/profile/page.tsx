"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import { SkeletonBlock } from "@/app/components/skeleton/Skeleton";
import DashboardHeader from "@/app/components/DashboardHeader";
import LogoutButton from "@/app/components/LogoutButton";
import ImageCropperModal from "@/app/components/ImageCropperModal";
import { useToast } from "@/app/components/Toast";
import styles from "./page.module.css";

type Me = {
  id?: number | string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  country?: string;
  email?: string;
  username?: string;
  role?: string;
  banner_url?: string;
  avatar_url?: string;
};

type FormState = {
  first_name: string;
  last_name: string;
  phone: string;
  country: string;
};

const navItems = [
  { key: "dashboard", label: "Dashboard", icon: "lucide:layout-dashboard", href: "/dashboard/client", match: (p: string) => p === "/dashboard/client" },
  { key: "tasks", label: "My Tasks", icon: "lucide:clipboard-list", href: "/dashboard/client/tasks", match: (p: string) => p.startsWith("/dashboard/client/tasks") },
  { key: "messages", label: "Messages", icon: "lucide:message-square", href: "/dashboard/client/messages", match: (p: string) => p.startsWith("/dashboard/client/messages") },
  { key: "payments", label: "Payments", icon: "lucide:credit-card", href: "/dashboard/client/payments", match: (p: string) => p.startsWith("/dashboard/client/payments") },
  { key: "saved", label: "Saved", icon: "lucide:bookmark", href: "/dashboard/client/saved", match: (p: string) => p.startsWith("/dashboard/client/saved") },
  { key: "profile", label: "Profile", icon: "lucide:user", href: "/dashboard/client/profile", match: (p: string) => p.startsWith("/dashboard/client/profile") },
  { key: "explore", label: "Explore Professionals", icon: "lucide:search", href: "/search", match: (p: string) => p.startsWith("/search") },

];

const shortcutLinks = [
  { href: "/dashboard/client/tasks", label: "My tasks" },
  { href: "/dashboard/client/messages", label: "Messages" },
  { href: "/dashboard/client/payments", label: "Payments" },
  { href: "/search", label: "Find pros" },
];

export default function ClientProfilePage() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const toast = useToast();

  const { data: me, loading, refetch } = useFetch<Me | null>(() => api.getMe(), []);

  const [cropData, setCropData] = useState<{ src: string; type: 'avatar' | 'banner' } | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const avatarInputRef = React.useRef<HTMLInputElement>(null);
  const [bannerUploading, setBannerUploading] = useState(false);
  const bannerInputRef = React.useRef<HTMLInputElement>(null);

  const save = async (form: FormState) => {
    await api.updateMe(form);
    refetch();
  };

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'banner') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setCropData({ src: reader.result as string, type });
    };
    reader.readAsDataURL(file);
    if (type === 'avatar' && avatarInputRef.current) avatarInputRef.current.value = "";
    if (type === 'banner' && bannerInputRef.current) bannerInputRef.current.value = "";
  };

  const handleCropComplete = async (croppedFile: File) => {
    if (!cropData) return;
    const type = cropData.type;
    setCropData(null); // close modal

    if (type === 'avatar') {
      setAvatarUploading(true);
      try {
        await api.uploadAvatar(croppedFile);
        toast.success("Avatar updated", "Your profile photo has been updated.");
        refetch();
      } catch (err: any) {
        toast.error("Upload failed", err?.message || "Please try again.");
      } finally {
        setAvatarUploading(false);
      }
    } else if (type === 'banner') {
      setBannerUploading(true);
      try {
        await api.uploadBanner(croppedFile);
        toast.success("Banner updated", "Your profile banner has been updated.");
        refetch();
      } catch (err: any) {
        toast.error("Upload failed", err?.message || "Please try again.");
      } finally {
        setBannerUploading(false);
      }
    }
  };

  const userName = `${me?.first_name || ""} ${me?.last_name || ""}`.trim() || me?.username || "Client";
  const initials = `${(me?.first_name || "")[0] || ""}${(me?.last_name || "")[0] || ""}`.toUpperCase() || "C";

  return (
    <main className={styles.page}>
      <div className={styles.layoutWrapper}>
        {/* Sidebar */}
        <aside className={`${styles.sidebar} ${mobileNavOpen ? styles.sidebarOpen : ""}`}>
          <div className={styles.sidebarHeader}>
            <Link href="/" className={styles.brand}>
              <Image src="/boulotman-logo.png" alt="Boulot Man" width={54} height={54} className={styles.brandImage} priority />
              <div className={styles.brandText}>
                <span className={styles.brandEyebrow}>Boulot Man</span>
                <span className={styles.brandTitle}>Client Space</span>
              </div>
            </Link>
            <button
              type="button"
              className={styles.sidebarClose}
              aria-label="Close navigation"
              onClick={() => setMobileNavOpen(false)}
            >
              <iconify-icon icon="lucide:x" />
            </button>
          </div>

          <nav className={styles.sidebarNav} aria-label="Main client navigation">
            {navItems.map((item) => {
              const active = item.match(pathname);
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`${styles.navItem} ${active ? styles.navItemActive : ""}`}
                >
                  <iconify-icon icon={item.icon} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className={styles.sidebarFooter}>
            <LogoutButton className={styles.logoutButton} />
          </div>
        </aside>

        {/* Main Content Area */}
        <div className={styles.main}>
          <DashboardHeader
            onMenuClick={() => setMobileNavOpen(true)}
          />

          <div className={styles.content}>
            <div className={styles.layout}>
              <section className={styles.heroCard}>
                {/* Banner Section */}
                <div 
                  className={styles.cover}
                  onClick={() => bannerInputRef.current?.click()}
                  title="Click to change banner"
                  style={{
                    cursor: "pointer",
                    backgroundImage: me?.banner_url
                      ? `url(${me?.banner_url})`
                      : undefined,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div style={{
                    position: "absolute", inset: 0,
                    background: me?.banner_url
                      ? "linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.35) 100%)"
                      : "transparent",
                    transition: "all 0.3s",
                  }} />
                  <div className={styles.bannerOverlay}>
                    <div className={styles.bannerUploadHint}>
                      {bannerUploading ? (
                        <><iconify-icon icon="lucide:loader" className={styles.spinIcon} /> Uploading...</>
                      ) : (
                        <><iconify-icon icon="lucide:camera" /> {me?.banner_url ? "Change Cover" : "Add Cover"}</>
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
                      <SkeletonBlock style={{ width: 128, height: 128, borderRadius: "50%" }} />
                    ) : (
                      <div
                        className={styles.avatarLarge}
                        onClick={() => avatarInputRef.current?.click()}
                        title="Click to change photo"
                        style={{ cursor: "pointer" }}
                      >
                        {me?.avatar_url ? (
                          <Image
                            src={me?.avatar_url}
                            alt="Profile photo"
                            fill
                            style={{ objectFit: "cover", borderRadius: "50%" }}
                          />
                        ) : (
                          initials
                        )}
                        <div style={{
                          position: "absolute", inset: 0, borderRadius: "50%",
                          background: "rgba(0,0,0,0.35)", display: "flex",
                          alignItems: "center", justifyContent: "center",
                          opacity: avatarUploading ? 1 : 0, transition: "opacity 0.2s",
                          color: "#fff",
                        }}>
                          {avatarUploading ? "..." : <iconify-icon icon="lucide:camera" style={{ fontSize: '24px' }} />}
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
                          <h1>{userName}</h1>
                        )}
                      </div>
                      <p className={styles.lead}>
                        {me?.email || me?.phone || "Client"}
                      </p>
                      <div className={styles.shortcutRow}>
                        {shortcutLinks.map((item) => (
                          <Link key={item.href} href={item.href} className={styles.shortcutLink}>
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className={styles.contentGrid}>
                <div className={styles.formCard}>
                  <div className={styles.sectionHeader}>
                    <div>
                      <p className={styles.sectionKicker}>Profile details</p>
                      <h2>Edit your account</h2>
                    </div>
                  </div>
                  {loading ? (
                    <p className={styles.loading}>Loading profile...</p>
                  ) : (
                    <ClientProfileForm
                      key={me?.id ?? "client-profile"}
                      initialValue={{
                        first_name: me?.first_name || "",
                        last_name: me?.last_name || "",
                        phone: me?.phone || "",
                        country: me?.country || "",
                      }}
                      onSave={save}
                    />
                  )}
                </div>

                <aside className={styles.sideRail}>
                  <div className={styles.sideCard}>
                    <p className={styles.sideKicker}>Account tips</p>
                    <ul>
                      <li>Use the same phone number for OTP and support.</li>
                      <li>Keep your country accurate for location-based tasks.</li>
                      <li>Update your profile before posting tasks or requesting payouts.</li>
                    </ul>
                  </div>
                  <div className={styles.sideCardAlt}>
                    <p className={styles.sideKicker}>Quick links</p>
                    <Link href="/dashboard/client/tasks">
                      <iconify-icon icon="lucide:clipboard-list" style={{ marginRight: '8px' }} /> View active tasks
                    </Link>
                    <Link href="/dashboard/client/messages">
                      <iconify-icon icon="lucide:message-square" style={{ marginRight: '8px' }} /> Open messages
                    </Link>
                    <Link href="/dashboard/client/payments">
                      <iconify-icon icon="lucide:credit-card" style={{ marginRight: '8px' }} /> Check payment history
                    </Link>
                  </div>
                </aside>
              </section>
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

function ClientProfileForm({
  initialValue,
  onSave,
}: {
  initialValue: FormState;
  onSave: (form: FormState) => Promise<void>;
}) {
  const [form, setForm] = React.useState<FormState>(initialValue);
  const [saving, setSaving] = React.useState(false);

  const submit = async () => {
    setSaving(true);
    try {
      await onSave(form);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.formGrid}>
      <Field label="First name" value={form.first_name} onChange={(v) => setForm((c) => ({ ...c, first_name: v }))} />
      <Field label="Last name" value={form.last_name} onChange={(v) => setForm((c) => ({ ...c, last_name: v }))} />
      <Field label="Phone" value={form.phone} onChange={(v) => setForm((c) => ({ ...c, phone: v }))} />
      <Field label="Country" value={form.country} onChange={(v) => setForm((c) => ({ ...c, country: v }))} />
      <div className={styles.actionsRow}>
        <button type="button" onClick={submit} disabled={saving} className={styles.primaryButton}>
          {saving ? "Saving..." : "Save changes"}
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className={styles.field}>
      <span>{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}
