"use client";

import { useState } from "react";
import Link from "next/link";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import styles from "./settings.module.css";

type CompanyProfile = {
  id?: number | string;
  company_name?: string;
  registration_number?: string;
  headquarters?: string;
  website?: string;
  about?: string;
};

type FormState = {
  company_name: string;
  registration_number: string;
  headquarters: string;
  website: string;
  about: string;
};

export default function CompanySettingsPage() {
  const { data: profile, refetch } = useFetch<CompanyProfile | null>(() => api.getCompanyProfile(), []);

  const save = async (form: FormState) => {
    await api.updateCompanyProfile(form);
    refetch();
  };

  return (
    <main className={styles.mainWrapper}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <p className={styles.subtitle}>Company dashboard</p>
            <h1 className={styles.title}>Settings</h1>
          </div>
          <Link href="/dashboard/company" className={styles.backLink}>
            <iconify-icon icon="lucide:arrow-left" /> Back to dashboard
          </Link>
        </header>

        <section className={styles.card}>
          <CompanySettingsForm
            key={profile?.id ?? "company-settings"}
            initialValue={{
              company_name: profile?.company_name || "",
              registration_number: profile?.registration_number || "",
              headquarters: profile?.headquarters || "",
              website: profile?.website || "",
              about: profile?.about || "",
            }}
            onSave={save}
          />
        </section>
      </div>
    </main>
  );
}

function CompanySettingsForm({
  initialValue,
  onSave,
}: {
  initialValue: FormState;
  onSave: (form: FormState) => Promise<void>;
}) {
  const [form, setForm] = useState<FormState>(initialValue);
  const [saving, setSaving] = useState(false);

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
      <Field label="Company name" value={form.company_name} onChange={(v) => setForm((c) => ({ ...c, company_name: v }))} />
      <Field label="Registration number" value={form.registration_number} onChange={(v) => setForm((c) => ({ ...c, registration_number: v }))} />
      <Field label="Headquarters" value={form.headquarters} onChange={(v) => setForm((c) => ({ ...c, headquarters: v }))} />
      <Field label="Website" value={form.website} onChange={(v) => setForm((c) => ({ ...c, website: v }))} />
      <Field label="About" value={form.about} onChange={(v) => setForm((c) => ({ ...c, about: v }))} textarea />
      <button
        type="button"
        onClick={submit}
        disabled={saving}
        className={styles.saveBtn}
      >
        {saving ? "Saving..." : "Save changes"}
      </button>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  textarea = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  textarea?: boolean;
}) {
  return (
    <label className={styles.fieldGroup}>
      <span className={styles.label}>{label}</span>
      {textarea ? (
        <textarea className={styles.textarea} value={value} onChange={(e) => onChange(e.target.value)} rows={5} />
      ) : (
        <input className={styles.input} value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </label>
  );
}
