"use client";

import styles from "./Skeleton.module.css";

export function SkeletonBlock({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <div className={`${styles.skeleton} ${className || ""}`} style={style} />;
}

export function SkeletonText({ lines = 3, width }: { lines?: number; width?: string }) {
  return (
    <div className={styles.textGroup}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={styles.skeleton}
          style={{
            height: 14,
            width: i === lines - 1 ? "60%" : width || "100%",
          }}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={`${styles.card} ${className || ""}`}>
      <div className={styles.cardHeader}>
        <SkeletonBlock style={{ width: 40, height: 40, borderRadius: "50%" }} />
        <div style={{ flex: 1 }}>
          <SkeletonBlock style={{ width: "40%", height: 16, marginBottom: 8 }} />
          <SkeletonBlock style={{ width: "25%", height: 12 }} />
        </div>
      </div>
      <SkeletonText lines={2} />
    </div>
  );
}

export function SkeletonStat() {
  return (
    <div className={styles.stat}>
      <SkeletonBlock style={{ width: "50%", height: 28 }} />
      <SkeletonBlock style={{ width: "70%", height: 12, marginTop: 8 }} />
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className={styles.table}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className={styles.tableRow}>
          <SkeletonBlock style={{ width: 32, height: 32, borderRadius: "50%" }} />
          <SkeletonBlock style={{ width: "30%", height: 14 }} />
          <SkeletonBlock style={{ width: "20%", height: 14 }} />
          <SkeletonBlock style={{ width: "15%", height: 24, borderRadius: 12 }} />
        </div>
      ))}
    </div>
  );
}
