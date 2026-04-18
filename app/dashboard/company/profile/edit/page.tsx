"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./edit.module.css";

export default function EditCompanyProfile() {
  return (
    <main className={styles.mainWrapper}>
      <div className={styles.container}>
        {/* Page Header */}
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle}>Edit Company Profile</h1>
            <div className={styles.pageSubtitle}>
              Update your company details, services, and team information.
            </div>
          </div>
          <div className={styles.headerActions}>
            <Link href="/dashboard/company/profile" className={styles.btnOutline}>
              Cancel
            </Link>
            <button type="button" className={styles.btnPrimary}>
              <iconify-icon icon="lucide:save" style={{ fontSize: '18px' }}></iconify-icon>
              Save Changes
            </button>
          </div>
        </div>

        {/* Form Container */}
        <div className={styles.card}>
          {/* Logo Upload Section */}
          <div className={styles.logoSection}>
            <div className={styles.currentLogo}>
              <Image
                src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=200&h=200"
                alt="Current Logo"
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div className={styles.logoActions}>
              <h3>Company Logo</h3>
              <p>Recommended size: 400x400px. Max size 5MB. JPG, PNG or WEBP.</p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="button" className={styles.btnOutline}>
                  <iconify-icon icon="lucide:upload" style={{ fontSize: '16px' }}></iconify-icon>
                  Change Logo
                </button>
                <button type="button" className={styles.btnIcon} style={{ width: '44px', height: '44px' }}>
                  <iconify-icon icon="lucide:trash-2" style={{ fontSize: '16px' }}></iconify-icon>
                </button>
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <h2 className={styles.cardTitle}>Basic Information</h2>
          <div className={styles.grid2} style={{ marginBottom: '20px' }}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Company Name *</label>
              <div>
                <input
                  type="text"
                  className={styles.input}
                  defaultValue="Apex Construction"
                  placeholder="Enter company name"
                />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Company Type</label>
              <div>
                <select className={`${styles.input} ${styles.selectInput}`}>
                  <option value="general">General Contractor</option>
                  <option value="specialty">Specialty Trade Contractor</option>
                  <option value="arch_eng">Architecture & Engineering</option>
                  <option value="cleaning">Cleaning Services</option>
                </select>
              </div>
            </div>
          </div>

          <div className={styles.formGroup} style={{ marginBottom: '32px' }}>
            <label className={styles.label}>Company Description *</label>
            <div>
              <textarea
                className={styles.textarea}
                placeholder="Describe your company's mission, experience, and what makes you unique..."
                defaultValue={"Apex Construction is an industry-leading general contractor providing comprehensive building solutions for both commercial and residential projects.\n\nWith over 15 years of experience in the region, our team of certified professionals guarantees quality craftsmanship, strict adherence to timelines, and exceptional safety standards."}
              />
            </div>
            <div className={styles.helperText} style={{ marginTop: '6px', textAlign: 'right' }}>
              342 / 1000 characters
            </div>
          </div>
        </div>

        {/* Services & Categories */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Services & Categories</h2>

          <div className={styles.formGroup} style={{ marginBottom: '24px' }}>
            <label className={styles.label}>Primary Service Categories</label>
            <div className={styles.tagsContainer}>
              <div className={styles.tag}>
                Commercial Construction
                <div className={styles.tagRemove}>
                  <iconify-icon icon="lucide:x" style={{ fontSize: '12px' }}></iconify-icon>
                </div>
              </div>
              <div className={styles.tag}>
                Residential Renovation
                <div className={styles.tagRemove}>
                  <iconify-icon icon="lucide:x" style={{ fontSize: '12px' }}></iconify-icon>
                </div>
              </div>
              <div className={styles.tag}>
                Electrical Installs
                <div className={styles.tagRemove}>
                  <iconify-icon icon="lucide:x" style={{ fontSize: '12px' }}></iconify-icon>
                </div>
              </div>
              <div className={styles.tag}>
                Plumbing
                <div className={styles.tagRemove}>
                  <iconify-icon icon="lucide:x" style={{ fontSize: '12px' }}></iconify-icon>
                </div>
              </div>
              <input
                type="text"
                className={styles.tagsInputField}
                placeholder="Type and press enter..."
              />
            </div>
            <div className={styles.helperText} style={{ marginTop: '8px' }}>
              Add up to 10 categories that best describe your services.
            </div>
          </div>

          <div className={styles.grid2}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Service Radius</label>
              <div>
                <select className={`${styles.input} ${styles.selectInput}`}>
                  <option value="50">Up to 50 miles</option>
                  <option value="100">Up to 100 miles</option>
                  <option value="state">Statewide</option>
                  <option value="nation">Nationwide</option>
                </select>
              </div>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Years in Business</label>
              <div>
                <input type="number" className={styles.input} defaultValue="15" />
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Contact Information</h2>

          <div className={styles.grid2} style={{ marginBottom: '20px' }}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Primary Email *</label>
              <div>
                <input type="email" className={styles.input} defaultValue="hello@apexconstruction.com" />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Phone Number *</label>
              <div>
                <input type="tel" className={styles.input} defaultValue="(555) 123-4567" />
              </div>
            </div>
          </div>

          <div className={styles.grid2} style={{ marginBottom: '20px' }}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Website</label>
              <div>
                <input type="url" className={styles.input} defaultValue="https://www.apexconstruction.com" />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>LinkedIn Profile</label>
              <div>
                <input type="url" className={styles.input} placeholder="https://linkedin.com/company/..." />
              </div>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Headquarters Address</label>
            <div>
              <input
                type="text"
                className={styles.input}
                defaultValue="123 Builder Lane, Suite 400"
                style={{ marginBottom: '12px' }}
                placeholder="Street Address"
              />
            </div>
            <div className={styles.grid2}>
              <div>
                <input type="text" className={styles.input} defaultValue="New York" placeholder="City" />
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <input type="text" className={styles.input} defaultValue="NY" placeholder="State" />
                </div>
                <div style={{ flex: 1 }}>
                  <input type="text" className={styles.input} defaultValue="10001" placeholder="ZIP" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Details */}
        <div className={styles.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', gap: '16px', flexWrap: 'wrap' }}>
            <h2 className={styles.cardTitle} style={{ marginBottom: 0 }}>Team Details</h2>
            <button type="button" className={styles.btnOutline} style={{ height: '36px', padding: '0 16px', fontSize: '13px', flex: 'none' }}>
              <iconify-icon icon="lucide:plus" style={{ fontSize: '16px' }}></iconify-icon>
              Add Member
            </button>
          </div>

          <div className={styles.formGroup} style={{ marginBottom: '24px', maxWidth: '300px' }}>
            <label className={styles.label}>Company Size</label>
            <div>
              <select className={`${styles.input} ${styles.selectInput}`} defaultValue="11-50">
                <option value="1-10">1-10 employees</option>
                <option value="11-50">11-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="201+">201+ employees</option>
              </select>
            </div>
          </div>

          <label className={styles.label}>Key Team Members</label>
          <div className={styles.teamList}>
            <div className={styles.teamItem}>
              <div className={styles.teamMemberInfo}>
                <div className={styles.teamAvatar}>
                  <Image
                    src="https://storage.googleapis.com/banani-avatars/avatar%2Fmale%2F35-50%2FEuropean%2F3"
                    alt="Team Member"
                    width={40}
                    height={40}
                  />
                </div>
                <div className={styles.teamDetails}>
                  <h4>Marcus Johnson</h4>
                  <span>Lead Electrician</span>
                </div>
              </div>
              <div className={styles.teamActions}>
                <button type="button" className={styles.btnIcon}>
                  <iconify-icon icon="lucide:pencil" style={{ fontSize: '16px' }}></iconify-icon>
                </button>
                <button type="button" className={styles.btnIcon}>
                  <iconify-icon icon="lucide:trash-2" style={{ fontSize: '16px' }}></iconify-icon>
                </button>
              </div>
            </div>

            <div className={styles.teamItem}>
              <div className={styles.teamMemberInfo}>
                <div className={styles.teamAvatar}>
                  <Image
                    src="https://storage.googleapis.com/banani-avatars/avatar%2Ffemale%2F25-35%2FAfrican%2F1"
                    alt="Team Member"
                    width={40}
                    height={40}
                  />
                </div>
                <div className={styles.teamDetails}>
                  <h4>Sarah Williams</h4>
                  <span>Project Manager</span>
                </div>
              </div>
              <div className={styles.teamActions}>
                <button type="button" className={styles.btnIcon}>
                  <iconify-icon icon="lucide:pencil" style={{ fontSize: '16px' }}></iconify-icon>
                </button>
                <button type="button" className={styles.btnIcon}>
                  <iconify-icon icon="lucide:trash-2" style={{ fontSize: '16px' }}></iconify-icon>
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
