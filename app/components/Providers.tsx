"use client";

import { ToastProvider } from "./Toast";
import { DialogProvider } from "./Dialog";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { LocationProvider } from "@/app/context/LocationContext";

const GOOGLE_CLIENT_ID = "1090108678391-00u5aomsoh2gu7rqk2vnfldt9cs4fovq.apps.googleusercontent.com";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <LocationProvider>
        <DialogProvider>
          <ToastProvider>{children}</ToastProvider>
        </DialogProvider>
      </LocationProvider>
    </GoogleOAuthProvider>
  );
}
