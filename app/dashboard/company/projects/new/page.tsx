"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./new.module.css";
import DashboardHeader from "@/app/components/DashboardHeader";

export default function CreateCompanyProjectPage() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    category: "",
    budget: "",
    deadline: "",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Project submission flow pending backend integration.");
  };

  return (
    <main className={styles.mainWrapper}>
      <DashboardHeader onMenuClick={() => setMobileSidebarOpen(true)} />
      <div className={styles.container} style={{ marginTop: 32 }}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <p className={styles.subtitle}>Projects</p>
            <h1 className={styles.title}>Post a New Project</h1>
          </div>
          <Link href="/dashboard/company/projects" className={styles.backLink}>
            <iconify-icon icon="lucide:arrow-left" /> Back to projects
          </Link>
        </header>

        <form className={styles.formCard} onSubmit={handleSubmit}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Project Title</label>
            <input 
              type="text" 
              className={styles.input} 
              placeholder="e.g., Office Building Electrical Wiring"
              value={form.title}
              onChange={e => setForm({...form, title: e.target.value})}
              required
            />
          </div>

          <div className={styles.grid2}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Category</label>
              <select 
                className={styles.select}
                value={form.category}
                onChange={e => setForm({...form, category: e.target.value})}
                required
              >
                <option value="">Select Category</option>
                <option value="electrical">Electrical</option>
                <option value="plumbing">Plumbing</option>
                <option value="construction">Construction</option>
              </select>
            </div>
            
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Estimated Budget (XOF)</label>
              <input 
                type="number" 
                className={styles.input} 
                placeholder="e.g., 500000"
                value={form.budget}
                onChange={e => setForm({...form, budget: e.target.value})}
                required
              />
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Deadline</label>
            <input 
              type="date" 
              className={styles.input} 
              value={form.deadline}
              onChange={e => setForm({...form, deadline: e.target.value})}
              required
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Project Description</label>
            <textarea 
              className={styles.textarea} 
              placeholder="Provide detailed requirements for this project..."
              value={form.description}
              onChange={e => setForm({...form, description: e.target.value})}
              required
            />
          </div>

          <button type="submit" className={styles.submitBtn}>
            <iconify-icon icon="lucide:send" /> Publish Project
          </button>
        </form>
      </div>
    </main>
  );
}
