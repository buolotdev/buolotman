"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./services.module.css";

export default function AddService() {
  return (
    <div className={styles.exportWrapper}>
      {/* Topbar */}
      <header className={styles.topbar}>
        <Link href="/dashboard/company" className={styles.brand}>
          <Image 
            src="/boulotman-logo.png" 
            alt="Boulot Man" 
            width={180} 
            height={46} 
            style={{ width: 'auto', height: '46px' }}
            priority 
          />
        </Link>
        <div className={styles.topbarActions}>
          <Link href="/dashboard/company" className={styles.closeBtn}>
            <iconify-icon
              icon="lucide:x"
              style={{ fontSize: '18px' }}
            ></iconify-icon>
            Cancel & Return
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.formContainer}>
          <div className={styles.formHeader}>
            <h1 className={styles.pageTitle}>Add New Service</h1>
            <p className={styles.pageSubtitle}>
              Provide details about the service you are offering to help clients
              find and book you easily.
            </p>
          </div>

          <div className={styles.formBody}>
            {/* Basic Details */}
            <div className={styles.formSection}>
              <h2 className={styles.sectionTitle}>Basic Details</h2>

              <div className={styles.formGroup}>
                <label className={styles.label}>Service Title</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="e.g., Professional Plumbing Setup & Maintenance"
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Category</label>
                  <select className={styles.select} defaultValue="">
                    <option value="" disabled>
                      Select a category
                    </option>
                    <option value="plumbing">Plumbing</option>
                    <option value="electrical">Electrical</option>
                    <option value="hvac">HVAC</option>
                    <option value="construction">Construction</option>
                    <option value="cleaning">Cleaning</option>
                    <option value="security">Security Systems</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Service Type</label>
                  <select className={styles.select} defaultValue="">
                    <option value="" disabled>
                      Select type
                    </option>
                    <option value="on-site">On-site</option>
                    <option value="remote">Remote</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Description</label>
                <textarea
                  className={styles.textarea}
                  placeholder="Describe the service in detail. What is included? What should the client expect?"
                ></textarea>
              </div>
            </div>

            {/* Pricing */}
            <div className={styles.formSection}>
              <h2 className={styles.sectionTitle}>Pricing Model</h2>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Price Type</label>
                  <select className={styles.select} defaultValue="">
                    <option value="" disabled>
                      Select pricing type
                    </option>
                    <option value="fixed">Fixed Rate</option>
                    <option value="hourly">Hourly Rate</option>
                    <option value="daily">Daily Rate</option>
                    <option value="quote">Contact for Quote</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Amount
                    <span className={styles.labelDesc}>(Optional if Quote)</span>
                  </label>
                  <div className={styles.inputWrapper}>
                    <span className={styles.inputPrefix}>$</span>
                    <input
                      type="number"
                      className={`${styles.input} ${styles.inputWithPrefix}`}
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Availability & Coverage */}
            <div className={styles.formSection}>
              <h2 className={styles.sectionTitle}>Availability & Coverage</h2>

              <div className={styles.formGroup}>
                <label className={styles.label}>Coverage Area</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="e.g., New York City Metro Area"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Standard Availability</label>
                <select className={styles.select} defaultValue="">
                  <option value="" disabled>
                    Select availability
                  </option>
                  <option value="weekday">Monday - Friday (9AM - 5PM)</option>
                  <option value="24-7">Available 24/7 (Emergency Service)</option>
                  <option value="weekend">Weekends Only</option>
                  <option value="flexible">Flexible Schedule</option>
                </select>
              </div>
            </div>
          </div>

          <div className={styles.formFooter}>
            <button type="button" className={styles.btnOutline}>
              Save as Draft
            </button>
            <button type="button" className={styles.btnPrimary}>
              Publish Service
              <iconify-icon
                icon="lucide:arrow-right"
                style={{ fontSize: '18px' }}
              ></iconify-icon>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
