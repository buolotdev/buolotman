"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface Props {
  user: any;
  role?: "technician" | "company" | "client";
}

export default function PendingApprovalAlert({ user, role = "technician" }: Props) {
  const [lang, setLang] = useState("en");
  const [modalDismissed, setModalDismissed] = useState(true);

  useEffect(() => {
    const updateLang = () => {
      setLang(localStorage.getItem("lang") || "en");
    };
    updateLang();
    window.addEventListener("languageChange", updateLang);
    return () => window.removeEventListener("languageChange", updateLang);
  }, []);

  const isVerified = Boolean(
    user?.is_verified ||
    user?.technician_profile?.is_verified ||
    user?.company_profile?.is_verified
  );

  useEffect(() => {
    if (user && !isVerified) {
      const dismissed = sessionStorage.getItem(`boulotman_pending_modal_dismissed_${user.id}`);
      if (!dismissed) {
        setModalDismissed(false);
      }
    }
  }, [user, isVerified]);

  if (!user || isVerified) return null;

  const handleDismissModal = () => {
    setModalDismissed(true);
    if (user?.id) {
      sessionStorage.setItem(`boulotman_pending_modal_dismissed_${user.id}`, "true");
    }
  };

  const uploadDocsLink = role === "company" 
    ? "/dashboard/company/profile" 
    : role === "technician" 
    ? "/dashboard/technician/profile" 
    : "/dashboard/client/profile";

  return (
    <>
      {/* 1. PERSISTENT TOP DASHBOARD BANNER */}
      <div 
        style={{
          background: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
          border: "1.5px solid #fde68a",
          borderRadius: "16px",
          padding: "16px 20px",
          marginBottom: "20px",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "16px",
          boxShadow: "0 4px 16px rgba(245, 158, 11, 0.08)",
          flexWrap: "wrap"
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: "14px", flex: 1, minWidth: "260px" }}>
          <div 
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "10px",
              background: "#f59e0b",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              flexShrink: 0
            }}
          >
            <iconify-icon icon="lucide:clock-4" />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "4px" }}>
              <h4 style={{ margin: 0, fontSize: "15px", fontWeight: 800, color: "#92400e" }}>
                {lang === "fr" ? "Compte en attente d'approbation administrateur" : "Account Under Administrative Review"}
              </h4>
              <span 
                style={{
                  background: "#fbbf24",
                  color: "#78350f",
                  fontSize: "10.5px",
                  fontWeight: 800,
                  padding: "2px 8px",
                  borderRadius: "20px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px"
                }}
              >
                {lang === "fr" ? "Non publié" : "Unpublished"}
              </span>
            </div>
            <p style={{ margin: 0, fontSize: "13px", color: "#78350f", lineHeight: "1.5" }}>
              {lang === "fr"
                ? "Votre profil a été enregistré avec succès et est actuellement examiné par notre équipe de modération. Dès qu'un administrateur valide votre compte, votre profil sera automatiquement publié et visible pour tous les clients sur la plateforme."
                : "Your profile has been created and is currently being audited by our governance and security team. As soon as an administrator approves your account, your profile will be published and visible to all clients across the marketplace."}
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px", alignSelf: "center" }}>
          <Link
            href={uploadDocsLink}
            style={{
              background: "#92400e",
              color: "#ffffff",
              textDecoration: "none",
              padding: "8px 16px",
              borderRadius: "10px",
              fontSize: "13px",
              fontWeight: 700,
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              whiteSpace: "nowrap",
              boxShadow: "0 2px 8px rgba(146, 64, 14, 0.2)"
            }}
          >
            <iconify-icon icon="lucide:file-check" />
            {lang === "fr" ? "Gérer mes documents" : "Manage Documents"}
          </Link>
        </div>
      </div>

      {/* 2. ONBOARDING MODAL (POPUP ON FIRST VISIT) */}
      {!modalDismissed && (
        <div 
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 31, 63, 0.65)",
            backdropFilter: "blur(6px)",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px"
          }}
        >
          <div 
            style={{
              background: "#ffffff",
              borderRadius: "24px",
              maxWidth: "520px",
              width: "100%",
              padding: "32px",
              boxShadow: "0 24px 60px rgba(0, 31, 63, 0.25)",
              textAlign: "center",
              animation: "bmModalPop 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
            }}
          >
            <div 
              style={{
                width: "68px",
                height: "68px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
                border: "2px solid #f59e0b",
                color: "#d97706",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "34px",
                marginBottom: "16px"
              }}
            >
              <iconify-icon icon="lucide:shield-alert" />
            </div>

            <h3 style={{ fontSize: "20px", fontWeight: 800, color: "#001f3f", margin: "0 0 10px" }}>
              {lang === "fr" ? "Vérification et Approbation Requises" : "Admin Approval & Visibility Notice"}
            </h3>

            <p style={{ fontSize: "14px", color: "#475569", lineHeight: "1.6", margin: "0 0 20px" }}>
              {lang === "fr"
                ? "Bienvenue sur Boulot Man ! Pour garantir la sécurité et la qualité des prestations, chaque nouveau compte passe par un contrôle de sécurité et de conformité. Votre profil sera visible publiquement dès validation par nos équipes."
                : "Welcome to Boulot Man! To protect our community and eliminate fraud, all professional profiles undergo administrative verification. Your profile and services will become publicly visible as soon as our team approves your account."}
            </p>

            <div 
              style={{
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "14px",
                padding: "14px",
                textAlign: "left",
                marginBottom: "24px",
                display: "flex",
                flexDirection: "column",
                gap: "8px"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#1e293b", fontWeight: 600 }}>
                <iconify-icon icon="lucide:check-circle-2" style={{ color: "#16a34a", fontSize: "16px" }} />
                <span>{lang === "fr" ? "Compte enregistré avec succès" : "Account successfully registered"}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#b45309", fontWeight: 700 }}>
                <iconify-icon icon="lucide:clock-4" style={{ color: "#f59e0b", fontSize: "16px" }} />
                <span>{lang === "fr" ? "Examen de conformité en cours (Admin)" : "Compliance review in progress (Admin)"}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#64748b" }}>
                <iconify-icon icon="lucide:shield-check" style={{ color: "#94a3b8", fontSize: "16px" }} />
                <span>{lang === "fr" ? "Badge de vérification officiel après validation" : "Official verified badge issued upon approval"}</span>
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              <button
                type="button"
                onClick={handleDismissModal}
                style={{
                  background: "#ff4500",
                  color: "#ffffff",
                  border: "none",
                  padding: "12px 28px",
                  borderRadius: "12px",
                  fontSize: "14px",
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(255, 69, 0, 0.25)"
                }}
              >
                {lang === "fr" ? "J'ai compris" : "Got it, Thank you"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
