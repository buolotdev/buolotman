export async function saveFilesToDB(files: File[]): Promise<void> {
  if (typeof window === "undefined" || !window.indexedDB) return;
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("TaskDraftDB", 1);
    request.onupgradeneeded = (e: any) => {
      if (!e.target.result.objectStoreNames.contains("files")) {
        e.target.result.createObjectStore("files");
      }
    };
    request.onsuccess = (e: any) => {
      const db = e.target.result;
      const tx = db.transaction("files", "readwrite");
      const store = tx.objectStore("files");
      store.put(files, "draftFiles");
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    };
    request.onerror = () => reject(request.error);
  });
}

export async function getFilesFromDB(): Promise<File[]> {
  if (typeof window === "undefined" || !window.indexedDB) return [];
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("TaskDraftDB", 1);
    request.onupgradeneeded = (e: any) => {
      if (!e.target.result.objectStoreNames.contains("files")) {
        e.target.result.createObjectStore("files");
      }
    };
    request.onsuccess = (e: any) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains("files")) {
        resolve([]);
        return;
      }
      const tx = db.transaction("files", "readonly");
      const store = tx.objectStore("files");
      const getReq = store.get("draftFiles");
      getReq.onsuccess = () => resolve(getReq.result || []);
      getReq.onerror = () => reject(getReq.error);
    };
    request.onerror = () => reject(request.error);
  });
}

export async function clearFilesFromDB(): Promise<void> {
  if (typeof window === "undefined" || !window.indexedDB) return;
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("TaskDraftDB", 1);
    request.onsuccess = (e: any) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains("files")) {
        resolve();
        return;
      }
      const tx = db.transaction("files", "readwrite");
      const store = tx.objectStore("files");
      store.delete("draftFiles");
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    };
    request.onerror = () => reject(request.error);
  });
}
