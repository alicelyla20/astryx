"use client";

import { useState, useTransition } from "react";
import { Download } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { importTemplateAction } from "@/lib/templateActions";
import { toast } from "sonner";
import { SearchableSelect } from "@/components/searchable-select";

export function ImportTemplateDialog({ templates, dateStr, trigger }: { templates: any[], dateStr?: string, trigger: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [selectedTemplateId, setSelectedTemplateId] = useState("");

  const handleImport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTemplateId) {
      toast.error("Selecciona una plantilla.");
      return;
    }

    startTransition(async () => {
      try {
        const count = await importTemplateAction(selectedTemplateId, dateStr);
        if (count && count > 0) {
          toast.success(`¡Plantilla cargada con ${count} misiones!`);
        } else {
          toast.info("La plantilla cargada no tenía misiones configuradas.");
        }
        setOpen(false);
        setSelectedTemplateId("");
      } catch (err) {
        toast.error("Error al cargar la plantilla.");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger nativeButton={false} render={trigger as React.ReactElement} />
      <DialogContent className="bg-zinc-950 border-zinc-800 text-zinc-50 rounded-3xl max-w-sm">
        <DialogHeader>
          <DialogTitle>Cargar Plantilla</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleImport} className="space-y-4 mt-2">
          {templates.length > 0 ? (
            <div className="space-y-2">
              <label className="text-zinc-500 text-[10px] uppercase font-black tracking-widest pl-1">Selecciona una plantilla</label>
              <SearchableSelect 
                options={templates.map(tpl => ({ value: tpl.id, label: tpl.name }))}
                value={selectedTemplateId}
                onSelect={setSelectedTemplateId}
                placeholder="Buscar plantilla..."
                triggerPlaceholder="Seleccionar una plantilla"
              />
            </div>
          ) : (
            <p className="text-zinc-500 text-sm text-center py-4">No hay plantillas creadas. Dirígete al menú de Plantillas para crear una antes de intentar cargar.</p>
          )}

          <button
            type="submit"
            disabled={isPending || templates.length === 0}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl transition-all shadow-md mt-4 disabled:opacity-50"
          >
            {isPending ? "Cargando..." : "Confirmar Carga"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
