"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function AdminCatchAllRedirectPage() {
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const slug = params?.slug;
    const path = (Array.isArray(slug) ? slug.join("/") : slug || "").toLowerCase();

    if (path.includes("verification")) {
      router.replace("/dashboard/admin/verification");
    } else if (path.includes("user")) {
      router.replace("/dashboard/admin/users");
    } else if (path.includes("dispute")) {
      router.replace("/dashboard/admin/disputes");
    } else if (path.includes("task") || path.includes("project")) {
      router.replace("/dashboard/admin/tasks");
    } else if (path.includes("payment")) {
      router.replace("/dashboard/admin/payments");
    } else if (path.includes("review")) {
      router.replace("/dashboard/admin/reviews");
    } else if (path.includes("support")) {
      router.replace("/dashboard/admin/support");
    } else if (path.includes("message")) {
      router.replace("/dashboard/admin/messages");
    } else if (path.includes("setting")) {
      router.replace("/dashboard/admin/settings");
    } else {
      router.replace("/dashboard/admin");
    }
  }, [router, params]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "70vh",
        fontFamily: "'Inter', sans-serif",
        color: "#001f3f",
      }}
    >
      <div
        style={{
          width: "40px",
          height: "40px",
          border: "3px solid #f1f5f9",
          borderTop: "3px solid #ff4500",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
          marginBottom: "16px",
        }}
      />
      <p style={{ fontWeight: 600, fontSize: "15px" }}>Loading Admin Portal...</p>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
