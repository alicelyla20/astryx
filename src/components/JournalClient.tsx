"use client";

import { useState, useCallback, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { upsertJournalEntryAction } from "@/lib/journalActions";

export function JournalClient({ initialContent = "", dateStr, hideTitle = false }: { initialContent?: string, dateStr?: string, hideTitle?: boolean }) {
  const [content, setContent] = useState(initialContent);
  const [savedContent, setSavedContent] = useState(initialContent);

  const saveContent = useCallback(async (newContent: string) => {
    await upsertJournalEntryAction(newContent, dateStr);
    setSavedContent(newContent);
  }, [dateStr]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (content !== savedContent) {
        saveContent(content);
      }
    }, 1000);
    return () => clearTimeout(handler);
  }, [content, savedContent, saveContent]);

  return (
    <div className={`bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 shadow-sm relative ${hideTitle ? 'p-2 border-0 bg-transparent' : ''}`}>
      {!hideTitle && <h3 className="text-sm font-bold text-zinc-400 mb-3 tracking-wide uppercase">Registro Libre</h3>}
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Despeja tu mente aquí..."
        className="min-h-[150px] bg-zinc-950 border-zinc-800 resize-none text-zinc-200"
      />
      {content !== savedContent && (
        <span className="absolute top-4 right-4 text-[10px] uppercase text-zinc-500 animate-pulse">Guardando...</span>
      )}
    </div>
  );
}
