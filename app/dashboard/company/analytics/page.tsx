"use client";

import Link from "next/link";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";

export default function CompanyAnalyticsPage() {
  const { data: profile } = useFetch(() => api.getCompanyProfile(), []);
  const { data: projectsData } = useFetch(() => api.getCompanyProjects(), []);
  const { data: servicesData } = useFetch(() => api.getCompanyServices(), []);

  const projects = Array.isArray(projectsData) ? projectsData : projectsData?.results || [];
  const services = Array.isArray(servicesData) ? servicesData : [];

  return (
    <main style={{ padding: 24 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gap: 20 }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <div>
            <p style={{ margin: 0, color: "#64748b" }}>Company dashboard</p>
            <h1 style={{ margin: "4px 0 0" }}>Analytics</h1>
          </div>
          <Link href="/dashboard/company" style={{ color: "#0f172a" }}>Back to dashboard</Link>
        </header>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
          <Card label="Projects" value={String(projects.length)} />
          <Card label="Services" value={String(services.length)} />
          <Card label="Reviews" value={String(profile?.review_count || 0)} />
          <Card label="Rating" value={profile?.average_rating ? String(profile.average_rating) : "0"} />
        </section>

        <section style={{ background: "#fff", borderRadius: 20, padding: 24 }}>
          <h2 style={{ marginTop: 0 }}>Company Snapshot</h2>
          <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>{JSON.stringify(profile || {}, null, 2)}</pre>
        </section>
      </div>
    </main>
  );
}

function Card({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: "#fff", borderRadius: 18, padding: 18, boxShadow: "0 10px 24px rgba(15,23,42,0.06)" }}>
      <div style={{ color: "#64748b", fontSize: 13 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 800, marginTop: 8 }}>{value}</div>
    </div>
  );
}
