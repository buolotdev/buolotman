"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../lib/api";
import styles from "./signup-details.module.css";

type RoleKey = "client" | "technician" | "company";

const roleMeta: Record<
  RoleKey,
  { label: string; icon: string }
> = {
  client: { label: "Client", icon: "lucide:user" },
  technician: { label: "Technician / Freelancer", icon: "lucide:briefcase" },
  company: { label: "Company", icon: "lucide:building-2" },
};

export default function SignupDetailsForm({ role }: { role: RoleKey }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    acceptedTerms: true,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedRole = useMemo(() => roleMeta[role], [role]);

  const passwordMismatch =
    formData.confirmPassword.length > 0 &&
    formData.password !== formData.confirmPassword;

  const isValid =
    formData.fullName.trim().length > 1 &&
    formData.email.trim().length > 3 &&
    formData.phone.trim().length > 5 &&
    formData.password.length >= 8 &&
    formData.password === formData.confirmPassword &&
    formData.acceptedTerms;

  const handleChange = (field: keyof typeof formData, value: string | boolean) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isValid || submitting) return;
    setError(null);
    setSubmitting(true);

    try {
      const res = await api.requestPhoneOtp({
        phone: formData.phone,
        email: formData.email,
        purpose: "verification",
      });

      sessionStorage.setItem(
        "signup_data",
        JSON.stringify({
          role,
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          challenge_id: res.challenge_id,
        })
      );

      const params = new URLSearchParams({
        role,
        phone: formData.phone,
        challenge_id: res.challenge_id.toString(),
      });
      router.push(`/signup/verify?${params.toString()}`);
    } catch (err: any) {
      const message = err?.message || err?.detail || "Could not send OTP. Please try again.";
      setError(typeof message === "string" ? message : "Failed to send OTP.");
      setSubmitting(false);
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.backdrop} aria-hidden="true">
        <div className={styles.glowLeft} />
        <div className={styles.glowRight} />
      </div>

      <section className={styles.card} aria-labelledby="signup-details-title">
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
            <h1 id="signup-details-title" className={styles.title}>
              Create your account
            </h1>

            <div className={styles.roleBadge}>
              <span className={styles.roleBadgeIcon} aria-hidden="true">
                <iconify-icon icon={selectedRole.icon} />
              </span>
              <span className={styles.roleBadgeText}>Signing up as:</span>
              <strong>{selectedRole.label}</strong>
              <Link href="/signup" className={styles.roleEdit}>
                Edit
              </Link>
            </div>
          </div>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.fieldGroup}>
            <label htmlFor="fullName" className={styles.label}>
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              className={styles.input}
              placeholder="Alex Johnson"
              value={formData.fullName}
              onChange={(event) => handleChange("fullName", event.target.value)}
              autoComplete="name"
            />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <div className={styles.inputWithIcon}>
              <span className={styles.inputIcon} aria-hidden="true">
                <iconify-icon icon="lucide:mail" />
              </span>
              <input
                id="email"
                type="email"
                className={styles.inputBare}
                placeholder="alex.johnson@example.com"
                value={formData.email}
                onChange={(event) => handleChange("email", event.target.value)}
                autoComplete="email"
              />
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="phone" className={styles.label}>
              Phone Number
            </label>
            <div className={styles.inputWithIcon}>
              <span className={styles.inputIcon} aria-hidden="true">
                <iconify-icon icon="lucide:phone" />
              </span>
              <input
                id="phone"
                type="tel"
                className={styles.inputBare}
                placeholder="+1 (555) 019-2834"
                value={formData.phone}
                onChange={(event) => handleChange("phone", event.target.value)}
                autoComplete="tel"
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.fieldGroup}>
              <label htmlFor="password" className={styles.label}>
                Password
              </label>
              <div className={styles.inputWithIcon}>
                <span className={styles.inputIcon} aria-hidden="true">
                  <iconify-icon icon="lucide:lock" />
                </span>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className={styles.inputBare}
                  placeholder="Minimum 8 characters"
                  value={formData.password}
                  onChange={(event) => handleChange("password", event.target.value)}
                  autoComplete="new-password"
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

            <div className={styles.fieldGroup}>
              <label htmlFor="confirmPassword" className={styles.label}>
                Confirm Password
              </label>
              <div className={styles.inputWithIcon}>
                <span className={styles.inputIcon} aria-hidden="true">
                  <iconify-icon icon="lucide:lock" />
                </span>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  className={styles.inputBare}
                  placeholder="Repeat your password"
                  value={formData.confirmPassword}
                  onChange={(event) => handleChange("confirmPassword", event.target.value)}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  tabIndex={-1}
                >
                  <iconify-icon icon={showConfirmPassword ? "lucide:eye-off" : "lucide:eye"} />
                </button>
              </div>
            </div>
          </div>

          {passwordMismatch ? (
            <p className={styles.errorText}>Passwords do not match.</p>
          ) : null}

          {error ? <p className={styles.errorText}>{error}</p> : null}

          <label className={styles.checkboxRow}>
            <input
              type="checkbox"
              className={styles.checkboxInput}
              checked={formData.acceptedTerms}
              onChange={(event) => handleChange("acceptedTerms", event.target.checked)}
            />
            <span className={styles.checkboxVisual} aria-hidden="true">
              <iconify-icon icon="lucide:check" />
            </span>
            <span className={styles.checkboxLabel}>
              I agree to Boulot Man&apos;s{" "}
              <Link href="/terms" className={styles.inlineLink}>
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className={styles.inlineLink}>
                Privacy Policy
              </Link>
              .
            </span>
          </label>

          <button type="submit" className={styles.primaryButton} disabled={!isValid || submitting}>
            {submitting ? "Sending code..." : "Create Account"}
          </button>

          <p className={styles.footerText}>
            Already have an account?{" "}
            <Link href="/login" className={styles.footerLink}>
              Log in
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}
