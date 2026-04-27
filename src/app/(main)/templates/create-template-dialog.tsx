"use client";

import { useState, useTransition } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { createTemplateAction } from "@/lib/templateActions";
import { toast } from "sonner";

export function CreateTemplateDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    startTransition(async () => {
      try {
        await createTemplateAction(name, description);
        toast.success("Plantilla creada exitosamente.");
        setOpen(false);
        setName("");
        setDescription("");
      } catch (err: any) {
        toast.error(err.message || "Error al crear la plantilla.");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger 
        render={
          <div className="w-full bg-zinc-900 border border-zinc-800 hover:border-purple-500/50 text-zinc-300 py-4 rounded-2xl flex items-center justify-center space-x-2 transition-all active:scale-[0.98] font-bold shadow-sm cursor-pointer">
            <Plus className="w-5 h-5 text-purple-500" />
            <span>Crear Nueva Plantilla</span>
          </div>
        }
      />
      <DialogContent className="bg-zinc-950 border-zinc-800 text-zinc-50 rounded-3xl max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nueva Plantilla</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-zinc-500 text-[10px] uppercase font-black tracking-widest pl-1">Nombre</label>
            <input 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ritual de Mañana..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-zinc-500 text-[10px] uppercase font-black tracking-widest pl-1">Descripción (Opcional)</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalles sobre esta plantilla..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors resize-none h-24"
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl transition-all shadow-md mt-4"
          >
            {isPending ? "Creando..." : "Guardar Plantilla"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
