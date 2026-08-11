"use client";

import { useState } from "react";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import layoutStyles from "../page.module.css";
import styles from "./settings.module.css";

export default function CompanySettingsPage() {
  const { data: profile, refetch } = useFetch(() => api.getCompanyProfile(), []);
  const [walletModal, setWalletModal] = useState(false);

  if (!profile) return null;

  return (
    <div className={layoutStyles.content}>
      <div className={styles.container}>
        
        {/* BLUE BANNER HEADER */}
        <section className={layoutStyles.welcomeSection} style={{ marginBottom: 30 }}>
          <div className={layoutStyles.welcomeContent}>
            <p className={layoutStyles.eyebrow}>Company dashboard</p>
            <h2 className={layoutStyles.welcomeTitle}>Settings</h2>
            <p className={layoutStyles.welcomeSubtitle}>Manage your account preferences, notifications, and security.</p>
          </div>
        </section>

        <CompanySettingsForm
          key={profile.id ?? "company-settings"}
          profile={profile}
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
  onSave,
  onOpenWallet
}: {
  profile: any;
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
        <h3 className={styles.title} style={{ fontSize: 20, marginBottom: 24 }}>Account Settings</h3>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Company Name</label>
          <input className={styles.input} value={form.company_name} onChange={(e) => update('company_name', e.target.value)} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Registration Number</label>
            <input className={styles.input} value={form.registration_number || ''} onChange={(e) => update('registration_number', e.target.value)} />
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Headquarters</label>
            <input className={styles.input} value={form.headquarters || ''} onChange={(e) => update('headquarters', e.target.value)} />
          </div>
        </div>
      </section>

      {/* BUSINESS PREFERENCES */}
      <section className={styles.card}>
        <h3 className={styles.title} style={{ fontSize: 20, marginBottom: 24 }}>Business Preferences</h3>
        
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Default Response Time</label>
          <select className={styles.select} value={form.response_time || ''} onChange={(e) => update('response_time', e.target.value)}>
            <option value="">Select time</option>
            <option value="Within 24 hours">Within 24 hours</option>
            <option value="Within 48 hours">Within 48 hours</option>
            <option value="Within 72 hours">Within 72 hours</option>
          </select>
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>Preferred Currency</label>
          <select className={styles.select} value={form.currency || 'USD'} onChange={(e) => update('currency', e.target.value)}>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="RWF">RWF (FRw)</option>
          </select>
        </div>

        <label className={styles.toggle}>
          Auto-accept site visits
          <input type="checkbox" checked={!!form.auto_accept_visits} onChange={(e) => update('auto_accept_visits', e.target.checked)} />
        </label>
      </section>

      {/* NOTIFICATION PREFERENCES */}
      <section className={styles.card}>
        <h3 className={styles.title} style={{ fontSize: 20, marginBottom: 24 }}>Notification Preferences</h3>
        <label className={styles.toggle}>
          Email notifications
          <input type="checkbox" checked={!!form.notif_email} onChange={(e) => update('notif_email', e.target.checked)} />
        </label>
        <label className={styles.toggle}>
          SMS notifications
          <input type="checkbox" checked={!!form.notif_sms} onChange={(e) => update('notif_sms', e.target.checked)} />
        </label>
        <label className={styles.toggle}>
          In-app notifications
          <input type="checkbox" checked={!!form.notif_inapp} onChange={(e) => update('notif_inapp', e.target.checked)} />
        </label>
      </section>

      {/* PRIVACY & VISIBILITY */}
      <section className={styles.card}>
        <h3 className={styles.title} style={{ fontSize: 20, marginBottom: 24 }}>Privacy & Visibility</h3>
        <label className={styles.toggle}>
          Public profile visible
          <input type="checkbox" checked={!!form.privacy_public} onChange={(e) => update('privacy_public', e.target.checked)} />
        </label>
        <label className={styles.toggle}>
          Show phone number
          <input type="checkbox" checked={!!form.privacy_show_phone} onChange={(e) => update('privacy_show_phone', e.target.checked)} />
        </label>
        <label className={styles.toggle}>
          Show email address
          <input type="checkbox" checked={!!form.privacy_show_email} onChange={(e) => update('privacy_show_email', e.target.checked)} />
        </label>
        <label className={styles.toggle}>
          Appear in search results
          <input type="checkbox" checked={!!form.privacy_search} onChange={(e) => update('privacy_search', e.target.checked)} />
        </label>
      </section>

      {/* SECURITY */}
      <section className={styles.card}>
        <h3 className={styles.title} style={{ fontSize: 20, marginBottom: 24 }}>Security</h3>
        <label className={styles.toggle}>
          Enable Two-Factor Authentication (2FA)
          <input type="checkbox" checked={!!form.sec_2fa} onChange={(e) => update('sec_2fa', e.target.checked)} />
        </label>
        <button type="button" className={styles.outlineBtn} style={{ marginTop: 12 }}>Logout all devices</button>
      </section>

      {/* PAYMENTS */}
      <section className={styles.card}>
        <h3 className={styles.title} style={{ fontSize: 20, marginBottom: 24 }}>Payments & B-Wallet</h3>
        <div className={styles.balance}>Current Balance: $245.00</div>
        <p className={styles.notice}>All payments and withdrawals are processed via B-Wallet securely.</p>
        <button type="button" className={styles.saveBtn} onClick={onOpenWallet} style={{ width: 'auto', padding: '0 24px' }}>
          Manage Payments
        </button>
      </section>

      {/* DANGER ZONE */}
      <section className={styles.card} style={{ border: '1px solid #fee2e2' }}>
        <h3 className={styles.title} style={{ fontSize: 20, marginBottom: 24, color: '#ef4444' }}>Danger Zone</h3>
        <button type="button" className={styles.dangerBtn}>Deactivate Company Profile</button>
        <button type="button" className={styles.dangerBtn} style={{ background: '#7f1d1d' }}>Delete Account Permanently</button>
      </section>

      {/* SAVE BUTTON FLOATING OR FIXED */}
      <div style={{ position: 'sticky', bottom: 24, zIndex: 10, display: 'flex', gap: 16, alignItems: 'center' }}>
        <button type="button" onClick={submit} disabled={saving} className={styles.saveBtn} style={{ padding: '0 40px', boxShadow: '0 10px 25px rgba(255, 69, 0, 0.4)' }}>
          {saving ? "Saving..." : "Save all changes"}
        </button>
        {saveSuccess && <span style={{ color: '#10b981', fontWeight: 600 }}>✔ Settings updated!</span>}
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
