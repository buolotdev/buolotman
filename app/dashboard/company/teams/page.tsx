"use client";

import Link from "next/link";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";

export default function CompanyTeamsPage() {
  const { data: profile } = useFetch(() => api.getCompanyProfile(), []);

  return (
    <main style={{ padding: 24 }}>
      <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gap: 20 }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <div>
            <p style={{ margin: 0, color: "#64748b" }}>Company dashboard</p>
            <h1 style={{ margin: "4px 0 0" }}>Teams</h1>
          </div>
          <Link href="/dashboard/company" style={{ color: "#0f172a" }}>Back to dashboard</Link>
        </header>

        <section style={{ background: "#fff", borderRadius: 20, padding: 24 }}>
          <h2 style={{ marginTop: 0 }}>Team Overview</h2>
          <p>Team size: {profile?.team_size || 0}</p>
          <p>We do not yet have a dedicated team-member model, so this page shows the company-level team summary from the verified profile.</p>
        </section>
      </div>
    </main>
  );
}
