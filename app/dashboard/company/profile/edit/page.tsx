"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import styles from "./edit.module.css";
import { useFetch } from "@/app/lib/useFetch";
import { api } from "@/app/lib/api";
import { useToast } from "@/app/components/Toast";
import { SkeletonBlock } from "@/app/components/skeleton/Skeleton";

const COMPANY_SIZES = ["", "1-10", "11-50", "51-200", "201-500", "500+"];

export default function EditCompanyProfile() {
  const toast = useToast();
  const { data: profile, loading, refetch } = useFetch(() => api.getCompanyProfile(), []);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    company_name: "",
    registration_number: "",
    services_offered: "",
    company_size: "",
    about: "",
    website: "",
    headquarters: "",
    team_size: "",
    business_hours: "",
    response_time: "",
    year_founded: "",
    industry: "",
    subject_title: "",
    country: "",
    city: "",
    latitude: "",
    longitude: "",
    areas_of_expertise: "",
  });

  useEffect(() => {
    if (profile) {
      setForm({
        company_name: profile.company_name || "",
        registration_number: profile.registration_number || "",
        services_offered: profile.services_offered || "",
        company_size: profile.company_size || "",
        about: profile.about || "",
        website: profile.website || "",
        headquarters: profile.headquarters || "",
        team_size: profile.team_size?.toString() || "",
        business_hours: profile.business_hours || "",
        response_time: profile.response_time || "",
        year_founded: profile.year_founded || "",
        industry: profile.industry || "",
        subject_title: profile.subject_title || "",
        country: profile.country || "",
        city: profile.city || "",
        latitude: profile.latitude?.toString() || "",
        longitude: profile.longitude?.toString() || "",
        areas_of_expertise: profile.areas_of_expertise || "",
      });
    }
  }, [profile]);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!form.company_name.trim()) {
      toast.warning("Missing required field", "Please enter a company name.");
      return;
    }
    setSaving(true);
    try {
      const payload: Record<string, any> = {
        company_name: form.company_name,
        registration_number: form.registration_number,
        services_offered: form.services_offered,
        company_size: form.company_size,
        about: form.about,
        website: form.website,
        headquarters: form.headquarters,
        business_hours: form.business_hours,
        response_time: form.response_time,
        year_founded: form.year_founded,
        industry: form.industry,
        subject_title: form.subject_title,
        country: form.country,
        city: form.city,
        areas_of_expertise: form.areas_of_expertise,
      };
      if (form.team_size) {
        const n = Number(form.team_size);
        if (!Number.isNaN(n)) payload.team_size = n;
      }
      if (form.latitude) {
        const n = Number(form.latitude);
        if (!Number.isNaN(n)) payload.latitude = n;
      }
      if (form.longitude) {
        const n = Number(form.longitude);
        if (!Number.isNaN(n)) payload.longitude = n;
      }
      await api.updateCompanyProfile(payload);
      toast.success("Profile saved", "Your company profile is up to date.");
      await refetch();
      window.location.href = "/dashboard/company/profile";
    } catch (err: any) {
      toast.error("Save failed", err.message || "Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className={styles.mainWrapper}>
        <div className={styles.container}>
          <SkeletonBlock style={{ height: 48, width: "40%", marginBottom: 16 }} />
          <SkeletonBlock style={{ height: 600, borderRadius: 12 }} />
        </div>
      </main>
    );
  }

  return (
    <main className={styles.mainWrapper}>
      <div className={styles.container}>
        <div className={styles.headerRow}>
          <div>
            <Link href="/dashboard/company/profile" className={styles.backLink}>
              <iconify-icon icon="lucide:arrow-left" /> Back to Profile
            </Link>
            <h1 className={styles.pageTitle}>Edit Company Profile</h1>
            <p className={styles.pageSubtitle}>Update your public company information. Clients will see this on your profile page.</p>
          </div>
        </div>

        <form className={styles.form} onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Company Basics</h2>
            <div className={styles.grid}>
              <label className={styles.field}>
                <span className={styles.label}>Company Name <em>*</em></span>
                <input
                  type="text"
                  className={styles.input}
                  value={form.company_name}
                  onChange={(e) => handleChange("company_name", e.target.value)}
                  placeholder="Enter your company name"
                  required
                />
              </label>

              <label className={styles.field}>
                <span className={styles.label}>Registration Number</span>
                <input
                  type="text"
                  className={styles.input}
                  value={form.registration_number}
                  onChange={(e) => handleChange("registration_number", e.target.value)}
                  placeholder="Enter registration number"
                />
              </label>

              <label className={styles.field}>
                <span className={styles.label}>Subject / Title</span>
                <input
                  type="text"
                  className={styles.input}
                  value={form.subject_title}
                  onChange={(e) => handleChange("subject_title", e.target.value)}
                  placeholder="e.g. Commercial Building & Infrastructure"
                />
              </label>

              <label className={styles.field}>
                <span className={styles.label}>Year Founded</span>
                <input
                  type="text"
                  className={styles.input}
                  value={form.year_founded}
                  onChange={(e) => handleChange("year_founded", e.target.value)}
                  placeholder="e.g. 2009"
                />
              </label>

              <label className={styles.field}>
                <span className={styles.label}>Industry</span>
                <select
                  className={styles.input}
                  value={form.industry}
                  onChange={(e) => handleChange("industry", e.target.value)}
                >
                  <option value="">Select industry</option>
                  <option value="Construction">Construction</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="IT Services">IT Services</option>
                  <option value="Other">Other</option>
                </select>
              </label>

              <label className={styles.field}>
                <span className={styles.label}>Company Size</span>
                <select
                  className={styles.input}
                  value={form.company_size}
                  onChange={(e) => handleChange("company_size", e.target.value)}
                >
                  {COMPANY_SIZES.map((s) => (
                    <option key={s} value={s}>{s || "Select size"}</option>
                  ))}
                </select>
              </label>

              <label className={styles.field}>
                <span className={styles.label}>Team Size</span>
                <input
                  type="number"
                  min="0"
                  className={styles.input}
                  value={form.team_size}
                  onChange={(e) => handleChange("team_size", e.target.value)}
                  placeholder="e.g. 38"
                />
              </label>

              <label className={styles.field}>
                <span className={styles.label}>Headquarters</span>
                <input
                  type="text"
                  className={styles.input}
                  value={form.headquarters}
                  onChange={(e) => handleChange("headquarters", e.target.value)}
                  placeholder="e.g. Dakar, Senegal"
                />
              </label>

              <label className={styles.field}>
                <span className={styles.label}>Website</span>
                <input
                  type="url"
                  className={styles.input}
                  value={form.website}
                  onChange={(e) => handleChange("website", e.target.value)}
                  placeholder="https://example.com"
                />
              </label>
            </div>
          </section>

          <section className={styles.card}>
            <h2 className={styles.cardTitle}>About</h2>
            <label className={styles.field}>
              <span className={styles.label}>Services Offered</span>
              <input
                type="text"
                className={styles.input}
                value={form.services_offered}
                onChange={(e) => handleChange("services_offered", e.target.value)}
                placeholder="e.g. Construction, Electrical, Plumbing"
              />
              <span className={styles.hint}>Separate multiple services with commas.</span>
            </label>
            <label className={styles.field}>
              <span className={styles.label}>Areas of Expertise</span>
              <input
                type="text"
                className={styles.input}
                value={form.areas_of_expertise}
                onChange={(e) => handleChange("areas_of_expertise", e.target.value)}
                placeholder="e.g. Civil Works, Commercial Buildings, Renovation"
              />
              <span className={styles.hint}>Separate areas with commas.</span>
            </label>
            <label className={styles.field}>
              <span className={styles.label}>About the Company</span>
              <textarea
                className={styles.textarea}
                rows={6}
                value={form.about}
                onChange={(e) => handleChange("about", e.target.value)}
                placeholder="Tell clients about your company, your team, and what makes you different."
              />
            </label>
          </section>

          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Location & Address</h2>
            <div className={styles.grid}>
              <label className={styles.field}>
                <span className={styles.label}>Country</span>
                <input
                  type="text"
                  className={styles.input}
                  value={form.country}
                  onChange={(e) => handleChange("country", e.target.value)}
                  placeholder="e.g. Rwanda"
                />
              </label>
              <label className={styles.field}>
                <span className={styles.label}>City</span>
                <input
                  type="text"
                  className={styles.input}
                  value={form.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  placeholder="e.g. Kigali"
                />
              </label>
              <label className={styles.field}>
                <span className={styles.label}>Latitude</span>
                <input
                  type="text"
                  className={styles.input}
                  value={form.latitude}
                  onChange={(e) => handleChange("latitude", e.target.value)}
                  placeholder="e.g. -1.9441"
                />
              </label>
              <label className={styles.field}>
                <span className={styles.label}>Longitude</span>
                <input
                  type="text"
                  className={styles.input}
                  value={form.longitude}
                  onChange={(e) => handleChange("longitude", e.target.value)}
                  placeholder="e.g. 30.0619"
                />
              </label>
            </div>
          </section>

          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Operations</h2>
            <div className={styles.grid}>
              <label className={styles.field}>
                <span className={styles.label}>Business Hours</span>
                <input
                  type="text"
                  className={styles.input}
                  value={form.business_hours}
                  onChange={(e) => handleChange("business_hours", e.target.value)}
                  placeholder="e.g. Mon-Fri 8am-6pm"
                />
              </label>
              <label className={styles.field}>
                <span className={styles.label}>Typical Response Time</span>
                <input
                  type="text"
                  className={styles.input}
                  value={form.response_time}
                  onChange={(e) => handleChange("response_time", e.target.value)}
                  placeholder="e.g. Within 2 hours"
                />
              </label>
            </div>
          </section>

          <div className={styles.actions}>
            <Link href="/dashboard/company/profile" className={styles.cancelBtn}>Cancel</Link>
            <button type="submit" className={styles.saveBtn} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
