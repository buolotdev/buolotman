"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function RedirectHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const params = searchParams ? searchParams.toString() : "";
    const target = params ? `/post-task?${params}` : "/post-task";
    router.replace(target);
  }, [router, searchParams]);

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#f8fafc", color: "#001f3f", fontFamily: "sans-serif" }}>
      <div style={{ textAlign: "center" }}>
        <p style={{ fontSize: "18px", fontWeight: 700, margin: 0 }}>Redirecting to task creation...</p>
      </div>
    </div>
  );
}

export default function CreateTaskRedirectPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, textAlign: "center" }}>Loading...</div>}>
      <RedirectHandler />
    </Suspense>
  );
}
