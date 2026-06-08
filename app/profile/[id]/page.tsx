"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useFetch } from "@/app/lib/useFetch";
import { api } from "@/app/lib/api";

type PublicProfile = {
  role?: string;
  company_name?: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  avatar_url?: string;
  logo_url?: string;
  country?: string;
  headquarters?: string;
  is_verified?: boolean;
  average_rating?: number | string;
  response_time?: string;
  bio?: string;
  skills?: string[];
  portfolio?: unknown[];
  about?: string;
  services_offered?: string[];
  business_hours?: unknown[];
};

export default function PublicProfilePage() {
  const params = useParams<{ id: string }>();
  const id = Number(params?.id);
  const validId = Number.isFinite(id) ? id : null;
  const { data: profile, loading, error } = useFetch<PublicProfile | null>(
    () => (validId ? api.getUserProfile(validId) : Promise.resolve(null)),
    [validId]
  );

  const isCompany = profile?.role === "COMPANY";
  const isTechnician = profile?.role === "TECHNICIAN";
  const avatarSrc = profile?.avatar_url || profile?.logo_url || "";
  const displayName = isCompany
    ? profile?.company_name || `${profile?.first_name || ""} ${profile?.last_name || ""}`.trim()
    : `${profile?.first_name || ""} ${profile?.last_name || ""}`.trim() || profile?.username || "Profile";
  const initials = `${profile?.first_name?.[0] || ""}${profile?.last_name?.[0] || ""}`.toUpperCase() || "BM";

  if (validId === null) {
    return <main style={{ padding: 32 }}>Invalid profile id.</main>;
  }

  return (
    <main style={{ minHeight: "100vh", background: "#f8fafc", padding: 24 }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <div style={{ marginBottom: 24 }}>
          <Link href="/search" style={{ color: "#0f172a", textDecoration: "none" }}>
            ← Back to search
          </Link>
        </div>

        <section style={{ background: "#fff", borderRadius: 24, padding: 24, boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)" }}>
          {loading ? (
            <p>Loading profile...</p>
          ) : error ? (
            <p style={{ color: "#dc2626" }}>{error}</p>
          ) : profile ? (
            <>
              <div style={{ display: "flex", gap: 20, alignItems: "center", marginBottom: 24, flexWrap: "wrap" }}>
                <div style={{ width: 88, height: 88, borderRadius: "50%", background: "#e2e8f0", display: "grid", placeItems: "center", overflow: "hidden" }}>
                  {avatarSrc ? (
                    <Image src={avatarSrc} alt={displayName} width={88} height={88} style={{ objectFit: "cover" }} />
                  ) : (
                    <strong style={{ fontSize: 30, color: "#0f172a" }}>{initials}</strong>
                  )}
                </div>
                <div>
                  <p style={{ margin: 0, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em" }}>{profile.role}</p>
                  <h1 style={{ margin: "6px 0", fontSize: 32 }}>{displayName}</h1>
                  <p style={{ margin: 0, color: "#475569" }}>{profile.country || profile.headquarters || "Location not set"}</p>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
                <InfoCard label="Verified" value={profile.is_verified ? "Yes" : "No"} />
                <InfoCard label="Rating" value={profile.average_rating ? String(profile.average_rating) : "N/A"} />
                <InfoCard label="Profile Type" value={profile.role || "Unknown"} />
                <InfoCard label="Response Time" value={profile.response_time || "Not set"} />
              </div>

              <div style={{ marginTop: 24, display: "grid", gap: 16 }}>
                {isTechnician ? (
                  <>
                    <Block title="Bio" value={profile.bio || "No bio provided."} />
                    <Block title="Skills" value={(profile.skills || []).join(", ") || "No skills listed."} />
                    <Block title="Portfolio" value={JSON.stringify(profile.portfolio || [], null, 2)} mono />
                  </>
                ) : null}

                {isCompany ? (
                  <>
                    <Block title="About" value={profile.about || "No company description provided."} />
                    <Block title="Services Offered" value={(profile.services_offered || []).join(", ") || "No services listed."} />
                    <Block title="Headquarters" value={profile.headquarters || "Not set"} />
                    <Block title="Business Hours" value={JSON.stringify(profile.business_hours || [], null, 2)} mono />
                  </>
                ) : null}
              </div>
            </>
          ) : (
            <p>Profile not found.</p>
          )}
        </section>
      </div>
    </main>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ border: "1px solid #e2e8f0", borderRadius: 16, padding: 16, background: "#f8fafc" }}>
      <div style={{ color: "#64748b", fontSize: 13, marginBottom: 8 }}>{label}</div>
      <div style={{ fontWeight: 700, color: "#0f172a" }}>{value}</div>
    </div>
  );
}

function Block({ title, value, mono = false }: { title: string; value: string; mono?: boolean }) {
  return (
    <div style={{ border: "1px solid #e2e8f0", borderRadius: 16, padding: 16 }}>
      <h2 style={{ margin: "0 0 8px", fontSize: 18 }}>{title}</h2>
      <pre style={{ margin: 0, whiteSpace: "pre-wrap", fontFamily: mono ? "monospace" : "inherit", color: "#334155" }}>{value}</pre>
    </div>
  );
}
