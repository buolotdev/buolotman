"use client";

import { useState } from "react";
import Link from "next/link";
import layoutStyles from "../page.module.css";
import styles from "./team.module.css";


export default function CompanyTeamPage() {
  const [team, setTeam] = useState<any[]>([
    {
      id: 1,
      name: "Jean-Paul Habimana",
      initials: "JH",
      role: "Senior Electrical Lead",
      email: "jean.paul@company.rw",
      phone: "+250 788 123 456",
      status: "active",
    },
    {
      id: 2,
      name: "Marie Claire Uwase",
      initials: "MU",
      role: "Project Manager",
      email: "marie.claire@company.rw",
      phone: "+250 789 654 321",
      status: "active",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Lead Technician",
  });
  const [successMsg, setSuccessMsg] = useState("");

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) return;

    const initials = formData.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    const newMember = {
      id: Date.now(),
      name: formData.name.trim(),
      initials: initials || "TM",
      role: formData.role,
      email: formData.email.trim(),
      phone: formData.phone.trim() || "N/A",
      status: "pending",
    };

    setTeam((prev) => [newMember, ...prev]);
    setSuccessMsg(`Invitation sent to ${formData.email}!`);
    setFormData({ name: "", email: "", phone: "", role: "Lead Technician" });
    setTimeout(() => {
      setIsModalOpen(false);
      setSuccessMsg("");
    }, 1500);
  };

  const handleRemove = (id: number) => {
    if (confirm("Are you sure you want to remove this team member?")) {
      setTeam((prev) => prev.filter((m) => m.id !== id));
    }
  };

  return (
    <>
      <div className={layoutStyles.content}>
        <div className={styles.container} style={{ marginTop: 24 }}>
          <header className={styles.header}>
            <div className={styles.headerLeft}>
              <p className={styles.subtitle}>Enterprise Workforce Management</p>
              <h1 className={styles.title}>Company Team &amp; Staff</h1>
              <Link href="/dashboard/company" className={styles.backLink}>
                <iconify-icon icon="lucide:arrow-left" /> Back to dashboard
              </Link>
            </div>
            <div className={styles.headerActions}>
              <button className={styles.inviteBtn} onClick={() => setIsModalOpen(true)}>
                <iconify-icon icon="lucide:user-plus" /> Invite Member
              </button>
            </div>
          </header>

          {team.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <iconify-icon icon="lucide:users" />
              </div>
              <h3>No team members added yet</h3>
              <p>Add certified engineers, project supervisors, and technicians to your enterprise roster.</p>
              <button className={styles.inviteBtn} onClick={() => setIsModalOpen(true)} style={{ marginTop: 12 }}>
                <iconify-icon icon="lucide:user-plus" /> Add First Team Member
              </button>
            </div>
          ) : (
            <div className={styles.teamList}>
              {team.map((member) => (
                <div key={member.id} className={styles.memberCard}>
                  <div className={styles.memberHeader}>
                    <div className={styles.memberInfo}>
                      <div className={styles.avatar}>{member.initials}</div>
                      <div className={styles.details}>
                        <h3 className={styles.name}>{member.name}</h3>
                        <span className={styles.role}>{member.role}</span>
                      </div>
                    </div>
                    <span className={`${styles.status} ${member.status === "active" ? styles.statusActive : styles.statusPending}`}>
                      {member.status === "active" ? "● Active" : "⏱ Invited"}
                    </span>
                  </div>
                  <div className={styles.memberContact}>
                    <div className={styles.contactItem}>
                      <iconify-icon icon="lucide:mail" style={{ color: "#ff4500" }} /> {member.email}
                    </div>
                    {member.phone && member.phone !== "N/A" && (
                      <div className={styles.contactItem}>
                        <iconify-icon icon="lucide:phone" style={{ color: "#0284c7" }} /> {member.phone}
                      </div>
                    )}
                  </div>
                  <div className={styles.cardActions}>
                    <button
                      className={`${styles.actionBtn} ${styles.actionBtnRemove}`}
                      onClick={() => handleRemove(member.id)}
                    >
                      <iconify-icon icon="lucide:trash-2" /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* INVITE MODAL */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>
              <iconify-icon icon="lucide:x" />
            </button>
            <div className={styles.modalHeader}>
              <div className={styles.modalIconWrap}>
                <iconify-icon icon="lucide:user-plus" />
              </div>
              <div>
                <h2>Invite Team Member</h2>
                <p>Send an invitation to add a professional to your company roster.</p>
              </div>
            </div>

            {successMsg ? (
              <div className={styles.successBox}>
                <iconify-icon icon="lucide:check-circle-2" style={{ fontSize: 24, color: "#16a34a" }} />
                <span>{successMsg}</span>
              </div>
            ) : (
              <form onSubmit={handleInvite} className={styles.form}>
                <div className={styles.formGroup}>
                  <label>Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Bosco"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Work Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="john@company.rw"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Phone Number (Optional)</label>
                  <input
                    type="tel"
                    placeholder="+250 788 000 000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Role / Position</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  >
                    <option value="Lead Technician">Lead Technician</option>
                    <option value="Senior Electrical Engineer">Senior Electrical Engineer</option>
                    <option value="Project Manager">Project Manager</option>
                    <option value="Site Supervisor">Site Supervisor</option>
                    <option value="HVAC Specialist">HVAC Specialist</option>
                    <option value="Plumbing Lead">Plumbing Lead</option>
                  </select>
                </div>

                <div className={styles.modalActions}>
                  <button type="button" className={styles.cancelBtn} onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className={styles.submitBtn}>
                    <iconify-icon icon="lucide:send" /> Send Invitation
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
