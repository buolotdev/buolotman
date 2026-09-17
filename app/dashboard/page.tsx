"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardRootPage() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("access_token");
    const role = (localStorage.getItem("user_role") || "").toLowerCase().trim();

    if (!token) {
      router.replace("/login?redirect=/dashboard");
      return;
    }

    if (role === "technician") {
      router.replace("/dashboard/technician/wallet");
    } else if (role === "company") {
      router.replace("/dashboard/company/wallet");
    } else if (role === "admin") {
      router.replace("/dashboard/admin/payments");
    } else if (role === "client") {
      router.replace("/dashboard/client");
    } else {
      router.replace("/login");
    }
  }, [router]);

  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: "100vh", fontFamily: "system-ui", background: "#f8fafc" }}>
      <div
        style={{
          width: 36,
          height: 36,
          border: "3px solid #e2e8f0",
          borderTopColor: "#ff4500",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
          marginBottom: 16
        }}
      />
      <p style={{ color: "#64748b", fontSize: 14, fontWeight: 600 }}>Redirecting to your dashboard...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
