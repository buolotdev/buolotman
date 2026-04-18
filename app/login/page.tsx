"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./login.module.css";

const demoRoles = [
  {
    id: "client",
    label: "Client",
    helper: "Opens the client dashboard",
    href: "/dashboard/client",
    icon: "lucide:user",
  },
  {
    id: "technician",
    label: "Technician",
    helper: "Opens the technician dashboard",
    href: "/dashboard/technician",
    icon: "lucide:briefcase",
  },
  {
    id: "company",
    label: "Company",
    helper: "Opens the company dashboard",
    href: "/dashboard/company",
    icon: "lucide:building-2",
  },
  {
    id: "admin",
    label: "Admin",
    helper: "Opens the admin portal",
    href: "/dashboard/admin",
    icon: "lucide:shield-check",
  },
] as const;

export default function LoginPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<(typeof demoRoles)[number]["id"]>("client");

  const activeDemo = demoRoles.find((role) => role.id === selectedRole) ?? demoRoles[0];

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push(activeDemo.href);
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
              type="email"
              className={styles.input}
              placeholder="Enter your email"
              autoComplete="email"
            />
          </div>

          <div className={styles.fieldGroup}>
            <div className={styles.labelRow}>
              <label htmlFor="password" className={styles.label}>
                Password
              </label>
              <Link href="#" className={styles.inlineLink}>
                Forgot Password?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              className={styles.input}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className={styles.primaryButton}>
            Log in as {activeDemo.label}
          </button>
        </form>

        <div className={styles.demoBlock}>
          <div className={styles.demoHeader}>
            <h2 className={styles.demoTitle}>Demo login as a role</h2>
            <p className={styles.demoSubtitle}>Use one of the available account types to jump into a working screen.</p>
          </div>

          <div className={styles.demoRoles} role="list" aria-label="Demo roles">
            {demoRoles.map((role) => {
              const selected = role.id === selectedRole;

              return (
                <button
                  key={role.id}
                  type="button"
                  className={`${styles.demoRoleCard} ${selected ? styles.demoRoleCardActive : ""}`}
                  onClick={() => setSelectedRole(role.id)}
                >
                  <span className={styles.demoRoleIcon} aria-hidden="true">
                    <iconify-icon icon={role.icon} />
                  </span>
                  <span className={styles.demoRoleCopy}>
                    <strong>{role.label}</strong>
                    <small>{role.helper}</small>
                  </span>
                </button>
              );
            })}
          </div>

          <Link href={activeDemo.href} className={styles.demoActionLink}>
            Continue as demo {activeDemo.label}
          </Link>
        </div>

        <div className={styles.divider} aria-hidden="true">
          <span>or</span>
        </div>

        <div className={styles.socials}>
          <button type="button" className={styles.googleButton}>
            <Image
              src="/google-logo.svg"
              alt=""
              width={20}
              height={20}
              className={styles.googleIcon}
            />
            <span>Continue with Google</span>
          </button>
        </div>

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
