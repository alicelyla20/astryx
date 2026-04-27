"use client";

import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
import { createTemplateItemAction } from "@/lib/templateActions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select";
import { TaskType, EnergyLevel } from "@prisma/client";
import { toast } from "sonner";
import { SearchableSelect } from "@/components/searchable-select";
import { energyLevelMap, taskTypeMap } from "@/lib/translations";

interface Props {
  templateId: string;
  categories: any[];
}

export function CreateItemDialog({ templateId, categories }: Props) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState("");
  const [type, setType] = useState<TaskType>(TaskType.ROUTINE);
  const [energyLevel, setEnergyLevel] = useState<EnergyLevel>(EnergyLevel.MEDIUM);
  const [chainId, setChainId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !chainId) {
      toast.error("El nombre y la cadena son obligatorios.");
      return;
    }

    startTransition(async () => {
      try {
        await createTemplateItemAction(templateId, title, type, energyLevel, chainId);
        toast.success("Misión añadida a la plantilla.");
        setOpen(false);
        setTitle("");
        setChainId("");
      } catch (err) {
        toast.error("Error al añadir la misión.");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger 
        render={
          <button className="w-full lg:w-auto bg-purple-600 hover:bg-purple-700 active:scale-95 transition-all text-white font-bold py-3 px-6 rounded-2xl flex items-center justify-center space-x-2 shadow-lg">
            <Plus className="w-5 h-5" />
            <span>Añadir Misión a la Plantilla</span>
          </button>
        }
      />
      <DialogContent className="bg-zinc-950 border-zinc-800 text-zinc-50 rounded-3xl max-h-[90vh] overflow-y-auto w-full max-w-md">
        <DialogHeader>
          <DialogTitle>Nueva Misión de Plantilla</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-zinc-500 text-[10px] uppercase font-black tracking-widest pl-1">Misión</label>
            <input 
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Meditar 10 mins"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-zinc-500 text-[10px] uppercase font-black tracking-widest pl-1">Tipo</label>
            <Select value={type} onValueChange={(val) => setType(val as TaskType)}>
              <SelectTrigger className="bg-zinc-900 border-zinc-800 text-zinc-100 h-12 rounded-xl px-4">
                <span className="font-bold">{taskTypeMap[type]}</span>
              </SelectTrigger>
              <SelectContent className="bg-zinc-950 border-zinc-800 text-zinc-100">
                <SelectItem value={TaskType.ROUTINE}>{taskTypeMap.ROUTINE}</SelectItem>
                <SelectItem value={TaskType.TECHNICAL}>{taskTypeMap.TECHNICAL}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-zinc-500 text-[10px] uppercase font-black tracking-widest pl-1">Energía Requerida</label>
            <Select value={energyLevel} onValueChange={(val) => setEnergyLevel(val as EnergyLevel)}>
              <SelectTrigger className="bg-zinc-900 border-zinc-800 text-zinc-100 h-12 rounded-xl px-4">
                <span className="font-bold">{energyLevelMap[energyLevel]}</span>
              </SelectTrigger>
              <SelectContent className="bg-zinc-950 border-zinc-800 text-zinc-100">
                <SelectItem value={EnergyLevel.LOW}>{energyLevelMap.LOW}</SelectItem>
                <SelectItem value={EnergyLevel.MEDIUM}>{energyLevelMap.MEDIUM}</SelectItem>
                <SelectItem value={EnergyLevel.HIGH}>{energyLevelMap.HIGH}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-zinc-500 text-[10px] uppercase font-black tracking-widest pl-1">Cadena Destino</label>
            <SearchableSelect 
              options={categories.flatMap(cat => cat.chains.map((c: any) => ({
                value: c.id,
                label: `${c.name} (${cat.name})`
              })))}
              value={chainId}
              onSelect={setChainId}
              placeholder="Buscar cadena..."
              triggerPlaceholder="Seleccionar cadena de destino"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl transition-all shadow-md mt-6"
          >
            {isPending ? "Añadiendo..." : "Añadir a Plantilla"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
