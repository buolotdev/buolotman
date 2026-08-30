"use client";

import { useState, useEffect } from "react";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import layoutStyles from "../page.module.css";
import styles from "./settings.module.css";

const translations: Record<string, Record<string, string>> = {
  en: {
    eyebrow: "Company dashboard",
    welcomeTitle: "Settings",
    welcomeSubtitle: "Manage your account preferences, notifications, and security.",
    accountSettings: "Account Settings",
    companyName: "Company Name",
    registrationNumber: "Registration Number",
    headquarters: "Headquarters",
    businessPreferences: "Business Preferences",
    defaultResponseTime: "Default Response Time",
    selectTime: "Select time",
    within24h: "Within 24 hours",
    within48h: "Within 48 hours",
    within72h: "Within 72 hours",
    preferredCurrency: "Preferred Currency",
    autoAcceptVisits: "Auto-accept site visits",
    notificationPreferences: "Notification Preferences",
    emailNotif: "Email notifications",
    smsNotif: "SMS notifications",
    inappNotif: "In-app notifications",
    privacyVisibility: "Privacy & Visibility",
    publicProfileVisible: "Public profile visible",
    showPhone: "Show phone number",
    showEmail: "Show email address",
    appearInSearch: "Appear in search results",
    security: "Security",
    enable2fa: "Enable Two-Factor Authentication (2FA)",
    logoutAll: "Logout all devices",
    paymentsWallet: "Payments & B-Wallet",
    currentBalance: "Current Balance: 245,000 XOF",
    paymentsNotice: "All payments and withdrawals are processed via B-Wallet securely.",
    managePayments: "Manage Payments",
    dangerZone: "Danger Zone",
    deactivateProfile: "Deactivate Company Profile",
    deleteAccount: "Delete Account Permanently",
    reviewBeforeSave: "Review your settings before saving.",
    saveAllChanges: "Save all changes",
    saving: "Saving...",
    settingsUpdated: "✔ Settings updated!",
  },
  fr: {
    eyebrow: "Espace Entreprise",
    welcomeTitle: "Paramètres",
    welcomeSubtitle: "Gérez les préférences de votre compte, vos notifications et la sécurité.",
    accountSettings: "Paramètres du Compte",
    companyName: "Nom de l'entreprise",
    registrationNumber: "Numéro d'immatriculation",
    headquarters: "Siège social",
    businessPreferences: "Préférences Commerciales",
    defaultResponseTime: "Délai de réponse par défaut",
    selectTime: "Sélectionner un délai",
    within24h: "Moins de 24 heures",
    within48h: "Moins de 48 heures",
    within72h: "Moins de 72 heures",
    preferredCurrency: "Devise préférée",
    autoAcceptVisits: "Accepter automatiquement les visites de chantier",
    notificationPreferences: "Préférences de Notification",
    emailNotif: "Notifications par e-mail",
    smsNotif: "Notifications par SMS",
    inappNotif: "Notifications dans l'application",
    privacyVisibility: "Confidentialité & Visibilité",
    publicProfileVisible: "Profil public visible",
    showPhone: "Afficher le numéro de téléphone",
    showEmail: "Afficher l'adresse e-mail",
    appearInSearch: "Apparaître dans les résultats de recherche",
    security: "Sécurité",
    enable2fa: "Activer l'authentification à deux facteurs (2FA)",
    logoutAll: "Déconnecter tous les appareils",
    paymentsWallet: "Paiements & B-Wallet",
    currentBalance: "Solde Actuel : 245 000 XOF",
    paymentsNotice: "Tous les paiements et retraits sont traités de manière sécurisée via B-Wallet.",
    managePayments: "Gérer les Paiements",
    dangerZone: "Zone Critique",
    deactivateProfile: "Désactiver le Profil Entreprise",
    deleteAccount: "Supprimer Définitivement le Compte",
    reviewBeforeSave: "Vérifiez vos paramètres avant d'enregistrer.",
    saveAllChanges: "Enregistrer les modifications",
    saving: "Enregistrement...",
    settingsUpdated: "✔ Paramètres mis à jour !",
  }
};

export default function CompanySettingsPage() {
  const { data: profile, refetch } = useFetch(() => api.getCompanyProfile(), []);
  const [walletModal, setWalletModal] = useState(false);
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

  if (!profile) return null;

  return (
    <div className={layoutStyles.content}>
      <div className={styles.container}>
        
        {/* BLUE BANNER HEADER */}
        <section className={layoutStyles.welcomeSection} style={{ marginBottom: 30 }}>
          <div className={layoutStyles.welcomeContent}>
            <p className={layoutStyles.eyebrow}>{t.eyebrow}</p>
            <h2 className={layoutStyles.welcomeTitle}>{t.welcomeTitle}</h2>
            <p className={layoutStyles.welcomeSubtitle}>{t.welcomeSubtitle}</p>
          </div>
        </section>

        <CompanySettingsForm
          key={profile.id ?? "company-settings"}
          profile={profile}
          t={t}
          onSave={async (form) => {
            await api.updateCompanyProfile(form);
            refetch();
          }}
          onOpenWallet={() => setWalletModal(true)}
        />
        
        {walletModal && <WalletModal onClose={() => setWalletModal(false)} />}
      </div>
    </div>
  );
}

function CompanySettingsForm({
  profile,
  t,
  onSave,
  onOpenWallet
}: {
  profile: any;
  t: Record<string, string>;
  onSave: (form: any) => Promise<void>;
  onOpenWallet: () => void;
}) {
  const [form, setForm] = useState(profile);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const submit = async () => {
    setSaving(true);
    setSaveSuccess(false);
    try {
      await onSave(form);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const update = (key: string, val: any) => setForm((c: any) => ({ ...c, [key]: val }));

  return (
    <div className={styles.formGrid}>
      
      {/* ACCOUNT SETTINGS */}
      <section className={styles.card}>
        <h3 className={styles.title} style={{ fontSize: 20, marginBottom: 24 }}>{t.accountSettings}</h3>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>{t.companyName}</label>
          <input className={styles.input} value={form.company_name} onChange={(e) => update('company_name', e.target.value)} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>{t.registrationNumber}</label>
            <input className={styles.input} value={form.registration_number || ''} onChange={(e) => update('registration_number', e.target.value)} />
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>{t.headquarters}</label>
            <input className={styles.input} value={form.headquarters || ''} onChange={(e) => update('headquarters', e.target.value)} />
          </div>
        </div>
      </section>

      {/* BUSINESS PREFERENCES */}
      <section className={styles.card}>
        <h3 className={styles.title} style={{ fontSize: 20, marginBottom: 24 }}>{t.businessPreferences}</h3>
        
        <div className={styles.fieldGroup}>
          <label className={styles.label}>{t.defaultResponseTime}</label>
          <select className={styles.select} value={form.response_time || ''} onChange={(e) => update('response_time', e.target.value)}>
            <option value="">{t.selectTime}</option>
            <option value="Within 24 hours">{t.within24h}</option>
            <option value="Within 48 hours">{t.within48h}</option>
            <option value="Within 72 hours">{t.within72h}</option>
          </select>
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>{t.preferredCurrency}</label>
          <select className={styles.select} value={form.currency || 'USD'} onChange={(e) => update('currency', e.target.value)}>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="RWF">RWF (FRw)</option>
            <option value="XOF">XOF (FCFA)</option>
          </select>
        </div>

        <label className={styles.toggle}>
          {t.autoAcceptVisits}
          <input type="checkbox" checked={!!form.auto_accept_visits} onChange={(e) => update('auto_accept_visits', e.target.checked)} />
        </label>
      </section>

      {/* NOTIFICATION PREFERENCES */}
      <section className={styles.card}>
        <h3 className={styles.title} style={{ fontSize: 20, marginBottom: 24 }}>{t.notificationPreferences}</h3>
        <label className={styles.toggle}>
          {t.emailNotif}
          <input type="checkbox" checked={!!form.notif_email} onChange={(e) => update('notif_email', e.target.checked)} />
        </label>
        <label className={styles.toggle}>
          {t.smsNotif}
          <input type="checkbox" checked={!!form.notif_sms} onChange={(e) => update('notif_sms', e.target.checked)} />
        </label>
        <label className={styles.toggle}>
          {t.inappNotif}
          <input type="checkbox" checked={!!form.notif_inapp} onChange={(e) => update('notif_inapp', e.target.checked)} />
        </label>
      </section>

      {/* PRIVACY & VISIBILITY */}
      <section className={styles.card}>
        <h3 className={styles.title} style={{ fontSize: 20, marginBottom: 24 }}>{t.privacyVisibility}</h3>
        <label className={styles.toggle}>
          {t.publicProfileVisible}
          <input type="checkbox" checked={!!form.privacy_public} onChange={(e) => update('privacy_public', e.target.checked)} />
        </label>
        <label className={styles.toggle}>
          {t.showPhone}
          <input type="checkbox" checked={!!form.privacy_show_phone} onChange={(e) => update('privacy_show_phone', e.target.checked)} />
        </label>
        <label className={styles.toggle}>
          {t.showEmail}
          <input type="checkbox" checked={!!form.privacy_show_email} onChange={(e) => update('privacy_show_email', e.target.checked)} />
        </label>
        <label className={styles.toggle}>
          {t.appearInSearch}
          <input type="checkbox" checked={!!form.privacy_search} onChange={(e) => update('privacy_search', e.target.checked)} />
        </label>
      </section>

      {/* SECURITY */}
      <section className={styles.card}>
        <h3 className={styles.title} style={{ fontSize: 20, marginBottom: 24 }}>{t.security}</h3>
        <label className={styles.toggle}>
          {t.enable2fa}
          <input type="checkbox" checked={!!form.sec_2fa} onChange={(e) => update('sec_2fa', e.target.checked)} />
        </label>
        <button type="button" className={styles.outlineBtn} style={{ marginTop: 12 }}>{t.logoutAll}</button>
      </section>

      {/* PAYMENTS */}
      <section className={styles.card}>
        <h3 className={styles.title} style={{ fontSize: 20, marginBottom: 24 }}>{t.paymentsWallet}</h3>
        <div className={styles.balance}>{t.currentBalance}</div>
        <p className={styles.notice}>{t.paymentsNotice}</p>
        <button type="button" className={styles.saveBtn} onClick={onOpenWallet} style={{ width: 'auto', padding: '0 24px' }}>
          {t.managePayments}
        </button>
      </section>

      {/* DANGER ZONE */}
      <section className={styles.card} style={{ border: '1px solid #fee2e2' }}>
        <h3 className={styles.title} style={{ fontSize: 20, marginBottom: 24, color: '#ef4444' }}>{t.dangerZone}</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <button type="button" className={styles.dangerBtn} onClick={() => window.confirm(t.deactivateProfile + "?")}>{t.deactivateProfile}</button>
          <button type="button" className={styles.dangerBtn} style={{ background: "#7f1d1d" }} onClick={() => window.confirm(t.deleteAccount + "?")}>{t.deleteAccount}</button>
        </div>
      </section>

      {/* SAVE BUTTON FLOATING OR FIXED */}
      <div className={styles.saveBar}>
        <div><p style={{margin: 0, fontSize: 14, color: "#64748b"}}>{t.reviewBeforeSave}</p></div>
        <div style={{display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap"}}>
          <button type="button" onClick={submit} disabled={saving} className={styles.saveBtn} style={{ padding: '0 32px', boxShadow: '0 10px 25px rgba(255, 69, 0, 0.4)' }}>
            {saving ? t.saving : t.saveAllChanges}
          </button>
          {saveSuccess && <span style={{ color: '#10b981', fontWeight: 600 }}>{t.settingsUpdated}</span>}
        </div>
      </div>
    </div>
  );
}


// WALLET MODAL COMPONENT (Dummy/Simulation as requested)
function WalletModal({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<'add' | 'withdraw'>('add');
  const [method, setMethod] = useState('');
  const [amount, setAmount] = useState('');
  const [processing, setProcessing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleProcess = () => {
    if (!amount) return;
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setSuccessMsg(tab === 'add' ? `✔ Successfully added $${amount} to wallet!` : `✔ Successfully withdrew $${amount}!`);
      setTimeout(onClose, 2000);
    }, 1500);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeBtn} onClick={onClose}>×</button>
        <h2 className={styles.title} style={{ fontSize: 24, marginBottom: 8 }}>B-Wallet Management</h2>
        <p className={styles.notice}>Minimum top-up / withdrawal amount is $10</p>

        <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
          <button className={tab === 'add' ? styles.saveBtn : styles.outlineBtn} onClick={() => setTab('add')} style={{ height: 40, flex: 1 }}>Add Money</button>
          <button className={tab === 'withdraw' ? styles.saveBtn : styles.outlineBtn} onClick={() => setTab('withdraw')} style={{ height: 40, flex: 1 }}>Withdraw</button>
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>Amount ($)</label>
          <input type="number" className={styles.input} value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" />
        </div>

        <div className={styles.fieldGroup} style={{ marginTop: 16 }}>
          <label className={styles.label}>{tab === 'add' ? 'Payment Method' : 'Withdrawal Method'}</label>
          <select className={styles.select} value={method} onChange={(e) => setMethod(e.target.value)}>
            <option value="">Select method</option>
            {tab === 'add' && <option value="card">Credit / Debit Card</option>}
            <option value="mobile">Mobile Money</option>
            <option value="bank">Bank Transfer</option>
          </select>
        </div>

        {method === 'card' && tab === 'add' && (
          <div style={{ display: 'grid', gap: 16, marginTop: 16 }}>
            <input className={styles.input} placeholder="Cardholder Name" />
            <input className={styles.input} placeholder="Card Number (xxxx xxxx xxxx xxxx)" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <input className={styles.input} placeholder="MM/YY" />
              <input className={styles.input} placeholder="CVV" />
            </div>
          </div>
        )}

        {method === 'mobile' && (
          <div style={{ marginTop: 16 }}>
            <input className={styles.input} placeholder="Mobile Money Number" />
          </div>
        )}

        {method === 'bank' && (
          <div style={{ display: 'grid', gap: 16, marginTop: 16 }}>
            <input className={styles.input} placeholder="Account Holder Name" />
            <input className={styles.input} placeholder="Account Number" />
            <input className={styles.input} placeholder="Bank Name" />
          </div>
        )}

        <div style={{ marginTop: 32 }}>
          {successMsg ? (
            <div style={{ color: '#10b981', fontWeight: 600, padding: 16, background: '#ecfdf5', borderRadius: 8, textAlign: 'center' }}>
              {successMsg}
            </div>
          ) : (
            <button className={styles.saveBtn} onClick={handleProcess} disabled={processing || !amount || !method} style={{ width: '100%', height: 48 }}>
              {processing ? "Processing..." : (tab === 'add' ? "Pay Now" : "Confirm Withdrawal")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}


