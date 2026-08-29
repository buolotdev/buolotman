"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton({ 
  className, 
  style,
  showLabel = true 
}: { 
  className?: string; 
  style?: React.CSSProperties;
  showLabel?: boolean;
}) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_role");
    localStorage.removeItem("user");
    localStorage.removeItem("boulotman_user");
    router.replace("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className={className}
      type="button"
      aria-label="Logout"
      style={{
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        background: "none",
        border: "none",
        color: "inherit",
        font: "inherit",
        ...style,
      }}
    >
      <iconify-icon icon="lucide:log-out" />
      {showLabel && <span>Logout</span>}
    </button>
  );
}
