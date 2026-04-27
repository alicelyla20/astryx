"use client";

import { useActionState, useState, useEffect } from "react";
import { Plus, ListTodo, Activity, RefreshCcw, Binary } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllCategoriesWithChainsAction } from "@/lib/mapaActions";
import { createTaskAction } from "@/lib/dailyLogActions";
import { toast } from "sonner";
import { TaskType, EnergyLevel } from "@prisma/client";
import { SearchableSelect } from "@/components/searchable-select";
import { energyLevelMap, taskTypeMap } from "@/lib/translations";

export function CreateTaskDialog({ preselectedCategoryId, trigger }: { preselectedCategoryId?: string, trigger?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [taskType, setTaskType] = useState<string>(TaskType.TECHNICAL);
  const [energyLevel, setEnergyLevel] = useState<string>(EnergyLevel.MEDIUM);
  const [selectedChainId, setSelectedChainId] = useState<string>("");

  useEffect(() => {
    if (!open) {
      setTaskType(TaskType.TECHNICAL);
      setEnergyLevel(EnergyLevel.MEDIUM);
      setSelectedChainId("");
    }
  }, [open]);

  useEffect(() => {
    if (open && !categoriesLoaded) {
      getAllCategoriesWithChainsAction().then(data => {
        setCategories(data);
        setCategoriesLoaded(true);
      });
    }
  }, [open, categoriesLoaded]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      const result = await createTaskAction({}, formData);
      if (result.success) {
        toast.success("Misión añadida al mapa de hoy.");
        setOpen(false);
      } else {
        toast.error(result.error);
      }
    } catch (err) {
      toast.error("Error al crear la tarea.");
    } finally {
      setIsPending(false);
    }
  };

  const allChains = categories.flatMap(cat => 
    cat.chains.map((chain: any) => ({
      ...chain,
      categoryId: cat.id,
      categoryName: cat.name
    }))
  );

  const displayChains = preselectedCategoryId 
    ? allChains.filter(c => c.categoryId === preselectedCategoryId)
    : allChains;

  const searchableChainOptions = displayChains.map((chain: any) => ({
    value: chain.id,
    label: preselectedCategoryId ? chain.name : `${chain.name} (${chain.categoryName})`
  }));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? (
        <DialogTrigger nativeButton={false} render={trigger as React.ReactElement} />
      ) : (
        <DialogTrigger render={
          <div className="cursor-pointer w-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 py-4 rounded-2xl flex items-center justify-center space-x-2 transition-all active:scale-[0.98] font-bold shadow-sm">
            <Plus className="w-4 h-4 text-purple-500" />
            <span>Planificar Nueva Misión</span>
          </div>
        } />
      )}
      
      <DialogContent className="bg-zinc-950 border-zinc-800 text-zinc-50 max-w-[calc(100%-2rem)] md:max-w-[450px] w-full rounded-[2rem] p-8 pb-32 shadow-2xl overflow-y-auto max-h-[85dvh]">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-2xl font-black tracking-tight flex items-center">
            <ListTodo className="mr-3 text-purple-500" />
            Nueva Misión
          </DialogTitle>
          <DialogDescription className="text-zinc-500 font-medium">
            Toda tarea de hoy debe ser un eslabón de una cadena existente.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label className="text-zinc-500 text-[10px] uppercase font-black tracking-widest pl-1">Título de la Misión</Label>
            <Input
              name="title"
              placeholder="Ej: Acomodar la habitación, 30 min de estiramiento..."
              required
              className="bg-zinc-900 border-zinc-800 text-zinc-100 h-14 rounded-2xl px-5 text-lg placeholder:text-zinc-700"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-zinc-500 text-[10px] uppercase font-black tracking-widest pl-1">Tipo</Label>
              <Select name="type" value={taskType} onValueChange={(val) => setTaskType(val || TaskType.TECHNICAL)}>
                <SelectTrigger className="bg-zinc-900 border-zinc-800 text-zinc-100 h-12 rounded-xl">
                  <span className="font-bold">{taskTypeMap[taskType as keyof typeof taskTypeMap]}</span>
                </SelectTrigger>
                <SelectContent className="bg-zinc-950 border-zinc-800 text-zinc-50">
                  <SelectItem value={TaskType.TECHNICAL}>{taskTypeMap.TECHNICAL}</SelectItem>
                  <SelectItem value={TaskType.ROUTINE}>{taskTypeMap.ROUTINE}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-zinc-500 text-[10px] uppercase font-black tracking-widest pl-1">Energía</Label>
              <Select name="energyLevel" value={energyLevel} onValueChange={(val) => setEnergyLevel(val || EnergyLevel.MEDIUM)}>
                <SelectTrigger className="bg-zinc-900 border-zinc-800 text-zinc-100 h-12 rounded-xl">
                  <span className="font-bold">{energyLevelMap[energyLevel as keyof typeof energyLevelMap]}</span>
                </SelectTrigger>
                <SelectContent className="bg-zinc-950 border-zinc-800 text-zinc-50">
                  <SelectItem value={EnergyLevel.LOW}>{energyLevelMap.LOW}</SelectItem>
                  <SelectItem value={EnergyLevel.MEDIUM}>{energyLevelMap.MEDIUM}</SelectItem>
                  <SelectItem value={EnergyLevel.HIGH}>{energyLevelMap.HIGH}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-zinc-500 text-[10px] uppercase font-black tracking-widest pl-1">Cadena Origen</Label>
            <SearchableSelect 
              name="chainId"
              options={searchableChainOptions}
              value={selectedChainId}
              onSelect={setSelectedChainId}
              placeholder="Buscar por nombre de cadena..."
              triggerPlaceholder="Seleccionar cadena de origen"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-zinc-50 hover:bg-white text-zinc-950 font-black py-4 rounded-2xl transition-all shadow-xl disabled:opacity-50 flex justify-center items-center h-14 text-lg uppercase tracking-widest active:scale-[0.98]"
          >
            {isPending ? "Agregando..." : "Planificar"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
