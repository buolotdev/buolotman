import React from "react";
import { TaskDraftProvider } from "./TaskDraftContext";

export default function PostTaskLayout({ children }: { children: React.ReactNode }) {
  return (
    <TaskDraftProvider>
      {children}
    </TaskDraftProvider>
  );
}
