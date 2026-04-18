import Image from "next/image";
import Link from "next/link";
import styles from "./success.module.css";

const roleDestinations: Record<string, { href: string; label: string }> = {
  client: { href: "/dashboard/client", label: "Go to Dashboard" },
  technician: { href: "/dashboard/technician", label: "Open Technician Dashboard" },
  company: { href: "/dashboard/company", label: "Go to Dashboard" },
};

export default function SignupSuccess({ role }: { role: string }) {
  const destination = roleDestinations[role] ?? roleDestinations.technician;

  return (
    <main className={styles.page}>
      <div className={styles.backdrop} aria-hidden="true">
        <div className={styles.glowLeft} />
        <div className={styles.glowRight} />
      </div>

      <section className={styles.card} aria-labelledby="success-title">
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
        </div>

        <div className={styles.illustration} aria-hidden="true">
          <span className={`${styles.confetti} ${styles.confettiOne}`} />
          <span className={`${styles.confetti} ${styles.confettiTwo}`} />
          <span className={`${styles.confetti} ${styles.confettiThree}`} />
          <span className={`${styles.confetti} ${styles.confettiFour}`} />
          <span className={`${styles.spark} ${styles.sparkOne}`} />
          <span className={`${styles.spark} ${styles.sparkTwo}`} />
          <div className={styles.checkOrb}>
            <div className={styles.checkRing}>
              <iconify-icon icon="lucide:check" />
            </div>
          </div>
        </div>

        <div className={styles.textSection}>
          <h1 id="success-title" className={styles.title}>
            Welcome aboard!
          </h1>
          <p className={styles.subtitle}>
            Your account has been created successfully. We&apos;re excited to have
            you join our community.
          </p>
        </div>

        <div className={styles.actions}>
          <Link href={destination.href} className={styles.primaryButton}>
            {destination.label}
            <iconify-icon icon="lucide:arrow-right" />
          </Link>
        </div>
      </section>
    </main>
  );
}
