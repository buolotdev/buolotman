"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "../lib/api";
import styles from "./login.module.css";
import { useGoogleLogin } from "@react-oauth/google";

const safeNext = (value: string | undefined): string | null => {
  if (!value) return null;
  if (!value.startsWith("/") || value.startsWith("//")) return null;
  return value;
};

type Step = "account" | "signup" | "login" | "forgot" | "reset";

const parseErrorMsg = (errMessage: string) => {
  try {
    const parsed = JSON.parse(errMessage);
    if (typeof parsed === "object" && parsed !== null) {
      const values = Object.values(parsed);
      if (values.length > 0 && Array.isArray(values[0])) {
        return values[0][0];
      } else if (values.length > 0 && typeof values[0] === "string") {
        return values[0];
      }
    }
  } catch {
    // not json
  }
  return errMessage;
};

export default function LoginPage({ initialStep }: { initialStep?: Step }) {
  const router = useRouter();
  const pathname = usePathname();
  const [step, setStep] = useState<Step>(
    initialStep || (pathname?.startsWith("/signup") ? "account" : "login")
  );
  const [selectedRole, setSelectedRole] = useState<string>("Client");
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
  const [signupCountry, setSignupCountry] = useState("Rwanda");

  // Forgot
  const [resetEmail, setResetEmail] = useState("");

  const handleGoogleAuth = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setError(null);
      setIsLoading(true);
      try {
        const data = await api.googleLogin(tokenResponse.access_token, selectedRole || "Client");
        const role: string = (data.role || "client").toLowerCase();
        localStorage.setItem("access_token", data.access);
        localStorage.setItem("refresh_token", data.refresh);
        localStorage.setItem("user_role", role);
        if (nextPath && nextPath.startsWith(`/dashboard/${role}`)) {
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
        setError(parseErrorMsg(err instanceof Error ? err.message : "Google authentication failed."));
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => setError("Google login could not be completed."),
  });

  useEffect(() => {
    if (pathname?.startsWith("/signup")) {
      setStep("account");
    } else if (pathname?.startsWith("/login")) {
      setStep("login");
    }
  }, [pathname]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setNextPath(safeNext(params.get("next") ?? undefined));
    if (params.get("mode") === "login") setStep("login");
  }, []);

  const proceedToSignup = (roleToUse?: string) => {
    const role = roleToUse || selectedRole || "Client";
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
      const role: string = (data.role || "client").toLowerCase();
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      localStorage.setItem("user_role", role);
      if (nextPath && nextPath.startsWith(`/dashboard/${role}`)) {
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
      setError(parseErrorMsg(err instanceof Error ? err.message : "Invalid credentials. Please verify your email and password."));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const payload: any = {
        email: signupEmail,
        password: signupPassword,
        first_name: signupName.split(" ")[0] || signupName,
        last_name: signupName.split(" ").slice(1).join(" ") || "",
        country: signupCountry,
      };

      if (selectedRole === "Company") {
        payload.company_name = signupName;
      }

      if (selectedRole === "Client") {
        await api.registerClient(payload);
      } else if (selectedRole === "Technician") {
        await api.registerTechnician(payload);
      } else if (selectedRole === "Company") {
        await api.registerCompany(payload);
      }

      // Auto-login after signup
      const loginData = await api.login(signupEmail, signupPassword);
      const role: string = (loginData.role || "client").toLowerCase();
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
      setError(parseErrorMsg(err instanceof Error ? err.message : "Failed to create account. Please check your inputs."));
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
      await fetch("/api/auth/password/reset/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail }),
      });
      setSuccessMsg("✔ If an account exists with this email, a password reset link has been sent.");
    } catch {
      setSuccessMsg("✔ If an account exists with this email, a password reset link has been sent.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.wrapper}>
        {/* ================= LEFT TRUST & BRAND HERO ================= */}
        <div className={styles.info}>
          <div className={styles.infoTop}>
            <div className={styles.infoBadge}>
              <span className={styles.dot} />
              <span>Africa&apos;s #1 Technical Marketplace</span>
            </div>

            <h1 className={styles.infoTitle}>
              Hire &amp; Work With <span>Complete Confidence</span>
            </h1>
            <p className={styles.infoDesc}>
              Join over 50,000 certified artisans, engineering companies, and satisfied clients protected by milestone escrow and verified trade credentials.
            </p>

            {/* TRUST PILLARS */}
            <div className={styles.trustPillars}>
              <div className={styles.pillarCard}>
                <div className={`${styles.pillarIconWrap} ${styles.pillarIcon1}`}>
                  <iconify-icon icon="lucide:shield-check" />
                </div>
                <div className={styles.pillarContent}>
                  <h4>Milestone Escrow Vault</h4>
                  <p>Funds are secured safely and only released when you inspect &amp; approve the work.</p>
                </div>
              </div>

              <div className={styles.pillarCard}>
                <div className={`${styles.pillarIconWrap} ${styles.pillarIcon2}`}>
                  <iconify-icon icon="lucide:badge-check" />
                </div>
                <div className={styles.pillarContent}>
                  <h4>Multi-Tier Verified Professionals</h4>
                  <p>Government ID authentication, trade licenses, and rigorous skill vetting.</p>
                </div>
              </div>

              <div className={styles.pillarCard}>
                <div className={`${styles.pillarIconWrap} ${styles.pillarIcon3}`}>
                  <iconify-icon icon="lucide:wallet" />
                </div>
                <div className={styles.pillarContent}>
                  <h4>Instant Mobile Money Rails</h4>
                  <p>Seamless automated disbursements via MTN MoMo, Airtel, Orange &amp; Cards.</p>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.infoFooter}>
            <div className={styles.ratingStack}>
              <span className={styles.stars}>★★★★★</span>
              <span className={styles.ratingText}>4.9/5 Client Satisfaction</span>
            </div>
            <span className={styles.marketPill}>🌍 7+ Active African Markets</span>
          </div>
        </div>

        {/* ================= RIGHT AUTHENTICATION PANEL ================= */}
        <div className={styles.content}>
          <div className={styles.topBar}>
            <Link href="/" className={styles.logoWrap}>
              <Image
                src="/boulotman-logo.png"
                alt="Boulot Man"
                width={140}
                height={38}
                priority
              />
            </Link>
            <Link href="/" className={styles.homeBackLink}>
              <iconify-icon icon="lucide:arrow-left" /> Back to Home
            </Link>
          </div>

          {/* ================= STEP 1: ROLE SELECTION ================= */}
          <div className={`${styles.step} ${step === "account" ? styles.active : ""}`}>
            <div className={styles.stepHeader}>
              <h2 className={styles.stepTitle}>Join as a client, company, or technician</h2>
              <p className={styles.stepSubtitle}>
                Select how you would like to use the Boulot Man marketplace
              </p>
            </div>

            <div className={styles.rolesGrid}>
              {/* CLIENT CARD */}
              <div
                className={`${styles.roleCard} ${selectedRole === "Client" ? styles.roleCardSelected : ""}`}
                onClick={() => setSelectedRole("Client")}
              >
                <div className={styles.roleLeft}>
                  <div className={`${styles.roleIconCircle} ${styles.iconClient}`}>
                    <iconify-icon icon="lucide:user-check" />
                  </div>
                  <div className={styles.roleInfo}>
                    <div className={styles.roleHeadingRow}>
                      <span className={styles.roleTitle}>I&apos;m a Client, hiring for a project</span>
                      <span className={`${styles.roleBadge} ${styles.badgeOrange}`}>Popular</span>
                    </div>
                    <p className={styles.roleSub}>Post tasks, hire verified specialists, and protect payments.</p>
                  </div>
                </div>
                <div className={`${styles.roleRadio} ${selectedRole === "Client" ? styles.roleRadioSelected : ""}`}>
                  {selectedRole === "Client" && <div className={styles.radioDot} />}
                </div>
              </div>

              {/* COMPANY CARD */}
              <div
                className={`${styles.roleCard} ${selectedRole === "Company" ? styles.roleCardSelected : ""}`}
                onClick={() => setSelectedRole("Company")}
              >
                <div className={styles.roleLeft}>
                  <div className={`${styles.roleIconCircle} ${styles.iconCompany}`}>
                    <iconify-icon icon="lucide:building-2" />
                  </div>
                  <div className={styles.roleInfo}>
                    <div className={styles.roleHeadingRow}>
                      <span className={styles.roleTitle}>I represent a Company / Enterprise</span>
                      <span className={`${styles.roleBadge} ${styles.badgeNavy}`}>B2B &amp; Facilities</span>
                    </div>
                    <p className={styles.roleSub}>Request B2B quotes, dispatch teams, and manage facilities.</p>
                  </div>
                </div>
                <div className={`${styles.roleRadio} ${selectedRole === "Company" ? styles.roleRadioSelected : ""}`}>
                  {selectedRole === "Company" && <div className={styles.radioDot} />}
                </div>
              </div>

              {/* TECHNICIAN CARD */}
              <div
                className={`${styles.roleCard} ${selectedRole === "Technician" ? styles.roleCardSelected : ""}`}
                onClick={() => setSelectedRole("Technician")}
              >
                <div className={styles.roleLeft}>
                  <div className={`${styles.roleIconCircle} ${styles.iconTechnician}`}>
                    <iconify-icon icon="lucide:wrench" />
                  </div>
                  <div className={styles.roleInfo}>
                    <div className={styles.roleHeadingRow}>
                      <span className={styles.roleTitle}>I&apos;m a Technician / Artisan</span>
                      <span className={`${styles.roleBadge} ${styles.badgeAmber}`}>Earn &amp; Grow</span>
                    </div>
                    <p className={styles.roleSub}>Find high-paying tasks, get verified, and receive mobile payouts.</p>
                  </div>
                </div>
                <div className={`${styles.roleRadio} ${selectedRole === "Technician" ? styles.roleRadioSelected : ""}`}>
                  {selectedRole === "Technician" && <div className={styles.radioDot} />}
                </div>
              </div>
            </div>

            <button
              type="button"
              className={styles.primaryBtn}
              onClick={() => proceedToSignup()}
            >
              {selectedRole === "Client" && "Create Client Account →"}
              {selectedRole === "Company" && "Create Company Account →"}
              {selectedRole === "Technician" && "Apply as a Technician →"}
            </button>

            <div className={styles.divider}>or continue with</div>

            <button
              type="button"
              className={styles.socialBtn}
              onClick={() => handleGoogleAuth()}
              disabled={isLoading}
            >
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.48h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
                <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.859-3.048.859-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
                <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
                <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"/>
              </svg>
              Continue with Google
            </button>

            <div className={styles.bottomSwitch}>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setStep("login");
                  router.push("/login");
                }}
                className={styles.linkAction}
              >
                Log In
              </button>
            </div>
          </div>

          {/* ================= STEP 2: SIGN UP FORM ================= */}
          <div className={`${styles.step} ${step === "signup" ? styles.active : ""}`}>
            <button
              type="button"
              className={styles.backBtn}
              onClick={() => {
                setError(null);
                setStep("account");
              }}
            >
              <iconify-icon icon="lucide:arrow-left" /> Change account type
            </button>

            <div className={styles.roleSelectedNotice}>
              <span>
                Registering as: <strong>{selectedRole}</strong>
              </span>
              <button
                type="button"
                className={styles.changeRoleBtn}
                onClick={() => setStep("account")}
              >
                Switch
              </button>
            </div>

            <button
              type="button"
              className={styles.socialBtn}
              onClick={() => handleGoogleAuth()}
              disabled={isLoading}
            >
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.48h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
                <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.859-3.048.859-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
                <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
                <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"/>
              </svg>
              Sign up with Google
            </button>

            <div className={styles.divider}>or register with email</div>

            <form onSubmit={handleSignup}>
              <div>
                <label className={styles.fieldLabel}>Primary Country</label>
                <select
                  className={styles.select}
                  value={signupCountry}
                  onChange={(e) => setSignupCountry(e.target.value)}
                  required
                >
                  <option value="Rwanda">Rwanda</option>
                  <option value="Nigeria">Nigeria</option>
                  <option value="Kenya">Kenya</option>
                  <option value="Ghana">Ghana</option>
                  <option value="South Africa">South Africa</option>
                  <option value="Ivory Coast">Ivory Coast</option>
                  <option value="Cameroon">Cameroon</option>
                  <option value="Uganda">Uganda</option>
                </select>
              </div>

              <div>
                <label className={styles.fieldLabel}>
                  {selectedRole === "Company" ? "Company / Organization Name *" : "Full Name *"}
                </label>
                <input
                  className={styles.input}
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  placeholder={selectedRole === "Company" ? "e.g. Apex Facilities Ltd" : "e.g. Alex Morgan"}
                  required
                />
              </div>

              <div>
                <label className={styles.fieldLabel}>Work or Personal Email *</label>
                <input
                  className={styles.input}
                  type="email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                />
              </div>

              <div>
                <label className={styles.fieldLabel}>Password *</label>
                <div className={styles.passwordWrapper}>
                  <input
                    className={styles.input}
                    type={showPassword ? "text" : "password"}
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="Create a strong password"
                    required
                  />
                  <button
                    type="button"
                    className={styles.eyeBtn}
                    onClick={() => setShowPassword(!showPassword)}
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    <iconify-icon icon={showPassword ? "lucide:eye-off" : "lucide:eye"} />
                  </button>
                </div>
              </div>

              {error && (
                <div className={styles.errorMsg}>
                  <iconify-icon icon="lucide:alert-circle" /> {error}
                </div>
              )}

              <button type="submit" className={styles.primaryBtn} disabled={isLoading}>
                {isLoading ? "Creating Account..." : `Create ${selectedRole} Account →`}
              </button>

              <p className={styles.termsText}>
                By creating an account, you agree to Boulot Man&apos;s{" "}
                <Link href="/terms">Terms of Service</Link> &amp;{" "}
                <Link href="/privacy">Privacy Policy</Link>.
              </p>
            </form>

            <div className={styles.bottomSwitch}>
              Already registered?{" "}
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setStep("login");
                  router.push("/login");
                }}
                className={styles.linkAction}
              >
                Log In
              </button>
            </div>
          </div>

          {/* ================= STEP 3: LOGIN FORM ================= */}
          <div className={`${styles.step} ${step === "login" ? styles.active : ""}`}>
            <div className={styles.stepHeader}>
              <h2 className={styles.stepTitle}>Welcome back to Boulot Man</h2>
              <p className={styles.stepSubtitle}>Sign in to access your dashboard, tasks, and messages</p>
            </div>

            <button
              type="button"
              className={styles.socialBtn}
              onClick={() => handleGoogleAuth()}
              disabled={isLoading}
            >
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.48h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
                <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.859-3.048.859-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
                <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
                <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"/>
              </svg>
              Sign in with Google
            </button>

            <div className={styles.divider}>or sign in with email</div>

            <form onSubmit={handleLogin}>
              <div>
                <label className={styles.fieldLabel}>Email Address</label>
                <input
                  className={styles.input}
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <div className={styles.labelRow}>
                  <label className={styles.fieldLabel}>Password</label>
                  <span
                    className={styles.forgotLink}
                    onClick={() => {
                      setError(null);
                      setSuccessMsg(null);
                      setStep("forgot");
                    }}
                  >
                    Forgot password?
                  </span>
                </div>
                <div className={styles.passwordWrapper}>
                  <input
                    className={styles.input}
                    type={showPassword ? "text" : "password"}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    className={styles.eyeBtn}
                    onClick={() => setShowPassword(!showPassword)}
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    <iconify-icon icon={showPassword ? "lucide:eye-off" : "lucide:eye"} />
                  </button>
                </div>
              </div>

              {error && (
                <div className={styles.errorMsg}>
                  <iconify-icon icon="lucide:alert-circle" /> {error}
                </div>
              )}

              <button type="submit" className={styles.primaryBtn} disabled={isLoading}>
                {isLoading ? "Signing In..." : "Sign In to Workspace →"}
              </button>
            </form>

            <div className={styles.bottomSwitch}>
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setStep("account");
                  router.push("/signup");
                }}
                className={styles.linkAction}
              >
                Sign Up
              </button>
            </div>
          </div>

          {/* ================= STEP 4: FORGOT PASSWORD ================= */}
          <div className={`${styles.step} ${step === "forgot" ? styles.active : ""}`}>
            <button
              type="button"
              className={styles.backBtn}
              onClick={() => {
                setError(null);
                setSuccessMsg(null);
                setStep("login");
              }}
            >
              <iconify-icon icon="lucide:arrow-left" /> Back to Sign In
            </button>

            <div className={styles.stepHeader}>
              <h2 className={styles.stepTitle}>Reset your password</h2>
              <p className={styles.stepSubtitle}>
                Enter your account email and we will send you instructions to reset your password.
              </p>
            </div>

            <form onSubmit={handleForgot}>
              <div>
                <label className={styles.fieldLabel}>Account Email</label>
                <input
                  className={styles.input}
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                />
              </div>

              {error && (
                <div className={styles.errorMsg}>
                  <iconify-icon icon="lucide:alert-circle" /> {error}
                </div>
              )}
              {successMsg && (
                <div className={styles.successMsg}>
                  <iconify-icon icon="lucide:check-circle-2" /> {successMsg}
                </div>
              )}

              <button type="submit" className={styles.primaryBtn} disabled={isLoading}>
                {isLoading ? "Sending Link..." : "Send Reset Link"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
