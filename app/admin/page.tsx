"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminIndexRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard/admin");
  }, [router]);

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
