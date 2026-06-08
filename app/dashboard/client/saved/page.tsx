"use client";

import Link from "next/link";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";

type SavedItem = {
  id: number | string;
  professional?: {
    id?: number | string;
    first_name?: string;
    last_name?: string;
    username?: string;
    role?: string;
  };
};

export default function SavedProfessionalsPage() {
  const { data, loading, refetch } = useFetch(() => api.getSavedPros(), []);
  const saved = Array.isArray(data) ? data : [];

  return (
    <main style={{ padding: 24 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gap: 20 }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <div>
            <p style={{ margin: 0, color: "#64748b" }}>Client dashboard</p>
            <h1 style={{ margin: "4px 0 0" }}>Saved Professionals</h1>
          </div>
          <Link href="/dashboard/client" style={{ color: "#0f172a" }}>Back to dashboard</Link>
        </header>

        {loading ? (
          <p>Loading saved professionals...</p>
        ) : saved.length === 0 ? (
          <section style={{ background: "#fff", borderRadius: 20, padding: 24 }}>No saved professionals yet.</section>
        ) : (
          <section style={{ display: "grid", gap: 12 }}>
            {saved.map((item) => {
              const savedItem = item as SavedItem;
              const professional = savedItem.professional || {};
              const name = `${professional.first_name || ""} ${professional.last_name || ""}`.trim() || professional.username || "Professional";
              const initials = `${professional.first_name?.[0] || ""}${professional.last_name?.[0] || ""}`.toUpperCase() || "BM";
              return (
                <article key={savedItem.id} style={{ background: "#fff", borderRadius: 20, padding: 20, display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap", boxShadow: "0 10px 24px rgba(15,23,42,0.06)" }}>
                  <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                    <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#e2e8f0", display: "grid", placeItems: "center", fontWeight: 800 }}>{initials}</div>
                    <div>
                      <h2 style={{ margin: 0, fontSize: 18 }}>{name}</h2>
                      <p style={{ margin: "4px 0 0", color: "#64748b" }}>{professional.role || ""}</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <Link href={`/profile/${professional.id}`} style={{ padding: "10px 14px", borderRadius: 10, background: "#0f172a", color: "#fff", textDecoration: "none" }}>View</Link>
                    <button
                      type="button"
                      onClick={async () => {
                        if (typeof professional.id !== "number") {
                          return;
                        }
                        await api.unsavePro(professional.id);
                        refetch();
                      }}
                      style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #e2e8f0", background: "#fff" }}
                    >
                      Remove
                    </button>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}
