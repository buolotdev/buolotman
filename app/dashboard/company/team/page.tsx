"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import layoutStyles from "../page.module.css";
import styles from "./team.module.css";

const translations: Record<string, Record<string, string>> = {
  en: {
    subtitle: "Enterprise Workforce Management",
    title: "Company Team & Staff",
    backToDashboard: "Back to dashboard",
    inviteMember: "Invite Member",
    noTeamMembers: "No team members added yet",
    noTeamDesc: "Add certified engineers, project supervisors, and technicians to your enterprise roster.",
    addFirstMember: "Add First Team Member",
    active: "● Active",
    invited: "⏱ Invited",
    remove: "Remove",
    confirmRemove: "Are you sure you want to remove this team member?",
    inviteModalTitle: "Invite Team Member",
    inviteModalDesc: "Send an invitation to add a professional to your company roster.",
    fullName: "Full Name *",
    workEmail: "Work Email Address *",
    phone: "Phone Number (Optional)",
    role: "Role / Position",
    cancel: "Cancel",
    sendInvitation: "Send Invitation",
    invitationSent: "Invitation sent to",
    leadTechnician: "Lead Technician",
    seniorEngineer: "Senior Electrical Engineer",
    projectManager: "Project Manager",
    siteSupervisor: "Site Supervisor",
    hvacSpecialist: "HVAC Specialist",
    plumbingLead: "Plumbing Lead",
  },
  fr: {
    subtitle: "Gestion des Effectifs d'Entreprise",
    title: "Équipe & Personnel de l'Entreprise",
    backToDashboard: "Retour au tableau de bord",
    inviteMember: "Inviter un Membre",
    noTeamMembers: "Aucun membre d'équipe ajouté pour l'instant",
    noTeamDesc: "Ajoutez des ingénieurs certifiés, des chefs de projet et des techniciens à votre effectif d'entreprise.",
    addFirstMember: "Ajouter un Premier Membre",
    active: "● Actif",
    invited: "⏱ Invité",
    remove: "Supprimer",
    confirmRemove: "Êtes-vous sûr de vouloir retirer ce membre de l'équipe ?",
    inviteModalTitle: "Inviter un Membre de l'Équipe",
    inviteModalDesc: "Envoyez une invitation pour ajouter un professionnel à l'effectif de votre entreprise.",
    fullName: "Nom Complet *",
    workEmail: "Adresse E-mail Professionnelle *",
    phone: "Numéro de Téléphone (Facultatif)",
    role: "Rôle / Poste",
    cancel: "Annuler",
    sendInvitation: "Envoyer l'Invitation",
    invitationSent: "Invitation envoyée à",
    leadTechnician: "Technicien en Chef",
    seniorEngineer: "Ingénieur Électricien Principal",
    projectManager: "Chef de Projet",
    siteSupervisor: "Superviseur de Chantier",
    hvacSpecialist: "Spécialiste CVC / Climatisation",
    plumbingLead: "Responsable Plomberie",
  }
};

export default function CompanyTeamPage() {
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
    setSuccessMsg(`${t.invitationSent} ${formData.email}!`);
    setFormData({ name: "", email: "", phone: "", role: "Lead Technician" });
    setTimeout(() => {
      setIsModalOpen(false);
      setSuccessMsg("");
    }, 1500);
  };

  const handleRemove = (id: number) => {
    if (confirm(t.confirmRemove)) {
      setTeam((prev) => prev.filter((m) => m.id !== id));
    }
  };

  return (
    <>
      <div className={layoutStyles.content}>
        <div className={styles.container} style={{ marginTop: 24 }}>
          <header className={styles.header}>
            <div className={styles.headerLeft}>
              <p className={styles.subtitle}>{t.subtitle}</p>
              <h1 className={styles.title}>{t.title}</h1>
              <Link href="/dashboard/company" className={styles.backLink}>
                <iconify-icon icon="lucide:arrow-left" /> {t.backToDashboard}
              </Link>
            </div>
            <div className={styles.headerActions}>
              <button className={styles.inviteBtn} onClick={() => setIsModalOpen(true)}>
                <iconify-icon icon="lucide:user-plus" /> {t.inviteMember}
              </button>
            </div>
          </header>

          {team.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <iconify-icon icon="lucide:users" />
              </div>
              <h3>{t.noTeamMembers}</h3>
              <p>{t.noTeamDesc}</p>
              <button className={styles.inviteBtn} onClick={() => setIsModalOpen(true)} style={{ marginTop: 12 }}>
                <iconify-icon icon="lucide:user-plus" /> {t.addFirstMember}
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
                      {member.status === "active" ? t.active : t.invited}
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
                      <iconify-icon icon="lucide:trash-2" /> {t.remove}
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
                <h2>{t.inviteModalTitle}</h2>
                <p>{t.inviteModalDesc}</p>
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
                  <label>{t.fullName}</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jean Dupont"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>{t.workEmail}</label>
                  <input
                    type="email"
                    required
                    placeholder="jean@entreprise.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>{t.phone}</label>
                  <input
                    type="tel"
                    placeholder="+225 07 00 00 00"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>{t.role}</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  >
                    <option value="Lead Technician">{t.leadTechnician}</option>
                    <option value="Senior Electrical Engineer">{t.seniorEngineer}</option>
                    <option value="Project Manager">{t.projectManager}</option>
                    <option value="Site Supervisor">{t.siteSupervisor}</option>
                    <option value="HVAC Specialist">{t.hvacSpecialist}</option>
                    <option value="Plumbing Lead">{t.plumbingLead}</option>
                  </select>
                </div>

                <div className={styles.modalActions}>
                  <button type="button" className={styles.cancelBtn} onClick={() => setIsModalOpen(false)}>
                    {t.cancel}
                  </button>
                  <button type="submit" className={styles.submitBtn}>
                    <iconify-icon icon="lucide:send" /> {t.sendInvitation}
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

