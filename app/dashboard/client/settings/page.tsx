"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { api, getImageUrl } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import { SkeletonBlock } from "@/app/components/skeleton/Skeleton";
import DashboardHeader from "@/app/components/DashboardHeader";
import ClientSidebar from "@/app/components/ClientSidebar";
import { useToast } from "@/app/components/Toast";
import styles from "./page.module.css";

type Me = {
  id?: number | string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  country?: string;
  email?: string;
  username?: string;
  role?: string;
  banner_url?: string;
  avatar_url?: string;
};

type FormState = {
  first_name: string;
  last_name: string;
  phone: string;
  country: string;
  email?: string;
};

const navItems = [
  { key: "dashboard", label: "Dashboard", icon: "lucide:layout-dashboard", href: "/dashboard/client", match: (p: string) => p === "/dashboard/client" },
  { key: "tasks", label: "My Tasks", icon: "lucide:clipboard-list", href: "/dashboard/client/tasks", match: (p: string) => p.startsWith("/dashboard/client/tasks") },
  { key: "projects", label: "My Projects", icon: "lucide:briefcase", href: "/dashboard/client/projects", match: (p: string) => p.startsWith("/dashboard/client/projects") },
  { key: "messages", label: "Messages", icon: "lucide:message-square", href: "/dashboard/client/messages", match: (p: string) => p.startsWith("/dashboard/client/messages") },
  { key: "payments", label: "Payments", icon: "lucide:credit-card", href: "/dashboard/client/payments", match: (p: string) => p.startsWith("/dashboard/client/payments") },
  { key: "saved", label: "Saved", icon: "lucide:bookmark", href: "/dashboard/client/saved", match: (p: string) => p.startsWith("/dashboard/client/saved") },
  { key: "support", label: "Support Tickets", icon: "lucide:life-buoy", href: "/dashboard/client/support", match: (p: string) => p.startsWith("/dashboard/client/support") },
  { key: "settings", label: "Settings", icon: "lucide:settings", href: "/dashboard/client/settings", match: (p: string) => p.startsWith("/dashboard/client/settings") },
  { key: "explore", label: "Explore Professionals", icon: "lucide:search", href: "/search", match: (p: string) => p.startsWith("/search") },
];

const translations: Record<string, Record<string, string>> = {
  en: {
    editProfilePhoto: "Edit Profile & Photo",
    accountSettings: "Account Settings",
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email",
    phone: "Phone",
    country: "Country",
    changePassword: "Change Password",
    currentPasswordPlaceholder: "Current password",
    newPasswordPlaceholder: "New password",
    confirmPasswordPlaceholder: "Confirm new password",
    saveChanges: "Save Changes",
    saving: "Saving...",
    paymentPrefs: "Payment Preferences",
    preferredMethod: "Preferred Payment Method",
    savePref: "Save Preference",
    managePayments: "Manage Payments",
    notifPrefs: "Notification Preferences",
    emailNotifs: "Email notifications",
    smsNotifs: "SMS notifications",
    inAppNotifs: "In-app notifications",
    saveNotifs: "Save Notifications",
    security: "Security",
    twoFactor: "Enable Two-Factor Authentication",
    logoutAllDevices: "Logout all devices",
    dangerZone: "Danger Zone",
    deactivateAccount: "Deactivate Account",
    deleteAccountPermanently: "Delete Account Permanently",
  },
  fr: {
    editProfilePhoto: "Modifier le Profil & la Photo",
    accountSettings: "Paramètres du Compte",
    firstName: "Prénom",
    lastName: "Nom",
    email: "E-mail",
    phone: "Téléphone",
    country: "Pays",
    changePassword: "Modifier le Mot de Passe",
    currentPasswordPlaceholder: "Mot de passe actuel",
    newPasswordPlaceholder: "Nouveau mot de passe",
    confirmPasswordPlaceholder: "Confirmez le mot de passe",
    saveChanges: "Enregistrer les Modifications",
    saving: "Enregistrement...",
    paymentPrefs: "Préférences de Paiement",
    preferredMethod: "Mode de paiement préféré",
    savePref: "Enregistrer la Préférence",
    managePayments: "Gérer les Paiements",
    notifPrefs: "Préférences de Notification",
    emailNotifs: "Notifications par e-mail",
    smsNotifs: "Notifications par SMS",
    inAppNotifs: "Notifications dans l'application",
    saveNotifs: "Enregistrer les Notifications",
    security: "Sécurité",
    twoFactor: "Activer la double authentification (2FA)",
    logoutAllDevices: "Déconnecter tous les appareils",
    dangerZone: "Zone de Danger",
    deactivateAccount: "Désactiver le Compte",
    deleteAccountPermanently: "Supprimer Définitivement le Compte",
  }
};

export default function ClientSettingsPage() {
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [lang, setLang] = useState("en");
  const toast = useToast();

  useEffect(() => {
    const updateLang = () => {
      setLang(localStorage.getItem("lang") || "en");
    };
    updateLang();
    window.addEventListener("languageChange", updateLang);
    return () => window.removeEventListener("languageChange", updateLang);
  }, []);

  const t = translations[lang] || translations["en"];

  const { data: me, loading, refetch } = useFetch<Me | null>(() => api.getMe(), []);

  // Settings State
  const [form, setForm] = useState<FormState>({
    first_name: "", last_name: "", phone: "", country: "", email: ""
  });
  React.useEffect(() => {
    if (me) {
      setForm({
        first_name: me.first_name || "",
        last_name: me.last_name || "",
        phone: me.phone || "",
        country: me.country || "",
        email: me.email || "",
      });
    }
  }, [me]);

  const [savingSettings, setSavingSettings] = useState(false);
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      await api.updateProfile(form);
      await refetch();
      toast.success(lang === "fr" ? "Paramètres Enregistrés" : "Settings Saved", lang === "fr" ? "Vos coordonnées ont été mises à jour." : "Your profile settings have been updated.");
    } catch(e: any) {
      toast.error(lang === "fr" ? "Erreur" : "Error", e?.message || "Failed to update profile");
    } finally {
      setSavingSettings(false);
    }
  };

  // Password State
  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [savingPassword, setSavingPassword] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordForm.new_password) {
      toast.error("Error", "Please enter a new password");
      return;
    }
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      toast.error(
        lang === "fr" ? "Erreur" : "Error",
        lang === "fr" ? "Les mots de passe ne correspondent pas" : "New passwords do not match"
      );
      return;
    }
    if (passwordForm.new_password.length < 6) {
      toast.error(
        lang === "fr" ? "Erreur" : "Error",
        lang === "fr" ? "Le mot de passe doit contenir au moins 6 caractères" : "Password must be at least 6 characters"
      );
      return;
    }

    setSavingPassword(true);
    try {
      await api.changePassword({
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password,
      });
      toast.success(
        lang === "fr" ? "Succès" : "Success",
        lang === "fr" ? "Mot de passe modifié avec succès" : "Password changed successfully"
      );
      setPasswordForm({ current_password: "", new_password: "", confirm_password: "" });
    } catch (err: any) {
      toast.error(
        lang === "fr" ? "Erreur" : "Error",
        err?.message || "Failed to change password. Please check your current password."
      );
    } finally {
      setSavingPassword(false);
    }
  };

  // Payment Preferences State
  const [paymentMethod, setPaymentMethod] = useState("B-Pay Wallet");
  const [savingPaymentPref, setSavingPaymentPref] = useState(false);

  useEffect(() => {
    const savedMethod = localStorage.getItem("client_preferred_payment_method");
    if (savedMethod) {
      setPaymentMethod(savedMethod);
    }
  }, []);

  const handleSavePaymentPreference = async () => {
    setSavingPaymentPref(true);
    try {
      localStorage.setItem("client_preferred_payment_method", paymentMethod);
      try {
        await api.updateMe({ preferred_payment_method: paymentMethod });
      } catch (_) {}
      toast.success(
        lang === "fr" ? "Préférence Enregistrée" : "Preference Saved",
        lang === "fr"
          ? `Mode de paiement défini sur ${paymentMethod}`
          : `Payment method set to ${paymentMethod}`
      );
    } catch (e: any) {
      toast.error("Error", e?.message || "Failed to save payment preference");
    } finally {
      setSavingPaymentPref(false);
    }
  };

  // Notification Preferences State
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [smsNotifs, setSmsNotifs] = useState(false);
  const [inAppNotifs, setInAppNotifs] = useState(true);
  const [savingNotifs, setSavingNotifs] = useState(false);

  // Security State
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedEmail = localStorage.getItem("client_email_notifs");
      if (savedEmail !== null) setEmailNotifs(savedEmail === "true");

      const savedSms = localStorage.getItem("client_sms_notifs");
      if (savedSms !== null) setSmsNotifs(savedSms === "true");

      const savedInApp = localStorage.getItem("client_inapp_notifs");
      if (savedInApp !== null) setInAppNotifs(savedInApp === "true");

      const saved2FA = localStorage.getItem("client_2fa_enabled");
      if (saved2FA !== null) setTwoFactorEnabled(saved2FA === "true");
    }
  }, []);

  const handleSaveNotifications = async () => {
    setSavingNotifs(true);
    try {
      localStorage.setItem("client_email_notifs", String(emailNotifs));
      localStorage.setItem("client_sms_notifs", String(smsNotifs));
      localStorage.setItem("client_inapp_notifs", String(inAppNotifs));
      try {
        await api.updateMe({
          email_notifications: emailNotifs,
          sms_notifications: smsNotifs,
          inapp_notifications: inAppNotifs,
        });
      } catch (_) {}
      toast.success(
        lang === "fr" ? "Préférences Enregistrées" : "Preferences Saved",
        lang === "fr" ? "Vos préférences de notification ont été sauvegardées." : "Notification preferences saved successfully."
      );
    } catch (err: any) {
      toast.error("Error", err?.message || "Failed to save notification preferences");
    } finally {
      setSavingNotifs(false);
    }
  };

  const handleToggle2FA = (val: boolean) => {
    setTwoFactorEnabled(val);
    localStorage.setItem("client_2fa_enabled", String(val));
    if (val) {
      toast.success(
        lang === "fr" ? "2FA Activé" : "2FA Enabled",
        lang === "fr" ? "La double authentification a été activée." : "Two-factor authentication has been enabled."
      );
    } else {
      toast.info(
        lang === "fr" ? "2FA Désactivé" : "2FA Disabled",
        lang === "fr" ? "La double authentification a été désactivée." : "Two-factor authentication has been disabled."
      );
    }
  };

  // Payments & Balance
  const [paymentsModalOpen, setPaymentsModalOpen] = useState(false);
  const [addAmount, setAddAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const { data: wallet, refetch: refetchWallet } = useFetch(() => api.getWallet(), []);
  const { data: txData, refetch: refetchTrans } = useFetch(() => api.getTransactions(), []);

  const balance = Number((wallet as any)?.available_balance || 0);
  const transactions = Array.isArray(txData) ? txData : [];

  const handleAddMoney = async () => {
    const amt = parseFloat(addAmount);
    if (isNaN(amt) || amt < 10) {
      toast.error(lang === "fr" ? "Montant Invalide" : "Invalid Amount", lang === "fr" ? "Le montant minimum est de 10$" : "Minimum amount is $10");
      return;
    }
    try {
      toast.success("Success", "Add Money requires a payment gateway integration");
      setAddAmount("");
    } catch(e) {
      toast.error("Error", "Payment failed");
    }
  };

  const handleWithdrawMoney = async () => {
    const amt = parseFloat(withdrawAmount);
    if (isNaN(amt) || amt <= 0) {
      toast.error("Error", "Enter a valid amount");
      return;
    }
    if (amt > balance) {
      toast.error("Error", "Insufficient balance");
      return;
    }
    try {
      await api.withdraw({ amount: amt, method: 'Mobile Money' });
      await refetchWallet();
      await refetchTrans();
      setWithdrawAmount("");
      toast.success("Success", "Withdrawal successful.");
    } catch(err) {
      toast.error("Error", "Withdrawal failed");
    }
  };


  const userName = `${me?.first_name || ""} ${me?.last_name || ""}`.trim() || me?.username || "Client";
  const initials = `${(me?.first_name || "")[0] || ""}${(me?.last_name || "")[0] || ""}`.toUpperCase() || "C";

  return (
    <main className={styles.page}>
      <div className={styles.layoutWrapper}>
        <ClientSidebar isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

        <div className={styles.main}>
          <DashboardHeader onMenuClick={() => setMobileNavOpen(true)} />

          <div className={styles.content}>
            <div className={styles.layout}>
              {/* HERO SECTION - Read Only (Edit photo from Profile page) */}
              <section className={styles.heroCard}>
                <div 
                  className={styles.cover}
                  style={{
                    backgroundImage: me?.banner_url ? `url(${getImageUrl(me?.banner_url)})` : undefined,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div style={{
                    position: "absolute", inset: 0,
                    background: me?.banner_url ? "linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.35) 100%)" : "transparent",
                  }} />
                </div>

                <div className={styles.heroBody}>
                  <div className={styles.identityBlock}>
                    {loading ? (
                      <SkeletonBlock style={{ width: 128, height: 128, borderRadius: "50%" }} />
                    ) : (
                      <div className={styles.avatarLarge}>
                        {me?.avatar_url ? (
                          <Image src={getImageUrl(me?.avatar_url)} alt="Profile photo" fill unoptimized style={{ objectFit: "cover", borderRadius: "50%" }} />
                        ) : initials}
                      </div>
                    )}
                    <div className={styles.identityMeta}>
                      <div className={styles.nameRow}>
                        {loading ? <SkeletonBlock style={{ width: 200, height: 28 }} /> : <h1>{userName}</h1>}
                      </div>
                      <p className={styles.lead}>{me?.email || me?.phone || "Client"}</p>
                      <Link href="/dashboard/client/profile" style={{ fontSize: '13px', color: '#0284c7', fontWeight: 600, marginTop: '4px', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
                        <iconify-icon icon="lucide:user" /> {t.editProfilePhoto}
                      </Link>
                    </div>
                  </div>
                </div>
              </section>

              {/* SETTINGS CONTENT */}
              <section style={{ display: 'grid', gap: '24px' }}>
                
                {/* Account Settings */}
                <form className={styles.settingsCard} onSubmit={handleSaveSettings}>
                  <h3>{t.accountSettings}</h3>
                  <div className={styles.twoCol}>
                    <div className={styles.formGroup}>
                      <label>{t.firstName}</label>
                      <input className={styles.formInput} value={form.first_name} onChange={(e) => setForm({...form, first_name: e.target.value})} />
                    </div>
                    <div className={styles.formGroup}>
                      <label>{t.lastName}</label>
                      <input className={styles.formInput} value={form.last_name} onChange={(e) => setForm({...form, last_name: e.target.value})} />
                    </div>
                  </div>

                  <div className={styles.twoCol}>
                    <div className={styles.formGroup}>
                      <label>{t.email}</label>
                      <input type="email" className={styles.formInput} value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} />
                    </div>
                    <div className={styles.formGroup}>
                      <label>{t.phone}</label>
                      <input type="tel" className={styles.formInput} value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label>{t.country}</label>
                    <input className={styles.formInput} value={form.country} onChange={(e) => setForm({...form, country: e.target.value})} />
                  </div>

                  <button type="submit" className={styles.btnPrimary} disabled={savingSettings} style={{ marginTop: '8px' }}>
                    {savingSettings ? t.saving : t.saveChanges}
                  </button>
                </form>

                {/* Change Password */}
                <form className={styles.settingsCard} onSubmit={handlePasswordChange}>
                  <h3>{t.changePassword}</h3>
                  <div className={styles.formGroup}>
                    <label>{t.currentPasswordPlaceholder}</label>
                    <input
                      type="password"
                      placeholder={t.currentPasswordPlaceholder}
                      className={styles.formInput}
                      value={passwordForm.current_password}
                      onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                    />
                  </div>
                  <div className={styles.twoCol}>
                    <div className={styles.formGroup}>
                      <label>{t.newPasswordPlaceholder}</label>
                      <input
                        type="password"
                        placeholder={t.newPasswordPlaceholder}
                        className={styles.formInput}
                        value={passwordForm.new_password}
                        onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>{t.confirmPasswordPlaceholder}</label>
                      <input
                        type="password"
                        placeholder={t.confirmPasswordPlaceholder}
                        className={styles.formInput}
                        value={passwordForm.confirm_password}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })}
                      />
                    </div>
                  </div>

                  <button type="submit" className={styles.btnPrimary} disabled={savingPassword} style={{ marginTop: '8px' }}>
                    {savingPassword ? t.saving : t.saveChanges}
                  </button>
                </form>

                {/* Payment Preferences */}
                <div className={styles.settingsCard}>
                  <h3>{t.paymentPrefs}</h3>
                  <div className={styles.formGroup}>
                    <label>{t.preferredMethod}</label>
                    <select
                      className={styles.formSelect}
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                      <option value="B-Pay Wallet">B-Pay Wallet</option>
                      <option value="Mobile Money">Mobile Money</option>
                      <option value="Credit / Debit Card">Credit / Debit Card</option>
                      <option value="Bank Account">Bank Account</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                    <button
                      type="button"
                      className={styles.btnPrimary}
                      onClick={handleSavePaymentPreference}
                      disabled={savingPaymentPref}
                    >
                      {savingPaymentPref ? (lang === "fr" ? "Enregistrement..." : "Saving...") : t.savePref}
                    </button>
                    <button
                      type="button"
                      className={styles.btnOutline}
                      onClick={() => setPaymentsModalOpen(true)}
                    >
                      {t.managePayments}
                    </button>
                  </div>
                </div>

                {/* Notifications */}
                <div className={styles.settingsCard}>
                  <h3>{t.notifPrefs}</h3>
                  <div className={styles.toggleRow}>
                    <span className={styles.toggleLabel}>{t.emailNotifs}</span>
                    <input
                      type="checkbox"
                      checked={emailNotifs}
                      onChange={(e) => {
                        const val = e.target.checked;
                        setEmailNotifs(val);
                        localStorage.setItem("client_email_notifs", String(val));
                        toast.success(
                          lang === "fr" ? "Préférence Mise à Jour" : "Preference Updated",
                          `Email notifications ${val ? "enabled" : "disabled"}`
                        );
                      }}
                      style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                  </div>
                  <div className={styles.toggleRow}>
                    <span className={styles.toggleLabel}>{t.smsNotifs}</span>
                    <input
                      type="checkbox"
                      checked={smsNotifs}
                      onChange={(e) => {
                        const val = e.target.checked;
                        setSmsNotifs(val);
                        localStorage.setItem("client_sms_notifs", String(val));
                        toast.success(
                          lang === "fr" ? "Préférence Mise à Jour" : "Preference Updated",
                          `SMS notifications ${val ? "enabled" : "disabled"}`
                        );
                      }}
                      style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                  </div>
                  <div className={styles.toggleRow}>
                    <span className={styles.toggleLabel}>{t.inAppNotifs}</span>
                    <input
                      type="checkbox"
                      checked={inAppNotifs}
                      onChange={(e) => {
                        const val = e.target.checked;
                        setInAppNotifs(val);
                        localStorage.setItem("client_inapp_notifs", String(val));
                        toast.success(
                          lang === "fr" ? "Préférence Mise à Jour" : "Preference Updated",
                          `In-app notifications ${val ? "enabled" : "disabled"}`
                        );
                      }}
                      style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                  </div>

                  <div style={{ marginTop: '16px' }}>
                    <button
                      type="button"
                      className={styles.btnPrimary}
                      onClick={() => handleSaveNotifications()}
                      disabled={savingNotifs}
                    >
                      {savingNotifs ? (lang === "fr" ? "Enregistrement..." : "Saving...") : t.saveNotifs}
                    </button>
                  </div>
                </div>

                {/* Security */}
                <div className={styles.settingsCard}>
                  <h3>{t.security}</h3>
                  <div className={styles.toggleRow}>
                    <span className={styles.toggleLabel}>{t.twoFactor}</span>
                    <input
                      type="checkbox"
                      checked={twoFactorEnabled}
                      onChange={(e) => handleToggle2FA(e.target.checked)}
                      style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                  </div>
                  <div style={{ marginTop: '20px' }}>
                    <button className={styles.btnOutline} onClick={() => {
                      if (window.confirm("Are you sure you want to log out of all other devices?")) {
                        toast.success("Security Updated", "You have been logged out of all other active sessions.");
                      }
                    }}>{t.logoutAllDevices}</button>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className={styles.settingsCard} style={{ border: '1px solid #fee2e2', background: '#fff5f5' }}>
                  <h3 style={{ color: '#ef4444' }}>{t.dangerZone}</h3>
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <button className={styles.btnDanger} style={{ background: '#f87171' }} onClick={() => {
                      if (window.confirm("Are you sure you want to deactivate your account? Your profile will be hidden from the public.")) {
                        toast.info("Request Received", "Your account deactivation request has been sent to support.");
                      }
                    }}>{t.deactivateAccount}</button>
                    <button className={styles.btnDanger} onClick={() => {
                      if (window.confirm("WARNING: This action is irreversible. Are you sure you want to permanently delete your account and all associated data?")) {
                        toast.info("Request Received", "Your account deletion request is being processed. Support will contact you shortly.");
                      }
                    }}>{t.deleteAccountPermanently}</button>
                  </div>
                </div>
              </section>

            </div>
          </div>
        </div>
      </div>


      {/* Payments Modal */}
      {paymentsModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <button className={styles.modalClose} onClick={() => setPaymentsModalOpen(false)}>
              <iconify-icon icon="lucide:x" />
            </button>
            
            <h2>B-Pay Wallet Management</h2>
            <p className={styles.notice}>Minimum top-up amount is $10</p>

            <div className={styles.balanceBox}>
              <span className={styles.balanceLabel}>Current Balance</span>
              <span className={styles.balanceValue}>${balance.toFixed(2)}</span>
            </div>

            <h3>Add Money</h3>
            <div className={styles.twoCol}>
              <div className={styles.formGroup}>
                <label>Amount ($)</label>
                <input type="number" className={styles.formInput} value={addAmount} onChange={e => setAddAmount(e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label>Payment Method</label>
                <select className={styles.formSelect}>
                  <option value="">Select method</option>
                  <option value="card">Credit / Debit Card</option>
                  <option value="mobile">Mobile Money</option>
                  <option value="bank">Bank Transfer</option>
                </select>
              </div>
            </div>
            <button className={styles.btnPrimary} onClick={handleAddMoney}>Pay Now</button>

            <div className={styles.divider}></div>

            <h3>Withdraw Funds</h3>
            <div className={styles.formGroup}>
              <label>Amount ($)</label>
              <input type="number" className={styles.formInput} value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)} style={{ maxWidth: '280px' }} />
            </div>
            <button className={styles.btnOutline} onClick={handleWithdrawMoney}>Withdraw</button>

            <div className={styles.divider}></div>

            <h3>Transaction History</h3>
            <div style={{ overflowX: 'auto' }}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Description</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t: any, i: number) => (
                    <tr key={i}>
                      <td>{t.date}</td>
                      <td>{t.type}</td>
                      <td>{t.desc}</td>
                      <td className={t.type === 'Credit' ? styles.credit : styles.debit}>${t.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      )}
    </main>
  );
}
