"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton({ className, style }: { className?: string; style?: React.CSSProperties }) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_role");
    router.replace("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className={className}
      type="button"
      style={{
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        background: "none",
        border: "none",
        color: "inherit",
        font: "inherit",
        padding: 0,
        ...style,
      }}
    >
      <iconify-icon icon="lucide:log-out" />
    </button>
  );
}
