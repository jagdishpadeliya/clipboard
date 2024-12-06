"use client";

import { useState } from "react";
import { ClipboardEntry } from "@/hooks/use-clipboard-store";
import { ClipboardForm } from "./clipboard-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Copy, Pencil, Trash } from "lucide-react";
import { toast } from "sonner";

interface ClipboardListProps {
  entries: ClipboardEntry[];
  onUpdate: (id: string, text: string) => void;
  onDelete: (id: string) => void;
}

export function ClipboardList({
  entries,
  onUpdate,
  onDelete,
}: ClipboardListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const handleUpdate = (id: string, text: string) => {
    onUpdate(id, text);
    setEditingId(null);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4">
      {entries.map((entry) => (
        <Card key={entry.id} className="flex flex-col">
          <CardContent className="flex-grow p-4">
            {editingId === entry.id ? (
              <ClipboardForm
                onSubmit={(text) => handleUpdate(entry.id, text)}
                initialValue={entry.text}
              />
            ) : (
              <p className="whitespace-pre-wrap">{entry.text}</p>
            )}
          </CardContent>
          <CardFooter className="flex justify-between p-2">
            <div className="text-xs text-muted-foreground">
              {new Date(entry.createdAt).toLocaleString()}
            </div>
            <div className="space-x-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleCopy(entry.text)}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setEditingId(entry.id)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => onDelete(entry.id)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
