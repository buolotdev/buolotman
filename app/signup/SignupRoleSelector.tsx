"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./signup.module.css";

type RoleOption = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

const roleOptions: RoleOption[] = [
  {
    id: "client",
    title: "Client",
    description: "Hire professionals and post jobs for your tasks",
    icon: "lucide:user",
  },
  {
    id: "technician",
    title: "Technician / Freelancer",
    description: "Find jobs, offer your services, and earn money",
    icon: "lucide:briefcase",
  },
  {
    id: "company",
    title: "Company",
    description: "Create a business account to hire multiple freelancers",
    icon: "lucide:building-2",
  },
];

export default function SignupRoleSelector({ initialRole }: { initialRole: string }) {
  const router = useRouter();

  const [selectedRole, setSelectedRole] = useState(initialRole);

  const selectRole = (role: string) => {
    setSelectedRole(role);
    router.replace(`/signup?role=${role}`, { scroll: false });
  };

  return (
    <main className={styles.page}>
      <div className={styles.backdrop} aria-hidden="true">
        <div className={styles.glowLeft} />
        <div className={styles.glowRight} />
      </div>

      <section className={styles.card} aria-labelledby="signup-title">
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
            <h1 id="signup-title" className={styles.title}>
              Join Boulot Man
            </h1>
            <p className={styles.subtitle}>Select your account type to get started</p>
          </div>
        </div>

        <div className={styles.options} role="radiogroup" aria-label="Choose account type">
          {roleOptions.map((role) => {
            const selected = selectedRole === role.id;

            return (
              <button
                key={role.id}
                type="button"
                role="radio"
                aria-checked={selected}
                className={`${styles.roleCard} ${selected ? styles.roleCardSelected : ""}`}
                onClick={() => selectRole(role.id)}
              >
                <span className={styles.roleIcon} aria-hidden="true">
                  <iconify-icon icon={role.icon} />
                </span>

                <span className={styles.roleContent}>
                  <span className={styles.roleTitle}>{role.title}</span>
                  <span className={styles.roleDescription}>{role.description}</span>
                </span>

                <span className={`${styles.roleRadio} ${selected ? styles.roleRadioSelected : ""}`} aria-hidden="true">
                  {selected ? <iconify-icon icon="lucide:check" /> : null}
                </span>
              </button>
            );
          })}
        </div>

        <div className={styles.actions}>
          <Link href={`/signup/details?role=${selectedRole}`} className={styles.primaryButton}>
            Continue as {roleOptions.find((role) => role.id === selectedRole)?.title}
          </Link>
          <p className={styles.helperText}>
            Your selected role is saved in the URL for the next signup step.
          </p>
        </div>

        <p className={styles.footerText}>
          Already have an account?{" "}
          <Link href="/login" className={styles.footerLink}>
            Log in
          </Link>
        </p>
      </section>
    </main>
  );
}
