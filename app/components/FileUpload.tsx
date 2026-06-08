"use client";

import { useRef, useState } from "react";
import styles from "./FileUpload.module.css";

type UploadKind = "avatar" | "portfolio" | "attachment";

interface FileUploadProps {
  kind: UploadKind;
  value?: string;
  taskId?: number;
  onUploaded?: (url: string) => void;
  label?: string;
  accept?: string;
  shape?: "circle" | "rounded" | "square";
  size?: number;
  disabled?: boolean;
}

const KIND_LABELS: Record<UploadKind, string> = {
  avatar: "Upload photo",
  portfolio: "Upload image",
  attachment: "Attach file",
};

export default function FileUpload({
  kind,
  value,
  taskId,
  onUploaded,
  label,
  accept = "image/*",
  shape = "rounded",
  size = 96,
  disabled = false,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | undefined>(value);

  async function handleFile(file: File) {
    setError(null);
    if (file.size > 25 * 1024 * 1024) {
      setError("File too large. Max 25 MB.");
      return;
    }
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      let result: { avatar_url?: string; image_url?: string; file_url?: string } | null = null;
      const { api } = await import("../lib/api");
      if (kind === "avatar") {
        result = await api.uploadAvatar(file);
      } else if (kind === "portfolio") {
        result = await api.uploadPortfolioImage(file);
      } else if (kind === "attachment" && taskId) {
        result = await api.uploadTaskAttachment(taskId, file);
      }
      if (!result) throw new Error("Unknown upload kind");
      const url = result.avatar_url || result.image_url || result.file_url || "";
      if (url) onUploaded?.(url);
    } catch (err: any) {
      setError(err?.message || "Upload failed");
      setPreview(value);
    } finally {
      setUploading(false);
    }
  }

  const shapeClass =
    shape === "circle" ? styles.circle : shape === "square" ? styles.square : styles.rounded;

  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        className={`${styles.thumb} ${shapeClass}`}
        style={{ width: size, height: size }}
        onClick={() => inputRef.current?.click()}
        disabled={disabled || uploading}
        aria-label={label || KIND_LABELS[kind]}
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="" className={styles.thumbImage} />
        ) : (
          <span className={styles.placeholder}>
            <iconify-icon icon="lucide:upload-cloud" style={{ fontSize: 24 }} />
          </span>
        )}
        {uploading ? (
          <span className={styles.overlay}>
            <span className={styles.spinner} />
          </span>
        ) : null}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
      <div className={styles.meta}>
        <span className={styles.label}>{label || KIND_LABELS[kind]}</span>
        {error ? <span className={styles.error}>{error}</span> : null}
      </div>
    </div>
  );
}
