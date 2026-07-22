"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type ExtendedFile = File & { kind: "image" | "pdf" };

interface TaskDraftContextType {
  files: ExtendedFile[];
  setFiles: React.Dispatch<React.SetStateAction<ExtendedFile[]>>;
}

const TaskDraftContext = createContext<TaskDraftContextType | undefined>(undefined);

export function TaskDraftProvider({ children }: { children: ReactNode }) {
  const [files, setFiles] = useState<ExtendedFile[]>([]);
  
  return (
    <TaskDraftContext.Provider value={{ files, setFiles }}>
      {children}
    </TaskDraftContext.Provider>
  );
}

export function useTaskDraft() {
  const context = useContext(TaskDraftContext);
  if (context === undefined) {
    throw new Error("useTaskDraft must be used within a TaskDraftProvider");
  }
  return context;
}
