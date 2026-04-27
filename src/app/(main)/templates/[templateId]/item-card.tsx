"use client";

import { useState, useTransition } from "react";
import { Trash2, Edit2, Zap } from "lucide-react";
import { deleteTemplateItemAction, updateTemplateItemAction } from "@/lib/templateActions";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select";
import { toast } from "sonner";
import { TemplateItem, TaskType, EnergyLevel } from "@prisma/client";
import { SearchableSelect } from "@/components/searchable-select";
import { energyLevelMap, taskTypeMap } from "@/lib/translations";

interface Props {
  item: TemplateItem & {
    chain: {
      name: string;
      category: {
        name: string;
        colorHex: string;
      }
    }
  };
  templateId: string;
  categories: any[];
}

export function TemplateItemCard({ item, templateId, categories }: Props) {
  const [isPending, startTransition] = useTransition();
  const [openEdit, setOpenEdit] = useState(false);

  const [title, setTitle] = useState(item.title);
  const [type, setType] = useState<TaskType>(item.type);
  const [energyLevel, setEnergyLevel] = useState<EnergyLevel>(item.energyLevel);
  const [chainId, setChainId] = useState(item.chainId);

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !chainId) return;

    startTransition(async () => {
      try {
        await updateTemplateItemAction(item.id, templateId, { title, type, energyLevel, chainId });
        toast.success("Misión actualizada.");
        setOpenEdit(false);
      } catch (err) {
        toast.error("Error al actualizar la misión.");
      }
    });
  };

  const handleDelete = () => {
    if (!confirm("¿Eliminar esta misión de la plantilla?")) return;
    
    startTransition(async () => {
      try {
        await deleteTemplateItemAction(item.id, templateId);
        toast.success("Misión eliminada.");
      } catch (err) {
        toast.error("Error al eliminar la misión.");
      }
    });
  };

  const energyColors = {
    LOW: "text-green-400 bg-green-400/10",
    MEDIUM: "text-yellow-400 bg-yellow-400/10",
    HIGH: "text-red-400 bg-red-400/10"
  };

  return (
    <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-5 flex items-center justify-between group transition-all hover:bg-zinc-800/30">
      <div className="flex-1 min-w-0 pr-4">
        <div className="flex items-center space-x-3 mb-1">
          <h4 className="text-lg font-bold text-zinc-100 truncate">{item.title}</h4>
          <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${item.type === TaskType.ROUTINE ? 'bg-blue-500/10 text-blue-400' : 'bg-orange-500/10 text-orange-400'}`}>
            {taskTypeMap[item.type]}
          </span>
          <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full flex items-center ${energyColors[item.energyLevel]}`}>
            <Zap className="w-3 h-3 mr-1" />
            {energyLevelMap[item.energyLevel]}
          </span>
        </div>
        
        <div className="flex items-center space-x-2 mt-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{item.chain.name}</span>
          <span className="w-1 h-1 rounded-full bg-zinc-700" />
          <span 
            className="text-[10px] font-black uppercase tracking-widest drop-shadow-sm"
            style={{ color: item.chain.category.colorHex }}
          >
            {item.chain.category.name}
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={() => setOpenEdit(true)}
          className="w-10 h-10 rounded-full bg-zinc-800 text-zinc-400 hover:bg-purple-600/20 hover:text-purple-400 flex items-center justify-center transition-all disabled:opacity-50"
        >
          <Edit2 className="w-4 h-4" />
        </button>  
        <button 
          onClick={handleDelete}
          disabled={isPending}
          className="w-10 h-10 rounded-full bg-red-900/20 text-red-400 hover:bg-red-900/40 hover:text-red-300 flex items-center justify-center transition-all disabled:opacity-50"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="bg-zinc-950 border-zinc-800 text-zinc-50 rounded-3xl max-w-md max-h-[85dvh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Misión</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4 mt-2">
            <div className="space-y-2">
              <label className="text-zinc-500 text-[10px] uppercase font-black tracking-widest pl-1">Título</label>
              <input 
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
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
              <label className="text-zinc-500 text-[10px] uppercase font-black tracking-widest pl-1">Energía</label>
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
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl shadow-md mt-4"
            >
              {isPending ? "Guardando..." : "Guardar Cambios"}
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
