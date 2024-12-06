import { useState, useEffect } from "react";
import { toast } from "sonner";

export interface ClipboardEntry {
  id: string;
  text: string;
  createdAt: number;
}

const DEFAULT_ENTRIES = [
  {
    id: "1",
    text: "This is a default entry",
    createdAt: Date.now(),
  },
  {
    id: "2",
    text: "This is another default entry",
    createdAt: Date.now(),
  },
];

export function useClipboardStore() {
  const [entries, setEntries] = useState<ClipboardEntry[]>([]);

  useEffect(() => {
    const storedEntries = localStorage.getItem("clipboardEntries");
    const defaultsAdded = localStorage.getItem("clipboardDefaultsAdded");
    if (storedEntries) {
      setEntries(JSON.parse(storedEntries));
    } else if (!defaultsAdded) {
      setEntries(DEFAULT_ENTRIES);
      localStorage.setItem("clipboardEntries", JSON.stringify(DEFAULT_ENTRIES));
      localStorage.setItem("clipboardDefaultsAdded", "true");
    }
  }, []);

  const saveEntries = (newEntries: ClipboardEntry[]) => {
    setEntries(newEntries);
    localStorage.setItem("clipboardEntries", JSON.stringify(newEntries));
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
  };
}
