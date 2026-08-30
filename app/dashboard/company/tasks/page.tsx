"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import styles from "../page.module.css";
import LogoutButton from "@/app/components/LogoutButton";
import TaskBoard from "@/app/components/TaskBoard";

const translations: Record<string, Record<string, string>> = {
  en: {
    browseTasks: "Browse Tasks",
    browseTasksSub: "Find tasks and projects to apply your company services to.",
  },
  fr: {
    browseTasks: "Consulter les Offres de Mission",
    browseTasksSub: "Trouvez des missions et des projets pour proposer les services de votre entreprise.",
  }
};

export default function CompanyTasksPage() {
  const pathname = usePathname();
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

  return (
    <>
      <div className={styles.content}>
        <div className={styles.pageHeader} style={{ marginBottom: "20px" }}>
          <div className={styles.headerTitles}>
            <h1>{t.browseTasks}</h1>
            <p>{t.browseTasksSub}</p>
          </div>
        </div>
        
        <TaskBoard />
      </div>
    </>
  );
}
