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

const parseErrorMsg = (errMessage: string) => {
  try {
    const parsed = JSON.parse(errMessage);
    if (typeof parsed === 'object' && parsed !== null) {
      const values = Object.values(parsed);
      if (values.length > 0 && Array.isArray(values[0])) {
        return values[0][0];
      } else if (values.length > 0 && typeof values[0] === 'string') {
        return values[0];
      }
    }
  } catch(e) {
  }
  return errMessage;
};

const COUNTRIES = [
  "Nigeria",
  "Rwanda",
  "Kenya",
  "Ghana",
  "South Africa",
  "Ivory Coast",
  "Cameroon",
  "Uganda",
];

const translations: Record<string, Record<string, any>> = {
  en: {
    infoTitle: "Boulot Man",
    infoDesc: "Secure platform connecting clients, technicians and companies through escrow, milestones and verified work.",
    infoBadge: "Trusted technical services across home, office and field work",
    networkLive: "Service Network Live",
    nowShowing: "Now showing: engineering, IT, energy, beauty, construction and more.",
    optClientTitle: "Looking for Technicians / Service providers",
    optClientSub: "Client account",
    optCompanyTitle: "I am a company",
    optCompanySub: "Company account",
    optTechTitle: "I am a technician / Freelancer",
    optTechSub: "Technician account",
    or: "or",
    continueGoogle: "Continue with Google",
    haveAccount: "I have an account?",
    btnLogin: "Login",
    btnBack: "← Back",
    labelAccountType: "Account Type",
    labelCountry: "Country",
    selectCountry: "Select Country",
    labelFirstName: "First Name",
    phFirstName: "First name",
    labelMiddleName: "Middle Name",
    phMiddleName: "Middle name (optional)",
    labelLastName: "Last Name",
    phLastName: "Last name",
    labelPhone: "Phone Number",
    phPhone: "e.g. +229 97 00 00 00",
    labelEmail: "Email Address",
    phEmail: "your@email.com",
    labelVerifyEmail: "Verify Email Address",
    phVerifyEmail: "Re-enter your email",
    labelCity: "City / Town",
    phCity: "e.g. Cotonou, Porto-Novo, Lomé",
    labelRegion: "Region / State",
    phRegion: "e.g. Littoral, Atlantique, Maritime",
    labelCompanyName: "Company Name",
    phCompanyName: "e.g. Apex Engineering SARL",
    labelPassword: "Password",
    phPassword: "Create a password (min. 8 characters)",
    labelConfirmPassword: "Confirm Password",
    phConfirmPassword: "Confirm your password",
    labelTerms: "I accept and agree to the",
    termsOfService: "Terms of Service",
    and: "and",
    privacyPolicy: "Privacy Policy",
    errEmailMismatch: "Email addresses do not match. Please verify your email.",
    errPasswordMismatch: "Passwords do not match. Please verify and try again.",
    errTermsRequired: "Please accept the Terms and Conditions to continue.",
    btnCreatingAccount: "Creating Account...",
    btnCreateAccount: "Create Account",
    alreadyRegistered: "Already registered?",
    forgotPassword: "Forgot password?",
    phLoginPassword: "Your password",
    btnLoggingIn: "Logging in...",
    btnSubmitLogin: "Log in",
    noAccount: "Don't have an account?",
    btnSignUp: "Sign up",
    backToLogin: "← Back to Login",
    enterEmail: "Enter your email",
    btnSending: "Sending...",
    btnSendReset: "Send reset link",
    backLoginPlain: "Back to login"
  },
  fr: {
    infoTitle: "Boulot Man",
    infoDesc: "Plateforme sécurisée reliant clients, techniciens et entreprises via séquestre, jalons et prestations vérifiées.",
    infoBadge: "Services techniques fiables pour maison, entreprise et chantiers",
    networkLive: "Réseau de Services en Direct",
    nowShowing: "Actuellement : ingénierie, informatique, énergie, beauté, BTP et plus.",
    optClientTitle: "Je recherche un technicien / prestataire",
    optClientSub: "Compte Client",
    optCompanyTitle: "Je suis une entreprise / société",
    optCompanySub: "Compte Entreprise",
    optTechTitle: "Je suis un technicien / indépendant",
    optTechSub: "Compte Prestataire",
    or: "ou",
    continueGoogle: "Continuer avec Google",
    haveAccount: "Vous avez déjà un compte ?",
    btnLogin: "Se connecter",
    btnBack: "← Retour",
    labelAccountType: "Type de compte",
    labelCountry: "Pays",
    selectCountry: "Sélectionnez le pays",
    labelFirstName: "Prénom",
    phFirstName: "Votre prénom",
    labelMiddleName: "Deuxième prénom",
    phMiddleName: "Deuxième prénom (optionnel)",
    labelLastName: "Nom de famille",
    phLastName: "Votre nom",
    labelPhone: "Numéro de téléphone",
    phPhone: "ex. +229 97 00 00 00",
    labelEmail: "Adresse e-mail",
    phEmail: "votre@email.com",
    labelVerifyEmail: "Confirmer l'adresse e-mail",
    phVerifyEmail: "Retapez votre adresse e-mail",
    labelCity: "Ville / Commune",
    phCity: "ex. Cotonou, Porto-Novo, Lomé",
    labelRegion: "Région / Département",
    phRegion: "ex. Littoral, Atlantique",
    labelCompanyName: "Nom de l'entreprise",
    phCompanyName: "ex. Apex Engineering SARL",
    labelPassword: "Mot de passe",
    phPassword: "Créer un mot de passe (8 car. min.)",
    labelConfirmPassword: "Confirmer le mot de passe",
    phConfirmPassword: "Confirmez votre mot de passe",
    labelTerms: "J'accepte et j'approuve les",
    termsOfService: "Conditions Générales d'Utilisation",
    and: "et la",
    privacyPolicy: "Politique de Confidentialité",
    errEmailMismatch: "Les adresses e-mail ne correspondent pas.",
    errPasswordMismatch: "Les mots de passe ne correspondent pas.",
    errTermsRequired: "Veuillez accepter les Conditions Générales pour continuer.",
    btnCreatingAccount: "Création du compte...",
    btnCreateAccount: "Créer un compte",
    alreadyRegistered: "Déjà inscrit ?",
    forgotPassword: "Mot de passe oublié ?",
    phLoginPassword: "Votre mot de passe",
    btnLoggingIn: "Connexion en cours...",
    btnSubmitLogin: "Se connecter",
    noAccount: "Vous n'avez pas de compte ?",
    btnSignUp: "S'inscrire",
    backToLogin: "← Retour à la connexion",
    enterEmail: "Entrez votre adresse e-mail",
    btnSending: "Envoi en cours...",
    btnSendReset: "Envoyer le lien de réinitialisation",
    backLoginPlain: "Retour à la connexion"
  }
};

export default function LoginPage({ initialStep }: { initialStep?: Step }) {
  const router = useRouter();
  const pathname = usePathname();
  const [lang, setLang] = useState("en");

  useEffect(() => {
    const updateLang = () => {
      setLang(localStorage.getItem("lang") || "en");
    };
    updateLang();
    window.addEventListener("languageChange", updateLang);
    return () => window.removeEventListener("languageChange", updateLang);
  }, []);

  const t = translations[lang] || translations["en"];

  const [step, setStep] = useState<Step>(initialStep || (pathname?.startsWith("/signup") ? "account" : "login"));
  const [selectedRole, setSelectedRole] = useState("");
  const [nextPath, setNextPath] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [signupFirstName, setSignupFirstName] = useState("");
  const [signupMiddleName, setSignupMiddleName] = useState("");
  const [signupLastName, setSignupLastName] = useState("");
  const [signupCompanyName, setSignupCompanyName] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupVerifyEmail, setSignupVerifyEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [signupCity, setSignupCity] = useState("");
  const [signupRegion, setSignupRegion] = useState("");
  const [signupCountry, setSignupCountry] = useState("");
  const [signupTermsAccepted, setSignupTermsAccepted] = useState(false);

  const [resetEmail, setResetEmail] = useState("");

  const handleGoogleAuth = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setError(null);
      setIsLoading(true);
      try {
        const data = await api.googleLogin(tokenResponse.access_token, selectedRole || 'Client');
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
        setError(parseErrorMsg(err instanceof Error ? err.message : "Google login failed."));
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => setError("Google login failed."),
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
      setError(parseErrorMsg(err instanceof Error ? err.message : "Invalid credentials. Please try again."));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Email verification check
    if (signupEmail.trim().toLowerCase() !== signupVerifyEmail.trim().toLowerCase()) {
      setError(t.errEmailMismatch || "Email addresses do not match. Please verify your email.");
      return;
    }

    // Password validation
    if (!signupPassword) {
      setError("Please enter a password.");
      return;
    }
    if (signupPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (signupPassword !== signupConfirmPassword) {
      setError(t.errPasswordMismatch || "Passwords do not match. Please verify and try again.");
      return;
    }

    // Terms validation
    if (!signupTermsAccepted) {
      setError(t.errTermsRequired || "Please accept the Terms and Conditions to continue.");
      return;
    }

    // Role-specific validation
    if (selectedRole === "Technician") {
      if (!signupFirstName.trim()) {
        setError("Please enter your first name.");
        return;
      }
      if (!signupLastName.trim()) {
        setError("Please enter your last name.");
        return;
      }
      if (!signupPhone.trim()) {
        setError("Please enter your phone number.");
        return;
      }
      if (!signupCity.trim()) {
        setError("Please enter your city/town.");
        return;
      }
      if (!signupRegion.trim()) {
        setError("Please enter your region/state.");
        return;
      }
      if (!signupCountry) {
        setError("Please select your country.");
        return;
      }
    } else if (selectedRole === "Company") {
      if (!signupCompanyName.trim()) {
        setError("Please enter your company name.");
        return;
      }
      if (!signupPhone.trim()) {
        setError("Please enter your phone number.");
        return;
      }
      if (!signupCountry) {
        setError("Please select your country.");
        return;
      }
    } else {
      if (!signupFirstName.trim()) {
        setError("Please enter your first name.");
        return;
      }
      if (!signupLastName.trim()) {
        setError("Please enter your last name.");
        return;
      }
    }

    setIsLoading(true);
    try {
      const fullFirstName = signupMiddleName.trim()
        ? `${signupFirstName.trim()} ${signupMiddleName.trim()}`.trim()
        : signupFirstName.trim();

      const payload: any = {
        email: signupEmail.trim().toLowerCase(),
        password: signupPassword,
        first_name: selectedRole === "Company" ? signupCompanyName.trim() : (fullFirstName || signupFirstName.trim()),
        last_name: selectedRole === "Company" ? "" : signupLastName.trim(),
        phone: signupPhone.trim(),
        country: signupCountry,
        city: signupCity.trim(),
        region: signupRegion.trim(),
        address: `${signupCity.trim()}${signupRegion.trim() ? `, ${signupRegion.trim()}` : ""}`.trim(),
      };

      if (selectedRole === "Company") {
        payload.company_name = signupCompanyName.trim();
      }

      try {
        if (selectedRole === "Client") {
          await api.registerClient(payload);
        } else if (selectedRole === "Technician") {
          await api.registerTechnician(payload);
        } else if (selectedRole === "Company") {
          await api.registerCompany(payload);
        }
      } catch (regErr: any) {
        const errMsg = String(regErr?.message || regErr?.detail || "");
        if (
          errMsg.toLowerCase().includes("already exists") ||
          errMsg.toLowerCase().includes("already registered") ||
          errMsg.toLowerCase().includes("user with this") ||
          errMsg.toLowerCase().includes("duplicate")
        ) {
          try {
            const loginData = await api.login(signupEmail.trim().toLowerCase(), signupPassword);
            const role: string = (loginData.role || selectedRole || "client").toLowerCase();
            localStorage.setItem("access_token", loginData.access);
            localStorage.setItem("refresh_token", loginData.refresh);
            localStorage.setItem("user_role", role);
            if (role === "admin") router.push("/dashboard/admin");
            else if (role === "company") router.push("/dashboard/company");
            else if (role === "technician") router.push("/dashboard/technician");
            else router.push("/dashboard/client");
            return;
          } catch {
            throw new Error("This email is already registered. Please log in or use another email address.");
          }
        }
        throw regErr;
      }

      const loginData = await api.login(signupEmail.trim().toLowerCase(), signupPassword);
      const role: string = (loginData.role || selectedRole || "client").toLowerCase();
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
      setError(parseErrorMsg(err instanceof Error ? err.message : "Failed to create account. Please try again."));
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

        <div className={styles.info}>
          <h1 className={styles.infoTitle}>{t.infoTitle}</h1>
          <p className={styles.infoDesc}>
            {t.infoDesc}
          </p>
          <div className={styles.infoBadge}>
            <span className={styles.dot} />
            <span>{t.infoBadge}</span>
          </div>

          <div className={styles.serviceShowcase}>
            <div className={styles.videoTopbar}>
              <div className={styles.videoDots}>
                <span /><span /><span />
              </div>
              <div className={styles.videoLabel}>{t.networkLive}</div>
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
              <span>{t.nowShowing}</span>
            </div>
          </div>
        </div>

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

          <div className={`${styles.step} ${step === "account" ? styles.active : ""}`}>
            <div className={styles.option} onClick={() => selectType("Client")}>
              <span className={styles.optionTitle}>{t.optClientTitle}</span>
              <span className={styles.optionSub}>{t.optClientSub}</span>
            </div>
            <div className={styles.option} onClick={() => selectType("Company")}>
              <span className={styles.optionTitle}>{t.optCompanyTitle}</span>
              <span className={styles.optionSub}>{t.optCompanySub}</span>
            </div>
            <div className={styles.option} onClick={() => selectType("Technician")}>
              <span className={styles.optionTitle}>{t.optTechTitle}</span>
              <span className={styles.optionSub}>{t.optTechSub}</span>
            </div>

            <div className={styles.divider} style={{ margin: '1rem 0' }}>{t.or}</div>
            
            <button className={styles.socialBtn} type="button" onClick={() => handleGoogleAuth()} disabled={isLoading}>
              <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.48h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.859-3.048.859-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"/></svg>
              {t.continueGoogle}
            </button>

            <div className={styles.link} style={{ marginTop: '1rem' }}>
              {t.haveAccount}{" "}
              <span onClick={() => { setError(null); setStep("login"); router.push("/login"); }} className={styles.linkAction} style={{cursor: "pointer"}}>{t.btnLogin}</span>
            </div>
          </div>

          <div className={`${styles.step} ${step === "signup" ? styles.active : ""}`}>
            <button className={styles.backBtn} onClick={() => { setError(null); setStep("account"); }}>{t.btnBack}</button>

            <button className={styles.socialBtn} type="button" onClick={() => handleGoogleAuth()} disabled={isLoading}>
              <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.48h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.859-3.048.859-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"/></svg>
              {t.continueGoogle}
            </button>

            <div className={styles.divider}>{t.or}</div>

            <form onSubmit={handleSignup}>
              <label className={styles.fieldLabel}>{t.labelAccountType}</label>
              <input className={styles.input} value={selectedRole} readOnly />

              {selectedRole === "Company" ? (
                <>
                  <label className={styles.fieldLabel}>{t.labelCompanyName}</label>
                  <input
                    className={styles.input}
                    value={signupCompanyName}
                    onChange={e => setSignupCompanyName(e.target.value)}
                    placeholder={t.phCompanyName}
                    required
                  />
                  <div className={styles.formGrid2}>
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>{t.labelFirstName}</label>
                      <input
                        className={styles.input}
                        value={signupFirstName}
                        onChange={e => setSignupFirstName(e.target.value)}
                        placeholder={t.phFirstName}
                        required
                      />
                    </div>
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>{t.labelLastName}</label>
                      <input
                        className={styles.input}
                        value={signupLastName}
                        onChange={e => setSignupLastName(e.target.value)}
                        placeholder={t.phLastName}
                        required
                      />
                    </div>
                  </div>
                </>
              ) : selectedRole === "Technician" ? (
                /* ── EXACT TECHNICIAN SIGN UP ── */
                <div className={styles.formGrid3}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>{t.labelFirstName}</label>
                    <input
                      className={styles.input}
                      value={signupFirstName}
                      onChange={e => setSignupFirstName(e.target.value)}
                      placeholder={t.phFirstName}
                      required
                    />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>{t.labelMiddleName}</label>
                    <input
                      className={styles.input}
                      value={signupMiddleName}
                      onChange={e => setSignupMiddleName(e.target.value)}
                      placeholder={t.phMiddleName}
                    />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>{t.labelLastName}</label>
                    <input
                      className={styles.input}
                      value={signupLastName}
                      onChange={e => setSignupLastName(e.target.value)}
                      placeholder={t.phLastName}
                      required
                    />
                  </div>
                </div>
              ) : (
                <div className={styles.formGrid2}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>{t.labelFirstName}</label>
                    <input
                      className={styles.input}
                      value={signupFirstName}
                      onChange={e => setSignupFirstName(e.target.value)}
                      placeholder={t.phFirstName}
                      required
                    />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>{t.labelLastName}</label>
                    <input
                      className={styles.input}
                      value={signupLastName}
                      onChange={e => setSignupLastName(e.target.value)}
                      placeholder={t.phLastName}
                      required
                    />
                  </div>
                </div>
              )}

              {/* Phone & Country */}
              <div className={styles.formGrid2}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>{t.labelPhone}</label>
                  <input
                    className={styles.input}
                    type="tel"
                    value={signupPhone}
                    onChange={e => setSignupPhone(e.target.value)}
                    placeholder={t.phPhone}
                    required
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>{t.labelCountry}</label>
                  <select
                    className={styles.select}
                    value={signupCountry}
                    onChange={e => setSignupCountry(e.target.value)}
                    required
                  >
                    <option value="">{t.selectCountry}</option>
                    {COUNTRIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* City / Town & Region / State */}
              <div className={styles.formGrid2}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>{t.labelCity}</label>
                  <input
                    className={styles.input}
                    value={signupCity}
                    onChange={e => setSignupCity(e.target.value)}
                    placeholder={t.phCity}
                    required
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>{t.labelRegion}</label>
                  <input
                    className={styles.input}
                    value={signupRegion}
                    onChange={e => setSignupRegion(e.target.value)}
                    placeholder={t.phRegion}
                    required={selectedRole === "Technician"}
                  />
                </div>
              </div>

              {/* Email & Verify Email */}
              <div className={styles.formGrid2}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>{t.labelEmail}</label>
                  <input
                    className={styles.input}
                    type="email"
                    value={signupEmail}
                    onChange={e => setSignupEmail(e.target.value)}
                    placeholder={t.phEmail}
                    autoComplete="email"
                    required
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>{t.labelVerifyEmail}</label>
                  <input
                    className={styles.input}
                    type="email"
                    value={signupVerifyEmail}
                    onChange={e => setSignupVerifyEmail(e.target.value)}
                    placeholder={t.phVerifyEmail}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              {/* Password & Confirm Password */}
              <div className={styles.formGrid2}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>{t.labelPassword}</label>
                  <div className={styles.passwordWrapper}>
                    <input
                      className={styles.input}
                      type={showPassword ? "text" : "password"}
                      value={signupPassword}
                      onChange={e => setSignupPassword(e.target.value)}
                      placeholder={t.phPassword}
                      autoComplete="new-password"
                      required
                    />
                    <button
                      type="button"
                      className={styles.eyeBtn}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <iconify-icon icon={showPassword ? "lucide:eye-off" : "lucide:eye"} />
                    </button>
                  </div>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>{t.labelConfirmPassword}</label>
                  <div className={styles.passwordWrapper}>
                    <input
                      className={styles.input}
                      type={showConfirmPassword ? "text" : "password"}
                      value={signupConfirmPassword}
                      onChange={e => setSignupConfirmPassword(e.target.value)}
                      placeholder={t.phConfirmPassword}
                      autoComplete="new-password"
                      required
                    />
                    <button
                      type="button"
                      className={styles.eyeBtn}
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      <iconify-icon icon={showConfirmPassword ? "lucide:eye-off" : "lucide:eye"} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Accept Terms & Conditions */}
              <label className={styles.termsRow}>
                <input
                  type="checkbox"
                  className={styles.termsCheckbox}
                  checked={signupTermsAccepted}
                  onChange={e => setSignupTermsAccepted(e.target.checked)}
                  required
                />
                <span className={styles.termsLabel}>
                  {t.labelTerms}{" "}
                  <Link href="/terms" target="_blank" className={styles.linkAction}>
                    {t.termsOfService}
                  </Link>{" "}
                  {t.and}{" "}
                  <Link href="/privacy" target="_blank" className={styles.linkAction}>
                    {t.privacyPolicy}
                  </Link>
                </span>
              </label>

              {error && <div className={styles.errorMsg}>{error}</div>}
              <button type="submit" className={styles.primaryBtn} disabled={isLoading}>
                {isLoading ? t.btnCreatingAccount : t.btnCreateAccount}
              </button>
            </form>

            <div className={styles.link}>
              {t.alreadyRegistered}{" "}
              <Link href="/login" className={styles.linkAction} onClick={() => setError(null)}>{t.btnLogin}</Link>
            </div>
          </div>

          <div className={`${styles.step} ${step === "login" ? styles.active : ""}`}>
            <button className={styles.socialBtn} type="button" onClick={() => handleGoogleAuth()} disabled={isLoading}>
              <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.48h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.859-3.048.859-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"/></svg>
              {t.continueGoogle}
            </button>

            <div className={styles.divider}>{t.or}</div>

            <form onSubmit={handleLogin}>
              <label className={styles.fieldLabel}>{t.labelEmail}</label>
              <input className={styles.input} type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} placeholder="your@email.com" autoComplete="email" required />

              <div className={styles.labelRow}>
                <label className={styles.fieldLabel}>{t.labelPassword}</label>
                <button type="button" className={styles.linkAction} style={{ fontSize: '0.76rem' }} onClick={() => { setError(null); setStep("forgot"); }}>
                  {t.forgotPassword}
                </button>
              </div>
              <div className={styles.passwordWrapper}>
                <input className={styles.input} type={showPassword ? "text" : "password"} value={loginPassword} onChange={e => setLoginPassword(e.target.value)} placeholder={t.phLoginPassword} autoComplete="current-password" required />
                <button type="button" className={styles.eyeBtn} onClick={() => setShowPassword(!showPassword)}>
                  <iconify-icon icon={showPassword ? "lucide:eye-off" : "lucide:eye"} />
                </button>
              </div>

              {error && <div className={styles.errorMsg}>{error}</div>}
              <button type="submit" className={styles.primaryBtn} disabled={isLoading}>
                {isLoading ? t.btnLoggingIn : t.btnSubmitLogin}
              </button>
            </form>

            <div className={styles.link}>
              {t.noAccount}{" "}
              <span onClick={() => { setError(null); setStep("account"); router.push("/signup"); }} className={styles.linkAction} style={{cursor: "pointer"}}>{t.btnSignUp}</span>
            </div>
          </div>

          <div className={`${styles.step} ${step === "forgot" ? styles.active : ""}`}>
            <button className={styles.backBtn} onClick={() => { setError(null); setSuccessMsg(null); setStep("login"); }}>{t.backToLogin}</button>

            <form onSubmit={handleForgot}>
              <label className={styles.fieldLabel}>{t.enterEmail}</label>
              <input className={styles.input} type="email" value={resetEmail} onChange={e => setResetEmail(e.target.value)} placeholder="your@email.com" required />

              {error && <div className={styles.errorMsg}>{error}</div>}
              {successMsg && <div className={styles.successMsg}>{successMsg}</div>}

              <button type="submit" className={styles.primaryBtn} disabled={isLoading}>
                {isLoading ? t.btnSending : t.btnSendReset}
              </button>
            </form>

            <div className={styles.link}>
              <button className={styles.linkAction} onClick={() => { setError(null); setSuccessMsg(null); setStep("login"); }}>{t.backLoginPlain}</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
