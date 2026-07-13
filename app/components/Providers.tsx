"use client";

import { ToastProvider } from "./Toast";
import { DialogProvider } from "./Dialog";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <DialogProvider>
      <ToastProvider>{children}</ToastProvider>
    </DialogProvider>
  );
}
