"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/app/lib/api";
import styles from "./login.module.css";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
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
      <div className={styles.cardWrapper}>
        {/* Signature Deep Blue Top Header Banner */}
        <div className={styles.bannerHeader}>
          <div className={styles.logoContainer}>
            <Link href="/" className={styles.logoWrap} title="Boulot Man Home">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/boulotman-logo.png"
                alt="Boulot Man"
                className={styles.logoImg}
              />
            </Link>
          </div>

          <div className={styles.badgeRow}>
            <span className={styles.badgeDot} />
            <span>Admin Portal</span>
          </div>

          <h1 className={styles.title}>Welcome Admin</h1>
          <p className={styles.subtitle}>
            Boulot Man administrative command & management center. Authorized personnel access only.
          </p>
        </div>

        {/* Card Form Body */}
        <div className={styles.cardBody}>
          {error && (
            <div className={styles.errorBox}>
              <iconify-icon icon="lucide:alert-circle" style={{ fontSize: 18, flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputField}>
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

            <div className={styles.inputField}>
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
                  className={styles.eyeButton}
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
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
                <span>Remember session</span>
              </label>
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? (
                <>
                  <iconify-icon icon="lucide:loader-2" className={styles.spinIcon} style={{ fontSize: 18 }} />
                  <span>Authenticating Admin...</span>
                </>
              ) : (
                <>
                  <span>Access Command Center</span>
                  <iconify-icon icon="lucide:arrow-right" style={{ fontSize: 18 }} />
                </>
              )}
            </button>
          </form>

          <div className={styles.backHome}>
            <Link href="/" className={styles.backLink}>
              <iconify-icon icon="lucide:arrow-left" style={{ fontSize: 14 }} />
              <span>Back to Boulot Man Marketplace</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
