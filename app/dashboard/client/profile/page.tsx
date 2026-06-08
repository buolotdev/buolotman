"use client";

import React from "react";
import Link from "next/link";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import { SkeletonBlock } from "@/app/components/skeleton/Skeleton";
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

const shortcutLinks = [
  { href: "/dashboard/client/tasks", label: "My tasks" },
  { href: "/dashboard/client/messages", label: "Messages" },
  { href: "/dashboard/client/payments", label: "Payments" },
  { href: "/search", label: "Find pros" },
];

export default function ClientProfilePage() {
  const { data: me, loading, refetch } = useFetch<Me | null>(() => api.getMe(), []);

  const save = async (form: FormState) => {
    await api.updateMe(form);
    refetch();
  };

  const userName = `${me?.first_name || ""} ${me?.last_name || ""}`.trim() || me?.username || "Client";
  const initials = `${(me?.first_name || "")[0] || ""}${(me?.last_name || "")[0] || ""}`.toUpperCase() || "C";

  return (
    <main className={styles.page}>
      <div className={styles.layout}>
        <section className={styles.heroCard}>
          <div>
            <p className={styles.eyebrow}>Client dashboard</p>
            <div className={styles.heroTop}>
              <div>
                <h1>Profile</h1>
                <p className={styles.lead}>
                  Keep your account details current so tasks, bids, messages, and payments stay synced across the platform.
                </p>
              </div>
              <Link href="/dashboard/client" className={styles.backLink}>
                Back to dashboard
              </Link>
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
