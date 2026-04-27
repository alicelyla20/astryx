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
import { Zap } from "lucide-react";
import { EnergyLevel } from "@prisma/client";

export function EditChainDialog({ chain, categoryId, open, onOpenChange }: any) {
  const [name, setName] = useState(chain.name);
  const [type, setType] = useState(chain.type || "SKILL");
  const [energyLevel, setEnergyLevel] = useState<EnergyLevel>(chain.energyLevel || EnergyLevel.MEDIUM);
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    startTransition(async () => {
      const res = await updateChainAction(chain.id, categoryId, name, type, energyLevel);
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
      <DialogContent className="bg-zinc-950 border-zinc-800 text-zinc-50 rounded-3xl max-w-[90vw] md:max-w-[400px] max-h-[85dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Cadena</DialogTitle>
          <DialogDescription>Ajusta el nombre, tipo o nivel de energía de la cadena.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4 pb-20">
          <div>
            <label className="text-[10px] uppercase text-zinc-500 font-bold mb-1 block tracking-widest pl-1">Nombre</label>
            <input 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-600 h-14"
              placeholder="Ej. Lectura"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase text-zinc-500 font-bold mb-1 block tracking-widest pl-1">Tipo de Cadena</label>
            <select 
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-600 appearance-none h-14"
            >
              <option value="SKILL">Habilidad</option>
              <option value="ROUTINE">Rutina</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] uppercase text-zinc-500 font-bold mb-1 block tracking-widest pl-1 italic">Nivel de Energía</label>
            <div className="relative">
              <Zap className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${energyLevel === 'HIGH' ? 'text-red-400' : energyLevel === 'LOW' ? 'text-emerald-400' : 'text-amber-400'}`} />
              <select 
                value={energyLevel}
                onChange={(e) => setEnergyLevel(e.target.value as any)}
                className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 pl-12 pr-4 h-14 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-600 appearance-none font-bold"
              >
                <option value={EnergyLevel.LOW}>Baja</option>
                <option value={EnergyLevel.MEDIUM}>Media</option>
                <option value={EnergyLevel.HIGH}>Alta</option>
              </select>
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={isPending || !name.trim()}
            className="w-full bg-zinc-50 hover:bg-white text-zinc-950 font-black py-4 rounded-2xl transition-all shadow-md disabled:opacity-50 mt-4 h-14"
          >
            {isPending ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
