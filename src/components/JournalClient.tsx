"use client";

import { useState, useCallback, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { upsertJournalEntryAction } from "@/lib/journalActions";
import { Save, CheckCircle2, RefreshCcw } from "lucide-react";
import { toast } from "sonner";

export function JournalClient({ 
  initialContent = "", 
  dateStr, 
  hideTitle = false 
}: { 
  initialContent?: string, 
  dateStr?: string, 
  hideTitle?: boolean 
}) {
  const [content, setContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    setHasUnsavedChanges(content !== initialContent);
  }, [content, initialContent]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await upsertJournalEntryAction(content, dateStr);
      setHasUnsavedChanges(false);
      toast.success("Nota guardada en el diario.");
    } catch (err) {
      toast.error("Error al guardar la nota.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={`bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 shadow-sm relative group transition-all hover:border-zinc-700/50 ${hideTitle ? 'p-2 border-0 bg-transparent' : ''}`}>
      {!hideTitle && (
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-black text-zinc-500 tracking-[0.2em] uppercase">Registro del Día</h3>
          <div className="flex items-center space-x-2">
             {hasUnsavedChanges && <span className="text-[10px] font-bold text-amber-500 uppercase flex items-center animate-pulse"><RefreshCcw className="w-3 h-3 mr-1" /> Sin guardar</span>}
             {!hasUnsavedChanges && initialContent && <span className="text-[10px] font-bold text-emerald-500 uppercase flex items-center"><CheckCircle2 className="w-3 h-3 mr-1" /> Sincronizado</span>}
          </div>
        </div>
      )}
      
      <div className="relative">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="¿Qué estás pensando? Escribe tus hallazgos técnicos o reflexiones personales..."
          className="min-h-[200px] bg-zinc-950 border-zinc-800 focus:border-purple-600/50 resize-none text-zinc-100 rounded-2xl p-6 text-lg md:text-xl leading-relaxed placeholder:text-zinc-700 transition-all font-medium"
        />
        
        <div className="flex justify-end mt-4">
          <button
            onClick={handleSave}
            disabled={isSaving || !hasUnsavedChanges}
            className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-95 ${
              hasUnsavedChanges 
                ? "bg-purple-600 text-white shadow-[0_10px_20px_rgba(147,51,234,0.3)] hover:bg-purple-500" 
                : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
            }`}
          >
            {isSaving ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{isSaving ? "Guardando..." : "Guardar Registro"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
