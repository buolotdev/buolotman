"use client";

import { useEffect } from "react";

export default function IconifyLoader() {
  useEffect(() => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-iconify-loader="true"]'
    );
    if (existing) return;

    const script = document.createElement("script");
    script.src =
      "https://code.iconify.design/iconify-icon/3.0.0/iconify-icon.min.js";
    script.async = true;
    script.dataset.iconifyLoader = "true";
    document.head.appendChild(script);
  }, []);

  return null;
}
