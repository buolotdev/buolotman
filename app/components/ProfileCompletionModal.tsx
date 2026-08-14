"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { api } from "@/app/lib/api";
import { useToast } from "@/app/components/Toast";
import styles from "./ProfileCompletionModal.module.css";

interface Props {
  user: any;
  onUpdate?: () => void;
}

export default function ProfileCompletionModal({ user, onUpdate }: Props) {
  const toast = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form State for quick inline editing
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [expertiseLevel, setExpertiseLevel] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    if (user) {
      setPhone(user.phone || "");
      setDob(user.date_of_birth || "");
      setAddress(user.address || "");
      setEducationLevel(user.education_level || "");
      setExpertiseLevel(user.expertise_level || "Intermediate");
      setBio(user.bio || user.about || "");
    }
  }, [user]);

  // Checklist computation with accurate model fields
  const checklist = useMemo(() => {
    if (!user) return [];
    return [
      {
        id: "avatar",
        title: "Profile Photo & Cover Banner",
        desc: "Upload a real headshot and cover image",
        done: !!(user.avatar_url || user.banner_url),
        href: "/dashboard/technician/profile",
      },
      {
        id: "contact",
        title: "Phone & Contact Info",
        desc: "Add your active WhatsApp/Phone number",
        done: !!(user.phone && user.phone.trim().length > 4),
        href: "/dashboard/technician/profile",
      },
      {
        id: "personal",
        title: "Date of Birth & Address",
        desc: "Age and location verification",
        done: !!(user.date_of_birth && user.address),
        href: "/dashboard/technician/profile",
      },
      {
        id: "qualifications",
        title: "Education & Expertise Level",
        desc: "Highlight your trade qualifications",
        done: !!(user.education_level && user.expertise_level),
        href: "/dashboard/technician/profile",
      },
      {
        id: "bio",
        title: "Professional Bio & Summary",
        desc: "Explain your experience and skills to clients",
        done: !!(user.bio && user.bio.trim().length > 15),
        href: "/dashboard/technician/profile",
      },
      {
        id: "docs",
        title: "Verification Documents",
        desc: "Upload ID / Certificate for official vetting",
        done: !!user.is_verified,
        href: "/dashboard/technician/profile",
      },
    ];
  }, [user]);

  const completedCount = checklist.filter((item) => item.done).length;
  const totalCount = checklist.length || 1;
  const percentage = Math.round((completedCount / totalCount) * 100);

  // Trigger modal if profile is incomplete and hasn't been dismissed in this session
  useEffect(() => {
    if (!user) return;
    const isDismissed = typeof window !== "undefined" && sessionStorage.getItem("boulot_profile_prompt_dismissed") === "1";
    if (!isDismissed && percentage < 100) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [user, percentage]);

  const handleDismiss = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("boulot_profile_prompt_dismissed", "1");
    }
    setIsOpen(false);
  };

  const handleQuickSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateProfile({
        phone,
        date_of_birth: dob || null,
        address,
        education_level: educationLevel,
        expertise_level: expertiseLevel,
        bio,
      });
      toast.success("Profile Updated", "Your information was saved successfully.");
      if (onUpdate) onUpdate();
      // Keep modal open or close if 100%
      if (percentage >= 80) {
        handleDismiss();
      }
    } catch (err: any) {
      toast.error("Save Failed", err?.message || "Please verify your information.");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen || percentage === 100) return null;

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && handleDismiss()}>
      <div className={styles.modal} role="dialog" aria-modal="true">
        <header className={styles.header}>
          <button className={styles.closeBtn} onClick={handleDismiss} title="Close">
            <iconify-icon icon="lucide:x" />
          </button>
          <div className={styles.headerTop}>
            <span className={styles.headerBadge}>
              <iconify-icon icon="lucide:sparkles" /> Profile Setup
            </span>
          </div>
          <h2 className={styles.headerTitle}>Complete Your Professional Profile</h2>
          <p className={styles.headerSubtitle}>
            Completed profiles receive up to <strong>4x more client hire requests</strong> and priority placement in search results.
          </p>

          <div className={styles.progressSection}>
            <div className={styles.progressMeta}>
              <span>Profile Strength</span>
              <span className={styles.progressPercentage}>{percentage}% Complete</span>
            </div>
            <div className={styles.track}>
              <div className={styles.fill} style={{ width: `${percentage}%` }} />
            </div>
          </div>
        </header>

        <form onSubmit={handleQuickSave} className={styles.body}>
          <div className={styles.checklist}>
            {checklist.map((item) => (
              <div key={item.id} className={`${styles.checkItem} ${item.done ? styles.checkItemDone : ""}`}>
                <div className={styles.checkItemLeft}>
                  <div className={item.done ? styles.checkIconDone : styles.checkIconPending}>
                    <iconify-icon icon={item.done ? "lucide:check-circle-2" : "lucide:circle-dashed"} />
                  </div>
                  <div className={styles.checkItemText}>
                    <strong>{item.title}</strong>
                    <span>{item.desc}</span>
                  </div>
                </div>
                {!item.done && (
                  <Link href={item.href} onClick={() => setIsOpen(false)} style={{ color: "#ff4500", fontSize: "13px", fontWeight: "700", textDecoration: "none" }}>
                    Update &rarr;
                  </Link>
                )}
              </div>
            ))}
          </div>

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Phone / WhatsApp</label>
              <input
                type="text"
                className={styles.input}
                placeholder="+250 788 123 456"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Date of Birth</label>
              <input
                type="date"
                className={styles.input}
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Expertise Level</label>
              <select
                className={styles.select}
                value={expertiseLevel}
                onChange={(e) => setExpertiseLevel(e.target.value)}
              >
                <option value="Junior">Junior (1-2 yrs)</option>
                <option value="Intermediate">Intermediate (3-5 yrs)</option>
                <option value="Senior">Senior (5-8 yrs)</option>
                <option value="Expert">Expert (8+ yrs)</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Education / Degree</label>
              <input
                type="text"
                className={styles.input}
                placeholder="e.g. Diploma in Electrical Tech"
                value={educationLevel}
                onChange={(e) => setEducationLevel(e.target.value)}
              />
            </div>

            <div className={styles.formGroupFull}>
              <label>Physical Address / City</label>
              <input
                type="text"
                className={styles.input}
                placeholder="Street address, City, Country"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div className={styles.formGroupFull}>
              <label>Bio / About Experience</label>
              <textarea
                className={styles.textarea}
                placeholder="Describe your background, skills, and specialties..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>
          </div>

          <footer className={styles.footer}>
            <button type="button" className={styles.remindBtn} onClick={handleDismiss}>
              Remind Me Later
            </button>
            <div className={styles.actionsRight}>
              <Link href="/dashboard/technician/profile" className={styles.fullProfileLink} onClick={() => setIsOpen(false)}>
                <iconify-icon icon="lucide:external-link" /> Full Profile Page
              </Link>
              <button type="submit" className={styles.saveBtn} disabled={saving}>
                {saving ? (
                  <><iconify-icon icon="lucide:loader" style={{ animation: "spin 1s linear infinite" }} /> Saving...</>
                ) : (
                  <><iconify-icon icon="lucide:check" /> Save & Update</>
                )}
              </button>
            </div>
          </footer>
        </form>
      </div>
    </div>
  );
}
