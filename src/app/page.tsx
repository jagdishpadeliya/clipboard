"use client";

import { useState } from "react";
import { ClipboardForm } from "@/components/clipboard-form";
import { ClipboardList } from "@/components/clipboard-list";
import { SearchBar } from "@/components/search-bar";
import { useClipboardStore } from "../hooks/use-clipboard-store";

export default function Home() {
  const { entries, addEntry, updateEntry, deleteEntry } = useClipboardStore();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEntries = entries.filter((entry) =>
    entry.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl h-screen flex flex-col">
      <h1 className="text-3xl font-bold mb-6">Permanent Clipboard</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-grow overflow-hidden">
        <div className="lg:col-span-1 flex flex-col">
          <ClipboardForm onSubmit={addEntry} />
        </div>
        <div className="lg:col-span-2 flex flex-col overflow-hidden">
          <SearchBar onSearch={setSearchTerm} />
          <div className="flex-grow overflow-y-auto">
            <ClipboardList
              entries={filteredEntries}
              onUpdate={updateEntry}
              onDelete={deleteEntry}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
