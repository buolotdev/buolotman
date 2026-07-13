"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { api } from "../../lib/api";
import styles from "./verify.module.css";

type RoleKey = "client" | "technician" | "company";

const roleDestinations: Record<RoleKey, string> = {
  client: "/dashboard/client",
  technician: "/dashboard/technician",
  company: "/dashboard/company",
};

function splitFullName(fullName: string): { first_name: string; last_name: string } {
  const trimmed = fullName.trim();
  if (!trimmed) return { first_name: "", last_name: "" };
  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) return { first_name: parts[0], last_name: "" };
  return { first_name: parts[0], last_name: parts.slice(1).join(" ") };
}

const OTP_LENGTH = 6;
const INITIAL_TIMER = 165;

function formatTimer(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export default function OtpVerification({
  phone,
  role,
}: {
  phone: string;
  role: string;
}) {
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [timer, setTimer] = useState(INITIAL_TIMER);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    try {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user_role");
    } catch {}
  }, []);

  useEffect(() => {
    if (timer <= 0) return;

    const interval = window.setInterval(() => {
      setTimer((current) => {
        if (current <= 1) {
          window.clearInterval(interval);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [timer]);

  const canVerify = otp.every((digit) => digit.length === 1);

  const backHref = useMemo(() => {
    const params = new URLSearchParams();
    if (role) params.set("role", role);
    if (phone) params.set("phone", phone);
    return `/signup/details?${params.toString()}`;
  }, [phone, role]);

  const handleChange = (index: number, value: string) => {
    const sanitized = value.replace(/\D/g, "").slice(-1);

    setOtp((current) => {
      const next = [...current];
      next[index] = sanitized;
      return next;
    });

    if (sanitized && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
    event.preventDefault();
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);

    if (!pasted) return;

    const next = Array(OTP_LENGTH)
      .fill("")
      .map((_, index) => pasted[index] ?? "");

    setOtp(next);
    const focusIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleResend = async () => {
    if (timer > 0) return;

    setError(null);
    setOtp(Array(OTP_LENGTH).fill(""));
    setTimer(INITIAL_TIMER);
    inputRefs.current[0]?.focus();

    try {
      const raw = sessionStorage.getItem("signup_data");
      if (raw) {
        const data = JSON.parse(raw);
        const res = await api.requestPhoneOtp({
          phone: data.phone,
          email: data.email,
          purpose: "verification",
        });
        
        // Update challenge id
        sessionStorage.setItem("signup_data", JSON.stringify({
          ...data,
          challenge_id: res.challenge_id,
        }));
      }
    } catch (err) {
      setError("Failed to resend code. Please try again.");
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canVerify || submitting) return;
    setError(null);
    setSubmitting(true);

    try {
      const raw = sessionStorage.getItem("signup_data");
      if (!raw) {
        setError("Your signup details expired. Please start again.");
        setSubmitting(false);
        return;
      }
      const data = JSON.parse(raw) as {
        role: string;
        fullName: string;
        email: string;
        phone: string;
        password: string;
        challenge_id: number;
      };

      try {
        // BYPASS OTP VERIFICATION FOR NOW
        // await api.verifyPhoneOtp({
        //   challenge_id: data.challenge_id,
        //   code: otp.join(""),
        // });
      } catch (err: any) {
        throw new Error("Invalid verification code. Please try again.");
      }

      const { first_name, last_name } = splitFullName(data.fullName);
      const payload: Record<string, string> = {
        first_name,
        last_name,
        email: data.email,
        password: data.password,
        phone: data.phone,
      };
      if (data.role === "company") {
        payload.company_name = data.fullName.trim() || data.email;
      }

      // BYPASS REGISTRATION FOR NOW
      // let registerResult: { message: string };
      // if (data.role === "technician") {
      //   registerResult = await api.registerTechnician(payload);
      // } else if (data.role === "company") {
      //   registerResult = await api.registerCompany(payload);
      // } else {
      //   registerResult = await api.registerClient(payload);
      // }

      // BYPASS LOGIN FOR NOW
      // const tokens = await api.login(data.email, data.password);
      if (typeof window !== "undefined") {
        localStorage.setItem("access_token", "dummy_access_token");
        localStorage.setItem("refresh_token", "dummy_refresh_token");
        localStorage.setItem("user_role", data.role);
      }

      try {
        sessionStorage.removeItem("signup_data");
      } catch {}

      router.push(roleDestinations[data.role as RoleKey] ?? "/dashboard/client");
    } catch (err: any) {
      const message =
        err?.message ||
        err?.detail ||
        "We could not create your account. Please try again.";
      setError(typeof message === "string" ? message : "Signup failed. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.backdrop} aria-hidden="true">
        <div className={styles.glowLeft} />
        <div className={styles.glowRight} />
      </div>

      <section className={styles.card} aria-labelledby="verify-title">
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
            <h1 id="verify-title" className={styles.title}>
              Verify your phone number
            </h1>
            <p className={styles.subtitle}>
              We&apos;ve sent a 6-digit verification code to{" "}
              <span className={styles.phoneHighlight}>{phone}</span>
            </p>
          </div>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.otpWrapper} onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(node) => {
                  inputRefs.current[index] = node;
                }}
                type="text"
                inputMode="numeric"
                autoComplete={index === 0 ? "one-time-code" : "off"}
                maxLength={1}
                value={digit}
                onChange={(event) => handleChange(index, event.target.value)}
                onKeyDown={(event) => handleKeyDown(index, event)}
                className={`${styles.otpInput} ${digit ? styles.otpInputFilled : ""}`}
                aria-label={`OTP digit ${index + 1}`}
              />
            ))}
          </div>

          <div className={styles.resendSection}>
            <p className={styles.timerText}>Code expires in {formatTimer(timer)}</p>
            <button
              type="button"
              className={`${styles.resendLink} ${timer > 0 ? styles.resendLinkDisabled : ""}`}
              onClick={handleResend}
              disabled={timer > 0}
            >
              Resend Code
            </button>
          </div>

          <div className={styles.actions}>
            <button type="submit" className={styles.primaryButton} disabled={!canVerify || submitting}>
              {submitting ? "Creating account…" : "Verify"}
            </button>

            <Link href={backHref} className={styles.backLink}>
              <iconify-icon icon="lucide:arrow-left" />
              Back to sign up
            </Link>
          </div>

          {error ? <p className={styles.errorText}>{error}</p> : null}
        </form>
      </section>
    </main>
  );
}
