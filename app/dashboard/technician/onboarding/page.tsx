"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import styles from "./onboarding.module.css";

export default function TechnicianOnboardingPage() {
  const router = useRouter();
  const { data: user, loading } = useFetch(() => api.getMe(), []);
  
  const [step, setStep] = useState(1);
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.profile?.bio) {
      setBio(user.profile.bio);
    }
  }, [user]);

  const handleSaveBio = async () => {
    if (!bio.trim()) {
      setError("Please write a short bio.");
      return;
    }
    setError(null);
    setSaving(true);
    try {
      await api.updateMe({
        profile: {
          bio: bio.trim(),
        }
      });
      setStep(2);
    } catch (err: any) {
      setError(err?.message || "Failed to save bio.");
    } finally {
      setSaving(false);
    }
  };

  const finishOnboarding = () => {
    router.replace("/dashboard/technician");
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <p style={{ color: "#64748b" }}>Loading...</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Welcome to Boulot Man! 🎉</h1>
          <p className={styles.subtitle}>Let&apos;s get your profile ready so clients can hire you.</p>
        </div>

        <div className={styles.stepContainer}>
          <div className={styles.stepHeader}>
            <h2 className={styles.stepTitle}>
              {step === 1 ? "Step 1: Write a short bio" : "Step 2: Add your first service"}
            </h2>
            <span className={styles.stepIndicator}>Step {step} of 2</span>
          </div>

          {step === 1 && (
            <div>
              {error && <p className={styles.errorText}>{error}</p>}
              <div className={styles.fieldGroup}>
                <label className={styles.label}>About You</label>
                <textarea
                  className={styles.textarea}
                  placeholder="e.g. I am a professional plumber with 5 years of experience. I take pride in my work and guarantee satisfaction."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>
              <div className={styles.actions}>
                <button type="button" className={styles.primaryButton} onClick={handleSaveBio} disabled={saving}>
                  {saving ? "Saving..." : "Continue"}
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <p style={{ color: "#64748b", lineHeight: 1.6, marginBottom: 24 }}>
                Your profile is almost ready. Next, you need to add the services you offer so clients can find you in search results.
              </p>
              
              <div className={styles.actions} style={{ justifyContent: "space-between" }}>
                <button type="button" className={styles.secondaryButton} onClick={finishOnboarding}>
                  Skip for now
                </button>
                <Link href="/dashboard/technician/services" className={styles.primaryButton} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                  Add a Service
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
