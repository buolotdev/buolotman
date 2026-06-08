"use client";

import { useEffect } from "react";

export default function SuppressHydrationWarnings() {
  useEffect(() => {
    const originalError = console.error;
    console.error = (...args) => {
      const msg = typeof args[0] === "string" ? args[0] : "";
      
      // Check for common hydration error phrases or the specific extension attribute
      if (
        msg.includes("Hydration failed") ||
        msg.includes("There was an error while hydrating") ||
        msg.includes("bis_skin_checked") ||
        msg.includes("Text content did not match")
      ) {
        return; // Suppress it!
      }
      
      // Otherwise, log the error normally
      originalError.apply(console, args);
    };

    // Also suppress window errors related to hydration if they bubble up
    const handleWindowError = (e: ErrorEvent) => {
      if (
        e.message.includes("Hydration failed") ||
        e.message.includes("bis_skin_checked")
      ) {
        e.preventDefault(); // Stop it from printing to the console/overlay
      }
    };
    
    window.addEventListener("error", handleWindowError);
    
    return () => {
      console.error = originalError;
      window.removeEventListener("error", handleWindowError);
    };
  }, []);

  return null;
}
