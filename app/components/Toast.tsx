"use client";

import { createContext, useCallback, useContext, useState, useEffect } from "react";
import styles from "./Toast.module.css";

type ToastKind = "success" | "error" | "info" | "warning";

type Toast = {
  id: number;
  kind: ToastKind;
  title: string;
  message?: string;
};

type ToastContextValue = {
  show: (kind: ToastKind, title: string, message?: string) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const ICONS: Record<ToastKind, string> = {
  success: "lucide:check-circle-2",
  error: "lucide:x-circle",
  info: "lucide:info",
  warning: "lucide:alert-triangle",
};

let nextId = 1;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback((kind: ToastKind, title: string, message?: string) => {
    const id = nextId++;
    setToasts((prev) => [...prev, { id, kind, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const value: ToastContextValue = {
    show,
    success: (t, m) => show("success", t, m),
    error: (t, m) => show("error", t, m),
    info: (t, m) => show("info", t, m),
    warning: (t, m) => show("warning", t, m),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className={styles.container} role="region" aria-live="polite" aria-label="Notifications">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={() => dismiss(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onDismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onDismiss]);

  const handleDismiss = () => {
    setLeaving(true);
    setTimeout(onDismiss, 200);
  };

  return (
    <div
      className={`${styles.toast} ${styles[toast.kind]} ${leaving ? styles.leaving : ""}`}
      role={toast.kind === "error" || toast.kind === "warning" ? "alert" : "status"}
    >
      <div className={styles.icon}>
        <iconify-icon icon={ICONS[toast.kind]} />
      </div>
      <div className={styles.body}>
        <div className={styles.title}>{toast.title}</div>
        {toast.message && <div className={styles.message}>{toast.message}</div>}
      </div>
      <button type="button" className={styles.close} onClick={handleDismiss} aria-label="Dismiss">
        <iconify-icon icon="lucide:x" />
      </button>
    </div>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
