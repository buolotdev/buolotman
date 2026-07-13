"use client";

import { useEffect, useState } from "react";
import styles from "./PageTransition.module.css";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  return (
    <div className={`${styles.wrapper} ${visible ? styles.visible : ""}`}>
      {children}
    </div>
  );
}
