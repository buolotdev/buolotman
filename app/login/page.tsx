"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "../lib/api";
import styles from "./login.module.css";

const safeNext = (value: string | undefined): string | null => {
  if (!value) return null;
  if (!value.startsWith("/") || value.startsWith("//")) return null;
  return value;
};

export default function LoginPage() {
  const router = useRouter();
  const [nextPath, setNextPath] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setNextPath(safeNext(params.get("next") ?? undefined));
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const data = await api.login(email, password);
      const role: string = data.role ?? "client";
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      localStorage.setItem("user_role", role);

      // Route based on role returned from backend
      if (nextPath) {
        router.push(nextPath);
      } else if (role === "admin") {
        router.push("/dashboard/admin");
      } else if (role === "company") {
        router.push("/dashboard/company");
      } else if (role === "technician") {
        router.push("/dashboard/technician");
      } else {
        router.push("/dashboard/client");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to log in");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.backdrop} aria-hidden="true">
        <div className={styles.glowLeft} />
        <div className={styles.glowRight} />
      </div>

      <section className={styles.card} aria-labelledby="login-title">
        <div className={styles.header}>
          <Link href="/" className={styles.brand} aria-label="Boulot Man home">
            <Image
              src="/boulotman-logo.png"
              alt="Boulot Man"
              width={280}
              height={72}
              className={styles.brandImage}
              priority
            />
          </Link>

          <div className={styles.headerText}>
            <h1 id="login-title" className={styles.title}>
              Welcome back
            </h1>
            <p className={styles.subtitle}>
              Enter your details to access your account.
            </p>
          </div>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.fieldGroup}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className={styles.input}
              placeholder="Enter your email"
              autoComplete="email"
              required
            />
          </div>

          <div className={styles.fieldGroup}>
            <div className={styles.labelRow}>
              <label htmlFor="password" className={styles.label}>
                Password
              </label>
              <Link href="/help-center" className={styles.inlineLink}>
                Forgot Password?
              </Link>
            </div>
            <div className={styles.passwordWrapper}>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                className={styles.input}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                <iconify-icon icon={showPassword ? "lucide:eye-off" : "lucide:eye"} />
              </button>
            </div>
          </div>

          {error && <p style={{ color: "red", fontSize: "14px", marginBottom: "1rem" }}>{error}</p>}

          <button type="submit" className={styles.primaryButton} disabled={isLoading}>
            {isLoading ? "Logging in..." : "Log in"}
          </button>
        </form>



        <p className={styles.footerText}>
          Don&apos;t have an account?{" "}
          <Link href="/signup" className={styles.footerLink}>
            Sign up
          </Link>
        </p>
      </section>
    </main>
  );
}
