"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/app/lib/api";
import styles from "./login.module.css";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@boulotman.com");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const cleanEmail = email.trim();
      const res = await api.login(cleanEmail, password);

      if (res?.access) {
        localStorage.setItem("access_token", res.access);
        if (res.refresh) localStorage.setItem("refresh_token", res.refresh);
        localStorage.setItem("user_role", res.role || "ADMIN");

        // Verify that account has Admin / Staff privileges
        try {
          const me = await api.getMe();
          const isAdmin = me?.role?.toUpperCase() === "ADMIN" || me?.is_staff || me?.is_superuser;
          if (!isAdmin) {
            // Non-admin account
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            localStorage.removeItem("user_role");
            setError("Access Denied: This portal requires Administrator privileges.");
            setLoading(false);
            return;
          }
        } catch {}

        // Seamless redirection to Admin Dashboard
        window.location.href = "/dashboard/admin";
      } else {
        throw new Error("Invalid credentials or server response.");
      }
    } catch (err: any) {
      console.error("Admin Login Error:", err);
      const msg = err?.message || "Invalid credentials. Please verify email and password.";
      setError(msg);
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Background Decor */}
      <div className={styles.gridBackground} />
      <div className={styles.orbTop} />
      <div className={styles.orbBottom} />

      {/* Admin Login Card */}
      <div className={styles.loginCard}>
        <div className={styles.cardHeader}>
          <div className={styles.brandRow}>
            <Link href="/" className={styles.brandLogo}>
              <span className={styles.brandText}>
                Boulot<span className={styles.brandAccent}>Man</span>
              </span>
            </Link>
            <span className={styles.adminTag}>
              <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "#ff4500", marginRight: 5 }} />
              Admin Portal
            </span>
          </div>

          <div className={styles.shieldIconWrap}>
            <iconify-icon icon="lucide:shield-check" />
          </div>

          <h1 className={styles.title}>Welcome Admin</h1>
          <p className={styles.subtitle}>
            Boulot Man Administrative Governance & Command Center. Authorized personnel access only.
          </p>
        </div>

        {error && (
          <div className={styles.errorAlert}>
            <iconify-icon icon="lucide:alert-octagon" style={{ fontSize: 18, flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="admin-email">
              <span>Admin Email / Username</span>
            </label>
            <div className={styles.inputWrapper}>
              <iconify-icon icon="lucide:mail" className={styles.inputIcon} />
              <input
                id="admin-email"
                type="text"
                className={styles.input}
                placeholder="admin@boulotman.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="username"
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="admin-pass">
              <span>Password</span>
            </label>
            <div className={styles.inputWrapper}>
              <iconify-icon icon="lucide:lock" className={styles.inputIcon} />
              <input
                id="admin-pass"
                type={showPassword ? "text" : "password"}
                className={styles.input}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className={styles.togglePassBtn}
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                <iconify-icon icon={showPassword ? "lucide:eye-off" : "lucide:eye"} />
              </button>
            </div>
          </div>

          <div className={styles.optionsRow}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember this session</span>
            </label>
            <span style={{ fontSize: 12, color: "#64748b" }}>256-bit SSL</span>
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={loading}
          >
            {loading ? (
              <>
                <iconify-icon icon="lucide:loader-2" className={styles.spinIcon} style={{ fontSize: 18 }} />
                <span>Authenticating Admin...</span>
              </>
            ) : (
              <>
                <span>Enter Command Center</span>
                <iconify-icon icon="lucide:arrow-right" style={{ fontSize: 18 }} />
              </>
            )}
          </button>
        </form>

        <div className={styles.quickHint}>
          <span>Official Admin Email:</span>
          <code>admin@boulotman.com</code>
        </div>

        <div className={styles.cardFooter}>
          <Link href="/">← Back to Main Marketplace</Link>
        </div>
      </div>
    </div>
  );
}
