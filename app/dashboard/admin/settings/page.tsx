"use client";

import React, { useState, useEffect, useRef } from "react";
import { api } from "@/app/lib/api";
import { SkeletonBlock } from "@/app/components/skeleton/Skeleton";
import styles from "./settings.module.css";
import adminStyles from "@/app/dashboard/admin/admin.module.css";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  
  // Profile State
  const [profileLoading, setProfileLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    avatar_url: ""
  });
  
  // Avatar upload
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Password State
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: ""
  });

  // Platform State
  const [platformLoading, setPlatformLoading] = useState(true);
  const [savingPlatform, setSavingPlatform] = useState(false);
  const [platformData, setPlatformData] = useState({
    site_name: "",
    support_email: "",
    commission_rate: ""
  });

  useEffect(() => {
    fetchProfile();
    fetchPlatformSettings();
  }, []);

  const fetchProfile = async () => {
    try {
      setProfileLoading(true);
      const res = await api.getMe();
      setProfileData({
        first_name: res.first_name || "",
        last_name: res.last_name || "",
        email: res.email || "",
        avatar_url: res.avatar_url || ""
      });
    } catch (err) {
      console.error(err);
    } finally {
      setProfileLoading(false);
    }
  };

  const fetchPlatformSettings = async () => {
    try {
      setPlatformLoading(true);
      const res = await api.getPlatformSettings();
      const pData: any = { site_name: "", support_email: "", commission_rate: "" };
      res.forEach((item: any) => {
        if (pData[item.key] !== undefined) {
          pData[item.key] = item.value;
        }
      });
      setPlatformData(pData);
    } catch (err) {
      console.error(err);
    } finally {
      setPlatformLoading(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await api.updateMe({
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        email: profileData.email
      });
      alert("Profile updated successfully!");
    } catch (err) {
      alert("Failed to update profile.");
    } finally {
      setSavingProfile(false);
    }
  };
  
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadingAvatar(true);
      try {
        const res = await api.uploadAvatar(file);
        setProfileData(prev => ({ ...prev, avatar_url: res.public_url || res.url || "" }));
        alert("Avatar updated! Note: You might need to refresh to see it in the header.");
      } catch (err) {
        alert("Failed to upload avatar.");
      } finally {
        setUploadingAvatar(false);
      }
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.new_password !== passwordData.confirm_password) {
      alert("New passwords do not match!");
      return;
    }
    
    setSavingPassword(true);
    try {
      await api.changePassword({
        current_password: passwordData.current_password,
        new_password: passwordData.new_password
      });
      alert("Password changed successfully!");
      setPasswordData({ current_password: "", new_password: "", confirm_password: "" });
    } catch (err: any) {
      alert("Failed to change password: " + (err.message || "Invalid current password."));
    } finally {
      setSavingPassword(false);
    }
  };

  const handlePlatformSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPlatform(true);
    try {
      const data = Object.keys(platformData).map(k => ({
        key: k,
        value: (platformData as any)[k]
      }));
      await api.updatePlatformSettings(data);
      alert("Platform settings updated successfully!");
    } catch (err) {
      alert("Failed to update platform settings.");
    } finally {
      setSavingPlatform(false);
    }
  };

  return (
    <div className={adminStyles.dashboardBody} style={{ padding: "0 24px 24px" }}>
      <div className={styles.pageHeader}>
        <h1>Platform Settings</h1>
        <p>Manage your personal profile and global website settings.</p>
      </div>

      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeTab === "profile" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("profile")}
        >
          My Profile
        </button>
        <button 
          className={`${styles.tab} ${activeTab === "platform" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("platform")}
        >
          Global Settings
        </button>
      </div>

      {activeTab === "profile" && (
        <div className={styles.card}>
          {profileLoading ? (
            <div>
              <SkeletonBlock style={{ height: 100, width: 100, borderRadius: "50%", marginBottom: 32 }} />
              <SkeletonBlock style={{ height: 40, marginBottom: 16, borderRadius: 8 }} />
              <SkeletonBlock style={{ height: 40, marginBottom: 16, borderRadius: 8 }} />
              <SkeletonBlock style={{ height: 40, borderRadius: 8 }} />
            </div>
          ) : (
            <>
              <div className={styles.avatarSection}>
                <div 
                  className={styles.avatarWrapper}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {profileData.avatar_url ? (
                    <img src={profileData.avatar_url} alt="Avatar" className={styles.avatarImg} />
                  ) : (
                    <span style={{ fontSize: "2rem", color: "#64748b" }}>
                      {(profileData.first_name[0] || "A").toUpperCase()}
                    </span>
                  )}
                  <div className={styles.avatarOverlay}>
                    {uploadingAvatar ? <span style={{fontSize: "0.8rem"}}>Uploading...</span> : <iconify-icon icon="lucide:camera" />}
                  </div>
                </div>
                <div className={styles.avatarInfo}>
                  <h4>Profile Picture</h4>
                  <p>Click the image to upload a new avatar.</p>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  style={{ display: "none" }} 
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </div>

              <h3>Personal Details</h3>
              <form onSubmit={handleProfileSubmit}>
                <div className={styles.formGroup}>
                  <label>First Name</label>
                  <input 
                    type="text" 
                    className={styles.input} 
                    value={profileData.first_name}
                    onChange={(e) => setProfileData({...profileData, first_name: e.target.value})}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Last Name</label>
                  <input 
                    type="text" 
                    className={styles.input} 
                    value={profileData.last_name}
                    onChange={(e) => setProfileData({...profileData, last_name: e.target.value})}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    className={styles.input} 
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    required
                  />
                </div>
                <button type="submit" className={styles.submitBtn} disabled={savingProfile}>
                  {savingProfile ? "Saving..." : "Save Profile"}
                </button>
              </form>

              <div className={styles.passwordSection}>
                <h3>Change Password</h3>
                <form onSubmit={handlePasswordSubmit}>
                  <div className={styles.formGroup}>
                    <label>Current Password</label>
                    <input 
                      type="password" 
                      className={styles.input} 
                      value={passwordData.current_password}
                      onChange={(e) => setPasswordData({...passwordData, current_password: e.target.value})}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>New Password</label>
                    <input 
                      type="password" 
                      className={styles.input} 
                      value={passwordData.new_password}
                      onChange={(e) => setPasswordData({...passwordData, new_password: e.target.value})}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Confirm New Password</label>
                    <input 
                      type="password" 
                      className={styles.input} 
                      value={passwordData.confirm_password}
                      onChange={(e) => setPasswordData({...passwordData, confirm_password: e.target.value})}
                      required
                    />
                  </div>
                  <button type="submit" className={styles.submitBtn} disabled={savingPassword}>
                    {savingPassword ? "Updating..." : "Change Password"}
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      )}

      {activeTab === "platform" && (
        <div className={styles.card}>
          <h3>Website Configuration</h3>
          {platformLoading ? (
            <div>
              <SkeletonBlock style={{ height: 40, marginBottom: 16, borderRadius: 8 }} />
              <SkeletonBlock style={{ height: 40, marginBottom: 16, borderRadius: 8 }} />
              <SkeletonBlock style={{ height: 40, borderRadius: 8 }} />
            </div>
          ) : (
            <form onSubmit={handlePlatformSubmit}>
              <div className={styles.formGroup}>
                <label>Site Name</label>
                <input 
                  type="text" 
                  className={styles.input} 
                  value={platformData.site_name}
                  onChange={(e) => setPlatformData({...platformData, site_name: e.target.value})}
                  placeholder="e.g. Boulot Man"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Support Email</label>
                <input 
                  type="email" 
                  className={styles.input} 
                  value={platformData.support_email}
                  onChange={(e) => setPlatformData({...platformData, support_email: e.target.value})}
                  placeholder="e.g. support@boulotman.com"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Commission Rate (%)</label>
                <input 
                  type="number" 
                  className={styles.input} 
                  value={platformData.commission_rate}
                  onChange={(e) => setPlatformData({...platformData, commission_rate: e.target.value})}
                  placeholder="e.g. 10"
                />
              </div>
              <button type="submit" className={styles.submitBtn} disabled={savingPlatform}>
                {savingPlatform ? "Saving..." : "Save Settings"}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
