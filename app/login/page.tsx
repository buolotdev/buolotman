"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "../lib/api";
import styles from "./login.module.css";

const safeNext = (value: string | undefined): string | null => {
  if (!value) return null;
  if (!value.startsWith("/") || value.startsWith("//")) return null;
  return value;
};

type Step = "account" | "signup" | "login" | "forgot" | "reset";

const SERVICES = [
  { icon: "🏗️", label: "Construction", title: "Building Construction", desc: "Skilled teams handling structure, finishing, masonry and supervised site work.", color: "cardConstruction" },
  { icon: "🪚", label: "Woodwork",     title: "Furniture Making",     desc: "Custom wardrobes, tables, cabinets and crafted interior wood solutions.", color: "cardFurniture" },
  { icon: "👩🏾‍🍼", label: "Care Services", title: "Childcare Support",  desc: "Reliable caregivers and home support providers for families.", color: "cardChildcare" },
  { icon: "🚚", label: "Logistics",    title: "Delivery Services",    desc: "Fast pickup, transport and professional delivery support.", color: "cardDelivery" },
  { icon: "⌨️", label: "Office Support", title: "Typing & Admin Tasks", desc: "Typewriting, office assistance, documentation and digital admin support.", color: "cardOffice" },
  { icon: "🧰", label: "Maintenance",  title: "Cleaning & Handyman",  desc: "General repairs, maintenance, cleaning and practical support.", color: "cardCleaning" },
  { icon: "🛠️", label: "Engineering",  title: "Engineering & Technology", desc: "Professional engineers for advanced systems and project support.", color: "cardOffice" },
  { icon: "🌐", label: "IT Network",   title: "IT Infrastructure",    desc: "Structured cabling, connectivity, network setup and infrastructure support.", color: "cardDelivery" },
  { icon: "☀️", label: "Energy",       title: "Renewable Energy",     desc: "Solar support, utility solutions and clean energy services.", color: "cardCleaning" },
  { icon: "❄️", label: "Repairs",      title: "Fridge & AC Repairs",  desc: "Cooling system specialists for air conditioners and refrigeration.", color: "cardDelivery" },
  { icon: "💄", label: "Beauty",       title: "Health & Beauty",      desc: "Beauty professionals offering grooming, treatment and personal care.", color: "cardChildcare" },
  { icon: "📘", label: "Learning",     title: "Education & Tutoring", desc: "Tutors, trainers and educators helping individuals grow.", color: "cardOffice" },
];

// Duplicate for seamless scroll
const ALL_CARDS = [...SERVICES, ...SERVICES];

export default function LoginPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [step, setStep] = useState<Step>(pathname === "/signup" ? "account" : "login");
  const [selectedRole, setSelectedRole] = useState("");
  const [nextPath, setNextPath] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Login form
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Signup form
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupCountry, setSignupCountry] = useState("");

  // Forgot
  const [resetEmail, setResetEmail] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setNextPath(safeNext(params.get("next") ?? undefined));
    // If URL has ?mode=login, go straight to login
    if (params.get("mode") === "login") setStep("login");
  }, []);

  const selectType = (role: string) => {
    setSelectedRole(role);
    setError(null);
    setStep("signup");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const data = await api.login(loginEmail, loginPassword);
      const role: string = data.role ?? "client";
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      localStorage.setItem("user_role", role);
      if (nextPath) {
        router.push(nextPath);
      } else if (role === "admin") {
        router.push("/dashboard/admin");
      } else if (role === "company") {
        router.push("/dashboard/company");
      } else if (role === "technician") {
        router.push("/dashboard/technician");
      } else {
        router.push("/dashboard/client");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const payload = {
        email: signupEmail,
        password: signupPassword,
        first_name: signupName.split(" ")[0] || signupName,
        last_name: signupName.split(" ").slice(1).join(" ") || "",
        country: signupCountry,
      };

      if (selectedRole === "Client") {
        await api.registerClient(payload);
      } else if (selectedRole === "Technician") {
        await api.registerTechnician(payload);
      } else if (selectedRole === "Company") {
        await api.registerCompany(payload);
      }

      // Auto-login after signup
      const loginData = await api.login(signupEmail, signupPassword);
      const role: string = loginData.role ?? "client";
      localStorage.setItem("access_token", loginData.access);
      localStorage.setItem("refresh_token", loginData.refresh);
      localStorage.setItem("user_role", role);
      
      if (role === "admin") {
        router.push("/dashboard/admin");
      } else if (role === "company") {
        router.push("/dashboard/company");
      } else if (role === "technician") {
        router.push("/dashboard/technician");
      } else {
        router.push("/dashboard/client");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setIsLoading(true);
    try {
      await fetch("http://127.0.0.1:8000/api/auth/password/reset/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail }),
      });
      setSuccessMsg("✔ If an account exists, a reset link has been sent to your email.");
    } catch {
      setSuccessMsg("✔ If an account exists, a reset link has been sent to your email.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.wrapper}>

        {/* ===== LEFT PANEL ===== */}
        <div className={styles.info}>
          <h1 className={styles.infoTitle}>Boulot Man</h1>
          <p className={styles.infoDesc}>
            Secure platform connecting clients, technicians and companies
            through escrow, milestones and verified work.
          </p>
          <div className={styles.infoBadge}>
            <span className={styles.dot} />
            <span>Trusted technical services across home, office and field work</span>
          </div>

          {/* Animated service showcase */}
          <div className={styles.serviceShowcase}>
            <div className={styles.videoTopbar}>
              <div className={styles.videoDots}>
                <span /><span /><span />
              </div>
              <div className={styles.videoLabel}>Service Network Live</div>
            </div>

            <div className={styles.videoFrame}>
              <div className={styles.videoTrack}>
                {ALL_CARDS.map((svc, i) => (
                  <div key={i} className={`${styles.serviceCard} ${styles[svc.color as keyof typeof styles]}`}>
                    <div className={styles.serviceIcon}>{svc.icon}</div>
                    <div>
                      <span className={styles.serviceCardLabel}>{svc.label}</span>
                      <h3 className={styles.serviceCardTitle}>{svc.title}</h3>
                      <p className={styles.serviceCardDesc}>{svc.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.videoCaption}>
              <span><strong>Now showing:</strong> engineering, IT, energy, beauty, construction and more.</span>
            </div>
          </div>
        </div>

        {/* ===== RIGHT PANEL ===== */}
        <div className={styles.content}>
          <div className={styles.logo}>
            <Image
              src="/boulotman-logo.png"
              alt="Boulot Man"
              width={160}
              height={44}
              priority
            />
          </div>

          {/* STEP 1: Account Type Selection */}
          <div className={`${styles.step} ${step === "account" ? styles.active : ""}`}>
            <div className={styles.option} onClick={() => selectType("Client")}>
              <span className={styles.optionTitle}>Looking for Technicians / Service providers</span>
              <span className={styles.optionSub}>Client account</span>
            </div>
            <div className={styles.option} onClick={() => selectType("Company")}>
              <span className={styles.optionTitle}>I am a company</span>
              <span className={styles.optionSub}>Company account</span>
            </div>
            <div className={styles.option} onClick={() => selectType("Technician")}>
              <span className={styles.optionTitle}>I am a technician / Freelancer</span>
              <span className={styles.optionSub}>Technician account</span>
            </div>
            <div className={styles.link}>
              I have an account?{" "}
              <button className={styles.linkAction} onClick={() => { setError(null); setStep("login"); }}>Login</button>
            </div>
          </div>

          {/* STEP 2: Sign Up */}
          <div className={`${styles.step} ${step === "signup" ? styles.active : ""}`}>
            <button className={styles.backBtn} onClick={() => { setError(null); setStep("account"); }}>← Back</button>

            <button className={styles.socialBtn} type="button">
              <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.48h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.859-3.048.859-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"/></svg>
              Continue with Google
            </button>

            <div className={styles.divider}>or</div>

            <form onSubmit={handleSignup}>
              <label className={styles.fieldLabel}>Account Type</label>
              <input className={styles.input} value={selectedRole} readOnly />

              <label className={styles.fieldLabel}>Country</label>
              <select className={styles.select} value={signupCountry} onChange={e => setSignupCountry(e.target.value)} required>
                <option value="">Select Country</option>
                <option>Rwanda</option>
                <option>Nigeria</option>
                <option>Kenya</option>
                <option>Ghana</option>
                <option>South Africa</option>
                <option>Uganda</option>
              </select>

              <label className={styles.fieldLabel}>Full Name / Company Name</label>
              <input className={styles.input} value={signupName} onChange={e => setSignupName(e.target.value)} placeholder="Your full name" required />

              <label className={styles.fieldLabel}>Email</label>
              <input className={styles.input} type="email" value={signupEmail} onChange={e => setSignupEmail(e.target.value)} placeholder="your@email.com" required />

              <label className={styles.fieldLabel}>Password</label>
              <div className={styles.passwordWrapper}>
                <input className={styles.input} type={showPassword ? "text" : "password"} value={signupPassword} onChange={e => setSignupPassword(e.target.value)} placeholder="Create a password" required />
                <button type="button" className={styles.eyeBtn} onClick={() => setShowPassword(!showPassword)}>
                  <iconify-icon icon={showPassword ? "lucide:eye-off" : "lucide:eye"} />
                </button>
              </div>

              {error && <div className={styles.errorMsg}>{error}</div>}
              <button type="submit" className={styles.primaryBtn} disabled={isLoading}>
                {isLoading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            <div className={styles.link}>
              Already registered?{" "}
              <button className={styles.linkAction} onClick={() => { setError(null); setStep("login"); }}>Login</button>
            </div>
          </div>

          {/* STEP 3: Login */}
          <div className={`${styles.step} ${step === "login" ? styles.active : ""}`}>
            <button className={styles.socialBtn} type="button">
              <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.48h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.859-3.048.859-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"/></svg>
              Login with Google
            </button>

            <div className={styles.divider}>or</div>

            <form onSubmit={handleLogin}>
              <label className={styles.fieldLabel}>Email</label>
              <input className={styles.input} type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} placeholder="your@email.com" autoComplete="email" required />

              <div className={styles.labelRow}>
                <label className={styles.fieldLabel}>Password</label>
                <button type="button" className={styles.linkAction} style={{ fontSize: '0.76rem' }} onClick={() => { setError(null); setStep("forgot"); }}>
                  Forgot password?
                </button>
              </div>
              <div className={styles.passwordWrapper}>
                <input className={styles.input} type={showPassword ? "text" : "password"} value={loginPassword} onChange={e => setLoginPassword(e.target.value)} placeholder="Your password" autoComplete="current-password" required />
                <button type="button" className={styles.eyeBtn} onClick={() => setShowPassword(!showPassword)}>
                  <iconify-icon icon={showPassword ? "lucide:eye-off" : "lucide:eye"} />
                </button>
              </div>

              {error && <div className={styles.errorMsg}>{error}</div>}
              <button type="submit" className={styles.primaryBtn} disabled={isLoading}>
                {isLoading ? "Logging in..." : "Log in"}
              </button>
            </form>

            <div className={styles.link}>
              Don&apos;t have an account?{" "}
              <Link href="/signup" className={styles.linkAction}>Sign up</Link>
            </div>
          </div>

          {/* STEP 4: Forgot Password */}
          <div className={`${styles.step} ${step === "forgot" ? styles.active : ""}`}>
            <button className={styles.backBtn} onClick={() => { setError(null); setSuccessMsg(null); setStep("login"); }}>← Back to Login</button>

            <form onSubmit={handleForgot}>
              <label className={styles.fieldLabel}>Enter your email</label>
              <input className={styles.input} type="email" value={resetEmail} onChange={e => setResetEmail(e.target.value)} placeholder="your@email.com" required />

              {error && <div className={styles.errorMsg}>{error}</div>}
              {successMsg && <div className={styles.successMsg}>{successMsg}</div>}

              <button type="submit" className={styles.primaryBtn} disabled={isLoading}>
                {isLoading ? "Sending..." : "Send reset link"}
              </button>
            </form>

            <div className={styles.link}>
              <button className={styles.linkAction} onClick={() => { setError(null); setSuccessMsg(null); setStep("login"); }}>Back to login</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
