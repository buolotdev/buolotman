"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { api } from "@/app/lib/api";
import { useFetch } from "@/app/lib/useFetch";
import { SkeletonBlock } from "@/app/components/skeleton/Skeleton";
import DashboardHeader from "@/app/components/DashboardHeader";
import LogoutButton from "@/app/components/LogoutButton";
import ImageCropperModal from "@/app/components/ImageCropperModal";
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

export default function ClientSettingsPage() {
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const toast = useToast();

  const { data: me, loading, refetch } = useFetch<Me | null>(() => api.getMe(), []);

  const [cropData, setCropData] = useState<{ src: string; type: 'avatar' | 'banner' } | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [bannerUploading, setBannerUploading] = useState(false);
  const avatarInputRef = React.useRef<HTMLInputElement>(null);
  const bannerInputRef = React.useRef<HTMLInputElement>(null);

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

  // Payment Modal State
  const [paymentsModalOpen, setPaymentsModalOpen] = useState(false);
  const [balance, setBalance] = useState(245.00);
  const [transactions, setTransactions] = useState([
    { date: new Date().toLocaleString(), type: 'Credit', desc: 'Initial Top-up', amount: 245.00 }
  ]);
  const [addAmount, setAddAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      await api.updateMe(form);
      toast.success("Settings saved", "Your account settings have been updated.");
      refetch();
    } catch (err: any) {
      toast.error("Save failed", err?.message || "Please try again.");
    } finally {
      setSavingSettings(false);
    }
  };

  const handleAddMoney = () => {
    const amt = parseFloat(addAmount);
    if (isNaN(amt) || amt < 10) {
      toast.error("Error", "Minimum top-up amount is $10");
      return;
    }
    setBalance(prev => prev + amt);
    setTransactions(prev => [{
      date: new Date().toLocaleString(), type: 'Credit', desc: 'Wallet Top-up', amount: amt
    }, ...prev]);
    setAddAmount("");
    toast.success("Success", "Wallet credited successfully.");
  };

  const handleWithdrawMoney = () => {
    const amt = parseFloat(withdrawAmount);
    if (isNaN(amt) || amt <= 0) {
      toast.error("Error", "Enter a valid amount");
      return;
    }
    if (amt > balance) {
      toast.error("Error", "Insufficient balance");
      return;
    }
    setBalance(prev => prev - amt);
    setTransactions(prev => [{
      date: new Date().toLocaleString(), type: 'Debit', desc: 'Wallet Withdrawal', amount: amt
    }, ...prev]);
    setWithdrawAmount("");
    toast.success("Success", "Withdrawal successful.");
  };

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'banner') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setCropData({ src: reader.result as string, type });
    };
    reader.readAsDataURL(file);
    if (type === 'avatar' && avatarInputRef.current) avatarInputRef.current.value = "";
    if (type === 'banner' && bannerInputRef.current) bannerInputRef.current.value = "";
  };

  const handleCropComplete = async (croppedFile: File) => {
    if (!cropData) return;
    const type = cropData.type;
    setCropData(null); 
    if (type === 'avatar') {
      setAvatarUploading(true);
      try {
        await api.uploadAvatar(croppedFile);
        toast.success("Avatar updated", "Your profile photo has been updated.");
        refetch();
      } catch (err: any) {
        toast.error("Upload failed", err?.message || "Please try again.");
      } finally {
        setAvatarUploading(false);
      }
    } else if (type === 'banner') {
      setBannerUploading(true);
      try {
        await api.uploadBanner(croppedFile);
        toast.success("Banner updated", "Your profile banner has been updated.");
        refetch();
      } catch (err: any) {
        toast.error("Upload failed", err?.message || "Please try again.");
      } finally {
        setBannerUploading(false);
      }
    }
  };

  const userName = `${me?.first_name || ""} ${me?.last_name || ""}`.trim() || me?.username || "Client";
  const initials = `${(me?.first_name || "")[0] || ""}${(me?.last_name || "")[0] || ""}`.toUpperCase() || "C";

  return (
    <main className={styles.page}>
      <div className={styles.layoutWrapper}>
        <aside className={`${styles.sidebar} ${mobileNavOpen ? styles.sidebarOpen : ""}`}>
          <div className={styles.sidebarHeader}>
            <Link href="/" className={styles.brand}>
              <Image src="/boulotman-logo.png" alt="Boulot Man" width={54} height={54} className={styles.brandImage} priority />
              <div className={styles.brandText}>
                <span className={styles.brandEyebrow}>Boulot Man</span>
                <span className={styles.brandTitle}>Client Space</span>
              </div>
            </Link>
            <button type="button" className={styles.sidebarClose} onClick={() => setMobileNavOpen(false)}>
              <iconify-icon icon="lucide:x" />
            </button>
          </div>

          <nav className={styles.sidebarNav}>
            {navItems.map((item) => {
              const active = item.match(pathname);
              return (
                <Link key={item.key} href={item.href} className={`${styles.navItem} ${active ? styles.navItemActive : ""}`}>
                  <iconify-icon icon={item.icon} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className={styles.sidebarFooter}>
            <LogoutButton className={styles.logoutButton} />
          </div>
        </aside>

        <div className={styles.main}>
          <DashboardHeader onMenuClick={() => setMobileNavOpen(true)} />

          <div className={styles.content}>
            <div className={styles.layout}>
              {/* HERO SECTION */}
              <section className={styles.heroCard}>
                <div 
                  className={styles.cover}
                  onClick={() => bannerInputRef.current?.click()}
                  title="Click to change banner"
                  style={{
                    cursor: "pointer",
                    backgroundImage: me?.banner_url ? `url(${me?.banner_url})` : undefined,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div style={{
                    position: "absolute", inset: 0,
                    background: me?.banner_url ? "linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.35) 100%)" : "transparent",
                    transition: "all 0.3s",
                  }} />
                  <div className={styles.bannerOverlay}>
                    <div className={styles.bannerUploadHint}>
                      {bannerUploading ? <><iconify-icon icon="lucide:loader" className={styles.spinIcon} /> Uploading...</> : <><iconify-icon icon="lucide:camera" /> {me?.banner_url ? "Change Cover" : "Add Cover"}</>}
                    </div>
                  </div>
                  <input ref={bannerInputRef} type="file" accept="image/jpeg,image/png,image/webp" style={{ display: "none" }} onChange={(e) => onFileSelect(e, 'banner')} />
                </div>

                <div className={styles.heroBody}>
                  <div className={styles.identityBlock}>
                    {loading ? (
                      <SkeletonBlock style={{ width: 128, height: 128, borderRadius: "50%" }} />
                    ) : (
                      <div className={styles.avatarLarge} onClick={() => avatarInputRef.current?.click()} title="Click to change photo" style={{ cursor: "pointer" }}>
                        {me?.avatar_url ? (
                          <Image src={me?.avatar_url} alt="Profile photo" fill style={{ objectFit: "cover", borderRadius: "50%" }} />
                        ) : initials}
                        <div style={{
                          position: "absolute", inset: 0, borderRadius: "50%", background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center", opacity: avatarUploading ? 1 : 0, transition: "opacity 0.2s", color: "#fff",
                        }}>
                          {avatarUploading ? "..." : <iconify-icon icon="lucide:camera" style={{ fontSize: '24px' }} />}
                        </div>
                        <input ref={avatarInputRef} type="file" accept="image/jpeg,image/png,image/webp" style={{ display: "none" }} onChange={(e) => onFileSelect(e, 'avatar')} />
                      </div>
                    )}
                    <div className={styles.identityMeta}>
                      <div className={styles.nameRow}>
                        {loading ? <SkeletonBlock style={{ width: 200, height: 28 }} /> : <h1>{userName}</h1>}
                      </div>
                      <p className={styles.lead}>{me?.email || me?.phone || "Client"}</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* SETTINGS CONTENT */}
              <section style={{ display: 'grid', gap: '24px' }}>
                
                {/* Account Settings */}
                <form className={styles.settingsCard} onSubmit={handleSaveSettings}>
                  <h3>Account Settings</h3>
                  <div className={styles.twoCol}>
                    <div className={styles.formGroup}>
                      <label>First Name</label>
                      <input className={styles.formInput} value={form.first_name} onChange={(e) => setForm({...form, first_name: e.target.value})} />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Last Name</label>
                      <input className={styles.formInput} value={form.last_name} onChange={(e) => setForm({...form, last_name: e.target.value})} />
                    </div>
                  </div>

                  <div className={styles.twoCol}>
                    <div className={styles.formGroup}>
                      <label>Email</label>
                      <input type="email" className={styles.formInput} value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Phone</label>
                      <input type="tel" className={styles.formInput} value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Country</label>
                    <input className={styles.formInput} value={form.country} onChange={(e) => setForm({...form, country: e.target.value})} />
                  </div>

                  <h4 style={{ marginTop: '32px', marginBottom: '16px', fontSize: '15px', fontWeight: 600, color: '#334155' }}>Change Password</h4>
                  <div className={styles.formGroup}>
                    <input type="password" placeholder="Current password" className={styles.formInput} />
                  </div>
                  <div className={styles.twoCol}>
                    <div className={styles.formGroup}>
                      <input type="password" placeholder="New password" className={styles.formInput} />
                    </div>
                    <div className={styles.formGroup}>
                      <input type="password" placeholder="Confirm new password" className={styles.formInput} />
                    </div>
                  </div>

                  <button type="submit" className={styles.btnPrimary} disabled={savingSettings}>
                    {savingSettings ? "Saving..." : "Save Changes"}
                  </button>
                </form>

                {/* Payment Preferences */}
                <div className={styles.settingsCard}>
                  <h3>Payment Preferences</h3>
                  <div className={styles.formGroup}>
                    <label>Preferred Payment Method</label>
                    <select className={styles.formSelect}>
                      <option>B-Pay Wallet</option>
                      <option>Mobile Money</option>
                      <option>Credit / Debit Card</option>
                      <option>Bank Account</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button className={styles.btnPrimary}>Save Preference</button>
                    <button className={styles.btnOutline} onClick={() => setPaymentsModalOpen(true)}>Manage Payments</button>
                  </div>
                </div>

                {/* Notifications */}
                <div className={styles.settingsCard}>
                  <h3>Notification Preferences</h3>
                  <div className={styles.toggleRow}>
                    <span className={styles.toggleLabel}>Email notifications</span>
                    <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                  </div>
                  <div className={styles.toggleRow}>
                    <span className={styles.toggleLabel}>SMS notifications</span>
                    <input type="checkbox" style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                  </div>
                  <div className={styles.toggleRow}>
                    <span className={styles.toggleLabel}>In-app notifications</span>
                    <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                  </div>
                </div>

                {/* Security */}
                <div className={styles.settingsCard}>
                  <h3>Security</h3>
                  <div className={styles.toggleRow}>
                    <span className={styles.toggleLabel}>Enable Two-Factor Authentication</span>
                    <input type="checkbox" style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                  </div>
                  <div style={{ marginTop: '20px' }}>
                    <button className={styles.btnOutline}>Logout all devices</button>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className={styles.settingsCard} style={{ border: '1px solid #fee2e2', background: '#fff5f5' }}>
                  <h3 style={{ color: '#ef4444' }}>Danger Zone</h3>
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <button className={styles.btnDanger} style={{ background: '#f87171' }}>Deactivate Account</button>
                    <button className={styles.btnDanger}>Delete Account Permanently</button>
                  </div>
                </div>
              </section>

            </div>
          </div>
        </div>
      </div>

      {cropData && (
        <ImageCropperModal
          imageSrc={cropData.src}
          aspectRatio={cropData.type === 'avatar' ? 1 : 1200 / 300}
          isCircular={cropData.type === 'avatar'}
          onCropComplete={handleCropComplete}
          onCancel={() => setCropData(null)}
        />
      )}

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
                  {transactions.map((t, i) => (
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
