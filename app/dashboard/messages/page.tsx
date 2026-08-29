"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function MessagesRedirectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const role = (localStorage.getItem("user_role") || "").toUpperCase();
    const qs = searchParams.toString();
    const query = qs ? `?${qs}` : "";

    if (role === "TECHNICIAN") {
      router.replace(`/dashboard/technician/messages${query}`);
    } else if (role === "COMPANY") {
      router.replace(`/dashboard/company/messages${query}`);
    } else {
      // Default to client messages
      router.replace(`/dashboard/client/messages${query}`);
    }
  }, [router, searchParams]);

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh", color: "#001f3f", fontFamily: "sans-serif" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 40, height: 40, border: "4px solid #ff4500", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
        <p style={{ fontWeight: 600, fontSize: "15px" }}>Opening Messages...</p>
      </div>
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default function DashboardMessagesRedirect() {
  return (
    <Suspense fallback={
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh", color: "#001f3f", fontFamily: "sans-serif" }}>
        <p style={{ fontWeight: 600, fontSize: "15px" }}>Loading Messages...</p>
      </div>
    }>
      <MessagesRedirectContent />
    </Suspense>
  );
}
