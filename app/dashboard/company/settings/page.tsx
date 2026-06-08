"use client";

import { useState } from "react";
import Link from "next/link";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";

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
    <main style={{ padding: 24 }}>
      <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gap: 20 }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <div>
            <p style={{ margin: 0, color: "#64748b" }}>Company dashboard</p>
            <h1 style={{ margin: "4px 0 0" }}>Settings</h1>
          </div>
          <Link href="/dashboard/company" style={{ color: "#0f172a" }}>Back to dashboard</Link>
        </header>

        <section style={{ background: "#fff", borderRadius: 20, padding: 24, boxShadow: "0 10px 24px rgba(15,23,42,0.06)" }}>
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
    <div style={{ display: "grid", gap: 14 }}>
      <Field label="Company name" value={form.company_name} onChange={(v) => setForm((c) => ({ ...c, company_name: v }))} />
      <Field label="Registration number" value={form.registration_number} onChange={(v) => setForm((c) => ({ ...c, registration_number: v }))} />
      <Field label="Headquarters" value={form.headquarters} onChange={(v) => setForm((c) => ({ ...c, headquarters: v }))} />
      <Field label="Website" value={form.website} onChange={(v) => setForm((c) => ({ ...c, website: v }))} />
      <Field label="About" value={form.about} onChange={(v) => setForm((c) => ({ ...c, about: v }))} textarea />
      <button
        type="button"
        onClick={submit}
        disabled={saving}
        style={{ justifySelf: "start", padding: "12px 16px", borderRadius: 12, border: "none", background: "#0f172a", color: "#fff", fontWeight: 700 }}
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
    <label style={{ display: "grid", gap: 8 }}>
      <span style={{ fontWeight: 600 }}>{label}</span>
      {textarea ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={5} style={{ border: "1px solid #cbd5e1", borderRadius: 12, padding: 12 }} />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} style={{ border: "1px solid #cbd5e1", borderRadius: 12, padding: 12 }} />
      )}
    </label>
  );
}
