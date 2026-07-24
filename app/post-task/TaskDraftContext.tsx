"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { saveFilesToDB, getFilesFromDB } from "./idb";

export type ExtendedFile = {
  name: string;
  size: number;
  sizeFormatted: string;
  kind: "image" | "pdf";
  type: string;
  base64: string;
};

interface TaskDraftContextType {
  files: ExtendedFile[];
  setFiles: React.Dispatch<React.SetStateAction<ExtendedFile[]>>;
}

const TaskDraftContext = createContext<TaskDraftContextType | undefined>(undefined);

export function TaskDraftProvider({ children }: { children: ReactNode }) {
  const [files, setFiles] = useState<ExtendedFile[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getFilesFromDB().then((storedFiles) => {
      setFiles(storedFiles as unknown as ExtendedFile[]);
      setLoaded(true);
    }).catch(console.error);
  }, []);

  useEffect(() => {
    if (loaded) {
      saveFilesToDB(files as unknown as File[]).catch(console.error);
    }
  }, [files, loaded]);

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
