"use client";

import Link from "next/link";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import layoutStyles from "../page.module.css";

export default function CompanyAnalyticsPage() {
  const { data: profile } = useFetch(() => api.getCompanyProfile(), []);
  const { data: projectsData } = useFetch(() => api.getCompanyProjects(), []);
  const { data: servicesData } = useFetch(() => api.getCompanyServices(), []);

  const projects = Array.isArray(projectsData) ? projectsData : (projectsData as any)?.results || [];
  const services = Array.isArray(servicesData) ? servicesData : [];

  return (
    <div className={layoutStyles.content}>
    <main style={{ padding: 24 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gap: 20 }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16, flexWrap: "wrap" }}>
          <div>
            <p style={{ margin: 0, color: "#64748b", fontSize: 15, fontWeight: 500 }}>Company dashboard</p>
            <h1 style={{ margin: "4px 0 0", color: "#001f3f", fontSize: 32, fontWeight: 800 }}>Analytics</h1>
          </div>
          <Link href="/dashboard/company" style={{ color: "#ff4500", fontWeight: 600, textDecoration: "none", fontSize: 15, display: "inline-flex", alignItems: "center", gap: 6 }}>
            <iconify-icon icon="lucide:arrow-left" /> Back to dashboard
          </Link>
        </header>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
          <Card label="Projects" value={String(projects.length)} />
          <Card label="Services" value={String(services.length)} />
          <Card label="Reviews" value={String(profile?.review_count || 0)} />
          <Card label="Rating" value={profile?.average_rating ? String(profile.average_rating) : "0"} />
        </section>

        
      </div>
    </main>
    </div>
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
