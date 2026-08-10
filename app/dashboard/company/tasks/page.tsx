"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import styles from "../page.module.css";
import LogoutButton from "@/app/components/LogoutButton";

import TaskBoard from "@/app/components/TaskBoard";

export default function CompanyTasksPage() {
  
  const pathname = usePathname();

  

  return (
    <>

        <div className={styles.content}>
          <div className={styles.pageHeader} style={{ marginBottom: "20px" }}>
            <div className={styles.headerTitles}>
              <h1>Browse Tasks</h1>
              <p>Find tasks and projects to apply your company services to.</p>
            </div>
          </div>
          
          <TaskBoard />
        </div>
      
    </>
  );
}
