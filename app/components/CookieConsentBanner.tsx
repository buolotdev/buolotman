"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface CookiePreferences {
  essential: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

const DEFAULT_PREFS: CookiePreferences = {
  essential: true,
  functional: true,
  analytics: true,
  marketing: false,
};

export default function CookieConsentBanner() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [lang, setLang] = useState<"en" | "fr">("en");
  const [preferences, setPreferences] = useState<CookiePreferences>(DEFAULT_PREFS);

  useEffect(() => {
    setMounted(true);
    try {
      const savedLang = localStorage.getItem("lang") === "fr" ? "fr" : "en";
      setLang(savedLang);

      const hasConsented = localStorage.getItem("bm_cookie_consent");
      const savedPrefs = localStorage.getItem("bm_cookie_preferences");

      if (savedPrefs) {
        setPreferences(JSON.parse(savedPrefs));
      }

      if (!hasConsented) {
        // Show banner after a slight delay for smoother entrance
        const timer = setTimeout(() => {
          setVisible(true);
        }, 800);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      console.warn("Cookie consent check failed:", e);
    }
  }, []);

  const handleAcceptAll = () => {
    try {
      const allAccepted: CookiePreferences = {
        essential: true,
        functional: true,
        analytics: true,
        marketing: true,
      };
      localStorage.setItem("bm_cookie_consent", "accepted_all");
      localStorage.setItem("bm_cookie_preferences", JSON.stringify(allAccepted));
      setPreferences(allAccepted);
    } catch (e) {}
    setVisible(false);
  };

  const handleSaveCustom = () => {
    try {
      localStorage.setItem("bm_cookie_consent", "customized");
      localStorage.setItem("bm_cookie_preferences", JSON.stringify(preferences));
    } catch (e) {}
    setShowCustomize(false);
    setVisible(false);
  };

  const handleClose = () => {
    try {
      // Dismiss for current session or save default essential
      localStorage.setItem("bm_cookie_consent", "dismissed");
    } catch (e) {}
    setVisible(false);
  };

  if (!mounted || !visible) return null;

  const isFr = lang === "fr";

  return (
    <>
      <div className="bm-cookie-banner" role="dialog" aria-modal="false" aria-label="Cookie Consent">
        <button
          type="button"
          onClick={handleClose}
          className="bm-cookie-close-btn"
          aria-label={isFr ? "Fermer" : "Close"}
          title={isFr ? "Fermer" : "Close"}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <p className="bm-cookie-text">
          {isFr ? (
            <>
              Nous utilisons des cookies essentiels pour faire fonctionner <strong>Boulot Man</strong>. Avec votre consentement, nous aimerions également les utiliser pour améliorer votre expérience, personnaliser le contenu et analyser les performances. En savoir plus dans notre{" "}
              <Link href="/cookies" className="bm-cookie-link">
                Politique de cookies
              </Link>
              .
            </>
          ) : (
            <>
              We use essential cookies to run <strong>Boulot Man</strong>. With your consent, we'd also like to use them to improve your experience, tailor ads, and analyze performance. Learn more from our{" "}
              <Link href="/cookies" className="bm-cookie-link">
                Cookie Policy
              </Link>
              .
            </>
          )}
        </p>

        <div className="bm-cookie-actions">
          <button
            type="button"
            onClick={() => setShowCustomize(true)}
            className="bm-cookie-btn bm-cookie-btn-customize"
          >
            {isFr ? "Personnaliser" : "Customize"}
          </button>
          <button
            type="button"
            onClick={handleAcceptAll}
            className="bm-cookie-btn bm-cookie-btn-accept"
          >
            {isFr ? "Tout accepter" : "Accept all"}
          </button>
        </div>
      </div>

      {/* CUSTOMIZE MODAL */}
      {showCustomize && (
        <div className="bm-cookie-modal-backdrop" onClick={() => setShowCustomize(false)}>
          <div className="bm-cookie-modal" onClick={(e) => e.stopPropagation()}>
            <div className="bm-cookie-modal-header">
              <h3>{isFr ? "Préférences des cookies" : "Cookie Preferences"}</h3>
              <button
                type="button"
                onClick={() => setShowCustomize(false)}
                className="bm-cookie-modal-close"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <p className="bm-cookie-modal-desc">
              {isFr
                ? "Personnalisez les types de cookies que vous autorisez sur Boulot Man. Les cookies essentiels sont requis pour le bon fonctionnement de la plateforme."
                : "Customize the types of cookies you allow on Boulot Man. Essential cookies are required for platform security, login, and payments."}
            </p>

            <div className="bm-cookie-options">
              {/* Essential */}
              <div className="bm-cookie-option">
                <div className="bm-cookie-option-info">
                  <strong>{isFr ? "Cookies essentiels" : "Essential Cookies"}</strong>
                  <span>{isFr ? "Requis pour la connexion, sécurité et paiements." : "Required for authentication, security, and escrow sessions."}</span>
                </div>
                <span className="bm-cookie-badge-always">{isFr ? "Toujours actif" : "Always active"}</span>
              </div>

              {/* Functional */}
              <div className="bm-cookie-option">
                <div className="bm-cookie-option-info">
                  <strong>{isFr ? "Cookies fonctionnels" : "Functional & Preferences"}</strong>
                  <span>{isFr ? "Mémorise votre langue, devise et filtres." : "Remembers your language, currency, and local filters."}</span>
                </div>
                <label className="bm-cookie-switch">
                  <input
                    type="checkbox"
                    checked={preferences.functional}
                    onChange={(e) => setPreferences({ ...preferences, functional: e.target.checked })}
                  />
                  <span className="bm-cookie-slider"></span>
                </label>
              </div>

              {/* Analytics */}
              <div className="bm-cookie-option">
                <div className="bm-cookie-option-info">
                  <strong>{isFr ? "Performances & Statistiques" : "Analytics & Performance"}</strong>
                  <span>{isFr ? "Nous aide à mesurer l'utilisation et la rapidité du site." : "Helps us measure site performance, errors, and feature usage."}</span>
                </div>
                <label className="bm-cookie-switch">
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                  />
                  <span className="bm-cookie-slider"></span>
                </label>
              </div>

              {/* Marketing */}
              <div className="bm-cookie-option">
                <div className="bm-cookie-option-info">
                  <strong>{isFr ? "Marketing & Recommandations" : "Marketing & Personalization"}</strong>
                  <span>{isFr ? "Utilisé pour des offres de service pertinentes." : "Used to deliver relevant task and professional recommendations."}</span>
                </div>
                <label className="bm-cookie-switch">
                  <input
                    type="checkbox"
                    checked={preferences.marketing}
                    onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                  />
                  <span className="bm-cookie-slider"></span>
                </label>
              </div>
            </div>

            <div className="bm-cookie-modal-footer">
              <button
                type="button"
                onClick={handleSaveCustom}
                className="bm-cookie-btn bm-cookie-btn-customize"
              >
                {isFr ? "Enregistrer mes choix" : "Save Preferences"}
              </button>
              <button
                type="button"
                onClick={handleAcceptAll}
                className="bm-cookie-btn bm-cookie-btn-accept"
              >
                {isFr ? "Tout accepter" : "Accept All"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .bm-cookie-banner {
          position: fixed;
          bottom: 24px;
          left: 24px;
          max-width: 480px;
          width: calc(100% - 48px);
          background: #ffffff;
          border-radius: 16px;
          padding: 22px 24px 20px;
          box-shadow: 0 16px 40px -10px rgba(0, 31, 63, 0.18), 0 0 0 1px rgba(0, 31, 63, 0.08);
          z-index: 999999;
          font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          animation: bmCookieSlideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          box-sizing: border-box;
        }

        @keyframes bmCookieSlideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .bm-cookie-close-btn {
          position: absolute;
          top: 14px;
          right: 14px;
          background: transparent;
          border: none;
          color: #64748b;
          cursor: pointer;
          padding: 6px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .bm-cookie-close-btn:hover {
          background: #f1f5f9;
          color: #0f172a;
        }

        .bm-cookie-text {
          font-size: 14px;
          line-height: 1.55;
          color: #334155;
          margin: 0 0 18px 0;
          padding-right: 28px;
        }

        .bm-cookie-text strong {
          color: #0f172a;
          font-weight: 700;
        }

        .bm-cookie-link {
          color: #2563eb;
          text-decoration: underline;
          text-underline-offset: 3px;
          font-weight: 600;
          transition: color 0.2s;
        }

        .bm-cookie-link:hover {
          color: #1d4ed8;
        }

        .bm-cookie-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .bm-cookie-btn {
          flex: 1;
          padding: 12px 18px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: center;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-family: inherit;
        }

        .bm-cookie-btn-customize {
          background: #ffffff;
          border: 1.5px solid #cbd5e1;
          color: #2563eb;
        }

        .bm-cookie-btn-customize:hover {
          background: #f8fafc;
          border-color: #94a3b8;
          color: #1d4ed8;
        }

        .bm-cookie-btn-accept {
          background: #1d4ed8;
          border: 1.5px solid #1d4ed8;
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(29, 78, 216, 0.25);
        }

        .bm-cookie-btn-accept:hover {
          background: #1e40af;
          border-color: #1e40af;
          box-shadow: 0 6px 16px rgba(29, 78, 216, 0.35);
        }

        /* CUSTOMIZE MODAL */
        .bm-cookie-modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.55);
          backdrop-filter: blur(4px);
          z-index: 1000000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }

        .bm-cookie-modal {
          background: #ffffff;
          border-radius: 18px;
          width: 100%;
          max-width: 520px;
          max-height: 90vh;
          overflow-y: auto;
          padding: 24px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          box-sizing: border-box;
          animation: bmCookieModalIn 0.25s ease-out;
        }

        @keyframes bmCookieModalIn {
          from {
            opacity: 0;
            transform: scale(0.96);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .bm-cookie-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .bm-cookie-modal-header h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 700;
          color: #0f172a;
        }

        .bm-cookie-modal-close {
          background: transparent;
          border: none;
          font-size: 18px;
          color: #64748b;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 6px;
        }

        .bm-cookie-modal-close:hover {
          background: #f1f5f9;
          color: #0f172a;
        }

        .bm-cookie-modal-desc {
          font-size: 13.5px;
          color: #64748b;
          line-height: 1.5;
          margin: 0 0 20px 0;
        }

        .bm-cookie-options {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 24px;
        }

        .bm-cookie-option {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          gap: 16px;
        }

        .bm-cookie-option-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex: 1;
        }

        .bm-cookie-option-info strong {
          font-size: 14px;
          color: #0f172a;
        }

        .bm-cookie-option-info span {
          font-size: 12px;
          color: #64748b;
          line-height: 1.4;
        }

        .bm-cookie-badge-always {
          font-size: 11px;
          font-weight: 700;
          color: #166534;
          background: #dcfce7;
          padding: 4px 10px;
          border-radius: 20px;
          white-space: nowrap;
        }

        /* SWITCH TOGGLE */
        .bm-cookie-switch {
          position: relative;
          display: inline-block;
          width: 44px;
          height: 24px;
          flex-shrink: 0;
        }

        .bm-cookie-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .bm-cookie-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #cbd5e1;
          transition: 0.25s;
          border-radius: 24px;
        }

        .bm-cookie-slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: 0.25s;
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
        }

        .bm-cookie-switch input:checked + .bm-cookie-slider {
          background-color: #1d4ed8;
        }

        .bm-cookie-switch input:checked + .bm-cookie-slider:before {
          transform: translateX(20px);
        }

        .bm-cookie-modal-footer {
          display: flex;
          gap: 12px;
        }

        @media (max-width: 640px) {
          .bm-cookie-banner {
            bottom: 16px;
            left: 14px;
            right: 14px;
            width: auto;
            max-width: 100%;
            padding: 18px 18px 16px;
          }

          .bm-cookie-text {
            font-size: 13px;
            margin-bottom: 14px;
          }

          .bm-cookie-actions {
            flex-direction: column;
            gap: 8px;
          }

          .bm-cookie-btn {
            width: 100%;
            padding: 11px 16px;
            font-size: 13.5px;
          }

          .bm-cookie-modal {
            padding: 18px;
          }

          .bm-cookie-modal-footer {
            flex-direction: column;
          }
        }
      `}</style>
    </>
  );
}
