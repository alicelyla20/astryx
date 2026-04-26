"use client";
import { useState } from "react";
import { upsertJournalEntryAction } from "@/lib/journalActions";
import { Plus } from "lucide-react";

export function AddJournalEntry() {
  const [dateStr, setDateStr] = useState("");
  const [isPending, setIsPending] = useState(false);

  const handleAdd = async () => {
    if (!dateStr) return;
    setIsPending(true);
    // Creates an empty record or fetches existing
    await upsertJournalEntryAction("", dateStr);
    setIsPending(false);
    setDateStr("");
  };

  return (
    <div className="bg-zinc-900/40 p-3 rounded-2xl border border-zinc-800/80 mb-6">
      <span className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2 pl-1 italic">Abrir bitácora de fecha específica</span>
      <div className="flex items-center gap-2 w-full">
        <input 
          type="date"
          value={dateStr}
          onChange={(e) => setDateStr(e.target.value)}
          className="bg-zinc-950 border border-zinc-800 text-zinc-100 rounded-xl px-3 py-3 w-full flex-1 outline-none focus:border-purple-500 transition-colors"
        />
        <button 
          onClick={handleAdd}
          disabled={isPending || !dateStr}
          className="bg-purple-600 hover:bg-purple-500 text-white w-12 h-12 shrink-0 flex items-center justify-center rounded-xl transition-all disabled:opacity-50 active:scale-95 shadow-lg"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
