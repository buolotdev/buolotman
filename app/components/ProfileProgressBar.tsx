"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import styles from "./ProfileProgressBar.module.css";

type Props = {
  user: any;
};

export default function ProfileProgressBar({ user }: Props) {
  const steps = useMemo(() => {
    if (!user) return [];

    const result = [];
    const profile = user.profile || {};

    // 1. Profile Picture
    const hasAvatar = !!user.avatar;
    result.push({
      id: "avatar",
      title: "Upload Profile Picture",
      desc: "Help clients recognize you",
      isDone: hasAvatar,
      icon: "lucide:camera",
      href: "/dashboard/technician/profile",
    });

    // 2. Phone Number
    const hasPhone = !!profile.phone_number;
    result.push({
      id: "phone",
      title: "Add Phone Number",
      desc: "For quick notifications",
      isDone: hasPhone,
      icon: "lucide:phone",
      href: "/dashboard/technician/profile",
    });

    // 3. Bio / About
    const hasBio = !!profile.bio;
    result.push({
      id: "bio",
      title: "Write a Bio",
      desc: "Tell clients about your experience",
      isDone: hasBio,
      icon: "lucide:pen-tool",
      href: "/dashboard/technician/profile",
    });

    // 4. Identity Verification
    const isVerified = !!profile.is_verified;
    result.push({
      id: "verified",
      title: "Get Verified",
      desc: "Upload ID to build trust",
      isDone: isVerified,
      icon: "lucide:badge-check",
      href: "/dashboard/technician/profile",
    });

    return result;
  }, [user]);

  const completedCount = steps.filter((s) => s.isDone).length;
  const totalCount = steps.length || 1;
  const percentage = Math.round((completedCount / totalCount) * 100);

  // If fully completed, we can either hide it or show a success message.
  // We'll hide it for a cleaner dashboard when done.
  if (!user || percentage === 100) return null;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleBox}>
          <h3>Profile Completion</h3>
          <p>Complete your profile to increase your chances of getting hired.</p>
        </div>
        <div className={styles.score}>{percentage}%</div>
      </div>

      <div className={styles.barTrack}>
        <div className={styles.barFill} style={{ width: `${percentage}%` }} />
      </div>

      <div className={styles.missingList}>
        {steps
          .filter((s) => !s.isDone)
          .map((step) => (
            <Link key={step.id} href={step.href} className={styles.missingItem}>
              <div className={styles.iconWrap}>
                <iconify-icon icon={step.icon} style={{ fontSize: 20 }} />
              </div>
              <div className={styles.itemText}>
                <strong>{step.title}</strong>
                <span>{step.desc}</span>
              </div>
              <iconify-icon icon="lucide:chevron-right" className={styles.chevron} style={{ fontSize: 18 }} />
            </Link>
          ))}
      </div>
    </div>
  );
}
