"use client";

import { useState, useTransition } from "react";
import { updateChainAction } from "@/lib/mapaActions";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export function EditChainDialog({ chain, categoryId, open, onOpenChange }: any) {
  const [name, setName] = useState(chain.name);
  const [type, setType] = useState(chain.type || "SKILL");
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    startTransition(async () => {
      const res = await updateChainAction(chain.id, categoryId, name, type);
      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success("Cadena actualizada");
        onOpenChange(false);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-950 border-zinc-800 text-zinc-50 rounded-3xl max-w-[90vw] md:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Editar Cadena</DialogTitle>
          <DialogDescription>Ajusta el nombre o el tipo de cadena.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <label className="text-[10px] uppercase text-zinc-500 font-bold mb-1 block">Nombre</label>
            <input 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="Ej. Lectura"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase text-zinc-500 font-bold mb-1 block">Tipo de Cadena</label>
            <select 
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 appearance-none"
            >
              <option value="SKILL">Habilidad</option>
              <option value="ROUTINE">Rutina</option>
            </select>
          </div>
          <button
            onClick={handleSave}
            disabled={isPending || !name.trim()}
            className="w-full bg-purple-600 hover:bg-purple-500 text-white font-black py-3 rounded-xl transition-all shadow-md disabled:opacity-50 mt-2"
          >
            {isPending ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
