"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

const PUBLIC_ROLES: Record<string, string[]> = {
  client: ["/dashboard/client"],
  technician: ["/dashboard/technician"],
  company: ["/dashboard/company"],
  admin: ["/dashboard/admin"],
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/api`
  : "http://127.0.0.1:8000/api";

function decodeJwtExp(token: string): number | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]));
    return typeof payload.exp === "number" ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
}

async function tryRefresh(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  const refresh = localStorage.getItem("refresh_token");
  if (!refresh) return false;
  try {
    const res = await fetch(`${API_BASE}/auth/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    if (data.access) {
      localStorage.setItem("access_token", data.access);
      if (data.refresh) localStorage.setItem("refresh_token", data.refresh);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

function clearSession() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user_role");
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function guard() {
      let token = localStorage.getItem("access_token");
      const refresh = localStorage.getItem("refresh_token");

      if (!token && !refresh) {
        clearSession();
        router.replace("/login");
        return;
      }

      if (token) {
        const exp = decodeJwtExp(token);
        if (exp === null) {
          clearSession();
          router.replace("/login");
          return;
        }
        if (Date.now() >= exp) {
          const ok = await tryRefresh();
          if (!ok) {
            clearSession();
            router.replace("/login");
            return;
          }
          token = localStorage.getItem("access_token");
        }
      } else if (refresh) {
        const ok = await tryRefresh();
        if (!ok) {
          clearSession();
          router.replace("/login");
          return;
        }
        token = localStorage.getItem("access_token");
      }

      if (cancelled) return;

      const role = (localStorage.getItem("user_role") || "").toLowerCase();
      const allowedPrefixes = PUBLIC_ROLES[role] || [];
      const isAllowed = allowedPrefixes.some((prefix) => pathname.startsWith(prefix));

      if (!isAllowed) {
        const defaultRoute = role ? `/dashboard/${role}` : "/login";
        router.replace(defaultRoute);
        return;
      }

      setChecking(false);
    }

    guard();
    return () => {
      cancelled = true;
    };
  }, [pathname, router]);

  if (checking) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", fontFamily: "system-ui" }}>
        <div style={{
          width: 32,
          height: 32,
          border: "3px solid #e2e8f0",
          borderTopColor: "#ff4500",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return <>{children}</>;
}
