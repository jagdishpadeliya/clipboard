import { useState, useEffect } from "react";
import { toast } from "sonner";
import CryptoJS from "crypto-js";

export interface ClipboardEntry {
  id: string;
  text: string;
  createdAt: number;
}

const DEFAULT_ENTRIES = [
  {
    id: "default-1",
    text: "This is a default entry",
    createdAt: Date.now(),
  },
  {
    id: "default-2",
    text: "This is another default entry",
    createdAt: Date.now(),
  },
];

const ENCRYPTION_KEY = "encryption";

export function useClipboardStore() {
  const [entries, setEntries] = useState<ClipboardEntry[]>([]);
  const [userKey, setUserKey] = useState<string | null>(null);

  const generateUserKey = () => {
    return CryptoJS.lib.WordArray.random(256 / 8).toString();
  };

  const getUserKey = () => {
    const storedKey = localStorage.getItem("clipboardUserKey");
    if (storedKey) {
      return storedKey;
    } else {
      const newUserKey = generateUserKey();
      localStorage.setItem("clipboardUserKey", newUserKey);
      return newUserKey;
    }
  };

  useEffect(() => {
    setUserKey(getUserKey());
  }, []);

  const encrypt = (text: string) => {
    if (!userKey) return text;
    return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
  };

  const decrypt = (cipherText: string) => {
    if (!userKey) return cipherText;
    try {
      const bytes = CryptoJS.AES.decrypt(cipherText, ENCRYPTION_KEY);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.log("Error decrypting text", error);
      return "*** Error decrypting text ***";
    }
  };

  useEffect(() => {
    const storedEntries = localStorage.getItem("clipboardEntries");
    const defaultsAdded = localStorage.getItem("clipboardDefaultsAdded");
    if (storedEntries) {
      const encryptedEntries = JSON.parse(storedEntries);
      const decryptedEntries = encryptedEntries.map(
        (entry: ClipboardEntry) => ({
          ...entry,
          text: decrypt(entry.text),
        })
      );
      setEntries(decryptedEntries);
    } else if (!defaultsAdded) {
      setEntries(DEFAULT_ENTRIES);
      localStorage.setItem("clipboardEntries", JSON.stringify(DEFAULT_ENTRIES));
      localStorage.setItem("clipboardDefaultsAdded", "true");
    }
  }, []);

  const saveEntries = (newEntries: ClipboardEntry[]) => {
    if (!userKey) {
      toast.error("User key not found, please refresh the page");
      return;
    }
    const encryptedEntries = newEntries.map((entry) => ({
      ...entry,
      text: encrypt(entry.text),
    }));
    setEntries(newEntries);
    localStorage.setItem("clipboardEntries", JSON.stringify(encryptedEntries));
  };

  const addEntry = (text: string) => {
    const newEntry: ClipboardEntry = {
      id: Date.now().toString(),
      text,
      createdAt: Date.now(),
    };
    saveEntries([newEntry, ...entries]);
    toast.success("Entry added");
  };

  const updateEntry = (id: string, text: string) => {
    const updatedEntries = entries.map((entry) =>
      entry.id === id ? { ...entry, text } : entry
    );
    saveEntries(updatedEntries);
    toast.success("Entry updated");
  };

  const deleteEntry = (id: string) => {
    const filteredEntries = entries.filter((entry) => entry.id !== id);
    saveEntries(filteredEntries);
    toast.success("Entry deleted");
  };

  return {
    entries,
    addEntry,
    updateEntry,
    deleteEntry,
    isReady: !!userKey,
  };
}
