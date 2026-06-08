"use client";

import { createContext, useCallback, useContext, useState, useEffect } from "react";
import styles from "./Dialog.module.css";

type ConfirmOptions = {
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "danger";
};

type PromptOptions = {
  title: string;
  message?: string;
  defaultValue?: string;
  placeholder?: string;
  inputType?: "text" | "number" | "email" | "tel";
  confirmText?: string;
  cancelText?: string;
};

type DialogContextValue = {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
  prompt: (options: PromptOptions) => Promise<string | null>;
  alert: (options: { title: string; message?: string; variant?: "info" | "success" | "warning" | "error" }) => Promise<void>;
};

const DialogContext = createContext<DialogContextValue | null>(null);

type ConfirmState = ConfirmOptions & { resolve: (v: boolean) => void; kind: "confirm" };
type PromptState = PromptOptions & { resolve: (v: string | null) => void; kind: "prompt" };
type AlertState = { title: string; message?: string; variant?: "info" | "success" | "warning" | "error"; resolve: () => void; kind: "alert" };
type AnyDialog = (ConfirmState | PromptState | AlertState) | null;

export function DialogProvider({ children }: { children: React.ReactNode }) {
  const [dialog, setDialog] = useState<AnyDialog>(null);

  const close = useCallback(() => setDialog(null), []);

  const confirm = useCallback((options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setDialog({ ...options, resolve, kind: "confirm" });
    });
  }, []);

  const prompt = useCallback((options: PromptOptions) => {
    return new Promise<string | null>((resolve) => {
      setDialog({ ...options, resolve, kind: "prompt" });
    });
  }, []);

  const alert = useCallback((options: { title: string; message?: string; variant?: "info" | "success" | "warning" | "error" }) => {
    return new Promise<void>((resolve) => {
      setDialog({ ...options, resolve, kind: "alert" });
    });
  }, []);

  return (
    <DialogContext.Provider value={{ confirm, prompt, alert }}>
      {children}
      {dialog?.kind === "confirm" && <ConfirmModal options={dialog} onClose={close} />}
      {dialog?.kind === "prompt" && <PromptModal options={dialog} onClose={close} />}
      {dialog?.kind === "alert" && <AlertModal options={dialog} onClose={close} />}
    </DialogContext.Provider>
  );
}

function ModalShell({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);
  return (
    <div className={styles.backdrop} onClick={onClose} role="presentation">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        {children}
      </div>
    </div>
  );
}

function ConfirmModal({ options, onClose }: { options: ConfirmState; onClose: () => void }) {
  const isDanger = options.variant === "danger";
  return (
    <ModalShell onClose={() => { options.resolve(false); onClose(); }}>
      <div className={styles.iconWrap} data-variant={isDanger ? "danger" : "primary"}>
        <iconify-icon icon={isDanger ? "lucide:alert-triangle" : "lucide:help-circle"} />
      </div>
      <h2 className={styles.title}>{options.title}</h2>
      {options.message && <p className={styles.message}>{options.message}</p>}
      <div className={styles.actions}>
        <button type="button" className={styles.cancelBtn} onClick={() => { options.resolve(false); onClose(); }}>
          {options.cancelText || "Cancel"}
        </button>
        <button
          type="button"
          className={isDanger ? styles.dangerBtn : styles.confirmBtn}
          onClick={() => { options.resolve(true); onClose(); }}
          autoFocus
        >
          {options.confirmText || "Confirm"}
        </button>
      </div>
    </ModalShell>
  );
}

function PromptModal({ options, onClose }: { options: PromptState; onClose: () => void }) {
  const [value, setValue] = useState(options.defaultValue || "");

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    options.resolve(value);
    onClose();
  };

  return (
    <ModalShell onClose={() => { options.resolve(null); onClose(); }}>
      <div className={styles.iconWrap} data-variant="primary">
        <iconify-icon icon="lucide:edit-3" />
      </div>
      <h2 className={styles.title}>{options.title}</h2>
      {options.message && <p className={styles.message}>{options.message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type={options.inputType || "text"}
          className={styles.input}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={options.placeholder}
          autoFocus
          required
        />
        <div className={styles.actions}>
          <button type="button" className={styles.cancelBtn} onClick={() => { options.resolve(null); onClose(); }}>
            {options.cancelText || "Cancel"}
          </button>
          <button type="submit" className={styles.confirmBtn}>
            {options.confirmText || "OK"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

function AlertModal({ options, onClose }: { options: AlertState; onClose: () => void }) {
  const variant = options.variant || "info";
  const icon = variant === "success" ? "lucide:check-circle-2" : variant === "warning" ? "lucide:alert-triangle" : variant === "error" ? "lucide:x-circle" : "lucide:info";
  return (
    <ModalShell onClose={() => { options.resolve(); onClose(); }}>
      <div className={styles.iconWrap} data-variant={variant}>
        <iconify-icon icon={icon} />
      </div>
      <h2 className={styles.title}>{options.title}</h2>
      {options.message && <p className={styles.message}>{options.message}</p>}
      <div className={styles.actions}>
        <button type="button" className={styles.confirmBtn} onClick={() => { options.resolve(); onClose(); }} autoFocus>
          OK
        </button>
      </div>
    </ModalShell>
  );
}

export function useDialog() {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error("useDialog must be used within DialogProvider");
  return ctx;
}
