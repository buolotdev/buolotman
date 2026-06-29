"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import { SkeletonBlock } from "@/app/components/skeleton/Skeleton";
import DashboardHeader from "@/app/components/DashboardHeader";
import LogoutButton from "@/app/components/LogoutButton";
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

  const { data: me, loading, refetch } = useFetch<Me | null>(() => api.getMe(), []);

  const save = async (form: FormState) => {
    await api.updateMe(form);
    refetch();
  };

  const userName = `${me?.first_name || ""} ${me?.last_name || ""}`.trim() || me?.username || "Client";
  const initials = `${(me?.first_name || "")[0] || ""}${(me?.last_name || "")[0] || ""}`.toUpperCase() || "C";

  return (
    <main className={styles.page}>
      <div className={styles.layoutWrapper}>
        {/* Sidebar */}
        <aside className={`${styles.sidebar} ${mobileNavOpen ? styles.sidebarOpen : ""}`}>
          <div className={styles.sidebarHeader}>
            <div>
              <p className={styles.sidebarEyebrow}>Boulot Man</p>
              <h2 className={styles.sidebarTitle}>Client Space</h2>
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
                <div>
                  <p className={styles.eyebrow}>Client dashboard</p>
                  <div className={styles.heroTop}>
                    <div>
                      <h1>Profile Settings</h1>
                      <p className={styles.lead}>
                        Keep your account details current so tasks, bids, messages, and payments stay synced across the platform.
                      </p>
                    </div>
                  </div>
                </div>

                <div className={styles.profileSummary}>
                  <div className={styles.avatar}>{loading ? <SkeletonBlock style={{ width: 56, height: 56, borderRadius: "50%" }} /> : initials}</div>
                  <div className={styles.summaryText}>
                    <strong>{loading ? <SkeletonBlock style={{ width: 120, height: 18 }} /> : userName}</strong>
                    <span>{me?.email || me?.phone || "No contact info yet"}</span>
                    <div className={styles.shortcutRow}>
                      {shortcutLinks.map((item) => (
                        <Link key={item.href} href={item.href} className={styles.shortcutLink}>
                          {item.label}
                        </Link>
                      ))}
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
                    <Link href="/dashboard/client/tasks">View active tasks</Link>
                    <Link href="/dashboard/client/messages">Open messages</Link>
                    <Link href="/dashboard/client/payments">Check payment history</Link>
                  </div>
                </aside>
              </section>
            </div>
          </div>
        </div>
      </div>
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
