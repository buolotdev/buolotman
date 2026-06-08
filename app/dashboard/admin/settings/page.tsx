"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";

type PlatformSetting = {
  id: number | string;
  key: string;
  value: Record<string, unknown>;
  description?: string;
  is_sensitive?: boolean;
};

type FormState = {
  key: string;
  description: string;
  value: string;
  is_sensitive: boolean;
};

const EMPTY_FORM: FormState = {
  key: "",
  description: "",
  value: "{\n  \n}",
  is_sensitive: false,
};

export default function AdminSettingsPage() {
  const { data, loading, refetch } = useFetch<PlatformSetting[]>(() => api.getPlatformSettings(), []);
  const settings = useMemo(() => (Array.isArray(data) ? data : []), [data]);
  const [selectedKey, setSelectedKey] = useState<string>("");
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const selected = useMemo(() => settings.find((item) => item.key === selectedKey), [settings, selectedKey]);

  const beginEdit = (setting: PlatformSetting) => {
    setSelectedKey(setting.key);
    setForm({
      key: setting.key,
      description: setting.description || "",
      value: JSON.stringify(setting.value ?? {}, null, 2),
      is_sensitive: Boolean(setting.is_sensitive),
    });
    setMessage(null);
  };

  const resetForm = () => {
    setSelectedKey("");
    setForm(EMPTY_FORM);
    setMessage(null);
  };

  const save = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const parsedValue = form.value.trim() ? JSON.parse(form.value) : {};
      const payload = {
        key: form.key.trim(),
        description: form.description.trim(),
        value: parsedValue,
        is_sensitive: form.is_sensitive,
      };

      if (!payload.key) {
        throw new Error("Key is required.");
      }

      const exists = settings.some((setting) => setting.key === payload.key);
      if (exists) {
        await api.updatePlatformSetting(payload);
      } else {
        await api.createPlatformSetting(payload);
      }

      await refetch();
      setMessage("Saved.");
      setSelectedKey(payload.key);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save setting.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main style={{ padding: 24 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gap: 20 }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <div>
            <p style={{ margin: 0, color: "#64748b" }}>Admin dashboard</p>
            <h1 style={{ margin: "4px 0 0" }}>Settings</h1>
          </div>
          <Link href="/dashboard/admin" style={{ color: "#0f172a" }}>Back to dashboard</Link>
        </header>

        <section style={{ display: "grid", gridTemplateColumns: "320px minmax(0, 1fr)", gap: 20 }}>
          <aside style={{ background: "#fff", borderRadius: 20, padding: 20, boxShadow: "0 10px 24px rgba(15,23,42,0.06)", display: "grid", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
              <h2 style={{ margin: 0 }}>Platform settings</h2>
              <button type="button" onClick={resetForm} style={{ border: "none", background: "#e2e8f0", borderRadius: 10, padding: "8px 10px" }}>
                New
              </button>
            </div>
            {loading ? (
              <p>Loading settings...</p>
            ) : settings.length === 0 ? (
              <p>No settings stored yet.</p>
            ) : (
              <div style={{ display: "grid", gap: 8 }}>
                {settings.map((setting) => (
                  <button
                    key={setting.id}
                    type="button"
                    onClick={() => beginEdit(setting)}
                    style={{
                      textAlign: "left",
                      border: "1px solid #e2e8f0",
                      background: selected?.key === setting.key ? "#f1f5f9" : "#fff",
                      borderRadius: 14,
                      padding: 12,
                    }}
                  >
                    <div style={{ fontWeight: 700 }}>{setting.key}</div>
                    <div style={{ color: "#64748b", fontSize: 13 }}>{setting.description || "No description"}</div>
                  </button>
                ))}
              </div>
            )}
          </aside>

          <section style={{ background: "#fff", borderRadius: 20, padding: 24, boxShadow: "0 10px 24px rgba(15,23,42,0.06)", display: "grid", gap: 14 }}>
            <h2 style={{ marginTop: 0 }}>{selected ? "Edit setting" : "Create setting"}</h2>
            <Field label="Key" value={form.key} onChange={(value) => setForm((current) => ({ ...current, key: value }))} />
            <Field label="Description" value={form.description} onChange={(value) => setForm((current) => ({ ...current, description: value }))} />
            <Field
              label="Value (JSON)"
              value={form.value}
              onChange={(value) => setForm((current) => ({ ...current, value: value }))}
              textarea
            />
            <label style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <input
                type="checkbox"
                checked={form.is_sensitive}
                onChange={(e) => setForm((current) => ({ ...current, is_sensitive: e.target.checked }))}
              />
              <span>Mark as sensitive</span>
            </label>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={save}
                disabled={saving}
                style={{ padding: "12px 16px", borderRadius: 12, border: "none", background: "#0f172a", color: "#fff", fontWeight: 700 }}
              >
                {saving ? "Saving..." : "Save setting"}
              </button>
              {message ? <span style={{ alignSelf: "center", color: "#475569" }}>{message}</span> : null}
            </div>

            <div style={{ background: "#f8fafc", borderRadius: 16, padding: 16 }}>
              <strong>Notes</strong>
              <p style={{ margin: "8px 0 0", color: "#475569", lineHeight: 1.6 }}>
                These settings are stored in the backend and can be used for platform configuration such as support contacts, commission values, maintenance flags, or rollout settings.
              </p>
            </div>
          </section>
        </section>
      </div>
    </main>
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
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={8}
          style={{ border: "1px solid #cbd5e1", borderRadius: 12, padding: 12, fontFamily: "monospace" }}
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ border: "1px solid #cbd5e1", borderRadius: 12, padding: 12 }}
        />
      )}
    </label>
  );
}
